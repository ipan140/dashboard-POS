<script setup>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';

import { ref } from 'vue';

const categories = ref([{ name: 'Makanan' }, { name: 'Minuman' }]);

const showCategoryModal = ref(false);
const newCategory = ref('');
const errorMsg = ref('');

const addCategory = () => {
    if (!newCategory.value.trim()) {
        errorMsg.value = 'Nama kategori tidak boleh kosong.';
        return;
    }
    if (categories.value.some((c) => c.name === newCategory.value.trim())) {
        errorMsg.value = 'Kategori sudah ada.';
        return;
    }

    categories.value.push({ name: newCategory.value.trim() });
    newCategory.value = '';
    errorMsg.value = '';
    showCategoryModal.value = false;
};

const closeModal = () => {
    newCategory.value = '';
    errorMsg.value = '';
    showCategoryModal.value = false;
};

const deleteCategory = (name) => {
    categories.value = categories.value.filter((c) => c.name !== name);
};
</script>

<template>
    <div class="card">
        <!-- HEADER -->
        <div class="card-header">
            <h3 class="card-title">Kategori</h3>
            <Button label="Tambah Kategori" icon="pi pi-plus" size="small" @click="showCategoryModal = true" />
        </div>

        <!-- TABLE -->
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Nama Kategori</th>
                        <th class="col-center">Jumlah</th>
                        <th class="col-center">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="categories.length === 0">
                        <td colspan="3" class="empty-state">Belum ada kategori</td>
                    </tr>
                    <tr v-for="c in categories" :key="c.name">
                        <td>{{ c.name }}</td>
                        <td class="col-center">
                            <Tag :value="0" />
                        </td>
                        <td class="col-center">
                            <Button size="small" severity="danger" label="Hapus" @click="deleteCategory(c.name)" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- MODAL TAMBAH KATEGORI -->
    <Dialog v-model:visible="showCategoryModal" header="Tambah Kategori" modal :style="{ width: '90vw', maxWidth: '400px' }" @hide="closeModal">
        <div class="modal-body">
            <InputText v-model="newCategory" placeholder="Nama kategori" class="modal-input" @keyup.enter="addCategory" />
            <small v-if="errorMsg" class="error-msg">{{ errorMsg }}</small>
        </div>

        <template #footer>
            <div class="modal-footer">
                <Button label="Batal" severity="secondary" outlined size="small" @click="closeModal" />
                <Button label="Tambah" icon="pi pi-plus" size="small" @click="addCategory" />
            </div>
        </template>
    </Dialog>
</template>

<style scoped>
.card {
    background: var(--surface-card);
    border-radius: 8px;
    border: 1px solid var(--surface-border);
    overflow: hidden;
}

/* HEADER */
.card-header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--surface-border);
}

.card-title {
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
}

/* TABLE */
.table-wrapper {
    overflow-x: auto;
    width: 100%;
}

table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
    min-width: 300px;
}

th {
    text-align: left;
    padding: 0.625rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-color-secondary);
    border-bottom: 1px solid var(--surface-border);
    background: var(--surface-ground);
    white-space: nowrap;
}

td {
    padding: 0.625rem 0.75rem;
    border-bottom: 1px solid var(--surface-border);
    color: var(--text-color);
    vertical-align: middle;
}

tr:last-child td {
    border-bottom: none;
}

tr:hover td {
    background: var(--surface-hover);
}

.col-center {
    text-align: center;
}

.empty-state {
    text-align: center;
    padding: 2rem;
    color: var(--text-color-secondary);
    font-size: 0.875rem;
}

/* MODAL */
.modal-body {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem 0;
}

.modal-input {
    width: 100%;
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

/* RESPONSIVE */
@media (max-width: 640px) {
    .card-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .card-header :deep(.p-button) {
        width: 100%;
        justify-content: center;
    }

    th,
    td {
        padding: 0.5rem;
        font-size: 0.8rem;
    }
}
</style>
