<script setup>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';
import { computed, ref } from 'vue';

/* === DATA BAHAN BAKU === */
const items = ref([
    {
        id: 1,
        name: 'Beras Premium',
        desc: 'Beras kualitas premium untuk nasi goreng',
        category: 'Bahan Pokok',
        stock: 150,
        min_stock: 50,
        unit: 'Kg',
        price: 12000,
        supplier: 'PT Beras Jaya',
        status: 'Aman'
    }
]);

/* === KATEGORI === */
const categories = ref(['Semua', 'Bahan Pokok', 'Protein', 'Bumbu', 'Minuman', 'Sayuran']);

/* === FILTER === */
const search = ref('');
const activeCategory = ref('Semua');

const filteredItems = computed(() => {
    return items.value.filter((i) => {
        const matchSearch = i.name.toLowerCase().includes(search.value.toLowerCase());
        const matchCategory = activeCategory.value === 'Semua' || i.category === activeCategory.value;
        return matchSearch && matchCategory;
    });
});

/* === STATISTIK === */
const totalItems = computed(() => items.value.length);
const lowStock = computed(() => items.value.filter((i) => i.stock <= i.min_stock).length);
const totalCategories = computed(() => categories.value.filter((c) => c !== 'Semua').length);
const totalInventoryValue = computed(() => items.value.reduce((total, i) => total + i.stock * i.price, 0));

/* === MODAL TAMBAH === */
const showAdd = ref(false);
const newItem = ref({
    name: '',
    desc: '',
    category: '',
    stock: null,
    min_stock: null,
    unit: '',
    price: null,
    supplier: ''
});

const addItem = () => {
    const id = Date.now();
    items.value.push({ id, ...newItem.value, status: 'Aman' });
    newItem.value = { name: '', desc: '', category: '', stock: null, min_stock: null, unit: '', price: null, supplier: '' };
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
    const idx = items.value.findIndex((i) => i.id === editing.value.id);
    items.value[idx] = editing.value;
    showEdit.value = false;
};

/* === DELETE === */
const deleteItem = (id) => {
    items.value = items.value.filter((i) => i.id !== id);
};

/* === VIEW MODE === */
const viewMode = ref('table');
</script>

<template>
    <div class="page-wrap">
        <!-- HEADER -->
        <div class="header-row">
            <h2 class="page-title">Inventory Bahan Baku</h2>
            <Button label="Tambah Bahan" icon="pi pi-plus" size="small" @click="showAdd = true" />
        </div>

        <!-- STATISTIK -->
        <div class="stat-grid">
            <div class="stat-card">
                <p class="stat-label">Total Item</p>
                <p class="stat-value">{{ totalItems }}</p>
            </div>
            <div class="stat-card">
                <p class="stat-label">Stok Rendah</p>
                <p class="stat-value stat-red">{{ lowStock }}</p>
            </div>
            <div class="stat-card">
                <p class="stat-label">Kategori</p>
                <p class="stat-value">{{ totalCategories }}</p>
            </div>
            <div class="stat-card">
                <p class="stat-label">Nilai Inventory</p>
                <p class="stat-value stat-green stat-value--sm">Rp {{ totalInventoryValue.toLocaleString('id-ID') }}</p>
            </div>
        </div>

        <!-- MAIN CARD -->
        <div class="main-card">
            <!-- FILTER BAR -->
            <div class="filter-bar">
                <InputText v-model="search" placeholder="Cari bahan..." class="search-input" />

                <div class="cat-buttons">
                    <Button v-for="c in categories" :key="c" :label="c" size="small" :severity="activeCategory === c ? 'primary' : 'secondary'" @click="activeCategory = c" />
                </div>

                <!-- View toggle -->
                <div class="view-toggle">
                    <button class="toggle-btn" :class="{ active: viewMode === 'table' }" @click="viewMode = 'table'" title="Tabel"><i class="pi pi-list" /></button>
                    <button class="toggle-btn" :class="{ active: viewMode === 'card' }" @click="viewMode = 'card'" title="Kartu"><i class="pi pi-th-large" /></button>
                </div>
            </div>

            <!-- TABLE VIEW -->
            <div v-if="viewMode === 'table'" class="table-wrap">
                <table class="inv-table">
                    <thead>
                        <tr>
                            <th>Nama Bahan</th>
                            <th class="hide-sm">Kategori</th>
                            <th>Stok</th>
                            <th class="hide-md">Satuan</th>
                            <th class="hide-md">Harga Beli</th>
                            <th class="hide-lg">Supplier</th>
                            <th class="hide-sm">Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="i in filteredItems" :key="i.id" class="inv-row">
                            <td class="p-3">
                                <p class="row-name">{{ i.name }}</p>
                                <p class="row-desc">{{ i.desc }}</p>
                                <!-- mobile extras -->
                                <div class="mobile-meta">
                                    <Tag :value="i.category" severity="info" />
                                    <Tag :value="i.status" :severity="i.status === 'Aman' ? 'success' : 'danger'" />
                                </div>
                                <div class="mobile-price">Rp {{ Number(i.price).toLocaleString('id-ID') }} / {{ i.unit }}</div>
                            </td>
                            <td class="p-3 hide-sm">
                                <Tag :value="i.category" severity="info" />
                            </td>
                            <td class="p-3">
                                <span class="stock-val">{{ i.stock }}</span>
                                <span class="stock-min">Min: {{ i.min_stock }}</span>
                            </td>
                            <td class="p-3 hide-md">{{ i.unit }}</td>
                            <td class="p-3 hide-md price-cell">Rp {{ Number(i.price).toLocaleString('id-ID') }}</td>
                            <td class="p-3 hide-lg">{{ i.supplier }}</td>
                            <td class="p-3 hide-sm">
                                <Tag :value="i.status" :severity="i.status === 'Aman' ? 'success' : 'danger'" />
                            </td>
                            <td class="p-3">
                                <div class="action-btns">
                                    <Button label="Edit" size="small" severity="info" @click="openEdit(i)" />
                                    <Button label="Hapus" size="small" severity="danger" @click="deleteItem(i.id)" />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div v-if="filteredItems.length === 0" class="empty-state">
                    <i class="pi pi-inbox" style="font-size: 2rem; display: block; margin-bottom: 0.5rem" />
                    Tidak ada data ditemukan.
                </div>
            </div>

            <!-- CARD VIEW -->
            <div v-else class="card-grid">
                <div v-for="i in filteredItems" :key="i.id" class="inv-card">
                    <div class="inv-card__header">
                        <div>
                            <p class="inv-card__name">{{ i.name }}</p>
                            <p class="inv-card__desc">{{ i.desc }}</p>
                        </div>
                        <Tag :value="i.status" :severity="i.status === 'Aman' ? 'success' : 'danger'" />
                    </div>

                    <div class="inv-card__body">
                        <div class="inv-card__row">
                            <span class="inv-card__label">Kategori</span>
                            <Tag :value="i.category" severity="info" />
                        </div>
                        <div class="inv-card__row">
                            <span class="inv-card__label">Stok</span>
                            <span
                                >{{ i.stock }} {{ i.unit }} <small class="text-muted">/ Min {{ i.min_stock }}</small></span
                            >
                        </div>
                        <div class="inv-card__row">
                            <span class="inv-card__label">Harga</span>
                            <span class="price-cell">Rp {{ Number(i.price).toLocaleString('id-ID') }}</span>
                        </div>
                        <div class="inv-card__row">
                            <span class="inv-card__label">Supplier</span>
                            <span>{{ i.supplier }}</span>
                        </div>
                    </div>

                    <div class="action-btns" style="padding: 0.75rem">
                        <Button label="Edit" size="small" severity="info" style="flex: 1" @click="openEdit(i)" />
                        <Button label="Hapus" size="small" severity="danger" style="flex: 1" @click="deleteItem(i.id)" />
                    </div>
                </div>

                <div v-if="filteredItems.length === 0" class="empty-state" style="grid-column: 1/-1">
                    <i class="pi pi-inbox" style="font-size: 2rem; display: block; margin-bottom: 0.5rem" />
                    Tidak ada data ditemukan.
                </div>
            </div>
        </div>

        <!-- MODAL TAMBAH -->
        <Dialog v-model:visible="showAdd" modal header="Tambah Bahan Baku" :style="{ width: '95vw', maxWidth: '520px' }">
            <div class="modal-form">
                <InputText v-model="newItem.name" placeholder="Nama Bahan" />
                <InputText v-model="newItem.desc" placeholder="Deskripsi" />
                <Dropdown v-model="newItem.category" :options="categories.filter((c) => c !== 'Semua')" placeholder="Kategori" />
                <div class="form-row-2">
                    <InputText v-model="newItem.stock" type="number" placeholder="Stok" />
                    <InputText v-model="newItem.min_stock" type="number" placeholder="Minimal Stok" />
                </div>
                <div class="form-row-2">
                    <InputText v-model="newItem.unit" placeholder="Satuan (Kg, dll)" />
                    <InputText v-model="newItem.price" type="number" placeholder="Harga Beli" />
                </div>
                <InputText v-model="newItem.supplier" placeholder="Supplier" />
                <Button label="Simpan" class="w-full" style="width: 100%" @click="addItem" />
            </div>
        </Dialog>

        <!-- MODAL EDIT -->
        <Dialog v-model:visible="showEdit" modal header="Edit Bahan Baku" :style="{ width: '95vw', maxWidth: '520px' }">
            <div v-if="editing" class="modal-form">
                <InputText v-model="editing.name" placeholder="Nama Bahan" />
                <InputText v-model="editing.desc" placeholder="Deskripsi" />
                <Dropdown v-model="editing.category" :options="categories.filter((c) => c !== 'Semua')" placeholder="Kategori" />
                <div class="form-row-2">
                    <InputText v-model="editing.stock" type="number" placeholder="Stok" />
                    <InputText v-model="editing.min_stock" type="number" placeholder="Minimal Stok" />
                </div>
                <div class="form-row-2">
                    <InputText v-model="editing.unit" placeholder="Satuan" />
                    <InputText v-model="editing.price" type="number" placeholder="Harga Beli" />
                </div>
                <InputText v-model="editing.supplier" placeholder="Supplier" />
                <Button label="Simpan Perubahan" style="width: 100%" @click="saveEdit" />
            </div>
        </Dialog>
    </div>
</template>

<style scoped>
/* ===== LAYOUT ===== */
.page-wrap {
    padding: 1rem;
    width: 100%;
    color: #111827;
}
@media (min-width: 640px) {
    .page-wrap {
        padding: 1.5rem;
    }
}

.header-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
}
.page-title {
    font-size: 1.35rem;
    font-weight: 600;
}

/* ===== STAT GRID ===== */
.stat-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    margin-bottom: 1.25rem;
}
@media (min-width: 768px) {
    .stat-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}

.stat-card {
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    background: #fff;
    border: 1px solid #e5e7eb;
}
.dark .stat-card {
    background: #1f2937;
    border-color: #374151;
}
.stat-label {
    font-size: 0.8rem;
    color: #6b7280;
    margin-bottom: 0.25rem;
}
.stat-value {
    font-size: 1.75rem;
    font-weight: 600;
    line-height: 1.2;
}
.stat-value--sm {
    font-size: 1.15rem;
}
.stat-red {
    color: #ef4444;
}
.stat-green {
    color: #16a34a;
}

/* ===== MAIN CARD ===== */
.main-card {
    border-radius: 0.75rem;
    padding: 1rem;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    background: #fff;
    border: 1px solid #e5e7eb;
}
@media (min-width: 640px) {
    .main-card {
        padding: 1.25rem;
    }
}
.dark .main-card {
    background: #1f2937;
    border-color: #374151;
}

/* ===== FILTER BAR ===== */
.filter-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 1rem;
}
.search-input {
    width: 100%;
    max-width: 220px;
}
.cat-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    flex: 1;
}

/* ===== VIEW TOGGLE ===== */
.view-toggle {
    display: flex;
    gap: 0.25rem;
    margin-left: auto;
}
.toggle-btn {
    padding: 0.35rem 0.6rem;
    border-radius: 0.4rem;
    border: 1px solid #d1d5db;
    background: #fff;
    color: #6b7280;
    cursor: pointer;
    font-size: 0.85rem;
    transition:
        background 0.15s,
        color 0.15s;
}
.toggle-btn.active {
    background: #2563eb;
    color: #fff;
    border-color: #2563eb;
}
.dark .toggle-btn {
    background: #374151;
    border-color: #4b5563;
    color: #d1d5db;
}
.dark .toggle-btn.active {
    background: #2563eb;
    border-color: #2563eb;
    color: #fff;
}

/* ===== TABLE ===== */
.table-wrap {
    overflow-x: auto;
}

.inv-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
    min-width: 360px;
}
.inv-table thead tr {
    background: #f3f4f6;
}
.dark .inv-table thead tr {
    background: #374151;
}
.inv-table th {
    padding: 0.65rem 0.75rem;
    text-align: left;
    font-weight: 600;
    color: #374151;
    white-space: nowrap;
}
.dark .inv-table th {
    color: #e5e7eb;
}

.inv-row {
    border-bottom: 1px solid #e5e7eb;
    transition: background 0.1s;
}
.inv-row:hover {
    background: #f9fafb;
}
.dark .inv-row {
    border-color: #374151;
}
.dark .inv-row:hover {
    background: rgba(255, 255, 255, 0.04);
}

.inv-table td {
    padding: 0.65rem 0.75rem;
    vertical-align: middle;
}

.row-name {
    font-weight: 600;
}
.row-desc {
    font-size: 0.78rem;
    color: #6b7280;
}

.stock-val {
    font-weight: 600;
    display: block;
}
.stock-min {
    font-size: 0.72rem;
    color: #9ca3af;
}

.price-cell {
    color: #16a34a;
    font-weight: 600;
}

.action-btns {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
}

/* Mobile-only meta under name */
.mobile-meta {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
    margin-top: 0.35rem;
}
.mobile-price {
    font-size: 0.78rem;
    color: #16a34a;
    font-weight: 600;
    margin-top: 0.2rem;
}

/* Responsive column hiding */
@media (min-width: 640px) {
    .mobile-meta,
    .mobile-price {
        display: none;
    }
}
.hide-sm {
    display: none;
}
.hide-md {
    display: none;
}
.hide-lg {
    display: none;
}

@media (min-width: 640px) {
    .hide-sm {
        display: table-cell;
    }
}
@media (min-width: 768px) {
    .hide-md {
        display: table-cell;
    }
}
@media (min-width: 1024px) {
    .hide-lg {
        display: table-cell;
    }
}

/* ===== CARD GRID ===== */
.card-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
}
@media (min-width: 480px) {
    .card-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
@media (min-width: 768px) {
    .card-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}
@media (min-width: 1280px) {
    .card-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}

.inv-card {
    border-radius: 0.6rem;
    border: 1px solid #e5e7eb;
    background: #f9fafb;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
.dark .inv-card {
    background: #374151;
    border-color: #4b5563;
}
.inv-card__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.75rem;
    border-bottom: 1px solid #e5e7eb;
}
.dark .inv-card__header {
    border-color: #4b5563;
}
.inv-card__name {
    font-weight: 600;
    font-size: 0.9rem;
}
.inv-card__desc {
    font-size: 0.75rem;
    color: #6b7280;
    margin-top: 0.15rem;
}
.inv-card__body {
    padding: 0.75rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}
.inv-card__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.82rem;
}
.inv-card__label {
    color: #6b7280;
}
.text-muted {
    color: #9ca3af;
}

/* ===== EMPTY STATE ===== */
.empty-state {
    text-align: center;
    padding: 2.5rem 1rem;
    color: #9ca3af;
}

/* ===== MODAL FORM ===== */
.modal-form {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
}
.form-row-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.65rem;
}

/* ===== DARK TEXT ===== */
.dark .page-wrap {
    color: #f3f4f6;
}
.dark .stat-label {
    color: #9ca3af;
}
.dark .row-desc {
    color: #9ca3af;
}
.dark .inv-card__desc {
    color: #9ca3af;
}
</style>
