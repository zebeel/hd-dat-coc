<!-- components/contract/ContractPropertySection.vue -->
<template>
  <div class="contract-section">
    <h3>ĐIỀU 1: TÀI SẢN ĐẶT CỌC:</h3>
    <div class="property-box">
      <p>
        Bên A đồng ý bán cho Bên B nhà - đất tại: Thửa đất số: 
        <strong>{{ propertyData.tds || '___' }}</strong>. 
        Tờ bản đồ số: <strong>{{ propertyData.bds || '___' }}</strong>. 
        Diện tích: <strong>{{ propertyData.s || '___' }}</strong> m².
      </p>
      <p>
        Địa chỉ thửa đất: 
        <strong>{{ propertyData.dia_chi_thua_dat || '_________________________' }}</strong>.
      </p>
      <p>
        Kèm giấy chứng nhận QSH - QSD đất số: 
        <strong>{{ propertyData.dat_so || '___' }}</strong>. 
        Tài sản gắn liền với đất: 
        <strong>{{ propertyData.tai_san_gan_lien_dat || '_________________________' }}</strong>.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface PropertyData {
  tds?: string
  bds?: string
  s?: string
  dia_chi_thua_dat?: string
  dat_so?: string
  tai_san_gan_lien_dat?: string
}

interface Props {
  propertyData: PropertyData
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

.property-box {
  /* border: 1px solid #000; */
  /* padding: 1rem;
  margin: 1rem 0; */
  /* background: #fafafa; */
  font-family: 'Times New Roman', serif;
  line-height: 1.6;
}

.property-box p {
  margin: 0.5rem 0;
  font-size: 0.95rem;
  color: #000;
}

.property-box strong {
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
  
  .property-box {
    border: 1px solid #000 !important;
    padding: 8px !important;
    margin: 8px 0 !important;
    background: white !important;
    font-size: 11pt !important;
  }
  
  .property-box p {
    margin: 4px 0 !important;
    font-size: 11pt !important;
  }
}

/* Mobile responsive */
@media (max-width: 640px) {
  .property-box {
    padding: 0.75rem;
    font-size: 0.875rem;
  }
  
  .property-box p {
    font-size: 0.875rem;
    margin: 0.375rem 0;
  }
}

/* Dark mode for preview (not for print) */
@media (prefers-color-scheme: dark) and (not print) {
  .property-box {
    background: #2d3748;
    border-color: #4a5568;
    color: #f7fafc;
  }
  
  .property-box p,
  .property-box strong {
    color: #f7fafc;
  }
  
  .contract-section h3 {
    color: #f7fafc;
  }
}
</style>