<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const router = useRouter();
const toast = useToast();

const user = ref({
    name: "Nama Pengguna",
    email: "email@example.com",
    phone: "081234567890",
    username: "admin01",
    joinDate: "12 Jan 2023",
    role: "Administrator",
});

const avatarLabel = computed(() => {
    const parts = user.value.name.split(" ");
    return parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0];
});

const visibleEdit = ref(false);

const form = ref({
    name: "",
    email: "",
    phone: "",
    username: ""
});

const openEdit = () => {
    form.value = { ...user.value };
    visibleEdit.value = true;
};

const saveEdit = async () => {
    const confirm = await Swal.fire({
        title: "Simpan Perubahan?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Simpan",
        cancelButtonText: "Batal",
        buttonsStyling: false,
        customClass: {
            confirmButton: "p-button p-component p-button-primary mx-2",
            cancelButton: "p-button p-component p-button-outlined mx-2",
        },
    });

    if (confirm.isConfirmed) {
        user.value = { ...form.value };
        visibleEdit.value = false;

        Swal.fire({
            title: "Berhasil!",
            text: "Profil berhasil diperbarui.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
        });
    }
};

const onLogout = async () => {
    const confirm = await Swal.fire({
        title: "Logout dari akun?",
        text: "Anda akan keluar dari sistem.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, Logout",
        cancelButtonText: "Batal",
        buttonsStyling: false,
        customClass: {
            confirmButton: "p-button p-component p-button-danger mx-2",
            cancelButton: "p-button p-component p-button-outlined mx-2",
        },
    });

    if (confirm.isConfirmed) {
        router.push("auth/login");
        toast.add({
            severity: "warn",
            summary: "Logout",
            detail: "Anda telah logout.",
            life: 1500,
        });
    }
};
</script>

<template>
    <div class="p-4 md:p-6 lg:p-8 w-full">
        <h2 class="text-xl font-semibold mb-5 dark:text-white">Profil Saya</h2>

        <div class="p-6 shadow-md rounded-xl bg-white dark:bg-gray-800 dark:border dark:border-gray-700 transition">
            <div class="flex gap-4 items-center mb-5">
                <Avatar :label="avatarLabel" shape="circle" class="!w-20 !h-20 text-xl bg-sky-600 text-white font-semibold" />
                <div>
                    <h3 class="text-xl font-semibold dark:text-white">{{ user.name }}</h3>
                    <p class="text-gray-600 dark:text-gray-300">{{ user.email }}</p>
                    <Tag :value="user.role" severity="info" class="mt-2" />
                </div>
            </div>

            <Divider class="dark:border-gray-700" />

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div class="p-4 rounded-md bg-gray-50 dark:bg-gray-700">
                    <p class="text-sm text-gray-500 dark:text-gray-300">Username</p>
                    <p class="text-gray-900 font-medium dark:text-white">{{ user.username }}</p>
                </div>

                <div class="p-4 rounded-md bg-gray-50 dark:bg-gray-700">
                    <p class="text-sm text-gray-500 dark:text-gray-300">Nomor Telepon</p>
                    <p class="text-gray-900 font-medium dark:text-white">{{ user.phone }}</p>
                </div>

                <div class="p-4 rounded-md bg-gray-50 dark:bg-gray-700">
                    <p class="text-sm text-gray-500 dark:text-gray-300">Tanggal Bergabung</p>
                    <p class="text-gray-900 font-medium dark:text-white">{{ user.joinDate }}</p>
                </div>

                <div class="p-4 rounded-md bg-gray-50 dark:bg-gray-700">
                    <p class="text-sm text-gray-500 dark:text-gray-300">Role</p>
                    <p class="text-gray-900 font-medium dark:text-white">{{ user.role }}</p>
                </div>
            </div>

            <div class="flex justify-end gap-3 mt-6">
                <Button label="Edit Profil" class="p-button-primary" @click="openEdit" />
                <Button label="Logout" severity="danger" outlined @click="onLogout" />
            </div>
        </div>
    </div>

    <Dialog v-model:visible="visibleEdit" modal header="Edit Profil" class="w-11/12 md:w-1/2 lg:w-1/3">
        <div class="flex flex-col gap-3 mt-1">
            <div>
                <label class="text-sm text-gray-700 dark:text-gray-300">Nama</label>
                <InputText v-model="form.name" class="w-full mt-1 dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
            </div>

            <div>
                <label class="text-sm text-gray-700 dark:text-gray-300">Email</label>
                <InputText v-model="form.email" class="w-full mt-1 dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
            </div>

            <div>
                <label class="text-sm text-gray-700 dark:text-gray-300">Nomor Telepon</label>
                <InputText v-model="form.phone" class="w-full mt-1 dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
            </div>

            <div>
                <label class="text-sm text-gray-700 dark:text-gray-300">Username</label>
                <InputText v-model="form.username" class="w-full mt-1 dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
            </div>
        </div>

        <template #footer>
            <Button label="Batal" outlined class="mr-2" @click="visibleEdit = false" />
            <Button label="Simpan" class="p-button-primary" @click="saveEdit" />
        </template>
    </Dialog>
</template>

<style scoped>
/* Tidak perlu @apply agar Tailwind tidak error */
</style>
