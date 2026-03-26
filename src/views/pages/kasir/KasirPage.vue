<script setup>
import { useToast } from 'primevue/usetoast';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { computed, ref } from 'vue';

/* === PRIMEVUE === */
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import InputText from 'primevue/inputtext';
import Paginator from 'primevue/paginator';
import SelectButton from 'primevue/selectbutton'; // TAMBAHAN: Import SelectButton
import Tag from 'primevue/tag';

/* === DATA PRODUK === */
const products = ref([
    { id: 1, name: 'Nasi Goreng', category: 'Makanan', price: 25000, stock: 50, img: 'https://picsum.photos/200' },
    { id: 2, name: 'Es Teh', category: 'Minuman', price: 5000, stock: 40, img: 'https://picsum.photos/201' },
    { id: 3, name: 'Ayam Crispy', category: 'Snack', price: 10000, stock: 25, img: 'https://picsum.photos/202' },
    { id: 4, name: 'Kopi Latte', category: 'Minuman', price: 20000, stock: 30, img: 'https://picsum.photos/203' },
    { id: 5, name: 'Mie Goreng', category: 'Makanan', price: 20000, stock: 35, img: 'https://picsum.photos/204' },
    { id: 6, name: 'Jus Alpukat', category: 'Minuman', price: 15000, stock: 20, img: 'https://picsum.photos/205' },
    { id: 7, name: 'Kentang Goreng', category: 'Snack', price: 12000, stock: 40, img: 'https://picsum.photos/206' },
    { id: 8, name: 'Soto Ayam', category: 'Makanan', price: 22000, stock: 15, img: 'https://picsum.photos/207' },
    { id: 9, name: 'Es Jeruk', category: 'Minuman', price: 8000, stock: 30, img: 'https://picsum.photos/208' },
    { id: 10, name: 'Pisang Goreng', category: 'Snack', price: 8000, stock: 50, img: 'https://picsum.photos/209' },
    { id: 11, name: 'Nasi Uduk', category: 'Makanan', price: 18000, stock: 25, img: 'https://picsum.photos/210' },
    { id: 12, name: 'Teh Tarik', category: 'Minuman', price: 10000, stock: 35, img: 'https://picsum.photos/211' }
]);

const categories = ref(['Semua', 'Makanan', 'Minuman', 'Snack']);
const selectedCategory = ref('Semua');
const query = ref('');
const showCart = ref(false);

/* === PAGINATION === */
const currentPage = ref(0);
const rowsPerPage = ref(8);

/* === FILTER PRODUK === */
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

/* === TAMBAHAN: FITUR OPERASIONAL POS === */
const paymentMethods = ref(['Tunai', 'QRIS', 'Transfer']);
const selectedPayment = ref('Tunai');
const customerName = ref('');
const receiptData = ref(null); // Menyimpan data sementara untuk dicetak ke struk

const toast = useToast();
const cartCount = computed(() => cart.value.reduce((s, i) => s + i.qty, 0));

const addToCart = (p) => {
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

const processTransaction = async () => {
    // Validasi Keranjang
    if (cart.value.length === 0) {
        toast.add({ severity: 'warn', summary: 'Kosong', detail: 'Tidak ada item di keranjang.' });
        return;
    }

    // Validasi Pembayaran (Hanya jika metode Tunai yang butuh cek uang masuk)
    if (selectedPayment.value === 'Tunai' && payment.value < total.value) {
        toast.add({ severity: 'error', summary: 'Pembayaran', detail: 'Uang tunai tidak cukup.' });
        return;
    }

    const c = await Swal.fire({
        title: 'Proses Transaksi?',
        html: `<b>Total:</b> Rp ${total.value.toLocaleString()}<br><b>Metode:</b> ${selectedPayment.value}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Ya, Cetak Struk',
        cancelButtonText: 'Batal'
    });

    if (c.isConfirmed) {
        // 1. Simpan data transaksi ke variabel struk sebelum keranjang dikosongkan
        receiptData.value = {
            date: new Date().toLocaleString('id-ID'),
            customer: customerName.value || 'Umum',
            method: selectedPayment.value,
            items: [...cart.value], // Clone array keranjang
            subtotal: subtotal.value,
            discount: discount.value,
            tax: tax.value,
            total: total.value,
            cash: selectedPayment.value === 'Tunai' ? payment.value : total.value, // Jika QRIS, otomatis lunas
            change: selectedPayment.value === 'Tunai' ? change.value : 0
        };

        Swal.fire({ title: 'Berhasil!', text: 'Mencetak struk...', icon: 'success', timer: 1200, showConfirmButton: false });

        // 2. Tunggu sebentar agar Vue me-render area struk, lalu panggil window.print()
        setTimeout(() => {
            window.print();

            // 3. Reset state keranjang setelah selesai mencetak
            cart.value = [];
            payment.value = 0;
            discount.value = 0;
            customerName.value = '';
            selectedPayment.value = 'Tunai';
            showCart.value = false;
        }, 300); // Jeda 300ms agar aman
    }
};
</script>

<template>
    <div class="pos-wrapper">
        <header class="mobile-header surface-card no-print">
            <div>
                <div class="text-900 text-lg font-semibold">Kasir POS</div>
                <div class="text-500 text-xs">Sistem Penjualan</div>
            </div>
            <Button icon="pi pi-shopping-cart" rounded class="cart-fab" @click="showCart = !showCart" :badge="cartCount > 0 ? String(cartCount) : undefined" badgeSeverity="danger" />
        </header>

        <div class="pos-layout no-print">
            <div class="left-panel">
                <div class="surface-card card-box desktop-header">
                    <div class="text-900 text-xl font-semibold mb-1">Kasir POS</div>
                    <div class="text-600 text-sm">Sistem Penjualan (Point of Sale)</div>
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
                            <div v-for="p in paginatedProducts" :key="p.id" class="product-card">
                                <img :src="p.img" class="product-img" />
                                <div class="product-info">
                                    <Tag :value="p.category" severity="info" class="w-fit" />
                                    <div class="font-medium text-sm">{{ p.name }}</div>
                                    <div class="text-primary font-bold text-sm">Rp {{ p.price.toLocaleString() }}</div>
                                    <small class="text-500">Stok: {{ p.stock }}</small>
                                    <Button label="Tambah" icon="pi pi-plus" size="small" class="w-full mt-1" @click="addToCart(p)" :disabled="p.stock === 0" />
                                </div>
                            </div>
                        </div>

                        <div class="paginator-wrapper">
                            <Paginator :rows="rowsPerPage" :totalRecords="filteredProducts.length" :rowsPerPageOptions="[4, 8, 12]" @page="onPageChange" class="paginator" />
                        </div>
                    </template>
                </div>
            </div>

            <aside class="right-panel surface-card card-box desktop-cart">
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

        <transition name="sheet">
            <div v-if="showCart" class="mobile-cart-overlay no-print" @click.self="showCart = false">
                <div class="mobile-cart-sheet">
                    <div class="sheet-handle" />
                    <div class="sheet-header">
                        <h3 class="text-lg font-semibold">🛒 Keranjang</h3>
                        <Button icon="pi pi-times" text rounded @click="showCart = false" />
                    </div>
                    <div class="sheet-body">
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
                                <label class="text-sm text-600 block mb-1">Nama Pelanggan</label>
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

                            <div class="flex flex-column gap-2 pb-2 mt-2">
                                <Button label="Bayar & Cetak" icon="pi pi-print" severity="success" @click="processTransaction" :disabled="selectedPayment === 'Tunai' && payment < total" />
                                <Button label="Batalkan" severity="danger" outlined @click="clearCart" />
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </transition>

        <div class="print-area">
            <div v-if="receiptData" class="receipt-ticket">
                <div class="txt-center bold txt-xl mb-1">GEDANG KRENYES</div>
                <div class="txt-center txt-xs mb-3">Jl. Ketintang Baru, Surabaya<br />Telp: 0812-3456-7890</div>

                <div class="border-dashed mb-2"></div>

                <div class="txt-xs mb-2">
                    <div class="flex-row">
                        <span>Tgl:</span> <span>{{ receiptData.date }}</span>
                    </div>
                    <div class="flex-row"><span>Kasir:</span> <span>Admin</span></div>
                    <div class="flex-row">
                        <span>Pelanggan:</span> <span>{{ receiptData.customer }}</span>
                    </div>
                </div>

                <div class="border-dashed mb-2"></div>

                <div class="txt-xs mb-2">
                    <div v-for="item in receiptData.items" :key="item.id" class="mb-1">
                        <div class="flex-row bold">
                            <span>{{ item.name }}</span>
                            <span>{{ (item.price * item.qty).toLocaleString('id-ID') }}</span>
                        </div>
                        <div class="txt-gray">{{ item.qty }} x {{ item.price.toLocaleString('id-ID') }}</div>
                    </div>
                </div>

                <div class="border-dashed mb-2"></div>

                <div class="txt-xs bold">
                    <div class="flex-row mb-1">
                        <span>SUBTOTAL</span>
                        <span>{{ receiptData.subtotal.toLocaleString('id-ID') }}</span>
                    </div>
                    <div v-if="receiptData.discount > 0" class="flex-row mb-1">
                        <span>DISKON</span>
                        <span>-{{ receiptData.discount.toLocaleString('id-ID') }}</span>
                    </div>
                    <div class="flex-row mb-1">
                        <span>PAJAK (10%)</span>
                        <span>{{ receiptData.tax.toLocaleString('id-ID') }}</span>
                    </div>
                    <div class="flex-row txt-sm mt-1 mb-2">
                        <span>TOTAL</span>
                        <span>{{ receiptData.total.toLocaleString('id-ID') }}</span>
                    </div>

                    <div class="flex-row">
                        <span>METODE:</span> <span>{{ receiptData.method }}</span>
                    </div>
                    <div v-if="receiptData.method === 'Tunai'" class="flex-row">
                        <span>TUNAI:</span>
                        <span>{{ receiptData.cash.toLocaleString('id-ID') }}</span>
                    </div>
                    <div v-if="receiptData.method === 'Tunai'" class="flex-row">
                        <span>KEMBALI:</span>
                        <span>{{ receiptData.change.toLocaleString('id-ID') }}</span>
                    </div>
                </div>

                <div class="border-dashed mt-2 mb-2"></div>
                <div class="txt-center txt-xs italic mt-4">Terima Kasih Atas Kunjungan Anda!</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* ===== STYLE DASHBOARD ASLI ===== */
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

/* Modifikasi Selector SelectButton agar muat di sidebar */
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

.mobile-cart-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 9999;
    display: flex;
    align-items: flex-end;
    width: 100vw;
    height: 100vh;
}

.mobile-cart-sheet {
    width: 100%;
    border-radius: 20px 20px 0 0;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: var(--surface-card, #ffffff) !important;
    background-color: #ffffff !important;
}

.sheet-handle {
    width: 40px;
    height: 4px;
    border-radius: 2px;
    background: var(--surface-400, #adb5bd);
    margin: 10px auto 0;
    flex-shrink: 0;
}

.sheet-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 18px 8px;
    flex-shrink: 0;
}

.sheet-body {
    overflow-y: auto;
    padding: 0 18px 24px;
    flex: 1;
    -webkit-overflow-scrolling: touch;
}

.sheet-enter-active,
.sheet-leave-active {
    transition: opacity 0.25s ease;
}
.sheet-enter-from,
.sheet-leave-to {
    opacity: 0;
}
.sheet-enter-active .mobile-cart-sheet {
    animation: slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}
.sheet-leave-active .mobile-cart-sheet {
    animation: slideDown 0.25s ease forwards;
}
@keyframes slideUp {
    from {
        transform: translateY(100%);
    }
    to {
        transform: translateY(0);
    }
}
@keyframes slideDown {
    from {
        transform: translateY(0);
    }
    to {
        transform: translateY(100%);
    }
}

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

/* ===== STYLE AREA CETAK (Hanya Aktif Saat Print) ===== */
.print-area {
    display: none;
}

@media print {
    /* Sembunyikan semua elemen layout POS web */
    .no-print {
        display: none !important;
    }
    body,
    html {
        background: #fff !important;
        margin: 0;
        padding: 0;
    }

    /* Munculkan area cetak */
    .print-area {
        display: block !important;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        color: #000;
    }

    /* Ukuran kertas struk thermal (58mm) */
    .receipt-ticket {
        width: 58mm;
        margin: 0;
        padding: 0;
        font-family: 'Courier New', Courier, monospace; /* Font khas mesin kasir */
    }

    /* Utility Class khusus print agar tidak terpengaruh PrimeVue/Tailwind */
    .txt-center {
        text-align: center;
    }
    .txt-xl {
        font-size: 16pt;
    }
    .txt-sm {
        font-size: 10pt;
    }
    .txt-xs {
        font-size: 8pt;
    }
    .bold {
        font-weight: bold;
    }
    .italic {
        font-style: italic;
    }
    .mb-1 {
        margin-bottom: 4px;
    }
    .mb-2 {
        margin-bottom: 8px;
    }
    .mb-3 {
        margin-bottom: 12px;
    }
    .mt-1 {
        margin-top: 4px;
    }
    .mt-2 {
        margin-top: 8px;
    }
    .mt-4 {
        margin-top: 16px;
    }
    .txt-gray {
        color: #555;
    }

    .border-dashed {
        border-top: 1px dashed #000;
        width: 100%;
        height: 1px;
    }

    .flex-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }

    @page {
        margin: 0;
    }
}
</style>
