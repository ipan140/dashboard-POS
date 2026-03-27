<script setup>
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';
import { useToast } from 'primevue/usetoast';
import { computed, ref } from 'vue';

const toast = useToast();

/* === DATA === */
const suppliers = ref([
    { id: 1, name: 'PT Beras Jaya', contact: '+62811234567', address: 'Jl. Raya Bogor No. 12, Jakarta', status: 'Aktif', category: 'Bahan Pokok' },
    { id: 2, name: 'CV Maju Lancar', contact: '+62822345678', address: 'Jl. Industri No. 5, Bekasi', status: 'Aktif', category: 'Minyak & Lemak' },
    { id: 3, name: 'Pasar Induk', contact: '+62833456789', address: 'Pasar Induk Kramat Jati, Jakarta Timur', status: 'Aktif', category: 'Sayuran & Buah' },
    { id: 4, name: 'UD Bumbu Nusantara', contact: '+62844567890', address: 'Jl. Bumbu Raya No. 7, Surabaya', status: 'Tidak Aktif', category: 'Bumbu & Rempah' },
    { id: 5, name: 'PT Protein Prima', contact: '+62855678901', address: 'Jl. Daging Segar No. 3, Bandung', status: 'Aktif', category: 'Protein' }
]);

const categoryOptions = [
    { label: 'Bahan Pokok', value: 'Bahan Pokok' },
    { label: 'Minyak & Lemak', value: 'Minyak & Lemak' },
    { label: 'Sayuran & Buah', value: 'Sayuran & Buah' },
    { label: 'Bumbu & Rempah', value: 'Bumbu & Rempah' },
    { label: 'Protein', value: 'Protein' },
    { label: 'Minuman', value: 'Minuman' },
    { label: 'Lainnya', value: 'Lainnya' }
];

const statusOptions = [
    { label: 'Aktif', value: 'Aktif' },
    { label: 'Tidak Aktif', value: 'Tidak Aktif' }
];

/* === STATE === */
const showAdd = ref(false);
const showEdit = ref(false);
const showDetail = ref(false);
const search = ref('');
const newSupplier = ref({ name: '', contact: '', address: '', category: null, status: 'Aktif' });
const editing = ref(null);
const selectedSupplier = ref(null);
const errorMsg = ref('');

/* === FILTER === */
const filteredSuppliers = computed(() => {
    if (!search.value) return suppliers.value;
    const q = search.value.toLowerCase();
    return suppliers.value.filter((s) => s.name.toLowerCase().includes(q) || s.contact.toLowerCase().includes(q) || s.category.toLowerCase().includes(q) || s.address.toLowerCase().includes(q));
});

/* === STAT === */
const totalSuppliers = computed(() => suppliers.value.length);
const activeSuppliers = computed(() => suppliers.value.filter((s) => s.status === 'Aktif').length);
const inactiveSuppliers = computed(() => suppliers.value.filter((s) => s.status !== 'Aktif').length);

/* === ADD === */
const openAdd = () => {
    newSupplier.value = { name: '', contact: '', address: '', category: null, status: 'Aktif' };
    errorMsg.value = '';
    showAdd.value = true;
};

const addSupplier = () => {
    if (!newSupplier.value.name.trim()) {
        errorMsg.value = 'Nama supplier tidak boleh kosong.';
        return;
    }
    if (suppliers.value.some((s) => s.name === newSupplier.value.name.trim())) {
        errorMsg.value = 'Supplier sudah terdaftar.';
        return;
    }
    suppliers.value.push({ id: Date.now(), ...newSupplier.value, name: newSupplier.value.name.trim() });
    toast.add({ severity: 'success', summary: 'Ditambahkan', detail: `${newSupplier.value.name} berhasil ditambahkan`, life: 2000 });
    showAdd.value = false;
};

/* === EDIT === */
const openEdit = (s) => {
    editing.value = { ...s };
    errorMsg.value = '';
    showEdit.value = true;
};

const saveEdit = () => {
    if (!editing.value.name.trim()) {
        errorMsg.value = 'Nama tidak boleh kosong.';
        return;
    }
    const idx = suppliers.value.findIndex((s) => s.id === editing.value.id);
    suppliers.value[idx] = { ...editing.value };
    toast.add({ severity: 'info', summary: 'Diperbarui', detail: 'Data supplier diperbarui', life: 2000 });
    showEdit.value = false;
};

/* === DETAIL === */
const openDetail = (s) => {
    selectedSupplier.value = s;
    showDetail.value = true;
};

/* === DELETE === */
const deleteSupplier = (id) => {
    const name = suppliers.value.find((s) => s.id === id)?.name;
    suppliers.value = suppliers.value.filter((s) => s.id !== id);
    toast.add({ severity: 'warn', summary: 'Dihapus', detail: `${name} dihapus`, life: 2000 });
};

/* === TOGGLE STATUS === */
const toggleStatus = (s) => {
    s.status = s.status === 'Aktif' ? 'Tidak Aktif' : 'Aktif';
    toast.add({ severity: 'info', summary: 'Status diubah', detail: `${s.name} → ${s.status}`, life: 2000 });
};

/* === HELPERS === */
const getStatusSeverity = (status) => (status === 'Aktif' ? 'success' : 'danger');
const getInitial = (name) => name?.charAt(0).toUpperCase() ?? '-';
</script>

<template>
    <div class="supplier-wrap">
        <!-- HEADER -->
        <div class="page-header">
            <div class="page-header__text">
                <h2 class="page-title">
                    <i class="pi pi-truck" />
                    Manajemen Supplier
                </h2>
                <p class="page-sub">Kelola data supplier bahan baku</p>
            </div>
            <Button label="Tambah Supplier" icon="pi pi-plus" size="small" @click="openAdd" class="add-btn" />
        </div>

        <!-- STAT — selalu 3 kolom di semua ukuran layar -->
        <div class="stat-grid">
            <div class="stat-card">
                <div class="stat-icon stat-icon--blue"><i class="pi pi-users" /></div>
                <div>
                    <p class="stat-label">Total Supplier</p>
                    <p class="stat-value">{{ totalSuppliers }}</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon stat-icon--green"><i class="pi pi-check-circle" /></div>
                <div>
                    <p class="stat-label">Aktif</p>
                    <p class="stat-value stat-green">{{ activeSuppliers }}</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon stat-icon--red"><i class="pi pi-times-circle" /></div>
                <div>
                    <p class="stat-label">Tidak Aktif</p>
                    <p class="stat-value stat-red">{{ inactiveSuppliers }}</p>
                </div>
            </div>
        </div>

        <!-- MOBILE LIST (≤ 640px) -->
        <div class="mobile-list">
            <div class="mobile-search">
                <i class="pi pi-search" />
                <input v-model="search" placeholder="Cari supplier..." class="mobile-search-input" />
            </div>

            <div v-if="filteredSuppliers.length === 0" class="empty-state">
                <i class="pi pi-inbox" />
                <span>Tidak ada data supplier ditemukan.</span>
            </div>

            <div v-for="s in filteredSuppliers" :key="s.id" class="mobile-card">
                <div class="mobile-card__top">
                    <div class="avatar">{{ getInitial(s.name) }}</div>
                    <div class="mobile-card__info">
                        <p class="supplier-name">{{ s.name }}</p>
                        <span class="cat-badge">{{ s.category }}</span>
                    </div>
                    <Tag :value="s.status" :severity="getStatusSeverity(s.status)" class="mobile-tag" @click="toggleStatus(s)" style="cursor: pointer; font-size: 0.7rem" />
                </div>
                <div class="mobile-card__body">
                    <div class="mobile-card__row">
                        <i class="pi pi-phone" />
                        <span>{{ s.contact }}</span>
                    </div>
                    <div class="mobile-card__row">
                        <i class="pi pi-map-marker" />
                        <span>{{ s.address }}</span>
                    </div>
                </div>
                <div class="mobile-card__actions">
                    <Button icon="pi pi-eye" size="small" severity="info" text @click="openDetail(s)" />
                    <Button icon="pi pi-pencil" size="small" severity="secondary" text @click="openEdit(s)" />
                    <Button icon="pi pi-trash" size="small" severity="danger" text @click="deleteSupplier(s.id)" />
                </div>
            </div>
        </div>

        <!-- DESKTOP TABLE (> 640px) -->
        <div class="main-card desktop-table">
            <DataTable
                :value="filteredSuppliers"
                :paginator="true"
                :rows="10"
                :rowsPerPageOptions="[5, 10, 20]"
                dataKey="id"
                stripedRows
                removableSort
                responsiveLayout="scroll"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                class="p-datatable-sm"
            >
                <template #header>
                    <div class="table-toolbar">
                        <span class="p-input-icon-left search-wrap">
                            <i class="pi pi-search" />
                            <InputText v-model="search" placeholder="Cari supplier..." class="search-input" />
                        </span>
                    </div>
                </template>

                <template #empty>
                    <div class="empty-state">
                        <i class="pi pi-inbox" style="font-size: 2rem; display: block; margin-bottom: 0.5rem" />
                        Tidak ada data supplier ditemukan.
                    </div>
                </template>

                <Column field="name" header="Supplier" sortable style="min-width: 180px">
                    <template #body="{ data }">
                        <div class="supplier-cell">
                            <div class="avatar">{{ getInitial(data.name) }}</div>
                            <div>
                                <p class="supplier-name">{{ data.name }}</p>
                                <p class="supplier-contact-sub">{{ data.contact }}</p>
                            </div>
                        </div>
                    </template>
                </Column>

                <Column field="category" header="Kategori" sortable style="min-width: 140px">
                    <template #body="{ data }">
                        <span class="cat-badge">{{ data.category }}</span>
                    </template>
                </Column>

                <!-- Kontak: hanya muncul ≥ 900px -->
                <Column field="contact" header="Kontak" style="min-width: 140px" class="col-lg">
                    <template #body="{ data }">
                        <span class="muted-text">{{ data.contact }}</span>
                    </template>
                </Column>

                <!-- Alamat: hanya muncul ≥ 1100px -->
                <Column field="address" header="Alamat" style="min-width: 200px" class="col-xl">
                    <template #body="{ data }">
                        <span class="address-text">{{ data.address }}</span>
                    </template>
                </Column>

                <Column field="status" header="Status" sortable style="min-width: 110px; text-align: center">
                    <template #body="{ data }">
                        <Tag :value="data.status" :severity="getStatusSeverity(data.status)" style="cursor: pointer; font-size: 0.75rem" v-tooltip.top="'Klik untuk ubah status'" @click="toggleStatus(data)" />
                    </template>
                </Column>

                <Column header="Aksi" style="min-width: 110px; text-align: center">
                    <template #body="{ data }">
                        <div class="action-group">
                            <Button icon="pi pi-eye" size="small" severity="info" text v-tooltip.top="'Detail'" @click="openDetail(data)" />
                            <Button icon="pi pi-pencil" size="small" severity="secondary" text v-tooltip.top="'Edit'" @click="openEdit(data)" />
                            <Button icon="pi pi-trash" size="small" severity="danger" text v-tooltip.top="'Hapus'" @click="deleteSupplier(data.id)" />
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>

        <!-- ===== MODAL DETAIL ===== -->
        <Dialog v-model:visible="showDetail" modal header="Detail Supplier" :style="{ width: '90vw', maxWidth: '420px' }">
            <div v-if="selectedSupplier" class="detail-body">
                <div class="detail-top">
                    <div class="avatar avatar--lg">{{ getInitial(selectedSupplier.name) }}</div>
                    <div>
                        <p class="supplier-name" style="font-size: 1.05rem">{{ selectedSupplier.name }}</p>
                        <Tag :value="selectedSupplier.status" :severity="getStatusSeverity(selectedSupplier.status)" />
                    </div>
                </div>
                <div class="detail-divider" />
                <div class="detail-rows">
                    <div class="detail-row">
                        <span class="detail-label"><i class="pi pi-tag" /> Kategori</span>
                        <span class="cat-badge">{{ selectedSupplier.category }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label"><i class="pi pi-phone" /> Kontak</span>
                        <span>{{ selectedSupplier.contact }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label"><i class="pi pi-map-marker" /> Alamat</span>
                        <span style="text-align: right; max-width: 60%">{{ selectedSupplier.address }}</span>
                    </div>
                </div>
            </div>
            <template #footer>
                <Button label="Tutup" severity="secondary" outlined size="small" @click="showDetail = false" />
                <Button
                    label="Edit"
                    icon="pi pi-pencil"
                    size="small"
                    @click="
                        () => {
                            showDetail = false;
                            openEdit(selectedSupplier);
                        }
                    "
                />
            </template>
        </Dialog>

        <!-- ===== MODAL TAMBAH ===== -->
        <Dialog v-model:visible="showAdd" modal header="Tambah Supplier" :style="{ width: '90vw', maxWidth: '420px' }" @hide="errorMsg = ''">
            <div class="modal-form">
                <div class="field">
                    <label class="field-label">Nama Supplier <span class="required">*</span></label>
                    <InputText v-model="newSupplier.name" placeholder="Contoh: PT Beras Jaya" class="w-full" @keyup.enter="addSupplier" />
                    <small v-if="errorMsg" class="error-msg">{{ errorMsg }}</small>
                </div>
                <div class="field">
                    <label class="field-label">Kategori</label>
                    <Dropdown v-model="newSupplier.category" :options="categoryOptions" optionLabel="label" optionValue="value" placeholder="Pilih kategori" class="w-full" />
                </div>
                <div class="field">
                    <label class="field-label">Kontak</label>
                    <InputText v-model="newSupplier.contact" placeholder="Nomor telepon / email" class="w-full" />
                </div>
                <div class="field">
                    <label class="field-label">Alamat</label>
                    <InputText v-model="newSupplier.address" placeholder="Alamat supplier" class="w-full" />
                </div>
                <div class="field">
                    <label class="field-label">Status</label>
                    <Dropdown v-model="newSupplier.status" :options="statusOptions" optionLabel="label" optionValue="value" class="w-full" />
                </div>
            </div>
            <template #footer>
                <div class="modal-footer">
                    <Button label="Batal" severity="secondary" outlined size="small" @click="showAdd = false" />
                    <Button label="Tambah" icon="pi pi-plus" size="small" @click="addSupplier" />
                </div>
            </template>
        </Dialog>

        <!-- ===== MODAL EDIT ===== -->
        <Dialog v-model:visible="showEdit" modal header="Edit Supplier" :style="{ width: '90vw', maxWidth: '420px' }" @hide="errorMsg = ''">
            <div v-if="editing" class="modal-form">
                <div class="field">
                    <label class="field-label">Nama Supplier <span class="required">*</span></label>
                    <InputText v-model="editing.name" class="w-full" @keyup.enter="saveEdit" />
                    <small v-if="errorMsg" class="error-msg">{{ errorMsg }}</small>
                </div>
                <div class="field">
                    <label class="field-label">Kategori</label>
                    <Dropdown v-model="editing.category" :options="categoryOptions" optionLabel="label" optionValue="value" class="w-full" />
                </div>
                <div class="field">
                    <label class="field-label">Kontak</label>
                    <InputText v-model="editing.contact" class="w-full" />
                </div>
                <div class="field">
                    <label class="field-label">Alamat</label>
                    <InputText v-model="editing.address" class="w-full" />
                </div>
                <div class="field">
                    <label class="field-label">Status</label>
                    <Dropdown v-model="editing.status" :options="statusOptions" optionLabel="label" optionValue="value" class="w-full" />
                </div>
            </div>
            <template #footer>
                <div class="modal-footer">
                    <Button label="Batal" severity="secondary" outlined size="small" @click="showEdit = false" />
                    <Button label="Simpan" icon="pi pi-save" size="small" @click="saveEdit" />
                </div>
            </template>
        </Dialog>
    </div>
</template>

<style scoped>
/* ============================================================
   BASE
   ============================================================ */
.supplier-wrap {
    padding: 1rem;
    width: 100%;
    box-sizing: border-box;
}

/* ============================================================
   HEADER
   ============================================================ */
.page-header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
}
.page-title {
    font-size: 1.15rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
}
.page-sub {
    font-size: 0.78rem;
    color: var(--text-color-secondary);
    margin: 0.15rem 0 0;
}
/* Tombol tambah tidak wrap, hanya teks yang diperpendek di xs */
.add-btn {
    white-space: nowrap;
    flex-shrink: 0;
}

/* ============================================================
   STAT GRID — SELALU 3 KOLOM
   Gunakan minmax kecil agar muat di layar paling sempit sekalipun
   ============================================================ */
.stat-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* ← kunci: selalu 3 kolom */
    gap: 0.6rem;
    margin-bottom: 1.25rem;
}
.stat-card {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.75rem 0.875rem;
    border-radius: 0.6rem;
    background: var(--surface-card);
    border: 1px solid var(--surface-border);
    min-width: 0; /* cegah overflow */
}
.stat-icon {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
}
.stat-icon--blue {
    background: #dbeafe;
    color: #1d4ed8;
}
.stat-icon--green {
    background: #dcfce7;
    color: #16a34a;
}
.stat-icon--red {
    background: #fee2e2;
    color: #dc2626;
}

/* Di layar ≤ 360px, sembunyikan ikon agar label & nilai tetap muat */
@media (max-width: 360px) {
    .stat-icon {
        display: none;
    }
}

.stat-label {
    font-size: 0.7rem;
    color: var(--text-color-secondary);
    margin: 0 0 0.1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.stat-value {
    font-size: 1.4rem;
    font-weight: 700;
    line-height: 1.1;
    margin: 0;
}
.stat-green {
    color: #16a34a;
}
.stat-red {
    color: #ef4444;
}

/* ============================================================
   MOBILE CARD LIST  (< 641px)
   ============================================================ */
.mobile-list {
    display: none;
}
.desktop-table {
    display: block;
}

@media (max-width: 640px) {
    .mobile-list {
        display: block;
    }
    .desktop-table {
        display: none !important;
    }
}

/* Search mobile */
.mobile-search {
    position: relative;
    margin-bottom: 0.75rem;
}
.mobile-search i {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-color-secondary);
    font-size: 0.85rem;
}
.mobile-search-input {
    width: 100%;
    padding: 0.55rem 0.75rem 0.55rem 2.25rem;
    border-radius: 0.5rem;
    border: 1px solid var(--surface-border);
    background: var(--surface-card);
    color: var(--text-color);
    font-size: 0.875rem;
    box-sizing: border-box;
    outline: none;
}
.mobile-search-input:focus {
    border-color: var(--primary-color, #3b82f6);
}

/* Card */
.mobile-card {
    background: var(--surface-card);
    border: 1px solid var(--surface-border);
    border-radius: 0.625rem;
    padding: 0.875rem;
    margin-bottom: 0.625rem;
}
.mobile-card__top {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 0.6rem;
}
.mobile-card__info {
    flex: 1;
    min-width: 0;
}
.mobile-card__info .supplier-name {
    margin: 0 0 0.25rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.mobile-card__body {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    margin-bottom: 0.6rem;
    padding: 0.5rem 0.625rem;
    background: var(--surface-ground, rgba(0, 0, 0, 0.03));
    border-radius: 0.375rem;
}
.mobile-card__row {
    display: flex;
    align-items: flex-start;
    gap: 0.45rem;
    font-size: 0.8rem;
    color: var(--text-color-secondary);
    line-height: 1.4;
}
.mobile-card__row i {
    margin-top: 0.15rem;
    flex-shrink: 0;
    font-size: 0.75rem;
}
.mobile-card__actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.25rem;
    border-top: 1px solid var(--surface-border);
    padding-top: 0.5rem;
    margin-top: 0.25rem;
}

/* ============================================================
   DESKTOP TABLE
   ============================================================ */
.main-card {
    border-radius: 0.75rem;
    background: var(--surface-card);
    border: 1px solid var(--surface-border);
    overflow: hidden;
}
.table-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    flex-wrap: wrap;
}
.search-wrap {
    display: flex;
    align-items: center;
    position: relative;
}
.search-wrap i {
    position: absolute;
    left: 0.75rem;
    color: var(--text-color-secondary);
    font-size: 0.85rem;
    z-index: 1;
}
.search-input {
    padding-left: 2rem;
    width: 260px;
}

/* Kolom yang hanya tampil di layar lebar */
:deep(.col-lg) {
    display: none !important;
}
:deep(.col-xl) {
    display: none !important;
}

@media (min-width: 900px) {
    :deep(.col-lg) {
        display: table-cell !important;
    }
}
@media (min-width: 1100px) {
    :deep(.col-xl) {
        display: table-cell !important;
    }
}

/* ============================================================
   SHARED CELLS
   ============================================================ */
.supplier-cell {
    display: flex;
    align-items: center;
    gap: 0.6rem;
}
.avatar {
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 50%;
    background: var(--primary-100, #dbeafe);
    color: var(--primary-700, #1d4ed8);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.9rem;
    flex-shrink: 0;
}
.avatar--lg {
    width: 3rem;
    height: 3rem;
    font-size: 1.2rem;
}
.supplier-name {
    font-weight: 600;
    font-size: 0.9rem;
    margin: 0 0 0.1rem;
}
/* Nomor kontak kecil di bawah nama, muncul saat kolom Kontak tidak ada */
.supplier-contact-sub {
    font-size: 0.72rem;
    color: var(--text-color-secondary);
    margin: 0;
}
@media (min-width: 900px) {
    .supplier-contact-sub {
        display: none;
    }
}

.cat-badge {
    background: var(--blue-50, #eff6ff);
    color: var(--blue-700, #1d4ed8);
    border: 1px solid var(--blue-200, #bfdbfe);
    padding: 2px 8px;
    border-radius: 99px;
    font-size: 0.72rem;
    font-weight: 500;
    white-space: nowrap;
    display: inline-block;
}
.muted-text {
    font-size: 0.85rem;
    color: var(--text-color-secondary);
}
.address-text {
    font-size: 0.82rem;
    color: var(--text-color-secondary);
    display: block;
    max-width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.action-group {
    display: flex;
    justify-content: center;
    gap: 0.2rem;
}

/* ============================================================
   DETAIL MODAL
   ============================================================ */
.detail-body {
    padding-top: 0.5rem;
}
.detail-top {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
}
.detail-divider {
    height: 1px;
    background: var(--surface-border);
    margin-bottom: 1rem;
}
.detail-rows {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}
.detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
}
.detail-label {
    color: var(--text-color-secondary);
    display: flex;
    align-items: center;
    gap: 0.4rem;
    flex-shrink: 0;
}

/* ============================================================
   MODAL FORM
   ============================================================ */
.modal-form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding-top: 0.5rem;
}
.field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}
.field-label {
    font-size: 0.85rem;
    font-weight: 600;
}
.required {
    color: #ef4444;
}
.error-msg {
    color: var(--red-500);
    font-size: 0.8rem;
}
.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
}

/* ============================================================
   MISC
   ============================================================ */
.w-full {
    width: 100%;
}
.empty-state {
    text-align: center;
    padding: 2.5rem 1rem;
    color: var(--text-color-secondary);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}
.empty-state i {
    font-size: 2rem;
}
</style>
