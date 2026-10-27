import React, { useState } from 'react';
import {
    FileDown,
    Search,
    CheckCircle2,
    Calendar,
    ArrowDownRight,
    ArrowUpRight,
} from 'lucide-react';

interface Transaction {
    id: string;
    date: string;
    category: 'Kebersihan' | 'Keamanan' | 'Fasum' | 'Sosial';
    description: string;
    amount: number;
    type: 'income' | 'expense';
    receiptAvailable: boolean;
}

const mockTransactions: Transaction[] = [
    {
        id: 'TX-101',
        date: '24 Okt 2026',
        category: 'Fasum',
        description:
            'Pembelian Cat Marka Jalan & Pengecatan Speed Bump Blok A-D',
        amount: 420000,
        type: 'expense',
        receiptAvailable: true,
    },
    {
        id: 'TX-102',
        date: '18 Okt 2026',
        category: 'Sosial',
        description:
            'Konsumsi Kerja Bakti Lingkungan & Pembersihan Saluran Gorong-Gorong',
        amount: 800000,
        type: 'expense',
        receiptAvailable: true,
    },
    {
        id: 'TX-103',
        date: '12 Okt 2026',
        category: 'Fasum',
        description:
            'Penggantian 4 Titik Lampu Jalan LED Philips 40W (Blok B & C)',
        amount: 650000,
        type: 'expense',
        receiptAvailable: true,
    },
    {
        id: 'TX-104',
        date: '05 Okt 2026',
        category: 'Kebersihan',
        description:
            'Honor Rutin Bulanan 2 Petugas Pengangkut Sampah Lingkungan',
        amount: 2500000,
        type: 'expense',
        receiptAvailable: true,
    },
    {
        id: 'TX-105',
        date: '03 Okt 2026',
        category: 'Keamanan',
        description:
            'Peremajaan Senter Patroli Satpam & Baterai Cadangan Pos 1',
        amount: 380000,
        type: 'expense',
        receiptAvailable: true,
    },
];

export function TransparencyLedger() {
    const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
    const [searchQuery, setSearchQuery] = useState('');
    const [isDownloading, setIsDownloading] = useState(false);

    const filteredTransactions = mockTransactions.filter((tx) => {
        const matchesCategory =
            selectedCategory === 'Semua' || tx.category === selectedCategory;
        const matchesSearch =
            tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tx.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleDownload = () => {
        setIsDownloading(true);
        setTimeout(() => {
            setIsDownloading(false);
            alert(
                'Laporan Kas RT 04 (Oktober 2026) siap diunduh dalam format PDF resmi.',
            );
        }, 800);
    };

    return (
        <div className="w-full overflow-hidden rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] shadow-xs">
            {/* Header Laporan Kas */}
            <div className="flex flex-col justify-between gap-4 border-b border-[#E4E3DC] bg-[#F7F6F2] p-6 md:flex-row md:items-center">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold tracking-wider text-[#2F6B57] uppercase">
                            Transparansi Pembukuan
                        </span>
                        <span className="text-xs text-[#66736C]">·</span>
                        <span className="flex items-center gap-1 text-xs text-[#66736C]">
                            <Calendar className="h-3.5 w-3.5" />
                            Periode Oktober 2026
                        </span>
                    </div>
                    <h3 className="mt-1 text-xl font-bold text-[#1D2924]">
                        Buku Kas RT 04 / RW 09 Puri Taman Sari
                    </h3>
                    <p className="mt-0.5 text-xs text-[#66736C]">
                        Laporan terbuka bagi seluruh warga terdaftar demi
                        menjaga kepercayaan dan keharmonisan bersama.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="inline-flex items-center gap-2 self-start rounded-md border border-[#E4E3DC] bg-[#FFFEFA] px-3.5 py-2 text-xs font-semibold text-[#1D2924] shadow-xs transition-colors hover:border-[#1D2924]/30 hover:bg-[#F7F6F2] md:self-auto"
                >
                    <FileDown className="h-4 w-4 text-[#2F6B57]" />
                    {isDownloading
                        ? 'Menyiapkan Dokumen...'
                        : 'Unduh Rekap PDF Resmi'}
                </button>
            </div>

            {/* Metrik Saldo & Aliran Dana */}
            <div className="grid grid-cols-1 divide-y divide-[#E4E3DC] border-b border-[#E4E3DC] bg-[#FFFEFA] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                <div className="p-5">
                    <span className="text-xs font-medium tracking-wider text-[#66736C] uppercase">
                        Saldo Kas Lingkungan
                    </span>
                    <div className="mt-1 text-2xl font-bold tracking-tight text-[#1D2924]">
                        Rp18.450.000
                    </div>
                    <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-[#2F7D5C]">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Diaudit & Disahkan Bendahara
                    </p>
                </div>

                <div className="p-5">
                    <span className="text-xs font-medium tracking-wider text-[#66736C] uppercase">
                        Total Pemasukan Bulan Ini
                    </span>
                    <div className="mt-1 flex items-center gap-1.5 text-2xl font-bold tracking-tight text-[#1D2924]">
                        Rp8.200.000
                        <ArrowDownRight className="h-4 w-4 text-[#2F7D5C]" />
                    </div>
                    <p className="mt-1.5 text-xs text-[#66736C]">
                        Dari iuran 41 rumah (Sisa 4 rumah dalam tenggat)
                    </p>
                </div>

                <div className="p-5">
                    <span className="text-xs font-medium tracking-wider text-[#66736C] uppercase">
                        Total Pengeluaran Bulan Ini
                    </span>
                    <div className="mt-1 flex items-center gap-1.5 text-2xl font-bold tracking-tight text-[#1D2924]">
                        Rp4.750.000
                        <ArrowUpRight className="h-4 w-4 text-[#B74E44]" />
                    </div>
                    <p className="mt-1.5 text-xs text-[#66736C]">
                        5 transaksi pengeluaran operasional
                    </p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col justify-between gap-3 border-b border-[#E4E3DC] bg-[#F7F6F2]/60 p-4 sm:flex-row sm:items-center">
                {/* Category Filters */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="mr-1 hidden font-medium text-[#66736C] sm:inline">
                        Kategori:
                    </span>
                    {['Semua', 'Kebersihan', 'Keamanan', 'Fasum', 'Sosial'].map(
                        (cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setSelectedCategory(cat)}
                                className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
                                    selectedCategory === cat
                                        ? 'bg-[#2F6B57] font-semibold text-[#FFFEFA] shadow-xs'
                                        : 'border border-[#E4E3DC] bg-[#FFFEFA] text-[#66736C] hover:bg-[#F7F6F2] hover:text-[#1D2924]'
                                }`}
                            >
                                {cat}
                            </button>
                        ),
                    )}
                </div>

                {/* Search in Transactions */}
                <div className="relative sm:w-64">
                    <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-[#66736C]" />
                    <input
                        type="text"
                        placeholder="Cari transaksi..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-md border border-[#E4E3DC] bg-[#FFFEFA] py-1.5 pr-3 pl-8 text-xs text-[#1D2924] placeholder:text-[#66736C]/60 focus:border-[#2F6B57] focus:ring-1 focus:ring-[#2F6B57] focus:outline-none"
                    />
                </div>
            </div>

            {/* Transactions Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-[#E4E3DC] bg-[#F7F6F2] text-[11px] font-semibold tracking-wider text-[#66736C] uppercase">
                            <th className="px-5 py-3">Tanggal</th>
                            <th className="px-5 py-3">Kategori</th>
                            <th className="px-5 py-3">
                                Keterangan Pengeluaran
                            </th>
                            <th className="px-5 py-3 text-right">Nominal</th>
                            <th className="px-5 py-3 text-center">
                                Bukti Nota
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E4E3DC] bg-[#FFFEFA]">
                        {filteredTransactions.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-5 py-8 text-center text-xs text-[#66736C]"
                                >
                                    Tidak ada catatan transaksi yang sesuai
                                    dengan pencarian Anda.
                                </td>
                            </tr>
                        ) : (
                            filteredTransactions.map((tx) => (
                                <tr
                                    key={tx.id}
                                    className="transition-colors hover:bg-[#F7F6F2]/70"
                                >
                                    <td className="px-5 py-3.5 font-mono text-xs whitespace-nowrap text-[#66736C]">
                                        {tx.date}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className="inline-block rounded border border-[#E4E3DC] bg-[#F7F6F2] px-2 py-0.5 text-[11px] font-medium text-[#1D2924]">
                                            {tx.category}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 font-medium text-[#1D2924]">
                                        {tx.description}
                                    </td>
                                    <td className="px-5 py-3.5 text-right font-semibold whitespace-nowrap text-[#1D2924]">
                                        -Rp{tx.amount.toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-5 py-3.5 text-center">
                                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#2F7D5C]">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                            Ada Fisik
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Note on Citizen Privacy */}
            <div className="flex items-center justify-between border-t border-[#E4E3DC] bg-[#F7F6F2] p-4 text-xs text-[#66736C]">
                <span>
                    * Catatan: Untuk menjaga keharmonisan warga, identitas nama
                    pembayar dan status iuran individu tidak dipublikasikan ke
                    umum.
                </span>
                <span className="font-medium text-[#2F6B57]">
                    Prinsip Transparansi KomunitasHub
                </span>
            </div>
        </div>
    );
}
