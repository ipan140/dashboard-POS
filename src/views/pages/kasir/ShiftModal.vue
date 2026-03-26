<script setup>
import { useToast } from 'primevue/usetoast';
import { computed, ref } from 'vue';

/* === PRIMEVUE === */
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Divider from 'primevue/divider';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';
import Textarea from 'primevue/textarea';

const toast = useToast();

// Props & Emits untuk berkomunikasi dengan Kasir.vue
const props = defineProps({
    isShiftOpen: Boolean,
    totalCashSales: Number
});
const emit = defineEmits(['update:isShiftOpen', 'shift-closed']);

/* === STATE SHIFT === */
const showOpenShiftModal = ref(true);
const showCloseShiftModal = ref(false);

const shiftData = ref({
    kasirName: 'Ivano (Admin)',
    startTime: null,
    startingCash: null,
    actualCash: null,
    closingNote: ''
});

const expectedCash = computed(() => {
    return (shiftData.value.startingCash || 0) + (props.totalCashSales || 0);
});

const cashDifference = computed(() => {
    if (!shiftData.value.actualCash) return 0;
    return shiftData.value.actualCash - expectedCash.value;
});

/* === ACTIONS === */
const openShift = () => {
    if (shiftData.value.startingCash === null || shiftData.value.startingCash < 0) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Masukkan nominal modal awal laci!', life: 3000 });
        return;
    }
    shiftData.value.startTime = new Date().toLocaleString('id-ID');
    emit('update:isShiftOpen', true);
    showOpenShiftModal.value = false;

    toast.add({ severity: 'success', summary: 'Shift Dimulai', detail: `Selamat bertugas, ${shiftData.value.kasirName}!`, life: 3000 });
};

const closeShift = () => {
    if (shiftData.value.actualCash === null) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Masukkan total uang fisik di laci!', life: 3000 });
        return;
    }

    console.log('Rekap Shift:', {
        ...shiftData.value,
        totalCashSales: props.totalCashSales,
        expectedCash: expectedCash.value,
        difference: cashDifference.value,
        endTime: new Date().toLocaleString('id-ID')
    });

    toast.add({ severity: 'success', summary: 'Shift Ditutup', detail: 'Data shift berhasil direkap.', life: 3000 });

    // Kunci kembali halaman kasir & reset state
    emit('update:isShiftOpen', false);
    emit('shift-closed'); // Memberitahu Kasir.vue agar mereset pendapatan tunai
    showCloseShiftModal.value = false;
    showOpenShiftModal.value = true;

    shiftData.value.startingCash = null;
    shiftData.value.actualCash = null;
    shiftData.value.closingNote = '';
};

// Expose fungsi ini agar tombol "Tutup Shift" di Kasir.vue bisa memanggil modal ini
const triggerCloseModal = () => {
    showCloseShiftModal.value = true;
};
defineExpose({ triggerCloseModal });
</script>

<template>
    <Dialog v-model:visible="showOpenShiftModal" modal header="Mulai Shift Kasir" :style="{ width: '400px' }" :closable="false" :closeOnEscape="false" class="no-print">
        <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 0.5rem">
            <div style="background: var(--blue-50); padding: 1rem; border-radius: 8px; text-align: center; border: 1px solid var(--blue-200)">
                <i class="pi pi-lock" style="font-size: 2rem; color: var(--blue-500); margin-bottom: 0.5rem"></i>
                <p style="font-size: 0.85rem; color: var(--text-color); margin: 0">Masukkan saldo awal di laci kasir (Modal Kembalian) sebelum memulai transaksi.</p>
            </div>
            <div>
                <label style="font-size: 0.85rem; font-weight: 600; margin-bottom: 0.4rem; display: block">Nama Kasir</label>
                <InputText :value="shiftData.kasirName" disabled style="width: 100%; background: var(--surface-200)" />
            </div>
            <div>
                <label style="font-size: 0.85rem; font-weight: 600; margin-bottom: 0.4rem; display: block">Modal Awal Laci (Rp)</label>
                <InputNumber v-model="shiftData.startingCash" inputId="currency-id" mode="currency" currency="IDR" locale="id-ID" style="width: 100%" inputStyle="font-weight: bold; font-size: 1.2rem;" autofocus placeholder="Contoh: 150.000" />
            </div>
        </div>
        <template #footer>
            <Button label="Buka Shift Sekarang" icon="pi pi-unlock" style="width: 100%" size="large" @click="openShift" />
        </template>
    </Dialog>

    <Dialog v-model:visible="showCloseShiftModal" modal header="Tutup Shift Kasir" :style="{ width: '500px' }" class="no-print">
        <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 0.5rem">
            <div style="background: var(--surface-100); padding: 1rem; border-radius: 8px; border: 1px solid var(--surface-border); font-size: 0.9rem">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem">
                    <span style="color: var(--text-color-secondary)">Mulai Shift</span>
                    <span style="font-weight: bold">{{ shiftData.startTime }}</span>
                </div>
                <Divider style="margin: 0.5rem 0" />
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem">
                    <span style="color: var(--text-color-secondary)">Modal Awal</span>
                    <span style="font-weight: bold">Rp {{ (shiftData.startingCash || 0).toLocaleString('id-ID') }}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem">
                    <span style="color: var(--text-color-secondary)">Penjualan Tunai (+)</span>
                    <span style="font-weight: bold; color: var(--green-500)">Rp {{ (props.totalCashSales || 0).toLocaleString('id-ID') }}</span>
                </div>
                <div style="display: flex; justify-content: space-between; background: var(--surface-200); padding: 0.5rem; border-radius: 4px; margin-top: 0.5rem; font-weight: bold; font-size: 1.1rem">
                    <span>Uang Fisik Seharusnya</span>
                    <span style="color: var(--blue-500)">Rp {{ expectedCash.toLocaleString('id-ID') }}</span>
                </div>
            </div>

            <div style="border: 2px dashed var(--surface-border); padding: 1rem; border-radius: 8px; text-align: center">
                <label style="font-size: 0.85rem; font-weight: 600; display: block; margin-bottom: 0.5rem">Hitung Uang Fisik di Laci Sekarang</label>
                <InputNumber v-model="shiftData.actualCash" mode="currency" currency="IDR" locale="id-ID" style="width: 100%" inputStyle="text-align: center; font-weight: bold; font-size: 1.5rem;" placeholder="Masukkan uang fisik..." />

                <div v-if="shiftData.actualCash !== null" style="margin-top: 1rem">
                    <Tag v-if="cashDifference === 0" severity="success" value="Sesuai (Balance)" style="padding: 0.5rem 1rem; font-size: 0.9rem" />
                    <Tag v-else-if="cashDifference > 0" severity="info" :value="`Lebih: Rp ${cashDifference.toLocaleString('id-ID')}`" style="padding: 0.5rem 1rem; font-size: 0.9rem" />
                    <Tag v-else severity="danger" :value="`Kurang (Minus): Rp ${Math.abs(cashDifference).toLocaleString('id-ID')}`" style="padding: 0.5rem 1rem; font-size: 0.9rem" />
                </div>
            </div>

            <div>
                <label style="font-size: 0.85rem; font-weight: 600; margin-bottom: 0.4rem; display: block">Catatan Tambahan (Opsional)</label>
                <Textarea v-model="shiftData.closingNote" rows="2" style="width: 100%; resize: vertical" placeholder="Tulis alasan jika ada selisih uang..." />
            </div>
        </div>
        <template #footer>
            <Button label="Batal" outlined severity="secondary" @click="showCloseShiftModal = false" />
            <Button label="Konfirmasi & Tutup" icon="pi pi-check" severity="danger" @click="closeShift" />
        </template>
    </Dialog>
</template>
