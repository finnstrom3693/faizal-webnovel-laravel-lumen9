import React from 'react';
import Navbar from '../Components/Navbar.jsx';
import Sidebar from '../Components/Sidebar.jsx';
import { useNavigate, useParams } from 'react-router-dom';

const CreateChapterDashboard = () => {
  const navigate = useNavigate();
  const { novelId } = useParams();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Chapter Created!');
    // Add your API logic here...
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <Navbar activePage="novels" />

        <main className="p-6 space-y-6">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">
            Create New Chapter {novelId && <span className="text-lg text-gray-600">(Novel ID: {novelId})</span>}
          </h1>

          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Chapter Title</label>
              <input
                type="text"
                placeholder="e.g. The Awakening"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-3 px-4 text-base"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Content</label>
              <textarea
                placeholder="Write your chapter content here..."
                rows={12}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 py-3 px-4 text-base resize-vertical"
                required
              ></textarea>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold rounded-md shadow-md transition duration-300 ease-in-out"
              >
                Save Chapter
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default CreateChapterDashboard;