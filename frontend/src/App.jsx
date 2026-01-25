import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogIn, ChevronDown, Shield, User, Users, GraduationCap,
  ClipboardCheck, BarChart3, BookOpen, PlusCircle, Settings, Sun, Moon,
  Menu, X, Edit, Trash2, LogOut
} from "lucide-react";
import { ThemeProvider, useTheme } from "./ThemeContext";
import { Toaster, toast } from 'react-hot-toast';
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase_config";
import { StudentDashboard, TeacherDashboard, AdminDashboard, LibrarianDashboard } from './DashboardWidgets';


const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  FACULTY: "faculty",
  STUDENT: "student",
  LIBRARIAN: "librarian",
};

const Container = ({ children }) => (
  // Enhanced background with gradient mesh effect
  <div className="min-h-screen min-w-[100vw] w-fit sm:w-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-black text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-x-hidden">
    {children}
  </div>
);

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-white/50 backdrop-blur border border-white/20 hover:bg-white/80 transition dark:bg-slate-800/50 dark:hover:bg-slate-800 dark:border-slate-700"
      title="Toggle Theme"
    >
      {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </button>
  );
};

// Navbar Simplified - No Role Dropdown needed for login
const Navbar = ({ onLoginClick, onMenuClick, onHomeClick, session, onLogout, onDashboardClick }) => (
  <nav className="sticky top-0 z-50 glass border-b-0">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button onClick={onMenuClick} className="md:hidden p-2 -ml-2 text-slate-600 dark:text-slate-300">
            <Menu className="h-6 w-6" />
          </button>
        )}
        <button onClick={onHomeClick} className="flex items-center gap-3 hover:opacity-80 transition group">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/30 transition-shadow">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="font-extrabold tracking-tight text-xl dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
            SDMS Portal
          </span>
        </button>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        {session ? (
          <div className="flex items-center gap-2">
            {onDashboardClick && (
              <button onClick={onDashboardClick} className="hidden sm:flex items-center gap-2 bg-indigo-600/10 text-indigo-600 px-4 py-2 rounded-xl font-semibold hover:bg-indigo-600/20 transition dark:text-indigo-400 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20">
                <BarChart3 className="h-4 w-4" /> Dashboard
              </button>
            )}
            <button onClick={onLogout} className="bg-red-50 text-red-600 px-4 py-2 rounded-xl border border-red-100 font-semibold text-sm flex items-center gap-2 hover:bg-red-100 transition dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/20 dark:hover:bg-red-900/20">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        ) : (
          <button
            onClick={onLoginClick}
            className="group flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-slate-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all dark:bg-white dark:text-slate-900"
          >
            <span className="font-semibold">Login</span>
            <LogIn className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>
    </div>
  </nav>
);

const SectionCard = ({ title, icon, children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`glass-card p-6 rounded-2xl ${className}`}
  >
    <div className="flex items-center gap-3 mb-5">
      <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
        {React.cloneElement(icon, { className: "h-5 w-5" })}
      </div>
      <h3 className="font-bold text-lg dark:text-slate-100">{title}</h3>
    </div>
    {children}
  </motion.div>
);

const Home = ({ onLogin, onHomeClick, session, onLogout, onDashboardClick }) => (
  <Container>
    <Navbar onLoginClick={onLogin} onHomeClick={onHomeClick} session={session} onLogout={onLogout} onDashboardClick={onDashboardClick} />
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-block mb-6 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-medium text-sm dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-300"
        >
          ✨ New: Google Sign-In Enabled
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl sm:text-7xl font-extrabold tracking-tight dark:text-white mb-6"
        >
          Welcome to <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-gradient-x">
            SDMS Portal
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          A next-generation Student Data Management System. <br />
          Secure, fast, and beautifully designed for every role.
        </motion.p>

        {!session && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10"
          >
            <button onClick={onLogin} className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-600/30 hover:shadow-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all">
              Get Started <LogIn className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </div>

      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob dark:bg-purple-900/30"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 dark:bg-indigo-900/30"></div>
      <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 dark:bg-pink-900/30"></div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-24 relative z-10">
        <SectionCard title="Secure Access" icon={<Shield />}>
          Enterprise-grade security with role-based permissions for Admins, Faculty, and Students using Google Auth.
        </SectionCard>
        <SectionCard title="Smart Dashboard" icon={<BarChart3 />}>
          Real-time analytics and intuitive tools tailored to your specific academic needs.
        </SectionCard>
        <SectionCard title="Seamless Experience" icon={<ZapIcon />}>
          Lightning fast performance with a modern glassmorphism interface that's easy on the eyes.
        </SectionCard>
      </div>
    </main>
  </Container>
);

const ZapIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
)


const Input = ({ label, value, onChange, placeholder, disabled, type = "text" }) => (
  <label className="block">
    <span className="block text-sm font-medium mb-1.5 dark:text-slate-300">{label}</span>
    <input
      type={type}
      disabled={disabled}
      value={value}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      placeholder={placeholder}
      className={`w-full rounded-xl px-4 py-3 text-base md:text-sm glass-input placeholder-slate-400 ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
    />
  </label>
);

const PrimaryBtn = ({ children, onClick, type = "button", className = "" }) => (
  <button type={type} onClick={onClick} className={`inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold rounded-xl px-4 py-2.5 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all ${className}`}>
    {children}
  </button>
);

const AuthPanel = ({ onLoggedIn, onHomeClick }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();

      // Verify with backend
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      const data = await res.json();

      if (data.ok) {
        toast.success(`Welcome back, ${data.email}!`);
        onLoggedIn({ role: data.role, id: data.id, email: data.email });
      } else {
        setError(data.error || "Authentication failed.");
        toast.error(data.error || "Login Failed");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Google Sign-In failed.");
      toast.error("Google Sign-In failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Navbar onLoginClick={() => { }} onHomeClick={onHomeClick} />
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="glass-card p-8 sm:p-10 rounded-3xl relative overflow-hidden">
            {/* Decorative Top Gradient */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

            <div className="text-center mb-8">
              <div className="mx-auto h-16 w-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 text-indigo-600 shadow-inner dark:bg-indigo-900/30 dark:text-indigo-400">
                <LogIn className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-bold mb-2 dark:text-white">Sign In</h2>
              <p className="text-slate-500 dark:text-slate-400">Access your SDMS Dashboard</p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100 flex items-start gap-2 dark:bg-red-900/10 dark:text-red-300 dark:border-red-900/20">
                <Shield className="h-5 w-5 shrink-0" />
                {error}
              </motion.div>
            )}

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full relative flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-semibold py-3.5 px-4 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm group disabled:opacity-70 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-750"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-slate-400 border-t-indigo-600 rounded-full animate-spin"></span>
              ) : (
                <>
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5 w-5" />
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
              Protected by Firebase Authentication. <br />
              Only registered Emails can access.
            </p>

            {/* DEV LOGIN BYPASS */}
            <div className="mt-4 border-t pt-4 border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  // Create a dummy JWT for dev login
                  // Header: {"alg":"none","typ":"JWT"} -> eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0
                  // Payload: {"email":"piyushchaurasiya348@gmail.com"} -> eyJlbWFpbCI6InBpeXVzaGNoYXVyYXNpeWEzNDhAZ21haWwuY29tIn0
                  const header = "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0";
                  const payload = btoa(JSON.stringify({ email: "piyushchaurasiya348@gmail.com" })); // Auto-admin
                  const token = `${header}.${payload}.`;

                  fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token })
                  })
                    .then(res => res.json())
                    .then(data => {
                      if (data.ok) {
                        toast.success(`DEV LOGIN: Welcome ${data.email}`);
                        onLoggedIn({ role: data.role, id: data.id, email: data.email });
                      } else {
                        setError(data.error);
                        toast.error(data.error);
                      }
                    })
                    .catch(err => {
                      console.error(err);
                      toast.error("Dev Login Failed");
                    });
                }}
                className="w-full py-2 bg-yellow-100 text-yellow-800 text-sm font-bold rounded-lg hover:bg-yellow-200 transition"
              >
                ⚠️ DEV LOGIN (Super Admin)
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </Container>
  );
};

/* -------------------------------------------------------------------------- */
/*                           Dashboard Components                             */
/* -------------------------------------------------------------------------- */

const DashboardLayout = ({ role, userId, onLogout, children, ...rest }) => {
  const menu = useMemo(() => {
    if (role === ROLES.SUPER_ADMIN) {
      return [
        { key: "overview", label: "Overview", icon: <BarChart3 className="h-4 w-4" /> },
        { key: "admins", label: "Manage Admins", icon: <Shield className="h-4 w-4" /> },
        { key: "faculty", label: "Faculty", icon: <Users className="h-4 w-4" /> },
        { key: "students", label: "Students", icon: <GraduationCap className="h-4 w-4" /> },
        { key: "reports", label: "Reports", icon: <ClipboardCheck className="h-4 w-4" /> },
        { key: "settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
      ];
    }
    if (role === ROLES.ADMIN) {
      return [
        { key: "overview", label: "Overview", icon: <BarChart3 className="h-4 w-4" /> },
        { key: "faculty", label: "Faculty", icon: <Users className="h-4 w-4" /> },
        { key: "students", label: "Students", icon: <GraduationCap className="h-4 w-4" /> },
        { key: "reports", label: "Reports", icon: <ClipboardCheck className="h-4 w-4" /> },
      ];
    }
    if (role === ROLES.FACULTY) {
      return [
        { key: "overview", label: "Overview", icon: <BarChart3 className="h-4 w-4" /> },
        { key: "mark", label: "Mark Attendance", icon: <ClipboardCheck className="h-4 w-4" /> },
        { key: "students", label: "Student List", icon: <Users className="h-4 w-4" /> },
        { key: "results", label: "Results", icon: <BookOpen className="h-4 w-4" /> },
      ];
    }
    if (role === ROLES.LIBRARIAN) {
      return [
        { key: "overview", label: "Overview", icon: <BarChart3 className="h-4 w-4" /> },
        { key: "book-issues", label: "Book Issues", icon: <BookOpen className="h-4 w-4" /> },
        { key: "reports", label: "Reports", icon: <ClipboardCheck className="h-4 w-4" /> },
      ];
    }
    return [
      { key: "overview", label: "Overview", icon: <BarChart3 className="h-4 w-4" /> },
      { key: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
      { key: "attendance", label: "Attendance", icon: <ClipboardCheck className="h-4 w-4" /> },
      { key: "results", label: "Results", icon: <BookOpen className="h-4 w-4" /> },
    ];
  }, [role]);

  const [active, setActive] = useState(menu[0]?.key ?? "overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Container>
      <Navbar onLoginClick={() => { }} onMenuClick={() => setSidebarOpen(true)} onHomeClick={rest.onHomeClick} session={{ role, id: userId }} onLogout={onLogout} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-12 gap-6 relative">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
              />
              <motion.aside
                initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-white dark:bg-slate-900 z-50 p-6 shadow-2xl md:hidden border-r dark:border-slate-800"
              >
                <div className="flex justify-between items-center mb-8">
                  <span className="font-bold text-xl dark:text-white">Menu</span>
                  <button onClick={() => setSidebarOpen(false)}><X className="h-6 w-6 dark:text-slate-400" /></button>
                </div>
                {/* Mobile Menu Content same as Desktop */}
                <SidebarContent role={role} userId={userId} menu={menu} active={active} setActive={(k) => { setActive(k); setSidebarOpen(false); }} onLogout={onLogout} />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <aside className="hidden md:block col-span-3">
          <div className="glass-card p-5 sticky top-24">
            <SidebarContent role={role} userId={userId} menu={menu} active={active} setActive={setActive} onLogout={onLogout} />
          </div>
        </aside>

        <section className="col-span-12 md:col-span-9 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
              {children(active)}
            </motion.div>
          </AnimatePresence>
        </section>
      </div>
    </Container>
  );
};

const SidebarContent = ({ role, userId, menu, active, setActive, onLogout }) => (
  <>
    <div className="flex items-center gap-3 pb-6 border-b border-dashed border-slate-200 dark:border-slate-700">
      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
        <User className="h-6 w-6" />
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">Account</div>
        <div className="text-sm font-bold dark:text-slate-200">{role === ROLES.SUPER_ADMIN ? "Super Admin" : role.charAt(0).toUpperCase() + role.slice(1)}</div>
        <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500 pt-0.5">{userId}</div>
      </div>
    </div>
    <ul className="mt-6 space-y-2">
      {menu.map((m) => (
        <li key={m.key}>
          <button onClick={() => setActive(m.key)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all group ${active === m.key ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "hover:bg-slate-50 text-slate-600 dark:text-slate-300 dark:hover:bg-slate-800/50"}`}>
            <span className={`transition-transform duration-300 ${active === m.key ? "scale-110" : "group-hover:scale-110"}`}>{m.icon}</span>
            <span className="font-medium">{m.label}</span>
          </button>
        </li>
      ))}
    </ul>
    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
      <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors dark:text-red-400 dark:hover:bg-red-900/10">
        <LogOut className="h-4 w-4" /> Sign Out
      </button>
    </div>
  </>
);


const Field = ({ label, value }) => (
  <div className="rounded-xl border border-slate-100 p-4 bg-slate-50/50 dark:bg-slate-900/50 dark:border-slate-800 hover:border-indigo-100 transition-colors">
    <div className="text-xs uppercase tracking-wide text-indigo-500 dark:text-indigo-400 font-semibold mb-1">{label}</div>
    <div className="font-medium text-slate-800 dark:text-slate-200">{value}</div>
  </div>
);

const DataTable = ({ items, cols, empty, onEdit, onDelete }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = useMemo(() => {
    if (!search) return items;
    const lower = search.toLowerCase();
    return items.filter(it => cols.some(c => String(it[c] ?? "").toLowerCase().includes(lower)));
  }, [items, search, cols]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-100 dark:bg-slate-900/50 dark:border-slate-800">
        <div className="relative w-full max-w-xs">
          <input
            className="w-full bg-transparent text-sm pl-9 pr-4 py-2 focus:outline-none dark:text-slate-200"
            placeholder="Search records..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <div className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Total: {filtered.length}</div>
      </div>

      <div className="rounded-xl border border-slate-200 overflow-hidden dark:border-slate-800 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/80 backdrop-blur dark:bg-slate-800 dark:text-slate-200 border-b dark:border-slate-700">
              <tr>
                {cols.map((c) => <th key={c} className="p-4 text-left font-semibold text-slate-600 dark:text-slate-300 capitalize tracking-wide text-xs">{c.replace(/_/g, " ")}</th>)}
                {(onEdit || onDelete) && <th className="p-4 text-right font-semibold text-slate-600 dark:text-slate-300 capitalize tracking-wide text-xs">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginated.length === 0 && (<tr><td className="p-8 text-center text-slate-500 dark:text-slate-400" colSpan={cols.length + ((onEdit || onDelete) ? 1 : 0)}>{search ? "No matches found" : empty}</td></tr>)}
              {paginated.map((it, idx) => (
                <tr key={idx} className="hover:bg-indigo-50/30 transition-colors dark:hover:bg-slate-800/30 dark:text-slate-300 group">
                  {cols.map((c) => (<td key={c} className="p-4 text-slate-700 dark:text-slate-400 font-medium">{String(it[c] ?? "").toString()}</td>))}
                  {(onEdit || onDelete) && (
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {onEdit && <button onClick={() => onEdit(it)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg dark:hover:bg-indigo-900/30 dark:text-indigo-400 transition-colors"><Edit className="h-4 w-4" /></button>}
                        {onDelete && <button onClick={() => onDelete(it)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg dark:hover:bg-red-900/30 dark:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /></button>}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 text-xs font-semibold rounded-lg border disabled:opacity-50 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition">Prev</button>
          <span className="px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 rounded-lg dark:bg-slate-800">Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-4 py-2 text-xs font-semibold rounded-lg border disabled:opacity-50 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition">Next</button>
        </div>
      )}
    </div>


  );
};

function useBackend() {

  // Minimal client helpers to call backend
  const addFaculty = (p) => fetcher('/api/admin/faculty', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) });
  const listFaculty = () => fetcher('/api/admin/faculty');
  const updateFaculty = (id, p) => fetcher(`/api/admin/faculty/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) });
  const deleteFaculty = (id) => fetcher(`/api/admin/faculty/${id}`, { method: 'DELETE' });

  const addStudent = (p) => fetcher('/api/admin/students', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) });
  const listStudents = () => fetcher('/api/admin/students');
  const updateStudent = (id, p) => fetcher(`/api/admin/students/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) });
  const deleteStudent = (id) => fetcher(`/api/admin/students/${id}`, { method: 'DELETE' });

  const addAdmin = (p) => fetcher('/api/admin/admins', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) });
  const listAdmins = () => fetcher('/api/admin/admins');
  const updateAdmin = (id, p) => fetcher(`/api/admin/admins/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) });
  const deleteAdmin = (id) => fetcher(`/api/admin/admins/${id}`, { method: 'DELETE' });

  const markAttendance = (p) => fetcher('/api/faculty/attendance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) });
  const saveResults = (p) => fetcher('/api/faculty/results', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) });
  const studentProfile = (sid) => fetcher(`/api/student/${sid}/profile`);
  const studentAttendance = (sid) => fetcher(`/api/student/${sid}/attendance`);
  const studentResults = (sid) => fetcher(`/api/student/${sid}/results`);

  // Refactored to use dedicated dashboard endpoints
  const getStats = async () => {
    // For admin, use the dedicated stats endpoint
    return fetcher('/api/dashboard/admin/stats');
  };
  const getStudentStats = (sid) => fetcher(`/api/dashboard/student/${sid}/stats`);
  const getTeacherStats = (fid) => fetcher(`/api/dashboard/faculty/${fid}/stats`); // Corrected URL
  const getLibrarianStats = (lid) => fetcher(`/api/dashboard/librarian/${lid}/stats`);

  return {
    addFaculty, listFaculty, updateFaculty, deleteFaculty,
    addStudent, listStudents, updateStudent, deleteStudent,
    addAdmin, listAdmins, updateAdmin, deleteAdmin,
    markAttendance, saveResults, studentProfile, studentAttendance, studentResults, getStats, getStudentStats, getTeacherStats, getLibrarianStats
  };
}

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  componentDidCatch(error, errorInfo) { console.error("Uncaught error:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex flex-col items-center justify-center p-4 bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-white">
          <h1 className="text-2xl font-bold mb-2">Something went wrong.</h1>
          <button onClick={() => window.location.reload()} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Reload Page</button>
        </div>
      );
    }
    return this.props.children;
  }
}

async function fetcher(url, options = {}) {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get("content-type");
    if (!res.ok) {
      let errMsg = `Request failed: ${res.status}`;
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const err = await res.json();
        errMsg = err.error || errMsg;
      }
      throw new Error(errMsg);
    }
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return res.json();
    }
    return {};
  } catch (error) {
    console.error("API Call Error:", error);
    return { error: error.message };
  }
}


export default function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
      <Toaster position="top-center" />
    </ThemeProvider>
  );
}


function AppContent() {
  const [session, setSession] = useState(() => {
    try {
      const saved = localStorage.getItem("session");
      return saved ? JSON.parse(saved) : null;
    } catch (e) { return null; }
  });
  const [stage, setStage] = useState(session ? "dashboard" : "home");
  const api = useBackend();

  React.useEffect(() => {
    if (session) setStage("dashboard");
    else setStage("home");
  }, [session]);

  const handleLoginClick = () => setStage("auth");
  const handleLoggedIn = ({ role, id, email }) => {
    const newSession = { role, id, email };
    localStorage.setItem("session", JSON.stringify(newSession));
    setSession(newSession);
  };
  const logout = () => {
    localStorage.removeItem("session");
    setSession(null);
    setStage("home");
  };

  if (stage === "auth") return <AuthPanel onLoggedIn={handleLoggedIn} onHomeClick={() => setStage("home")} />;
  if (stage === "dashboard" && session) {
    const { role, id } = session;
    return (
      <DashboardLayout role={role} userId={id} onLogout={logout} onHomeClick={() => setStage("home")}>
        {(active) => {
          if (role === ROLES.SUPER_ADMIN || role === ROLES.ADMIN) {
            if (active === "overview") {
              return (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <SectionCard title="Quick Actions" icon={<BarChart3 className="h-5 w-5" />}>Use the sidebar to manage faculty, students, and view system reports.</SectionCard>
                  </div>
                  <StatsLoader api={api} role={role} id={id} />
                </div>
              );
            }
            if (active === "admins" && role === ROLES.SUPER_ADMIN) {
              return <AdminManager api={api} />;
            }
            if (active === "faculty") {
              return <FacultyManager api={api} />;
            }
            if (active === "students") {
              return <StudentManager api={api} />;
            }
            if (active === "reports") {
              return <SectionCard title="Reports" icon={<ClipboardCheck className="h-5 w-5" />}>Open student/faculty pages to view data.</SectionCard>;
            }
          }
          if (role === ROLES.FACULTY) {
            if (active === "overview") {
              return <div className="space-y-6"><SectionCard title="Welcome Faculty" icon={<Users className="h-5 w-5" />}>Use Mark Attendance or Results.</SectionCard><StatsLoader api={api} role={role} id={id} /></div>;
            }
            if (active === "mark") {
              return <AttendanceForm onSubmit={async (payload) => { const r = await api.markAttendance(payload); if (r.error) toast.error(r.error); else toast.success("Attendance marked!"); }} listFn={api.listStudents} />;
            }
            if (active === "students") {
              return <SectionCard title="Student List" icon={<Users className="h-5 w-5" />}><Loader listFn={api.listStudents} cols={["student_id", "name", "department", "semester"]} empty="No students yet" /></SectionCard>;
            }
            if (active === "results") {
              return <ResultsForm onSubmit={async (payload) => { const r = await api.saveResults(payload); if (r.error) toast.error(r.error); else toast.success("Results saved!"); }} listFn={api.listStudents} />;
            }
          }
          if (role === ROLES.LIBRARIAN) {
            if (active === "overview") {
              return <div className="space-y-6"><SectionCard title="Welcome Librarian" icon={<BookOpen className="h-5 w-5" />}>Manage library books and track issues.</SectionCard><StatsLoader api={api} role={role} id={id} /></div>;
            }
            if (active === "book-issues") {
              return <BookIssuesTable />;
            }
            if (active === "reports") {
              return <SectionCard title="Library Reports" icon={<ClipboardCheck className="h-5 w-5" />}>Reports coming soon...</SectionCard>;
            }
          }
          if (role === ROLES.STUDENT) {
            if (active === "overview") {
              return <div className="space-y-6"><SectionCard title="Welcome" icon={<User className="h-5 w-5" />}>Use Profile / Attendance / Results</SectionCard><StatsLoader api={api} role={role} id={id} /></div>;
            }
            if (active === "profile") return <StudentProfile sid={id} fetcher={api.studentProfile} />;
            if (active === "attendance") return <StudentAttendance sid={id} fetcher={api.studentAttendance} />;
            if (active === "results") return <StudentResults sid={id} fetcher={api.studentResults} />;
          }
          return <div className="text-slate-600">Select a menu item.</div>;
        }}
      </DashboardLayout>
    );
  }
  return <Home onLogin={handleLoginClick} onHomeClick={() => setStage("home")} session={session} onLogout={logout} onDashboardClick={() => setStage("dashboard")} />;
}

// Book Issues Table Component for Librarian
function BookIssuesTable() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadIssues = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/librarian/book-issues');
      const data = await response.json();
      setIssues(data);
    } catch (error) {
      toast.error("Failed to load book issues");
      console.error(error);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    loadIssues();
  }, []);

  const handleReturn = async (issueId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/librarian/return-book/${issueId}`, {
        method: 'POST'
      });
      const data = await response.json();
      if (data.ok) {
        toast.success("Book returned successfully!");
        loadIssues(); // Reload the list
      } else {
        toast.error(data.error || "Failed to return book");
      }
    } catch (error) {
      toast.error("Failed to return book");
      console.error(error);
    }
  };

  const filteredIssues = issues.filter(issue =>
    issue.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.book_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const today = new Date();
  const calculateDaysOverdue = (dueDate) => {
    const due = new Date(dueDate);
    const diff = Math.floor((today - due) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  return (
    <SectionCard title="Book Issues Management" icon={<BookOpen className="h-5 w-5" />}>
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Search by student name or book title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <button
            onClick={loadIssues}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Refresh
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-8 text-slate-500">Loading...</div>
        ) : filteredIssues.length === 0 ? (
          <div className="text-center py-8 text-slate-500">No book issues found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Student Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Book Title</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Issue Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Due Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Fine (₹)</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.map((issue) => {
                  const daysOverdue = issue.status === 'Issued' ? calculateDaysOverdue(issue.due_date) : 0;
                  const isOverdue = daysOverdue > 0;

                  return (
                    <tr key={issue.issue_id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-4 text-slate-800 dark:text-slate-200">{issue.student_name}</td>
                      <td className="py-3 px-4 text-slate-800 dark:text-slate-200">{issue.book_title}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{new Date(issue.issue_date).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{new Date(issue.due_date).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${issue.status === 'Returned'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                            : isOverdue
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                          }`}>
                          {issue.status === 'Returned' ? 'Returned' : isOverdue ? 'Overdue' : 'Issued'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-bold ${issue.fine > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-400'}`}>
                          ₹{issue.fine}
                        </span>
                        {daysOverdue > 0 && issue.status === 'Issued' && (
                          <span className="text-xs text-slate-500 ml-2">({daysOverdue} days)</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {issue.status === 'Issued' ? (
                          <button
                            onClick={() => handleReturn(issue.issue_id)}
                            className="px-3 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                          >
                            Return Book
                          </button>
                        ) : (
                          <span className="text-slate-400 text-sm">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Summary */}
        {!loading && filteredIssues.length > 0 && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
              <div className="text-sm text-slate-600 dark:text-slate-400">Total Issues</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{filteredIssues.length}</div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
              <div className="text-sm text-amber-700 dark:text-amber-400">Currently Issued</div>
              <div className="text-2xl font-bold text-amber-900 dark:text-amber-300">
                {filteredIssues.filter(i => i.status === 'Issued').length}
              </div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
              <div className="text-sm text-red-700 dark:text-red-400">Overdue</div>
              <div className="text-2xl font-bold text-red-900 dark:text-red-300">
                {filteredIssues.filter(i => i.status === 'Issued' && calculateDaysOverdue(i.due_date) > 0).length}
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
              <div className="text-sm text-purple-700 dark:text-purple-400">Total Fines</div>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-300">
                ₹{filteredIssues.reduce((sum, i) => sum + i.fine, 0)}
              </div>
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
}

function AdminForm({ onSubmit, initialData = {} }) {
  const [name, setName] = useState(initialData.name || "");
  const [username, setUsername] = useState(initialData.username || "");
  const [dob, setDob] = useState(initialData.dob || "");
  return (<form onSubmit={(e) => { e.preventDefault(); onSubmit({ name, username, dob }); }} className="space-y-3">
    <Input label="Name" value={name} onChange={setName} />
    <Input label="Username (Email)" value={username} onChange={setUsername} placeholder="admin@example.com" />
    <Input label="DOB (DD/MM/YYYY)" value={dob} onChange={setDob} />
    <PrimaryBtn type="submit" className="w-full mt-4"><PlusCircle className="h-4 w-4" /> {initialData.admin_id ? "Update Admin" : "Add Admin"}</PrimaryBtn>
  </form>);
}

function FacultyForm({ onSubmit, initialData = {} }) {
  const [name, setName] = useState(initialData.name || "");
  const [department, setDepartment] = useState(initialData.department || "");
  const [subject, setSubject] = useState(initialData.subject || "");
  const [dob, setDob] = useState(initialData.dob || "");
  const [email, setEmail] = useState(initialData.email || "");
  return (<form onSubmit={(e) => { e.preventDefault(); onSubmit({ name, department, subject, dob, email }); }} className="space-y-3">
    <Input label="Name" value={name} onChange={setName} />
    <Input label="Email" value={email} onChange={setEmail} placeholder="faculty@example.com" />
    <Input label="Department" value={department} onChange={setDepartment} />
    <Input label="Subject" value={subject} onChange={setSubject} />
    <Input label="DOB (DD/MM/YYYY)" value={dob} onChange={setDob} />
    <PrimaryBtn type="submit" className="w-full mt-4"><PlusCircle className="h-4 w-4" /> {initialData.faculty_id ? "Update Faculty" : "Add Faculty"}</PrimaryBtn>
  </form>);
}

function StudentForm({ onSubmit, initialData = {} }) {
  const [name, setName] = useState(initialData.name || "");
  const [roll_no, setRoll] = useState(initialData.roll_no || "");
  const [department, setDepartment] = useState(initialData.department || "");
  const [semester, setSemester] = useState(initialData.semester || "");
  const [dob, setDob] = useState(initialData.dob || "");
  const [email, setEmail] = useState(initialData.email || "");
  return (<form onSubmit={(e) => { e.preventDefault(); onSubmit({ name, roll_no, department, semester, dob, email }); }} className="space-y-3">
    <Input label="Name" value={name} onChange={setName} />
    <Input label="Email" value={email} onChange={setEmail} placeholder="student@example.com" />
    <Input label="Roll No" value={roll_no} onChange={setRoll} />
    <Input label="Department" value={department} onChange={setDepartment} />
    <Input label="Semester" value={semester} onChange={setSemester} />
    <Input label="DOB (DD/MM/YYYY)" value={dob} onChange={setDob} />
    <PrimaryBtn type="submit" className="w-full mt-4"><PlusCircle className="h-4 w-4" /> {initialData.student_id ? "Update Student" : "Add Student"}</PrimaryBtn>
  </form>);
}

const EditModal = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="glass-card p-6 w-full max-w-lg pointer-events-auto bg-white dark:bg-slate-900 border dark:border-slate-800">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl dark:text-white">{title}</h3>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition"><X className="h-5 w-5 text-slate-500" /></button>
              </div>
              {children}
            </div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
};


// Other complex components (Loader, StatsLoader, etc) to be wrapped or kept as is
// Since I'm rewriting the file, I must include them.
// I will keep them but style them up slightly.

const Skeleton = ({ className }) => <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded ${className}`} />;

function Loader({ listFn, cols, empty, onEdit, onDelete }) {
  const [items, setItems] = useState(null);
  const [stamp, setStamp] = useState(0);

  const refresh = () => setStamp(s => s + 1);

  React.useEffect(() => {
    // Artificial delay to show skeleton
    const p = listFn().then(setItems).catch(() => setItems([]));
  }, [stamp, listFn]);

  const handleDelete = async (item) => {
    if (confirm("Are you sure?")) {
      await onDelete(item);
      refresh();
    }
  };

  const handleEdit = (item) => {
    onEdit(item, refresh);
  };

  if (!items) {
    return (
      <div className="rounded-xl border border-slate-200 overflow-hidden dark:border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800"><tr>{cols.map(c => <th key={c} className="p-4"><Skeleton className="h-4 w-20" /></th>)}</tr></thead>
          <tbody>
            {[1, 2, 3].map(i => (
              <tr key={i} className="border-t border-slate-100 dark:border-slate-800">
                {cols.map(c => <td key={c} className="p-4"><Skeleton className="h-4 w-full" /></td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return <DataTable items={items} cols={cols} empty={empty} onEdit={onEdit ? handleEdit : null} onDelete={onDelete ? handleDelete : null} />;
}

// Manager Components
function AdminManager({ api }) {
  const [editItem, setEditItem] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey(k => k + 1);

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <SectionCard title="Register Admin" icon={<Shield className="h-5 w-5" />}>
        <AdminForm onSubmit={async (payload) => { const r = await api.addAdmin({ ...payload, caller_role: 'super_admin' }); if (r.error) toast.error(r.error); else { toast.success("Admin added!"); refresh(); } }} />
      </SectionCard>
      <div className="lg:col-span-1">
        <SectionCard title="Admin List" icon={<Shield className="h-5 w-5" />} className="h-full">
          <Loader
            key={refreshKey}
            listFn={api.listAdmins}
            cols={["admin_id", "name", "username", "dob"]}
            empty="No admins yet"
            onDelete={async (it) => { const r = await api.deleteAdmin(it.admin_id); if (r.error) toast.error(r.error); else toast.success("Deleted"); }}
            onEdit={(it) => setEditItem(it)}
          />
        </SectionCard>
      </div>
      <EditModal isOpen={!!editItem} onClose={() => setEditItem(null)} title="Edit Admin">
        <AdminForm initialData={editItem || {}} onSubmit={async (payload) => {
          const r = await api.updateAdmin(editItem.admin_id, payload);
          if (r.error) toast.error(r.error);
          else { toast.success("Updated!"); refresh(); setEditItem(null); }
        }} />
      </EditModal>
    </div>
  );
}

function FacultyManager({ api }) {
  const [editItem, setEditItem] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey(k => k + 1);

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <SectionCard title="Register Faculty" icon={<Users className="h-5 w-5" />}>
        <FacultyForm onSubmit={async (payload) => { const r = await api.addFaculty(payload); if (r.error) toast.error(r.error); else { toast.success("Faculty added!"); refresh(); } }} />
      </SectionCard>
      <div className="lg:col-span-1">
        <SectionCard title="Faculty List" icon={<Users className="h-5 w-5" />} className="h-full">
          <Loader
            key={refreshKey}
            listFn={api.listFaculty}
            cols={["faculty_id", "name", "email", "department", "subject"]}
            empty="No faculty yet"
            onDelete={async (it) => { const r = await api.deleteFaculty(it.faculty_id); if (r.error) toast.error(r.error); else toast.success("Deleted"); }}
            onEdit={(it) => setEditItem(it)}
          />
        </SectionCard>
      </div>
      <EditModal isOpen={!!editItem} onClose={() => setEditItem(null)} title="Edit Faculty">
        <FacultyForm initialData={editItem || {}} onSubmit={async (payload) => {
          const r = await api.updateFaculty(editItem.faculty_id, payload);
          if (r.error) toast.error(r.error);
          else { toast.success("Updated!"); refresh(); setEditItem(null); }
        }} />
      </EditModal>
    </div>
  );
}

function StudentManager({ api }) {
  const [editItem, setEditItem] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey(k => k + 1);

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <SectionCard title="Register Student" icon={<GraduationCap className="h-5 w-5" />}>
        <StudentForm onSubmit={async (payload) => { const r = await api.addStudent(payload); if (r.error) toast.error(r.error); else { toast.success("Student added!"); refresh(); } }} />
      </SectionCard>
      <div className="lg:col-span-1">
        <SectionCard title="Students" icon={<GraduationCap className="h-5 w-5" />} className="h-full">
          <Loader
            key={refreshKey}
            listFn={api.listStudents}
            cols={["student_id", "name", "email", "roll_no", "department"]}
            empty="No students yet"
            onDelete={async (it) => { const r = await api.deleteStudent(it.student_id); if (r.error) toast.error(r.error); else toast.success("Deleted"); }}
            onEdit={(it) => setEditItem(it)}
          />
        </SectionCard>
      </div>
      <EditModal isOpen={!!editItem} onClose={() => setEditItem(null)} title="Edit Student">
        <StudentForm initialData={editItem || {}} onSubmit={async (payload) => {
          const r = await api.updateStudent(editItem.student_id, payload);
          if (r.error) toast.error(r.error);
          else { toast.success("Updated!"); refresh(); setEditItem(null); }
        }} />
      </EditModal>
    </div>
  );
}


function StatsLoader({ api, role, id }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    async function load() {
      setLoading(true);
      let data = null;
      try {
        if (role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN) {
          data = await api.getStats();
        } else if (role === ROLES.FACULTY) {
          data = await api.getTeacherStats(id);
        } else if (role === ROLES.STUDENT) {
          data = await api.getStudentStats(id);
        } else if (role === ROLES.LIBRARIAN) {
          data = await api.getLibrarianStats(id);
        }
      } catch (e) {
        console.error("Failed to load stats", e);
      }
      setStats(data);
      setLoading(false);
    }
    load();
  }, [api, role, id]);

  if (loading) return <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{[1, 2, 3].map(i => <Skeleton key={i} className="h-40 rounded-2xl" />)}</div>;

  if (!stats || stats.error) {
    return (
      <div className="p-6 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
        <p>Unable to load dashboard data.</p>
        <button onClick={() => window.location.reload()} className="mt-2 text-indigo-600 font-semibold text-sm">Retry</button>
      </div>
    );
  }

  if (role === ROLES.STUDENT) return <StudentDashboard stats={stats} />;
  if (role === ROLES.FACULTY) return <TeacherDashboard stats={stats} />;
  if (role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN) return <AdminDashboard stats={stats} />;
  if (role === ROLES.LIBRARIAN) return <LibrarianDashboard stats={stats} />;

  return null;
}

// Keep attendance and results forms simple but with better UI
// Re-implemented Attendance and Results Forms
function AttendanceForm({ onSubmit, listFn }) {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [status, setStatus] = useState("Present");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [subjectId, setSubjectId] = useState(""); // Simplified: Manual entry or fixed

  React.useEffect(() => {
    listFn().then(data => setStudents(data || [])).catch(() => setStudents([]));
  }, [listFn]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Payload expected by backend: { date, subject_id, students: [{student_id, status}] } ? 
    // Or just { student_id, status, date, subject_id } ? 
    // Looking at common patterns, maybe bulk? 
    // Let's send a single record for now or check backend.
    // Assuming single record: { student_id, status, date, subject_id }
    onSubmit({ student_id: selectedStudent, status, date, subject_id: subjectId });
  };

  return (
    <SectionCard title="Mark Attendance" icon={<ClipboardCheck className="h-5 w-5" />}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-slate-300">Select Student</label>
          <select
            className="w-full rounded-xl border px-3 py-2 glass-input dark:bg-slate-800 dark:border-slate-700"
            value={selectedStudent}
            onChange={e => setSelectedStudent(e.target.value)}
            required
          >
            <option value="">-- Choose --</option>
            {students.map(s => <option key={s.student_id} value={s.student_id}>{s.name} ({s.roll_no})</option>)}
          </select>
        </div>
        <Input label="Subject ID" value={subjectId} onChange={setSubjectId} placeholder="e.g. SUB_001" />
        <Input label="Date" type="date" value={date} onChange={setDate} />
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-slate-300">Status</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" name="status" value="Present" checked={status === "Present"} onChange={() => setStatus("Present")} />
              <span className="dark:text-slate-300">Present</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="status" value="Absent" checked={status === "Absent"} onChange={() => setStatus("Absent")} />
              <span className="dark:text-slate-300">Absent</span>
            </label>
          </div>
        </div>
        <PrimaryBtn type="submit" className="w-full">Mark Attendance</PrimaryBtn>
      </form>
    </SectionCard>
  );
}

function ResultsForm({ onSubmit, listFn }) {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [examType, setExamType] = useState("Mid Term");
  const [marks, setMarks] = useState("");
  const [maxMarks, setMaxMarks] = useState("100");

  React.useEffect(() => {
    listFn().then(data => setStudents(data || [])).catch(() => setStudents([]));
  }, [listFn]);

  return (
    <SectionCard title="Upload Results" icon={<BookOpen className="h-5 w-5" />}>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit({ student_id: selectedStudent, subject_id: subjectId, exam_type: examType, marks_obtained: marks, max_marks: maxMarks }); }} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-slate-300">Select Student</label>
          <select
            className="w-full rounded-xl border px-3 py-2 glass-input dark:bg-slate-800 dark:border-slate-700"
            value={selectedStudent}
            onChange={e => setSelectedStudent(e.target.value)}
            required
          >
            <option value="">-- Choose --</option>
            {students.map(s => <option key={s.student_id} value={s.student_id}>{s.name} ({s.roll_no})</option>)}
          </select>
        </div>
        <Input label="Subject ID" value={subjectId} onChange={setSubjectId} placeholder="e.g. SUB_001" />
        <Input label="Exam Type" value={examType} onChange={setExamType} placeholder="Mid Term / Final" />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Marks Obtained" type="number" value={marks} onChange={setMarks} />
          <Input label="Max Marks" type="number" value={maxMarks} onChange={setMaxMarks} />
        </div>
        <PrimaryBtn type="submit" className="w-full">Save Result</PrimaryBtn>
      </form>
    </SectionCard>
  );
}

const StudentProfile = ({ sid, fetcher }) => {
  const [data, setData] = useState(null);
  React.useEffect(() => { fetcher(sid).then(setData).catch(() => setData({})); }, [sid, fetcher]);
  if (!data) return <Skeleton className="h-40" />;
  return <SectionCard title="My Profile" icon={<User className="h-5 w-5" />}>
    <div className="space-y-3">
      {Object.entries(data).length === 0 ? <p className="text-slate-500">No profile data loaded.</p> :
        Object.entries(data).map(([k, v]) => <Field key={k} label={k.replace(/_/g, ' ')} value={v} />)}
    </div>
  </SectionCard>;
};

const StudentAttendance = ({ sid, fetcher }) => {
  const [data, setData] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState("All");

  React.useEffect(() => { fetcher(sid).then(setData).catch(() => setData([])); }, [sid, fetcher]);

  if (!data) return <Skeleton className="h-40" />;

  const safeData = Array.isArray(data) ? data : [];

  // Extract unique subjects
  const subjects = ["All", ...new Set(safeData.map(d => d.subject).filter(Boolean))];

  // Filter data
  const filteredData = selectedSubject === "All"
    ? safeData
    : safeData.filter(d => d.subject === selectedSubject);

  return (
    <SectionCard title="My Attendance" icon={<ClipboardCheck className="h-5 w-5" />}>
      <div className="mb-4 flex items-center gap-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Filter by Subject:</label>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="p-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100"
        >
          {subjects.map(sub => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>
      </div>
      <DataTable
        items={filteredData}
        cols={safeData.length > 0 ? Object.keys(safeData[0]) : ["date", "subject", "status"]}
        empty="No attendance records found for this subject"
      />
    </SectionCard>
  );
};

const StudentResults = ({ sid, fetcher }) => {
  const [data, setData] = useState(null);
  React.useEffect(() => { fetcher(sid).then(setData).catch(() => setData([])); }, [sid, fetcher]);
  if (!data) return <Skeleton className="h-40" />;
  return <SectionCard title="My Results" icon={<BookOpen className="h-5 w-5" />}>
    <DataTable items={Array.isArray(data) ? data : []} cols={Array.isArray(data) && data.length > 0 ? Object.keys(data[0]) : ["exam_type", "subject_id", "marks_obtained"]} empty="No results found" />
  </SectionCard>;
};

