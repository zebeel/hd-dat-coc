<!-- components/FormField.vue -->
<template>
  <div class="field-item" :class="{ 'has-error': error }">
    <!-- Address Field -->
    <AddressField
      v-if="field.type === 'address'"
      :label="field.label"
      :value="value"
      :required="field.required"
      :error="error"
      @input="handleInput"
    />
    
    <!-- All other field types -->
    <div v-else>
      <label 
        :for="fieldId"
        class="field-label"
      >
        {{ field.label }}
        <span v-if="field.required" class="required" aria-label="bắt buộc">*</span>
      </label>
      
      <div v-if="field.helpText" class="field-help">
        <small>{{ field.helpText }}</small>
      </div>
      
      <!-- Select Input -->
      <div v-if="field.type === 'select'" class="input-wrapper">
        <select 
          :id="fieldId"
          :value="value" 
          class="field-input select-input"
          :class="{ 'has-value': value, 'error': error }"
          :aria-label="field.ariaLabel || field.label"
          :aria-describedby="error ? `${fieldId}-error` : undefined"
          :aria-required="field.required"
          @change="handleInput($event.target.value)"
        >
          <option value="">{{ field.placeholder || `Chọn ${field.label.toLowerCase()}` }}</option>
          <option 
            v-for="option in field.options" 
            :key="option" 
            :value="option"
          >
            {{ option }}
          </option>
        </select>
        <i class="fas fa-chevron-down select-arrow" aria-hidden="true"></i>
      </div>
      
      <!-- Textarea Input -->
      <div v-else-if="field.type === 'textarea'" class="input-wrapper">
        <textarea
          :id="fieldId"
          :value="value"
          :placeholder="field.placeholder"
          class="field-input textarea-input"
          :class="{ 'has-value': value, 'error': error }"
          :readonly="field.readonly"
          :aria-label="field.ariaLabel || field.label"
          :aria-describedby="error ? `${fieldId}-error` : undefined"
          :aria-required="field.required"
          rows="3"
          @input="handleInput($event.target.value)"
        ></textarea>
      </div>
      
      <!-- Radio Input -->
      <div v-else-if="field.type === 'radio'" class="input-wrapper">
        <div class="radio-group" role="radiogroup" :aria-labelledby="`${fieldId}-label`">
          <label 
            v-for="option in field.options" 
            :key="option"
            class="radio-option"
            :class="{ 'selected': value === option }"
          >
            <input
              :id="`${fieldId}-${option}`"
              :value="option"
              :checked="value === option"
              type="radio"
              :name="fieldId"
              class="radio-input"
              :aria-describedby="error ? `${fieldId}-error` : undefined"
              :aria-required="field.required"
              @change="handleInput(option)"
            />
            <span class="radio-custom"></span>
            <span class="radio-label">{{ option }}</span>
          </label>
        </div>
      </div>
      
      <!-- Date Input -->
      <div v-else-if="field.type === 'date'" class="input-wrapper">
        <input
          :id="fieldId"
          :value="value"
          type="date"
          lang="vi"
          class="field-input date-input"
          :class="{ 'has-value': value, 'error': error }"
          :readonly="field.readonly"
          :aria-label="field.ariaLabel || field.label"
          :aria-describedby="error ? `${fieldId}-error` : undefined"
          :aria-required="field.required"
          @input="handleInput($event.target.value)"
        />
        <i class="fas fa-calendar-alt date-icon" aria-hidden="true"></i>
      </div>
      
      <!-- Number Input -->
      <div v-else-if="field.type === 'number'" class="input-wrapper">
        <input
          :id="fieldId"
          :value="value"
          type="number"
          :placeholder="field.placeholder"
          class="field-input number-input"
          :class="{ 'has-value': value, 'error': error }"
          :readonly="field.readonly"
          :aria-label="field.ariaLabel || field.label"
          :aria-describedby="error ? `${fieldId}-error` : undefined"
          :aria-required="field.required"
          @input="handleInput($event.target.value)"
        />
        <i class="fas fa-hashtag input-icon" aria-hidden="true"></i>
      </div>
      
      <!-- Regular Text Input -->
      <div v-else class="input-wrapper">
        <input
          :id="fieldId"
          :value="value"
          :type="field.type"
          :placeholder="field.placeholder"
          class="field-input"
          :class="{ 'has-value': value, 'error': error }"
          :inputmode="field.inputmode"
          :readonly="field.readonly"
          :aria-label="field.ariaLabel || field.label"
          :aria-describedby="error ? `${fieldId}-error` : undefined"
          :aria-required="field.required"
          @input="handleInput($event.target.value)"
        />
        <i v-if="getInputIcon()" :class="getInputIcon()" class="input-icon" aria-hidden="true"></i>
      </div>
      
      <!-- Error Message -->
      <div 
        v-if="error" 
        :id="`${fieldId}-error`"
        class="field-error"
        role="alert"
        aria-live="polite"
      >
        <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Field } from '../config/formConfig'
import AddressField from './AddressField.vue'

interface Props {
  field: Field
  value: any
  error?: string
}

interface Emits {
  (e: 'input', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const fieldId = computed(() => `field-${props.field.name}`)

const handleInput = (value: string) => {
  emit('input', value)
}

const getInputIcon = (): string => {
  if (props.field.type === 'number') return 'fas fa-hashtag'
  if (props.field.name.includes('cccd')) return 'fas fa-id-card'
  if (props.field.name.includes('dia_chi')) return 'fas fa-map-marker-alt'
  if (props.field.name.includes('tien') || props.field.name.includes('gia')) return 'fas fa-dollar-sign'
  return 'fas fa-edit'
}
</script>

<style scoped>
.field-item {
  position: relative;
  margin-bottom: 0.5rem;
}

.field-item.has-error {
  margin-bottom: 1.5rem;
}

.field-help {
  margin-bottom: 0.5rem;
}

.field-help small {
  color: #6b7280;
  font-size: 0.75rem;
  font-style: italic;
}

.field-error {
  position: absolute;
  bottom: -1.25rem;
  left: 0;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #ef4444;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1;
}

.field-error i {
  font-size: 0.625rem;
}

.field-input.error {
  border-color: #ef4444 !important;
  background-color: #fef2f2 !important;
  color: #dc2626 !important;
}

.field-input.error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
}

/* Radio button styles */
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s ease;
  background: white;
}

.radio-option:hover {
  border-color: #667eea;
  background: #f8faff;
}

.radio-option.selected {
  border-color: #667eea;
  background: #f0f4ff;
}

.radio-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.radio-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  position: relative;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.radio-option:hover .radio-custom {
  border-color: #667eea;
}

.radio-input:checked + .radio-custom {
  border-color: #667eea;
  background: #667eea;
}

.radio-input:checked + .radio-custom::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
}

.radio-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  user-select: none;
}

.radio-option.selected .radio-label {
  color: #667eea;
  font-weight: 600;
}

/* Focus styles for radio buttons */
.radio-input:focus + .radio-custom {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}

/* Mobile responsive for radio groups */
@media (max-width: 640px) {
  .radio-group {
    gap: 0.5rem;
  }
  
  .radio-option {
    padding: 0.5rem;
  }
  
  .radio-custom {
    width: 18px;
    height: 18px;
  }
  
  .radio-input:checked + .radio-custom::after {
    width: 6px;
    height: 6px;
  }
}

/* High contrast mode for radio buttons */
@media (prefers-contrast: high) {
  .radio-option {
    border-width: 3px;
  }
  
  .radio-custom {
    border-width: 3px;
  }
  
  .radio-option.selected {
    border-color: #000;
  }
  
  .radio-input:checked + .radio-custom {
    border-color: #000;
    background: #000;
  }
}

/* Focus management for accessibility */
.field-input:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.field-input:focus-visible {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .field-input {
    border-width: 2px;
  }
  
  .field-input.error {
    border-width: 3px;
    border-color: #dc2626;
  }
  
  .field-error {
    font-weight: 700;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .field-input {
    transition: none;
  }
}
</style>