import React from "react";
import { Link } from "react-router-dom";
import {
    BookOpen, BarChart2, User, Users, FileText, Settings,
    LogOut, Languages, UserPlus
} from 'lucide-react';
import axios from 'axios';

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activePage: 'admin',
            adminName: 'Admin',
            adminEmail: 'admin@example.com',
            loading: true,
            error: null
        };
    }

    componentDidMount() {
        this.fetchAdminProfile();
    }

    fetchAdminProfile = async () => {
        try {
            const baseUrl = process.env.REACT_APP_BASE_URL;
            const token = localStorage.getItem('token');
            
            const response = await axios.get(
                `${baseUrl}/api/auth_admin/me`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json"
                    },
                    withCredentials: true
                }
            );
            
            // Fixed: Check for response.data existence and directly access properties
            if (response.data) {
                const { name, email } = response.data.data;
                this.setState({
                    adminName: name || 'Admin',
                    adminEmail: email || 'admin@example.com',
                    loading: false
                });
            } else {
                throw new Error("Invalid response format");
            }
        } catch (error) {
            console.error("Failed to fetch admin profile:", error);
            this.setState({ 
                error: "Failed to load admin profile",
                loading: false 
            });
        }
    };

    setActivePage = (pageId) => {
        this.setState({ activePage: pageId });
    };

    handleLogout = async () => {
        try {
            const baseUrl = process.env.REACT_APP_BASE_URL;
            const token = localStorage.getItem('token');

            await axios.post(
                `${baseUrl}/api/auth_admin/logout`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json"
                    },
                    withCredentials: true
                }
            );

            localStorage.clear();
            window.location.href = "/";
        } catch (error) {
            console.error("Logout failed:", error);
            alert("Logout failed. Please try again.");
        }
    };

    render() {
        const { activePage, adminName, adminEmail, loading, error } = this.state;

        const navItems = [
            { name: 'Dashboard', icon: <BarChart2 />, id: '' },
            { name: 'Novels', icon: <BookOpen />, id: 'novel' },
            { name: 'Translation Novels', icon: <Languages />, id: 'translation-novel' },
            { name: 'Authors', icon: <User />, id: 'author' },
            { name: 'Users', icon: <Users />, id: 'user' },
            { name: 'Comments', icon: <FileText />, id: 'comment' },
            { name: 'Invite Admin', icon: <UserPlus />, id: 'invites-code' },
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
                            {!loading && adminName ? adminName.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <div className="ml-3">
                            {error ? (
                                <p className="text-xs text-red-300">{error}</p>
                            ) : (
                                <>
                                    <p className="text-sm font-medium">
                                        {loading ? 'Loading...' : adminName}
                                    </p>
                                    <p className="text-xs text-indigo-300">
                                        {loading ? 'loading...' : adminEmail}
                                    </p>
                                </>
                            )}
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