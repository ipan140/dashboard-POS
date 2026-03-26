<script setup>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Divider from 'primevue/divider';
import InputText from 'primevue/inputtext';
import Paginator from 'primevue/paginator';
import Tag from 'primevue/tag';
import { computed, ref } from 'vue';

const transaksi = ref([
    {
        id: 1,
        tanggal: '09 Nov 2025',
        total: 75000,
        kasir: 'Andi',
        status: 'Selesai',
        metode: 'Tunai',
        catatan: '-',
        items: [
            { nama: 'Nasi Goreng', qty: 2, harga: 25000 },
            { nama: 'Es Teh', qty: 1, harga: 5000 }
        ]
    },
    {
        id: 2,
        tanggal: '09 Nov 2025',
        total: 75000,
        kasir: 'Budi',
        status: 'Selesai',
        metode: 'QRIS',
        catatan: '-',
        items: [
            { nama: 'Ayam Crispy', qty: 3, harga: 10000 },
            { nama: 'Kopi Latte', qty: 2, harga: 20000 }
        ]
    },
    {
        id: 3,
        tanggal: '09 Nov 2025',
        total: 75000,
        kasir: 'Siti',
        status: 'Selesai',
        metode: 'Tunai',
        catatan: 'Takeaway',
        items: [
            { nama: 'Mie Goreng', qty: 2, harga: 20000 },
            { nama: 'Jus Alpukat', qty: 1, harga: 15000 }
        ]
    },
    {
        id: 4,
        tanggal: '10 Nov 2025',
        total: 50000,
        kasir: 'Andi',
        status: 'Selesai',
        metode: 'Debit',
        catatan: '-',
        items: [
            { nama: 'Soto Ayam', qty: 2, harga: 22000 },
            { nama: 'Es Jeruk', qty: 1, harga: 8000 }
        ]
    },
    {
        id: 5,
        tanggal: '10 Nov 2025',
        total: 120000,
        kasir: 'Budi',
        status: 'Selesai',
        metode: 'QRIS',
        catatan: '-',
        items: [
            { nama: 'Nasi Uduk', qty: 4, harga: 18000 },
            { nama: 'Teh Tarik', qty: 3, harga: 10000 }
        ]
    },
    {
        id: 6,
        tanggal: '11 Nov 2025',
        total: 95000,
        kasir: 'Siti',
        status: 'Selesai',
        metode: 'Tunai',
        catatan: '-',
        items: [
            { nama: 'Kopi Latte', qty: 3, harga: 20000 },
            { nama: 'Pisang Goreng', qty: 4, harga: 8000 }
        ]
    },
    {
        id: 7,
        tanggal: '11 Nov 2025',
        total: 30000,
        kasir: 'Andi',
        status: 'Selesai',
        metode: 'Tunai',
        catatan: '-',
        items: [
            { nama: 'Kentang Goreng', qty: 2, harga: 12000 },
            { nama: 'Es Teh', qty: 1, harga: 5000 }
        ]
    },
    {
        id: 8,
        tanggal: '12 Nov 2025',
        total: 60000,
        kasir: 'Budi',
        status: 'Selesai',
        metode: 'Debit',
        catatan: '-',
        items: [
            { nama: 'Ayam Crispy', qty: 4, harga: 10000 },
            { nama: 'Es Jeruk', qty: 2, harga: 8000 }
        ]
    },
    {
        id: 9,
        tanggal: '12 Nov 2025',
        total: 45000,
        kasir: 'Siti',
        status: 'Selesai',
        metode: 'QRIS',
        catatan: '-',
        items: [
            { nama: 'Nasi Goreng', qty: 1, harga: 25000 },
            { nama: 'Teh Tarik', qty: 2, harga: 10000 }
        ]
    },
    {
        id: 10,
        tanggal: '13 Nov 2025',
        total: 80000,
        kasir: 'Andi',
        status: 'Selesai',
        metode: 'Tunai',
        catatan: '-',
        items: [
            { nama: 'Soto Ayam', qty: 2, harga: 22000 },
            { nama: 'Kopi Latte', qty: 2, harga: 20000 }
        ]
    },
    { id: 11, tanggal: '13 Nov 2025', total: 25000, kasir: 'Budi', status: 'Selesai', metode: 'Tunai', catatan: '-', items: [{ nama: 'Pisang Goreng', qty: 3, harga: 8000 }] },
    {
        id: 12,
        tanggal: '14 Nov 2025',
        total: 110000,
        kasir: 'Siti',
        status: 'Selesai',
        metode: 'QRIS',
        catatan: 'Meja VIP',
        items: [
            { nama: 'Nasi Goreng', qty: 2, harga: 25000 },
            { nama: 'Jus Alpukat', qty: 2, harga: 15000 },
            { nama: 'Ayam Crispy', qty: 3, harga: 10000 }
        ]
    }
]);

const search = ref('');
const currentPage = ref(0);
const rowsPerPage = ref(5);

// Modal
const showDetail = ref(false);
const selectedTrx = ref(null);

const openDetail = (trx) => {
    selectedTrx.value = trx;
    showDetail.value = true;
};

const filteredData = computed(() => {
    if (!search.value) return transaksi.value;
    return transaksi.value.filter((t) => t.kasir.toLowerCase().includes(search.value.toLowerCase()) || String(t.id).includes(search.value));
});

const paginatedData = computed(() => {
    const start = currentPage.value * rowsPerPage.value;
    return filteredData.value.slice(start, start + rowsPerPage.value);
});

const onPageChange = (event) => {
    currentPage.value = event.page;
    rowsPerPage.value = event.rows;
};

const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
};

/* ===== EXPORT EXCEL (SheetJS via CDN) ===== */
const exportExcel = async () => {
    const XLSX = await import('https://cdn.sheetjs.com/xlsx-0.20.3/package/xlsx.mjs');

    const data = filteredData.value.map((t) => ({
        ID: `#${t.id}`,
        Tanggal: t.tanggal,
        'Total (Rp)': t.total,
        Kasir: t.kasir,
        'Metode Bayar': t.metode,
        Status: t.status
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    ws['!cols'] = [{ wch: 8 }, { wch: 16 }, { wch: 14 }, { wch: 12 }, { wch: 14 }, { wch: 12 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Riwayat Transaksi');
    XLSX.writeFile(wb, 'riwayat-transaksi.xlsx');
};

/* ===== EXPORT PDF (jsPDF + AutoTable via CDN) ===== */
const exportPDF = async () => {
    // Load jsPDF
    await new Promise((resolve) => {
        if (window.jspdf) return resolve();
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        s.onload = resolve;
        document.head.appendChild(s);
    });

    // Load AutoTable plugin
    await new Promise((resolve) => {
        if (window.jspdf?.API?.autoTable) return resolve();
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.3/jspdf.plugin.autotable.min.js';
        s.onload = resolve;
        document.head.appendChild(s);
    });

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Riwayat Transaksi', 14, 18);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120);
    doc.text(`Diekspor: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}  |  Total: ${filteredData.value.length} transaksi`, 14, 25);
    doc.setTextColor(0);

    doc.autoTable({
        startY: 32,
        head: [['ID', 'Tanggal', 'Total', 'Kasir', 'Metode', 'Status']],
        body: filteredData.value.map((t) => [`#${t.id}`, t.tanggal, formatRupiah(t.total), t.kasir, t.metode, t.status]),
        headStyles: { fillColor: [22, 163, 74], textColor: 255, fontStyle: 'bold', fontSize: 9 },
        bodyStyles: { fontSize: 9 },
        alternateRowStyles: { fillColor: [240, 253, 244] },
        margin: { left: 14, right: 14 },
        columnStyles: {
            0: { cellWidth: 14 },
            2: { cellWidth: 36 }
        }
    });

    doc.save('riwayat-transaksi.pdf');
};
</script>

<template>
    <div class="page-wrapper">
        <h2 class="page-title">Riwayat Pembelian</h2>

        <div class="card">
            <!-- Header -->
            <div class="card-header">
                <h3 class="card-title">Daftar Transaksi</h3>

                <div class="header-right">
                    <div class="export-group">
                        <Button label="Excel" icon="pi pi-file-excel" size="small" severity="success" outlined @click="exportExcel" />
                        <Button label="PDF" icon="pi pi-file-pdf" size="small" severity="danger" outlined @click="exportPDF" />
                    </div>
                    <InputText v-model="search" placeholder="Cari transaksi..." class="search-input" />
                </div>
            </div>

            <!-- TABLE -->
            <div class="table-wrapper">
                <table class="trx-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tanggal</th>
                            <th>Total</th>
                            <th>Kasir</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="t in paginatedData" :key="t.id">
                            <td data-label="ID">#{{ t.id }}</td>
                            <td data-label="Tanggal">{{ t.tanggal }}</td>
                            <td data-label="Total">{{ formatRupiah(t.total) }}</td>
                            <td data-label="Kasir">{{ t.kasir }}</td>
                            <td data-label="Status"><Tag value="Selesai" severity="success" /></td>
                            <td data-label="Aksi">
                                <Button label="Detail" size="small" text @click="openDetail(t)" />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div v-if="filteredData.length === 0" class="empty-state">Tidak ada data transaksi.</div>
            </div>

            <!-- PAGINATOR -->
            <div class="paginator-wrapper">
                <Paginator :rows="rowsPerPage" :totalRecords="filteredData.length" :rowsPerPageOptions="[5, 10, 20]" @page="onPageChange" class="paginator" />
            </div>
        </div>

        <!-- ===== MODAL DETAIL ===== -->
        <Dialog v-model:visible="showDetail" :header="`Detail Transaksi #${selectedTrx?.id}`" modal :style="{ width: '480px', maxWidth: '95vw' }" :draggable="false">
            <template v-if="selectedTrx">
                <div class="detail-info-grid">
                    <div class="detail-info-item">
                        <span class="info-label">Tanggal</span>
                        <span class="info-value">{{ selectedTrx.tanggal }}</span>
                    </div>
                    <div class="detail-info-item">
                        <span class="info-label">Kasir</span>
                        <span class="info-value">{{ selectedTrx.kasir }}</span>
                    </div>
                    <div class="detail-info-item">
                        <span class="info-label">Metode Bayar</span>
                        <span class="info-value">{{ selectedTrx.metode }}</span>
                    </div>
                    <div class="detail-info-item">
                        <span class="info-label">Status</span>
                        <Tag value="Selesai" severity="success" />
                    </div>
                </div>

                <Divider />

                <p class="detail-section-title">Item Pesanan</p>
                <div class="detail-items">
                    <div v-for="(item, i) in selectedTrx.items" :key="i" class="detail-item-row">
                        <span class="item-name">{{ item.nama }}</span>
                        <span class="item-qty">x{{ item.qty }}</span>
                        <span class="item-price">{{ formatRupiah(item.harga * item.qty) }}</span>
                    </div>
                </div>

                <Divider />

                <div class="detail-total-row">
                    <span class="total-label">Total Pembayaran</span>
                    <span class="total-value">{{ formatRupiah(selectedTrx.total) }}</span>
                </div>

                <div v-if="selectedTrx.catatan && selectedTrx.catatan !== '-'" class="detail-note"><span class="info-label">Catatan:</span> {{ selectedTrx.catatan }}</div>
            </template>
        </Dialog>
    </div>
</template>

<style scoped>
.page-wrapper {
    padding: 24px;
    width: 100%;
    box-sizing: border-box;
}

.page-title {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 20px;
    color: var(--text-color, #1f2937);
}

.card {
    background: var(--surface-card, #ffffff);
    border: 1px solid var(--surface-border, #e5e7eb);
    border-radius: 14px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    width: 100%;
    box-sizing: border-box;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 16px;
}

.card-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-color, #1f2937);
    margin: 0;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}

.export-group {
    display: flex;
    gap: 8px;
}

.search-input {
    width: 220px;
    max-width: 100%;
}

.table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}

.trx-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 500px;
}
.trx-table thead tr {
    background: var(--surface-100, #f3f4f6);
}
.trx-table th {
    padding: 12px 14px;
    text-align: left;
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--text-color-secondary, #6b7280);
    text-transform: uppercase;
    letter-spacing: 0.03em;
    white-space: nowrap;
}
.trx-table td {
    padding: 12px 14px;
    font-size: 0.9rem;
    color: var(--text-color, #1f2937);
    border-bottom: 1px solid var(--surface-border, #e5e7eb);
    vertical-align: middle;
}
.trx-table tbody tr:last-child td {
    border-bottom: none;
}
.trx-table tbody tr:hover td {
    background: var(--surface-50, #f9fafb);
}

.empty-state {
    text-align: center;
    padding: 40px 16px;
    color: var(--text-color-secondary, #9ca3af);
    font-size: 0.9rem;
}

.paginator-wrapper {
    margin-top: 16px;
    border-top: 1px solid var(--surface-border, #e5e7eb);
    padding-top: 12px;
}
.paginator {
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
}

/* ===== MODAL ===== */
.detail-info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-bottom: 4px;
}
.detail-info-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.info-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-color-secondary, #6b7280);
    text-transform: uppercase;
    letter-spacing: 0.04em;
}
.info-value {
    font-size: 0.9rem;
    color: var(--text-color, #1f2937);
    font-weight: 500;
}

.detail-section-title {
    font-size: 0.82rem;
    font-weight: 700;
    color: var(--text-color-secondary, #6b7280);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin: 0 0 10px;
}

.detail-items {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.detail-item-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
}
.item-name {
    flex: 1;
    color: var(--text-color, #1f2937);
}
.item-qty {
    font-size: 0.78rem;
    background: var(--surface-100, #f3f4f6);
    border-radius: 6px;
    padding: 2px 8px;
    color: var(--text-color-secondary, #6b7280);
    font-weight: 600;
}
.item-price {
    font-weight: 600;
    min-width: 100px;
    text-align: right;
    color: var(--text-color, #1f2937);
}

.detail-total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 0;
}
.total-label {
    font-weight: 600;
    font-size: 0.95rem;
}
.total-value {
    font-weight: 700;
    font-size: 1.05rem;
    color: var(--primary-color, #16a34a);
}

.detail-note {
    margin-top: 12px;
    font-size: 0.85rem;
    color: var(--text-color-secondary, #6b7280);
    background: var(--surface-50, #f9fafb);
    border-radius: 8px;
    padding: 8px 12px;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 640px) {
    .page-wrapper {
        padding: 12px;
    }
    .card {
        padding: 16px;
    }
    .card-header {
        flex-direction: column;
        align-items: stretch;
    }
    .header-right {
        flex-direction: column;
        align-items: stretch;
    }
    .export-group {
        gap: 8px;
    }
    .export-group :deep(.p-button) {
        flex: 1;
        justify-content: center;
    }
    .search-input {
        width: 100%;
    }
    .detail-info-grid {
        grid-template-columns: 1fr;
        gap: 10px;
    }

    .trx-table,
    .trx-table thead,
    .trx-table tbody,
    .trx-table th,
    .trx-table td,
    .trx-table tr {
        display: block;
    }
    .trx-table thead tr {
        display: none;
    }
    .trx-table tbody tr {
        border: 1px solid var(--surface-border, #e5e7eb);
        border-radius: 10px;
        margin-bottom: 10px;
        padding: 4px 0;
        background: var(--surface-card, #ffffff);
    }
    .trx-table tbody tr:hover td {
        background: transparent;
    }
    .trx-table td {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 9px 14px;
        border-bottom: 1px solid var(--surface-border, #f3f4f6);
        font-size: 0.875rem;
    }
    .trx-table tbody tr td:last-child {
        border-bottom: none;
    }
    .trx-table td::before {
        content: attr(data-label);
        font-weight: 600;
        font-size: 0.78rem;
        color: var(--text-color-secondary, #6b7280);
        text-transform: uppercase;
        letter-spacing: 0.04em;
        flex-shrink: 0;
        margin-right: 12px;
    }
}

@media (max-width: 400px) {
    .page-wrapper {
        padding: 8px;
    }
}
</style>
