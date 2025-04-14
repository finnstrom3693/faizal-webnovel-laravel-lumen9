import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Navbar from '../Components/Navbar.jsx';
import Sidebar from '../Components/Sidebar.jsx';
import { useNavigate } from 'react-router-dom';

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

const CreateNovelDashboard = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    synopsis: '',
    status: 'draft',
    featured: 0,
    chapterName: '',
    chapterContent: '',
    cover: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/', { state: { message: 'Please login to create a novel' } });
    }
  }, [navigate]);

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.author.trim()) errors.author = 'Author is required';
    if (!formData.genre.trim()) errors.genre = 'Genre is required';
    if (!formData.synopsis.trim()) errors.synopsis = 'Synopsis is required';
    if (!formData.chapterName.trim()) errors.chapterName = 'Chapter name is required';
    if (!formData.chapterContent.trim() || formData.chapterContent === '<p><br></p>') {
      errors.chapterContent = 'Chapter content is required';
    }
    setValidationErrors(errors);
    const isValid = Object.keys(errors).length === 0;
    console.log('Form validation result:', isValid ? 'Valid' : 'Invalid', errors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked :
        name === 'synopsis' ? value.replace(/\n/g, '\n') : value
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

  const handleEditorChange = (content) => {
    setFormData(prev => ({
      ...prev,
      chapterContent: content
    }));
    if (validationErrors.chapterContent) {
      setValidationErrors(prev => ({ ...prev, chapterContent: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      setError('Please correct the errors in the form before submitting.');
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('author', formData.author);
      formDataToSend.append('genre', formData.genre);
      formDataToSend.append('synopsis', formData.synopsis);
      formDataToSend.append('status', formData.status);
      // Explicit boolean conversion
      formDataToSend.append('featured', formData.featured ? 1 : 0);

      if (formData.cover) {
        formDataToSend.append('cover', formData.cover);
      }

      const novelResponse = await api.post('/api/novel', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const novelId = novelResponse.data.data.id;

      await api.post(`/api/novel/${novelId}/chapter`, {
        novel_id: novelId,
        title: formData.chapterName,
        content: formData.chapterContent
      });

      setSuccess('Your novel and first chapter have been successfully created!');

      setFormData({
        title: '',
        author: '',
        genre: '',
        synopsis: '',
        status: 'draft',
        featured: false,
        chapterName: '',
        chapterContent: '',
        cover: null,
      });
      setPreviewImage(null);

    } catch (err) {
      console.error('Error creating novel:', err);

      if (err.response?.status === 401) {
        navigate('/', { state: { message: 'Your session has expired. Please login again.' } });
      } else if (err.response?.status === 422) {
        if (err.response.data?.errors) {
          setValidationErrors(err.response.data.errors);
          const errorSummary = Object.entries(err.response.data.errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('; ');
          setError(`Form validation failed: ${errorSummary}`);
        } else {
          setError(err.response.data?.message || 'The server rejected your input.');
        }
      } else {
        setError(err.response?.data?.message || 'Failed to create novel. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Navbar activePage="novels" />
        <main className="p-6 space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Novel</h1>
            <p className="text-sm text-gray-500 mt-1">Fill in the details to start your new novel</p>
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

          <form className="space-y-8" onSubmit={handleSubmit}>
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
                    placeholder="Novel Title"
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
                    placeholder="Author Name"
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
                    placeholder="e.g. Fantasy, Sci-Fi"
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

                {/* Featured Checkbox */}
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
                            <span className="mt-2 block text-sm text-gray-500">Portrait cover</span>
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
                    </div>
                    <div className="flex-1">
                      <label
                        htmlFor="cover-upload"
                        className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                      >
                        <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        {formData.cover ? 'Change Cover' : 'Upload Cover'}
                      </label>
                      <input
                        id="cover-upload"
                        name="cover"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        Recommended: 512x768px portrait orientation. JPG, PNG or GIF (Max 2MB)
                      </p>
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
                  placeholder="Brief description of your novel"
                  rows="4"
                  className={`mt-1 block w-full px-4 py-2.5 rounded-lg border ${validationErrors.synopsis ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-colors duration-150 whitespace-pre-wrap`}
                  required
                  style={{ whiteSpace: 'pre-wrap' }}
                />
                {validationErrors.synopsis && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.synopsis}</p>
                )}
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">First Chapter</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chapter Name *</label>
                <input
                  type="text"
                  name="chapterName"
                  value={formData.chapterName}
                  onChange={handleInputChange}
                  placeholder="Chapter 1: The Beginning"
                  className={`mt-1 block w-full px-4 py-2.5 rounded-lg border ${validationErrors.chapterName ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-colors duration-150`}
                  required
                />
                {validationErrors.chapterName && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.chapterName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chapter Content *</label>
                <div className="mt-1">
                  <ReactQuill
                    theme="snow"
                    value={formData.chapterContent}
                    onChange={handleEditorChange}
                    modules={modules}
                    formats={formats}
                    className={`bg-white rounded-lg ${validationErrors.chapterContent ? 'border-red-500' : 'border-gray-200'}`}
                    style={{
                      height: '600px',
                      marginBottom: '60px',
                      border: validationErrors.chapterContent ? '1px solid #ef4444' : '1px solid #e5e7eb',
                      borderRadius: '0.5rem'
                    }}
                  />
                </div>
                {validationErrors.chapterContent && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.chapterContent}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex items-center px-6 py-3 ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} text-white font-medium rounded-lg shadow-sm transition-colors duration-150`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : 'Save Novel and Chapter'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default CreateNovelDashboard;