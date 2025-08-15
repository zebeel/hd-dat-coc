<!-- components/contract/ContractSignatureSection.vue -->
<template>
  <div class="signature-section">
    <div class="signature-box">
      <h4>ĐẠI DIỆN BÊN A</h4>
      <p>(Ký và ghi rõ họ tên)</p>
      <div class="signature-line"></div>
      <div class="signature-name-placeholder"></div>
    </div>
    
    <div class="signature-box">
      <h4>ĐẠI DIỆN BÊN B</h4>
      <p>(Ký và ghi rõ họ tên)</p>
      <div class="signature-line"></div>
      <div class="signature-name-placeholder"></div>
    </div>
    
    <div class="signature-box">
      <h4>ĐẠI DIỆN BÊN C</h4>
      <p>(Ký và ghi rõ họ tên)</p>
      <div class="signature-line"></div>
      <div class="signature-name-placeholder"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props needed for this component as it's static content
</script>

<style scoped>
.signature-section {
  margin-top: 3rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2rem;
  text-align: center;
  page-break-inside: avoid;
  font-family: 'Times New Roman', serif;
}

.signature-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 150px;
}

.signature-box h4 {
  font-weight: bold;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #000;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.signature-box p {
  font-size: 0.8rem;
  font-style: italic;
  margin: 0.5rem 0 2rem 0;
  color: #666;
}

.signature-line {
  width: 100%;
  max-width: 200px;
  border-bottom: 1px solid #000;
  margin: 2rem 0 1rem 0;
  height: 1px;
  flex-grow: 1;
}

.signature-name-placeholder {
  height: 1.5rem;
  width: 100%;
  max-width: 200px;
  margin-top: 0.5rem;
}

/* Print styles */
@media print {
  .signature-section {
    margin-top: 40px;
    page-break-inside: avoid;
    gap: 1rem;
  }
  
  .signature-box {
    min-height: 120px;
  }
  
  .signature-box h4 {
    font-size: 10pt !important;
    margin-bottom: 6px !important;
  }
  
  .signature-box p {
    font-size: 9pt !important;
    margin: 6px 0 20px 0 !important;
    color: #000 !important;
  }
  
  .signature-line {
    border-bottom: 1px solid #000 !important;
    margin: 20px 0 10px 0 !important;
    max-width: 150px;
  }
  
  .signature-name-placeholder {
    height: 15px !important;
    max-width: 150px;
  }
}

/* Mobile responsive */
@media (max-width: 768px) {
  .signature-section {
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-top: 2rem;
  }
  
  .signature-box {
    min-height: 120px;
  }
  
  .signature-line {
    max-width: 250px;
  }
  
  .signature-name-placeholder {
    max-width: 250px;
  }
}

@media (max-width: 640px) {
  .signature-section {
    gap: 1.5rem;
    margin-top: 1.5rem;
  }
  
  .signature-box h4 {
    font-size: 0.85rem;
  }
  
  .signature-box p {
    font-size: 0.75rem;
  }
}

/* Dark mode for preview (not for print) */
@media (prefers-color-scheme: dark) and (not print) {
  .signature-box h4 {
    color: #f7fafc;
  }
  
  .signature-box p {
    color: #d1d5db;
  }
  
  .signature-line {
    border-bottom-color: #f7fafc;
  }
}

/* Ensure proper spacing and alignment */
.signature-box:first-child {
  justify-self: start;
}

.signature-box:last-child {
  justify-self: end;
}

.signature-box:nth-child(2) {
  justify-self: center;
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .signature-line {
    border-bottom-width: 2px;
    border-bottom-color: #000;
  }
  
  .signature-box h4 {
    color: #000;
    font-weight: 900;
  }
  
  .signature-box p {
    color: #000;
    font-weight: 600;
  }
}
</style>