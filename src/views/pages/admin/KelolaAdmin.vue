<script setup>
import { ref, computed } from "vue";
import Tag from "primevue/tag";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Dialog from "primevue/dialog";
import Dropdown from "primevue/dropdown";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

// Dummy data
const users = ref([
  { id: 1, name: "Andi", username: "andi01", role: "Admin" },
  { id: 2, name: "Budi", username: "budi02", role: "Kasir" },
  { id: 3, name: "Siti", username: "siti03", role: "Kasir" },
]);

const search = ref("");

// Filter
const filteredData = computed(() => {
  if (!search.value) return users.value;
  return users.value.filter(
    (u) =>
      u.name.toLowerCase().includes(search.value.toLowerCase()) ||
      u.username.toLowerCase().includes(search.value.toLowerCase())
  );
});

// Role badge
const getSeverity = (role) => {
  if (role === "Admin") return "info";
  if (role === "Kasir") return "success";
  return "secondary";
};

/* ==========================
   MODAL VIEW USER
========================== */
const visibleView = ref(false);
const selectedUser = ref({});
const openView = (user) => {
  selectedUser.value = { ...user };
  visibleView.value = true;
};

/* ==========================
   MODAL EDIT USER
========================== */
const visibleEdit = ref(false);
const editForm = ref({});

const openEdit = (user) => {
  editForm.value = { ...user };
  visibleEdit.value = true;
};

const roles = [
  { label: "Admin", value: "Admin" },
  { label: "Kasir", value: "Kasir" },
];

const saveEdit = async () => {
  const confirm = await Swal.fire({
    title: "Simpan Perubahan?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Simpan",
    cancelButtonText: "Batal",
  });

  if (!confirm.isConfirmed) return;

  const index = users.value.findIndex((u) => u.id === editForm.value.id);
  users.value[index] = { ...editForm.value };

  visibleEdit.value = false;

  Swal.fire({
    icon: "success",
    title: "Berhasil",
    text: "Data pengguna berhasil diperbarui.",
    timer: 1500,
    showConfirmButton: false,
  });
};

/* ==========================
   MODAL CREATE USER
========================== */
const visibleCreate = ref(false);
const createForm = ref({
  name: "",
  username: "",
  role: "Kasir",
});

const saveCreate = async () => {
  if (!createForm.value.name || !createForm.value.username) {
    Swal.fire("Oops!", "Nama dan username wajib diisi!", "warning");
    return;
  }

  const confirm = await Swal.fire({
    title: "Tambah User?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Tambah",
    cancelButtonText: "Batal",
  });

  if (!confirm.isConfirmed) return;

  users.value.push({
    id: users.value.length + 1,
    ...createForm.value,
  });

  visibleCreate.value = false;

  Swal.fire({
    icon: "success",
    title: "Berhasil",
    text: "User baru berhasil ditambahkan.",
    timer: 1500,
    showConfirmButton: false,
  });

  createForm.value = { name: "", username: "", role: "Kasir" };
};

/* ==========================
   DELETE USER
========================== */
const deleteUser = async (id) => {
  const confirm = await Swal.fire({
    title: "Hapus User?",
    text: "Data tidak bisa dikembalikan.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Hapus",
    cancelButtonText: "Batal",
    confirmButtonColor: "#ef4444",
  });

  if (!confirm.isConfirmed) return;

  users.value = users.value.filter((u) => u.id !== id);

  Swal.fire({
    icon: "success",
    title: "Dihapus",
    text: "User berhasil dihapus.",
    timer: 1500,
    showConfirmButton: false,
  });
};
</script>

<template>
  <div class="p-4 md:p-6 lg:p-8 w-full transition-all">
    <h2 class="text-xl font-semibold mb-5 text-gray-900 dark:text-gray-100">
      Kelola Admin & Kasir
    </h2>

    <div
      class="card p-6 shadow-md rounded-xl bg-white dark:bg-gray-800 border 
      border-gray-200 dark:border-gray-700 transition-all"
    >
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-200">
          Daftar Pengguna
        </h3>

        <div class="flex gap-3 items-center">
          <InputText
            v-model="search"
            placeholder="Cari pengguna..."
            class="w-64 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />

          <Button
            label="Tambah User"
            icon="pi pi-plus"
            class="p-button-primary"
            @click="visibleCreate = true"
          />
        </div>
      </div>

      <!-- TABLE -->
      <div class="overflow-x-auto mt-4">
        <table class="min-w-full border-collapse">
          <thead>
            <tr
              class="bg-gray-100 dark:bg-gray-700 text-left text-gray-700 dark:text-gray-200"
            >
              <th class="p-3">ID</th>
              <th class="p-3">Nama</th>
              <th class="p-3">Username</th>
              <th class="p-3">Role</th>
              <th class="p-3">Aksi</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="u in filteredData"
              :key="u.id"
              class="border-b border-gray-200 dark:border-gray-700
                     hover:bg-gray-50 dark:hover:bg-gray-700/50
                     text-gray-900 dark:text-gray-100"
            >
              <td class="p-3">{{ u.id }}</td>
              <td class="p-3">{{ u.name }}</td>
              <td class="p-3">{{ u.username }}</td>
              <td class="p-3">
                <Tag :value="u.role" :severity="getSeverity(u.role)" />
              </td>

              <td class="p-3 flex gap-2">
                <Button
                  icon="pi pi-eye"
                  size="small"
                  class="p-button-text dark:text-green-400"
                  @click="openView(u)"
                />
                <Button
                  icon="pi pi-pencil"
                  size="small"
                  class="p-button-text dark:text-blue-400"
                  @click="openEdit(u)"
                />
                <Button
                  icon="pi pi-trash"
                  size="small"
                  class="p-button-text text-red-500 dark:text-red-400"
                  @click="deleteUser(u.id)"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <div
          v-if="filteredData.length === 0"
          class="text-center py-6 text-gray-500 dark:text-gray-400"
        >
          Tidak ada pengguna ditemukan.
        </div>
      </div>
    </div>

    <!-- ============================
         MODAL VIEW USER
    ============================= -->
    <Dialog
      v-model:visible="visibleView"
      modal
      header="Detail Pengguna"
      class="w-11/12 md:w-1/3"
    >
      <div class="flex flex-col gap-2 text-gray-900 dark:text-gray-100">
        <p><strong>Nama:</strong> {{ selectedUser.name }}</p>
        <p><strong>Username:</strong> {{ selectedUser.username }}</p>
        <p><strong>Role:</strong> {{ selectedUser.role }}</p>
      </div>
    </Dialog>

    <!-- ============================
         MODAL EDIT USER
    ============================= -->
    <Dialog
      v-model:visible="visibleEdit"
      modal
      header="Edit Pengguna"
      class="w-11/12 md:w-1/3"
    >
      <div class="flex flex-col gap-4">
        <div>
          <label class="font-medium">Nama</label>
          <InputText v-model="editForm.name" class="w-full mt-1" />
        </div>

        <div>
          <label class="font-medium">Username</label>
          <InputText v-model="editForm.username" class="w-full mt-1" />
        </div>

        <div>
          <label class="font-medium">Role</label>
          <Dropdown
            v-model="editForm.role"
            :options="roles"
            optionLabel="label"
            optionValue="value"
            class="w-full mt-1"
          />
        </div>
      </div>

      <template #footer>
        <Button label="Batal" outlined @click="visibleEdit = false" />
        <Button label="Simpan" class="p-button-primary" @click="saveEdit" />
      </template>
    </Dialog>

    <!-- ============================
         MODAL CREATE USER
    ============================= -->
    <Dialog
      v-model:visible="visibleCreate"
      modal
      header="Tambah User"
      class="w-11/12 md:w-1/3"
    >
      <div class="flex flex-col gap-4">
        <div>
          <label class="font-medium">Nama</label>
          <InputText v-model="createForm.name" class="w-full mt-1" />
        </div>

        <div>
          <label class="font-medium">Username</label>
          <InputText v-model="createForm.username" class="w-full mt-1" />
        </div>

        <div>
          <label class="font-medium">Role</label>
          <Dropdown
            v-model="createForm.role"
            :options="roles"
            optionLabel="label"
            optionValue="value"
            class="w-full mt-1"
          />
        </div>
      </div>

      <template #footer>
        <Button label="Batal" outlined @click="visibleCreate = false" />
        <Button label="Tambah" class="p-button-primary" @click="saveCreate" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.card {
  border-radius: 14px;
}
</style>
