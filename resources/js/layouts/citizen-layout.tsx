import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { BrandLogo } from '@/components/komunitashub/brand-logo';
import {
    LayoutDashboard,
    Receipt,
    FileText,
    QrCode,
    Wallet,
    Users,
    HelpCircle,
    LogOut,
    Bell,
    Menu,
    X,
    ShieldCheck,
    Home,
    ChevronRight,
    Settings,
} from 'lucide-react';

interface CitizenLayoutProps {
    title?: string;
    communityMode?: 'RT Mandiri' | 'Cluster Aman';
    onModeChange?: (mode: 'RT Mandiri' | 'Cluster Aman') => void;
    activeNav?: 'ringkasan' | 'iuran' | 'surat' | 'tamu' | 'kas' | 'profil';
    onNavClick?: (
        nav: 'ringkasan' | 'iuran' | 'surat' | 'tamu' | 'kas' | 'profil',
    ) => void;
    children: React.ReactNode;
}

export default function CitizenLayout({
    title = 'Ringkasan Warga',
    communityMode = 'Cluster Aman',
    onModeChange,
    activeNav = 'ringkasan',
    onNavClick,
    children,
}: CitizenLayoutProps) {
    const [isMobileMenuDrawerOpen, setIsMobileMenuDrawerOpen] = useState(false);
    const [hasUnreadNotification, setHasUnreadNotification] = useState(true);

    const isCluster = communityMode === 'Cluster Aman';

    const handleNavigation = (
        nav: 'ringkasan' | 'iuran' | 'surat' | 'tamu' | 'kas' | 'profil',
    ) => {
        setIsMobileMenuDrawerOpen(false);
        if (onNavClick) {
            onNavClick(nav);
            return;
        }
        if (nav === 'ringkasan') {
            router.visit('/dashboard');
        } else if (nav === 'iuran') {
            router.visit('/iuran');
        } else if (nav === 'surat') {
            router.visit('/surat');
        } else if (nav === 'tamu') {
            router.visit('/tamu');
        } else if (nav === 'kas') {
            router.visit('/kas');
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#F7F6F2] font-sans text-[#1D2924] selection:bg-[#2F6B57]/20 selection:text-[#1D2924] md:flex-row">
            <Head title={`${title} — KomunitasHub`} />

            {/* DESKTOP SIDEBAR (ELEGAN, SEMPIT, STABIL) */}
            <aside className="sticky top-0 z-30 hidden h-screen w-60 flex-col border-r border-[#E4E3DC] bg-[#FFFEFA] select-none md:flex xl:w-64">
                {/* Bagian Atas Sidebar: Logo & Nama Komunitas */}
                <div className="space-y-3 border-b border-[#E4E3DC] p-5">
                    <Link href="/dashboard" className="inline-block">
                        <BrandLogo size="sm" />
                    </Link>

                    {/* Community Switcher / Info */}
                    <div className="space-y-1 rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] p-2.5">
                        <div className="flex items-center justify-between">
                            <span className="truncate text-xs font-bold text-[#1D2924]">
                                Komunitas Taman Sari
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] text-[#66736C]">
                                RT 04 / RW 09
                            </span>

                            {/* Mode Pill / Switcher for prototype testing */}
                            <button
                                type="button"
                                onClick={() =>
                                    onModeChange?.(
                                        isCluster
                                            ? 'RT Mandiri'
                                            : 'Cluster Aman',
                                    )
                                }
                                title="Klik untuk beralih mode simulasi"
                                className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold transition-colors ${
                                    isCluster
                                        ? 'bg-[#EBF3EF] text-[#2F6B57] hover:bg-[#2F6B57] hover:text-[#FFFEFA]'
                                        : 'border border-[#E4E3DC] bg-[#F7F6F2] text-[#1D2924] hover:bg-[#1D2924] hover:text-[#FFFEFA]'
                                }`}
                            >
                                {isCluster ? (
                                    <ShieldCheck className="h-3 w-3" />
                                ) : (
                                    <Home className="h-3 w-3" />
                                )}
                                <span>{communityMode}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Menu Utama Sidebar */}
                <nav className="flex-1 space-y-1 overflow-y-auto p-3 text-xs">
                    <button
                        type="button"
                        onClick={() => handleNavigation('ringkasan')}
                        className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors ${
                            activeNav === 'ringkasan'
                                ? 'border-l-2 border-[#2F6B57] bg-[#EBF3EF] font-semibold text-[#2F6B57]'
                                : 'text-[#66736C] hover:bg-[#F7F6F2] hover:text-[#1D2924]'
                        }`}
                    >
                        <LayoutDashboard className="h-4 w-4 shrink-0" />
                        <span>Ringkasan</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleNavigation('iuran')}
                        className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition-colors ${
                            activeNav === 'iuran'
                                ? 'border-l-2 border-[#2F6B57] bg-[#EBF3EF] font-semibold text-[#2F6B57]'
                                : 'text-[#66736C] hover:bg-[#F7F6F2] hover:text-[#1D2924]'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <Receipt className="h-4 w-4 shrink-0" />
                            <span>Iuran Rumah</span>
                        </div>
                        <span className="h-1.5 w-1.5 rounded-full bg-[#B87922]" />
                    </button>

                    <button
                        type="button"
                        onClick={() => handleNavigation('surat')}
                        className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors ${
                            activeNav === 'surat'
                                ? 'border-l-2 border-[#2F6B57] bg-[#EBF3EF] font-semibold text-[#2F6B57]'
                                : 'text-[#66736C] hover:bg-[#F7F6F2] hover:text-[#1D2924]'
                        }`}
                    >
                        <FileText className="h-4 w-4 shrink-0" />
                        <span>Surat Pengantar</span>
                    </button>

                    {/* Menu Tamu: Hanya jika Cluster Aman */}
                    {isCluster && (
                        <button
                            type="button"
                            onClick={() => handleNavigation('tamu')}
                            className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition-colors ${
                                activeNav === 'tamu'
                                    ? 'border-l-2 border-[#2F6B57] bg-[#EBF3EF] font-semibold text-[#2F6B57]'
                                    : 'text-[#66736C] hover:bg-[#F7F6F2] hover:text-[#1D2924]'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <QrCode className="h-4 w-4 shrink-0" />
                                <span>Izin Tamu QR</span>
                            </div>
                            <span className="py-0.2 inline-block rounded bg-[#EAF4EE] px-1.5 text-[9px] font-bold text-[#2F7D5C]">
                                1 Aktif
                            </span>
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => handleNavigation('kas')}
                        className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors ${
                            activeNav === 'kas'
                                ? 'border-l-2 border-[#2F6B57] bg-[#EBF3EF] font-semibold text-[#2F6B57]'
                                : 'text-[#66736C] hover:bg-[#F7F6F2] hover:text-[#1D2924]'
                        }`}
                    >
                        <Wallet className="h-4 w-4 shrink-0" />
                        <span>Laporan Kas</span>
                    </button>
                </nav>

                {/* Bagian Bawah Sidebar */}
                <div className="space-y-1 border-t border-[#E4E3DC] p-3 text-xs">
                    <button
                        type="button"
                        onClick={() => handleNavigation('profil')}
                        className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors ${
                            activeNav === 'profil'
                                ? 'bg-[#EBF3EF] font-semibold text-[#2F6B57]'
                                : 'text-[#66736C] hover:bg-[#F7F6F2] hover:text-[#1D2924]'
                        }`}
                    >
                        <Users className="h-4 w-4 shrink-0" />
                        <span>Profil Keluarga</span>
                    </button>

                    <a
                        href="#bantuan"
                        onClick={(e) => {
                            e.preventDefault();
                            alert(
                                'Pusat Bantuan Warga:\nHubungi sekretariat RT 04 Puri Taman Sari melalui grup WhatsApp resmi atau pos pengurus.',
                            );
                        }}
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-[#66736C] transition-colors hover:bg-[#F7F6F2] hover:text-[#1D2924]"
                    >
                        <HelpCircle className="h-4 w-4 shrink-0" />
                        <span>Bantuan Lingkungan</span>
                    </a>

                    {/* Akun Warga Card */}
                    <div className="mt-2 flex items-center justify-between border-t border-[#E4E3DC] p-1.5 pt-2">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#2F6B57]/20 bg-[#EBF3EF] text-xs font-bold text-[#2F6B57]">
                                KP
                            </div>
                            <div className="truncate">
                                <div className="truncate text-xs font-semibold text-[#1D2924]">
                                    Keluarga Pratama
                                </div>
                                <div className="text-[11px] text-[#66736C]">
                                    Rumah Blok A-12
                                </div>
                            </div>
                        </div>

                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="rounded p-1.5 text-[#66736C] transition-colors hover:bg-[#FBEBE9] hover:text-[#B74E44]"
                            title="Keluar"
                            aria-label="Keluar akun"
                        >
                            <LogOut className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* MOBILE TOP BAR */}
            <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[#E4E3DC] bg-[#FFFEFA] px-4 md:hidden">
                <Link href="/dashboard" className="inline-block">
                    <BrandLogo size="sm" />
                </Link>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => {
                            alert(
                                'Notifikasi Komunitas:\n• Iuran Keamanan Oktober jatuh tempo 10 November 2026.\n• Kerja bakti lingkungan hari Minggu pukul 07.00.',
                            );
                            setHasUnreadNotification(false);
                        }}
                        className="relative rounded-md p-1.5 text-[#66736C] hover:text-[#1D2924]"
                        aria-label="Notifikasi"
                    >
                        <Bell className="h-5 w-5" />
                        {hasUnreadNotification && (
                            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#B87922]" />
                        )}
                    </button>

                    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#2F6B57]/20 bg-[#EBF3EF] text-xs font-bold text-[#2F6B57]">
                        KP
                    </div>
                </div>
            </header>

            {/* AREA UTAMA KONTEN */}
            <div className="flex flex-1 flex-col overflow-y-auto pb-20 md:pb-8">
                {children}
            </div>

            {/* MOBILE BOTTOM NAVIGATION BAR (MAX 5 ITEMS) */}
            <nav className="fixed right-0 bottom-0 left-0 z-30 flex items-center justify-around border-t border-[#E4E3DC] bg-[#FFFEFA] px-2 py-1.5 shadow-sm md:hidden">
                {/* 1. Ringkasan */}
                <button
                    type="button"
                    onClick={() => handleNavigation('ringkasan')}
                    className={`flex min-w-14 flex-col items-center justify-center rounded-md px-2 py-1 transition-colors ${
                        activeNav === 'ringkasan'
                            ? 'font-semibold text-[#2F6B57]'
                            : 'text-[#66736C]'
                    }`}
                >
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="mt-0.5 text-[10px]">Ringkasan</span>
                </button>

                {/* 2. Iuran */}
                <button
                    type="button"
                    onClick={() => handleNavigation('iuran')}
                    className={`flex min-w-14 flex-col items-center justify-center rounded-md px-2 py-1 transition-colors ${
                        activeNav === 'iuran'
                            ? 'font-semibold text-[#2F6B57]'
                            : 'text-[#66736C]'
                    }`}
                >
                    <div className="relative">
                        <Receipt className="h-4 w-4" />
                        <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-[#B87922]" />
                    </div>
                    <span className="mt-0.5 text-[10px]">Iuran</span>
                </button>

                {/* 3. Tamu (Hanya jika Cluster Aman) ATAU Surat (Jika RT Mandiri) */}
                {isCluster ? (
                    <button
                        type="button"
                        onClick={() => handleNavigation('tamu')}
                        className={`flex min-w-14 flex-col items-center justify-center rounded-md px-2 py-1 transition-colors ${
                            activeNav === 'tamu'
                                ? 'font-semibold text-[#2F6B57]'
                                : 'text-[#66736C]'
                        }`}
                    >
                        <QrCode className="h-4 w-4" />
                        <span className="mt-0.5 text-[10px]">Tamu</span>
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={() => handleNavigation('surat')}
                        className={`flex min-w-14 flex-col items-center justify-center rounded-md px-2 py-1 transition-colors ${
                            activeNav === 'surat'
                                ? 'font-semibold text-[#2F6B57]'
                                : 'text-[#66736C]'
                        }`}
                    >
                        <FileText className="h-4 w-4" />
                        <span className="mt-0.5 text-[10px]">Surat</span>
                    </button>
                )}

                {/* 4. Surat (Jika Cluster Aman) ATAU Kas (Jika RT Mandiri) */}
                {isCluster ? (
                    <button
                        type="button"
                        onClick={() => handleNavigation('surat')}
                        className={`flex min-w-14 flex-col items-center justify-center rounded-md px-2 py-1 transition-colors ${
                            activeNav === 'surat'
                                ? 'font-semibold text-[#2F6B57]'
                                : 'text-[#66736C]'
                        }`}
                    >
                        <FileText className="h-4 w-4" />
                        <span className="mt-0.5 text-[10px]">Surat</span>
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={() => handleNavigation('kas')}
                        className={`flex min-w-14 flex-col items-center justify-center rounded-md px-2 py-1 transition-colors ${
                            activeNav === 'kas'
                                ? 'font-semibold text-[#2F6B57]'
                                : 'text-[#66736C]'
                        }`}
                    >
                        <Wallet className="h-4 w-4" />
                        <span className="mt-0.5 text-[10px]">Kas</span>
                    </button>
                )}

                {/* 5. Menu Drawer */}
                <button
                    type="button"
                    onClick={() => setIsMobileMenuDrawerOpen(true)}
                    className="flex min-w-14 flex-col items-center justify-center rounded-md px-2 py-1 text-[#66736C]"
                >
                    <Menu className="h-4 w-4" />
                    <span className="mt-0.5 text-[10px]">Menu</span>
                </button>
            </nav>

            {/* MOBILE DRAWER MODAL */}
            {isMobileMenuDrawerOpen && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#1D2924]/40 backdrop-blur-xs sm:items-center">
                    <div className="w-full animate-in space-y-4 rounded-t-2xl border-t border-[#E4E3DC] bg-[#FFFEFA] p-6 duration-200 slide-in-from-bottom-5 sm:max-w-md sm:rounded-xl sm:border sm:zoom-in-95">
                        <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-3">
                            <div className="space-y-0.5">
                                <h3 className="text-sm font-bold text-[#1D2924]">
                                    Menu Tambahan
                                </h3>
                                <p className="text-[11px] text-[#66736C]">
                                    Komunitas Taman Sari · Blok A-12
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsMobileMenuDrawerOpen(false)}
                                className="rounded p-1 text-[#66736C] hover:text-[#1D2924]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-1 text-xs">
                            <button
                                type="button"
                                onClick={() => handleNavigation('kas')}
                                className="flex w-full items-center justify-between rounded-lg p-2.5 text-left text-[#1D2924] hover:bg-[#F7F6F2]"
                            >
                                <div className="flex items-center gap-2.5">
                                    <Wallet className="h-4 w-4 text-[#2F6B57]" />
                                    <span>Laporan Kas Terbuka</span>
                                </div>
                                <ChevronRight className="h-4 w-4 text-[#66736C]" />
                            </button>

                            <button
                                type="button"
                                onClick={() => handleNavigation('profil')}
                                className="flex w-full items-center justify-between rounded-lg p-2.5 text-left text-[#1D2924] hover:bg-[#F7F6F2]"
                            >
                                <div className="flex items-center gap-2.5">
                                    <Users className="h-4 w-4 text-[#2F6B57]" />
                                    <span>Profil Keluarga & Anggota</span>
                                </div>
                                <ChevronRight className="h-4 w-4 text-[#66736C]" />
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setIsMobileMenuDrawerOpen(false);
                                    alert(
                                        'Mode Komunitas dapat diubah dari dashboard pengurus.',
                                    );
                                }}
                                className="flex w-full items-center justify-between rounded-lg p-2.5 text-left text-[#1D2924] hover:bg-[#F7F6F2]"
                            >
                                <div className="flex items-center gap-2.5">
                                    <Settings className="h-4 w-4 text-[#2F6B57]" />
                                    <span>Pengaturan Akun Rumah</span>
                                </div>
                                <ChevronRight className="h-4 w-4 text-[#66736C]" />
                            </button>
                        </div>

                        <div className="flex items-center justify-between border-t border-[#E4E3DC] pt-3">
                            <span className="text-[11px] text-[#66736C]">
                                Masuk sebagai: Keluarga Pratama
                            </span>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="text-xs font-semibold text-[#B74E44] hover:underline"
                            >
                                Keluar Akun
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
