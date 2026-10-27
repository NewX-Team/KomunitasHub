import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { BrandLogo } from '@/components/komunitashub/brand-logo';
import { Check, Clock, Edit3, ArrowLeft, Lock, LogOut } from 'lucide-react';

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
    familyMembers?: Array<{ id: string; name: string; relation: string }>;
    totalResidents: number;
    submittedAt: string;
}

const defaultFallbackData: SubmissionData = {
    community: 'Komunitas Puri Taman Sari',
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
    submittedAt: 'Hari ini',
};

export default function PendingVerification() {
    const { auth } = usePage().props as {
        auth: { user?: { name: string; email: string } };
    };

    const [data, setData] = useState<SubmissionData>(defaultFallbackData);

    useEffect(() => {
        try {
            const saved = sessionStorage.getItem('komunitashub_submission');
            if (saved) {
                const parsed = JSON.parse(saved) as SubmissionData;
                setData(parsed);
            }
        } catch {
            // Use default fallback if sessionStorage is inaccessible
        }
    }, []);

    const userInitials = (data.headName || auth?.user?.name || 'BS')
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <>
            <Head title="Menunggu Verifikasi — KomunitasHub" />

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

                {/* 2. PROGRESS ONBOARDING: TAHAP 3 DARI 3 (VERIFIKASI AKTIF) */}
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
                            <span className="h-px w-8 bg-[#2F6B57]" />
                            <div className="flex items-center gap-2 font-semibold text-[#B87922]">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#B87922]/30 bg-[#FAF2E6] text-[11px] font-bold text-[#B87922]">
                                    3
                                </span>
                                <span>Verifikasi Pengurus</span>
                            </div>
                        </div>

                        {/* Mobile Progress Indicator */}
                        <div className="space-y-1.5 sm:hidden">
                            <div className="flex items-center justify-between text-xs text-[#66736C]">
                                <span className="font-semibold text-[#B87922]">
                                    Langkah 3 dari 3
                                </span>
                                <span>Verifikasi Pengurus</span>
                            </div>
                            <div className="h-1 w-full overflow-hidden rounded-full bg-[#E4E3DC]">
                                <div className="h-full w-full rounded-full bg-[#B87922]" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. AREA UTAMA STATUS MENUNGGU VERIFIKASI */}
                <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
                    <div className="w-full max-w-[600px] space-y-6 rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-6 shadow-xs sm:p-10">
                        {/* Status Callout - Besar namun Tenang */}
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 rounded-full border border-[#B87922]/30 bg-[#FAF2E6] px-3 py-1 text-xs font-semibold text-[#B87922]">
                                <Clock className="h-3.5 w-3.5 shrink-0" />
                                <span>
                                    Status: Menunggu Verifikasi Pengurus
                                </span>
                            </div>

                            <h1 className="text-2xl leading-snug font-bold tracking-tight text-[#1D2924] sm:text-3xl">
                                Data pendaftaran Anda sedang diperiksa.
                            </h1>

                            <p className="text-xs leading-relaxed text-[#66736C] sm:text-sm">
                                Pengurus dari <strong>{data.community}</strong>{' '}
                                sedang mencocokkan data domisili dan anggota
                                keluarga Anda. Setelah disetujui, akun ini akan
                                otomatis aktif dan Anda dapat langsung mengakses
                                iuran, kas terbuka, dan layanan warga.
                            </p>
                        </div>

                        {/* Ringkasan Data yang Diajukan */}
                        <div className="overflow-hidden rounded-xl border border-[#E4E3DC] bg-[#FFFEFA]">
                            <div className="flex items-center justify-between border-b border-[#E4E3DC] bg-[#F7F6F2] p-3.5">
                                <span className="text-xs font-bold tracking-wider text-[#1D2924] uppercase">
                                    Ringkasan Data yang Diajukan
                                </span>
                                <span className="text-[11px] text-[#66736C]">
                                    Diajukan: {data.submittedAt}
                                </span>
                            </div>

                            <div className="space-y-3 divide-y divide-[#E4E3DC] p-4 text-xs">
                                <div className="flex items-center justify-between pt-1">
                                    <span className="text-[#66736C]">
                                        Komunitas:
                                    </span>
                                    <div className="text-right">
                                        <span className="font-semibold text-[#1D2924]">
                                            {data.community}
                                        </span>
                                        <div className="text-[11px] text-[#2F6B57]">
                                            {data.communityMode} (
                                            {data.communityLocation})
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-3">
                                    <span className="text-[#66736C]">
                                        Alamat Tempat Tinggal:
                                    </span>
                                    <span className="font-semibold text-[#1D2924]">
                                        {data.block} No. {data.houseNumber}
                                        {data.additionalAddress
                                            ? ` (${data.additionalAddress})`
                                            : ''}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between pt-3">
                                    <span className="text-[#66736C]">
                                        Kepala Keluarga:
                                    </span>
                                    <span className="font-semibold text-[#1D2924]">
                                        {data.headName}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between pt-3">
                                    <span className="text-[#66736C]">
                                        Nomor WhatsApp Keluarga:
                                    </span>
                                    <span className="font-mono font-medium text-[#1D2924]">
                                        {data.familyPhone}
                                    </span>
                                </div>

                                <div className="flex items-start justify-between pt-3">
                                    <span className="text-[#66736C]">
                                        Anggota Keluarga:
                                    </span>
                                    <div className="space-y-0.5 text-right">
                                        <div className="font-semibold text-[#1D2924]">
                                            {data.totalResidents} Orang Tinggal
                                            Bersama
                                        </div>
                                        {data.familyMembers &&
                                            data.familyMembers.map((m) => (
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
                        </div>

                        {/* Catatan Keamanan / Fitur Warga Non-Aktif Sementara */}
                        <div className="space-y-1 rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] p-3.5 text-xs text-[#66736C]">
                            <div className="flex items-center gap-1.5 font-semibold text-[#1D2924]">
                                <Lock className="h-3.5 w-3.5 text-[#2F6B57]" />
                                <span>Akses Fitur Warga Masih Dibatasi</span>
                            </div>
                            <p className="text-[11px] leading-relaxed">
                                Untuk menjaga privasi dan keamanan kas
                                lingkungan, menu fitur warga (seperti pembayaran
                                iuran, surat pengantar, dan izin tamu QR) baru
                                akan dibuka setelah akun Anda disetujui oleh
                                pengurus RT.
                            </p>
                        </div>

                        {/* Tombol Aksi */}
                        <div className="flex flex-col items-center justify-between gap-3 border-t border-[#E4E3DC] pt-2 sm:flex-row">
                            <Link
                                href="/lengkapi-profil"
                                className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-[#E4E3DC] bg-[#FFFEFA] px-4 py-2 text-xs font-semibold text-[#1D2924] shadow-xs transition-colors hover:border-[#1D2924]/20 hover:bg-[#F7F6F2] sm:w-auto"
                            >
                                <Edit3 className="h-3.5 w-3.5 text-[#66736C]" />
                                <span>Perbaiki Data Pengajuan</span>
                            </Link>

                            <Link
                                href="/"
                                className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-[#2F6B57] px-5 py-2 text-xs font-semibold text-[#FFFEFA] shadow-xs transition-colors hover:bg-[#245442] sm:w-auto"
                            >
                                <ArrowLeft className="h-3.5 w-3.5" />
                                <span>Kembali ke Beranda</span>
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
