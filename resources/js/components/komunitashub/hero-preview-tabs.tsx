import React, { useState } from 'react';
import {
    Wallet,
    QrCode,
    Receipt,
    CheckCircle2,
    Clock,
    Share2,
    ShieldCheck,
    ArrowUpRight,
    ArrowDownRight,
    Copy,
    Check,
} from 'lucide-react';

export function HeroPreviewTabs() {
    const [activeTab, setActiveTab] = useState<'kas' | 'iuran' | 'qr'>('kas');
    const [copied, setCopied] = useState(false);

    const handleCopy = (text: string) => {
        void navigator.clipboard?.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full overflow-hidden rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] shadow-xs">
            {/* Top Toolbar / System Bar */}
            <div className="flex flex-col justify-between gap-3 border-b border-[#E4E3DC] bg-[#F7F6F2] px-4 py-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#2F7D5C]" />
                    <span className="text-xs font-semibold tracking-tight text-[#1D2924]">
                        Komunitas Puri Taman Sari
                    </span>
                    <span className="text-xs text-[#66736C]">·</span>
                    <span className="inline-flex items-center gap-1 rounded bg-[#EBF3EF] px-2 py-0.5 text-[11px] font-medium text-[#2F6B57]">
                        <ShieldCheck className="h-3 w-3" />
                        Cluster Aman (RT 04 / RW 09)
                    </span>
                </div>

                {/* Tab Switcher - Real UI Toggle */}
                <div className="inline-flex rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] p-0.5 text-xs font-medium text-[#66736C]">
                    <button
                        type="button"
                        onClick={() => setActiveTab('kas')}
                        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors ${
                            activeTab === 'kas'
                                ? 'bg-[#2F6B57] font-semibold text-[#FFFEFA]'
                                : 'hover:bg-[#F7F6F2] hover:text-[#1D2924]'
                        }`}
                    >
                        <Wallet className="h-3.5 w-3.5" />
                        Laporan Kas
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('iuran')}
                        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors ${
                            activeTab === 'iuran'
                                ? 'bg-[#2F6B57] font-semibold text-[#FFFEFA]'
                                : 'hover:bg-[#F7F6F2] hover:text-[#1D2924]'
                        }`}
                    >
                        <Receipt className="h-3.5 w-3.5" />
                        Iuran Rumah
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('qr')}
                        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors ${
                            activeTab === 'qr'
                                ? 'bg-[#2F6B57] font-semibold text-[#FFFEFA]'
                                : 'hover:bg-[#F7F6F2] hover:text-[#1D2924]'
                        }`}
                    >
                        <QrCode className="h-3.5 w-3.5" />
                        QR Izin Tamu
                    </button>
                </div>
            </div>

            {/* Tab 1: LAPORAN KAS REALISTIS */}
            {activeTab === 'kas' && (
                <div className="space-y-6 p-5 sm:p-6">
                    {/* Ringkasan Saldo dan Aliran Dana */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] p-4">
                            <div className="text-[12px] font-medium tracking-wider text-[#66736C] uppercase">
                                Saldo Kas Saat Ini
                            </div>
                            <div className="mt-1 text-2xl font-bold tracking-tight text-[#1D2924]">
                                Rp18.450.000
                            </div>
                            <div className="mt-2 flex items-center gap-1.5 text-xs text-[#2F7D5C]">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2F7D5C]" />
                                Terverifikasi Bendahara (Oktober 2026)
                            </div>
                        </div>

                        <div className="rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[12px] font-medium tracking-wider text-[#66736C] uppercase">
                                    Pemasukan Bulan Ini
                                </span>
                                <ArrowDownRight className="h-4 w-4 text-[#2F7D5C]" />
                            </div>
                            <div className="mt-1 text-xl font-bold tracking-tight text-[#1D2924]">
                                Rp8.200.000
                            </div>
                            <div className="mt-2 text-xs text-[#66736C]">
                                41 dari 45 rumah telah lunas (91%)
                            </div>
                        </div>

                        <div className="rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[12px] font-medium tracking-wider text-[#66736C] uppercase">
                                    Pengeluaran Bulan Ini
                                </span>
                                <ArrowUpRight className="h-4 w-4 text-[#B74E44]" />
                            </div>
                            <div className="mt-1 text-xl font-bold tracking-tight text-[#1D2924]">
                                Rp4.750.000
                            </div>
                            <div className="mt-2 text-xs text-[#66736C]">
                                4 kegiatan operasional rutin
                            </div>
                        </div>
                    </div>

                    {/* Transaksi Publik Terakhir (Menjaga Privasi Warga) */}
                    <div>
                        <div className="mb-3 flex items-center justify-between">
                            <h4 className="text-xs font-semibold tracking-wider text-[#66736C] uppercase">
                                Catatan Pengeluaran Fasilitas Umum (Oktober
                                2026)
                            </h4>
                            <span className="text-xs text-[#66736C]">
                                Privasi terjaga · Data terintegrasi
                            </span>
                        </div>

                        <div className="divide-y divide-[#E4E3DC] overflow-hidden rounded-lg border border-[#E4E3DC] text-sm">
                            <div className="flex items-center justify-between bg-[#FFFEFA] p-3.5 transition-colors hover:bg-[#F7F6F2]">
                                <div className="space-y-0.5">
                                    <div className="font-medium text-[#1D2924]">
                                        Honor Petugas Kebersihan & Angkut Sampah
                                    </div>
                                    <div className="text-xs text-[#66736C]">
                                        05 Okt 2026 · Rutin Bulanan (2 Petugas)
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="font-semibold text-[#1D2924]">
                                        -Rp2.500.000
                                    </span>
                                    <div className="text-[11px] font-medium text-[#2F7D5C]">
                                        Lunas
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between bg-[#FFFEFA] p-3.5 transition-colors hover:bg-[#F7F6F2]">
                                <div className="space-y-0.5">
                                    <div className="font-medium text-[#1D2924]">
                                        Perbaikan & Penggantian 4 Titik Lampu
                                        Jalan Blok B
                                    </div>
                                    <div className="text-xs text-[#66736C]">
                                        12 Okt 2026 · Lampu LED Philips 40W +
                                        Kabel
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="font-semibold text-[#1D2924]">
                                        -Rp650.000
                                    </span>
                                    <div className="text-[11px] font-medium text-[#2F7D5C]">
                                        Lunas
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between bg-[#FFFEFA] p-3.5 transition-colors hover:bg-[#F7F6F2]">
                                <div className="space-y-0.5">
                                    <div className="font-medium text-[#1D2924]">
                                        Perapian Pohon & Pembersihan Saluran
                                        Gorong-Gorong
                                    </div>
                                    <div className="text-xs text-[#66736C]">
                                        18 Okt 2026 · Antisipasi Musim Hujan
                                        Bersama Warga
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="font-semibold text-[#1D2924]">
                                        -Rp800.000
                                    </span>
                                    <div className="text-[11px] font-medium text-[#2F7D5C]">
                                        Lunas
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab 2: TAGIHAN IURAN WARGA */}
            {activeTab === 'iuran' && (
                <div className="space-y-5 p-5 sm:p-6">
                    {/* Header Rumah */}
                    <div className="flex flex-col justify-between gap-3 border-b border-[#E4E3DC] pb-4 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#2F6B57]/20 bg-[#EBF3EF] text-sm font-semibold text-[#2F6B57]">
                                B-07
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-[#1D2924]">
                                    Rumah Blok B-07 · Keluarga Bpk. Pratama
                                </h4>
                                <p className="text-xs text-[#66736C]">
                                    Terdaftar di RT 04 Puri Taman Sari (1 Akun
                                    KK)
                                </p>
                            </div>
                        </div>

                        <span className="inline-flex items-center gap-1.5 self-start rounded-md border border-[#2F7D5C]/20 bg-[#EAF4EE] px-2.5 py-1 text-xs font-semibold text-[#2F7D5C] sm:self-auto">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Iuran Oktober Lunas
                        </span>
                    </div>

                    {/* Rincian Tagihan */}
                    <div className="divide-y divide-[#E4E3DC] overflow-hidden rounded-lg border border-[#E4E3DC] text-sm">
                        <div className="flex items-center justify-between bg-[#F7F6F2] p-3.5 text-xs font-semibold tracking-wider text-[#1D2924] uppercase">
                            <span>Komponen Iuran Lingkungan</span>
                            <span>Nominal</span>
                        </div>
                        <div className="flex items-center justify-between bg-[#FFFEFA] p-3.5">
                            <div>
                                <div className="font-medium text-[#1D2924]">
                                    Iuran Keamanan & Pos Satpam 24 Jam
                                </div>
                                <div className="text-xs text-[#66736C]">
                                    Patroli berkala & operasional gerbang
                                </div>
                            </div>
                            <div className="font-medium text-[#1D2924]">
                                Rp120.000
                            </div>
                        </div>
                        <div className="flex items-center justify-between bg-[#FFFEFA] p-3.5">
                            <div>
                                <div className="font-medium text-[#1D2924]">
                                    Iuran Kebersihan & Pengangkutan Sampah
                                </div>
                                <div className="text-xs text-[#66736C]">
                                    Jadwal angkut 3x seminggu
                                </div>
                            </div>
                            <div className="font-medium text-[#1D2924]">
                                Rp50.000
                            </div>
                        </div>
                        <div className="flex items-center justify-between bg-[#FFFEFA] p-3.5">
                            <div>
                                <div className="font-medium text-[#1D2924]">
                                    Dana Kas Sosial & Perawatan Fasum
                                </div>
                                <div className="text-xs text-[#66736C]">
                                    Penerangan jalan & perbaikan inventaris
                                </div>
                            </div>
                            <div className="font-medium text-[#1D2924]">
                                Rp30.000
                            </div>
                        </div>
                        <div className="flex items-center justify-between bg-[#F7F6F2] p-4 font-bold text-[#1D2924]">
                            <span>Total Iuran Bulanan</span>
                            <span className="text-base text-[#2F6B57]">
                                Rp200.000
                            </span>
                        </div>
                    </div>

                    {/* Informasi Rekening Kas Lingkungan */}
                    <div className="flex flex-col justify-between gap-3 rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] p-3.5 text-xs sm:flex-row sm:items-center">
                        <div className="space-y-0.5">
                            <span className="text-[#66736C]">
                                Rekening Kas Resmi Lingkungan:
                            </span>
                            <div className="font-semibold text-[#1D2924]">
                                Bank Mandiri 137-00-1928374-1 (a.n. Kas
                                Paguyuban Warga RT 04)
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleCopy('1370019283741')}
                            className="inline-flex items-center gap-1.5 self-start rounded border border-[#E4E3DC] bg-[#FFFEFA] px-2.5 py-1.5 text-xs font-medium text-[#1D2924] transition-colors hover:bg-[#F7F6F2] sm:self-auto"
                        >
                            {copied ? (
                                <>
                                    <Check className="h-3.5 w-3.5 text-[#2F7D5C]" />
                                    Tersalin
                                </>
                            ) : (
                                <>
                                    <Copy className="h-3.5 w-3.5 text-[#66736C]" />
                                    Salin Rekening
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Tab 3: QR PASS IZIN TAMU (CLUSTER AMAN) */}
            {activeTab === 'qr' && (
                <div className="p-5 sm:p-6">
                    <div className="mx-auto max-w-md space-y-4 rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-5 text-center shadow-xs">
                        {/* Status Badge */}
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#2F7D5C]/20 bg-[#EAF4EE] px-3 py-1 text-xs font-semibold text-[#2F7D5C]">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Izin Masuk Aktif · Disetujui Warga
                        </div>

                        {/* Title & Tujuan */}
                        <div>
                            <h3 className="text-lg font-bold text-[#1D2924]">
                                Hendra Wijaya
                            </h3>
                            <p className="mt-0.5 text-xs text-[#66736C]">
                                Kategori:{' '}
                                <strong className="text-[#1D2924]">
                                    Teknisi Internet Biznet
                                </strong>
                            </p>
                            <p className="text-xs text-[#66736C]">
                                Tujuan:{' '}
                                <strong>Blok B-07 (Keluarga Pratama)</strong>
                            </p>
                        </div>

                        {/* QR Code Container - Clean, crisp, high contrast */}
                        <div className="my-3 flex justify-center">
                            <div className="inline-block rounded-lg border border-[#E4E3DC] bg-white p-3 shadow-xs">
                                <svg
                                    className="h-40 w-40"
                                    viewBox="0 0 100 100"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-label="QR Code Izin Masuk"
                                >
                                    {/* QR Corners & Positioning Markers */}
                                    <rect
                                        x="10"
                                        y="10"
                                        width="24"
                                        height="24"
                                        rx="2"
                                        fill="#1D2924"
                                    />
                                    <rect
                                        x="14"
                                        y="14"
                                        width="16"
                                        height="16"
                                        rx="1"
                                        fill="white"
                                    />
                                    <rect
                                        x="18"
                                        y="18"
                                        width="8"
                                        height="8"
                                        fill="#1D2924"
                                    />

                                    <rect
                                        x="66"
                                        y="10"
                                        width="24"
                                        height="24"
                                        rx="2"
                                        fill="#1D2924"
                                    />
                                    <rect
                                        x="70"
                                        y="14"
                                        width="16"
                                        height="16"
                                        rx="1"
                                        fill="white"
                                    />
                                    <rect
                                        x="74"
                                        y="18"
                                        width="8"
                                        height="8"
                                        fill="#1D2924"
                                    />

                                    <rect
                                        x="10"
                                        y="66"
                                        width="24"
                                        height="24"
                                        rx="2"
                                        fill="#1D2924"
                                    />
                                    <rect
                                        x="14"
                                        y="70"
                                        width="16"
                                        height="16"
                                        rx="1"
                                        fill="white"
                                    />
                                    <rect
                                        x="18"
                                        y="74"
                                        width="8"
                                        height="8"
                                        fill="#1D2924"
                                    />

                                    {/* Data Matrix Bits */}
                                    <rect
                                        x="42"
                                        y="12"
                                        width="6"
                                        height="6"
                                        fill="#1D2924"
                                    />
                                    <rect
                                        x="52"
                                        y="12"
                                        width="6"
                                        height="6"
                                        fill="#1D2924"
                                    />
                                    <rect
                                        x="42"
                                        y="24"
                                        width="6"
                                        height="6"
                                        fill="#1D2924"
                                    />
                                    <rect
                                        x="52"
                                        y="24"
                                        width="6"
                                        height="6"
                                        fill="#1D2924"
                                    />

                                    <rect
                                        x="12"
                                        y="42"
                                        width="6"
                                        height="6"
                                        fill="#1D2924"
                                    />
                                    <rect
                                        x="24"
                                        y="42"
                                        width="6"
                                        height="6"
                                        fill="#1D2924"
                                    />
                                    <rect
                                        x="12"
                                        y="52"
                                        width="6"
                                        height="6"
                                        fill="#1D2924"
                                    />
                                    <rect
                                        x="24"
                                        y="52"
                                        width="6"
                                        height="6"
                                        fill="#1D2924"
                                    />

                                    <rect
                                        x="40"
                                        y="40"
                                        width="20"
                                        height="20"
                                        rx="3"
                                        fill="#2F6B57"
                                    />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="4"
                                        fill="#FFFEFA"
                                    />

                                    <rect
                                        x="68"
                                        y="42"
                                        width="6"
                                        height="6"
                                        fill="#1D2924"
                                    />
                                    <rect
                                        x="80"
                                        y="42"
                                        width="6"
                                        height="6"
                                        fill="#1D2924"
                                    />
                                    <rect
                                        x="68"
                                        y="54"
                                        width="6"
                                        height="6"
                                        fill="#1D2924"
                                    />
                                    <rect
                                        x="80"
                                        y="54"
                                        width="6"
                                        height="6"
                                        fill="#1D2924"
                                    />

                                    <rect
                                        x="42"
                                        y="68"
                                        width="6"
                                        height="6"
                                        fill="#1D2924"
                                    />
                                    <rect
                                        x="54"
                                        y="68"
                                        width="6"
                                        height="6"
                                        fill="#1D2924"
                                    />
                                    <rect
                                        x="42"
                                        y="80"
                                        width="6"
                                        height="6"
                                        fill="#1D2924"
                                    />
                                    <rect
                                        x="54"
                                        y="80"
                                        width="6"
                                        height="6"
                                        fill="#1D2924"
                                    />
                                    <rect
                                        x="68"
                                        y="74"
                                        width="8"
                                        height="8"
                                        fill="#1D2924"
                                    />
                                    <rect
                                        x="80"
                                        y="74"
                                        width="8"
                                        height="8"
                                        fill="#1D2924"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Expiry & Instruction */}
                        <div className="flex items-center justify-center gap-1.5 text-xs text-[#66736C]">
                            <Clock className="h-3.5 w-3.5 text-[#B87922]" />
                            <span>
                                Berlaku hingga hari ini pukul{' '}
                                <strong>18:00 WIB</strong>
                            </span>
                        </div>

                        <div className="flex gap-2 border-t border-[#E4E3DC] pt-2">
                            <button
                                type="button"
                                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-[#2F6B57] px-3 py-2 text-xs font-semibold text-[#FFFEFA] shadow-xs transition-colors hover:bg-[#245442]"
                            >
                                <Share2 className="h-3.5 w-3.5" />
                                Kirim ke WhatsApp Tamu
                            </button>
                            <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-md border border-[#E4E3DC] bg-[#FFFEFA] px-3 py-2 text-xs font-medium text-[#66736C] transition-colors hover:bg-[#F7F6F2]"
                            >
                                Batalkan Izin
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
