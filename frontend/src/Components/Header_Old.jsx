import React from "react";
import { Link } from "react-router-dom";  // Add this import
import { ChevronRight, Clock, Star } from "lucide-react";  // Add icon imports if not already present

class Header extends React.Component {
    render() {
        return (
            <div className="bg-indigo-700 text-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                    <div className="md:flex md:items-center md:justify-between">
                        <div className="md:w-1/2">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                                Discover Original and Translated Webnovels
                            </h1>
                            <p className="text-indigo-100 mb-6 text-lg">
                                Immerse yourself in captivating stories from around the world.
                            </p>
                            <div className="flex space-x-4">
                                <Link to="/novels" className="bg-white text-indigo-700 px-4 py-2 rounded-md font-medium flex items-center hover:bg-indigo-50">
                                    Browse Library <ChevronRight className="ml-1 h-4 w-4" />
                                </Link>
                                <Link to="/rankings" className="bg-transparent border border-white text-white px-4 py-2 rounded-md font-medium flex items-center hover:bg-indigo-600">
                                    Top Ranked Novels
                                </Link>
                            </div>
                        </div>
                        <div className="hidden md:block md:w-1/2 mt-10 md:mt-0">
                            <div className="bg-indigo-600 p-8 rounded-lg shadow-xl">
                                <div className="bg-white rounded p-4 text-indigo-800">
                                    <h3 className="font-bold mb-2">LATEST RELEASE</h3>
                                    <h4 className="text-xl font-bold mb-1">The Dragon's Apprentice</h4>
                                    <p className="text-sm mb-3">Chapter 43: The Council's Decision</p>
                                    <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                                    <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                                    <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                                </div>
                                <div className="mt-4 flex justify-between items-center text-sm">
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-1" />
                                        <span>3 hours ago</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Star className="h-4 w-4 mr-1 text-yellow-300" />
                                        <span>4.8</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Header;