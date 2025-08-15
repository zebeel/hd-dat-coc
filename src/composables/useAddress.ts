// composables/useAddress.ts
import { ref, computed } from 'vue'

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

// Mock data từ file JSON đã cung cấp
const provinceData: Province[] = [
  {
    "Type": "province",
    "Code": "42",
    "FullName": "Tỉnh Hà Tĩnh",
    "Wards": [
      {
        "Type": "ward",
        "Code": "18073",
        "FullName": "Phường Thành Sen"
      },
      {
        "Type": "ward",
        "Code": "18100",
        "FullName": "Phường Trần Phú"
      },
      {
        "Type": "ward",
        "Code": "18115",
        "FullName": "Phường Bắc Hồng Lĩnh"
      },
      {
        "Type": "ward",
        "Code": "18118",
        "FullName": "Phường Nam Hồng Lĩnh"
      },
      {
        "Type": "ward",
        "Code": "18652",
        "FullName": "Phường Hà Huy Tập"
      },
      {
        "Type": "ward",
        "Code": "18754",
        "FullName": "Phường Sông Trí"
      },
      {
        "Type": "ward",
        "Code": "18781",
        "FullName": "Phường Hải Ninh"
      },
      {
        "Type": "ward",
        "Code": "18823",
        "FullName": "Phường Vũng Áng"
      },
      {
        "Type": "ward",
        "Code": "18832",
        "FullName": "Phường Hoành Sơn"
      },
      {
        "Type": "ward",
        "Code": "18133",
        "FullName": "Xã Hương Sơn"
      },
      {
        "Type": "ward",
        "Code": "18160",
        "FullName": "Xã Sơn Hồng"
      },
      {
        "Type": "ward",
        "Code": "18163",
        "FullName": "Xã Sơn Tiến"
      },
      {
        "Type": "ward",
        "Code": "18172",
        "FullName": "Xã Sơn Tây"
      },
      {
        "Type": "ward",
        "Code": "18184",
        "FullName": "Xã Sơn Giang"
      },
      {
        "Type": "ward",
        "Code": "18196",
        "FullName": "Xã Sơn Kim 1"
      },
      {
        "Type": "ward",
        "Code": "18199",
        "FullName": "Xã Sơn Kim 2"
      },
      {
        "Type": "ward",
        "Code": "18202",
        "FullName": "Xã Tứ Mỹ"
      },
      {
        "Type": "ward",
        "Code": "18223",
        "FullName": "Xã Kim Hoa"
      },
      {
        "Type": "ward",
        "Code": "18229",
        "FullName": "Xã Đức Thọ"
      },
      {
        "Type": "ward",
        "Code": "18244",
        "FullName": "Xã Đức Minh"
      },
      {
        "Type": "ward",
        "Code": "18262",
        "FullName": "Xã Đức Quang"
      },
      {
        "Type": "ward",
        "Code": "18277",
        "FullName": "Xã Đức Thịnh"
      },
      {
        "Type": "ward",
        "Code": "18304",
        "FullName": "Xã Đức Đồng"
      },
      {
        "Type": "ward",
        "Code": "18313",
        "FullName": "Xã Vũ Quang"
      },
      {
        "Type": "ward",
        "Code": "18322",
        "FullName": "Xã Mai Hoa"
      },
      {
        "Type": "ward",
        "Code": "18328",
        "FullName": "Xã Thượng Đức"
      },
      {
        "Type": "ward",
        "Code": "18352",
        "FullName": "Xã Nghi Xuân"
      },
      {
        "Type": "ward",
        "Code": "18364",
        "FullName": "Xã Đan Hải"
      },
      {
        "Type": "ward",
        "Code": "18373",
        "FullName": "Xã Tiên Điền"
      },
      {
        "Type": "ward",
        "Code": "18394",
        "FullName": "Xã Cổ Đạm"
      },
      {
        "Type": "ward",
        "Code": "18406",
        "FullName": "Xã Can Lộc"
      },
      {
        "Type": "ward",
        "Code": "18409",
        "FullName": "Xã Hồng Lộc"
      },
      {
        "Type": "ward",
        "Code": "18418",
        "FullName": "Xã Tùng Lộc"
      },
      {
        "Type": "ward",
        "Code": "18436",
        "FullName": "Xã Trường Lưu"
      },
      {
        "Type": "ward",
        "Code": "18466",
        "FullName": "Xã Gia Hanh"
      },
      {
        "Type": "ward",
        "Code": "18481",
        "FullName": "Xã Xuân Lộc"
      },
      {
        "Type": "ward",
        "Code": "18484",
        "FullName": "Xã Đồng Lộc"
      },
      {
        "Type": "ward",
        "Code": "18496",
        "FullName": "Xã Hương Khê"
      },
      {
        "Type": "ward",
        "Code": "18502",
        "FullName": "Xã Hà Linh"
      },
      {
        "Type": "ward",
        "Code": "18523",
        "FullName": "Xã Hương Bình"
      },
      {
        "Type": "ward",
        "Code": "18532",
        "FullName": "Xã Hương Phố"
      },
      {
        "Type": "ward",
        "Code": "18544",
        "FullName": "Xã Hương Xuân"
      },
      {
        "Type": "ward",
        "Code": "18547",
        "FullName": "Xã Phúc Trạch"
      },
      {
        "Type": "ward",
        "Code": "18550",
        "FullName": "Xã Hương Đô"
      },
      {
        "Type": "ward",
        "Code": "18562",
        "FullName": "Xã Thạch Hà"
      },
      {
        "Type": "ward",
        "Code": "18568",
        "FullName": "Xã Lộc Hà"
      },
      {
        "Type": "ward",
        "Code": "18583",
        "FullName": "Xã Mai Phụ"
      },
      {
        "Type": "ward",
        "Code": "18586",
        "FullName": "Xã Đông Kinh"
      },
      {
        "Type": "ward",
        "Code": "18601",
        "FullName": "Xã Việt Xuyên"
      },
      {
        "Type": "ward",
        "Code": "18604",
        "FullName": "Xã Thạch Khê"
      },
      {
        "Type": "ward",
        "Code": "18619",
        "FullName": "Xã Đồng Tiến"
      },
      {
        "Type": "ward",
        "Code": "18628",
        "FullName": "Xã Thạch Lạc"
      },
      {
        "Type": "ward",
        "Code": "18634",
        "FullName": "Xã Toàn Lưu"
      },
      {
        "Type": "ward",
        "Code": "18667",
        "FullName": "Xã Thạch Xuân"
      },
      {
        "Type": "ward",
        "Code": "18673",
        "FullName": "Xã Cẩm Xuyên"
      },
      {
        "Type": "ward",
        "Code": "18676",
        "FullName": "Xã Thiên Cầm"
      },
      {
        "Type": "ward",
        "Code": "18682",
        "FullName": "Xã Yên Hòa"
      },
      {
        "Type": "ward",
        "Code": "18685",
        "FullName": "Xã Cẩm Bình"
      },
      {
        "Type": "ward",
        "Code": "18736",
        "FullName": "Xã Cẩm Hưng"
      },
      {
        "Type": "ward",
        "Code": "18739",
        "FullName": "Xã Cẩm Duệ"
      },
      {
        "Type": "ward",
        "Code": "18742",
        "FullName": "Xã Cẩm Trung"
      },
      {
        "Type": "ward",
        "Code": "18748",
        "FullName": "Xã Cẩm Lạc"
      },
      {
        "Type": "ward",
        "Code": "18766",
        "FullName": "Xã Kỳ Xuân"
      },
      {
        "Type": "ward",
        "Code": "18775",
        "FullName": "Xã Kỳ Anh"
      },
      {
        "Type": "ward",
        "Code": "18787",
        "FullName": "Xã Kỳ Văn"
      },
      {
        "Type": "ward",
        "Code": "18790",
        "FullName": "Xã Kỳ Khang"
      },
      {
        "Type": "ward",
        "Code": "18814",
        "FullName": "Xã Kỳ Hoa"
      },
      {
        "Type": "ward",
        "Code": "18838",
        "FullName": "Xã Kỳ Lạc"
      },
      {
        "Type": "ward",
        "Code": "18844",
        "FullName": "Xã Kỳ Thượng"
      }
    ]
  }
]

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
      const remainingAddress = address.replace(hasTinhMatch[1], '').trim()
      
      // Try to find ward in the remaining address
      const province = provinceData.find(p => p.FullName === selectedProvince.value)
      if (province) {
        const ward = province.Wards.find(w => remainingAddress.includes(w.FullName))
        if (ward) {
          selectedWard.value = ward.FullName
          
          // Extract manual address (everything before the ward)
          const manualPart = remainingAddress.replace(ward.FullName, '').replace(/\s*-\s*/g, '').trim()
          if (manualPart) {
            manualAddress.value = manualPart
          }
        }
      }
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