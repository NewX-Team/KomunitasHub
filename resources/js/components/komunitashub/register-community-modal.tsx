import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Home, ArrowRight } from 'lucide-react';

interface RegisterCommunityModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function RegisterCommunityModal({
    isOpen,
    onClose,
}: RegisterCommunityModalProps) {
    const [communityName, setCommunityName] = useState('');
    const [city, setCity] = useState('');
    const [houseCount, setHouseCount] = useState('30-50');
    const [mode, setMode] = useState<'rt' | 'cluster'>('cluster');
    const [contactName, setContactName] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [submitted, setSubmitted] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    const handleReset = () => {
        setSubmitted(false);
        setCommunityName('');
        setContactName('');
        setContactPhone('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D2924]/40 p-4 backdrop-blur-xs">
            <div className="relative w-full max-w-lg animate-in overflow-hidden rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] shadow-lg duration-200 zoom-in-95 fade-in">
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-[#E4E3DC] bg-[#F7F6F2] px-6 py-4">
                    <div>
                        <h3 className="text-base font-bold text-[#1D2924]">
                            Daftarkan Komunitas Anda
                        </h3>
                        <p className="text-xs text-[#66736C]">
                            Mulai digitalisasi operasional lingkungan RT atau
                            cluster perumahan Anda
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

                {/* Modal Body */}
                <div className="p-6">
                    {submitted ? (
                        <div className="space-y-4 py-6 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#2F7D5C]/20 bg-[#EAF4EE] text-[#2F7D5C]">
                                <CheckCircle2 className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-lg font-bold text-[#1D2924]">
                                    Pengajuan Berhasil Diterima
                                </h4>
                                <p className="mx-auto max-w-sm text-sm text-[#66736C]">
                                    Terima kasih,{' '}
                                    <strong>{contactName || 'Pengurus'}</strong>
                                    . Tim KomunitasHub akan segera menghubungi
                                    WhatsApp{' '}
                                    <strong>{contactPhone || 'Anda'}</strong>{' '}
                                    untuk proses setup kode undangan dan
                                    pendampingan aktivasi sistem.
                                </p>
                            </div>
                            <div className="pt-2">
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="inline-flex items-center justify-center rounded-md bg-[#2F6B57] px-5 py-2 text-sm font-semibold text-[#FFFEFA] shadow-xs transition-colors hover:bg-[#245442]"
                                >
                                    Selesai
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-xs font-semibold tracking-wider text-[#1D2924] uppercase">
                                    Nama Komunitas / Lingkungan
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Contoh: RT 04 Puri Taman Sari atau Cluster Cendana"
                                    value={communityName}
                                    onChange={(e) =>
                                        setCommunityName(e.target.value)
                                    }
                                    className="w-full rounded-md border border-[#E4E3DC] bg-[#FFFEFA] px-3 py-2 text-sm text-[#1D2924] placeholder:text-[#66736C]/60 focus:border-[#2F6B57] focus:ring-1 focus:ring-[#2F6B57] focus:outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold tracking-wider text-[#1D2924] uppercase">
                                        Kota / Kabupaten
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: Tangerang Selatan"
                                        value={city}
                                        onChange={(e) =>
                                            setCity(e.target.value)
                                        }
                                        className="w-full rounded-md border border-[#E4E3DC] bg-[#FFFEFA] px-3 py-2 text-sm text-[#1D2924] placeholder:text-[#66736C]/60 focus:border-[#2F6B57] focus:ring-1 focus:ring-[#2F6B57] focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold tracking-wider text-[#1D2924] uppercase">
                                        Perkiraan Jumlah Rumah/KK
                                    </label>
                                    <select
                                        value={houseCount}
                                        onChange={(e) =>
                                            setHouseCount(e.target.value)
                                        }
                                        className="w-full rounded-md border border-[#E4E3DC] bg-[#FFFEFA] px-3 py-2 text-sm text-[#1D2924] focus:border-[#2F6B57] focus:ring-1 focus:ring-[#2F6B57] focus:outline-none"
                                    >
                                        <option value="kurang-30">
                                            &lt; 30 Rumah
                                        </option>
                                        <option value="30-50">
                                            30 - 60 Rumah
                                        </option>
                                        <option value="60-120">
                                            60 - 120 Rumah
                                        </option>
                                        <option value="lebih-120">
                                            &gt; 120 Rumah
                                        </option>
                                    </select>
                                </div>
                            </div>

                            {/* Pilihan Mode */}
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold tracking-wider text-[#1D2924] uppercase">
                                    Pilih Mode Komunitas
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setMode('rt')}
                                        className={`rounded-lg border p-3 text-left transition-colors ${
                                            mode === 'rt'
                                                ? 'border-[#2F6B57] bg-[#EBF3EF]'
                                                : 'border-[#E4E3DC] bg-[#FFFEFA] hover:bg-[#F7F6F2]'
                                        }`}
                                    >
                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1D2924]">
                                            <Home className="h-4 w-4 text-[#2F6B57]" />
                                            RT Mandiri
                                        </div>
                                        <div className="mt-1 text-[11px] text-[#66736C]">
                                            Iuran, kas transparan, surat
                                            pengantar warga
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setMode('cluster')}
                                        className={`rounded-lg border p-3 text-left transition-colors ${
                                            mode === 'cluster'
                                                ? 'border-[#2F6B57] bg-[#EBF3EF]'
                                                : 'border-[#E4E3DC] bg-[#FFFEFA] hover:bg-[#F7F6F2]'
                                        }`}
                                    >
                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1D2924]">
                                            <ShieldCheck className="h-4 w-4 text-[#2F6B57]" />
                                            Cluster Aman
                                        </div>
                                        <div className="mt-1 text-[11px] text-[#66736C]">
                                            Fitur RT + QR izin tamu & layar
                                            satpam
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Data Kontak Pengurus */}
                            <div className="grid grid-cols-1 gap-4 pt-1 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold tracking-wider text-[#1D2924] uppercase">
                                        Nama Anda (Pengurus / Warga)
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: Bpk. H. Susanto"
                                        value={contactName}
                                        onChange={(e) =>
                                            setContactName(e.target.value)
                                        }
                                        className="w-full rounded-md border border-[#E4E3DC] bg-[#FFFEFA] px-3 py-2 text-sm text-[#1D2924] placeholder:text-[#66736C]/60 focus:border-[#2F6B57] focus:ring-1 focus:ring-[#2F6B57] focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold tracking-wider text-[#1D2924] uppercase">
                                        Nomor WhatsApp
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="0812-xxxx-xxxx"
                                        value={contactPhone}
                                        onChange={(e) =>
                                            setContactPhone(e.target.value)
                                        }
                                        className="w-full rounded-md border border-[#E4E3DC] bg-[#FFFEFA] px-3 py-2 text-sm text-[#1D2924] placeholder:text-[#66736C]/60 focus:border-[#2F6B57] focus:ring-1 focus:ring-[#2F6B57] focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex items-center justify-end gap-3 border-t border-[#E4E3DC] pt-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="rounded-md border border-[#E4E3DC] bg-[#FFFEFA] px-4 py-2 text-sm font-medium text-[#66736C] transition-colors hover:bg-[#F7F6F2]"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-1.5 rounded-md bg-[#2F6B57] px-5 py-2 text-sm font-semibold text-[#FFFEFA] shadow-xs transition-colors hover:bg-[#245442]"
                                >
                                    Ajukan Pendaftaran
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
