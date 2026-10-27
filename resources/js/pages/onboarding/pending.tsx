import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { BrandLogo } from '@/components/komunitashub/brand-logo';
import { Spinner } from '@/components/ui/spinner';
import {
    Check,
    Clock,
    AlertCircle,
    XCircle,
    CheckCircle2,
    ShieldCheck,
    Home,
    Edit3,
    ArrowRight,
    Lock,
    LogOut,
    RefreshCw,
    Receipt,
    FileText,
    QrCode,
    Wallet,
    ChevronDown,
    ChevronUp,
    Copy,
    X,
} from 'lucide-react';

interface FamilyMember {
    id: string;
    name: string;
    relation: string;
}

interface SubmissionData {
    community: string;
    communityLocation: string;
    communityMode: 'RT Mandiri' | 'Cluster Aman';
    block: string;
    houseNumber: string;
    additionalAddress?: string;
    familyPhone: string;
    emergencyPhone?: string;
    headName: string;
    familyMembers?: FamilyMember[];
    totalResidents: number;
    submittedAt: string;
}

const defaultFallbackData: SubmissionData = {
    community: 'Komunitas Taman Sari',
    communityLocation: 'RT 04 / RW 09 · Kelurahan Sukamaju',
    communityMode: 'Cluster Aman',
    block: 'Blok A',
    houseNumber: '12',
    additionalAddress: 'Dekat pos satpam barat',
    familyPhone: '0812 3456 7890',
    emergencyPhone: '0813 9876 5432',
    headName: 'Budi Santoso',
    familyMembers: [
        { id: '1', name: 'Siti Rahmawati', relation: 'Pasangan' },
        { id: '2', name: 'Ahmad Farhan', relation: 'Anak' },
    ],
    totalResidents: 3,
    submittedAt: '27 Oktober 2026, 10.30',
};

export default function PendingVerification() {
    const { auth } = usePage().props as {
        auth: { user?: { name: string; email: string } };
    };

    const [data, setData] = useState<SubmissionData>(defaultFallbackData);

    // Status type for multi-state handling:
    // 'pending' (default) | 'needs_revision' | 'rejected' | 'active'
    const [statusType, setStatusType] = useState<
        'pending' | 'needs_revision' | 'rejected' | 'active'
    >('pending');

    // UI state
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastCheckedText, setLastCheckedText] = useState('');
    const [isFullDetailsOpen, setIsFullDetailsOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
    const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);

    // Edit form state
    const [editBlock, setEditBlock] = useState(data.block);
    const [editHouseNumber, setEditHouseNumber] = useState(data.houseNumber);
    const [editPhone, setEditPhone] = useState(data.familyPhone);
    const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

    useEffect(() => {
        try {
            const saved = sessionStorage.getItem('komunitashub_submission');
            if (saved) {
                const parsed = JSON.parse(saved) as SubmissionData;
                setData(parsed);
                setEditBlock(parsed.block);
                setEditHouseNumber(parsed.houseNumber);
                setEditPhone(parsed.familyPhone);
            }
        } catch {
            // Use fallback data
        }
    }, []);

    const userInitials = (data.headName || auth?.user?.name || 'BS')
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    // Check status action
    const handleCheckStatus = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
            setLastCheckedText('Status terakhir diperbarui baru saja.');
        }, 500);
    };

    // Save edited submission
    const handleSaveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmittingEdit(true);

        setTimeout(() => {
            setIsSubmittingEdit(false);
            const now = new Date();
            const timeStr = `${now.getDate()} Oktober 2026, ${now
                .getHours()
                .toString()
                .padStart(
                    2,
                    '0',
                )}.${now.getMinutes().toString().padStart(2, '0')}`;

            const updatedData: SubmissionData = {
                ...data,
                block: editBlock,
                houseNumber: editHouseNumber,
                familyPhone: editPhone,
                submittedAt: `${timeStr} (Diperbarui)`,
            };

            setData(updatedData);
            try {
                sessionStorage.setItem(
                    'komunitashub_submission',
                    JSON.stringify(updatedData),
                );
            } catch {
                // Ignore
            }

            // If we were in revision state, return to pending
            if (statusType === 'needs_revision') {
                setStatusType('pending');
            }

            setIsEditModalOpen(false);
            setLastCheckedText('Data pengajuan berhasil diperbarui.');
        }, 600);
    };

    const handleCopyWhatsApp = () => {
        const text = `Halo Pengurus ${data.community}, saya ${data.headName} dari rumah ${data.block} No. ${data.houseNumber}. Saya ingin menanyakan status verifikasi keluarga saya di KomunitasHub. Terima kasih.`;
        void navigator.clipboard?.writeText(text);
        setCopiedWhatsApp(true);
        setTimeout(() => setCopiedWhatsApp(false), 2000);
    };

    return (
        <>
            <Head title="Status Verifikasi — KomunitasHub" />

            <div className="flex min-h-screen flex-col bg-[#F7F6F2] font-sans text-[#1D2924] selection:bg-[#2F6B57]/20 selection:text-[#1D2924]">
                {/* 1. HEADER ONBOARDING KONSISTEN */}
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
                                    {data.headName}
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

                {/* 2. PROGRESS ONBOARDING: TAHAP 3 DARI 3 */}
                <div className="border-b border-[#E4E3DC] bg-[#FFFEFA]/60">
                    <div className="mx-auto max-w-5xl px-4 py-2.5 sm:px-6">
                        {/* Desktop 3 Steps */}
                        <div className="hidden items-center justify-center gap-8 text-xs sm:flex">
                            <div className="flex items-center gap-2 font-medium text-[#2F7D5C]">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#2F7D5C]/30 bg-[#EAF4EE] text-[11px] font-bold text-[#2F7D5C]">
                                    <Check className="h-3 w-3 stroke-[2.5]" />
                                </span>
                                <span>Gabung Komunitas</span>
                            </div>
                            <span className="h-px w-8 bg-[#2F7D5C]" />
                            <div className="flex items-center gap-2 font-medium text-[#2F7D5C]">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#2F7D5C]/30 bg-[#EAF4EE] text-[11px] font-bold text-[#2F7D5C]">
                                    <Check className="h-3 w-3 stroke-[2.5]" />
                                </span>
                                <span>Profil Keluarga</span>
                            </div>
                            <span
                                className={`h-px w-8 ${
                                    statusType === 'active'
                                        ? 'bg-[#2F7D5C]'
                                        : statusType === 'rejected'
                                          ? 'bg-[#B74E44]'
                                          : 'bg-[#B87922]'
                                }`}
                            />
                            <div
                                className={`flex items-center gap-2 font-semibold ${
                                    statusType === 'active'
                                        ? 'text-[#2F7D5C]'
                                        : statusType === 'rejected'
                                          ? 'text-[#B74E44]'
                                          : 'text-[#B87922]'
                                }`}
                            >
                                <span
                                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                                        statusType === 'active'
                                            ? 'bg-[#2F7D5C] text-[#FFFEFA]'
                                            : statusType === 'rejected'
                                              ? 'bg-[#B74E44] text-[#FFFEFA]'
                                              : 'border border-[#B87922]/30 bg-[#FAF2E6] text-[#B87922]'
                                    }`}
                                >
                                    {statusType === 'active' ? (
                                        <Check className="h-3 w-3 stroke-[2.5]" />
                                    ) : (
                                        '3'
                                    )}
                                </span>
                                <span>
                                    {statusType === 'active'
                                        ? 'Terverifikasi'
                                        : statusType === 'rejected'
                                          ? 'Belum Disetujui'
                                          : 'Verifikasi Pengurus'}
                                </span>
                            </div>
                        </div>

                        {/* Mobile Progress Indicator */}
                        <div className="space-y-1.5 sm:hidden">
                            <div className="flex items-center justify-between text-xs text-[#66736C]">
                                <span
                                    className={`font-semibold ${
                                        statusType === 'active'
                                            ? 'text-[#2F7D5C]'
                                            : statusType === 'rejected'
                                              ? 'text-[#B74E44]'
                                              : 'text-[#B87922]'
                                    }`}
                                >
                                    Langkah 3 dari 3
                                </span>
                                <span>
                                    {statusType === 'active'
                                        ? 'Akun Aktif'
                                        : 'Verifikasi Pengurus'}
                                </span>
                            </div>
                            <div className="h-1 w-full overflow-hidden rounded-full bg-[#E4E3DC]">
                                <div
                                    className={`h-full rounded-full ${
                                        statusType === 'active'
                                            ? 'w-full bg-[#2F7D5C]'
                                            : statusType === 'rejected'
                                              ? 'w-full bg-[#B74E44]'
                                              : 'w-full bg-[#B87922]'
                                    }`}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. SIMULASI STATE SWITCHER (UNTUK PENGUJIAN DAN DEMONSTRASI) */}
                <div className="border-b border-[#E4E3DC] bg-[#F7F6F2] px-4 py-2">
                    <div className="mx-auto flex max-w-[680px] flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="text-[11px] font-semibold tracking-wider text-[#66736C] uppercase">
                            Simulasi Status Pengurus:
                        </span>
                        <div className="inline-flex rounded-md border border-[#E4E3DC] bg-[#FFFEFA] p-0.5 text-[11px]">
                            <button
                                type="button"
                                onClick={() => setStatusType('pending')}
                                className={`rounded px-2.5 py-1 font-medium transition-colors ${
                                    statusType === 'pending'
                                        ? 'bg-[#B87922] font-bold text-[#FFFEFA]'
                                        : 'text-[#66736C] hover:text-[#1D2924]'
                                }`}
                            >
                                Menunggu
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatusType('needs_revision')}
                                className={`rounded px-2.5 py-1 font-medium transition-colors ${
                                    statusType === 'needs_revision'
                                        ? 'bg-[#C96D3B] font-bold text-[#FFFEFA]'
                                        : 'text-[#66736C] hover:text-[#1D2924]'
                                }`}
                            >
                                Perlu Perbaikan
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatusType('rejected')}
                                className={`rounded px-2.5 py-1 font-medium transition-colors ${
                                    statusType === 'rejected'
                                        ? 'bg-[#B74E44] font-bold text-[#FFFEFA]'
                                        : 'text-[#66736C] hover:text-[#1D2924]'
                                }`}
                            >
                                Belum Disetujui
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatusType('active')}
                                className={`rounded px-2.5 py-1 font-medium transition-colors ${
                                    statusType === 'active'
                                        ? 'bg-[#2F7D5C] font-bold text-[#FFFEFA]'
                                        : 'text-[#66736C] hover:text-[#1D2924]'
                                }`}
                            >
                                Akun Aktif
                            </button>
                        </div>
                    </div>
                </div>

                {/* 4. AREA UTAMA KONTEN ONBOARDING */}
                <main className="flex flex-1 flex-col items-center justify-start px-4 py-8 sm:px-6 sm:py-12">
                    <div className="w-full max-w-[680px] space-y-6">
                        {/* PANEL STATUS UTAMA SESUAI STATE */}

                        {/* STATE A: MENUNGGU VERIFIKASI (DEFAULT) */}
                        {statusType === 'pending' && (
                            <div className="animate-in space-y-5 rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-6 shadow-xs duration-200 fade-in sm:p-8">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#B87922]/30 bg-[#FAF2E6] px-3 py-1 text-xs font-semibold text-[#B87922]">
                                                <Clock className="h-3.5 w-3.5 shrink-0" />
                                                Menunggu Verifikasi
                                            </span>
                                            <span className="text-xs text-[#66736C]">
                                                Pengajuan terkirim
                                            </span>
                                        </div>

                                        <h1 className="text-xl font-bold tracking-tight text-[#1D2924] sm:text-2xl">
                                            Data keluarga Anda sedang
                                            diverifikasi
                                        </h1>
                                    </div>

                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#B87922]/30 bg-[#FAF2E6] text-[#B87922]">
                                        <Clock className="h-5 w-5 stroke-[1.8]" />
                                    </div>
                                </div>

                                <p className="text-xs leading-relaxed text-[#66736C] sm:text-sm">
                                    Pengurus <strong>{data.community}</strong>{' '}
                                    akan memeriksa data rumah dan keluarga Anda.
                                    Setelah disetujui, Anda dapat mulai
                                    menggunakan seluruh layanan komunitas.
                                </p>

                                <div className="flex items-center gap-2 border-t border-[#E4E3DC] pt-2 text-[11px] text-[#66736C]">
                                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#B87922]" />
                                    <span>
                                        Diajukan pada {data.submittedAt}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* STATE B: PERLU PERBAIKAN */}
                        {statusType === 'needs_revision' && (
                            <div className="animate-in space-y-5 rounded-xl border border-[#C96D3B]/40 bg-[#FAECE5]/40 p-6 shadow-xs duration-200 fade-in sm:p-8">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C96D3B]/40 bg-[#FAECE5] px-3 py-1 text-xs font-semibold text-[#C96D3B]">
                                                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                                Perlu Perbaikan
                                            </span>
                                        </div>

                                        <h1 className="text-xl font-bold tracking-tight text-[#1D2924] sm:text-2xl">
                                            Ada data yang perlu dilengkapi
                                        </h1>
                                    </div>

                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#C96D3B]/40 bg-[#FAECE5] text-[#C96D3B]">
                                        <AlertCircle className="h-5 w-5" />
                                    </div>
                                </div>

                                {/* Catatan Resmi dari Pengurus */}
                                <div className="space-y-1.5 rounded-lg border border-[#C96D3B]/30 bg-[#FFFEFA] p-4">
                                    <span className="text-[11px] font-bold tracking-wider text-[#C96D3B] uppercase">
                                        Catatan dari Pengurus RT:
                                    </span>
                                    <p className="text-xs leading-relaxed text-[#1D2924]">
                                        "Mohon periksa kembali nomor rumah. Data
                                        komunitas mencatat alamat Anda sebagai{' '}
                                        <strong>Blok A-21</strong>, bukan Blok
                                        A-12."
                                    </p>
                                </div>

                                <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(true)}
                                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-[#2F6B57] px-5 py-2.5 text-xs font-semibold text-[#FFFEFA] shadow-xs transition-colors hover:bg-[#245442] sm:w-auto"
                                    >
                                        <Edit3 className="h-3.5 w-3.5" />
                                        <span>Perbaiki Data Sekarang</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsWhatsAppModalOpen(true)
                                        }
                                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-[#E4E3DC] bg-[#FFFEFA] px-4 py-2.5 text-xs font-semibold text-[#1D2924] transition-colors hover:bg-[#F7F6F2] sm:w-auto"
                                    >
                                        Hubungi Pengurus
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STATE C: BELUM DISETUJUI / DITOLAK */}
                        {statusType === 'rejected' && (
                            <div className="animate-in space-y-5 rounded-xl border border-[#B74E44]/30 bg-[#FBEBE9]/40 p-6 shadow-xs duration-200 fade-in sm:p-8">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#B74E44]/40 bg-[#FBEBE9] px-3 py-1 text-xs font-semibold text-[#B74E44]">
                                                <XCircle className="h-3.5 w-3.5 shrink-0" />
                                                Belum Disetujui
                                            </span>
                                        </div>

                                        <h1 className="text-xl font-bold tracking-tight text-[#1D2924] sm:text-2xl">
                                            Pengajuan Anda belum dapat disetujui
                                        </h1>
                                    </div>

                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#B74E44]/30 bg-[#FBEBE9] text-[#B74E44]">
                                        <XCircle className="h-5 w-5" />
                                    </div>
                                </div>

                                <div className="space-y-1.5 rounded-lg border border-[#B74E44]/20 bg-[#FFFEFA] p-4">
                                    <span className="text-[11px] font-bold tracking-wider text-[#B74E44] uppercase">
                                        Alasan Pengurus:
                                    </span>
                                    <p className="text-xs leading-relaxed text-[#1D2924]">
                                        "Alamat rumah belum terdaftar pada{' '}
                                        {data.community}."
                                    </p>
                                </div>

                                <p className="text-xs leading-relaxed text-[#66736C]">
                                    Periksa kembali kode komunitas yang Anda
                                    masukkan atau hubungi pengurus RT bila Anda
                                    merasa ini keliru.
                                </p>

                                <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row">
                                    <Link
                                        href="/gabung-komunitas"
                                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-[#2F6B57] px-5 py-2.5 text-xs font-semibold text-[#FFFEFA] shadow-xs transition-colors hover:bg-[#245442] sm:w-auto"
                                    >
                                        <span>Gunakan Kode Komunitas Lain</span>
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsWhatsAppModalOpen(true)
                                        }
                                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-[#E4E3DC] bg-[#FFFEFA] px-4 py-2.5 text-xs font-semibold text-[#1D2924] transition-colors hover:bg-[#F7F6F2] sm:w-auto"
                                    >
                                        Hubungi Pengurus
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STATE D: AKUN AKTIF (TERVERIFIKASI) */}
                        {statusType === 'active' && (
                            <div className="animate-in space-y-5 rounded-xl border border-[#2F7D5C]/30 bg-[#EAF4EE]/40 p-6 shadow-xs duration-200 fade-in sm:p-8">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2F7D5C]/40 bg-[#EAF4EE] px-3 py-1 text-xs font-semibold text-[#2F7D5C]">
                                                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                                                Akun Aktif
                                            </span>
                                            <span className="text-xs font-medium text-[#2F7D5C]">
                                                Terverifikasi Resmi
                                            </span>
                                        </div>

                                        <h1 className="text-xl font-bold tracking-tight text-[#1D2924] sm:text-2xl">
                                            Selamat datang di {data.community}
                                        </h1>
                                    </div>

                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#2F7D5C]/30 bg-[#EAF4EE] text-[#2F7D5C]">
                                        <Check className="h-5 w-5 stroke-[2.5]" />
                                    </div>
                                </div>

                                <p className="text-xs leading-relaxed text-[#66736C] sm:text-sm">
                                    Akun keluarga Anda telah diverifikasi oleh
                                    pengurus. Anda sudah dapat menggunakan
                                    seluruh layanan komunitas.
                                </p>

                                {/* Fitur yang Tersedia Sesuai Mode */}
                                <div className="space-y-2.5 rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] p-4">
                                    <span className="text-[11px] font-bold tracking-wider text-[#2F6B57] uppercase">
                                        Layanan yang Siap Digunakan (
                                        {data.communityMode}):
                                    </span>
                                    <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                                        <div className="space-y-1 rounded bg-[#F7F6F2] p-2.5 text-center">
                                            <Receipt className="mx-auto h-4 w-4 text-[#2F6B57]" />
                                            <div className="font-semibold text-[#1D2924]">
                                                Iuran Warga
                                            </div>
                                        </div>
                                        <div className="space-y-1 rounded bg-[#F7F6F2] p-2.5 text-center">
                                            <FileText className="mx-auto h-4 w-4 text-[#2F6B57]" />
                                            <div className="font-semibold text-[#1D2924]">
                                                Surat Pengantar
                                            </div>
                                        </div>
                                        <div className="space-y-1 rounded bg-[#F7F6F2] p-2.5 text-center">
                                            <Wallet className="mx-auto h-4 w-4 text-[#2F6B57]" />
                                            <div className="font-semibold text-[#1D2924]">
                                                Laporan Kas
                                            </div>
                                        </div>
                                        {data.communityMode ===
                                            'Cluster Aman' && (
                                            <div className="space-y-1 rounded bg-[#F7F6F2] p-2.5 text-center">
                                                <QrCode className="mx-auto h-4 w-4 text-[#2F6B57]" />
                                                <div className="font-semibold text-[#1D2924]">
                                                    Izin Tamu QR
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <Link
                                        href="/dashboard"
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#2F6B57] px-6 py-2.5 text-sm font-semibold text-[#FFFEFA] shadow-xs transition-colors hover:bg-[#245442] sm:w-auto"
                                    >
                                        <span>Buka Ringkasan Warga</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* SECTION: RINGKASAN PENGAJUAN (DETAIL LIST RAPI) */}
                        <div className="space-y-4 rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-6 shadow-xs">
                            <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-3">
                                <div>
                                    <h2 className="text-sm font-bold text-[#1D2924]">
                                        Ringkasan Data Pengajuan
                                    </h2>
                                    <p className="text-[11px] text-[#66736C]">
                                        Data yang telah terkirim ke pengurus
                                        komunitas
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    {statusType !== 'active' && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsEditModalOpen(true)
                                            }
                                            className="text-xs font-semibold text-[#2F6B57] hover:underline"
                                        >
                                            Ubah data pengajuan
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Detail List */}
                            <dl className="grid grid-cols-1 gap-x-6 gap-y-3.5 text-xs sm:grid-cols-2">
                                <div>
                                    <dt className="text-[#66736C]">
                                        Komunitas:
                                    </dt>
                                    <dd className="mt-0.5 font-semibold text-[#1D2924]">
                                        {data.community}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-[#66736C]">
                                        Area & Wilayah:
                                    </dt>
                                    <dd className="mt-0.5 font-semibold text-[#1D2924]">
                                        {data.communityLocation}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-[#66736C]">
                                        Mode Layanan:
                                    </dt>
                                    <dd className="mt-0.5 inline-flex items-center gap-1 font-semibold text-[#2F6B57]">
                                        {data.communityMode ===
                                        'Cluster Aman' ? (
                                            <ShieldCheck className="h-3.5 w-3.5" />
                                        ) : (
                                            <Home className="h-3.5 w-3.5" />
                                        )}
                                        {data.communityMode}
                                    </dd>
                                </div>

                                <div
                                    className={
                                        statusType === 'needs_revision'
                                            ? 'rounded border border-[#C96D3B]/40 bg-[#FAECE5]/40 p-2'
                                            : ''
                                    }
                                >
                                    <dt className="flex items-center justify-between text-[#66736C]">
                                        <span>Alamat Rumah:</span>
                                        {statusType === 'needs_revision' && (
                                            <span className="text-[10px] font-bold text-[#C96D3B]">
                                                Periksa kembali
                                            </span>
                                        )}
                                    </dt>
                                    <dd className="mt-0.5 font-semibold text-[#1D2924]">
                                        {data.block} No. {data.houseNumber}
                                        {data.additionalAddress
                                            ? ` (${data.additionalAddress})`
                                            : ''}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-[#66736C]">
                                        Kepala Keluarga:
                                    </dt>
                                    <dd className="mt-0.5 font-semibold text-[#1D2924]">
                                        {data.headName}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-[#66736C]">
                                        Nomor WhatsApp:
                                    </dt>
                                    <dd className="mt-0.5 font-mono font-medium text-[#1D2924]">
                                        {data.familyPhone}
                                    </dd>
                                </div>

                                <div className="flex items-center justify-between border-t border-[#E4E3DC] pt-1 sm:col-span-2">
                                    <div>
                                        <dt className="text-[#66736C]">
                                            Anggota Keluarga:
                                        </dt>
                                        <dd className="mt-0.5 font-semibold text-[#1D2924]">
                                            {data.totalResidents} Orang Tinggal
                                            Bersama
                                        </dd>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsFullDetailsOpen(
                                                !isFullDetailsOpen,
                                            )
                                        }
                                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#66736C] hover:text-[#1D2924]"
                                    >
                                        <span>
                                            {isFullDetailsOpen
                                                ? 'Tutup rincian'
                                                : 'Lihat data lengkap'}
                                        </span>
                                        {isFullDetailsOpen ? (
                                            <ChevronUp className="h-3.5 w-3.5" />
                                        ) : (
                                            <ChevronDown className="h-3.5 w-3.5" />
                                        )}
                                    </button>
                                </div>
                            </dl>

                            {/* Rincian Anggota Keluarga (Bila Diperluas) */}
                            {isFullDetailsOpen && (
                                <div className="animate-in space-y-2 border-t border-[#E4E3DC] pt-3 duration-150 fade-in">
                                    <span className="text-[11px] font-semibold tracking-wider text-[#66736C] uppercase">
                                        Daftar Anggota Keluarga:
                                    </span>
                                    <div className="divide-y divide-[#E4E3DC] rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] text-xs">
                                        <div className="flex items-center justify-between p-2.5">
                                            <span className="font-semibold text-[#1D2924]">
                                                {data.headName}
                                            </span>
                                            <span className="text-[#66736C]">
                                                Kepala Keluarga
                                            </span>
                                        </div>
                                        {data.familyMembers &&
                                            data.familyMembers.map((m) => (
                                                <div
                                                    key={m.id}
                                                    className="flex items-center justify-between p-2.5"
                                                >
                                                    <span className="font-medium text-[#1D2924]">
                                                        {m.name}
                                                    </span>
                                                    <span className="text-[#66736C]">
                                                        {m.relation}
                                                    </span>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* SECTION: SEMENTARA MENUNGGU (DAFTAR KECIL RAMAH) */}
                        {statusType === 'pending' && (
                            <div className="space-y-3.5 rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-6 shadow-xs">
                                <h3 className="text-xs font-semibold tracking-wider text-[#66736C] uppercase">
                                    Sementara Menunggu
                                </h3>
                                <ul className="space-y-2.5 text-xs text-[#1D2924]">
                                    <li className="flex items-start gap-2.5">
                                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#EBF3EF] text-[10px] font-bold text-[#2F6B57]">
                                            ✓
                                        </span>
                                        <span className="leading-relaxed">
                                            Pengurus akan memeriksa kecocokan
                                            alamat rumah dengan daftar sensus
                                            RT.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#FAF2E6] text-[10px] font-bold text-[#B87922]">
                                            !
                                        </span>
                                        <span className="leading-relaxed">
                                            Jika ada data yang perlu dilengkapi,
                                            Anda akan menerima catatan di
                                            halaman ini.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2.5">
                                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#EBF3EF] text-[10px] font-bold text-[#2F6B57]">
                                            ✓
                                        </span>
                                        <span className="leading-relaxed">
                                            Setelah aktif, Anda dapat melihat
                                            tagihan, mengajukan surat, dan
                                            memakai fitur komunitas.
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        )}

                        {/* SECTION: BATASAN AKSES SEBELUM VERIFIKASI */}
                        {statusType !== 'active' && (
                            <div className="space-y-2.5 rounded-xl border border-[#E4E3DC] bg-[#F7F6F2] p-5 shadow-xs">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#1D2924]">
                                        <Lock className="h-3.5 w-3.5 text-[#2F6B57]" />
                                        <span>Akses Belum Aktif</span>
                                    </div>
                                    <span className="text-[11px] text-[#66736C]">
                                        Menjaga privasi warga
                                    </span>
                                </div>

                                <p className="text-xs leading-relaxed text-[#66736C]">
                                    Fitur warga akan tersedia setelah pengajuan
                                    disetujui oleh pengurus:
                                </p>

                                <div className="grid grid-cols-2 gap-2 pt-1 text-xs opacity-60 select-none sm:grid-cols-4">
                                    <div className="space-y-1 rounded border border-[#E4E3DC] bg-[#FFFEFA] p-2.5 text-center">
                                        <Receipt className="mx-auto h-4 w-4 text-[#66736C]" />
                                        <span className="block text-[11px] font-medium text-[#66736C]">
                                            Iuran Warga
                                        </span>
                                    </div>
                                    <div className="space-y-1 rounded border border-[#E4E3DC] bg-[#FFFEFA] p-2.5 text-center">
                                        <FileText className="mx-auto h-4 w-4 text-[#66736C]" />
                                        <span className="block text-[11px] font-medium text-[#66736C]">
                                            Surat Pengantar
                                        </span>
                                    </div>
                                    <div className="space-y-1 rounded border border-[#E4E3DC] bg-[#FFFEFA] p-2.5 text-center">
                                        <Wallet className="mx-auto h-4 w-4 text-[#66736C]" />
                                        <span className="block text-[11px] font-medium text-[#66736C]">
                                            Laporan Kas
                                        </span>
                                    </div>
                                    {data.communityMode === 'Cluster Aman' && (
                                        <div className="space-y-1 rounded border border-[#E4E3DC] bg-[#FFFEFA] p-2.5 text-center">
                                            <QrCode className="mx-auto h-4 w-4 text-[#66736C]" />
                                            <span className="block text-[11px] font-medium text-[#66736C]">
                                                Izin Tamu QR
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* SECTION: AKSI YANG TERSEDIA DI BAGIAN BAWAH */}
                        <div className="flex flex-col items-center justify-between gap-3 pt-2 text-xs sm:flex-row">
                            <div className="flex w-full items-center gap-3 sm:w-auto">
                                <button
                                    type="button"
                                    onClick={handleCheckStatus}
                                    disabled={isRefreshing}
                                    className="inline-flex items-center justify-center gap-1.5 rounded-md border border-[#E4E3DC] bg-[#FFFEFA] px-4 py-2 text-xs font-semibold text-[#1D2924] shadow-xs transition-colors hover:border-[#1D2924]/20 hover:bg-[#F7F6F2]"
                                >
                                    <RefreshCw
                                        className={`h-3.5 w-3.5 text-[#2F6B57] ${
                                            isRefreshing ? 'animate-spin' : ''
                                        }`}
                                    />
                                    <span>
                                        {isRefreshing
                                            ? 'Memeriksa...'
                                            : 'Periksa Status'}
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setIsWhatsAppModalOpen(true)}
                                    className="font-semibold text-[#2F6B57] hover:underline"
                                >
                                    Hubungi Pengurus Komunitas
                                </button>
                            </div>

                            {lastCheckedText && (
                                <span className="animate-in text-[11px] font-medium text-[#2F7D5C] fade-in">
                                    {lastCheckedText}
                                </span>
                            )}
                        </div>
                    </div>
                </main>

                {/* MODAL UBAH DATA PENGAJUAN (DENGAN PERINGATAN RINGAN) */}
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D2924]/40 p-4 backdrop-blur-xs">
                        <div className="relative w-full max-w-md animate-in overflow-hidden rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] shadow-lg duration-200 zoom-in-95 fade-in">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between border-b border-[#E4E3DC] bg-[#F7F6F2] px-5 py-4">
                                <div>
                                    <h3 className="text-sm font-bold text-[#1D2924]">
                                        Ubah Data Pengajuan
                                    </h3>
                                    <p className="text-[11px] text-[#66736C]">
                                        Perbaiki alamat atau kontak rumah Anda
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="rounded p-1 text-[#66736C] hover:bg-[#E4E3DC]/40 hover:text-[#1D2924]"
                                    aria-label="Tutup form ubah"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Modal Body Form */}
                            <form
                                onSubmit={handleSaveEdit}
                                className="space-y-4 p-5 text-xs"
                            >
                                {/* Peringatan Ringan */}
                                <div className="flex items-start gap-2 rounded-lg border border-[#B87922]/30 bg-[#FAF2E6] p-3 text-[11px] text-[#B87922]">
                                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                    <span>
                                        Perubahan data akan memperbarui
                                        pengajuan Anda untuk ditinjau kembali
                                        oleh pengurus.
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label
                                            htmlFor="edit-block"
                                            className="block text-[11px] font-semibold tracking-wider text-[#1D2924] uppercase"
                                        >
                                            Blok / Jalan
                                        </label>
                                        <input
                                            id="edit-block"
                                            type="text"
                                            required
                                            value={editBlock}
                                            onChange={(e) =>
                                                setEditBlock(e.target.value)
                                            }
                                            className="w-full rounded-md border border-[#E4E3DC] bg-[#FFFEFA] px-3 py-2 text-xs text-[#1D2924] focus:border-[#2F6B57] focus:ring-1 focus:ring-[#2F6B57] focus:outline-none"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label
                                            htmlFor="edit-house"
                                            className="block text-[11px] font-semibold tracking-wider text-[#1D2924] uppercase"
                                        >
                                            Nomor Rumah
                                        </label>
                                        <input
                                            id="edit-house"
                                            type="text"
                                            required
                                            value={editHouseNumber}
                                            onChange={(e) =>
                                                setEditHouseNumber(
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-md border border-[#E4E3DC] bg-[#FFFEFA] px-3 py-2 text-xs text-[#1D2924] focus:border-[#2F6B57] focus:ring-1 focus:ring-[#2F6B57] focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label
                                        htmlFor="edit-phone"
                                        className="block text-[11px] font-semibold tracking-wider text-[#1D2924] uppercase"
                                    >
                                        Nomor WhatsApp Keluarga
                                    </label>
                                    <input
                                        id="edit-phone"
                                        type="tel"
                                        required
                                        value={editPhone}
                                        onChange={(e) =>
                                            setEditPhone(e.target.value)
                                        }
                                        className="w-full rounded-md border border-[#E4E3DC] bg-[#FFFEFA] px-3 py-2 text-xs text-[#1D2924] focus:border-[#2F6B57] focus:ring-1 focus:ring-[#2F6B57] focus:outline-none"
                                    />
                                </div>

                                {/* Modal Footer */}
                                <div className="flex items-center justify-end gap-2.5 border-t border-[#E4E3DC] pt-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsEditModalOpen(false)
                                        }
                                        className="px-3.5 py-2 text-xs font-semibold text-[#66736C] hover:text-[#1D2924]"
                                    >
                                        Batal
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={isSubmittingEdit}
                                        className="inline-flex items-center gap-1.5 rounded-md bg-[#2F6B57] px-4 py-2 text-xs font-semibold text-[#FFFEFA] shadow-xs transition-colors hover:bg-[#245442]"
                                    >
                                        {isSubmittingEdit ? (
                                            <>
                                                <Spinner className="h-3.5 w-3.5 text-[#FFFEFA]" />
                                                <span>Menyimpan...</span>
                                            </>
                                        ) : (
                                            <span>Perbarui Pengajuan</span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL HUBUNGI PENGURUS KOMUNITAS VIA WHATSAPP */}
                {isWhatsAppModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D2924]/40 p-4 backdrop-blur-xs">
                        <div className="relative w-full max-w-md animate-in overflow-hidden rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] shadow-lg duration-200 zoom-in-95 fade-in">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between border-b border-[#E4E3DC] bg-[#F7F6F2] px-5 py-3.5">
                                <h3 className="flex items-center gap-2 text-sm font-bold text-[#1D2924]">
                                    <ShieldCheck className="h-4 w-4 text-[#2F6B57]" />
                                    Hubungi Pengurus {data.community}
                                </h3>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsWhatsAppModalOpen(false)
                                    }
                                    className="rounded p-1 text-[#66736C] hover:bg-[#E4E3DC]/40 hover:text-[#1D2924]"
                                    aria-label="Tutup dialog"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="space-y-4 p-5 text-xs text-[#1D2924]">
                                <p className="leading-relaxed text-[#66736C]">
                                    Anda dapat mengirim pesan langsung ke
                                    sekretariat atau Ketua RT untuk menanyakan
                                    proses verifikasi data domisili keluarga
                                    Anda.
                                </p>

                                <div className="space-y-2 rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] p-3.5">
                                    <span className="font-semibold text-[#1D2924]">
                                        Template Pesan WhatsApp Resmi:
                                    </span>
                                    <p className="rounded border border-[#E4E3DC] bg-[#FFFEFA] p-2.5 font-mono text-[11px] leading-relaxed text-[#1D2924]">
                                        "Halo Pengurus {data.community}, saya{' '}
                                        {data.headName} dari rumah {data.block}{' '}
                                        No. {data.houseNumber}. Saya ingin
                                        menanyakan status verifikasi keluarga
                                        saya di KomunitasHub. Terima kasih."
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleCopyWhatsApp}
                                        className="inline-flex items-center gap-1.5 pt-1 text-xs font-semibold text-[#2F6B57] hover:underline"
                                    >
                                        {copiedWhatsApp ? (
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

                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsWhatsAppModalOpen(false)
                                        }
                                        className="rounded-md border border-[#E4E3DC] px-4 py-2 text-xs font-semibold text-[#66736C] hover:bg-[#F7F6F2]"
                                    >
                                        Tutup
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleCopyWhatsApp();
                                            setIsWhatsAppModalOpen(false);
                                        }}
                                        className="rounded-md bg-[#2F6B57] px-4 py-2 text-xs font-semibold text-[#FFFEFA] transition-colors hover:bg-[#245442]"
                                    >
                                        Salin & Siap Kirim
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
