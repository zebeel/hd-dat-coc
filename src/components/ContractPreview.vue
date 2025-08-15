<!-- components/ContractPreview.vue -->
<template>
  <div class="preview-card">
    <div class="card-header">
      <h3>
        <i class="fas fa-file-alt" aria-hidden="true"></i> 
        Xem trước hợp đồng
      </h3>
      
      <div v-if="hasPreview" class="action-buttons">
        <button 
          @click="$emit('download')" 
          class="btn btn-success"
          :aria-label="'Tải xuống hợp đồng dưới định dạng DOCX'"
        >
          <i class="fas fa-download" aria-hidden="true"></i>
          <span class="btn-text">Tải DOCX</span>
        </button>
        <button 
          @click="$emit('print')" 
          class="btn btn-warning"
          :aria-label="'In hợp đồng'"
        >
          <i class="fas fa-print" aria-hidden="true"></i>
          <span class="btn-text">In</span>
        </button>
      </div>
    </div>
    
    <div class="preview-content">
      <!-- Placeholder when no preview -->
      <div v-if="!hasPreview" class="preview-placeholder">
        <div class="placeholder-icon">
          <i class="fas fa-file-contract" aria-hidden="true"></i>
        </div>
        <h4>Chưa có bản xem trước</h4>
        <p>Điền thông tin và nhấn "Xem trước hợp đồng" để tạo bản xem trước</p>
      </div>
      
      <!-- Contract Preview -->
      <div v-else ref="previewRef" class="contract-preview">
        <div class="contract-document">
          <!-- Contract Header -->
          <div class="contract-header">
            <h1>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h1>
            <p class="underline">Độc Lập - Tự Do - Hạnh Phúc</p>
            <h2>HỢP ĐỒNG ĐẶT CỌC</h2>
            <p class="subtitle">(V/v: Chuyển nhượng quyền sử dụng đất và tài sản gắn liền với đất)</p>
          </div>
          
          <!-- Contract Body -->
          <div class="contract-body">
            <!-- Date and Location -->
            <p class="contract-date">
              Hôm nay, ngày <strong>{{ getDatePart(formData.ngay_ky, 'day') }}</strong>  
              tháng <strong>{{ getDatePart(formData.ngay_ky, 'month') }}</strong>  
              năm <strong>{{ getDatePart(formData.ngay_ky, 'year') }}</strong>. 
              Tại <strong>{{ formData.tai_dia_chi || '_________________________' }}</strong>.
            </p>
            
            <!-- Party A -->
            <ContractPartySection
              title="Bên nhận đặt cọc (Bên A):"
              :partyData="{
                ong: formData.a_ong,
                ong_sinh_ngay: formData.a_ong_sinh_ngay,
                ong_cccd: formData.a_ong_cccd,
                ong_cap_ngay: formData.a_ong_cap_ngay,
                ong_noi_cap: formData.a_ong_noi_cap,
                ba: formData.a_ba,
                ba_sinh_ngay: formData.a_ba_sinh_ngay,
                ba_cccd: formData.a_ba_cccd,
                ba_cap_ngay: formData.a_ba_cap_ngay,
                ba_noi_cap: formData.a_ba_noi_cap,
                dia_chi: formData.a_dia_chi
              }"
            />
            
            <!-- Party B -->
            <ContractPartySection
              title="Bên đặt cọc (Bên B):"
              :partyData="{
                ong: formData.b_ong,
                ong_sinh_ngay: formData.b_ong_sinh_ngay,
                ong_cccd: formData.b_ong_cccd,
                ong_cap_ngay: formData.b_ong_cap_ngay,
                ong_noi_cap: formData.b_ong_noi_cap,
                dia_chi: formData.b_dia_chi
              }"
            />
            
            <!-- Party C (optional) -->
            <ContractPartySection
              v-if="formData.c_ong"
              title="Người làm chứng (Bên C):"
              :partyData="{
                ong: formData.c_ong,
                ong_sinh_ngay: formData.c_ong_sinh_ngay,
                ong_cccd: formData.c_ong_cccd,
                ong_cap_ngay: formData.c_ong_cap_ngay,
                ong_noi_cap: formData.c_ong_noi_cap,
                dia_chi: formData.c_dia_chi
              }"
            />
            
            <p><em>Hai bên đồng ý thực hiện việc đặt cọc theo các thỏa thuận sau đây:</em></p>
            
            <!-- Property Section -->
            <ContractPropertySection 
              :propertyData="{
                tds: formData.tds,
                bds: formData.bds,
                s: formData.s,
                dia_chi_thua_dat: formData.dia_chi_thua_dat,
                dat_so: formData.dat_so,
                tai_san_gan_lien_dat: formData.tai_san_gan_lien_dat
              }"
            />
            
            <!-- Payment Section -->
            <ContractPaymentSection 
              :paymentData="{
                gia_ban: formData.gia_ban,
                b_coc_tien: formData.b_coc_tien,
                coc_bang: formData.coc_bang,
                coc_ngan_hang: formData.coc_ngan_hang,
                coc_so_tai_khoan: formData.coc_so_tai_khoan,
                coc_chu_tai_khoan: formData.coc_chu_tai_khoan,
                tien_con_lai: calculatedFields.tien_con_lai
              }"
              :convertToText="convertToText"
            />
            
            <!-- Terms Section -->
            <ContractTermsSection 
              :termsData="{
                so_ngay_coc: formData.so_ngay_coc,
                ke_tu_ngay: formData.ke_tu_ngay,
                den_ngay: calculatedFields.den_ngay
              }"
              :formatDate="formatDate"
            />
            
            <!-- Tax Section -->
            <ContractTaxSection 
              :taxData="{
                tb: formData.tb,
                tncn: formData.tncn,
                pnn: formData.pnn,
                cc: formData.cc,
                ben_a: formData.ben_a,
                ben_b: formData.ben_b,
                thoa_thuan_khac: formData.thoa_thuan_khac
              }"
            />
            
            <!-- Commitment Section -->
            <ContractCommitmentSection 
              :commitmentData="{
                x: formData.x,
                b_coc_tien: formData.b_coc_tien,
                boi_thuong: calculatedFields.boi_thuong,
                tien_c: formData.tien_c
              }"
              :convertToText="convertToText"
              :convertNumberToText="convertNumberToText"
            />
          </div>
          
          <!-- Signature Section -->
          <ContractSignatureSection />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FormData } from '../config/formConfig'
import ContractPartySection from './contract/ContractPartySection.vue'
import ContractPropertySection from './contract/ContractPropertySection.vue'
import ContractPaymentSection from './contract/ContractPaymentSection.vue'
import ContractTermsSection from './contract/ContractTermsSection.vue'
import ContractTaxSection from './contract/ContractTaxSection.vue'
import ContractCommitmentSection from './contract/ContractCommitmentSection.vue'
import ContractSignatureSection from './contract/ContractSignatureSection.vue'

interface Props {
  hasPreview: boolean
  formData: FormData
  calculatedFields: {
    tien_con_lai: string
    boi_thuong: string
    den_ngay: string
  }
}

interface Emits {
  (e: 'download'): void
  (e: 'print'): void
}

defineProps<Props>()
defineEmits<Emits>()

const previewRef = ref<HTMLElement>()

// Helper functions (you may want to move these to a shared utility)
const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''
  
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

const getDatePart = (dateString: string, part: 'day' | 'month' | 'year'): string => {
  if (!dateString) return part === 'year' ? '____' : '__'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return part === 'year' ? '____' : '__'
  
  if (part === 'day') return date.getDate().toString()
  if (part === 'month') return (date.getMonth() + 1).toString()
  if (part === 'year') return date.getFullYear().toString()
  return '__'
}

// These should ideally come from the calculations composable
const convertToText = (input: string): string => {
  // Simplified implementation - use the full implementation from useFormCalculations
  return input ? `${input} (bằng chữ)` : ''
}

const convertNumberToText = (num: string | number): string => {
  const numberMap: Record<string, string> = {
    '1': 'một', '2': 'hai', '3': 'ba', '4': 'bốn', '5': 'năm',
    '6': 'sáu', '7': 'bảy', '8': 'tám', '9': 'chín', '10': 'mười'
  }
  return numberMap[num?.toString()] || num?.toString() || ''
}

defineExpose({
  previewRef
})
</script>

<style scoped>
.preview-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: fit-content;
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #f7fafc, #edf2f7);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.card-header h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-text {
  display: none;
}

@media (min-width: 640px) {
  .btn-text {
    display: inline;
  }
}

.preview-content {
  padding: 1.5rem;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  scroll-behavior: smooth;
}

.preview-placeholder {
  text-align: center;
  padding: 4rem 2rem;
  color: #718096;
}

.placeholder-icon {
  font-size: 4rem;
  color: #cbd5e0;
  margin-bottom: 1rem;
}

.preview-placeholder h4 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.contract-preview {
  background: white;
}

.contract-document {
  max-width: 210mm;
  margin: 0 auto;
  padding: 20mm;
  background: white;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  font-family: 'Times New Roman', serif;
  line-height: 1.6;
  color: #000;
}

.contract-header {
  text-align: center;
  margin-bottom: 2rem;
}

.contract-header h1 {
  font-size: 1.1rem;
  font-weight: bold;
  margin: 0 0 0.5rem 0;
}

.contract-header h2 {
  font-size: 1.3rem;
  font-weight: bold;
  margin: 1.5rem 0 0.5rem 0;
}

.contract-header .underline {
  text-decoration: underline;
  font-weight: bold;
}

.contract-header .subtitle {
  font-style: italic;
  margin-top: 0.5rem;
}

.contract-body {
  text-align: left;
}

.contract-date {
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

/* Responsive adjustments */
@media (max-width: 1023px) {
  .contract-document {
    padding: 1rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 640px) {
  .card-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .action-buttons {
    justify-content: stretch;
  }
  
  .action-buttons .btn {
    flex: 1;
  }
}

/* Print styles */
@media print {
  .card-header,
  .action-buttons {
    display: none !important;
  }
  
  .preview-content {
    padding: 0;
    max-height: none;
    overflow: visible;
  }
  
  .contract-document {
    box-shadow: none;
    margin: 0;
    padding: 0;
    max-width: none;
  }
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .preview-card {
    background: #2d3748;
    color: white;
  }
  
  .card-header {
    background: linear-gradient(135deg, #2d3748, #4a5568);
    border-bottom-color: #4a5568;
  }
  
  .card-header h3 {
    color: #f7fafc;
  }
  
  .preview-placeholder {
    color: #a0aec0;
  }
  
  .preview-placeholder h4 {
    color: #e2e8f0;
  }
}
</style>