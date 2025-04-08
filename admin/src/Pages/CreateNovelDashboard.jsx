import React from 'react';
import Navbar from '../Components/Navbar.jsx';
import Sidebar from '../Components/Sidebar.jsx';
import { useNavigate } from 'react-router-dom';

const CreateNovelDashboard = () => {
  const navigate = useNavigate();

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

          <form className="space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">Novel Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    placeholder="Novel Title"
                    className="mt-1 block w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-colors duration-150"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                  <input
                    type="text"
                    placeholder="Author Name"
                    className="mt-1 block w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-colors duration-150"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                  <input
                    type="text"
                    placeholder="e.g. Fantasy, Sci-Fi"
                    className="mt-1 block w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-colors duration-150"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="mt-1 block w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-colors duration-150"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">First Chapter</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chapter Name</label>
                <input
                  type="text"
                  placeholder="Chapter 1: The Beginning"
                  className="mt-1 block w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-colors duration-150"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chapter Content</label>
                <textarea
                  rows={8}
                  placeholder="Write your chapter content here..."
                  className="mt-1 block w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-colors duration-150"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-150"
              >
                Save Novel and Chapter
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default CreateNovelDashboard;