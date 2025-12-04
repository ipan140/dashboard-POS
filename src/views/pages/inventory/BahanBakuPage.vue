<script setup>
import { ref, computed } from "vue";
import Button from "primevue/button";
import Tag from "primevue/tag";
import InputText from "primevue/inputtext";
import Dialog from "primevue/dialog";
import Dropdown from "primevue/dropdown";

/* === DATA BAHAN BAKU === */
const items = ref([
  {
    id: 1,
    name: "Beras Premium",
    desc: "Beras kualitas premium untuk nasi goreng",
    category: "Bahan Pokok",
    stock: 150,
    min_stock: 50,
    unit: "Kg",
    price: 12000,
    supplier: "PT Beras Jaya",
    status: "Aman"
  }
]);

/* === KATEGORI === */
const categories = ref(["Semua", "Bahan Pokok", "Protein", "Bumbu", "Minuman", "Sayuran"]);

/* === FILTER === */
const search = ref("");
const activeCategory = ref("Semua");

const filteredItems = computed(() => {
  return items.value.filter((i) => {
    const matchSearch = i.name.toLowerCase().includes(search.value.toLowerCase());
    const matchCategory = activeCategory.value === "Semua" || i.category === activeCategory.value;
    return matchSearch && matchCategory;
  });
});

/* === STATISTIK === */
const totalItems = computed(() => items.value.length);
const lowStock = computed(() => items.value.filter(i => i.stock <= i.min_stock).length);
const totalCategories = computed(() => categories.value.filter(c => c !== "Semua").length);
const totalInventoryValue = computed(() =>
  items.value.reduce((total, i) => total + (i.stock * i.price), 0)
);

/* === MODAL TAMBAH === */
const showAdd = ref(false);
const newItem = ref({
  name: "",
  desc: "",
  category: "",
  stock: null,
  min_stock: null,
  unit: "",
  price: null,
  supplier: ""
});

const addItem = () => {
  const id = Date.now();
  items.value.push({ id, ...newItem.value, status: "Aman" });
  newItem.value = { name: "", desc: "", category: "", stock: null, min_stock: null, unit: "", price: null, supplier: "" };
  showAdd.value = false;
};

/* === EDIT === */
const showEdit = ref(false);
const editing = ref(null);

const openEdit = (item) => {
  editing.value = { ...item };
  showEdit.value = true;
};

const saveEdit = () => {
  const idx = items.value.findIndex(i => i.id === editing.value.id);
  items.value[idx] = editing.value;
  showEdit.value = false;
};

/* === DELETE === */
const deleteItem = (id) => {
  items.value = items.value.filter(i => i.id !== id);
};
</script>

<template>
  <div class="p-5 w-full text-gray-900 dark:text-gray-100">

    <!-- TITLE -->
    <div class="flex justify-between items-center mb-5">
      <h2 class="text-2xl font-semibold">Inventory Bahan Baku</h2>
      <Button label="Tambah Bahan Baku" icon="pi pi-plus" @click="showAdd = true" />
    </div>

    <!-- STATISTIC CARDS -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="p-4 rounded-lg shadow bg-white dark:bg-gray-800">
        <p class="text-sm text-gray-500">Total Item</p>
        <p class="text-3xl font-semibold">{{ totalItems }}</p>
      </div>
      <div class="p-4 rounded-lg shadow bg-white dark:bg-gray-800">
        <p class="text-sm text-gray-500">Stok Rendah</p>
        <p class="text-3xl font-semibold text-red-500">{{ lowStock }}</p>
      </div>
      <div class="p-4 rounded-lg shadow bg-white dark:bg-gray-800">
        <p class="text-sm text-gray-500">Kategori</p>
        <p class="text-3xl font-semibold">{{ totalCategories }}</p>
      </div>
      <div class="p-4 rounded-lg shadow bg-white dark:bg-gray-800">
        <p class="text-sm text-gray-500">Nilai Inventory</p>
        <p class="text-2xl font-semibold text-green-600">
          Rp {{ totalInventoryValue.toLocaleString() }}
        </p>
      </div>
    </div>

    <!-- CARD TABLE -->
    <div class="rounded-xl p-5 shadow bg-white dark:bg-gray-800 border dark:border-gray-700">

      <!-- FILTER -->
      <div class="flex flex-wrap gap-2 mb-5">
        <Button
          v-for="c in categories"
          :key="c"
          :label="c"
          size="small"
          :severity="activeCategory === c ? 'primary' : 'secondary'"
          @click="activeCategory = c"
        />
      </div>

      <!-- TABLE -->
      <div class="overflow-auto">
        <table class="min-w-full border-collapse">
          <thead>
            <tr class="bg-gray-100 dark:bg-gray-700">
              <th class="p-3 text-left">Nama Bahan</th>
              <th class="p-3 text-left">Kategori</th>
              <th class="p-3 text-left">Stok</th>
              <th class="p-3 text-left">Satuan</th>
              <th class="p-3 text-left">Harga Beli</th>
              <th class="p-3 text-left">Supplier</th>
              <th class="p-3 text-center">Status</th>
              <th class="p-3 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="i in filteredItems"
              :key="i.id"
              class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40"
            >
              <td class="p-3">
                <p class="font-semibold">{{ i.name }}</p>
                <p class="text-sm text-gray-500">{{ i.desc }}</p>
              </td>
              <td class="p-3">
                <Tag :value="i.category" severity="info" />
              </td>
              <td class="p-3">{{ i.stock }} <span class="text-xs text-gray-500">Min: {{ i.min_stock }}</span></td>
              <td class="p-3">{{ i.unit }}</td>
              <td class="p-3 font-semibold text-green-600">
                Rp {{ i.price.toLocaleString() }}
              </td>
              <td class="p-3">{{ i.supplier }}</td>
              <td class="p-3 text-center">
                <Tag :value="i.status" :severity="i.status === 'Aman' ? 'success' : 'danger'" />
              </td>
              <td class="p-3 flex gap-2 justify-center">
                <Button label="Edit" size="small" severity="info" @click="openEdit(i)" />
                <Button label="Hapus" size="small" severity="danger" @click="deleteItem(i.id)" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredItems.length === 0" class="text-center py-6 text-gray-500">
        Tidak ada data.
      </div>
    </div>

    <!-- MODAL TAMBAH -->
    <Dialog v-model:visible="showAdd" modal header="Tambah Bahan Baku" class="w-11/12 md:w-1/2">
      <div class="flex flex-col gap-3">
        <InputText v-model="newItem.name" placeholder="Nama Bahan" />
        <InputText v-model="newItem.desc" placeholder="Deskripsi" />
        <Dropdown v-model="newItem.category" :options="categories.filter(c=>c!=='Semua')" placeholder="Kategori" />
        <InputText v-model="newItem.stock" type="number" placeholder="Stok" />
        <InputText v-model="newItem.min_stock" type="number" placeholder="Minimal Stok" />
        <InputText v-model="newItem.unit" placeholder="Satuan (Kg, Bungkus, dll)" />
        <InputText v-model="newItem.price" type="number" placeholder="Harga Beli" />
        <InputText v-model="newItem.supplier" placeholder="Supplier" />
        <Button label="Simpan" class="w-full" @click="addItem" />
      </div>
    </Dialog>

    <!-- MODAL EDIT -->
    <Dialog v-model:visible="showEdit" modal header="Edit Bahan Baku" class="w-11/12 md:w-1/2">
      <div v-if="editing" class="flex flex-col gap-3">
        <InputText v-model="editing.name" placeholder="Nama Bahan" />
        <InputText v-model="editing.desc" placeholder="Deskripsi" />
        <Dropdown v-model="editing.category" :options="categories.filter(c=>c!=='Semua')" placeholder="Kategori" />
        <InputText v-model="editing.stock" type="number" placeholder="Stok" />
        <InputText v-model="editing.min_stock" type="number" placeholder="Minimal Stok" />
        <InputText v-model="editing.unit" placeholder="Satuan" />
        <InputText v-model="editing.price" type="number" placeholder="Harga Beli" />
        <InputText v-model="editing.supplier" placeholder="Supplier" />
        <Button label="Simpan Perubahan" class="w-full" @click="saveEdit" />
      </div>
    </Dialog>

  </div>
</template>
