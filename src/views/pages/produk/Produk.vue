<script setup>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';
import Textarea from 'primevue/textarea';
import { computed, ref } from 'vue';

/* === DATA PRODUK === */
const products = ref([
    {
        id: 1,
        name: 'Nasi Goreng Spesial',
        category: 'Makanan',
        price: 25000,
        stock: 50,
        desc: 'Nasi goreng lengkap dengan topping',
        img: 'https://picsum.photos/200'
    },
    {
        id: 2,
        name: 'Es Teh Manis',
        category: 'Minuman',
        price: 8000,
        stock: 100,
        desc: 'Teh manis dingin segar',
        img: 'https://picsum.photos/201'
    }
]);

/* === CATEGORY LIST === */
const categories = ref(['Semua', 'Makanan', 'Minuman', 'Snack']);

/* === FILTER === */
const search = ref('');
const activeFilter = ref('Semua');

const filteredProducts = computed(() => {
    return products.value.filter((p) => {
        const matchSearch = p.name.toLowerCase().includes(search.value.toLowerCase());
        const matchCategory = activeFilter.value === 'Semua' || p.category === activeFilter.value;
        return matchSearch && matchCategory;
    });
});

const setFilter = (c) => (activeFilter.value = c);

/* === STATISTIK === */
const totalProducts = computed(() => products.value.length);
const totalStock = computed(() => products.value.reduce((sum, p) => sum + p.stock, 0));
const totalActiveCategories = computed(() => categories.value.filter((c) => c !== 'Semua').length);

/* === HELPER: IMAGE UPLOAD === */
const handleImageUpload = (event, target, field = 'img') => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        target[field] = e.target.result;
    };
    reader.readAsDataURL(file);
};

/* === MODAL TAMBAH PRODUK === */
const showAddModal = ref(false);
const addFileInput = ref(null);

const newProduct = ref({
    name: '',
    category: '',
    price: null,
    stock: null,
    desc: '',
    img: ''
});

const addProduct = () => {
    const id = Date.now();
    products.value.push({
        id,
        ...newProduct.value,
        img: newProduct.value.img || `https://picsum.photos/seed/${id}/200`
    });
    newProduct.value = { name: '', category: '', price: null, stock: null, desc: '', img: '' };
    showAddModal.value = false;
};

/* === MODAL EDIT PRODUK === */
const showEditModal = ref(false);
const editingProduct = ref(null);
const editFileInput = ref(null);

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
const newCategory = ref('');
const categoryIconInput = ref(null);
const newCategoryIcon = ref('');

const addCategory = () => {
    if (!newCategory.value.trim()) return;
    categories.value.push(newCategory.value);
    newCategory.value = '';
    newCategoryIcon.value = '';
    showCategoryModal.value = false;
};

/* === VIEW MODE (card / table) === */
const viewMode = ref('table');
</script>

<template>
    <div class="p-4 md:p-6 w-full text-gray-900 dark:text-gray-100">
        <!-- ===== HEADER ===== -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <h2 class="text-2xl font-semibold">Daftar Produk</h2>
            <div class="flex flex-wrap gap-2">
                <Button label="Tambah Kategori" icon="pi pi-tag" severity="success" size="small" @click="showCategoryModal = true" />
                <Button label="Tambah Produk" icon="pi pi-plus" size="small" @click="showAddModal = true" />
            </div>
        </div>

        <!-- ===== STATISTIK ===== -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div class="stat-card">
                <p class="text-sm text-gray-500 dark:text-gray-400">Total Produk</p>
                <p class="text-3xl font-semibold mt-1">{{ totalProducts }}</p>
            </div>
            <div class="stat-card">
                <p class="text-sm text-gray-500 dark:text-gray-400">Total Stok</p>
                <p class="text-3xl font-semibold mt-1">{{ totalStock }}</p>
            </div>
            <div class="stat-card">
                <p class="text-sm text-gray-500 dark:text-gray-400">Kategori Aktif</p>
                <p class="text-3xl font-semibold mt-1">{{ totalActiveCategories }}</p>
            </div>
        </div>

        <!-- ===== MAIN CARD ===== -->
        <div class="rounded-xl p-4 md:p-5 shadow bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <!-- FILTER + VIEW TOGGLE -->
            <div class="flex flex-col sm:flex-row gap-3 mb-5">
                <InputText v-model="search" placeholder="Cari produk..." class="w-full sm:w-64 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />

                <div class="flex flex-wrap gap-2 flex-1">
                    <Button v-for="c in categories" :key="c" :label="c" size="small" :severity="activeFilter === c ? 'primary' : 'secondary'" @click="setFilter(c)" />
                </div>

                <!-- View toggle -->
                <div class="flex gap-1 ml-auto">
                    <button
                        class="p-2 rounded-lg border transition-colors"
                        :class="viewMode === 'table' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300'"
                        @click="viewMode = 'table'"
                        title="Tampilan Tabel"
                    >
                        <i class="pi pi-list text-sm" />
                    </button>
                    <button
                        class="p-2 rounded-lg border transition-colors"
                        :class="viewMode === 'card' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300'"
                        @click="viewMode = 'card'"
                        title="Tampilan Kartu"
                    >
                        <i class="pi pi-th-large text-sm" />
                    </button>
                </div>
            </div>

            <!-- ===== TABLE VIEW ===== -->
            <div v-if="viewMode === 'table'" class="overflow-x-auto">
                <table class="min-w-full border-collapse text-sm">
                    <thead>
                        <tr class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                            <th class="p-3 text-left">Gambar</th>
                            <th class="p-3 text-left">Nama</th>
                            <th class="p-3 text-left hidden sm:table-cell">Kategori</th>
                            <th class="p-3 text-left">Harga</th>
                            <th class="p-3 text-left hidden md:table-cell">Stok</th>
                            <th class="p-3 text-left hidden lg:table-cell">Deskripsi</th>
                            <th class="p-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="p in filteredProducts" :key="p.id" class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40">
                            <td class="p-3">
                                <img :src="p.img" class="thumb" :alt="p.name" />
                            </td>
                            <td class="p-3 font-semibold">
                                {{ p.name }}
                                <!-- Mobile: tampilkan kategori di bawah nama -->
                                <div class="sm:hidden mt-1">
                                    <Tag :value="p.category" severity="info" />
                                </div>
                                <!-- Mobile: tampilkan stok -->
                                <div class="md:hidden text-xs text-gray-400 mt-1">Stok: {{ p.stock }}</div>
                            </td>
                            <td class="p-3 hidden sm:table-cell">
                                <Tag :value="p.category" severity="info" />
                            </td>
                            <td class="p-3 text-green-600 dark:text-green-400 font-semibold whitespace-nowrap">Rp {{ Number(p.price).toLocaleString('id-ID') }}</td>
                            <td class="p-3 hidden md:table-cell">{{ p.stock }}</td>
                            <td class="p-3 hidden lg:table-cell text-sm text-gray-500 dark:text-gray-400 max-w-[200px] truncate">
                                {{ p.desc }}
                            </td>
                            <td class="p-3">
                                <div class="flex gap-2 justify-center flex-wrap">
                                    <Button label="Edit" size="small" severity="info" @click="openEdit(p)" />
                                    <Button label="Hapus" size="small" severity="danger" @click="deleteProduct(p.id)" />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div v-if="filteredProducts.length === 0" class="text-center py-10 text-gray-400">
                    <i class="pi pi-inbox text-4xl mb-3 block" />
                    Tidak ada produk ditemukan.
                </div>
            </div>

            <!-- ===== CARD VIEW ===== -->
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <div v-for="p in filteredProducts" :key="p.id" class="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 overflow-hidden flex flex-col">
                    <img :src="p.img" :alt="p.name" class="w-full h-40 object-cover" />
                    <div class="p-3 flex flex-col gap-2 flex-1">
                        <div class="flex items-start justify-between gap-2">
                            <p class="font-semibold text-sm leading-snug">{{ p.name }}</p>
                            <Tag :value="p.category" severity="info" class="shrink-0" />
                        </div>
                        <p class="text-green-600 dark:text-green-400 font-bold text-sm">Rp {{ Number(p.price).toLocaleString('id-ID') }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 flex-1">{{ p.desc }}</p>
                        <p class="text-xs text-gray-400">Stok: {{ p.stock }}</p>
                        <div class="flex gap-2 mt-1">
                            <Button label="Edit" size="small" severity="info" class="flex-1" @click="openEdit(p)" />
                            <Button label="Hapus" size="small" severity="danger" class="flex-1" @click="deleteProduct(p.id)" />
                        </div>
                    </div>
                </div>

                <div v-if="filteredProducts.length === 0" class="col-span-full text-center py-10 text-gray-400">
                    <i class="pi pi-inbox text-4xl mb-3 block" />
                    Tidak ada produk ditemukan.
                </div>
            </div>
        </div>

        <!-- ===== MODAL TAMBAH PRODUK ===== -->
        <Dialog v-model:visible="showAddModal" modal header="Tambah Produk" :style="{ width: '95vw', maxWidth: '560px' }">
            <div class="flex flex-col gap-3">
                <!-- Upload Foto -->
                <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-gray-600 dark:text-gray-300">Foto Produk</label>
                    <div class="upload-zone" @click="addFileInput.click()" @dragover.prevent @drop.prevent="(e) => handleImageUpload({ target: e.dataTransfer }, newProduct)">
                        <img v-if="newProduct.img" :src="newProduct.img" class="w-full h-full object-cover rounded-lg" alt="preview" />
                        <div v-else class="flex flex-col items-center gap-2 text-gray-400">
                            <i class="pi pi-image text-3xl" />
                            <span class="text-sm">Klik atau drag foto ke sini</span>
                            <span class="text-xs">JPG, PNG, WEBP • Maks 5MB</span>
                        </div>
                    </div>
                    <input ref="addFileInput" type="file" accept="image/*" class="hidden" @change="(e) => handleImageUpload(e, newProduct)" />
                    <Button v-if="newProduct.img" label="Hapus Foto" size="small" severity="secondary" icon="pi pi-times" class="w-fit" @click="newProduct.img = ''" />
                </div>

                <InputText v-model="newProduct.name" placeholder="Nama Produk" />

                <Dropdown v-model="newProduct.category" :options="categories.filter((c) => c !== 'Semua')" placeholder="Pilih Kategori" />

                <div class="grid grid-cols-2 gap-2">
                    <InputText v-model="newProduct.price" type="number" placeholder="Harga (Rp)" />
                    <InputText v-model="newProduct.stock" type="number" placeholder="Stok" />
                </div>

                <Textarea v-model="newProduct.desc" rows="3" placeholder="Deskripsi produk..." autoResize />

                <Button label="Simpan Produk" icon="pi pi-check" class="w-full" @click="addProduct" />
            </div>
        </Dialog>

        <!-- ===== MODAL EDIT PRODUK ===== -->
        <Dialog v-model:visible="showEditModal" modal header="Edit Produk" :style="{ width: '95vw', maxWidth: '560px' }">
            <div v-if="editingProduct" class="flex flex-col gap-3">
                <!-- Upload Foto -->
                <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-gray-600 dark:text-gray-300">Foto Produk</label>
                    <div class="upload-zone" @click="editFileInput.click()" @dragover.prevent @drop.prevent="(e) => handleImageUpload({ target: e.dataTransfer }, editingProduct)">
                        <img v-if="editingProduct.img" :src="editingProduct.img" class="w-full h-full object-cover rounded-lg" alt="preview" />
                        <div v-else class="flex flex-col items-center gap-2 text-gray-400">
                            <i class="pi pi-image text-3xl" />
                            <span class="text-sm">Klik atau drag foto ke sini</span>
                        </div>
                    </div>
                    <input ref="editFileInput" type="file" accept="image/*" class="hidden" @change="(e) => handleImageUpload(e, editingProduct)" />
                    <Button v-if="editingProduct.img" label="Hapus Foto" size="small" severity="secondary" icon="pi pi-times" class="w-fit" @click="editingProduct.img = ''" />
                </div>

                <InputText v-model="editingProduct.name" placeholder="Nama Produk" />

                <Dropdown v-model="editingProduct.category" :options="categories.filter((c) => c !== 'Semua')" placeholder="Pilih Kategori" />

                <div class="grid grid-cols-2 gap-2">
                    <InputText v-model="editingProduct.price" type="number" placeholder="Harga (Rp)" />
                    <InputText v-model="editingProduct.stock" type="number" placeholder="Stok" />
                </div>

                <Textarea v-model="editingProduct.desc" rows="3" autoResize placeholder="Deskripsi produk..." />

                <Button label="Simpan Perubahan" icon="pi pi-check" class="w-full" @click="saveEdit" />
            </div>
        </Dialog>

        <!-- ===== MODAL TAMBAH KATEGORI ===== -->
        <Dialog v-model:visible="showCategoryModal" modal header="Tambah Kategori" :style="{ width: '95vw', maxWidth: '420px' }">
            <div class="flex flex-col gap-3">
                <!-- Upload Ikon Kategori -->
                <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-gray-600 dark:text-gray-300">Ikon Kategori (Opsional)</label>
                    <div
                        class="upload-zone upload-zone-sm"
                        @click="categoryIconInput.click()"
                        @dragover.prevent
                        @drop.prevent="
                            (e) => {
                                const f = e.dataTransfer.files[0];
                                if (f) {
                                    const r = new FileReader();
                                    r.onload = (ev) => (newCategoryIcon.value = ev.target.result);
                                    r.readAsDataURL(f);
                                }
                            }
                        "
                    >
                        <img v-if="newCategoryIcon" :src="newCategoryIcon" class="w-full h-full object-cover rounded-lg" alt="ikon" />
                        <div v-else class="flex flex-col items-center gap-1 text-gray-400">
                            <i class="pi pi-camera text-2xl" />
                            <span class="text-xs">Upload ikon</span>
                        </div>
                    </div>
                    <input
                        ref="categoryIconInput"
                        type="file"
                        accept="image/*"
                        class="hidden"
                        @change="
                            (e) => {
                                const f = e.target.files[0];
                                if (f) {
                                    const r = new FileReader();
                                    r.onload = (ev) => (newCategoryIcon = ev.target.result);
                                    r.readAsDataURL(f);
                                }
                            }
                        "
                    />
                </div>

                <InputText v-model="newCategory" placeholder="Nama kategori baru..." />
                <Button label="Tambah Kategori" icon="pi pi-plus" class="w-full" @click="addCategory" />
            </div>
        </Dialog>
    </div>
</template>

<style scoped>
.stat-card {
    padding: 1.25rem;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    background: #ffffff;
    border: 1px solid #e5e7eb;
}

.dark .stat-card {
    background: #1f2937;
    border-color: #374151;
}

.thumb {
    width: 56px;
    height: 56px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    flex-shrink: 0;
}

.dark .thumb {
    border-color: #4b5563;
}

/* Upload zone */
.upload-zone {
    width: 100%;
    height: 160px;
    border: 2px dashed #d1d5db;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    overflow: hidden;
    transition:
        border-color 0.2s,
        background-color 0.2s;
    background: #f9fafb;
}

.upload-zone:hover {
    border-color: #3b82f6;
    background: #eff6ff;
}

.dark .upload-zone {
    border-color: #4b5563;
    background: #374151;
}

.dark .upload-zone:hover {
    border-color: #60a5fa;
    background: #1e3a5f;
}

.upload-zone-sm {
    height: 100px;
}

/* line clamp utility */
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
