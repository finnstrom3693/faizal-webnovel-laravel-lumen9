import React, { useState, useMemo, useEffect } from 'react';
import { Eye, Edit, Trash2, Plus, ChevronUp, ChevronDown, Star } from 'lucide-react';
import Navbar from '../Components/Navbar.jsx';
import Sidebar from '../Components/Sidebar.jsx';
import { useNavigate } from 'react-router-dom';

const NovelListDashboard = () => {
  const navigate = useNavigate();
  const [novels, setNovels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [featuredFilter, setFeaturedFilter] = useState('all');

  // Fetch novels from API
  useEffect(() => {
    const fetchNovels = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No authentication token found, redirecting to login');
          navigate('/');
          return;
        }

        // Use a fallback URL if the environment variable isn't available
        const baseUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';
        console.log(`Fetching novels from: ${baseUrl}/api/novel/`);

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        const response = await fetch(`${baseUrl}/api/novel/`, {
          headers,
          method: 'GET',
        });

        if (!response.ok) {
          if (response.status === 401) {
            console.error('Authentication error: Token expired or invalid');
            localStorage.removeItem('token');
            navigate('/');
            return;
          }
          throw new Error(`Failed to fetch novels: ${response.statusText}`);
        }

        const jsonResponse = await response.json();
        console.log('API response:', jsonResponse);

        // Handle Lumen's specific response format: { success: true, data: [...] }
        if (jsonResponse.success && Array.isArray(jsonResponse.data)) {
          console.log(`Setting novels from jsonResponse.data with ${jsonResponse.data.length} items`);
          setNovels(jsonResponse.data);
        } else if (jsonResponse.success && typeof jsonResponse.data === 'object') {
          console.log('Data is an object, converting to array');
          setNovels([jsonResponse.data]);
        } else {
          console.error('Unexpected API response format:', jsonResponse);
          setNovels([]);
          setError('Received unexpected data format from server');
        }
      } catch (err) {
        console.error('Error fetching novels:', err);
        setError(err.message || 'An error occurred while fetching novels');
        setNovels([]); // Ensure novels is set to something even on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchNovels();
  }, [navigate]);

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort the data
  const filteredAndSortedNovels = useMemo(() => {
    // Ensure novels is an array before processing
    if (!Array.isArray(novels)) {
      console.error('novels is not an array:', novels);
      return [];
    }

    // First filter by search term
    let filtered = novels.filter(novel =>
      (novel.title && novel.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (novel.author && novel.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (novel.genre && novel.genre.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Then filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(novel => novel.status === statusFilter);
    }

    // Then filter by featured status
    if (featuredFilter !== 'all') {
      const isFeatured = featuredFilter === 'featured';
      filtered = filtered.filter(novel => novel.featured === isFeatured);
    }

    // Then sort
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        // Handle missing values gracefully
        const aValue = a[sortConfig.key] !== undefined ? a[sortConfig.key] : '';
        const bValue = b[sortConfig.key] !== undefined ? b[sortConfig.key] : '';

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [novels, sortConfig, searchTerm, statusFilter, featuredFilter]);

  // Delete novel handler
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this novel?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }

        const baseUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';

        const response = await fetch(`${baseUrl}/api/novel/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            navigate('/');
            return;
          }
          throw new Error(`Failed to delete novel: ${response.statusText}`);
        }

        const jsonResponse = await response.json();

        if (jsonResponse.success) {
          // Remove the novel from local state if API call succeeds
          setNovels(novels.filter(novel => novel.id !== id));
          // Optionally display a success message
          console.log('Delete successful:', jsonResponse.message);
        } else {
          throw new Error(jsonResponse.message || 'Unknown error during deletion');
        }
      } catch (err) {
        console.error('Error deleting novel:', err);
        setError(err.message || 'An error occurred while deleting the novel');
      }
    }
  };

  // Render sort indicator
  const getSortIcon = (name) => {
    if (sortConfig.key === name) {
      return sortConfig.direction === 'ascending' ?
        <ChevronUp className="w-4 h-4 inline ml-1" /> :
        <ChevronDown className="w-4 h-4 inline ml-1" />;
    }
    return null;
  };

  // Render star rating
  const renderRating = (rating) => {
    // Convert rating to a number or default to 0
    const numericRating = parseFloat(rating) || 0;

    // Function to display stars
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= numericRating) {
        // Full star
        stars.push(
          <span key={i} className="text-yellow-400">★</span>
        );
      } else if (i - 0.5 <= numericRating) {
        // Half star (not implemented in this simple version)
        stars.push(
          <span key={i} className="text-yellow-400">★</span>
        );
      } else {
        // Empty star
        stars.push(
          <span key={i} className="text-gray-300">★</span>
        );
      }
    }

    return (
      <div className="flex items-center">
        <div className="flex">{stars}</div>
        <span className="ml-1 text-gray-600 text-sm">({numericRating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <Navbar activePage="novels" />

        <main className="p-6 space-y-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-800">All Novels</h1>
                <button
                  onClick={() => navigate('/admin/novel/create')}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Novel
                </button>
              </div>

              {/* Filters and Search */}
              <div className="bg-white shadow rounded-lg p-4 flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-72">
                  <label htmlFor="search" className="sr-only">Search</label>
                  <div className="relative">
                    <input
                      type="text"
                      id="search"
                      placeholder="Search novels..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="status-filter" className="sr-only">Filter by Status</label>
                  <select
                    id="status-filter"
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="featured-filter" className="sr-only">Filter by Featured</label>
                  <select
                    id="featured-filter"
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={featuredFilter}
                    onChange={(e) => setFeaturedFilter(e.target.value)}
                  >
                    <option value="all">All Novels</option>
                    <option value="featured">Featured</option>
                    <option value="regular">Regular</option>
                  </select>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                          onClick={() => requestSort('title')}
                        >
                          Title {getSortIcon('title')}
                        </th>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                          onClick={() => requestSort('author')}
                        >
                          Author {getSortIcon('author')}
                        </th>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                          onClick={() => requestSort('genre')}
                        >
                          Genre {getSortIcon('genre')}
                        </th>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                          onClick={() => requestSort('status')}
                        >
                          Status {getSortIcon('status')}
                        </th>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                          onClick={() => requestSort('rating')}
                        >
                          Rating {getSortIcon('rating')}
                        </th>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                          onClick={() => requestSort('views')}
                        >
                          Views {getSortIcon('views')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Featured
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredAndSortedNovels.length > 0 ? (
                        filteredAndSortedNovels.map((novel) => (
                          <tr key={novel.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{novel.title || 'Untitled'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{novel.author || 'Unknown'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{novel.genre || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${novel.status === 'published' ? 'bg-green-100 text-green-800' :
                                novel.status === 'draft' ? 'bg-blue-100 text-blue-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                {novel.status || 'Unknown'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {renderRating(novel.rating)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {novel.views ? novel.views.toLocaleString() : '0'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              <Star
                                className="h-5 w-5"
                                fill={novel.featured ? "#facc15" : "#e5e7eb"}
                                stroke={novel.featured ? "#facc15" : "#9ca3af"}
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex space-x-3">
                                <button
                                  className="text-indigo-600 hover:text-indigo-900"
                                  title="View Novel"
                                  onClick={() => {
                                    if (novel.id) {
                                      // Use navigate for internal routes if it's an SPA (Single Page App)
                                      window.location.href = `${process.env.FRONTEND_BASE_URL}/novel/${novel.id}`;
                                    } else {
                                      console.error("Novel ID is undefined");
                                    }
                                  }}
                                >
                                  <Eye className="h-5 w-5" />
                                </button>

                                <button
                                  className="text-green-600 hover:text-green-900"
                                  title="Edit Novel"
                                  onClick={() => navigate(`/admin/novel/edit/${novel.id}`)}
                                >
                                  <Edit className="h-5 w-5" />
                                </button>
                                <button
                                  className="text-red-600 hover:text-red-900"
                                  title="Delete Novel"
                                  onClick={() => handleDelete(novel.id)}
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                            No novels found matching your search criteria
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{filteredAndSortedNovels.length}</span> of <span className="font-medium">{novels.length}</span> novels
                  </div>

                  {/* Basic pagination - implement actual pagination logic as needed */}
                  <div className="flex-1 flex justify-end">
                    <div className="flex space-x-2">
                      <button
                        className="px-3 py-1 rounded border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                        disabled={true} // Would implement actual pagination logic
                      >
                        Previous
                      </button>
                      <button
                        className="px-3 py-1 rounded border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                        disabled={true} // Would implement actual pagination logic
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div >
  );
};

export default NovelListDashboard;