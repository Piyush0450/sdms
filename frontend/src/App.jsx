
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogIn, ChevronDown, Shield, User, Users, GraduationCap,
  ClipboardCheck, BarChart3, BookOpen, PlusCircle, Settings, Sun, Moon,
  Menu, X
} from "lucide-react";
import { ThemeProvider, useTheme } from "./ThemeContext";
import { Toaster, toast } from 'react-hot-toast';
import { StudentDashboard, TeacherDashboard, AdminDashboard } from "./DashboardWidgets";

const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  FACULTY: "faculty",
  STUDENT: "student",
};

const Container = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
    {children}
  </div>
);

const LoginDropdown = ({ onSelect }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="group inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-2xl shadow hover:shadow-md transition-all"
      >
        <LogIn className="h-4 w-4" />
        <span className="font-semibold">Login</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ type: "spring", stiffness: 340, damping: 22 }}
            className="absolute right-0 mt-2 w-60 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:bg-slate-900 dark:border-slate-800"
          >
            <DropdownItem icon={<Shield />} title="Admin Login" onClick={() => { onSelect(ROLES.ADMIN, true); setOpen(false); }} subtitle="Super Admin option inside" />
            <DropdownItem icon={<Users />} title="Faculty Login" onClick={() => { onSelect(ROLES.FACULTY); setOpen(false); }} subtitle="For teachers" />
            <DropdownItem icon={<User />} title="Student Login" onClick={() => { onSelect(ROLES.STUDENT); setOpen(false); }} subtitle="View only" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DropdownItem = ({ icon, title, subtitle, onClick }) => (
  <button onClick={onClick} className="w-full text-left flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition group dark:hover:bg-slate-800">
    <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-700 transition dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-indigo-900/30 dark:group-hover:text-indigo-400">
      {React.cloneElement(icon, { className: "h-5 w-5" })}
    </div>
    <div className="flex flex-col">
      <span className="font-semibold text-sm dark:text-slate-200">{title}</span>
      <span className="text-xs text-slate-500 dark:text-slate-500">{subtitle}</span>
    </div>
  </button>
);

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
      title="Toggle Theme"
    >
      {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </button>
  );
};

const Navbar = ({ onLoginClick, onMenuClick, onHomeClick, session, onLogout, onDashboardClick }) => (
  <nav className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-slate-200 dark:bg-slate-900/70 dark:border-slate-800 transition-colors">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button onClick={onMenuClick} className="md:hidden p-2 -ml-2 text-slate-600 dark:text-slate-300">
            <Menu className="h-6 w-6" />
          </button>
        )}
        <button onClick={onHomeClick} className="flex items-center gap-3 hover:opacity-80 transition">
          <div className="h-9 w-9 rounded-2xl bg-indigo-600 flex items-center justify-center shadow">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="font-extrabold tracking-tight text-lg sm:text-xl dark:text-slate-100">SDMS Portal</span>
        </button>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        {session ? (
          <div className="flex items-center gap-2">
            {onDashboardClick && (
              <button onClick={onDashboardClick} className="bg-indigo-600 text-white px-4 py-2 rounded-2xl shadow hover:bg-indigo-700 transition font-semibold text-sm flex items-center gap-2">
                <BarChart3 className="h-4 w-4" /> Dashboard
              </button>
            )}
            <button onClick={onLogout} className="bg-red-600 text-white px-4 py-2 rounded-2xl shadow hover:bg-red-700 transition font-semibold text-sm flex items-center gap-2">
              <LogIn className="h-4 w-4 rotate-180" /> Logout
            </button>
          </div>
        ) : (
          <LoginDropdown onSelect={onLoginClick} />
        )}
      </div>
    </div>
  </nav>
);

const SectionCard = ({ title, icon, children, className = "" }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition dark:bg-slate-900 dark:border-slate-800 ${className}`}>
    <div className="flex items-center gap-2 mb-4">
      <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center dark:bg-slate-800 dark:text-slate-200">{icon}</div>
      <h3 className="font-bold dark:text-slate-100">{title}</h3>
    </div>
    {children}
  </motion.div>
);

const Home = ({ onLogin, onHomeClick, session, onLogout, onDashboardClick }) => (
  <Container>
    <Navbar onLoginClick={onLogin} onHomeClick={onHomeClick} session={session} onLogout={onLogout} onDashboardClick={onDashboardClick} />
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight dark:text-white">
          Welcome to <span className="text-indigo-700 dark:text-indigo-400">SDMS Portal</span>
        </h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          A modern Student Data Management System with role‑based access.
        </p>
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
        <SectionCard title="Secure Roles" icon={<Shield className="h-5 w-5" />}>Manage access for each role with a single dashboard layout.</SectionCard>
        <SectionCard title="Faculty Tools" icon={<ClipboardCheck className="h-5 w-5" />}>Mark attendance and update results quickly.</SectionCard>
        <SectionCard title="Student View" icon={<User className="h-5 w-5" />}>Students can view profile, attendance, and results only.</SectionCard>
      </div>
    </main>
  </Container>
);

const Input = ({ label, value, onChange, placeholder, disabled, type = "text" }) => (
  <label className="block">
    <span className="block text-sm font-medium mb-1 dark:text-slate-300">{label}</span>
    <input
      type={type}
      disabled={disabled}
      value={value}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      placeholder={placeholder}
      className={`w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-slate-950 dark:border-slate-800 dark:text-white dark:placeholder-slate-500 ${disabled ? "bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-500" : "border-slate-300"}`}
    />
  </label>
);

const PrimaryBtn = ({ children, onClick, type = "button" }) => (
  <button type={type} onClick={onClick} className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold rounded-xl px-4 py-2 shadow hover:shadow-md hover:bg-indigo-700 transition">
    {children}
  </button>
);

const AuthPanel = ({ onLoggedIn, onHomeClick }) => {
  const [role, setRole] = useState(ROLES.ADMIN);
  const [isSuper, setIsSuper] = useState(false);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!id || !password) return setError("Please enter ID and Password");
    const wantedRole = role === ROLES.ADMIN && isSuper ? ROLES.SUPER_ADMIN : role;
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: wantedRole, id, password })
      });
      const data = await res.json();
      if (data.ok) onLoggedIn({ role: data.role, id: data.id });
      else setError(data.error || "Login failed");
    } catch (err) {
      setError("Backend not running. Start Flask server.");
    }
  };

  return (
    <Container>
      <Navbar onLoginClick={() => { }} onHomeClick={onHomeClick} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid lg:grid-cols-2 gap-8 items-start">
        <SectionCard title="Choose Role" icon={<LogIn className="h-5 w-5" />}>
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: ROLES.ADMIN, label: "Admin" },
              { key: ROLES.FACULTY, label: "Faculty" },
              { key: ROLES.STUDENT, label: "Student" },
            ].map((opt) => (
              <button key={opt.key} onClick={() => setRole(opt.key)} className={`rounded-xl border px-4 py-2 text-sm font-semibold transition hover:shadow ${role === opt.key ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"}`}>
                {opt.label}
              </button>
            ))}
          </div>
          {role === ROLES.ADMIN && (
            <label className="mt-4 flex items-center gap-2 text-sm">
              <input type="checkbox" className="accent-indigo-600 h-4 w-4" checked={isSuper} onChange={(e) => setIsSuper(e.target.checked)} />
              <span>Login as <span className="font-semibold">Super Admin</span></span>
            </label>
          )}
        </SectionCard>

        <motion.form onSubmit={submit} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition dark:bg-slate-900 dark:border-slate-800">
          <h3 className="font-bold text-lg mb-1 dark:text-slate-100">{role === ROLES.ADMIN ? (isSuper ? "Super Admin" : "Admin") : role[0].toUpperCase() + role.slice(1)} Login</h3>
          <p className="text-sm text-slate-500 mb-6 dark:text-slate-400">Enter your ID & password to continue.</p>
          <Input label="ID" value={id} onChange={setId} placeholder={role === ROLES.STUDENT ? "S_001" : role === ROLES.FACULTY ? "F_001" : "A_001 or username"} />
          <div className="mt-4" />
          <Input type="password" label="Password" value={password} onChange={setPassword} placeholder="DOB e.g., 25/09/2000" />
          {error && <p className="text-sm text-red-600 mt-4">{error}</p>}
          <div className="mt-6">
            <PrimaryBtn type="submit">Continue</PrimaryBtn>
          </div>
        </motion.form>
      </div>
    </Container>
  );
};

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
                className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-white dark:bg-slate-900 z-50 p-4 shadow-2xl md:hidden border-r dark:border-slate-800"
              >
                <div className="flex justify-between items-center mb-6">
                  <span className="font-bold text-lg dark:text-white">Menu</span>
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
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:bg-slate-900 dark:border-slate-800">
            <SidebarContent role={role} userId={userId} menu={menu} active={active} setActive={setActive} onLogout={onLogout} />
          </div>
        </aside>

        <section className="col-span-12 md:col-span-9">
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
    <div className="flex items-center gap-3 pb-4 border-b dark:border-slate-800">
      <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
        <User className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Logged in as</div>
        <div className="text-sm font-semibold dark:text-slate-200">{role === ROLES.SUPER_ADMIN ? "Super Admin" : role.charAt(0).toUpperCase() + role.slice(1)}</div>
        <div className="text-[11px] text-slate-500 dark:text-slate-500">ID: {userId}</div>
      </div>
    </div>
    <ul className="mt-4 space-y-1">
      {menu.map((m) => (
        <li key={m.key}>
          <button onClick={() => setActive(m.key)} className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition group ${active === m.key ? "bg-indigo-600 text-white shadow" : "hover:bg-slate-50 text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"}`}>
            <span className="group-hover:scale-110 transition">{m.icon}</span>
            <span className="font-medium">{m.label}</span>
          </button>
        </li>
      ))}
    </ul>
    <button onClick={onLogout} className="mt-4 w-full text-center text-sm font-semibold text-indigo-700 hover:text-indigo-800 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300">Logout</button>
  </>
);


const Field = ({ label, value }) => (
  <div className="rounded-lg border border-slate-200 p-3 bg-white dark:bg-slate-900 dark:border-slate-800">
    <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</div>
    <div className="font-semibold dark:text-slate-200">{value}</div>
  </div>
);

const DataTable = ({ items, cols, empty }) => {
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
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Input placeholder="Search..." value={search} onChange={e => { setSearch(e); setPage(1); }} />
        <div className="text-sm text-slate-500 dark:text-slate-400">Total: {filtered.length}</div>
      </div>
      <div className="rounded-xl border overflow-x-auto dark:border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800 dark:text-slate-200">
            <tr>
              {cols.map((c) => <th key={c} className="p-3 text-left capitalize">{c.replace(/_/g, " ")}</th>)}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 && (<tr><td className="p-3 text-slate-500 dark:text-slate-400" colSpan={cols.length}>{search ? "No matches found" : empty}</td></tr>)}
            {paginated.map((it, idx) => (
              <tr key={idx} className="border-t hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50 dark:text-slate-300">
                {cols.map((c) => (<td key={c} className="p-3">{String(it[c] ?? "").toString()}</td>))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-2">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 rounded border disabled:opacity-50 dark:border-slate-700 dark:text-slate-300">Prev</button>
          <span className="px-2 py-1 text-sm dark:text-slate-300">Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 rounded border disabled:opacity-50 dark:border-slate-700 dark:text-slate-300">Next</button>
        </div>
      )}
    </div>
  );
};

function useBackend() {
  // Minimal client helpers to call backend
  const addFaculty = (p) => fetcher('/api/admin/faculty', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) });
  const listFaculty = () => fetcher('/api/admin/faculty');
  const addStudent = (p) => fetcher('/api/admin/students', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) });
  const listStudents = () => fetcher('/api/admin/students');
  const addAdmin = (p) => fetcher('/api/admin/admins', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) });
  const listAdmins = () => fetcher('/api/admin/admins');
  const markAttendance = (p) => fetcher('/api/faculty/attendance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) });
  const saveResults = (p) => fetcher('/api/faculty/results', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) });
  const studentProfile = (sid) => fetcher(`/api/student/${sid}/profile`);
  const studentAttendance = (sid) => fetcher(`/api/student/${sid}/attendance`);
  const studentResults = (sid) => fetcher(`/api/student/${sid}/results`);
  const getStats = async () => {
    try {
      const [s, f, a] = await Promise.all([
        fetcher('/api/admin/students'),
        fetcher('/api/admin/faculty'),
        fetcher('/api/admin/admins')
      ]);
      return [
        { name: 'Students', count: Array.isArray(s) ? s.length : 0 },
        { name: 'Faculty', count: Array.isArray(f) ? f.length : 0 },
        { name: 'Admins', count: Array.isArray(a) ? a.length : 0 }
      ];
    } catch (e) { return []; }
  };
  const getStudentStats = (sid) => fetcher(`/api/dashboard/student/${sid}/stats`);
  const getTeacherStats = (fid) => fetcher(`/api/dashboard/teacher/${fid}/stats`);
  const getAdminStats = () => fetcher(`/api/dashboard/admin/stats`);

  return { addFaculty, listFaculty, addStudent, listStudents, addAdmin, listAdmins, markAttendance, saveResults, studentProfile, studentAttendance, studentResults, getStats, getStudentStats, getTeacherStats, getAdminStats };
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
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const err = await res.json();
        throw new Error(err.error || "Request failed");
      }
      throw new Error(`Request failed: ${res.status}`);
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
      <Toaster position="top-right" />
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
  const handleLoggedIn = ({ role, id }) => {
    const newSession = { role, id };
    localStorage.setItem("session", JSON.stringify(newSession));
    setSession(newSession);
  };
  const logout = () => {
    localStorage.removeItem("session");
    setSession(null);
    setStage("home");
  };
  const goHome = () => {
    if (!session) setStage("home");
    // If logged in, maybe staying on dashboard is better, or go to dashboard overview?
    // User asked "send him in home page". If logged in, Home page usually means Dashboard. If public, means Landing.
    // Let's assume clicking logo always goes to initial view of current state.
    if (session) window.location.reload(); // Simple refresh or just set active tab?
    // Better UX: if logged in, go to dashboard overview. If not, go to landing.
    if (session) { /* handle in DashboardLayout if needed, but for now specific requirement "Home Page" often implies Landing. But authenticated users shouldn't see landing. */ }
    setStage(session ? "dashboard" : "home");
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
                    <SectionCard title="Use menus at left" icon={<BarChart3 className="h-5 w-5" />}>Manage faculty/students. Super Admin can add admins.</SectionCard>
                  </div>
                  <StatsLoader api={api} role={role} id={id} />
                </div>
              );
            }
            if (active === "admins" && role === ROLES.SUPER_ADMIN) {
              return (
                <div className="grid md:grid-cols-2 gap-4">
                  <SectionCard title="Register Admin" icon={<Shield className="h-5 w-5" />}>
                    <AdminForm onSubmit={async (payload) => { const r = await api.addAdmin({ ...payload, caller_role: 'super_admin' }); if (r.error) toast.error(r.error); else toast.success("Admin added!"); }} />
                  </SectionCard>
                  <SectionCard title="Admin List" icon={<Shield className="h-5 w-5" />}>
                    <Loader listFn={api.listAdmins} cols={["admin_id", "name", "username", "dob"]} empty="No admins yet" />
                  </SectionCard>
                </div>
              );
            }
            if (active === "faculty") {
              return (
                <div className="grid md:grid-cols-2 gap-4">
                  <SectionCard title="Register Faculty" icon={<Users className="h-5 w-5" />}>
                    <FacultyForm onSubmit={async (payload) => { const r = await api.addFaculty(payload); if (r.error) toast.error(r.error); else toast.success("Faculty added!"); }} />
                  </SectionCard>
                  <SectionCard title="Faculty List" icon={<Users className="h-5 w-5" />}>
                    <Loader listFn={api.listFaculty} cols={["faculty_id", "name", "department", "subject", "dob"]} empty="No faculty yet" />
                  </SectionCard>
                </div>
              );
            }
            if (active === "students") {
              return (
                <div className="grid md:grid-cols-2 gap-4">
                  <SectionCard title="Register Student" icon={<GraduationCap className="h-5 w-5" />}>
                    <StudentForm onSubmit={async (payload) => { const r = await api.addStudent(payload); if (r.error) toast.error(r.error); else toast.success("Student added!"); }} />
                  </SectionCard>
                  <SectionCard title="Students" icon={<GraduationCap className="h-5 w-5" />}>
                    <Loader listFn={api.listStudents} cols={["student_id", "name", "roll_no", "department", "semester", "dob"]} empty="No students yet" />
                  </SectionCard>
                </div>
              );
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

function AdminForm({ onSubmit }) {
  const [name, setName] = useState(""); const [username, setUsername] = useState(""); const [dob, setDob] = useState("");
  return (<form onSubmit={(e) => { e.preventDefault(); onSubmit({ name, username, dob }); }} className="space-y-3">
    <Input label="Name" value={name} onChange={setName} />
    <Input label="Username" value={username} onChange={setUsername} />
    <Input label="DOB (DD/MM/YYYY)" value={dob} onChange={setDob} />
    <PrimaryBtn type="submit"><PlusCircle className="h-4 w-4" /> Add Admin</PrimaryBtn>
  </form>);
}

function FacultyForm({ onSubmit }) {
  const [name, setName] = useState(""); const [department, setDepartment] = useState(""); const [subject, setSubject] = useState(""); const [dob, setDob] = useState("");
  return (<form onSubmit={(e) => { e.preventDefault(); onSubmit({ name, department, subject, dob }); }} className="space-y-3">
    <Input label="Name" value={name} onChange={setName} />
    <Input label="Department" value={department} onChange={setDepartment} />
    <Input label="Subject" value={subject} onChange={setSubject} />
    <Input label="DOB (DD/MM/YYYY)" value={dob} onChange={setDob} />
    <PrimaryBtn type="submit"><PlusCircle className="h-4 w-4" /> Add Faculty</PrimaryBtn>
  </form>);
}

function StudentForm({ onSubmit }) {
  const [name, setName] = useState(""); const [roll_no, setRoll] = useState(""); const [department, setDepartment] = useState(""); const [semester, setSemester] = useState(""); const [dob, setDob] = useState("");
  return (<form onSubmit={(e) => { e.preventDefault(); onSubmit({ name, roll_no, department, semester, dob }); }} className="space-y-3">
    <Input label="Name" value={name} onChange={setName} />
    <Input label="Roll No" value={roll_no} onChange={setRoll} />
    <Input label="Department" value={department} onChange={setDepartment} />
    <Input label="Semester" value={semester} onChange={setSemester} />
    <Input label="DOB (DD/MM/YYYY)" value={dob} onChange={setDob} />
    <PrimaryBtn type="submit"><PlusCircle className="h-4 w-4" /> Add Student</PrimaryBtn>
  </form>);
}


const Skeleton = ({ className }) => <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded ${className}`} />;

function Loader({ listFn, cols, empty }) {
  const [items, setItems] = useState(null);
  React.useEffect(() => {
    // Artificial delay to show skeleton
    const p = listFn().then(setItems).catch(() => setItems([]));
  }, []);

  if (!items) {
    return (
      <div className="rounded-xl border overflow-x-auto dark:border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800"><tr>{cols.map(c => <th key={c} className="p-3"><Skeleton className="h-4 w-20" /></th>)}</tr></thead>
          <tbody>
            {[1, 2, 3].map(i => (
              <tr key={i} className="border-t dark:border-slate-800">
                {cols.map(c => <td key={c} className="p-3"><Skeleton className="h-4 w-full" /></td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return <DataTable items={items} cols={cols} empty={empty} />;
}

function AttendanceForm({ onSubmit, listFn }) {
  const [subject, setSubject] = useState(""); const [date, setDate] = useState(""); const [map, setMap] = useState({}); const [students, setStudents] = useState([]);
  React.useEffect(() => { listFn().then(setStudents).catch(() => setStudents([])); }, []);
  return (<div className="space-y-3">
    <div className="grid sm:grid-cols-3 gap-3">
      <Input label="Subject" value={subject} onChange={setSubject} />
      <Input label="Date (YYYY-MM-DD)" value={date} onChange={setDate} />
    </div>
    <div className="rounded-xl border overflow-x-auto dark:border-slate-800">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800 dark:text-slate-200"><tr><th className="p-3 text-left">Student</th><th className="p-3 text-left">ID</th><th className="p-3 text-left">Status</th></tr></thead>
        <tbody>
          {students.length === 0 && <tr><td className="p-3 text-slate-500 dark:text-slate-400" colSpan={3}>No students yet.</td></tr>}
          {students.map(s => (<tr key={s.student_id} className="border-t dark:border-slate-800 dark:text-slate-300">
            <td className="p-3">{s.name}</td><td className="p-3">{s.student_id}</td>
            <td className="p-3">
              <select className="rounded-lg border px-2 py-1 dark:bg-slate-900 dark:border-slate-700" value={map[s.student_id] ?? "present"} onChange={e => setMap({ ...map, [s.student_id]: e.target.value })}>
                <option value="present">Present</option><option value="absent">Absent</option>
              </select>
            </td>
          </tr>))}
        </tbody>
      </table>
    </div>
    <PrimaryBtn onClick={() => onSubmit({ subject, date, statusMap: map })}>Save Attendance</PrimaryBtn>
  </div>);
}

function ResultsForm({ onSubmit, listFn }) {
  const [subject, setSubject] = useState(""); const [examType, setExamType] = useState("Midterm"); const [map, setMap] = useState({}); const [students, setStudents] = useState([]);
  React.useEffect(() => { listFn().then(setStudents).catch(() => setStudents([])); }, []);
  return (<div className="space-y-3">
    <div className="grid sm:grid-cols-3 gap-3">
      <Input label="Subject" value={subject} onChange={setSubject} />
      <Input label="Exam Type" value={examType} onChange={setExamType} />
    </div>
    <div className="rounded-xl border overflow-x-auto dark:border-slate-800">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800 dark:text-slate-200"><tr><th className="p-3 text-left">Student</th><th className="p-3 text-left">ID</th><th className="p-3 text-left">Marks</th></tr></thead>
        <tbody>
          {students.length === 0 && <tr><td className="p-3 text-slate-500 dark:text-slate-400" colSpan={3}>No students yet.</td></tr>}
          {students.map(s => (<tr key={s.student_id} className="border-t dark:border-slate-800 dark:text-slate-300">
            <td className="p-3">{s.name}</td><td className="p-3">{s.student_id}</td>
            <td className="p-3"><input type="number" className="w-28 rounded-lg border px-2 py-1 dark:bg-slate-900 dark:border-slate-700 dark:text-white" value={map[s.student_id] ?? ""} onChange={e => setMap({ ...map, [s.student_id]: e.target.value })} /></td>
          </tr>))}
        </tbody>
      </table>
    </div>
    <PrimaryBtn onClick={() => onSubmit({ subject, examType, marksMap: map })}>Save Results</PrimaryBtn>
  </div>);
}

function StudentProfile({ sid, fetcher }) {
  const [data, setData] = useState(null);
  React.useEffect(() => { fetcher(sid).then(setData).catch(() => setData(null)); }, [sid]);
  return data ? (
    <div className="grid sm:grid-cols-2 gap-3 text-sm">
      <Field label="Name" value={data.name} />
      <Field label="Student ID" value={data.student_id} />
      <Field label="Roll No" value={data.roll_no} />
      <Field label="Department" value={data.department} />
      <Field label="Semester" value={data.semester} />
      <Field label="DOB" value={data.dob} />
    </div>
  ) : <div className="text-slate-500">No profile found.</div>;
}

function StudentAttendance({ sid, fetcher }) {
  const [rows, setRows] = useState([]);
  React.useEffect(() => { fetcher(sid).then(setRows).catch(() => setRows([])); }, [sid]);
  return (
    <div className="rounded-xl border overflow-x-auto dark:border-slate-800">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800 dark:text-slate-200"><tr><th className="p-3 text-left">Date</th><th className="p-3 text-left">Subject</th><th className="p-3 text-left">Status</th></tr></thead>
        <tbody>
          {rows.length === 0 && (<tr><td className="p-3 text-slate-500 dark:text-slate-400" colSpan={3}>No records.</td></tr>)}
          {rows.map((r, idx) => (<tr key={idx} className="border-t dark:border-slate-800 dark:text-slate-300"><td className="p-3">{r.date}</td><td className="p-3">{r.subject}</td><td className="p-3"><span className={`px-2 py-1 rounded-md text-xs font-semibold ${r.status === "present" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>{r.status}</span></td></tr>))}
        </tbody>
      </table>
    </div>
  );
}

function StudentResults({ sid, fetcher }) {
  const [rows, setRows] = useState([]);
  React.useEffect(() => { fetcher(sid).then(setRows).catch(() => setRows([])); }, [sid]);
  return (
    <div className="rounded-xl border overflow-x-auto dark:border-slate-800">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800 dark:text-slate-200"><tr><th className="p-3 text-left">Subject</th><th className="p-3 text-left">Exam</th><th className="p-3 text-left">Marks</th></tr></thead>
        <tbody>
          {rows.length === 0 && (<tr><td className="p-3 text-slate-500 dark:text-slate-400" colSpan={3}>No results yet.</td></tr>)}
          {rows.map((r, idx) => (<tr key={idx} className="border-t dark:border-slate-800 dark:text-slate-300"><td className="p-3">{r.subject}</td><td className="p-3">{r.exam_type}</td><td className="p-3 font-semibold">{r.marks}</td></tr>))}
        </tbody>
      </table>
    </div>
  );
}

function StatsLoader({ api, role, id }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    setLoading(true);
    let p;
    if (role === "student") p = api.getStudentStats(id);
    else if (role === "faculty") p = api.getTeacherStats(id);
    else if (role === "admin" || role === "super_admin") p = api.getAdminStats();

    if (p) p.then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, [api, role, id]);

  if (loading) return <div className="p-4 text-center text-slate-500">Loading stats...</div>;
  if (!data || data.error) return <div className="p-4 text-center text-red-500">Error loading stats: {data?.error || "Unknown"}</div>;

  if (role === "student") return <StudentDashboard stats={data} />;
  if (role === "faculty") return <TeacherDashboard stats={data} />;
  return <AdminDashboard stats={data} />;
}
