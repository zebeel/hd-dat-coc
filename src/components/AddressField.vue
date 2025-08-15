<!-- components/AddressField.vue -->
<template>
  <div class="address-field">
    <label class="field-label">
      {{ label }}
      <span v-if="required" class="required" aria-label="bắt buộc">*</span>
    </label>
    
    <div class="address-inputs">
      <!-- Manual Address Input -->
      <div class="input-wrapper">
        <label class="input-label">Địa chỉ cụ thể (Thôn, số nhà...)</label>
        <input
          v-model="manualAddress"
          type="text"
          placeholder="VD: Thôn Hưng Mỹ, Số 123..."
          class="field-input address-manual"
          :class="{ 'has-value': manualAddress }"
          @input="handleAddressChange"
        />
        <i class="fas fa-home input-icon" aria-hidden="true"></i>
      </div>
      
      <!-- Ward/Commune Selection -->
      <div class="input-wrapper">
        <label class="input-label">Xã/Phường</label>
        <select 
          v-model="selectedWard"
          class="field-input select-input address-ward"
          :class="{ 'has-value': selectedWard }"
          @change="handleAddressChange"
        >
          <option value="">Chọn Xã/Phường</option>
          <option 
            v-for="ward in wards" 
            :key="ward.code" 
            :value="ward.value"
          >
            {{ ward.label }}
          </option>
        </select>
        <i class="fas fa-chevron-down select-arrow" aria-hidden="true"></i>
      </div>
      
      <!-- Province Selection -->
      <div class="input-wrapper">
        <label class="input-label">Tỉnh/Thành phố</label>
        <select 
          v-model="selectedProvince"
          class="field-input select-input address-province"
          :class="{ 'has-value': selectedProvince }"
          @change="handleProvinceChange"
        >
          <option value="">Chọn Tỉnh/Thành phố</option>
          <option 
            v-for="province in provinces" 
            :key="province.code" 
            :value="province.value"
          >
            {{ province.label }}
          </option>
        </select>
        <i class="fas fa-chevron-down select-arrow" aria-hidden="true"></i>
      </div>
    </div>
    
    <!-- Full Address Preview -->
    <div v-if="fullAddress" class="address-preview">
      <span class="preview-label">Địa chỉ đầy đủ:</span>
      <span class="preview-text">{{ fullAddress }}</span>
    </div>
    
    <!-- Error Message -->
    <div 
      v-if="error" 
      class="field-error"
      role="alert"
      aria-live="polite"
    >
      <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, onMounted } from 'vue'
import { useAddress } from '../composables/useAddress'

interface Props {
  label: string
  value: string
  required?: boolean
  error?: string
}

interface Emits {
  (e: 'input', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const {
  selectedProvince,
  selectedWard,
  manualAddress,
  provinces,
  wards,
  fullAddress,
  parseAddress,
  onProvinceChange
} = useAddress()

// Handle province change
const handleProvinceChange = () => {
  onProvinceChange(selectedProvince.value)
  handleAddressChange()
}

// Handle address change
const handleAddressChange = () => {
  emit('input', fullAddress.value)
}

// Watch for external value changes (e.g., from form reset or load draft)
watch(() => props.value, (newValue) => {
  if (newValue && newValue !== fullAddress.value) {
    parseAddress(newValue)
  }
}, { immediate: true })

// Watch fullAddress changes
watch(fullAddress, (newAddress) => {
  if (newAddress !== props.value) {
    emit('input', newAddress)
  }
})

// Initialize with default province and parse initial value
onMounted(() => {
  // Set default province if not set
  if (!selectedProvince.value) {
    selectedProvince.value = 'Tỉnh Hà Tĩnh'
  }
  
  // Parse initial value if provided
  if (props.value) {
    parseAddress(props.value)
  }
})
</script>

<style scoped>
.address-field {
  margin-bottom: 1rem;
}

.address-inputs {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-wrapper {
  position: relative;
}

.input-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151 !important;
  margin-bottom: 0.5rem;
}

.field-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background: white;
  color: #1f2937 !important;
  min-height: 42px;
}

.field-input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.field-input::placeholder {
  color: #9ca3af;
}

.field-input.address-manual {
  background: #fafafa;
  border-color: #d1d5db;
  color: #1f2937;
}

.field-input.address-manual:focus {
  background: #ffffff;
  border-color: #667eea;
  color: #1f2937;
}

.field-input.address-ward {
  background: #fffbf0;
  border-color: #fed7aa;
  color: #1f2937;
}

.field-input.address-ward:focus {
  background: #ffffff;
  border-color: #f97316;
  color: #1f2937;
}

.field-input.address-ward option {
  background: #ffffff;
  color: #1f2937;
}

.field-input.address-province {
  background: #f0f9ff;
  border-color: #bae6fd;
  color: #1f2937;
}

.field-input.address-province:focus {
  background: #ffffff;
  border-color: #0ea5e9;
  color: #1f2937;
}

.field-input.address-province option {
  background: #ffffff;
  color: #1f2937;
}

.select-arrow {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  pointer-events: none;
  font-size: 0.875rem;
  margin-top: 0.75rem; /* Offset for label */
}

.input-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  pointer-events: none;
  font-size: 0.875rem;
  margin-top: 0.75rem; /* Offset for label */
}

.address-preview {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 6px;
  border-left: 4px solid #10b981;
}

.preview-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #065f46;
  display: block;
  margin-bottom: 0.25rem;
}

.preview-text {
  font-size: 0.875rem;
  color: #047857;
  font-weight: 500;
}

.field-error {
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #ef4444;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Responsive design - Keep vertical layout on all screen sizes for now */
@media (min-width: 768px) {
  .address-inputs {
    gap: 1rem;
  }
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .input-label {
    color: #f9fafb;
  }
  
  .field-input {
    background: #374151;
    border-color: #4b5563;
    color: #f9fafb;
  }
  
  .field-input.address-manual {
    background: #374151;
    border-color: #4b5563;
    color: #f9fafb;
  }
  
  .field-input.address-ward {
    background: #451a03;
    border-color: #9a3412;
    color: #fed7aa;
  }
  
  .field-input.address-province {
    background: #0c4a6e;
    border-color: #0369a1;
    color: #bae6fd;
  }
  
  .address-preview {
    background: #064e3b;
    border-color: #065f46;
  }
  
  .preview-label {
    color: #d1fae5;
  }
  
  .preview-text {
    color: #a7f3d0;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .field-input {
    border-width: 2px;
  }
  
  .address-preview {
    border-width: 2px;
    border-left-width: 4px;
  }
}
</style>