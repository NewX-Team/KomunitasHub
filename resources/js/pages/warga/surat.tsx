import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import CitizenLayout from '@/layouts/citizen-layout';
import {
    FileText,
    Clock,
    CheckCircle2,
    AlertCircle,
    ArrowLeft,
    Check,
    X,
    Download,
    Share2,
    MessageSquare,
    ChevronRight,
    Edit3,
    Send,
    Plus,
    FileCheck,
    Info,
    Printer,
} from 'lucide-react';

interface LetterTemplate {
    id: string;
    title: string;
    description: string;
    flow: string;
    category: 'Domisili' | 'Usaha' | 'SKCK' | 'Tinggal' | 'Sosial';
}

interface LetterSubmission {
    id: string;
    templateId: string;
    title: string;
    trackingNumber: string;
    submittedDate: string;
    status: 'draft' | 'pending' | 'revision' | 'approved' | 'rejected';
    applicantName: string;
    purpose: string;
    destination?: string;
    businessName?: string;
    businessType?: string;
    businessAddress?: string;
    durationOfStay?: string;
    conditionNote?: string;
    additionalNote?: string;
    rtNotes?: string;
    revisionRequestedAt?: string;
    officialLetterNumber?: string;
    approvedDate?: string;
    approvedBy?: string;
}

const LETTER_TEMPLATES: LetterTemplate[] = [
    {
        id: 'tmpl-domisili',
        title: 'Surat Pengantar Domisili',
        description:
            'Untuk kebutuhan bukti domisili atau kelengkapan administrasi setempat.',
        flow: 'Isi data → Ditinjau Ketua RT → Unduh PDF',
        category: 'Domisili',
    },
    {
        id: 'tmpl-usaha',
        title: 'Surat Pengantar Usaha',
        description:
            'Untuk mendukung pengurusan izin usaha, NIB, atau keterangan usaha warga.',
        flow: 'Isi data → Ditinjau Ketua RT → Unduh PDF',
        category: 'Usaha',
    },
    {
        id: 'tmpl-skck',
        title: 'Surat Pengantar SKCK',
        description:
            'Untuk melengkapi pengajuan Surat Keterangan Catatan Kepolisian di Polsek.',
        flow: 'Isi data → Ditinjau Ketua RT → Unduh PDF',
        category: 'SKCK',
    },
    {
        id: 'tmpl-tinggal',
        title: 'Surat Keterangan Tinggal',
        description:
            'Untuk kebutuhan administrasi yang memerlukan bukti alamat tempat tinggal.',
        flow: 'Isi data → Ditinjau Ketua RT → Unduh PDF',
        category: 'Tinggal',
    },
    {
        id: 'tmpl-sktm',
        title: 'Surat Keterangan Tidak Mampu',
        description:
            'Untuk kebutuhan pengajuan bantuan pendidikan, beasiswa, atau jaminan sosial.',
        flow: 'Isi data → Ditinjau Ketua RT → Unduh PDF',
        category: 'Sosial',
    },
];

const INITIAL_SUBMISSIONS: LetterSubmission[] = [
    {
        id: 'sub-1',
        templateId: 'tmpl-domisili',
        title: 'Surat Pengantar Domisili',
        trackingNumber: 'SP-2026-00124',
        submittedDate: '20 Oktober 2026',
        status: 'pending',
        applicantName: 'Budi Pratama (Kepala Keluarga)',
        purpose:
            'Kelengkapan administrasi pembukaan rekening bank syariah kantor cabang Sukamaju.',
        destination: 'Bank Syariah Indonesia KCP Sukamaju',
        additionalNote:
            'Mohon dibantu sebelum akhir bulan untuk keperluan payroll kantor.',
    },
    {
        id: 'sub-2',
        templateId: 'tmpl-usaha',
        title: 'Surat Pengantar Usaha',
        trackingNumber: 'SP-2026-00105',
        submittedDate: '8 Oktober 2026',
        status: 'approved',
        officialLetterNumber: '470/04/RT-SMJ/X/2026',
        approvedDate: '9 Oktober 2026',
        approvedBy: 'Bpk. Hendra Gunawan (Ketua RT 04)',
        applicantName: 'Siti Aminah (Istri)',
        businessName: 'Warung Kopi Sari Rasa',
        businessType: 'Kuliner & Minuman Tradisional',
        businessAddress: 'Ruko Blok A No. 12',
        purpose:
            'Kelengkapan pengajuan Nomor Induk Berusaha (NIB) dan sertifikasi pangan industri.',
        destination: 'Dinas Penanaman Modal & Pelayanan Terpadu Satu Pintu',
    },
    {
        id: 'sub-3',
        templateId: 'tmpl-tinggal',
        title: 'Surat Keterangan Tinggal',
        trackingNumber: 'SP-2026-00085',
        submittedDate: '22 Oktober 2026',
        status: 'revision',
        revisionRequestedAt: '22 Oktober 2026, 16.45 WIB',
        rtNotes:
            'Mohon lengkapi tujuan instansi yang dituju dan pastikan nama anak sesuai dengan akta kelahiran.',
        applicantName: 'Rizky Pratama (Anak)',
        durationOfStay: '3 tahun 4 bulan',
        purpose: 'Pendaftaran berkas zonasi sekolah negeri.',
    },
    {
        id: 'sub-4',
        templateId: 'tmpl-skck',
        title: 'Surat Pengantar SKCK',
        trackingNumber: 'SP-2026-00062',
        submittedDate: '15 September 2026',
        status: 'approved',
        officialLetterNumber: '470/04/RT-SMJ/IX/2026',
        approvedDate: '16 September 2026',
        approvedBy: 'Bpk. Hendra Gunawan (Ketua RT 04)',
        applicantName: 'Rizky Pratama (Anak)',
        purpose:
            'Persyaratan melamar formasi rekrutmen bersama BUMN tahun 2026.',
        destination: 'Polsek Sukamaju',
    },
    {
        id: 'sub-5',
        templateId: 'tmpl-sktm',
        title: 'Surat Keterangan Tidak Mampu',
        trackingNumber: 'DRAF-2026-003',
        submittedDate: '24 Oktober 2026',
        status: 'draft',
        applicantName: 'Budi Pratama (Kepala Keluarga)',
        purpose: 'Pengajuan keringanan biaya UKT perkuliahan semester ganjil.',
        destination: 'Fakultas Teknik Universitas Negeri',
    },
];

export default function SuratIndex() {
    // Community Mode Simulator
    const [communityMode, setCommunityMode] = useState<
        'Cluster Aman' | 'RT Mandiri'
    >('Cluster Aman');

    // Simulation switch for submissions: 'normal' | 'empty'
    const [submissionScenario, setSubmissionScenario] = useState<
        'normal' | 'empty'
    >('normal');

    // Filter status for "Pengajuan Saya": 'all' | 'pending' | 'approved' | 'revision' | 'draft'
    const [statusFilter, setStatusFilter] = useState<
        'all' | 'pending' | 'approved' | 'revision' | 'draft'
    >('all');

    // State for viewing details of an existing submission
    const [selectedSubmission, setSelectedSubmission] =
        useState<LetterSubmission | null>(null);

    // State for creation flow: null = list mode, template = wizard step mode
    const [activeTemplate, setActiveTemplate] = useState<LetterTemplate | null>(
        null,
    );
    const [wizardStep, setWizardStep] = useState<'fill' | 'review' | 'success'>(
        'fill',
    );

    // Modals
    const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
    const [isPdfPreviewModalOpen, setIsPdfPreviewModalOpen] = useState(false);
    const [isContactHelpModalOpen, setIsContactHelpModalOpen] = useState(false);

    // Form inputs state
    const [formData, setFormData] = useState({
        applicantName: 'Budi Pratama (Kepala Keluarga)',
        purpose: 'Keperluan administrasi perbankan pembukaan rekening kantor.',
        destination: 'Bank Mandiri KC Sukamaju',
        businessName: 'Toko Kelontong Pratama',
        businessType: 'Perdagangan Sembako',
        businessAddress: 'Rumah Blok A-12',
        durationOfStay: '3 tahun',
        conditionNote:
            'Pendapatan keluarga terdampak perbaikan operasional usaha.',
        additionalNote:
            'Mohon konfirmasi tanda tangan bila surat telah selesai ditinjau.',
        agreementChecked: false,
    });

    const [createdTrackingNumber, setCreatedTrackingNumber] =
        useState('SP-2026-00135');

    // Submissions list
    const submissions = React.useMemo(() => {
        if (submissionScenario === 'empty') return [];
        return INITIAL_SUBMISSIONS;
    }, [submissionScenario]);

    // Filtered Submissions
    const filteredSubmissions = React.useMemo(() => {
        if (statusFilter === 'all') return submissions;
        return submissions.filter((s) => s.status === statusFilter);
    }, [submissions, statusFilter]);

    // Start wizard
    const handleStartApplication = (tmpl: LetterTemplate) => {
        setActiveTemplate(tmpl);
        setWizardStep('fill');
        setFormData((prev) => ({
            ...prev,
            agreementChecked: false,
        }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Submit wizard
    const handleSubmitApplication = (isDraft = false) => {
        if (isDraft) {
            alert(
                'Pengajuan Anda telah disimpan sebagai Draf. Anda dapat melanjutkannya sewaktu-waktu.',
            );
            setActiveTemplate(null);
            return;
        }
        setCreatedTrackingNumber(
            `SP-2026-00${Math.floor(130 + Math.random() * 50)}`,
        );
        setWizardStep('success');
    };

    return (
        <CitizenLayout
            title="Surat Pengantar"
            communityMode={communityMode}
            onModeChange={setCommunityMode}
            activeNav="surat"
        >
            <Head title="Surat Pengantar — KomunitasHub" />

            <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                {/* TOOLBAR SIMULASI STATUS PENGUJIAN */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-3 text-xs shadow-2xs">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#1D2924]">
                            Mode Simulasi:
                        </span>
                        <div className="inline-flex rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] p-0.5">
                            <button
                                type="button"
                                onClick={() => setSubmissionScenario('normal')}
                                className={`rounded px-2.5 py-1 font-medium transition-colors ${
                                    submissionScenario === 'normal'
                                        ? 'bg-[#2F6B57] text-[#FFFEFA]'
                                        : 'text-[#66736C] hover:text-[#1D2924]'
                                }`}
                            >
                                Ada Pengajuan ({INITIAL_SUBMISSIONS.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setSubmissionScenario('empty')}
                                className={`rounded px-2.5 py-1 font-medium transition-colors ${
                                    submissionScenario === 'empty'
                                        ? 'bg-[#2F6B57] text-[#FFFEFA]'
                                        : 'text-[#66736C] hover:text-[#1D2924]'
                                }`}
                            >
                                Kosong (Warga Baru)
                            </button>
                        </div>
                    </div>

                    <div className="text-[11px] text-[#66736C]">
                        Pengurus Peninjau:{' '}
                        <strong className="text-[#1D2924]">
                            Ketua RT 04 (Bpk. Hendra Gunawan)
                        </strong>
                    </div>
                </div>

                {/* BREADCRUMB DESKTOP */}
                <div className="hidden items-center gap-2 text-xs text-[#66736C] md:flex">
                    <Link
                        href="/dashboard"
                        className="hover:text-[#1D2924] hover:underline"
                    >
                        Ringkasan
                    </Link>
                    <span>/</span>
                    <span className="font-semibold text-[#1D2924]">
                        Surat Pengantar RT
                    </span>
                </div>

                {/* ============================================================== */}
                {/* MODE A: JIKA SEDANG DALAM STEP WIZARD PENGAJUAN                */}
                {/* ============================================================== */}
                {activeTemplate ? (
                    <div className="space-y-6">
                        {/* WIZARD HEADER */}
                        <div className="space-y-3 rounded-2xl border border-[#E4E3DC] bg-[#FFFEFA] p-5 shadow-2xs sm:p-6">
                            <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (wizardStep === 'review') {
                                            setWizardStep('fill');
                                        } else {
                                            setActiveTemplate(null);
                                        }
                                    }}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#66736C] hover:text-[#1D2924]"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    <span>
                                        {wizardStep === 'review'
                                            ? 'Kembali ke Isi Data'
                                            : 'Pilih Surat Lain'}
                                    </span>
                                </button>

                                <div className="text-xs font-semibold text-[#2F6B57]">
                                    Langkah{' '}
                                    {wizardStep === 'fill'
                                        ? '1 dari 2'
                                        : wizardStep === 'review'
                                          ? '2 dari 2'
                                          : 'Selesai'}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <span className="text-[11px] font-semibold tracking-wider text-[#2F6B57] uppercase">
                                    Pengajuan Surat Warga
                                </span>
                                <h1 className="text-xl font-bold text-[#1D2924] sm:text-2xl">
                                    {activeTemplate.title}
                                </h1>
                                <p className="text-xs text-[#66736C] sm:text-sm">
                                    {activeTemplate.description}
                                </p>
                            </div>

                            {/* Step Indicator */}
                            <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                                <div
                                    className={`flex items-center gap-2 rounded-lg border p-2.5 ${
                                        wizardStep === 'fill'
                                            ? 'border-[#2F6B57] bg-[#EBF3EF] font-semibold text-[#2F6B57]'
                                            : 'border-[#E4E3DC] bg-[#FAF9F5] text-[#1D2924]'
                                    }`}
                                >
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2F6B57] text-[10px] text-[#FFFEFA]">
                                        1
                                    </span>
                                    <span>Isi Informasi Kebutuhan</span>
                                </div>

                                <div
                                    className={`flex items-center gap-2 rounded-lg border p-2.5 ${
                                        wizardStep === 'review'
                                            ? 'border-[#2F6B57] bg-[#EBF3EF] font-semibold text-[#2F6B57]'
                                            : 'border-[#E4E3DC] bg-[#F7F6F2] text-[#66736C]'
                                    }`}
                                >
                                    <span
                                        className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${wizardStep === 'review' ? 'bg-[#2F6B57] text-[#FFFEFA]' : 'bg-[#E4E3DC] text-[#66736C]'}`}
                                    >
                                        2
                                    </span>
                                    <span>Periksa & Ajukan ke Ketua RT</span>
                                </div>
                            </div>
                        </div>

                        {/* ============================================================== */}
                        {/* WIZARD STEP 1: FORM PENGISIAN                                  */}
                        {/* ============================================================== */}
                        {wizardStep === 'fill' && (
                            <div className="space-y-6">
                                {/* DATA KELUARGA (TERISI OTOMATIS / READ-ONLY DARI PROFIL) */}
                                <div className="space-y-3 rounded-2xl border border-[#E4E3DC] bg-[#FFFEFA] p-5 shadow-2xs sm:p-6">
                                    <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-2">
                                        <div className="space-y-0.5">
                                            <h3 className="text-xs font-bold tracking-wider text-[#1D2924] uppercase">
                                                Data Keluarga Terverifikasi
                                            </h3>
                                            <p className="text-[11px] text-[#66736C]">
                                                Diambil otomatis dari basis data
                                                warga komunitas.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                alert(
                                                    'Untuk mengubah data alamat atau kepala keluarga, hubungi admin komunitas melalui menu Profil Keluarga.',
                                                )
                                            }
                                            className="text-[11px] font-semibold text-[#2F6B57] hover:underline"
                                        >
                                            Ubah di Profil Keluarga
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 rounded-xl border border-[#E4E3DC] bg-[#FAF9F5] p-3.5 text-xs sm:grid-cols-2">
                                        <div>
                                            <span className="text-[11px] text-[#66736C]">
                                                Kepala Keluarga:
                                            </span>
                                            <div className="font-semibold text-[#1D2924]">
                                                Budi Pratama
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-[11px] text-[#66736C]">
                                                Alamat Rumah:
                                            </span>
                                            <div className="font-semibold text-[#1D2924]">
                                                Blok A No. 12 (RT 04 / RW 09)
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-[11px] text-[#66736C]">
                                                Kontak WhatsApp:
                                            </span>
                                            <div className="font-semibold text-[#1D2924]">
                                                0812-3456-7890
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-[11px] text-[#66736C]">
                                                Lingkungan:
                                            </span>
                                            <div className="font-semibold text-[#1D2924]">
                                                Komunitas Taman Sari, Sukamaju
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* FORM SPESIFIK TEMPLATE SURAT */}
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        setWizardStep('review');
                                        window.scrollTo({
                                            top: 0,
                                            behavior: 'smooth',
                                        });
                                    }}
                                    className="space-y-4 rounded-2xl border border-[#E4E3DC] bg-[#FFFEFA] p-5 text-xs shadow-2xs sm:p-6"
                                >
                                    <h3 className="text-xs font-bold tracking-wider text-[#1D2924] uppercase">
                                        Informasi yang Diperlukan
                                    </h3>

                                    {/* Field 1: Nama Pemohon (Dropdown Anggota Keluarga) */}
                                    <div className="space-y-1.5">
                                        <label className="flex items-center justify-between font-semibold text-[#1D2924]">
                                            <span>
                                                Nama Anggota Keluarga Pemohon:{' '}
                                                <span className="text-[#B74E44]">
                                                    *
                                                </span>
                                            </span>
                                            <span className="text-[11px] font-normal text-[#66736C]">
                                                Sesuai data KK yang tercatat
                                            </span>
                                        </label>
                                        <select
                                            value={formData.applicantName}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    applicantName:
                                                        e.target.value,
                                                })
                                            }
                                            className="w-full rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-3 py-2 text-xs text-[#1D2924] focus:border-[#2F6B57] focus:outline-hidden"
                                        >
                                            <option value="Budi Pratama (Kepala Keluarga)">
                                                Budi Pratama (Kepala Keluarga)
                                            </option>
                                            <option value="Siti Aminah (Istri)">
                                                Siti Aminah (Istri)
                                            </option>
                                            <option value="Rizky Pratama (Anak)">
                                                Rizky Pratama (Anak)
                                            </option>
                                            <option value="Nadia Pratama (Anak)">
                                                Nadia Pratama (Anak)
                                            </option>
                                        </select>
                                    </div>

                                    {/* DYNAMIC FIELD: USAHA */}
                                    {activeTemplate.category === 'Usaha' && (
                                        <div className="space-y-3 rounded-xl border border-[#E4E3DC] bg-[#F7F6F2] p-4">
                                            <div className="font-semibold text-[#1D2924]">
                                                Data Keterangan Usaha:
                                            </div>
                                            <div className="space-y-1">
                                                <label className="font-semibold text-[#1D2924]">
                                                    Nama Usaha:{' '}
                                                    <span className="text-[#B74E44]">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={
                                                        formData.businessName
                                                    }
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            businessName:
                                                                e.target.value,
                                                        })
                                                    }
                                                    placeholder="Contoh: Warung Kopi Sari Rasa"
                                                    className="w-full rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-3 py-2 text-xs text-[#1D2924] focus:border-[#2F6B57] focus:outline-hidden"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="font-semibold text-[#1D2924]">
                                                    Jenis / Bidang Usaha:{' '}
                                                    <span className="text-[#B74E44]">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={
                                                        formData.businessType
                                                    }
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            businessType:
                                                                e.target.value,
                                                        })
                                                    }
                                                    placeholder="Contoh: Kuliner & Minuman Tradisional"
                                                    className="w-full rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-3 py-2 text-xs text-[#1D2924] focus:border-[#2F6B57] focus:outline-hidden"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="font-semibold text-[#1D2924]">
                                                    Alamat Tempat Usaha:{' '}
                                                    <span className="text-[#B74E44]">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={
                                                        formData.businessAddress
                                                    }
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            businessAddress:
                                                                e.target.value,
                                                        })
                                                    }
                                                    placeholder="Contoh: Rumah Blok A-12 atau Ruko Taman Sari"
                                                    className="w-full rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-3 py-2 text-xs text-[#1D2924] focus:border-[#2F6B57] focus:outline-hidden"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* DYNAMIC FIELD: LAMA TINGGAL */}
                                    {activeTemplate.category === 'Tinggal' && (
                                        <div className="space-y-1.5">
                                            <label className="font-semibold text-[#1D2924]">
                                                Lama Menetap / Tinggal
                                                (Opsional):
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.durationOfStay}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        durationOfStay:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Contoh: 3 tahun 4 bulan"
                                                className="w-full rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-3 py-2 text-xs text-[#1D2924] focus:border-[#2F6B57] focus:outline-hidden"
                                            />
                                        </div>
                                    )}

                                    {/* DYNAMIC FIELD: KONDISI KELUARGA (SKTM) */}
                                    {activeTemplate.category === 'Sosial' && (
                                        <div className="space-y-1.5">
                                            <label className="font-semibold text-[#1D2924]">
                                                Keterangan Kondisi Keluarga:{' '}
                                                <span className="text-[#B74E44]">
                                                    *
                                                </span>
                                            </label>
                                            <textarea
                                                rows={2}
                                                required
                                                value={formData.conditionNote}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        conditionNote:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Jelaskan secara ringkas kebutuhan bantuan sosial atau beasiswa yang diajukan..."
                                                className="w-full rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-3 py-2 text-xs text-[#1D2924] focus:border-[#2F6B57] focus:outline-hidden"
                                            />
                                        </div>
                                    )}

                                    {/* Keperluan Surat (Wajib) */}
                                    <div className="space-y-1.5">
                                        <label className="font-semibold text-[#1D2924]">
                                            Keperluan Penggunaan Surat:{' '}
                                            <span className="text-[#B74E44]">
                                                *
                                            </span>
                                        </label>
                                        <textarea
                                            rows={3}
                                            required
                                            value={formData.purpose}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    purpose: e.target.value,
                                                })
                                            }
                                            placeholder="Jelaskan secara singkat tujuan peruntukan surat ini..."
                                            className="w-full rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-3 py-2 text-xs text-[#1D2924] focus:border-[#2F6B57] focus:outline-hidden"
                                        />
                                    </div>

                                    {/* Instansi Tujuan (Opsional) */}
                                    <div className="space-y-1.5">
                                        <label className="font-semibold text-[#1D2924]">
                                            Instansi / Lembaga Tujuan
                                            (Opsional):
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.destination}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    destination: e.target.value,
                                                })
                                            }
                                            placeholder="Contoh: PT Maju Bersama, Polsek Sukamaju, atau Universitas Negeri"
                                            className="w-full rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-3 py-2 text-xs text-[#1D2924] focus:border-[#2F6B57] focus:outline-hidden"
                                        />
                                    </div>

                                    {/* Catatan Tambahan (Opsional) */}
                                    <div className="space-y-1.5">
                                        <label className="font-semibold text-[#1D2924]">
                                            Catatan untuk Ketua RT (Opsional):
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.additionalNote}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    additionalNote:
                                                        e.target.value,
                                                })
                                            }
                                            placeholder="Pesan tambahan bila ada hal khusus..."
                                            className="w-full rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-3 py-2 text-xs text-[#1D2924] focus:border-[#2F6B57] focus:outline-hidden"
                                        />
                                    </div>

                                    <div className="flex flex-col items-center justify-between gap-3 border-t border-[#E4E3DC] pt-4 sm:flex-row">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleSubmitApplication(true)
                                            }
                                            className="text-xs font-semibold text-[#66736C] hover:text-[#1D2924]"
                                        >
                                            Simpan sebagai Draf
                                        </button>

                                        <div className="flex w-full items-center gap-2 sm:w-auto">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setActiveTemplate(null)
                                                }
                                                className="w-full rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-4 py-2 font-semibold text-[#1D2924] hover:bg-[#F7F6F2] sm:w-auto"
                                            >
                                                Batal
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#2F6B57] px-5 py-2 font-semibold text-[#FFFEFA] shadow-xs hover:bg-[#245442] sm:w-auto"
                                            >
                                                <span>
                                                    Lanjutkan ke Tinjauan
                                                </span>
                                                <ChevronRight className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* ============================================================== */}
                        {/* WIZARD STEP 2: TINJAU PENGAJUAN SEBELUM SUBMIT                 */}
                        {/* ============================================================== */}
                        {wizardStep === 'review' && (
                            <div className="space-y-6">
                                <div className="space-y-4 rounded-2xl border border-[#E4E3DC] bg-[#FFFEFA] p-5 text-xs shadow-2xs sm:p-6">
                                    <div className="border-b border-[#E4E3DC] pb-3">
                                        <h3 className="text-base font-bold text-[#1D2924]">
                                            Periksa Kembali Pengajuan Anda
                                        </h3>
                                        <p className="text-[11px] text-[#66736C]">
                                            Pastikan data yang Anda ajukan sudah
                                            sesuai sebelum dikirimkan ke Ketua
                                            RT 04.
                                        </p>
                                    </div>

                                    {/* Breakdown Data */}
                                    <div className="divide-y divide-[#E4E3DC] rounded-xl border border-[#E4E3DC] bg-[#FAF9F5]">
                                        <div className="flex justify-between p-3.5">
                                            <span className="text-[#66736C]">
                                                Jenis Surat:
                                            </span>
                                            <span className="font-bold text-[#1D2924]">
                                                {activeTemplate.title}
                                            </span>
                                        </div>
                                        <div className="flex justify-between p-3.5">
                                            <span className="text-[#66736C]">
                                                Nama Pemohon:
                                            </span>
                                            <span className="font-semibold text-[#1D2924]">
                                                {formData.applicantName}
                                            </span>
                                        </div>
                                        <div className="flex justify-between p-3.5">
                                            <span className="text-[#66736C]">
                                                Alamat Tinggal:
                                            </span>
                                            <span className="font-semibold text-[#1D2924]">
                                                Rumah Blok A-12, RT 04 / RW 09
                                            </span>
                                        </div>

                                        {activeTemplate.category ===
                                            'Usaha' && (
                                            <>
                                                <div className="flex justify-between p-3.5">
                                                    <span className="text-[#66736C]">
                                                        Nama Usaha:
                                                    </span>
                                                    <span className="font-semibold text-[#1D2924]">
                                                        {formData.businessName}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between p-3.5">
                                                    <span className="text-[#66736C]">
                                                        Bidang Usaha:
                                                    </span>
                                                    <span className="font-semibold text-[#1D2924]">
                                                        {formData.businessType}
                                                    </span>
                                                </div>
                                            </>
                                        )}

                                        <div className="space-y-1 p-3.5">
                                            <span className="text-[#66736C]">
                                                Keperluan Penggunaan:
                                            </span>
                                            <p className="rounded border border-[#E4E3DC] bg-[#FFFEFA] p-2.5 leading-relaxed font-medium text-[#1D2924]">
                                                {formData.purpose}
                                            </p>
                                        </div>

                                        {formData.destination && (
                                            <div className="flex justify-between p-3.5">
                                                <span className="text-[#66736C]">
                                                    Instansi Tujuan:
                                                </span>
                                                <span className="font-semibold text-[#1D2924]">
                                                    {formData.destination}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Info Alur Selanjutnya */}
                                    <div className="flex items-start gap-2.5 rounded-xl border border-[#2F6B57]/20 bg-[#EBF3EF] p-3 text-[11px] text-[#2F6B57]">
                                        <Info className="mt-0.5 h-4 w-4 shrink-0" />
                                        <p className="leading-relaxed">
                                            Setelah diajukan, Ketua RT 04 akan
                                            memeriksa kesesuaian data Anda. Jika
                                            diperlukan perbaikan, Anda akan
                                            menerima pemberitahuan langsung pada
                                            halaman ini.
                                        </p>
                                    </div>

                                    {/* Checkbox Deklarasi Wajib */}
                                    <label className="flex cursor-pointer items-start gap-2.5 pt-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.agreementChecked}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    agreementChecked:
                                                        e.target.checked,
                                                })
                                            }
                                            className="mt-0.5 h-4 w-4 rounded border-[#E4E3DC] text-[#2F6B57] focus:ring-[#2F6B57]"
                                        />
                                        <span className="text-xs leading-relaxed font-medium text-[#1D2924]">
                                            Saya menyatakan bahwa data yang
                                            diajukan dalam permohonan surat
                                            pengantar ini adalah benar dan dapat
                                            dipertanggungjawabkan.
                                        </span>
                                    </label>

                                    {/* Submit Actions */}
                                    <div className="flex flex-col items-center justify-between gap-3 border-t border-[#E4E3DC] pt-4 sm:flex-row">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setWizardStep('fill')
                                            }
                                            className="w-full rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-4 py-2 font-semibold text-[#1D2924] hover:bg-[#F7F6F2] sm:w-auto"
                                        >
                                            Kembali dan Perbaiki Data
                                        </button>

                                        <button
                                            type="button"
                                            disabled={
                                                !formData.agreementChecked
                                            }
                                            onClick={() =>
                                                handleSubmitApplication(false)
                                            }
                                            className={`flex w-full items-center justify-center gap-1.5 rounded-lg px-6 py-2.5 font-semibold text-[#FFFEFA] shadow-xs transition-colors sm:w-auto ${
                                                formData.agreementChecked
                                                    ? 'cursor-pointer bg-[#2F6B57] hover:bg-[#245442]'
                                                    : 'cursor-not-allowed bg-[#66736C]/40'
                                            }`}
                                        >
                                            <Send className="h-3.5 w-3.5" />
                                            <span>Ajukan Surat Sekarang</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ============================================================== */}
                        {/* WIZARD STEP 3: STATE SUKSES DIAJUKAN                           */}
                        {/* ============================================================== */}
                        {wizardStep === 'success' && (
                            <div className="space-y-5 rounded-2xl border border-[#2F6B57]/30 bg-[#FFFEFA] p-6 text-center shadow-sm sm:p-10">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EBF3EF] text-[#2F6B57]">
                                    <Check className="h-7 w-7 stroke-[2.5]" />
                                </div>

                                <div className="mx-auto max-w-md space-y-1">
                                    <span className="text-[11px] font-semibold tracking-wider text-[#2F6B57] uppercase">
                                        Pengajuan Terkirim
                                    </span>
                                    <h3 className="text-xl font-bold text-[#1D2924] sm:text-2xl">
                                        Surat Anda Menunggu Persetujuan
                                    </h3>
                                    <p className="text-xs leading-relaxed text-[#66736C] sm:text-sm">
                                        Ketua RT 04 akan meninjau{' '}
                                        <strong>{activeTemplate.title}</strong>{' '}
                                        Anda. Dokumen PDF resmi siap diunduh
                                        segera setelah disetujui.
                                    </p>
                                </div>

                                <div className="mx-auto max-w-sm space-y-1.5 rounded-xl border border-[#E4E3DC] bg-[#FAF9F5] p-3.5 text-left text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-[#66736C]">
                                            Nomor Pengajuan:
                                        </span>
                                        <span className="font-mono font-bold text-[#1D2924]">
                                            {createdTrackingNumber}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#66736C]">
                                            Tanggal Pengajuan:
                                        </span>
                                        <span className="font-semibold text-[#1D2924]">
                                            27 Oktober 2026, 21.40 WIB
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#66736C]">
                                            Status:
                                        </span>
                                        <span className="inline-flex items-center gap-1 font-semibold text-[#B87922]">
                                            <Clock className="h-3 w-3" />
                                            Menunggu Persetujuan Ketua RT
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setActiveTemplate(null);
                                            window.scrollTo({
                                                top: 350,
                                                behavior: 'smooth',
                                            });
                                        }}
                                        className="w-full rounded-lg bg-[#2F6B57] px-6 py-2.5 text-xs font-semibold text-[#FFFEFA] shadow-xs hover:bg-[#245442] sm:w-auto"
                                    >
                                        Lihat Status Pengajuan
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTemplate(null)}
                                        className="w-full rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-5 py-2.5 text-xs font-semibold text-[#1D2924] hover:bg-[#F7F6F2] sm:w-auto"
                                    >
                                        Kembali ke Beranda Surat
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    /* ============================================================== */
                    /* MODE B: HALAMAN UTAMA SURAT (KATALOG TEMPLATE & PENGAJUAN)     */
                    /* ============================================================== */
                    <div className="space-y-8">
                        {/* HEADER UTAMA */}
                        <header className="flex flex-col justify-between gap-3 border-b border-[#E4E3DC] pb-4 sm:flex-row sm:items-end">
                            <div className="space-y-1">
                                <div className="text-xs font-semibold tracking-wider text-[#2F6B57] uppercase">
                                    Komunitas Taman Sari · Blok A-12
                                </div>
                                <h1 className="text-2xl font-bold tracking-tight text-[#1D2924] sm:text-3xl">
                                    Surat Pengantar
                                </h1>
                                <p className="text-xs text-[#66736C] sm:text-sm">
                                    Ajukan kebutuhan administrasi keluarga tanpa
                                    datang berulang kali ke rumah pengurus.
                                </p>
                            </div>

                            <a
                                href="#katalog-surat"
                                className="hidden items-center gap-1.5 rounded-lg bg-[#2F6B57] px-5 py-2 text-xs font-semibold text-[#FFFEFA] shadow-xs transition-colors hover:bg-[#245442] sm:inline-flex"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Ajukan Surat Baru</span>
                            </a>
                        </header>

                        {/* TOMBOL PENGAJUAN CEPAT UNTUK MOBILE */}
                        <div className="sm:hidden">
                            <a
                                href="#katalog-surat"
                                className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#2F6B57] px-4 py-2.5 text-xs font-semibold text-[#FFFEFA] shadow-xs"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Ajukan Surat Baru</span>
                            </a>
                        </div>

                        {/* ============================================================== */}
                        {/* 1. SECTION: PENGAJUAN SAYA                                     */}
                        {/* ============================================================== */}
                        <section
                            aria-labelledby="pengajuan-saya-title"
                            className="space-y-4"
                        >
                            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                                <div className="space-y-0.5">
                                    <h2
                                        id="pengajuan-saya-title"
                                        className="text-base font-bold text-[#1D2924]"
                                    >
                                        Pengajuan Saya
                                    </h2>
                                    <p className="text-xs text-[#66736C]">
                                        Pantau status persetujuan Ketua RT dan
                                        unduh berkas yang telah disetujui.
                                    </p>
                                </div>

                                {/* Filter Tabs */}
                                <div className="inline-flex overflow-x-auto rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] p-1 text-xs">
                                    <button
                                        type="button"
                                        onClick={() => setStatusFilter('all')}
                                        className={`rounded px-2.5 py-1 font-medium transition-colors ${
                                            statusFilter === 'all'
                                                ? 'bg-[#2F6B57] text-[#FFFEFA]'
                                                : 'text-[#66736C] hover:text-[#1D2924]'
                                        }`}
                                    >
                                        Semua ({submissions.length})
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setStatusFilter('pending')
                                        }
                                        className={`rounded px-2.5 py-1 font-medium transition-colors ${
                                            statusFilter === 'pending'
                                                ? 'bg-[#2F6B57] text-[#FFFEFA]'
                                                : 'text-[#66736C] hover:text-[#1D2924]'
                                        }`}
                                    >
                                        Menunggu
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setStatusFilter('approved')
                                        }
                                        className={`rounded px-2.5 py-1 font-medium transition-colors ${
                                            statusFilter === 'approved'
                                                ? 'bg-[#2F6B57] text-[#FFFEFA]'
                                                : 'text-[#66736C] hover:text-[#1D2924]'
                                        }`}
                                    >
                                        Siap Diunduh
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setStatusFilter('revision')
                                        }
                                        className={`rounded px-2.5 py-1 font-medium transition-colors ${
                                            statusFilter === 'revision'
                                                ? 'bg-[#2F6B57] text-[#FFFEFA]'
                                                : 'text-[#66736C] hover:text-[#1D2924]'
                                        }`}
                                    >
                                        Perlu Perbaikan
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStatusFilter('draft')}
                                        className={`rounded px-2.5 py-1 font-medium transition-colors ${
                                            statusFilter === 'draft'
                                                ? 'bg-[#2F6B57] text-[#FFFEFA]'
                                                : 'text-[#66736C] hover:text-[#1D2924]'
                                        }`}
                                    >
                                        Draf
                                    </button>
                                </div>
                            </div>

                            {/* LIST PENGAJUAN SAYA */}
                            {filteredSubmissions.length > 0 ? (
                                <div className="divide-y divide-[#E4E3DC] rounded-xl border border-[#E4E3DC] bg-[#FFFEFA]">
                                    {filteredSubmissions.map((sub) => {
                                        return (
                                            <div
                                                key={sub.id}
                                                className="flex flex-col justify-between gap-3 p-4 transition-colors hover:bg-[#FAF9F5] sm:flex-row sm:items-center sm:p-4.5"
                                            >
                                                <div className="space-y-1.5 sm:max-w-md md:max-w-lg">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="font-mono text-[11px] font-bold text-[#2F6B57]">
                                                            {sub.trackingNumber}
                                                        </span>
                                                        <span className="text-xs text-[#66736C]">
                                                            ·
                                                        </span>
                                                        <span className="text-xs text-[#66736C]">
                                                            Diajukan{' '}
                                                            {sub.submittedDate}
                                                        </span>

                                                        {/* Status Badges */}
                                                        {sub.status ===
                                                            'approved' && (
                                                            <span className="inline-flex items-center gap-1 rounded bg-[#EAF4EE] px-2 py-0.5 text-[11px] font-semibold text-[#2F7D5C]">
                                                                <CheckCircle2 className="h-3 w-3" />
                                                                Siap Diunduh
                                                            </span>
                                                        )}
                                                        {sub.status ===
                                                            'pending' && (
                                                            <span className="inline-flex items-center gap-1 rounded bg-[#FAF2E6] px-2 py-0.5 text-[11px] font-semibold text-[#B87922]">
                                                                <Clock className="h-3 w-3" />
                                                                Menunggu
                                                                Persetujuan
                                                            </span>
                                                        )}
                                                        {sub.status ===
                                                            'revision' && (
                                                            <span className="inline-flex items-center gap-1 rounded bg-[#FBEBE9] px-2 py-0.5 text-[11px] font-semibold text-[#B74E44]">
                                                                <AlertCircle className="h-3 w-3" />
                                                                Perlu Perbaikan
                                                            </span>
                                                        )}
                                                        {sub.status ===
                                                            'draft' && (
                                                            <span className="inline-flex items-center gap-1 rounded bg-[#F7F6F2] px-2 py-0.5 text-[11px] font-medium text-[#66736C]">
                                                                Draf
                                                            </span>
                                                        )}
                                                    </div>

                                                    <h3 className="text-sm font-bold text-[#1D2924]">
                                                        {sub.title}
                                                    </h3>

                                                    <p className="line-clamp-1 text-xs text-[#66736C]">
                                                        Pemohon:{' '}
                                                        <strong>
                                                            {sub.applicantName}
                                                        </strong>{' '}
                                                        · {sub.purpose}
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between gap-3 sm:justify-end">
                                                    {sub.status ===
                                                        'approved' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedSubmission(
                                                                    sub,
                                                                );
                                                                setIsPdfPreviewModalOpen(
                                                                    true,
                                                                );
                                                            }}
                                                            className="inline-flex items-center gap-1 rounded-lg border border-[#2F7D5C] bg-[#EAF4EE] px-3 py-1.5 text-xs font-semibold text-[#2F7D5C] transition-colors hover:bg-[#2F7D5C] hover:text-[#FFFEFA]"
                                                        >
                                                            <Download className="h-3.5 w-3.5" />
                                                            <span>
                                                                Unduh PDF
                                                            </span>
                                                        </button>
                                                    )}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedSubmission(
                                                                sub,
                                                            )
                                                        }
                                                        className="rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] px-3.5 py-1.5 text-xs font-semibold text-[#1D2924] transition-colors hover:bg-[#E4E3DC]"
                                                    >
                                                        Lihat Detail
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                /* EMPTY STATE */
                                <div className="space-y-3 rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-8 text-center sm:p-12">
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#E4E3DC] bg-[#FAF9F5] text-[#2F6B57]">
                                        <FileText className="h-6 w-6 stroke-1" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-base font-bold text-[#1D2924]">
                                            Belum ada pengajuan surat
                                        </h3>
                                        <p className="mx-auto max-w-sm text-xs text-[#66736C]">
                                            Kebutuhan surat pengantar RT untuk
                                            keperluan kependudukan atau
                                            administrasi Anda akan tercatat di
                                            sini.
                                        </p>
                                    </div>
                                    <div className="pt-2">
                                        <a
                                            href="#katalog-surat"
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#2F6B57] px-4 py-2 text-xs font-semibold text-[#FFFEFA] shadow-xs hover:bg-[#245442]"
                                        >
                                            <Plus className="h-3.5 w-3.5" />
                                            <span>Ajukan Surat Pertama</span>
                                        </a>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* ============================================================== */}
                        {/* 2. SECTION: KATALOG TEMPLATE SURAT ("PILIH KEBUTUHAN ANDA")    */}
                        {/* ============================================================== */}
                        <section
                            id="katalog-surat"
                            aria-labelledby="katalog-title"
                            className="space-y-4 border-t border-[#E4E3DC] pt-4"
                        >
                            <div className="space-y-0.5">
                                <h2
                                    id="katalog-title"
                                    className="text-base font-bold text-[#1D2924]"
                                >
                                    Pilih Kebutuhan Anda
                                </h2>
                                <p className="text-xs text-[#66736C]">
                                    Pilih jenis surat yang Anda perlukan, lalu
                                    isi informasi yang dibutuhkan.
                                </p>
                            </div>

                            {/* GRID TEMPLATE SURAT (MAKS 2 KOLOM DESKTOP, 1 KOLOM MOBILE) */}
                            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                                {LETTER_TEMPLATES.map((tmpl) => (
                                    <div
                                        key={tmpl.id}
                                        className="group flex flex-col justify-between rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-4.5 shadow-2xs transition-all hover:border-[#2F6B57] hover:bg-[#FAF9F5]"
                                    >
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2.5">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EBF3EF] text-[#2F6B57] transition-transform group-hover:scale-105">
                                                    <FileCheck className="h-4 w-4" />
                                                </div>
                                                <h3 className="text-xs font-bold text-[#1D2924] sm:text-sm">
                                                    {tmpl.title}
                                                </h3>
                                            </div>

                                            <p className="text-xs leading-snug text-[#66736C]">
                                                {tmpl.description}
                                            </p>

                                            <div className="rounded bg-[#F7F6F2] px-2.5 py-1.5 text-[11px] text-[#66736C]">
                                                <span className="font-medium text-[#1D2924]">
                                                    Alur:
                                                </span>{' '}
                                                {tmpl.flow}
                                            </div>
                                        </div>

                                        <div className="mt-3 flex justify-end border-t border-[#E4E3DC] pt-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleStartApplication(tmpl)
                                                }
                                                className="inline-flex items-center gap-1 text-xs font-semibold text-[#2F6B57] group-hover:underline"
                                            >
                                                <span>Pilih Surat</span>
                                                <ChevronRight className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {/* ITEM BANTUAN: JENIS SURAT LAINNYA */}
                                <div className="flex flex-col justify-between rounded-xl border border-dashed border-[#E4E3DC] bg-[#FAF9F5] p-4.5">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2">
                                            <Info className="h-4 w-4 text-[#66736C]" />
                                            <h3 className="text-xs font-bold text-[#1D2924]">
                                                Belum menemukan surat yang Anda
                                                butuhkan?
                                            </h3>
                                        </div>
                                        <p className="text-xs leading-relaxed text-[#66736C]">
                                            Pengurus RT 04 dapat menambahkan
                                            surat kustom untuk keperluan khusus
                                            seperti izin keramaian atau acara
                                            keluarga.
                                        </p>
                                    </div>

                                    <div className="mt-3 flex justify-start pt-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsContactHelpModalOpen(true)
                                            }
                                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#2F6B57] hover:underline"
                                        >
                                            <MessageSquare className="h-3.5 w-3.5" />
                                            <span>
                                                Hubungi Pengurus Komunitas
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                )}
            </div>

            {/* ============================================================== */}
            {/* MODAL: DETAIL PENGAJUAN SURAT (MULTI-STATUS)                   */}
            {/* ============================================================== */}
            {selectedSubmission && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D2924]/40 p-4 backdrop-blur-xs">
                    <div className="max-h-[92vh] w-full max-w-lg animate-in space-y-5 overflow-y-auto rounded-2xl border border-[#E4E3DC] bg-[#FFFEFA] p-6 shadow-lg duration-150 zoom-in-95">
                        {/* Header Modal */}
                        <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-3">
                            <button
                                type="button"
                                onClick={() => setSelectedSubmission(null)}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#66736C] hover:text-[#1D2924]"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span>Tutup</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setSelectedSubmission(null)}
                                className="rounded p-1 text-[#66736C] hover:text-[#1D2924]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Top Info */}
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-[#2F6B57]">
                                    {selectedSubmission.trackingNumber}
                                </span>
                                <span className="text-xs text-[#66736C]">
                                    · Diajukan{' '}
                                    {selectedSubmission.submittedDate}
                                </span>

                                {selectedSubmission.status === 'approved' && (
                                    <span className="inline-flex items-center gap-1 rounded bg-[#EAF4EE] px-2 py-0.5 text-[11px] font-semibold text-[#2F7D5C]">
                                        <CheckCircle2 className="h-3 w-3" />
                                        Siap Diunduh
                                    </span>
                                )}
                                {selectedSubmission.status === 'pending' && (
                                    <span className="inline-flex items-center gap-1 rounded bg-[#FAF2E6] px-2 py-0.5 text-[11px] font-semibold text-[#B87922]">
                                        <Clock className="h-3 w-3" />
                                        Menunggu Persetujuan
                                    </span>
                                )}
                                {selectedSubmission.status === 'revision' && (
                                    <span className="inline-flex items-center gap-1 rounded bg-[#FBEBE9] px-2 py-0.5 text-[11px] font-semibold text-[#B74E44]">
                                        <AlertCircle className="h-3 w-3" />
                                        Perlu Perbaikan
                                    </span>
                                )}
                            </div>

                            <h3 className="text-xl font-bold text-[#1D2924]">
                                {selectedSubmission.title}
                            </h3>
                        </div>

                        {/* TIMELINE STATUS SEDERHANA */}
                        <div className="space-y-2 rounded-xl border border-[#E4E3DC] bg-[#FAF9F5] p-3 text-xs">
                            <span className="text-[10px] font-bold tracking-wider text-[#66736C] uppercase">
                                Alur Persetujuan Dokumen:
                            </span>
                            <div className="grid grid-cols-4 gap-1 text-center text-[10px]">
                                <div className="rounded bg-[#EAF4EE] py-1 font-semibold text-[#2F7D5C]">
                                    1. Diajukan
                                </div>
                                <div
                                    className={`rounded py-1 font-semibold ${selectedSubmission.status !== 'draft' ? 'bg-[#EAF4EE] text-[#2F7D5C]' : 'bg-[#E4E3DC] text-[#66736C]'}`}
                                >
                                    2. Diperiksa RT
                                </div>
                                <div
                                    className={`rounded py-1 font-semibold ${selectedSubmission.status === 'approved' ? 'bg-[#EAF4EE] text-[#2F7D5C]' : selectedSubmission.status === 'revision' ? 'bg-[#FBEBE9] text-[#B74E44]' : 'bg-[#FAF2E6] text-[#B87922]'}`}
                                >
                                    {selectedSubmission.status === 'revision'
                                        ? '3. Revisi'
                                        : '3. Keputusan'}
                                </div>
                                <div
                                    className={`rounded py-1 font-semibold ${selectedSubmission.status === 'approved' ? 'bg-[#2F6B57] text-[#FFFEFA]' : 'bg-[#E4E3DC] text-[#66736C]'}`}
                                >
                                    4. Terbit PDF
                                </div>
                            </div>
                        </div>

                        {/* STATUS CALLOUTS */}
                        {/* 1. STATE MENUNGGU */}
                        {selectedSubmission.status === 'pending' && (
                            <div className="space-y-3 rounded-xl border border-[#B87922]/30 bg-[#FAF2E6]/40 p-4 text-xs">
                                <div className="flex items-center gap-1.5 font-bold text-[#B87922]">
                                    <Clock className="h-4 w-4" />
                                    <span>Menunggu Persetujuan Ketua RT</span>
                                </div>
                                <p className="leading-relaxed text-[#66736C]">
                                    Pengajuan Anda sedang menunggu tinjauan dan
                                    tanda tangan digital Ketua RT 04. Dokumen
                                    akan diterbitkan otomatis setelah disetujui.
                                </p>
                                <div className="pt-1">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsWhatsAppModalOpen(true)
                                        }
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-3.5 py-1.5 font-semibold text-[#1D2924] hover:bg-[#F7F6F2]"
                                    >
                                        <MessageSquare className="h-3.5 w-3.5 text-[#2F6B57]" />
                                        <span>
                                            Kirim Pesan WhatsApp ke Ketua RT
                                        </span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* 2. STATE PERLU PERBAIKAN */}
                        {selectedSubmission.status === 'revision' && (
                            <div className="space-y-3 rounded-xl border border-[#B74E44]/30 bg-[#FFF7F6] p-4 text-xs">
                                <div className="flex items-center gap-1.5 font-bold text-[#B74E44]">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>Catatan Perbaikan dari Ketua RT</span>
                                </div>
                                <p className="rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] p-3 leading-relaxed font-medium text-[#1D2924]">
                                    "{selectedSubmission.rtNotes}"
                                </p>
                                <div className="text-[11px] text-[#66736C]">
                                    Permintaan perbaikan tercatat pada{' '}
                                    {selectedSubmission.revisionRequestedAt}.
                                </div>
                                <div className="flex gap-2 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const tmpl =
                                                LETTER_TEMPLATES.find(
                                                    (t) =>
                                                        t.id ===
                                                        selectedSubmission.templateId,
                                                ) || LETTER_TEMPLATES[0];
                                            setSelectedSubmission(null);
                                            handleStartApplication(tmpl);
                                        }}
                                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#2F6B57] py-2 font-semibold text-[#FFFEFA] hover:bg-[#245442]"
                                    >
                                        <Edit3 className="h-3.5 w-3.5" />
                                        <span>Perbaiki Pengajuan Sekarang</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* 3. STATE DISETUJUI & SIAP DIUNDUH */}
                        {selectedSubmission.status === 'approved' && (
                            <div className="space-y-3 rounded-xl border border-[#2F7D5C]/30 bg-[#EAF4EE]/40 p-4 text-xs">
                                <div className="flex items-center gap-1.5 font-bold text-[#2F7D5C]">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>
                                        Surat Telah Disetujui & Diterbitkan
                                        Resmi
                                    </span>
                                </div>
                                <div className="space-y-1 rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] p-3 text-[11px]">
                                    <div className="flex justify-between">
                                        <span className="text-[#66736C]">
                                            Nomor Surat Resmi:
                                        </span>
                                        <span className="font-mono font-bold text-[#1D2924]">
                                            {
                                                selectedSubmission.officialLetterNumber
                                            }
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#66736C]">
                                            Tanggal Persetujuan:
                                        </span>
                                        <span className="font-semibold text-[#1D2924]">
                                            {selectedSubmission.approvedDate}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#66736C]">
                                            Penandatangan:
                                        </span>
                                        <span className="font-semibold text-[#1D2924]">
                                            {selectedSubmission.approvedBy}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-[11px] text-[#66736C]">
                                    Pastikan dokumen dicetak atau dikirimkan
                                    sesuai kebutuhan instansi tujuan Anda.
                                </p>
                                <div className="flex gap-2 pt-1">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsPdfPreviewModalOpen(true)
                                        }
                                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#2F6B57] py-2 font-semibold text-[#FFFEFA] hover:bg-[#245442]"
                                    >
                                        <Download className="h-3.5 w-3.5" />
                                        <span>Unduh Berkas PDF</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (navigator.clipboard) {
                                                void navigator.clipboard.writeText(
                                                    `Tautan dokumen resmi ${selectedSubmission.title}: https://komunitashub.id/dokumen/${selectedSubmission.trackingNumber}`,
                                                );
                                                alert(
                                                    'Tautan dokumen resmi berhasil disalin untuk dibagikan.',
                                                );
                                            }
                                        }}
                                        className="flex items-center gap-1 rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-3.5 py-2 font-semibold text-[#1D2924] hover:bg-[#F7F6F2]"
                                    >
                                        <Share2 className="h-3.5 w-3.5 text-[#2F6B57]" />
                                        <span>Bagikan</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* DETAIL ISIAN FORM READ-ONLY */}
                        <div className="space-y-2 text-xs">
                            <span className="font-semibold text-[#1D2924]">
                                Informasi Pengajuan:
                            </span>
                            <div className="divide-y divide-[#E4E3DC] rounded-xl border border-[#E4E3DC] bg-[#FFFEFA]">
                                <div className="flex justify-between p-3">
                                    <span className="text-[#66736C]">
                                        Pemohon
                                    </span>
                                    <span className="font-semibold text-[#1D2924]">
                                        {selectedSubmission.applicantName}
                                    </span>
                                </div>
                                <div className="flex justify-between p-3">
                                    <span className="text-[#66736C]">
                                        Alamat Domisili
                                    </span>
                                    <span className="font-semibold text-[#1D2924]">
                                        Rumah Blok A-12, RT 04 / RW 09
                                    </span>
                                </div>
                                {selectedSubmission.businessName && (
                                    <div className="flex justify-between p-3">
                                        <span className="text-[#66736C]">
                                            Nama Usaha
                                        </span>
                                        <span className="font-semibold text-[#1D2924]">
                                            {selectedSubmission.businessName}
                                        </span>
                                    </div>
                                )}
                                <div className="space-y-1 p-3">
                                    <span className="text-[#66736C]">
                                        Keperluan Penggunaan:
                                    </span>
                                    <p className="leading-relaxed font-medium text-[#1D2924]">
                                        {selectedSubmission.purpose}
                                    </p>
                                </div>
                                {selectedSubmission.destination && (
                                    <div className="flex justify-between p-3">
                                        <span className="text-[#66736C]">
                                            Tujuan
                                        </span>
                                        <span className="font-semibold text-[#1D2924]">
                                            {selectedSubmission.destination}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end border-t border-[#E4E3DC] pt-2">
                            <button
                                type="button"
                                onClick={() => setSelectedSubmission(null)}
                                className="rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] px-4 py-2 text-xs font-semibold text-[#1D2924] hover:bg-[#E4E3DC]"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================================== */}
            {/* MODAL: PRATINJAU DOKUMEN SURAT RESMI PDF                      */}
            {/* ============================================================== */}
            {isPdfPreviewModalOpen && selectedSubmission && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D2924]/50 p-4 backdrop-blur-xs">
                    <div className="max-h-[92vh] w-full max-w-2xl animate-in space-y-4 overflow-y-auto rounded-2xl border border-[#E4E3DC] bg-[#FFFEFA] p-6 shadow-xl duration-150 zoom-in-95">
                        <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-3">
                            <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-[#2F6B57]" />
                                <span className="text-xs font-bold text-[#1D2924]">
                                    Pratinjau Dokumen PDF Resmi
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsPdfPreviewModalOpen(false)}
                                className="rounded p-1 text-[#66736C] hover:text-[#1D2924]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* SIMULASI LEMBAR SURAT DENGAN KOP RESMI RT */}
                        <div className="space-y-5 rounded-xl border border-[#E4E3DC] bg-[#FAF9F5] p-6 font-serif text-xs text-[#1D2924] shadow-xs sm:p-8">
                            {/* KOP SURAT */}
                            <div className="space-y-0.5 border-b-2 border-double border-[#1D2924] pb-3 text-center">
                                <div className="text-xs font-bold tracking-wider uppercase">
                                    RUKUN TETANGGA 04 / RUKUN WARGA 09
                                </div>
                                <div className="text-sm font-bold tracking-wider uppercase">
                                    KELURAHAN SUKAMAJU · KECAMATAN TAMAN SARI
                                </div>
                                <div className="font-sans text-[10px] text-[#66736C]">
                                    Sekretariat: Pos Balai Warga RT 04 Sukamaju,
                                    Telepon: (021) 8291039
                                </div>
                            </div>

                            {/* JUDUL SURAT */}
                            <div className="space-y-0.5 pt-2 text-center">
                                <div className="text-sm font-bold tracking-wider uppercase underline">
                                    {selectedSubmission.title}
                                </div>
                                <div className="font-sans text-[11px] text-[#66736C]">
                                    Nomor:{' '}
                                    {selectedSubmission.officialLetterNumber ||
                                        '470/04/RT-SMJ/X/2026'}
                                </div>
                            </div>

                            {/* ISI SURAT */}
                            <div className="space-y-3 text-[11px] leading-relaxed">
                                <p>
                                    Yang bertanda tangan di bawah ini Ketua
                                    Rukun Tetangga (RT) 04 / RW 09 Kelurahan
                                    Sukamaju, Kecamatan Taman Sari, dengan ini
                                    menerangkan bahwa:
                                </p>

                                <div className="space-y-1 pl-4 font-sans">
                                    <div className="grid grid-cols-3">
                                        <span className="text-[#66736C]">
                                            Nama Lengkap
                                        </span>
                                        <span className="col-span-2 font-semibold">
                                            : {selectedSubmission.applicantName}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-3">
                                        <span className="text-[#66736C]">
                                            Alamat Domisili
                                        </span>
                                        <span className="col-span-2 font-semibold">
                                            : Rumah Blok A No. 12, RT 04 / RW 09
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-3">
                                        <span className="text-[#66736C]">
                                            Status Tinggal
                                        </span>
                                        <span className="col-span-2 font-semibold">
                                            : Warga Tetap Terdaftar
                                        </span>
                                    </div>
                                    {selectedSubmission.businessName && (
                                        <div className="grid grid-cols-3">
                                            <span className="text-[#66736C]">
                                                Keterangan Usaha
                                            </span>
                                            <span className="col-span-2 font-semibold">
                                                :{' '}
                                                {
                                                    selectedSubmission.businessName
                                                }{' '}
                                                (
                                                {
                                                    selectedSubmission.businessType
                                                }
                                                )
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <p>
                                    Orang tersebut di atas adalah benar warga
                                    yang berdomisili di lingkungan kami dan
                                    surat pengantar ini dibuat untuk keperluan:{' '}
                                    <strong>
                                        {selectedSubmission.purpose}
                                    </strong>
                                    .
                                </p>

                                <p>
                                    Demikian surat pengantar ini kami terbitkan
                                    dengan sebenarnya untuk dapat dipergunakan
                                    sebagaimana mestinya.
                                </p>
                            </div>

                            {/* TANDA TANGAN & STEMPEL RT */}
                            <div className="flex justify-end pt-6 font-sans">
                                <div className="w-48 space-y-1 text-center">
                                    <div className="text-[11px] text-[#66736C]">
                                        Sukamaju,{' '}
                                        {selectedSubmission.approvedDate ||
                                            '9 Oktober 2026'}
                                    </div>
                                    <div className="text-[11px] font-bold">
                                        Ketua RT 04 Sukamaju
                                    </div>
                                    <div className="flex h-14 items-center justify-center">
                                        <div className="rotate-[-5deg] rounded border border-[#2F7D5C] px-2 py-0.5 text-[9px] font-bold text-[#2F7D5C]">
                                            TERVERIFIKASI DIGITAL RT 04
                                        </div>
                                    </div>
                                    <div className="text-xs font-bold underline">
                                        HENDRA GUNAWAN
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E4E3DC] pt-3">
                            <span className="text-[11px] text-[#66736C]">
                                Dokumen digital tersertifikasi resmi oleh
                                KomunitasHub.
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        window.print();
                                    }}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-3.5 py-2 text-xs font-semibold text-[#1D2924] hover:bg-[#F7F6F2]"
                                >
                                    <Printer className="h-3.5 w-3.5" />
                                    <span>Cetak Lembar</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        alert(
                                            'Surat Pengantar PDF resmi berhasil diunduh ke perangkat Anda.',
                                        );
                                    }}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#2F6B57] px-4 py-2 text-xs font-semibold text-[#FFFEFA] shadow-xs hover:bg-[#245442]"
                                >
                                    <Download className="h-3.5 w-3.5" />
                                    <span>Unduh PDF</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================================== */}
            {/* MODAL: PESAN PRE-FILLED WHATSAPP UNTUK KETUA RT                 */}
            {/* ============================================================== */}
            {isWhatsAppModalOpen && selectedSubmission && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D2924]/40 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-md animate-in space-y-4 rounded-2xl border border-[#E4E3DC] bg-[#FFFEFA] p-6 shadow-lg duration-150 zoom-in-95">
                        <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-3">
                            <div className="space-y-0.5">
                                <h3 className="text-base font-bold text-[#1D2924]">
                                    Hubungi Ketua RT via WhatsApp
                                </h3>
                                <p className="text-xs text-[#66736C]">
                                    Pratinjau pesan ramah untuk menanyakan
                                    pengajuan surat.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsWhatsAppModalOpen(false)}
                                className="rounded p-1 text-[#66736C] hover:text-[#1D2924]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-2 rounded-xl border border-[#E4E3DC] bg-[#FAF9F5] p-4 text-xs">
                            <span className="text-[11px] font-semibold tracking-wider text-[#2F6B57] uppercase">
                                Teks yang akan dikirim:
                            </span>
                            <p className="rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] p-3 leading-relaxed text-[#1D2924] italic">
                                "Halo Pak Hendra (Ketua RT 04), saya Budi
                                Pratama dari Rumah Blok A-12 ingin menanyakan
                                status pengajuan {selectedSubmission.title} (
                                {selectedSubmission.trackingNumber}) saya
                                melalui KomunitasHub. Terima kasih."
                            </p>
                            <p className="text-[11px] text-[#66736C]">
                                Pesan akan terbuka langsung di aplikasi WhatsApp
                                Anda tanpa perantara bot.
                            </p>
                        </div>

                        <div className="flex justify-end gap-2 border-t border-[#E4E3DC] pt-2 text-xs">
                            <button
                                type="button"
                                onClick={() => setIsWhatsAppModalOpen(false)}
                                className="rounded-lg px-4 py-2 font-medium text-[#66736C] hover:text-[#1D2924]"
                            >
                                Batal
                            </button>
                            <a
                                href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                                    `Halo Pak Hendra (Ketua RT 04), saya Budi Pratama dari Rumah Blok A-12 ingin menanyakan status pengajuan ${selectedSubmission.title} (${selectedSubmission.trackingNumber}) saya melalui KomunitasHub. Terima kasih.`,
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setIsWhatsAppModalOpen(false)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#2F6B57] px-4 py-2 font-semibold text-[#FFFEFA] hover:bg-[#245442]"
                            >
                                <MessageSquare className="h-4 w-4" />
                                <span>Buka WhatsApp</span>
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================================== */}
            {/* MODAL: HUBUNGI PENGURUS UNTUK SURAT LAINNYA                    */}
            {/* ============================================================== */}
            {isContactHelpModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D2924]/40 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-md animate-in space-y-4 rounded-2xl border border-[#E4E3DC] bg-[#FFFEFA] p-6 shadow-lg duration-150 zoom-in-95">
                        <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-3">
                            <div className="space-y-0.5">
                                <h3 className="text-base font-bold text-[#1D2924]">
                                    Kebutuhan Surat Khusus
                                </h3>
                                <p className="text-xs text-[#66736C]">
                                    Sekretariat Pengurus RT 04 Sukamaju
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsContactHelpModalOpen(false)}
                                className="rounded p-1 text-[#66736C] hover:text-[#1D2924]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <p className="text-xs leading-relaxed text-[#1D2924]">
                            Bila Anda membutuhkan surat pengantar di luar 5
                            template yang tersedia (misalnya surat izin
                            keramaian, surat keterangan beda nama, atau surat
                            rekomendasi lingkungan), silakan sampaikan langsung
                            ke sekretariat RT.
                        </p>

                        <div className="space-y-1.5 rounded-xl border border-[#E4E3DC] bg-[#FAF9F5] p-3.5 text-xs">
                            <div className="font-semibold text-[#1D2924]">
                                Pos Pelayanan Warga:
                            </div>
                            <div className="text-[#66736C]">
                                Sekretariat RT 04 · Balai Warga Taman Sari
                            </div>
                            <div className="text-[#66736C]">
                                Jam Pelayanan: Senin - Sabtu (19.00 - 21.00 WIB)
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 border-t border-[#E4E3DC] pt-2 text-xs">
                            <button
                                type="button"
                                onClick={() => setIsContactHelpModalOpen(false)}
                                className="rounded-lg px-4 py-2 font-medium text-[#66736C] hover:text-[#1D2924]"
                            >
                                Tutup
                            </button>
                            <a
                                href="https://wa.me/6281234567890?text=Halo%20Pengurus%20RT%2004%2C%20saya%20warga%20Blok%20A-12%20ingin%20menanyakan%20kebutuhan%20surat%20pengantar%20khusus."
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setIsContactHelpModalOpen(false)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#2F6B57] px-4 py-2 font-semibold text-[#FFFEFA] hover:bg-[#245442]"
                            >
                                <MessageSquare className="h-4 w-4" />
                                <span>Hubungi Sekretariat RT</span>
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </CitizenLayout>
    );
}
