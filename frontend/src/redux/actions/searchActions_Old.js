export const FETCH_SEARCH_RESULTS_REQUEST = 'FETCH_SEARCH_RESULTS_REQUEST';
export const FETCH_SEARCH_RESULTS_SUCCESS = 'FETCH_SEARCH_RESULTS_SUCCESS';
export const FETCH_SEARCH_RESULTS_FAILURE = 'FETCH_SEARCH_RESULTS_FAILURE';
export const CLEAR_SEARCH_RESULTS = 'CLEAR_SEARCH_RESULTS';

// Action Creators
export const fetchSearchResults = (query, filters = {}) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_SEARCH_RESULTS_REQUEST });
    
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate with mock data and a delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data - in a real app, this would come from your API
      const mockResults = generateMockResults(query, filters);
      
      dispatch({
        type: FETCH_SEARCH_RESULTS_SUCCESS,
        payload: mockResults
      });
    } catch (error) {
      dispatch({
        type: FETCH_SEARCH_RESULTS_FAILURE,
        payload: error.message
      });
    }
  };
};

export const clearSearchResults = () => {
  return {
    type: CLEAR_SEARCH_RESULTS
  };
};

// Helper function to generate mock data
const generateMockResults = (query, filters) => {
  // This is just an example - in a real app, you'd get data from an API
  const mockNovels = [
    {
      id: 1,
      title: "The Dragon's Treasure",
      author: "Sarah Maas",
      description: "An epic fantasy tale about a dragon guarding an ancient treasure and the brave warrior who seeks to claim it.",
      category: "fantasy",
      rating: 4.7,
      views: "12.5K",
      lastUpdated: "2d ago",
      status: "ongoing",
      coverImage: null
    },
    {
      id: 2,
      title: "Star Kingdoms",
      author: "Robert Chen",
      description: "A science fiction saga about warring interstellar kingdoms and the technology that binds or divides them.",
      category: "sci-fi",
      rating: 4.3,
      views: "8.2K",
      lastUpdated: "5d ago",
      status: "ongoing",
      coverImage: null
    },
    {
      id: 3,
      title: "Love in the Moonlight",
      author: "Lily Wang",
      description: "A touching romance novel about two strangers who meet under the moonlight and discover they're destined for each other.",
      category: "romance",
      rating: 4.5,
      views: "15.3K",
      lastUpdated: "1d ago",
      status: "completed",
      coverImage: null
    },
    {
      id: 4,
      title: "The Last Detective",
      author: "James Peterson",
      description: "A gritty detective story set in the near future where crime is rampant and one detective stands against corruption.",
      category: "mystery",
      rating: 4.1,
      views: "6.7K",
      lastUpdated: "1w ago",
      status: "hiatus",
      coverImage: null
    },
    {
      id: 5,
      title: "Sword of Destiny",
      author: "Michael Lee",
      description: "An action-packed adventure about a legendary sword that chooses its wielder to restore balance to a chaotic world.",
      category: "fantasy",
      rating: 4.8,
      views: "18.9K",
      lastUpdated: "3d ago",
      status: "ongoing",
      coverImage: null
    },
    {
      id: 6,
      title: "Digital Dreams",
      author: "Samantha Tech",
      description: "A cyberpunk tale about hackers who can enter dreams and steal information, but at what cost to their own minds?",
      category: "sci-fi",
      rating: 4.2,
      views: "7.4K",
      lastUpdated: "4d ago",
      status: "ongoing",
      coverImage: null
    },
    {
      id: 7,
      title: "The Emperor's Secret",
      author: "Alex Zhang",
      description: "A historical fiction novel following a palace servant who discovers the emperor's dangerous secret.",
      category: "action",
      rating: 3.9,
      views: "5.1K",
      lastUpdated: "2w ago",
      status: "completed",
      coverImage: null
    },
    {
      id: 8,
      title: "Forever and Always",
      author: "Jessica Miller",
      description: "A heartwarming romance about childhood friends who reunite after years apart and discover their feelings never faded.",
      category: "romance",
      rating: 4.6,
      views: "14.2K",
      lastUpdated: "6d ago",
      status: "ongoing",
      coverImage: null
    }
  ];
  
  // Filter the mock novels based on query and filters
  let filteredResults = mockNovels.filter(novel => {
    // Basic search by title or author or description
    const searchMatch = 
      novel.title.toLowerCase().includes(query.toLowerCase()) ||
      novel.author.toLowerCase().includes(query.toLowerCase()) ||
      novel.description.toLowerCase().includes(query.toLowerCase());
    
    // Apply category filter if set
    const categoryMatch = !filters.category || novel.category === filters.category;
    
    // Apply status filter if set
    const statusMatch = !filters.status || novel.status === filters.status;
    
    // Apply rating filter if set
    const ratingMatch = !filters.rating || novel.rating >= parseFloat(filters.rating);
    
    return searchMatch && categoryMatch && statusMatch && ratingMatch;
  });
  
  // Sort results based on sortBy parameter
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'latest':
        // Simple sort by "lastUpdated" (would need real date objects for proper sorting)
        filteredResults.sort((a, b) => a.lastUpdated.localeCompare(b.lastUpdated));
        break;
      case 'rating':
        filteredResults.sort((a, b) => b.rating - a.rating);
        break;
      case 'popularity':
        // Simple sort by views (would need numeric values for proper sorting)
        filteredResults.sort((a, b) => {
          const aViews = parseFloat(a.views.replace('K', '000'));
          const bViews = parseFloat(b.views.replace('K', '000'));
          return bViews - aViews;
        });
        break;
      // 'relevance' is default, no specific sorting needed
    }
  }
  
  return filteredResults;
};