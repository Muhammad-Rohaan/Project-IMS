import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axiosInstance, { n8nAPI } from '../../api/axios.js';
import {
    BanknotesIcon,
    DocumentTextIcon,
    FunnelIcon,
    PlusIcon,
    ArrowPathIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    UserGroupIcon,
    ClipboardDocumentCheckIcon,
    ExclamationTriangleIcon,
    CurrencyDollarIcon,
    CalendarDaysIcon
} from '@heroicons/react/24/outline';

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const StatusPill = ({ status }) => {
    const normalized = String(status || '').toLowerCase();
    const isPaid = normalized === 'paid';
    const isPending = normalized === 'pending';

    const config = isPaid
        ? { bg: 'bg-emerald-500/15', text: 'text-emerald-200', border: 'border-emerald-400/30', icon: CheckCircleIcon }
        : isPending
            ? { bg: 'bg-amber-500/15', text: 'text-amber-200', border: 'border-amber-400/30', icon: ClockIcon }
            : { bg: 'bg-red-500/15', text: 'text-red-200', border: 'border-red-400/30', icon: XCircleIcon };

    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
            <config.icon className="w-3 h-3" aria-hidden="true" />
            {normalized.charAt(0).toUpperCase() + normalized.slice(1)}
        </span>
    );
};

const TabButton = ({ active, onClick, children, icon: Icon }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
            active
                ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-lg shadow-sky-500/30'
                : 'bg-blue-950/50 text-blue-300 border border-blue-400/20 hover:bg-blue-900/60 hover:text-sky-300'
        }`}
        aria-current={active ? 'page' : undefined}
    >
        <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
        {children}
    </button>
);

const ReceptionFeesPage = () => {
    const [activeTab, setActiveTab] = useState('collect');

    /* ===== Collect Fee State ===== */
    const [collectForm, setCollectForm] = useState({
        rollNo: '', month: '', year: new Date().getFullYear(), feesAmount: ''
    });
    const [collectLoading, setCollectLoading] = useState(false);
    const [collectResult, setCollectResult] = useState(null);

    /* ===== Student Status State ===== */
    const [statusRollNo, setStatusRollNo] = useState('');
    const [statusLoading, setStatusLoading] = useState(false);
    const [statusResult, setStatusResult] = useState(null);

    /* ===== Pending Fees State ===== */
    const [pendingFees, setPendingFees] = useState([]);
    const [pendingLoading, setPendingLoading] = useState(false);
    const [pendingFilter, setPendingFilter] = useState('all');

    /* ===== All Students Fee Data State ===== */
    const [studentFeeData, setStudentFeeData] = useState([]);
    const [studentDataLoading, setStudentDataLoading] = useState(false);
    const [studentDataFilter, setStudentDataFilter] = useState('');

    /* ===== Generate Unpaid State ===== */
    const [generateLoading, setGenerateLoading] = useState(false);
    const [generateMonth, setGenerateMonth] = useState(months[new Date().getMonth()]);
    const [generateYear, setGenerateYear] = useState(new Date().getFullYear());
    const [generateResult, setGenerateResult] = useState(null);

    /* ===== Fetch Pending Fees ===== */
    const fetchPendingFees = async () => {
        const toastId = toast.loading('Fetching pending fees...');
        setPendingLoading(true);
        try {
            const res = await axiosInstance.get('/reception/fees/pending');
            const data = res.data;
            const allFees = Array.isArray(data) ? data : (data?.fees || []);
            setPendingFees(allFees);
            toast.success(`Loaded ${allFees.length} fee records`, { id: toastId });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch pending fees', { id: toastId });
        } finally {
            setPendingLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'pending') {
            fetchPendingFees();
        }
    }, [activeTab]);

    /* ===== Fetch Student Fee Data ===== */
    const fetchStudentFeeData = async () => {
        const toastId = toast.loading('Fetching student fee data...');
        setStudentDataLoading(true);
        try {
            const res = await axiosInstance.get('/reception/fees/all-students');
            const data = res.data;
            const students = Array.isArray(data) ? data : (data?.students || []);
            setStudentFeeData(students);
            toast.success(`Loaded ${students.length} student records`, { id: toastId });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch student fee data', { id: toastId });
        } finally {
            setStudentDataLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'student-data') {
            fetchStudentFeeData();
        }
    }, [activeTab]);

    /* ===== Collect Fee ===== */
    const onCollectChange = (e) => {
        const { name, value } = e.target;
        setCollectForm(prev => ({ ...prev, [name]: value }));
    };

    const submitCollect = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Processing fee collection...');
        setCollectLoading(true);
        setCollectResult(null);

        try {
            const res = await axiosInstance.post('/reception/fees/collect', {
                rollNo: collectForm.rollNo.trim(),
                month: collectForm.month,
                year: Number(collectForm.year),
                feesAmount: Number(collectForm.feesAmount)
            });
            toast.success(res.data.message || 'Fee collected successfully', { id: toastId });
            setCollectResult(res.data);
            setCollectForm({ rollNo: '', month: '', year: new Date().getFullYear(), feesAmount: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Fee collection failed', { id: toastId });
        } finally {
            setCollectLoading(false);
        }
    };

    /* ===== Student Fee Status ===== */
    const fetchStatus = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Fetching fee status...');
        setStatusLoading(true);
        setStatusResult(null);

        try {
            const res = await axiosInstance.get(`/reception/fees/student/${encodeURIComponent(statusRollNo.trim())}`);
            toast.success('Fee status fetched', { id: toastId });
            setStatusResult(res.data);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch fee status', { id: toastId });
        } finally {
            setStatusLoading(false);
        }
    };

    /* ===== Generate Unpaid Records ===== */
    const submitGenerateUnpaid = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Generating unpaid fee records...');
        setGenerateLoading(true);
        setGenerateResult(null);

        try {
            const monthName = months.find(m => m === generateMonth) || generateMonth;
            const res = await axiosInstance.post('/reception/fees/generate-unpaid', {
                month: monthName,
                year: Number(generateYear)
            });
            toast.success(res.data.message || 'Unpaid records generated', { id: toastId });
            setGenerateResult(res.data);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to generate unpaid records', { id: toastId });
        } finally {
            setGenerateLoading(false);
        }
    };

    /* ===== Filter & helper functions ===== */
    const getFeeStatus = (f) => (f?.status || f?.feeStatus || 'unpaid');
    const getFeeAmount = (f) => Number(f?.feesAmount ?? f?.feeAmount ?? 0);

    const filteredPendingFees = pendingFilter === 'all'
        ? pendingFees
        : pendingFees.filter(f => getFeeStatus(f).toLowerCase() === pendingFilter.toLowerCase());

    const filteredStudentData = studentDataFilter
        ? studentFeeData.filter(s =>
            s.studentName?.toLowerCase().includes(studentDataFilter.toLowerCase()) ||
            s.rollNo?.toLowerCase().includes(studentDataFilter.toLowerCase()) ||
            s.className?.toLowerCase().includes(studentDataFilter.toLowerCase())
        )
        : studentFeeData;

    /* ===== Summary stats for pending fees ===== */
    const pendingCount = pendingFees.filter(f => getFeeStatus(f).toLowerCase() === 'pending').length;
    const unpaidCount = pendingFees.filter(f => getFeeStatus(f).toLowerCase() === 'unpaid').length;
    const paidCount = pendingFees.filter(f => getFeeStatus(f).toLowerCase() === 'paid').length;
    const totalPendingAmount = pendingFees
        .filter(f => getFeeStatus(f).toLowerCase() === 'pending')
        .reduce((sum, f) => sum + getFeeAmount(f), 0);

    /* ===== Summary stats for student data ===== */
    const getStudentStatus = (s) => (s?.feeStatus || s?.status || 'unpaid');
    const getStudentAmount = (s) => Number(s?.feeAmount ?? s?.feesAmount ?? 0);

    const totalStudents = studentFeeData.length;
    const totalPaidStudents = studentFeeData.filter(s => getStudentStatus(s).toLowerCase() === 'paid').length;
    const totalUnpaidStudents = studentFeeData.filter(s => getStudentStatus(s).toLowerCase() === 'unpaid').length;
    const totalPendingStudents = studentFeeData.filter(s => getStudentStatus(s).toLowerCase() === 'pending').length;

    return (
        <main className="space-y-8" aria-labelledby="fees-title">
            <h1 id="fees-title" className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-sky-500 bg-clip-text text-transparent">
                Fees Management
            </h1>

            {/* Tab Navigation */}
            <nav className="flex flex-wrap gap-3" aria-label="Fee management sections">
                <TabButton active={activeTab === 'collect'} onClick={() => setActiveTab('collect')} icon={BanknotesIcon}>
                    Collect Fee
                </TabButton>
                <TabButton active={activeTab === 'status'} onClick={() => setActiveTab('status')} icon={ClipboardDocumentCheckIcon}>
                    Student Status
                </TabButton>
                <TabButton active={activeTab === 'pending'} onClick={() => setActiveTab('pending')} icon={FunnelIcon}>
                    Pending Fees
                    {pendingCount > 0 && (
                        <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-amber-500 text-white rounded-full">
                            {pendingCount}
                        </span>
                    )}
                </TabButton>
                <TabButton active={activeTab === 'student-data'} onClick={() => setActiveTab('student-data')} icon={UserGroupIcon}>
                    All Students
                </TabButton>
                <TabButton active={activeTab === 'generate'} onClick={() => setActiveTab('generate')} icon={PlusIcon}>
                    Generate Unpaid
                </TabButton>
            </nav>

            {/* ==================== TAB: COLLECT FEE ==================== */}
            {activeTab === 'collect' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <section className="bg-blue-950/50 backdrop-blur-md rounded-2xl border border-blue-400/30 p-6" aria-labelledby="collect-fee-title">
                        <h2 id="collect-fee-title" className="text-2xl font-semibold text-blue-300 mb-4">Collect Fee</h2>

                        <form onSubmit={submitCollect} className="space-y-4">
                            <div className="space-y-1">
                                <label htmlFor="collect-rollNo" className="text-sm text-gray-300 ml-1">Roll No</label>
                                <input
                                    id="collect-rollNo"
                                    name="rollNo"
                                    value={collectForm.rollNo}
                                    onChange={onCollectChange}
                                    className="input-style w-full"
                                    placeholder="e.g. 11A-04"
                                    required
                                    aria-required="true"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label htmlFor="collect-month" className="text-sm text-gray-300 ml-1">Month</label>
                                    <select
                                        id="collect-month"
                                        name="month"
                                        value={collectForm.month}
                                        onChange={onCollectChange}
                                        className="input-style w-full"
                                        required
                                        aria-required="true"
                                    >
                                        <option value="">Select Month</option>
                                        {months.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="collect-year" className="text-sm text-gray-300 ml-1">Year</label>
                                    <input
                                        id="collect-year"
                                        name="year"
                                        type="number"
                                        value={collectForm.year}
                                        onChange={onCollectChange}
                                        className="input-style w-full"
                                        placeholder="Year"
                                        required
                                        aria-required="true"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="collect-amount" className="text-sm text-gray-300 ml-1">Amount</label>
                                <input
                                    id="collect-amount"
                                    name="feesAmount"
                                    type="number"
                                    value={collectForm.feesAmount}
                                    onChange={onCollectChange}
                                    className="input-style w-full"
                                    placeholder="Amount"
                                    required
                                    aria-required="true"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={collectLoading}
                                className="w-full py-4 bg-gradient-to-r from-sky-600 to-blue-600 rounded-xl text-white font-bold hover:shadow-lg transition"
                                aria-label={collectLoading ? 'Processing fee collection…' : 'Collect Fee'}
                            >
                                {collectLoading ? 'Processing…' : 'Collect Fee'}
                            </button>
                        </form>

                        <div aria-live="polite" aria-atomic="true">
                            {collectResult && (
                                <div className="mt-5 space-y-3">
                                    <div className="p-4 rounded-2xl border border-emerald-400/20 bg-emerald-900/10" role="status">
                                        <p className="text-emerald-200 font-semibold">
                                            {collectResult.message || 'Fee collected'}
                                        </p>
                                    </div>
                                    {collectResult.fees && (
                                        <div className="bg-black/30 p-4 rounded-2xl border border-blue-400/10">
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                                <div>
                                                    <p className="text-gray-100 font-semibold">
                                                        {collectResult.fees.studentName || 'Student'} ({collectResult.fees.rollNo || '—'})
                                                    </p>
                                                    <p className="text-gray-300 text-sm">
                                                        Class: {collectResult.fees.className || '—'}
                                                    </p>
                                                </div>
                                                <StatusPill status={collectResult.fees.status} />
                                            </div>
                                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                                                    <p className="text-xs text-gray-400">Period</p>
                                                    <p className="text-gray-100 font-semibold">
                                                        {collectResult.fees.month || '—'} {collectResult.fees.year || ''}
                                                    </p>
                                                </div>
                                                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                                                    <p className="text-xs text-gray-400">Amount</p>
                                                    <p className="text-gray-100 font-semibold">
                                                        {typeof collectResult.fees.feesAmount === 'number' ? collectResult.fees.feesAmount : (collectResult.fees.feesAmount || '—')}
                                                    </p>
                                                </div>
                                                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                                                    <p className="text-xs text-gray-400">Collected By</p>
                                                    <p className="text-gray-100 font-semibold">
                                                        {collectResult.fees.collectedBy || '—'}
                                                    </p>
                                                </div>
                                                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                                                    <p className="text-xs text-gray-400">Collected On</p>
                                                    <p className="text-gray-100 font-semibold">
                                                        {new Date(collectResult.fees.collectedDate).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="bg-blue-950/50 backdrop-blur-md rounded-2xl border border-blue-400/30 p-6" aria-labelledby="status-check-title">
                        <h2 id="status-check-title" className="text-2xl font-semibold text-blue-300 mb-4">Student Fee Status</h2>

                        <form onSubmit={fetchStatus} className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 space-y-1">
                                <label htmlFor="statusRollNo" className="text-sm text-gray-300 ml-1">Roll No</label>
                                <input
                                    id="statusRollNo"
                                    value={statusRollNo}
                                    onChange={(e) => setStatusRollNo(e.target.value)}
                                    className="input-style w-full"
                                    placeholder="Roll No"
                                    required
                                    aria-required="true"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={statusLoading}
                                className="md:mt-6 py-4 px-6 bg-gradient-to-r from-sky-600 to-blue-600 rounded-xl text-white font-bold hover:shadow-lg transition"
                                aria-label={statusLoading ? 'Fetching fee status…' : 'Check status'}
                            >
                                {statusLoading ? 'Loading…' : 'Check'}
                            </button>
                        </form>

                        <div aria-live="polite" aria-atomic="true">
                            {statusResult && (
                                <div className="mt-6 space-y-4">
                                    <div className="bg-black/30 p-4 rounded-2xl border border-blue-400/10" role="status">
                                        <p className="text-gray-200 font-semibold">
                                            {statusResult.student?.name} ({statusResult.student?.rollNo}) — {statusResult.student?.className}
                                        </p>
                                    </div>

                                    <div className="bg-black/30 rounded-2xl border border-blue-400/10 overflow-hidden">
                                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                                            <p className="text-gray-100 font-semibold">Fee Records</p>
                                            <p className="text-gray-300 text-sm">
                                                Total: {Array.isArray(statusResult.fees) ? statusResult.fees.length : 0}
                                            </p>
                                        </div>

                                        {Array.isArray(statusResult.fees) && statusResult.fees.length > 0 ? (
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full text-left text-sm" aria-label="Student fee records table">
                                                    <thead className="bg-white/5 text-gray-300">
                                                        <tr>
                                                            <th scope="col" className="py-3 px-4 font-semibold">#</th>
                                                            <th scope="col" className="py-3 px-4 font-semibold">Status</th>
                                                            <th scope="col" className="py-3 px-4 font-semibold">Month</th>
                                                            <th scope="col" className="py-3 px-4 font-semibold">Year</th>
                                                            <th scope="col" className="py-3 px-4 font-semibold">Amount</th>
                                                            <th scope="col" className="py-3 px-4 font-semibold">Collected By</th>
                                                            <th scope="col" className="py-3 px-4 font-semibold">Collected Date</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-white/10">
                                                        {statusResult.fees.map((fee, idx) => (
                                                            <tr key={`${fee._id || fee.collectedDate || 'fee'}-${idx}`} className="text-gray-200">
                                                                <td className="py-3 px-4">{idx + 1}</td>
                                                                <td className="py-3 px-4"><StatusPill status={fee.status} /></td>
                                                                <td className="py-3 px-4">{fee.month || '—'}</td>
                                                                <td className="py-3 px-4">{fee.year || '—'}</td>
                                                                <td className="py-3 px-4 font-semibold">PKR {Number(fee.feesAmount ?? fee.feeAmount ?? 0).toLocaleString()}</td>
                                                                <td className="py-3 px-4">{fee.collectedBy || '—'}</td>
                                                                <td className="py-3 px-4">{fee.collectedDate ? new Date(fee.collectedDate).toLocaleString() : '—'}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="p-6 text-gray-300" role="status">
                                                No fee records found for this student.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            )}

            {/* ==================== TAB: PENDING FEES ==================== */}
            {activeTab === 'pending' && (
                <section className="space-y-6" aria-labelledby="pending-title">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <h2 id="pending-title" className="text-2xl font-semibold text-blue-300">
                            Pending Fees <span className="text-gray-400 text-lg">({pendingFees.length} records)</span>
                        </h2>
                        <button
                            onClick={fetchPendingFees}
                            disabled={pendingLoading}
                            className="inline-flex items-center gap-2 py-3 px-5 bg-blue-950/50 border border-blue-400/30 rounded-xl text-blue-300 hover:bg-blue-900/60 transition font-semibold"
                            aria-label="Refresh pending fees"
                        >
                            <ArrowPathIcon className={`w-4 h-4 ${pendingLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
                            {pendingLoading ? 'Loading…' : 'Refresh'}
                        </button>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-blue-950/50 backdrop-blur-md rounded-2xl border border-blue-400/30 p-5" role="status">
                            <div className="flex items-center gap-3">
                                <div className="bg-amber-500/20 p-3 rounded-xl"><ClockIcon className="w-6 h-6 text-amber-400" aria-hidden="true" /></div>
                                <div>
                                    <p className="text-xs text-gray-400">Pending</p>
                                    <p className="text-2xl font-extrabold text-amber-300">{pendingCount}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-blue-950/50 backdrop-blur-md rounded-2xl border border-blue-400/30 p-5" role="status">
                            <div className="flex items-center gap-3">
                                <div className="bg-red-500/20 p-3 rounded-xl"><XCircleIcon className="w-6 h-6 text-red-400" aria-hidden="true" /></div>
                                <div>
                                    <p className="text-xs text-gray-400">Unpaid</p>
                                    <p className="text-2xl font-extrabold text-red-300">{unpaidCount}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-blue-950/50 backdrop-blur-md rounded-2xl border border-blue-400/30 p-5" role="status">
                            <div className="flex items-center gap-3">
                                <div className="bg-emerald-500/20 p-3 rounded-xl"><CheckCircleIcon className="w-6 h-6 text-emerald-400" aria-hidden="true" /></div>
                                <div>
                                    <p className="text-xs text-gray-400">Paid</p>
                                    <p className="text-2xl font-extrabold text-emerald-300">{paidCount}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-blue-950/50 backdrop-blur-md rounded-2xl border border-blue-400/30 p-5" role="status">
                            <div className="flex items-center gap-3">
                                <div className="bg-sky-500/20 p-3 rounded-xl"><CurrencyDollarIcon className="w-6 h-6 text-sky-400" aria-hidden="true" /></div>
                                <div>
                                    <p className="text-xs text-gray-400">Amount</p>
                                    <p className="text-2xl font-extrabold text-sky-300">PKR {totalPendingAmount.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2" role="tablist" aria-label="Filter by status">
                        {[
                            { key: 'all', label: 'All', icon: DocumentTextIcon },
                            { key: 'pending', label: 'Pending', icon: ClockIcon },
                            { key: 'unpaid', label: 'Unpaid', icon: XCircleIcon },
                            { key: 'paid', label: 'Paid', icon: CheckCircleIcon }
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setPendingFilter(tab.key)}
                                role="tab"
                                aria-selected={pendingFilter === tab.key}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                                    pendingFilter === tab.key
                                        ? 'bg-sky-600 text-white'
                                        : 'bg-blue-950/50 text-blue-300 border border-blue-400/20 hover:bg-blue-900/60'
                                }`}
                            >
                                <tab.icon className="w-4 h-4" aria-hidden="true" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Fee Records Table */}
                    {pendingLoading ? (
                        <div className="bg-blue-950/50 rounded-2xl border border-blue-400/30 p-8 text-center text-gray-300 animate-pulse">
                            Loading pending fees…
                        </div>
                    ) : (
                        <div className="bg-blue-950/50 backdrop-blur-md rounded-2xl border border-blue-400/30 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-sm" aria-label="Pending fees table">
                                    <thead className="bg-white/5 text-gray-300">
                                        <tr>
                                            <th scope="col" className="py-3 px-4 font-semibold">#</th>
                                            <th scope="col" className="py-3 px-4 font-semibold">Student</th>
                                            <th scope="col" className="py-3 px-4 font-semibold">Roll No</th>
                                            <th scope="col" className="py-3 px-4 font-semibold">Class</th>
                                            <th scope="col" className="py-3 px-4 font-semibold">Month</th>
                                            <th scope="col" className="py-3 px-4 font-semibold">Year</th>
                                            <th scope="col" className="py-3 px-4 font-semibold">Amount</th>
                                            <th scope="col" className="py-3 px-4 font-semibold">Status</th>
                                            <th scope="col" className="py-3 px-4 font-semibold">Collected By</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10">
                                        {filteredPendingFees.length === 0 ? (
                                            <tr>
                                                <td colSpan="9" className="py-8 text-center text-gray-400">
                                                    No fee records found for the selected filter.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredPendingFees.map((fee, idx) => (
                                                <tr key={fee._id || `fee-${idx}`} className="text-gray-200 hover:bg-white/5 transition">
                                                    <td className="py-3 px-4">{idx + 1}</td>
                                                    <td className="py-3 px-4 font-medium">{fee.studentName || '—'}</td>
                                                    <td className="py-3 px-4">{fee.rollNo || '—'}</td>
                                                    <td className="py-3 px-4">{fee.className || '—'}</td>
                                                    <td className="py-3 px-4">{fee.month || '—'}</td>
                                                    <td className="py-3 px-4">{fee.year || '—'}</td>
                                                    <td className="py-3 px-4 font-semibold">PKR {getFeeAmount(fee).toLocaleString()}</td>
                                                    <td className="py-3 px-4"><StatusPill status={getFeeStatus(fee)} /></td>
                                                    <td className="py-3 px-4">{fee.collectedBy || '—'}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </section>
            )}

            {/* ==================== TAB: ALL STUDENTS FEE DATA ==================== */}
            {activeTab === 'student-data' && (
                <section className="space-y-6" aria-labelledby="student-data-title">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <h2 id="student-data-title" className="text-2xl font-semibold text-blue-300">
                            All Students Fee Data <span className="text-gray-400 text-lg">({studentFeeData.length} students)</span>
                        </h2>
                        <div className="flex gap-3">
                            <button
                                onClick={fetchStudentFeeData}
                                disabled={studentDataLoading}
                                className="inline-flex items-center gap-2 py-3 px-5 bg-blue-950/50 border border-blue-400/30 rounded-xl text-blue-300 hover:bg-blue-900/60 transition font-semibold"
                                aria-label="Refresh student fee data"
                            >
                                <ArrowPathIcon className={`w-4 h-4 ${studentDataLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
                                {studentDataLoading ? 'Loading…' : 'Refresh'}
                            </button>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-blue-950/50 backdrop-blur-md rounded-2xl border border-blue-400/30 p-5" role="status">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-500/20 p-3 rounded-xl"><UserGroupIcon className="w-6 h-6 text-blue-400" aria-hidden="true" /></div>
                                <div>
                                    <p className="text-xs text-gray-400">Total Students</p>
                                    <p className="text-2xl font-extrabold text-blue-300">{totalStudents}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-blue-950/50 backdrop-blur-md rounded-2xl border border-blue-400/30 p-5" role="status">
                            <div className="flex items-center gap-3">
                                <div className="bg-emerald-500/20 p-3 rounded-xl"><CheckCircleIcon className="w-6 h-6 text-emerald-400" aria-hidden="true" /></div>
                                <div>
                                    <p className="text-xs text-gray-400">Paid</p>
                                    <p className="text-2xl font-extrabold text-emerald-300">{totalPaidStudents}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-blue-950/50 backdrop-blur-md rounded-2xl border border-blue-400/30 p-5" role="status">
                            <div className="flex items-center gap-3">
                                <div className="bg-amber-500/20 p-3 rounded-xl"><ClockIcon className="w-6 h-6 text-amber-400" aria-hidden="true" /></div>
                                <div>
                                    <p className="text-xs text-gray-400">Pending</p>
                                    <p className="text-2xl font-extrabold text-amber-300">{totalPendingStudents}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-blue-950/50 backdrop-blur-md rounded-2xl border border-blue-400/30 p-5" role="status">
                            <div className="flex items-center gap-3">
                                <div className="bg-red-500/20 p-3 rounded-xl"><XCircleIcon className="w-6 h-6 text-red-400" aria-hidden="true" /></div>
                                <div>
                                    <p className="text-xs text-gray-400">Unpaid</p>
                                    <p className="text-2xl font-extrabold text-red-300">{totalUnpaidStudents}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search Filter */}
                    <div className="relative">
                        <input
                            type="text"
                            value={studentDataFilter}
                            onChange={(e) => setStudentDataFilter(e.target.value)}
                            className="input-style w-full pl-10"
                            placeholder="Search by name, roll no, or class…"
                            aria-label="Search students"
                        />
                        <FunnelIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                    </div>

                    {/* Students Table */}
                    {studentDataLoading ? (
                        <div className="bg-blue-950/50 rounded-2xl border border-blue-400/30 p-8 text-center text-gray-300 animate-pulse">
                            Loading student data…
                        </div>
                    ) : (
                        <div className="bg-blue-950/50 backdrop-blur-md rounded-2xl border border-blue-400/30 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-sm" aria-label="Student fee data table">
                                    <thead className="bg-white/5 text-gray-300">
                                        <tr>
                                            <th scope="col" className="py-3 px-4 font-semibold">#</th>
                                            <th scope="col" className="py-3 px-4 font-semibold">Student Name</th>
                                            <th scope="col" className="py-3 px-4 font-semibold">Roll No</th>
                                            <th scope="col" className="py-3 px-4 font-semibold">Email</th>
                                            <th scope="col" className="py-3 px-4 font-semibold">Class</th>
                                            <th scope="col" className="py-3 px-4 font-semibold">Month</th>
                                            <th scope="col" className="py-3 px-4 font-semibold">Year</th>
                                            <th scope="col" className="py-3 px-4 font-semibold">Amount</th>
                                            <th scope="col" className="py-3 px-4 font-semibold">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10">
                                        {filteredStudentData.length === 0 ? (
                                            <tr>
                                                <td colSpan="9" className="py-8 text-center text-gray-400">
                                                    No student fee data found.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredStudentData.map((student, idx) => (
                                                <tr key={student.studentId || `std-${idx}`} className="text-gray-200 hover:bg-white/5 transition">
                                                    <td className="py-3 px-4">{idx + 1}</td>
                                                    <td className="py-3 px-4 font-medium">{student.studentName || '—'}</td>
                                                    <td className="py-3 px-4">{student.rollNo || '—'}</td>
                                                    <td className="py-3 px-4">{student.email || '—'}</td>
                                                    <td className="py-3 px-4">{student.className || '—'}</td>
                                                    <td className="py-3 px-4">{student.month || '—'}</td>
                                                    <td className="py-3 px-4">{student.year || '—'}</td>
                                                    <td className="py-3 px-4 font-semibold">PKR {getStudentAmount(student).toLocaleString()}</td>
                                                    <td className="py-3 px-4"><StatusPill status={getStudentStatus(student)} /></td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </section>
            )}

            {/* ==================== TAB: GENERATE UNPAID ==================== */}
            {activeTab === 'generate' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <section className="bg-blue-950/50 backdrop-blur-md rounded-2xl border border-blue-400/30 p-6" aria-labelledby="generate-title">
                        <h2 id="generate-title" className="text-2xl font-semibold text-blue-300 mb-4">
                            <ExclamationTriangleIcon className="w-6 h-6 inline mr-2 text-amber-400" aria-hidden="true" />
                            Generate Unpaid Records
                        </h2>

                        <p className="text-gray-400 text-sm mb-6">
                            This will create unpaid fee records for all students who don't already have a fee record for the selected month and year.
                        </p>

                        <form onSubmit={submitGenerateUnpaid} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label htmlFor="gen-month" className="text-sm text-gray-300 ml-1">Month</label>
                                    <select
                                        id="gen-month"
                                        value={generateMonth}
                                        onChange={(e) => setGenerateMonth(e.target.value)}
                                        className="input-style w-full"
                                        required
                                    >
                                        {months.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="gen-year" className="text-sm text-gray-300 ml-1">Year</label>
                                    <input
                                        id="gen-year"
                                        type="number"
                                        value={generateYear}
                                        onChange={(e) => setGenerateYear(Number(e.target.value))}
                                        className="input-style w-full"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={generateLoading}
                                className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl text-white font-bold hover:shadow-lg transition"
                                aria-label={generateLoading ? 'Generating unpaid records…' : 'Generate Unpaid Records'}
                            >
                                {generateLoading ? 'Generating…' : 'Generate Unpaid Records'}
                            </button>
                        </form>

                        {generateResult && (
                            <div className="mt-5 space-y-3" aria-live="polite">
                                <div className="p-4 rounded-2xl border border-emerald-400/20 bg-emerald-900/10" role="status">
                                    <p className="text-emerald-200 font-semibold">{generateResult.message || 'Records generated'}</p>
                                </div>
                                <div className="bg-black/30 p-4 rounded-2xl border border-blue-400/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="text-center">
                                        <p className="text-xs text-gray-400">Month</p>
                                        <p className="text-gray-100 font-semibold">{generateResult.month}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-gray-400">Year</p>
                                        <p className="text-gray-100 font-semibold">{generateResult.year}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-gray-400">Records Created</p>
                                        <p className="text-gray-100 font-semibold">{generateResult.totalCreated || 0}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    <section className="bg-blue-950/50 backdrop-blur-md rounded-2xl border border-blue-400/30 p-6" aria-labelledby="generate-info-title">
                        <h2 id="generate-info-title" className="text-2xl font-semibold text-blue-300 mb-4">How It Works</h2>
                        <div className="space-y-4 text-gray-300">
                            <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className="bg-sky-500/20 p-2 rounded-lg flex-shrink-0">
                                    <BanknotesIcon className="w-5 h-5 text-sky-400" aria-hidden="true" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Select Month & Year</p>
                                    <p className="text-sm text-gray-400">Choose the target month and year for which you want to generate unpaid fee records.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className="bg-amber-500/20 p-2 rounded-lg flex-shrink-0">
                                    <ClockIcon className="w-5 h-5 text-amber-400" aria-hidden="true" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Auto Detection</p>
                                    <p className="text-sm text-gray-400">The system checks all students. If a student already has a fee record for that month/year, it is skipped.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className="bg-red-500/20 p-2 rounded-lg flex-shrink-0">
                                    <XCircleIcon className="w-5 h-5 text-red-400" aria-hidden="true" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Unpaid Records Created</p>
                                    <p className="text-sm text-gray-400">New fee records with status "unpaid" and amount 0 are created only for students without existing records.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className="bg-emerald-500/20 p-2 rounded-lg flex-shrink-0">
                                    <CheckCircleIcon className="w-5 h-5 text-emerald-400" aria-hidden="true" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Ready to Collect</p>
                                    <p className="text-sm text-gray-400">After generating, these records will appear in the Pending Fees tab and can be collected when fees are paid.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            )}
        </main>
    );
};

export default ReceptionFeesPage;
