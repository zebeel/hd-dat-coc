<!-- components/contract/ContractCommitmentSection.vue -->
<template>
  <div class="contract-section">
    <h3>Cam kết chung:</h3>
    <div class="commitment-content">
      <p>
        Bên A cam kết tài sản trên thuộc quyền sở hữu của mình, có đầy đủ các giấy tờ liên quan 
        để chứng minh và Bên A cam đoan tài sản này không có tranh chấp thừa kế, không dính quy hoạch, 
        không có tranh chấp với bất kỳ cơ quan tổ chức, cá nhân nào.
      </p>
      
      <p>
        Sau khi Hợp đồng được ký kết, quá thời hạn thỏa thuận nêu trên nếu Bên A không chuyển nhượng 
        tài sản đặt cọc trên cho Bên B thì Bên A phải bồi thường cho Bên B gấp 
        <strong>{{ commitmentData.x || '___' }}</strong> 
        (<strong>{{ convertNumberToText(commitmentData.x) || '___' }}</strong>) 
        lần số tiền mà Bên B đã đặt cọc cho Bên A. 
        Tổng số tiền hoàn trả và bồi thường là 
        <strong>{{ commitmentData.boi_thuong || '___' }}</strong> 
        (Bằng chữ: <strong>{{ convertToText(commitmentData.boi_thuong) || '___' }}</strong>).
      </p>
      
      <p>
        Ngược lại, nếu Bên B không tiến hành mua thì phải chịu mất số tiền đã đặt cọc. 
        Bên B có quyền chỉ định người đứng tên nhận chuyển nhượng mà không cần sự đồng ý của Bên A.
      </p>
      
      <p v-if="commitmentData.tien_c && commitmentData.tien_c !== '0'">
        Nếu giao dịch không thành công thì Bên C vẫn được nhận đủ 
        <strong>{{ commitmentData.tien_c }}</strong> 
        trên số tiền đặt cọc, khoản tiền này được trích từ Bên A 
        (nếu Bên B không mua nữa và bị cọc) hoặc Bên B (nếu Bên A không bán nữa và đền cọc).
      </p>
      
      <p>
        Trong quá trình thực hiện nếu có gì trở ngại thì hai bên cùng nhau bàn bạc, thỏa thuận 
        dựa trên tinh thần tôn trọng quyền lợi lẫn nhau. Nếu hai bên không thống nhất được thì 
        đề nghị khiếu nại lên tòa án và giải quyết theo pháp luật Việt Nam quy định. 
        Hợp đồng được lập thành 03 bản, mỗi bên giữ 01 bản và có giá trị pháp lý như nhau.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface CommitmentData {
  x?: number | string
  b_coc_tien?: string
  boi_thuong?: string
  tien_c?: string
}

interface Props {
  commitmentData: CommitmentData
  convertToText: (value?: string) => string
  convertNumberToText: (value?: number | string) => string
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

.commitment-content {
  font-family: 'Times New Roman', serif;
  line-height: 1.6;
}

.commitment-content p {
  margin: 0.75rem 0;
  font-size: 0.95rem;
  color: #000;
  text-align: justify;
  text-indent: 1.5em;
}

.commitment-content strong {
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
  
  .commitment-content p {
    margin: 6px 0 !important;
    font-size: 11pt !important;
    text-indent: 1em !important;
  }
}

/* Mobile responsive */
@media (max-width: 640px) {
  .commitment-content p {
    font-size: 0.875rem;
    margin: 0.5rem 0;
    text-indent: 1em;
  }
}

/* Dark mode for preview (not for print) */
@media (prefers-color-scheme: dark) and (not print) {
  .contract-section h3 {
    color: #f7fafc;
  }
  
  .commitment-content p,
  .commitment-content strong {
    color: #f7fafc;
  }
}
</style>