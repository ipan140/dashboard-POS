<script setup>
import { ref, computed } from "vue";
import Chart from "primevue/chart";

/* DATA DUMMY — nanti tinggal ganti ambil dari DB */
const transaksi = ref([
  { id: 1, tanggal: "2025-01-10", penjualan: 7500000, hpp: 4500000, beban: 1200000 },
  { id: 2, tanggal: "2025-01-12", penjualan: 5100000, hpp: 3100000, beban: 900000 },
]);

const totalPenjualan = computed(() =>
  transaksi.value.reduce((t, x) => t + x.penjualan, 0)
);
const totalHPP = computed(() =>
  transaksi.value.reduce((t, x) => t + x.hpp, 0)
);
const totalBeban = computed(() =>
  transaksi.value.reduce((t, x) => t + x.beban, 0)
);

const totalLabaKotor = computed(() => totalPenjualan.value - totalHPP.value);
const totalLabaBersih = computed(() => totalLabaKotor.value - totalBeban.value);

/* CHART CONFIG */
const chartData = computed(() => ({
  labels: transaksi.value.map((t) => t.tanggal),
  datasets: [
    {
      label: "Laba Kotor",
      data: transaksi.value.map((t) => t.penjualan - t.hpp),
      backgroundColor: "#42A5F5",
      borderColor: "#1976D2",
      fill: false,
    },
    {
      label: "Beban Operasional",
      data: transaksi.value.map((t) => t.beban),
      backgroundColor: "#EF5350",
      borderColor: "#C62828",
      fill: false,
    },
    {
      label: "Laba Bersih",
      data: transaksi.value.map((t) => t.penjualan - t.hpp - t.beban),
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
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="p-4 rounded-lg shadow bg-white dark:bg-gray-800">
        <p class="text-sm">Total Penjualan</p>
        <p class="text-2xl font-semibold">Rp {{ totalPenjualan.toLocaleString() }}</p>
      </div>
      <div class="p-4 rounded-lg shadow bg-white dark:bg-gray-800">
        <p class="text-sm">Total HPP</p>
        <p class="text-2xl font-semibold text-red-500">Rp {{ totalHPP.toLocaleString() }}</p>
      </div>
      <div class="p-4 rounded-lg shadow bg-white dark:bg-gray-800">
        <p class="text-sm">Total Beban</p>
        <p class="text-2xl font-semibold text-orange-500">Rp {{ totalBeban.toLocaleString() }}</p>
      </div>
      <div class="p-4 rounded-lg shadow bg-white dark:bg-gray-800">
        <p class="text-sm">Total Laba Bersih</p>
        <p class="text-2xl font-semibold text-green-600">Rp {{ totalLabaBersih.toLocaleString() }}</p>
      </div>
    </div>

    <!-- CHART -->
    <div class="p-5 rounded-lg shadow bg-white dark:bg-gray-800 mb-6" style="height: 350px;">
      <Chart type="line" :data="chartData" :options="chartOptions" />
    </div>

    <!-- TABLE -->
    <div class="rounded-xl p-5 shadow bg-white dark:bg-gray-800">
      <table class="min-w-full border-collapse">
        <thead>
          <tr class="bg-gray-100 dark:bg-gray-700">
            <th class="p-3 text-left">Tanggal</th>
            <th class="p-3 text-left">Penjualan</th>
            <th class="p-3 text-left">HPP</th>
            <th class="p-3 text-left">Beban</th>
            <th class="p-3 text-left">Laba Bersih</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in transaksi" :key="t.id" class="border-b dark:border-gray-700">
            <td class="p-3">{{ t.tanggal }}</td>
            <td class="p-3">Rp {{ t.penjualan.toLocaleString() }}</td>
            <td class="p-3 text-red-500">Rp {{ t.hpp.toLocaleString() }}</td>
            <td class="p-3 text-orange-500">Rp {{ t.beban.toLocaleString() }}</td>
            <td class="p-3 font-semibold text-green-600">
              Rp {{ (t.penjualan - t.hpp - t.beban).toLocaleString() }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>
