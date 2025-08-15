<!-- components/contract/ContractPartySection.vue -->
<template>
  <div class="contract-section">
    <h3>{{ title }}</h3>
    <table class="party-table">
      <tbody>
        <tr>
          <td>Ông: <strong>{{ partyData.ong || '_________________________' }}</strong></td>
          <td>Sinh ngày: <strong>{{ formatDate(partyData.ong_sinh_ngay) || '__________' }}</strong></td>
        </tr>
        <tr>
          <td>CCCD Số: <strong>{{ partyData.ong_cccd || '______________' }}</strong></td>
          <td>Cấp ngày: <strong>{{ formatDate(partyData.ong_cap_ngay) || '__________' }}</strong></td>
          <td>Nơi cấp: <strong>{{ partyData.ong_noi_cap || '__________' }}</strong></td>
        </tr>
        
        <!-- Bà (nếu có) -->
        <tr v-if="partyData.ba">
          <td>Và Bà: <strong>{{ partyData.ba }}</strong></td>
          <td>Sinh ngày: <strong>{{ formatDate(partyData.ba_sinh_ngay) || '__________' }}</strong></td>
        </tr>
        <tr v-if="partyData.ba">
          <td>CCCD Số: <strong>{{ partyData.ba_cccd || '______________' }}</strong></td>
          <td>Cấp ngày: <strong>{{ formatDate(partyData.ba_cap_ngay) || '__________' }}</strong></td>
          <td>Nơi cấp: <strong>{{ partyData.ba_noi_cap || '__________' }}</strong></td>
        </tr>
        
        <tr>
          <td colspan="3">Địa chỉ thường trú: <strong>{{ partyData.dia_chi || '_________________________' }}</strong></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
interface PartyData {
  ong?: string
  ong_sinh_ngay?: string
  ong_cccd?: string
  ong_cap_ngay?: string
  ong_noi_cap?: string
  ba?: string
  ba_sinh_ngay?: string
  ba_cccd?: string
  ba_cap_ngay?: string
  ba_noi_cap?: string
  dia_chi?: string
}

interface Props {
  title: string
  partyData: PartyData
}

defineProps<Props>()

const formatDate = (dateString?: string): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''
  
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}
</script>

<style scoped>
.contract-section {
  margin: 1.5rem 0;
  page-break-inside: avoid;
}

.contract-section h3 {
  font-weight: bold;
  margin: 1rem 0 0.5rem 0;
  font-size: 1rem;
  color: #000;
}

.party-table {
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0;
  font-family: 'Times New Roman', serif;
}

.party-table td {
  padding: 8px 4px;
  vertical-align: top;
  font-size: 0.95rem;
  line-height: 1.4;
}

.party-table strong {
  font-weight: bold;
}

/* Print styles */
@media print {
  .party-table {
    page-break-inside: avoid;
  }
  
  .party-table td {
    border: 1px solid #000 !important;
    padding: 6px !important;
    font-size: 11pt !important;
  }
  
  .contract-section {
    page-break-inside: avoid;
    margin: 15px 0;
  }
  
  .contract-section h3 {
    font-size: 11pt !important;
    margin: 10px 0 6px 0 !important;
  }
}

/* Mobile responsive */
@media (max-width: 640px) {
  .party-table {
    font-size: 0.875rem;
  }
  
  .party-table td {
    padding: 6px 2px;
    font-size: 0.875rem;
  }
}
</style>