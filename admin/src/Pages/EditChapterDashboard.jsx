import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../Components/Navbar.jsx';
import Sidebar from '../Components/Sidebar.jsx';

// Dummy data - replace with actual fetch from API or state
const dummyNovels = [
  {
    id: 1,
    title: "The Dragon's Apprentice",
    chapters: [
      { title: "The Awakening", content: "Once upon a time..." },
      { title: "Trials of Fire", content: "The flame burned bright..." }
    ]
  },
  {
    id: 2,
    title: "Moonlight Academy",
    chapters: [
      { title: "The New Student", content: "A new semester begins..." },
      { title: "Secrets Unfold", content: "Mysteries in the dark..." }
    ]
  }
];

const EditChapterDashboard = () => {
  const { id, chapterId } = useParams();
  const novel = dummyNovels.find(n => n.id === parseInt(id));
  const chapter = novel?.chapters?.[parseInt(chapterId) - 1];

  const [title, setTitle] = useState(chapter?.title || '');
  const [content, setContent] = useState(chapter?.content || '');

  if (!novel || !chapter) {
    return <div className="p-6">Chapter not found</div>;
  }

  const handleSave = () => {
    alert(`Saved "${title}" with content:\n\n${content}`);
    // Add logic to persist changes to API/state
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <Navbar activePage="novels" />

        <main className="p-6 space-y-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Edit Chapter - {novel.title}: {chapter.title}
          </h1>

          <div className="bg-white p-6 rounded shadow space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Chapter Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className="mt-1 block w-full border rounded p-2"
              />
            </div>

            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Save Changes
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditChapterDashboard;
