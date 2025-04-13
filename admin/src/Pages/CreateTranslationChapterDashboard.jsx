import React, { useState } from 'react';
import Navbar from '../Components/Navbar.jsx';
import Sidebar from '../Components/Sidebar.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

const CreateTranslationChapterDashboard = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterContent, setChapterContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isQuillEmpty = (content) => {
    if (!content) return true;
    if (content.replace(/<(.|\n)*?>/g, '').trim().length === 0) return true;
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to create a chapter');
      navigate('/');
      return;
    }

    if (!chapterTitle.trim() || isQuillEmpty(chapterContent)) {
      setError('Chapter title and content are required');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        novel_id: id,
        title: chapterTitle,
        content: chapterContent,
      };

      console.log("payload :",payload);

      // Changed the endpoint to match typical REST conventions
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/translation_novel/${id}/chapter`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      setSuccess('Chapter Created Successfully!');
      navigate(`/admin/translation-novel/edit/${id}`);
    } catch (error) {
      console.error('Error creating chapter:', error);
      const errorMessage = error.response?.data?.message || 'Error creating chapter. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'link',
    'image',
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <Navbar activePage="novels" />

        <main className="p-6 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-semibold text-gray-800">
              Create New Chapter
            </h1>
            <button
              onClick={handleGoBack}
              className="inline-flex items-center px-4 py-2 text-white text-base font-medium rounded-md shadow-sm transition duration-300 ease-in-out bg-gray-600 hover:bg-gray-700"
            >
              &larr; Back
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Chapter Title</label>
              <input
                type="text"
                placeholder="e.g. The Awakening"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-3 px-4 text-base"
                required
                value={chapterTitle}
                onChange={(e) => setChapterTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Content</label>
              <ReactQuill
                theme="snow"
                value={chapterContent}
                onChange={setChapterContent}
                modules={modules}
                formats={formats}
                placeholder="Write your chapter content here..."
                className="h-96 mb-12"
                style={{
                  height: '600px',
                  marginBottom: '60px',
                  border: error && isQuillEmpty(chapterContent) ? '1px solid #ef4444' : '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                }}
              />
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center px-6 py-3 text-white text-lg font-semibold rounded-md shadow-md transition duration-300 ease-in-out ${
                  isSubmitting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isSubmitting ? 'Saving...' : 'Save Chapter'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default CreateTranslationChapterDashboard;