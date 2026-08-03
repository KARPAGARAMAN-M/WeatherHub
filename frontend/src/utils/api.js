/**
 * Utility module for API URL normalization and standardized HTTP requests across WeatherHub.
 */

/**
 * Returns the normalized API base URL.
 * Automatically adds missing `https://` protocol if passed without one (e.g. from Render blueprint properties).
 */
export function getApiBaseUrl() {
  let url = (import.meta.env.VITE_API_BASE_URL || '').trim();
  url = url.replace(/\/+$/, '');

  if (url && !/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  return url;
}

/**
 * Perform fetch request against configured API base URL with query parameters.
 * @param {string} endpoint - API endpoint path, e.g. '/api/weather/current'
 * @param {Record<string, any>} params - Key-value pair of query parameters
 * @param {RequestInit} [options] - Optional fetch configuration options
 * @returns {Promise<Response>}
 */
export async function fetchApi(endpoint, params = {}, options = {}) {
  const baseUrl = getApiBaseUrl();
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value);
    }
  });

  const queryString = searchParams.toString();
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const fullUrl = `${baseUrl}${formattedEndpoint}${queryString ? `?${queryString}` : ''}`;

  return fetch(fullUrl, options);
}
