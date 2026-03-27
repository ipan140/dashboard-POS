<script setup>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Divider from 'primevue/divider';
import InputText from 'primevue/inputtext';
import Paginator from 'primevue/paginator';
import Tag from 'primevue/tag';

import { computed, ref } from 'vue';

const logs = ref([
    { id: 1, timestamp: '2025-11-09 10:21', user: 'Admin', action: 'CREATE', module: 'Produk', description: 'Menambahkan produk Nasi Goreng', ip: '192.168.1.10' },
    { id: 2, timestamp: '2025-11-09 11:00', user: 'Kasir', action: 'UPDATE', module: 'Transaksi', description: 'Update status transaksi #12', ip: '192.168.1.12' },
    { id: 3, timestamp: '2025-11-09 11:30', user: 'Admin', action: 'DELETE', module: 'Kategori', description: 'Hapus kategori Minuman', ip: '192.168.1.10' }
]);

const search = ref('');
const currentPage = ref(0);
const rowsPerPage = ref(5);
const showDetail = ref(false);
const selectedLog = ref(null);

const filteredData = computed(() => {
    if (!search.value) return logs.value;
    return logs.value.filter((l) => l.user.toLowerCase().includes(search.value.toLowerCase()) || l.module.toLowerCase().includes(search.value.toLowerCase()) || l.action.toLowerCase().includes(search.value.toLowerCase()));
});

const paginatedData = computed(() => {
    const start = currentPage.value * rowsPerPage.value;
    return filteredData.value.slice(start, start + rowsPerPage.value);
});

const onPageChange = (e) => {
    currentPage.value = e.page;
    rowsPerPage.value = e.rows;
};

const openDetail = (log) => {
    selectedLog.value = log;
    showDetail.value = true;
};

const getSeverity = (action) => {
    if (action === 'CREATE') return 'success';
    if (action === 'UPDATE') return 'info';
    if (action === 'DELETE') return 'danger';
    return 'secondary';
};

const exportExcel = async () => {
    const XLSX = await import('https://cdn.sheetjs.com/xlsx-0.20.3/package/xlsx.mjs');
    const data = filteredData.value.map((l) => ({
        ID: l.id,
        Waktu: l.timestamp,
        User: l.user,
        Aksi: l.action,
        Modul: l.module,
        IP: l.ip
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Audit Log');
    XLSX.writeFile(wb, 'audit-log.xlsx');
};

const exportPDF = async () => {
    await new Promise((res) => {
        if (window.jspdf) return res();
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        s.onload = res;
        document.head.appendChild(s);
    });

    await new Promise((res) => {
        if (window.jspdf?.API?.autoTable) return res();
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.3/jspdf.plugin.autotable.min.js';
        s.onload = res;
        document.head.appendChild(s);
    });

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text('Audit Log System', 14, 15);
    doc.autoTable({
        head: [['ID', 'Waktu', 'User', 'Aksi', 'Modul']],
        body: filteredData.value.map((l) => [l.id, l.timestamp, l.user, l.action, l.module])
    });
    doc.save('audit-log.pdf');
};
</script>

<template>
    <div class="page-wrapper">
        <h2 class="page-title">Audit Log</h2>

        <div class="card">
            <!-- HEADER -->
            <div class="card-header">
                <h3 class="card-title">Aktivitas Sistem</h3>

                <div class="header-right">
                    <div class="export-buttons">
                        <Button label="Excel" icon="pi pi-file-excel" size="small" severity="success" outlined @click="exportExcel" />
                        <Button label="PDF" icon="pi pi-file-pdf" size="small" severity="danger" outlined @click="exportPDF" />
                    </div>
                    <InputText v-model="search" placeholder="Cari log..." class="search-input" />
                </div>
            </div>

            <!-- TABLE -->
            <div class="table-wrapper">
                <table class="w-full text-sm">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Waktu</th>
                            <th>User</th>
                            <th>Aksi</th>
                            <th>Modul</th>
                            <th class="hide-mobile">IP</th>
                            <th>Detail</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-if="paginatedData.length === 0">
                            <td colspan="7" class="empty-state">Tidak ada data ditemukan</td>
                        </tr>
                        <tr v-for="l in paginatedData" :key="l.id">
                            <td>#{{ l.id }}</td>
                            <td>{{ l.timestamp }}</td>
                            <td>{{ l.user }}</td>
                            <td>
                                <Tag :value="l.action" :severity="getSeverity(l.action)" />
                            </td>
                            <td>{{ l.module }}</td>
                            <td class="hide-mobile">{{ l.ip }}</td>
                            <td>
                                <Button label="Detail" text size="small" @click="openDetail(l)" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- PAGINATION -->
            <Paginator :rows="rowsPerPage" :totalRecords="filteredData.length" :rowsPerPageOptions="[5, 10, 20]" @page="onPageChange" class="custom-paginator" />
        </div>

        <!-- MODAL DETAIL -->
        <Dialog v-model:visible="showDetail" header="Detail Log" modal :style="{ width: '90vw', maxWidth: '420px' }">
            <div v-if="selectedLog" class="flex flex-col gap-2">
                <p><b>User:</b> {{ selectedLog.user }}</p>
                <p><b>Waktu:</b> {{ selectedLog.timestamp }}</p>
                <p><b>Aksi:</b> {{ selectedLog.action }}</p>
                <p><b>Modul:</b> {{ selectedLog.module }}</p>
                <p><b>IP:</b> {{ selectedLog.ip }}</p>
                <Divider />
                <p><b>Deskripsi:</b></p>
                <p>{{ selectedLog.description }}</p>
            </div>
        </Dialog>
    </div>
</template>

<style scoped>
.page-wrapper {
    padding: 1rem;
}

.page-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
}

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
}

.header-right {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
}

.export-buttons {
    display: flex;
    gap: 0.5rem;
}

.search-input {
    width: 200px;
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
    min-width: 500px;
}

th {
    text-align: left;
    padding: 0.625rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-color-secondary);
    border-bottom: 1px solid var(--surface-border);
    white-space: nowrap;
    background: var(--surface-ground);
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

.empty-state {
    text-align: center;
    padding: 2rem;
    color: var(--text-color-secondary);
}

/* PAGINATION */
.custom-paginator {
    border-top: 1px solid var(--surface-border);
    border-radius: 0;
}

/* RESPONSIVE */
@media (max-width: 640px) {
    .page-wrapper {
        padding: 0.75rem;
    }

    .card-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .header-right {
        width: 100%;
        flex-direction: column;
        align-items: flex-start;
    }

    .search-input {
        width: 100%;
    }

    .hide-mobile {
        display: none;
    }

    th,
    td {
        padding: 0.5rem;
        font-size: 0.8rem;
    }
}

@media (max-width: 400px) {
    .export-buttons {
        width: 100%;
    }

    .export-buttons :deep(.p-button) {
        flex: 1;
        justify-content: center;
    }
}
</style>
