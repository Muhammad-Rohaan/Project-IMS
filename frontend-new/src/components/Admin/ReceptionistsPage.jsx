import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axios.js';
import RegisterReceptionist from '../../components/Admin/RegisterReceptionist.jsx'; // Modal for register and edit

const ReceptionistsPage = () => {
    const [receptionists, setReceptionists] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showRegister, setShowRegister] = useState(false);

    useEffect(() => {
        fetchReceptionists();
    }, []);

    const fetchReceptionists = async () => {
        try {
            const response = await axiosInstance.get('/admin/az-reception/fetch-all-receptionists');
            setReceptionists(response.data.receptionists || []);
        } catch (err) {
            console.error("Error fetching receptionists:", err);
            toast.error('Failed to load receptionists');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (receptionRegId) => {
        if (!window.confirm(`Are you sure you want to delete receptionist ${receptionRegId}?`)) return;

        const toastId = toast.loading('Deleting receptionist...');
        try {
            // Ye line change kar do — /api add karo
            await axiosInstance.delete(`/admin/az-reception/delete-receptionist/${receptionRegId}`);

            setReceptionists(receptionists.filter(r => r.receptionRegId !== receptionRegId));
            toast.success('Receptionist deleted successfully!', { id: toastId });
        } catch (err) {
            console.error("Delete error:", err);
            const msg = err.response?.data?.msg || 'Delete failed';
            toast.error('Error: ' + msg, { id: toastId });
        }
    };

    const handleRegisterSuccess = () => {
        setShowRegister(false);
        fetchReceptionists();
    };

    if (loading) {
        return <p className="text-white text-center text-2xl animate-pulse" aria-live="polite">Loading receptionists...</p>;
    }

    return (
        <div className="space-y-8" aria-label="Receptionists Management Page">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-sky-500 bg-clip-text text-transparent">
                    Receptionists ({receptionists.length})
                </h1>

                <button
                    onClick={() => setShowRegister(true)}
                    className="py-3 px-6 rounded-2xl bg-gradient-to-r from-sky-600/80 to-blue-600/80 hover:from-sky-600 hover:to-blue-600 text-white font-bold transition shadow-lg"
                    aria-label="Register a new receptionist"
                >
                    + Register Receptionist
                </button>
            </div>

            {receptionists.length === 0 ? (
                <p className="text-center text-gray-400 text-xl py-10" aria-live="polite">No receptionists registered yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border border-blue-400/30 rounded-2xl overflow-hidden" aria-label="Receptionists List">
                        <thead className="bg-blue-900/50">
                            <tr>
                                <th scope="col" className="p-4 text-blue-300">Reg ID</th>
                                <th scope="col" className="p-4 text-blue-300">Name</th>
                                <th scope="col" className="p-4 text-blue-300">Email</th>
                                <th scope="col" className="p-4 text-blue-300">Salary</th>
                                <th scope="col" className="p-4 text-blue-300">Contact</th>
                                <th scope="col" className="p-4 text-blue-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {receptionists.map(rec => (
                                <tr key={rec._id} className="border-t border-blue-400/20">
                                    <td className="p-4 text-white">{rec.receptionRegId}</td>
                                    <td className="p-4 text-white">{rec.receptionistFullName}</td>
                                    <td className="p-4 text-gray-300">{rec.userId?.email || 'N/A'}</td>
                                    <td className="p-4 text-gray-300">Rs.{rec.salary?.toLocaleString()}</td>
                                    <td className="p-4 text-gray-300">{rec.contact}</td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleDelete(rec.receptionRegId)}
                                            className="text-red-400 hover:text-red-300 font-medium"
                                            aria-label={`Delete receptionist ${rec.receptionistFullName}`}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showRegister && (
                <RegisterReceptionist
                    onClose={() => setShowRegister(false)}
                    onSuccess={handleRegisterSuccess}
                />
            )}
        </div>
    );
};

export default ReceptionistsPage;
