import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import CitizenLayout from '@/layouts/citizen-layout';
import {
    QrCode,
    Clock,
    CheckCircle2,
    AlertCircle,
    XCircle,
    ArrowLeft,
    Share2,
    X,
    Check,
    Plus,
    ChevronRight,
    MessageSquare,
    Info,
    Home,
} from 'lucide-react';

interface GuestPassItem {
    id: string;
    code: string;
    guestName: string;
    category: 'Kurir' | 'Tamu Pribadi' | 'Teknisi' | 'Keluarga';
    phoneNumber?: string;
    validDuration: '2 jam' | '6 jam' | 'Sampai akhir hari';
    validUntilTime: string;
    validUntilDate: string;
    createdAtTime: string;
    createdAtDate: string;
    notes?: string;
    status: 'active' | 'used' | 'expired' | 'cancelled';
    destinationHouse: string;
    usedAt?: string;
    cancelledAt?: string;
}

const INITIAL_GUEST_PASSES: GuestPassItem[] = [
    {
        id: 'pass-1',
        code: 'PASS-8291-KMRT',
        guestName: 'Andi Wijaya',
        category: 'Teknisi',
        phoneNumber: '0812-3456-7890',
        validDuration: '6 jam',
        validUntilTime: '16.00 WIB',
        validUntilDate: '27 Oktober 2026',
        createdAtTime: '10.00 WIB',
        createdAtDate: '27 Oktober 2026',
        notes: 'Membawa perlengkapan tangga dan perkakas servis AC ruang tamu.',
        status: 'active',
        destinationHouse: 'Blok A-12',
    },
    {
        id: 'pass-2',
        code: 'PASS-7104-JNEK',
        guestName: 'Kurir JNE Express',
        category: 'Kurir',
        phoneNumber: '0857-9912-3344',
        validDuration: '2 jam',
        validUntilTime: '15.00 WIB',
        validUntilDate: '26 Oktober 2026',
        createdAtTime: '14.20 WIB',
        createdAtDate: '26 Oktober 2026',
        notes: 'Pengantaran paket ukuran sedang.',
        status: 'used',
        destinationHouse: 'Blok A-12',
        usedAt: '26 Oktober 2026, 14.28 WIB',
    },
    {
        id: 'pass-3',
        code: 'PASS-6420-KLGA',
        guestName: 'Siti Aminah & Keluarga',
        category: 'Keluarga',
        validDuration: 'Sampai akhir hari',
        validUntilTime: '23.59 WIB',
        validUntilDate: '24 Oktober 2026',
        createdAtTime: '09.00 WIB',
        createdAtDate: '24 Oktober 2026',
        notes: 'Silaturahmi keluarga akhir pekan.',
        status: 'expired',
        destinationHouse: 'Blok A-12',
    },
    {
        id: 'pass-4',
        code: 'PASS-5190-PRBD',
        guestName: 'Rudi Hermawan',
        category: 'Tamu Pribadi',
        phoneNumber: '0813-8822-1100',
        validDuration: '2 jam',
        validUntilTime: '17.00 WIB',
        validUntilDate: '21 Oktober 2026',
        createdAtTime: '15.00 WIB',
        createdAtDate: '21 Oktober 2026',
        status: 'cancelled',
        destinationHouse: 'Blok A-12',
        cancelledAt: '21 Oktober 2026, 15.30 WIB',
    },
];

export default function TamuIndex() {
    // Community Mode Simulator ('Cluster Aman' vs 'RT Mandiri')
    const [communityMode, setCommunityMode] = useState<
        'Cluster Aman' | 'RT Mandiri'
    >('Cluster Aman');

    // Scenario switch: 'has_active' | 'no_active'
    const [scenario, setScenario] = useState<'has_active' | 'no_active'>(
        'has_active',
    );

    // Filter history: 'all' | 'active' | 'used' | 'cancelled'
    const [historyFilter, setHistoryFilter] = useState<
        'all' | 'active' | 'used' | 'cancelled'
    >('all');

    // Passes state
    const [passesList, setPassesList] =
        useState<GuestPassItem[]>(INITIAL_GUEST_PASSES);

    // Selected Pass for viewing detail / QR modal
    const [selectedPass, setSelectedPass] = useState<GuestPassItem | null>(
        null,
    );

    // Modals
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isReviewStepOpen, setIsReviewStepOpen] = useState(false);
    const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
    const [isCancelConfirmModalOpen, setIsCancelConfirmModalOpen] =
        useState(false);
    const [cancelTargetPass, setCancelTargetPass] =
        useState<GuestPassItem | null>(null);

    // Notification toast feedback
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    // Form inputs state
    const [formData, setFormData] = useState({
        guestName: '',
        category: 'Tamu Pribadi' as
            | 'Kurir'
            | 'Tamu Pribadi'
            | 'Teknisi'
            | 'Keluarga',
        phoneNumber: '',
        validDuration: '2 jam' as '2 jam' | '6 jam' | 'Sampai akhir hari',
        notes: '',
    });

    // Helper: calculate end time preview
    const calculateEndTimePreview = (
        duration: '2 jam' | '6 jam' | 'Sampai akhir hari',
    ) => {
        if (duration === '2 jam')
            return '13.45 WIB hari ini (2 jam dari sekarang)';
        if (duration === '6 jam')
            return '17.45 WIB hari ini (6 jam dari sekarang)';
        return '23.59 WIB hari ini (hingga akhir hari)';
    };

    // Filtered passes
    const currentPasses = React.useMemo(() => {
        if (scenario === 'no_active') {
            return passesList.filter((p) => p.status !== 'active');
        }
        return passesList;
    }, [passesList, scenario]);

    // Active Pass (show highest priority active pass)
    const activePass = currentPasses.find((p) => p.status === 'active');

    // Filtered History
    const filteredHistory = React.useMemo(() => {
        if (historyFilter === 'all') return currentPasses;
        if (historyFilter === 'active')
            return currentPasses.filter((p) => p.status === 'active');
        if (historyFilter === 'used')
            return currentPasses.filter((p) => p.status === 'used');
        if (historyFilter === 'cancelled')
            return currentPasses.filter(
                (p) => p.status === 'cancelled' || p.status === 'expired',
            );
        return currentPasses;
    }, [currentPasses, historyFilter]);

    // Mask phone number
    const maskPhone = (phone?: string) => {
        if (!phone) return '-';
        if (phone.length < 8) return phone;
        return `${phone.slice(0, 4)}-****-${phone.slice(-4)}`;
    };

    // WhatsApp Message Builder
    const getWhatsAppShareMessage = (pass: GuestPassItem) => {
        return `Halo ${pass.guestName}, berikut QR Pass untuk kunjungan Anda ke Blok A-12, Komunitas Taman Sari. QR ini berlaku hingga pukul ${pass.validUntilTime} (${pass.validUntilDate}) dan hanya dapat digunakan satu kali. Mohon tunjukkan QR ini kepada satpam di gerbang pos utama: https://komunitashub.id/pass/${pass.code}`;
    };

    // Handle Creation
    const handleCreatePass = () => {
        const newCode = `PASS-${Math.floor(1000 + Math.random() * 9000)}-${formData.category.slice(0, 4).toUpperCase()}`;
        const newPass: GuestPassItem = {
            id: `pass-${Date.now()}`,
            code: newCode,
            guestName: formData.guestName || 'Tamu Kunjungan',
            category: formData.category,
            phoneNumber: formData.phoneNumber || undefined,
            validDuration: formData.validDuration,
            validUntilTime:
                formData.validDuration === '2 jam'
                    ? '13.45 WIB'
                    : formData.validDuration === '6 jam'
                      ? '17.45 WIB'
                      : '23.59 WIB',
            validUntilDate: '27 Oktober 2026',
            createdAtTime: '11.45 WIB',
            createdAtDate: '27 Oktober 2026',
            notes: formData.notes || undefined,
            status: 'active',
            destinationHouse: 'Blok A-12',
        };

        setPassesList([newPass, ...passesList]);
        setScenario('has_active');
        setIsReviewStepOpen(false);
        setIsCreateModalOpen(false);
        setSelectedPass(newPass);
        showToast('QR Pass berhasil diterbitkan dan siap dibagikan.');
    };

    // Handle Cancel
    const handleExecuteCancel = () => {
        if (!cancelTargetPass) return;
        setPassesList((prev) =>
            prev.map((item) =>
                item.id === cancelTargetPass.id
                    ? {
                          ...item,
                          status: 'cancelled',
                          cancelledAt: '27 Oktober 2026, baru saja',
                      }
                    : item,
            ),
        );
        setIsCancelConfirmModalOpen(false);
        if (selectedPass?.id === cancelTargetPass.id) {
            setSelectedPass(null);
        }
        setCancelTargetPass(null);
        showToast('Izin tamu telah dibatalkan.');
    };

    return (
        <CitizenLayout
            title="Izin Tamu & QR Pass"
            communityMode={communityMode}
            onModeChange={setCommunityMode}
            activeNav="tamu"
        >
            <Head title="Izin Tamu & QR Pass — KomunitasHub" />

            <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                {/* TOAST FEEDBACK */}
                {toastMessage && (
                    <div className="fixed top-5 right-5 z-50 flex animate-in items-center gap-2 rounded-xl border border-[#2F7D5C]/30 bg-[#EAF4EE] px-4 py-2.5 text-xs font-semibold text-[#2F7D5C] shadow-md duration-200 slide-in-from-top-3">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>{toastMessage}</span>
                    </div>
                )}

                {/* SIMULASI TOOLBAR PENGUJIAN */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-3 text-xs shadow-2xs">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#1D2924]">
                            Mode Komunitas:
                        </span>
                        <div className="inline-flex rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] p-0.5">
                            <button
                                type="button"
                                onClick={() => setCommunityMode('Cluster Aman')}
                                className={`rounded px-2.5 py-1 font-medium transition-colors ${
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
                                className={`rounded px-2.5 py-1 font-medium transition-colors ${
                                    communityMode === 'RT Mandiri'
                                        ? 'bg-[#2F6B57] text-[#FFFEFA]'
                                        : 'text-[#66736C] hover:text-[#1D2924]'
                                }`}
                            >
                                RT Mandiri (Tanpa Pos)
                            </button>
                        </div>
                    </div>

                    {communityMode === 'Cluster Aman' && (
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#1D2924]">
                                Status Tamu:
                            </span>
                            <div className="inline-flex rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] p-0.5">
                                <button
                                    type="button"
                                    onClick={() => setScenario('has_active')}
                                    className={`rounded px-2 py-0.5 font-medium transition-colors ${
                                        scenario === 'has_active'
                                            ? 'bg-[#2F6B57] text-[#FFFEFA]'
                                            : 'text-[#66736C] hover:text-[#1D2924]'
                                    }`}
                                >
                                    Ada QR Aktif
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setScenario('no_active')}
                                    className={`rounded px-2 py-0.5 font-medium transition-colors ${
                                        scenario === 'no_active'
                                            ? 'bg-[#2F6B57] text-[#FFFEFA]'
                                            : 'text-[#66736C] hover:text-[#1D2924]'
                                    }`}
                                >
                                    Belum Ada QR
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ============================================================== */}
                {/* KONDISI JIKA MODE ADALAH RT MANDIRI (FITUR BELUM TERSEDIA)     */}
                {/* ============================================================== */}
                {communityMode === 'RT Mandiri' ? (
                    <div className="space-y-4 rounded-2xl border border-[#E4E3DC] bg-[#FFFEFA] p-8 text-center shadow-xs sm:p-12">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#E4E3DC] bg-[#FAF9F5] text-[#66736C]">
                            <Home className="h-7 w-7 stroke-1" />
                        </div>
                        <div className="mx-auto max-w-md space-y-1.5">
                            <h2 className="text-xl font-bold text-[#1D2924]">
                                Izin tamu belum tersedia
                            </h2>
                            <p className="text-xs leading-relaxed text-[#66736C]">
                                Fitur izin tamu QR dirancang khusus untuk
                                lingkungan dengan pos keamanan gerbang dalam
                                mode <strong>Cluster Aman</strong>. Komunitas
                                Anda saat ini menggunakan mode{' '}
                                <strong>RT Mandiri</strong> (akses warga terbuka
                                tanpa pos satpam).
                            </p>
                        </div>
                        <div className="pt-2">
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#2F6B57] px-5 py-2.5 text-xs font-semibold text-[#FFFEFA] shadow-xs hover:bg-[#245442]"
                            >
                                <ArrowLeft className="h-3.5 w-3.5" />
                                <span>Kembali ke Ringkasan</span>
                            </Link>
                        </div>
                    </div>
                ) : (
                    /* ============================================================== */
                    /* KONDISI MODE CLUSTER AMAN: MODUL PENUH IZIN TAMU & QR PASS    */
                    /* ============================================================== */
                    <div className="space-y-8">
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
                                Izin Tamu & QR Pass
                            </span>
                        </div>

                        {/* HEADER KONTEN */}
                        <header className="flex flex-col justify-between gap-3 border-b border-[#E4E3DC] pb-4 sm:flex-row sm:items-end">
                            <div className="space-y-1">
                                <div className="text-xs font-semibold tracking-wider text-[#2F6B57] uppercase">
                                    Komunitas Taman Sari · Blok A-12
                                </div>
                                <h1 className="text-2xl font-bold tracking-tight text-[#1D2924] sm:text-3xl">
                                    Izin Tamu
                                </h1>
                                <p className="text-xs text-[#66736C] sm:text-sm">
                                    Buat izin kunjungan sebelum tamu tiba di
                                    gerbang pos satpam.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setFormData({
                                        guestName: '',
                                        category: 'Tamu Pribadi',
                                        phoneNumber: '',
                                        validDuration: '2 jam',
                                        notes: '',
                                    });
                                    setIsCreateModalOpen(true);
                                }}
                                className="hidden items-center gap-1.5 rounded-lg bg-[#2F6B57] px-5 py-2.5 text-xs font-semibold text-[#FFFEFA] shadow-xs transition-colors hover:bg-[#245442] sm:inline-flex"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Buat Izin Tamu</span>
                            </button>
                        </header>

                        {/* TOMBOL FULL-WIDTH PADA MOBILE */}
                        <div className="sm:hidden">
                            <button
                                type="button"
                                onClick={() => {
                                    setFormData({
                                        guestName: '',
                                        category: 'Tamu Pribadi',
                                        phoneNumber: '',
                                        validDuration: '2 jam',
                                        notes: '',
                                    });
                                    setIsCreateModalOpen(true);
                                }}
                                className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#2F6B57] px-4 py-2.5 text-xs font-semibold text-[#FFFEFA] shadow-xs"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Buat Izin Tamu</span>
                            </button>
                        </div>

                        {/* ============================================================== */}
                        {/* 1. SECTION: QR PASS AKTIF                                      */}
                        {/* ============================================================== */}
                        <section
                            aria-labelledby="qr-aktif-title"
                            className="space-y-3"
                        >
                            <div className="space-y-0.5">
                                <h2
                                    id="qr-aktif-title"
                                    className="text-base font-bold text-[#1D2924]"
                                >
                                    QR Pass Aktif
                                </h2>
                                <p className="text-xs text-[#66736C]">
                                    Izin masuk yang saat ini dapat dipindai oleh
                                    satpam di pos gerbang utama.
                                </p>
                            </div>

                            {activePass ? (
                                <div className="relative overflow-hidden rounded-2xl border border-[#2F6B57]/30 bg-[#FFFEFA] p-5 shadow-2xs sm:p-6">
                                    <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-[#2F6B57]" />

                                    <div className="flex flex-col justify-between gap-5 pl-2 sm:flex-row sm:items-center">
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="inline-flex items-center gap-1 rounded bg-[#EAF4EE] px-2 py-0.5 text-[11px] font-semibold text-[#2F7D5C]">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-[#2F7D5C]" />
                                                    Aktif
                                                </span>
                                                <span className="rounded bg-[#F7F6F2] px-2 py-0.5 text-[11px] font-medium text-[#1D2924]">
                                                    {activePass.category}
                                                </span>
                                                <span className="text-xs text-[#66736C]">
                                                    · Tujuan Rumah Blok A-12
                                                </span>
                                            </div>

                                            <h3 className="text-lg font-bold text-[#1D2924] sm:text-xl">
                                                {activePass.guestName}
                                            </h3>

                                            <div className="flex flex-wrap items-center gap-2 text-xs text-[#66736C]">
                                                <span className="inline-flex items-center gap-1 font-medium text-[#2F6B57]">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    Berlaku hingga hari ini,{' '}
                                                    {activePass.validUntilTime}
                                                </span>
                                                <span>
                                                    (tersisa ~2 jam 15 menit)
                                                </span>
                                            </div>

                                            {activePass.notes && (
                                                <p className="line-clamp-1 text-xs text-[#66736C] italic">
                                                    Catatan satpam: "
                                                    {activePass.notes}"
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2.5 sm:flex-col sm:items-end">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedPass(activePass)
                                                }
                                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#2F6B57] px-4 py-2 text-xs font-semibold text-[#FFFEFA] shadow-xs transition-colors hover:bg-[#245442]"
                                            >
                                                <QrCode className="h-3.5 w-3.5" />
                                                <span>Tampilkan QR</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setCancelTargetPass(
                                                        activePass,
                                                    );
                                                    setIsCancelConfirmModalOpen(
                                                        true,
                                                    );
                                                }}
                                                className="rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-3 py-1.5 text-xs font-semibold text-[#66736C] transition-colors hover:bg-[#FBEBE9] hover:text-[#B74E44]"
                                            >
                                                Batalkan Izin
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* EMPTY STATE QR AKTIF */
                                <div className="space-y-3 rounded-2xl border border-[#E4E3DC] bg-[#FFFEFA] p-6 text-center shadow-2xs sm:p-8">
                                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-[#E4E3DC] bg-[#FAF9F5] text-[#2F6B57]">
                                        <QrCode className="h-5 w-5 stroke-1" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-bold text-[#1D2924]">
                                            Belum ada izin tamu aktif
                                        </h3>
                                        <p className="mx-auto max-w-sm text-xs text-[#66736C]">
                                            Buat QR Pass sebelum tamu tiba agar
                                            akses di pos satpam lebih lancar dan
                                            tercatat rapi.
                                        </p>
                                    </div>
                                    <div className="pt-1">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFormData({
                                                    guestName: '',
                                                    category: 'Tamu Pribadi',
                                                    phoneNumber: '',
                                                    validDuration: '2 jam',
                                                    notes: '',
                                                });
                                                setIsCreateModalOpen(true);
                                            }}
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#2F6B57] px-4 py-2 text-xs font-semibold text-[#FFFEFA] shadow-xs hover:bg-[#245442]"
                                        >
                                            <Plus className="h-3.5 w-3.5" />
                                            <span>Buat Izin Tamu</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* ============================================================== */}
                        {/* 2. SECTION: KUNJUNGAN TERBARU (HISTORY LIST)                  */}
                        {/* ============================================================== */}
                        <section
                            aria-labelledby="kunjungan-terbaru-title"
                            className="space-y-4 border-t border-[#E4E3DC] pt-4"
                        >
                            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                                <div className="space-y-0.5">
                                    <h2
                                        id="kunjungan-terbaru-title"
                                        className="text-base font-bold text-[#1D2924]"
                                    >
                                        Kunjungan Terbaru
                                    </h2>
                                    <p className="text-xs text-[#66736C]">
                                        Riwayat seluruh izin tamu yang pernah
                                        dibuat untuk Rumah Blok A-12.
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
                                        onClick={() =>
                                            setHistoryFilter('active')
                                        }
                                        className={`rounded px-2.5 py-1 font-medium transition-colors ${
                                            historyFilter === 'active'
                                                ? 'bg-[#2F6B57] text-[#FFFEFA]'
                                                : 'text-[#66736C] hover:text-[#1D2924]'
                                        }`}
                                    >
                                        Aktif
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setHistoryFilter('used')}
                                        className={`rounded px-2.5 py-1 font-medium transition-colors ${
                                            historyFilter === 'used'
                                                ? 'bg-[#2F6B57] text-[#FFFEFA]'
                                                : 'text-[#66736C] hover:text-[#1D2924]'
                                        }`}
                                    >
                                        Selesai
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setHistoryFilter('cancelled')
                                        }
                                        className={`rounded px-2.5 py-1 font-medium transition-colors ${
                                            historyFilter === 'cancelled'
                                                ? 'bg-[#2F6B57] text-[#FFFEFA]'
                                                : 'text-[#66736C] hover:text-[#1D2924]'
                                        }`}
                                    >
                                        Dibatalkan / Berakhir
                                    </button>
                                </div>
                            </div>

                            {/* List Row Sederhana */}
                            <div className="divide-y divide-[#E4E3DC] rounded-xl border border-[#E4E3DC] bg-[#FFFEFA]">
                                {filteredHistory.length > 0 ? (
                                    filteredHistory.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex flex-col justify-between gap-3 p-4 transition-colors hover:bg-[#FAF9F5] sm:flex-row sm:items-center sm:p-4.5"
                                        >
                                            <div className="space-y-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="text-xs font-semibold text-[#1D2924]">
                                                        {item.guestName}
                                                    </span>
                                                    <span className="text-[11px] text-[#66736C]">
                                                        · {item.category}
                                                    </span>

                                                    {/* Status Badge */}
                                                    {item.status ===
                                                        'active' && (
                                                        <span className="py-0.2 inline-flex items-center gap-1 rounded bg-[#EAF4EE] px-2 text-[10px] font-semibold text-[#2F7D5C]">
                                                            Aktif
                                                        </span>
                                                    )}
                                                    {item.status === 'used' && (
                                                        <span className="py-0.2 inline-flex items-center gap-1 rounded bg-[#F7F6F2] px-2 text-[10px] font-medium text-[#66736C]">
                                                            Sudah Digunakan
                                                        </span>
                                                    )}
                                                    {item.status ===
                                                        'expired' && (
                                                        <span className="py-0.2 inline-flex items-center gap-1 rounded bg-[#F7F6F2] px-2 text-[10px] font-medium text-[#66736C]">
                                                            Kedaluwarsa
                                                        </span>
                                                    )}
                                                    {item.status ===
                                                        'cancelled' && (
                                                        <span className="py-0.2 inline-flex items-center gap-1 rounded bg-[#FBEBE9] px-2 text-[10px] font-semibold text-[#B74E44]">
                                                            Dibatalkan
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#66736C]">
                                                    <span>
                                                        Dibuat{' '}
                                                        {item.createdAtDate},{' '}
                                                        {item.createdAtTime}
                                                    </span>
                                                    <span>·</span>
                                                    {item.status ===
                                                    'active' ? (
                                                        <span className="font-medium text-[#2F6B57]">
                                                            Berlaku hingga{' '}
                                                            {
                                                                item.validUntilTime
                                                            }
                                                        </span>
                                                    ) : item.status ===
                                                      'used' ? (
                                                        <span>
                                                            {item.usedAt}
                                                        </span>
                                                    ) : item.status ===
                                                      'cancelled' ? (
                                                        <span className="text-[#B74E44]">
                                                            {item.cancelledAt ||
                                                                'Dibatalkan'}
                                                        </span>
                                                    ) : (
                                                        <span>
                                                            Berakhir{' '}
                                                            {
                                                                item.validUntilDate
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between gap-3 sm:justify-end">
                                                {item.status === 'active' && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedPass(
                                                                item,
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1 rounded-lg border border-[#2F6B57]/30 bg-[#EBF3EF] px-3 py-1.5 text-xs font-semibold text-[#2F6B57] transition-colors hover:bg-[#2F6B57] hover:text-[#FFFEFA]"
                                                    >
                                                        <QrCode className="h-3.5 w-3.5" />
                                                        <span>
                                                            Tampilkan QR
                                                        </span>
                                                    </button>
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedPass(item)
                                                    }
                                                    className="rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] px-3.5 py-1.5 text-xs font-semibold text-[#1D2924] transition-colors hover:bg-[#E4E3DC]"
                                                >
                                                    Detail
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-xs text-[#66736C]">
                                        Tidak ada data kunjungan untuk filter
                                        ini.
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* ============================================================== */}
                        {/* 3. SECTION: CARA KERJA RINGKAS                                */}
                        {/* ============================================================== */}
                        <section
                            aria-labelledby="cara-kerja-title"
                            className="space-y-3 border-t border-[#E4E3DC] pt-4"
                        >
                            <div className="space-y-0.5">
                                <h3
                                    id="cara-kerja-title"
                                    className="text-xs font-bold tracking-wider text-[#66736C] uppercase"
                                >
                                    Cara Kerja Izin Masuk Tamu
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-3">
                                <div className="space-y-1.5 rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-4">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EBF3EF] font-bold text-[#2F6B57]">
                                        1
                                    </div>
                                    <div className="font-bold text-[#1D2924]">
                                        Buat Izin Tamu
                                    </div>
                                    <p className="text-[11px] leading-snug text-[#66736C]">
                                        Pilih kategori kunjungan dan tentukan
                                        perkiraan durasi waktu kedatangan tamu.
                                    </p>
                                </div>

                                <div className="space-y-1.5 rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-4">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EBF3EF] font-bold text-[#2F6B57]">
                                        2
                                    </div>
                                    <div className="font-bold text-[#1D2924]">
                                        Bagikan QR Pass
                                    </div>
                                    <p className="text-[11px] leading-snug text-[#66736C]">
                                        Kirim tautan kode QR kepada tamu Anda
                                        melalui WhatsApp sebelum mereka tiba di
                                        gerbang.
                                    </p>
                                </div>

                                <div className="space-y-1.5 rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-4">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EBF3EF] font-bold text-[#2F6B57]">
                                        3
                                    </div>
                                    <div className="font-bold text-[#1D2924]">
                                        Satpam Memindai QR
                                    </div>
                                    <p className="text-[11px] leading-snug text-[#66736C]">
                                        Petugas pos mencocokkan kode pada tablet
                                        pos jaga dan mengizinkan kendaraan
                                        masuk.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                )}
            </div>

            {/* ============================================================== */}
            {/* MODAL 1: FORM BUAT IZIN TAMU & QR PASS                         */}
            {/* ============================================================== */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D2924]/40 p-4 backdrop-blur-xs">
                    <div className="max-h-[92vh] w-full max-w-lg animate-in space-y-5 overflow-y-auto rounded-2xl border border-[#E4E3DC] bg-[#FFFEFA] p-6 shadow-lg duration-150 zoom-in-95">
                        <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-3">
                            <div className="space-y-0.5">
                                <span className="text-[10px] font-semibold tracking-wider text-[#2F6B57] uppercase">
                                    Izin Tamu Komunitas
                                </span>
                                <h3 className="text-base font-bold text-[#1D2924]">
                                    Buat QR Pass
                                </h3>
                                <p className="text-xs text-[#66736C]">
                                    QR Pass akan berlaku satu kali sesuai waktu
                                    yang Anda tentukan.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsCreateModalOpen(false);
                                    setIsReviewStepOpen(false);
                                }}
                                className="rounded p-1 text-[#66736C] hover:text-[#1D2924]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* REVIEW STEP SEBELUM DITERBITKAN */}
                        {isReviewStepOpen ? (
                            <div className="space-y-4 text-xs">
                                <div className="space-y-1">
                                    <h4 className="text-sm font-bold text-[#1D2924]">
                                        Periksa Rincian Izin Tamu
                                    </h4>
                                    <p className="text-[11px] text-[#66736C]">
                                        Pastikan data kunjungan sudah benar
                                        sebelum kode QR aktif.
                                    </p>
                                </div>

                                <div className="divide-y divide-[#E4E3DC] rounded-xl border border-[#E4E3DC] bg-[#FAF9F5]">
                                    <div className="flex justify-between p-3">
                                        <span className="text-[#66736C]">
                                            Nama Tamu:
                                        </span>
                                        <span className="font-bold text-[#1D2924]">
                                            {formData.guestName}
                                        </span>
                                    </div>
                                    <div className="flex justify-between p-3">
                                        <span className="text-[#66736C]">
                                            Kategori Kunjungan:
                                        </span>
                                        <span className="font-semibold text-[#1D2924]">
                                            {formData.category}
                                        </span>
                                    </div>
                                    <div className="flex justify-between p-3">
                                        <span className="text-[#66736C]">
                                            Tujuan Rumah:
                                        </span>
                                        <span className="font-semibold text-[#1D2924]">
                                            Blok A-12 (Keluarga Pratama)
                                        </span>
                                    </div>
                                    <div className="flex justify-between p-3">
                                        <span className="text-[#66736C]">
                                            Masa Berlaku:
                                        </span>
                                        <span className="font-semibold text-[#2F6B57]">
                                            {calculateEndTimePreview(
                                                formData.validDuration,
                                            )}
                                        </span>
                                    </div>
                                    {formData.phoneNumber && (
                                        <div className="flex justify-between p-3">
                                            <span className="text-[#66736C]">
                                                Kontak WhatsApp:
                                            </span>
                                            <span className="font-mono text-[#1D2924]">
                                                {formData.phoneNumber}
                                            </span>
                                        </div>
                                    )}
                                    {formData.notes && (
                                        <div className="space-y-0.5 p-3">
                                            <span className="text-[#66736C]">
                                                Catatan untuk Satpam:
                                            </span>
                                            <p className="font-medium text-[#1D2924] italic">
                                                "{formData.notes}"
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-start gap-2 rounded-lg border border-[#B87922]/20 bg-[#FAF2E6] p-3 text-[11px] text-[#B87922]">
                                    <Info className="mt-0.5 h-4 w-4 shrink-0" />
                                    <span>
                                        QR Pass hanya dapat dipindai satu kali
                                        di pos satpam dan otomatis tidak aktif
                                        setelah digunakan atau melewati masa
                                        berlaku.
                                    </span>
                                </div>

                                <div className="flex justify-end gap-2 border-t border-[#E4E3DC] pt-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsReviewStepOpen(false)
                                        }
                                        className="rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-4 py-2 font-medium text-[#1D2924] hover:bg-[#F7F6F2]"
                                    >
                                        Perbaiki Data
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCreatePass}
                                        className="flex items-center gap-1.5 rounded-lg bg-[#2F6B57] px-5 py-2 font-semibold text-[#FFFEFA] shadow-xs hover:bg-[#245442]"
                                    >
                                        <Check className="h-4 w-4" />
                                        <span>Terbitkan QR Pass</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* FORM INPUT DATA TAMU */
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    setIsReviewStepOpen(true);
                                }}
                                className="space-y-4 text-xs"
                            >
                                {/* 1. Nama Tamu */}
                                <div className="space-y-1">
                                    <label className="font-semibold text-[#1D2924]">
                                        Nama Tamu / Identitas Pengantar:{' '}
                                        <span className="text-[#B74E44]">
                                            *
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.guestName}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                guestName: e.target.value,
                                            })
                                        }
                                        placeholder="Contoh: Andi Wijaya, Kurir JNE, atau Teknisi AC"
                                        className="w-full rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-3 py-2 text-xs text-[#1D2924] focus:border-[#2F6B57] focus:outline-hidden"
                                    />
                                </div>

                                {/* 2. Kategori Kunjungan */}
                                <div className="space-y-1.5">
                                    <label className="font-semibold text-[#1D2924]">
                                        Kategori Kunjungan:{' '}
                                        <span className="text-[#B74E44]">
                                            *
                                        </span>
                                    </label>
                                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                        {(
                                            [
                                                'Kurir',
                                                'Tamu Pribadi',
                                                'Teknisi',
                                                'Keluarga',
                                            ] as const
                                        ).map((cat) => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() =>
                                                    setFormData({
                                                        ...formData,
                                                        category: cat,
                                                    })
                                                }
                                                className={`rounded-lg border p-2 text-center font-medium transition-colors ${
                                                    formData.category === cat
                                                        ? 'border-[#2F6B57] bg-[#EBF3EF] font-semibold text-[#2F6B57]'
                                                        : 'border-[#E4E3DC] bg-[#FFFEFA] text-[#66736C] hover:text-[#1D2924]'
                                                }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-[11px] text-[#66736C]">
                                        {formData.category === 'Kurir' &&
                                            'Gunakan untuk kurir pengiriman paket atau pengantar makanan.'}
                                        {formData.category === 'Teknisi' &&
                                            'Gunakan untuk teknisi internet, AC, instalasi listrik, atau perbaikan rumah.'}
                                        {formData.category === 'Tamu Pribadi' &&
                                            'Gunakan untuk teman, rekan kerja, atau kunjungan pribadi.'}
                                        {formData.category === 'Keluarga' &&
                                            'Gunakan untuk sanak keluarga atau kerabat yang berkunjung.'}
                                    </p>
                                </div>

                                {/* 3. Nomor WhatsApp Tamu (Opsional) */}
                                <div className="space-y-1">
                                    <label className="font-semibold text-[#1D2924]">
                                        Nomor WhatsApp Tamu (Opsional):
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phoneNumber}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                phoneNumber: e.target.value,
                                            })
                                        }
                                        placeholder="Contoh: 0812 3456 7890"
                                        className="w-full rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-3 py-2 text-xs text-[#1D2924] focus:border-[#2F6B57] focus:outline-hidden"
                                    />
                                    <span className="text-[11px] text-[#66736C]">
                                        Hanya digunakan bila Anda ingin
                                        membagikan tautan izin langsung ke
                                        kontak WhatsApp tamu.
                                    </span>
                                </div>

                                {/* 4. Masa Berlaku */}
                                <div className="space-y-1.5">
                                    <label className="font-semibold text-[#1D2924]">
                                        Masa Berlaku Izin:{' '}
                                        <span className="text-[#B74E44]">
                                            *
                                        </span>
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(
                                            [
                                                '2 jam',
                                                '6 jam',
                                                'Sampai akhir hari',
                                            ] as const
                                        ).map((dur) => (
                                            <button
                                                key={dur}
                                                type="button"
                                                onClick={() =>
                                                    setFormData({
                                                        ...formData,
                                                        validDuration: dur,
                                                    })
                                                }
                                                className={`rounded-lg border p-2 text-center text-xs transition-colors ${
                                                    formData.validDuration ===
                                                    dur
                                                        ? 'border-[#2F6B57] bg-[#EBF3EF] font-bold text-[#2F6B57]'
                                                        : 'border-[#E4E3DC] bg-[#FFFEFA] text-[#66736C] hover:text-[#1D2924]'
                                                }`}
                                            >
                                                {dur}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="rounded-md border border-[#E4E3DC] bg-[#FAF9F5] p-2 text-[11px] text-[#2F6B57]">
                                        QR akan berlaku hingga:{' '}
                                        <strong>
                                            {calculateEndTimePreview(
                                                formData.validDuration,
                                            )}
                                        </strong>
                                    </div>
                                </div>

                                {/* 5. Catatan untuk Pos Satpam */}
                                <div className="space-y-1">
                                    <div className="flex justify-between">
                                        <label className="font-semibold text-[#1D2924]">
                                            Catatan untuk Pos Satpam (Opsional):
                                        </label>
                                        <span className="text-[10px] text-[#66736C]">
                                            {formData.notes.length}/100
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        maxLength={100}
                                        value={formData.notes}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                notes: e.target.value,
                                            })
                                        }
                                        placeholder="Contoh: Membawa perlengkapan servis AC atau mobil Avanza hitam"
                                        className="w-full rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-3 py-2 text-xs text-[#1D2924] focus:border-[#2F6B57] focus:outline-hidden"
                                    />
                                </div>

                                {/* 6. Read-only Ringkasan Tujuan */}
                                <div className="rounded-xl border border-[#E4E3DC] bg-[#F7F6F2] p-3 text-[11px] text-[#66736C]">
                                    Akses masuk ditujukan ke:{' '}
                                    <strong className="text-[#1D2924]">
                                        Blok A-12, Komunitas Taman Sari
                                    </strong>
                                    .
                                </div>

                                <div className="flex justify-end gap-2 border-t border-[#E4E3DC] pt-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsCreateModalOpen(false)
                                        }
                                        className="rounded-lg px-4 py-2 font-medium text-[#66736C] hover:text-[#1D2924]"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex items-center gap-1.5 rounded-lg bg-[#2F6B57] px-5 py-2 font-semibold text-[#FFFEFA] shadow-xs hover:bg-[#245442]"
                                    >
                                        <span>Lanjutkan ke Tinjauan</span>
                                        <ChevronRight className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* ============================================================== */}
            {/* MODAL 2: DETAIL QR PASS & TAMPILAN KODE UNTUK SCAN SATPAM     */}
            {/* ============================================================== */}
            {selectedPass && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D2924]/40 p-4 backdrop-blur-xs">
                    <div className="max-h-[92vh] w-full max-w-sm animate-in space-y-4 overflow-y-auto rounded-2xl border border-[#E4E3DC] bg-[#FFFEFA] p-6 text-center shadow-xl duration-150 zoom-in-95">
                        {/* Header Modal */}
                        <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-3 text-left">
                            <div>
                                <span className="text-[10px] font-semibold tracking-wider text-[#2F6B57] uppercase">
                                    Izin Akses Masuk
                                </span>
                                <h3 className="text-base font-bold text-[#1D2924]">
                                    {selectedPass.status === 'active'
                                        ? 'QR Pass Siap Digunakan'
                                        : 'Detail Izin Tamu'}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedPass(null)}
                                className="rounded p-1 text-[#66736C] hover:text-[#1D2924]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* STATUS BADGE */}
                        <div>
                            {selectedPass.status === 'active' && (
                                <span className="inline-flex items-center gap-1 rounded bg-[#EAF4EE] px-3 py-1 text-xs font-semibold text-[#2F7D5C]">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#2F7D5C]" />
                                    QR Pass Aktif
                                </span>
                            )}
                            {selectedPass.status === 'used' && (
                                <span className="inline-flex items-center gap-1 rounded border border-[#E4E3DC] bg-[#F7F6F2] px-3 py-1 text-xs font-medium text-[#66736C]">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-[#2F7D5C]" />
                                    Sudah Digunakan di Pos Satpam
                                </span>
                            )}
                            {selectedPass.status === 'expired' && (
                                <span className="inline-flex items-center gap-1 rounded border border-[#E4E3DC] bg-[#F7F6F2] px-3 py-1 text-xs font-medium text-[#66736C]">
                                    <Clock className="h-3.5 w-3.5" />
                                    Masa Berlaku Kedaluwarsa
                                </span>
                            )}
                            {selectedPass.status === 'cancelled' && (
                                <span className="inline-flex items-center gap-1 rounded border border-[#B74E44]/20 bg-[#FBEBE9] px-3 py-1 text-xs font-semibold text-[#B74E44]">
                                    <XCircle className="h-3.5 w-3.5" />
                                    Izin Dibatalkan
                                </span>
                            )}
                        </div>

                        {/* QR CODE BOX AREA */}
                        <div className="relative mx-auto inline-block rounded-2xl border border-[#E4E3DC] bg-[#FFFEFA] p-5 shadow-xs">
                            <div className="space-y-2">
                                <div className="font-mono text-[10px] text-[#66736C] uppercase">
                                    POS GERBANG CLUSTER TAMAN SARI
                                </div>

                                <div
                                    className={`rounded-xl border border-[#E4E3DC] bg-white p-2 ${selectedPass.status !== 'active' ? 'opacity-25 grayscale' : ''}`}
                                >
                                    <QrCode className="mx-auto h-44 w-44 text-[#1D2924]" />
                                </div>

                                {selectedPass.status !== 'active' && (
                                    <div className="backdrop-blur-2xs absolute inset-0 flex items-center justify-center rounded-2xl bg-[#FFFEFA]/80">
                                        <div className="rounded-lg bg-[#1D2924] px-3 py-1.5 text-xs font-semibold text-[#FFFEFA]">
                                            {selectedPass.status === 'used'
                                                ? 'Telah Dipindai di Pos'
                                                : selectedPass.status ===
                                                    'cancelled'
                                                  ? 'Izin Dibatalkan'
                                                  : 'Kedaluwarsa'}
                                        </div>
                                    </div>
                                )}

                                <div className="font-mono text-xs font-bold tracking-wider text-[#1D2924]">
                                    {selectedPass.code}
                                </div>
                            </div>
                        </div>

                        {/* DETAIL IDENTITAS */}
                        <div className="space-y-1.5 rounded-xl border border-[#E4E3DC] bg-[#FAF9F5] p-3 text-left text-xs">
                            <div className="flex justify-between">
                                <span className="text-[#66736C]">
                                    Nama Tamu:
                                </span>
                                <span className="font-bold text-[#1D2924]">
                                    {selectedPass.guestName}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#66736C]">
                                    Kategori:
                                </span>
                                <span className="font-semibold text-[#1D2924]">
                                    {selectedPass.category}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#66736C]">
                                    Tujuan Rumah:
                                </span>
                                <span className="font-semibold text-[#1D2924]">
                                    {selectedPass.destinationHouse}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#66736C]">
                                    Masa Berlaku:
                                </span>
                                <span className="font-semibold text-[#2F6B57]">
                                    Hingga {selectedPass.validUntilTime}
                                </span>
                            </div>
                            {selectedPass.phoneNumber && (
                                <div className="flex justify-between">
                                    <span className="text-[#66736C]">
                                        Kontak Tamu:
                                    </span>
                                    <span className="font-mono text-[#66736C]">
                                        {maskPhone(selectedPass.phoneNumber)}
                                    </span>
                                </div>
                            )}
                            {selectedPass.notes && (
                                <div className="border-t border-[#E4E3DC] pt-1 text-[11px] leading-snug text-[#66736C]">
                                    Catatan satpam: "{selectedPass.notes}"
                                </div>
                            )}
                        </div>

                        {/* CALLOUT FOOTER ACTIONS SESUAI STATUS */}
                        {selectedPass.status === 'active' ? (
                            <div className="space-y-2 pt-1">
                                <button
                                    type="button"
                                    onClick={() => setIsWhatsAppModalOpen(true)}
                                    className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#2F6B57] py-2.5 text-xs font-semibold text-[#FFFEFA] shadow-xs hover:bg-[#245442]"
                                >
                                    <Share2 className="h-4 w-4" />
                                    <span>Bagikan via WhatsApp</span>
                                </button>

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            alert(
                                                'Placeholder: Gambar kode QR berhasil disimpan ke perangkat Anda.',
                                            );
                                        }}
                                        className="flex-1 rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] py-2 text-xs font-semibold text-[#1D2924] hover:bg-[#F7F6F2]"
                                    >
                                        Simpan QR
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setCancelTargetPass(selectedPass);
                                            setIsCancelConfirmModalOpen(true);
                                        }}
                                        className="flex-1 rounded-lg border border-[#B74E44]/30 bg-[#FFF7F6] py-2 text-xs font-semibold text-[#B74E44] hover:bg-[#FBEBE9]"
                                    >
                                        Batalkan Izin
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedPass(null);
                                        setIsCreateModalOpen(true);
                                    }}
                                    className="w-full rounded-lg bg-[#2F6B57] py-2.5 text-xs font-semibold text-[#FFFEFA] shadow-xs hover:bg-[#245442]"
                                >
                                    Buat Izin Baru
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ============================================================== */}
            {/* MODAL 3: PREVIEW PESAN WHATSAPP UNTUK DIBAGIKAN KE TAMU       */}
            {/* ============================================================== */}
            {isWhatsAppModalOpen && selectedPass && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D2924]/40 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-md animate-in space-y-4 rounded-2xl border border-[#E4E3DC] bg-[#FFFEFA] p-6 shadow-lg duration-150 zoom-in-95">
                        <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-3">
                            <div className="space-y-0.5">
                                <h3 className="text-base font-bold text-[#1D2924]">
                                    Bagikan QR Pass via WhatsApp
                                </h3>
                                <p className="text-xs text-[#66736C]">
                                    Pratinjau pesan resmi untuk dikirim kepada
                                    tamu Anda.
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
                                Teks Pesan:
                            </span>
                            <p className="rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] p-3 leading-relaxed text-[#1D2924] italic">
                                "{getWhatsAppShareMessage(selectedPass)}"
                            </p>
                            <p className="text-[11px] text-[#66736C]">
                                Pesan akan terbuka langsung di aplikasi WhatsApp
                                Anda dengan teks yang sudah terisi rapi.
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
                                href={`https://wa.me/?text=${encodeURIComponent(getWhatsAppShareMessage(selectedPass))}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setIsWhatsAppModalOpen(false)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#2F6B57] px-4 py-2 font-semibold text-[#FFFEFA] hover:bg-[#245442]"
                            >
                                <MessageSquare className="h-4 w-4" />
                                <span>Buka WhatsApp</span>
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================================== */}
            {/* MODAL 4: KONFIRMASI PEMBATALAN IZIN TAMU                       */}
            {/* ============================================================== */}
            {isCancelConfirmModalOpen && cancelTargetPass && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D2924]/40 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-sm animate-in space-y-4 rounded-2xl border border-[#E4E3DC] bg-[#FFFEFA] p-6 shadow-lg duration-150 zoom-in-95">
                        <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-2">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-[#B74E44]">
                                <AlertCircle className="h-4 w-4" />
                                <span>Batalkan Izin Tamu?</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsCancelConfirmModalOpen(false);
                                    setCancelTargetPass(null);
                                }}
                                className="rounded p-1 text-[#66736C] hover:text-[#1D2924]"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <p className="text-xs leading-relaxed text-[#1D2924]">
                            QR Pass untuk{' '}
                            <strong>{cancelTargetPass.guestName}</strong> (
                            {cancelTargetPass.category}) tidak dapat digunakan
                            kembali di pos satpam setelah dibatalkan.
                        </p>

                        <div className="flex justify-end gap-2 border-t border-[#E4E3DC] pt-3 text-xs">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsCancelConfirmModalOpen(false);
                                    setCancelTargetPass(null);
                                }}
                                className="rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-4 py-2 font-medium text-[#1D2924] hover:bg-[#F7F6F2]"
                            >
                                Kembali
                            </button>
                            <button
                                type="button"
                                onClick={handleExecuteCancel}
                                className="rounded-lg bg-[#B74E44] px-4 py-2 font-semibold text-[#FFFEFA] shadow-xs hover:bg-[#9B3E36]"
                            >
                                Ya, Batalkan Izin
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </CitizenLayout>
    );
}
