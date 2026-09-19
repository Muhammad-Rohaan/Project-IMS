import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axios.js';

const TeacherResultsPage = () => {
    const [uploadForm, setUploadForm] = useState({ className: '', testName: '', file: null });
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [uploadResult, setUploadResult] = useState(null);

    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(null);

    const fetchAll = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axiosInstance.get('/teacher/all-results');
            setResults(res.data.results || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load results');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (publicId) => {
        if (!window.confirm('Are you sure you want to delete this result?')) return;

        const toastId = toast.loading('Deleting result...');
        setDeleteLoading(publicId);
        try {
            await axiosInstance.delete(`/teacher/delete-result/${encodeURIComponent(publicId)}`);
            toast.success('Result deleted successfully!', { id: toastId });
            await fetchAll();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete result', { id: toastId });
        } finally {
            setDeleteLoading(null);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const handleUploadChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'file') {
            setUploadForm(prev => ({ ...prev, file: files?.[0] || null }));
            return;
        }
        setUploadForm(prev => ({ ...prev, [name]: value }));
    };

    const submitUpload = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Uploading result image...');
        setUploadLoading(true);
        setUploadError('');
        setUploadResult(null);

        try {
            const formData = new FormData();
            formData.append('className', uploadForm.className.trim().toUpperCase());
            formData.append('testName', uploadForm.testName.trim());
            formData.append('image', uploadForm.file);

            await axiosInstance.post('/teacher/upload-result', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUploadResult();
            setUploadForm({ className: '', testName: '', file: null });
            toast.success('Result uploaded successfully!', { id: toastId });
            await fetchAll();
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Upload failed';
            setUploadError(errorMsg);
            toast.error(errorMsg, { id: toastId });
        } finally {
            setUploadLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-sky-500 bg-clip-text text-transparent">
                Results
            </h1>

            <div className="bg-blue-950/50 backdrop-blur-md rounded-2xl border border-blue-400/30 p-6">
                <h2 className="text-2xl font-semibold text-blue-300 mb-4">Upload Result Image</h2>

                {uploadError && (
                    <div className="p-3 mb-4 text-sm text-red-300 bg-red-900/30 rounded-2xl border border-red-500/30" role="alert" aria-live="assertive">
                        {uploadError}
                    </div>
                )}

                <form onSubmit={submitUpload} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        name="className"
                        value={uploadForm.className}
                        onChange={handleUploadChange}
                        className="input-style w-full"
                        placeholder="Class (e.g. 11)"
                        aria-label="Class Name"
                        aria-required="true"
                        required
                    />
                    <input
                        name="testName"
                        value={uploadForm.testName}
                        onChange={handleUploadChange}
                        className="input-style w-full"
                        placeholder="Test Name"
                        aria-label="Test Name"
                        aria-required="true"
                        required
                    />
                    <input
                        name="file"
                        type="file"
                        accept="image/*"
                        onChange={handleUploadChange}
                        className="input-style w-full"
                        aria-label="Upload Result Image"
                        aria-required="true"
                        required
                    />

                    <div className="md:col-span-3">
                        <button
                            type="submit"
                            disabled={uploadLoading || !uploadForm.file}
                            className="w-full py-4 bg-gradient-to-r from-sky-600 to-blue-600 rounded-xl text-white font-bold hover:shadow-lg transition"
                            aria-label={uploadLoading ? 'Uploading result...' : 'Upload result'}
                        >
                            {uploadLoading ? 'Uploading…' : 'Upload'}
                        </button>
                    </div>
                </form>

                {uploadResult && (
                    <pre className="mt-5 text-sm text-gray-300 bg-black/30 p-4 rounded-2xl overflow-x-auto border border-blue-400/10" aria-label="Upload Result Details">
                        {JSON.stringify(uploadResult, null, 2)}
                    </pre>
                )}
            </div>

            <div className="bg-blue-950/50 backdrop-blur-md rounded-2xl border border-blue-400/30 p-6">
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-2xl font-semibold text-blue-300">All Results</h2>
                    <button
                        onClick={fetchAll}
                        className="py-3 px-6 rounded-2xl bg-blue-800/60 hover:bg-blue-800 text-white font-bold transition"
                        aria-label="Refresh results list"
                    >
                        Refresh
                    </button>
                </div>

                {loading ? (
                    <p className="text-white text-xl animate-pulse mt-4" aria-live="polite">Loading results…</p>
                ) : error ? (
                    <p className="text-red-300 mt-4" role="alert" aria-live="polite">{error}</p>
                ) : results.length === 0 ? (
                    <p className="text-gray-300 mt-4" aria-live="polite">No results uploaded yet.</p>
                ) : (
                    <div className="overflow-x-auto mt-4">
                        <table className="w-full text-left border border-blue-400/30 rounded-2xl overflow-hidden" aria-label="Test Results Table">
                            <thead className="bg-blue-900/50">
                                <tr>
                                    <th scope="col" className="p-4 text-blue-300">Class</th>
                                    <th scope="col" className="p-4 text-blue-300">Test</th>
                                    <th scope="col" className="p-4 text-blue-300">Image</th>
                                    <th scope="col" className="p-4 text-blue-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map(r => (
                                    <tr key={r._id} className="border-t border-blue-400/20">
                                        <td className="p-4 text-white">{r.className}</td>
                                        <td className="p-4 text-gray-200">{r.testName}</td>
                                        <td className="p-4">
                                            <a
                                                href={r.imageUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-300 hover:text-blue-200 underline"
                                                aria-label={`Open result image for ${r.testName} class ${r.className}`}
                                            >
                                                Open
                                            </a>
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleDelete(r.publicId)}
                                                disabled={deleteLoading === r.publicId}
                                                className="text-red-400 hover:text-red-300 font-medium transition disabled:opacity-50"
                                                aria-label={`Delete result for ${r.testName} class ${r.className}`}
                                            >
                                                {deleteLoading === r.publicId ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherResultsPage;
