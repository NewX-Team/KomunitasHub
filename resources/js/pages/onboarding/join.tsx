import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { BrandLogo } from '@/components/komunitashub/brand-logo';
import { Spinner } from '@/components/ui/spinner';
import {
    CheckCircle2,
    AlertCircle,
    Building2,
    ShieldCheck,
    Home,
    X,
    Lock,
    ArrowRight,
    HelpCircle,
    Info,
    Copy,
    Check,
    LogOut,
} from 'lucide-react';

interface CommunityData {
    name: string;
    location: string;
    mode: 'RT Mandiri' | 'Cluster Aman';
    description: string;
    code: string;
}

const mockCommunities: Record<string, CommunityData> = {
    'KHB-RT04-A7X9': {
        name: 'Komunitas Puri Taman Sari',
        location: 'RT 04 / RW 09 · Kelurahan Sukamaju',
        mode: 'Cluster Aman',
        description: 'Termasuk akses tamu digital dan QR untuk pos keamanan.',
        code: 'KHB-RT04-A7X9',
    },
    'TAMANSARI-04': {
        name: 'Komunitas Puri Taman Sari',
        location: 'RT 04 / RW 09 · Kelurahan Sukamaju',
        mode: 'Cluster Aman',
        description: 'Termasuk akses tamu digital dan QR untuk pos keamanan.',
        code: 'TAMANSARI-04',
    },
    'KHB-RT02-MDR': {
        name: 'Paguyuban Warga Melati',
        location: 'RT 02 / RW 05 · Kelurahan Gandaria',
        mode: 'RT Mandiri',
        description:
            'Iuran, administrasi warga, dan laporan kas dalam satu tempat.',
        code: 'KHB-RT02-MDR',
    },
    'RT02-MANDIRI': {
        name: 'Paguyuban Warga Melati',
        location: 'RT 02 / RW 05 · Kelurahan Gandaria',
        mode: 'RT Mandiri',
        description:
            'Iuran, administrasi warga, dan laporan kas dalam satu tempat.',
        code: 'RT02-MANDIRI',
    },
};

export default function JoinCommunity() {
    const { auth } = usePage().props as {
        auth: { user?: { name: string; email: string } };
    };

    const userName = auth?.user?.name || 'Rizky Pratama';
    const userInitials = userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    // Input & Verification States
    const [inviteCode, setInviteCode] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState<
        'idle' | 'valid' | 'invalid' | 'already-joined'
    >('idle');
    const [verifiedCommunity, setVerifiedCommunity] =
        useState<CommunityData | null>(null);

    // Help Dialog State
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [copiedHelpTemplate, setCopiedHelpTemplate] = useState(false);

    // Format & Clean input
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.toUpperCase();
        setInviteCode(val);
        // Reset status if user changes input
        if (verificationStatus !== 'idle') {
            setVerificationStatus('idle');
            setVerifiedCommunity(null);
        }
    };

    const handleClearInput = () => {
        setInviteCode('');
        setVerificationStatus('idle');
        setVerifiedCommunity(null);
    };

    // Verification Logic
    const handleVerifyCode = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = inviteCode.trim();

        if (!trimmed || trimmed.length < 4) return;

        setIsVerifying(true);

        setTimeout(() => {
            setIsVerifying(false);

            // Special Mock Check: Already Joined Community
            if (trimmed === 'ALREADY-JOINED' || trimmed === 'KHB-JOINED-01') {
                setVerificationStatus('already-joined');
                return;
            }

            // Check against known mock codes
            if (mockCommunities[trimmed]) {
                setVerifiedCommunity(mockCommunities[trimmed]);
                setVerificationStatus('valid');
                return;
            }

            // Fallback match for realistic formats
            if (
                trimmed.includes('CLUSTER') ||
                trimmed.includes('TAMAN') ||
                trimmed.includes('04')
            ) {
                setVerifiedCommunity(mockCommunities['TAMANSARI-04']);
                setVerificationStatus('valid');
                return;
            }

            if (trimmed.includes('RT') || trimmed.includes('MDR')) {
                setVerifiedCommunity(mockCommunities['RT02-MANDIRI']);
                setVerificationStatus('valid');
                return;
            }

            // Otherwise, invalid code
            setVerificationStatus('invalid');
        }, 350);
    };

    const handleContinueToProfile = () => {
        router.visit('/lengkapi-profil');
    };

    const handleResetToAnotherCode = () => {
        setVerificationStatus('idle');
        setVerifiedCommunity(null);
        setInviteCode('');
    };

    const handleCopyHelpTemplate = () => {
        const text =
            'Halo Pak/Bu Pengurus RT, saya warga baru di rumah [Nomor Rumah]. Mohon informasi kode undangan KomunitasHub untuk registrasi keluarga kami. Terima kasih.';
        void navigator.clipboard?.writeText(text);
        setCopiedHelpTemplate(true);
        setTimeout(() => setCopiedHelpTemplate(false), 2000);
    };

    return (
        <>
            <Head title="Gabung Komunitas — KomunitasHub" />

            <div className="flex min-h-screen flex-col bg-[#F7F6F2] font-sans text-[#1D2924] selection:bg-[#2F6B57]/20 selection:text-[#1D2924]">
                {/* 1. HEADER TIPIS & SEDERHANA */}
                <header className="sticky top-0 z-20 border-b border-[#E4E3DC] bg-[#FFFEFA]">
                    <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
                        {/* Wordmark Kiri */}
                        <Link href="/" className="inline-block">
                            <BrandLogo size="sm" />
                        </Link>

                        {/* User Account Info & Logout Kanan */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#2F6B57]/20 bg-[#EBF3EF] text-[11px] font-bold text-[#2F6B57]">
                                    {userInitials}
                                </div>
                                <span className="hidden text-xs font-semibold text-[#1D2924] sm:inline">
                                    {userName}
                                </span>
                            </div>

                            <span className="text-[#E4E3DC]">|</span>

                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="inline-flex items-center gap-1 text-xs font-medium text-[#66736C] transition-colors hover:text-[#B74E44]"
                            >
                                <LogOut className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Keluar</span>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* 2. PROGRESS ONBOARDING ELEGAN */}
                <div className="border-b border-[#E4E3DC] bg-[#FFFEFA]/60">
                    <div className="mx-auto max-w-5xl px-4 py-2.5 sm:px-6">
                        {/* Desktop 3 Steps */}
                        <div className="hidden items-center justify-center gap-8 text-xs sm:flex">
                            <div className="flex items-center gap-2 font-semibold text-[#2F6B57]">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2F6B57] text-[11px] text-[#FFFEFA]">
                                    1
                                </span>
                                <span>Gabung Komunitas</span>
                            </div>
                            <span className="h-px w-8 bg-[#E4E3DC]" />
                            <div className="flex items-center gap-2 text-[#66736C]">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#E4E3DC] bg-[#FFFEFA] text-[11px]">
                                    2
                                </span>
                                <span>Profil Keluarga</span>
                            </div>
                            <span className="h-px w-8 bg-[#E4E3DC]" />
                            <div className="flex items-center gap-2 text-[#66736C]">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#E4E3DC] bg-[#FFFEFA] text-[11px]">
                                    3
                                </span>
                                <span>Verifikasi</span>
                            </div>
                        </div>

                        {/* Mobile Progress Indicator */}
                        <div className="space-y-1.5 sm:hidden">
                            <div className="flex items-center justify-between text-xs text-[#66736C]">
                                <span className="font-semibold text-[#2F6B57]">
                                    Langkah 1 dari 3
                                </span>
                                <span>Gabung Komunitas</span>
                            </div>
                            <div className="h-1 w-full overflow-hidden rounded-full bg-[#E4E3DC]">
                                <div className="h-full w-1/3 rounded-full bg-[#2F6B57]" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. AREA UTAMA ONBOARDING DENGAN POLA GEOMETRIS SUBTIL */}
                <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-10 sm:px-6 sm:py-16">
                    {/* Visual Dekoratif Minimal: Garis Peta Blok Lingkungan Samar (Subtil, Datar) */}
                    <div
                        className="pointer-events-none absolute inset-0 opacity-25 select-none"
                        aria-hidden="true"
                    >
                        <svg
                            className="h-full w-full stroke-[#66736C]/30"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                        >
                            <defs>
                                <pattern
                                    id="neighborhood-grid"
                                    width="120"
                                    height="120"
                                    patternUnits="userSpaceOnUse"
                                >
                                    {/* Jalan utama */}
                                    <path
                                        d="M 0 40 L 120 40 M 40 0 L 40 120"
                                        strokeWidth="1"
                                    />
                                    {/* Garis batas kavling rumah */}
                                    <rect
                                        x="8"
                                        y="8"
                                        width="24"
                                        height="24"
                                        strokeWidth="0.8"
                                        rx="2"
                                    />
                                    <rect
                                        x="48"
                                        y="8"
                                        width="28"
                                        height="24"
                                        strokeWidth="0.8"
                                        rx="2"
                                    />
                                    <rect
                                        x="84"
                                        y="8"
                                        width="28"
                                        height="24"
                                        strokeWidth="0.8"
                                        rx="2"
                                    />
                                    <rect
                                        x="8"
                                        y="48"
                                        width="24"
                                        height="28"
                                        strokeWidth="0.8"
                                        rx="2"
                                    />
                                    <rect
                                        x="8"
                                        y="84"
                                        width="24"
                                        height="28"
                                        strokeWidth="0.8"
                                        rx="2"
                                    />
                                    <rect
                                        x="48"
                                        y="48"
                                        width="28"
                                        height="28"
                                        strokeWidth="0.8"
                                        rx="2"
                                    />
                                    <rect
                                        x="84"
                                        y="48"
                                        width="28"
                                        height="28"
                                        strokeWidth="0.8"
                                        rx="2"
                                    />
                                </pattern>
                            </defs>
                            <rect
                                width="100%"
                                height="100%"
                                fill="url(#neighborhood-grid)"
                            />
                        </svg>
                    </div>

                    {/* Content Card / Container (Max Width 560-640px) */}
                    <div className="relative w-full max-w-[580px] space-y-6 rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-6 shadow-xs sm:p-10">
                        {/* STATE SUDAH TERHUBUNG KE KOMUNITAS LAIN */}
                        {verificationStatus === 'already-joined' ? (
                            <div className="animate-in space-y-6 duration-200 fade-in">
                                <div className="space-y-3 rounded-xl border border-[#2F6B57]/20 bg-[#EBF3EF] p-5">
                                    <div className="flex items-center gap-2 text-[#2F6B57]">
                                        <Info className="h-5 w-5 shrink-0" />
                                        <h3 className="text-sm font-bold">
                                            Akun Anda Sudah Terhubung
                                        </h3>
                                    </div>
                                    <p className="text-xs leading-relaxed text-[#1D2924]">
                                        Akun keluarga Anda saat ini sudah
                                        terhubung ke{' '}
                                        <strong>
                                            Komunitas Puri Taman Sari
                                        </strong>
                                        . Sistem KomunitasHub menetapkan prinsip{' '}
                                        <strong>
                                            1 Akun Resmi untuk 1 Rumah
                                        </strong>{' '}
                                        demi ketertiban data kependudukan dan
                                        iuran.
                                    </p>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <Link
                                        href="/dashboard"
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#2F6B57] px-4 py-2.5 text-sm font-semibold text-[#FFFEFA] shadow-xs transition-colors hover:bg-[#245442]"
                                    >
                                        Buka Dashboard Warga
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={handleResetToAnotherCode}
                                        className="w-full py-2 text-center text-xs font-medium text-[#66736C] hover:text-[#1D2924]"
                                    >
                                        Gunakan kode lain untuk pengujian
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* HEADER FORM / KONTEN UTAMA */}
                                <div className="space-y-1.5">
                                    <span className="inline-block text-[11px] font-semibold tracking-wider text-[#2F6B57] uppercase">
                                        Mulai bergabung
                                    </span>
                                    <h2 className="text-2xl font-bold tracking-tight text-[#1D2924]">
                                        Masukkan kode komunitas
                                    </h2>
                                    <p className="text-xs leading-relaxed text-[#66736C] sm:text-sm">
                                        Minta kode undangan kepada pengurus RT
                                        atau admin komunitas Anda untuk
                                        melanjutkan.
                                    </p>
                                </div>

                                {/* FORM INPUT KODE */}
                                <form
                                    onSubmit={handleVerifyCode}
                                    className="space-y-4"
                                >
                                    <div className="space-y-1.5">
                                        <label
                                            htmlFor="community-invite-code"
                                            className="block text-xs font-semibold tracking-wider text-[#1D2924] uppercase"
                                        >
                                            Kode Undangan Komunitas
                                        </label>

                                        {/* Input Box dengan Format Besar & Bersih */}
                                        <div className="relative">
                                            <input
                                                id="community-invite-code"
                                                type="text"
                                                autoFocus
                                                disabled={
                                                    verificationStatus ===
                                                    'valid'
                                                }
                                                value={inviteCode}
                                                onChange={handleInputChange}
                                                placeholder="Contoh: KHB-RT04-A7X9"
                                                className={`w-full rounded-lg border bg-[#FFFEFA] px-4 py-3 font-mono text-base font-bold tracking-wider text-[#1D2924] transition-colors placeholder:font-sans placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-[#66736C]/60 focus:ring-1 focus:outline-none sm:text-lg ${
                                                    verificationStatus ===
                                                    'valid'
                                                        ? 'border-[#2F7D5C] bg-[#EAF4EE]/40 text-[#2F7D5C]'
                                                        : verificationStatus ===
                                                            'invalid'
                                                          ? 'border-[#B74E44] focus:border-[#B74E44] focus:ring-[#B74E44]'
                                                          : 'border-[#E4E3DC] focus:border-[#2F6B57] focus:ring-[#2F6B57]'
                                                }`}
                                            />

                                            {/* Action Icon / Clear Button */}
                                            <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1.5">
                                                {verificationStatus ===
                                                'valid' ? (
                                                    <span className="inline-flex items-center gap-1 rounded bg-[#EAF4EE] px-2 py-0.5 text-xs font-bold text-[#2F7D5C]">
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                        Valid
                                                    </span>
                                                ) : inviteCode.length > 0 ? (
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            handleClearInput
                                                        }
                                                        className="rounded p-1 text-[#66736C] hover:bg-[#E4E3DC]/40 hover:text-[#1D2924]"
                                                        aria-label="Hapus kode"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                ) : null}
                                            </div>
                                        </div>

                                        {/* Helper Text / Feedback Text */}
                                        {verificationStatus === 'invalid' ? (
                                            <div className="animate-in space-y-1 rounded-lg border border-[#B74E44]/30 bg-[#FBEBE9] p-3 text-xs text-[#B74E44] duration-150 fade-in">
                                                <div className="flex items-center gap-1.5 font-semibold">
                                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                                    <span>
                                                        Kode undangan belum
                                                        ditemukan atau sudah
                                                        tidak aktif.
                                                    </span>
                                                </div>
                                                <p className="pl-5.5 text-[11px] text-[#66736C]">
                                                    Periksa kembali kode Anda
                                                    atau hubungi pengurus
                                                    komunitas. Contoh kode
                                                    pengujian:{' '}
                                                    <code className="font-mono font-bold text-[#1D2924]">
                                                        TAMANSARI-04
                                                    </code>{' '}
                                                    atau{' '}
                                                    <code className="font-mono font-bold text-[#1D2924]">
                                                        RT02-MANDIRI
                                                    </code>
                                                    .
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-[11px] text-[#66736C]">
                                                Kode undangan memastikan Anda
                                                bergabung ke lingkungan yang
                                                tepat.
                                            </p>
                                        )}
                                    </div>

                                    {/* Action Button: Verifikasi (Hanya Tampil saat belum valid) */}
                                    {verificationStatus !== 'valid' && (
                                        <div className="pt-2">
                                            <button
                                                type="submit"
                                                disabled={
                                                    inviteCode.trim().length <
                                                        4 || isVerifying
                                                }
                                                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#2F6B57] px-4 py-2.5 text-sm font-semibold text-[#FFFEFA] shadow-xs transition-colors hover:bg-[#245442] disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {isVerifying ? (
                                                    <>
                                                        <Spinner className="h-4 w-4 text-[#FFFEFA]" />
                                                        <span>
                                                            Memverifikasi
                                                            kode...
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span>Verifikasi Kode</span>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </form>

                                {/* STATE KODE VALID: PANEL KONFIRMASI KOMUNITAS */}
                                {verificationStatus === 'valid' &&
                                    verifiedCommunity && (
                                        <div className="animate-in space-y-5 border-t border-[#E4E3DC] pt-3 duration-200 fade-in slide-in-from-top-2 motion-reduce:animate-none">
                                            <div className="space-y-4 rounded-xl border border-[#2F7D5C]/30 bg-[#FFFEFA] p-5">
                                                {/* Status Badge & Mode */}
                                                <div className="flex items-center justify-between">
                                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2F7D5C]/20 bg-[#EAF4EE] px-2.5 py-1 text-xs font-semibold text-[#2F7D5C]">
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                        Kode valid
                                                    </span>

                                                    <span className="inline-flex items-center gap-1.5 rounded-md bg-[#EBF3EF] px-2.5 py-1 text-xs font-semibold text-[#2F6B57]">
                                                        {verifiedCommunity.mode ===
                                                        'Cluster Aman' ? (
                                                            <ShieldCheck className="h-3.5 w-3.5" />
                                                        ) : (
                                                            <Home className="h-3.5 w-3.5" />
                                                        )}
                                                        {verifiedCommunity.mode}
                                                    </span>
                                                </div>

                                                {/* Community Info Block */}
                                                <div className="flex items-start gap-3.5 pt-1">
                                                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] text-[#2F6B57]">
                                                        <Building2 className="h-5 w-5" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <h3 className="text-base font-bold text-[#1D2924]">
                                                            {
                                                                verifiedCommunity.name
                                                            }
                                                        </h3>
                                                        <p className="text-xs text-[#66736C]">
                                                            {
                                                                verifiedCommunity.location
                                                            }
                                                        </p>
                                                        <p className="pt-1 text-xs text-[#1D2924]">
                                                            {
                                                                verifiedCommunity.description
                                                            }
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Teks Konfirmasi Warga */}
                                                <div className="border-t border-[#E4E3DC] pt-3 text-xs text-[#66736C]">
                                                    Pastikan komunitas ini
                                                    sesuai dengan tempat tinggal
                                                    Anda sebelum melanjutkan ke
                                                    pengisian profil.
                                                </div>
                                            </div>

                                            {/* Tombol Lanjutkan & Ganti Kode */}
                                            <div className="space-y-2 pt-1">
                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleContinueToProfile
                                                    }
                                                    className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#2F6B57] px-4 py-2.5 text-sm font-semibold text-[#FFFEFA] shadow-xs transition-colors hover:bg-[#245442]"
                                                >
                                                    <span>
                                                        Lanjutkan ke Profil
                                                        Keluarga
                                                    </span>
                                                    <ArrowRight className="h-4 w-4" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleResetToAnotherCode
                                                    }
                                                    className="w-full py-2 text-xs font-semibold text-[#66736C] transition-colors hover:text-[#1D2924]"
                                                >
                                                    Gunakan kode lain
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                {/* TAUTAN SEKUNDER: BELUM PUNYA KODE? */}
                                {verificationStatus !== 'valid' && (
                                    <div className="border-t border-[#E4E3DC] pt-2 text-center">
                                        <button
                                            type="button"
                                            onClick={() => setIsHelpOpen(true)}
                                            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#66736C] transition-colors hover:text-[#2F6B57]"
                                        >
                                            <HelpCircle className="h-3.5 w-3.5" />
                                            Belum punya kode? Hubungi pengurus
                                            komunitas
                                        </button>
                                    </div>
                                )}

                                {/* CATATAN PRIVASI DI BAGIAN BAWAH */}
                                <div className="flex items-center justify-center gap-1.5 pt-2 text-center text-[11px] text-[#66736C]">
                                    <Lock className="h-3 w-3 shrink-0 text-[#2F6B57]" />
                                    <span>
                                        KomunitasHub tidak akan membagikan data
                                        keluarga Anda ke komunitas lain.
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                </main>

                {/* MODAL / DIALOG BANTUAN CARA MENDAPATKAN KODE */}
                {isHelpOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D2924]/40 p-4 backdrop-blur-xs">
                        <div className="relative w-full max-w-md animate-in overflow-hidden rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] shadow-lg duration-200 zoom-in-95 fade-in">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between border-b border-[#E4E3DC] bg-[#F7F6F2] px-5 py-3.5">
                                <h3 className="flex items-center gap-2 text-sm font-bold text-[#1D2924]">
                                    <HelpCircle className="h-4 w-4 text-[#2F6B57]" />
                                    Mendapatkan Kode Komunitas
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setIsHelpOpen(false)}
                                    className="rounded p-1 text-[#66736C] hover:bg-[#E4E3DC]/40 hover:text-[#1D2924]"
                                    aria-label="Tutup dialog"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="space-y-4 p-5 text-xs text-[#1D2924]">
                                <p className="leading-relaxed text-[#66736C]">
                                    Kode undangan diterbitkan secara resmi oleh
                                    Ketua RT, Bendahara, atau pengelola
                                    perumahan Anda untuk memastikan hanya warga
                                    sah yang bergabung ke sistem.
                                </p>

                                <div className="space-y-2 rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] p-3.5">
                                    <div className="font-semibold text-[#1D2924]">
                                        Template Pesan untuk Pengurus
                                        Lingkungan:
                                    </div>
                                    <p className="rounded border border-[#E4E3DC] bg-[#FFFEFA] p-2.5 font-mono text-[11px] leading-relaxed text-[#1D2924]">
                                        "Halo Pak/Bu Pengurus RT, saya warga
                                        baru di rumah [Nomor Rumah]. Mohon
                                        informasi kode undangan KomunitasHub
                                        untuk registrasi keluarga kami. Terima
                                        kasih."
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleCopyHelpTemplate}
                                        className="inline-flex items-center gap-1.5 pt-1 text-xs font-semibold text-[#2F6B57] hover:underline"
                                    >
                                        {copiedHelpTemplate ? (
                                            <>
                                                <Check className="h-3.5 w-3.5 text-[#2F7D5C]" />
                                                Teks berhasil disalin
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-3.5 w-3.5" />
                                                Salin pesan WhatsApp
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="flex items-start gap-2 rounded-lg bg-[#EBF3EF] p-3 text-[11px] leading-relaxed text-[#2F6B57]">
                                    <Info className="mt-0.5 h-4 w-4 shrink-0" />
                                    <span>
                                        Untuk mencoba demo ini, Anda dapat
                                        menggunakan kode{' '}
                                        <strong className="font-mono">
                                            TAMANSARI-04
                                        </strong>{' '}
                                        (Cluster Aman) atau{' '}
                                        <strong className="font-mono">
                                            RT02-MANDIRI
                                        </strong>{' '}
                                        (RT Mandiri).
                                    </span>
                                </div>

                                <div className="flex justify-end pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsHelpOpen(false)}
                                        className="rounded-md bg-[#2F6B57] px-4 py-2 text-xs font-semibold text-[#FFFEFA] transition-colors hover:bg-[#245442]"
                                    >
                                        Mengerti
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
