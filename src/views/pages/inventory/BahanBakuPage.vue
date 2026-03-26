<script setup>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import SelectButton from 'primevue/selectbutton';
import Tag from 'primevue/tag';
import Textarea from 'primevue/textarea';
import { useToast } from 'primevue/usetoast';
import { computed, ref } from 'vue';

const toast = useToast();

/* === DATA BAHAN BAKU & SUPPLIER === */
const items = ref([
    {
        id: 1,
        name: 'Beras Premium',
        desc: 'Beras kualitas premium untuk nasi goreng',
        category: 'Bahan Pokok',
        stock: 45,
        min_stock: 50,
        unit: 'Kg',
        price: 12000,
        supplier: 'PT Beras Jaya',
        status: 'Aman'
    },
    {
        id: 2,
        name: 'Minyak Goreng',
        desc: 'Minyak goreng kelapa sawit',
        category: 'Bahan Pokok',
        stock: 120,
        min_stock: 30,
        unit: 'Liter',
        price: 15000,
        supplier: 'CV Maju Lancar',
        status: 'Aman'
    }
]);

const categories = ref(['Semua', 'Bahan Pokok', 'Protein', 'Bumbu', 'Minuman', 'Sayuran']);
const suppliers = ref(['PT Beras Jaya', 'CV Maju Lancar', 'Pasar Induk']);

/* === DATA STOCK LOG === */
const stockLogs = ref([
    { id: 101, itemId: 1, type: 'IN', qty: 50, date: '2026-03-20 08:00', note: 'Restock Mingguan', user: 'Admin' },
    { id: 102, itemId: 1, type: 'OUT', qty: 5, date: '2026-03-25 14:00', note: 'Beras basah/rusak', user: 'Ivano' }
]);

/* === FILTER === */
const search = ref('');
const activeCategory = ref('Semua');

const filteredItems = computed(() => {
    return items.value.filter((i) => {
        const matchSearch = i.name.toLowerCase().includes(search.value.toLowerCase()) || i.supplier.toLowerCase().includes(search.value.toLowerCase());
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
    toast.add({ severity: 'success', summary: 'Sukses', detail: 'Bahan baku berhasil ditambahkan', life: 2000 });
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
    toast.add({ severity: 'info', summary: 'Diperbarui', detail: 'Data bahan baku berhasil diubah', life: 2000 });
    showEdit.value = false;
};

/* === DELETE === */
const deleteItem = (id) => {
    items.value = items.value.filter((i) => i.id !== id);
    toast.add({ severity: 'warn', summary: 'Terhapus', detail: 'Bahan baku dihapus', life: 2000 });
};

/* === MODAL ADJUST STOK (IN/OUT) === */
const showAdjustModal = ref(false);
const selectedItemForAdjust = ref(null);
const adjustForm = ref({ type: 'Masuk', qty: null, note: '' });
const adjustOptions = ref(['Masuk', 'Keluar']);

const openAdjustStock = (item) => {
    selectedItemForAdjust.value = item;
    adjustForm.value = { type: 'Masuk', qty: null, note: '' };
    showAdjustModal.value = true;
};

const saveAdjustStock = () => {
    if (!adjustForm.value.qty || adjustForm.value.qty <= 0) {
        return toast.add({ severity: 'error', summary: 'Error', detail: 'Kuantitas tidak valid!', life: 2000 });
    }

    const item = items.value.find((i) => i.id === selectedItemForAdjust.value.id);

    if (adjustForm.value.type === 'Keluar' && item.stock < adjustForm.value.qty) {
        return toast.add({ severity: 'error', summary: 'Error', detail: 'Stok tidak cukup untuk dikeluarkan!', life: 2000 });
    }

    if (adjustForm.value.type === 'Masuk') item.stock += adjustForm.value.qty;
    else item.stock -= adjustForm.value.qty;

    stockLogs.value.unshift({
        id: Date.now(),
        itemId: item.id,
        type: adjustForm.value.type === 'Masuk' ? 'IN' : 'OUT',
        qty: adjustForm.value.qty,
        date: new Date().toLocaleString('id-ID'),
        note: adjustForm.value.note || 'Penyesuaian Manual',
        user: 'Admin'
    });

    toast.add({ severity: 'success', summary: 'Berhasil', detail: `Stok ${item.name} disesuaikan.`, life: 2000 });
    showAdjustModal.value = false;
};

/* === MODAL RIWAYAT STOK (LOG) === */
const showLogModal = ref(false);
const selectedItemForLog = ref(null);
const itemLogs = computed(() => {
    if (!selectedItemForLog.value) return [];
    return stockLogs.value.filter((log) => log.itemId === selectedItemForLog.value.id);
});

const openStockLog = (item) => {
    selectedItemForLog.value = item;
    showLogModal.value = true;
};

/* === VIEW MODE === */
const viewMode = ref('table');
</script>

<template>
    <div class="page-wrap">
        <div class="header-row">
            <h2 class="page-title">Inventory Bahan Baku</h2>
            <Button label="Tambah Bahan" icon="pi pi-plus" size="small" @click="showAdd = true" />
        </div>

        <div class="stat-grid">
            <div class="stat-card">
                <p class="stat-label">Total Item</p>
                <p class="stat-value">{{ totalItems }}</p>
            </div>
            <div class="stat-card" style="position: relative; overflow: hidden">
                <div v-if="lowStock > 0" class="alert-bar"></div>
                <p class="stat-label">Stok Rendah</p>
                <p class="stat-value stat-red">{{ lowStock }} Item</p>
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

        <div class="main-card">
            <div class="filter-bar">
                <InputText v-model="search" placeholder="Cari bahan/supplier..." class="search-input" />

                <div class="cat-buttons">
                    <Button v-for="c in categories" :key="c" :label="c" size="small" :severity="activeCategory === c ? 'primary' : 'secondary'" @click="activeCategory = c" />
                </div>

                <div class="view-toggle">
                    <button class="toggle-btn" :class="{ active: viewMode === 'table' }" @click="viewMode = 'table'" title="Tabel"><i class="pi pi-list" /></button>
                    <button class="toggle-btn" :class="{ active: viewMode === 'card' }" @click="viewMode = 'card'" title="Kartu"><i class="pi pi-th-large" /></button>
                </div>
            </div>

            <div v-if="viewMode === 'table'" class="table-wrap">
                <table class="inv-table">
                    <thead>
                        <tr>
                            <th>Nama Bahan</th>
                            <th class="hide-sm">Kategori</th>
                            <th>Stok Aktual</th>
                            <th class="hide-md">Harga Beli</th>
                            <th class="hide-lg">Supplier</th>
                            <th class="text-center">Manajemen</th>
                            <th class="text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="i in filteredItems" :key="i.id" class="inv-row">
                            <td class="p-3">
                                <p class="row-name">{{ i.name }}</p>
                                <p class="row-desc">{{ i.desc }}</p>
                                <div class="mobile-meta">
                                    <Tag :value="i.category" severity="info" />
                                    <Tag v-if="i.stock <= i.min_stock" severity="danger" value="Stok Menipis!" />
                                    <Tag v-else :value="i.status" :severity="i.status === 'Aman' ? 'success' : 'danger'" />
                                </div>
                                <div class="mobile-price">Rp {{ Number(i.price).toLocaleString('id-ID') }} / {{ i.unit }}</div>
                            </td>
                            <td class="p-3 hide-sm">
                                <Tag :value="i.category" severity="info" />
                            </td>
                            <td class="p-3">
                                <div class="stock-display">
                                    <span class="stock-val" :class="{ 'text-red-500': i.stock <= i.min_stock }">{{ i.stock }}</span>
                                    <span class="stock-unit">{{ i.unit }}</span>
                                </div>
                                <Tag v-if="i.stock <= i.min_stock" severity="danger" value="Stok Menipis!" class="mobile-alert-tag" />
                                <span v-else class="stock-min">Min: {{ i.min_stock }}</span>
                            </td>
                            <td class="p-3 hide-md price-cell">Rp {{ Number(i.price).toLocaleString('id-ID') }}</td>
                            <td class="p-3 hide-lg">
                                <span class="supplier-badge">{{ i.supplier }}</span>
                            </td>
                            <td class="p-3 text-center">
                                <div class="action-btns-center">
                                    <Button icon="pi pi-sort-alt" size="small" severity="success" outlined v-tooltip.top="'In/Out Stok'" @click="openAdjustStock(i)" />
                                    <Button icon="pi pi-history" size="small" severity="info" outlined v-tooltip.top="'Riwayat Stok'" @click="openStockLog(i)" />
                                </div>
                            </td>
                            <td class="p-3 text-center">
                                <div class="action-btns-center">
                                    <Button icon="pi pi-pencil" size="small" severity="secondary" text @click="openEdit(i)" />
                                    <Button icon="pi pi-trash" size="small" severity="danger" text @click="deleteItem(i.id)" />
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

            <div v-else class="card-grid">
                <div v-for="i in filteredItems" :key="i.id" class="inv-card">
                    <div class="inv-card__header">
                        <div style="flex: 1; min-width: 0; padding-right: 8px">
                            <p class="inv-card__name truncate">{{ i.name }}</p>
                            <p class="inv-card__desc truncate">{{ i.desc }}</p>
                        </div>
                        <Tag v-if="i.stock <= i.min_stock" severity="danger" value="Menipis" class="shrink-0" />
                        <Tag v-else :value="i.status" :severity="i.status === 'Aman' ? 'success' : 'danger'" class="shrink-0" />
                    </div>

                    <div class="inv-card__body">
                        <div class="inv-card__row">
                            <span class="inv-card__label">Kategori</span>
                            <Tag :value="i.category" severity="info" />
                        </div>
                        <div class="inv-card__row">
                            <span class="inv-card__label">Stok Aktual</span>
                            <span>
                                <b :class="{ 'text-red-500': i.stock <= i.min_stock }">{{ i.stock }}</b> {{ i.unit }}
                                <small class="text-muted">/ Min {{ i.min_stock }}</small>
                            </span>
                        </div>
                        <div class="inv-card__row">
                            <span class="inv-card__label">Harga Beli</span>
                            <span class="price-cell">Rp {{ Number(i.price).toLocaleString('id-ID') }}</span>
                        </div>
                        <div class="inv-card__row">
                            <span class="inv-card__label">Supplier</span>
                            <span style="font-size: 0.8rem; text-align: right; word-break: break-word">{{ i.supplier }}</span>
                        </div>
                    </div>

                    <div class="inv-card__footer">
                        <div style="display: flex; gap: 0.4rem; flex: 1">
                            <Button label="Stok" icon="pi pi-sort-alt" size="small" severity="success" outlined @click="openAdjustStock(i)" class="flex-1 p-0" />
                            <Button label="Log" icon="pi pi-history" size="small" severity="info" outlined @click="openStockLog(i)" class="flex-1 p-0" />
                        </div>
                        <Button icon="pi pi-pencil" size="small" severity="secondary" text @click="openEdit(i)" />
                    </div>
                </div>

                <div v-if="filteredItems.length === 0" class="empty-state" style="grid-column: 1/-1">
                    <i class="pi pi-inbox" style="font-size: 2rem; display: block; margin-bottom: 0.5rem" />
                    Tidak ada data ditemukan.
                </div>
            </div>
        </div>

        <Dialog v-model:visible="showAdjustModal" modal :header="`Sesuaikan Stok: ${selectedItemForAdjust?.name}`" :style="{ width: '95vw', maxWidth: '400px' }">
            <div class="modal-form" style="margin-top: 0.5rem">
                <div class="stock-info-box">
                    <span class="text-muted" style="font-size: 0.9rem">Stok Saat Ini:</span>
                    <span style="font-weight: bold; font-size: 1.2rem">{{ selectedItemForAdjust?.stock }} {{ selectedItemForAdjust?.unit }}</span>
                </div>
                <div>
                    <label class="modal-label">Jenis Pergerakan</label>
                    <SelectButton v-model="adjustForm.type" :options="adjustOptions" class="w-full flex-select" />
                </div>
                <div>
                    <label class="modal-label">Jumlah ({{ selectedItemForAdjust?.unit }})</label>
                    <InputNumber v-model="adjustForm.qty" placeholder="Masukkan angka..." class="w-full" />
                </div>
                <div>
                    <label class="modal-label">Keterangan / Alasan</label>
                    <Textarea v-model="adjustForm.note" rows="2" placeholder="Misal: Barang datang, Kadaluarsa, Tumpah..." class="w-full" style="resize: vertical" />
                </div>
            </div>
            <template #footer>
                <Button label="Batal" outlined severity="secondary" @click="showAdjustModal = false" />
                <Button label="Simpan Stok" icon="pi pi-save" @click="saveAdjustStock" />
            </template>
        </Dialog>

        <Dialog v-model:visible="showLogModal" modal :header="`Riwayat Pergerakan: ${selectedItemForLog?.name}`" :style="{ width: '95vw', maxWidth: '500px' }">
            <div style="max-height: 60vh; overflow-y: auto; padding-right: 0.5rem">
                <div v-if="itemLogs.length === 0" class="empty-state">Belum ada riwayat pergerakan stok.</div>

                <div v-for="log in itemLogs" :key="log.id" class="log-timeline-item">
                    <div style="flex-shrink: 0; padding-top: 0.2rem">
                        <div class="log-icon" :style="`background-color: ${log.type === 'IN' ? '#22c55e' : '#ef4444'}`">
                            <i :class="log.type === 'IN' ? 'pi pi-arrow-down-left' : 'pi pi-arrow-up-right'" style="font-size: 0.9rem"></i>
                        </div>
                    </div>
                    <div style="flex: 1; min-width: 0">
                        <div class="log-header">
                            <div>
                                <span :style="`font-weight: bold; font-size: 1.1rem; color: ${log.type === 'IN' ? 'var(--green-500)' : 'var(--red-500)'}`"> {{ log.type === 'IN' ? '+' : '-' }}{{ log.qty }} </span>
                                <span style="font-size: 0.85rem; color: var(--text-color-secondary); margin-left: 0.3rem">{{ selectedItemForLog?.unit }}</span>
                            </div>
                            <span class="log-date">{{ log.date }}</span>
                        </div>
                        <p style="font-size: 0.9rem; color: var(--text-color); margin: 0.3rem 0; word-break: break-word">{{ log.note }}</p>
                        <p style="font-size: 0.7rem; color: var(--text-color-secondary); margin: 0">Dicatat oleh: {{ log.user }}</p>
                    </div>
                </div>
            </div>
        </Dialog>

        <Dialog v-model:visible="showAdd" modal header="Tambah Bahan Baku" :style="{ width: '95vw', maxWidth: '520px' }">
            <div class="modal-form">
                <InputText v-model="newItem.name" placeholder="Nama Bahan" class="w-full" />
                <InputText v-model="newItem.desc" placeholder="Deskripsi" class="w-full" />
                <Dropdown v-model="newItem.category" :options="categories.filter((c) => c !== 'Semua')" placeholder="Kategori" class="w-full" />
                <div class="form-row-2">
                    <InputNumber v-model="newItem.stock" placeholder="Stok Aktual" class="w-full" />
                    <InputNumber v-model="newItem.min_stock" placeholder="Minimal Stok" class="w-full" />
                </div>
                <div class="form-row-2">
                    <InputText v-model="newItem.unit" placeholder="Satuan (Kg, dll)" class="w-full" />
                    <InputNumber v-model="newItem.price" placeholder="Harga Beli (Rp)" class="w-full" />
                </div>
                <Dropdown v-model="newItem.supplier" :options="suppliers" editable placeholder="Pilih Supplier / Ketik Baru" class="w-full" />
            </div>
            <template #footer>
                <Button label="Simpan" class="w-full" @click="addItem" />
            </template>
        </Dialog>

        <Dialog v-model:visible="showEdit" modal header="Edit Bahan Baku" :style="{ width: '95vw', maxWidth: '520px' }">
            <div v-if="editing" class="modal-form">
                <InputText v-model="editing.name" placeholder="Nama Bahan" class="w-full" />
                <InputText v-model="editing.desc" placeholder="Deskripsi" class="w-full" />
                <Dropdown v-model="editing.category" :options="categories.filter((c) => c !== 'Semua')" placeholder="Kategori" class="w-full" />
                <div class="form-row-2">
                    <InputNumber v-model="editing.stock" placeholder="Stok Aktual" class="w-full" />
                    <InputNumber v-model="editing.min_stock" placeholder="Minimal Stok" class="w-full" />
                </div>
                <div class="form-row-2">
                    <InputText v-model="editing.unit" placeholder="Satuan" class="w-full" />
                    <InputNumber v-model="editing.price" placeholder="Harga Beli" class="w-full" />
                </div>
                <Dropdown v-model="editing.supplier" :options="suppliers" editable placeholder="Pilih Supplier / Ketik Baru" class="w-full" />
            </div>
            <template #footer>
                <Button label="Simpan Perubahan" class="w-full" @click="saveEdit" />
            </template>
        </Dialog>
    </div>
</template>

<style scoped>
/* ===== LAYOUT ===== */
.page-wrap {
    padding: 1rem;
    width: 100%;
    color: var(--text-color, #111827);
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

/* ===== STAT GRID (RESPONSIF) ===== */
.stat-grid {
    display: grid;
    grid-template-columns: 1fr; /* Mobile: 1 Kolom */
    gap: 0.75rem;
    margin-bottom: 1.25rem;
}
@media (min-width: 480px) {
    .stat-grid {
        grid-template-columns: repeat(2, 1fr);
    }
} /* Tablet Kecil: 2 Kolom */
@media (min-width: 1024px) {
    .stat-grid {
        grid-template-columns: repeat(4, 1fr);
    }
} /* Desktop: 4 Kolom */

.stat-card {
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    background: var(--surface-card, #fff);
    border: 1px solid var(--surface-border, #e5e7eb);
}
.stat-label {
    font-size: 0.8rem;
    color: var(--text-color-secondary, #6b7280);
    margin-bottom: 0.25rem;
}
.stat-value {
    font-size: 1.75rem;
    font-weight: 600;
    line-height: 1.2;
    color: var(--text-color, #111827);
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
.alert-bar {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 6px;
    background: #ef4444;
}

/* ===== MAIN CARD ===== */
.main-card {
    border-radius: 0.75rem;
    padding: 1rem;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    background: var(--surface-card, #fff);
    border: 1px solid var(--surface-border, #e5e7eb);
}
@media (min-width: 640px) {
    .main-card {
        padding: 1.25rem;
    }
}

/* ===== FILTER BAR (RESPONSIF) ===== */
.filter-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 1rem;
}
.search-input {
    width: 100%;
    max-width: 100%;
}
@media (min-width: 640px) {
    .search-input {
        max-width: 240px;
    }
}

.cat-buttons {
    display: flex;
    flex-wrap: nowrap; /* Mobile: Horizontal scroll */
    gap: 0.4rem;
    flex: 1;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding-bottom: 2px;
}
.cat-buttons::-webkit-scrollbar {
    display: none;
}
@media (min-width: 640px) {
    .cat-buttons {
        flex-wrap: wrap;
        overflow-x: visible;
    }
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
    border: 1px solid var(--surface-border, #d1d5db);
    background: var(--surface-card, #fff);
    color: var(--text-color-secondary, #6b7280);
    cursor: pointer;
    font-size: 0.85rem;
    transition:
        background 0.15s,
        color 0.15s;
}
.toggle-btn.active {
    background: var(--primary-color, #2563eb);
    color: var(--primary-color-text, #fff);
    border-color: var(--primary-color, #2563eb);
}
.layout-theme-dark .toggle-btn.active {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: var(--primary-color-text);
}

/* ===== TABLE ===== */
.table-wrap {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}
.inv-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
    min-width: 600px;
}
.inv-table thead tr {
    background: var(--surface-ground, #f3f4f6);
}
.inv-table th {
    padding: 0.65rem 0.75rem;
    text-align: left;
    font-weight: 600;
    color: var(--text-color, #374151);
    white-space: nowrap;
}
.inv-row {
    border-bottom: 1px solid var(--surface-border, #e5e7eb);
    transition: background 0.1s;
}
.inv-row:hover {
    background: var(--surface-hover, #f9fafb);
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
    color: var(--text-color-secondary, #6b7280);
}

.stock-display {
    display: flex;
    align-items: center;
    gap: 6px;
}
.stock-val {
    font-weight: 600;
}
.stock-unit {
    font-size: 0.8rem;
    color: var(--text-color-secondary);
}
.stock-min {
    font-size: 0.72rem;
    color: var(--text-color-secondary, #9ca3af);
    display: block;
    margin-top: 2px;
}
.price-cell {
    color: #16a34a;
    font-weight: 600;
}

.text-red-500 {
    color: #ef4444 !important;
}
.mobile-alert-tag {
    font-size: 0.6rem;
    padding: 0.1rem 0.3rem;
    margin-top: 4px;
}
.supplier-badge {
    background: var(--surface-100);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.8rem;
    border: 1px solid var(--surface-border);
}
.action-btns-center {
    display: flex;
    justify-content: center;
    gap: 0.4rem;
    flex-wrap: nowrap;
}

/* Mobile Table Elements */
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
@media (min-width: 640px) {
    .mobile-meta,
    .mobile-price {
        display: none;
    }
}

.hide-sm,
.hide-md,
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
    border: 1px solid var(--surface-border, #e5e7eb);
    background: var(--surface-ground, #f9fafb);
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
.inv-card__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.75rem;
    border-bottom: 1px solid var(--surface-border, #e5e7eb);
}
.inv-card__name {
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--text-color);
}
.inv-card__desc {
    font-size: 0.75rem;
    color: var(--text-color-secondary, #6b7280);
    margin-top: 0.15rem;
}
.truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.shrink-0 {
    flex-shrink: 0;
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
    color: var(--text-color);
    gap: 0.5rem;
}
.inv-card__label {
    color: var(--text-color-secondary, #6b7280);
    flex-shrink: 0;
}
.inv-card__footer {
    padding: 0.75rem;
    border-top: 1px solid var(--surface-border);
    display: flex;
    gap: 0.4rem;
    justify-content: space-between;
    align-items: center;
}
.text-muted {
    color: var(--text-color-secondary, #9ca3af);
}

/* ===== MODAL FORMS (RESPONSIF) ===== */
.modal-form {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    padding-top: 0.5rem;
}
.form-row-2 {
    display: grid;
    grid-template-columns: 1fr; /* Mobile: 1 kolom */
    gap: 0.85rem;
}
@media (min-width: 640px) {
    .form-row-2 {
        grid-template-columns: 1fr 1fr;
    }
} /* Desktop: 2 kolom */

.modal-label {
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: 0.4rem;
    display: block;
    color: var(--text-color);
}
.stock-info-box {
    background: var(--surface-100);
    padding: 1rem;
    border-radius: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid var(--surface-border);
}

/* ===== TIMELINE LOG ===== */
.log-timeline-item {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--surface-border);
    padding-bottom: 1rem;
}
.log-icon {
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
}
.log-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 0.2rem;
}
.log-date {
    font-size: 0.75rem;
    color: var(--text-color-secondary);
}

.empty-state {
    text-align: center;
    padding: 2.5rem 1rem;
    color: var(--text-color-secondary, #9ca3af);
}

/* Override SelectButton PrimeVue agar menyebar rata */
:deep(.p-selectbutton) {
    display: flex;
    width: 100%;
}
:deep(.p-selectbutton .p-button) {
    flex: 1;
    justify-content: center;
    padding: 0.6rem;
}
.w-full {
    width: 100%;
}
</style>
