<!-- components/contract/ContractTaxSection.vue -->
<template>
  <div class="contract-section">
    <h3>ĐIỀU 4: THỎA THUẬN VỀ THUẾ VÀ LỆ PHÍ:</h3>
    <table class="tax-table-full">
      <thead>
        <tr>
          <th>Lệ phí trước bạ</th>
          <th>Thuế thu nhập cá nhân</th>
          <th>Thuế phí nông nghiệp</th>
          <th>Phí công chứng</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Bên <strong>{{ taxData.tb || '___' }}</strong> đóng</td>
          <td>Bên <strong>{{ taxData.tncn || '___' }}</strong> đóng</td>
          <td>Bên <strong>{{ taxData.pnn || '___' }}</strong> đóng</td>
          <td>Bên <strong>{{ taxData.cc || '___' }}</strong> đóng</td>
        </tr>
        <tr>
          <td colspan="4" class="agreement-row">
            Bên A: <strong>{{ taxData.ben_a || '_______________' }}</strong>.
          </td>
        </tr>
        <tr>
          <td colspan="4" class="agreement-row">
            Bên B: <strong>{{ taxData.ben_b || '_______________' }}</strong>.
          </td>
        </tr>
        <tr v-if="taxData.thoa_thuan_khac">
          <td colspan="4" class="agreement-row">
            Thỏa thuận khác: <strong>{{ taxData.thoa_thuan_khac }}</strong>.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
interface TaxData {
  tb?: string
  tncn?: string
  pnn?: string
  cc?: string
  ben_a?: string
  ben_b?: string
  thoa_thuan_khac?: string
}

interface Props {
  taxData: TaxData
}

defineProps<Props>()
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
  font-family: 'Times New Roman', serif;
}

.tax-table-full {
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0;
  font-family: 'Times New Roman', serif;
}

.tax-table-full th,
.tax-table-full td {
  padding: 8px 6px;
  text-align: center;
  vertical-align: middle;
  font-size: 0.9rem;
  line-height: 1.4;
  color: #000;
}

.tax-table-full th {
  background-color: #f5f5f5;
  font-weight: bold;
  border: 1px solid #ccc;
}

.tax-table-full td {
  border: 1px solid #ccc;
}

.tax-table-full .agreement-row {
  text-align: left;
  font-size: 0.95rem;
  padding: 8px 10px;
}

.tax-table-full strong {
  font-weight: bold;
  color: #000;
}

/* Print styles */
@media print {
  .contract-section {
    page-break-inside: avoid;
    margin: 15px 0;
  }
  
  .contract-section h3 {
    font-size: 11pt !important;
    margin: 10px 0 6px 0 !important;
  }
  
  .tax-table-full {
    page-break-inside: avoid;
  }
  
  .tax-table-full th,
  .tax-table-full td {
    border: 1px solid #000 !important;
    padding: 4px 6px !important;
    font-size: 10pt !important;
  }
  
  .tax-table-full th {
    background-color: #f0f0f0 !important;
  }
  
  .tax-table-full .agreement-row {
    font-size: 10pt !important;
    padding: 4px 6px !important;
  }
}

/* Mobile responsive */
@media (max-width: 640px) {
  .tax-table-full {
    font-size: 0.8rem;
  }
  
  .tax-table-full th,
  .tax-table-full td {
    padding: 6px 4px;
    font-size: 0.8rem;
  }
  
  .tax-table-full .agreement-row {
    font-size: 0.85rem;
    padding: 6px 6px;
  }
  
  /* Stack table on very small screens */
  @media (max-width: 480px) {
    .tax-table-full,
    .tax-table-full thead,
    .tax-table-full tbody,
    .tax-table-full th,
    .tax-table-full td,
    .tax-table-full tr {
      display: block;
    }
    
    .tax-table-full thead tr {
      position: absolute;
      top: -9999px;
      left: -9999px;
    }
    
    .tax-table-full tr {
      border: 1px solid #ccc;
      margin-bottom: 10px;
      padding: 10px;
    }
    
    .tax-table-full td {
      border: none;
      position: relative;
      padding-left: 50% !important;
      text-align: left !important;
    }
    
    .tax-table-full td:before {
      content: attr(data-label) ": ";
      position: absolute;
      left: 6px;
      width: 45%;
      padding-right: 10px;
      white-space: nowrap;
      font-weight: bold;
    }
  }
}

/* Dark mode for preview (not for print) */
@media (prefers-color-scheme: dark) and (not print) {
  .contract-section h3 {
    color: #f7fafc;
  }
  
  .tax-table-full th {
    background-color: #4a5568;
    color: #f7fafc;
    border-color: #718096;
  }
  
  .tax-table-full td {
    color: #f7fafc;
    border-color: #718096;
  }
  
  .tax-table-full strong {
    color: #f7fafc;
  }
}
</style>