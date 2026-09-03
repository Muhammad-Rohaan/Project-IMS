import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axios.js';

const TeacherDashboard = () => {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    // NEW: Added state for required backend fields
    const [formDataFields, setFormDataFields] = useState({
        title: '',
        subject: '',
        className: ''
    });

    const handleInputChange = (e) => {
        setFormDataFields({ ...formDataFields, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !formDataFields.title || !formDataFields.subject || !formDataFields.className) {
            return toast.error("Please fill all fields and select a file!");
        }

        const toastId = toast.loading('Uploading notes...');
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', formDataFields.title);
        formData.append('subject', formDataFields.subject);
        formData.append('className', formDataFields.className);

        try {
            setUploadStatus('Uploading...');

            // FIX 1: Get token from localStorage (assuming that's where you store it on login)
            const token = localStorage.getItem('token');

            // FIX 2: Correct URL and Add Authorization Header
            const res = await axiosInstance.post('/teacher/upload-notes', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}` // Critical for 'protect' middleware
                },
                withCredentials: true // Helpful for cookies if you use them
            });

            setUploadStatus('Success! Notes uploaded.');
            toast.success('Notes uploaded successfully!', { id: toastId });
            setFile(null);
            setFormDataFields({ title: '', subject: '', className: '' });
            console.log(res.data);
        } catch (err) {
            // FIX 3: Better error logging
            const errorMsg = err.response?.data?.message || 'Upload failed. Try again.';
            setUploadStatus(errorMsg);
            toast.error(errorMsg, { id: toastId });
            console.error("Upload Error:", err.response);
        }
    };

    return (
        <main className="space-y-8 p-6 max-w-4xl mx-auto" aria-label="Teacher Dashboard Overview">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-sky-500 bg-clip-text text-transparent">
                Teacher Dashboard
            </h1>

            {/* Quick Actions (Unchanged) */}
            <section className="bg-blue-950/50 backdrop-blur-md rounded-2xl border border-blue-400/30 p-8 shadow-2xl" aria-labelledby="quick-actions-title">
                <h3 id="quick-actions-title" className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-sky-500 bg-clip-text text-transparent mb-8">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link to="/teacher/results" aria-label="View student results" className="py-6 px-8 rounded-2xl bg-gradient-to-r from-sky-600/70 to-blue-600/70 hover:from-sky-600 hover:to-blue-600 text-white font-bold text-lg transition shadow-lg text-center">View Results</Link>
                    <Link to="/teacher/students" aria-label="Find students" className="py-6 px-8 rounded-2xl bg-gradient-to-r from-blue-600/70 to-sky-600/70 hover:from-blue-600 hover:to-sky-600 text-white font-bold text-lg transition shadow-lg text-center">Find Students</Link>
                </div>
            </section>

            {/* --- UPLOAD SECTION --- */}
            <section className="bg-blue-950/50 backdrop-blur-md rounded-2xl border border-sky-400/30 p-8 shadow-2xl" aria-labelledby="upload-notes-title">
                <h3 id="upload-notes-title" className="text-2xl font-semibold text-sky-400 mb-6">Upload Notes</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <input type="text" name="title" value={formDataFields.title} placeholder="Note Title" onChange={handleInputChange} aria-label='Note title' aria-required="true" className="bg-blue-900/50 border border-sky-500/30 rounded-lg p-2 text-white outline-none" />
                    <input type="text" name="subject" value={formDataFields.subject} placeholder="Subject" onChange={handleInputChange} aria-label='Subject' aria-required="true" className="bg-blue-900/50 border border-sky-500/30 rounded-lg p-2 text-white outline-none" />
                    <input type="text" name="className" value={formDataFields.className} placeholder="Class (e.g. 10A)" onChange={handleInputChange} aria-label='Class name' aria-required="true" className="bg-blue-900/50 border border-sky-500/30 rounded-lg p-2 text-white outline-none" />
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4">
                    <input type="file" onChange={handleFileChange} aria-label='Upload File' aria-required="true" className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition cursor-pointer" />
                    <button type='button' onClick={handleUpload} aria-label='Upload notes' className="w-full md:w-auto py-2 px-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold transition shadow-lg">
                        Upload
                    </button>
                </div>

                {uploadStatus && (
                    <p role="status" aria-live="polite" className={`mt-4 text-sm font-medium ${uploadStatus.includes('Success') ? 'text-green-400' : 'text-blue-300'} animate-pulse`}>
                        {uploadStatus}
                    </p>
                )}
            </section>
        </main>
    );
};

export default TeacherDashboard;