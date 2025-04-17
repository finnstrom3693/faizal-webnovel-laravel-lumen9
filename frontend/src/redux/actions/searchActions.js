export const FETCH_SEARCH_RESULTS_REQUEST = 'FETCH_SEARCH_RESULTS_REQUEST';
export const FETCH_SEARCH_RESULTS_SUCCESS = 'FETCH_SEARCH_RESULTS_SUCCESS';
export const FETCH_SEARCH_RESULTS_FAILURE = 'FETCH_SEARCH_RESULTS_FAILURE';
export const CLEAR_SEARCH_RESULTS = 'CLEAR_SEARCH_RESULTS';

export const fetchSearchResults = (query) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_SEARCH_RESULTS_REQUEST });

    try {
      const baseUrl = process.env.REACT_APP_BASE_URL;

      const params = new URLSearchParams({ title: query });

      const [novelRes, translationRes] = await Promise.all([
        fetch(`${baseUrl}/api/novel/search?${params.toString()}`),
        fetch(`${baseUrl}/api/translation_novel/search?${params.toString()}`)
      ]);

      if (!novelRes.ok || !translationRes.ok) {
        throw new Error('Failed to fetch search results');
      }

      const novelData = await novelRes.json();
      const translationData = await translationRes.json();

      const mergedResults = [
        ...(novelData.data || []).map(item => ({ ...item, type: 'novel' })),
        ...(translationData.data || []).map(item => ({ ...item, type: 'translation' }))
      ];

      dispatch({
        type: FETCH_SEARCH_RESULTS_SUCCESS,
        payload: mergedResults,
      });
    } catch (error) {
      dispatch({
        type: FETCH_SEARCH_RESULTS_FAILURE,
        payload: error.message,
      });
    }
  };
};

export const clearSearchResults = () => ({
  type: CLEAR_SEARCH_RESULTS,
});
