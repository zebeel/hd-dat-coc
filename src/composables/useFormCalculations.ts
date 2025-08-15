// composables/useFormCalculations.ts
import { computed, watch } from 'vue'
import { FormData } from '../config/formConfig'

export const useFormCalculations = (formData: FormData) => {
  // Helper function to parse currency string to number
  const parseCurrency = (value: string): number => {
    if (!value) return 0
    const cleaned = value.toString().replace(/[^\d]/g, '')
    return parseFloat(cleaned) || 0
  }

  // Helper function to format number as currency
  const formatCurrency = (amount: string | number): string => {
    if (!amount) return ''
    const number = typeof amount === 'string' 
      ? parseCurrency(amount)
      : amount
    
    if (isNaN(number) || number === 0) return ''
    return number.toLocaleString('en-US')
  }

  // Calculate remaining amount
  const calculateRemainingAmount = (): string => {
    const totalPrice = parseCurrency(formData.gia_ban)
    const deposit = parseCurrency(formData.b_coc_tien)
    const remaining = totalPrice - deposit
    
    return remaining >= 0 ? formatCurrency(remaining) : ''
  }

  // Calculate compensation amount
  const calculateCompensation = (): string => {
    const deposit = parseCurrency(formData.b_coc_tien)
    const multiplier = parseFloat(formData.x?.toString()) || 0
    const compensation = deposit * multiplier
    
    return compensation > 0 ? formatCurrency(compensation) : ''
  }

  // Calculate end date based on start date and number of days
  const calculateEndDate = (): string => {
    if (!formData.ke_tu_ngay || !formData.so_ngay_coc) return ''
    
    const startDate = new Date(formData.ke_tu_ngay)
    const days = parseInt(formData.so_ngay_coc?.toString()) || 0
    
    if (isNaN(startDate.getTime()) || days <= 0) return ''
    
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + days)
    
    return endDate.toISOString().split('T')[0]
  }

  // Computed values for all calculated fields
  const calculatedFields = computed(() => ({
    tien_con_lai: calculateRemainingAmount(),
    boi_thuong: calculateCompensation(),
    den_ngay: calculateEndDate()
  }))

  // Watch for changes and update form data automatically
  watch(
    () => [formData.gia_ban, formData.b_coc_tien],
    () => {
      const remaining = calculateRemainingAmount()
      if (remaining && remaining !== formData.tien_con_lai) {
        formData.tien_con_lai = remaining
      }
    },
    { immediate: true }
  )

  watch(
    () => [formData.b_coc_tien, formData.x],
    () => {
      const compensation = calculateCompensation()
      if (compensation && compensation !== formData.boi_thuong) {
        formData.boi_thuong = compensation
      }
    },
    { immediate: true }
  )

  watch(
    () => [formData.ke_tu_ngay, formData.so_ngay_coc],
    () => {
      const endDate = calculateEndDate()
      if (endDate && endDate !== formData.den_ngay) {
        formData.den_ngay = endDate
      }
    },
    { immediate: true }
  )

  // Manual update function for external calls
  const updateCalculations = (): void => {
    const remaining = calculateRemainingAmount()
    const compensation = calculateCompensation()
    const endDate = calculateEndDate()

    if (remaining) formData.tien_con_lai = remaining
    if (compensation) formData.boi_thuong = compensation
    if (endDate) formData.den_ngay = endDate
  }

  // Convert number to Vietnamese text
  const convertToText = (input: string | number): string => {
    const processInput = (input: string | number): number | null => {
      if (typeof input === 'number') return input
      
      if (typeof input === 'string') {
        let numStr = input.trim()
        if (numStr === '') return null
        
        // Remove non-numeric characters except . and ,
        numStr = numStr.replace(/[^\d.,\s]/g, '')
        numStr = numStr.replace(/\s/g, '')
        
        // Handle both . and , in the string
        const dotCount = (numStr.match(/\./g) || []).length
        const commaCount = (numStr.match(/,/g) || []).length
        
        if (dotCount > 0 && commaCount > 0) {
          const lastDotPos = numStr.lastIndexOf('.')
          const lastCommaPos = numStr.lastIndexOf(',')
          
          if (lastDotPos > lastCommaPos) {
            numStr = numStr.replace(/,/g, '')
          } else {
            numStr = numStr.replace(/\./g, '').replace(',', '.')
          }
        } else if (commaCount === 1) {
          const commaPos = numStr.indexOf(',')
          const afterComma = numStr.substring(commaPos + 1)
          
          if (afterComma.length <= 3 && /^\d+$/.test(afterComma)) {
            numStr = numStr.replace(',', '.')
          } else {
            numStr = numStr.replace(/,/g, '')
          }
        } else if (commaCount > 1) {
          numStr = numStr.replace(/,/g, '')
        } else if (dotCount > 1) {
          const lastDotPos = numStr.lastIndexOf('.')
          numStr = numStr.substring(0, lastDotPos).replace(/\./g, '') + numStr.substring(lastDotPos)
        }
        
        const num = parseFloat(numStr)
        return isNaN(num) ? null : num
      }
      
      return null
    }

    const amount = processInput(input)
    
    const digits = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín']
    const units = ['', 'nghìn', 'triệu', 'tỷ']
    
    const convertGroup = (group: number): string => {
      if (group === 0) return ''
      
      let result = ''
      const hundred = Math.floor(group / 100)
      const ten = Math.floor((group % 100) / 10)
      const unit = group % 10
      
      if (hundred > 0) {
        result += digits[hundred] + ' trăm'
      }
      
      if (ten > 1) {
        result += (result ? ' ' : '') + digits[ten] + ' mười'
        if (unit > 0) {
          if (unit === 1) {
            result += ' một'
          } else if (unit === 5 && ten > 1) {
            result += ' lăm'
          } else {
            result += ' ' + digits[unit]
          }
        }
      } else if (ten === 1) {
        result += (result ? ' ' : '') + 'mười'
        if (unit > 0) {
          if (unit === 5) {
            result += ' lăm'
          } else {
            result += ' ' + digits[unit]
          }
        }
      } else if (ten === 0 && unit > 0) {
        if (hundred > 0) {
          result += ' lẻ ' + digits[unit]
        } else {
          result += digits[unit]
        }
      }
      
      return result.trim()
    }
    
    if (amount === null || amount < 0 || !Number.isFinite(amount)) {
      return 'Số không hợp lệ'
    }
    
    if (amount === 0) {
      return 'Không đồng'
    }
    
    const roundedAmount = Math.floor(amount)
    const amountStr = roundedAmount.toString()
    const length = amountStr.length
    let result = ''
    let unitIndex = 0
    
    for (let i = length; i > 0; i -= 3) {
      const start = Math.max(0, i - 3)
      const group = parseInt(amountStr.substring(start, i))
      
      if (group > 0) {
        const groupText = convertGroup(group)
        if (groupText) {
          const unitText = units[unitIndex] || ''
          result = groupText + (unitText ? ' ' + unitText : '') + (result ? ' ' + result : '')
        }
      }
      unitIndex++
    }
    
    if (result) {
      result = result.charAt(0).toUpperCase() + result.slice(1) + ' đồng'
    }
    
    return result
  }

  // Convert number to Vietnamese number text
  const convertNumberToText = (num: string | number): string => {
    const numberMap: Record<string, string> = {
      '1': 'một', '2': 'hai', '3': 'ba', '4': 'bốn', '5': 'năm',
      '6': 'sáu', '7': 'bảy', '8': 'tám', '9': 'chín', '10': 'mười',
      '11': 'mười một', '12': 'mười hai', '13': 'mười ba'
    }
    return numberMap[num?.toString()] || num?.toString() || ''
  }

  // Format date to Vietnamese format
  const formatDate = (dateString: string): string => {
    if (!dateString) return ''
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  // Get date parts for contract display
  const getDatePart = (dateString: string, part: 'day' | 'month' | 'year'): string => {
    if (!dateString) return part === 'year' ? '____' : '__'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return part === 'year' ? '____' : '__'
    
    if (part === 'day') return date.getDate().toString()
    if (part === 'month') return (date.getMonth() + 1).toString()
    if (part === 'year') return date.getFullYear().toString()
    return '__'
  }

  return {
    calculatedFields,
    updateCalculations,
    formatCurrency,
    convertToText,
    convertNumberToText,
    formatDate,
    getDatePart,
    parseCurrency
  }
}