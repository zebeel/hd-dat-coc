// composables/useValidation.ts
export interface ValidationRule {
  type: 'required' | 'email' | 'phone' | 'cccd' | 'currency' | 'date' | 'number' | 'minLength' | 'maxLength' | 'pattern'
  message?: string
  value?: any
}

export interface FieldValidation {
  rules: ValidationRule[]
  customValidator?: (value: any) => string | null
}

// Validation rules
export const validationRules = {
  required: (value: any): string | null => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return 'Trường này là bắt buộc'
    }
    return null
  },

  email: (value: string): string | null => {
    if (!value) return null
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return 'Email không hợp lệ'
    }
    return null
  },

  phone: (value: string): string | null => {
    if (!value) return null
    const phoneRegex = /^[0-9]{10,11}$/
    if (!phoneRegex.test(value.replace(/\D/g, ''))) {
      return 'Số điện thoại không hợp lệ'
    }
    return null
  },

  cccd: (value: string): string | null => {
    if (!value) return null
    const cccdRegex = /^[0-9]{9,12}$/
    if (!cccdRegex.test(value.replace(/\D/g, ''))) {
      return 'Số CCCD/CMND không hợp lệ (9-12 chữ số)'
    }
    return null
  },

  currency: (value: string): string | null => {
    if (!value) return null
    const currencyRegex = /^[\d,]+$/
    if (!currencyRegex.test(value.replace(/\s/g, ''))) {
      return 'Định dạng tiền không hợp lệ'
    }
    return null
  },

  date: (value: string): string | null => {
    if (!value) return null
    const date = new Date(value)
    if (isNaN(date.getTime())) {
      return 'Ngày không hợp lệ'
    }
    return null
  },

  number: (value: any): string | null => {
    if (!value) return null
    if (isNaN(Number(value))) {
      return 'Phải là số hợp lệ'
    }
    return null
  },

  minLength: (value: string, minLength: number): string | null => {
    if (!value) return null
    if (value.length < minLength) {
      return `Tối thiểu ${minLength} ký tự`
    }
    return null
  },

  maxLength: (value: string, maxLength: number): string | null => {
    if (!value) return null
    if (value.length > maxLength) {
      return `Tối đa ${maxLength} ký tự`
    }
    return null
  },

  pattern: (value: string, pattern: RegExp, message?: string): string | null => {
    if (!value) return null
    if (!pattern.test(value)) {
      return message || 'Định dạng không hợp lệ'
    }
    return null
  }
}

// Validate single field
export const validateField = (value: any, rules: ValidationRule[]): string | null => {
  for (const rule of rules) {
    let error: string | null = null

    switch (rule.type) {
      case 'required':
        error = validationRules.required(value)
        break
      case 'email':
        error = validationRules.email(value)
        break
      case 'phone':
        error = validationRules.phone(value)
        break
      case 'cccd':
        error = validationRules.cccd(value)
        break
      case 'currency':
        error = validationRules.currency(value)
        break
      case 'date':
        error = validationRules.date(value)
        break
      case 'number':
        error = validationRules.number(value)
        break
      case 'minLength':
        error = validationRules.minLength(value, rule.value)
        break
      case 'maxLength':
        error = validationRules.maxLength(value, rule.value)
        break
      case 'pattern':
        error = validationRules.pattern(value, rule.value, rule.message)
        break
    }

    if (error) {
      return rule.message || error
    }
  }

  return null
}

// Validate entire form
export const validateForm = (formData: Record<string, any>, fieldGroups: any[]): Record<string, string> => {
  const errors: Record<string, string> = {}

  fieldGroups.forEach(group => {
    group.fields.forEach((field: any) => {
      if (field.validation) {
        const error = validateField(formData[field.name], field.validation)
        if (error) {
          errors[field.name] = error
        }
      }
    })
  })

  return errors
}

// Custom validation for business logic
export const customValidations = {
  // Validate that deposit is less than total price
  validateDeposit: (totalPrice: string, deposit: string): string | null => {
    const total = parseFloat(totalPrice.replace(/[^\d]/g, '')) || 0
    const dep = parseFloat(deposit.replace(/[^\d]/g, '')) || 0
    
    if (dep > total) {
      return 'Tiền cọc không được lớn hơn tổng giá bán'
    }
    
    if (dep <= 0) {
      return 'Tiền cọc phải lớn hơn 0'
    }
    
    return null
  },

  // Validate date range
  validateDateRange: (startDate: string, endDate: string): string | null => {
    if (!startDate || !endDate) return null
    
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (start >= end) {
      return 'Ngày kết thúc phải sau ngày bắt đầu'
    }
    
    return null
  },

  // Validate age (must be >= 18)
  validateAge: (birthDate: string): string | null => {
    if (!birthDate) return null
    
    const birth = new Date(birthDate)
    const today = new Date()
    const age = today.getFullYear() - birth.getFullYear()
    
    if (age < 18) {
      return 'Phải đủ 18 tuổi'
    }
    
    return null
  },

  // Validate future date
  validateFutureDate: (date: string): string | null => {
    if (!date) return null
    
    const inputDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (inputDate < today) {
      return 'Ngày không được trong quá khứ'
    }
    
    return null
  }
}

// Hook for using validation
export const useValidation = () => {
  return {
    validateField,
    validateForm,
    validationRules,
    customValidations
  }
}