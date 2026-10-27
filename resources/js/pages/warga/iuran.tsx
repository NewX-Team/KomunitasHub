import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import CitizenLayout from '@/layouts/citizen-layout';
import {
    Receipt,
    Clock,
    CheckCircle2,
    AlertCircle,
    ArrowLeft,
    Copy,
    Check,
    X,
    QrCode,
    UploadCloud,
    FileText,
    Download,
    MessageSquare,
    ChevronRight,
    Building2,
    Calendar,
    Send,
} from 'lucide-react';

interface BillItem {
    id: string;
    title: string;
    category: 'Keamanan' | 'Kebersihan' | 'Sosial' | 'Fasilitas' | 'Acara';
    period: string;
    description: string;
    amount: number;
    dueDate: string;
    dueTimestamp: string;
    status:
        | 'unpaid'
        | 'near_due'
        | 'overdue'
        | 'verifying'
        | 'paid'
        | 'rejected';
    overdueDays?: number;
    paidDate?: string;
    paymentMethod?: string;
    proofSubmittedAt?: string;
    proofFileName?: string;
    rejectionReason?: string;
    house: string;
    createdBy: string;
    createdAt: string;
}

const INITIAL_ACTIVE_BILLS: BillItem[] = [
    {
        id: 'bill-1',
        title: 'Iuran Kas Sosial Warga',
        category: 'Sosial',
        period: 'September 2026',
        description:
            'Dana santunan warga sakit, duka cita, dan bantuan sosial darurat RT 04.',
        amount: 10000,
        dueDate: '15 Oktober 2026',
        dueTimestamp: '2026-10-15',
        status: 'overdue',
        overdueDays: 12,
        house: 'Blok A-12',
        createdBy: 'Bendahara RT 04',
        createdAt: '1 September 2026',
    },
    {
        id: 'bill-2',
        title: 'Iuran Keamanan Lingkungan',
        category: 'Keamanan',
        period: 'Oktober 2026',
        description:
            'Kontribusi operasional 2 petugas satpam pos jaga dan ronda malam bulanan.',
        amount: 20000,
        dueDate: '10 November 2026',
        dueTimestamp: '2026-11-10',
        status: 'near_due',
        house: 'Blok A-12',
        createdBy: 'Bendahara RT 04',
        createdAt: '1 Oktober 2026',
    },
    {
        id: 'bill-3',
        title: 'Iuran Kebersihan & Sampah',
        category: 'Kebersihan',
        period: 'Oktober 2026',
        description:
            'Pengangkutan armada sampah DLH 3 kali seminggu dan perawatan TPS lingkungan.',
        amount: 15000,
        dueDate: '10 November 2026',
        dueTimestamp: '2026-11-10',
        status: 'verifying',
        proofSubmittedAt: '7 Oktober 2026, 14.32 WIB',
        proofFileName: 'bukti_transfer_mandiri_okt.jpg',
        paymentMethod: 'Transfer Bank Mandiri',
        house: 'Blok A-12',
        createdBy: 'Bendahara RT 04',
        createdAt: '1 Oktober 2026',
    },
    {
        id: 'bill-4',
        title: 'Perbaikan Taman Bermain Anak',
        category: 'Fasilitas',
        period: 'Sekali bayar',
        description:
            'Penggantian rantai ayunan rusak dan pengecatan ulang arena bermain balita di RT 04.',
        amount: 50000,
        dueDate: '20 November 2026',
        dueTimestamp: '2026-11-20',
        status: 'unpaid',
        house: 'Blok A-12',
        createdBy: 'Pengurus Komunitas',
        createdAt: '5 Oktober 2026',
    },
];

const INITIAL_HISTORY_BILLS: BillItem[] = [
    {
        id: 'hist-1',
        title: 'Iuran Kebersihan & Sampah',
        category: 'Kebersihan',
        period: 'Oktober 2026',
        description: 'Pengangkutan armada sampah DLH 3 kali seminggu.',
        amount: 15000,
        dueDate: '10 November 2026',
        dueTimestamp: '2026-11-10',
        status: 'verifying',
        proofSubmittedAt: '7 Oktober 2026, 14.32 WIB',
        proofFileName: 'bukti_transfer_mandiri_okt.jpg',
        paymentMethod: 'Transfer Bank Mandiri',
        house: 'Blok A-12',
        createdBy: 'Bendahara RT 04',
        createdAt: '1 Oktober 2026',
    },
    {
        id: 'hist-2',
        title: 'Iuran Keamanan Lingkungan',
        category: 'Keamanan',
        period: 'September 2026',
        description: 'Honor pos satpam bulan September.',
        amount: 20000,
        dueDate: '10 September 2026',
        dueTimestamp: '2026-09-10',
        status: 'paid',
        paidDate: '5 September 2026',
        paymentMethod: 'BCA Virtual Account',
        house: 'Blok A-12',
        createdBy: 'Bendahara RT 04',
        createdAt: '1 September 2026',
    },
    {
        id: 'hist-3',
        title: 'Iuran Kebersihan & Sampah',
        category: 'Kebersihan',
        period: 'September 2026',
        description: 'Armada sampah dinas DLH.',
        amount: 15000,
        dueDate: '10 September 2026',
        dueTimestamp: '2026-09-10',
        status: 'paid',
        paidDate: '5 September 2026',
        paymentMethod: 'Transfer Bank Mandiri',
        house: 'Blok A-12',
        createdBy: 'Bendahara RT 04',
        createdAt: '1 September 2026',
    },
    {
        id: 'hist-4',
        title: 'Perbaikan Pintu Gerbang Utama',
        category: 'Fasilitas',
        period: 'Sekali bayar',
        description: 'Penggantian engsel hidrolik gerbang otomatis pos satpam.',
        amount: 35000,
        dueDate: '25 Agustus 2026',
        dueTimestamp: '2026-08-25',
        status: 'paid',
        paidDate: '18 Agustus 2026',
        paymentMethod: 'QRIS Komunitas',
        house: 'Blok A-12',
        createdBy: 'Pengurus Komunitas',
        createdAt: '10 Agustus 2026',
    },
    {
        id: 'hist-5',
        title: 'Iuran Acara HUT RI ke-81',
        category: 'Acara',
        period: 'Sekali bayar',
        description:
            'Panggung gembira warga, lomba anak-anak, dan tasyakuran kemerdekaan.',
        amount: 50000,
        dueDate: '31 Juli 2026',
        dueTimestamp: '2026-07-31',
        status: 'paid',
        paidDate: '28 Juli 2026',
        paymentMethod: 'Transfer Bank Mandiri',
        house: 'Blok A-12',
        createdBy: 'Panitia 17 Agustus',
        createdAt: '15 Juli 2026',
    },
    {
        id: 'hist-6',
        title: 'Iuran Kas Sosial Warga',
        category: 'Sosial',
        period: 'Juni 2026',
        description: 'Dana sosial bantuan keluarga warga.',
        amount: 20000,
        dueDate: '20 Juni 2026',
        dueTimestamp: '2026-06-20',
        status: 'rejected',
        rejectionReason:
            'Nominal transfer pada struk Rp15.000, kurang dari tagihan Rp20.000. Mohon lengkapi kekurangan.',
        proofSubmittedAt: '12 Juni 2026, 09.15 WIB',
        proofFileName: 'struk_atm_bca_juni.jpg',
        paymentMethod: 'Transfer Bank Manual',
        house: 'Blok A-12',
        createdBy: 'Bendahara RT 04',
        createdAt: '1 Juni 2026',
    },
];

export default function IuranIndex() {
    // Community Mode Simulator
    const [communityMode, setCommunityMode] = useState<
        'Cluster Aman' | 'RT Mandiri'
    >('Cluster Aman');

    // Simulation switch for active bills state: 'normal' (4 bills), 'all_paid' (0 bills), 'has_rejected'
    const [activeBillsScenario, setActiveBillsScenario] = useState<
        'normal' | 'all_paid' | 'has_rejected'
    >('normal');

    // History filter: 'all' | 'paid' | 'verifying' | 'rejected'
    const [historyFilter, setHistoryFilter] = useState<
        'all' | 'paid' | 'verifying' | 'rejected'
    >('all');

    // Detail Modal / Sub-view State
    const [selectedBill, setSelectedBill] = useState<BillItem | null>(null);

    // Payment Flow Modals
    const [isPaymentMethodModalOpen, setIsPaymentMethodModalOpen] =
        useState(false);
    const [isAutoPaymentModalOpen, setIsAutoPaymentModalOpen] = useState(false);
    const [isManualPaymentModalOpen, setIsManualPaymentModalOpen] =
        useState(false);
    const [autoPaymentTab, setAutoPaymentTab] = useState<'qris' | 'va'>('qris');
    const [selectedVaBank, setSelectedVaBank] = useState<
        'BCA' | 'Mandiri' | 'BRI' | 'BNI'
    >('BCA');
    const [autoPaymentSuccess, setAutoPaymentSuccess] = useState(false);

    // Manual Upload Form State
    const [manualUploadFile, setManualUploadFile] = useState<{
        name: string;
        size: string;
    } | null>(null);
    const [manualNotes, setManualNotes] = useState('');
    const [manualUploadSuccess, setManualUploadSuccess] = useState(false);

    // Proof Preview Modal
    const [isPreviewProofModalOpen, setIsPreviewProofModalOpen] =
        useState(false);

    // WhatsApp Message Modal
    const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);

    // Clipboard Copy Helper
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    const handleCopy = (text: string, key: string) => {
        if (navigator.clipboard) {
            void navigator.clipboard.writeText(text);
            setCopiedKey(key);
            setTimeout(() => setCopiedKey(null), 2000);
        }
    };

    // Calculate Active Bills based on scenario
    const activeBills: BillItem[] = React.useMemo(() => {
        if (activeBillsScenario === 'all_paid') {
            return [];
        }
        if (activeBillsScenario === 'has_rejected') {
            return [
                {
                    id: 'bill-rejected',
                    title: 'Iuran Kas Sosial Warga',
                    category: 'Sosial',
                    period: 'September 2026',
                    description: 'Dana santunan warga sakit dan darurat RT 04.',
                    amount: 20000,
                    dueDate: '15 Oktober 2026',
                    dueTimestamp: '2026-10-15',
                    status: 'rejected',
                    rejectionReason:
                        'Nominal transfer pada struk Rp15.000, kurang dari ketetapan tagihan Rp20.000. Mohon lengkapi kekurangan.',
                    proofSubmittedAt: '16 Oktober 2026, 11.20 WIB',
                    proofFileName: 'struk_atm_sept.jpg',
                    house: 'Blok A-12',
                    createdBy: 'Bendahara RT 04',
                    createdAt: '1 September 2026',
                },
                ...INITIAL_ACTIVE_BILLS.slice(1),
            ];
        }
        return INITIAL_ACTIVE_BILLS;
    }, [activeBillsScenario]);

    // Format Rupiah
    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Filter History
    const filteredHistory = React.useMemo(() => {
        if (historyFilter === 'all') return INITIAL_HISTORY_BILLS;
        return INITIAL_HISTORY_BILLS.filter(
            (item) => item.status === historyFilter,
        );
    }, [historyFilter]);

    // Total active bills amount (excluding rejected or already verifying if needed, but summing all unpaid obligations)
    const totalActiveAmount = activeBills
        .filter((b) => b.status !== 'verifying')
        .reduce((sum, item) => sum + item.amount, 0);

    const activeBillsCount = activeBills.filter(
        (b) => b.status !== 'verifying',
    ).length;

    // Helper for initiating payment
    const handleStartPayment = (bill: BillItem) => {
        setSelectedBill(bill);
        setIsPaymentMethodModalOpen(true);
    };

    // Helper for WhatsApp prefilled message
    const getWhatsAppMessage = (bill: BillItem) => {
        return `Halo Pak/Bu Bendahara Komunitas Taman Sari, saya dari Rumah Blok A-12 telah membayar ${bill.title} (${bill.period}) sebesar ${formatRupiah(bill.amount)}. Bukti pembayaran sudah saya unggah di KomunitasHub. Terima kasih.`;
    };

    return (
        <CitizenLayout
            title="Iuran & Pembayaran"
            communityMode={communityMode}
            onModeChange={setCommunityMode}
            activeNav="iuran"
        >
            <Head title="Iuran & Pembayaran — KomunitasHub" />

            <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                {/* SIMULASI TOOLBAR UNTUK PENGUJIAN DESAIN */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-3 text-xs shadow-2xs">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#1D2924]">
                            Mode Simulasi:
                        </span>
                        <div className="inline-flex rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] p-0.5">
                            <button
                                type="button"
                                onClick={() => setActiveBillsScenario('normal')}
                                className={`rounded px-2.5 py-1 font-medium transition-colors ${
                                    activeBillsScenario === 'normal'
                                        ? 'bg-[#2F6B57] text-[#FFFEFA]'
                                        : 'text-[#66736C] hover:text-[#1D2924]'
                                }`}
                            >
                                Tagihan Aktif (Normal)
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    setActiveBillsScenario('has_rejected')
                                }
                                className={`rounded px-2.5 py-1 font-medium transition-colors ${
                                    activeBillsScenario === 'has_rejected'
                                        ? 'bg-[#B74E44] text-[#FFFEFA]'
                                        : 'text-[#66736C] hover:text-[#1D2924]'
                                }`}
                            >
                                Ada Bukti Ditolak
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    setActiveBillsScenario('all_paid')
                                }
                                className={`rounded px-2.5 py-1 font-medium transition-colors ${
                                    activeBillsScenario === 'all_paid'
                                        ? 'bg-[#2F7D5C] text-[#FFFEFA]'
                                        : 'text-[#66736C] hover:text-[#1D2924]'
                                }`}
                            >
                                Semua Lunas (Kosong)
                            </button>
                        </div>
                    </div>

                    <div className="text-[11px] text-[#66736C]">
                        Rumah Terdaftar:{' '}
                        <strong className="text-[#1D2924]">
                            Blok A-12 (Keluarga Pratama)
                        </strong>
                    </div>
                </div>

                {/* BREADCRUMB DESKTOP RINGKAS */}
                <div className="hidden items-center gap-2 text-xs text-[#66736C] md:flex">
                    <Link
                        href="/dashboard"
                        className="hover:text-[#1D2924] hover:underline"
                    >
                        Ringkasan
                    </Link>
                    <span>/</span>
                    <span className="font-semibold text-[#1D2924]">
                        Iuran & Pembayaran
                    </span>
                </div>

                {/* HEADER KONTEN */}
                <header className="flex flex-col justify-between gap-3 border-b border-[#E4E3DC] pb-4 sm:flex-row sm:items-end">
                    <div className="space-y-1">
                        <div className="text-xs font-semibold tracking-wider text-[#2F6B57] uppercase">
                            Komunitas Taman Sari · Blok A-12
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#1D2924] sm:text-3xl">
                            Iuran Rumah
                        </h1>
                        <p className="text-xs text-[#66736C] sm:text-sm">
                            Pantau dan selesaikan kewajiban iuran lingkungan
                            keluarga Anda secara tertib dan transparan.
                        </p>
                    </div>

                    <div className="flex w-fit items-center gap-2 rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-3 py-1.5 text-xs text-[#66736C]">
                        <Calendar className="h-3.5 w-3.5 text-[#2F6B57]" />
                        <span>Periode Berjalan: Oktober 2026</span>
                    </div>
                </header>

                {/* ============================================================== */}
                {/* 1. SECTION: TAGIHAN AKTIF (PERLU DIBAYAR)                      */}
                {/* ============================================================== */}
                <section
                    aria-labelledby="tagihan-aktif-title"
                    className="space-y-4"
                >
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <h2
                                id="tagihan-aktif-title"
                                className="text-base font-bold text-[#1D2924]"
                            >
                                Perlu Dibayar
                            </h2>
                            <p className="text-xs text-[#66736C]">
                                Tagihan iuran yang memerlukan penyelesaian atau
                                konfirmasi bukti transfer.
                            </p>
                        </div>
                    </div>

                    {/* RINGKASAN TOTAL TAGIHAN AKTIF (JIKA ADA > 1 TAGIHAN AKTIF) */}
                    {activeBills.length > 0 && activeBillsCount > 0 && (
                        <div className="flex flex-col justify-between gap-4 rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-4 shadow-2xs sm:flex-row sm:items-center sm:p-5">
                            <div className="space-y-1">
                                <span className="text-[11px] font-semibold tracking-wider text-[#66736C] uppercase">
                                    Total Tagihan Aktif
                                </span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-[#1D2924] sm:text-3xl">
                                        {formatRupiah(totalActiveAmount)}
                                    </span>
                                    <span className="text-xs text-[#66736C]">
                                        dari {activeBillsCount} tagihan
                                    </span>
                                </div>
                                <p className="text-[11px] text-[#66736C]">
                                    Pembayaran dilakukan per tagihan untuk
                                    memastikan rekonsiliasi kas RT tetap akurat.
                                </p>
                            </div>

                            <div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        // Auto pick highest priority bill to pay
                                        const urgentBill =
                                            activeBills.find(
                                                (b) => b.status === 'overdue',
                                            ) ||
                                            activeBills.find(
                                                (b) => b.status === 'near_due',
                                            ) ||
                                            activeBills[0];
                                        if (urgentBill)
                                            handleStartPayment(urgentBill);
                                    }}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#2F6B57] px-5 py-2.5 text-xs font-semibold text-[#FFFEFA] shadow-xs transition-colors hover:bg-[#245442] sm:w-auto"
                                >
                                    <Receipt className="h-4 w-4" />
                                    <span>Bayar Tagihan Terdekat</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* DAFTAR TAGIHAN SEBAGAI LIST ROW INFORMATIF */}
                    {activeBills.length > 0 ? (
                        <div className="space-y-2.5">
                            {activeBills.map((bill) => {
                                const isOverdue = bill.status === 'overdue';
                                const isVerifying = bill.status === 'verifying';
                                const isRejected = bill.status === 'rejected';

                                return (
                                    <div
                                        key={bill.id}
                                        className={`relative overflow-hidden rounded-xl border bg-[#FFFEFA] p-4 shadow-2xs transition-all hover:border-[#2F6B57]/50 sm:p-5 ${
                                            isOverdue
                                                ? 'border-[#B74E44]/40 bg-[#FFF9F9]'
                                                : isRejected
                                                  ? 'border-[#B87922]/40 bg-[#FAF9F5]'
                                                  : isVerifying
                                                    ? 'border-[#E4E3DC] bg-[#FAF9F5]'
                                                    : 'border-[#E4E3DC]'
                                        }`}
                                    >
                                        {/* Left Status Bar */}
                                        <div
                                            className={`absolute top-0 bottom-0 left-0 w-1.5 ${
                                                isOverdue
                                                    ? 'bg-[#B74E44]'
                                                    : isRejected
                                                      ? 'bg-[#C96D3B]'
                                                      : isVerifying
                                                        ? 'bg-[#2F6B57]'
                                                        : 'bg-[#B87922]'
                                            }`}
                                        />

                                        <div className="flex flex-col justify-between gap-4 pl-2 sm:flex-row sm:items-center">
                                            {/* Info Tagihan */}
                                            <div className="space-y-1.5 sm:max-w-md md:max-w-xl">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="rounded bg-[#F7F6F2] px-2 py-0.5 text-[10px] font-semibold text-[#1D2924]">
                                                        {bill.category}
                                                    </span>
                                                    <span className="text-xs text-[#66736C]">
                                                        ·
                                                    </span>
                                                    <span className="text-xs font-medium text-[#66736C]">
                                                        {bill.period}
                                                    </span>

                                                    {/* Status Badge */}
                                                    {isOverdue && (
                                                        <span className="inline-flex items-center gap-1 rounded bg-[#FBEBE9] px-2 py-0.5 text-[11px] font-semibold text-[#B74E44]">
                                                            <AlertCircle className="h-3 w-3" />
                                                            Terlambat{' '}
                                                            {bill.overdueDays}{' '}
                                                            hari
                                                        </span>
                                                    )}
                                                    {isRejected && (
                                                        <span className="inline-flex items-center gap-1 rounded bg-[#FAF2E6] px-2 py-0.5 text-[11px] font-semibold text-[#B87922]">
                                                            <AlertCircle className="h-3 w-3" />
                                                            Perlu Perbaikan
                                                            Bukti
                                                        </span>
                                                    )}
                                                    {isVerifying && (
                                                        <span className="inline-flex items-center gap-1 rounded bg-[#EBF3EF] px-2 py-0.5 text-[11px] font-semibold text-[#2F6B57]">
                                                            <Clock className="h-3 w-3" />
                                                            Menunggu Verifikasi
                                                        </span>
                                                    )}
                                                    {bill.status ===
                                                        'near_due' && (
                                                        <span className="inline-flex items-center gap-1 rounded bg-[#FAF2E6] px-2 py-0.5 text-[11px] font-semibold text-[#B87922]">
                                                            <Clock className="h-3 w-3" />
                                                            Jatuh Tempo Dekat
                                                        </span>
                                                    )}
                                                    {bill.status ===
                                                        'unpaid' && (
                                                        <span className="inline-flex items-center gap-1 rounded bg-[#F7F6F2] px-2 py-0.5 text-[11px] font-medium text-[#66736C]">
                                                            Belum Dibayar
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 className="text-sm font-bold text-[#1D2924] sm:text-base">
                                                    {bill.title}
                                                </h3>

                                                <p className="line-clamp-1 text-xs text-[#66736C]">
                                                    {bill.description}
                                                </p>

                                                <div className="flex items-center gap-2 pt-0.5 text-[11px] text-[#66736C]">
                                                    <span>Jatuh tempo:</span>
                                                    <span
                                                        className={`font-semibold ${isOverdue ? 'text-[#B74E44]' : 'text-[#1D2924]'}`}
                                                    >
                                                        {bill.dueDate}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Nominal & Tombol Aksi */}
                                            <div className="flex flex-row items-center justify-between border-t border-[#E4E3DC] pt-3 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
                                                <div className="text-left sm:text-right">
                                                    <span className="text-[10px] text-[#66736C] sm:block">
                                                        Nominal Tagihan
                                                    </span>
                                                    <div className="text-lg font-bold text-[#1D2924] sm:text-xl">
                                                        {formatRupiah(
                                                            bill.amount,
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedBill(
                                                                bill,
                                                            )
                                                        }
                                                        className="rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] px-3 py-1.5 text-xs font-semibold text-[#1D2924] transition-colors hover:bg-[#E4E3DC]"
                                                    >
                                                        Lihat Rincian
                                                    </button>

                                                    {!isVerifying && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleStartPayment(
                                                                    bill,
                                                                )
                                                            }
                                                            className={`rounded-lg px-4 py-1.5 text-xs font-semibold text-[#FFFEFA] shadow-xs transition-colors ${
                                                                isOverdue
                                                                    ? 'bg-[#B74E44] hover:bg-[#9B3E36]'
                                                                    : 'bg-[#2F6B57] hover:bg-[#245442]'
                                                            }`}
                                                        >
                                                            Bayar Sekarang
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* EMPTY STATE JIKA SEMUA TAGIHAN SUDAH LUNAS */
                        <div className="space-y-3 rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-8 text-center sm:p-12">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#2F7D5C]/30 bg-[#EAF4EE] text-[#2F7D5C]">
                                <CheckCircle2 className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-base font-bold text-[#1D2924]">
                                    Tidak ada iuran yang perlu dibayar
                                </h3>
                                <p className="mx-auto max-w-sm text-xs text-[#66736C] sm:text-sm">
                                    Semua kewajiban iuran keluarga Anda saat ini
                                    sudah tercatat dengan baik oleh pengurus
                                    komunitas.
                                </p>
                            </div>
                            <div className="pt-2">
                                <a
                                    href="#riwayat-pembayaran"
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] px-4 py-2 text-xs font-semibold text-[#1D2924] transition-colors hover:bg-[#E4E3DC]"
                                >
                                    <span>Lihat Riwayat Pembayaran</span>
                                    <ChevronRight className="h-3.5 w-3.5" />
                                </a>
                            </div>
                        </div>
                    )}
                </section>

                {/* ============================================================== */}
                {/* 2. SECTION: RIWAYAT PEMBAYARAN                                 */}
                {/* ============================================================== */}
                <section
                    id="riwayat-pembayaran"
                    aria-labelledby="riwayat-title"
                    className="space-y-4 border-t border-[#E4E3DC] pt-4"
                >
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div className="space-y-0.5">
                            <h2
                                id="riwayat-title"
                                className="text-base font-bold text-[#1D2924]"
                            >
                                Riwayat Pembayaran
                            </h2>
                            <p className="text-xs text-[#66736C]">
                                Catatan pelunasan iuran dan status verifikasi
                                bukti transfer sebelumnya.
                            </p>
                        </div>

                        {/* Filter Tabs */}
                        <div className="inline-flex overflow-x-auto rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] p-1 text-xs">
                            <button
                                type="button"
                                onClick={() => setHistoryFilter('all')}
                                className={`rounded px-2.5 py-1 font-medium transition-colors ${
                                    historyFilter === 'all'
                                        ? 'bg-[#2F6B57] text-[#FFFEFA]'
                                        : 'text-[#66736C] hover:text-[#1D2924]'
                                }`}
                            >
                                Semua
                            </button>
                            <button
                                type="button"
                                onClick={() => setHistoryFilter('paid')}
                                className={`rounded px-2.5 py-1 font-medium transition-colors ${
                                    historyFilter === 'paid'
                                        ? 'bg-[#2F6B57] text-[#FFFEFA]'
                                        : 'text-[#66736C] hover:text-[#1D2924]'
                                }`}
                            >
                                Lunas
                            </button>
                            <button
                                type="button"
                                onClick={() => setHistoryFilter('verifying')}
                                className={`rounded px-2.5 py-1 font-medium transition-colors ${
                                    historyFilter === 'verifying'
                                        ? 'bg-[#2F6B57] text-[#FFFEFA]'
                                        : 'text-[#66736C] hover:text-[#1D2924]'
                                }`}
                            >
                                Menunggu Verifikasi
                            </button>
                            <button
                                type="button"
                                onClick={() => setHistoryFilter('rejected')}
                                className={`rounded px-2.5 py-1 font-medium transition-colors ${
                                    historyFilter === 'rejected'
                                        ? 'bg-[#2F6B57] text-[#FFFEFA]'
                                        : 'text-[#66736C] hover:text-[#1D2924]'
                                }`}
                            >
                                Perlu Perbaikan
                            </button>
                        </div>
                    </div>

                    {/* Table-less Responsive List for Mobile & Desktop */}
                    <div className="divide-y divide-[#E4E3DC] rounded-xl border border-[#E4E3DC] bg-[#FFFEFA]">
                        {filteredHistory.length > 0 ? (
                            filteredHistory.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col justify-between gap-3 p-4 transition-colors hover:bg-[#FAF9F5] sm:flex-row sm:items-center sm:p-4.5"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold text-[#1D2924]">
                                                {item.title}
                                            </span>
                                            <span className="text-[11px] text-[#66736C]">
                                                · {item.period}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#66736C]">
                                            {item.paidDate ? (
                                                <span>
                                                    Lunas pada {item.paidDate} (
                                                    {item.paymentMethod})
                                                </span>
                                            ) : item.proofSubmittedAt ? (
                                                <span>
                                                    Bukti dikirim{' '}
                                                    {item.proofSubmittedAt}
                                                </span>
                                            ) : (
                                                <span>
                                                    Batas {item.dueDate}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                                        <div className="text-right">
                                            <div className="text-xs font-bold text-[#1D2924] sm:text-sm">
                                                {formatRupiah(item.amount)}
                                            </div>
                                            <div className="mt-0.5">
                                                {item.status === 'paid' && (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2F7D5C]">
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        Lunas
                                                    </span>
                                                )}
                                                {item.status ===
                                                    'verifying' && (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#B87922]">
                                                        <Clock className="h-3 w-3" />
                                                        Menunggu Verifikasi
                                                    </span>
                                                )}
                                                {item.status === 'rejected' && (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#B74E44]">
                                                        <AlertCircle className="h-3 w-3" />
                                                        Perlu Perbaikan
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSelectedBill(item)
                                            }
                                            className="rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] px-3 py-1.5 text-xs font-semibold text-[#1D2924] transition-colors hover:bg-[#E4E3DC]"
                                        >
                                            Detail
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-xs text-[#66736C]">
                                Tidak ada data riwayat pembayaran untuk filter
                                ini.
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* ============================================================== */}
            {/* MODAL / SUB-VIEW: DETAIL TAGIHAN                               */}
            {/* ============================================================== */}
            {selectedBill && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D2924]/40 p-4 backdrop-blur-xs">
                    <div className="max-h-[92vh] w-full max-w-lg animate-in space-y-5 overflow-y-auto rounded-2xl border border-[#E4E3DC] bg-[#FFFEFA] p-6 shadow-lg duration-150 zoom-in-95">
                        {/* Header Detail */}
                        <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-3">
                            <button
                                type="button"
                                onClick={() => setSelectedBill(null)}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#66736C] hover:text-[#1D2924]"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span>Kembali</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setSelectedBill(null)}
                                className="rounded p-1 text-[#66736C] hover:text-[#1D2924]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Top Info & Nominal */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="rounded bg-[#F7F6F2] px-2 py-0.5 text-[11px] font-semibold text-[#1D2924]">
                                    {selectedBill.category}
                                </span>
                                <span className="text-xs text-[#66736C]">
                                    · Periode {selectedBill.period}
                                </span>

                                {selectedBill.status === 'paid' && (
                                    <span className="inline-flex items-center gap-1 rounded bg-[#EAF4EE] px-2 py-0.5 text-[11px] font-semibold text-[#2F7D5C]">
                                        <CheckCircle2 className="h-3 w-3" />
                                        Lunas
                                    </span>
                                )}
                                {selectedBill.status === 'overdue' && (
                                    <span className="inline-flex items-center gap-1 rounded bg-[#FBEBE9] px-2 py-0.5 text-[11px] font-semibold text-[#B74E44]">
                                        <AlertCircle className="h-3 w-3" />
                                        Terlambat
                                    </span>
                                )}
                                {selectedBill.status === 'verifying' && (
                                    <span className="inline-flex items-center gap-1 rounded bg-[#EBF3EF] px-2 py-0.5 text-[11px] font-semibold text-[#2F6B57]">
                                        <Clock className="h-3 w-3" />
                                        Menunggu Verifikasi
                                    </span>
                                )}
                                {selectedBill.status === 'rejected' && (
                                    <span className="inline-flex items-center gap-1 rounded bg-[#FAF2E6] px-2 py-0.5 text-[11px] font-semibold text-[#B87922]">
                                        <AlertCircle className="h-3 w-3" />
                                        Perlu Perbaikan
                                    </span>
                                )}
                            </div>

                            <h3 className="text-xl font-bold text-[#1D2924]">
                                {selectedBill.title}
                            </h3>

                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-extrabold text-[#1D2924]">
                                    {formatRupiah(selectedBill.amount)}
                                </span>
                            </div>

                            <p className="rounded-lg border border-[#E4E3DC] bg-[#FAF9F5] p-3 text-xs leading-relaxed text-[#66736C]">
                                {selectedBill.description}
                            </p>
                        </div>

                        {/* Rincian Metadata */}
                        <div className="space-y-2 text-xs">
                            <span className="font-semibold text-[#1D2924]">
                                Rincian Penetapan:
                            </span>
                            <div className="divide-y divide-[#E4E3DC] rounded-xl border border-[#E4E3DC] bg-[#FFFEFA]">
                                <div className="flex justify-between p-3">
                                    <span className="text-[#66736C]">
                                        Kategori Iuran
                                    </span>
                                    <span className="font-semibold text-[#1D2924]">
                                        {selectedBill.category}
                                    </span>
                                </div>
                                <div className="flex justify-between p-3">
                                    <span className="text-[#66736C]">
                                        Rumah & Keluarga
                                    </span>
                                    <span className="font-semibold text-[#1D2924]">
                                        Blok A-12 (Keluarga Pratama)
                                    </span>
                                </div>
                                <div className="flex justify-between p-3">
                                    <span className="text-[#66736C]">
                                        Batas Jatuh Tempo
                                    </span>
                                    <span className="font-semibold text-[#1D2924]">
                                        {selectedBill.dueDate}
                                    </span>
                                </div>
                                <div className="flex justify-between p-3">
                                    <span className="text-[#66736C]">
                                        Diterbitkan Oleh
                                    </span>
                                    <span className="font-semibold text-[#1D2924]">
                                        {selectedBill.createdBy}
                                    </span>
                                </div>
                                <div className="flex justify-between p-3">
                                    <span className="text-[#66736C]">
                                        Tanggal Terbit
                                    </span>
                                    <span className="font-semibold text-[#1D2924]">
                                        {selectedBill.createdAt}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Contextual Status Alerts & Actions */}
                        {selectedBill.status === 'overdue' && (
                            <div className="rounded-xl border border-[#B74E44]/30 bg-[#FFF7F6] p-4 text-xs leading-relaxed text-[#B74E44]">
                                <span className="font-bold">Informasi:</span>{' '}
                                Tagihan ini telah melewati jatuh tempo. Silakan
                                selesaikan pembayaran untuk membantu pencatatan
                                kas komunitas tetap tertib. Tidak ada denda yang
                                dibebankan.
                            </div>
                        )}

                        {selectedBill.status === 'rejected' && (
                            <div className="space-y-3 rounded-xl border border-[#B74E44]/30 bg-[#FFF7F6] p-4 text-xs">
                                <div className="flex items-center gap-1.5 font-bold text-[#B74E44]">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>
                                        Bukti Pembayaran Perlu Diperiksa Kembali
                                    </span>
                                </div>
                                <p className="text-[#1D2924]">
                                    Catatan bendahara:{' '}
                                    <em className="text-[#B74E44]">
                                        "{selectedBill.rejectionReason}"
                                    </em>
                                </p>
                                <div className="flex items-center justify-between rounded border border-[#E4E3DC] bg-[#FFFEFA] p-2">
                                    <span className="text-[11px] text-[#66736C]">
                                        {selectedBill.proofFileName ||
                                            'bukti_transfer.jpg'}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsPreviewProofModalOpen(true)
                                        }
                                        className="text-[11px] font-semibold text-[#2F6B57] hover:underline"
                                    >
                                        Lihat Bukti Lama
                                    </button>
                                </div>
                                <div className="flex gap-2 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsManualPaymentModalOpen(true);
                                        }}
                                        className="flex-1 rounded-lg bg-[#2F6B57] py-2 font-semibold text-[#FFFEFA] transition-colors hover:bg-[#245442]"
                                    >
                                        Unggah Bukti Baru
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsWhatsAppModalOpen(true)
                                        }
                                        className="rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-3 py-2 font-semibold text-[#1D2924] hover:bg-[#F7F6F2]"
                                    >
                                        Kirim WhatsApp
                                    </button>
                                </div>
                            </div>
                        )}

                        {selectedBill.status === 'verifying' && (
                            <div className="space-y-3 rounded-xl border border-[#2F6B57]/30 bg-[#EBF3EF]/40 p-4 text-xs">
                                <div className="flex items-center gap-1.5 font-bold text-[#2F6B57]">
                                    <Clock className="h-4 w-4" />
                                    <span>
                                        Bukti Pembayaran Sedang Diverifikasi
                                    </span>
                                </div>
                                <p className="text-[#66736C]">
                                    Bukti pembayaran telah dikirim pada{' '}
                                    {selectedBill.proofSubmittedAt ||
                                        '7 Oktober 2026, 14.32 WIB'}
                                    . Bendahara RT akan memeriksa mutasi bank
                                    dan memperbarui status menjadi Lunas.
                                </p>
                                <div className="flex gap-2 pt-1">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsPreviewProofModalOpen(true)
                                        }
                                        className="flex-1 rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] py-2 font-semibold text-[#1D2924] hover:bg-[#F7F6F2]"
                                    >
                                        Lihat Bukti yang Dikirim
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsWhatsAppModalOpen(true)
                                        }
                                        className="rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-3 py-2 font-semibold text-[#1D2924] hover:bg-[#F7F6F2]"
                                    >
                                        Kirim WhatsApp
                                    </button>
                                </div>
                            </div>
                        )}

                        {selectedBill.status === 'paid' && (
                            <div className="space-y-3 rounded-xl border border-[#2F7D5C]/30 bg-[#EAF4EE]/40 p-4 text-xs">
                                <div className="flex items-center gap-1.5 font-bold text-[#2F7D5C]">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>Pembayaran Lunas</span>
                                </div>
                                <p className="text-[#66736C]">
                                    Lunas pada {selectedBill.paidDate} melalui{' '}
                                    {selectedBill.paymentMethod}. Transaksi
                                    tercatat resmi di buku kas komunitas RT 04.
                                </p>
                                <div className="pt-1">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            alert(
                                                'Placeholder: Bukti kwitansi resmi RT 04 Sukamaju berhasil diunduh dalam format PDF.',
                                            );
                                        }}
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-4 py-2 text-xs font-semibold text-[#1D2924] hover:bg-[#F7F6F2]"
                                    >
                                        <Download className="h-3.5 w-3.5 text-[#2F6B57]" />
                                        <span>
                                            Unduh Bukti Pembayaran (PDF)
                                        </span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Action CTA for unpaid / overdue */}
                        {(selectedBill.status === 'unpaid' ||
                            selectedBill.status === 'near_due' ||
                            selectedBill.status === 'overdue') && (
                            <div className="border-t border-[#E4E3DC] pt-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsPaymentMethodModalOpen(true);
                                    }}
                                    className="w-full rounded-lg bg-[#2F6B57] py-2.5 text-xs font-semibold text-[#FFFEFA] shadow-xs transition-colors hover:bg-[#245442]"
                                >
                                    Pilih Metode Pembayaran
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ============================================================== */}
            {/* MODAL 2: PILIH METODE PEMBAYARAN (DUA OPSI SETARA)            */}
            {/* ============================================================== */}
            {isPaymentMethodModalOpen && selectedBill && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D2924]/40 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-md animate-in space-y-5 rounded-2xl border border-[#E4E3DC] bg-[#FFFEFA] p-6 shadow-lg duration-150 zoom-in-95">
                        <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-3">
                            <div className="space-y-0.5">
                                <h3 className="text-base font-bold text-[#1D2924]">
                                    Pilih Metode Pembayaran
                                </h3>
                                <p className="text-xs text-[#66736C]">
                                    Pilih cara pembayaran yang paling nyaman
                                    untuk Anda.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    setIsPaymentMethodModalOpen(false)
                                }
                                className="rounded p-1 text-[#66736C] hover:text-[#1D2924]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Ringkasan Tagihan */}
                        <div className="flex items-center justify-between rounded-xl border border-[#E4E3DC] bg-[#F7F6F2] p-3 text-xs">
                            <div>
                                <span className="text-[#66736C]">
                                    {selectedBill.title}
                                </span>
                                <div className="font-semibold text-[#1D2924]">
                                    {selectedBill.period}
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-[#66736C]">Total</span>
                                <div className="text-sm font-bold text-[#1D2924]">
                                    {formatRupiah(selectedBill.amount)}
                                </div>
                            </div>
                        </div>

                        {/* Dua Opsi Setara */}
                        <div className="space-y-3">
                            {/* OPSI 1: OTOMATIS */}
                            <button
                                type="button"
                                onClick={() => {
                                    setIsPaymentMethodModalOpen(false);
                                    setIsAutoPaymentModalOpen(true);
                                    setAutoPaymentSuccess(false);
                                }}
                                className="group flex w-full items-start justify-between rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-4 text-left transition-all hover:border-[#2F6B57] hover:bg-[#FAF9F5]"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EBF3EF] text-[#2F6B57] transition-transform group-hover:scale-105">
                                        <QrCode className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-[#1D2924]">
                                                QRIS atau Virtual Account
                                            </span>
                                            <span className="rounded bg-[#EBF3EF] px-1.5 py-0.5 text-[9px] font-bold text-[#2F6B57]">
                                                Otomatis
                                            </span>
                                        </div>
                                        <p className="text-[11px] leading-snug text-[#66736C]">
                                            Status pembayaran akan tercatat
                                            otomatis tanpa perlu mengirim bukti
                                            manual.
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[#66736C] group-hover:text-[#2F6B57]" />
                            </button>

                            {/* OPSI 2: MANUAL */}
                            <button
                                type="button"
                                onClick={() => {
                                    setIsPaymentMethodModalOpen(false);
                                    setIsManualPaymentModalOpen(true);
                                    setManualUploadSuccess(false);
                                }}
                                className="group flex w-full items-start justify-between rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-4 text-left transition-all hover:border-[#2F6B57] hover:bg-[#FAF9F5]"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FAF2E6] text-[#B87922] transition-transform group-hover:scale-105">
                                        <Building2 className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-[#1D2924]">
                                                Transfer dan Unggah Bukti
                                            </span>
                                            <span className="rounded bg-[#FAF2E6] px-1.5 py-0.5 text-[9px] font-bold text-[#B87922]">
                                                Perlu Verifikasi
                                            </span>
                                        </div>
                                        <p className="text-[11px] leading-snug text-[#66736C]">
                                            Transfer ke rekening kas RT dan
                                            kirim struk/tangkapan layar untuk
                                            dicatat bendahara.
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[#66736C] group-hover:text-[#2F6B57]" />
                            </button>
                        </div>

                        <div className="flex justify-end border-t border-[#E4E3DC] pt-2">
                            <button
                                type="button"
                                onClick={() =>
                                    setIsPaymentMethodModalOpen(false)
                                }
                                className="text-xs font-medium text-[#66736C] hover:text-[#1D2924]"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================================== */}
            {/* MODAL 3: FLOW PEMBAYARAN OTOMATIS (MOCK QRIS & VA)             */}
            {/* ============================================================== */}
            {isAutoPaymentModalOpen && selectedBill && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D2924]/40 p-4 backdrop-blur-xs">
                    <div className="max-h-[92vh] w-full max-w-md animate-in space-y-4 overflow-y-auto rounded-2xl border border-[#E4E3DC] bg-[#FFFEFA] p-6 shadow-lg duration-150 zoom-in-95">
                        <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-3">
                            <div className="space-y-0.5">
                                <h3 className="text-base font-bold text-[#1D2924]">
                                    Pembayaran Otomatis
                                </h3>
                                <p className="text-xs text-[#66736C]">
                                    {selectedBill.title} ·{' '}
                                    {formatRupiah(selectedBill.amount)}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsAutoPaymentModalOpen(false)}
                                className="rounded p-1 text-[#66736C] hover:text-[#1D2924]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {autoPaymentSuccess ? (
                            /* STATE PAYMENT SUKSES */
                            <div className="space-y-3 py-6 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF4EE] text-[#2F7D5C]">
                                    <Check className="h-7 w-7 stroke-[2.5]" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-base font-bold text-[#1D2924]">
                                        Pembayaran Berhasil Tercatat
                                    </h4>
                                    <p className="text-xs text-[#66736C]">
                                        {selectedBill.title} (
                                        {selectedBill.period}) sebesar{' '}
                                        <strong>
                                            {formatRupiah(selectedBill.amount)}
                                        </strong>{' '}
                                        telah lunas dan diverifikasi otomatis.
                                    </p>
                                </div>
                                <div className="space-y-1 rounded-xl border border-[#E4E3DC] bg-[#F7F6F2] p-3 text-left text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-[#66736C]">
                                            Metode
                                        </span>
                                        <span className="font-semibold text-[#1D2924]">
                                            {autoPaymentTab === 'qris'
                                                ? 'QRIS Nasional'
                                                : `${selectedVaBank} Virtual Account`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#66736C]">
                                            Waktu
                                        </span>
                                        <span className="font-semibold text-[#1D2924]">
                                            27 Oktober 2026, 21.15 WIB
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#66736C]">
                                            Nomor Transaksi
                                        </span>
                                        <span className="font-mono text-[#1D2924]">
                                            TRX-82910-OKT
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsAutoPaymentModalOpen(false);
                                            setSelectedBill(null);
                                        }}
                                        className="w-full rounded-lg bg-[#2F6B57] py-2 text-xs font-semibold text-[#FFFEFA] hover:bg-[#245442]"
                                    >
                                        Kembali ke Iuran
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between rounded-lg border border-[#E4E3DC] bg-[#FAF9F5] p-2.5 text-xs">
                                    <span className="text-[#66736C]">
                                        Batas waktu bayar:
                                    </span>
                                    <span className="font-semibold text-[#1D2924]">
                                        27 Okt 2026, 23.59 WIB
                                    </span>
                                </div>

                                {/* Switch Tabs: QRIS vs VA */}
                                <div className="grid grid-cols-2 gap-1 rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] p-1 text-xs font-semibold">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setAutoPaymentTab('qris')
                                        }
                                        className={`rounded py-1.5 transition-colors ${
                                            autoPaymentTab === 'qris'
                                                ? 'bg-[#FFFEFA] text-[#1D2924] shadow-xs'
                                                : 'text-[#66736C] hover:text-[#1D2924]'
                                        }`}
                                    >
                                        QRIS
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAutoPaymentTab('va')}
                                        className={`rounded py-1.5 transition-colors ${
                                            autoPaymentTab === 'va'
                                                ? 'bg-[#FFFEFA] text-[#1D2924] shadow-xs'
                                                : 'text-[#66736C] hover:text-[#1D2924]'
                                        }`}
                                    >
                                        Virtual Account
                                    </button>
                                </div>

                                {/* TAB 1: QRIS */}
                                {autoPaymentTab === 'qris' && (
                                    <div className="space-y-3 text-center">
                                        <div className="mx-auto inline-block rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-4 shadow-2xs">
                                            <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-2 text-[10px] text-[#66736C]">
                                                <span>
                                                    QRIS STANDAR NASIONAL
                                                </span>
                                                <span className="font-semibold text-[#2F6B57]">
                                                    RT 04 Sukamaju
                                                </span>
                                            </div>
                                            <div className="py-3">
                                                <QrCode className="mx-auto h-44 w-44 text-[#1D2924]" />
                                            </div>
                                            <div className="text-xs font-bold text-[#1D2924]">
                                                {formatRupiah(
                                                    selectedBill.amount,
                                                )}
                                            </div>
                                            <div className="text-[10px] text-[#66736C]">
                                                NMID: ID102938472918
                                            </div>
                                        </div>

                                        <p className="mx-auto max-w-xs text-xs text-[#66736C]">
                                            Buka aplikasi BCA Mobile, Livin,
                                            GoPay, OVO, atau ShopeePay, lalu
                                            arahkan kamera ke kode QR di atas.
                                        </p>
                                    </div>
                                )}

                                {/* TAB 2: VIRTUAL ACCOUNT */}
                                {autoPaymentTab === 'va' && (
                                    <div className="space-y-3 text-xs">
                                        <label className="font-semibold text-[#1D2924]">
                                            Pilih Bank:
                                        </label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {(
                                                [
                                                    'BCA',
                                                    'Mandiri',
                                                    'BRI',
                                                    'BNI',
                                                ] as const
                                            ).map((bank) => (
                                                <button
                                                    key={bank}
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedVaBank(bank)
                                                    }
                                                    className={`rounded-lg border py-2 text-center text-xs font-bold transition-colors ${
                                                        selectedVaBank === bank
                                                            ? 'border-[#2F6B57] bg-[#EBF3EF] text-[#2F6B57]'
                                                            : 'border-[#E4E3DC] bg-[#FFFEFA] text-[#66736C] hover:text-[#1D2924]'
                                                    }`}
                                                >
                                                    {bank}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="space-y-1 rounded-xl border border-[#E4E3DC] bg-[#F7F6F2] p-3.5">
                                            <span className="text-[11px] text-[#66736C]">
                                                Nomor Virtual Account{' '}
                                                {selectedVaBank}:
                                            </span>
                                            <div className="flex items-center justify-between">
                                                <span className="font-mono text-base font-bold text-[#1D2924]">
                                                    8809 0812 3456 7890
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleCopy(
                                                            '8809081234567890',
                                                            'va',
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-1 rounded border border-[#E4E3DC] bg-[#FFFEFA] px-2.5 py-1 text-xs font-semibold text-[#1D2924] hover:bg-[#F7F6F2]"
                                                >
                                                    {copiedKey === 'va' ? (
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
                                            <div className="pt-1 text-[11px] text-[#66736C]">
                                                Nama Akun:{' '}
                                                <strong>
                                                    KomunitasHub -{' '}
                                                    {selectedBill.title}
                                                </strong>
                                            </div>
                                        </div>

                                        <div className="space-y-1 rounded-lg border border-[#E4E3DC] bg-[#FAF9F5] p-3 text-[11px] text-[#66736C]">
                                            <div className="font-semibold text-[#1D2924]">
                                                Petunjuk Pembayaran:
                                            </div>
                                            <ol className="list-decimal space-y-0.5 pl-4 leading-relaxed">
                                                <li>
                                                    Pilih menu Transfer &gt;
                                                    Virtual Account pada
                                                    m-banking Anda.
                                                </li>
                                                <li>
                                                    Masukkan kode VA di atas dan
                                                    pastikan nominal sesuai
                                                    tagihan.
                                                </li>
                                                <li>
                                                    Konfirmasi pembayaran hingga
                                                    status berhasil.
                                                </li>
                                            </ol>
                                        </div>
                                    </div>
                                )}

                                {/* Tombol Konfirmasi Simulasi */}
                                <div className="space-y-2 border-t border-[#E4E3DC] pt-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setAutoPaymentSuccess(true)
                                        }
                                        className="w-full rounded-lg bg-[#2F6B57] py-2.5 text-xs font-semibold text-[#FFFEFA] shadow-xs transition-colors hover:bg-[#245442]"
                                    >
                                        Saya Sudah Membayar
                                    </button>
                                    <p className="text-center text-[11px] text-[#66736C]">
                                        Status akan diperbarui otomatis setelah
                                        transaksi diterima sistem perbankan.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ============================================================== */}
            {/* MODAL 4: FLOW PEMBAYARAN MANUAL (TRANSFER & UPLOAD BUKTI)       */}
            {/* ============================================================== */}
            {isManualPaymentModalOpen && selectedBill && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D2924]/40 p-4 backdrop-blur-xs">
                    <div className="max-h-[92vh] w-full max-w-md animate-in space-y-4 overflow-y-auto rounded-2xl border border-[#E4E3DC] bg-[#FFFEFA] p-6 shadow-lg duration-150 zoom-in-95">
                        <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-3">
                            <div className="space-y-0.5">
                                <h3 className="text-base font-bold text-[#1D2924]">
                                    Transfer Bank Manual
                                </h3>
                                <p className="text-xs text-[#66736C]">
                                    Kirim bukti pembayaran untuk diperiksa oleh
                                    bendahara.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    setIsManualPaymentModalOpen(false)
                                }
                                className="rounded p-1 text-[#66736C] hover:text-[#1D2924]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {manualUploadSuccess ? (
                            /* STATE SETELAH UPLOAD BERHASIL */
                            <div className="space-y-3 py-6 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EBF3EF] text-[#2F6B57]">
                                    <Check className="h-7 w-7 stroke-[2.5]" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-base font-bold text-[#1D2924]">
                                        Bukti Pembayaran Terkirim
                                    </h4>
                                    <p className="mx-auto max-w-xs text-xs leading-relaxed text-[#66736C]">
                                        Bukti transfer {selectedBill.title}{' '}
                                        telah diterima pada 27 Oktober 2026,
                                        21.20 WIB. Bendahara akan mencocokkan
                                        mutasi kas dalam 1x24 jam.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsManualPaymentModalOpen(false);
                                            setSelectedBill(null);
                                        }}
                                        className="w-full rounded-lg bg-[#2F6B57] py-2 text-xs font-semibold text-[#FFFEFA] hover:bg-[#245442]"
                                    >
                                        Kembali ke Iuran
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsManualPaymentModalOpen(false);
                                            setIsWhatsAppModalOpen(true);
                                        }}
                                        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] py-2 text-xs font-semibold text-[#1D2924] hover:bg-[#F7F6F2]"
                                    >
                                        <MessageSquare className="h-3.5 w-3.5 text-[#2F6B57]" />
                                        <span>
                                            Kirim Notifikasi via WhatsApp
                                        </span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (!manualUploadFile) {
                                        // Pick dummy file if none selected
                                        setManualUploadFile({
                                            name: 'struk_transfer_mandiri_okt.jpg',
                                            size: '240 KB',
                                        });
                                    }
                                    setManualUploadSuccess(true);
                                }}
                                className="space-y-4 text-xs"
                            >
                                {/* Info Rekening Tujuan Kas RT */}
                                <div className="space-y-2 rounded-xl border border-[#E4E3DC] bg-[#FAF9F5] p-3.5">
                                    <div className="flex items-center justify-between text-[11px] text-[#66736C]">
                                        <span>Rekening Resmi Komunitas:</span>
                                        <span className="font-semibold text-[#2F6B57]">
                                            Bank Mandiri
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] p-2.5">
                                        <div>
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
                                                handleCopy(
                                                    '1370019283741',
                                                    'mandiri',
                                                )
                                            }
                                            className="inline-flex items-center gap-1 rounded border border-[#E4E3DC] bg-[#F7F6F2] px-2.5 py-1 text-xs font-semibold text-[#1D2924] hover:bg-[#E4E3DC]"
                                        >
                                            {copiedKey === 'mandiri' ? (
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
                                    <p className="text-[11px] leading-snug text-[#66736C]">
                                        Transfer tepat{' '}
                                        <strong>
                                            {formatRupiah(selectedBill.amount)}
                                        </strong>{' '}
                                        agar pembayaran lebih mudah diverifikasi
                                        bendahara.
                                    </p>
                                </div>

                                {/* Drag and Drop / Upload Area */}
                                <div className="space-y-1.5">
                                    <label className="font-semibold text-[#1D2924]">
                                        Unggah Foto / Berkas Bukti Transfer:
                                    </label>

                                    {manualUploadFile ? (
                                        <div className="flex items-center justify-between rounded-xl border border-[#2F6B57] bg-[#EBF3EF]/50 p-3">
                                            <div className="flex items-center gap-2.5 overflow-hidden">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#FFFEFA] text-[#2F6B57]">
                                                    <FileText className="h-4 w-4" />
                                                </div>
                                                <div className="truncate">
                                                    <div className="truncate text-xs font-semibold text-[#1D2924]">
                                                        {manualUploadFile.name}
                                                    </div>
                                                    <div className="text-[10px] text-[#66736C]">
                                                        {manualUploadFile.size}{' '}
                                                        · Siap dikirim
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setManualUploadFile(null)
                                                }
                                                className="rounded p-1 text-[#66736C] hover:text-[#B74E44]"
                                                title="Hapus file"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#E4E3DC] bg-[#FAF9F5] p-5 text-center transition-colors hover:border-[#2F6B57] hover:bg-[#F7F6F2]">
                                            <UploadCloud className="mb-1 h-8 w-8 text-[#66736C]" />
                                            <div className="text-xs font-semibold text-[#1D2924]">
                                                Klik untuk memilih berkas atau
                                                tarik ke sini
                                            </div>
                                            <div className="mt-0.5 text-[11px] text-[#66736C]">
                                                Mendukung format JPG, PNG, atau
                                                PDF (maks. 5MB)
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*,application/pdf"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file =
                                                        e.target.files?.[0];
                                                    if (file) {
                                                        setManualUploadFile({
                                                            name: file.name,
                                                            size: `${(file.size / 1024).toFixed(0)} KB`,
                                                        });
                                                    }
                                                }}
                                            />
                                        </label>
                                    )}
                                </div>

                                {/* Catatan Opsional untuk Bendahara */}
                                <div className="space-y-1">
                                    <label className="font-semibold text-[#1D2924]">
                                        Catatan untuk Bendahara (Opsional):
                                    </label>
                                    <input
                                        type="text"
                                        value={manualNotes}
                                        onChange={(e) =>
                                            setManualNotes(e.target.value)
                                        }
                                        placeholder="Contoh: Ditransfer dari rekening BCA a.n. Budi Pratama"
                                        className="w-full rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-3 py-2 text-xs text-[#1D2924] focus:border-[#2F6B57] focus:outline-hidden"
                                    />
                                </div>

                                <div className="flex justify-end gap-2 border-t border-[#E4E3DC] pt-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsManualPaymentModalOpen(false)
                                        }
                                        className="rounded-lg px-4 py-2 font-medium text-[#66736C] hover:text-[#1D2924]"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex items-center gap-1.5 rounded-lg bg-[#2F6B57] px-5 py-2 font-semibold text-[#FFFEFA] shadow-xs transition-colors hover:bg-[#245442]"
                                    >
                                        <Send className="h-3.5 w-3.5" />
                                        <span>Kirim Bukti Pembayaran</span>
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* ============================================================== */}
            {/* MODAL 5: PREVIEW BUKTI PEMBAYARAN TERSIMPAN                    */}
            {/* ============================================================== */}
            {isPreviewProofModalOpen && selectedBill && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D2924]/40 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-sm animate-in space-y-4 rounded-2xl border border-[#E4E3DC] bg-[#FFFEFA] p-5 text-center shadow-lg duration-150 zoom-in-95">
                        <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-2">
                            <span className="text-[11px] font-semibold text-[#66736C]">
                                Bukti Transfer Warga
                            </span>
                            <button
                                type="button"
                                onClick={() =>
                                    setIsPreviewProofModalOpen(false)
                                }
                                className="rounded p-1 text-[#66736C] hover:text-[#1D2924]"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Struk Card Mock */}
                        <div className="space-y-3 rounded-xl border border-[#E4E3DC] bg-[#FAF9F5] p-5 text-left font-mono text-xs">
                            <div className="border-b border-dashed border-[#E4E3DC] pb-2 text-center font-sans">
                                <div className="font-bold text-[#1D2924]">
                                    STRUK TRANSFER BANK
                                </div>
                                <div className="text-[10px] text-[#66736C]">
                                    BERHASIL DIPROSES
                                </div>
                            </div>

                            <div className="space-y-1 text-[11px]">
                                <div className="flex justify-between">
                                    <span className="text-[#66736C]">
                                        Tanggal:
                                    </span>
                                    <span className="text-[#1D2924]">
                                        07/10/2026 14:32
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#66736C]">
                                        Penerima:
                                    </span>
                                    <span className="text-[#1D2924]">
                                        KAS RT 04 SUKAMAJU
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#66736C]">
                                        Rek Tujuan:
                                    </span>
                                    <span className="text-[#1D2924]">
                                        1370019283741
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#66736C]">
                                        Pengirim:
                                    </span>
                                    <span className="text-[#1D2924]">
                                        BUDI PRATAMA
                                    </span>
                                </div>
                                <div className="flex justify-between border-t border-dashed border-[#E4E3DC] pt-1 font-sans font-bold">
                                    <span>JUMLAH:</span>
                                    <span>
                                        {formatRupiah(selectedBill.amount)}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-1 text-center font-sans text-[10px] text-[#66736C]">
                                File:{' '}
                                {selectedBill.proofFileName ||
                                    'bukti_transfer.jpg'}
                            </div>
                        </div>

                        <div className="pt-1">
                            <button
                                type="button"
                                onClick={() =>
                                    setIsPreviewProofModalOpen(false)
                                }
                                className="w-full rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] py-2 text-xs font-semibold text-[#1D2924] hover:bg-[#E4E3DC]"
                            >
                                Tutup Pratinjau
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================================== */}
            {/* MODAL 6: PREVIEW PESAN WHATSAPP UNTUK BENDAHARA                 */}
            {/* ============================================================== */}
            {isWhatsAppModalOpen && selectedBill && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D2924]/40 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-md animate-in space-y-4 rounded-2xl border border-[#E4E3DC] bg-[#FFFEFA] p-6 shadow-lg duration-150 zoom-in-95">
                        <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-3">
                            <div className="space-y-0.5">
                                <h3 className="text-base font-bold text-[#1D2924]">
                                    Kirim Pesan ke Bendahara
                                </h3>
                                <p className="text-xs text-[#66736C]">
                                    Pratinjau pesan resmi untuk konfirmasi
                                    pembayaran iuran.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsWhatsAppModalOpen(false)}
                                className="rounded p-1 text-[#66736C] hover:text-[#1D2924]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-2 rounded-xl border border-[#E4E3DC] bg-[#FAF9F5] p-4 text-xs">
                            <span className="text-[11px] font-semibold tracking-wider text-[#2F6B57] uppercase">
                                Teks yang akan dikirim:
                            </span>
                            <p className="rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] p-3 leading-relaxed text-[#1D2924] italic">
                                "{getWhatsAppMessage(selectedBill)}"
                            </p>
                            <p className="text-[11px] text-[#66736C]">
                                Pesan akan terbuka langsung di aplikasi WhatsApp
                                Anda dengan teks yang sudah terisi.
                            </p>
                        </div>

                        <div className="flex justify-end gap-2 border-t border-[#E4E3DC] pt-2 text-xs">
                            <button
                                type="button"
                                onClick={() => setIsWhatsAppModalOpen(false)}
                                className="rounded-lg px-4 py-2 font-medium text-[#66736C] hover:text-[#1D2924]"
                            >
                                Batal
                            </button>
                            <a
                                href={`https://wa.me/6281234567890?text=${encodeURIComponent(getWhatsAppMessage(selectedBill))}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setIsWhatsAppModalOpen(false)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#2F6B57] px-4 py-2 font-semibold text-[#FFFEFA] transition-colors hover:bg-[#245442]"
                            >
                                <MessageSquare className="h-4 w-4" />
                                <span>Buka WhatsApp</span>
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </CitizenLayout>
    );
}
