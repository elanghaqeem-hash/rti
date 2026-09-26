'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Award,
  Lock,
  KeyRound,
  Mail,
  Fingerprint,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Eye,
  EyeOff,
  Shield,
  Smartphone,
  CheckCircle2,
  FileSpreadsheet,
  Activity,
  Layers,
  ArrowLeft,
  FolderOpen,
  Users,
  Briefcase,
  FileCheck,
  TrendingUp,
  BrainCircuit,
  Clock,
  Building2,
  FolderLock,
  AlertOctagon,
  X,
  Search,
  Check,
  Sliders,
  Download,
  CheckSquare,
  FileText,
  BarChart3,
  ExternalLink,
  ChevronRight,
  Database,
  Terminal,
  LogOut,
  Sparkles,
  Server,
  FileSearch,
  CheckCircle
} from 'lucide-react';

export interface DemoAccount {
  username: string;
  email: string;
  name: string;
  role: string;
  org: string;
  mfaType: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    username: 'superadmin_sec',
    email: 'admin.security@jma-advisory.id',
    name: 'Muhammad Nadhil, CISA, CRISC',
    role: 'Super Administrator',
    org: 'PT JMA Solusi Konsultindo',
    mfaType: 'Hardware FIDO2 / TOTP'
  },
  {
    username: 'sarah_lead_bcm',
    email: 'sarah.wijaya@jma-advisory.id',
    name: 'Sarah Wijaya, CBCP, ISO 22301 LA',
    role: 'Lead BCM Consultant',
    org: 'PT JMA Solusi Konsultindo',
    mfaType: 'TOTP Authenticator'
  },
  {
    username: 'hendra_director',
    email: 'hendra.gunawan@jma-advisory.id',
    name: 'Dr. Hendra Gunawan, MM',
    role: 'Director / Principal Advisor',
    org: 'PT JMA Solusi Konsultindo',
    mfaType: 'TOTP Authenticator'
  },
  {
    username: 'rian_coord',
    email: 'rian.aditya@banknusantara.co.id',
    name: 'Rian Aditya',
    role: 'Client BCM Coordinator',
    org: 'PT Bank Nusantara Sejahtera Tbk',
    mfaType: 'SMS OTP'
  }
];

export default function BcmNavPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Steps: 'CREDENTIALS' | 'MFA_CHALLENGE' | 'LOGGED_IN'
  const [step, setStep] = useState<'CREDENTIALS' | 'MFA_CHALLENGE' | 'LOGGED_IN'>('CREDENTIALS');
  const [currentUser, setCurrentUser] = useState<DemoAccount | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);

  // Workspaces tab inside LOGGED_IN
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Interactive state for Consultant BIA
  const [selectedProcess, setSelectedProcess] = useState<string>('proc-01');
  const [operationalImpact, setOperationalImpact] = useState<number>(4);
  const [financialImpactPerHour, setFinancialImpactPerHour] = useState<number>(250);
  const [mtpdHours, setMtpdHours] = useState<number>(4);
  const [rtoHours, setRtoHours] = useState<number>(2);
  const [rpoMinutes, setRpoMinutes] = useState<number>(15);

  // Interactive state for Director Sign-off
  const [pendingApprovals, setPendingApprovals] = useState([
    { id: 'APP-01', process: 'Sistem Pembayaran RTGS & SKNBI', unit: 'Treasury & Payment Settlement', submitter: 'Sarah Wijaya', rto: '1.5 Jam', rpo: '0 Menit (Sync)', status: 'PENDING' },
    { id: 'APP-02', process: 'Core Banking API & Mobile Switching', unit: 'Digital Banking Operations', submitter: 'Sarah Wijaya', rto: '2.0 Jam', rpo: '15 Menit', status: 'PENDING' },
    { id: 'APP-03', process: 'ATM Network & Cash Replenishment', unit: 'Card & Delivery Channels', submitter: 'Sarah Wijaya', rto: '4.0 Jam', rpo: '30 Menit', status: 'PENDING' },
  ]);

  // Interactive state for Super Admin RBAC User Lock/Unlock
  const [adminUsers, setAdminUsers] = useState([
    { id: 'USR-01', name: 'Muhammad Nadhil, CISA', role: 'Super Administrator', status: 'ACTIVE', mfa: 'Enforced (FIDO2)' },
    { id: 'USR-02', name: 'Sarah Wijaya, CBCP', role: 'Lead BCM Consultant', status: 'ACTIVE', mfa: 'Enforced (TOTP)' },
    { id: 'USR-03', name: 'Dr. Hendra Gunawan', role: 'Director / Principal Advisor', status: 'ACTIVE', mfa: 'Enforced (TOTP)' },
    { id: 'USR-04', name: 'Rian Aditya', role: 'Client BCM Coordinator', status: 'ACTIVE', mfa: 'Enforced (SMS OTP)' },
    { id: 'USR-05', name: 'External Auditor BSSN', role: 'Compliance Auditor', status: 'LOCKED', mfa: 'Pending Reset' },
  ]);

  // Interactive state for Client Coordinator DRL
  const [drlList, setDrlList] = useState([
    { id: 'DRL-01', title: 'Topologi Jaringan DC & DRC Tier-3', dept: 'IT Infrastructure', status: 'ACCEPTED', date: '08 Sep 2026' },
    { id: 'DRL-02', title: 'SOP Rencana Evakuasi & Crisis Call Tree', dept: 'Human Capital & GA', status: 'SUBMITTED', date: '09 Sep 2026' },
    { id: 'DRL-03', title: 'Perjanjian Kerjasama (SLA) Cloud & Data Provider', dept: 'Vendor Management', status: 'REQUESTED', date: 'Menunggu Berkas' },
    { id: 'DRL-04', title: 'Hasil Uji Beban Genset & Cadangan UPS 24 Jam', dept: 'Facility Management', status: 'REQUESTED', date: 'Menunggu Berkas' },
  ]);

  // AI Assistant Output
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  // Initialize from searchParams if forwarded from modal
  useEffect(() => {
    const roleParam = searchParams.get('role');
    const userParam = searchParams.get('user');

    if (roleParam || userParam) {
      const found = DEMO_ACCOUNTS.find(
        (a) => (roleParam && a.role.toLowerCase() === roleParam.toLowerCase()) ||
               (userParam && a.username.toLowerCase() === userParam.toLowerCase())
      );

      if (found) {
        setCurrentUser(found);
        setStep('LOGGED_IN');
      } else if (roleParam) {
        setCurrentUser({
          username: userParam || 'consultant_user',
          email: `${userParam || 'user'}@bcm-enterprise.id`,
          name: userParam || 'Pengguna BCM Terautentikasi',
          role: roleParam,
          org: 'PT Technotama Artha Raya',
          mfaType: 'TOTP Authenticator'
        });
        setStep('LOGGED_IN');
      }
    }
  }, [searchParams]);

  // Handle credentials submit
  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setRemainingAttempts(null);

    if (!identifier.trim()) {
      setErrorMessage('Silakan masukkan username atau alamat email korporat.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Silakan masukkan kata sandi akun.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);

      const matched = DEMO_ACCOUNTS.find(
        (acc) => acc.username.toLowerCase() === identifier.trim().toLowerCase() ||
                 acc.email.toLowerCase() === identifier.trim().toLowerCase()
      );

      if (password === 'BCM@SECURE2025!' || password.length >= 6) {
        const user = matched || {
          username: identifier.trim(),
          email: identifier.includes('@') ? identifier.trim() : `${identifier.trim()}@bcm-enterprise.id`,
          name: identifier.trim(),
          role: 'BCM Consultant',
          org: 'PT Technotama Artha Raya',
          mfaType: 'TOTP Authenticator'
        };
        setCurrentUser(user);
        setMfaCode(''); // Strictly empty!
        setStep('MFA_CHALLENGE');
      } else {
        setErrorMessage('Kombinasi kredensial tidak valid.');
        setRemainingAttempts(4);
      }
    }, 600);
  };

  // Handle MFA verify & forward to main system
  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!mfaCode.trim() || mfaCode.length < 6) {
      setErrorMessage('Silakan masukkan 6-digit kode verifikasi MFA.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      // Valid if 6-digit number
      if (mfaCode === '123456' || mfaCode.length === 6) {
        // Forward immediately to BCM Nav main system!
        setStep('LOGGED_IN');
      } else {
        setErrorMessage('Kode token MFA salah atau telah kedaluwarsa.');
      }
    }, 600);
  };

  const handleResetForm = () => {
    setStep('CREDENTIALS');
    setIdentifier('');
    setPassword('');
    setMfaCode('');
    setErrorMessage(null);
    router.replace('/bcm-nav');
  };

  const handleSwitchUserRole = (acc: DemoAccount) => {
    setCurrentUser(acc);
    setActiveTab('overview');
    router.replace(`/bcm-nav?role=${encodeURIComponent(acc.role)}&user=${encodeURIComponent(acc.username)}`);
  };

  const handleToggleUserLock = (userId: string) => {
    setAdminUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: u.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE' } : u))
    );
  };

  const handleSignOffApproval = (id: string) => {
    setPendingApprovals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'APPROVED' } : item))
    );
  };

  const handleRunAiBiaAnalysis = () => {
    setAiAnalysis(
      `[AI BCM ADVISORY ENGINE v2.4 - ISO 22301:2019 & POJK 11/2022]\n` +
      `📌 Evaluasi Proses: Core Banking & RTGS Payment Settlement\n` +
      `⏱️ Rekomendasi RTO: Maksimal 2.0 Jam | RPO: 0 Menit (Synchronous Mirroring)\n` +
      `⚡ Analisis SPOF Teridentifikasi:\n` +
      `   1. Jalur Dedicated Fiber Optic DRC hanya memiliki 1 ISP primer (Single Uplink).\n` +
      `   2. Ketergantungan terhadap 2 Database Administrator senior tanpa secondary on-call backup.\n` +
      `🛡️ Rekomendasi Mitigasi:\n` +
      `   - Terapkan BGP Multi-Homing dengan secondary ISP berbeda rute fisik.\n` +
      `   - Jadwalkan Cyber Drill simulasi failover DRC berkala tiap semester (Pasal 24 POJK 11/2022).`
    );
  };

  // Helper colors
  const getRoleBadgeColor = (role: string) => {
    if (role.includes('Super Administrator')) return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    if (role.includes('Lead BCM Consultant')) return 'bg-teal-500/20 text-teal-300 border-teal-500/40';
    if (role.includes('Director')) return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
  };

  // =========================================================================
  // VIEW: AUTHENTICATED / MAIN BCM NAVIGATOR SYSTEM
  // =========================================================================
  if (step === 'LOGGED_IN' && currentUser) {
    const isSuperAdmin = currentUser.role.includes('Super Administrator');
    const isConsultant = currentUser.role.includes('Lead BCM Consultant');
    const isDirector = currentUser.role.includes('Director');
    const isClientCoord = currentUser.role.includes('Client BCM Coordinator');

    return (
      <div className="min-h-screen bg-[#071527] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
        {/* TOP SYSTEM NAV BAR */}
        <header className="sticky top-0 z-40 bg-[#0B1E38]/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4 shadow-xl shadow-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-400 p-0.5 shadow-md shadow-cyan-500/30 flex items-center justify-center">
              <div className="w-full h-full bg-[#071527] rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-wider text-white">BCM NAVIGATOR</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/40">
                  ENTERPRISE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Sistem Konsultan BCM Berbasis ISO 22301:2019 & POJK 11/2022
              </p>
            </div>
          </div>

          {/* User Persona & Role Switcher */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Persona Indicator Card */}
            <div className="p-2 px-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-black text-xs">
                <Fingerprint className="w-4 h-4" />
              </div>
              <div className="text-left hidden md:block">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{currentUser.name}</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold border ${getRoleBadgeColor(currentUser.role)}`}>
                    {currentUser.role}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono truncate max-w-[200px]">
                  {currentUser.org}
                </div>
              </div>
            </div>

            {/* Quick Role Switcher Dropdown */}
            <div className="relative group">
              <button
                type="button"
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Ganti persona role untuk demonstrasi"
              >
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Uji Role:</span>
                <span className="text-cyan-300 truncate max-w-[100px]">{currentUser.role.split(' ')[0]}</span>
              </button>
              <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-50">
                <div className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1 mb-1">
                  Pilih Persona Role BCM:
                </div>
                {DEMO_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.username}
                    type="button"
                    onClick={() => handleSwitchUserRole(acc)}
                    className={`w-full text-left p-2 rounded-xl text-xs flex flex-col gap-0.5 transition-all cursor-pointer ${
                      currentUser.username === acc.username
                        ? 'bg-cyan-950/60 border border-cyan-500/50 text-cyan-200'
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="font-bold text-white truncate">{acc.name}</div>
                    <div className="text-[10px] text-cyan-400 font-mono">{acc.role}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Logout / Switch Account */}
            <button
              type="button"
              onClick={handleResetForm}
              className="py-2 px-3 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Keluar dari sesi BCM Nav"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>

            {/* Back to RTI Website */}
            <Link
              href="/"
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Kembali ke portal RTI"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Web RTI</span>
            </Link>
          </div>
        </header>

        {/* SUBHEADER / STATUS STRIP */}
        <div className="bg-[#08182D] border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              STATUS: SESI AKTIF
            </span>
            <span className="text-slate-700">|</span>
            <span className="font-mono text-cyan-300 font-semibold">{currentUser.org}</span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 text-slate-400">
              <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>Workspace: <code>C:\Users\sasib\Downloads\BCM JMA\sistem Konsultan</code></span>
            </span>
            <span className="hidden md:inline text-slate-700">|</span>
            <span className="hidden md:inline text-teal-400 font-mono">ISO 22301 &bull; POJK 11/2022</span>
          </div>
        </div>

        {/* MAIN BODY WORKSPACE */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* ROLE WELCOME BANNER */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-950/70 via-slate-900 to-[#0A223E] border border-cyan-500/30 p-6 sm:p-8 shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <ShieldCheck className="w-64 h-64 text-cyan-400" />
            </div>

            <div className="relative z-10 max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>WORKSPACE ROLE: {currentUser.role.toUpperCase()}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Selamat Datang, {currentUser.name}
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                {isSuperAdmin &&
                  'Anda memiliki akses penuh atas tata kelola parameter multi-klien, penegakan kebijakan MFA/RBAC, log keamanan Section 9 ISO 22301, dan orkestrasi basis data.'}
                {isConsultant &&
                  'Ruang kerja konsultan aktif untuk simulasi BIA Calculator (MTPD, RTO, RPO), deteksi Single Point of Failure (SPOF), dan perancangan strategi mitigasi risiko siber.'}
                {isDirector &&
                  'Meja eksekutif direksi untuk persetujuan final (Sign-Off) asesmen BIA, pemantauan Risk & Disruption Heatmap, serta verifikasi kepatuhan regulasi POJK 11/2022.'}
                {isClientCoord &&
                  'Portal koordinator BCM organisasi untuk pemenuhan Document Request List (DRL), monitoring kesiapan unit kerja, dan eksekusi checklist aktivasi darurat BCP.'}
              </p>
            </div>
          </div>

          {/* ================================================================= */}
          {/* ROLE 1: SUPER ADMINISTRATOR DASHBOARD VIEW */}
          {/* ================================================================= */}
          {isSuperAdmin && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Super Admin KPI Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Pengguna Terdaftar</span>
                    <Users className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-black text-white">24 User</div>
                  <div className="text-[11px] text-emerald-400 font-mono">100% MFA Enforced</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Jejak Audit Hari Ini</span>
                    <Activity className="w-4 h-4 text-teal-400" />
                  </div>
                  <div className="text-2xl font-black text-white">1,420 Event</div>
                  <div className="text-[11px] text-cyan-400 font-mono">ISO 22301 Section 9</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Infrastruktur DB BCM</span>
                    <Database className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-black text-white">Prisma SQLite</div>
                  <div className="text-[11px] text-indigo-300 font-mono">bcm_navigator.db Healthy</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Kepatuhan Keamanan</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-white">99.98%</div>
                  <div className="text-[11px] text-emerald-300 font-mono">Zero Trust Hardened</div>
                </div>
              </div>

              {/* RBAC Management & Parameters Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* User & Access Management Table */}
                <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-extrabold text-base text-white flex items-center gap-2">
                        <Lock className="w-4 h-4 text-cyan-400" />
                        <span>Manajemen Akses Pengguna & Kebijakan MFA (RBAC)</span>
                      </h2>
                      <p className="text-xs text-slate-400">Kontrol status akses dan penegakan otentikasi multi-faktor</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-mono">
                          <th className="py-2.5 px-3">Nama Pengguna</th>
                          <th className="py-2.5 px-3">Role Otorisasi</th>
                          <th className="py-2.5 px-3">Metode MFA</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3 text-right">Tindakan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-mono">
                        {adminUsers.map((u) => (
                          <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3 px-3 font-bold text-white font-sans">{u.name}</td>
                            <td className="py-3 px-3 text-cyan-300">{u.role}</td>
                            <td className="py-3 px-3 text-slate-400">{u.mfa}</td>
                            <td className="py-3 px-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  u.status === 'ACTIVE'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                    : 'bg-red-500/20 text-red-300 border border-red-500/40'
                                }`}
                              >
                                {u.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => handleToggleUserLock(u.id)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                  u.status === 'ACTIVE'
                                    ? 'bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300'
                                    : 'bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300'
                                }`}
                              >
                                {u.status === 'ACTIVE' ? 'Kunci Akun' : 'Buka Kunci'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* System Parameters Panel */}
                <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
                  <h2 className="font-extrabold text-base text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-teal-400" />
                    <span>Parameter Sistem Multi-Client</span>
                  </h2>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="text-slate-400 text-[10px] uppercase font-mono">Batas Kritis RTO (Tier-1)</div>
                      <div className="text-sm font-bold text-white">Maksimal 2.0 Jam</div>
                      <div className="text-[10px] text-cyan-400">Sesuai Lampiran I POJK 11/2022</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="text-slate-400 text-[10px] uppercase font-mono">Siklus Tinjauan Metodologi</div>
                      <div className="text-sm font-bold text-white">Tahunan (Annual PDCA)</div>
                      <div className="text-[10px] text-teal-400">Klausul 9.3 ISO 22301:2019</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="text-slate-400 text-[10px] uppercase font-mono">Enkripsi Kertas Kerja</div>
                      <div className="text-sm font-bold text-white">AES-256 GCM Rest & Transit</div>
                      <div className="text-[10px] text-indigo-400">HSM Backed Hardware Vault</div>
                    </div>

                    <div className="pt-2">
                      <a
                        href="file:///C:/Users/sasib/Downloads/BCM%20JMA/sistem%20Konsultan"
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2.5 px-4 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                      >
                        <FolderOpen className="w-4 h-4" />
                        <span>Buka Direktori Sistem Konsultan</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* ROLE 2: LEAD BCM CONSULTANT DASHBOARD VIEW */}
          {/* ================================================================= */}
          {isConsultant && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Consultant KPI Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Register Proses Dipetakan</span>
                    <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-black text-white">48 Proses</div>
                  <div className="text-[11px] text-cyan-400 font-mono">14 Proses Tier-1 Kritis</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>BIA Wizard Completion</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-white">88%</div>
                  <div className="text-[11px] text-emerald-400 font-mono">Target Sign-Off Minggu Ini</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Single Point of Failure (SPOF)</span>
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-amber-300">5 Terdeteksi</div>
                  <div className="text-[11px] text-amber-400 font-mono">Perlu Mitigasi Failover</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Kertas Kerja Siap Validasi</span>
                    <FileCheck className="w-4 h-4 text-teal-400" />
                  </div>
                  <div className="text-2xl font-black text-white">12 Dokumen</div>
                  <div className="text-[11px] text-teal-300 font-mono">ISO 22301 Clause 8.2.2</div>
                </div>
              </div>

              {/* Interactive BIA Calculator & SPOF Radar */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* BIA Calculator Panel */}
                <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h2 className="font-extrabold text-base text-white flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-cyan-400" />
                        <span>Kalkulator Dampak BIA & Target RTO / MTPD</span>
                      </h2>
                      <p className="text-xs text-slate-400">Perhitungan dinamis batas toleransi gangguan dan nilai kerugian finansial</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
                        Pilih Proses Bisnis yang Dianalisis:
                      </label>
                      <select
                        value={selectedProcess}
                        onChange={(e) => setSelectedProcess(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-bold text-xs focus:outline-none focus:border-cyan-400"
                      >
                        <option value="proc-01">Core Banking & Transaksi Finansial (RTGS / SKNBI)</option>
                        <option value="proc-02">Mobile Banking API Switching & Settlement</option>
                        <option value="proc-03">Treasury Dealing Room & Valuta Asing</option>
                        <option value="proc-04">ATM Switching & Cash Management Unit</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="flex justify-between font-mono">
                          <span className="text-slate-400">Dampak Operasional:</span>
                          <span className="font-bold text-cyan-300">Skala {operationalImpact}/5</span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={5}
                          value={operationalImpact}
                          onChange={(e) => setOperationalImpact(Number(e.target.value))}
                          className="w-full accent-cyan-400 cursor-pointer"
                        />
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="flex justify-between font-mono">
                          <span className="text-slate-400">Kerugian Finansial / Jam:</span>
                          <span className="font-bold text-amber-300">Rp {financialImpactPerHour} Juta</span>
                        </div>
                        <input
                          type="range"
                          min={50}
                          max={1000}
                          step={50}
                          value={financialImpactPerHour}
                          onChange={(e) => setFinancialImpactPerHour(Number(e.target.value))}
                          className="w-full accent-amber-400 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 pt-2 font-mono">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                        <div className="text-[10px] text-slate-400">MTPD Target</div>
                        <div className="text-lg font-black text-white mt-0.5">{mtpdHours} Jam</div>
                        <div className="text-[9px] text-slate-500">Max Disruption</div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                        <div className="text-[10px] text-slate-400">RTO Komitmen</div>
                        <div className="text-lg font-black text-cyan-300 mt-0.5">{rtoHours} Jam</div>
                        <div className="text-[9px] text-cyan-500">Recovery Time</div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                        <div className="text-[10px] text-slate-400">RPO Toleransi</div>
                        <div className="text-lg font-black text-emerald-300 mt-0.5">{rpoMinutes} Mnt</div>
                        <div className="text-[9px] text-emerald-500">Data Loss Window</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between font-mono">
                      <div>
                        <span className="text-[10px] text-slate-400">Klasifikasi Hasil BIA:</span>
                        <div className="font-bold text-white text-xs">TIER-1 (MISSION CRITICAL PROCESS)</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/40">
                        DRC Active-Active Reqd
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleRunAiBiaAnalysis}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-cyan-500/20"
                    >
                      <BrainCircuit className="w-4 h-4" />
                      <span>Jalankan AI Gap Analysis (POJK 11/2022)</span>
                    </button>
                  </div>
                </div>

                {/* SPOF & AI Output Panel */}
                <div className="lg:col-span-5 space-y-6">
                  {/* SPOF Radar List */}
                  <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
                    <h2 className="font-extrabold text-base text-white flex items-center gap-2">
                      <AlertOctagon className="w-4 h-4 text-amber-400" />
                      <span>SPOF Radar (Titik Kegagalan Tunggal)</span>
                    </h2>

                    <div className="space-y-2.5 text-xs">
                      <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30 flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-white">Dedicated Telco Link DRC</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Hanya memiliki single provider tanpa automatic BGP rerouting fisik.
                          </div>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30 flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-white">Ketergantungan Key Person DBA</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Hanya 1 Lead Database Administrator yang memegang passkey enkripsi DRC.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Analysis Terminal Display */}
                  {aiAnalysis && (
                    <div className="p-5 rounded-3xl bg-slate-950 border border-cyan-500/40 space-y-2 font-mono text-xs">
                      <div className="flex items-center justify-between text-cyan-400 text-[10px] pb-1 border-b border-slate-800">
                        <span className="flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5" />
                          <span>AI_CONSULTANT_RECOMMENDATION.LOG</span>
                        </span>
                        <span>LIVE</span>
                      </div>
                      <pre className="text-slate-300 whitespace-pre-wrap font-mono text-[11px] leading-relaxed">
                        {aiAnalysis}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* ROLE 3: DIRECTOR / PRINCIPAL ADVISOR DASHBOARD VIEW */}
          {/* ================================================================= */}
          {isDirector && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Director KPI Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Kesiapan BCM Korporasi</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-white">91.2%</div>
                  <div className="text-[11px] text-emerald-400 font-mono">Target Minimum 85% Terlampaui</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Menunggu Sign-Off Direksi</span>
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-amber-300">3 Usulan</div>
                  <div className="text-[11px] text-amber-400 font-mono">BIA Tier-1 Ready</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Kepatuhan POJK 11/2022</span>
                    <FileCheck className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-black text-white">96%</div>
                  <div className="text-[11px] text-cyan-400 font-mono">Laporan Siap Diserahkan</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Audit Trail Sign-Off</span>
                    <CheckSquare className="w-4 h-4 text-teal-400" />
                  </div>
                  <div className="text-2xl font-black text-white">Cryptographic</div>
                  <div className="text-[11px] text-teal-300 font-mono">ECDSA SHA-256 Valid</div>
                </div>
              </div>

              {/* Director Sign-Off Approval Desk */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="font-extrabold text-base text-white flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-400" />
                      <span>Meja Otorisasi & Persetujuan Eksekutif (BIA Executive Sign-Off)</span>
                    </h2>
                    <p className="text-xs text-slate-400">
                      Sebagai Direktur / Principal Advisor, berikan tanda tangan digital untuk mengesahkan target RTO & RPO
                    </p>
                  </div>

                  <div className="text-xs font-mono text-cyan-400">
                    Otoritas: Executive Director (ISO 22301 Lead Advisor)
                  </div>
                </div>

                <div className="space-y-3">
                  {pendingApprovals.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-cyan-400 font-bold">{item.id}</span>
                          <span className="font-bold text-white text-sm">{item.process}</span>
                        </div>
                        <div className="text-xs text-slate-400 flex flex-wrap gap-x-4 gap-y-1 font-mono">
                          <span>Unit: {item.unit}</span>
                          <span>Asesor: {item.submitter}</span>
                          <span className="text-cyan-300">Target RTO: {item.rto}</span>
                          <span className="text-emerald-300">Target RPO: {item.rpo}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {item.status === 'APPROVED' ? (
                          <div className="px-4 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Telah Disetujui (Signed-Off)</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSignOffApproval(item.id)}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-400 hover:to-orange-300 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span>Setujui & Tandatangani</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* ROLE 4: CLIENT BCM COORDINATOR DASHBOARD VIEW */}
          {/* ================================================================= */}
          {isClientCoord && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Client Coordinator KPI Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Permintaan Dokumen (DRL)</span>
                    <FolderLock className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-black text-white">18 Berkas</div>
                  <div className="text-[11px] text-cyan-400 font-mono">15 Berhasil Diunggah</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Kesiapan Divisi Bank</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-white">84%</div>
                  <div className="text-[11px] text-emerald-400 font-mono">4 Divisi Siap Audit</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Jadwal Simulasi BCP Drill</span>
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-white">14 Hari Lagi</div>
                  <div className="text-[11px] text-amber-300 font-mono">Table-Top & Failover</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Emergency Call Tree</span>
                    <CheckSquare className="w-4 h-4 text-teal-400" />
                  </div>
                  <div className="text-2xl font-black text-white">Terverifikasi</div>
                  <div className="text-[11px] text-teal-300 font-mono">Kontak Crisis Team Aktif</div>
                </div>
              </div>

              {/* DRL Submission Table */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h2 className="font-extrabold text-base text-white flex items-center gap-2">
                      <FolderLock className="w-4 h-4 text-cyan-400" />
                      <span>Document Request List (DRL) & Unggah Bukti Audit</span>
                    </h2>
                    <p className="text-xs text-slate-400">
                      Sebagai Koordinator BCM Bank, serahkan bukti dukung sesuai permintaan tim konsultan Technotama
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-mono">
                        <th className="py-2.5 px-3">Kode Dokumen</th>
                        <th className="py-2.5 px-3">Nama Berkas yang Diminta</th>
                        <th className="py-2.5 px-3">Divisi Pemilik</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {drlList.map((d) => (
                        <tr key={d.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-3 font-bold text-cyan-400">{d.id}</td>
                          <td className="py-3 px-3 font-bold text-white font-sans">{d.title}</td>
                          <td className="py-3 px-3 text-slate-400 font-sans">{d.dept}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                d.status === 'ACCEPTED'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : d.status === 'SUBMITTED'
                                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              }`}
                            >
                              {d.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right font-sans">
                            <button
                              type="button"
                              onClick={() => {
                                setDrlList((prev) =>
                                  prev.map((item) =>
                                    item.id === d.id ? { ...item, status: 'SUBMITTED', date: 'Baru saja diunggah' } : item
                                  )
                                );
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-bold transition-all cursor-pointer"
                            >
                              {d.status === 'ACCEPTED' ? 'Lihat Berkas' : 'Unggah Ulang'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // =========================================================================
  // VIEW: LOGIN & MFA CHALLENGE (STEP 1 & STEP 2)
  // =========================================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#071527] via-[#0B1F3A] to-[#0A2540] flex flex-col justify-center items-center p-4 sm:p-6 text-slate-100 relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Link */}
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/"
          className="px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Web RTI</span>
        </Link>
        <span className="text-xs text-slate-500 font-mono">|</span>
        <span className="text-xs text-cyan-400 font-mono font-bold">BCM NAVIGATOR v1.0.0</span>
      </div>

      {/* Main Card Container */}
      <div className="relative w-full max-w-xl bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl">
        {/* Header Strip */}
        <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-[#0A2540] p-6 sm:p-8 border-b border-slate-800 relative">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-lg sm:text-xl text-white tracking-wider">
                  BCM NAVIGATOR
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-md font-mono font-bold bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                  PORTAL
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Sistem Konsultan Business Continuity Management - ISO 22301 & POJK 11/2022
              </p>
            </div>
          </div>
        </div>

        {/* STEP 1: CREDENTIALS */}
        {step === 'CREDENTIALS' && (
          <form onSubmit={handleCredentialsSubmit} className="p-6 sm:p-8 space-y-4">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <div className="flex-1">
                  <span>{errorMessage}</span>
                  {remainingAttempts !== null && (
                    <span className="block font-mono text-[11px] text-red-400 mt-0.5">
                      Sisa percobaan: {remainingAttempts}x sebelum lockout
                    </span>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Username / Email Korporat
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoComplete="off"
                  required
                  className="w-full bg-slate-950/70 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00A9CE] focus:ring-2 focus:ring-[#00A9CE]/20 transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Kata Sandi (Password)
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  className="w-full bg-slate-950/70 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-[#00A9CE] focus:ring-2 focus:ring-[#00A9CE]/20 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all transform active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Kredensial...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Lanjut ke Verifikasi MFA</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: MFA CHALLENGE (FIELD 6-DIGIT KOSONG TANPA PETUNJUK) */}
        {step === 'MFA_CHALLENGE' && currentUser && (
          <form onSubmit={handleMfaSubmit} className="p-6 sm:p-8 space-y-5 animate-in fade-in duration-200">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Target Account Badge */}
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-black text-sm">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white">{currentUser.name}</div>
                  <div className="text-[11px] text-cyan-400 flex items-center gap-1 font-mono">
                    <span>{currentUser.role} &bull; {currentUser.mfaType}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleResetForm}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                Ganti Akun
              </button>
            </div>

            {/* Field Verifikasi 6 Digit (Kosong Tanpa Petunjuk) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Kode Verifikasi 6-Digit (MFA TOTP)
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Smartphone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                  autoFocus
                  required
                  className="w-full bg-slate-950/70 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-center text-xl tracking-widest font-mono font-bold text-white focus:outline-none focus:border-[#00A9CE] focus:ring-2 focus:ring-[#00A9CE]/20 transition-all"
                />
              </div>
            </div>

            {/* MFA Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-3 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all transform active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Token MFA...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verifikasi & Masuk Sistem BCM</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Security Seal */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500 px-6 sm:px-8">
          <span className="font-mono">BCM Navigator Engine v1.0.0</span>
          <span className="font-mono text-cyan-400/80">ISO 22301 & POJK 11/2022</span>
        </div>
      </div>
    </div>
  );
}
