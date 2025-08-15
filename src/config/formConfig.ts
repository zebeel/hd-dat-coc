// config/formConfig.ts
import { ValidationRule } from '../composables/useValidation'

export interface FormData {
  // Basic info
  ngay_ky: string
  tai_dia_chi: string
  
  // Party A (Bên nhận đặt cọc)
  a_ong: string
  a_ong_sinh_ngay: string
  a_ong_cccd: string
  a_ong_cap_ngay: string
  a_ong_noi_cap: string
  a_ba: string
  a_ba_sinh_ngay: string
  a_ba_cccd: string
  a_ba_cap_ngay: string
  a_ba_noi_cap: string
  a_dia_chi: string
  
  // Party B (Bên đặt cọc)
  b_ong: string
  b_ong_sinh_ngay: string
  b_ong_cccd: string
  b_ong_cap_ngay: string
  b_ong_noi_cap: string
  b_dia_chi: string
  
  // Party C (Người làm chứng)
  c_ong: string
  c_ong_sinh_ngay: string
  c_ong_cccd: string
  c_ong_cap_ngay: string
  c_ong_noi_cap: string
  c_dia_chi: string
  tien_c: string
  
  // Property info
  tds: string
  bds: string
  s: string
  dia_chi_thua_dat: string
  dat_so: string
  tai_san_gan_lien_dat: string
  
  // Payment info
  gia_ban: string
  b_coc_tien: string
  coc_bang: string
  coc_ngan_hang: string
  coc_so_tai_khoan: string
  coc_chu_tai_khoan: string
  tien_con_lai: string
  
  // Terms
  so_ngay_coc: number
  ke_tu_ngay: string
  den_ngay: string
  x: number
  boi_thuong: string
  
  // Tax
  tb: string
  tncn: string
  pnn: string
  cc: string
  ben_a: string
  ben_b: string
  thoa_thuan_khac: string
}

export interface Field {
  name: keyof FormData
  label: string
  type: 'text' | 'date' | 'select' | 'textarea' | 'number' | 'radio' | 'address'
  placeholder?: string
  required?: boolean
  readonly?: boolean
  inputmode?: string
  options?: string[]
  defaultValue?: any
  validation?: ValidationRule[]
  ariaLabel?: string
  helpText?: string
  conditionalField?: {
    dependsOn: keyof FormData
    showWhen: string | string[]
  }
}

export interface FieldGroup {
  key: string
  title: string
  icon: string
  colorClass: string
  fields: Field[]
  description?: string
}

export const fieldGroups: FieldGroup[] = [
  {
    key: 'basic',
    title: 'Thông tin cơ bản',
    icon: 'fas fa-calendar-alt',
    colorClass: 'group-blue',
    description: 'Thông tin cơ bản về hợp đồng',
    fields: [
      { 
        name: 'ngay_ky', 
        label: 'Ngày ký hợp đồng', 
        type: 'date', 
        required: true,
        validation: [
          { type: 'required' },
          { type: 'date' }
        ],
        ariaLabel: 'Chọn ngày ký hợp đồng'
      },
      { 
        name: 'tai_dia_chi', 
        label: 'Tại địa chỉ', 
        type: 'address', 
        required: true,
        validation: [
          { type: 'required' },
          { type: 'minLength', value: 10, message: 'Địa chỉ quá ngắn' }
        ],
        ariaLabel: 'Nhập địa chỉ ký hợp đồng',
        defaultValue: 'Thôn Hưng Mỹ - Xã Cẩm Bình - Tỉnh Hà Tĩnh'
      }
    ]
  },
  {
    key: 'partyA',
    title: 'Bên A (Bên nhận đặt cọc)',
    icon: 'fas fa-user-tie',
    colorClass: 'group-green',
    description: 'Thông tin người bán/chuyển nhượng',
    fields: [
      { 
        name: 'a_ong', 
        label: 'Họ tên ông', 
        type: 'text', 
        placeholder: 'Nguyễn Văn A', 
        required: true,
        validation: [
          { type: 'required' },
          { type: 'minLength', value: 2 }
        ]
      },
      { 
        name: 'a_ong_sinh_ngay', 
        label: 'Sinh ngày', 
        type: 'date', 
        required: true,
        validation: [
          { type: 'required' },
          { type: 'date' }
        ]
      },
      { 
        name: 'a_ong_cccd', 
        label: 'Số CCCD/CMND', 
        type: 'text', 
        placeholder: '001234567890', 
        required: true,
        validation: [
          { type: 'required' },
          { type: 'cccd' }
        ]
      },
      { 
        name: 'a_ong_cap_ngay', 
        label: 'Cấp ngày', 
        type: 'date', 
        required: true,
        validation: [
          { type: 'required' },
          { type: 'date' }
        ]
      },
      { 
        name: 'a_ong_noi_cap', 
        label: 'Nơi cấp', 
        type: 'text', 
        placeholder: 'Cục cảnh sát', 
        required: true,
        defaultValue: 'Cục cảnh sát',
        validation: [
          { type: 'required' }
        ]
      },
      { 
        name: 'a_ba', 
        label: 'Họ tên bà', 
        type: 'text', 
        placeholder: 'Nguyễn Thị B',
        validation: [
          { type: 'minLength', value: 2 }
        ]
      },
      { 
        name: 'a_ba_sinh_ngay', 
        label: 'Sinh ngày', 
        type: 'date',
        validation: [
          { type: 'date' }
        ]
      },
      { 
        name: 'a_ba_cccd', 
        label: 'Số CCCD/CMND', 
        type: 'text', 
        placeholder: '001234567891',
        validation: [
          { type: 'cccd' }
        ]
      },
      { 
        name: 'a_ba_cap_ngay', 
        label: 'Cấp ngày', 
        type: 'date',
        validation: [
          { type: 'date' }
        ]
      },
      { 
        name: 'a_ba_noi_cap', 
        label: 'Nơi cấp', 
        type: 'text', 
        placeholder: 'Cục cảnh sát',
        defaultValue: 'Cục cảnh sát'
      },
      { 
        name: 'a_dia_chi', 
        label: 'Địa chỉ thường trú', 
        type: 'address', 
        required: true,
        validation: [
          { type: 'required' },
          { type: 'minLength', value: 10 }
        ],
        defaultValue: 'Thôn Hưng Mỹ - Xã Cẩm Bình - Tỉnh Hà Tĩnh'
      }
    ]
  },
  {
    key: 'partyB',
    title: 'Bên B (Bên đặt cọc)',
    icon: 'fas fa-user',
    colorClass: 'group-orange',
    description: 'Thông tin người mua',
    fields: [
      { 
        name: 'b_ong', 
        label: 'Họ tên ông', 
        type: 'text', 
        placeholder: 'Trần Văn C', 
        required: true,
        validation: [
          { type: 'required' },
          { type: 'minLength', value: 2 }
        ]
      },
      { 
        name: 'b_ong_sinh_ngay', 
        label: 'Sinh ngày', 
        type: 'date', 
        required: true,
        validation: [
          { type: 'required' },
          { type: 'date' }
        ]
      },
      { 
        name: 'b_ong_cccd', 
        label: 'Số CCCD/CMND', 
        type: 'text', 
        placeholder: '001234567892', 
        required: true,
        validation: [
          { type: 'required' },
          { type: 'cccd' }
        ]
      },
      { 
        name: 'b_ong_cap_ngay', 
        label: 'Cấp ngày', 
        type: 'date', 
        required: true,
        validation: [
          { type: 'required' },
          { type: 'date' }
        ]
      },
      { 
        name: 'b_ong_noi_cap', 
        label: 'Nơi cấp', 
        type: 'text', 
        placeholder: 'Cục cảnh sát', 
        required: true,
        defaultValue: 'Cục cảnh sát',
        validation: [
          { type: 'required' }
        ]
      },
      { 
        name: 'b_dia_chi', 
        label: 'Địa chỉ thường trú', 
        type: 'address', 
        required: true,
        validation: [
          { type: 'required' },
          { type: 'minLength', value: 10 }
        ],
        defaultValue: 'Thôn Hưng Mỹ - Xã Cẩm Bình - Tỉnh Hà Tĩnh'
      }
    ]
  },
  {
    key: 'partyC',
    title: 'Bên C (Người làm chứng)',
    icon: 'fas fa-user-check',
    colorClass: 'group-purple',
    description: 'Thông tin người làm chứng (tùy chọn)',
    fields: [
      { 
        name: 'c_ong', 
        label: 'Họ tên ông', 
        type: 'text', 
        placeholder: 'Lê Văn D',
        validation: [
          { type: 'minLength', value: 2 }
        ]
      },
      { 
        name: 'c_ong_sinh_ngay', 
        label: 'Sinh ngày', 
        type: 'date',
        validation: [
          { type: 'date' }
        ]
      },
      { 
        name: 'c_ong_cccd', 
        label: 'Số CCCD/CMND', 
        type: 'text', 
        placeholder: '001234567893',
        validation: [
          { type: 'cccd' }
        ]
      },
      { 
        name: 'c_ong_cap_ngay', 
        label: 'Cấp ngày', 
        type: 'date',
        validation: [
          { type: 'date' }
        ]
      },
      { 
        name: 'c_ong_noi_cap', 
        label: 'Nơi cấp', 
        type: 'text', 
        placeholder: 'Cục cảnh sát',
        defaultValue: 'Cục cảnh sát'
      },
      { 
        name: 'c_dia_chi', 
        label: 'Địa chỉ thường trú', 
        type: 'address',
        validation: [
          { type: 'minLength', value: 10 }
        ],
        defaultValue: 'Thôn Hưng Mỹ - Xã Cẩm Bình - Tỉnh Hà Tĩnh'
      },
      { 
        name: 'tien_c', 
        label: 'Tiền Bên C nhận', 
        type: 'text', 
        placeholder: '0', 
        defaultValue: '0',
        inputmode: 'numeric',
        validation: [
          { type: 'currency' }
        ]
      }
    ]
  },
  {
    key: 'property',
    title: 'Thông tin tài sản',
    icon: 'fas fa-home',
    colorClass: 'group-teal',
    description: 'Chi tiết về tài sản chuyển nhượng',
    fields: [
      { 
        name: 'tds', 
        label: 'Thửa đất số', 
        type: 'number', 
        placeholder: '123', 
        required: true,
        validation: [
          { type: 'required' },
          { type: 'number' }
        ]
      },
      { 
        name: 'bds', 
        label: 'Tờ bản đồ số', 
        type: 'number', 
        placeholder: '45', 
        required: true,
        validation: [
          { type: 'required' },
          { type: 'number' }
        ]
      },
      { 
        name: 's', 
        label: 'Diện tích (m²)', 
        type: 'number', 
        placeholder: '100', 
        required: true,
        validation: [
          { type: 'required' },
          { type: 'number' }
        ]
      },
      { 
        name: 'dia_chi_thua_dat', 
        label: 'Địa chỉ thửa đất', 
        type: 'address', 
        required: true,
        validation: [
          { type: 'required' },
          { type: 'minLength', value: 10 }
        ],
        defaultValue: 'Thôn Hưng Mỹ - Xã Cẩm Bình - Tỉnh Hà Tĩnh'
      },
      { 
        name: 'dat_so', 
        label: 'Số giấy CN QSH-QSD', 
        type: 'text', 
        placeholder: 'QSD001234', 
        required: true,
        validation: [
          { type: 'required' }
        ]
      },
      { 
        name: 'tai_san_gan_lien_dat', 
        label: 'Tài sản gắn liền với đất', 
        type: 'textarea', 
        placeholder: 'Nhà cấp 4, diện tích 80m²', 
        required: true,
        validation: [
          { type: 'required' },
          { type: 'minLength', value: 10 }
        ]
      }
    ]
  },
  {
    key: 'payment',
    title: 'Thông tin thanh toán',
    icon: 'fas fa-money-bill-wave',
    colorClass: 'group-emerald',
    description: 'Chi tiết về giá bán và thanh toán',
    fields: [
      { 
        name: 'gia_ban', 
        label: 'Giá bán', 
        type: 'text', 
        placeholder: '2,000,000,000', 
        required: true,
        inputmode: 'numeric',
        validation: [
          { type: 'required' },
          { type: 'currency' }
        ]
      },
      { 
        name: 'b_coc_tien', 
        label: 'Tiền cọc', 
        type: 'text', 
        placeholder: '200,000,000', 
        required: true,
        inputmode: 'numeric',
        validation: [
          { type: 'required' },
          { type: 'currency' }
        ]
      },
      { 
        name: 'coc_bang', 
        label: 'Cọc bằng', 
        type: 'radio', 
        options: ['Tiền mặt', 'Chuyển khoản'], 
        required: true,
        defaultValue: 'Tiền mặt',
        validation: [
          { type: 'required' }
        ]
      },
      { 
        name: 'coc_ngan_hang', 
        label: 'Ngân hàng', 
        type: 'text', 
        placeholder: 'VD: Vietcombank', 
        required: true,
        validation: [
          { type: 'required' }
        ],
        conditionalField: {
          dependsOn: 'coc_bang',
          showWhen: 'Chuyển khoản'
        }
      },
      { 
        name: 'coc_so_tai_khoan', 
        label: 'Số tài khoản', 
        type: 'text', 
        placeholder: '1234567890', 
        required: true,
        validation: [
          { type: 'required' },
          { type: 'pattern', value: /^[0-9]{8,20}$/, message: 'Số tài khoản phải là 8-20 chữ số' }
        ],
        conditionalField: {
          dependsOn: 'coc_bang',
          showWhen: 'Chuyển khoản'
        }
      },
      { 
        name: 'coc_chu_tai_khoan', 
        label: 'Chủ tài khoản', 
        type: 'text', 
        placeholder: 'NGUYEN VAN A', 
        required: true,
        validation: [
          { type: 'required' },
          { type: 'minLength', value: 2 }
        ],
        conditionalField: {
          dependsOn: 'coc_bang',
          showWhen: 'Chuyển khoản'
        }
      },
      { 
        name: 'tien_con_lai', 
        label: 'Tiền còn lại', 
        type: 'text', 
        placeholder: '1,800,000,000', 
        required: true,
        readonly: true,
        inputmode: 'numeric'
      }
    ]
  },
  {
    key: 'terms',
    title: 'Điều khoản thời hạn',
    icon: 'fas fa-clock',
    colorClass: 'group-indigo',
    description: 'Thời hạn và điều khoản bồi thường',
    fields: [
      { 
        name: 'so_ngay_coc', 
        label: 'Số ngày cọc', 
        type: 'number', 
        placeholder: '30', 
        required: true,
        defaultValue: 30,
        validation: [
          { type: 'required' },
          { type: 'number' }
        ]
      },
      { 
        name: 'ke_tu_ngay', 
        label: 'Kể từ ngày', 
        type: 'date', 
        required: true,
        validation: [
          { type: 'required' },
          { type: 'date' }
        ]
      },
      { 
        name: 'den_ngay', 
        label: 'Đến ngày', 
        type: 'date', 
        required: true,
        readonly: true,
        validation: [
          { type: 'required' },
          { type: 'date' }
        ]
      },
      { 
        name: 'x', 
        label: 'Số lần bồi thường', 
        type: 'number', 
        placeholder: '2', 
        required: true,
        validation: [
          { type: 'required' },
          { type: 'number' }
        ]
      },
      { 
        name: 'boi_thuong', 
        label: 'Tổng tiền bồi thường', 
        type: 'text', 
        placeholder: '400,000,000', 
        required: true,
        readonly: true,
        inputmode: 'numeric'
      }
    ]
  },
  {
    key: 'tax',
    title: 'Thuế và lệ phí',
    icon: 'fas fa-file-invoice-dollar',
    colorClass: 'group-pink',
    description: 'Phân chia thuế và lệ phí giữa các bên',
    fields: [
      { 
        name: 'tb', 
        label: 'Bên chịu lệ phí trước bạ', 
        type: 'select', 
        options: ['A', 'B'], 
        placeholder: 'Chọn bên', 
        required: true,
        defaultValue: 'A',
        validation: [
          { type: 'required' }
        ]
      },
      { 
        name: 'tncn', 
        label: 'Bên chịu thuế TNCN', 
        type: 'select', 
        options: ['A', 'B'], 
        placeholder: 'Chọn bên', 
        required: true,
        defaultValue: 'A',
        validation: [
          { type: 'required' }
        ]
      },
      { 
        name: 'pnn', 
        label: 'Bên chịu thuế PNN', 
        type: 'select', 
        options: ['A', 'B'], 
        placeholder: 'Chọn bên', 
        required: true,
        defaultValue: 'A',
        validation: [
          { type: 'required' }
        ]
      },
      { 
        name: 'cc', 
        label: 'Bên chịu phí công chứng', 
        type: 'select', 
        options: ['A', 'B'], 
        placeholder: 'Chọn bên', 
        required: true,
        defaultValue: 'B',
        validation: [
          { type: 'required' }
        ]
      },
      { 
        name: 'ben_a', 
        label: 'Bên A', 
        type: 'textarea', 
        placeholder: 'Thỏa thuận bên A', 
        defaultValue: 'Giao đúng số lô số thửa đất không tranh chấp',
        required: true,
        validation: [
          { type: 'required' }
        ]
      },
      { 
        name: 'ben_b', 
        label: 'Bên B', 
        type: 'textarea', 
        placeholder: 'Thỏa thuận bên B', 
        defaultValue: 'Chồng đủ tiền còn lại đúng ngày công chứng',
        required: true,
        validation: [
          { type: 'required' }
        ]
      },
      { 
        name: 'thoa_thuan_khac', 
        label: 'Thỏa thuận khác', 
        type: 'textarea', 
        placeholder: 'Ghi chú thêm (nếu có)',
        defaultValue: 'Bên A giao mốc cho bên B trước ngày công chứng',
      }
    ]
  }
]

// Helper function to get field by name
export const getFieldByName = (name: keyof FormData): Field | undefined => {
  return fieldGroups
    .flatMap(group => group.fields)
    .find(field => field.name === name)
}

// Helper function to get required fields
export const getRequiredFields = (): Field[] => {
  return fieldGroups
    .flatMap(group => group.fields)
    .filter(field => field.required)
}

// Helper function to get fields by type
export const getFieldsByType = (type: Field['type']): Field[] => {
  return fieldGroups
    .flatMap(group => group.fields)
    .filter(field => field.type === type)
}