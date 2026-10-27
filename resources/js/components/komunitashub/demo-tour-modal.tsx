import React, { useState } from 'react';
import {
    X,
    Shield,
    Wallet,
    FileText,
    Users,
    CheckCircle2,
    QrCode,
    Camera,
    Check,
} from 'lucide-react';

interface DemoTourModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function DemoTourModal({ isOpen, onClose }: DemoTourModalProps) {
    const [selectedRole, setSelectedRole] = useState<
        'satpam' | 'warga' | 'bendahara' | 'rt'
    >('satpam');
    const [scanState, setScanState] = useState<'idle' | 'valid' | 'scanned'>(
        'idle',
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D2924]/50 p-3 backdrop-blur-xs sm:p-4">
            <div className="relative flex max-h-[90vh] w-full max-w-3xl animate-in flex-col overflow-hidden rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] shadow-xl duration-200 zoom-in-95 fade-in">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#E4E3DC] bg-[#F7F6F2] px-6 py-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold tracking-wider text-[#2F6B57] uppercase">
                                Demo Antarmuka KomunitasHub
                            </span>
                            <span className="text-xs text-[#66736C]">·</span>
                            <span className="text-xs text-[#66736C]">
                                Tanpa Login Diperlukan
                            </span>
                        </div>
                        <h3 className="mt-0.5 text-base font-bold text-[#1D2924]">
                            Eksplorasi Peran & Layanan Digital
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md p-1.5 text-[#66736C] transition-colors hover:bg-[#E4E3DC]/50 hover:text-[#1D2924]"
                        aria-label="Tutup modal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Role Switcher */}
                <div className="flex gap-2 overflow-x-auto border-b border-[#E4E3DC] bg-[#FFFEFA] px-6 pt-3 text-xs font-semibold">
                    <button
                        type="button"
                        onClick={() => setSelectedRole('satpam')}
                        className={`flex items-center gap-2 border-b-2 px-1 pb-3 whitespace-nowrap transition-colors ${
                            selectedRole === 'satpam'
                                ? 'border-[#2F6B57] text-[#2F6B57]'
                                : 'border-transparent text-[#66736C] hover:text-[#1D2924]'
                        }`}
                    >
                        <Shield className="h-4 w-4" />
                        Layar Pos Satpam (Cluster Aman)
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedRole('warga')}
                        className={`flex items-center gap-2 border-b-2 px-1 pb-3 whitespace-nowrap transition-colors ${
                            selectedRole === 'warga'
                                ? 'border-[#2F6B57] text-[#2F6B57]'
                                : 'border-transparent text-[#66736C] hover:text-[#1D2924]'
                        }`}
                    >
                        <Users className="h-4 w-4" />
                        Dashboard Warga
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedRole('bendahara')}
                        className={`flex items-center gap-2 border-b-2 px-1 pb-3 whitespace-nowrap transition-colors ${
                            selectedRole === 'bendahara'
                                ? 'border-[#2F6B57] text-[#2F6B57]'
                                : 'border-transparent text-[#66736C] hover:text-[#1D2924]'
                        }`}
                    >
                        <Wallet className="h-4 w-4" />
                        Dashboard Bendahara
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedRole('rt')}
                        className={`flex items-center gap-2 border-b-2 px-1 pb-3 whitespace-nowrap transition-colors ${
                            selectedRole === 'rt'
                                ? 'border-[#2F6B57] text-[#2F6B57]'
                                : 'border-transparent text-[#66736C] hover:text-[#1D2924]'
                        }`}
                    >
                        <FileText className="h-4 w-4" />
                        Dashboard Ketua RT
                    </button>
                </div>

                {/* Modal Content Scrollable */}
                <div className="flex-1 space-y-4 overflow-y-auto p-6">
                    {/* 1. LAYAR POS SATPAM */}
                    {selectedRole === 'satpam' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-3">
                                <div>
                                    <h4 className="text-sm font-bold text-[#1D2924]">
                                        Terminal Pos Utama · Gerbang Cluster
                                        Puri Taman Sari
                                    </h4>
                                    <p className="text-xs text-[#66736C]">
                                        Dirancang responsif untuk tablet atau
                                        monitor pos satpam, tulisan besar dan
                                        cepat dipindai.
                                    </p>
                                </div>
                                <span className="inline-flex items-center gap-1 rounded bg-[#EAF4EE] px-2.5 py-1 text-xs font-semibold text-[#2F7D5C]">
                                    <span className="h-2 w-2 animate-pulse rounded-full bg-[#2F7D5C]" />
                                    Petugas: Pak Slamet (Shift Pagi)
                                </span>
                            </div>

                            {/* Scan QR Simulator */}
                            <div className="space-y-4 rounded-xl border border-[#E4E3DC] bg-[#F7F6F2] p-5 text-center">
                                {scanState === 'idle' && (
                                    <div className="space-y-3 py-4">
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-[#2F6B57] text-[#FFFEFA] shadow-xs">
                                            <Camera className="h-8 w-8" />
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-bold text-[#1D2924]">
                                                Siap Memindai QR Izin Tamu
                                            </h5>
                                            <p className="text-xs text-[#66736C]">
                                                Arahkan barcode / QR pass dari
                                                layar ponsel tamu atau kurir
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setScanState('valid')
                                            }
                                            className="inline-flex items-center gap-2 rounded-md bg-[#2F6B57] px-5 py-2.5 text-xs font-bold text-[#FFFEFA] shadow-xs transition-colors hover:bg-[#245442]"
                                        >
                                            <QrCode className="h-4 w-4" />
                                            Simulasikan Scan QR Tamu Masuk
                                        </button>
                                    </div>
                                )}

                                {scanState === 'valid' && (
                                    <div className="space-y-4 rounded-lg border-2 border-[#2F7D5C] bg-[#FFFEFA] p-5 text-left">
                                        <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-3">
                                            <span className="inline-flex items-center gap-1.5 rounded bg-[#EAF4EE] px-3 py-1 text-xs font-bold text-[#2F7D5C]">
                                                <CheckCircle2 className="h-4 w-4" />
                                                QR VALID · IZIN DIBERIKAN
                                            </span>
                                            <span className="text-xs text-[#66736C]">
                                                Masa Berlaku: s/d 18:00 WIB
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-xs">
                                            <div>
                                                <span className="text-[#66736C]">
                                                    Nama Tamu:
                                                </span>
                                                <div className="text-sm font-bold text-[#1D2924]">
                                                    Hendra Wijaya
                                                </div>
                                                <div className="text-[11px] text-[#66736C]">
                                                    Teknisi Internet Biznet
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-[#66736C]">
                                                    Rumah Tujuan:
                                                </span>
                                                <div className="text-sm font-bold text-[#2F6B57]">
                                                    Blok B-07
                                                </div>
                                                <div className="text-[11px] text-[#66736C]">
                                                    Keluarga Bpk. Pratama
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end gap-3 border-t border-[#E4E3DC] pt-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setScanState('idle')
                                                }
                                                className="rounded px-3 py-1.5 text-xs font-medium text-[#66736C] hover:text-[#1D2924]"
                                            >
                                                Batal
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setScanState('scanned')
                                                }
                                                className="inline-flex items-center gap-2 rounded-md bg-[#2F7D5C] px-5 py-2 text-xs font-bold text-[#FFFEFA] shadow-xs transition-colors hover:bg-[#245442]"
                                            >
                                                <Check className="h-4 w-4" />
                                                Izinkan Masuk & Catat Log
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {scanState === 'scanned' && (
                                    <div className="space-y-3 rounded-lg border border-[#2F7D5C]/30 bg-[#EAF4EE] p-5 text-center">
                                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#2F7D5C] text-[#FFFEFA]">
                                            <Check className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-bold text-[#1D2924]">
                                                Tamu Berhasil Dicatat di Log
                                                Masuk
                                            </h5>
                                            <p className="text-xs text-[#66736C]">
                                                Notifikasi otomatis terkirim ke
                                                pemilik rumah Blok B-07.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setScanState('idle')}
                                            className="inline-flex items-center gap-1.5 rounded-md border border-[#2F6B57] bg-[#FFFEFA] px-4 py-1.5 text-xs font-semibold text-[#2F6B57] hover:bg-[#EBF3EF]"
                                        >
                                            Pindai Tamu Berikutnya
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 2. DASHBOARD WARGA */}
                    {selectedRole === 'warga' && (
                        <div className="space-y-4">
                            <div className="border-b border-[#E4E3DC] pb-3">
                                <h4 className="text-sm font-bold text-[#1D2924]">
                                    Selamat pagi, Keluarga Bpk. Pratama
                                </h4>
                                <p className="text-xs text-[#66736C]">
                                    Rumah Blok B-07 · Komunitas Puri Taman Sari
                                    (Cluster Aman)
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-4">
                                    <span className="text-xs text-[#66736C]">
                                        Tagihan Iuran Terkini
                                    </span>
                                    <div className="mt-1 text-xl font-bold text-[#1D2924]">
                                        Rp200.000
                                    </div>
                                    <span className="mt-2 inline-block rounded bg-[#EAF4EE] px-2 py-0.5 text-[11px] font-semibold text-[#2F7D5C]">
                                        Lunas (Oktober 2026)
                                    </span>
                                </div>
                                <div className="rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-4">
                                    <span className="text-xs text-[#66736C]">
                                        Saldo Kas Lingkungan
                                    </span>
                                    <div className="mt-1 text-xl font-bold text-[#1D2924]">
                                        Rp18.450.000
                                    </div>
                                    <span className="mt-2 inline-block text-[11px] text-[#66736C]">
                                        Transparan untuk seluruh warga
                                    </span>
                                </div>
                            </div>

                            {/* Menu Cepat Warga */}
                            <div className="space-y-3 rounded-xl border border-[#E4E3DC] bg-[#F7F6F2] p-4">
                                <span className="text-xs font-semibold tracking-wider text-[#1D2924] uppercase">
                                    Layanan Warga
                                </span>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="space-y-1 rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] p-3 text-center">
                                        <Wallet className="mx-auto h-5 w-5 text-[#2F6B57]" />
                                        <div className="text-xs font-semibold text-[#1D2924]">
                                            Bayar Iuran
                                        </div>
                                    </div>
                                    <div className="space-y-1 rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] p-3 text-center">
                                        <FileText className="mx-auto h-5 w-5 text-[#2F6B57]" />
                                        <div className="text-xs font-semibold text-[#1D2924]">
                                            Surat Pengantar
                                        </div>
                                    </div>
                                    <div className="space-y-1 rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] p-3 text-center">
                                        <QrCode className="mx-auto h-5 w-5 text-[#2F6B57]" />
                                        <div className="text-xs font-semibold text-[#1D2924]">
                                            Buat Izin Tamu
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3. DASHBOARD BENDAHARA */}
                    {selectedRole === 'bendahara' && (
                        <div className="space-y-4">
                            <div className="border-b border-[#E4E3DC] pb-3">
                                <h4 className="text-sm font-bold text-[#1D2924]">
                                    Pusat Rekonsiliasi Iuran & Kas (Bendahara RT
                                    04)
                                </h4>
                                <p className="text-xs text-[#66736C]">
                                    Kelola pembayaran warga, verifikasi bukti
                                    transfer, dan catat pengeluaran rutin.
                                </p>
                            </div>

                            {/* Daftar Approval Bukti Bayar */}
                            <div className="divide-y divide-[#E4E3DC] overflow-hidden rounded-xl border border-[#E4E3DC]">
                                <div className="bg-[#F7F6F2] p-3 text-xs font-semibold text-[#1D2924]">
                                    Menunggu Verifikasi Bukti Transfer (1
                                    Permintaan)
                                </div>
                                <div className="flex items-center justify-between bg-[#FFFEFA] p-4 text-xs">
                                    <div>
                                        <div className="font-bold text-[#1D2924]">
                                            Rumah C-04 · Bpk. Bambang
                                        </div>
                                        <div className="text-[#66736C]">
                                            Iuran Kebersihan & Keamanan
                                            (Rp200.000)
                                        </div>
                                        <div className="mt-1 font-mono text-[#2F6B57]">
                                            BCA Transfer · Bukti Terlampir
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            className="rounded border border-[#E4E3DC] px-3 py-1.5 text-[#66736C] hover:bg-[#F7F6F2]"
                                        >
                                            Periksa Bukti
                                        </button>
                                        <button
                                            type="button"
                                            className="rounded bg-[#2F7D5C] px-3 py-1.5 font-semibold text-[#FFFEFA] hover:bg-[#245442]"
                                        >
                                            Verifikasi Lunas
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 4. DASHBOARD KETUA RT */}
                    {selectedRole === 'rt' && (
                        <div className="space-y-4">
                            <div className="border-b border-[#E4E3DC] pb-3">
                                <h4 className="text-sm font-bold text-[#1D2924]">
                                    Persetujuan Administrasi & Pengumuman (Ketua
                                    RT 04)
                                </h4>
                                <p className="text-xs text-[#66736C]">
                                    Tinjau permohonan surat pengantar warga
                                    tanpa perlu ketuk pintu di malam hari.
                                </p>
                            </div>

                            <div className="space-y-3 rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-4">
                                <div className="flex items-center justify-between">
                                    <span className="inline-block rounded bg-[#FAF2E6] px-2 py-0.5 text-[11px] font-semibold text-[#B87922]">
                                        Menunggu Persetujuan Ketua RT
                                    </span>
                                    <span className="text-xs text-[#66736C]">
                                        Diajukan 2 jam lalu
                                    </span>
                                </div>
                                <div>
                                    <h5 className="text-sm font-bold text-[#1D2924]">
                                        Surat Pengantar Pembuatan SKCK
                                    </h5>
                                    <p className="text-xs text-[#66736C]">
                                        Pemohon: <strong>Dimas Anggara</strong>{' '}
                                        (Rumah A-12, Anggota Keluarga Bpk. Yudi)
                                    </p>
                                </div>
                                <div className="flex items-center justify-end gap-2 border-t border-[#E4E3DC] pt-2">
                                    <button
                                        type="button"
                                        className="rounded border border-[#E4E3DC] px-3 py-1.5 text-xs text-[#66736C]"
                                    >
                                        Minta Revisi
                                    </button>
                                    <button
                                        type="button"
                                        className="rounded bg-[#2F6B57] px-4 py-1.5 text-xs font-semibold text-[#FFFEFA] hover:bg-[#245442]"
                                    >
                                        Setujui & Terbitkan PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Modal */}
                <div className="flex items-center justify-between border-t border-[#E4E3DC] bg-[#F7F6F2] px-6 py-3.5 text-xs text-[#66736C]">
                    <span>
                        KomunitasHub: Menghubungkan Warga, Bendahara, Ketua RT &
                        Satpam.
                    </span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="font-semibold text-[#2F6B57] hover:underline"
                    >
                        Tutup Demo
                    </button>
                </div>
            </div>
        </div>
    );
}
