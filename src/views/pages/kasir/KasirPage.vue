<script setup>
import { useToast } from 'primevue/usetoast';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { computed, ref } from 'vue';

/* === COMPONENTS PENDUKUNG === */
import ShiftModal from './ShiftModal.vue';

/* === PRIMEVUE === */
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import InputText from 'primevue/inputtext';
import Paginator from 'primevue/paginator';
import SelectButton from 'primevue/selectbutton';
import Tag from 'primevue/tag';

const toast = useToast();

/* === STATE SHIFT === */
const isShiftOpen = ref(false);
const totalCashSales = ref(0);
const shiftModalRef = ref(null);

const resetShiftData = () => {
    totalCashSales.value = 0;
};

const products = ref([
    { id: 1, name: 'Nasi Goreng', category: 'Makanan', price: 25000, stock: 50, img: 'https://picsum.photos/200' },
    { id: 2, name: 'Es Teh', category: 'Minuman', price: 5000, stock: 40, img: 'https://picsum.photos/201' },
    { id: 3, name: 'Ayam Crispy', category: 'Snack', price: 10000, stock: 25, img: 'https://picsum.photos/202' },
    { id: 4, name: 'Kopi Latte', category: 'Minuman', price: 20000, stock: 30, img: 'https://picsum.photos/203' }
]);

const categories = ref(['Semua', 'Makanan', 'Minuman', 'Snack']);
const selectedCategory = ref('Semua');
const query = ref('');
const showCart = ref(false);

/* === PAGINATION === */
const currentPage = ref(0);
const rowsPerPage = ref(8);

const filteredProducts = computed(() => {
    const q = query.value.toLowerCase();
    return products.value.filter((p) => {
        const matchQ = p.name.toLowerCase().includes(q);
        const matchCat = selectedCategory.value === 'Semua' || p.category === selectedCategory.value;
        return matchQ && matchCat;
    });
});

const paginatedProducts = computed(() => {
    const start = currentPage.value * rowsPerPage.value;
    return filteredProducts.value.slice(start, start + rowsPerPage.value);
});

const onPageChange = (event) => {
    currentPage.value = event.page;
    rowsPerPage.value = event.rows;
};

/* === KERANJANG === */
const cart = ref([]);
const discount = ref(0);
const taxPercent = ref(10);
const payment = ref(0);

const paymentMethods = ref(['Tunai', 'QRIS', 'Transfer']);
const selectedPayment = ref('Tunai');
const customerName = ref('');

const cartCount = computed(() => cart.value.reduce((s, i) => s + i.qty, 0));

const addToCart = (p) => {
    if (!isShiftOpen.value) {
        toast.add({ severity: 'warn', summary: 'Shift Ditutup', detail: 'Silakan buka shift terlebih dahulu!', life: 2000 });
        return;
    }
    const exist = cart.value.find((i) => i.id === p.id);
    if (exist) {
        if (exist.qty < p.stock) exist.qty++;
        else toast.add({ severity: 'warn', summary: 'Stok Habis', detail: 'Tidak bisa menambah lagi.' });
    } else {
        cart.value.push({ id: p.id, name: p.name, qty: 1, price: p.price });
    }
};

const changeQty = (item, delta) => {
    const next = item.qty + delta;
    if (next < 1) return;
    const prod = products.value.find((x) => x.id === item.id);
    if (next > prod.stock) return;
    item.qty = next;
};

const removeFromCart = (id) => {
    cart.value = cart.value.filter((i) => i.id !== id);
};

/* === PERHITUNGAN === */
const subtotal = computed(() => cart.value.reduce((s, i) => s + i.qty * i.price, 0));
const tax = computed(() => Math.round((subtotal.value - discount.value) * (taxPercent.value / 100)));
const total = computed(() => subtotal.value - discount.value + tax.value);
const change = computed(() => Math.max(0, payment.value - total.value));

/* === ACTION === */
const clearCart = async () => {
    const c = await Swal.fire({ title: 'Batalkan transaksi?', icon: 'warning', showCancelButton: true });
    if (c.isConfirmed) {
        cart.value = [];
        payment.value = 0;
        discount.value = 0;
        customerName.value = '';
        selectedPayment.value = 'Tunai';
        showCart.value = false;
    }
};

const resetAfterPrint = () => {
    cart.value = [];
    payment.value = 0;
    discount.value = 0;
    customerName.value = '';
    selectedPayment.value = 'Tunai';
    showCart.value = false;
};

/* === PRINT STRUK DI WINDOW BARU === */
const printReceipt = (data) => {
    const itemRows = data.items
        .map(
            (item) => `
        <div style="display:grid; grid-template-columns:2fr 0.5fr 1fr 1fr; gap:2px; font-size:7.5pt; margin-bottom:3px; align-items:baseline;">
            <span style="overflow:hidden; white-space:nowrap; text-overflow:ellipsis;">${item.name}</span>
            <span style="text-align:center;">${item.qty}</span>
            <span style="text-align:right;">${item.price.toLocaleString('id-ID')}</span>
            <span style="text-align:right;">${(item.qty * item.price).toLocaleString('id-ID')}</span>
        </div>`
        )
        .join('');

    const diskonRow =
        data.discount > 0
            ? `<div style="display:flex; justify-content:space-between; font-size:7.5pt; margin-bottom:2px;">
                <span>Diskon</span><span>- Rp ${data.discount.toLocaleString('id-ID')}</span>
               </div>`
            : '';

    const tunaiRows =
        data.method === 'Tunai'
            ? `<div style="display:flex; justify-content:space-between; font-size:7.5pt; margin-bottom:2px;">
                <span>Tunai</span><span>Rp ${data.cash.toLocaleString('id-ID')}</span>
               </div>
               <div style="display:flex; justify-content:space-between; font-size:7.5pt; font-weight:bold; margin-bottom:6px;">
                <span>Kembalian</span><span>Rp ${data.change.toLocaleString('id-ID')}</span>
               </div>`
            : `<div style="text-align:center; font-size:7.5pt; margin-bottom:6px;">Dibayar via ${data.method}</div>`;

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8" />
            <title>Struk - ${data.invoiceNo}</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { background: #fff; }
                @page { size: 58mm auto; margin: 0; }
                @media print {
                    body { margin: 0; padding: 0; }
                }
            </style>
        </head>
        <body>
            <div style="width:58mm; font-family:'Courier New',Courier,monospace; font-size:8pt; color:#000; padding:4mm 3mm;">

                <!-- Header -->
                <div style="text-align:center; font-weight:bold; font-size:14pt; margin-bottom:2px;">GEDANG KRENYES</div>
                <div style="text-align:center; font-size:7.5pt; margin-bottom:1px;">Jl. Ketintang Baru, Surabaya</div>
                <div style="text-align:center; font-size:7.5pt; margin-bottom:6px;">Telp: 0812-3456-7890</div>
                <div style="border-top:1px dashed #000; margin-bottom:6px;"></div>

                <!-- Info Transaksi -->
                <div style="display:flex; justify-content:space-between; font-size:7.5pt; margin-bottom:2px;">
                    <span style="min-width:65px;">No. Invoice</span><span>${data.invoiceNo}</span>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:7.5pt; margin-bottom:2px;">
                    <span style="min-width:65px;">Tanggal</span><span style="text-align:right; flex:1;">${data.date}</span>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:7.5pt; margin-bottom:2px;">
                    <span style="min-width:65px;">Pelanggan</span><span>${data.customer}</span>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:7.5pt; margin-bottom:6px;">
                    <span style="min-width:65px;">Metode</span><span>${data.method}</span>
                </div>
                <div style="border-top:1px dashed #000; margin-bottom:6px;"></div>

                <!-- Header Kolom Item -->
                <div style="display:grid; grid-template-columns:2fr 0.5fr 1fr 1fr; gap:2px; font-size:7.5pt; font-weight:bold; margin-bottom:2px;">
                    <span>Item</span>
                    <span style="text-align:center;">Jml</span>
                    <span style="text-align:right;">Harga</span>
                    <span style="text-align:right;">Total</span>
                </div>
                <div style="border-top:1px dashed #000; margin-bottom:4px;"></div>

                <!-- Daftar Item -->
                ${itemRows}

                <div style="border-top:1px dashed #000; margin:4px 0 6px;"></div>

                <!-- Summary -->
                <div style="display:flex; justify-content:space-between; font-size:7.5pt; margin-bottom:2px;">
                    <span>Subtotal</span><span>Rp ${data.subtotal.toLocaleString('id-ID')}</span>
                </div>
                ${diskonRow}
                <div style="display:flex; justify-content:space-between; font-size:7.5pt; margin-bottom:6px;">
                    <span>Pajak (10%)</span><span>Rp ${data.tax.toLocaleString('id-ID')}</span>
                </div>
                <div style="border-top:1px dashed #000; margin-bottom:6px;"></div>

                <!-- Total -->
                <div style="display:flex; justify-content:space-between; font-size:10pt; font-weight:bold; margin-bottom:4px;">
                    <span>TOTAL</span><span>Rp ${data.total.toLocaleString('id-ID')}</span>
                </div>

                <!-- Tunai / Non-Tunai -->
                ${tunaiRows}

                <div style="border-top:1px dashed #000; margin-bottom:6px;"></div>

                <!-- Footer -->
                <div style="text-align:center; font-size:7.5pt; margin-bottom:2px;">Terima kasih telah berbelanja!</div>
                <div style="text-align:center; font-size:7.5pt; font-style:italic; margin-bottom:2px;">Semoga harimu menyenangkan</div>
                <div style="text-align:center; font-size:7.5pt; font-weight:bold;">~ Gedang Krenyes ~</div>

            </div>
        </body>
        </html>
    `;

    const printWin = window.open('', '_blank', 'width=320,height=600,toolbar=0,menubar=0,scrollbars=0');
    if (!printWin) {
        toast.add({ severity: 'warn', summary: 'Pop-up Diblokir', detail: 'Izinkan pop-up di browser untuk mencetak struk.', life: 4000 });
        return;
    }
    printWin.document.write(html);
    printWin.document.close();
    printWin.focus();
    // Tunggu load lalu print
    printWin.onload = () => {
        printWin.print();
        printWin.close();
    };
    // Fallback jika onload tidak trigger (beberapa browser)
    setTimeout(() => {
        try {
            printWin.print();
            printWin.close();
        } catch (_) {}
    }, 800);
};

const processTransaction = async () => {
    if (cart.value.length === 0) {
        toast.add({ severity: 'warn', summary: 'Kosong', detail: 'Tidak ada item di keranjang.' });
        return;
    }
    if (selectedPayment.value === 'Tunai' && payment.value < total.value) {
        toast.add({ severity: 'error', summary: 'Pembayaran', detail: 'Uang tunai tidak cukup.' });
        return;
    }

    const c = await Swal.fire({
        title: 'Proses Transaksi?',
        html: `<b>Total:</b> Rp ${total.value.toLocaleString('id-ID')}<br><b>Metode:</b> ${selectedPayment.value}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Ya, Cetak Struk',
        cancelButtonText: 'Batal'
    });

    if (c.isConfirmed) {
        if (selectedPayment.value === 'Tunai') {
            totalCashSales.value += total.value;
        }

        const invoiceNo = 'INV-' + Date.now().toString().slice(-8);

        const data = {
            invoiceNo,
            date: new Date().toLocaleString('id-ID'),
            customer: customerName.value || 'Umum',
            method: selectedPayment.value,
            items: cart.value.map((i) => ({ ...i })),
            subtotal: subtotal.value,
            discount: discount.value,
            tax: tax.value,
            total: total.value,
            cash: selectedPayment.value === 'Tunai' ? payment.value : total.value,
            change: selectedPayment.value === 'Tunai' ? change.value : 0
        };

        await Swal.fire({
            title: 'Berhasil!',
            text: 'Mencetak struk...',
            icon: 'success',
            timer: 1200,
            showConfirmButton: false,
            willClose: () => {
                printReceipt(data);
                resetAfterPrint();
            }
        });
    }
};
</script>

<template>
    <div class="pos-wrapper">
        <ShiftModal ref="shiftModalRef" v-model:isShiftOpen="isShiftOpen" :totalCashSales="totalCashSales" @shift-closed="resetShiftData" />

        <!-- Mobile Header -->
        <header class="mobile-header surface-card">
            <div>
                <div class="text-900 text-lg font-semibold">Kasir POS</div>
                <div class="text-500 text-xs">Sistem Penjualan</div>
            </div>
            <div style="display: flex; gap: 8px; align-items: center">
                <Button v-if="isShiftOpen" icon="pi pi-power-off" severity="danger" outlined size="small" @click="shiftModalRef.triggerCloseModal()" />
                <Button icon="pi pi-shopping-cart" rounded class="cart-fab" @click="showCart = !showCart" :badge="cartCount > 0 ? String(cartCount) : undefined" badgeSeverity="danger" />
            </div>
        </header>

        <div class="pos-layout">
            <!-- Left Panel -->
            <div class="left-panel">
                <div class="surface-card card-box desktop-header" style="display: flex; justify-content: space-between; align-items: center">
                    <div>
                        <div class="text-900 text-xl font-semibold mb-1">Kasir POS</div>
                        <div class="text-600 text-sm">Sistem Penjualan (Point of Sale)</div>
                    </div>
                    <Button v-if="isShiftOpen" label="Tutup Shift" icon="pi pi-power-off" severity="danger" outlined @click="shiftModalRef.triggerCloseModal()" />
                </div>

                <div class="surface-card card-box">
                    <InputText v-model="query" placeholder="Cari produk..." class="w-full mb-3" @input="currentPage = 0" />
                    <div class="category-scroll">
                        <Button
                            v-for="c in categories"
                            :key="c"
                            size="small"
                            :label="c"
                            :severity="selectedCategory === c ? 'primary' : 'secondary'"
                            :outlined="selectedCategory !== c"
                            @click="
                                selectedCategory = c;
                                currentPage = 0;
                            "
                            class="flex-shrink-0"
                        />
                    </div>
                </div>

                <div class="surface-card card-box">
                    <div v-if="filteredProducts.length === 0" class="text-center text-500 py-4">Produk tidak ditemukan.</div>
                    <template v-else>
                        <div class="product-grid">
                            <div v-for="p in paginatedProducts" :key="p.id" class="product-card" :style="!isShiftOpen ? 'opacity: 0.6; pointer-events: none;' : ''">
                                <img :src="p.img" class="product-img" />
                                <div class="product-info">
                                    <Tag :value="p.category" severity="info" class="w-fit" />
                                    <div class="font-medium text-sm">{{ p.name }}</div>
                                    <div class="text-primary font-bold text-sm">Rp {{ p.price.toLocaleString() }}</div>
                                    <small class="text-500">Stok: {{ p.stock }}</small>
                                    <Button label="Tambah" icon="pi pi-plus" size="small" class="w-full mt-1" @click="addToCart(p)" :disabled="p.stock === 0 || !isShiftOpen" />
                                </div>
                            </div>
                        </div>
                        <div class="paginator-wrapper">
                            <Paginator :rows="rowsPerPage" :totalRecords="filteredProducts.length" :rowsPerPageOptions="[4, 8, 12]" @page="onPageChange" class="paginator" />
                        </div>
                    </template>
                </div>
            </div>

            <!-- Right Panel / Keranjang -->
            <aside class="right-panel surface-card card-box desktop-cart" :style="!isShiftOpen ? 'opacity: 0.6; pointer-events: none;' : ''">
                <h3 class="text-lg font-semibold mb-3">🛒 Keranjang</h3>
                <div v-if="cart.length === 0" class="p-4 text-center text-500 surface-100 border-round">Keranjang masih kosong.</div>
                <template v-else>
                    <div class="cart-list">
                        <div v-for="item in cart" :key="item.id" class="cart-item">
                            <div class="cart-item-name">
                                <div class="font-medium text-sm">{{ item.name }}</div>
                                <div class="text-500 text-xs">Rp {{ item.price.toLocaleString() }}</div>
                            </div>
                            <div class="cart-item-actions">
                                <Button icon="pi pi-minus" rounded text size="small" @click="changeQty(item, -1)" />
                                <span class="qty-num">{{ item.qty }}</span>
                                <Button icon="pi pi-plus" rounded text size="small" @click="changeQty(item, 1)" />
                                <Button icon="pi pi-trash" text severity="danger" size="small" @click="removeFromCart(item.id)" />
                            </div>
                        </div>
                    </div>

                    <Divider />

                    <div class="checkout-fields mb-3">
                        <label class="text-sm text-600 block mb-1">Nama Pelanggan (Opsional)</label>
                        <InputText v-model="customerName" placeholder="Contoh: Budi" class="w-full mb-3" />
                        <label class="text-sm text-600 block mb-1">Metode Bayar</label>
                        <SelectButton v-model="selectedPayment" :options="paymentMethods" class="w-full mb-2 method-selector" />
                    </div>

                    <div class="summary-rows">
                        <div class="summary-row">
                            <span class="text-600 text-sm">Subtotal</span>
                            <span class="text-sm">Rp {{ subtotal.toLocaleString() }}</span>
                        </div>
                        <div class="summary-row">
                            <span class="text-600 text-sm">Diskon</span>
                            <InputText type="number" class="w-5rem text-sm" v-model.number="discount" />
                        </div>
                        <div class="summary-row">
                            <span class="text-600 text-sm">Pajak (10%)</span>
                            <span class="text-sm">Rp {{ tax.toLocaleString() }}</span>
                        </div>
                        <div class="summary-row total-row">
                            <span class="font-bold">Total</span>
                            <span class="font-bold text-primary">Rp {{ total.toLocaleString() }}</span>
                        </div>
                    </div>

                    <template v-if="selectedPayment === 'Tunai'">
                        <label class="text-sm text-600 block mb-1 mt-3">Uang Diterima</label>
                        <InputText type="number" v-model.number="payment" class="w-full mb-2" />
                        <div class="change-box mb-3">
                            Kembalian: <strong>Rp {{ change.toLocaleString() }}</strong>
                        </div>
                    </template>
                    <div v-else class="mb-3 mt-3 p-2 border-round surface-100 text-center text-sm text-600">Pastikan pembayaran {{ selectedPayment }} berhasil diterima.</div>

                    <div class="flex flex-column gap-2">
                        <Button label="Bayar & Cetak" icon="pi pi-print" severity="success" @click="processTransaction" :disabled="selectedPayment === 'Tunai' && payment < total" />
                        <Button label="Batalkan" severity="danger" outlined @click="clearCart" />
                    </div>
                </template>
            </aside>
        </div>
    </div>
</template>

<style scoped>
.pos-wrapper {
    min-height: 100vh;
    box-sizing: border-box;
    position: relative;
}
.pos-layout {
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 24px;
    padding: 20px;
    max-width: 1400px;
    margin: 0 auto;
    box-sizing: border-box;
}
.card-box {
    border-radius: 14px;
    padding: 18px;
    border: 1px solid var(--surface-border);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}
.left-panel {
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-width: 0;
}
.category-scroll {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    padding-bottom: 2px;
}
.category-scroll::-webkit-scrollbar {
    display: none;
}
.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
    gap: 16px;
}
.product-card {
    background: var(--surface-ground) !important;
    border: 1px solid var(--surface-border);
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;
}
.product-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
}
.product-img {
    width: 100%;
    height: 140px;
    object-fit: cover;
}
.product-info {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 12px;
}
.paginator-wrapper {
    margin-top: 16px;
    border-top: 1px solid var(--surface-border);
    padding-top: 12px;
}
.paginator {
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
}
.right-panel {
    position: sticky;
    top: 20px;
    align-self: start;
    max-height: calc(100vh - 40px);
    overflow-y: auto;
    scrollbar-width: thin;
}
.cart-list {
    display: flex;
    flex-direction: column;
    gap: 0;
}
.cart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid var(--surface-border);
    gap: 8px;
}
.cart-item-name {
    flex: 1;
    min-width: 0;
    overflow: hidden;
}
.cart-item-name .font-medium {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.cart-item-actions {
    display: flex;
    align-items: center;
    gap: 2px;
    flex-shrink: 0;
}
.qty-num {
    min-width: 20px;
    text-align: center;
    font-weight: 600;
    font-size: 0.9rem;
}
:deep(.method-selector .p-button) {
    padding: 0.5rem;
    font-size: 0.85rem;
    flex: 1;
    justify-content: center;
}
.summary-rows {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.total-row {
    margin-top: 4px;
    padding-top: 8px;
    border-top: 1px solid var(--surface-border);
}
.change-box {
    background: var(--surface-200, #e9ecef);
    border-radius: 8px;
    padding: 10px 14px;
    color: var(--green-600, #22c55e);
    font-size: 0.9rem;
}
.mobile-header {
    display: none;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid var(--surface-border);
    position: sticky;
    top: 0;
    z-index: 100;
}

/* RESPONSIVE */
@media (max-width: 1100px) {
    .pos-layout {
        grid-template-columns: 1fr 300px;
        gap: 16px;
    }
    .product-grid {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    }
}
@media (max-width: 768px) {
    .pos-wrapper {
        padding-bottom: 0;
    }
    .mobile-header {
        display: flex;
    }
    .pos-layout {
        grid-template-columns: 1fr;
        padding: 12px;
        gap: 14px;
    }
    .desktop-cart,
    .desktop-header {
        display: none;
    }
    .product-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 12px;
    }
    .product-img {
        height: 120px;
    }
    .category-scroll {
        flex-wrap: nowrap;
        overflow-x: auto;
    }
}
@media (max-width: 480px) {
    .pos-layout {
        padding: 8px;
        gap: 10px;
    }
    .card-box {
        padding: 12px;
        border-radius: 10px;
    }
    .product-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
    }
    .product-img {
        height: 100px;
    }
    .product-info {
        padding: 8px;
        gap: 4px;
    }
}
@media (max-width: 360px) {
    .product-grid {
        grid-template-columns: 1fr;
    }
}
</style>
