import api from './api';
import { TORRE_ENDPOINTS } from '../constants/endpoints';

export function searchJobs(term = 'developer', limit = 10, offset = 0) {
  const searchTerm = typeof term === 'string'
    ? term
    : term?.text || term?.term || 'developer';

  return api.post(TORRE_ENDPOINTS.SEARCH_JOBS, {
    term: searchTerm,
    offset,
    limit,
  });
}

export function searchPeople(term = 'developer') {
  return api.post('/api/torre/search', { text: term });
}

export function fetchJobDetails(jobId) {
  return api.get(`${TORRE_ENDPOINTS.SEARCH_JOBS}/${jobId}`);
}

export function fetchGenome(username) {
  return api.get(`${TORRE_ENDPOINTS.GENOME}/${username}`);
}

export function fetchFavorites(userId = 'guest', type) {
  return api.get(TORRE_ENDPOINTS.FAVORITES, {
    params: { userId, type },
  });
}

export function addFavorite(userId = 'guest', type, item) {
  const itemId = item.username || item.id || item._id;

  return api.post(TORRE_ENDPOINTS.FAVORITES, {
    userId,
    itemId,
    type,
    data: {
      id: item.id,
      name: item.name,
      username: item.username,
      picture: item.picture,
      headline: item.professionalHeadline || item.headline,
      objective: item.objective,
      tagline: item.tagline,
      type: item.type,
      locations: item.locations,
      organization: item.organizations?.[0]?.name || item.organization,
      compensation: item.compensation,
    },
  });
}

export function removeFavorite(favoriteId) {
  return api.delete(`${TORRE_ENDPOINTS.FAVORITES}/${favoriteId}`);
}

export function fetchAnalytics(limit = 10) {
  return api.get(TORRE_ENDPOINTS.ANALYTICS, {
    params: { limit },
  });
}
