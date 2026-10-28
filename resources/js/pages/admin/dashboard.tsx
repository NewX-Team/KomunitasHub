import React, { useState } from 'react';
import AdminLayout, { AdminNavKey } from '@/layouts/admin-layout';
import {
    UserCheck,
    Home,
    KeyRound,
    UserPlus,
    Clock,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    X,
    Shield,
    Users,
    Copy,
    Building2,
    Calendar,
    ArrowRight,
    RefreshCw,
    QrCode,
} from 'lucide-react';

type SimulationState =
    | 'normal'
    | 'all_caught_up'
    | 'high_pending'
    | 'new_community'
    | 'no_houses'
    | 'limited_access';

interface PendingTask {
    id: string;
    title: string;
    detail: string;
    ctaLabel: string;
    category: 'verification' | 'revision' | 'invitation' | 'security';
    actionKey: string;
    badgeText?: string;
    isPrimary?: boolean;
}

interface RecentActivity {
    id: string;
    time: string;
    description: string;
    category:
        | 'Verifikasi'
        | 'Role'
        | 'Undangan'
        | 'Data Keluarga'
        | 'Pengaturan';
    actor: string;
    detailNote?: string;
}

export default function AdminDashboard() {
    // Mode & Simulation states
    const [communityMode, setCommunityMode] = useState<
        'RT Mandiri' | 'Cluster Aman'
    >('Cluster Aman');
    const [simState, setSimState] = useState<SimulationState>('normal');
    const [activeNav, setActiveNav] = useState<AdminNavKey>('ringkasan');

    // Modals
    const [isVerificationModalOpen, setIsVerificationModalOpen] =
        useState(false);
    const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
    const [isAddHouseModalOpen, setIsAddHouseModalOpen] = useState(false);
    const [isCreateInviteModalOpen, setIsCreateInviteModalOpen] =
        useState(false);
    const [isAddOfficerModalOpen, setIsAddOfficerModalOpen] = useState(false);
    const [isHousesListModalOpen, setIsHousesListModalOpen] = useState(false);
    const [isPosActivityModalOpen, setIsPosActivityModalOpen] = useState(false);
    const [selectedActivityDetail, setSelectedActivityDetail] =
        useState<RecentActivity | null>(null);

    // Form states
    const [newHouseBlock, setNewHouseBlock] = useState('Blok B-08');
    const [newHouseType, setNewHouseType] = useState('Dihuni');
    const [generatedCode, setGeneratedCode] = useState('KHB-RT04-A7X9');
    const [inviteQuota, setInviteQuota] = useState('20');
    const [copiedCode, setCopiedCode] = useState(false);
    const [officerName, setOfficerName] = useState('');
    const [officerRole, setOfficerRole] = useState('Satpam Pos');
    const [actionSuccessNotice, setActionSuccessNotice] = useState<
        string | null
    >(null);

    // Pending tasks definition based on state and mode
    const getTasks = (): PendingTask[] => {
        if (simState === 'all_caught_up') {
            return [];
        }

        if (simState === 'new_community') {
            return [
                {
                    id: 'setup-1',
                    title: 'Daftar rumah belum ditambahkan',
                    detail: 'Impor atau buat data rumah untuk membuka pendaftaran warga.',
                    ctaLabel: 'Tambah Rumah',
                    category: 'verification',
                    actionKey: 'add_house',
                    isPrimary: true,
                },
                {
                    id: 'setup-2',
                    title: 'Belum ada kode undangan aktif',
                    detail: 'Buat kode undangan RT 04 agar warga dapat bergabung.',
                    ctaLabel: 'Buat Kode',
                    category: 'invitation',
                    actionKey: 'create_invite',
                },
            ];
        }

        if (simState === 'no_houses') {
            return [
                {
                    id: 'no-houses-task',
                    title: 'Belum ada data rumah terdaftar',
                    detail: 'Tambahkan data rumah sebelum membagikan kode undangan kepada warga.',
                    ctaLabel: 'Tambah Rumah',
                    category: 'verification',
                    actionKey: 'add_house',
                    isPrimary: true,
                },
            ];
        }

        const verificationCount = simState === 'high_pending' ? 12 : 6;
        const verificationDetail =
            simState === 'high_pending'
                ? 'Antrean pengajuan melonjak dalam 24 jam terakhir.'
                : 'Pengajuan terbaru masuk 12 menit lalu.';

        const baseTasks: PendingTask[] = [
            {
                id: 'task-1',
                title: `${verificationCount} keluarga menunggu verifikasi`,
                detail: verificationDetail,
                ctaLabel:
                    simState === 'high_pending'
                        ? 'Buka Antrean Verifikasi'
                        : 'Tinjau Pengajuan',
                category: 'verification',
                actionKey: 'review_verification',
                badgeText:
                    simState === 'high_pending'
                        ? 'Prioritas Tinggi'
                        : '12 mnt lalu',
                isPrimary: true,
            },
            {
                id: 'task-2',
                title: '2 data keluarga perlu ditinjau ulang',
                detail: 'Warga telah mengirim perbaikan data KK dan nomor kontak WhatsApp.',
                ctaLabel: 'Lihat Perbaikan',
                category: 'revision',
                actionKey: 'review_revision',
                badgeText: 'Perbaikan',
            },
            {
                id: 'task-3',
                title: '1 kode undangan akan berakhir hari ini',
                detail: 'Kode KHB-RT04-A7X9 aktif hingga 23.59 WIB malam ini.',
                ctaLabel: 'Kelola Kode',
                category: 'invitation',
                actionKey: 'manage_invite',
                badgeText: 'Kedaluwarsa Hari Ini',
            },
        ];

        // Khusus Cluster Aman: Tambahkan task satpam
        if (communityMode === 'Cluster Aman') {
            baseTasks.push({
                id: 'task-4',
                title: '1 akun satpam belum aktif',
                detail: 'Undangan untuk Pos Utama belum diterima atau belum dikonfirmasi.',
                ctaLabel: 'Kelola Pengurus',
                category: 'security',
                actionKey: 'manage_officer',
                badgeText: 'Pos Utama',
            });
        }

        return baseTasks;
    };

    const tasks = getTasks();

    // Metrics based on state
    const getMetrics = () => {
        if (simState === 'new_community') {
            return {
                houses: 0,
                activeFamilies: 0,
                pendingVerification: 0,
                vacantHouses: 0,
            };
        }
        if (simState === 'no_houses') {
            return {
                houses: 0,
                activeFamilies: 0,
                pendingVerification: 0,
                vacantHouses: 0,
            };
        }
        if (simState === 'all_caught_up') {
            return {
                houses: 124,
                activeFamilies: 123,
                pendingVerification: 0,
                vacantHouses: 1,
            };
        }
        if (simState === 'high_pending') {
            return {
                houses: 130,
                activeFamilies: 115,
                pendingVerification: 12,
                vacantHouses: 3,
            };
        }
        return {
            houses: 124,
            activeFamilies: 117,
            pendingVerification: 6,
            vacantHouses: 1,
        };
    };

    const metrics = getMetrics();

    // Recent activity data (max 5 items)
    const recentActivities: RecentActivity[] = [
        {
            id: 'act-1',
            time: '10.42',
            description:
                'Keluarga Budi Santoso mengajukan verifikasi untuk Blok A-12.',
            category: 'Verifikasi',
            actor: 'Budi Santoso',
            detailNote:
                'Mengunggah data 4 jiwa (Kepala Keluarga, Istri, 2 Anak). Alamat terkonfirmasi sesuai pemetaan RT.',
        },
        {
            id: 'act-2',
            time: '09.30',
            description:
                'Dewi Lestari menetapkan Arman Hakim sebagai Bendahara.',
            category: 'Role',
            actor: 'Dewi Lestari (Admin)',
            detailNote:
                'Akses bendahara aktif untuk pencatatan iuran, approval manual transfer bank, dan publikasi buku kas bulanan.',
        },
        {
            id: 'act-3',
            time: 'Kemarin',
            description:
                'Kode undangan KHB-RT04-M2K8 dibuat untuk 20 penggunaan.',
            category: 'Undangan',
            actor: 'Dewi Lestari (Admin)',
            detailNote:
                'Kode undangan khusus untuk warga klaster tahap 2. Berlaku hingga 31 Oktober 2026.',
        },
        {
            id: 'act-4',
            time: 'Kemarin',
            description: 'Keluarga Nabila memperbarui nomor WhatsApp.',
            category: 'Data Keluarga',
            actor: 'Nabila Wijaya (Blok C-03)',
            detailNote:
                'Pembaruan nomor kontak darurat untuk notifikasi izin tamu dan tagihan iuran bulanan.',
        },
        {
            id: 'act-5',
            time: '25 Okt',
            description: 'Template Surat Pengantar Usaha diperbarui.',
            category: 'Pengaturan',
            actor: 'Dewi Lestari (Admin)',
            detailNote:
                'Menambahkan kolom legalitas izin UMKM dan konfirmasi jam operasional usaha rumahan.',
        },
    ];

    const handleTaskAction = (actionKey: string) => {
        if (actionKey === 'review_verification') {
            setIsVerificationModalOpen(true);
        } else if (actionKey === 'review_revision') {
            setIsRevisionModalOpen(true);
        } else if (
            actionKey === 'manage_invite' ||
            actionKey === 'create_invite'
        ) {
            setIsCreateInviteModalOpen(true);
        } else if (actionKey === 'manage_officer') {
            setIsAddOfficerModalOpen(true);
        } else if (actionKey === 'add_house') {
            setIsAddHouseModalOpen(true);
        }
    };

    const handleCopyCode = (code: string) => {
        void navigator.clipboard?.writeText(code);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
    };

    const showNotice = (msg: string) => {
        setActionSuccessNotice(msg);
        setTimeout(() => setActionSuccessNotice(null), 4000);
    };

    return (
        <AdminLayout
            title="Ringkasan Operasional"
            communityMode={communityMode}
            onModeChange={(newMode) => setCommunityMode(newMode)}
            activeNav={activeNav}
            onNavClick={(nav) => setActiveNav(nav)}
            pendingVerificationCount={metrics.pendingVerification}
        >
            {/* SUBTLE PROTOTYPE TOOLBAR (UNOBTRUSIVE, CLEAN) */}
            <section
                aria-label="Toolbar Simulasi Skenario"
                className="border-b border-[#E4E3DC] bg-[#FFFEFA]/80 px-4 py-2 text-xs backdrop-blur-xs select-none sm:px-6 lg:px-8"
            >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-medium text-[#66736C]">
                            Skenario Pengujian:
                        </span>
                        <div className="inline-flex flex-wrap rounded-md border border-[#E4E3DC] bg-[#F7F6F2] p-0.5 text-[11px]">
                            <button
                                type="button"
                                onClick={() => setSimState('normal')}
                                className={`rounded px-2 py-0.5 font-medium transition-colors ${
                                    simState === 'normal'
                                        ? 'bg-[#FFFEFA] text-[#1D2924] shadow-xs'
                                        : 'text-[#66736C] hover:text-[#1D2924]'
                                }`}
                            >
                                Normal
                            </button>
                            <button
                                type="button"
                                onClick={() => setSimState('all_caught_up')}
                                className={`rounded px-2 py-0.5 font-medium transition-colors ${
                                    simState === 'all_caught_up'
                                        ? 'bg-[#FFFEFA] text-[#1D2924] shadow-xs'
                                        : 'text-[#66736C] hover:text-[#1D2924]'
                                }`}
                            >
                                Semua Tertata
                            </button>
                            <button
                                type="button"
                                onClick={() => setSimState('high_pending')}
                                className={`rounded px-2 py-0.5 font-medium transition-colors ${
                                    simState === 'high_pending'
                                        ? 'bg-[#FFFEFA] text-[#1D2924] shadow-xs'
                                        : 'text-[#66736C] hover:text-[#1D2924]'
                                }`}
                            >
                                Antrean Banyak
                            </button>
                            <button
                                type="button"
                                onClick={() => setSimState('new_community')}
                                className={`rounded px-2 py-0.5 font-medium transition-colors ${
                                    simState === 'new_community'
                                        ? 'bg-[#FFFEFA] text-[#1D2924] shadow-xs'
                                        : 'text-[#66736C] hover:text-[#1D2924]'
                                }`}
                            >
                                Komunitas Baru
                            </button>
                            <button
                                type="button"
                                onClick={() => setSimState('no_houses')}
                                className={`rounded px-2 py-0.5 font-medium transition-colors ${
                                    simState === 'no_houses'
                                        ? 'bg-[#FFFEFA] text-[#1D2924] shadow-xs'
                                        : 'text-[#66736C] hover:text-[#1D2924]'
                                }`}
                            >
                                Belum Ada Rumah
                            </button>
                            <button
                                type="button"
                                onClick={() => setSimState('limited_access')}
                                className={`rounded px-2 py-0.5 font-medium transition-colors ${
                                    simState === 'limited_access'
                                        ? 'bg-[#FFFEFA] text-[#B87922] shadow-xs'
                                        : 'text-[#66736C] hover:text-[#1D2924]'
                                }`}
                            >
                                Akses Terbatas
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#66736C]">
                            Mode:
                        </span>
                        <div className="inline-flex rounded-md border border-[#E4E3DC] bg-[#F7F6F2] p-0.5 text-[11px]">
                            <button
                                type="button"
                                onClick={() => setCommunityMode('Cluster Aman')}
                                className={`rounded px-2 py-0.5 font-medium transition-colors ${
                                    communityMode === 'Cluster Aman'
                                        ? 'bg-[#FFFEFA] text-[#2F6B57] shadow-xs'
                                        : 'text-[#66736C] hover:text-[#1D2924]'
                                }`}
                            >
                                Cluster Aman
                            </button>
                            <button
                                type="button"
                                onClick={() => setCommunityMode('RT Mandiri')}
                                className={`rounded px-2 py-0.5 font-medium transition-colors ${
                                    communityMode === 'RT Mandiri'
                                        ? 'bg-[#FFFEFA] text-[#1D2924] shadow-xs'
                                        : 'text-[#66736C] hover:text-[#1D2924]'
                                }`}
                            >
                                RT Mandiri
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ACTION SUCCESS BANNER (TOAST) */}
            {actionSuccessNotice && (
                <div className="border-b border-[#2F7D5C]/30 bg-[#EAF4EE] px-4 py-2.5 text-xs font-medium text-[#2F7D5C] sm:px-6 lg:px-8">
                    <div className="mx-auto flex max-w-6xl items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 shrink-0" />
                            <span>{actionSuccessNotice}</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setActionSuccessNotice(null)}
                            className="text-[#2F7D5C] hover:opacity-75"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* STATE NOTICE: AKSES TERBATAS */}
            {simState === 'limited_access' && (
                <div className="border-b border-[#B87922]/30 bg-[#FCF8EE] px-4 py-3 sm:px-6 lg:px-8">
                    <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-2.5">
                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#B87922]" />
                            <div>
                                <p className="text-xs font-semibold text-[#B87922]">
                                    Akses Pengaturan Template Surat Terbatas
                                </p>
                                <p className="text-xs text-[#1D2924]">
                                    Anda tidak memiliki akses untuk mengubah
                                    template surat. Hubungi Ketua RT untuk
                                    penyesuaian hak akses.
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setSimState('normal')}
                            className="inline-flex shrink-0 items-center gap-1 rounded border border-[#B87922]/40 bg-[#FFFEFA] px-3 py-1.5 text-xs font-semibold text-[#B87922] transition-colors hover:bg-[#B87922] hover:text-[#FFFEFA]"
                        >
                            Kembali ke Ringkasan
                        </button>
                    </div>
                </div>
            )}

            <div className="mx-auto w-full max-w-6xl space-y-7 px-4 py-7 sm:px-6 lg:px-8">
                {/* HEADER KONTEN (EDITORIAL, DIGNIFIED, ZERO GENERIC GREETINGS) */}
                <header className="flex flex-col gap-2 border-b border-[#E4E3DC] pb-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-[#66736C]">
                            <span>Komunitas Taman Sari</span>
                            <span>·</span>
                            <span className="font-semibold text-[#2F6B57]">
                                {communityMode}
                            </span>
                            <span>·</span>
                            <span>RT 04 / RW 09</span>
                        </div>
                        <h1 className="mt-1.5 text-2xl font-semibold tracking-[-0.02em] text-[#1D2924] sm:text-3xl">
                            Ringkasan Operasional
                        </h1>
                        <p className="mt-1 text-sm text-[#66736C]">
                            Pantau aktivitas yang memerlukan perhatian hari ini.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-3 py-1.5 text-xs text-[#55635C] shadow-2xs">
                        <Calendar className="h-3.5 w-3.5 text-[#2F6B57]" />
                        <span className="font-medium text-[#1D2924]">
                            Selasa, 27 Oktober 2026
                        </span>
                    </div>
                </header>

                {/* ONBOARDING CHECKLIST SETUP (KHUSUS KOMUNITAS BARU) */}
                {simState === 'new_community' && (
                    <section
                        aria-labelledby="heading-setup"
                        className="rounded-xl border border-[#2F6B57]/30 bg-[#FFFEFA] p-6 shadow-xs"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <span className="inline-block rounded bg-[#EBF3EF] px-2 py-0.5 text-[10px] font-bold tracking-wide text-[#2F6B57] uppercase">
                                    Langkah Awal Penataan Komunitas
                                </span>
                                <h2
                                    id="heading-setup"
                                    className="mt-1.5 text-base font-bold text-[#1D2924]"
                                >
                                    Panduan Penyiapan RT 04
                                </h2>
                                <p className="text-xs text-[#66736C]">
                                    Selesaikan 4 langkah berikut agar warga
                                    dapat bergabung dan mengajukan profil
                                    keluarga.
                                </p>
                            </div>
                            <span className="text-xs font-semibold text-[#2F6B57]">
                                1 dari 4 Selesai
                            </span>
                        </div>

                        <div className="mt-4 space-y-2.5">
                            <div className="flex items-center justify-between rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] p-3 text-xs">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="h-4 w-4 text-[#2F7D5C]" />
                                    <span className="text-[#66736C] line-through">
                                        Komunitas Taman Sari didaftarkan
                                    </span>
                                </div>
                                <span className="text-[11px] font-medium text-[#2F7D5C]">
                                    Selesai
                                </span>
                            </div>

                            <div className="flex items-center justify-between rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] p-3 text-xs">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#2F6B57] text-[10px] font-bold text-[#2F6B57]">
                                        2
                                    </span>
                                    <div>
                                        <p className="font-semibold text-[#1D2924]">
                                            Tambahkan daftar rumah
                                        </p>
                                        <p className="text-[11px] text-[#66736C]">
                                            Daftarkan blok dan nomor rumah warga
                                            agar verifikasi alamat otomatis
                                            terkunci.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsAddHouseModalOpen(true)}
                                    className="rounded-md bg-[#2F6B57] px-3.5 py-1.5 text-xs font-semibold text-[#FFFEFA] hover:bg-[#255646]"
                                >
                                    Tambah Rumah
                                </button>
                            </div>

                            <div className="flex items-center justify-between rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] p-3 text-xs">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#66736C] text-[10px] font-bold text-[#66736C]">
                                        3
                                    </span>
                                    <div>
                                        <p className="font-semibold text-[#1D2924]">
                                            Buat kode undangan
                                        </p>
                                        <p className="text-[11px] text-[#66736C]">
                                            Kode unik RT 04 yang akan dibagikan
                                            ke grup warga atau selebaran RT.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsCreateInviteModalOpen(true)
                                    }
                                    className="rounded-md border border-[#E4E3DC] bg-[#F7F6F2] px-3.5 py-1.5 text-xs font-semibold text-[#1D2924] hover:bg-[#E4E3DC]"
                                >
                                    Buat Kode
                                </button>
                            </div>

                            <div className="flex items-center justify-between rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] p-3 text-xs opacity-75">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#66736C] text-[10px] font-bold text-[#66736C]">
                                        4
                                    </span>
                                    <div>
                                        <p className="font-semibold text-[#1D2924]">
                                            Verifikasi pengajuan pertama
                                        </p>
                                        <p className="text-[11px] text-[#66736C]">
                                            Akan muncul secara otomatis saat
                                            warga mulai mendaftarkan
                                            keluarganya.
                                        </p>
                                    </div>
                                </div>
                                <span className="text-[11px] text-[#66736C]">
                                    Menunggu Warga
                                </span>
                            </div>
                        </div>
                    </section>
                )}

                {/* EMPTY HOUSES WARNING BANNER */}
                {simState === 'no_houses' && (
                    <div className="rounded-xl border border-[#B87922]/30 bg-[#FCF8EE] p-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-start gap-3">
                                <Building2 className="mt-0.5 h-5 w-5 text-[#B87922]" />
                                <div>
                                    <h2 className="text-sm font-bold text-[#1D2924]">
                                        Tambahkan data rumah sebelum membagikan
                                        kode undangan
                                    </h2>
                                    <p className="text-xs text-[#66736C]">
                                        Warga memerlukan nomor rumah yang valid
                                        saat melengkapi profil keluarga mereka.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsAddHouseModalOpen(true)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#2F6B57] px-4 py-2 text-xs font-semibold text-[#FFFEFA] hover:bg-[#255646]"
                            >
                                <Home className="h-4 w-4" />
                                <span>Tambah Rumah</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* PRIORITAS UTAMA — TUGAS MENUNGGU ("Perlu Ditindaklanjuti") */}
                <section
                    aria-labelledby="heading-prioritas"
                    className="overflow-hidden rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] shadow-2xs"
                >
                    <div className="flex items-center justify-between border-b border-[#E4E3DC] bg-[#FAF9F5] px-5 py-3.5 sm:px-6">
                        <div className="flex items-center gap-2.5">
                            <h2
                                id="heading-prioritas"
                                className="text-sm font-semibold text-[#1D2924]"
                            >
                                Perlu Ditindaklanjuti
                            </h2>
                            {tasks.length > 0 && (
                                <span className="inline-flex items-center rounded-full bg-[#B87922]/15 px-2 py-0.5 text-[10px] font-semibold text-[#B87922]">
                                    {tasks.length} Tindakan
                                </span>
                            )}
                        </div>
                        <span className="text-[11px] text-[#66736C]">
                            Diperbarui otomatis
                        </span>
                    </div>

                    {tasks.length > 0 ? (
                        <div className="divide-y divide-[#E4E3DC]">
                            {tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="flex flex-col gap-4 px-5 py-4 transition-colors hover:bg-[#FCFBF8] sm:flex-row sm:items-center sm:justify-between sm:px-6"
                                >
                                    <div className="flex items-start gap-3.5">
                                        <div
                                            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                                                task.category === 'verification'
                                                    ? 'border-[#2F6B57]/20 bg-[#EAF3EF] text-[#2F6B57]'
                                                    : task.category ===
                                                        'revision'
                                                      ? 'border-[#B87922]/20 bg-[#FCF6EE] text-[#B87922]'
                                                      : task.category ===
                                                          'invitation'
                                                        ? 'border-[#E4E3DC] bg-[#F7F6F2] text-[#66736C]'
                                                        : 'border-[#B74E44]/20 bg-[#FDF2F0] text-[#B74E44]'
                                            }`}
                                        >
                                            {task.category ===
                                                'verification' && (
                                                <UserCheck className="h-4 w-4" />
                                            )}
                                            {task.category === 'revision' && (
                                                <RefreshCw className="h-4 w-4" />
                                            )}
                                            {task.category === 'invitation' && (
                                                <KeyRound className="h-4 w-4" />
                                            )}
                                            {task.category === 'security' && (
                                                <Shield className="h-4 w-4" />
                                            )}
                                        </div>

                                        <div className="space-y-0.5">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="text-sm font-semibold text-[#1D2924]">
                                                    {task.title}
                                                </h3>
                                                {task.badgeText && (
                                                    <span
                                                        className={`py-0.2 rounded px-1.5 text-[10px] font-medium ${
                                                            task.category ===
                                                                'verification' &&
                                                            simState ===
                                                                'high_pending'
                                                                ? 'bg-[#B87922]/15 font-semibold text-[#B87922]'
                                                                : 'bg-[#F2F1EC] text-[#66736C]'
                                                        }`}
                                                    >
                                                        {task.badgeText}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-[#66736C]">
                                                {task.detail}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center sm:shrink-0">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleTaskAction(task.actionKey)
                                            }
                                            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                                                task.isPrimary
                                                    ? 'bg-[#2F6B57] text-[#FFFEFA] shadow-2xs hover:bg-[#255646]'
                                                    : 'border border-[#D6D4CC] bg-[#FFFEFA] text-[#1D2924] hover:border-[#2F6B57] hover:bg-[#F2F7F4] hover:text-[#2F6B57]'
                                            }`}
                                        >
                                            <span>{task.ctaLabel}</span>
                                            <ChevronRight className="h-3.5 w-3.5 opacity-70" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* EMPTY STATE DIGNIFIED (SEMUA TERTATA) */
                        <div className="py-10 text-center">
                            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF4EE] text-[#2F7D5C]">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <h3 className="mt-3 text-sm font-bold text-[#1D2924]">
                                Semua administrasi sudah tertata
                            </h3>
                            <p className="mx-auto mt-1 max-w-md text-xs text-[#66736C]">
                                Tidak ada pengajuan atau pengaturan yang
                                memerlukan tindakan saat ini. Anda dapat
                                memeriksa data rumah atau memantau buku kas
                                warga.
                            </p>
                        </div>
                    )}
                </section>

                {/* RINGKASAN KOMUNITAS (ARCHITECTURAL LEDGER PANEL) */}
                <section
                    aria-labelledby="heading-ringkasan-komunitas"
                    className="overflow-hidden rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] shadow-2xs"
                >
                    <div className="flex items-center justify-between border-b border-[#E4E3DC] px-5 py-3.5 sm:px-6">
                        <div>
                            <h2
                                id="heading-ringkasan-komunitas"
                                className="text-sm font-semibold text-[#1D2924]"
                            >
                                Ringkasan Komunitas
                            </h2>
                            <p className="text-[11px] text-[#66736C]">
                                Kependudukan fisik dan hunian terdata di RT 04
                                Sukamaju.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsHousesListModalOpen(true)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#2F6B57] hover:underline"
                        >
                            <span>Lihat Rumah & Warga</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 divide-y divide-[#E4E3DC] sm:grid-cols-4 sm:divide-x sm:divide-y-0">
                        <div className="p-5">
                            <span className="text-[11px] font-medium tracking-wide text-[#66736C] uppercase">
                                Rumah Terdaftar
                            </span>
                            <div className="mt-1.5 flex items-baseline gap-1.5">
                                <span className="text-3xl font-semibold tracking-tight text-[#1D2924] tabular-nums">
                                    {metrics.houses}
                                </span>
                                <span className="text-xs text-[#66736C]">
                                    unit
                                </span>
                            </div>
                            <p className="mt-1 text-[11px] text-[#66736C]">
                                Blok A, B, C, & D
                            </p>
                        </div>

                        <div className="p-5">
                            <span className="text-[11px] font-medium tracking-wide text-[#66736C] uppercase">
                                Keluarga Aktif
                            </span>
                            <div className="mt-1.5 flex items-baseline gap-1.5">
                                <span className="text-3xl font-semibold tracking-tight text-[#2F7D5C] tabular-nums">
                                    {metrics.activeFamilies}
                                </span>
                                <span className="text-xs text-[#66736C]">
                                    KK
                                </span>
                            </div>
                            <p className="mt-1 text-[11px] text-[#66736C]">
                                Terverifikasi pengurus
                            </p>
                        </div>

                        <div className="p-5">
                            <span className="text-[11px] font-medium tracking-wide text-[#66736C] uppercase">
                                Menunggu Verifikasi
                            </span>
                            <div className="mt-1.5 flex items-baseline gap-1.5">
                                <span
                                    className={`text-3xl font-semibold tracking-tight tabular-nums ${
                                        metrics.pendingVerification > 0
                                            ? 'text-[#B87922]'
                                            : 'text-[#1D2924]'
                                    }`}
                                >
                                    {metrics.pendingVerification}
                                </span>
                                <span className="text-xs text-[#66736C]">
                                    pengajuan
                                </span>
                            </div>
                            <p className="mt-1 text-[11px] text-[#66736C]">
                                {metrics.pendingVerification > 0
                                    ? 'Perlu persetujuan RT'
                                    : 'Antrean bersih'}
                            </p>
                        </div>

                        <div className="p-5">
                            <span className="text-[11px] font-medium tracking-wide text-[#66736C] uppercase">
                                Belum Berpenghuni
                            </span>
                            <div className="mt-1.5 flex items-baseline gap-1.5">
                                <span className="text-3xl font-semibold tracking-tight text-[#1D2924] tabular-nums">
                                    {metrics.vacantHouses}
                                </span>
                                <span className="text-xs text-[#66736C]">
                                    unit
                                </span>
                            </div>
                            <p className="mt-1 text-[11px] text-[#66736C]">
                                Siap huni / renovasi
                            </p>
                        </div>
                    </div>
                </section>

                {/* AKSI CEPAT (4 TINDAKAN OPERASIONAL ELEGAN) */}
                <section
                    aria-labelledby="heading-aksi-cepat"
                    className="rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-5 shadow-2xs sm:p-6"
                >
                    <div className="border-b border-[#E4E3DC] pb-3">
                        <h2
                            id="heading-aksi-cepat"
                            className="text-sm font-semibold text-[#1D2924]"
                        >
                            Aksi Cepat
                        </h2>
                        <p className="text-[11px] text-[#66736C]">
                            Tindakan administrasi yang sering dibutuhkan oleh
                            pengurus.
                        </p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <button
                            type="button"
                            onClick={() => setIsVerificationModalOpen(true)}
                            className="group flex flex-col items-start rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] p-4 text-left transition-all hover:border-[#2F6B57] hover:bg-[#F9FBF9]"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E4E3DC] bg-[#F7F6F2] text-[#2F6B57] transition-colors group-hover:bg-[#EBF3EF]">
                                <UserCheck className="h-4 w-4" />
                            </div>
                            <span className="mt-3 text-xs font-semibold text-[#1D2924]">
                                Verifikasi Keluarga
                            </span>
                            <span className="mt-0.5 text-[11px] text-[#66736C]">
                                {metrics.pendingVerification} pengajuan aktif
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsAddHouseModalOpen(true)}
                            className="group flex flex-col items-start rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] p-4 text-left transition-all hover:border-[#2F6B57] hover:bg-[#F9FBF9]"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E4E3DC] bg-[#F7F6F2] text-[#2F6B57] transition-colors group-hover:bg-[#EBF3EF]">
                                <Home className="h-4 w-4" />
                            </div>
                            <span className="mt-3 text-xs font-semibold text-[#1D2924]">
                                Tambah Rumah
                            </span>
                            <span className="mt-0.5 text-[11px] text-[#66736C]">
                                Input blok & nomor unit
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsCreateInviteModalOpen(true)}
                            className="group flex flex-col items-start rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] p-4 text-left transition-all hover:border-[#2F6B57] hover:bg-[#F9FBF9]"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E4E3DC] bg-[#F7F6F2] text-[#2F6B57] transition-colors group-hover:bg-[#EBF3EF]">
                                <KeyRound className="h-4 w-4" />
                            </div>
                            <span className="mt-3 text-xs font-semibold text-[#1D2924]">
                                Buat Kode Undangan
                            </span>
                            <span className="mt-0.5 text-[11px] text-[#66736C]">
                                Kode pendaftaran warga
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsAddOfficerModalOpen(true)}
                            className="group flex flex-col items-start rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] p-4 text-left transition-all hover:border-[#2F6B57] hover:bg-[#F9FBF9]"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E4E3DC] bg-[#F7F6F2] text-[#2F6B57] transition-colors group-hover:bg-[#EBF3EF]">
                                <UserPlus className="h-4 w-4" />
                            </div>
                            <span className="mt-3 text-xs font-semibold text-[#1D2924]">
                                Tambah Pengurus
                            </span>
                            <span className="mt-0.5 text-[11px] text-[#66736C]">
                                Role RT, Bendahara, Satpam
                            </span>
                        </button>
                    </div>
                </section>

                {/* KHUSUS CLUSTER AMAN — STATUS OPERASIONAL POS (CONDITIONAL) */}
                {communityMode === 'Cluster Aman' && (
                    <section
                        aria-labelledby="heading-operasional-pos"
                        className="overflow-hidden rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] shadow-2xs"
                    >
                        <div className="flex flex-col gap-2 border-b border-[#E4E3DC] px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-[#2F6B57]" />
                                    <h2
                                        id="heading-operasional-pos"
                                        className="text-sm font-semibold text-[#1D2924]"
                                    >
                                        Operasional Pos Satpam
                                    </h2>
                                    <span className="py-0.2 rounded bg-[#EBF3EF] px-1.5 text-[10px] font-semibold text-[#2F6B57]">
                                        Cluster Aman
                                    </span>
                                </div>
                                <p className="mt-0.5 text-[11px] text-[#66736C]">
                                    Gerbang pos satpam terpadu dan pemindaian
                                    izin tamu QR.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsAddOfficerModalOpen(true)
                                    }
                                    className="text-xs font-semibold text-[#2F6B57] hover:underline"
                                >
                                    Kelola Akun Satpam →
                                </button>
                                <span className="text-[#E4E3DC]">·</span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsPosActivityModalOpen(true)
                                    }
                                    className="text-xs font-semibold text-[#2F6B57] hover:underline"
                                >
                                    Lihat Aktivitas Pos →
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 divide-y divide-[#E4E3DC] sm:grid-cols-4 sm:divide-x sm:divide-y-0">
                            <div className="p-4 text-xs">
                                <span className="text-[#66736C]">
                                    Pos Aktif
                                </span>
                                <div className="mt-1 font-semibold text-[#1D2924]">
                                    Pos Utama
                                </div>
                                <span className="mt-0.5 inline-block text-[10px] text-[#2F7D5C]">
                                    ● Buka 24 Jam
                                </span>
                            </div>

                            <div className="p-4 text-xs">
                                <span className="text-[#66736C]">
                                    Akun Satpam Aktif
                                </span>
                                <div className="mt-1 font-semibold text-[#1D2924]">
                                    3 dari 4 akun
                                </div>
                                <span className="mt-0.5 inline-block text-[10px] text-[#B87922]">
                                    1 undangan belum aktif
                                </span>
                            </div>

                            <div className="p-4 text-xs">
                                <span className="text-[#66736C]">
                                    QR Pass Aktif Hari Ini
                                </span>
                                <div className="mt-1 font-semibold text-[#2F6B57]">
                                    8 izin
                                </div>
                                <span className="mt-0.5 inline-block text-[10px] text-[#66736C]">
                                    5 Kurir · 3 Tamu
                                </span>
                            </div>

                            <div className="p-4 text-xs">
                                <span className="text-[#66736C]">
                                    Kunjungan Tercatat
                                </span>
                                <div className="mt-1 font-semibold text-[#1D2924]">
                                    14 kunjungan
                                </div>
                                <span className="mt-0.5 inline-block text-[10px] text-[#2F7D5C]">
                                    Seluruhnya tervalidasi
                                </span>
                            </div>
                        </div>
                    </section>
                )}

                {/* AKTIVITAS TERBARU & INFORMASI KOMUNITAS (2-KOLOM DESKTOP) */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* KOLOM KIRI (2/3): AKTIVITAS TERBARU */}
                    <section
                        aria-labelledby="heading-aktivitas"
                        className="overflow-hidden rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] shadow-2xs lg:col-span-2"
                    >
                        <div className="flex items-center justify-between border-b border-[#E4E3DC] px-5 py-3.5 sm:px-6">
                            <div>
                                <h2
                                    id="heading-aktivitas"
                                    className="text-sm font-semibold text-[#1D2924]"
                                >
                                    Aktivitas Terbaru
                                </h2>
                                <p className="text-[11px] text-[#66736C]">
                                    5 catatan operasional terkini di
                                    KomunitasHub.
                                </p>
                            </div>
                            <span className="text-[11px] font-medium text-[#66736C]">
                                Audit Trail Otomatis
                            </span>
                        </div>

                        <div className="divide-y divide-[#E4E3DC]">
                            {recentActivities.map((act) => (
                                <div
                                    key={act.id}
                                    className="flex items-start justify-between gap-3 px-5 py-3.5 text-xs transition-colors hover:bg-[#FCFBF8] sm:px-6"
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="mt-0.5 font-mono text-[11px] text-[#66736C]">
                                            {act.time}
                                        </span>
                                        <span className="text-[#E4E3DC]">
                                            ·
                                        </span>
                                        <div className="space-y-1">
                                            <p className="font-medium text-[#1D2924]">
                                                {act.description}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`py-0.2 inline-block rounded px-1.5 text-[10px] font-medium ${
                                                        act.category ===
                                                        'Verifikasi'
                                                            ? 'bg-[#EBF3EF] text-[#2F6B57]'
                                                            : act.category ===
                                                                'Role'
                                                              ? 'bg-[#F2EDFD] text-[#6E42B3]'
                                                              : act.category ===
                                                                  'Undangan'
                                                                ? 'bg-[#FEF5E7] text-[#B87922]'
                                                                : act.category ===
                                                                    'Data Keluarga'
                                                                  ? 'bg-[#EBF4FA] text-[#246A92]'
                                                                  : 'bg-[#F4F4F1] text-[#66736C]'
                                                    }`}
                                                >
                                                    {act.category}
                                                </span>
                                                <span className="text-[10px] text-[#66736C]">
                                                    Oleh: {act.actor}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedActivityDetail(act)
                                        }
                                        className="shrink-0 text-xs font-semibold text-[#2F6B57] hover:underline"
                                    >
                                        Lihat
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* KOLOM KANAN (1/3): INFORMASI KOMUNITAS */}
                    <aside
                        aria-labelledby="heading-info-komunitas"
                        className="rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-5 shadow-2xs"
                    >
                        <div className="border-b border-[#E4E3DC] pb-3">
                            <h2
                                id="heading-info-komunitas"
                                className="text-sm font-semibold text-[#1D2924]"
                            >
                                Informasi Komunitas
                            </h2>
                            <p className="text-[11px] text-[#66736C]">
                                Identitas administratif resmi sistem.
                            </p>
                        </div>

                        <div className="mt-4 space-y-3 text-xs">
                            <div>
                                <span className="text-[10px] tracking-wider text-[#66736C] uppercase">
                                    Nama Komunitas
                                </span>
                                <p className="font-semibold text-[#1D2924]">
                                    Komunitas Taman Sari
                                </p>
                            </div>

                            <div className="border-t border-[#E4E3DC] pt-2">
                                <span className="text-[10px] tracking-wider text-[#66736C] uppercase">
                                    Wilayah Administratif
                                </span>
                                <p className="font-medium text-[#1D2924]">
                                    RT 04 / RW 09 · Kelurahan Sukamaju
                                </p>
                            </div>

                            <div className="border-t border-[#E4E3DC] pt-2">
                                <span className="text-[10px] tracking-wider text-[#66736C] uppercase">
                                    Mode Operasional
                                </span>
                                <div className="mt-0.5 flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#2F6B57]" />
                                    <span className="font-medium text-[#1D2924]">
                                        {communityMode}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-[#E4E3DC] pt-2">
                                <span className="text-[10px] tracking-wider text-[#66736C] uppercase">
                                    Jumlah Rumah Terdaftar
                                </span>
                                <p className="font-medium text-[#1D2924]">
                                    {metrics.houses} rumah (Kapasitas maks 150
                                    unit)
                                </p>
                            </div>

                            <div className="border-t border-[#E4E3DC] pt-2">
                                <span className="text-[10px] tracking-wider text-[#66736C] uppercase">
                                    Admin Utama
                                </span>
                                <p className="font-medium text-[#1D2924]">
                                    Dewi Lestari (Sekretariat RT)
                                </p>
                            </div>

                            <div className="border-t border-[#E4E3DC] pt-2">
                                <span className="text-[10px] tracking-wider text-[#66736C] uppercase">
                                    Tanggal Dibuat
                                </span>
                                <p className="font-medium text-[#1D2924]">
                                    14 Januari 2025
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 border-t border-[#E4E3DC] pt-4">
                            <button
                                type="button"
                                onClick={() =>
                                    alert(
                                        'Pengaturan Komunitas:\nModul untuk mengubah identitas RT, batas wilayah, masa berlaku kode undangan default, dan konfigurasi integrasi pos satpam.',
                                    )
                                }
                                className="w-full rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] py-2 text-center text-xs font-semibold text-[#1D2924] transition-colors hover:bg-[#E4E3DC]"
                            >
                                Buka Pengaturan Komunitas →
                            </button>
                        </div>
                    </aside>
                </div>
            </div>

            {/* MODAL 1: TINJAU PENGAJUAN VERIFIKASI WARGA */}
            {isVerificationModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-xs"
                        onClick={() => setIsVerificationModalOpen(false)}
                    />
                    <div className="relative w-full max-w-lg rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-6 shadow-xl">
                        <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-3">
                            <div className="flex items-center gap-2">
                                <UserCheck className="h-5 w-5 text-[#2F6B57]" />
                                <h3 className="text-base font-bold text-[#1D2924]">
                                    Tinjau Pengajuan Warga
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    setIsVerificationModalOpen(false)
                                }
                                className="rounded p-1 text-[#66736C] hover:bg-[#F7F6F2]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mt-4 space-y-4 text-xs">
                            <div className="space-y-2 rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] p-3.5">
                                <div className="flex justify-between">
                                    <span className="text-[#66736C]">
                                        Nama Akun:
                                    </span>
                                    <span className="font-bold text-[#1D2924]">
                                        Keluarga Budi Santoso
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#66736C]">
                                        Kepala Keluarga:
                                    </span>
                                    <span className="font-semibold text-[#1D2924]">
                                        Budi Santoso, S.T.
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#66736C]">
                                        Alamat Pengajuan:
                                    </span>
                                    <span className="font-semibold text-[#2F6B57]">
                                        Rumah Blok A-12
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#66736C]">
                                        Jumlah Jiwa:
                                    </span>
                                    <span className="text-[#1D2924]">
                                        4 Orang (2 Dewasa, 2 Anak)
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#66736C]">
                                        Nomor Kontak:
                                    </span>
                                    <span className="font-mono text-[#1D2924]">
                                        0812-9876-5432
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#66736C]">
                                        Kode Undangan:
                                    </span>
                                    <span className="font-mono text-[#66736C]">
                                        KHB-RT04-A7X9
                                    </span>
                                </div>
                            </div>

                            <div className="rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] p-3 text-[11px] text-[#66736C]">
                                <span className="font-semibold text-[#1D2924]">
                                    Catatan Validasi Admin:
                                </span>
                                <p className="mt-0.5">
                                    Unit Blok A-12 tercatat berpenghuni. Data
                                    identitas sesuai dengan data sensus warga RT
                                    04 Sukamaju.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-2 border-t border-[#E4E3DC] pt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsVerificationModalOpen(false);
                                    setIsRevisionModalOpen(true);
                                }}
                                className="rounded-lg border border-[#B87922]/40 bg-[#FCF8EE] px-4 py-2 text-xs font-semibold text-[#B87922] hover:bg-[#B87922] hover:text-white"
                            >
                                Minta Perbaikan Data
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsVerificationModalOpen(false);
                                    showNotice(
                                        'Keluarga Budi Santoso (Blok A-12) berhasil disetujui sebagai warga aktif.',
                                    );
                                }}
                                className="rounded-lg bg-[#2F6B57] px-4 py-2 text-xs font-semibold text-[#FFFEFA] hover:bg-[#255646]"
                            >
                                Setujui Warga
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL 2: LIHAT PERBAIKAN DATA */}
            {isRevisionModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-xs"
                        onClick={() => setIsRevisionModalOpen(false)}
                    />
                    <div className="relative w-full max-w-lg rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-6 shadow-xl">
                        <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-3">
                            <div className="flex items-center gap-2">
                                <RefreshCw className="h-5 w-5 text-[#B87922]" />
                                <h3 className="text-base font-bold text-[#1D2924]">
                                    Perbaikan Data Warga
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsRevisionModalOpen(false)}
                                className="rounded p-1 text-[#66736C] hover:bg-[#F7F6F2]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mt-4 space-y-3 text-xs">
                            <div className="rounded-md border border-[#B87922]/30 bg-[#FCF8EE] p-3 text-[11px] text-[#B87922]">
                                Warga telah memperbarui nomor kontak WhatsApp
                                dan mengoreksi nama kepala keluarga sesuai KTP.
                            </div>

                            <div className="space-y-2 rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] p-3.5">
                                <div className="flex justify-between">
                                    <span className="text-[#66736C]">
                                        Akun:
                                    </span>
                                    <span className="font-bold text-[#1D2924]">
                                        Keluarga Hendro Susanto
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#66736C]">
                                        Alamat:
                                    </span>
                                    <span className="font-semibold text-[#1D2924]">
                                        Blok B-04
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#66736C]">
                                        Catatan Warga:
                                    </span>
                                    <span className="text-[#1D2924]">
                                        "Nomor WA sudah diganti ke nomor aktif."
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-2 border-t border-[#E4E3DC] pt-4">
                            <button
                                type="button"
                                onClick={() => setIsRevisionModalOpen(false)}
                                className="rounded-lg border border-[#E4E3DC] px-4 py-2 text-xs font-semibold text-[#66736C] hover:bg-[#F7F6F2]"
                            >
                                Tutup
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsRevisionModalOpen(false);
                                    showNotice(
                                        'Perbaikan data Keluarga Hendro Susanto (Blok B-04) telah disetujui.',
                                    );
                                }}
                                className="rounded-lg bg-[#2F6B57] px-4 py-2 text-xs font-semibold text-[#FFFEFA] hover:bg-[#255646]"
                            >
                                Konfirmasi & Setujui
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL 3: TAMBAH DATA RUMAH */}
            {isAddHouseModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-xs"
                        onClick={() => setIsAddHouseModalOpen(false)}
                    />
                    <div className="relative w-full max-w-md rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-6 shadow-xl">
                        <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-3">
                            <div className="flex items-center gap-2">
                                <Home className="h-5 w-5 text-[#2F6B57]" />
                                <h3 className="text-base font-bold text-[#1D2924]">
                                    Tambah Data Rumah
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsAddHouseModalOpen(false)}
                                className="rounded p-1 text-[#66736C] hover:bg-[#F7F6F2]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                setIsAddHouseModalOpen(false);
                                showNotice(
                                    `Rumah ${newHouseBlock} berhasil didaftarkan ke RT 04.`,
                                );
                            }}
                            className="mt-4 space-y-4 text-xs"
                        >
                            <div>
                                <label className="block font-semibold text-[#1D2924]">
                                    Blok & Nomor Rumah
                                </label>
                                <input
                                    type="text"
                                    value={newHouseBlock}
                                    onChange={(e) =>
                                        setNewHouseBlock(e.target.value)
                                    }
                                    placeholder="Contoh: Blok B-08"
                                    className="mt-1.5 w-full rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-3 py-2 text-xs text-[#1D2924] focus:border-[#2F6B57] focus:outline-hidden"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-[#1D2924]">
                                    Status Hunian
                                </label>
                                <select
                                    value={newHouseType}
                                    onChange={(e) =>
                                        setNewHouseType(e.target.value)
                                    }
                                    className="mt-1.5 w-full rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-3 py-2 text-xs text-[#1D2924] focus:border-[#2F6B57] focus:outline-hidden"
                                >
                                    <option value="Dihuni">
                                        Dihuni Pemilik / Penyewa
                                    </option>
                                    <option value="Belum Berpenghuni">
                                        Belum Berpenghuni / Kosong
                                    </option>
                                    <option value="Renovasi">
                                        Dalam Renovasi
                                    </option>
                                </select>
                            </div>

                            <div className="rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] p-3 text-[11px] text-[#66736C]">
                                Satu nomor rumah hanya dapat dikaitkan dengan
                                satu akun keluarga aktif untuk mencegah
                                duplikasi tagihan iuran.
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t border-[#E4E3DC] pt-4">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsAddHouseModalOpen(false)
                                    }
                                    className="rounded-lg border border-[#E4E3DC] px-4 py-2 text-xs font-semibold text-[#66736C] hover:bg-[#F7F6F2]"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-[#2F6B57] px-4 py-2 text-xs font-semibold text-[#FFFEFA] hover:bg-[#255646]"
                                >
                                    Simpan Rumah
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 4: BUAT KODE UNDANGAN */}
            {isCreateInviteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-xs"
                        onClick={() => setIsCreateInviteModalOpen(false)}
                    />
                    <div className="relative w-full max-w-md rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-6 shadow-xl">
                        <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-3">
                            <div className="flex items-center gap-2">
                                <KeyRound className="h-5 w-5 text-[#2F6B57]" />
                                <h3 className="text-base font-bold text-[#1D2924]">
                                    Kelola Kode Undangan
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    setIsCreateInviteModalOpen(false)
                                }
                                className="rounded p-1 text-[#66736C] hover:bg-[#F7F6F2]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mt-4 space-y-4 text-xs">
                            <div className="rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] p-4 text-center">
                                <span className="text-[11px] text-[#66736C]">
                                    Kode Undangan Aktif RT 04:
                                </span>
                                <div className="mt-1.5 flex items-center justify-center gap-2 font-mono text-xl font-bold tracking-wider text-[#2F6B57]">
                                    <span>{generatedCode}</span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleCopyCode(generatedCode)
                                        }
                                        className="rounded border border-[#E4E3DC] bg-[#FFFEFA] p-1.5 text-[#1D2924] hover:bg-[#EBF3EF]"
                                        title="Salin Kode"
                                    >
                                        <Copy className="h-4 w-4" />
                                    </button>
                                </div>
                                {copiedCode && (
                                    <p className="mt-1 text-[11px] font-semibold text-[#2F7D5C]">
                                        Kode berhasil disalin!
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-semibold text-[#1D2924]">
                                        Kuota Penggunaan
                                    </label>
                                    <input
                                        type="number"
                                        value={inviteQuota}
                                        onChange={(e) =>
                                            setInviteQuota(e.target.value)
                                        }
                                        className="mt-1.5 w-full rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-3 py-1.5 text-xs text-[#1D2924]"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-[#1D2924]">
                                        Masa Berlaku
                                    </label>
                                    <div className="mt-1.5 rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] px-3 py-1.5 text-xs text-[#66736C]">
                                        7 Hari (3 Nov 2026)
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    const rand = Math.random()
                                        .toString(36)
                                        .substring(2, 6)
                                        .toUpperCase();
                                    setGeneratedCode(`KHB-RT04-${rand}`);
                                    showNotice(
                                        'Kode undangan baru berhasil dibuat.',
                                    );
                                }}
                                className="w-full rounded-lg border border-[#2F6B57] bg-[#EBF3EF] py-2 text-center text-xs font-semibold text-[#2F6B57] hover:bg-[#2F6B57] hover:text-[#FFFEFA]"
                            >
                                Generate Kode Baru
                            </button>
                        </div>

                        <div className="mt-6 flex items-center justify-end border-t border-[#E4E3DC] pt-4">
                            <button
                                type="button"
                                onClick={() =>
                                    setIsCreateInviteModalOpen(false)
                                }
                                className="rounded-lg bg-[#1D2924] px-4 py-2 text-xs font-semibold text-[#FFFEFA] hover:bg-black"
                            >
                                Selesai
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL 5: TAMBAH PENGURUS & ROLE */}
            {isAddOfficerModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-xs"
                        onClick={() => setIsAddOfficerModalOpen(false)}
                    />
                    <div className="relative w-full max-w-md rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-6 shadow-xl">
                        <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-3">
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-[#2F6B57]" />
                                <h3 className="text-base font-bold text-[#1D2924]">
                                    Tambah Pengurus & Role
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsAddOfficerModalOpen(false)}
                                className="rounded p-1 text-[#66736C] hover:bg-[#F7F6F2]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                setIsAddOfficerModalOpen(false);
                                showNotice(
                                    `Pengurus baru ${officerName || 'Bpk. Supriyadi'} berhasil ditambahkan sebagai ${officerRole}.`,
                                );
                            }}
                            className="mt-4 space-y-4 text-xs"
                        >
                            <div>
                                <label className="block font-semibold text-[#1D2924]">
                                    Nama Lengkap
                                </label>
                                <input
                                    type="text"
                                    value={officerName}
                                    onChange={(e) =>
                                        setOfficerName(e.target.value)
                                    }
                                    placeholder="Contoh: Supriyadi"
                                    className="mt-1.5 w-full rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-3 py-2 text-xs text-[#1D2924] focus:border-[#2F6B57] focus:outline-hidden"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-[#1D2924]">
                                    Pilih Peran / Role
                                </label>
                                <select
                                    value={officerRole}
                                    onChange={(e) =>
                                        setOfficerRole(e.target.value)
                                    }
                                    className="mt-1.5 w-full rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] px-3 py-2 text-xs text-[#1D2924] focus:border-[#2F6B57] focus:outline-hidden"
                                >
                                    <option value="Satpam Pos">
                                        Satpam Pos (Pemeriksa QR Tamu)
                                    </option>
                                    <option value="Bendahara">
                                        Bendahara (Pengelola Keuangan & Kas)
                                    </option>
                                    <option value="Ketua RT">
                                        Ketua RT (Pemberi Tanda Tangan Surat)
                                    </option>
                                    <option value="Sekretariat">
                                        Sekretariat RT
                                    </option>
                                </select>
                            </div>

                            <div className="rounded-lg border border-[#B87922]/30 bg-[#FCF8EE] p-3 text-[11px] text-[#B87922]">
                                <span className="font-semibold">
                                    Batas Kewenangan:
                                </span>{' '}
                                Admin Komunitas bertugas mengatur akun pengurus,
                                namun tidak dapat menyetujui transaksi kas
                                kecuali memiliki peran ganda sebagai Bendahara.
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t border-[#E4E3DC] pt-4">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsAddOfficerModalOpen(false)
                                    }
                                    className="rounded-lg border border-[#E4E3DC] px-4 py-2 text-xs font-semibold text-[#66736C] hover:bg-[#F7F6F2]"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-[#2F6B57] px-4 py-2 text-xs font-semibold text-[#FFFEFA] hover:bg-[#255646]"
                                >
                                    Kirim Undangan Pengurus
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 6: LIHAT DATA RUMAH & WARGA */}
            {isHousesListModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-xs"
                        onClick={() => setIsHousesListModalOpen(false)}
                    />
                    <div className="relative w-full max-w-2xl rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-6 shadow-xl">
                        <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-3">
                            <div className="flex items-center gap-2">
                                <Home className="h-5 w-5 text-[#2F6B57]" />
                                <h3 className="text-base font-bold text-[#1D2924]">
                                    Daftar Rumah & Warga RT 04
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsHousesListModalOpen(false)}
                                className="rounded p-1 text-[#66736C] hover:bg-[#F7F6F2]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mt-4 max-h-80 space-y-2 overflow-y-auto text-xs">
                            <div className="flex items-center justify-between rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] p-3">
                                <div>
                                    <span className="font-bold text-[#1D2924]">
                                        Blok A-12
                                    </span>
                                    <p className="text-[11px] text-[#66736C]">
                                        Keluarga Pratama · 4 Jiwa
                                    </p>
                                </div>
                                <span className="rounded bg-[#EAF4EE] px-2 py-0.5 text-[10px] font-bold text-[#2F7D5C]">
                                    Aktif
                                </span>
                            </div>

                            <div className="flex items-center justify-between rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] p-3">
                                <div>
                                    <span className="font-bold text-[#1D2924]">
                                        Blok A-14
                                    </span>
                                    <p className="text-[11px] text-[#66736C]">
                                        Keluarga Budi Santoso · 4 Jiwa
                                    </p>
                                </div>
                                <span className="rounded bg-[#FEF5E7] px-2 py-0.5 text-[10px] font-bold text-[#B87922]">
                                    Menunggu Verifikasi
                                </span>
                            </div>

                            <div className="flex items-center justify-between rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] p-3">
                                <div>
                                    <span className="font-bold text-[#1D2924]">
                                        Blok B-02
                                    </span>
                                    <p className="text-[11px] text-[#66736C]">
                                        Keluarga Suryanto · 3 Jiwa
                                    </p>
                                </div>
                                <span className="rounded bg-[#EAF4EE] px-2 py-0.5 text-[10px] font-bold text-[#2F7D5C]">
                                    Aktif
                                </span>
                            </div>

                            <div className="flex items-center justify-between rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] p-3">
                                <div>
                                    <span className="font-bold text-[#1D2924]">
                                        Blok B-08
                                    </span>
                                    <p className="text-[11px] text-[#66736C]">
                                        Rumah Kosong / Siap Huni
                                    </p>
                                </div>
                                <span className="rounded bg-[#F4F4F1] px-2 py-0.5 text-[10px] font-medium text-[#66736C]">
                                    Belum Berpenghuni
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between border-t border-[#E4E3DC] pt-4">
                            <span className="text-xs text-[#66736C]">
                                Menampilkan sampel dari {metrics.houses} rumah
                                terdata.
                            </span>
                            <button
                                type="button"
                                onClick={() => setIsHousesListModalOpen(false)}
                                className="rounded-lg bg-[#2F6B57] px-4 py-2 text-xs font-semibold text-[#FFFEFA] hover:bg-[#255646]"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL 7: DETAIL AKTIVITAS POS SATPAM */}
            {isPosActivityModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-xs"
                        onClick={() => setIsPosActivityModalOpen(false)}
                    />
                    <div className="relative w-full max-w-lg rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-6 shadow-xl">
                        <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-3">
                            <div className="flex items-center gap-2">
                                <QrCode className="h-5 w-5 text-[#2F6B57]" />
                                <h3 className="text-base font-bold text-[#1D2924]">
                                    Aktivitas Pos Utama Hari Ini
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsPosActivityModalOpen(false)}
                                className="rounded p-1 text-[#66736C] hover:bg-[#F7F6F2]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mt-4 space-y-2 text-xs">
                            <div className="rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] p-3">
                                <div className="flex justify-between font-semibold text-[#1D2924]">
                                    <span>Kurir Paket (J&T Express)</span>
                                    <span className="text-[#2F7D5C]">
                                        11.15 WIB
                                    </span>
                                </div>
                                <p className="mt-0.5 text-[11px] text-[#66736C]">
                                    Tujuan: Blok A-12 (Keluarga Pratama) ·
                                    Dipindai oleh Satpam Pak Joko
                                </p>
                            </div>

                            <div className="rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] p-3">
                                <div className="flex justify-between font-semibold text-[#1D2924]">
                                    <span>Tamu Pribadi (Sdr. Irawan)</span>
                                    <span className="text-[#2F7D5C]">
                                        10.02 WIB
                                    </span>
                                </div>
                                <p className="mt-0.5 text-[11px] text-[#66736C]">
                                    Tujuan: Blok B-05 · Masa berlaku 6 jam ·
                                    Dipindai oleh Satpam Pak Joko
                                </p>
                            </div>

                            <div className="rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] p-3">
                                <div className="flex justify-between font-semibold text-[#1D2924]">
                                    <span>Teknisi Internet (IndiHome)</span>
                                    <span className="text-[#2F7D5C]">
                                        08.45 WIB
                                    </span>
                                </div>
                                <p className="mt-0.5 text-[11px] text-[#66736C]">
                                    Tujuan: Blok C-02 · QR Pass tervalidasi di
                                    gerbang utama
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end border-t border-[#E4E3DC] pt-4">
                            <button
                                type="button"
                                onClick={() => setIsPosActivityModalOpen(false)}
                                className="rounded-lg bg-[#2F6B57] px-4 py-2 text-xs font-semibold text-[#FFFEFA] hover:bg-[#255646]"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL 8: DETAIL LOG AKTIVITAS */}
            {selectedActivityDetail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-xs"
                        onClick={() => setSelectedActivityDetail(null)}
                    />
                    <div className="relative w-full max-w-md rounded-xl border border-[#E4E3DC] bg-[#FFFEFA] p-6 shadow-xl">
                        <div className="flex items-center justify-between border-b border-[#E4E3DC] pb-3">
                            <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-[#2F6B57]" />
                                <h3 className="text-base font-bold text-[#1D2924]">
                                    Detail Audit Log
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedActivityDetail(null)}
                                className="rounded p-1 text-[#66736C] hover:bg-[#F7F6F2]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mt-4 space-y-3 text-xs">
                            <div className="space-y-2 rounded-lg border border-[#E4E3DC] bg-[#F7F6F2] p-3.5">
                                <div className="flex justify-between">
                                    <span className="text-[#66736C]">
                                        Waktu:
                                    </span>
                                    <span className="font-mono text-[#1D2924]">
                                        {selectedActivityDetail.time} WIB
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#66736C]">
                                        Kategori:
                                    </span>
                                    <span className="font-semibold text-[#2F6B57]">
                                        {selectedActivityDetail.category}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#66736C]">
                                        Aktor:
                                    </span>
                                    <span className="font-medium text-[#1D2924]">
                                        {selectedActivityDetail.actor}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <span className="font-semibold text-[#1D2924]">
                                    Deskripsi:
                                </span>
                                <p className="mt-1 text-[#66736C]">
                                    {selectedActivityDetail.description}
                                </p>
                            </div>

                            {selectedActivityDetail.detailNote && (
                                <div className="rounded-lg border border-[#E4E3DC] bg-[#FFFEFA] p-3 text-[11px] text-[#66736C]">
                                    <span className="font-semibold text-[#1D2924]">
                                        Catatan Sistem:
                                    </span>
                                    <p className="mt-0.5">
                                        {selectedActivityDetail.detailNote}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end border-t border-[#E4E3DC] pt-4">
                            <button
                                type="button"
                                onClick={() => setSelectedActivityDetail(null)}
                                className="rounded-lg bg-[#2F6B57] px-4 py-2 text-xs font-semibold text-[#FFFEFA] hover:bg-[#255646]"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
