import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { BrandLogo } from '@/components/komunitashub/brand-logo';
import { Spinner } from '@/components/ui/spinner';
import {
    Eye,
    EyeOff,
    ArrowLeft,
    CheckCircle2,
    Check,
    ShieldCheck,
    Lock,
    AlertCircle,
} from 'lucide-react';

interface AuthPageProps {
    initialMode?: 'login' | 'register';
    status?: string;
    canResetPassword?: boolean;
}  

export default function AuthenticationPage({
    initialMode = 'login',
    status,
    canResetPassword = true,
}: AuthPageProps) {
    // Determine mode from prop or URL
    const [mode, setMode] = useState<'login' | 'register'>(() => {
        if (typeof window !== 'undefined') {
            const path = window.location.pathname;
            const search = new URLSearchParams(window.location.search);
            if (
                path.includes('register') ||
                search.get('mode') === 'register'
            ) {
                return 'register';
            }
        }
        return initialMode;
    });

    // Password visibility toggles
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);
    const [showRegisterPasswordConfirm, setShowRegisterPasswordConfirm] =
        useState(false);

    // Login Form State
    const [loginIdentifier, setLoginIdentifier] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoginProcessing, setIsLoginProcessing] = useState(false);
    const [loginErrors, setLoginErrors] = useState<{
        identifier?: string;
        password?: string;
    }>({});

    // Register Form State
    const [regName, setRegName] = useState('');
    const [regPhone, setRegPhone] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regPasswordConfirm, setRegPasswordConfirm] = useState('');
    const [regAgreeTerms, setRegAgreeTerms] = useState(false);
    const [isRegProcessing, setIsRegProcessing] = useState(false);
    const [regErrors, setRegErrors] = useState<{
        name?: string;
        phone?: string;
        email?: string;
        password?: string;
        password_confirmation?: string;
        terms?: string;
    }>({});

    // Synchronize URL without reloading
    const handleModeSwitch = (newMode: 'login' | 'register') => {
        setMode(newMode);
        if (typeof window !== 'undefined') {
            const targetUrl = newMode === 'register' ? '/register' : '/login';
            window.history.replaceState(null, '', targetUrl);
        }
    };

    // Keep state aligned if browser back/forward occurs
    useEffect(() => {
        const handlePopState = () => {
            const path = window.location.pathname;
            if (path.includes('register')) {
                setMode('register');
            } else {
                setMode('login');
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    // Login Submission Handler
    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errors: { identifier?: string; password?: string } = {};

        if (!loginIdentifier.trim()) {
            errors.identifier = 'Email atau nomor WhatsApp wajib diisi.';
        }
        if (!loginPassword) {
            errors.password = 'Kata sandi wajib diisi.';
        } else if (loginPassword.length < 6) {
            errors.password = 'Kata sandi minimal 6 karakter.';
        }

        if (Object.keys(errors).length > 0) {
            setLoginErrors(errors);
            return;
        }

        setLoginErrors({});
        setIsLoginProcessing(true);

        // Simulation for UI prototype
        setTimeout(() => {
            setIsLoginProcessing(false);
            router.visit('/dashboard');
        }, 700);
    };

    // Register Submission Handler
    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errors: {
            name?: string;
            phone?: string;
            email?: string;
            password?: string;
            password_confirmation?: string;
            terms?: string;
        } = {};

        if (!regName.trim() || regName.trim().length < 3) {
            errors.name = 'Nama lengkap minimal 3 karakter.';
        }

        const cleanPhone = regPhone.replace(/\D/g, '');
        if (!cleanPhone || cleanPhone.length < 9) {
            errors.phone = 'Nomor WhatsApp tidak valid (minimal 10 digit).';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regEmail.trim() || !emailRegex.test(regEmail.trim())) {
            errors.email = 'Format alamat email tidak valid.';
        }

        if (!regPassword || regPassword.length < 8) {
            errors.password = 'Kata sandi minimal 8 karakter.';
        }

        if (regPassword !== regPasswordConfirm) {
            errors.password_confirmation = 'Konfirmasi kata sandi tidak cocok.';
        }

        if (!regAgreeTerms) {
            errors.terms =
                'Anda perlu menyetujui ketentuan layanan dan kebijakan privasi.';
        }

        if (Object.keys(errors).length > 0) {
            setRegErrors(errors);
            return;
        }

        setRegErrors({});
        setIsRegProcessing(true);

        // Direct user to the "Gabung Komunitas" onboarding step after registration
        setTimeout(() => {
            setIsRegProcessing(false);
            router.visit('/gabung-komunitas');
        }, 700);
    };

    return (
        <>
            <Head
                title={
                    mode === 'login'
                        ? 'Masuk ke KomunitasHub'
                        : 'Buat Akun Keluarga — KomunitasHub'
                }
            />

            <div className="flex min-h-screen flex-col bg-[#F7F6F2] font-sans text-[#1D2924] selection:bg-[#2F6B57]/20 selection:text-[#1D2924] lg:flex-row">
                {/* KOLOM KIRI (DESKTOP ~42%): PANEL KONTEKS YANG TENANG */}
                <aside className="hidden w-full flex-col justify-between border-b border-[#E4E3DC] bg-[#F0EFEA] p-8 select-none lg:flex lg:w-[42%] lg:border-r lg:border-b-0 lg:p-12 xl:p-16">
                    {/* Header Kiri */}
                    <div className="flex items-center justify-between">
                        <Link href="/" className="group inline-block">
                            <BrandLogo size="md" />
                        </Link>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#66736C] transition-colors hover:text-[#1D2924]"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Kembali ke beranda
                        </Link>
                    </div>

                    {/* Konten Naratif & Pratinjau Antarmuka Nyata */}
                    <div className="my-auto space-y-8 py-10">
                        <div className="space-y-3">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2F6B57]/20 bg-[#EBF3EF] px-3 py-1 text-xs font-semibold text-[#2F6B57]">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                Akses Operasional Komunitas
                            </span>
                            <h1 className="text-3xl leading-tight font-bold tracking-tight text-[#1D2924] xl:text-4xl">
                                Mulai dari lingkungan yang lebih tertata.
                            </h1>
                            <p className="text-sm leading-relaxed text-[#66736C]">
                                Satu akses terintegrasi untuk seluruh urusan
                                rumah Anda—dari transparansi iuran kas,
                                permohonan surat pengantar warga, hingga izin
                                kedatangan tamu di pos satpam.
                            </p>
                        </div>

                        {/* Potongan Tampilan Nyata Produk (Bukan Ilustrasi Abstrak / Foto Stok) */}
                        <div className="space-y-4 rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-5 shadow-xs">
                            <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#2F6B57] text-xs font-bold tracking-wider text-[#FFFEFA]">
                                        B-07
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-[#1D2924]">
                                            Keluarga Bpk. Pratama
                                        </div>
                                        <div className="text-[11px] text-[#66736C]">
                                            Puri Taman Sari · Blok B No. 07
                                        </div>
                                    </div>
                                </div>
                                <span className="inline-flex items-center gap-1 rounded bg-[#EAF4EE] px-2 py-0.5 text-[11px] font-semibold text-[#2F7D5C]">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Terverifikasi
                                </span>
                            </div>

                            <div className="space-y-2.5 text-xs text-[#1D2924]">
                                <div className="flex items-start gap-2 text-[#66736C]">
                                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2F7D5C]" />
                                    <span>
                                        <strong>1 Akun Resmi per Rumah:</strong>{' '}
                                        Mewakili satu keluarga dan satu nomor
                                        domisili.
                                    </span>
                                </div>
                                <div className="flex items-start gap-2 text-[#66736C]">
                                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2F7D5C]" />
                                    <span>
                                        <strong>Transparansi Kas:</strong>{' '}
                                        Pantau saldo kas tanpa saling curiga
                                        antar tetangga.
                                    </span>
                                </div>
                                <div className="flex items-start gap-2 text-[#66736C]">
                                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2F7D5C]" />
                                    <span>
                                        <strong>Izin Tamu QR:</strong> Khusus
                                        cluster, akses mudah kurir dan teknisi
                                        di pos satpam.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Jaminan Privasi */}
                    <div className="flex items-center gap-2 border-t border-[#E4E3DC] pt-6 text-xs text-[#66736C]">
                        <Lock className="h-3.5 w-3.5 shrink-0 text-[#2F6B57]" />
                        <span>
                            Data keluarga dilindungi dan hanya diverifikasi oleh
                            pengurus resmi.
                        </span>
                    </div>
                </aside>

                {/* KOLOM KANAN (~58%): AREA AUTENTIKASI BERSIH DENGAN WHITESPACE LEGA */}
                <main className="flex w-full flex-col justify-center bg-[#FFFEFA] px-4 py-10 sm:px-8 sm:py-16 lg:w-[58%]">
                    <div className="mx-auto w-full max-w-md space-y-6">
                        {/* Header Khusus Mobile */}
                        <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-4 lg:hidden">
                            <Link href="/">
                                <BrandLogo size="md" />
                            </Link>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-[#66736C] hover:text-[#1D2924]"
                            >
                                <ArrowLeft className="h-3.5 w-3.5" />
                                Beranda
                            </Link>
                        </div>

                        {/* Segmented Switch / Tab Sederhana: [ Masuk ] [ Buat Akun ] */}
                        <div className="space-y-1">
                            <label className="sr-only">
                                Pilih Mode Autentikasi
                            </label>
                            <div className="grid grid-cols-2 rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] p-1 text-xs font-semibold">
                                <button
                                    type="button"
                                    onClick={() => handleModeSwitch('login')}
                                    className={`rounded-md px-3 py-2 text-center transition-all duration-200 motion-reduce:transition-none ${
                                        mode === 'login'
                                            ? 'bg-[#2F6B57] text-[#FFFEFA] shadow-xs'
                                            : 'text-[#66736C] hover:text-[#1D2924]'
                                    }`}
                                >
                                    Masuk
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleModeSwitch('register')}
                                    className={`rounded-md px-3 py-2 text-center transition-all duration-200 motion-reduce:transition-none ${
                                        mode === 'register'
                                            ? 'bg-[#2F6B57] text-[#FFFEFA] shadow-xs'
                                            : 'text-[#66736C] hover:text-[#1D2924]'
                                    }`}
                                >
                                    Buat Akun
                                </button>
                            </div>
                        </div>

                        {/* Status Message (e.g. password reset sent) */}
                        {status && (
                            <div className="flex items-center gap-2 rounded-lg border border-[#2F7D5C]/30 bg-[#EAF4EE] p-3 text-xs font-medium text-[#2F7D5C]">
                                <CheckCircle2 className="h-4 w-4 shrink-0" />
                                <span>{status}</span>
                            </div>
                        )}

                        {/* MODE: MASUK (LOGIN) */}
                        {mode === 'login' && (
                            <div className="animate-in space-y-6 duration-200 fade-in slide-in-from-left-2 motion-reduce:animate-none">
                                <div className="space-y-1.5">
                                    <h2 className="text-2xl font-bold tracking-tight text-[#1D2924]">
                                        Selamat datang kembali
                                    </h2>
                                    <p className="text-xs leading-relaxed text-[#66736C] sm:text-sm">
                                        Masuk untuk melanjutkan aktivitas
                                        keluarga Anda.
                                    </p>
                                </div>

                                <form
                                    onSubmit={handleLoginSubmit}
                                    className="space-y-4"
                                >
                                    {/* Field: Email atau WhatsApp */}
                                    <div className="space-y-1">
                                        <label
                                            htmlFor="login-identifier"
                                            className="block text-xs font-semibold tracking-wider text-[#1D2924] uppercase"
                                        >
                                            Email atau Nomor WhatsApp
                                        </label>
                                        <input
                                            id="login-identifier"
                                            type="text"
                                            autoFocus
                                            value={loginIdentifier}
                                            onChange={(e) => {
                                                setLoginIdentifier(
                                                    e.target.value,
                                                );
                                                if (loginErrors.identifier) {
                                                    setLoginErrors((prev) => ({
                                                        ...prev,
                                                        identifier: undefined,
                                                    }));
                                                }
                                            }}
                                            placeholder="nama@email.com atau 0812xxxxxxx"
                                            className={`w-full rounded-md border bg-[#FFFEFA] px-3.5 py-2.5 text-sm text-[#1D2924] transition-colors placeholder:text-[#66736C]/60 focus:ring-1 focus:outline-none ${
                                                loginErrors.identifier
                                                    ? 'border-[#B74E44] focus:border-[#B74E44] focus:ring-[#B74E44]'
                                                    : 'border-[#E4E3DC] focus:border-[#2F6B57] focus:ring-[#2F6B57]'
                                            }`}
                                        />
                                        <div className="flex items-center justify-between pt-0.5 text-[11px]">
                                            {loginErrors.identifier ? (
                                                <span className="flex items-center gap-1 font-medium text-[#B74E44]">
                                                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                                    {loginErrors.identifier}
                                                </span>
                                            ) : (
                                                <span className="text-[#66736C]">
                                                    Gunakan email atau nomor
                                                    WhatsApp yang telah
                                                    didaftarkan
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Field: Kata Sandi */}
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <label
                                                htmlFor="login-password"
                                                className="block text-xs font-semibold tracking-wider text-[#1D2924] uppercase"
                                            >
                                                Kata Sandi
                                            </label>
                                            {canResetPassword && (
                                                <Link
                                                    href="/forgot-password"
                                                    className="text-xs font-semibold text-[#2F6B57] hover:text-[#245442] hover:underline"
                                                >
                                                    Lupa kata sandi?
                                                </Link>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <input
                                                id="login-password"
                                                type={
                                                    showLoginPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                value={loginPassword}
                                                onChange={(e) => {
                                                    setLoginPassword(
                                                        e.target.value,
                                                    );
                                                    if (loginErrors.password) {
                                                        setLoginErrors(
                                                            (prev) => ({
                                                                ...prev,
                                                                password:
                                                                    undefined,
                                                            }),
                                                        );
                                                    }
                                                }}
                                                placeholder="Masukkan kata sandi Anda"
                                                className={`w-full rounded-md border bg-[#FFFEFA] py-2.5 pr-10 pl-3.5 text-sm text-[#1D2924] transition-colors placeholder:text-[#66736C]/60 focus:ring-1 focus:outline-none ${
                                                    loginErrors.password
                                                        ? 'border-[#B74E44] focus:border-[#B74E44] focus:ring-[#B74E44]'
                                                        : 'border-[#E4E3DC] focus:border-[#2F6B57] focus:ring-[#2F6B57]'
                                                }`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowLoginPassword(
                                                        !showLoginPassword,
                                                    )
                                                }
                                                className="absolute top-1/2 right-2.5 -translate-y-1/2 p-1 text-[#66736C] hover:text-[#1D2924]"
                                                aria-label={
                                                    showLoginPassword
                                                        ? 'Sembunyikan sandi'
                                                        : 'Tampilkan sandi'
                                                }
                                            >
                                                {showLoginPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                        {loginErrors.password && (
                                            <span className="flex items-center gap-1 pt-0.5 text-[11px] font-medium text-[#B74E44]">
                                                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                                {loginErrors.password}
                                            </span>
                                        )}
                                    </div>

                                    {/* Checkbox: Ingat Saya */}
                                    <div className="flex items-center gap-2 pt-1">
                                        <input
                                            id="remember-me"
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) =>
                                                setRememberMe(e.target.checked)
                                            }
                                            className="h-4 w-4 rounded border-[#E4E3DC] text-[#2F6B57] focus:ring-[#2F6B57]"
                                        />
                                        <label
                                            htmlFor="remember-me"
                                            className="cursor-pointer text-xs font-medium text-[#1D2924] select-none"
                                        >
                                            Ingat saya di perangkat ini
                                        </label>
                                    </div>

                                    {/* Tombol Utama: Masuk */}
                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={isLoginProcessing}
                                            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#2F6B57] px-4 py-2.5 text-sm font-semibold text-[#FFFEFA] shadow-xs transition-colors hover:bg-[#245442] disabled:cursor-not-allowed disabled:opacity-70"
                                        >
                                            {isLoginProcessing ? (
                                                <>
                                                    <Spinner className="h-4 w-4 text-[#FFFEFA]" />
                                                    <span>
                                                        Memverifikasi akun...
                                                    </span>
                                                </>
                                            ) : (
                                                <span>Masuk</span>
                                            )}
                                        </button>
                                    </div>
                                </form>

                                {/* Teks Bawah */}
                                <div className="pt-2 text-center text-xs text-[#66736C]">
                                    Belum punya akun?{' '}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleModeSwitch('register')
                                        }
                                        className="font-semibold text-[#2F6B57] hover:underline"
                                    >
                                        Buat akun
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* MODE: BUAT AKUN (REGISTER) */}
                        {mode === 'register' && (
                            <div className="animate-in space-y-6 duration-200 fade-in slide-in-from-right-2 motion-reduce:animate-none">
                                <div className="space-y-1.5">
                                    <h2 className="text-2xl font-bold tracking-tight text-[#1D2924]">
                                        Buat akun keluarga
                                    </h2>
                                    <p className="text-xs leading-relaxed text-[#66736C] sm:text-sm">
                                        Satu akun digunakan untuk mengelola satu
                                        keluarga dan satu rumah.
                                    </p>
                                </div>

                                <form
                                    onSubmit={handleRegisterSubmit}
                                    className="space-y-4"
                                >
                                    {/* Field: Nama Lengkap */}
                                    <div className="space-y-1">
                                        <label
                                            htmlFor="reg-name"
                                            className="block text-xs font-semibold tracking-wider text-[#1D2924] uppercase"
                                        >
                                            Nama Lengkap
                                        </label>
                                        <input
                                            id="reg-name"
                                            type="text"
                                            autoFocus
                                            value={regName}
                                            onChange={(e) => {
                                                setRegName(e.target.value);
                                                if (regErrors.name) {
                                                    setRegErrors((prev) => ({
                                                        ...prev,
                                                        name: undefined,
                                                    }));
                                                }
                                            }}
                                            placeholder="Contoh: Bpk. Hendra Pratama"
                                            className={`w-full rounded-md border bg-[#FFFEFA] px-3.5 py-2 text-sm text-[#1D2924] transition-colors placeholder:text-[#66736C]/60 focus:ring-1 focus:outline-none ${
                                                regErrors.name
                                                    ? 'border-[#B74E44] focus:border-[#B74E44] focus:ring-[#B74E44]'
                                                    : 'border-[#E4E3DC] focus:border-[#2F6B57] focus:ring-[#2F6B57]'
                                            }`}
                                        />
                                        <div className="flex items-center justify-between pt-0.5 text-[11px]">
                                            {regErrors.name ? (
                                                <span className="flex items-center gap-1 font-medium text-[#B74E44]">
                                                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                                    {regErrors.name}
                                                </span>
                                            ) : (
                                                <span className="text-[#66736C]">
                                                    Nama Kepala Keluarga atau
                                                    perwakilan rumah
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Field: Nomor WhatsApp */}
                                    <div className="space-y-1">
                                        <label
                                            htmlFor="reg-phone"
                                            className="block text-xs font-semibold tracking-wider text-[#1D2924] uppercase"
                                        >
                                            Nomor WhatsApp
                                        </label>
                                        <input
                                            id="reg-phone"
                                            type="tel"
                                            value={regPhone}
                                            onChange={(e) => {
                                                setRegPhone(e.target.value);
                                                if (regErrors.phone) {
                                                    setRegErrors((prev) => ({
                                                        ...prev,
                                                        phone: undefined,
                                                    }));
                                                }
                                            }}
                                            placeholder="Contoh: 08123456789"
                                            className={`w-full rounded-md border bg-[#FFFEFA] px-3.5 py-2 text-sm text-[#1D2924] transition-colors placeholder:text-[#66736C]/60 focus:ring-1 focus:outline-none ${
                                                regErrors.phone
                                                    ? 'border-[#B74E44] focus:border-[#B74E44] focus:ring-[#B74E44]'
                                                    : 'border-[#E4E3DC] focus:border-[#2F6B57] focus:ring-[#2F6B57]'
                                            }`}
                                        />
                                        <div className="flex items-center justify-between pt-0.5 text-[11px]">
                                            {regErrors.phone ? (
                                                <span className="flex items-center gap-1 font-medium text-[#B74E44]">
                                                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                                    {regErrors.phone}
                                                </span>
                                            ) : (
                                                <span className="text-[#66736C]">
                                                    Format: 08xx / 62xx (untuk
                                                    konfirmasi pengurus RT)
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Field: Email */}
                                    <div className="space-y-1">
                                        <label
                                            htmlFor="reg-email"
                                            className="block text-xs font-semibold tracking-wider text-[#1D2924] uppercase"
                                        >
                                            Alamat Email
                                        </label>
                                        <input
                                            id="reg-email"
                                            type="email"
                                            value={regEmail}
                                            onChange={(e) => {
                                                setRegEmail(e.target.value);
                                                if (regErrors.email) {
                                                    setRegErrors((prev) => ({
                                                        ...prev,
                                                        email: undefined,
                                                    }));
                                                }
                                            }}
                                            placeholder="keluarga@email.com"
                                            className={`w-full rounded-md border bg-[#FFFEFA] px-3.5 py-2 text-sm text-[#1D2924] transition-colors placeholder:text-[#66736C]/60 focus:ring-1 focus:outline-none ${
                                                regErrors.email
                                                    ? 'border-[#B74E44] focus:border-[#B74E44] focus:ring-[#B74E44]'
                                                    : 'border-[#E4E3DC] focus:border-[#2F6B57] focus:ring-[#2F6B57]'
                                            }`}
                                        />
                                        {regErrors.email && (
                                            <span className="flex items-center gap-1 pt-0.5 text-[11px] font-medium text-[#B74E44]">
                                                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                                {regErrors.email}
                                            </span>
                                        )}
                                    </div>

                                    {/* Grid Dua Kolom: Kata Sandi & Konfirmasi */}
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        {/* Field: Kata Sandi */}
                                        <div className="space-y-1">
                                            <label
                                                htmlFor="reg-password"
                                                className="block text-xs font-semibold tracking-wider text-[#1D2924] uppercase"
                                            >
                                                Kata Sandi
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="reg-password"
                                                    type={
                                                        showRegisterPassword
                                                            ? 'text'
                                                            : 'password'
                                                    }
                                                    value={regPassword}
                                                    onChange={(e) => {
                                                        setRegPassword(
                                                            e.target.value,
                                                        );
                                                        if (
                                                            regErrors.password
                                                        ) {
                                                            setRegErrors(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    password:
                                                                        undefined,
                                                                }),
                                                            );
                                                        }
                                                    }}
                                                    placeholder="Min. 8 karakter"
                                                    className={`w-full rounded-md border bg-[#FFFEFA] py-2 pr-9 pl-3 text-sm text-[#1D2924] transition-colors placeholder:text-[#66736C]/60 focus:ring-1 focus:outline-none ${
                                                        regErrors.password
                                                            ? 'border-[#B74E44] focus:border-[#B74E44] focus:ring-[#B74E44]'
                                                            : 'border-[#E4E3DC] focus:border-[#2F6B57] focus:ring-[#2F6B57]'
                                                    }`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowRegisterPassword(
                                                            !showRegisterPassword,
                                                        )
                                                    }
                                                    className="absolute top-1/2 right-2 -translate-y-1/2 p-1 text-[#66736C] hover:text-[#1D2924]"
                                                    aria-label="Toggle password"
                                                >
                                                    {showRegisterPassword ? (
                                                        <EyeOff className="h-3.5 w-3.5" />
                                                    ) : (
                                                        <Eye className="h-3.5 w-3.5" />
                                                    )}
                                                </button>
                                            </div>
                                            {regErrors.password && (
                                                <span className="block pt-0.5 text-[11px] font-medium text-[#B74E44]">
                                                    {regErrors.password}
                                                </span>
                                            )}
                                        </div>

                                        {/* Field: Konfirmasi Kata Sandi */}
                                        <div className="space-y-1">
                                            <label
                                                htmlFor="reg-confirm"
                                                className="block text-xs font-semibold tracking-wider text-[#1D2924] uppercase"
                                            >
                                                Konfirmasi
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="reg-confirm"
                                                    type={
                                                        showRegisterPasswordConfirm
                                                            ? 'text'
                                                            : 'password'
                                                    }
                                                    value={regPasswordConfirm}
                                                    onChange={(e) => {
                                                        setRegPasswordConfirm(
                                                            e.target.value,
                                                        );
                                                        if (
                                                            regErrors.password_confirmation
                                                        ) {
                                                            setRegErrors(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    password_confirmation:
                                                                        undefined,
                                                                }),
                                                            );
                                                        }
                                                    }}
                                                    placeholder="Ulangi sandi"
                                                    className={`w-full rounded-md border bg-[#FFFEFA] py-2 pr-9 pl-3 text-sm text-[#1D2924] transition-colors placeholder:text-[#66736C]/60 focus:ring-1 focus:outline-none ${
                                                        regErrors.password_confirmation
                                                            ? 'border-[#B74E44] focus:border-[#B74E44] focus:ring-[#B74E44]'
                                                            : 'border-[#E4E3DC] focus:border-[#2F6B57] focus:ring-[#2F6B57]'
                                                    }`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowRegisterPasswordConfirm(
                                                            !showRegisterPasswordConfirm,
                                                        )
                                                    }
                                                    className="absolute top-1/2 right-2 -translate-y-1/2 p-1 text-[#66736C] hover:text-[#1D2924]"
                                                    aria-label="Toggle password confirm"
                                                >
                                                    {showRegisterPasswordConfirm ? (
                                                        <EyeOff className="h-3.5 w-3.5" />
                                                    ) : (
                                                        <Eye className="h-3.5 w-3.5" />
                                                    )}
                                                </button>
                                            </div>
                                            {regErrors.password_confirmation && (
                                                <span className="block pt-0.5 text-[11px] font-medium text-[#B74E44]">
                                                    {
                                                        regErrors.password_confirmation
                                                    }
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Checkbox Persetujuan Syarat & Privasi */}
                                    <div className="pt-1">
                                        <div className="flex items-start gap-2">
                                            <input
                                                id="agree-terms"
                                                type="checkbox"
                                                checked={regAgreeTerms}
                                                onChange={(e) => {
                                                    setRegAgreeTerms(
                                                        e.target.checked,
                                                    );
                                                    if (regErrors.terms) {
                                                        setRegErrors(
                                                            (prev) => ({
                                                                ...prev,
                                                                terms: undefined,
                                                            }),
                                                        );
                                                    }
                                                }}
                                                className="mt-0.5 h-4 w-4 rounded border-[#E4E3DC] text-[#2F6B57] focus:ring-[#2F6B57]"
                                            />
                                            <label
                                                htmlFor="agree-terms"
                                                className="cursor-pointer text-xs leading-snug text-[#66736C] select-none"
                                            >
                                                Saya menyetujui Ketentuan
                                                Layanan dan Kebijakan Privasi
                                                KomunitasHub.
                                            </label>
                                        </div>
                                        {regErrors.terms && (
                                            <span className="flex items-center gap-1 pt-1 text-[11px] font-medium text-[#B74E44]">
                                                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                                {regErrors.terms}
                                            </span>
                                        )}
                                    </div>

                                    {/* Tombol Utama: Buat Akun */}
                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={isRegProcessing}
                                            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#2F6B57] px-4 py-2.5 text-sm font-semibold text-[#FFFEFA] shadow-xs transition-colors hover:bg-[#245442] disabled:cursor-not-allowed disabled:opacity-70"
                                        >
                                            {isRegProcessing ? (
                                                <>
                                                    <Spinner className="h-4 w-4 text-[#FFFEFA]" />
                                                    <span>
                                                        Mendaftarkan akun
                                                        keluarga...
                                                    </span>
                                                </>
                                            ) : (
                                                <span>Buat Akun</span>
                                            )}
                                        </button>
                                    </div>
                                </form>

                                {/* Teks Bawah */}
                                <div className="pt-2 text-center text-xs text-[#66736C]">
                                    Sudah punya akun?{' '}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleModeSwitch('login')
                                        }
                                        className="font-semibold text-[#2F6B57] hover:underline"
                                    >
                                        Masuk
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}
