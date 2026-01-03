import React, { useMemo } from 'react';
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
    AreaChart, Area
} from 'recharts'; // v2.x or v3.x
import { motion } from 'framer-motion';

const COLORS = ['#4f46e5', '#8b5cf6', '#ec4899', '#f43f5e', '#10b981'];

const Card = ({ title, children, className = "" }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow dark:bg-slate-900 dark:border-slate-800 flex flex-col ${className}`}
    >
        <h3 className="mb-6 font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
            {title}
        </h3>
        <div className="flex-1 min-h-[300px] w-full">{children}</div>
    </motion.div>
);

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-xl dark:bg-slate-800 dark:border-slate-700">
                <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1">{label}</p>
                {payload.map((p, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                        <span className="text-slate-500 dark:text-slate-400 capitalize">{p.name}:</span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">{p.value}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

// --- Student Dashboard ---
export const StudentDashboard = ({ stats }) => {
    if (!stats) return null;
    const { attendance_percentage, avg_marks, recent_attendance, total_exams } = stats;

    const attendData = useMemo(() => [
        { name: 'Present', value: attendance_percentage },
        { name: 'Absent', value: 100 - attendance_percentage }
    ], [attendance_percentage]);

    return (
        <div className="space-y-6">
            {/* Top Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard label="Attendance" value={`${attendance_percentage}%`} color="text-indigo-600" />
                <MetricCard label="Avg Marks" value={avg_marks} color="text-purple-600" />
                <MetricCard label="Exams Taken" value={total_exams} color="text-pink-600" />
                <MetricCard label="Rank" value="Top 10%" color="text-green-600" />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <Card title="Attendance Consistency">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={attendData} layout="vertical" margin={{ left: 0, right: 30, top: 10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} stroke="#f1f5f9" />
                            <XAxis type="number" domain={[0, 100]} hide />
                            <YAxis dataKey="name" type="category" width={60} tick={{ fill: '#64748b', fontSize: 13 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                                {attendData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 0 ? '#6366f1' : '#f43f5e'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                <Card title="Recent Attendance Trend">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={recent_attendance && recent_attendance.map(r => ({ ...r, val: r.status === 'present' ? 1 : 0 }))}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={10} />
                            <YAxis hide domain={[0, 1]} />
                            <Tooltip
                                cursor={{ fill: '#f8fafc' }}
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        const status = payload[0].payload.status;
                                        return (
                                            <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-xl">
                                                <p className="font-semibold text-slate-700 mb-1">{label}</p>
                                                <div className={`px-2 py-1 rounded text-xs font-bold ${status === 'present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {status.toUpperCase()}
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar dataKey="val" radius={[6, 6, 0, 0]} barSize={40}>
                                {recent_attendance && recent_attendance.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.status === 'present' ? '#10b981' : '#ef4444'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
};

// --- Teacher Dashboard ---
export const TeacherDashboard = ({ stats }) => {
    if (!stats) return null;
    const { total_students, classes_count, class_performance } = stats;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
                <MetricCard label="Total Students" value={total_students} />
                <MetricCard label="Classes Assigned" value={classes_count} />
                <MetricCard label="Pending Reports" value="5" color="text-orange-500" />
            </div>

            <div className="grid lg:grid-cols-1 gap-6">
                <Card title="Class Performance Overview (Avg Marks)">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={class_performance} layout="vertical" margin={{ left: 10, right: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} stroke="#f1f5f9" vertical={false} />
                            <XAxis type="number" domain={[0, 100]} hide />
                            <YAxis dataKey="class" type="category" width={80} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                            <Bar dataKey="avg_marks" radius={[0, 6, 6, 0]} barSize={24} name="Average">
                                {class_performance.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
};

// --- Admin Dashboard ---
export const AdminDashboard = ({ stats }) => {
    if (!stats) return null;
    const { attendance_distribution, total_students, total_teachers, attendance_rate, enrollment_growth } = stats;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard label="Total Students" value={total_students} />
                <MetricCard label="Total Faculty" value={total_teachers} />
                <MetricCard label="Attendance Rate" value={`${attendance_rate}%`} color={attendance_rate > 90 ? 'text-green-600' : 'text-yellow-600'} />
                <MetricCard label="System Status" value="Healthy" color="text-green-600" />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <Card title="Attendance Overview">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={attendance_distribution} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                            <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={48}>
                                {attendance_distribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.name === 'Present' ? '#10b981' : '#f43f5e'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
                <Card title="Student Enrollment Growth">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={enrollment_growth || [{ n: 'Jan', Students: 0 }]}>
                            <defs>
                                <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="n" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="Students" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
};

// Helper
const MetricCard = ({ label, value, color = "text-slate-900" }) => (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:bg-slate-900 dark:border-slate-800">
        <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</div>
        <div className={`text-2xl font-bold mt-1 ${color} dark:text-slate-100`}>{value}</div>
    </div>
);
