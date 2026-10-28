import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { BrandLogo } from '@/components/komunitashub/brand-logo';
import {
    LayoutDashboard,
    UserCheck,
    Home,
    KeyRound,
    Users,
    FileText,
    History,
    Settings,
    HelpCircle,
    LogOut,
    Menu,
    X,
    ShieldCheck,
    User,
    ExternalLink,
    ChevronDown,
} from 'lucide-react';

export type AdminNavKey =
    | 'ringkasan'
    | 'verifikasi'
    | 'rumah'
    | 'undangan'
    | 'pengurus'
    | 'surat'
    | 'audit'
    | 'pengaturan';

interface AdminLayoutProps {
    title?: string;
    communityMode?: 'RT Mandiri' | 'Cluster Aman';
    onModeChange?: (mode: 'RT Mandiri' | 'Cluster Aman') => void;
    activeNav?: AdminNavKey;
    onNavClick?: (nav: AdminNavKey) => void;
    pendingVerificationCount?: number;
    children: React.ReactNode;
}

export default function AdminLayout({
    title = 'Ringkasan Operasional Admin',
    communityMode = 'Cluster Aman',
    onModeChange,
    activeNav = 'ringkasan',
    onNavClick,
    pendingVerificationCount = 6,
    children,
}: AdminLayoutProps) {
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const isCluster = communityMode === 'Cluster Aman';

    const navItems = [
        {
            key: 'ringkasan' as AdminNavKey,
            label: 'Ringkasan',
            icon: LayoutDashboard,
            badge: null,
        },
        {
            key: 'verifikasi' as AdminNavKey,
            label: 'Verifikasi Keluarga',
            icon: UserCheck,
            badge:
                pendingVerificationCount > 0 ? (
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#B87922]/15 px-1.5 text-[11px] font-semibold text-[#B87922]">
                        {pendingVerificationCount}
                    </span>
                ) : null,
        },
        {
            key: 'rumah' as AdminNavKey,
            label: 'Rumah & Warga',
            icon: Home,
            badge: null,
        },
        {
            key: 'undangan' as AdminNavKey,
            label: 'Kode Undangan',
            icon: KeyRound,
            badge: null,
        },
        {
            key: 'pengurus' as AdminNavKey,
            label: 'Pengurus & Role',
            icon: Users,
            badge: null,
        },
        {
            key: 'surat' as AdminNavKey,
            label: 'Template Surat',
            icon: FileText,
            badge: null,
        },
        {
            key: 'audit' as AdminNavKey,
            label: 'Audit Log',
            icon: History,
            badge: null,
        },
        {
            key: 'pengaturan' as AdminNavKey,
            label: 'Pengaturan Komunitas',
            icon: Settings,
            badge: null,
        },
    ];

    const handleNavigation = (navKey: AdminNavKey) => {
        setIsMobileDrawerOpen(false);
        if (onNavClick) {
            onNavClick(navKey);
            return;
        }
        if (navKey === 'ringkasan') {
            router.visit('/admin');
        } else {
            alert(
                `Navigasi Admin: Modul "${navItems.find((n) => n.key === navKey)?.label}" aktif. Seluruh fitur administrasi RT/Cluster terpusat pada Dashboard Operasional ini.`,
            );
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#F7F6F2] font-sans text-[#1D2924] selection:bg-[#2F6B57]/20 selection:text-[#1D2924] md:flex-row">
            <Head title={`${title} — Admin KomunitasHub`} />

            {/* DESKTOP SIDEBAR (TENANG, RAPI, FLUSH INDICATOR, ZERO PILL BUTTON) */}
            <aside className="sticky top-0 z-30 hidden h-screen w-64 flex-col justify-between border-r border-[#E4E3DC] bg-[#FFFEFA] select-none md:flex lg:w-68">
                {/* Bagian Atas: Wordmark, Komunitas, Role, Mode */}
                <div>
                    <div className="border-b border-[#E4E3DC] px-6 py-5">
                        <Link
                            href="/admin"
                            className="inline-block focus:outline-hidden"
                        >
                            <BrandLogo size="sm" />
                        </Link>

                        {/* Identitas Komunitas & Role */}
                        <div className="mt-4 space-y-1">
                            <h2 className="text-xs font-semibold tracking-tight text-[#1D2924]">
                                Komunitas Taman Sari
                            </h2>
                            <p className="text-[11px] text-[#66736C]">
                                RT 04 / RW 09 · Kelurahan Sukamaju
                            </p>

                            <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                                <span className="inline-flex items-center rounded bg-[#EBF3EF] px-1.5 py-0.5 text-[10px] font-semibold text-[#2F6B57]">
                                    Admin Komunitas
                                </span>

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
                                    className="inline-flex items-center gap-1 rounded border border-[#E4E3DC] bg-[#FFFEFA] px-1.5 py-0.5 text-[10px] font-medium text-[#1D2924] transition-colors hover:border-[#2F6B57] hover:text-[#2F6B57]"
                                >
                                    <ShieldCheck className="h-3 w-3 text-[#2F6B57]" />
                                    <span>{communityMode}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Navigasi Menu Sidebar (Flush Left Indicator, Tanpa Pill Box) */}
                    <nav className="space-y-0.5 py-3 text-xs">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeNav === item.key;
                            return (
                                <button
                                    key={item.key}
                                    type="button"
                                    onClick={() => handleNavigation(item.key)}
                                    className={`group flex w-full items-center justify-between px-6 py-2.5 text-left transition-colors ${
                                        isActive
                                            ? 'border-l-[3px] border-[#2F6B57] bg-[#F2F7F4] font-medium text-[#1D2924]'
                                            : 'border-l-[3px] border-transparent text-[#66736C] hover:bg-[#FAF9F5] hover:text-[#1D2924]'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon
                                            strokeWidth={1.75}
                                            className={`h-4 w-4 shrink-0 transition-colors ${
                                                isActive
                                                    ? 'text-[#2F6B57]'
                                                    : 'text-[#66736C] group-hover:text-[#1D2924]'
                                            }`}
                                        />
                                        <span>{item.label}</span>
                                    </div>
                                    {item.badge}
                                </button>
                            );
                        })}

                        {/* Tautan Menuju Portal Warga */}
                        <div className="pt-2">
                            <div className="mx-6 my-2 border-t border-[#E4E3DC]" />
                            <Link
                                href="/dashboard"
                                className="flex w-full items-center justify-between border-l-[3px] border-transparent px-6 py-2 text-left text-xs text-[#66736C] transition-colors hover:bg-[#FAF9F5] hover:text-[#1D2924]"
                            >
                                <span className="flex items-center gap-3">
                                    <ExternalLink
                                        strokeWidth={1.75}
                                        className="h-3.5 w-3.5 text-[#66736C]"
                                    />
                                    <span>Lihat Portal Warga</span>
                                </span>
                                <span className="text-[10px] text-[#66736C]">
                                    Warga
                                </span>
                            </Link>
                        </div>
                    </nav>
                </div>

                {/* Bagian Bawah Sidebar: Bantuan, Profil & Logout */}
                <div className="space-y-2 border-t border-[#E4E3DC] p-4 text-xs">
                    <button
                        type="button"
                        onClick={() =>
                            alert(
                                'Pusat Bantuan & SOP Pengurus:\nDokumentasi tata kelola administrasi KomunitasHub, panduan ekspor data kependudukan, dan bantuan teknis tersedia untuk seluruh jajaran pengurus RT 04 Sukamaju.',
                            )
                        }
                        className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-[#66736C] transition-colors hover:bg-[#FAF9F5] hover:text-[#1D2924]"
                    >
                        <HelpCircle
                            strokeWidth={1.75}
                            className="h-4 w-4 shrink-0"
                        />
                        <span>Bantuan & SOP</span>
                    </button>

                    {/* Kartu Profil Admin */}
                    <div className="relative border-t border-[#E4E3DC] pt-2">
                        <div className="flex items-center justify-between rounded-lg p-1.5 transition-colors hover:bg-[#F7F6F2]">
                            <button
                                type="button"
                                onClick={() =>
                                    setIsProfileMenuOpen(!isProfileMenuOpen)
                                }
                                className="flex flex-1 items-center gap-2.5 overflow-hidden text-left"
                            >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EBF3EF] text-xs font-semibold text-[#2F6B57]">
                                    DL
                                </div>
                                <div className="truncate">
                                    <div className="truncate text-xs font-medium text-[#1D2924]">
                                        Dewi Lestari
                                    </div>
                                    <div className="text-[11px] text-[#66736C]">
                                        Admin Komunitas
                                    </div>
                                </div>
                                <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#66736C]" />
                            </button>

                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="rounded p-1.5 text-[#66736C] transition-colors hover:bg-[#FDF2F0] hover:text-[#B74E44]"
                                title="Keluar dari sesi admin"
                                aria-label="Keluar"
                            >
                                <LogOut
                                    strokeWidth={1.75}
                                    className="h-4 w-4"
                                />
                            </Link>
                        </div>

                        {/* Popover Profil Akun Admin */}
                        {isProfileMenuOpen && (
                            <div className="absolute right-0 bottom-full left-0 mb-2 rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] p-2 shadow-lg">
                                <div className="px-2 py-1.5 text-[10px] font-semibold tracking-wider text-[#66736C] uppercase">
                                    Akun & Hak Akses
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsProfileMenuOpen(false);
                                        alert(
                                            'Profil Akun: Dewi Lestari\nEmail: dewi.lestari@komunitastamansari.id\nRole Sistem: Admin Komunitas (Dibuat internal oleh sistem RT 04).',
                                        );
                                    }}
                                    className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs text-[#1D2924] hover:bg-[#F7F6F2]"
                                >
                                    <User className="h-3.5 w-3.5 text-[#66736C]" />
                                    <span>Profil Akun Saya</span>
                                </button>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs text-[#B74E44] hover:bg-[#FDF2F0]"
                                >
                                    <LogOut className="h-3.5 w-3.5" />
                                    <span>Keluar Sesi</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* MOBILE TOP BAR */}
            <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[#E4E3DC] bg-[#FFFEFA] px-4 md:hidden">
                <Link href="/admin" className="inline-block">
                    <BrandLogo size="sm" />
                </Link>

                <div className="flex items-center gap-2">
                    <span className="rounded bg-[#EBF3EF] px-2 py-0.5 text-[10px] font-semibold text-[#2F6B57]">
                        Admin
                    </span>
                    <button
                        type="button"
                        onClick={() =>
                            setIsMobileDrawerOpen(!isMobileDrawerOpen)
                        }
                        className="rounded-md border border-[#E4E3DC] p-1.5 text-[#1D2924] hover:bg-[#F7F6F2]"
                        aria-label="Buka menu navigasi"
                    >
                        {isMobileDrawerOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </header>

            {/* MOBILE DRAWER NAVIGATION OVERLAY */}
            {isMobileDrawerOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden">
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-xs"
                        onClick={() => setIsMobileDrawerOpen(false)}
                    />
                    <div className="relative flex h-full w-4/5 max-w-xs flex-col border-r border-[#E4E3DC] bg-[#FFFEFA] p-5 shadow-xl">
                        <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-4">
                            <div>
                                <BrandLogo size="sm" />
                                <p className="mt-1 text-xs font-semibold text-[#1D2924]">
                                    Komunitas Taman Sari
                                </p>
                                <p className="text-[10px] text-[#66736C]">
                                    Admin Komunitas
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsMobileDrawerOpen(false)}
                                className="rounded p-1 text-[#66736C] hover:bg-[#F7F6F2]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Mode badge switcher */}
                        <div className="my-3 flex items-center justify-between rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] px-3 py-2 text-xs">
                            <span className="text-[#66736C]">Mode:</span>
                            <button
                                type="button"
                                onClick={() =>
                                    onModeChange?.(
                                        isCluster
                                            ? 'RT Mandiri'
                                            : 'Cluster Aman',
                                    )
                                }
                                className="font-semibold text-[#2F6B57]"
                            >
                                {communityMode}
                            </button>
                        </div>

                        <div className="flex-1 space-y-1 overflow-y-auto py-2 text-xs">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = activeNav === item.key;
                                return (
                                    <button
                                        key={item.key}
                                        type="button"
                                        onClick={() =>
                                            handleNavigation(item.key)
                                        }
                                        className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left transition-colors ${
                                            isActive
                                                ? 'bg-[#EBF3EF] font-semibold text-[#2F6B57]'
                                                : 'text-[#66736C] hover:bg-[#F7F6F2] hover:text-[#1D2924]'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className="h-4 w-4 shrink-0" />
                                            <span>{item.label}</span>
                                        </div>
                                        {item.badge}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Mobile Drawer Footer */}
                        <div className="border-t border-[#E4E3DC] pt-3 text-xs">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EBF3EF] text-xs font-bold text-[#2F6B57]">
                                        DL
                                    </div>
                                    <div>
                                        <div className="font-semibold text-[#1D2924]">
                                            Dewi Lestari
                                        </div>
                                        <div className="text-[10px] text-[#66736C]">
                                            Admin Komunitas
                                        </div>
                                    </div>
                                </div>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="rounded p-1 text-[#B74E44]"
                                >
                                    <LogOut className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* AREA UTAMA KONTEN */}
            <main className="flex min-w-0 flex-1 flex-col overflow-y-auto pb-24 md:pb-12">
                {children}
            </main>

            {/* MOBILE BOTTOM NAVIGATION BAR (HANYA 4 ITEM UTAMA) */}
            <nav className="fixed right-0 bottom-0 left-0 z-30 flex items-center justify-around border-t border-[#E4E3DC] bg-[#FFFEFA] px-2 py-1.5 shadow-sm md:hidden">
                {/* 1. Ringkasan */}
                <button
                    type="button"
                    onClick={() => handleNavigation('ringkasan')}
                    className={`flex min-w-16 flex-col items-center justify-center rounded-md px-2 py-1 transition-colors ${
                        activeNav === 'ringkasan'
                            ? 'font-semibold text-[#2F6B57]'
                            : 'text-[#66736C]'
                    }`}
                >
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="mt-0.5 text-[10px]">Ringkasan</span>
                </button>

                {/* 2. Verifikasi */}
                <button
                    type="button"
                    onClick={() => handleNavigation('verifikasi')}
                    className={`relative flex min-w-16 flex-col items-center justify-center rounded-md px-2 py-1 transition-colors ${
                        activeNav === 'verifikasi'
                            ? 'font-semibold text-[#2F6B57]'
                            : 'text-[#66736C]'
                    }`}
                >
                    <UserCheck className="h-4 w-4" />
                    {pendingVerificationCount > 0 && (
                        <span className="absolute top-0.5 right-3.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#B87922] px-1 text-[9px] font-bold text-white">
                            {pendingVerificationCount}
                        </span>
                    )}
                    <span className="mt-0.5 text-[10px]">Verifikasi</span>
                </button>

                {/* 3. Rumah */}
                <button
                    type="button"
                    onClick={() => handleNavigation('rumah')}
                    className={`flex min-w-16 flex-col items-center justify-center rounded-md px-2 py-1 transition-colors ${
                        activeNav === 'rumah'
                            ? 'font-semibold text-[#2F6B57]'
                            : 'text-[#66736C]'
                    }`}
                >
                    <Home className="h-4 w-4" />
                    <span className="mt-0.5 text-[10px]">Rumah</span>
                </button>

                {/* 4. Menu Drawer */}
                <button
                    type="button"
                    onClick={() => setIsMobileDrawerOpen(true)}
                    className="flex min-w-16 flex-col items-center justify-center rounded-md px-2 py-1 text-[#66736C] transition-colors hover:text-[#1D2924]"
                >
                    <Menu className="h-4 w-4" />
                    <span className="mt-0.5 text-[10px]">Menu</span>
                </button>
            </nav>
        </div>
    );
}
