<script setup>
import { useToast } from 'primevue/usetoast';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const toast = useToast();

const user = ref({
    name: 'Nama Pengguna',
    email: 'email@example.com',
    phone: '081234567890',
    username: 'admin01',
    joinDate: '12 Jan 2023',
    role: 'Administrator'
});

const avatarLabel = computed(() => {
    const parts = user.value.name.split(' ');
    return parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0];
});

const visibleEdit = ref(false);

const form = ref({
    name: '',
    email: '',
    phone: '',
    username: ''
});

const openEdit = () => {
    form.value = { ...user.value };
    visibleEdit.value = true;
};

const saveEdit = async () => {
    const confirm = await Swal.fire({
        title: 'Simpan Perubahan?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Simpan',
        cancelButtonText: 'Batal',
        buttonsStyling: false,
        customClass: {
            confirmButton: 'p-button p-component p-button-primary mx-2',
            cancelButton: 'p-button p-component p-button-outlined mx-2'
        }
    });

    if (confirm.isConfirmed) {
        user.value = { ...form.value };
        visibleEdit.value = false;

        Swal.fire({
            title: 'Berhasil!',
            text: 'Profil berhasil diperbarui.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        });
    }
};

const onLogout = async () => {
    const confirm = await Swal.fire({
        title: 'Logout dari akun?',
        text: 'Anda akan keluar dari sistem.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Logout',
        cancelButtonText: 'Batal',
        buttonsStyling: false,
        customClass: {
            confirmButton: 'p-button p-component p-button-danger mx-2',
            cancelButton: 'p-button p-component p-button-outlined mx-2'
        }
    });

    if (confirm.isConfirmed) {
        router.push('auth/login');
        toast.add({
            severity: 'warn',
            summary: 'Logout',
            detail: 'Anda telah logout.',
            life: 1500
        });
    }
};
</script>

<template>
    <div class="p-4 md:p-6 lg:p-8 w-full max-w-5xl mx-auto">
        <h2 class="text-xl md:text-2xl font-semibold mb-4 md:mb-5 dark:text-white text-center md:text-left">Profil Saya</h2>

        <div class="p-4 md:p-6 shadow-md rounded-xl bg-white dark:bg-gray-800 dark:border dark:border-gray-700 transition">
            <div class="flex flex-col sm:flex-row gap-4 items-center sm:items-start mb-5 text-center sm:text-left">
                <Avatar :label="avatarLabel" shape="circle" class="!w-24 !h-24 sm:!w-20 sm:!h-20 text-2xl sm:text-xl bg-sky-600 text-white font-semibold shadow-sm" />
                <div class="flex flex-col items-center sm:items-start mt-2 sm:mt-0">
                    <h3 class="text-xl md:text-2xl font-semibold dark:text-white">{{ user.name }}</h3>
                    <p class="text-gray-600 dark:text-gray-300 break-all">{{ user.email }}</p>
                    <Tag :value="user.role" severity="info" class="mt-3 sm:mt-2 px-3 py-1" />
                </div>
            </div>

            <Divider class="dark:border-gray-700" />

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <div class="p-4 rounded-md bg-gray-50 dark:bg-gray-700 flex flex-col justify-center">
                    <p class="text-sm text-gray-500 dark:text-gray-300">Username</p>
                    <p class="text-gray-900 font-medium dark:text-white truncate" :title="user.username">{{ user.username }}</p>
                </div>

                <div class="p-4 rounded-md bg-gray-50 dark:bg-gray-700 flex flex-col justify-center">
                    <p class="text-sm text-gray-500 dark:text-gray-300">Nomor Telepon</p>
                    <p class="text-gray-900 font-medium dark:text-white truncate">{{ user.phone }}</p>
                </div>

                <div class="p-4 rounded-md bg-gray-50 dark:bg-gray-700 flex flex-col justify-center">
                    <p class="text-sm text-gray-500 dark:text-gray-300">Bergabung Sejak</p>
                    <p class="text-gray-900 font-medium dark:text-white truncate">{{ user.joinDate }}</p>
                </div>

                <div class="p-4 rounded-md bg-gray-50 dark:bg-gray-700 flex flex-col justify-center">
                    <p class="text-sm text-gray-500 dark:text-gray-300">Role</p>
                    <p class="text-gray-900 font-medium dark:text-white truncate">{{ user.role }}</p>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                <Button label="Edit Profil" class="p-button-primary w-full sm:w-auto" @click="openEdit" />
                <Button label="Logout" severity="danger" outlined class="w-full sm:w-auto" @click="onLogout" />
            </div>
        </div>
    </div>

    <Dialog v-model:visible="visibleEdit" modal header="Edit Profil" class="w-11/12 md:w-3/4 lg:w-1/2 xl:w-1/3" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <div class="flex flex-col gap-4 mt-2">
            <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Nama Lengkap</label>
                <InputText v-model="form.name" class="w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
            </div>

            <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Email</label>
                <InputText v-model="form.email" type="email" class="w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
            </div>

            <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Nomor Telepon</label>
                <InputText v-model="form.phone" type="tel" class="w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
            </div>

            <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Username</label>
                <InputText v-model="form.username" class="w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
            </div>
        </div>

        <template #footer>
            <div class="flex flex-col-reverse sm:flex-row justify-end gap-2 w-full mt-4">
                <Button label="Batal" outlined class="w-full sm:w-auto" @click="visibleEdit = false" />
                <Button label="Simpan" class="p-button-primary w-full sm:w-auto" @click="saveEdit" />
            </div>
        </template>
    </Dialog>
</template>

<style scoped>
/* Biarkan kosong jika murni pakai Tailwind */
</style>
