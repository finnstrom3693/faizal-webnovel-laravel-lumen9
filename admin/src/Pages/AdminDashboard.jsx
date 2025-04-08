import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, BarChart2, User, Users, FileText, Settings,
  Bell, Search, ChevronRight, Eye, Edit, Trash2, Star, LogOut
} from 'lucide-react';
import Navbar from '../Components/Navbar.jsx';
import Sidebar from '../Components/Sidebar.jsx';
import { jwtDecode } from 'jwt-decode';

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  const baseUrl = process.env.REACT_APP_BASE_URL;

  const recentSubmissions = [
    { id: 1, title: "The Lost Kingdom", author: "Alex Morgan", status: "pending", date: "Apr 6, 2025" },
    { id: 2, title: "Silent Whispers", author: "Maya Chen", status: "approved", date: "Apr 5, 2025" },
    { id: 3, title: "Beyond the Stars", author: "James Wilson", status: "pending", date: "Apr 5, 2025" }
  ];

  const topNovels = [
    { id: 1, title: "The Dragon's Apprentice", views: 28456, rating: 4.8 },
    { id: 2, title: "Moonlight Academy", views: 26789, rating: 4.6 },
    { id: 3, title: "Echoes of Another World", views: 24312, rating: 4.7 }
  ];

  const stats = [
    { title: "Total Novels", value: 246, icon: <BookOpen /> },
    { title: "Users", value: "15.8K", icon: <Users /> },
    { title: "Monthly Views", value: "1.2M", icon: <Eye /> },
  ];

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      console.log("Retrieved token from localStorage:", token);

      if (!token) {
        console.warn("No token found. Redirecting to home.");
        navigate('/');
        return;
      }

      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);

        const currentTime = Date.now() / 1000;
        console.log("Current time:", currentTime, "Token expiry:", decoded.exp);

        if (decoded.exp && decoded.exp < currentTime) {
          console.warn("Token expired. Removing token and redirecting to login.");
          localStorage.removeItem('token');
          navigate('/');
          return;
        }

        // Role check removed since it's not encoded in the token
        console.log("Authentication successful.");
        setLoading(false);

      } catch (error) {
        console.error("Token decode failed:", error);
        localStorage.removeItem('token');
        navigate('/');
      }
    };


    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    console.log("Logging out. Removing token.");
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onLogout={handleLogout} />

      <div className="flex-1 overflow-auto">
        <Navbar activePage={activePage} userRole={userRole} />

        <main className="p-6">
          {activePage === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                        {stat.icon}
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-500">{stat.title}</p>
                        <p className="text-xl font-bold">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Top Novels */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="font-medium text-gray-900">Top Performing Novels</h2>
                </div>
                <div className="p-6">
                  <ul className="divide-y divide-gray-200">
                    {topNovels.map((novel, index) => (
                      <li key={novel.id} className="py-4 flex items-center">
                        <span className={`flex items-center justify-center w-6 h-6 rounded-full mr-3 ${index < 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                          }`}>
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium">{novel.title}</p>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Eye className="h-3 w-3 mr-1" /> {novel.views.toLocaleString()} views
                            <span className="mx-2">•</span>
                            <Star className="h-3 w-3 mr-1" /> {novel.rating} rating
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
