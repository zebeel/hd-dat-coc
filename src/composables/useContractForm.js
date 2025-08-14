// composables/useContractForm.js
import { reactive, ref, computed, onMounted } from 'vue'

export function useContractForm() {
  // State
  const activeStep = ref(1)
  const expandedSections = reactive({
    basic: true,
    partyA: false,
    partyB: false,
    partyC: false,
    property: false,
    payment: false,
    terms: false,
    tax: false
  })

  const formData = reactive({})
  const searchTerm = ref('')
  const hasPreview = ref(false)
  const isGenerating = ref(false)
  const previewRef = ref(null)
  const templateArrayBuffer = ref(null)
  const docxBlob = ref(null)

  // Field Groups Configuration
  const fieldGroups = [
    {
      key: 'basic',
      title: 'Thông tin cơ bản',
      icon: 'fas fa-calendar-alt',
      colorClass: 'group-blue',
      fields: [
        { name: 'ngay_ky', label: 'Ngày ký hợp đồng', type: 'date', required: true },
        { name: 'tai_dia_chi', label: 'Tại địa chỉ', type: 'text', placeholder: 'TP. Hồ Chí Minh' }
      ]
    },
    {
      key: 'partyA',
      title: 'Bên A (Bên nhận đặt cọc)',
      icon: 'fas fa-user-tie',
      colorClass: 'group-green',
      fields: [
        { name: 'a_ong', label: 'Họ tên ông', type: 'text', placeholder: 'Nguyễn Văn A', required: true },
        { name: 'a_ong_sinh_ngay', label: 'Sinh ngày', type: 'date' },
        { name: 'a_ong_cccd', label: 'Số CCCD/CMND', type: 'text', placeholder: '001234567890' },
        { name: 'a_ong_cap_ngay', label: 'Cấp ngày', type: 'date' },
        { name: 'a_ong_noi_cap', label: 'Nơi cấp', type: 'text', placeholder: 'CA TP.HCM' },
        { name: 'a_ba', label: 'Họ tên bà', type: 'text', placeholder: 'Nguyễn Thị B' },
        { name: 'a_ba_sinh_ngay', label: 'Sinh ngày', type: 'date' },
        { name: 'a_ba_cccd', label: 'Số CCCD/CMND', type: 'text', placeholder: '001234567891' },
        { name: 'a_ba_cap_ngay', label: 'Cấp ngày', type: 'date' },
        { name: 'a_ba_noi_cap', label: 'Nơi cấp', type: 'text', placeholder: 'CA TP.HCM' },
        { name: 'a_dia_chi', label: 'Địa chỉ thường trú', type: 'text', placeholder: 'Quận 1, TP.HCM' }
      ]
    },
    {
      key: 'partyB',
      title: 'Bên B (Bên đặt cọc)',
      icon: 'fas fa-user',
      colorClass: 'group-orange',
      fields: [
        { name: 'b_ong', label: 'Họ tên ông', type: 'text', placeholder: 'Trần Văn C', required: true },
        { name: 'b_ong_sinh_ngay', label: 'Sinh ngày', type: 'date' },
        { name: 'b_ong_cccd', label: 'Số CCCD/CMND', type: 'text', placeholder: '001234567892' },
        { name: 'b_ong_cap_ngay', label: 'Cấp ngày', type: 'date' },
        { name: 'b_ong_noi_cap', label: 'Nơi cấp', type: 'text', placeholder: 'CA TP.HCM' },
        { name: 'b_dia_chi', label: 'Địa chỉ thường trú', type: 'text', placeholder: 'Quận 3, TP.HCM' }
      ]
    },
    {
      key: 'partyC',
      title: 'Bên C (Người làm chứng)',
      icon: 'fas fa-user-check',
      colorClass: 'group-purple',
      fields: [
        { name: 'c_ong', label: 'Họ tên ông', type: 'text', placeholder: 'Lê Văn D' },
        { name: 'c_ong_sinh_ngay', label: 'Sinh ngày', type: 'date' },
        { name: 'c_ong_cccd', label: 'Số CCCD/CMND', type: 'text', placeholder: '001234567893' },
        { name: 'c_ong_cap_ngay', label: 'Cấp ngày', type: 'date' },
        { name: 'c_ong_noi_cap', label: 'Nơi cấp', type: 'text', placeholder: 'CA TP.HCM' },
        { name: 'c_dia_chi', label: 'Địa chỉ thường trú', type: 'text', placeholder: 'Quận 7, TP.HCM' },
        { name: 'tien_c', label: 'Tiền Bên C nhận', type: 'text', placeholder: '5,000,000 VND' }
      ]
    },
    {
      key: 'property',
      title: 'Thông tin tài sản',
      icon: 'fas fa-home',
      colorClass: 'group-teal',
      fields: [
        { name: 'tds', label: 'Thửa đất số', type: 'text', placeholder: '123' },
        { name: 'bds', label: 'Tờ bản đồ số', type: 'text', placeholder: '45' },
        { name: 's', label: 'Diện tích (m²)', type: 'number', placeholder: '100' },
        { name: 'dia_chi_thua_dat', label: 'Địa chỉ thửa đất', type: 'text', placeholder: 'Đường ABC, Quận 1' },
        { name: 'dat_so', label: 'Số giấy CN QSH-QSD', type: 'text', placeholder: 'QSD001234' },
        { name: 'tai_san_gan_lien_dat', label: 'Tài sản gắn liền với đất', type: 'textarea', placeholder: 'Nhà cấp 4, diện tích 80m²' }
      ]
    },
    {
      key: 'payment',
      title: 'Thông tin thanh toán',
      icon: 'fas fa-money-bill-wave',
      colorClass: 'group-emerald',
      fields: [
        { name: 'gia_ban', label: 'Giá bán', type: 'text', placeholder: '2,000,000,000 VND', required: true },
        { name: 'b_coc_tien', label: 'Tiền cọc', type: 'text', placeholder: '200,000,000 VND', required: true },
        { name: 'coc_bang', label: 'Cọc bằng', type: 'text', placeholder: 'Tiền mặt' },
        { name: 'tien_con_lai', label: 'Tiền còn lại', type: 'text', placeholder: '1,800,000,000 VND', required: true, readonly: true }
      ]
    },
    {
      key: 'terms',
      title: 'Điều khoản thời hạn',
      icon: 'fas fa-clock',
      colorClass: 'group-indigo',
      fields: [
        { name: 'so_ngay_coc', label: 'Số ngày cọc', type: 'number', placeholder: '30' },
        { name: 'ke_tu_ngay', label: 'Kể từ ngày', type: 'date' },
        { name: 'den_ngay', label: 'Đến ngày', type: 'date' },
        { name: 'x', label: 'Số lần bồi thường', type: 'number', placeholder: '2' },
        { name: 'boi_thuong', label: 'Tổng tiền bồi thường', type: 'text', placeholder: '400,000,000 VND' }
      ]
    },
    {
      key: 'tax',
      title: 'Thuế và lệ phí',
      icon: 'fas fa-file-invoice-dollar',
      colorClass: 'group-pink',
      fields: [
        { name: 'tb', label: 'Bên chịu lệ phí trước bạ', type: 'select', options: ['A', 'B'], placeholder: 'Chọn bên' },
        { name: 'tncn', label: 'Bên chịu thuế TNCN', type: 'select', options: ['A', 'B'], placeholder: 'Chọn bên' },
        { name: 'pnn', label: 'Bên chịu thuế PNN', type: 'select', options: ['A', 'B'], placeholder: 'Chọn bên' },
        { name: 'cc', label: 'Bên chịu phí công chứng', type: 'select', options: ['A', 'B'], placeholder: 'Chọn bên' },
        { name: 'thoa_thuan_khac', label: 'Thỏa thuận khác', type: 'textarea', placeholder: 'Ghi chú thêm (nếu có)' }
      ]
    }
  ]

  // Initialize form data
  fieldGroups.forEach(group => {
    group.fields.forEach(field => {
      formData[field.name] = ''
    })
  })

  // Computed properties
  const progressWidth = computed(() => {
    return `${(activeStep.value / 3) * 100}%`
  })

  const filteredGroups = computed(() => {
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

  // Utility functions
  const getStepTitle = (step) => {
    const titles = {
      1: 'Nhập thông tin',
      2: 'Xem trước hợp đồng', 
      3: 'Xuất file và in'
    }
    return titles[step]
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN')
  }

  const getDatePart = (dateString, part) => {
    if (!dateString) return part === 'year' ? '____' : '__'
    const date = new Date(dateString)
    if (part === 'day') return date.getDate().toString()
    if (part === 'month') return (date.getMonth() + 1).toString()
    if (part === 'year') return date.getFullYear().toString()
    return '__'
  }

  const formatDateForContract = (dateString) => {
    if (!dateString) return { day: '__', month: '__', year: '____' }
    const date = new Date(dateString)
    return {
      day: date.getDate().toString(),
      month: (date.getMonth() + 1).toString(),
      year: date.getFullYear().toString()
    }
  }

  // Convert number to Vietnamese text
  const numberToVietnamese = (num) => {
    if (!num) return ''
    
    let number = parseInt(num.toString().replace(/[,\s]/g, ''))
    if (isNaN(number) || number === 0) return ''
    
    if (number >= 1000000000) {
      return Math.floor(number / 1000000000) + ' tỷ đồng'
    } else if (number >= 1000000) {
      return Math.floor(number / 1000000) + ' triệu đồng'
    } else if (number >= 1000) {
      return Math.floor(number / 1000) + ' nghìn đồng'
    }
    return number + ' đồng'
  }

  const convertToText = (amount) => {
    return numberToVietnamese(amount)
  }

  const convertNumberToText = (num) => {
    const numberMap = {
      '1': 'một',
      '2': 'hai', 
      '3': 'ba',
      '4': 'bốn',
      '5': 'năm'
    }
    return numberMap[num?.toString()] || num?.toString() || ''
  }

  const getTextForPreview = (fieldName, value) => {
    if (!value) return ''
    
    // Auto generate text for number fields
    if (['gia_ban', 'b_coc_tien', 'tien_con_lai', 'boi_thuong'].includes(fieldName)) {
      return numberToVietnamese(value)
    }
    
    // Auto generate text for multiplier
    if (fieldName === 'x') {
      return convertNumberToText(value)
    }
    
    return value
  }

  // Form actions
  const toggleSection = (section) => {
    expandedSections[section] = !expandedSections[section]
  }

  const generatePreview = async () => {
    isGenerating.value = true
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    hasPreview.value = true
    activeStep.value = 2
    isGenerating.value = false
    
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
  }

  const downloadDocx = async () => {
    try {
      // Simple alert for now - can be enhanced with actual DOCX generation
      alert('Tính năng tải DOCX sẽ được triển khai với pizzip và docxtemplater!')
      activeStep.value = 3
      
      // Placeholder for actual implementation:
      // const zip = new PizZip(templateArrayBuffer.value)
      // const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true })
      // doc.setData(formData)
      // doc.render()
      // const blob = doc.getZip().generate({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
      // saveAs(blob, `hop-dong-dat-coc-${new Date().getTime()}.docx`)
      
    } catch (error) {
      console.error('Lỗi khi tạo file DOCX:', error)
      alert('Có lỗi xảy ra khi tạo file DOCX: ' + error.message)
    }
  }

  const printPreview = () => {
    if (!hasPreview.value) return
    
    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    
    const contractContent = previewRef.value?.innerHTML || ''
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Hợp đồng đặt cọc</title>
        <meta charset="utf-8">
        <style>
          @page { 
            size: A4; 
            margin: 20mm; 
          }
          
          body {
            font-family: 'Times New Roman', serif;
            line-height: 1.5;
            color: #000;
            font-size: 13pt;
          }
          
          .contract-document {
            max-width: none;
            margin: 0;
            padding: 0;
          }
          
          .contract-header {
            text-align: center;
            margin-bottom: 30px;
          }
          
          .contract-header h1 {
            font-size: 14pt;
            font-weight: bold;
            margin: 0 0 5px 0;
          }
          
          .contract-header h2 {
            font-size: 16pt;
            font-weight: bold;
            margin: 20px 0 5px 0;
          }
          
          .underline {
            text-decoration: underline;
          }
          
          .contract-section {
            margin: 20px 0;
          }
          
          .contract-section h3 {
            font-weight: bold;
            margin: 15px 0 10px 0;
          }
          
          .party-info p, .contract-body p {
            margin: 5px 0;
          }
          
          .property-box {
            border: 1px solid #000;
            padding: 10px;
            margin: 10px 0;
          }
          
          .payment-table, .tax-table {
            margin: 10px 0;
          }
          
          .payment-row, .tax-row {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
            border-bottom: 1px solid #ccc;
            padding: 5px 0;
          }
          
          .signature-section {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
          }
          
          .signature-box {
            text-align: center;
            width: 30%;
          }
          
          .signature-box h4 {
            font-weight: bold;
            margin-bottom: 40px;
          }
          
          .signature-line {
            border-bottom: 1px solid #000;
            margin: 40px 0 10px 0;
            height: 1px;
          }
          
          .additional-terms {
            margin-top: 1rem;
            padding: 1rem;
            background: #f9f9f9;
            border-left: 4px solid #667eea;
          }
          
          strong {
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        ${contractContent}
      </body>
      </html>
    `)
    
    printWindow.document.close()
    printWindow.focus()
    
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  const resetForm = () => {
    if (confirm('Bạn có chắc chắn muốn đặt lại tất cả thông tin?')) {
      Object.keys(formData).forEach(key => {
        formData[key] = ''
      })
      hasPreview.value = false
      activeStep.value = 1
      
      // Expand basic section
      Object.keys(expandedSections).forEach(key => {
        expandedSections[key] = key === 'basic'
      })
    }
  }

  const saveAsDraft = () => {
    try {
      const draftData = {
        formData: { ...formData },
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
      
      localStorage.setItem('contract_draft', JSON.stringify(draftData))
      alert('Đã lưu bản nháp thành công!')
    } catch (error) {
      alert('Không thể lưu bản nháp: ' + error.message)
    }
  }

  const loadDraft = () => {
    try {
      const saved = localStorage.getItem('contract_draft')
      if (saved) {
        const draftData = JSON.parse(saved)
        Object.assign(formData, draftData.formData)
        console.log('Đã tải bản nháp thành công!')
      }
    } catch (error) {
      console.error('Lỗi khi tải bản nháp:', error)
    }
  }

  // Auto calculation functions
  const calculateRemainingAmount = () => {
    const totalPrice = parseFloat(formData.gia_ban?.replace(/[,\s]/g, '') || 0)
    const depositAmount = parseFloat(formData.b_coc_tien?.replace(/[,\s]/g, '') || 0)
    const remaining = totalPrice - depositAmount
    
    if (remaining > 0) {
      formData.tien_con_lai = remaining.toLocaleString('vi-VN') + ' VND'
    }
  }

  const calculateCompensation = () => {
    const depositAmount = parseFloat(formData.b_coc_tien?.replace(/[,\s]/g, '') || 0)
    const multiplier = parseInt(formData.x || 2)
    const compensation = depositAmount * multiplier
    
    if (compensation > 0) {
      formData.boi_thuong = compensation.toLocaleString('vi-VN') + ' VND'
    }
  }

  const setDefaultDates = () => {
    const today = new Date()
    const futureDate = new Date(today)
    futureDate.setDate(today.getDate() + parseInt(formData.so_ngay_coc || 30))
    
    if (!formData.ke_tu_ngay) {
      formData.ke_tu_ngay = today.toISOString().split('T')[0]
    }
    
    if (!formData.den_ngay && formData.so_ngay_coc) {
      formData.den_ngay = futureDate.toISOString().split('T')[0]
    }
  }

  // Lifecycle
  onMounted(async () => {
    try {
      // Try to load template file
      const response = await fetch('/templates/hd-coc-dat.docx')
      if (response.ok) {
        templateArrayBuffer.value = await response.arrayBuffer()
        console.log('Template loaded successfully')
      } else {
        console.warn('Không thể tải template file')
      }
    } catch (error) {
      console.error('Lỗi khi tải template:', error)
    }
    
    // Load draft if exists
    loadDraft()
    
    // Set default date values
    const today = new Date()
    formData.ngay_ky = today.toISOString().split('T')[0]
  })

  return {
    // State
    activeStep,
    expandedSections,
    formData,
    searchTerm,
    hasPreview,
    isGenerating,
    previewRef,
    templateArrayBuffer,
    docxBlob,
    fieldGroups,
    
    // Computed
    progressWidth,
    filteredGroups,
    
    // Methods
    getStepTitle,
    toggleSection,
    formatDate,
    getDatePart,
    formatDateForContract,
    numberToVietnamese,
    convertToText,
    convertNumberToText,
    getTextForPreview,
    generatePreview,
    downloadDocx,
    printPreview,
    resetForm,
    saveAsDraft,
    loadDraft,
    calculateRemainingAmount,
    calculateCompensation,
    setDefaultDates
  }
}