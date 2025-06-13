import api from './api';
import { TORRE_ENDPOINTS } from '../constants/endpoints';

/**
 * Search job opportunities via your back-end proxy.
 *
 * @param {string} term - The search term (e.g. 'developer').
 * @param {number} limit - Maximum number of results to return.
 * @param {number} [offset] - Offset for pagination (optional).
 * @returns {Promise<Object>} Axios response containing the list of jobs.
 */
export async function searchJobs(term = 'developer', limit = 10, offset = 0) {
  return api.post('/api/torre/jobs', {
    term,
    offset,
    limit
  });
}

/**
 * Fetch detailed info for a single job.
 *
 * @param {string} jobId
 * @returns {Promise<Object>} Axios response containing the job details.
 */
export function fetchJobDetails(jobId) {
  return api.get(`${TORRE_ENDPOINTS.SEARCH_JOBS}/${jobId}`);
}

/**
 * Fetch a user's genome/profile from Torre.
 *
 * @param {string} username
 * @returns {Promise<Object>} Axios response containing the genome data.
 */
export function fetchGenome(username) {
  return api.get(`${TORRE_ENDPOINTS.GENOME}/bios/${username}`);
}

/**
 * Fetch favorites (jobs or profiles) for a given user.
 *
 * @param {string} userId
 * @param {'job' | 'profile'} type
 * @returns {Promise<Object[]>} Axios response with an array of favorites.
 */
export function fetchFavorites(userId = 'guest', type = 'profile') {
  return api.get(TORRE_ENDPOINTS.FAVORITES, {
    params: { userId, type },
  });
}

/**
 * Add a new favorite (job or profile).
 *
 * @param {string} userId
 * @param {'job' | 'profile'} type
 * @param {Object} item - The item to favorite.
 * @returns {Promise<Object>} Axios response from the server.
 */
export function addFavorite(userId = 'guest', type, item) {
  return api.post(TORRE_ENDPOINTS.FAVORITES, {
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
  return api.delete(`${TORRE_ENDPOINTS.FAVORITES}/${favoriteId}`);
}

/**
 * Fetch most searched terms analytics.
 *
 * @returns {Promise<Object[]>} Axios response with analytics data.
 */
export function fetchAnalytics() {
  return api.get(TORRE_ENDPOINTS.ANALYTICS);
}
