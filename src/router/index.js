import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                // ==============================
                // DASHBOARD
                // ==============================
                {
                    path: '',
                    name: 'dashboard',
                    component: () => import('@/views/pages/dashboard/Dashboard.vue')
                },

                // ==============================
                // MENU KASIR
                // ==============================
                {
                    path: 'kasir',
                    name: 'kasir',
                    component: () => import('@/views/pages/kasir/KasirPage.vue')
                },
                {
                    path: 'transaksi',
                    name: 'transaksi',
                    component: () => import('@/views/pages/kasir/TransaksiPage.vue')
                },

                // ==============================
                // MENU PRODUK
                // ==============================
                {
                    path: 'produk',
                    name: 'produk',
                    component: () => import('@/views/pages/produk/Produk.vue')
                },
                {
                    path: 'kategori',
                    name: 'kategori',
                    component: () => import('@/views/pages/produk/Kategori.vue') // ✅ sesuai
                },

                // ==============================
                // MENU INVENTORY
                // ==============================
                {
                    path: 'bahan-baku',
                    name: 'bahanBaku',
                    component: () => import('@/views/pages/inventory/BahanBakuPage.vue')
                },
                {
                    path: 'stok',
                    name: 'stok',
                    component: () => import('@/views/pages/inventory/stok.vue') // ⚠️ lowercase
                },
                {
                    path: 'supplier',
                    name: 'supplier',
                    component: () => import('@/views/pages/inventory/supplier.vue') // ⚠️ lowercase
                },

                // ==============================
                // MENU ADMIN
                // ==============================
                {
                    path: 'admin',
                    name: 'kelolaAdmin',
                    component: () => import('@/views/pages/admin/KelolaAdmin.vue')
                },
                {
                    path: 'audit-log',
                    name: 'auditLog',
                    component: () => import('@/views/pages/setting/audit_log.vue') // ⚠️ pindah ke setting
                },
                {
                    path: 'pengaturan',
                    name: 'pengaturan',
                    component: () => import('@/views/pages/setting/pengaturan.vue') // ⚠️ folder setting
                },

                // ==============================
                // MENU LAPORAN
                // ==============================
                {
                    path: 'laporan/laba-bersih',
                    name: 'laporanLabaBersih',
                    component: () => import('@/views/pages/laporan/lababersih.vue')
                },
                {
                    path: 'laporan/laba-kotor',
                    name: 'laporanLabaKotor',
                    component: () => import('@/views/pages/laporan/labahkotor.vue')
                },

                // ==============================
                // PROFIL
                // ==============================
                {
                    path: 'profil',
                    name: 'profil',
                    component: () => import('@/views/pages/profil/ProfilPage.vue')
                }
            ]
        },

        // ==============================
        // AUTH
        // ==============================
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});

export default router;
