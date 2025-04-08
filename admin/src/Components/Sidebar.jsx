import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    BookOpen, BarChart2, User, Users, FileText, Settings,
    LogOut
} from 'lucide-react';
import axios from 'axios';

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activePage: 'admin'
        };
    }

    setActivePage = (pageId) => {
        this.setState({ activePage: pageId });
    };

    handleLogout = async () => {
        try {
            const baseUrl = process.env.REACT_APP_BASE_URL;
            const token = localStorage.getItem('token'); // or sessionStorage.getItem()
    
            await axios.post(
                `${baseUrl}/api/logout`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json"
                    },
                    withCredentials: true
                }
            );
    
            // Now that logout succeeded, clear storage
            localStorage.clear();
    
            // Redirect to login
            window.location.href = "/";
        } catch (error) {
            console.error("Logout failed:", error);
            alert("Logout failed. Please try again.");
        }
    };
    

    render() {
        const { activePage } = this.state;

        const navItems = [
            { name: 'Dashboard', icon: <BarChart2 />, id: '' },
            { name: 'Novels', icon: <BookOpen />, id: 'novel' },
            { name: 'Authors', icon: <User />, id: 'author' },
            { name: 'Users', icon: <Users />, id: 'user' },
            { name: 'Comments', icon: <FileText />, id: 'comment' },
            { name: 'Settings', icon: <Settings />, id: 'setting' }
        ];

        return (
            <div className="w-64 bg-indigo-800 text-white relative min-h-screen">
                <div className="flex items-center p-4 border-b border-indigo-700">
                    <BookOpen className="h-6 w-6" />
                    <span className="ml-2 font-bold text-lg">FW Admin</span>
                </div>

                <nav className="p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            to={`/admin/${item.id}`}
                            key={item.id}
                            className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${activePage === item.id
                                    ? 'bg-indigo-900 text-white'
                                    : 'text-indigo-100 hover:bg-indigo-700'
                                }`}
                            onClick={() => this.setActivePage(item.id)}
                        >
                            <span className="mr-3">{item.icon}</span>
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-indigo-700">
                    <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                            A
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium">Admin</p>
                            <p className="text-xs text-indigo-300">admin@faizal.com</p>
                        </div>
                        <LogOut
                            className="ml-auto h-4 w-4 text-indigo-300 hover:text-white cursor-pointer"
                            onClick={this.handleLogout}
                            title="Logout"
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Sidebar;
