import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { BrandLogo } from '@/components/komunitashub/brand-logo';
import { ArrowLeft } from 'lucide-react';

export default function JoinCommunity() {
    return (
        <>
            <Head title="Gabung Komunitas — KomunitasHub" />
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#F7F6F2] p-6 text-[#1D2924]">
                <div className="w-full max-w-md space-y-4 rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-8 text-center shadow-xs">
                    <BrandLogo size="md" className="justify-center" />
                    <h2 className="text-xl font-bold">Gabung Komunitas</h2>
                    <p className="text-xs text-[#66736C]">
                        Halaman onboarding untuk memasukkan kode undangan
                        komunitas akan kita kembangkan di tahap selanjutnya.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 pt-2 text-xs font-semibold text-[#2F6B57] hover:underline"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </>
    );
}
