<template>
  <div class="app-container">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <div class="logo-icon">
            <img src="/logo.svg" alt="Logo">
          </div>
          <div class="logo-text">
            <h1>Hợp đồng đặt cọc</h1>
            <p>Chuyển nhượng quyền sử dụng đất</p>
          </div>
        </div>
        
        <ProgressSteps 
          :activeStep="activeStep" 
          :steps="steps"
          class="hidden md:flex"
        />
      </div>
    </header>

    <!-- Mobile Progress -->
    <div class="mobile-progress md:hidden">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressWidth }"></div>
      </div>
      <p class="progress-text">Bước {{ activeStep }}/3: {{ getStepTitle(activeStep) }}</p>
    </div>

    <!-- Notification -->
    <NotificationComponent 
      v-if="notification.show"
      :type="notification.type"
      :message="notification.message"
      @close="hideNotification"
    />

    <!-- Main Content -->
    <main class="main-content">
      <div class="content-grid">
        <!-- Form Section -->
        <div class="form-section">
          <div class="form-card">
            <div class="card-header">
              <h2><i class="fas fa-edit"></i> Thông tin hợp đồng</h2>
              <p>Vui lòng điền đầy đủ thông tin để tạo hợp đồng</p>
            </div>
            
            <div class="form-content">
              <!-- Search Bar -->
              <div class="search-bar">
                <input 
                  v-model="searchTerm" 
                  type="text" 
                  placeholder="Tìm kiếm trường thông tin..."
                  class="search-input"
                  aria-label="Tìm kiếm trường thông tin"
                />
                <i class="fas fa-search search-icon" aria-hidden="true"></i>
              </div>

              <!-- Field Groups -->
              <div class="field-groups">
                <FieldGroup
                  v-for="group in filteredGroups" 
                  :key="group.key"
                  :group="group"
                  :formData="formData"
                  :expandedSections="expandedSections"
                  :errors="errors"
                  @toggle="toggleSection"
                  @input="handleInputChange"
                />
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="card-footer">
              <button 
                @click="generatePreview" 
                :disabled="isGenerating"
                class="btn btn-primary btn-large"
                :aria-label="isGenerating ? 'Đang tạo bản xem trước' : 'Tạo bản xem trước hợp đồng'"
              >
                <i v-if="isGenerating" class="fas fa-spinner fa-spin" aria-hidden="true"></i>
                <i v-else class="fas fa-eye" aria-hidden="true"></i>
                {{ isGenerating ? 'Đang tạo...' : 'Xem trước hợp đồng' }}
              </button>
              
              <div class="quick-actions">
                <button @click="resetForm" class="btn btn-secondary">
                  <i class="fas fa-undo" aria-hidden="true"></i> Đặt lại
                </button>
                <button @click="saveAsDraft" class="btn btn-secondary">
                  <i class="fas fa-save" aria-hidden="true"></i> Lưu nháp
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Preview Section -->
        <div class="preview-section">
          <ContractPreview
            :hasPreview="hasPreview"
            :formData="formData"
            :calculatedFields="calculatedFields"
            @download="downloadDocx"
            @print="printPreview"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { validateField, validateForm, ValidationRule } from './composables/useValidation'
import { useNotification } from './composables/useNotification'
import { useFormCalculations } from './composables/useFormCalculations'
import { useLocalStorage } from './composables/useLocalStorage'
import { fieldGroups, FormData, FieldGroup as FieldGroupType } from './config/formConfig'
import ProgressSteps from './components/ProgressSteps.vue'
import FieldGroup from './components/FieldGroup.vue'
import ContractPreview from './components/ContractPreview.vue'
import NotificationComponent from './components/NotificationComponent.vue'

// Types
interface Step {
  id: number
  title: string
  description: string
}

// State
const activeStep = ref<number>(1)
const expandedSections = reactive<Record<string, boolean>>({
  basic: true,
  partyA: false,
  partyB: false,
  partyC: false,
  property: false,
  payment: false,
  terms: false,
  tax: false
})

const formData = reactive<FormData>({} as FormData)
const searchTerm = ref<string>('')
const hasPreview = ref<boolean>(false)
const isGenerating = ref<boolean>(false)
const errors = reactive<Record<keyof FormData, string>>({} as Record<keyof FormData, string>)

// Composables
const { notification, showNotification, hideNotification } = useNotification()
const { saveData, loadData, clearData } = useLocalStorage<FormData>('contract_draft')
const { 
  calculatedFields, 
  updateCalculations,
  formatCurrency,
  convertToText,
  convertNumberToText 
} = useFormCalculations(formData)

// Constants
const steps: Step[] = [
  { id: 1, title: 'Nhập thông tin', description: 'Điền các thông tin cần thiết' },
  { id: 2, title: 'Xem trước', description: 'Kiểm tra hợp đồng' },
  { id: 3, title: 'Xuất file', description: 'Tải về và in' }
]

// Initialize form data
const initializeFormData = (): void => {
  fieldGroups.forEach(group => {
    group.fields.forEach(field => {
      if (!(field.name in formData)) {
        formData[field.name] = field.defaultValue || ''
      }
    })
  })
  
  // Set default values
  const today = new Date().toISOString().split('T')[0]
  formData.ngay_ky = today
  formData.a_ong_noi_cap = 'Cục cảnh sát'
  formData.a_ba_noi_cap = 'Cục cảnh sát'
  formData.b_ong_noi_cap = 'Cục cảnh sát'
  formData.c_ong_noi_cap = 'Cục cảnh sát'
  formData.tb = 'A'
  formData.tncn = 'A'
  formData.cc = 'B'
  formData.pnn = 'A'
  formData.so_ngay_coc = 30
  formData.coc_bang = 'Tiền mặt'
}

// Computed
const progressWidth = computed<string>(() => {
  return `${(activeStep.value / 3) * 100}%`
})

const filteredGroups = computed<FieldGroupType[]>(() => {
  if (!searchTerm.value) return fieldGroups
  
  return fieldGroups.filter(group => 
    group.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    group.fields.some(field => 
      field.label.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  ).map(group => ({
    ...group,
    fields: group.fields.filter(field =>
      field.label.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      group.title.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  }))
})

// Methods
const getStepTitle = (step: number): string => {
  return steps.find(s => s.id === step)?.title || ''
}

const toggleSection = (section: string): void => {
  expandedSections[section] = !expandedSections[section]
}

const handleInputChange = (fieldName: keyof FormData, value: string): void => {
  // Clear previous error
  if (errors[fieldName]) {
    delete errors[fieldName]
  }

  // Update form data
  formData[fieldName] = value

  // Validate field
  const field = fieldGroups
    .flatMap(g => g.fields)
    .find(f => f.name === fieldName)
  
  if (field) {
    const error = validateField(value, field.validation || [])
    if (error) {
      errors[fieldName] = error
    }
  }

  // Update calculations
  updateCalculations()

  // Format currency inputs
  if (['gia_ban', 'b_coc_tien', 'tien_con_lai', 'tien_c', 'boi_thuong'].includes(fieldName) && value) {
    const formatted = formatCurrency(value)
    if (formatted && formatted !== value) {
      formData[fieldName] = formatted
    }
  }
}

const validateFormData = (): boolean => {
  const formErrors = validateForm(formData, fieldGroups)
  Object.assign(errors, formErrors)
  
  if (Object.keys(formErrors).length > 0) {
    const firstErrorField = Object.keys(formErrors)[0]
    showNotification(`Vui lòng kiểm tra trường "${firstErrorField}"`, 'error')
    return false
  }
  
  return true
}

const generatePreview = async (): Promise<void> => {
  if (!validateFormData()) return
  
  isGenerating.value = true
  
  try {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    hasPreview.value = true
    activeStep.value = 2
    showNotification('Tạo bản xem trước thành công!', 'success')
    
    // Scroll to preview on mobile
    if (window.innerWidth < 1024) {
      const previewSection = document.querySelector('.preview-section')
      if (previewSection) {
        previewSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
      }
    }
  } catch (error) {
    showNotification('Có lỗi xảy ra khi tạo bản xem trước', 'error')
  } finally {
    isGenerating.value = false
  }
}

const downloadDocx = (): void => {
  showNotification('Tính năng tải DOCX sẽ được triển khai sau!', 'info')
  activeStep.value = 3
}

const printPreview = (): void => {
  if (!hasPreview.value || !validateFormData()) return
  
  try {
    // Tìm element contract-preview
    const contractPreviewElement = document.querySelector('.contract-preview')
    if (!contractPreviewElement) {
      showNotification('Không tìm thấy nội dung để in. Vui lòng tạo bản xem trước trước.', 'error')
      return
    }

    // Tạo cửa sổ in mới
    const printWindow = window.open('', '_blank', 'width=800,height=600')
    if (!printWindow) {
      showNotification('Không thể mở cửa sổ in. Vui lòng cho phép popup.', 'error')
      return
    }
    
    showNotification('Đang chuẩn bị in...', 'info')

    // CSS styles cho trang in
    const printStyles = `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Times New Roman', serif;
          font-size: 14px;
          line-height: 1.6;
          color: #000;
          background: white;
          margin: 0;
          padding: 20px;
        }
        
        .contract-document {
          max-width: none;
          margin: 0;
          padding: 0;
          background: white;
          box-shadow: none;
          font-family: 'Times New Roman', serif;
          line-height: 1.6;
          color: #000;
        }
        
        .contract-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .contract-header h1 {
          font-size: 16px;
          font-weight: bold;
          margin: 0 0 8px 0;
          text-transform: uppercase;
        }
        
        .contract-header h2 {
          font-size: 18px;
          font-weight: bold;
          margin: 24px 0 8px 0;
          text-transform: uppercase;
        }
        
        .contract-header .underline {
          text-decoration: underline;
          font-weight: bold;
          font-size: 14px;
        }
        
        .contract-header .subtitle {
          font-style: italic;
          margin-top: 8px;
          font-size: 14px;
        }
        
        .contract-body {
          text-align: left;
        }
        
        .contract-date {
          margin-bottom: 24px;
          font-size: 14px;
        }
        
        .party-section,
        .property-section,
        .payment-section,
        .terms-section,
        .tax-section,
        .commitment-section,
        .signature-section {
          margin-bottom: 16px;
        }
        
        .section-title {
          font-weight: bold;
          margin-bottom: 8px;
        }
        
        p {
          margin-bottom: 12px;
          text-align: justify;
        }
        
        strong {
          font-weight: bold;
        }
        
        em {
          font-style: italic;
        }
        
        .signature-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-top: 40px;
          page-break-inside: avoid;
        }
        
        .signature-block {
          text-align: center;
        }
        
        .signature-title {
          font-weight: bold;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        
        .signature-subtitle {
          font-style: italic;
          margin-bottom: 60px;
          font-size: 13px;
        }
        
        .signature-name {
          font-weight: bold;
          margin-top: 8px;
        }
        
        @page {
          size: A4;
          margin: 2cm;
        }
        
        @media print {
          body {
            padding: 0;
            font-size: 12px;
          }
          
          .contract-header h1 {
            font-size: 14px;
          }
          
          .contract-header h2 {
            font-size: 16px;
          }
          
          .signature-grid {
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-top: 30px;
          }
          
          .signature-subtitle {
            margin-bottom: 50px;
          }
        }
      </style>
    `

    // Tạo HTML content cho trang in
    const printContent = `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hợp đồng đặt cọc - ${formData.a_ong || 'Hợp đồng'}</title>
        ${printStyles}
      </head>
      <body>
        ${contractPreviewElement.innerHTML}
      </body>
      </html>
    `

    // Ghi nội dung vào cửa sổ in
    printWindow.document.write(printContent)
    printWindow.document.close()

    // Đợi tải xong rồi mới in
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus()
        printWindow.print()
        
        // Đóng cửa sổ sau khi in (tùy chọn)
        printWindow.onafterprint = () => {
          printWindow.close()
        }
        
        // Fallback đóng cửa sổ sau 5 giây nếu người dùng không in
        setTimeout(() => {
          if (!printWindow.closed) {
            printWindow.close()
          }
        }, 5000)
      }, 500)
    }

    // Cập nhật step
    activeStep.value = 3
    
  } catch (error) {
    console.error('Lỗi khi in:', error)
    showNotification('Có lỗi xảy ra khi in. Vui lòng thử lại.', 'error')
  }
}

const resetForm = (): void => {
  if (confirm('Bạn có chắc chắn muốn đặt lại tất cả thông tin?')) {
    try {
      // Clear form data
      Object.keys(formData).forEach(key => {
        delete formData[key as keyof FormData]
      })
      
      // Clear errors
      Object.keys(errors).forEach(key => {
        delete errors[key as keyof FormData]
      })
      
      // Re-initialize
      initializeFormData()
      
      hasPreview.value = false
      activeStep.value = 1
      
      // Expand basic section
      Object.keys(expandedSections).forEach(key => {
        expandedSections[key] = key === 'basic'
      })
      
      // Clear localStorage
      clearData()
      
      showNotification('Đã đặt lại form thành công!', 'success')
    } catch (error) {
      showNotification('Có lỗi xảy ra khi đặt lại form', 'error')
    }
  }
}

const saveAsDraft = (): void => {
  try {
    const draftData = {
      formData: { ...formData },
      timestamp: new Date().toISOString(),
      version: '1.0'
    }
    
    saveData(draftData)
    showNotification('Đã lưu bản nháp thành công!', 'success')
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định'
    showNotification(`Không thể lưu bản nháp: ${errorMessage}`, 'error')
  }
}

const loadDraft = (): void => {
  try {
    const saved = loadData()
    if (saved?.formData) {
      // Chỉ load những giá trị có trong draft, giữ nguyên defaultValue cho những trường khác
      Object.keys(saved.formData).forEach(key => {
        const fieldName = key as keyof FormData
        const savedValue = saved.formData[fieldName]
        
        // Chỉ override nếu có giá trị trong draft và khác với empty
        if (savedValue !== undefined && savedValue !== '' && savedValue !== null) {
          formData[fieldName] = savedValue
        }
      })
      
      showNotification('Đã tải bản nháp thành công!', 'success')
    }
  } catch (error) {
    console.error('Lỗi khi tải bản nháp:', error)
    showNotification('Có lỗi xảy ra khi tải bản nháp', 'error')
  }
}

// Lifecycle
onMounted(() => {
  // Khởi tạo form data với defaultValue trước
  initializeFormData()
  // Sau đó mới load draft (có thể override một số giá trị)
  loadDraft()
})

// Expose for template
defineExpose({
  formData,
  calculatedFields,
  errors,
  generatePreview,
  resetForm,
  saveAsDraft
})
</script>

<style>
@import './assets/styles/contract-form.css';
</style>