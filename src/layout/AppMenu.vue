<script setup>
import { ref } from 'vue';
import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    // =====================
    // DASHBOARD
    // =====================
    {
        label: 'Home',
        items: [
            { 
                label: 'Dashboard', 
                icon: 'pi pi-fw pi-home', 
                to: '/' 
            }
        ]
    },

    // =====================
    // MENU KASIR
    // =====================
    {
        label: 'MENU KASIR',
        items: [
            {
                label: 'Kasir',
                icon: 'pi pi-fw pi-desktop',
                to: '/kasir'
            },
            {
                label: 'Transaksi',
                icon: 'pi pi-fw pi-wallet',
                to: '/transaksi'
            }
        ]
    },

    // =====================
    // MENU PRODUK
    // =====================
    {
        label: 'MENU PRODUK',
        items: [
            {
                label: 'Produk',
                icon: 'pi pi-fw pi-briefcase',
                to: '/produk'
            }
        ]
    },

    // =====================
    // MENU INVENTORY
    // =====================
    {
        label: 'MENU INVENTORY',
        items: [
            {
                label: 'Bahan Baku',
                icon: 'pi pi-fw pi-clipboard',
                to: '/bahan-baku'
            }
        ]
    },

    // =====================
    // MENU ADMIN (BARU)
    // =====================
    {
        label: 'MENU ADMIN',
        items: [
            {
                label: 'Kelola Admin',
                icon: 'pi pi-fw pi-users',
                to: '/admin'
            },
            {
                label: 'Laporan Laba',
                icon: 'pi pi-fw pi-chart-line',
                items: [
                    {
                        label: 'Laba Kotor',
                        icon: 'pi pi-fw pi-chart-bar',
                        to: '/laporan/laba-kotor'
                    },
                    {
                        label: 'Laba Bersih',
                        icon: 'pi pi-fw pi-chart-bar',
                        to: '/laporan/laba-bersih'
                    }
                ]
            }
        ]
    },
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item.label + i">
            <app-menu-item 
                v-if="!item.separator"
                :item="item"
                :index="i"
            />
            
            <li 
                v-else 
                class="menu-separator"
            ></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped>
/* Tambahan style opsional */
</style>
