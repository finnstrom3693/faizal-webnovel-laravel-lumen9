import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Components/Navbar.jsx';
import Sidebar from '../Components/Sidebar.jsx';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const EditNovelDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [novel, setNovel] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [currentCover, setCurrentCover] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    status: 'published',
    synopsis: '',
    featured: false,
    cover: null
  });

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link'
  ];

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/', { state: { from: `/admin/novel/edit/${id}` } });
    }
  }, [id, navigate]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Get novel details
        const novelResponse = await api.get(`/api/novel/${id}`);
        const novelData = novelResponse.data.data;
        console.log("novel data :", novelData);
        setNovel(novelData);

        // Initialize form data with fetched novel data
        setFormData({
          title: novelData.title || '',
          author: novelData.author || '',
          genre: novelData.genre || '',
          status: novelData.status || 'published',
          synopsis: novelData.synopsis || '',
          featured: novelData.featured || false,
          cover: null
        });

        // Set current cover image if it exists
        if (novelData.cover) {
            setCurrentCover(`${API_BASE_URL}/public/${novelData.cover}`);
            setPreviewImage(`${API_BASE_URL}/public/${novelData.cover}`);
        }

        // Fetch chapters
        const chaptersResponse = await api.get(`/api/novel/${id}/chapter`, {
          params: { novel_id: id }
        });

        setChapters(chaptersResponse.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);

        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/');
        }

        setError(err.response?.data?.message || 'Failed to load novel data');
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('File size must be less than 2MB');
        return;
      }
      
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setError('Only JPG, PNG or GIF images are allowed');
        return;
      }

      setFormData(prev => ({
        ...prev,
        cover: file
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleRemoveCover = () => {
    setFormData(prev => ({
      ...prev,
      cover: null
    }));
    setPreviewImage(null);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.author.trim()) errors.author = 'Author is required';
    if (!formData.genre.trim()) errors.genre = 'Genre is required';
    if (!formData.synopsis.trim()) errors.synopsis = 'Synopsis is required';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
  
    if (!validateForm()) {
      setError('Please correct the errors in the form before submitting.');
      return;
    }
  
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('author', formData.author);
      formDataToSend.append('genre', formData.genre);
      formDataToSend.append('synopsis', formData.synopsis);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('featured', formData.featured ? 1 : 0);
  
      // Handle cover image scenarios
      if (formData.cover) {
        formDataToSend.append('cover', formData.cover);
      } else if (previewImage === null && currentCover) {
        // Only send remove_cover if there was a current cover and we're removing it
        formDataToSend.append('remove_cover', '1');
      }
  
      // Log form data for debugging
      console.log('Form data being sent:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }
  
      formDataToSend.append('_method', 'PUT'); // Tell Lumen it's a PUT request

      const response = await api.post(`/api/novel/${id}`, formDataToSend, {
        headers: {
                'Content-Type': 'multipart/form-data'
        }
      });

  
      setSuccess('Novel updated successfully!');
      setNovel(response.data.data);
      
      // Update cover image states based on response
      if (response.data.data.cover) {
        const newCoverUrl = `${API_BASE_URL}${response.data.data.cover}`;
        setCurrentCover(newCoverUrl);
        setPreviewImage(newCoverUrl);
      } else {
        setCurrentCover(null);
        setPreviewImage(null);
      }
  
      // Clear validation errors
      setValidationErrors({});
  
    } catch (err) {
      console.error('Error updating novel:', err);
  
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/');
      }
  
      // Handle backend validation errors
      if (err.response?.data?.errors) {
        setValidationErrors(err.response.data.errors);
        const errorSummary = Object.entries(err.response.data.errors)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('; ');
        setError(`Form validation failed: ${errorSummary}`);
      } else {
        setError(err.response?.data?.message || 'Failed to update novel');
      }
    }
  };

  const handleDeleteChapter = async (chapterId) => {
    try {
      const chapterToDelete = chapters.find(chapter => chapter.id === chapterId);
      const chapterTitle = chapterToDelete?.title || 'this chapter';

      if (!window.confirm(`Are you sure you want to delete "${chapterTitle}"?`)) {
        return;
      }

      await api.delete(`/api/novel/${id}/chapter/${chapterId}`);

      setChapters(chapters.filter(chapter => chapter.id !== chapterId));
      setSuccess(`Chapter "${chapterTitle}" deleted successfully!`);
    } catch (err) {
      console.error('Error deleting chapter:', err);

      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/');
      }

      setError(err.response?.data?.message || 'Failed to delete chapter');
    }
  };

  if (loading) return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Navbar activePage="novels" />
        <div className="p-6 flex justify-center items-center h-full">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </div>
    </div>
  );

  if (error && !novel) return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Navbar activePage="novels" />
        <div className="p-6">
          <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (!novel) return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Navbar activePage="novels" />
        <div className="p-6">
          <div className="text-lg">Novel not found</div>
          <Link
            to="/admin/novel"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Back to Novels
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Navbar activePage="novels" />

        <main className="p-6 space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Novel - {novel.title}</h1>
              <p className="text-sm text-gray-500 mt-1">Update the details of your novel</p>
            </div>
            <Link
              to="/admin/novel"
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Back to Novels
            </Link>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 flex justify-between items-center">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-700 hover:text-red-900"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-700 p-4 rounded-lg border border-green-200 flex justify-between items-center">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {success}
              </div>
              <button
                onClick={() => setSuccess(null)}
                className="text-green-700 hover:text-green-900"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}

          <form className="space-y-8" onSubmit={handleSave}>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">Novel Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-4 py-2.5 rounded-lg border ${validationErrors.title ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-colors duration-150`}
                    required
                  />
                  {validationErrors.title && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-4 py-2.5 rounded-lg border ${validationErrors.author ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-colors duration-150`}
                    required
                  />
                  {validationErrors.author && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.author}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Genre *</label>
                  <input
                    type="text"
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-4 py-2.5 rounded-lg border ${validationErrors.genre ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-colors duration-150`}
                    required
                  />
                  {validationErrors.genre && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.genre}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-colors duration-150"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                    Featured Novel
                  </label>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="relative group">
                      <div className={`h-48 w-36 rounded-lg border-2 ${previewImage ? 'border-transparent' : 'border-dashed border-gray-300'} overflow-hidden bg-gray-100 flex items-center justify-center`}>
                        {previewImage ? (
                          <img 
                            src={previewImage} 
                            alt="Cover preview" 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-4">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="mt-2 block text-sm text-gray-500">
                              {currentCover ? 'No image selected' : 'No cover image'}
                            </span>
                          </div>
                        )}
                        <label 
                          htmlFor="cover-upload"
                          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 cursor-pointer"
                        >
                          <span className={`text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${previewImage ? 'block' : 'hidden'}`}>
                            Change
                          </span>
                        </label>
                      </div>
                      {previewImage && (
                        <button
                          type="button"
                          onClick={handleRemoveCover}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-150"
                          title="Remove cover"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex gap-2">
                        <label
                          htmlFor="cover-upload"
                          className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                        >
                          <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          {previewImage ? 'Change Cover' : 'Upload Cover'}
                        </label>
                        {currentCover && !previewImage && (
                          <button
                            type="button"
                            onClick={() => setPreviewImage(currentCover)}
                            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Show Current Cover
                          </button>
                        )}
                      </div>
                      <input
                        id="cover-upload"
                        name="cover"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                      <p className="text-xs text-gray-500">
                        Recommended: 512x768px portrait orientation. JPG, PNG or GIF (Max 2MB)
                      </p>
                      {currentCover && !previewImage && (
                        <p className="text-xs text-gray-500">
                          Current cover image will be kept if no new image is selected.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Synopsis *</label>
                <textarea
                  name="synopsis"
                  value={formData.synopsis}
                  onChange={handleInputChange}
                  rows="4"
                  className={`mt-1 block w-full px-4 py-2.5 rounded-lg border ${validationErrors.synopsis ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-colors duration-150`}
                  required
                />
                {validationErrors.synopsis && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.synopsis}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Link
                to={`/admin/novel/${id}/chapter/create`}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-sm hover:bg-blue-700 transition-colors duration-150"
              >
                Add Chapter
              </Link>
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-sm hover:bg-green-700 transition-colors duration-150"
              >
                Save Changes
              </button>
            </div>
          </form>

          {/* Chapters List */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Chapters</h2>
            {chapters.length > 0 ? (
              <ul className="space-y-4">
                {chapters.map((chapter) => (
                  <li key={chapter.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">{chapter.title}</span>
                    <div className="flex space-x-4">
                      <a
                        href={`${window.location.origin}/novel/${novel.id}/chapter/${chapter.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        View
                      </a>
                      <Link
                        to={`/admin/novel/edit/${novel.id}/edit-chapter/${chapter.id}`}
                        className="text-sm text-green-600 hover:text-green-800 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteChapter(chapter.id)}
                        className="text-sm text-red-600 hover:text-red-800 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="italic text-gray-500">No chapters available</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditNovelDashboard;