<!-- components/contract/ContractPaymentSection.vue -->
<template>
  <div class="contract-section">
    <h3>ĐIỀU 2: THỎA THUẬN GIÁ BÁN, CHUYỂN NHƯỢNG:</h3>
    <table class="payment-table-full">
      <tbody>
        <tr>
          <td colspan="2">
            Tổng giá bán: <strong>{{ paymentData.gia_ban || '_______________' }}</strong> 
            (Bằng chữ: <strong>{{ convertToText(paymentData.gia_ban) || '_______________' }}</strong>).
          </td>
        </tr>
        <tr>
          <td colspan="2">
            Bên B cọc số tiền: <strong>{{ paymentData.b_coc_tien || '_______________' }}</strong> 
            (Bằng chữ: <strong>{{ convertToText(paymentData.b_coc_tien) || '_______________' }}</strong>). 
            Hình thức cọc bằng <strong>{{ paymentData.coc_bang || '_______________' }}</strong>
            <span v-if="paymentData.coc_bang === 'Chuyển khoản' && paymentData.coc_ngan_hang">
              vào tài khoản số <strong>{{ paymentData.coc_so_tai_khoan }}</strong>, 
              chủ tài khoản <strong>{{ paymentData.coc_chu_tai_khoan }}</strong>, 
              ngân hàng <strong>{{ paymentData.coc_ngan_hang }}</strong>
            </span>.
          </td>
        </tr>
        <tr>
          <td colspan="2">
            Số tiền còn lại: <strong>{{ paymentData.tien_con_lai || '_______________' }}</strong> 
            (Bằng chữ: <strong>{{ convertToText(paymentData.tien_con_lai) || '_______________' }}</strong>).
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
interface PaymentData {
  gia_ban?: string
  b_coc_tien?: string
  coc_bang?: string
  coc_ngan_hang?: string
  coc_so_tai_khoan?: string
  coc_chu_tai_khoan?: string
  tien_con_lai?: string
}

interface Props {
  paymentData: PaymentData
  convertToText: (value?: string) => string
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

.payment-table-full {
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0;
  font-family: 'Times New Roman', serif;
}

.payment-table-full td {
  padding: 8px 12px;
  vertical-align: top;
  font-size: 0.95rem;
  line-height: 1.5;
  color: #000;
}

.payment-table-full strong {
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
  
  .payment-table-full {
    page-break-inside: avoid;
  }
  
  .payment-table-full td {
    border: 1px solid #000 !important;
    padding: 6px 8px !important;
    font-size: 11pt !important;
  }
}

/* Mobile responsive */
@media (max-width: 640px) {
  .payment-table-full {
    font-size: 0.875rem;
  }
  
  .payment-table-full td {
    padding: 6px 8px;
    font-size: 0.875rem;
  }
}

/* Dark mode for preview (not for print) */
@media (prefers-color-scheme: dark) and (not print) {
  .contract-section h3 {
    color: #f7fafc;
  }
  
  .payment-table-full td,
  .payment-table-full strong {
    color: #f7fafc;
  }
}
</style>