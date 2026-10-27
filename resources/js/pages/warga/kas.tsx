import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import CitizenLayout from '@/layouts/citizen-layout';
import {
    ArrowUpRight,
    ArrowDownRight,
    Download,
    FileText,
    CheckCircle2,
    X,
    Info,
    RefreshCw,
    Shield,
    Printer,
    ArrowLeft,
    TrendingUp,
} from 'lucide-react';

interface MonthlyReport {
    id: string;
    periodKey: string;
    periodName: string;
    periodRange: string;
    publishedDate: string;
    startingBalance: number;
    totalIncome: number;
    totalExpense: number;
    endingBalance: number;
    treasurerNote?: string;
    isFinal: boolean;
}

interface PublicTransaction {
    id: string;
    date: string;
    category: string;
    description: string;
    type: 'income' | 'expense';
    amount: number;
}

const MONTHLY_REPORTS: MonthlyReport[] = [
    {
        id: 'rep-okt-2026',
        periodKey: 'okt-2026',
        periodName: 'Oktober 2026',
        periodRange: '1–25 Oktober 2026',
        publishedDate: '25 Oktober 2026',
        startingBalance: 11075000,
        totalIncome: 3250000,
        totalExpense: 1875000,
        endingBalance: 12450000,
        treasurerNote:
            'Pengeluaran perawatan taman mencakup pembelian bibit tanaman, pupuk kompos, dan perbaikan kran selang fasilitas umum. Seluruh kuitansi fisik telah diserahkan dan diverifikasi oleh Ketua RT 04.',
        isFinal: true,
    },
    {
        id: 'rep-sep-2026',
        periodKey: 'sep-2026',
        periodName: 'September 2026',
        periodRange: '1–30 September 2026',
        publishedDate: '30 September 2026',
        startingBalance: 9725000,
        totalIncome: 2800000,
        totalExpense: 1450000,
        endingBalance: 11075000,
        treasurerNote:
            'Operasional bulan September tertib. Pemasukan iuran mencapai 94% dari total kepala keluarga terdaftar.',
        isFinal: true,
    },
    {
        id: 'rep-ags-2026',
        periodKey: 'ags-2026',
        periodName: 'Agustus 2026',
        periodRange: '1–31 Agustus 2026',
        publishedDate: '31 Agustus 2026',
        startingBalance: 8425000,
        totalIncome: 3000000,
        totalExpense: 1700000,
        endingBalance: 9725000,
        treasurerNote:
            'Terdapat realisasi belanja perawatan pintu gerbang pos dan perbaikan hidrolik portal.',
        isFinal: true,
    },
    {
        id: 'rep-jul-2026',
        periodKey: 'jul-2026',
        periodName: 'Juli 2026',
        periodRange: '1–31 Juli 2026',
        publishedDate: '31 Juli 2026',
        startingBalance: 7225000,
        totalIncome: 3400000,
        totalExpense: 2200000,
        endingBalance: 8425000,
        treasurerNote:
            'Alokasi pengeluaran mencakup bantuan kas pembuka untuk panitia perlombaan 17 Agustus.',
        isFinal: true,
    },
];

const SIX_MONTH_BAR_DATA = [
    { month: 'Mei 26', income: 2900000, expense: 1600000 },
    { month: 'Jun 26', income: 3100000, expense: 1900000 },
    { month: 'Jul 26', income: 3400000, expense: 2200000 },
    { month: 'Ags 26', income: 3000000, expense: 1700000 },
    { month: 'Sep 26', income: 2800000, expense: 1450000 },
    { month: 'Okt 26', income: 3250000, expense: 1875000 },
];

const TRANSACTIONS_OKTOBER: PublicTransaction[] = [
    {
        id: 'trx-1',
        date: '24 Okt 2026',
        category: 'Keamanan Lingkungan',
        description:
            'Honor 2 petugas satpam pos jaga & perlengkapan senter ronda',
        type: 'expense',
        amount: 850000,
    },
    {
        id: 'trx-2',
        date: '20 Okt 2026',
        category: 'Iuran Kebersihan',
        description:
            'Rekapitulasi penerimaan iuran kebersihan lingkungan Oktober',
        type: 'income',
        amount: 1125000,
    },
    {
        id: 'trx-3',
        date: '18 Okt 2026',
        category: 'Perawatan Fasilitas',
        description:
            'Penggantian lampu penerangan jalan Blok B & pembelian pupuk tanaman',
        type: 'expense',
        amount: 350000,
    },
    {
        id: 'trx-4',
        date: '15 Okt 2026',
        category: 'Kebersihan Lingkungan',
        description:
            'Retribusi resmi armada truk sampah Dinas Lingkungan Hidup (DLH)',
        type: 'expense',
        amount: 425000,
    },
    {
        id: 'trx-5',
        date: '10 Okt 2026',
        category: 'Iuran Keamanan',
        description: 'Rekapitulasi penerimaan iuran keamanan pos jaga RT 04',
        type: 'income',
        amount: 1500000,
    },
    {
        id: 'trx-6',
        date: '5 Okt 2026',
        category: 'Kas Sosial Warga',
        description:
            'Rekapitulasi penerimaan kas sosial & dana santunan darurat warga',
        type: 'income',
        amount: 400000,
    },
    {
        id: 'trx-7',
        date: '3 Okt 2026',
        category: 'Kegiatan Warga',
        description:
            'Konsumsi dan perlengkapan rapat koordinasi bulanan pengurus RT',
        type: 'expense',
        amount: 250000,
    },
    {
        id: 'trx-8',
        date: '1 Okt 2026',
        category: 'Donasi Kegiatan',
        description:
            'Sumbangan sukarela warga untuk perawatan fasilitas arena balita',
        type: 'income',
        amount: 225000,
    },
];

export default function KasIndex() {
    // Community Mode Simulator
    const [communityMode, setCommunityMode] = useState<
        'Cluster Aman' | 'RT Mandiri'
    >('Cluster Aman');

    // Simulator State: 'normal' | 'updating' | 'empty' | 'error'
    const [pageState, setPageState] = useState<
        'normal' | 'updating' | 'empty' | 'error'
    >('normal');

    // Selected Period
    const [selectedPeriodKey, setSelectedPeriodKey] =
        useState<string>('okt-2026');

    // Transactions Filter: 'all' | 'income' | 'expense'
    const [transactionFilter, setTransactionFilter] = useState<
        'all' | 'income' | 'expense'
    >('all');

    // Hovered Bar for Chart Tooltip
    const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

    // Detail Modal for a specific monthly report
    const [selectedReportDetail, setSelectedReportDetail] =
        useState<MonthlyReport | null>(null);

    // Current Report
    const currentReport =
        MONTHLY_REPORTS.find((r) => r.periodKey === selectedPeriodKey) ||
        MONTHLY_REPORTS[0];

    // Format Rupiah
    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Filter Transactions
    const filteredTransactions = React.useMemo(() => {
        if (transactionFilter === 'all') return TRANSACTIONS_OKTOBER;
        return TRANSACTIONS_OKTOBER.filter((t) => t.type === transactionFilter);
    }, [transactionFilter]);

    // Maximum value for bar scaling in chart
    const maxBarValue = 3500000;

    return (
        <CitizenLayout
            title="Laporan Kas"
            communityMode={communityMode}
            onModeChange={setCommunityMode}
            activeNav="kas"
        >
            <Head title="Laporan Kas Lingkungan — KomunitasHub" />

            <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                {/* TOOLBAR SIMULASI PENGUJIAN */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-3 text-xs shadow-2xs">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#1D2924]">
                            Status Simulasi:
                        </span>
                        <div className="inline-flex rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] p-0.5">
                            <button
                                type="button"
                                onClick={() => setPageState('normal')}
                                className={`rounded px-2.5 py-1 font-medium transition-colors ${
                                    pageState === 'normal'
                                        ? 'bg-[#2F6B57] text-[#FFFEFA]'
                                        : 'text-[#66736C] hover:text-[#1D2924]'
                                }`}
                            >
                                Laporan Normal
                            </button>
                            <button
                                type="button"
                                onClick={() => setPageState('updating')}
                                className={`rounded px-2.5 py-1 font-medium transition-colors ${
                                    pageState === 'updating'
                                        ? 'bg-[#B87922] text-[#FFFEFA]'
                                        : 'text-[#66736C] hover:text-[#1D2924]'
                                }`}
                            >
                                Sedang Diperbarui
                            </button>
                            <button
                                type="button"
                                onClick={() => setPageState('empty')}
                                className={`rounded px-2.5 py-1 font-medium transition-colors ${
                                    pageState === 'empty'
                                        ? 'bg-[#2F6B57] text-[#FFFEFA]'
                                        : 'text-[#66736C] hover:text-[#1D2924]'
                                }`}
                            >
                                Belum Ada Laporan
                            </button>
                            <button
                                type="button"
                                onClick={() => setPageState('error')}
                                className={`rounded px-2.5 py-1 font-medium transition-colors ${
                                    pageState === 'error'
                                        ? 'bg-[#B74E44] text-[#FFFEFA]'
                                        : 'text-[#66736C] hover:text-[#1D2924]'
                                }`}
                            >
                                Gangguan Akses
                            </button>
                        </div>
                    </div>

                    <div className="text-[11px] text-[#66736C]">
                        Kerahasiaan Warga:{' '}
                        <strong className="text-[#2F6B57]">
                            Privasi Data Terjaga
                        </strong>
                    </div>
                </div>

                {/* BREADCRUMB DESKTOP */}
                <div className="hidden items-center gap-2 text-xs text-[#66736C] md:flex">
                    <Link
                        href="/dashboard"
                        className="hover:text-[#1D2924] hover:underline"
                    >
                        Ringkasan
                    </Link>
                    <span>/</span>
                    <span className="font-semibold text-[#1D2924]">
                        Transparansi Kas Komunitas
                    </span>
                </div>

                {/* ============================================================== */}
                {/* KONDISI 1: STATE ERROR / AKSES TERBATAS                         */}
                {/* ============================================================== */}
                {pageState === 'error' ? (
                    <div className="space-y-4 rounded-2xl border border-[#E4E3DC] bg-[#FFFEFA] p-8 text-center shadow-xs sm:p-12">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#E4E3DC] bg-[#FAF9F5] text-[#B74E44]">
                            <RefreshCw className="stroke-1.5 h-6 w-6" />
                        </div>
                        <div className="mx-auto max-w-sm space-y-1.5">
                            <h2 className="text-xl font-bold text-[#1D2924]">
                                Laporan kas belum dapat ditampilkan saat ini
                            </h2>
                            <p className="text-xs leading-relaxed text-[#66736C]">
                                Terjadi kendala saat menyinkronkan data buku kas
                                lingkungan. Silakan coba lagi beberapa saat
                                lagi.
                            </p>
                        </div>
                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={() => setPageState('normal')}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#2F6B57] px-5 py-2.5 text-xs font-semibold text-[#FFFEFA] shadow-xs hover:bg-[#245442]"
                            >
                                <RefreshCw className="h-3.5 w-3.5" />
                                <span>Muat Ulang Laporan</span>
                            </button>
                        </div>
                    </div>
                ) : pageState === 'empty' ? (
                    /* ============================================================== */
                    /* KONDISI 2: STATE BELUM ADA LAPORAN YANG DIPUBLIKASIKAN         */
                    /* ============================================================== */
                    <div className="space-y-6">
                        <header className="border-b border-[#E4E3DC] pb-4">
                            <span className="text-xs font-semibold tracking-wider text-[#2F6B57] uppercase">
                                Komunitas Taman Sari
                            </span>
                            <h1 className="text-2xl font-bold text-[#1D2924] sm:text-3xl">
                                Laporan Kas
                            </h1>
                            <p className="text-xs text-[#66736C]">
                                Transparansi pembukuan kas lingkungan RT 04
                                Sukamaju.
                            </p>
                        </header>

                        <div className="space-y-4 rounded-2xl border border-[#E4E3DC] bg-[#FFFEFA] p-8 text-center shadow-xs sm:p-12">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#E4E3DC] bg-[#FAF9F5] text-[#66736C]">
                                <FileText className="h-6 w-6 stroke-1" />
                            </div>

                            <div className="mx-auto max-w-md space-y-1.5">
                                <h2 className="text-xl font-bold text-[#1D2924]">
                                    Laporan kas belum tersedia
                                </h2>
                                <p className="text-xs leading-relaxed text-[#66736C]">
                                    Pengurus belum mempublikasikan laporan
                                    keuangan untuk periode ini. Laporan resmi
                                    akan muncul di halaman ini setelah disetujui
                                    oleh Ketua RT.
                                </p>
                            </div>

                            {/* Saldo Terakhir yang Tersedia */}
                            <div className="mx-auto max-w-xs space-y-0.5 rounded-xl border border-[#E4E3DC] bg-[#FAF9F5] p-3 text-center text-xs">
                                <span className="text-[11px] text-[#66736C]">
                                    Saldo terakhir yang dipublikasikan:
                                </span>
                                <div className="text-base font-bold text-[#1D2924]">
                                    Rp11.075.000
                                </div>
                                <span className="text-[10px] text-[#66736C]">
                                    Per 30 September 2026
                                </span>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="button"
                                    onClick={() => setPageState('normal')}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-4 py-2 text-xs font-semibold text-[#1D2924] hover:bg-[#F7F6F2]"
                                >
                                    <span>Pilih Periode Lain</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ============================================================== */
                    /* KONDISI 3: STATE LAPORAN NORMAL & AKTIF                         */
                    /* ============================================================== */
                    <div className="space-y-8">
                        {/* HEADER UTAMA & PILIHAN PERIODE */}
                        <header className="flex flex-col justify-between gap-4 border-b border-[#E4E3DC] pb-4 sm:flex-row sm:items-end">
                            <div className="space-y-1">
                                <div className="text-xs font-semibold tracking-wider text-[#2F6B57] uppercase">
                                    Komunitas Taman Sari
                                </div>
                                <h1 className="text-2xl font-bold tracking-tight text-[#1D2924] sm:text-3xl">
                                    Laporan Kas
                                </h1>
                                <p className="text-xs text-[#66736C] sm:text-sm">
                                    Ringkasan keuangan komunitas yang telah
                                    dipublikasikan pengurus secara terbuka.
                                </p>
                            </div>

                            {/* Pilihan Periode Dropdown / Selector */}
                            <div className="flex items-center gap-2">
                                <label className="hidden text-xs text-[#66736C] sm:inline">
                                    Pilih Periode:
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedPeriodKey}
                                        onChange={(e) =>
                                            setSelectedPeriodKey(e.target.value)
                                        }
                                        className="rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-3 py-1.5 text-xs font-semibold text-[#1D2924] shadow-2xs focus:border-[#2F6B57] focus:outline-hidden"
                                    >
                                        <option value="okt-2026">
                                            Oktober 2026 (Bulan Ini)
                                        </option>
                                        <option value="sep-2026">
                                            September 2026
                                        </option>
                                        <option value="ags-2026">
                                            Agustus 2026
                                        </option>
                                        <option value="jul-2026">
                                            Juli 2026
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </header>

                        {/* PENANDA JIKA DATA SEDANG DIPERBARUI */}
                        {pageState === 'updating' && (
                            <div className="flex items-start gap-2.5 rounded-xl border border-[#B87922]/30 bg-[#FAF2E6]/50 p-3.5 text-xs text-[#B87922]">
                                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                                <div>
                                    <span className="font-bold">
                                        Periode Berjalan Sedang Diperbarui:
                                    </span>{' '}
                                    Data transaksi bulan berjalan masih dalam
                                    proses rekonsiliasi oleh bendahara RT 04 dan
                                    belum berstatus laporan final.
                                </div>
                            </div>
                        )}

                        {/* ============================================================== */}
                        {/* 1. SECTION: RINGKASAN SALDO UTAMA                              */}
                        {/* ============================================================== */}
                        <section aria-labelledby="saldo-utama-title">
                            <div className="relative overflow-hidden rounded-2xl border border-[#E4E3DC] bg-[#FFFEFA] p-6 shadow-2xs">
                                <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-[#2F6B57]" />

                                <div className="flex flex-col justify-between gap-4 pl-2 sm:flex-row sm:items-center">
                                    <div className="space-y-1">
                                        <span
                                            id="saldo-utama-title"
                                            className="text-[11px] font-semibold tracking-wider text-[#66736C] uppercase"
                                        >
                                            Saldo Kas Saat Ini
                                        </span>
                                        <div className="text-3xl font-extrabold tracking-tight text-[#1D2924] sm:text-4xl">
                                            {formatRupiah(
                                                currentReport.endingBalance,
                                            )}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#66736C]">
                                            <span>
                                                Diperbarui melalui laporan{' '}
                                                {currentReport.periodName}
                                            </span>
                                            <span>·</span>
                                            <span className="inline-flex items-center gap-1 font-medium text-[#2F6B57]">
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                Dipublikasikan{' '}
                                                {currentReport.publishedDate}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 pt-2 sm:items-end sm:pt-0">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSelectedReportDetail(
                                                    currentReport,
                                                )
                                            }
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#2F6B57] px-4 py-2 text-xs font-semibold text-[#FFFEFA] shadow-xs transition-colors hover:bg-[#245442]"
                                        >
                                            <FileText className="h-4 w-4" />
                                            <span>Buka Buku Laporan Ini</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* 2. SECTION: RINGKASAN PERIODE TERPILIH                         */}
                        {/* ============================================================== */}
                        <section
                            aria-labelledby="ringkasan-periode-title"
                            className="space-y-3"
                        >
                            <div className="flex items-center justify-between">
                                <h2
                                    id="ringkasan-periode-title"
                                    className="text-sm font-bold text-[#1D2924]"
                                >
                                    Ringkasan {currentReport.periodName} (
                                    {currentReport.periodRange})
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                {/* Pemasukan */}
                                <div className="space-y-1 rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-4.5 shadow-2xs">
                                    <div className="flex items-center justify-between text-xs text-[#66736C]">
                                        <span>Total Pemasukan</span>
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EAF4EE] text-[#2F7D5C]">
                                            <ArrowDownRight className="h-3.5 w-3.5" />
                                        </span>
                                    </div>
                                    <div className="text-xl font-bold text-[#2F7D5C]">
                                        +{' '}
                                        {formatRupiah(
                                            currentReport.totalIncome,
                                        )}
                                    </div>
                                    <div className="text-[11px] text-[#66736C]">
                                        Iuran keamanan, kebersihan, & kas sosial
                                    </div>
                                </div>

                                {/* Pengeluaran */}
                                <div className="space-y-1 rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-4.5 shadow-2xs">
                                    <div className="flex items-center justify-between text-xs text-[#66736C]">
                                        <span>Total Pengeluaran</span>
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FAF2E6] text-[#C96D3B]">
                                            <ArrowUpRight className="h-3.5 w-3.5" />
                                        </span>
                                    </div>
                                    <div className="text-xl font-bold text-[#C96D3B]">
                                        -{' '}
                                        {formatRupiah(
                                            currentReport.totalExpense,
                                        )}
                                    </div>
                                    <div className="text-[11px] text-[#66736C]">
                                        Honor pos satpam, truk DLH, & sarana
                                    </div>
                                </div>

                                {/* Perubahan Saldo */}
                                <div className="space-y-1 rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-4.5 shadow-2xs">
                                    <div className="flex items-center justify-between text-xs text-[#66736C]">
                                        <span>Surplus / Perubahan Saldo</span>
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EBF3EF] text-[#2F6B57]">
                                            <TrendingUp className="h-3.5 w-3.5" />
                                        </span>
                                    </div>
                                    <div className="text-xl font-bold text-[#1D2924]">
                                        +{' '}
                                        {formatRupiah(
                                            currentReport.totalIncome -
                                                currentReport.totalExpense,
                                        )}
                                    </div>
                                    <div className="text-[11px] text-[#66736C]">
                                        Saldo awal bulan:{' '}
                                        {formatRupiah(
                                            currentReport.startingBalance,
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* 3. SECTION: GRAFIK RINGKAS (6 BULAN TERAKHIR)                 */}
                        {/* ============================================================== */}
                        <section
                            aria-labelledby="grafik-kas-title"
                            className="space-y-3 rounded-2xl border border-[#E4E3DC] bg-[#FFFEFA] p-5 shadow-2xs sm:p-6"
                        >
                            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                                <div>
                                    <h3
                                        id="grafik-kas-title"
                                        className="text-sm font-bold text-[#1D2924]"
                                    >
                                        Perbandingan Pemasukan & Pengeluaran 6
                                        Bulan Terakhir
                                    </h3>
                                    <p className="text-xs text-[#66736C]">
                                        Menunjukkan konsistensi realisasi
                                        anggaran dan ketertiban kas warga.
                                    </p>
                                </div>

                                {/* Legend Teks */}
                                <div className="flex items-center gap-4 text-xs">
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-3 w-3 rounded-xs bg-[#2F6B57]" />
                                        <span className="text-[#1D2924]">
                                            Pemasukan
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-3 w-3 rounded-xs bg-[#C96D3B]" />
                                        <span className="text-[#1D2924]">
                                            Pengeluaran
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* BAR CHART FLAT SEDERHANA */}
                            <div className="pt-4 pb-2">
                                <div className="grid h-44 grid-cols-6 items-end gap-2 border-b border-[#E4E3DC] pb-2 sm:gap-4">
                                    {SIX_MONTH_BAR_DATA.map((bar, idx) => {
                                        const incomeHeight = `${(bar.income / maxBarValue) * 100}%`;
                                        const expenseHeight = `${(bar.expense / maxBarValue) * 100}%`;
                                        const isHovered =
                                            hoveredBarIndex === idx;

                                        return (
                                            <div
                                                key={bar.month}
                                                onMouseEnter={() =>
                                                    setHoveredBarIndex(idx)
                                                }
                                                onMouseLeave={() =>
                                                    setHoveredBarIndex(null)
                                                }
                                                className="group relative flex h-full cursor-pointer flex-col items-center justify-end"
                                            >
                                                {/* Tooltip Hover */}
                                                {isHovered && (
                                                    <div className="pointer-events-none absolute -top-12 z-20 rounded-lg bg-[#1D2924] px-2.5 py-1 text-[11px] font-medium whitespace-nowrap text-[#FFFEFA] shadow-md">
                                                        <div>{bar.month}</div>
                                                        <div className="text-[#2F7D5C]">
                                                            Masuk:{' '}
                                                            {formatRupiah(
                                                                bar.income,
                                                            )}
                                                        </div>
                                                        <div className="text-[#C96D3B]">
                                                            Keluar:{' '}
                                                            {formatRupiah(
                                                                bar.expense,
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex w-full items-end justify-center gap-1">
                                                    {/* Bar Pemasukan */}
                                                    <div
                                                        style={{
                                                            height: incomeHeight,
                                                        }}
                                                        className="w-3.5 rounded-t-sm bg-[#2F6B57] transition-all group-hover:brightness-110 sm:w-6"
                                                        title={`Pemasukan: ${formatRupiah(bar.income)}`}
                                                    />
                                                    {/* Bar Pengeluaran */}
                                                    <div
                                                        style={{
                                                            height: expenseHeight,
                                                        }}
                                                        className="w-3.5 rounded-t-sm bg-[#C96D3B] transition-all group-hover:brightness-110 sm:w-6"
                                                        title={`Pengeluaran: ${formatRupiah(bar.expense)}`}
                                                    />
                                                </div>

                                                <span className="mt-2 text-[11px] font-medium text-[#66736C]">
                                                    {bar.month}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Alternatif Teks Aksesibilitas di Bawah Chart */}
                                <div className="pt-2 text-[11px] text-[#66736C]">
                                    Rata-rata pemasukan 6 bulan:{' '}
                                    <strong>Rp3.075.000</strong> per bulan ·
                                    Rata-rata pengeluaran operasional:{' '}
                                    <strong>Rp1.787.500</strong> per bulan.
                                </div>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* 4. SECTION: RINCIAN KATEGORI (PENGELUARAN & PEMASUKAN)         */}
                        {/* ============================================================== */}
                        <section
                            aria-labelledby="rincian-kategori-title"
                            className="space-y-4"
                        >
                            <div className="space-y-0.5">
                                <h2
                                    id="rincian-kategori-title"
                                    className="text-base font-bold text-[#1D2924]"
                                >
                                    Rincian Alokasi {currentReport.periodName}
                                </h2>
                                <p className="text-xs text-[#66736C]">
                                    Pengelompokan pos penerimaan dan pos belanja
                                    lingkungan tanpa grafik rumit.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                {/* KOLOM PENGELUARAN */}
                                <div className="space-y-3 rounded-2xl border border-[#E4E3DC] bg-[#FFFEFA] p-5 shadow-2xs">
                                    <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-2.5">
                                        <div className="flex items-center gap-2">
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FAF2E6] text-[#C96D3B]">
                                                <ArrowUpRight className="h-3 w-3" />
                                            </span>
                                            <h3 className="text-xs font-bold tracking-wider text-[#1D2924] uppercase">
                                                Ringkasan Pengeluaran
                                            </h3>
                                        </div>
                                        <span className="text-xs font-bold text-[#C96D3B]">
                                            {formatRupiah(1875000)}
                                        </span>
                                    </div>

                                    <div className="space-y-3 text-xs">
                                        <div className="space-y-1">
                                            <div className="flex justify-between">
                                                <span className="font-semibold text-[#1D2924]">
                                                    Keamanan Lingkungan
                                                </span>
                                                <span className="font-semibold text-[#1D2924]">
                                                    Rp850.000 (45%)
                                                </span>
                                            </div>
                                            <div className="text-[11px] text-[#66736C]">
                                                Honor 2 petugas pos satpam
                                                gerbang
                                            </div>
                                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E4E3DC]">
                                                <div
                                                    className="h-full rounded-full bg-[#C96D3B]"
                                                    style={{ width: '45%' }}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex justify-between">
                                                <span className="font-semibold text-[#1D2924]">
                                                    Kebersihan & Sampah
                                                </span>
                                                <span className="font-semibold text-[#1D2924]">
                                                    Rp425.000 (23%)
                                                </span>
                                            </div>
                                            <div className="text-[11px] text-[#66736C]">
                                                Retribusi resmi armada sampah
                                                DLH
                                            </div>
                                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E4E3DC]">
                                                <div
                                                    className="h-full rounded-full bg-[#C96D3B]"
                                                    style={{ width: '23%' }}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex justify-between">
                                                <span className="font-semibold text-[#1D2924]">
                                                    Perawatan Taman & Fasilitas
                                                </span>
                                                <span className="font-semibold text-[#1D2924]">
                                                    Rp350.000 (19%)
                                                </span>
                                            </div>
                                            <div className="text-[11px] text-[#66736C]">
                                                Lampu penerangan Blok B & pupuk
                                                taman
                                            </div>
                                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E4E3DC]">
                                                <div
                                                    className="h-full rounded-full bg-[#C96D3B]"
                                                    style={{ width: '19%' }}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex justify-between">
                                                <span className="font-semibold text-[#1D2924]">
                                                    Kegiatan Warga
                                                </span>
                                                <span className="font-semibold text-[#1D2924]">
                                                    Rp250.000 (13%)
                                                </span>
                                            </div>
                                            <div className="text-[11px] text-[#66736C]">
                                                Konsumsi koordinasi pengurus &
                                                kerja bakti
                                            </div>
                                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E4E3DC]">
                                                <div
                                                    className="h-full rounded-full bg-[#C96D3B]"
                                                    style={{ width: '13%' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* KOLOM PEMASUKAN */}
                                <div className="space-y-3 rounded-2xl border border-[#E4E3DC] bg-[#FFFEFA] p-5 shadow-2xs">
                                    <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-2.5">
                                        <div className="flex items-center gap-2">
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EAF4EE] text-[#2F7D5C]">
                                                <ArrowDownRight className="h-3 w-3" />
                                            </span>
                                            <h3 className="text-xs font-bold tracking-wider text-[#1D2924] uppercase">
                                                Ringkasan Pemasukan
                                            </h3>
                                        </div>
                                        <span className="text-xs font-bold text-[#2F7D5C]">
                                            {formatRupiah(3250000)}
                                        </span>
                                    </div>

                                    <div className="space-y-3 text-xs">
                                        <div className="space-y-1">
                                            <div className="flex justify-between">
                                                <span className="font-semibold text-[#1D2924]">
                                                    Iuran Keamanan Warga
                                                </span>
                                                <span className="font-semibold text-[#1D2924]">
                                                    Rp1.500.000 (46%)
                                                </span>
                                            </div>
                                            <div className="text-[11px] text-[#66736C]">
                                                Kontribusi iuran rutin keamanan
                                                75 rumah
                                            </div>
                                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E4E3DC]">
                                                <div
                                                    className="h-full rounded-full bg-[#2F6B57]"
                                                    style={{ width: '46%' }}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex justify-between">
                                                <span className="font-semibold text-[#1D2924]">
                                                    Iuran Kebersihan Lingkungan
                                                </span>
                                                <span className="font-semibold text-[#1D2924]">
                                                    Rp1.125.000 (35%)
                                                </span>
                                            </div>
                                            <div className="text-[11px] text-[#66736C]">
                                                Kontribusi iuran rutin
                                                kebersihan 75 rumah
                                            </div>
                                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E4E3DC]">
                                                <div
                                                    className="h-full rounded-full bg-[#2F6B57]"
                                                    style={{ width: '35%' }}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex justify-between">
                                                <span className="font-semibold text-[#1D2924]">
                                                    Kas Sosial Warga
                                                </span>
                                                <span className="font-semibold text-[#1D2924]">
                                                    Rp400.000 (12%)
                                                </span>
                                            </div>
                                            <div className="text-[11px] text-[#66736C]">
                                                Dana santunan darurat & kematian
                                            </div>
                                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E4E3DC]">
                                                <div
                                                    className="h-full rounded-full bg-[#2F6B57]"
                                                    style={{ width: '12%' }}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex justify-between">
                                                <span className="font-semibold text-[#1D2924]">
                                                    Donasi Sukarela Fasilitas
                                                </span>
                                                <span className="font-semibold text-[#1D2924]">
                                                    Rp225.000 (7%)
                                                </span>
                                            </div>
                                            <div className="text-[11px] text-[#66736C]">
                                                Sumbangan warga untuk perbaikan
                                                ayunan balita
                                            </div>
                                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E4E3DC]">
                                                <div
                                                    className="h-full rounded-full bg-[#2F6B57]"
                                                    style={{ width: '7%' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* PRIVACY SHIELD FOOTER */}
                            <div className="flex items-center gap-2.5 rounded-xl border border-[#E4E3DC] bg-[#FAF9F5] p-3.5 text-xs text-[#66736C]">
                                <Shield className="h-4 w-4 shrink-0 text-[#2F6B57]" />
                                <p className="leading-relaxed">
                                    <strong className="text-[#1D2924]">
                                        Kebijakan Privasi Komunitas:
                                    </strong>{' '}
                                    Detail riwayat pembayaran masing-masing
                                    keluarga tidak ditampilkan secara publik
                                    untuk melindungi kenyamanan dan privasi
                                    sesama warga.
                                </p>
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* 5. SECTION: AKTIVITAS KEUANGAN PUBLIK (TRANSAKSI)             */}
                        {/* ============================================================== */}
                        <section
                            aria-labelledby="aktivitas-kas-title"
                            className="space-y-4 border-t border-[#E4E3DC] pt-4"
                        >
                            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                                <div className="space-y-0.5">
                                    <h2
                                        id="aktivitas-kas-title"
                                        className="text-base font-bold text-[#1D2924]"
                                    >
                                        Aktivitas Keuangan Publik
                                    </h2>
                                    <p className="text-xs text-[#66736C]">
                                        Catatan operasional dan rekapitulasi
                                        penerimaan kas yang dapat dilihat
                                        seluruh warga.
                                    </p>
                                </div>

                                {/* Filter Transaksi */}
                                <div className="inline-flex overflow-x-auto rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] p-1 text-xs">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setTransactionFilter('all')
                                        }
                                        className={`rounded px-2.5 py-1 font-medium transition-colors ${
                                            transactionFilter === 'all'
                                                ? 'bg-[#2F6B57] text-[#FFFEFA]'
                                                : 'text-[#66736C] hover:text-[#1D2924]'
                                        }`}
                                    >
                                        Semua Aktivitas
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setTransactionFilter('income')
                                        }
                                        className={`rounded px-2.5 py-1 font-medium transition-colors ${
                                            transactionFilter === 'income'
                                                ? 'bg-[#2F6B57] text-[#FFFEFA]'
                                                : 'text-[#66736C] hover:text-[#1D2924]'
                                        }`}
                                    >
                                        Pemasukan
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setTransactionFilter('expense')
                                        }
                                        className={`rounded px-2.5 py-1 font-medium transition-colors ${
                                            transactionFilter === 'expense'
                                                ? 'bg-[#2F6B57] text-[#FFFEFA]'
                                                : 'text-[#66736C] hover:text-[#1D2924]'
                                        }`}
                                    >
                                        Pengeluaran
                                    </button>
                                </div>
                            </div>

                            {/* List Row Transaksi */}
                            <div className="divide-y divide-[#E4E3DC] rounded-xl border border-[#E4E3DC] bg-[#FFFEFA]">
                                {filteredTransactions.map((trx) => (
                                    <div
                                        key={trx.id}
                                        className="flex flex-col justify-between gap-3 p-4 transition-colors hover:bg-[#FAF9F5] sm:flex-row sm:items-center sm:p-4.5"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="font-mono text-xs text-[#66736C]">
                                                    {trx.date}
                                                </span>
                                                <span className="text-xs text-[#66736C]">
                                                    ·
                                                </span>
                                                <span className="py-0.2 rounded bg-[#F7F6F2] px-2 text-[10px] font-semibold text-[#1D2924]">
                                                    {trx.category}
                                                </span>
                                            </div>
                                            <p className="text-xs font-medium text-[#1D2924]">
                                                {trx.description}
                                            </p>
                                        </div>

                                        <div className="text-left sm:text-right">
                                            <div
                                                className={`text-xs font-bold sm:text-sm ${
                                                    trx.type === 'income'
                                                        ? 'text-[#2F7D5C]'
                                                        : 'text-[#C96D3B]'
                                                }`}
                                            >
                                                {trx.type === 'income'
                                                    ? '+ '
                                                    : '- '}
                                                {formatRupiah(trx.amount)}
                                            </div>
                                            <span className="text-[10px] text-[#66736C]">
                                                {trx.type === 'income'
                                                    ? 'Pemasukan Kas'
                                                    : 'Pengeluaran Lingkungan'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* 6. SECTION: ARSIP LAPORAN BULANAN RESMI                        */}
                        {/* ============================================================== */}
                        <section
                            aria-labelledby="arsip-laporan-title"
                            className="space-y-4 border-t border-[#E4E3DC] pt-4"
                        >
                            <div className="space-y-0.5">
                                <h2
                                    id="arsip-laporan-title"
                                    className="text-base font-bold text-[#1D2924]"
                                >
                                    Arsip Laporan Bulanan
                                </h2>
                                <p className="text-xs text-[#66736C]">
                                    Laporan pembukuan yang telah disetujui Ketua
                                    RT dan dipublikasikan resmi.
                                </p>
                            </div>

                            <div className="divide-y divide-[#E4E3DC] rounded-xl border border-[#E4E3DC] bg-[#FFFEFA]">
                                {MONTHLY_REPORTS.map((rep) => (
                                    <div
                                        key={rep.id}
                                        className="flex flex-col justify-between gap-3 p-4 transition-colors hover:bg-[#FAF9F5] sm:flex-row sm:items-center sm:p-4.5"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-[#1D2924]">
                                                    {rep.periodName}
                                                </span>
                                                <span className="py-0.2 inline-flex items-center gap-1 rounded bg-[#EAF4EE] px-2 text-[10px] font-semibold text-[#2F7D5C]">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    Dipublikasikan
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2 text-xs text-[#66736C]">
                                                <span>
                                                    Dipublikasikan pada{' '}
                                                    {rep.publishedDate}
                                                </span>
                                                <span>·</span>
                                                <span>
                                                    Saldo Akhir:{' '}
                                                    <strong className="text-[#1D2924]">
                                                        {formatRupiah(
                                                            rep.endingBalance,
                                                        )}
                                                    </strong>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedReportDetail(rep)
                                                }
                                                className="rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] px-3.5 py-1.5 text-xs font-semibold text-[#1D2924] transition-colors hover:bg-[#E4E3DC]"
                                            >
                                                Lihat Ringkasan
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    alert(
                                                        `Laporan PDF resmi ${rep.periodName} berhasil diunduh ke perangkat Anda.`,
                                                    );
                                                }}
                                                className="inline-flex items-center gap-1 rounded-lg border border-[#2F6B57] bg-[#EBF3EF] px-3 py-1.5 text-xs font-semibold text-[#2F6B57] transition-colors hover:bg-[#2F6B57] hover:text-[#FFFEFA]"
                                                title="Unduh berkas PDF"
                                            >
                                                <Download className="h-3.5 w-3.5" />
                                                <span className="hidden sm:inline">
                                                    Unduh PDF
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}
            </div>

            {/* ============================================================== */}
            {/* MODAL: DETAIL LAPORAN BULANAN LENGKAP                          */}
            {/* ============================================================== */}
            {selectedReportDetail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D2924]/40 p-4 backdrop-blur-xs">
                    <div className="max-h-[92vh] w-full max-w-xl animate-in space-y-5 overflow-y-auto rounded-2xl border border-[#E4E3DC] bg-[#FFFEFA] p-6 shadow-xl duration-150 zoom-in-95">
                        {/* Header Modal */}
                        <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-3">
                            <button
                                type="button"
                                onClick={() => setSelectedReportDetail(null)}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#66736C] hover:text-[#1D2924]"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span>Kembali</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setSelectedReportDetail(null)}
                                className="rounded p-1 text-[#66736C] hover:text-[#1D2924]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Top Info */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-semibold tracking-wider text-[#2F6B57] uppercase">
                                    Laporan Bulanan Resmi
                                </span>
                                <span className="py-0.2 inline-flex items-center gap-1 rounded bg-[#EAF4EE] px-2 text-[10px] font-semibold text-[#2F7D5C]">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Dipublikasikan
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-[#1D2924]">
                                Laporan Kas {selectedReportDetail.periodName}
                            </h3>
                            <p className="text-xs text-[#66736C]">
                                Rekapitulasi keuangan per{' '}
                                {selectedReportDetail.periodRange} ·
                                Dipublikasikan{' '}
                                {selectedReportDetail.publishedDate}
                            </p>
                        </div>

                        {/* RINGKASAN REKAPITULASI ANGKA */}
                        <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                            <div className="space-y-0.5 rounded-xl border border-[#E4E3DC] bg-[#FAF9F5] p-3">
                                <span className="text-[10px] text-[#66736C]">
                                    Saldo Awal
                                </span>
                                <div className="font-bold text-[#1D2924]">
                                    {formatRupiah(
                                        selectedReportDetail.startingBalance,
                                    )}
                                </div>
                            </div>
                            <div className="space-y-0.5 rounded-xl border border-[#E4E3DC] bg-[#EAF4EE] p-3">
                                <span className="text-[10px] text-[#2F7D5C]">
                                    Pemasukan
                                </span>
                                <div className="font-bold text-[#2F7D5C]">
                                    +
                                    {formatRupiah(
                                        selectedReportDetail.totalIncome,
                                    )}
                                </div>
                            </div>
                            <div className="space-y-0.5 rounded-xl border border-[#E4E3DC] bg-[#FAF2E6] p-3">
                                <span className="text-[10px] text-[#C96D3B]">
                                    Pengeluaran
                                </span>
                                <div className="font-bold text-[#C96D3B]">
                                    -
                                    {formatRupiah(
                                        selectedReportDetail.totalExpense,
                                    )}
                                </div>
                            </div>
                            <div className="space-y-0.5 rounded-xl border border-[#E4E3DC] bg-[#F7F6F2] p-3">
                                <span className="text-[10px] text-[#66736C]">
                                    Saldo Akhir
                                </span>
                                <div className="font-bold text-[#1D2924]">
                                    {formatRupiah(
                                        selectedReportDetail.endingBalance,
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* CATATAN BENDAHARA */}
                        {selectedReportDetail.treasurerNote && (
                            <div className="space-y-1.5 rounded-xl border border-[#E4E3DC] bg-[#FAF9F5] p-4 text-xs">
                                <span className="font-bold text-[#1D2924]">
                                    Catatan Pengurus / Bendahara:
                                </span>
                                <p className="leading-relaxed text-[#66736C] italic">
                                    "{selectedReportDetail.treasurerNote}"
                                </p>
                            </div>
                        )}

                        {/* PENGESAHAN DOKUMEN */}
                        <div className="space-y-2 rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-4 text-xs">
                            <span className="font-bold text-[#1D2924]">
                                Pengesahan Laporan:
                            </span>
                            <div className="grid grid-cols-1 gap-3 pt-1 text-[11px] sm:grid-cols-2">
                                <div className="space-y-0.5">
                                    <div className="text-[#66736C]">
                                        Diterbitkan oleh:
                                    </div>
                                    <div className="font-semibold text-[#1D2924]">
                                        Ibu Dewi Anggraeni
                                    </div>
                                    <div className="text-[#66736C]">
                                        Bendahara Komunitas RT 04
                                    </div>
                                </div>
                                <div className="space-y-0.5">
                                    <div className="text-[#66736C]">
                                        Disetujui oleh:
                                    </div>
                                    <div className="font-semibold text-[#1D2924]">
                                        Bpk. Hendra Gunawan
                                    </div>
                                    <div className="text-[#66736C]">
                                        Ketua RT 04 Sukamaju
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FOOTER ACTIONS */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E4E3DC] pt-3">
                            <span className="text-[11px] text-[#66736C]">
                                Dokumen buku kas terverifikasi sistem
                                KomunitasHub.
                            </span>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => window.print()}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-3.5 py-2 text-xs font-semibold text-[#1D2924] hover:bg-[#F7F6F2]"
                                >
                                    <Printer className="h-3.5 w-3.5" />
                                    <span>Cetak</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        alert(
                                            `Laporan PDF resmi ${selectedReportDetail.periodName} berhasil diunduh.`,
                                        );
                                    }}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#2F6B57] px-4 py-2 text-xs font-semibold text-[#FFFEFA] shadow-xs hover:bg-[#245442]"
                                >
                                    <Download className="h-3.5 w-3.5" />
                                    <span>Unduh PDF</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </CitizenLayout>
    );
}
