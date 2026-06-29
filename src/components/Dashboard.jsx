import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    // 📝 NOTES KI STATES
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    // 🔥 EDITING KI STATES (New Additions)
    const [isEditing, setIsEditing] = useState(false); // Track karega ki Edit chal raha hai ya Create
    const [editingId, setEditingId] = useState(null); // Kis note ko edit kar rahe hain, uski ID

    const token = localStorage.getItem('token');

    // Live Backend Base URL Variable
    const BACKEND_URL = 'https://note-x-backend-priyanshu-projects2.vercel.app';

    // 1. USER PROFILE AND NOTES FETCH LOGIC
    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                // 📡 API 1: User Profile Fetch Karo (LIVE URL)
                const userRes = await axios.get(`${BACKEND_URL}/api/auth/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserData(userRes.data);

                // 📡 API 2: User Ke Saare Notes Fetch Karo (LIVE URL)
                const notesRes = await axios.get(`${BACKEND_URL}/api/notes/all`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNotes(notesRes.data.notes);

                setLoading(false);
            } catch (error) {
                console.error("Dashboard data fetch karne me dikkat:", error);
                localStorage.removeItem('token');
                navigate('/login');
            }
        };

        fetchDashboardData();
    }, [navigate, token]);

    // ➕ SUBMIT HANDLER (Form submit hone par decide karega ki Create karna hai ya Update)
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!title || !description) {
            alert("Bhai kuch toh likho, khali note mat banao!");
            return;
        }

        if (isEditing) {
            // 📝 Agar Edit mode chal raha hai
            handleUpdateNote();
        } else {
            // ➕ Agar Normal mode chal raha hai
            handleAddNote();
        }
    };

    // 🔥 FUNCTION 1: NAYA NOTE ADD KARNA (LIVE URL)
    const handleAddNote = async () => {
        try {
            const res = await axios.post(`${BACKEND_URL}/api/notes/create`,
                { title, description },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setNotes([res.data.note, ...notes]);
                setTitle('');
                setDescription('');
            }
        } catch (error) {
            console.error("Note banane me jhol hua:", error);
            alert("Note nahi ban paya bhai!");
        }
    };

    // 🔥 FUNCTION 2: NOTE UPDATE (EDIT) KARNA (LIVE URL)
    const handleUpdateNote = async () => {
        try {
            const res = await axios.put(`${BACKEND_URL}/api/notes/update/${editingId}`,
                { title, description },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                // UI ko update karne ke liye map chalayenge aur purane note ko naye se replace kar denge
                const updatedNotes = notes.map(note =>
                    note._id === editingId ? res.data.note : note
                );
                setNotes(updatedNotes);

                // Reset to Normal Mode
                setTitle('');
                setDescription('');
                setIsEditing(false);
                setEditingId(null);
            }
        } catch (error) {
            console.error("Note update karne me jhol hua:", error);
            alert("Note update nahi ho paya bhai!");
        }
    };

    // 🔥 FUNCTION 3: EDIT MODE TRIGGER KARNA (Card ke Edit button par click karne par)
    const handleEditClick = (note) => {
        setIsEditing(true);
        setEditingId(note._id);
        setTitle(note.title); // Form fields ko purane data se bhar diya
        setDescription(note.description);
    };

    // 🗑️ FUNCTION 4: NOTE DELETE KARNE KA HANDLE (LIVE URL)
    const handleDeleteNote = async (id) => {
        if (!window.confirm("Bhai, sach me is note ka safaya karna hai?")) return;

        try {
            const res = await axios.delete(`${BACKEND_URL}/api/notes/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                const updatedNotes = notes.filter(note => note._id !== id);
                setNotes(updatedNotes);

                // Agar chalte edit me kisi ne wahi note delete kar diya toh form reset karo
                if (editingId === id) {
                    setTitle('');
                    setDescription('');
                    setIsEditing(false);
                    setEditingId(null);
                }
            }
        } catch (error) {
            console.error("Note udane me dikkat hui:", error);
            alert("Note nahi ud paya bhai!");
        }
    };

    // 🚪 LOGOUT LOGIC
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-950 text-white font-bold text-xl">
                Loading Secure Data... ⏳
            </div>
        );
    }

    // Baaki ka return statement jahan JSX components (HTML/Tailwind) hain, wahi purane code wala rahega...

    return (
        <div className="min-h-screen bg-gray-950 font-sans text-white p-6 relative">
            {/* Background Glow */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-900/10 via-gray-950 to-gray-950 pointer-events-none"></div>

            <div className="relative z-10 max-w-6xl mx-auto space-y-8">

                {/* 👤 TOP ROW: Profile Info Card & Logout */}
                <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg">
                    <div className="text-left">
                        <h1 className="text-2xl font-extrabold tracking-tight">
                            Welcome, <span className="text-teal-400 capitalize">{userData?.name || "Bhai"}</span>! 👑
                        </h1>
                        <p className="text-xs text-gray-400 mt-1">ID: <span className="font-mono text-teal-300">{userData?._id}</span> | Email: {userData?.email}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 text-red-400 px-5 py-2 rounded-xl text-sm font-bold transition duration-300 active:scale-95"
                    >
                        Logout Account
                    </button>
                </div>

                {/* 📋 MAIN CONTENT GRID: Left me Form, Right me Notes List */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN: Naya/Edit Note Banane Ka Form */}
                    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 h-fit shadow-md sticky top-6">
                        {/* 🔥 Form Heading Dynamically change hogi */}
                        <h2 className="text-xl font-bold mb-4 text-teal-400">
                            {isEditing ? "Note Edit Karo ✏️" : "Naya Note Jodho ✍️"}
                        </h2>

                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Note Title</label>
                                <input
                                    type="text"
                                    placeholder="Title likho..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Description</label>
                                <textarea
                                    rows="4"
                                    placeholder="Kuch accha sa likho bhai..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 transition resize-none"
                                />
                            </div>

                            {/* 🔥 Button text dynamically badlega */}
                            <button
                                type="submit"
                                className={`w-full text-gray-950 font-bold py-2.5 rounded-xl text-sm transition duration-300 active:scale-95 ${isEditing ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-teal-500 hover:bg-teal-600'}`}
                            >
                                {isEditing ? "Update Note 🔥" : "Add Note 🔥"}
                            </button>

                            {/* ❌ Edit Mode Cancel karne ka chota button */}
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditingId(null);
                                        setTitle('');
                                        setDescription('');
                                    }}
                                    className="w-full bg-gray-800 hover:bg-gray-700 text-gray-400 font-medium py-2 rounded-xl text-xs transition mt-2"
                                >
                                    Cancel Editing
                                </button>
                            )}
                        </form>
                    </div>

                    {/* RIGHT COLUMN: Saare Notes Render Karne Ki Jagah */}
                    <div className="lg:grid-cols-1 lg:col-span-2 space-y-4">
                        <h2 className="text-xl font-bold text-gray-300">Tumhare Notes ({notes.length})</h2>

                        {notes.length === 0 ? (
                            <div className="bg-gray-900/50 border border-dashed border-gray-800 rounded-2xl p-12 text-center text-gray-500 text-sm">
                                Bhai abhi tak koi note nahi banaya tumne. Left side se shuruat karo! 🚀
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {notes.map((note) => (
                                    <div key={note._id} className="bg-gray-900 p-5 rounded-2xl border border-gray-800 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                                        <div>
                                            <div className="flex justify-between items-start gap-2 mb-2">
                                                <h3 className="text-lg font-bold text-white capitalize">{note.title}</h3>

                                                {/* ⚙️ ACTION BUTTONS (Edit & Delete) */}
                                                <div className="flex gap-2">
                                                    {/* ✏️ Edit Button */}
                                                    <button
                                                        onClick={() => handleEditClick(note)}
                                                        className="text-gray-400 hover:text-yellow-400 text-xs font-semibold transition p-1.5 bg-gray-950 rounded-lg border border-gray-800 hover:border-yellow-500/30"
                                                        title="Edit Note"
                                                    >
                                                        ✏️
                                                    </button>
                                                    {/* 🗑️ Delete Button */}
                                                    <button
                                                        onClick={() => handleDeleteNote(note._id)}
                                                        className="text-gray-400 hover:text-red-400 text-xs font-semibold transition p-1.5 bg-gray-950 rounded-lg border border-gray-800 hover:border-red-500/30"
                                                        title="Delete Note"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </div>

                                            <p className="text-gray-400 text-sm whitespace-pre-wrap">{note.description}</p>
                                        </div>
                                        <div className="text-[10px] text-gray-500 mt-4 border-t border-gray-800/50 pt-2 font-mono">
                                            Banaya: {new Date(note.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Dashboard;