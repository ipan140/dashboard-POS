<script setup>
import { ref, computed } from "vue";
import Tag from "primevue/tag";
import Button from "primevue/button";
import InputText from "primevue/inputtext";

// Dummy data
const transaksi = ref([
  { id: 1, tanggal: "09 Nov 2025", total: 75000, kasir: "Andi", status: "Selesai" },
  { id: 2, tanggal: "09 Nov 2025", total: 75000, kasir: "Budi", status: "Selesai" },
  { id: 3, tanggal: "09 Nov 2025", total: 75000, kasir: "Siti", status: "Selesai" },
]);

const search = ref("");

const filteredData = computed(() => {
  if (!search.value) return transaksi.value;
  return transaksi.value.filter((t) =>
    t.kasir.toLowerCase().includes(search.value.toLowerCase()) ||
    String(t.id).includes(search.value)
  );
});

const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(number);
};
</script>

<template>
  <div class="p-4 md:p-6 lg:p-8 w-full transition-all">
    <h2 class="text-xl font-semibold mb-5 text-gray-900 dark:text-gray-100">
      Riwayat Pembelian
    </h2>

    <!-- CARD -->
    <div
      class="card p-6 shadow-md rounded-xl 
             bg-white dark:bg-gray-800
             border border-gray-200 dark:border-gray-700 
             transition-all"
    >
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-200">
          Daftar Transaksi
        </h3>

        <InputText
          v-model="search"
          placeholder="Cari transaksi..."
          class="w-64 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
        />
      </div>

      <!-- TABLE -->
      <div class="overflow-x-auto mt-4">
        <table class="min-w-full border-collapse">
          <thead>
            <tr
              class="bg-gray-100 dark:bg-gray-700
                     text-left text-gray-700 dark:text-gray-200"
            >
              <th class="p-3">ID</th>
              <th class="p-3">Tanggal</th>
              <th class="p-3">Total</th>
              <th class="p-3">Kasir</th>
              <th class="p-3">Status</th>
              <th class="p-3">Aksi</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="t in filteredData"
              :key="t.id"
              class="border-b
                     border-gray-200 dark:border-gray-700
                     hover:bg-gray-50 dark:hover:bg-gray-700/50
                     text-gray-900 dark:text-gray-100"
            >
              <td class="p-3">{{ t.id }}</td>
              <td class="p-3">{{ t.tanggal }}</td>
              <td class="p-3">{{ formatRupiah(t.total) }}</td>
              <td class="p-3">{{ t.kasir }}</td>
              <td class="p-3">
                <Tag value="Selesai" severity="success" />
              </td>
              <td class="p-3">
                <Button
                  label="Detail"
                  size="small"
                  class="p-button-text dark:text-blue-400"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <!-- jika tidak ada data -->
        <div
          v-if="filteredData.length === 0"
          class="text-center py-6 text-gray-500 dark:text-gray-400"
        >
          Tidak ada data transaksi.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border-radius: 14px;
}
</style>
