import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import CitizenLayout from '@/layouts/citizen-layout';
import {
    Receipt,
    FileText,
    QrCode,
    Wallet,
    Clock,
    CheckCircle2,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight,
    Copy,
    Check,
    X,
    Calendar,
    ChevronRight,
    Share2,
    Building2,
    Send,
} from 'lucide-react';

type DuesState = 'unpaid' | 'paid' | 'verifying' | 'overdue';
type GuestState = 'active' | 'empty';

export default function Dashboard() {
    // Community Mode Simulator ('Cluster Aman' vs 'RT Mandiri')
    const [communityMode, setCommunityMode] = useState<
        'Cluster Aman' | 'RT Mandiri'
    >('Cluster Aman');

    // Dues State Simulator
    const [duesState, setDuesState] = useState<DuesState>('unpaid');

    // Guest QR Pass State Simulator (Cluster only)
    const [guestState, setGuestState] = useState<GuestState>('active');

    // Announcements state (full vs empty)
    const [hasAnnouncements, setHasAnnouncements] = useState<boolean>(true);

    // Modals
    const [isPayModalOpen, setIsPayModalOpen] = useState(false);
    const [isDuesDetailModalOpen, setIsDuesDetailModalOpen] = useState(false);
    const [isGuestCreateModalOpen, setIsGuestCreateModalOpen] = useState(false);
    const [isQrPassModalOpen, setIsQrPassModalOpen] = useState(false);
    const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
    const [isCashModalOpen, setIsCashModalOpen] = useState(false);
    const [selectedNewsDetail, setSelectedNewsDetail] = useState<{
        title: string;
        category: string;
        date: string;
        body: string;
    } | null>(null);

    // Copy to clipboard helper
    const [copiedAccount, setCopiedAccount] = useState(false);
    const copyToClipboard = (text: string) => {
        if (navigator.clipboard) {
            void navigator.clipboard.writeText(text);
            setCopiedAccount(true);
            setTimeout(() => setCopiedAccount(false), 2000);
        }
    };

    // Guest creation mock form
    const [guestForm, setGuestForm] = useState({
        name: 'Andi Wijaya',
        category: 'Teknisi / Pekerja',
        plateNumber: 'B 4129 SZX',
        expiry: 'Hari ini, 16.00 WIB',
    });
    const [guestCreatedSuccess, setGuestCreatedSuccess] = useState(false);

    // Letter request mock form
    const [letterType, setLetterType] = useState('Surat Pengantar Domisili');
    const [letterPurpose, setLetterPurpose] = useState(
        'Keperluan pembukaan rekening bank syariah',
    );
    const [letterSubmitted, setLetterSubmitted] = useState(false);

    // Active tab in layout
    const [activeNav, setActiveNav] = useState<
        'ringkasan' | 'iuran' | 'surat' | 'tamu' | 'kas' | 'profil'
    >('ringkasan');

    const handleNavClick = (
        nav: 'ringkasan' | 'iuran' | 'surat' | 'tamu' | 'kas' | 'profil',
    ) => {
        setActiveNav(nav);
        if (nav === 'iuran') {
            router.visit('/iuran');
        } else if (nav === 'surat') {
            setIsLetterModalOpen(true);
        } else if (nav === 'tamu') {
            if (guestState === 'active') {
                setIsQrPassModalOpen(true);
            } else {
                setIsGuestCreateModalOpen(true);
            }
        } else if (nav === 'kas') {
            setIsCashModalOpen(true);
        } else if (nav === 'profil') {
            alert(
                'Profil Keluarga Pratama:\n• Alamat: Rumah Blok A-12\n• KK: Budi Pratama (Kepala Keluarga)\n• Anggota: 4 Orang\n• Status Warga: Tetap / Aktif',
            );
        }
    };

    return (
        <CitizenLayout
            title="Ringkasan"
            communityMode={communityMode}
            onModeChange={setCommunityMode}
            activeNav={activeNav}
            onNavClick={handleNavClick}
        >
            <Head title="Ringkasan Warga — KomunitasHub" />

            <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                {/* TOOLBAR SIMULASI STATUS (MEMUDAHKAN TESTING SEMUA KONDISI) */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-3 text-xs shadow-xs">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#1D2924]">
                            Mode Tampilan:
                        </span>
                        <div className="inline-flex rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] p-0.5">
                            <button
                                type="button"
                                onClick={() => setCommunityMode('Cluster Aman')}
                                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                                    communityMode === 'Cluster Aman'
                                        ? 'bg-[#2F6B57] text-[#FFFEFA]'
                                        : 'text-[#66736C] hover:text-[#1D2924]'
                                }`}
                            >
                                Cluster Aman (Pos Satpam)
                            </button>
                            <button
                                type="button"
                                onClick={() => setCommunityMode('RT Mandiri')}
                                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                                    communityMode === 'RT Mandiri'
                                        ? 'bg-[#2F6B57] text-[#FFFEFA]'
                                        : 'text-[#66736C] hover:text-[#1D2924]'
                                }`}
                            >
                                RT Mandiri (Warga Terbuka)
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#1D2924]">
                            Status Iuran:
                        </span>
                        <div className="inline-flex rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] p-0.5">
                            <button
                                type="button"
                                onClick={() => setDuesState('unpaid')}
                                className={`rounded px-2 py-1 font-medium transition-colors ${
                                    duesState === 'unpaid'
                                        ? 'bg-[#B87922] text-[#FFFEFA]'
                                        : 'text-[#66736C] hover:text-[#1D2924]'
                                }`}
                            >
                                Belum Bayar
                            </button>
                            <button
                                type="button"
                                onClick={() => setDuesState('verifying')}
                                className={`rounded px-2 py-1 font-medium transition-colors ${
                                    duesState === 'verifying'
                                        ? 'bg-[#2F6B57] text-[#FFFEFA]'
                                        : 'text-[#66736C] hover:text-[#1D2924]'
                                }`}
                            >
                                Verifikasi
                            </button>
                            <button
                                type="button"
                                onClick={() => setDuesState('overdue')}
                                className={`rounded px-2 py-1 font-medium transition-colors ${
                                    duesState === 'overdue'
                                        ? 'bg-[#B74E44] text-[#FFFEFA]'
                                        : 'text-[#66736C] hover:text-[#1D2924]'
                                }`}
                            >
                                Terlambat
                            </button>
                            <button
                                type="button"
                                onClick={() => setDuesState('paid')}
                                className={`rounded px-2 py-1 font-medium transition-colors ${
                                    duesState === 'paid'
                                        ? 'bg-[#2F7D5C] text-[#FFFEFA]'
                                        : 'text-[#66736C] hover:text-[#1D2924]'
                                }`}
                            >
                                Lunas
                            </button>
                        </div>
                    </div>
                </div>

                {/* HEADER KONTEN UTAMA */}
                <header className="flex flex-col justify-between gap-3 border-b border-[#E4E3DC] pb-2 sm:flex-row sm:items-end">
                    <div className="space-y-1">
                        <div className="text-xs font-semibold tracking-wider text-[#2F6B57] uppercase">
                            Komunitas Taman Sari · Blok A-12
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#1D2924] sm:text-3xl">
                            Selamat pagi, Keluarga Pratama
                        </h1>
                        <p className="text-xs text-[#66736C] sm:text-sm">
                            Berikut ringkasan keteraturan dan aktivitas rumah
                            Anda.
                        </p>
                    </div>

                    <div className="flex w-fit items-center gap-2 rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-3 py-1.5 text-xs font-medium text-[#66736C]">
                        <Calendar className="h-3.5 w-3.5 text-[#2F6B57]" />
                        <span>Selasa, 27 Oktober 2026</span>
                    </div>
                </header>

                {/* PRIORITAS UTAMA — STATUS IURAN */}
                <section aria-labelledby="status-iuran-title">
                    {/* KONDISI 1: ADA TAGIHAN BELUM DIBAYAR (DEFAULT) */}
                    {duesState === 'unpaid' && (
                        <div className="relative overflow-hidden rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-5 transition-all sm:p-6">
                            <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-[#B87922]" />

                            <div className="flex flex-col justify-between gap-5 pl-2 lg:flex-row lg:items-center">
                                <div className="space-y-1.5">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="inline-flex items-center gap-1 rounded bg-[#FAF2E6] px-2 py-0.5 text-[11px] font-semibold text-[#B87922]">
                                            <AlertCircle className="h-3 w-3" />
                                            Perlu Perhatian
                                        </span>
                                        <span className="inline-flex rounded border border-[#E4E3DC] bg-[#F7F6F2] px-2 py-0.5 text-[11px] font-medium text-[#66736C]">
                                            Jatuh Tempo Dekat
                                        </span>
                                    </div>

                                    <h2
                                        id="status-iuran-title"
                                        className="text-lg font-bold text-[#1D2924] sm:text-xl"
                                    >
                                        Iuran Keamanan & Kebersihan Oktober
                                        belum dibayar
                                    </h2>

                                    <p className="flex items-center gap-2 text-xs text-[#66736C] sm:text-sm">
                                        <span className="text-base font-semibold text-[#1D2924]">
                                            Rp20.000
                                        </span>
                                        <span>·</span>
                                        <span className="inline-flex items-center gap-1 font-medium text-[#B87922]">
                                            <Clock className="h-3.5 w-3.5" />
                                            Jatuh tempo 10 November 2026
                                        </span>
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 pt-2 lg:pt-0">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsDuesDetailModalOpen(true)
                                        }
                                        className="rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] px-4 py-2 text-xs font-semibold text-[#1D2924] transition-colors hover:bg-[#E4E3DC]"
                                    >
                                        Lihat Rincian
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsPayModalOpen(true)}
                                        className="rounded-lg bg-[#2F6B57] px-5 py-2 text-xs font-semibold text-[#FFFEFA] shadow-xs transition-colors hover:bg-[#245442]"
                                    >
                                        Bayar Sekarang
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* KONDISI 2: PEMBAYARAN MENUNGGU VERIFIKASI */}
                    {duesState === 'verifying' && (
                        <div className="relative overflow-hidden rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-5 transition-all sm:p-6">
                            <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-[#2F6B57]" />

                            <div className="flex flex-col justify-between gap-5 pl-2 lg:flex-row lg:items-center">
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center gap-1 rounded bg-[#EBF3EF] px-2 py-0.5 text-[11px] font-semibold text-[#2F6B57]">
                                            <Clock className="h-3 w-3" />
                                            Menunggu Verifikasi Bendahara
                                        </span>
                                    </div>

                                    <h2
                                        id="status-iuran-title"
                                        className="text-lg font-bold text-[#1D2924] sm:text-xl"
                                    >
                                        Pembayaran Iuran Oktober sedang
                                        diverifikasi
                                    </h2>

                                    <p className="text-xs text-[#66736C] sm:text-sm">
                                        Bukti transfer Iuran Keamanan (Rp20.000)
                                        yang Anda kirim sedang diperiksa oleh
                                        bendahara RT 04. Status pencatatan akan
                                        diperbarui otomatis.
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 pt-2 lg:pt-0">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsDuesDetailModalOpen(true)
                                        }
                                        className="rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] px-4 py-2 text-xs font-semibold text-[#1D2924] transition-colors hover:bg-[#E4E3DC]"
                                    >
                                        Lihat Pembayaran
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* KONDISI 3: IURAN TERLAMBAT */}
                    {duesState === 'overdue' && (
                        <div className="relative overflow-hidden rounded-xl border border-[#B74E44]/30 bg-[#FFF7F6] p-5 transition-all sm:p-6">
                            <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-[#B74E44]" />

                            <div className="flex flex-col justify-between gap-5 pl-2 lg:flex-row lg:items-center">
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center gap-1 rounded bg-[#FBEBE9] px-2 py-0.5 text-[11px] font-semibold text-[#B74E44]">
                                            <AlertCircle className="h-3 w-3" />
                                            Terlambat
                                        </span>
                                    </div>

                                    <h2
                                        id="status-iuran-title"
                                        className="text-lg font-bold text-[#1D2924] sm:text-xl"
                                    >
                                        Iuran melewati jatuh tempo
                                    </h2>

                                    <p className="text-xs text-[#66736C] sm:text-sm">
                                        Iuran Keamanan & Kebersihan Oktober
                                        (Rp20.000) jatuh tempo pada 10 Oktober
                                        2026. Segera lakukan pembayaran agar
                                        pencatatan komunitas tetap rapi.
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 pt-2 lg:pt-0">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsDuesDetailModalOpen(true)
                                        }
                                        className="rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-4 py-2 text-xs font-semibold text-[#1D2924] transition-colors hover:bg-[#F7F6F2]"
                                    >
                                        Lihat Rincian
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsPayModalOpen(true)}
                                        className="rounded-lg bg-[#B74E44] px-5 py-2 text-xs font-semibold text-[#FFFEFA] shadow-xs transition-colors hover:bg-[#9B3E36]"
                                    >
                                        Bayar Sekarang
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* KONDISI 4: SEMUA TAGIHAN SUDAH LUNAS */}
                    {duesState === 'paid' && (
                        <div className="relative overflow-hidden rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-5 transition-all sm:p-6">
                            <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-[#2F7D5C]" />

                            <div className="flex flex-col justify-between gap-4 pl-2 sm:flex-row sm:items-center">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center gap-1 rounded bg-[#EAF4EE] px-2 py-0.5 text-[11px] font-semibold text-[#2F7D5C]">
                                            <CheckCircle2 className="h-3 w-3" />
                                            Tertata Rapi
                                        </span>
                                    </div>
                                    <h2
                                        id="status-iuran-title"
                                        className="text-lg font-bold text-[#1D2924] sm:text-xl"
                                    >
                                        Semua iuran Anda sudah tertata
                                    </h2>
                                    <p className="text-xs text-[#66736C] sm:text-sm">
                                        Tidak ada tagihan yang perlu dibayar
                                        saat ini. Pembayaran terakhir:{' '}
                                        <span className="font-medium text-[#1D2924]">
                                            Iuran Kebersihan & Keamanan Oktober
                                        </span>{' '}
                                        lunas pada 5 Oktober 2026.
                                    </p>
                                </div>

                                <div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsDuesDetailModalOpen(true)
                                        }
                                        className="rounded-lg bg-[#EBF3EF] px-4 py-2 text-xs font-semibold text-[#2F6B57] transition-colors hover:bg-[#2F6B57] hover:text-[#FFFEFA]"
                                    >
                                        Lihat Riwayat Iuran
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* AKSI CEPAT (QUICK ACTIONS GRID) */}
                <section aria-labelledby="quick-actions-title">
                    <h2
                        id="quick-actions-title"
                        className="mb-3 text-xs font-bold tracking-wider text-[#66736C] uppercase"
                    >
                        Aksi Cepat
                    </h2>

                    <div
                        className={`grid gap-3 ${communityMode === 'Cluster Aman' ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-3'}`}
                    >
                        {/* Aksi Khusus Cluster: Buat Izin Tamu */}
                        {communityMode === 'Cluster Aman' && (
                            <button
                                type="button"
                                onClick={() => setIsGuestCreateModalOpen(true)}
                                className="group flex flex-col justify-between rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-4 text-left shadow-2xs transition-all hover:border-[#2F6B57] hover:bg-[#FAF9F5]"
                            >
                                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#EBF3EF] text-[#2F6B57] transition-transform group-hover:scale-105">
                                    <QrCode className="h-4 w-4" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-[#1D2924] sm:text-sm">
                                        Buat Izin Tamu
                                    </div>
                                    <div className="mt-0.5 text-[11px] text-[#66736C]">
                                        Terbitkan QR pass satpam
                                    </div>
                                </div>
                            </button>
                        )}

                        {/* Aksi 2: Bayar Iuran */}
                        <button
                            type="button"
                            onClick={() => router.visit('/iuran')}
                            className="group flex flex-col justify-between rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-4 text-left shadow-2xs transition-all hover:border-[#2F6B57] hover:bg-[#FAF9F5]"
                        >
                            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#FAF2E6] text-[#B87922] transition-transform group-hover:scale-105">
                                <Receipt className="h-4 w-4" />
                            </div>
                            <div>
                                <div className="text-xs font-bold text-[#1D2924] sm:text-sm">
                                    Bayar Iuran
                                </div>
                                <div className="mt-0.5 text-[11px] text-[#66736C]">
                                    Transfer bank atau QRIS
                                </div>
                            </div>
                        </button>

                        {/* Aksi 3: Ajukan Surat Pengantar */}
                        <button
                            type="button"
                            onClick={() => setIsLetterModalOpen(true)}
                            className="group flex flex-col justify-between rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-4 text-left shadow-2xs transition-all hover:border-[#2F6B57] hover:bg-[#FAF9F5]"
                        >
                            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#EBF3EF] text-[#2F6B57] transition-transform group-hover:scale-105">
                                <FileText className="h-4 w-4" />
                            </div>
                            <div>
                                <div className="text-xs font-bold text-[#1D2924] sm:text-sm">
                                    Ajukan Surat
                                </div>
                                <div className="mt-0.5 text-[11px] text-[#66736C]">
                                    Domisili, SKCK, pengantar
                                </div>
                            </div>
                        </button>

                        {/* Aksi 4: Buka Laporan Kas */}
                        <button
                            type="button"
                            onClick={() => setIsCashModalOpen(true)}
                            className="group flex flex-col justify-between rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-4 text-left shadow-2xs transition-all hover:border-[#2F6B57] hover:bg-[#FAF9F5]"
                        >
                            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#F7F6F2] text-[#1D2924] transition-transform group-hover:scale-105">
                                <Wallet className="h-4 w-4" />
                            </div>
                            <div>
                                <div className="text-xs font-bold text-[#1D2924] sm:text-sm">
                                    Laporan Kas
                                </div>
                                <div className="mt-0.5 text-[11px] text-[#66736C]">
                                    Transparansi buku kas RT
                                </div>
                            </div>
                        </button>
                    </div>
                </section>

                {/* KONTEN UTAMA: 2 KOLOM (KIRI: RINGKASAN KAS & RINCIAN | KANAN: KABAR & WIDGET TAMU) */}
                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                    {/* KOLOM KIRI (7 / 12) */}
                    <div className="space-y-6 lg:col-span-7">
                        {/* SECTION: RINGKASAN KAS KOMUNITAS */}
                        <section
                            className="space-y-5 rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-5 sm:p-6"
                            aria-labelledby="kas-title"
                        >
                            <div className="flex items-start justify-between">
                                <div className="space-y-0.5">
                                    <span className="text-[11px] font-semibold tracking-wider text-[#2F6B57] uppercase">
                                        Transparansi Komunitas
                                    </span>
                                    <h2
                                        id="kas-title"
                                        className="text-sm font-semibold text-[#66736C]"
                                    >
                                        Saldo kas saat ini
                                    </h2>
                                    <div className="text-2xl font-bold tracking-tight text-[#1D2924] sm:text-3xl">
                                        Rp12.450.000
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setIsCashModalOpen(true)}
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#2F6B57] hover:underline"
                                >
                                    <span>Buka Laporan Kas</span>
                                    <ChevronRight className="h-3.5 w-3.5" />
                                </button>
                            </div>

                            {/* BAR VISUAL PEMASUKAN VS PENGELUARAN BULAN INI */}
                            <div className="space-y-2 border-t border-[#E4E3DC] pt-1">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-[#66736C]">
                                        Pencatatan Oktober 2026
                                    </span>
                                    <span className="text-[11px] text-[#66736C]">
                                        Pembaruan terakhir 25 Okt 2026
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] p-3">
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-1 text-[11px] text-[#66736C]">
                                            <ArrowDownRight className="h-3.5 w-3.5 text-[#2F7D5C]" />
                                            <span>Pemasukan Bulan Ini</span>
                                        </div>
                                        <div className="text-sm font-bold text-[#2F7D5C]">
                                            +Rp3.250.000
                                        </div>
                                    </div>

                                    <div className="space-y-0.5 border-l border-[#E4E3DC] pl-4">
                                        <div className="flex items-center gap-1 text-[11px] text-[#66736C]">
                                            <ArrowUpRight className="h-3.5 w-3.5 text-[#B87922]" />
                                            <span>Pengeluaran Bulan Ini</span>
                                        </div>
                                        <div className="text-sm font-bold text-[#1D2924]">
                                            -Rp1.875.000
                                        </div>
                                    </div>
                                </div>

                                {/* Bar Representasi Datar */}
                                <div className="flex h-2 w-full overflow-hidden rounded-full bg-[#E4E3DC]">
                                    <div
                                        className="h-full bg-[#2F7D5C]"
                                        style={{ width: '63%' }}
                                        title="Alokasi Pemasukan"
                                    />
                                    <div
                                        className="h-full bg-[#B87922]"
                                        style={{ width: '37%' }}
                                        title="Alokasi Pengeluaran"
                                    />
                                </div>
                            </div>

                            {/* Catatan Privasi Warga */}
                            <div className="rounded border border-[#E4E3DC] bg-[#F7F6F2] px-3 py-2 text-[11px] leading-relaxed text-[#66736C]">
                                <span className="font-semibold text-[#1D2924]">
                                    Privasi Terjaga:
                                </span>{' '}
                                Detail pembayaran setiap keluarga tidak
                                ditampilkan untuk menjaga kenyamanan dan privasi
                                sesama warga.
                            </div>
                        </section>

                        {/* SECTION: STATUS SURAT PENGANTAR RUMAH */}
                        <section className="space-y-3 rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-5 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <span className="text-[11px] font-semibold tracking-wider text-[#66736C] uppercase">
                                        Administrasi Warga
                                    </span>
                                    <h3 className="text-sm font-bold text-[#1D2924]">
                                        Pengajuan Dokumen Rumah Anda
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsLetterModalOpen(true)}
                                    className="text-xs font-semibold text-[#2F6B57] hover:underline"
                                >
                                    + Ajukan Baru
                                </button>
                            </div>

                            <div className="flex items-center justify-between gap-3 rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] p-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#E4E3DC] bg-[#FFFEFA] text-[#2F6B57]">
                                        <FileText className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-semibold text-[#1D2924]">
                                            Surat Pengantar Keterangan Domisili
                                        </div>
                                        <div className="text-[11px] text-[#66736C]">
                                            Diajukan kemarin · No. Pengajuan
                                            #SRT-2610
                                        </div>
                                    </div>
                                </div>

                                <span className="inline-flex shrink-0 items-center gap-1 rounded bg-[#FAF2E6] px-2 py-0.5 text-[10px] font-semibold text-[#B87922]">
                                    <Clock className="h-3 w-3" />
                                    Sedang Ditinjau
                                </span>
                            </div>
                        </section>
                    </div>

                    {/* KOLOM KANAN (5 / 12) */}
                    <div className="space-y-6 lg:col-span-5">
                        {/* WIDGET KHUSUS CLUSTER AMAN: AKSES TAMU QR */}
                        {communityMode === 'Cluster Aman' && (
                            <section
                                className="space-y-4 rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-5"
                                aria-labelledby="tamu-title"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <span className="text-[11px] font-semibold tracking-wider text-[#2F6B57] uppercase">
                                            Khusus Pos Satpam
                                        </span>
                                        <h2
                                            id="tamu-title"
                                            className="text-sm font-bold text-[#1D2924]"
                                        >
                                            Izin Masuk Tamu
                                        </h2>
                                    </div>

                                    {/* Small toggle for previewing empty guest state */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setGuestState(
                                                guestState === 'active'
                                                    ? 'empty'
                                                    : 'active',
                                            )
                                        }
                                        className="text-[10px] text-[#66736C] underline hover:text-[#1D2924]"
                                        title="Ubah state simulasi tamu"
                                    >
                                        {guestState === 'active'
                                            ? 'Lihat Kosong'
                                            : 'Lihat Ada Tamu'}
                                    </button>
                                </div>

                                {guestState === 'active' ? (
                                    <div className="space-y-3 rounded-lg border border-[#E4E3DC] bg-[#FAF9F5] p-3.5">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="text-xs font-bold text-[#1D2924]">
                                                    {guestForm.name}
                                                </div>
                                                <div className="text-[11px] text-[#66736C]">
                                                    Kategori:{' '}
                                                    <span className="font-medium text-[#1D2924]">
                                                        {guestForm.category}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="inline-flex items-center gap-1 rounded bg-[#EAF4EE] px-2 py-0.5 text-[10px] font-bold text-[#2F7D5C]">
                                                <span className="h-1.5 w-1.5 rounded-full bg-[#2F7D5C]" />
                                                Aktif hingga 16.00
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-[#E4E3DC] pt-2 text-xs">
                                            <span className="text-[11px] text-[#66736C]">
                                                Kendaraan:{' '}
                                                {guestForm.plateNumber}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setIsQrPassModalOpen(true)
                                                }
                                                className="inline-flex items-center gap-1 text-xs font-semibold text-[#2F6B57] hover:underline"
                                            >
                                                <QrCode className="h-3.5 w-3.5" />
                                                <span>Tampilkan QR</span>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2 rounded-lg border border-dashed border-[#E4E3DC] bg-[#F7F6F2] p-4 text-center">
                                        <p className="text-xs text-[#66736C]">
                                            Belum ada izin tamu aktif hari ini.
                                            Buat izin lebih dulu sebelum tamu
                                            tiba di pos.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsGuestCreateModalOpen(true)
                                            }
                                            className="rounded-md bg-[#EBF3EF] px-3.5 py-1.5 text-xs font-semibold text-[#2F6B57] transition-colors hover:bg-[#2F6B57] hover:text-[#FFFEFA]"
                                        >
                                            Buat Izin Tamu
                                        </button>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* SECTION: AKTIVITAS & PENGUMUMAN ("KABAR KOMUNITAS") */}
                        <section
                            className="space-y-4 rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-5"
                            aria-labelledby="kabar-title"
                        >
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <span className="text-[11px] font-semibold tracking-wider text-[#66736C] uppercase">
                                        Informasi Lingkungan
                                    </span>
                                    <h2
                                        id="kabar-title"
                                        className="text-sm font-bold text-[#1D2924]"
                                    >
                                        Kabar Komunitas
                                    </h2>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setHasAnnouncements(!hasAnnouncements)
                                    }
                                    className="text-[10px] text-[#66736C] underline hover:text-[#1D2924]"
                                    title="Toggle simulasi ada/tidak ada pengumuman"
                                >
                                    {hasAnnouncements
                                        ? 'Simulasi Kosong'
                                        : 'Simulasi Ada Kabar'}
                                </button>
                            </div>

                            {hasAnnouncements ? (
                                <div className="divide-y divide-[#E4E3DC] text-xs">
                                    {/* Item 1: Pengumuman Kerja Bakti */}
                                    <div className="space-y-1 py-3 first:pt-0">
                                        <div className="flex items-center justify-between">
                                            <span className="inline-block rounded bg-[#EBF3EF] px-1.5 py-0.5 text-[10px] font-semibold text-[#2F6B57]">
                                                Pengumuman
                                            </span>
                                            <span className="text-[11px] text-[#66736C]">
                                                Hari ini, 08.15
                                            </span>
                                        </div>
                                        <p className="leading-snug font-medium text-[#1D2924]">
                                            Kerja bakti pembersihan saluran air
                                            akan dilakukan Minggu, 1 November
                                            pukul 07.00 WIB.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSelectedNewsDetail({
                                                    title: 'Kerja Bakti Saluran Air Lingkungan',
                                                    category:
                                                        'Pengumuman Pengurus RT',
                                                    date: '27 Oktober 2026 · 08.15 WIB',
                                                    body: 'Diberitahukan kepada seluruh warga RT 04 Puri Taman Sari bahwa kerja bakti serentak pembersihan selokan dan fogging jentik nyamuk akan dilaksanakan pada Minggu pagi, 1 November 2026. Mohon warga dapat mengondisikan kendaraan masing-masing di dalam garasi.',
                                                })
                                            }
                                            className="inline-block pt-0.5 text-xs font-semibold text-[#2F6B57] hover:underline"
                                        >
                                            Lihat detail
                                        </button>
                                    </div>

                                    {/* Item 2: Laporan Kas Dipublikasikan */}
                                    <div className="space-y-1 py-3">
                                        <div className="flex items-center justify-between">
                                            <span className="inline-block rounded border border-[#E4E3DC] bg-[#F7F6F2] px-1.5 py-0.5 text-[10px] font-semibold text-[#1D2924]">
                                                Laporan Kas
                                            </span>
                                            <span className="text-[11px] text-[#66736C]">
                                                25 Okt 2026
                                            </span>
                                        </div>
                                        <p className="leading-snug font-medium text-[#1D2924]">
                                            Laporan rekapitulasi kas September
                                            2026 telah dipublikasikan oleh
                                            bendahara.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsCashModalOpen(true)
                                            }
                                            className="inline-block pt-0.5 text-xs font-semibold text-[#2F6B57] hover:underline"
                                        >
                                            Buka laporan
                                        </button>
                                    </div>

                                    {/* Item 3: Status Surat Pengantar */}
                                    <div className="space-y-1 py-3 last:pb-0">
                                        <div className="flex items-center justify-between">
                                            <span className="inline-block rounded bg-[#FAF2E6] px-1.5 py-0.5 text-[10px] font-semibold text-[#B87922]">
                                                Surat Pengantar
                                            </span>
                                            <span className="text-[11px] text-[#66736C]">
                                                26 Okt 2026
                                            </span>
                                        </div>
                                        <p className="leading-snug font-medium text-[#1D2924]">
                                            Surat Pengantar Domisili Anda sedang
                                            ditinjau oleh Sekretariat RT.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsLetterModalOpen(true)
                                            }
                                            className="inline-block pt-0.5 text-xs font-semibold text-[#2F6B57] hover:underline"
                                        >
                                            Periksa status
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2 rounded-lg border border-dashed border-[#E4E3DC] bg-[#F7F6F2] py-8 text-center">
                                    <Building2 className="mx-auto h-6 w-6 stroke-1 text-[#66736C]" />
                                    <p className="text-xs text-[#66736C]">
                                        Aktivitas dan kabar komunitas akan
                                        muncul di sini.
                                    </p>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>

            {/* ============================================================== */}
            {/* MODAL 1: BAYAR IURAN (TRANSFER MANDIRI & QRIS MOCK)            */}
            {/* ============================================================== */}
            {isPayModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D2924]/40 p-4 backdrop-blur-xs">
                    <div className="max-h-[90vh] w-full max-w-lg animate-in space-y-5 overflow-y-auto rounded-2xl border border-[#E4E3DC] bg-[#FFFEFA] p-6 shadow-md duration-150 zoom-in-95">
                        <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-3">
                            <div className="space-y-0.5">
                                <h3 className="text-base font-bold text-[#1D2924]">
                                    Pembayaran Iuran Warga
                                </h3>
                                <p className="text-xs text-[#66736C]">
                                    Iuran Keamanan & Kebersihan · Periode
                                    Oktober 2026
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsPayModalOpen(false)}
                                className="rounded-md p-1 text-[#66736C] hover:bg-[#F7F6F2] hover:text-[#1D2924]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Nominal Tagihan */}
                        <div className="flex items-center justify-between rounded-xl border border-[#E4E3DC] bg-[#FAF9F5] p-4">
                            <div>
                                <span className="text-xs text-[#66736C]">
                                    Total Tagihan Rumah Blok A-12
                                </span>
                                <div className="text-2xl font-bold text-[#1D2924]">
                                    Rp20.000
                                </div>
                            </div>
                            <span className="rounded bg-[#FAF2E6] px-2.5 py-1 text-[11px] font-semibold text-[#B87922]">
                                Jatuh Tempo 10 Nov 2026
                            </span>
                        </div>

                        {/* Rekening Tujuan Resmi */}
                        <div className="space-y-3">
                            <label className="block text-xs font-semibold text-[#1D2924]">
                                Pilihan Cara Pembayaran:
                            </label>

                            <div className="space-y-2 rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-3.5">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs font-bold text-[#1D2924]">
                                        Transfer Bank Mandiri
                                    </div>
                                    <span className="rounded bg-[#EBF3EF] px-2 py-0.5 text-[10px] font-semibold text-[#2F6B57]">
                                        Rekening Resmi RT
                                    </span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] p-2.5">
                                    <div className="space-y-0.5">
                                        <div className="text-[11px] text-[#66736C]">
                                            No. Rekening Bendahara
                                        </div>
                                        <div className="font-mono text-sm font-bold text-[#1D2924]">
                                            137-00-1928374-1
                                        </div>
                                        <div className="text-[11px] text-[#66736C]">
                                            a.n. Kas RT 04 Sukamaju
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            copyToClipboard('1370019283741')
                                        }
                                        className="inline-flex items-center gap-1.5 rounded-md border border-[#E4E3DC] bg-[#FFFEFA] px-3 py-1.5 text-xs font-medium text-[#1D2924] transition-colors hover:bg-[#F7F6F2]"
                                    >
                                        {copiedAccount ? (
                                            <>
                                                <Check className="h-3.5 w-3.5 text-[#2F7D5C]" />
                                                <span className="text-[#2F7D5C]">
                                                    Disalin
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-3.5 w-3.5" />
                                                <span>Salin</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Alternatif QRIS Lingkungan */}
                            <div className="space-y-2 rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-3.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-[#1D2924]">
                                        QRIS Komunitas Taman Sari
                                    </span>
                                    <span className="text-[10px] text-[#66736C]">
                                        Semua Dompet Digital / Mobile Banking
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] p-3">
                                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded border border-[#E4E3DC] bg-[#FFFEFA]">
                                        <QrCode className="h-12 w-12 text-[#1D2924]" />
                                    </div>
                                    <div className="text-[11px] leading-relaxed text-[#66736C]">
                                        Pindai QRIS kas RT melalui BCA Mobile,
                                        Livin, GoPay, OVO, atau ShopeePay.
                                        Pastikan nama penerima tertulis{' '}
                                        <strong>RT 04 Sukamaju</strong>.
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Konfirmasi Pembayaran Mock */}
                        <div className="space-y-2 border-t border-[#E4E3DC] pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsPayModalOpen(false);
                                    setDuesState('verifying');
                                }}
                                className="w-full rounded-lg bg-[#2F6B57] px-4 py-2.5 text-xs font-semibold text-[#FFFEFA] shadow-xs transition-colors hover:bg-[#245442]"
                            >
                                Saya Sudah Transfer, Kirim Konfirmasi
                            </button>
                            <p className="text-center text-[11px] text-[#66736C]">
                                Setelah konfirmasi dikirim, bendahara akan
                                memeriksa mutasi dalam 1x24 jam.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================================== */}
            {/* MODAL 2: RINCIAN IURAN & RIWAYAT PEMBAYARAN                    */}
            {/* ============================================================== */}
            {isDuesDetailModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D2924]/40 p-4 backdrop-blur-xs">
                    <div className="max-h-[90vh] w-full max-w-lg animate-in space-y-5 overflow-y-auto rounded-2xl border border-[#E4E3DC] bg-[#FFFEFA] p-6 shadow-md duration-150 zoom-in-95">
                        <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-3">
                            <div className="space-y-0.5">
                                <h3 className="text-base font-bold text-[#1D2924]">
                                    Rincian Iuran Rumah Blok A-12
                                </h3>
                                <p className="text-xs text-[#66736C]">
                                    Penetapan berdasarkan musyawarah warga RT 04
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsDuesDetailModalOpen(false)}
                                className="rounded-md p-1 text-[#66736C] hover:bg-[#F7F6F2] hover:text-[#1D2924]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Komponen Biaya */}
                        <div className="space-y-2">
                            <span className="text-xs font-semibold text-[#1D2924]">
                                Komponen Bulanan:
                            </span>
                            <div className="divide-y divide-[#E4E3DC] rounded-xl border border-[#E4E3DC] text-xs">
                                <div className="flex justify-between p-3">
                                    <span className="text-[#66736C]">
                                        Iuran Keamanan & Ronda (Pos Satpam)
                                    </span>
                                    <span className="font-semibold text-[#1D2924]">
                                        Rp15.000
                                    </span>
                                </div>
                                <div className="flex justify-between p-3">
                                    <span className="text-[#66736C]">
                                        Iuran Kebersihan & Pengangkutan Sampah
                                    </span>
                                    <span className="font-semibold text-[#1D2924]">
                                        Rp5.000
                                    </span>
                                </div>
                                <div className="flex justify-between bg-[#F7F6F2] p-3 font-bold">
                                    <span>Total Per Bulan</span>
                                    <span>Rp20.000</span>
                                </div>
                            </div>
                        </div>

                        {/* Riwayat Pembayaran Sebelumnya */}
                        <div className="space-y-2">
                            <span className="text-xs font-semibold text-[#1D2924]">
                                Riwayat Pembayaran Sebelumnya:
                            </span>
                            <div className="divide-y divide-[#E4E3DC] rounded-xl border border-[#E4E3DC] text-xs">
                                <div className="flex items-center justify-between p-3">
                                    <div>
                                        <div className="font-semibold text-[#1D2924]">
                                            September 2026
                                        </div>
                                        <div className="text-[11px] text-[#66736C]">
                                            Dibayar 5 Sep 2026 · Transfer
                                            Mandiri
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2F7D5C]">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        Lunas (Rp20.000)
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3">
                                    <div>
                                        <div className="font-semibold text-[#1D2924]">
                                            Agustus 2026
                                        </div>
                                        <div className="text-[11px] text-[#66736C]">
                                            Dibayar 3 Agu 2026 · Tunai Bendahara
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2F7D5C]">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        Lunas (Rp20.000)
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end border-t border-[#E4E3DC] pt-2">
                            <button
                                type="button"
                                onClick={() => setIsDuesDetailModalOpen(false)}
                                className="rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] px-4 py-2 text-xs font-semibold text-[#1D2924] transition-colors hover:bg-[#E4E3DC]"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================================== */}
            {/* MODAL 3: BUAT IZIN TAMU BARU (CLUSTER AMAN)                    */}
            {/* ============================================================== */}
            {isGuestCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D2924]/40 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-md animate-in space-y-4 rounded-2xl border border-[#E4E3DC] bg-[#FFFEFA] p-6 shadow-md duration-150 zoom-in-95">
                        <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-3">
                            <div className="space-y-0.5">
                                <h3 className="text-base font-bold text-[#1D2924]">
                                    Buat Izin Tamu Masuk
                                </h3>
                                <p className="text-xs text-[#66736C]">
                                    Izin tercatat di tablet pos satpam gerbang
                                    utama
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsGuestCreateModalOpen(false)}
                                className="rounded-md p-1 text-[#66736C] hover:bg-[#F7F6F2] hover:text-[#1D2924]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {guestCreatedSuccess ? (
                            <div className="space-y-3 py-6 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF4EE] text-[#2F7D5C]">
                                    <Check className="h-6 w-6" />
                                </div>
                                <h4 className="text-sm font-bold text-[#1D2924]">
                                    Izin Tamu Berhasil Diterbitkan
                                </h4>
                                <p className="mx-auto max-w-xs text-xs text-[#66736C]">
                                    Kode QR telah aktif dan tersimpan. Tamu
                                    dapat menunjukkan kode kepada petugas pos
                                    satpam.
                                </p>
                                <div className="flex justify-center gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsGuestCreateModalOpen(false);
                                            setGuestCreatedSuccess(false);
                                            setGuestState('active');
                                            setIsQrPassModalOpen(true);
                                        }}
                                        className="rounded-lg bg-[#2F6B57] px-4 py-2 text-xs font-semibold text-[#FFFEFA]"
                                    >
                                        Tampilkan QR Tamu
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    setGuestCreatedSuccess(true);
                                    setGuestState('active');
                                }}
                                className="space-y-3 text-xs"
                            >
                                <div className="space-y-1">
                                    <label className="font-semibold text-[#1D2924]">
                                        Nama Lengkap Tamu:
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={guestForm.name}
                                        onChange={(e) =>
                                            setGuestForm({
                                                ...guestForm,
                                                name: e.target.value,
                                            })
                                        }
                                        placeholder="Contoh: Andi Wijaya"
                                        className="w-full rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-3 py-2 text-[#1D2924] focus:border-[#2F6B57] focus:outline-hidden"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="font-semibold text-[#1D2924]">
                                        Keperluan / Kategori Tamu:
                                    </label>
                                    <select
                                        value={guestForm.category}
                                        onChange={(e) =>
                                            setGuestForm({
                                                ...guestForm,
                                                category: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-3 py-2 text-[#1D2924] focus:border-[#2F6B57] focus:outline-hidden"
                                    >
                                        <option value="Tamu Keluarga / Pribadi">
                                            Tamu Keluarga / Pribadi
                                        </option>
                                        <option value="Teknisi / Pekerja">
                                            Teknisi / Pekerja Rumah
                                        </option>
                                        <option value="Kurir / Pengantar Paket">
                                            Kurir / Pengantar Khusus
                                        </option>
                                        <option value="Ojek Online / Antar Makanan">
                                            Ojek Online / Antar Makanan
                                        </option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="font-semibold text-[#1D2924]">
                                        Nomor Polisi Kendaraan (Opsional):
                                    </label>
                                    <input
                                        type="text"
                                        value={guestForm.plateNumber}
                                        onChange={(e) =>
                                            setGuestForm({
                                                ...guestForm,
                                                plateNumber: e.target.value,
                                            })
                                        }
                                        placeholder="Contoh: B 1234 ABC"
                                        className="w-full rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-3 py-2 text-[#1D2924] focus:border-[#2F6B57] focus:outline-hidden"
                                    />
                                </div>

                                <div className="rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] p-3 text-[11px] text-[#66736C]">
                                    Masa berlaku izin:{' '}
                                    <strong>
                                        Hari ini hingga pukul 21.00 WIB
                                    </strong>
                                    . Izin akan otomatis kadaluarsa setelah tamu
                                    keluar pos satpam.
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsGuestCreateModalOpen(false)
                                        }
                                        className="px-4 py-2 font-medium text-[#66736C] hover:text-[#1D2924]"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="rounded-lg bg-[#2F6B57] px-4 py-2 font-semibold text-[#FFFEFA] transition-colors hover:bg-[#245442]"
                                    >
                                        Terbitkan Izin QR
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* ============================================================== */}
            {/* MODAL 4: TAMPILAN QR PASS TAMU AKTIF (CLUSTER AMAN)            */}
            {/* ============================================================== */}
            {isQrPassModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D2924]/40 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-sm animate-in space-y-4 rounded-2xl border border-[#E4E3DC] bg-[#FFFEFA] p-6 text-center shadow-md duration-150 zoom-in-95">
                        <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-2">
                            <span className="text-[11px] font-semibold tracking-wider text-[#2F6B57] uppercase">
                                QR Pass Tamu Masuk
                            </span>
                            <button
                                type="button"
                                onClick={() => setIsQrPassModalOpen(false)}
                                className="rounded p-1 text-[#66736C] hover:text-[#1D2924]"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-base font-bold text-[#1D2924]">
                                {guestForm.name}
                            </h3>
                            <p className="text-xs text-[#66736C]">
                                Tujuan: Rumah Blok A-12 · Keluarga Pratama
                            </p>
                        </div>

                        {/* QR Box */}
                        <div className="mx-auto inline-block rounded-xl border-2 border-dashed border-[#2F6B57]/30 bg-[#FAF9F5] p-6">
                            <QrCode className="h-40 w-40 text-[#1D2924]" />
                            <div className="mt-2 font-mono text-[11px] text-[#66736C]">
                                PASS-8291-KMRT
                            </div>
                        </div>

                        <div className="space-y-1 text-xs">
                            <div className="font-semibold text-[#2F7D5C]">
                                Aktif hingga 16.00 WIB
                            </div>
                            <p className="mx-auto max-w-xs text-[11px] text-[#66736C]">
                                Tunjukkan layar ini ke scanner pos gerbang, atau
                                kirimkan salinan tautan ke WhatsApp tamu Anda.
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    alert(
                                        'Tautan akses QR tamu disalin. Anda dapat mengirimkannya via WhatsApp.',
                                    );
                                }}
                                className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#EBF3EF] px-3 py-2 text-xs font-semibold text-[#2F6B57] transition-colors hover:bg-[#2F6B57] hover:text-[#FFFEFA]"
                            >
                                <Share2 className="h-3.5 w-3.5" />
                                <span>Bagikan Tautan ke Tamu</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsQrPassModalOpen(false)}
                                className="py-1 text-xs text-[#66736C] hover:text-[#1D2924]"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================================== */}
            {/* MODAL 5: PENGAJUAN SURAT PENGANTAR RT                          */}
            {/* ============================================================== */}
            {isLetterModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D2924]/40 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-md animate-in space-y-4 rounded-2xl border border-[#E4E3DC] bg-[#FFFEFA] p-6 shadow-md duration-150 zoom-in-95">
                        <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-3">
                            <div className="space-y-0.5">
                                <h3 className="text-base font-bold text-[#1D2924]">
                                    Pengajuan Surat Pengantar RT
                                </h3>
                                <p className="text-xs text-[#66736C]">
                                    Dokumen resmi pengantar untuk instansi /
                                    kelurahan
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsLetterModalOpen(false);
                                    setLetterSubmitted(false);
                                }}
                                className="rounded-md p-1 text-[#66736C] hover:bg-[#F7F6F2] hover:text-[#1D2924]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {letterSubmitted ? (
                            <div className="space-y-3 py-6 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF4EE] text-[#2F7D5C]">
                                    <Check className="h-6 w-6" />
                                </div>
                                <h4 className="text-sm font-bold text-[#1D2924]">
                                    Pengajuan Surat Berhasil Dikirim
                                </h4>
                                <p className="mx-auto max-w-xs text-xs text-[#66736C]">
                                    Ketua RT 04 akan meninjau keperluan surat
                                    Anda. Pemberitahuan tanda tangan akan
                                    dikirim lewat aplikasi.
                                </p>
                                <div className="flex justify-center pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsLetterModalOpen(false);
                                            setLetterSubmitted(false);
                                        }}
                                        className="rounded-lg bg-[#2F6B57] px-4 py-2 text-xs font-semibold text-[#FFFEFA]"
                                    >
                                        Kembali ke Dashboard
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    setLetterSubmitted(true);
                                }}
                                className="space-y-3 text-xs"
                            >
                                <div className="space-y-1">
                                    <label className="font-semibold text-[#1D2924]">
                                        Pilih Jenis Surat:
                                    </label>
                                    <select
                                        value={letterType}
                                        onChange={(e) =>
                                            setLetterType(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-3 py-2 text-[#1D2924] focus:border-[#2F6B57] focus:outline-hidden"
                                    >
                                        <option value="Surat Pengantar Domisili">
                                            Surat Keterangan Domisili
                                        </option>
                                        <option value="Surat Pengantar SKCK">
                                            Surat Pengantar Pembuatan SKCK
                                        </option>
                                        <option value="Surat Keterangan Usaha Warga">
                                            Surat Keterangan Usaha (UMKM)
                                        </option>
                                        <option value="Surat Keterangan Kematian/Kelahiran">
                                            Surat Keterangan Peristiwa Keluarga
                                        </option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="font-semibold text-[#1D2924]">
                                        Keperluan Pembuatan Surat:
                                    </label>
                                    <textarea
                                        rows={3}
                                        required
                                        value={letterPurpose}
                                        onChange={(e) =>
                                            setLetterPurpose(e.target.value)
                                        }
                                        placeholder="Jelaskan secara singkat untuk instansi mana..."
                                        className="w-full rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-3 py-2 text-[#1D2924] focus:border-[#2F6B57] focus:outline-hidden"
                                    />
                                </div>

                                <div className="rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] p-3 text-[11px] text-[#66736C]">
                                    Nama Pemohon:{' '}
                                    <strong>
                                        Budi Pratama (Kepala Keluarga · Blok
                                        A-12)
                                    </strong>
                                    . Dokumen akan diverifikasi oleh Ketua RT
                                    dalam jam kerja.
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsLetterModalOpen(false)
                                        }
                                        className="px-4 py-2 font-medium text-[#66736C] hover:text-[#1D2924]"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex items-center gap-1.5 rounded-lg bg-[#2F6B57] px-4 py-2 font-semibold text-[#FFFEFA] transition-colors hover:bg-[#245442]"
                                    >
                                        <Send className="h-3.5 w-3.5" />
                                        <span>Kirim Pengajuan</span>
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* ============================================================== */}
            {/* MODAL 6: RINCIAN KAS BULANAN LENGKAP                           */}
            {/* ============================================================== */}
            {isCashModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D2924]/40 p-4 backdrop-blur-xs">
                    <div className="max-h-[90vh] w-full max-w-xl animate-in space-y-5 overflow-y-auto rounded-2xl border border-[#E4E3DC] bg-[#FFFEFA] p-6 shadow-md duration-150 zoom-in-95">
                        <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-3">
                            <div className="space-y-0.5">
                                <span className="text-[10px] font-semibold tracking-wider text-[#2F6B57] uppercase">
                                    Transparansi Kas Lingkungan
                                </span>
                                <h3 className="text-base font-bold text-[#1D2924]">
                                    Buku Kas RT 04 · Oktober 2026
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsCashModalOpen(false)}
                                className="rounded-md p-1 text-[#66736C] hover:bg-[#F7F6F2] hover:text-[#1D2924]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Ringkasan Angka */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-0.5 rounded-xl border border-[#E4E3DC] bg-[#F7F6F2] p-3">
                                <span className="text-[10px] text-[#66736C]">
                                    Saldo Awal Bulan
                                </span>
                                <div className="text-xs font-bold text-[#1D2924] sm:text-sm">
                                    Rp11.075.000
                                </div>
                            </div>
                            <div className="space-y-0.5 rounded-xl border border-[#2F7D5C]/20 bg-[#EAF4EE] p-3">
                                <span className="text-[10px] text-[#2F7D5C]">
                                    Total Masuk
                                </span>
                                <div className="text-xs font-bold text-[#2F7D5C] sm:text-sm">
                                    +Rp3.250.000
                                </div>
                            </div>
                            <div className="space-y-0.5 rounded-xl border border-[#B87922]/20 bg-[#FAF2E6] p-3">
                                <span className="text-[10px] text-[#B87922]">
                                    Total Keluar
                                </span>
                                <div className="text-xs font-bold text-[#B87922] sm:text-sm">
                                    -Rp1.875.000
                                </div>
                            </div>
                        </div>

                        {/* Mutasi Pengeluaran Terbaru */}
                        <div className="space-y-2 text-xs">
                            <div className="flex items-center justify-between font-semibold text-[#1D2924]">
                                <span>Pengeluaran Utama Bulan Ini:</span>
                                <span className="text-[11px] text-[#66736C]">
                                    4 Catatan
                                </span>
                            </div>

                            <div className="divide-y divide-[#E4E3DC] rounded-xl border border-[#E4E3DC]">
                                <div className="flex items-center justify-between p-3">
                                    <div>
                                        <div className="font-semibold text-[#1D2924]">
                                            Honor Petugas Keamanan (2 Orang)
                                        </div>
                                        <div className="text-[11px] text-[#66736C]">
                                            20 Okt 2026 · Pos Gerbang
                                        </div>
                                    </div>
                                    <span className="font-semibold text-[#1D2924]">
                                        -Rp1.200.000
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3">
                                    <div>
                                        <div className="font-semibold text-[#1D2924]">
                                            Iuran Pengangkutan Sampah DLH
                                        </div>
                                        <div className="text-[11px] text-[#66736C]">
                                            15 Okt 2026 · Dinas Kebersihan
                                        </div>
                                    </div>
                                    <span className="font-semibold text-[#1D2924]">
                                        -Rp450.000
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3">
                                    <div>
                                        <div className="font-semibold text-[#1D2924]">
                                            Penggantian Lampu Jalan Blok B
                                        </div>
                                        <div className="text-[11px] text-[#66736C]">
                                            11 Okt 2026 · Sarana Lingkungan
                                        </div>
                                    </div>
                                    <span className="font-semibold text-[#1D2924]">
                                        -Rp225.000
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-[#E4E3DC] pt-2">
                            <span className="text-[11px] text-[#66736C]">
                                Disusun oleh: Bendahara RT 04 Sukamaju
                            </span>
                            <button
                                type="button"
                                onClick={() => setIsCashModalOpen(false)}
                                className="rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] px-4 py-2 text-xs font-semibold text-[#1D2924] transition-colors hover:bg-[#E4E3DC]"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================================== */}
            {/* MODAL 7: DETAIL PENGUMUMAN KOMUNITAS                           */}
            {/* ============================================================== */}
            {selectedNewsDetail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D2924]/40 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-md animate-in space-y-4 rounded-2xl border border-[#E4E3DC] bg-[#FFFEFA] p-6 shadow-md duration-150 zoom-in-95">
                        <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-3">
                            <div className="space-y-0.5">
                                <span className="text-[10px] font-semibold tracking-wider text-[#2F6B57] uppercase">
                                    {selectedNewsDetail.category}
                                </span>
                                <h3 className="text-base font-bold text-[#1D2924]">
                                    {selectedNewsDetail.title}
                                </h3>
                                <div className="text-[11px] text-[#66736C]">
                                    {selectedNewsDetail.date}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedNewsDetail(null)}
                                className="rounded p-1 text-[#66736C] hover:text-[#1D2924]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <p className="text-xs leading-relaxed text-[#1D2924]">
                            {selectedNewsDetail.body}
                        </p>

                        <div className="flex justify-end border-t border-[#E4E3DC] pt-2">
                            <button
                                type="button"
                                onClick={() => setSelectedNewsDetail(null)}
                                className="rounded-lg bg-[#2F6B57] px-4 py-2 text-xs font-semibold text-[#FFFEFA]"
                            >
                                Mengerti
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </CitizenLayout>
    );
}
