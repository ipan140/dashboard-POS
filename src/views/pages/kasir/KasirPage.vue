<script setup>
import { ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

/* === PRIMEVUE === */
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Divider from 'primevue/divider';

/* === DATA PRODUK === */
const products = ref([
    { id: 1, name: 'Nasi Goreng', category: 'Makanan', price: 25000, stock: 50, img: 'https://picsum.photos/200' },
    { id: 2, name: 'Es Teh', category: 'Minuman', price: 5000, stock: 40, img: 'https://picsum.photos/201' },
    { id: 3, name: 'Ayam Crispy', category: 'Snack', price: 10000, stock: 25, img: 'https://picsum.photos/202' },
    { id: 4, name: 'Kopi Latte', category: 'Minuman', price: 20000, stock: 30, img: 'https://picsum.photos/203' }
]);

const categories = ref(['Semua', 'Makanan', 'Minuman', 'Snack']);
const selectedCategory = ref('Semua');
const query = ref('');

/* === FILTER PRODUK === */
const filteredProducts = computed(() => {
    const q = query.value.toLowerCase();
    return products.value.filter((p) => {
        const matchQ = p.name.toLowerCase().includes(q);
        const matchCat = selectedCategory.value === 'Semua' || p.category === selectedCategory.value;
        return matchQ && matchCat;
    });
});

/* === KERANJANG === */
const cart = ref([]);
const discount = ref(0);
const taxPercent = ref(10);
const payment = ref(0);

const toast = useToast();

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
    const c = await Swal.fire({
        title: 'Batalkan transaksi?',
        icon: 'warning',
        showCancelButton: true
    });
    if (c.isConfirmed) {
        cart.value = [];
        payment.value = 0;
        discount.value = 0;
    }
};

const processTransaction = async () => {
    if (cart.value.length === 0) {
        toast.add({ severity: 'warn', summary: 'Kosong', detail: 'Tidak ada item di keranjang.' });
        return;
    }

    if (payment.value < total.value) {
        toast.add({ severity: 'error', summary: 'Pembayaran', detail: 'Uang tidak cukup.' });
        return;
    }

    const c = await Swal.fire({
        title: 'Proses Transaksi?',
        html: `<b>Total:</b> Rp ${total.value.toLocaleString()}`,
        icon: 'question',
        showCancelButton: true
    });

    if (c.isConfirmed) {
        Swal.fire({
            title: 'Berhasil!',
            text: 'Transaksi selesai.',
            icon: 'success',
            timer: 1400,
            showConfirmButton: false
        });

        cart.value = [];
        payment.value = 0;
        discount.value = 0;
    }
};
</script>

<template>
    <div class="page-wrapper">
        <!-- KOLOM KIRI -->
        <div class="left-panel">
            <!-- HEADER -->
            <div class="surface-card card-box">
                <div class="text-900 text-xl font-semibold mb-1">Kasir POS</div>
                <div class="text-600 text-sm">Sistem Penjualan (Point of Sale)</div>
            </div>

            <!-- FILTER -->
            <div class="surface-card card-box">
                <InputText v-model="query" placeholder="Cari produk..." class="w-full mb-3" />
                <div class="flex flex-wrap gap-2">
                    <Button
                        v-for="c in categories"
                        :key="c"
                        size="small"
                        :label="c"
                        :severity="selectedCategory === c ? 'primary' : 'secondary'"
                        :outlined="selectedCategory !== c"
                        @click="selectedCategory = c"
                    />
                </div>
            </div>

            <!-- PRODUK GRID -->
            <div class="surface-card card-box">
                <div class="product-grid">
                    <div v-for="p in filteredProducts" :key="p.id" class="product-card">
                        <img :src="p.img" class="product-img" />
                        <div class="product-info">
                            <Tag :value="p.category" severity="info" class="w-fit" />
                            <div class="font-medium">{{ p.name }}</div>
                            <div class="text-primary font-bold">Rp {{ p.price.toLocaleString() }}</div>
                            <small class="text-600">Stok: {{ p.stock }}</small>
                            <Button
                                label="Tambah"
                                icon="pi pi-plus"
                                class="p-button-sm"
                                @click="addToCart(p)"
                                :disabled="p.stock === 0"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- KOLOM KANAN -->
        <div class="right-panel surface-card card-box">
            <h3 class="text-lg font-semibold mb-3">Keranjang</h3>

            <div v-if="cart.length === 0" class="p-4 text-center text-500 surface-100 border-round">
                Keranjang masih kosong.
            </div>

            <div v-else>
                <div v-for="item in cart" :key="item.id" class="cart-item">
                    <div>
                        <div class="font-medium">{{ item.name }}</div>
                        <div class="text-500 text-sm">Rp {{ item.price.toLocaleString() }}</div>
                    </div>
                    <div class="flex align-items-center gap-2">
                        <Button icon="pi pi-minus" rounded text @click="changeQty(item, -1)" />
                        <span>{{ item.qty }}</span>
                        <Button icon="pi pi-plus" rounded text @click="changeQty(item, 1)" />
                        <Button icon="pi pi-trash" text severity="danger" @click="removeFromCart(item.id)" />
                    </div>
                </div>

                <Divider />

                <div class="flex justify-content-between mb-2">
                    <span class="text-600">Subtotal</span>
                    <span>Rp {{ subtotal.toLocaleString() }}</span>
                </div>

                <div class="flex justify-content-between mb-2 align-items-center">
                    <span class="text-600">Diskon</span>
                    <InputText type="number" class="w-6rem" v-model.number="discount" />
                </div>

                <div class="flex justify-content-between mb-2">
                    <span class="text-600">Pajak (10%)</span>
                    <span>Rp {{ tax.toLocaleString() }}</span>
                </div>

                <div class="flex justify-content-between font-bold text-primary mb-3">
                    <span>Total</span>
                    <span>Rp {{ total.toLocaleString() }}</span>
                </div>

                <label class="text-sm text-600">Uang Diterima</label>
                <InputText type="number" v-model.number="payment" class="w-full mb-2 mt-1" />

                <div class="p-2 surface-200 border-round text-green-600 font-bold mb-3">
                    Kembalian: Rp {{ change.toLocaleString() }}
                </div>

                <div class="flex flex-column gap-2">
                    <Button label="Proses Transaksi" class="p-button-success" @click="processTransaction" />
                    <Button label="Batalkan" class="p-button-danger p-button-outlined" @click="clearCart" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.page-wrapper {
    display: grid;
    grid-template-columns: 3fr 1.2fr;
    gap: 24px;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
}

.left-panel {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.card-box {
    background: var(--surface-card) !important;
    border-radius: 14px;
    padding: 18px;
    border: 1px solid var(--surface-border);
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

/* PRODUK GRID */
.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
    gap: 20px;
}

.product-card {
    background: var(--surface-ground) !important;
    border: 1px solid var(--surface-border);
    border-radius: 14px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.20);
}

.product-img {
    width: 100%;
    height: 155px;
    object-fit: cover;
}

.product-info {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 12px;
    align-items: start;
}

.product-info .p-button {
    width: 100%;
}

/* KERANJANG */
.right-panel {
    position: sticky;
    top: 20px;
    align-self: start;
    height: fit-content;
    max-height: calc(100vh - 40px);
    overflow-y: auto;
}

.cart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 0;
    border-bottom: 1px solid var(--surface-border);
}

/* RESPONSIVE */
@media (max-width: 1100px) {
    .page-wrapper {
        grid-template-columns: 2fr 1fr;
    }
}

@media (max-width: 900px) {
    .page-wrapper {
        grid-template-columns: 1fr;
    }
    .right-panel {
        position: relative;
        top: 0;
        margin-top: 16px;
    }
}

@media (max-width: 480px) {
    .product-grid {
        grid-template-columns: 1fr;
        gap: 12px;
    }

    .cart-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
}
</style>
