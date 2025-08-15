<!-- components/contract/ContractTermsSection.vue -->
<template>
  <div class="contract-section">
    <h3>ĐIỀU 3: THỜI HẠN ĐẶT CỌC - THANH TOÁN:</h3>
    <div class="terms-content">
      <p>
        Thời hạn đặt cọc là: <strong>{{ termsData.so_ngay_coc || '___' }}</strong> (ngày), 
        kể từ ngày <strong>{{ formatDate(termsData.ke_tu_ngay) || '___' }}</strong> 
        đến ngày <strong>{{ formatDate(termsData.den_ngay) || '___' }}</strong>
      </p>
      
      <p>
        Trong thời gian đặt cọc này, Bên A và Bên B sẽ tiến hành làm thủ tục công chứng 
        tại cơ quan nhà nước có thẩm quyền. Khi thủ tục công chứng hoàn tất, 
        Bên B phải giao đủ số tiền còn lại cho Bên A.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TermsData {
  so_ngay_coc?: number | string
  ke_tu_ngay?: string
  den_ngay?: string
}

interface Props {
  termsData: TermsData
  formatDate: (dateString?: string) => string
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

.terms-content {
  font-family: 'Times New Roman', serif;
  line-height: 1.6;
}

.terms-content p {
  margin: 0.75rem 0;
  font-size: 0.95rem;
  color: #000;
  text-align: justify;
}

.terms-content strong {
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
  
  .terms-content p {
    margin: 6px 0 !important;
    font-size: 11pt !important;
  }
}

/* Mobile responsive */
@media (max-width: 640px) {
  .terms-content p {
    font-size: 0.875rem;
    margin: 0.5rem 0;
  }
}

/* Dark mode for preview (not for print) */
@media (prefers-color-scheme: dark) and (not print) {
  .contract-section h3 {
    color: #f7fafc;
  }
  
  .terms-content p,
  .terms-content strong {
    color: #f7fafc;
  }
}
</style>