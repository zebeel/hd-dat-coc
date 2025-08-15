// composables/useAddress.ts
import { ref, computed } from 'vue'
import provinceData from './provinceData.json'

export interface Ward {
  Type: string
  Code: string
  FullName: string
}

export interface Province {
  Type: string
  Code: string
  FullName: string
  Wards: Ward[]
}

export const useAddress = () => {
  const selectedProvince = ref<string>('')
  const selectedWard = ref<string>('')
  const manualAddress = ref<string>('')

  // Get list of provinces
  const provinces = computed(() => {
    return provinceData.map(province => ({
      value: province.FullName,
      label: province.FullName,
      code: province.Code
    }))
  })

  // Get wards based on selected province
  const wards = computed(() => {
    const province = provinceData.find(p => p.FullName === selectedProvince.value)
    if (!province) return []
    
    return province.Wards.map(ward => ({
      value: ward.FullName,
      label: ward.FullName,
      code: ward.Code
    }))
  })

  // Generate full address
  const fullAddress = computed(() => {
    const parts = []
    
    if (manualAddress.value.trim()) {
      parts.push(manualAddress.value.trim())
    }
    
    if (selectedWard.value) {
      parts.push(selectedWard.value)
    }
    
    if (selectedProvince.value) {
      parts.push(selectedProvince.value)
    }
    
    return parts.join(' - ')
  })

  // Parse existing address to components
  const parseAddress = (address: string) => {
    if (!address) return

    // Try to extract province (assuming it's "Tỉnh Hà Tĩnh")
    const hasTinhMatch = address.match(/(Tỉnh Hà Tĩnh)/)
    if (hasTinhMatch) {
      selectedProvince.value = hasTinhMatch[1]
      
      // Remove province from address to find ward
      let remainingAddress = address.replace(hasTinhMatch[1], '').trim()
      // Remove trailing dash
      remainingAddress = remainingAddress.replace(/\s*-\s*$/, '').trim()
      
      // Try to find ward in the remaining address
      const province = provinceData.find(p => p.FullName === selectedProvince.value)
      if (province) {
        // Look for ward that matches
        const ward = province.Wards.find(w => remainingAddress.includes(w.FullName))
        if (ward) {
          selectedWard.value = ward.FullName
          
          // Extract manual address (everything before the ward)
          let manualPart = remainingAddress.replace(ward.FullName, '').replace(/\s*-\s*/g, '').trim()
          if (manualPart) {
            manualAddress.value = manualPart
          }
        } else {
          // If no ward found, try to split by " - " and assume last part before province is ward
          const parts = remainingAddress.split(' - ')
          if (parts.length >= 2) {
            // Last part should be ward
            const potentialWard = parts[parts.length - 1].trim()
            const foundWard = province.Wards.find(w => w.FullName.includes(potentialWard) || potentialWard.includes(w.FullName))
            if (foundWard) {
              selectedWard.value = foundWard.FullName
              // Everything before ward is manual address
              manualAddress.value = parts.slice(0, -1).join(' - ').trim()
            } else {
              // If still no ward found, put everything in manual address
              manualAddress.value = remainingAddress
            }
          } else {
            manualAddress.value = remainingAddress
          }
        }
      }
    } else {
      // If no province found, just put everything in manual address
      manualAddress.value = address
    }
  }

  // Reset ward when province changes
  const onProvinceChange = (newProvince: string) => {
    selectedProvince.value = newProvince
    selectedWard.value = ''
  }

  // Search functionality for wards
  const searchWards = (searchTerm: string) => {
    if (!searchTerm) return wards.value
    
    return wards.value.filter(ward => 
      ward.label.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  return {
    // State
    selectedProvince,
    selectedWard,
    manualAddress,
    
    // Computed
    provinces,
    wards,
    fullAddress,
    
    // Methods
    parseAddress,
    onProvinceChange,
    searchWards
  }
}