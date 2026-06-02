const axios = require('axios');

const BASE_TORRE = 'https://torre.ai/api';
const BASE_SEARCH = 'https://search.torre.co';
const TORRE_PAGE_SIZE = 20;
const MAX_FILTER_PAGES = 5;

function buildSearchTerms(rawTerm) {
  const normalized = rawTerm.trim().toLowerCase();
  if (!normalized) return [];

  const terms = new Set([normalized]);
  normalized.split(/\s+/).forEach((token) => {
    if (!token) return;
    terms.add(token);
    if (token.length > 4) {
      terms.add(token.replace(/(ing|ers|er|or|ed|s)$/u, ''));
    }
  });

  if (terms.has('developer') || terms.has('develop')) {
    terms.add('development');
    terms.add('desarrollador');
    terms.add('desarrollo');
  }

  return [...terms].filter((term) => term.length >= 3);
}

function includesTerm(value, terms) {
  return typeof value === 'string' && terms.some((term) => value.toLowerCase().includes(term));
}

function fieldMatches(values, searchTerms) {
  return values.some((value) => includesTerm(value, searchTerms));
}

function scoreOpportunity(opportunity, searchTerms) {
  if (searchTerms.length === 0) return 1;

  let score = 0;
  if (fieldMatches([opportunity.objective], searchTerms)) score += 6;
  if (fieldMatches((opportunity.skills || []).map((skill) => skill.name), searchTerms)) score += 5;
  if (fieldMatches([opportunity.tagline], searchTerms)) score += 3;
  if (fieldMatches((opportunity.organizations || []).map((organization) => organization.name), searchTerms)) score += 2;
  if (fieldMatches([opportunity.type, ...(opportunity.locations || [])], searchTerms)) score += 1;

  return score;
}

function matchesPerson(person, searchTerms) {
  if (searchTerms.length === 0) return true;

  return [
    person.name,
    person.username,
    person.professionalHeadline,
    person.locationName,
    ...(person.skills || []).map((skill) => skill.name),
  ].some((value) => includesTerm(value, searchTerms));
}

async function searchEntities(criteria = {}) {
  const term = criteria.text || '';
  const searchTerms = buildSearchTerms(term);
  const response = await axios.post(
    `${BASE_SEARCH}/people/_search/?offset=0&size=${TORRE_PAGE_SIZE}&aggregate=false`,
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0',
      },
    },
  );

  const results = response.data.results || [];
  return results.filter((person) => matchesPerson(person, searchTerms)).slice(0, 20);
}

async function getGenome(username) {
  const response = await axios.get(`${BASE_TORRE}/genome/bios/${username}`);
  return response.data;
}

async function searchJobs(criteria = {}, offset = 0, limit = 10) {
  const term = criteria.text || '';
  const searchTerms = buildSearchTerms(term);
  const targetCount = offset + limit;
  const filteredResults = [];
  let upstreamTotal = 0;
  let upstreamOffset = 0;
  let pagesFetched = 0;

  while (filteredResults.length < targetCount && pagesFetched < MAX_FILTER_PAGES) {
    const response = await axios.post(
      `${BASE_SEARCH}/opportunities/_search/?offset=${upstreamOffset}&size=${TORRE_PAGE_SIZE}&aggregate=false`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0',
          'Accept-Encoding': 'gzip, deflate, br',
        },
      },
    );

    upstreamTotal = response.data.total || upstreamTotal;
    const results = response.data.results || [];
    filteredResults.push(
      ...results
        .map((opportunity) => ({
          opportunity,
          score: scoreOpportunity(opportunity, searchTerms),
        }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((item) => item.opportunity),
    );

    if (results.length < TORRE_PAGE_SIZE) break;
    upstreamOffset += TORRE_PAGE_SIZE;
    pagesFetched += 1;
  }

  const uniqueResults = Array.from(
    new Map(filteredResults.map((opportunity) => [opportunity.id || opportunity.slug, opportunity])).values(),
  );
  const rankedResults = uniqueResults.sort(
    (a, b) => scoreOpportunity(b, searchTerms) - scoreOpportunity(a, searchTerms),
  );

  return {
    results: rankedResults.slice(offset, offset + limit),
    total: rankedResults.length,
    upstreamTotal,
  };
}

async function getCurrencies() {
  const response = await axios.get(`${BASE_TORRE}/currencies`);
  return response.data;
}

module.exports = {
  searchEntities,
  getGenome,
  searchJobs,
  getCurrencies,
};
