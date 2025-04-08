import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login.jsx';
import Register from './Pages/Register.jsx'
import AdminDashboard from "./Pages/AdminDashboard.jsx";
import NovelListDashboard from "./Pages/NovelListDashboard.jsx";
import EditNovelDashboard from "./Pages/EditNovelDashboard.jsx";
import EditChapterDashboard from "./Pages/EditChapterDashboard.jsx";
import CreateNovelDashboard from "./Pages/CreateNovelDashboard.jsx";
import CreateChapterDashboard from "./Pages/CreateChapterDashboard.jsx";
import InviteCodesPage from "./Pages/InviteCodesPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/novel" element={<NovelListDashboard />} />
        <Route path="/admin/novel/edit/:id" element={<EditNovelDashboard />} />
        <Route path="/admin/novel/:id/edit-chapter/:chapterId" element={<EditChapterDashboard />} />
        <Route path="/admin/novel/create" element={<CreateNovelDashboard />} />
        <Route path="/admin/novel/:id/chapter/create" element={<CreateChapterDashboard />} />
        <Route path="/invites-code" element={<InviteCodesPage />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
