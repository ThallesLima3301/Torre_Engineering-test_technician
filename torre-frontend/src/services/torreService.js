// src/services/torreService.js

import api from './api';

/**
 * Search job opportunities via your back-end proxy.
 *
 * @param {Object} criteria - The search criteria object (e.g. { term: 'developer' }).
 * @param {number} limit - Maximum number of results to return.
 * @param {number} [offset] - Offset for pagination (optional).
 * @returns {Promise<Object>} Axios response containing the list of jobs.
 */
export function searchJobs(criteria, limit, offset) {
  const payload = { criteria, limit };
  if (typeof offset === 'number') {
    payload.offset = offset;
  }
  return api.post('/api/torre/jobs', payload);
}

/**
 * Fetch detailed info for a single job.
 *
 * @param {string} jobId
 * @returns {Promise<Object>} Axios response containing the job details.
 */
export function fetchJobDetails(jobId) {
  return api.get(`/api/torre/jobs/${jobId}`);
}

/**
 * Fetch a user's genome/profile from Torre.
 *
 * @param {string} username
 * @returns {Promise<Object>} Axios response containing the genome data.
 */
export function fetchGenome(username) {
  return api.get(`/api/torre/genome/bios/${username}`);
}

/**
 * Fetch favorites (jobs or profiles) for a given user.
 *
 * @param {string} userId
 * @param {'job' | 'profile'} type
 * @returns {Promise<Object[]>} Axios response with an array of favorites.
 */
export function fetchFavorites(userId = 'guest', type = 'profile') {
  return api.get('/api/torre/favorites', {
    params: { userId, type },
  });
}

/**
 * Add a new favorite (job or profile).
 *
 * @param {string} userId
 * @param {'job' | 'profile'} type
 * @param {Object} item - The item to favorite (must include name, username, etc.).
 * @returns {Promise<Object>} Axios response from the server.
 */
export function addFavorite(userId = 'guest', type, item) {
  return api.post('/api/torre/favorites', {
    userId,
    itemId: item.username || item.id || item._id,
    type,
    data: {
      name: item.name,
      username: item.username,
      picture: item.picture,
      headline: item.professionalHeadline || item.headline || 'Sem headline',
    },
  });
}

/**
 * Remove a favorite by its ID.
 *
 * @param {string} favoriteId
 * @returns {Promise<void>} Axios response.
 */
export function removeFavorite(favoriteId) {
  return api.delete(`/api/torre/favorites/${favoriteId}`);
}

/**
 * Fetch most searched terms analytics.
 *
 * @returns {Promise<Object[]>} Axios response with analytics data.
 */
export function fetchAnalytics() {
  return api.get('/api/torre/analytics');
}
