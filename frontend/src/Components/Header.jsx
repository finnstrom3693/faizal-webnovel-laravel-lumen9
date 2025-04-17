import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Clock, Star, BookOpen } from "lucide-react";

class Header extends React.Component {
    state = {
        latest: null,
    };

    async componentDidMount() {
        try {
            const baseUrl = process.env.REACT_APP_BASE_URL;

            const novelRes = await fetch(`${baseUrl}/api/novel`);
            const translationRes = await fetch(`${baseUrl}/api/translation_novel`);

            const novels = await novelRes.json();
            const translations = await translationRes.json();

            const latestNovel = novels.data?.[0];
            const latestTranslation = translations.data?.[0];

            const fetchLatestChapter = async (type, novel) => {
                const chapterRes = await fetch(`${baseUrl}/api/${type}/${novel.id}/chapter?novel_id=${novel.id}`);
                const chapterData = await chapterRes.json();
                const latestChapter = chapterData.data?.[0];

                return latestChapter
                    ? {
                        type,
                        novelId: novel.id,
                        novelTitle: novel.title,
                        chapterTitle: latestChapter.title,
                        updatedAt: latestChapter.updated_at,
                        rating: novel.rating || "N/A",
                        chapterId: latestChapter.id,
                    }
                    : null;
            };

            const [latestNovelChapter, latestTranslationChapter] = await Promise.all([
                latestNovel ? fetchLatestChapter("novel", latestNovel) : null,
                latestTranslation ? fetchLatestChapter("translation_novel", latestTranslation) : null,
            ]);

            let latest = null;
            if (latestNovelChapter && latestTranslationChapter) {
                latest = new Date(latestNovelChapter.updatedAt) > new Date(latestTranslationChapter.updatedAt)
                    ? latestNovelChapter
                    : latestTranslationChapter;
            } else {
                latest = latestNovelChapter || latestTranslationChapter;
            }

            this.setState({ latest });
        } catch (error) {
            console.error("Failed to fetch latest release:", error);
        }
    }

    render() {
        const { latest } = this.state;

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
                                    {latest ? (
                                        <>
                                            <h4 className="text-xl font-bold mb-1">{latest.novelTitle}</h4>
                                            <p className="text-sm mb-3">
                                                {latest.chapterTitle || "New Chapter Available!"}
                                            </p>
                                            <Link
                                                to={`/${latest.type.replace('_', '-')}/${latest.novelId}/chapter/${latest.chapterId}`}
                                                className="inline-flex items-center px-3 py-2 bg-indigo-700 text-white rounded hover:bg-indigo-800 text-sm font-medium"
                                            >
                                                <BookOpen className="mr-1 w-4 h-4" />
                                                Read Now
                                            </Link>
                                        </>
                                    ) : (
                                        <p>Loading latest release...</p>
                                    )}
                                </div>
                                {latest && (
                                    <div className="mt-4 flex justify-between items-center text-sm">
                                        <div className="flex items-center">
                                            <Clock className="h-4 w-4 mr-1" />
                                            <span>{new Date(latest.updatedAt).toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Star className="h-4 w-4 mr-1 text-yellow-300" />
                                            <span>{latest.rating}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Header;
