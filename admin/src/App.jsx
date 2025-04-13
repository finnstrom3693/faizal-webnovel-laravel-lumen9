import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login.jsx';
import Register from './Pages/Register.jsx'
import AdminDashboard from "./Pages/AdminDashboard.jsx";
import InviteCodesPage from "./Pages/InviteCodesPage.jsx";

// Novel
import NovelListDashboard from "./Pages/NovelListDashboard.jsx";
import EditNovelDashboard from "./Pages/EditNovelDashboard.jsx";
import EditChapterDashboard from "./Pages/EditChapterDashboard.jsx";
import CreateNovelDashboard from "./Pages/CreateNovelDashboard.jsx";
import CreateChapterDashboard from "./Pages/CreateChapterDashboard.jsx";

// Translation Novel
import TranslationNovelListDashboard from "./Pages/TranslationNovelListDashboard.jsx";
import EditTranslationNovelDashboard from "./Pages/EditTranslationNovelDashboard.jsx";
import EditTranslationChapterDashboard from "./Pages/EditTranslationChapterDashboard.jsx";
import CreateTranslationNovelDashboard from "./Pages/CreateTranslationNovelDashboard.jsx";
import CreateTranslationChapterDashboard from "./Pages/CreateTranslationChapterDashboard.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/invites-code" element={<InviteCodesPage />} />

        {/* Novel */}
        <Route path="/admin/novel" element={<NovelListDashboard />} />
        <Route path="/admin/novel/edit/:id" element={<EditNovelDashboard />} />
        <Route path="/admin/novel/edit/:novelId/edit-chapter/:chapterId" element={<EditChapterDashboard />} />
        <Route path="/admin/novel/create" element={<CreateNovelDashboard />} />
        <Route path="/admin/novel/:id/chapter/create" element={<CreateChapterDashboard />} />
        
        {/* Translation Novel */}
        <Route path="/admin/translation-novel" element={<TranslationNovelListDashboard />} />
        <Route path="/admin/translation-novel/edit/:id" element={<EditTranslationNovelDashboard />} />
        <Route path="/admin/translation-novel/edit/:novelId/edit-chapter/:chapterId" element={<EditTranslationChapterDashboard />} />
        <Route path="/admin/translation-novel/create" element={<CreateTranslationNovelDashboard />} />
        <Route path="/admin/translation-novel/:id/chapter/create" element={<CreateTranslationChapterDashboard />} />
        
      </Routes>
    </Router>
  );
}

export default App;
