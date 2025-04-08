import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../Components/Navbar.jsx';
import Sidebar from '../Components/Sidebar.jsx';

const dummyNovels = [
    { id: 1, title: "The Dragon's Apprentice", author: "Elena Sparks", genre: "Fantasy", status: "published", views: 28456, chapters: ["The Awakening", "Trials of Fire"] },
    { id: 2, title: "Moonlight Academy", author: "Kai Nakamura", genre: "Romance", status: "draft", views: 26789, chapters: ["The New Student", "Secrets Unfold"] },
    { id: 3, title: "Echoes of Another World", author: "Lena Frost", genre: "Sci-Fi", status: "published", views: 24312, chapters: [] },
    { id: 4, title: "Whispers in the Wind", author: "Mia Reyes", genre: "Mystery", status: "pending", views: 19342, chapters: ["The Letter", "The Fog"] },
];

const EditNovelDashboard = () => {
    const { id } = useParams();
    const novel = dummyNovels.find(n => n.id === parseInt(id));

    const [title, setTitle] = useState(novel?.title || '');
    const [author, setAuthor] = useState(novel?.author || '');
    const [genre, setGenre] = useState(novel?.genre || '');
    const [status, setStatus] = useState(novel?.status || '');

    if (!novel) return <div className="p-6">Novel not found</div>;

    const handleSave = () => {
        alert(`Saved changes:\n\nTitle: ${title}\nAuthor: ${author}\nGenre: ${genre}\nStatus: ${status}`);
        // Here you can send a PUT or PATCH request to your API
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />

            <div className="flex-1 overflow-auto">
                <Navbar activePage="novels" />

                <main className="p-6 space-y-6">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-6">Edit Novel - {novel.title}</h1>

                    <div className="bg-white p-6 rounded shadow-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="mt-1 block w-full border rounded-md p-2 focus:ring focus:ring-blue-200"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Author</label>
                                <input
                                    type="text"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    className="mt-1 block w-full border rounded-md p-2 focus:ring focus:ring-blue-200"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Genre</label>
                                <input
                                    type="text"
                                    value={genre}
                                    onChange={(e) => setGenre(e.target.value)}
                                    className="mt-1 block w-full border rounded-md p-2 focus:ring focus:ring-blue-200"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="mt-1 block w-full border rounded-md p-2 focus:ring focus:ring-blue-200"
                                >
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-4">
                            <Link
                                to={`/admin/novel/${novel.id}/chapter/create`}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                Add Chapter
                            </Link>
                            <button
                                onClick={handleSave}
                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded shadow-md mt-6">
                        <h2 className="text-xl font-semibold mb-4">Chapters</h2>
                        <ul className="space-y-4">
                            {novel.chapters.length > 0 ? (
                                novel.chapters.map((chapter, idx) => (
                                    <li key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-md shadow-sm">
                                        <span className="font-medium">{chapter}</span>
                                        <div className="flex space-x-2">
                                            <a
                                                href={`http://localhost:5173/novel/${novel.id}/chapter/${idx + 1}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 underline hover:text-blue-800"
                                            >
                                                View
                                            </a>
                                            <Link
                                                to={`/admin/novel/${novel.id}/edit-chapter/${idx + 1}`}
                                                className="text-sm text-green-600 underline hover:text-green-800"
                                            >
                                                Edit
                                            </Link>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <li className="italic text-gray-500">No chapters available</li>
                            )}
                        </ul>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default EditNovelDashboard;