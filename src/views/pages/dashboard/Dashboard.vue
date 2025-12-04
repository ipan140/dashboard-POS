<script setup>
import { ref } from "vue";
import Chart from "primevue/chart";

/* ---------------- Dummy Chart ---------------- */
const labaKotorData = ref({
  labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"],
  datasets: [
    {
      label: "Laba Kotor",
      data: [3500000, 4100000, 3900000, 4500000, 5200000, 6000000],
      fill: false,
      tension: 0.4,
      borderColor: "#4CAF50"
    }
  ]
});

const labaBersihData = ref({
  labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"],
  datasets: [
    {
      label: "Laba Bersih",
      data: [2200000, 2500000, 2400000, 3000000, 3100000, 3500000],
      backgroundColor: "#42A5F5"
    }
  ]
});

/* ---------------- Dummy Transaksi Hari Ini ---------------- */
const transaksiHariIni = ref([
  { id: "TRX-001", jumlah: 35000, status: "Selesai" },
  { id: "TRX-002", jumlah: 42000, status: "Selesai" },
  { id: "TRX-003", jumlah: 15000, status: "Selesai" },
  { id: "TRX-004", jumlah: 22500, status: "Selesai" },
  { id: "TRX-005", jumlah: 70000, status: "Selesai" }
]);

/* ---------------- Dummy Produk Populer ---------------- */
const produkPopuler = ref([
  { nama: "Es Kopi Susu", harga: 28000, stok: "Tersedia" },
  { nama: "Nasi Goreng Ayam", harga: 35000, stok: "Tersedia" },
  { nama: "Matcha Latte", harga: 30000, stok: "Tersedia" },
  { nama: "Cappuccino", harga: 29000, stok: "Tersedia" },
  { nama: "Croissant Butter", harga: 26000, stok: "Tersedia" }
]);

/* --------- Warna Chart untuk Dark Mode ---------- */
const chartOptions = ref({
  plugins: {
    legend: {
      labels: {
        color: getComputedStyle(document.documentElement).getPropertyValue("--text-color")
      }
    }
  },
  scales: {
    x: {
      ticks: { color: getComputedStyle(document.documentElement).getPropertyValue("--text-color-secondary") },
      grid: { color: getComputedStyle(document.documentElement).getPropertyValue("--divider-color") }
    },
    y: {
      ticks: { color: getComputedStyle(document.documentElement).getPropertyValue("--text-color-secondary") },
      grid: { color: getComputedStyle(document.documentElement).getPropertyValue("--divider-color") }
    }
  }
});
</script>

<template>
  <div class="grid grid-cols-12 gap-8">
    <!-- KOTAK STATISTIK -->
    <StatsWidget />

    <!-- CHART 2 KOTAK -->
    <div class="col-span-12 grid grid-cols-12 gap-6 mt-4">
      <div class="col-span-12 xl:col-span-6">
        <div class="p-6 rounded-xl border bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm">
          <h3 class="text-lg font-semibold mb-4 dark:text-white">Grafik Laba Kotor</h3>
          <Chart type="line" :data="labaKotorData" :options="chartOptions" />
        </div>
      </div>

      <div class="col-span-12 xl:col-span-6">
        <div class="p-6 rounded-xl border bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm">
          <h3 class="text-lg font-semibold mb-4 dark:text-white">Grafik Laba Bersih</h3>
          <Chart type="bar" :data="labaBersihData" :options="chartOptions" />
        </div>
      </div>
    </div>

    <!-- TABEL KIRI (Transaksi Hari Ini) -->
    <div class="col-span-12 xl:col-span-6">
      <div class="rounded-xl p-6 border bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm">
        <h3 class="text-lg font-semibold mb-4 dark:text-white">Transaksi Hari Ini</h3>
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
              <th class="p-3 text-left dark:text-gray-200">ID</th>
              <th class="p-3 text-left dark:text-gray-200">JUMLAH</th>
              <th class="p-3 text-left dark:text-gray-200">STATUS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="trx in transaksiHariIni" :key="trx.id" class="border-b dark:border-gray-700">
              <td class="p-3 dark:text-gray-300">{{ trx.id }}</td>
              <td class="p-3 dark:text-gray-300">Rp {{ trx.jumlah.toLocaleString() }}</td>
              <td class="p-3">
                <span class="px-3 py-1 rounded-full text-xs bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
                  {{ trx.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- TABEL KANAN (Produk Populer) -->
    <div class="col-span-12 xl:col-span-6">
      <div class="rounded-xl p-6 border bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm">
        <h3 class="text-lg font-semibold mb-4 dark:text-white">Produk Populer</h3>
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
              <th class="p-3 text-left dark:text-gray-200">NAMA PRODUK</th>
              <th class="p-3 text-left dark:text-gray-200">HARGA</th>
              <th class="p-3 text-left dark:text-gray-200">STOK</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in produkPopuler" :key="p.nama" class="border-b dark:border-gray-700">
              <td class="p-3 dark:text-gray-300">{{ p.nama }}</td>
              <td class="p-3 dark:text-gray-300">Rp {{ p.harga.toLocaleString() }}</td>
              <td class="p-3">
                <span class="px-3 py-1 rounded-full text-xs bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
                  {{ p.stok }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
