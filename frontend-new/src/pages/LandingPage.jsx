import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
    BookOpen, Users, BarChart3, ShieldCheck,
    Clock, Award, CheckCircle2, Globe,
    Zap, Smartphone, MessageSquare, ArrowRight
} from 'lucide-react';

const LandingPage = () => {
    const { auth } = useAuth();
    const user = auth.user;

    const getDashboardLink = () => {
        if (!user) return "/login";
        switch (user.role) {
            case 'admin': return "/admin/dashboard";
            case 'teacher': return "/teacher/dashboard";
            case 'student': return "/student/dashboard";
            case 'receptionist': return "/reception/dashboard";
            default: return "/login";
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 transition-all duration-300" aria-label="Main Navigation">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-3 group cursor-pointer">
                            <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center transform group-hover:rotate-6 transition-transform shadow-lg shadow-blue-200">
                                <BookOpen className="text-white w-6 h-6" />
                            </div>
                            <span className="text-xl font-black tracking-tight text-blue-950">
                                The Fort Of <span className="text-blue-600">Science And Commerce Education</span>
                            </span>
                        </div>
                        <div className="hidden md:flex items-center gap-10">
                            <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Features</a>
                            <Link
                                to={getDashboardLink()}
                                className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all hover:shadow-xl hover:shadow-blue-200 active:scale-95"
                                aria-label={user ? "Go to Dashboard" : "Launch Portal"}
                            >
                                {user ? "Go to Dashboard" : "Launch Portal"}
                            </Link>
                        </div>
                        <div className="md:hidden">
                            <Link
                                to={getDashboardLink()}
                                className="inline-flex items-center justify-center px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all"
                                aria-label={user ? "Dashboard" : "Login"}
                            >
                                {user ? "Dashboard" : "Login"}
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="relative z-10">
                {/* Hero Section */}
                <section className="relative pt-12 pb-24 lg:pt-24 lg:pb-32 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
                            <div className="lg:col-span-6 space-y-10">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100/50 text-blue-700 text-xs font-bold uppercase tracking-widest animate-fade-in">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                    </span>
                                    Academic Excellence 2026
                                </div>
                                <h1 className="text-5xl lg:text-[5.5rem] font-[900] tracking-tight text-slate-900 leading-[1] space-y-2">
                                    Modernizing <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 via-sky-600 to-blue-800">
                                        Education Hubs
                                    </span>
                                </h1>
                                <p className="text-xl text-slate-600/90 leading-relaxed max-w-xl font-medium">
                                    The ultimate ERP ecosystem built for forward-thinking institutes. Automate, educate, and elevate with data-driven insights.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-5">
                                    <Link
                                        to={getDashboardLink()}
                                        className="group inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl transition-all hover:shadow-2xl hover:shadow-blue-300/50 active:scale-95"
                                    >
                                        {user ? "Continue to Dashboard" : "Start Your Journey"}
                                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <a
                                        href="#features"
                                        className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-slate-700 bg-white border-2 border-slate-100 hover:border-blue-200 hover:bg-slate-50 rounded-2xl transition-all active:scale-95"
                                    >
                                        Tour Features
                                    </a>
                                </div>

                                {/* Trust Badge */}
                                <div className="pt-10 flex flex-col sm:flex-row items-start sm:items-center gap-8 border-t border-slate-200/60">
                                    <div className="flex -space-x-4">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-sm">
                                                <img src={`https://i.pravatar.cc/150?u=${i + 20}`} alt="User profile" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                        <div className="w-12 h-12 rounded-full border-4 border-white bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                            +1k
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((s) => <Award key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                                        </div>
                                        <p className="text-sm font-semibold text-slate-500">
                                            Trusted by <span className="text-slate-900">1,200+</span> global campuses
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="hidden lg:block lg:col-span-6 relative">
                                <div className="absolute -top-20 -right-20 w-[120%] h-[120%] bg-blue-100/40 rounded-full blur-[100px] -z-10"></div>
                                <div className="relative group">
                                    <div className="absolute -inset-2 bg-gradient-to-br from-blue-500 to-sky-600 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                                    <div className="relative bg-white p-3 rounded-[2.5rem] shadow-2xl border border-slate-100 ring-1 ring-slate-900/5">
                                        <img
                                            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200"
                                            alt="Students collaborating in a modern educational space"
                                            className="w-full h-[600px] object-cover rounded-[2rem] shadow-inner"
                                        />
                                        {/* Floating Stats Card */}
                                        <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 animate-bounce-slow">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
                                                    <Zap className="text-emerald-600 w-7 h-7" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Growth Rate</p>
                                                    <p className="text-3xl font-black text-slate-900">+85%</p>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Floating Feature Card */}
                                        <div className="absolute top-20 -right-12 bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white/50 space-y-3 max-w-[200px]">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="text-blue-500 w-5 h-5" />
                                                <span className="text-sm font-bold">AI Analytics</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full w-[70%] bg-blue-500"></div>
                                            </div>
                                            <p className="text-[10px] text-slate-500 font-medium">Real-time performance tracking active</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-32 bg-white relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                            <div className="max-w-2xl space-y-4">
                                <h2 className="text-blue-600 font-black tracking-[0.2em] uppercase text-sm">Capabilities</h2>
                                <p className="text-4xl lg:text-6xl font-[900] tracking-tight text-slate-900">Designed for the <br />Modern Classroom</p>
                            </div>
                            <p className="text-lg text-slate-500 max-w-md font-medium leading-relaxed">
                                We've built a suite of tools that work in harmony to streamline every aspect of your institution.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {[
                                {
                                    title: "Student Core",
                                    desc: "Comprehensive 360-degree student profiles with automated attendance and behavioral tracking.",
                                    icon: Users,
                                    color: "bg-blue-50 text-blue-600"
                                },
                                {
                                    title: "Fiscal Flow",
                                    desc: "Next-gen fee management with automated invoicing, online payments, and deep financial auditing.",
                                    icon: BarChart3,
                                    color: "bg-emerald-50 text-emerald-600"
                                },
                                {
                                    title: "Result Engine",
                                    desc: "Dynamic result processing with visual analytics and custom report card generation.",
                                    icon: Award,
                                    color: "bg-amber-50 text-amber-600"
                                },
                                {
                                    title: "Fortified Security",
                                    desc: "Bank-grade security protocols with granular role-based permissions for total peace of mind.",
                                    icon: ShieldCheck,
                                    color: "bg-blue-50 text-blue-600"
                                },
                                {
                                    title: "AI Quiz Master",
                                    desc: "Leverage advanced AI to generate curriculum-aligned assessments in seconds.",
                                    icon: Zap,
                                    color: "bg-violet-50 text-sky-600"
                                },
                                {
                                    title: "Pulse Comms",
                                    desc: "Integrated notification system keeping parents, students, and staff perfectly aligned.",
                                    icon: MessageSquare,
                                    color: "bg-rose-50 text-rose-600"
                                }
                            ].map((feature, idx) => (
                                <div key={idx} className="group p-10 rounded-[2.5rem] border border-slate-100 bg-[#F8FAFC] hover:bg-white hover:shadow-2xl hover:shadow-blue-100 hover:-translate-y-2 transition-all duration-500">
                                    <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform`} aria-hidden="true">
                                        <feature.icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-[800] text-slate-900 mb-4">{feature.title}</h3>
                                    <p className="text-slate-600 leading-relaxed font-medium">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-32 relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-blue-600 rounded-[4rem] p-12 lg:p-24 overflow-hidden relative shadow-3xl">
                            {/* Decorative Blobs */}
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse"></div>
                            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-black/10 rounded-full blur-[120px] -ml-64 -mb-64"></div>

                            <div className="relative z-10 text-center space-y-10">
                                <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tight">Ready for a <br />Digital Upgrade?</h2>
                                <p className="text-xl text-blue-100 max-w-2xl mx-auto font-medium">
                                    Join the educational revolution. Get your campus on The Fort Of Science And Commerce Education portal today and experience the difference.
                                </p>
                                <div className="flex flex-col sm:flex-row justify-center gap-6 pt-6">
                                    <Link
                                        to="/login"
                                        className="inline-flex items-center justify-center px-12 py-5 text-xl font-bold text-blue-600 bg-white hover:bg-blue-50 rounded-2xl transition-all hover:shadow-2xl active:scale-95"
                                    >
                                        Get Started Free
                                    </Link>
                                    <button className="inline-flex items-center justify-center px-12 py-5 text-xl font-bold text-white border-2 border-blue-400 hover:bg-blue-500 rounded-2xl transition-all active:scale-95">
                                        Talk to Expert
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200/60 pt-32 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-16 mb-24">
                        <div className="col-span-2 lg:col-span-2 space-y-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                                    <BookOpen className="text-white w-5 h-5" />
                                </div>
                                <span className="text-2xl font-black tracking-tighter text-blue-950">The Fort Of Science And Commerce Education</span>
                            </div>
                            <p className="text-slate-500 max-w-sm leading-relaxed font-medium text-lg">
                                The ecosystem that empowers educators and inspires students to reach their full potential.
                            </p>
                            <div className="flex gap-4">
                                {/* Social icons placeholder */}
                                {[Globe, Smartphone, Smartphone, Smartphone].map((Icon, i) => (
                                    <div key={i} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-black text-slate-900 mb-8 uppercase tracking-widest text-xs">Platform</h4>
                            <ul className="space-y-5 text-slate-500 font-semibold">
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Core Features</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Integrations</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Mobile App</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-black text-slate-900 mb-8 uppercase tracking-widest text-xs">Company</h4>
                            <ul className="space-y-5 text-slate-500 font-semibold">
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Our Vision</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Press Kit</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-black text-slate-900 mb-8 uppercase tracking-widest text-xs">Resources</h4>
                            <ul className="space-y-5 text-slate-500 font-semibold">
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Documentation</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Support Center</a></li>
                                <li><a href="#" className="hover:text-blue-600 transition-colors">Community</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
                        <p className="text-slate-400 font-bold text-sm">© 2026 The Fort Of Science And Commerce Education. Building the future of education.</p>
                        <div className="flex gap-10 text-sm font-bold text-slate-400">
                            <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
                            <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
                            <a href="#" className="hover:text-blue-600 transition-colors">Cookies</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
