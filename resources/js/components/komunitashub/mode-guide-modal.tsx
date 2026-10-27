import React from 'react';
import { X, Check, ShieldCheck, Home } from 'lucide-react';

interface ModeGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectMode?: (mode: 'rt' | 'cluster') => void;
}

export function ModeGuideModal({
    isOpen,
    onClose,
    onSelectMode,
}: ModeGuideModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D2924]/40 p-4 backdrop-blur-xs">
            <div className="relative w-full max-w-2xl animate-in overflow-hidden rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] shadow-lg duration-200 zoom-in-95 fade-in">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#E4E3DC] bg-[#F7F6F2] px-6 py-4">
                    <div>
                        <h3 className="text-base font-bold text-[#1D2924]">
                            Panduan Pemilihan Mode Komunitas
                        </h3>
                        <p className="text-xs text-[#66736C]">
                            Sesuaikan fitur dengan karakteristik dan
                            infrastruktur lingkungan Anda
                        </p>
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

                {/* Body: Comparison Table */}
                <div className="space-y-6 p-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* RT Mandiri */}
                        <div className="flex flex-col justify-between rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-5">
                            <div className="space-y-3">
                                <div className="inline-flex items-center gap-1.5 rounded bg-[#EBF3EF] px-2.5 py-1 text-xs font-semibold text-[#2F6B57]">
                                    <Home className="h-3.5 w-3.5" />
                                    Mode RT Mandiri
                                </div>
                                <h4 className="text-sm font-bold text-[#1D2924]">
                                    Untuk Lingkungan RT/RW Terbuka &
                                    Perkampungan
                                </h4>
                                <p className="text-xs leading-relaxed text-[#66736C]">
                                    Fokus pada transparansi iuran kas,
                                    pengumuman warga, dan pengurusan surat
                                    pengantar tanpa memerlukan pos pengamanan
                                    khusus.
                                </p>
                                <ul className="space-y-2 border-t border-[#E4E3DC] pt-2 text-xs text-[#1D2924]">
                                    <li className="flex items-start gap-2">
                                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2F7D5C]" />
                                        <span>
                                            Pengelolaan tagihan & iuran bulanan
                                            warga
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2F7D5C]" />
                                        <span>
                                            Buku kas transparan (pemasukan &
                                            pengeluaran)
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2F7D5C]" />
                                        <span>
                                            Pengajuan surat pengantar warga
                                            digital
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2F7D5C]" />
                                        <span>
                                            Papan pengumuman resmi dari pengurus
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2 text-[#66736C]">
                                        <span className="h-3.5 w-3.5 shrink-0 text-center font-bold text-[#B74E44]">
                                            ✕
                                        </span>
                                        <span>
                                            Tidak menyertakan fitur QR pos
                                            satpam
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    onSelectMode?.('rt');
                                    onClose();
                                }}
                                className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-[#2F6B57] bg-[#FFFEFA] py-2 text-xs font-semibold text-[#2F6B57] transition-colors hover:bg-[#EBF3EF]"
                            >
                                Pilih Mode RT Mandiri
                            </button>
                        </div>

                        {/* Cluster Aman */}
                        <div className="flex flex-col justify-between rounded-xl border-2 border-[#2F6B57] bg-[#FFFEFA] p-5 shadow-xs">
                            <div className="space-y-3">
                                <div className="inline-flex items-center gap-1.5 rounded bg-[#2F6B57] px-2.5 py-1 text-xs font-semibold text-[#FFFEFA]">
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    Mode Cluster Aman
                                </div>
                                <h4 className="text-sm font-bold text-[#1D2924]">
                                    Untuk Perumahan, Townhouse & Kompleks
                                    Berpagar
                                </h4>
                                <p className="text-xs leading-relaxed text-[#66736C]">
                                    Solusi komprehensif untuk kawasan dengan{' '}
                                    <em>One Gate System</em> atau pos satpam
                                    operasional 24 jam.
                                </p>
                                <ul className="space-y-2 border-t border-[#E4E3DC] pt-2 text-xs text-[#1D2924]">
                                    <li className="flex items-start gap-2">
                                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2F7D5C]" />
                                        <span>
                                            <strong>Seluruh fitur</strong> Mode
                                            RT Mandiri
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2F7D5C]" />
                                        <span>
                                            Izin tamu & penerbitan QR pass oleh
                                            warga
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2F7D5C]" />
                                        <span>
                                            Antarmuka pemindai QR untuk layar
                                            tablet pos satpam
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2F7D5C]" />
                                        <span>
                                            Buku tamu digital & rekap histori
                                            kunjungan tanpa kertas
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2F7D5C]" />
                                        <span>
                                            Notifikasi kedatangan tamu ke
                                            pemilik rumah
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    onSelectMode?.('cluster');
                                    onClose();
                                }}
                                className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-[#2F6B57] py-2 text-xs font-semibold text-[#FFFEFA] shadow-xs transition-colors hover:bg-[#245442]"
                            >
                                Pilih Mode Cluster Aman
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
