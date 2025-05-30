import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home.jsx';
import Novels from "./Pages/Novels.jsx";
import Translations from "./Pages/Translations.jsx";
import Rankings from "./Pages/Rankings.jsx";
import NovelPage from './Pages/NovelPage.jsx';
import TranslationNovelPage from './Pages/TranslationNovelPage.jsx';
import ChapterPage from "./Pages/ChapterPage.jsx";
import TranslationChapterPage from "./Pages/TranslationChapterPage";
import Updates from "./Pages/Updates.jsx";
import Login from "./Pages/Login.jsx"
import Register from "./Pages/Register.jsx"
import SearchPage from "./Pages/SearchPage.jsx";
import BookmarksPage from "./Pages/BookmarksPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/novels" element={<Novels />} />
        <Route path="/translations" element={<Translations />} />
        <Route path="/rankings" element={<Rankings/>} />
        <Route path="/novel/:id" element={<NovelPage />} />
        <Route path="/translation-novel/:id" element={<TranslationNovelPage />} />
        <Route path="/novel/:novelId/chapter/:chapterId" element={<ChapterPage />} />
        <Route path="/translation-novel/:novelId/chapter/:chapterId" element={<TranslationChapterPage />} />
        <Route path="/updates" element={<Updates/>} />
        <Route path="/search" element={<SearchPage />} />
        
        {/* User */}
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/bookmarks" element={<BookmarksPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
