<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout();
const router = useRouter();

const showProfileMenu = ref(false);

const logout = () => {
    // lakukan clear localStorage/token bila ada
    localStorage.removeItem('token');
    router.push('/auth/login');
};
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/" class="layout-topbar-logo">
                <img src="@/assets/img/Logo3.jpeg" alt="Logo" class="w-15 h-auto" />
            </router-link>
        </div>

        <div class="layout-topbar-actions">
            <!-- Dark mode -->
            <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
            </button>

            <!-- ICON PROFIL -->
            <div class="relative">
                <button type="button" class="layout-topbar-action" @click="showProfileMenu = !showProfileMenu">
                    <i class="pi pi-user"></i>
                </button>

                <!-- DROPDOWN -->
                <div v-if="showProfileMenu" class="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 shadow rounded-md py-2 z-50">
                    <router-link to="/profil" class="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700" @click="showProfileMenu = false"> <i class="pi pi-id-card text-sm mr-2"></i> Profil </router-link>

                    <button class="w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700" @click="logout"><i class="pi pi-sign-out text-sm mr-2"></i> Logout</button>
                </div>
            </div>
        </div>
    </div>
</template>
