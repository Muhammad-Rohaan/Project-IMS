import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axios.js';
import toast from 'react-hot-toast';

const FinancePage = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const toastId = toast.loading('Fetching finance data...');
            try {
                const res = await axiosInstance.get('/admin/finances');
                setData(res.data);
                toast.success('Finance data loaded', { id: toastId });
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to load finance data', { id: toastId });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <main className="space-y-8" aria-labelledby="finance-title">
            <h1 id="finance-title" className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-sky-500 to-pink-500 bg-clip-text text-transparent">
                Finance Management
            </h1>

            <section className="bg-blue-950/50 backdrop-blur-md rounded-2xl border border-blue-400/30 p-6" aria-label="Finance details">
                {loading ? (
                    <p className="text-white text-xl animate-pulse" aria-live="polite">Loading finance data…</p>
                ) : (
                    <div className="space-y-2">
                        <p className="text-gray-200 font-semibold" id="backend-response-label">Backend response</p>
                        <pre className="text-sm text-gray-300 bg-black/30 p-4 rounded-2xl overflow-x-auto border border-blue-400/10" aria-labelledby="backend-response-label">
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    </div>
                )}
            </section>
        </main>
    );
};

export default FinancePage;
