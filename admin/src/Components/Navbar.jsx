import React from "react";
import { Search, Bell } from "lucide-react";

class Navbar extends React.Component {
    render() {
        const { activePage } = this.props;

        return (
            <header className="bg-white shadow">
                <div className="flex justify-between items-center px-6 h-16">
                    <h1 className="text-xl font-bold text-gray-800">
                        {activePage.charAt(0).toUpperCase() + activePage.slice(1)}
                    </h1>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-64 pl-10 pr-4 py-2 rounded-md border border-gray-300"
                            />
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        </div>
                        <button className="relative p-1 text-gray-600">
                            <Bell className="h-6 w-6" />
                            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                        </button>
                    </div>
                </div>
            </header>
        );
    }
}

export default Navbar;
