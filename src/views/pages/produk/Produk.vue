<script setup>
import { ref, computed } from "vue";
import Button from "primevue/button";
import Tag from "primevue/tag";
import InputText from "primevue/inputtext";
import Dialog from "primevue/dialog";
import Textarea from "primevue/textarea";
import Dropdown from "primevue/dropdown";

/* === DATA PRODUK === */
const products = ref([
    {
        id: 1,
        name: "Nasi Goreng Spesial",
        category: "Makanan",
        price: 25000,
        stock: 50,
        desc: "Nasi goreng lengkap dengan topping",
        img: "https://picsum.photos/200"
    },
    {
        id: 2,
        name: "Es Teh Manis",
        category: "Minuman",
        price: 8000,
        stock: 100,
        desc: "Teh manis dingin segar",
        img: "https://picsum.photos/201"
    }
]);

/* === CATEGORY LIST === */
const categories = ref(["Semua", "Makanan", "Minuman", "Snack"]);

/* === FILTER === */
const search = ref("");
const activeFilter = ref("Semua");

const filteredProducts = computed(() => {
    return products.value.filter((p) => {
        const matchSearch = p.name.toLowerCase().includes(search.value.toLowerCase());
        const matchCategory =
            activeFilter.value === "Semua" || p.category === activeFilter.value;

        return matchSearch && matchCategory;
    });
});

const setFilter = (c) => (activeFilter.value = c);

/* === STATISTIK === */
const totalProducts = computed(() => products.value.length);
const totalStock = computed(() => products.value.reduce((sum, p) => sum + p.stock, 0));
const totalActiveCategories = computed(() =>
    categories.value.filter(c => c !== "Semua").length
);

/* === MODAL TAMBAH PRODUK === */
const showAddModal = ref(false);

const newProduct = ref({
    name: "",
    category: "",
    price: null,
    stock: null,
    desc: "",
    img: "https://picsum.photos/210"
});

const addProduct = () => {
    const id = Date.now();
    products.value.push({ id, ...newProduct.value });

    newProduct.value = {
        name: "",
        category: "",
        price: null,
        stock: null,
        desc: "",
        img: "https://picsum.photos/210"
    };
    showAddModal.value = false;
};

/* === MODAL EDIT PRODUK === */
const showEditModal = ref(false);
const editingProduct = ref(null);

const openEdit = (p) => {
    editingProduct.value = { ...p };
    showEditModal.value = true;
};

const saveEdit = () => {
    const idx = products.value.findIndex((p) => p.id === editingProduct.value.id);
    products.value[idx] = { ...editingProduct.value };
    showEditModal.value = false;
};

/* === DELETE === */
const deleteProduct = (id) => {
    products.value = products.value.filter((p) => p.id !== id);
};

/* === MODAL TAMBAH KATEGORI === */
const showCategoryModal = ref(false);
const newCategory = ref("");

const addCategory = () => {
    if (!newCategory.value.trim()) return;
    categories.value.push(newCategory.value);
    newCategory.value = "";
    showCategoryModal.value = false;
};
</script>

<template>
  <div class="p-5 w-full transition-all text-gray-900 dark:text-gray-100">

    <!-- Header -->
    <div class="flex justify-between items-center mb-5">
      <h2 class="text-2xl font-semibold">Daftar Produk</h2>

      <div class="flex gap-2">
        <Button label="Tambah Kategori" icon="pi pi-tag" severity="success"
          @click="showCategoryModal = true" />

        <Button label="Tambah Produk" icon="pi pi-plus"
          @click="showAddModal = true" />
      </div>
    </div>

    <!-- 📌 CARD STATISTIK -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="p-5 rounded-lg shadow bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <p class="text-sm text-gray-500 dark:text-gray-400">Total Produk</p>
        <p class="text-3xl font-semibold mt-1">{{ totalProducts }}</p>
      </div>

      <div class="p-5 rounded-lg shadow bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <p class="text-sm text-gray-500 dark:text-gray-400">Total Stok</p>
        <p class="text-3xl font-semibold mt-1">{{ totalStock }}</p>
      </div>

      <div class="p-5 rounded-lg shadow bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <p class="text-sm text-gray-500 dark:text-gray-400">Kategori Aktif</p>
        <p class="text-3xl font-semibold mt-1">{{ totalActiveCategories }}</p>
      </div>
    </div>

    <!-- Card -->
    <div class="rounded-xl p-5 shadow bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">

      <!-- FILTER -->
      <div class="flex flex-wrap gap-3 mb-5">
        <InputText
          v-model="search"
          placeholder="Cari produk..."
          class="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
        />

        <div class="flex gap-2 flex-wrap">
          <Button
            v-for="c in categories"
            :key="c"
            :label="c"
            size="small"
            :severity="activeFilter === c ? 'primary' : 'secondary'"
            @click="setFilter(c)"
          />
        </div>
      </div>

      <!-- TABLE -->
      <div class="overflow-auto">
        <table class="min-w-full border-collapse">
          <thead>
            <tr class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              <th class="p-3">Gambar</th>
              <th class="p-3">Nama</th>
              <th class="p-3">Kategori</th>
              <th class="p-3">Harga</th>
              <th class="p-3">Stok</th>
              <th class="p-3">Deskripsi</th>
              <th class="p-3 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="p in filteredProducts"
              :key="p.id"
              class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40"
            >
              <td class="p-3">
                <img :src="p.img" class="thumb" />
              </td>

              <td class="p-3 font-semibold">{{ p.name }}</td>

              <td class="p-3">
                <Tag :value="p.category" severity="info" />
              </td>

              <td class="p-3 text-green-600 dark:text-green-400 font-semibold">
                Rp {{ p.price.toLocaleString() }}
              </td>

              <td class="p-3">{{ p.stock }}</td>

              <td class="p-3 text-sm">{{ p.desc }}</td>

              <td class="p-3 flex gap-2 justify-center">
                <Button label="Edit" size="small" severity="info" @click="openEdit(p)" />
                <Button label="Hapus" size="small" severity="danger" @click="deleteProduct(p.id)" />
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="filteredProducts.length === 0" class="text-center py-6 text-gray-500">
          Tidak ada produk ditemukan.
        </div>
      </div>
    </div>

    <!-- MODAL TAMBAH PRODUK -->
    <Dialog v-model:visible="showAddModal" modal header="Tambah Produk" :style="{ width: '600px', maxWidth: '95%' }">
      <div class="flex flex-col gap-3">

        <InputText v-model="newProduct.name" placeholder="Nama Produk" />

        <Dropdown
          v-model="newProduct.category"
          :options="categories.filter(c => c !== 'Semua')"
          placeholder="Pilih Kategori"
        />

        <InputText v-model="newProduct.price" type="number" placeholder="Harga" />
        <InputText v-model="newProduct.stock" type="number" placeholder="Stok" />

        <Textarea v-model="newProduct.desc" rows="3" placeholder="Deskripsi" autoResize />

        <Button label="Simpan" class="w-full" @click="addProduct" />
      </div>
    </Dialog>

    <!-- MODAL EDIT PRODUK -->
    <Dialog v-model:visible="showEditModal" modal header="Edit Produk" :style="{ width: '600px', maxWidth: '95%' }">
      <div v-if="editingProduct" class="flex flex-col gap-3">

        <InputText v-model="editingProduct.name" placeholder="Nama Produk" />

        <Dropdown
          v-model="editingProduct.category"
          :options="categories.filter(c => c !== 'Semua')"
          placeholder="Pilih Kategori"
        />

        <InputText v-model="editingProduct.price" type="number" placeholder="Harga" />
        <InputText v-model="editingProduct.stock" type="number" placeholder="Stok" />

        <Textarea v-model="editingProduct.desc" rows="3" autoResize placeholder="Deskripsi" />

        <Button label="Simpan Perubahan" class="w-full" @click="saveEdit" />
      </div>
    </Dialog>

    <!-- MODAL TAMBAH KATEGORI -->
    <Dialog v-model:visible="showCategoryModal" modal header="Tambah Kategori" :style="{ width: '500px', maxWidth: '95%' }">
      <div class="flex flex-col gap-3">
        <InputText v-model="newCategory" placeholder="Nama kategori baru..." />
        <Button label="Tambah" class="w-full" @click="addCategory" />
      </div>
    </Dialog>

  </div>
</template>

<style scoped>
.thumb {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.dark .thumb {
  border-color: #555;
}
</style>
