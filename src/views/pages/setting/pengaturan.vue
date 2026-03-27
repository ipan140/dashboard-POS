<script setup lang="ts">
import { ref } from 'vue';

import Button from 'primevue/button';
import Card from 'primevue/card';
import Chip from 'primevue/chip';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';

/* =========================
   INFORMASI TOKO
========================= */
const store = ref({
    name: 'WarungKu Sedap',
    address: 'Jl. Kemang Raya No. 88, Jakarta Selatan',
    phone: '+6281234567890',
    email: 'warungku@email.com'
});

/* =========================
   KONFIGURASI
========================= */
const config = ref({
    tax: 10,
    currency: 'IDR',
    receipt: 'Thermal 58mm',
    payments: ['Cash', 'QRIS', 'Transfer']
});

const currencyOptions = [
    { label: 'IDR - Rupiah', value: 'IDR' },
    { label: 'USD - Dollar', value: 'USD' }
];

const receiptOptions = [
    { label: 'Thermal 58mm', value: 'Thermal 58mm' },
    { label: 'Thermal 80mm', value: 'Thermal 80mm' }
];

/* =========================
   ACTION
========================= */
const saveStore = () => {
    console.log('SAVE STORE', store.value);
};

const saveConfig = () => {
    console.log('SAVE CONFIG', config.value);
};

const removePayment = (p: string) => {
    config.value.payments = config.value.payments.filter((x) => x !== p);
};

const addPayment = () => {
    const name = prompt('Tambah metode pembayaran');
    if (!name) return;

    if (!config.value.payments.includes(name)) {
        config.value.payments.push(name);
    }
};
</script>

<template>
    <div class="grid md:grid-cols-2 gap-6">
        <!-- =========================
         INFORMASI TOKO
    ========================= -->
        <Card class="shadow-lg border border-gray-800 bg-[#0f172a] text-white">
            <template #title>
                <div class="flex items-center gap-2">
                    <i class="pi pi-building"></i>
                    <span>Informasi Toko</span>
                </div>
            </template>

            <template #content>
                <div class="flex flex-col gap-4">
                    <div>
                        <label class="text-sm text-gray-400">Nama Toko</label>
                        <InputText v-model="store.name" class="w-full mt-1" />
                    </div>

                    <div>
                        <label class="text-sm text-gray-400">Alamat</label>
                        <Textarea v-model="store.address" rows="3" class="w-full mt-1" />
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="text-sm text-gray-400">Telepon</label>
                            <InputText v-model="store.phone" class="w-full mt-1" />
                        </div>

                        <div>
                            <label class="text-sm text-gray-400">Email</label>
                            <InputText v-model="store.email" class="w-full mt-1" />
                        </div>
                    </div>

                    <Button label="Simpan" icon="pi pi-save" class="mt-3 bg-green-500 border-0" @click="saveStore" />
                </div>
            </template>
        </Card>

        <!-- =========================
         KONFIGURASI SISTEM
    ========================= -->
        <Card class="shadow-lg border border-gray-800 bg-[#0f172a] text-white">
            <template #title>
                <div class="flex items-center gap-2">
                    <i class="pi pi-cog"></i>
                    <span>Konfigurasi Sistem</span>
                </div>
            </template>

            <template #content>
                <div class="flex flex-col gap-4">
                    <div>
                        <label class="text-sm text-gray-400">Pajak (%)</label>
                        <InputNumber v-model="config.tax" class="w-full mt-1" />
                    </div>

                    <div>
                        <label class="text-sm text-gray-400">Mata Uang</label>
                        <Dropdown v-model="config.currency" :options="currencyOptions" optionLabel="label" optionValue="value" class="w-full mt-1" />
                    </div>

                    <div>
                        <label class="text-sm text-gray-400">Format Nota</label>
                        <Dropdown v-model="config.receipt" :options="receiptOptions" optionLabel="label" optionValue="value" class="w-full mt-1" />
                    </div>

                    <!-- PAYMENT -->
                    <div>
                        <label class="text-sm text-gray-400">Mode Pembayaran</label>

                        <div class="flex flex-wrap gap-2 mt-2">
                            <Chip v-for="p in config.payments" :key="p" :label="p" removable @remove="removePayment(p)" class="bg-green-600 text-white" />

                            <Button label="+ Tambah" size="small" severity="info" outlined @click="addPayment" />
                        </div>
                    </div>

                    <Button label="Simpan" icon="pi pi-save" class="mt-3 bg-green-500 border-0" @click="saveConfig" />
                </div>
            </template>
        </Card>
    </div>
</template>
