<script setup>
import { ref, computed } from "vue";
import Chart from "primevue/chart";

/* DATA DUMMY — nanti tinggal ganti ambil dari DB */
const transaksi = ref([
  { id: 1, tanggal: "2025-01-10", laba_kotor: 3000000, biaya_operasional: 1200000 },
  { id: 2, tanggal: "2025-01-12", laba_kotor: 2000000, biaya_operasional: 900000 },
]);

const totalLabaKotor = computed(() =>
  transaksi.value.reduce((t, x) => t + x.laba_kotor, 0)
);

const totalOperasional = computed(() =>
  transaksi.value.reduce((t, x) => t + x.biaya_operasional, 0)
);

const totalLabaBersih = computed(() => totalLabaKotor.value - totalOperasional.value);

/* CHART CONFIG */
const chartData = computed(() => ({
  labels: transaksi.value.map((t) => t.tanggal),
  datasets: [
    {
      label: "Laba Kotor",
      data: transaksi.value.map((t) => t.laba_kotor),
      backgroundColor: "#42A5F5",
      borderColor: "#1E88E5",
      fill: false,
    },
    {
      label: "Biaya Operasional",
      data: transaksi.value.map((t) => t.biaya_operasional),
      backgroundColor: "#EF5350",
      borderColor: "#C62828",
      fill: false,
    },
    {
      label: "Laba Bersih",
      data: transaksi.value.map((t) => t.laba_kotor - t.biaya_operasional),
      backgroundColor: "#66BB6A",
      borderColor: "#2E7D32",
      fill: false,
    },
  ],
}));

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
});
</script>

<template>
  <div class="p-5 w-full text-gray-900 dark:text-gray-100">

    <h2 class="text-2xl font-semibold mb-5">Laporan Laba Bersih</h2>

    <!-- STATISTIK -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="p-4 rounded-lg shadow bg-white dark:bg-gray-800">
        <p class="text-sm">Total Laba Kotor</p>
        <p class="text-2xl font-semibold">Rp {{ totalLabaKotor.toLocaleString() }}</p>
      </div>
      <div class="p-4 rounded-lg shadow bg-white dark:bg-gray-800">
        <p class="text-sm">Total Biaya Operasional</p>
        <p class="text-2xl font-semibold text-red-500">Rp {{ totalOperasional.toLocaleString() }}</p>
      </div>
      <div class="p-4 rounded-lg shadow bg-white dark:bg-gray-800">
        <p class="text-sm">Total Laba Bersih</p>
        <p class="text-2xl font-semibold text-green-600">Rp {{ totalLabaBersih.toLocaleString() }}</p>
      </div>
    </div>

    <!-- ⬇️ CHART BARU DITAMBAHKAN -->
    <div class="p-5 rounded-lg shadow bg-white dark:bg-gray-800 mb-6" style="height: 350px;">
      <Chart type="line" :data="chartData" :options="chartOptions" />
    </div>

    <!-- TABLE -->
    <div class="rounded-xl p-5 shadow bg-white dark:bg-gray-800">
      <table class="min-w-full border-collapse">
        <thead>
          <tr class="bg-gray-100 dark:bg-gray-700">
            <th class="p-3 text-left">Tanggal</th>
            <th class="p-3 text-left">Laba Kotor</th>
            <th class="p-3 text-left">Biaya Operasional</th>
            <th class="p-3 text-left">Laba Bersih</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in transaksi" :key="t.id" class="border-b dark:border-gray-700">
            <td class="p-3">{{ t.tanggal }}</td>
            <td class="p-3">Rp {{ t.laba_kotor.toLocaleString() }}</td>
            <td class="p-3 text-red-500">Rp {{ t.biaya_operasional.toLocaleString() }}</td>
            <td class="p-3 font-semibold text-green-600">
              Rp {{ (t.laba_kotor - t.biaya_operasional).toLocaleString() }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>
