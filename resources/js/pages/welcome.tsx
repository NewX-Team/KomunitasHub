import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import { BrandLogo } from '@/components/komunitashub/brand-logo';
import { HeroPreviewTabs } from '@/components/komunitashub/hero-preview-tabs';
import { RegisterCommunityModal } from '@/components/komunitashub/register-community-modal';
import { ModeGuideModal } from '@/components/komunitashub/mode-guide-modal';
import { TransparencyLedger } from '@/components/komunitashub/transparency-ledger';
import { OnboardingSteps } from '@/components/komunitashub/onboarding-steps';
import { DemoTourModal } from '@/components/komunitashub/demo-tour-modal';
import {
    ShieldCheck,
    Receipt,
    FileText,
    ArrowRight,
    Home,
    Check,
    Menu,
    X,
    Lock,
    HelpCircle,
    Play,
} from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage().props as {
        auth: { user?: { name: string; email: string } };
    };

    // Modals state
    const [isRegisterCommunityOpen, setIsRegisterCommunityOpen] =
        useState(false);
    const [isModeGuideOpen, setIsModeGuideOpen] = useState(false);
    const [isDemoTourOpen, setIsDemoTourOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <Head title="KomunitasHub — Operasional Lingkungan RT & Cluster Tanpa Drama" />

            <div className="min-h-screen bg-[#F7F6F2] font-sans text-[#1D2924] selection:bg-[#2F6B57]/20 selection:text-[#1D2924]">
                {/* 1. HEADER / NAVIGATION */}
                <header className="sticky top-0 z-40 w-full border-b border-[#E4E3DC] bg-[#FFFEFA]/95 backdrop-blur-md">
                    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        {/* Wordmark Logo */}
                        <Link
                            href="/"
                            className="group flex items-center gap-2"
                        >
                            <BrandLogo size="md" />
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden items-center gap-7 text-xs font-semibold text-[#66736C] md:flex">
                            <a
                                href="#cara-kerja"
                                className="transition-colors hover:text-[#1D2924]"
                            >
                                Cara Kerja
                            </a>
                            <a
                                href="#manfaat"
                                className="transition-colors hover:text-[#1D2924]"
                            >
                                Manfaat Inti
                            </a>
                            <a
                                href="#mode-komunitas"
                                className="transition-colors hover:text-[#1D2924]"
                            >
                                Mode Komunitas
                            </a>
                            <a
                                href="#transparansi-kas"
                                className="transition-colors hover:text-[#1D2924]"
                            >
                                Transparansi Kas
                            </a>
                            <button
                                type="button"
                                onClick={() => setIsDemoTourOpen(true)}
                                className="inline-flex items-center gap-1 font-semibold text-[#2F6B57] hover:text-[#245442]"
                            >
                                <Play className="h-3 w-3 fill-current" />
                                Coba Demo
                            </button>
                        </nav>

                        {/* Auth / Action Buttons */}
                        <div className="hidden items-center gap-3 sm:flex">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex items-center gap-1.5 rounded-md bg-[#2F6B57] px-4 py-2 text-xs font-semibold text-[#FFFEFA] shadow-xs transition-colors hover:bg-[#245442]"
                                >
                                    Buka Dashboard
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="inline-flex items-center justify-center rounded-md border border-[#E4E3DC] bg-[#FFFEFA] px-3.5 py-1.5 text-xs font-semibold text-[#1D2924] shadow-xs transition-colors hover:border-[#1D2924]/20 hover:bg-[#F7F6F2]"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="inline-flex items-center justify-center rounded-md bg-[#2F6B57] px-4 py-1.5 text-xs font-semibold text-[#FFFEFA] shadow-xs transition-colors hover:bg-[#245442]"
                                    >
                                        Buat Akun
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Toggle Button */}
                        <button
                            type="button"
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                            className="rounded-md p-2 text-[#66736C] hover:bg-[#F7F6F2] hover:text-[#1D2924] md:hidden"
                            aria-label="Toggle Menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </button>
                    </div>

                    {/* Mobile Drawer Menu */}
                    {isMobileMenuOpen && (
                        <div className="space-y-3 border-b border-[#E4E3DC] bg-[#FFFEFA] px-4 pt-3 pb-5 md:hidden">
                            <nav className="flex flex-col gap-2 text-sm font-medium text-[#66736C]">
                                <a
                                    href="#cara-kerja"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="py-1.5 hover:text-[#1D2924]"
                                >
                                    Cara Kerja
                                </a>
                                <a
                                    href="#manfaat"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="py-1.5 hover:text-[#1D2924]"
                                >
                                    Manfaat Inti
                                </a>
                                <a
                                    href="#mode-komunitas"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="py-1.5 hover:text-[#1D2924]"
                                >
                                    Mode Komunitas
                                </a>
                                <a
                                    href="#transparansi-kas"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="py-1.5 hover:text-[#1D2924]"
                                >
                                    Transparansi Kas
                                </a>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        setIsDemoTourOpen(true);
                                    }}
                                    className="flex items-center gap-1.5 py-1.5 text-left font-semibold text-[#2F6B57]"
                                >
                                    <Play className="h-3.5 w-3.5 fill-current" />
                                    Coba Demo Interaktif
                                </button>
                            </nav>

                            <div className="flex flex-col gap-2 border-t border-[#E4E3DC] pt-3">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="w-full rounded-md bg-[#2F6B57] py-2 text-center text-xs font-semibold text-[#FFFEFA]"
                                    >
                                        Buka Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="w-full rounded-md border border-[#E4E3DC] bg-[#FFFEFA] py-2 text-center text-xs font-semibold text-[#1D2924]"
                                        >
                                            Masuk ke Akun
                                        </Link>
                                        <Link
                                            href={register()}
                                            className="w-full rounded-md bg-[#2F6B57] py-2 text-center text-xs font-semibold text-[#FFFEFA]"
                                        >
                                            Buat Akun Warga
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </header>

                {/* 2. HERO SECTION */}
                <section className="border-b border-[#E4E3DC] bg-[#F7F6F2] px-4 pt-12 pb-16 sm:px-6 sm:pt-20 sm:pb-24 lg:px-8">
                    <div className="mx-auto max-w-5xl space-y-6 text-center">
                        {/* Quiet Subtitle Badge */}
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#E4E3DC] bg-[#FFFEFA] px-3.5 py-1 text-xs font-medium text-[#66736C] shadow-xs">
                            <span className="h-2 w-2 rounded-full bg-[#2F6B57]" />
                            Platform Operasional RT & Cluster Perumahan
                            Indonesia
                        </div>

                        {/* Editorial Headline & Subheadline */}
                        <div className="mx-auto max-w-3xl space-y-4">
                            <h1 className="text-3xl leading-[1.15] font-bold tracking-tight text-[#1D2924] sm:text-5xl lg:text-5xl">
                                Operasional lingkungan, tanpa drama.
                            </h1>
                            <p className="mx-auto max-w-2xl text-base leading-relaxed font-normal text-[#66736C] sm:text-lg">
                                Kelola iuran, administrasi, dan keamanan
                                komunitas dalam satu sistem yang rapi dan mudah
                                dipakai.
                            </p>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
                            <Link
                                href={register()}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#2F6B57] px-6 py-3 text-sm font-semibold text-[#FFFEFA] shadow-xs transition-colors hover:bg-[#245442] sm:w-auto"
                            >
                                Buat Akun Warga
                                <ArrowRight className="h-4 w-4" />
                            </Link>

                            <button
                                type="button"
                                onClick={() => setIsRegisterCommunityOpen(true)}
                                className="inline-flex w-full items-center justify-center rounded-md border border-[#E4E3DC] bg-[#FFFEFA] px-5 py-3 text-sm font-semibold text-[#1D2924] shadow-xs transition-colors hover:border-[#1D2924]/20 hover:bg-[#F7F6F2] sm:w-auto"
                            >
                                Daftarkan Komunitas
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsDemoTourOpen(true)}
                                className="inline-flex w-full items-center justify-center gap-1.5 rounded-md px-4 py-3 text-sm font-medium text-[#2F6B57] hover:text-[#245442] hover:underline sm:w-auto"
                            >
                                <Play className="h-3.5 w-3.5 fill-current" />
                                Jelajahi Demo Langsung
                            </button>
                        </div>

                        {/* Realistic Interface Preview Container (Hero Visual) */}
                        <div className="mx-auto max-w-4xl pt-8 text-left">
                            <div className="mb-2 flex items-center justify-between px-1 text-xs text-[#66736C]">
                                <span className="text-[11px] font-semibold tracking-wider text-[#2F6B57] uppercase">
                                    Pratinjau Antarmuka Nyata
                                </span>
                                <span>
                                    Pilih tab untuk melihat modul laporan,
                                    iuran, dan QR satpam
                                </span>
                            </div>

                            <HeroPreviewTabs />
                        </div>
                    </div>
                </section>

                {/* 3. TIGA MANFAAT INTI */}
                <section
                    id="manfaat"
                    className="border-b border-[#E4E3DC] bg-[#FFFEFA] px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
                >
                    <div className="mx-auto max-w-5xl space-y-12">
                        <div className="max-w-2xl space-y-2">
                            <span className="text-xs font-semibold tracking-wider text-[#2F6B57] uppercase">
                                Nilai Nyata untuk Warga & Pengurus
                            </span>
                            <h2 className="text-2xl font-bold tracking-tight text-[#1D2924] sm:text-3xl">
                                Tiga Pilar Lingkungan yang Tertata dan Harmonis
                            </h2>
                            <p className="text-sm leading-relaxed text-[#66736C]">
                                Didesain khusus untuk memecahkan persoalan nyata
                                yang sering menjadi sumber kesalahpahaman di
                                lingkungan perumahan.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {/* Manfaat 1 */}
                            <div className="flex flex-col justify-between space-y-6 rounded-xl border border-[#E4E3DC] bg-[#F7F6F2] p-6">
                                <div className="space-y-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] text-[#2F6B57] shadow-xs">
                                        <Receipt className="h-5 w-5" />
                                    </div>
                                    <h3 className="text-lg font-bold text-[#1D2924]">
                                        Iuran Lebih Tertib
                                    </h3>
                                    <p className="text-xs leading-relaxed text-[#66736C]">
                                        Pencatatan mutasi otomatis, kuitansi
                                        digital instan, dan pengingat jatuh
                                        tempo yang sopan. Bendahara tidak perlu
                                        lagi pusing mencocokkan bukti transfer
                                        di grup WhatsApp yang tertimbun chat.
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5 border-t border-[#E4E3DC] pt-4 text-xs font-semibold text-[#2F6B57]">
                                    <Check className="h-4 w-4 text-[#2F7D5C]" />
                                    Rekonsiliasi transfer & riwayat permanen
                                </div>
                            </div>

                            {/* Manfaat 2 */}
                            <div className="flex flex-col justify-between space-y-6 rounded-xl border border-[#E4E3DC] bg-[#F7F6F2] p-6">
                                <div className="space-y-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] text-[#2F6B57] shadow-xs">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <h3 className="text-lg font-bold text-[#1D2924]">
                                        Administrasi Lebih Cepat
                                    </h3>
                                    <p className="text-xs leading-relaxed text-[#66736C]">
                                        Warga mengajukan Surat Pengantar
                                        Domisili, Usaha, atau SKCK langsung dari
                                        ponsel. Ketua RT dapat meninjau dan
                                        menyetujui kapan saja tanpa perlu
                                        didatangi malam hari.
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5 border-t border-[#E4E3DC] pt-4 text-xs font-semibold text-[#2F6B57]">
                                    <Check className="h-4 w-4 text-[#2F7D5C]" />
                                    Format surat resmi & PDF siap cetak
                                </div>
                            </div>

                            {/* Manfaat 3 */}
                            <div className="flex flex-col justify-between space-y-6 rounded-xl border border-[#E4E3DC] bg-[#F7F6F2] p-6">
                                <div className="space-y-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] text-[#2F6B57] shadow-xs">
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>
                                    <h3 className="text-lg font-bold text-[#1D2924]">
                                        Lingkungan Lebih Aman
                                    </h3>
                                    <p className="text-xs leading-relaxed text-[#66736C]">
                                        Khusus kawasan cluster dengan gerbang
                                        tertutup: izin kurir, teknisi, dan tamu
                                        dibuat lewat QR pass sementara. Satpam
                                        memindai dari pos tanpa perlu menahan
                                        KTP tamu.
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5 border-t border-[#E4E3DC] pt-4 text-xs font-semibold text-[#2F6B57]">
                                    <Check className="h-4 w-4 text-[#2F7D5C]" />
                                    Buku tamu digital & log kunjungan real-time
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. DUA PANEL EDITORIAL: MODE KOMUNITAS */}
                <section
                    id="mode-komunitas"
                    className="border-b border-[#E4E3DC] bg-[#F7F6F2] px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
                >
                    <div className="mx-auto max-w-5xl space-y-12">
                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                            <div className="max-w-xl space-y-2">
                                <span className="text-xs font-semibold tracking-wider text-[#2F6B57] uppercase">
                                    Sistem Sesuai Karakter Wilayah
                                </span>
                                <h2 className="text-2xl font-bold tracking-tight text-[#1D2924] sm:text-3xl">
                                    Dua Mode Operasional: RT Mandiri dan Cluster
                                    Aman
                                </h2>
                                <p className="text-sm leading-relaxed text-[#66736C]">
                                    Setiap lingkungan memiliki struktur fisik
                                    yang berbeda. KomunitasHub hadir dengan dua
                                    pilihan mode agar pas dan tidak berlebihan.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsModeGuideOpen(true)}
                                className="inline-flex items-center gap-1.5 self-start text-xs font-semibold text-[#2F6B57] hover:text-[#245442] hover:underline md:self-auto"
                            >
                                <HelpCircle className="h-4 w-4" />
                                Lihat Perbandingan Lengkap
                            </button>
                        </div>

                        {/* Dua Panel Tenang & Editorial */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Panel 1: RT Mandiri */}
                            <div className="flex flex-col justify-between space-y-6 rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-8 shadow-xs">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="inline-flex items-center gap-1.5 rounded bg-[#EBF3EF] px-2.5 py-1 text-xs font-semibold text-[#2F6B57]">
                                            <Home className="h-3.5 w-3.5" />
                                            Mode RT Mandiri
                                        </span>
                                        <span className="text-xs text-[#66736C]">
                                            RT / RW / Perkampungan
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-[#1D2924]">
                                        Tertib Administrasi & Transparansi Kas
                                    </h3>
                                    <p className="text-xs leading-relaxed text-[#66736C]">
                                        Sangat tepat untuk lingkungan pemukiman
                                        terbuka tanpa gerbang khusus. Fokus
                                        utama adalah keterbukaan pembukuan kas
                                        warga, penagihan iuran rutin, surat
                                        pengantar digital, dan penyebaran
                                        pengumuman resmi.
                                    </p>

                                    {/* Fitur Inti RT Mandiri */}
                                    <div className="space-y-2.5 border-t border-[#E4E3DC] pt-2 text-xs text-[#1D2924]">
                                        <div className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2F7D5C]" />
                                            <span>
                                                <strong>Buku Kas Warga:</strong>{' '}
                                                Laporan pemasukan dan
                                                pengeluaran terbuka setiap
                                                bulan.
                                            </span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2F7D5C]" />
                                            <span>
                                                <strong>
                                                    Iuran Terstruktur:
                                                </strong>{' '}
                                                Catatan status lunas/tenggat per
                                                nomor rumah warga.
                                            </span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2F7D5C]" />
                                            <span>
                                                <strong>
                                                    Surat Pengantar Digital:
                                                </strong>{' '}
                                                Permohonan surat warga langsung
                                                terkirim ke Ketua RT.
                                            </span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2F7D5C]" />
                                            <span>
                                                <strong>
                                                    1 Akun per Rumah:
                                                </strong>{' '}
                                                Satu data Kepala Keluarga dengan
                                                relasi anggota keluarga.
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-[#E4E3DC] pt-4 text-xs text-[#66736C] italic">
                                    "Sederhana, tertib, dan transparan untuk
                                    rukun tetangga."
                                </div>
                            </div>

                            {/* Panel 2: Cluster Aman */}
                            <div className="flex flex-col justify-between space-y-6 rounded-xl border-2 border-[#2F6B57] bg-[#FFFEFA] p-8 shadow-xs">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="inline-flex items-center gap-1.5 rounded bg-[#2F6B57] px-2.5 py-1 text-xs font-semibold text-[#FFFEFA]">
                                            <ShieldCheck className="h-3.5 w-3.5" />
                                            Mode Cluster Aman
                                        </span>
                                        <span className="text-xs font-semibold text-[#2F6B57]">
                                            One Gate System
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-[#1D2924]">
                                        Seluruh Fitur RT + Keamanan Pos Satpam
                                    </h3>
                                    <p className="text-xs leading-relaxed text-[#66736C]">
                                        Dirancang khusus untuk cluster
                                        perumahan, townhouse, atau kompleks
                                        berpagar yang memiliki pos sekuriti 24
                                        jam. Mengintegrasikan izin kedatangan
                                        tamu langsung ke sistem pemindai satpam.
                                    </p>

                                    {/* Fitur Inti Cluster Aman */}
                                    <div className="space-y-2.5 border-t border-[#E4E3DC] pt-2 text-xs text-[#1D2924]">
                                        <div className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2F7D5C]" />
                                            <span>
                                                <strong>
                                                    Semua Fitur RT Mandiri:
                                                </strong>{' '}
                                                Kas transparan, iuran rumah, dan
                                                administrasi surat.
                                            </span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2F7D5C]" />
                                            <span>
                                                <strong>
                                                    QR Pass Izin Tamu:
                                                </strong>{' '}
                                                Warga menerbitkan barcode untuk
                                                kurir, teknisi, atau tamu
                                                keluarga.
                                            </span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2F7D5C]" />
                                            <span>
                                                <strong>
                                                    Layar Khusus Pos Satpam:
                                                </strong>{' '}
                                                Tampilan kontras tinggi untuk
                                                pemindaian cepat di pos.
                                            </span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2F7D5C]" />
                                            <span>
                                                <strong>
                                                    Buku Tamu Digital:
                                                </strong>{' '}
                                                Log kedatangan tanpa kertas dan
                                                tanpa menahan kartu identitas
                                                (KTP).
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-[#E4E3DC] pt-4 text-xs font-medium text-[#2F6B57]">
                                    "Keamanan terintegrasi dari pintu gerbang
                                    hingga rumah warga."
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. ALUR SINGKAT TIGA LANGKAH */}
                <section
                    id="cara-kerja"
                    className="border-b border-[#E4E3DC] bg-[#FFFEFA] px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
                >
                    <div className="mx-auto max-w-5xl space-y-12">
                        <div className="mx-auto max-w-2xl space-y-2 text-center">
                            <span className="text-xs font-semibold tracking-wider text-[#2F6B57] uppercase">
                                Alur Mudah & Tertib
                            </span>
                            <h2 className="text-2xl font-bold tracking-tight text-[#1D2924] sm:text-3xl">
                                Bergabung dengan Komunitas dalam Tiga Langkah
                            </h2>
                            <p className="text-sm text-[#66736C]">
                                Perlindungan data warga dijaga melalui sistem
                                kode undangan resmi dan verifikasi oleh pengurus
                                setempat.
                            </p>
                        </div>

                        {/* Onboarding steps component with interactive code simulator */}
                        <OnboardingSteps />
                    </div>
                </section>

                {/* 6. TRANSPARANSI KAS SPOTLIGHT */}
                <section
                    id="transparansi-kas"
                    className="border-b border-[#E4E3DC] bg-[#F7F6F2] px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
                >
                    <div className="mx-auto max-w-5xl space-y-8">
                        <div className="max-w-2xl space-y-2">
                            <span className="text-xs font-semibold tracking-wider text-[#2F6B57] uppercase">
                                Keterbukaan Membangun Kepercayaan
                            </span>
                            <h2 className="text-2xl font-bold tracking-tight text-[#1D2924] sm:text-3xl">
                                Laporan Kas Warga yang Tenang & Terpercaya
                            </h2>
                            <p className="text-sm leading-relaxed text-[#66736C]">
                                Warga dapat memantau saldo dan aliran dana
                                fasilitas umum setiap saat. Privasi tetap
                                terjaga—identitas pribadi warga yang membayar
                                atau menunggak tidak pernah diumbar ke publik.
                            </p>
                        </div>

                        {/* Interactive Transparency Ledger Table */}
                        <TransparencyLedger />
                    </div>
                </section>

                {/* 7. CTA PENUTUP */}
                <section className="border-b border-[#E4E3DC] bg-[#FFFEFA] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
                    <div className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-[#E4E3DC] bg-[#F7F6F2] p-8 text-center shadow-xs sm:p-12">
                        <div className="space-y-3">
                            <span className="inline-block rounded-full bg-[#EBF3EF] px-3 py-1 text-xs font-semibold text-[#2F6B57]">
                                Siap Digunakan
                            </span>
                            <h2 className="text-2xl font-bold tracking-tight text-[#1D2924] sm:text-4xl">
                                Mulai rapikan operasional komunitas Anda.
                            </h2>
                            <p className="mx-auto max-w-xl text-sm leading-relaxed text-[#66736C] sm:text-base">
                                Tinggalkan buku kas usang, kuitansi kertas yang
                                terselip, dan perdebatan di grup chat. Hadirkan
                                ketenangan untuk pengurus dan warga.
                            </p>
                        </div>

                        <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
                            <Link
                                href={register()}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#2F6B57] px-6 py-3 text-sm font-semibold text-[#FFFEFA] shadow-xs transition-colors hover:bg-[#245442] sm:w-auto"
                            >
                                Buat Akun Warga
                                <ArrowRight className="h-4 w-4" />
                            </Link>

                            <button
                                type="button"
                                onClick={() => setIsRegisterCommunityOpen(true)}
                                className="inline-flex w-full items-center justify-center rounded-md border border-[#E4E3DC] bg-[#FFFEFA] px-5 py-3 text-sm font-semibold text-[#1D2924] shadow-xs transition-colors hover:border-[#1D2924]/20 hover:bg-[#F7F6F2] sm:w-auto"
                            >
                                Daftarkan Komunitas Anda
                            </button>
                        </div>

                        <p className="text-xs text-[#66736C]">
                            Proses pendaftaran komunitas didampingi langsung
                            hingga sistem aktif di lingkungan Anda.
                        </p>
                    </div>
                </section>

                {/* 8. FOOTER MINIMAL, PROFESIONAL */}
                <footer className="border-t border-[#E4E3DC] bg-[#FFFEFA] px-4 py-12 text-xs text-[#66736C] sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-6xl space-y-8">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                            {/* Brand info */}
                            <div className="space-y-3 md:col-span-2">
                                <BrandLogo size="md" showTagline={true} />
                                <p className="mt-2 max-w-sm text-xs leading-relaxed text-[#66736C]">
                                    Platform operasional dan transparansi rukun
                                    tetangga dan cluster perumahan Indonesia.
                                    Dirancang untuk keharmonisan dan ketertiban
                                    lingkungan tempat tinggal.
                                </p>
                                <div className="flex items-center gap-2 pt-1 text-xs text-[#2F6B57]">
                                    <Lock className="h-3.5 w-3.5" />
                                    <span>
                                        Privasi warga & data kas terenkripsi
                                    </span>
                                </div>
                            </div>

                            {/* Solusi & Mode */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-semibold tracking-wider text-[#1D2924] uppercase">
                                    Sistem Produk
                                </h4>
                                <ul className="space-y-1.5 text-xs text-[#66736C]">
                                    <li>
                                        <a
                                            href="#mode-komunitas"
                                            className="hover:text-[#1D2924]"
                                        >
                                            Mode RT Mandiri
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#mode-komunitas"
                                            className="hover:text-[#1D2924]"
                                        >
                                            Mode Cluster Aman
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#transparansi-kas"
                                            className="hover:text-[#1D2924]"
                                        >
                                            Transparansi Kas Warga
                                        </a>
                                    </li>
                                    <li>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsDemoTourOpen(true)
                                            }
                                            className="text-left hover:text-[#1D2924]"
                                        >
                                            Layar Pos Satpam
                                        </button>
                                    </li>
                                </ul>
                            </div>

                            {/* Layanan & Akun */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-semibold tracking-wider text-[#1D2924] uppercase">
                                    Akses Pengguna
                                </h4>
                                <ul className="space-y-1.5 text-xs text-[#66736C]">
                                    <li>
                                        <Link
                                            href={login()}
                                            className="hover:text-[#1D2924]"
                                        >
                                            Masuk ke Akun
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={register()}
                                            className="hover:text-[#1D2924]"
                                        >
                                            Daftar Akun Baru
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsRegisterCommunityOpen(true)
                                            }
                                            className="text-left hover:text-[#1D2924]"
                                        >
                                            Daftarkan RT/Cluster
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsDemoTourOpen(true)
                                            }
                                            className="text-left font-semibold text-[#2F6B57] hover:underline"
                                        >
                                            Demo Interaktif
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Copyright & Disclaimer */}
                        <div className="flex flex-col items-center justify-between gap-3 border-t border-[#E4E3DC] pt-6 text-[11px] text-[#66736C] sm:flex-row">
                            <p>
                                © 2026 KomunitasHub. Seluruh hak cipta
                                dilindungi undang-undang.
                            </p>
                            <div className="flex items-center gap-4">
                                <span>
                                    Dirancang untuk keharmonisan lingkungan
                                    Indonesia
                                </span>
                                <span>·</span>
                                <a
                                    href="#cara-kerja"
                                    className="hover:text-[#1D2924]"
                                >
                                    Panduan Penggunaan
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>

                {/* MODALS */}
                <RegisterCommunityModal
                    isOpen={isRegisterCommunityOpen}
                    onClose={() => setIsRegisterCommunityOpen(false)}
                />

                <ModeGuideModal
                    isOpen={isModeGuideOpen}
                    onClose={() => setIsModeGuideOpen(false)}
                    onSelectMode={(_mode) => {
                        setIsRegisterCommunityOpen(true);
                    }}
                />

                <DemoTourModal
                    isOpen={isDemoTourOpen}
                    onClose={() => setIsDemoTourOpen(false)}
                />
            </div>
        </>
    );
}
