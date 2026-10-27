import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { BrandLogo } from '@/components/komunitashub/brand-logo';
import { Spinner } from '@/components/ui/spinner';
import {
    Check,
    Building2,
    ShieldCheck,
    ArrowRight,
    Plus,
    Trash2,
    AlertCircle,
    X,
    LogOut,
} from 'lucide-react';

interface FamilyMember {
    id: string;
    name: string;
    relation: 'Pasangan' | 'Anak' | 'Orang Tua' | 'Saudara' | 'Lainnya';
}

export default function CompleteFamilyProfile() {
    const { auth } = usePage().props as {
        auth: { user?: { name: string; email: string } };
    };

    const initialUserName = auth?.user?.name || 'Budi Santoso';
    const userInitials = initialUserName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    // Step state: 1 (Data Rumah) -> 2 (Data Keluarga)
    const [step, setStep] = useState<1 | 2>(1);

    // Community info
    const communityInfo = {
        name: 'Komunitas Puri Taman Sari',
        location: 'RT 04 / RW 09 · Kelurahan Sukamaju',
        mode: 'Cluster Aman' as const,
    };

    // Step 1: Data Tempat Tinggal State
    const [block, setBlock] = useState('Blok A');
    const [houseNumber, setHouseNumber] = useState('12');
    const [additionalAddress, setAdditionalAddress] = useState('');
    const [familyPhone, setFamilyPhone] = useState('081234567890');
    const [emergencyPhone, setEmergencyPhone] = useState('');
    const [step1Errors, setStep1Errors] = useState<{
        block?: string;
        houseNumber?: string;
        familyPhone?: string;
    }>({});

    // Step 2: Data Keluarga State
    const [headName, setHeadName] = useState(initialUserName);
    const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
        { id: '1', name: 'Siti Rahmawati', relation: 'Pasangan' },
        { id: '2', name: 'Ahmad Farhan', relation: 'Anak' },
    ]);
    const [agreed, setAgreed] = useState(false);
    const [step2Errors, setStep2Errors] = useState<{
        headName?: string;
        members?: string;
        agreed?: string;
    }>({});

    // Review Modal State
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Validate Step 1
    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        const errors: {
            block?: string;
            houseNumber?: string;
            familyPhone?: string;
        } = {};

        if (!block.trim()) {
            errors.block = 'Blok atau nama jalan perlu diisi.';
        }
        if (!houseNumber.trim()) {
            errors.houseNumber = 'Nomor rumah perlu diisi.';
        }
        const cleanPhone = familyPhone.replace(/\D/g, '');
        if (!cleanPhone || cleanPhone.length < 10) {
            errors.familyPhone =
                'Masukkan nomor WhatsApp yang valid (minimal 10 digit).';
        }

        if (Object.keys(errors).length > 0) {
            setStep1Errors(errors);
            return;
        }

        setStep1Errors({});
        setStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Add Family Member Row
    const handleAddMember = () => {
        const newId = String(Date.now());
        setFamilyMembers((prev) => [
            ...prev,
            { id: newId, name: '', relation: 'Anak' },
        ]);
    };

    // Update Family Member
    const handleUpdateMember = (
        id: string,
        field: 'name' | 'relation',
        val: string,
    ) => {
        setFamilyMembers((prev) =>
            prev.map((m) => (m.id === id ? { ...m, [field]: val } : m)),
        );
    };

    // Delete Family Member
    const handleDeleteMember = (id: string) => {
        setFamilyMembers((prev) => prev.filter((m) => m.id !== id));
    };

    // Validate Step 2 and Open Review Modal
    const handleOpenReview = (e: React.FormEvent) => {
        e.preventDefault();
        const errors: {
            headName?: string;
            agreed?: string;
        } = {};

        if (!headName.trim() || headName.trim().length < 3) {
            errors.headName = 'Nama lengkap kepala keluarga wajib diisi.';
        }
        if (!agreed) {
            errors.agreed =
                'Anda perlu menyetujui pernyataan kebenaran data keluarga.';
        }

        if (Object.keys(errors).length > 0) {
            setStep2Errors(errors);
            return;
        }

        setStep2Errors({});
        setIsReviewModalOpen(true);
    };

    // Final Submission
    const handleFinalSubmit = () => {
        setIsSubmitting(true);

        const submissionData = {
            community: communityInfo.name,
            communityLocation: communityInfo.location,
            communityMode: communityInfo.mode,
            block,
            houseNumber,
            additionalAddress,
            familyPhone,
            emergencyPhone,
            headName,
            familyMembers: familyMembers.filter(
                (m) => m.name.trim().length > 0,
            ),
            totalResidents:
                1 +
                familyMembers.filter((m) => m.name.trim().length > 0).length,
            submittedAt: new Date().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }),
        };

        try {
            sessionStorage.setItem(
                'komunitashub_submission',
                JSON.stringify(submissionData),
            );
        } catch {
            // Ignore sessionStorage limitations in sandboxed if any
        }

        setTimeout(() => {
            setIsSubmitting(false);
            setIsReviewModalOpen(false);
            router.visit('/menunggu-verifikasi');
        }, 650);
    };

    return (
        <>
            <Head title="Lengkapi Profil Keluarga — KomunitasHub" />

            <div className="flex min-h-screen flex-col bg-[#F7F6F2] font-sans text-[#1D2924] selection:bg-[#2F6B57]/20 selection:text-[#1D2924]">
                {/* 1. HEADER ONBOARDING TIPIS & KONSISTEN */}
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
                                    {headName || initialUserName}
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

                {/* 2. PROGRESS ONBOARDING: LANGKAH 2 DARI 3 */}
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
                            <div className="flex items-center gap-2 font-semibold text-[#2F6B57]">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2F6B57] text-[11px] text-[#FFFEFA]">
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
                                    Langkah 2 dari 3
                                </span>
                                <span>Profil Keluarga</span>
                            </div>
                            <div className="h-1 w-full overflow-hidden rounded-full bg-[#E4E3DC]">
                                <div className="h-full w-2/3 rounded-full bg-[#2F6B57]" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. AREA KONTEN UTAMA */}
                <main className="flex flex-1 flex-col items-center justify-start px-4 py-8 sm:px-6 sm:py-12">
                    <div className="w-full max-w-[620px] space-y-5">
                        {/* KONTEKS KOMUNITAS TERPILIH (INFO STRIP RINGKAS) */}
                        <div className="flex flex-col justify-between gap-2 rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] p-3 shadow-2xs sm:flex-row sm:items-center sm:px-4 sm:py-3">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[#2F6B57]/20 bg-[#EBF3EF] text-[#2F6B57]">
                                    <Building2 className="h-4 w-4" />
                                </div>
                                <div className="space-y-0.5">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-xs font-bold text-[#1D2924]">
                                            {communityInfo.name}
                                        </span>
                                        <span className="inline-flex items-center gap-1 rounded bg-[#EBF3EF] px-1.5 py-0.5 text-[10px] font-semibold text-[#2F6B57]">
                                            <ShieldCheck className="h-3 w-3" />
                                            {communityInfo.mode}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-[#66736C]">
                                        {communityInfo.location}
                                    </p>
                                </div>
                            </div>

                            <Link
                                href="/gabung-komunitas"
                                className="self-start text-[11px] font-semibold text-[#66736C] transition-colors hover:text-[#2F6B57] sm:self-auto"
                            >
                                Ganti kode komunitas
                            </Link>
                        </div>

                        {/* FORM CONTAINER SURFACE */}
                        <div className="space-y-6 rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-6 shadow-xs sm:p-8">
                            {/* TAHAP 1: DATA TEMPAT TINGGAL */}
                            {step === 1 && (
                                <form
                                    onSubmit={handleNextStep}
                                    className="animate-in space-y-6 duration-200 fade-in motion-reduce:animate-none"
                                >
                                    <div className="space-y-1">
                                        <span className="text-[11px] font-semibold tracking-wider text-[#2F6B57] uppercase">
                                            Tahap 1 dari 2
                                        </span>
                                        <h2 className="text-xl font-bold tracking-tight text-[#1D2924] sm:text-2xl">
                                            Data tempat tinggal
                                        </h2>
                                        <p className="text-xs leading-relaxed text-[#66736C] sm:text-sm">
                                            Gunakan alamat rumah yang terdaftar
                                            di komunitas Anda.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Grid Blok & Nomor Rumah */}
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            {/* Field: Blok / Jalan */}
                                            <div className="space-y-1">
                                                <label
                                                    htmlFor="home-block"
                                                    className="block text-xs font-semibold tracking-wider text-[#1D2924] uppercase"
                                                >
                                                    Blok / Jalan{' '}
                                                    <span className="text-[11px] font-normal text-[#66736C] normal-case">
                                                        (Wajib)
                                                    </span>
                                                </label>
                                                <input
                                                    id="home-block"
                                                    type="text"
                                                    autoFocus
                                                    value={block}
                                                    onChange={(e) => {
                                                        setBlock(
                                                            e.target.value,
                                                        );
                                                        if (step1Errors.block) {
                                                            setStep1Errors(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    block: undefined,
                                                                }),
                                                            );
                                                        }
                                                    }}
                                                    placeholder="Contoh: Blok A"
                                                    className={`w-full rounded-md border bg-[#FFFEFA] px-3.5 py-2.5 text-sm text-[#1D2924] transition-colors placeholder:text-[#66736C]/60 focus:ring-1 focus:outline-none ${
                                                        step1Errors.block
                                                            ? 'border-[#B74E44] focus:border-[#B74E44] focus:ring-[#B74E44]'
                                                            : 'border-[#E4E3DC] focus:border-[#2F6B57] focus:ring-[#2F6B57]'
                                                    }`}
                                                />
                                                {step1Errors.block && (
                                                    <span className="flex items-center gap-1 pt-0.5 text-[11px] font-medium text-[#B74E44]">
                                                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                                        {step1Errors.block}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Field: Nomor Rumah */}
                                            <div className="space-y-1">
                                                <label
                                                    htmlFor="home-number"
                                                    className="block text-xs font-semibold tracking-wider text-[#1D2924] uppercase"
                                                >
                                                    Nomor Rumah{' '}
                                                    <span className="text-[11px] font-normal text-[#66736C] normal-case">
                                                        (Wajib)
                                                    </span>
                                                </label>
                                                <input
                                                    id="home-number"
                                                    type="text"
                                                    value={houseNumber}
                                                    onChange={(e) => {
                                                        setHouseNumber(
                                                            e.target.value,
                                                        );
                                                        if (
                                                            step1Errors.houseNumber
                                                        ) {
                                                            setStep1Errors(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    houseNumber:
                                                                        undefined,
                                                                }),
                                                            );
                                                        }
                                                    }}
                                                    placeholder="Contoh: 12"
                                                    className={`w-full rounded-md border bg-[#FFFEFA] px-3.5 py-2.5 text-sm text-[#1D2924] transition-colors placeholder:text-[#66736C]/60 focus:ring-1 focus:outline-none ${
                                                        step1Errors.houseNumber
                                                            ? 'border-[#B74E44] focus:border-[#B74E44] focus:ring-[#B74E44]'
                                                            : 'border-[#E4E3DC] focus:border-[#2F6B57] focus:ring-[#2F6B57]'
                                                    }`}
                                                />
                                                {step1Errors.houseNumber && (
                                                    <span className="flex items-center gap-1 pt-0.5 text-[11px] font-medium text-[#B74E44]">
                                                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                                        {
                                                            step1Errors.houseNumber
                                                        }
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Field: Alamat Tambahan / Catatan Patokan */}
                                        <div className="space-y-1">
                                            <label
                                                htmlFor="additional-address"
                                                className="block text-xs font-semibold tracking-wider text-[#1D2924] uppercase"
                                            >
                                                Alamat Tambahan / Patokan{' '}
                                                <span className="text-[11px] font-normal text-[#66736C] normal-case">
                                                    (Opsional)
                                                </span>
                                            </label>
                                            <input
                                                id="additional-address"
                                                type="text"
                                                value={additionalAddress}
                                                onChange={(e) =>
                                                    setAdditionalAddress(
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Contoh: Cluster Melati, dekat pos satpam barat"
                                                className="w-full rounded-md border border-[#E4E3DC] bg-[#FFFEFA] px-3.5 py-2.5 text-sm text-[#1D2924] placeholder:text-[#66736C]/60 focus:border-[#2F6B57] focus:ring-1 focus:ring-[#2F6B57] focus:outline-none"
                                            />
                                        </div>

                                        {/* Field: Nomor WhatsApp Keluarga */}
                                        <div className="space-y-1">
                                            <label
                                                htmlFor="family-phone"
                                                className="block text-xs font-semibold tracking-wider text-[#1D2924] uppercase"
                                            >
                                                Nomor WhatsApp Keluarga{' '}
                                                <span className="text-[11px] font-normal text-[#66736C] normal-case">
                                                    (Wajib)
                                                </span>
                                            </label>
                                            <input
                                                id="family-phone"
                                                type="tel"
                                                value={familyPhone}
                                                onChange={(e) => {
                                                    setFamilyPhone(
                                                        e.target.value,
                                                    );
                                                    if (
                                                        step1Errors.familyPhone
                                                    ) {
                                                        setStep1Errors(
                                                            (prev) => ({
                                                                ...prev,
                                                                familyPhone:
                                                                    undefined,
                                                            }),
                                                        );
                                                    }
                                                }}
                                                placeholder="Contoh: 0812 3456 7890"
                                                className={`w-full rounded-md border bg-[#FFFEFA] px-3.5 py-2.5 text-sm text-[#1D2924] transition-colors placeholder:text-[#66736C]/60 focus:ring-1 focus:outline-none ${
                                                    step1Errors.familyPhone
                                                        ? 'border-[#B74E44] focus:border-[#B74E44] focus:ring-[#B74E44]'
                                                        : 'border-[#E4E3DC] focus:border-[#2F6B57] focus:ring-[#2F6B57]'
                                                }`}
                                            />
                                            {step1Errors.familyPhone ? (
                                                <span className="flex items-center gap-1 pt-0.5 text-[11px] font-medium text-[#B74E44]">
                                                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                                    {step1Errors.familyPhone}
                                                </span>
                                            ) : (
                                                <p className="text-[11px] text-[#66736C]">
                                                    Nomor ini digunakan untuk
                                                    informasi penting dari
                                                    komunitas.
                                                </p>
                                            )}
                                        </div>

                                        {/* Field: Nomor Kontak Darurat (Opsional) */}
                                        <div className="space-y-1">
                                            <label
                                                htmlFor="emergency-phone"
                                                className="block text-xs font-semibold tracking-wider text-[#1D2924] uppercase"
                                            >
                                                Nomor Kontak Darurat{' '}
                                                <span className="text-[11px] font-normal text-[#66736C] normal-case">
                                                    (Opsional)
                                                </span>
                                            </label>
                                            <input
                                                id="emergency-phone"
                                                type="tel"
                                                value={emergencyPhone}
                                                onChange={(e) =>
                                                    setEmergencyPhone(
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Contoh: 0813 9876 5432"
                                                className="w-full rounded-md border border-[#E4E3DC] bg-[#FFFEFA] px-3.5 py-2.5 text-sm text-[#1D2924] placeholder:text-[#66736C]/60 focus:border-[#2F6B57] focus:ring-1 focus:ring-[#2F6B57] focus:outline-none"
                                            />
                                            <p className="text-[11px] text-[#66736C]">
                                                Dihubungi hanya pada keadaan
                                                mendesak di lingkungan.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Buttons Step 1 */}
                                    <div className="flex items-center justify-between gap-3 border-t border-[#E4E3DC] pt-4">
                                        <Link
                                            href="/gabung-komunitas"
                                            className="px-4 py-2.5 text-xs font-semibold text-[#66736C] transition-colors hover:text-[#1D2924]"
                                        >
                                            Kembali
                                        </Link>

                                        <button
                                            type="submit"
                                            className="inline-flex items-center gap-2 rounded-md bg-[#2F6B57] px-6 py-2.5 text-sm font-semibold text-[#FFFEFA] shadow-xs transition-colors hover:bg-[#245442]"
                                        >
                                            <span>Lanjutkan</span>
                                            <ArrowRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* TAHAP 2: DATA KELUARGA */}
                            {step === 2 && (
                                <form
                                    onSubmit={handleOpenReview}
                                    className="animate-in space-y-6 duration-200 fade-in motion-reduce:animate-none"
                                >
                                    <div className="space-y-1">
                                        <span className="text-[11px] font-semibold tracking-wider text-[#2F6B57] uppercase">
                                            Tahap 2 dari 2
                                        </span>
                                        <h2 className="text-xl font-bold tracking-tight text-[#1D2924] sm:text-2xl">
                                            Data keluarga
                                        </h2>
                                        <p className="text-xs leading-relaxed text-[#66736C] sm:text-sm">
                                            Tambahkan anggota keluarga yang
                                            tinggal di rumah ini.
                                        </p>
                                    </div>

                                    {/* Bagian Kepala Keluarga */}
                                    <div className="space-y-2 rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] p-4">
                                        <label
                                            htmlFor="head-name"
                                            className="block text-xs font-semibold tracking-wider text-[#1D2924] uppercase"
                                        >
                                            Nama Lengkap Kepala Keluarga{' '}
                                            <span className="text-[11px] font-normal text-[#66736C] normal-case">
                                                (Wajib)
                                            </span>
                                        </label>
                                        <input
                                            id="head-name"
                                            type="text"
                                            autoFocus
                                            value={headName}
                                            onChange={(e) => {
                                                setHeadName(e.target.value);
                                                if (step2Errors.headName) {
                                                    setStep2Errors((prev) => ({
                                                        ...prev,
                                                        headName: undefined,
                                                    }));
                                                }
                                            }}
                                            placeholder="Contoh: Budi Santoso"
                                            className={`w-full rounded-md border bg-[#FFFEFA] px-3.5 py-2.5 text-sm text-[#1D2924] transition-colors placeholder:text-[#66736C]/60 focus:ring-1 focus:outline-none ${
                                                step2Errors.headName
                                                    ? 'border-[#B74E44] focus:border-[#B74E44] focus:ring-[#B74E44]'
                                                    : 'border-[#E4E3DC] focus:border-[#2F6B57] focus:ring-[#2F6B57]'
                                            }`}
                                        />
                                        {step2Errors.headName ? (
                                            <span className="flex items-center gap-1 pt-0.5 text-[11px] font-medium text-[#B74E44]">
                                                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                                {step2Errors.headName}
                                            </span>
                                        ) : (
                                            <p className="text-[11px] font-medium text-[#2F6B57]">
                                                Akun ini akan mewakili keluarga{' '}
                                                <strong>
                                                    {headName || 'Anda'}
                                                </strong>
                                                .
                                            </p>
                                        )}
                                    </div>

                                    {/* Bagian Anggota Keluarga Lainnya */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-xs font-semibold tracking-wider text-[#1D2924] uppercase">
                                                    Anggota Keluarga yang
                                                    Tinggal Bersama
                                                </h3>
                                                <p className="text-[11px] text-[#66736C]">
                                                    Kepala keluarga tidak perlu
                                                    didaftarkan ulang di bawah.
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={handleAddMember}
                                                className="inline-flex items-center gap-1 text-xs font-semibold text-[#2F6B57] hover:text-[#245442] hover:underline"
                                            >
                                                <Plus className="h-3.5 w-3.5" />
                                                <span>Tambah Anggota</span>
                                            </button>
                                        </div>

                                        {/* Daftar Vertikal Anggota Keluarga */}
                                        <div className="space-y-2.5">
                                            {familyMembers.length === 0 ? (
                                                <div className="rounded-lg border border-dashed border-[#E4E3DC] p-4 text-center text-xs text-[#66736C]">
                                                    Belum ada anggota keluarga
                                                    tambahan. Klik tombol{' '}
                                                    <strong>
                                                        + Tambah Anggota
                                                    </strong>{' '}
                                                    jika ada anggota keluarga
                                                    lain yang tinggal di rumah
                                                    ini.
                                                </div>
                                            ) : (
                                                familyMembers.map(
                                                    (member, idx) => (
                                                        <div
                                                            key={member.id}
                                                            className="flex flex-col items-stretch gap-2 rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] p-3 transition-colors hover:border-[#1D2924]/20 sm:flex-row sm:items-center"
                                                        >
                                                            <div className="hidden w-6 shrink-0 font-mono text-xs font-semibold text-[#66736C] sm:block">
                                                                #{idx + 1}
                                                            </div>

                                                            {/* Nama Anggota */}
                                                            <div className="flex-1">
                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        member.name
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        handleUpdateMember(
                                                                            member.id,
                                                                            'name',
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    placeholder="Nama lengkap anggota keluarga"
                                                                    className="w-full rounded-md border border-[#E4E3DC] bg-[#FFFEFA] px-3 py-1.5 text-xs text-[#1D2924] placeholder:text-[#66736C]/60 focus:border-[#2F6B57] focus:ring-1 focus:ring-[#2F6B57] focus:outline-none"
                                                                />
                                                            </div>

                                                            {/* Dropdown Hubungan */}
                                                            <div className="w-full sm:w-36">
                                                                <select
                                                                    value={
                                                                        member.relation
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        handleUpdateMember(
                                                                            member.id,
                                                                            'relation',
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    className="w-full rounded-md border border-[#E4E3DC] bg-[#FFFEFA] px-2.5 py-1.5 text-xs text-[#1D2924] focus:border-[#2F6B57] focus:ring-1 focus:ring-[#2F6B57] focus:outline-none"
                                                                >
                                                                    <option value="Pasangan">
                                                                        Pasangan
                                                                        (Istri/Suami)
                                                                    </option>
                                                                    <option value="Anak">
                                                                        Anak
                                                                    </option>
                                                                    <option value="Orang Tua">
                                                                        Orang
                                                                        Tua
                                                                    </option>
                                                                    <option value="Saudara">
                                                                        Saudara
                                                                    </option>
                                                                    <option value="Lainnya">
                                                                        Lainnya
                                                                    </option>
                                                                </select>
                                                            </div>

                                                            {/* Tombol Hapus Row */}
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDeleteMember(
                                                                        member.id,
                                                                    )
                                                                }
                                                                className="self-end rounded p-1.5 text-[#66736C] transition-colors hover:bg-[#FBEBE9] hover:text-[#B74E44] sm:self-center"
                                                                aria-label={`Hapus anggota ${member.name || idx + 1}`}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    ),
                                                )
                                            )}
                                        </div>

                                        <p className="pt-0.5 text-[11px] text-[#66736C] italic">
                                            * Tidak perlu mengunggah foto KTP,
                                            Kartu Keluarga, atau dokumen fisik
                                            pada tahap ini.
                                        </p>
                                    </div>

                                    {/* Pernyataan Persetujuan */}
                                    <div className="pt-2">
                                        <div className="flex items-start gap-2">
                                            <input
                                                id="agree-declaration"
                                                type="checkbox"
                                                checked={agreed}
                                                onChange={(e) => {
                                                    setAgreed(e.target.checked);
                                                    if (step2Errors.agreed) {
                                                        setStep2Errors(
                                                            (prev) => ({
                                                                ...prev,
                                                                agreed: undefined,
                                                            }),
                                                        );
                                                    }
                                                }}
                                                className="mt-0.5 h-4 w-4 rounded border-[#E4E3DC] text-[#2F6B57] focus:ring-[#2F6B57]"
                                            />
                                            <label
                                                htmlFor="agree-declaration"
                                                className="cursor-pointer text-xs leading-snug text-[#1D2924] select-none"
                                            >
                                                Dengan mengirim data ini, saya
                                                menyatakan bahwa informasi
                                                keluarga dan alamat rumah sudah
                                                benar.
                                            </label>
                                        </div>
                                        {step2Errors.agreed && (
                                            <span className="flex items-center gap-1 pt-1 text-[11px] font-medium text-[#B74E44]">
                                                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                                {step2Errors.agreed}
                                            </span>
                                        )}
                                    </div>

                                    {/* Action Buttons Step 2 */}
                                    <div className="flex items-center justify-between gap-3 border-t border-[#E4E3DC] pt-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setStep(1);
                                                window.scrollTo({
                                                    top: 0,
                                                    behavior: 'smooth',
                                                });
                                            }}
                                            className="px-4 py-2.5 text-xs font-semibold text-[#66736C] transition-colors hover:text-[#1D2924]"
                                        >
                                            Kembali ke Data Rumah
                                        </button>

                                        <button
                                            type="submit"
                                            className="inline-flex items-center gap-2 rounded-md bg-[#2F6B57] px-6 py-2.5 text-sm font-semibold text-[#FFFEFA] shadow-xs transition-colors hover:bg-[#245442]"
                                        >
                                            <span>Ajukan Verifikasi</span>
                                            <ArrowRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </main>

                {/* 4. MODAL REVIEW KONFIRMASI SEBELUM SUBMIT */}
                {isReviewModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D2924]/40 p-4 backdrop-blur-xs">
                        <div className="relative w-full max-w-lg animate-in overflow-hidden rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] shadow-lg duration-200 zoom-in-95 fade-in">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between border-b border-[#E4E3DC] bg-[#F7F6F2] px-6 py-4">
                                <div>
                                    <h3 className="text-base font-bold text-[#1D2924]">
                                        Tinjau Data Pengajuan Warga
                                    </h3>
                                    <p className="text-xs text-[#66736C]">
                                        Pastikan data sudah benar sebelum
                                        diajukan ke pengurus
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsReviewModalOpen(false)}
                                    className="rounded p-1 text-[#66736C] hover:bg-[#E4E3DC]/40 hover:text-[#1D2924]"
                                    aria-label="Tutup pratinjau"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Modal Body / Summary Card */}
                            <div className="space-y-4 p-6 text-xs text-[#1D2924]">
                                <div className="divide-y divide-[#E4E3DC] overflow-hidden rounded-lg border border-[#E4E3DC] bg-[#FFFEFA]">
                                    <div className="flex items-center justify-between bg-[#F7F6F2] p-3 font-semibold">
                                        <span>Komunitas Tujuan</span>
                                        <span className="text-[#2F6B57]">
                                            {communityInfo.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3">
                                        <span className="text-[#66736C]">
                                            Alamat Rumah:
                                        </span>
                                        <span className="text-right font-semibold">
                                            {block} No. {houseNumber}
                                            {additionalAddress
                                                ? ` (${additionalAddress})`
                                                : ''}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3">
                                        <span className="text-[#66736C]">
                                            Kepala Keluarga:
                                        </span>
                                        <span className="font-semibold">
                                            {headName}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3">
                                        <span className="text-[#66736C]">
                                            Nomor WhatsApp:
                                        </span>
                                        <span className="font-mono font-medium">
                                            {familyPhone}
                                        </span>
                                    </div>
                                    {emergencyPhone && (
                                        <div className="flex items-center justify-between p-3">
                                            <span className="text-[#66736C]">
                                                Kontak Darurat:
                                            </span>
                                            <span className="font-mono">
                                                {emergencyPhone}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex items-start justify-between p-3">
                                        <span className="text-[#66736C]">
                                            Anggota Keluarga:
                                        </span>
                                        <div className="space-y-0.5 text-right">
                                            <div className="font-semibold">
                                                {1 +
                                                    familyMembers.filter(
                                                        (m) =>
                                                            m.name.trim()
                                                                .length > 0,
                                                    ).length}{' '}
                                                Orang
                                            </div>
                                            {familyMembers
                                                .filter(
                                                    (m) =>
                                                        m.name.trim().length >
                                                        0,
                                                )
                                                .map((m) => (
                                                    <div
                                                        key={m.id}
                                                        className="text-[11px] text-[#66736C]"
                                                    >
                                                        {m.name} ({m.relation})
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </div>

                                <p className="text-[11px] leading-relaxed text-[#66736C]">
                                    Pengurus RT / Admin Komunitas akan
                                    memverifikasi keabsahan alamat domisili ini
                                    sebelum mengaktifkan akun Anda.
                                </p>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-end gap-3 border-t border-[#E4E3DC] bg-[#F7F6F2] px-6 py-3.5">
                                <button
                                    type="button"
                                    onClick={() => setIsReviewModalOpen(false)}
                                    className="px-4 py-2 text-xs font-semibold text-[#66736C] transition-colors hover:text-[#1D2924]"
                                >
                                    Perbaiki Data
                                </button>

                                <button
                                    type="button"
                                    onClick={handleFinalSubmit}
                                    disabled={isSubmitting}
                                    className="inline-flex items-center gap-2 rounded-md bg-[#2F6B57] px-5 py-2 text-xs font-semibold text-[#FFFEFA] shadow-xs transition-colors hover:bg-[#245442] disabled:opacity-70"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Spinner className="h-3.5 w-3.5 text-[#FFFEFA]" />
                                            <span>
                                                Mengajukan verifikasi...
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Kirim Pengajuan</span>
                                            <ArrowRight className="h-3.5 w-3.5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
