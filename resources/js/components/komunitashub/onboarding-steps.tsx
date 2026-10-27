import React, { useState } from 'react';
import {
    UserCheck,
    KeyRound,
    BadgeCheck,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react';

export function OnboardingSteps() {
    const [simulatedCode, setSimulatedCode] = useState('TAMANSARI-04');
    const [isCodeValidated, setIsCodeValidated] = useState(true);

    const handleCodeChange = (val: string) => {
        setSimulatedCode(val.toUpperCase());
        if (
            val.toUpperCase().trim() === 'TAMANSARI-04' ||
            val.toUpperCase().trim() === 'RT04'
        ) {
            setIsCodeValidated(true);
        } else {
            setIsCodeValidated(false);
        }
    };

    return (
        <div className="space-y-10">
            {/* 3 Step Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Step 1 */}
                <div className="flex flex-col justify-between rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-6 shadow-xs">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#2F6B57]/20 bg-[#EBF3EF] text-xs font-bold text-[#2F6B57]">
                                01
                            </span>
                            <span className="text-[11px] font-medium text-[#66736C]">
                                1 Keluarga = 1 Akun
                            </span>
                        </div>
                        <h4 className="text-base font-bold text-[#1D2924]">
                            Buat Akun Keluarga
                        </h4>
                        <p className="text-xs leading-relaxed text-[#66736C]">
                            Cukup satu akun utama mewakili satu nomor rumah dan
                            Kepala Keluarga. Anggota keluarga dapat didaftarkan
                            di dalam profil tanpa membuat akun terpisah yang
                            membingungkan.
                        </p>
                    </div>
                    <div className="flex items-center gap-1.5 border-t border-[#E4E3DC] pt-4 text-xs font-medium text-[#2F6B57]">
                        <UserCheck className="h-4 w-4" />
                        Tanpa pemilihan role saat daftar
                    </div>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col justify-between rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-6 shadow-xs">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#2F6B57]/20 bg-[#EBF3EF] text-xs font-bold text-[#2F6B57]">
                                02
                            </span>
                            <span className="text-[11px] font-medium text-[#66736C]">
                                Kode Akses Resmi
                            </span>
                        </div>
                        <h4 className="text-base font-bold text-[#1D2924]">
                            Masukkan Kode Komunitas
                        </h4>
                        <p className="text-xs leading-relaxed text-[#66736C]">
                            Gunakan kode undangan yang dibagikan oleh pengurus
                            RT atau pengelola cluster Anda. Kode ini otomatis
                            mengarahkan Anda ke database lingkungan yang tepat.
                        </p>
                    </div>
                    <div className="flex items-center gap-1.5 border-t border-[#E4E3DC] pt-4 text-xs font-medium text-[#2F6B57]">
                        <KeyRound className="h-4 w-4" />
                        Terhubung ke RT/Cluster setempat
                    </div>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col justify-between rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-6 shadow-xs">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#2F6B57]/20 bg-[#EBF3EF] text-xs font-bold text-[#2F6B57]">
                                03
                            </span>
                            <span className="text-[11px] font-medium text-[#66736C]">
                                Verifikasi Pengurus
                            </span>
                        </div>
                        <h4 className="text-base font-bold text-[#1D2924]">
                            Verifikasi & Mulai Akses
                        </h4>
                        <p className="text-xs leading-relaxed text-[#66736C]">
                            Pengurus memvalidasi alamat dan kesesuaian data
                            rumah Anda. Setelah disetujui, Anda langsung dapat
                            membayar iuran, memantau kas, atau membuat QR izin
                            tamu.
                        </p>
                    </div>
                    <div className="flex items-center gap-1.5 border-t border-[#E4E3DC] pt-4 text-xs font-medium text-[#2F7D5C]">
                        <BadgeCheck className="h-4 w-4" />
                        Keamanan & privasi terjamin
                    </div>
                </div>
            </div>

            {/* Interactive Simulator: "Coba Simulasi Kode Komunitas" */}
            <div className="mx-auto max-w-xl rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-6 shadow-xs">
                <div className="mb-4 space-y-1 text-center">
                    <span className="inline-block rounded bg-[#EBF3EF] px-2.5 py-0.5 text-[11px] font-semibold text-[#2F6B57]">
                        Simulasi Interaktif Warga
                    </span>
                    <h4 className="text-sm font-bold text-[#1D2924]">
                        Contoh Tampilan Saat Memasukkan Kode Undangan
                    </h4>
                    <p className="text-xs text-[#66736C]">
                        Ketik kode{' '}
                        <code className="rounded bg-[#F7F6F2] px-1.5 py-0.5 font-semibold text-[#1D2924]">
                            TAMANSARI-04
                        </code>{' '}
                        di bawah untuk melihat validasi instan:
                    </p>
                </div>

                <div className="space-y-3">
                    <div className="relative">
                        <input
                            type="text"
                            value={simulatedCode}
                            onChange={(e) => handleCodeChange(e.target.value)}
                            placeholder="MASUKKAN KODE KOMUNITAS"
                            className="w-full rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] px-4 py-2.5 text-center font-mono text-sm font-bold tracking-widest text-[#1D2924] focus:border-[#2F6B57] focus:bg-[#FFFEFA] focus:ring-1 focus:ring-[#2F6B57] focus:outline-none"
                        />
                    </div>

                    {isCodeValidated ? (
                        <div className="space-y-2 rounded-lg border border-[#2F7D5C]/30 bg-[#EAF4EE] p-3.5 text-left">
                            <div className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2F7D5C]">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Komunitas Ditemukan & Valid
                                </span>
                                <span className="rounded border border-[#2F7D5C]/20 bg-[#FFFEFA] px-2 py-0.5 text-[11px] font-semibold text-[#2F6B57]">
                                    Cluster Aman
                                </span>
                            </div>
                            <div className="space-y-0.5 text-xs text-[#1D2924]">
                                <div className="text-sm font-semibold">
                                    Puri Taman Sari (RT 04 / RW 09)
                                </div>
                                <div className="text-[#66736C]">
                                    Kec. Serpong, Kota Tangerang Selatan · 45
                                    Rumah Terdaftar
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-start gap-2 rounded-lg border border-[#E4E3DC] bg-[#FAF2E6] p-3 text-left text-xs text-[#B87922]">
                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                            <div>
                                Kode belum cocok. Coba masukkan{' '}
                                <strong className="font-semibold text-[#1D2924]">
                                    TAMANSARI-04
                                </strong>{' '}
                                untuk melihat contoh verifikasi.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
