<template>
  <div class="app-container">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <div class="logo-icon">
            <img src="/logo.svg">
          </div>
          <div class="logo-text">
            <h1>Hợp đồng đặt cọc</h1>
            <p>Chuyển nhượng quyền sử dụng đất</p>
          </div>
        </div>
        
        <!-- Progress Steps -->
        <div class="progress-steps">
          <div class="step" :class="{ active: activeStep >= 1 }">
            <div class="step-number">1</div>
            <span class="step-text">Nhập thông tin</span>
          </div>
          <div class="step-divider"></div>
          <div class="step" :class="{ active: activeStep >= 2 }">
            <div class="step-number">2</div>
            <span class="step-text">Xem trước</span>
          </div>
          <div class="step-divider"></div>
          <div class="step" :class="{ active: activeStep >= 3 }">
            <div class="step-number">3</div>
            <span class="step-text">Xuất file</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Mobile Progress -->
    <div class="mobile-progress">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressWidth }"></div>
      </div>
      <p class="progress-text">Bước {{ activeStep }}/3: {{ getStepTitle(activeStep) }}</p>
    </div>

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
                />
                <i class="fas fa-search search-icon"></i>
              </div>

              <!-- Field Groups -->
              <div class="field-groups">
                <div 
                  v-for="group in filteredGroups" 
                  :key="group.key" 
                  class="field-group"
                  :class="group.colorClass"
                >
                  <button 
                    @click="toggleSection(group.key)"
                    class="group-header"
                    :class="{ expanded: expandedSections[group.key] }"
                  >
                    <div class="group-title">
                      <i :class="group.icon"></i>
                      <span>{{ group.title }}</span>
                      <span class="field-count">({{ group.fields.length }})</span>
                    </div>
                    <i class="fas fa-chevron-down toggle-icon"></i>
                  </button>
                  
                  <div v-show="expandedSections[group.key]" class="group-content">
                    <div class="fields-grid">
                      <div 
                        v-for="field in group.fields" 
                        :key="field.name"
                        class="field-item"
                      >
                        <label class="field-label">
                          {{ field.label }}
                          <span v-if="field.required" class="required">*</span>
                        </label>
                        
                        <!-- Select Input -->
                        <div v-if="field.type === 'select'" class="input-wrapper">
                          <select 
                            v-model="formData[field.name]" 
                            class="field-input select-input"
                            :class="{ 'has-value': formData[field.name] }"
                            @change="handleInputChange(field.name, $event.target.value)"
                          >
                            <option value="">{{ field.placeholder }}</option>
                            <option 
                              v-for="option in field.options" 
                              :key="option" 
                              :value="option"
                            >
                              {{ option }}
                            </option>
                          </select>
                          <i class="fas fa-chevron-down select-arrow"></i>
                        </div>
                        
                        <!-- Textarea Input -->
                        <div v-else-if="field.type === 'textarea'" class="input-wrapper">
                          <textarea
                            v-model="formData[field.name]"
                            :placeholder="field.placeholder"
                            class="field-input textarea-input"
                            :class="{ 'has-value': formData[field.name] }"
                            :readonly="field.readonly"
                            rows="3"
                            @input="handleInputChange(field.name, $event.target.value)"
                          ></textarea>
                        </div>
                        
                        <!-- Date Input -->
                        <div v-else-if="field.type === 'date'" class="input-wrapper">
                          <input
                            v-model="formData[field.name]"
                            type="date"
                            lang="vi"
                            class="field-input date-input"
                            :class="{ 'has-value': formData[field.name] }"
                            :readonly="field.readonly"
                            @input="handleInputChange(field.name, $event.target.value)"
                          />
                          <i class="fas fa-calendar-alt date-icon"></i>
                        </div>
                        
                        <!-- Regular Input -->
                        <div v-else class="input-wrapper">
                          <input
                            v-model="formData[field.name]"
                            :type="field.type"
                            :placeholder="field.placeholder"
                            class="field-input"
                            :class="{ 'has-value': formData[field.name] }"
                            :inputmode="field.inputmode"
                            :readonly="field.readonly"
                            @input="handleInputChange(field.name, $event.target.value)"
                          />
                          <i v-if="field.type === 'number'" class="fas fa-hashtag input-icon"></i>
                          <i v-else-if="field.name.includes('cccd')" class="fas fa-id-card input-icon"></i>
                          <i v-else-if="field.name.includes('dia_chi')" class="fas fa-map-marker-alt input-icon"></i>
                          <i v-else class="fas fa-edit input-icon"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="card-footer">
              <button 
                @click="generatePreview" 
                :disabled="isGenerating"
                class="btn btn-primary btn-large"
              >
                <i v-if="isGenerating" class="fas fa-spinner fa-spin"></i>
                <i v-else class="fas fa-eye"></i>
                {{ isGenerating ? 'Đang tạo...' : 'Xem trước hợp đồng' }}
              </button>
              
              <div class="quick-actions">
                <button @click="resetForm" class="btn btn-secondary">
                  <i class="fas fa-undo"></i> Đặt lại
                </button>
                <button @click="saveAsDraft" class="btn btn-secondary">
                  <i class="fas fa-save"></i> Lưu nháp
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Preview Section -->
        <div class="preview-section">
          <div class="preview-card">
            <div class="card-header">
              <h3><i class="fas fa-file-alt"></i> Xem trước hợp đồng</h3>
              
              <div v-if="hasPreview" class="action-buttons">
                <button @click="downloadDocx" class="btn btn-success">
                  <i class="fas fa-download"></i>
                  <span class="btn-text">Tải DOCX</span>
                </button>
                <button @click="printPreview" class="btn btn-warning">
                  <i class="fas fa-print"></i>
                  <span class="btn-text">In</span>
                </button>
              </div>
            </div>
            
            <div class="preview-content">
              <div v-if="!hasPreview" class="preview-placeholder">
                <div class="placeholder-icon">
                  <i class="fas fa-file-contract"></i>
                </div>
                <h4>Chưa có bản xem trước</h4>
                <p>Điền thông tin và nhấn "Xem trước hợp đồng" để tạo bản xem trước</p>
              </div>
              
              <div v-else ref="previewRef" class="contract-preview">
                <div class="contract-document">
                  <div class="contract-header">
                    <h1>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h1>
                    <p class="underline">Độc Lập - Tự Do - Hạnh Phúc</p>
                    <h2>HỢP ĐỒNG ĐẶT CỌC</h2>
                    <p class="subtitle">(V/v: Chuyển nhượng quyền sử dụng đất và tài sản gắn liền với đất)</p>
                  </div>
                  
                  <div class="contract-body">
                    <p class="contract-date">
                      Hôm nay, ngày <strong>{{ getDatePart(formData.ngay_ky, 'day') }}</strong>  
                      tháng <strong>{{ getDatePart(formData.ngay_ky, 'month') }}</strong>  
                      năm <strong>{{ getDatePart(formData.ngay_ky, 'year') }}</strong> . 
                      Tại <strong>{{ formData.tai_dia_chi || '_________________________' }}</strong> .
                    </p>
                    
                    <!-- Bên A -->
                    <div class="contract-section">
                      <h3>Bên nhận đặt cọc (Bên A):</h3>
                      <table class="party-table">
                        <tr>
                          <td>Ông: <strong>{{ formData.a_ong || '_________________________' }}</strong> </td>
                          <td>Sinh ngày: <strong>{{ formatDate(formData.a_ong_sinh_ngay) || '__________' }}</strong> </td>
                        </tr>
                        <tr>
                          <td>CCCD Số: <strong>{{ formData.a_ong_cccd || '______________' }}</strong> </td>
                          <td>Cấp ngày: <strong>{{ formatDate(formData.a_ong_cap_ngay) || '__________' }}</strong> </td>
                          <td>Nơi cấp: <strong>{{ formData.a_ong_noi_cap || '__________' }}</strong> </td>
                        </tr>
                        <tr v-if="formData.a_ba">
                          <td>Và Bà: <strong>{{ formData.a_ba }}</strong> </td>
                          <td>Sinh ngày: <strong>{{ formatDate(formData.a_ba_sinh_ngay) || '__________' }}</strong> </td>
                        </tr>
                        <tr v-if="formData.a_ba">
                          <td>CCCD Số: <strong>{{ formData.a_ba_cccd || '______________' }}</strong> </td>
                          <td>Cấp ngày: <strong>{{ formatDate(formData.a_ba_cap_ngay) || '__________' }}</strong> </td>
                          <td>Nơi cấp: <strong>{{ formData.a_ba_noi_cap || '__________' }}</strong> </td>
                        </tr>
                        <tr>
                          <td colspan="3">Địa chỉ thường trú: <strong>{{ formData.a_dia_chi || '_________________________' }}</strong> </td>
                        </tr>
                      </table>
                    </div>
                    
                    <!-- Bên B -->
                    <div class="contract-section">
                      <h3>Bên đặt cọc (Bên B):</h3>
                      <table class="party-table">
                        <tr>
                          <td>Ông: <strong>{{ formData.b_ong || '_________________________' }}</strong> </td>
                          <td>Sinh ngày: <strong>{{ formatDate(formData.b_ong_sinh_ngay) || '__________' }}</strong> </td>
                        </tr>
                        <tr>
                          <td>CCCD Số: <strong>{{ formData.b_ong_cccd || '______________' }}</strong> </td>
                          <td>Cấp ngày: <strong>{{ formatDate(formData.b_ong_cap_ngay) || '__________' }}</strong> </td>
                          <td>Nơi cấp: <strong>{{ formData.b_ong_noi_cap || '__________' }}</strong> </td>
                        </tr>
                        <tr>
                          <td colspan="3">Địa chỉ thường trú: <strong>{{ formData.b_dia_chi || '_________________________' }}</strong> </td>
                        </tr>
                      </table>
                    </div>
                    
                    <!-- Bên C -->
                    <div v-if="formData.c_ong" class="contract-section">
                      <h3>Người làm chứng (Bên C):</h3>
                      <table class="party-table">
                        <tr>
                          <td>Ông: <strong>{{ formData.c_ong }}</strong> </td>
                          <td>Sinh ngày: <strong>{{ formatDate(formData.c_ong_sinh_ngay) || '__________' }}</strong> </td>
                        </tr>
                        <tr>
                          <td>CCCD Số: <strong>{{ formData.c_ong_cccd || '______________' }}</strong> </td>
                          <td>Cấp ngày: <strong>{{ formatDate(formData.c_ong_cap_ngay) || '__________' }}</strong> </td>
                          <td>Nơi cấp: <strong>{{ formData.c_ong_noi_cap || '__________' }}</strong> </td>
                        </tr>
                        <tr>
                          <td colspan="3">Địa chỉ thường trú: <strong>{{ formData.c_dia_chi || '_________________________' }}</strong> </td>
                        </tr>
                      </table>
                    </div>
                    
                    <p><em>Hai bên đồng ý thực hiện việc đặt cọc theo các thỏa thuận sau đây:</em></p>
                    
                    <!-- ĐIỀU 1: TÀI SẢN ĐẶT CỌC -->
                    <div class="contract-section">
                      <h3>ĐIỀU 1: TÀI SẢN ĐẶT CỌC:</h3>
                      <div class="property-box">
                        <p>Bên A đồng ý bán cho Bên B nhà - đất tại: Thửa đất số: <strong>{{ formData.tds || '___' }}</strong> . Tờ bản đồ số: <strong>{{ formData.bds || '___' }}</strong> . Diện tích: <strong>{{ formData.s || '___' }}</strong>  m².</p>
                        <p>Địa chỉ thửa đất: <strong>{{ formData.dia_chi_thua_dat || '_________________________' }}</strong> .</p>
                        <p>Kèm giấy chứng nhận QSH - QSD đất số: <strong>{{ formData.dat_so || '___' }}</strong> . Tài sản gắn liền với đất: <strong>{{ formData.tai_san_gan_lien_dat || '_________________________' }}</strong> .</p>
                      </div>
                    </div>
                    
                    <!-- ĐIỀU 2: GIÁ BÁN -->
                    <div class="contract-section">
                      <h3>ĐIỀU 2: THỎA THUẬN GIÁ BÁN, CHUYỂN NHƯỢNG:</h3>
                      <table class="payment-table-full">
                        <tr>
                          <td colspan="2">Tổng giá bán: <strong>{{ formData.gia_ban || '_______________' }}</strong> (Bằng chữ: <strong>{{ convertToText(formData.gia_ban) || '_______________' }}</strong> ).</td>
                        </tr>
                        <tr>
                          <td colspan="2">Bên B cọc số tiền: <strong>{{ formData.b_coc_tien || '_______________' }}</strong> (Bằng chữ: <strong>{{ convertToText(formData.b_coc_tien) || '_______________' }}</strong> ). Hình thức cọc bằng <strong>{{ formData.coc_bang || '_______________' }}</strong>.</td>
                        </tr>
                        <tr>
                          <td colspan="2">Số tiền còn lại: <strong>{{ formData.tien_con_lai || '_______________' }}</strong> (Bằng chữ: <strong>{{ convertToText(formData.tien_con_lai) || '_______________' }}</strong> ).</td>
                        </tr>
                      </table>
                    </div>
                    
                    <!-- ĐIỀU 3: THỜI HẠN -->
                    <div class="contract-section">
                      <h3>ĐIỀU 3: THỜI HẠN ĐẶT CỌC - THANH TOÁN:</h3>
                      <p>Thời hạn đặt cọc là: <strong>{{ formData.so_ngay_coc || '___' }}</strong>  (ngày), kể từ ngày <strong>{{ formatDate(formData.ke_tu_ngay) || '___' }}</strong>  đến ngày <strong>{{ formatDate(formData.den_ngay) || '___' }}</strong> </p>
                      
                      <p>Trong thời gian đặt cọc này, Bên A và Bên B sẽ tiến hành làm thủ tục công chứng tại cơ quan nhà nước có thẩm quyền. Khi thủ tục công chứng hoàn tất, Bên B phải giao đủ số tiền còn lại cho Bên A.</p>
                    </div>
                    
                    <!-- ĐIỀU 4: THUẾ VÀ LỆ PHÍ -->
                    <div class="contract-section">
                      <h3>ĐIỀU 4: THỎA THUẬN VỀ THUẾ VÀ LỆ PHÍ:</h3>
                      <table class="tax-table-full">
                        <thead>
                          <tr>
                            <th>Lệ phí trước bạ</th>
                            <th>Thuế thu nhập cá nhân</th>
                            <th>Thuế phi nông nghiệp</th>
                            <th>Phí công chứng</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Bên <strong>{{ formData.tb || '___' }}</strong>  đóng</td>
                            <td>Bên <strong>{{ formData.tncn || '___' }}</strong>  đóng</td>
                            <td>Bên <strong>{{ formData.pnn || '___' }}</strong>  đóng</td>
                            <td>Bên <strong>{{ formData.cc || '___' }}</strong>  đóng</td>
                          </tr>
                          <tr>
                            <td colspan="4" style="text-align: left;">Bên A: <strong>{{ formData.ben_a || '_______________' }}</strong> .</td>
                          </tr>
                          <tr>
                            <td colspan="4" style="text-align: left;">Bên B: <strong>{{ formData.ben_b || '_______________' }}</strong> .</td>
                          </tr>
                          <tr v-if="formData.thoa_thuan_khac">
                            <td colspan="4" style="text-align: left;">Thỏa thuận khác: <strong>{{ formData.thoa_thuan_khac }}</strong> .</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <!-- CAM KẾT CHUNG -->
                    <div class="contract-section">
                      <h3>Cam kết chung:</h3>
                      <p>Bên A cam kết tài sản trên thuộc quyền sở hữu của mình, có đầy đủ các giấy tờ liên quan để chứng minh và Bên A cam đoan tài sản này không có tranh chấp thừa kế, không dính quy hoạch, không có tranh chấp với bất kỳ cơ quan tổ chức, cá nhân nào.</p>
                      
                      <p>Sau khi Hợp đồng được ký kết, quá thời hạn thỏa thuận nêu trên nếu Bên A không chuyển nhượng tài sản đặt cọc trên cho Bên B thì Bên A phải bồi thường cho Bên B gấp <strong>{{ formData.x || '___' }}</strong>  (<strong>{{ convertNumberToText(formData.x) || '___' }}</strong> ) lần số tiền mà Bên B đã đặt cọc cho Bên A. Tổng số tiền hoàn trả và bồi thường là <strong>{{ formData.boi_thuong || '___' }}</strong>  (Bằng chữ: <strong>{{ convertToText(formData.boi_thuong) || '___' }}</strong> ).</p>
                      
                      <p>Ngược lại, nếu Bên B không tiến hành mua thì phải chịu mất số tiền đã đặt cọc. Bên B có quyền chỉ định người đứng tên nhận chuyển nhượng mà không cần sự đồng ý của Bên A.</p>
                      
                      <p v-if="formData.tien_c && formData.tien_c != '0'">Nếu giao dịch không thành công thì Bên C vẫn được nhận đủ <strong>{{ formData.tien_c }}</strong>  trên số tiền đặt cọc, khoản tiền này được trích từ Bên A (nếu Bên B không mua nữa và bỏ cọc) hoặc Bên B (nếu Bên A không bán nữa và đền cọc).</p>
                      
                      <p>Trong quá trình thực hiện nếu có gì trở ngại thì hai bên cùng nhau bàn bạc, thỏa thuận dựa trên tinh thần tôn trọng quyền lợi lẫn nhau. Nếu hai bên không thống nhất được thì đề nghị khiếu nại lên tòa án và giải quyết theo pháp luật Việt Nam quy định. Hợp đồng được lập thành 03 bản, mỗi bên giữ 01 bản và có giá trị pháp lý như nhau.</p>
                    </div>
                  </div>
                  
                  <div class="signature-section">
                    <div class="signature-box">
                      <h4>ĐẠI DIỆN BÊN A</h4>
                      <p>(Ký và ghi rõ họ tên)</p>
                      <div class="signature-line"></div>
                    </div>
                    <div class="signature-box">
                      <h4>ĐẠI DIỆN BÊN B</h4>
                      <p>(Ký và ghi rõ họ tên)</p>
                      <div class="signature-line"></div>
                    </div>
                    <div class="signature-box">
                      <h4>ĐẠI DIỆN BÊN C</h4>
                      <p>(Ký và ghi rõ họ tên)</p>
                      <div class="signature-line"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { reactive, ref, computed, onMounted, watch } from 'vue'

export default {
  name: 'App',
  setup() {
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

    // Field Groups Configuration
    const fieldGroups = [
      {
        key: 'basic',
        title: 'Thông tin cơ bản',
        icon: 'fas fa-calendar-alt',
        colorClass: 'group-blue',
        fields: [
          { name: 'ngay_ky', label: 'Ngày ký hợp đồng', type: 'date', required: true },
          { name: 'tai_dia_chi', label: 'Tại địa chỉ', type: 'text', placeholder: 'Thôn Hưng Mỹ - Cẩm Bình - Hà Tĩnh', required: true }
        ]
      },
      {
        key: 'partyA',
        title: 'Bên A (Bên nhận đặt cọc)',
        icon: 'fas fa-user-tie',
        colorClass: 'group-green',
        fields: [
          { name: 'a_ong', label: 'Họ tên ông', type: 'text', placeholder: 'Nguyễn Văn A', required: true },
          { name: 'a_ong_sinh_ngay', label: 'Sinh ngày', type: 'date', required: true },
          { name: 'a_ong_cccd', label: 'Số CCCD/CMND', type: 'text', placeholder: '001234567890', required: true },
          { name: 'a_ong_cap_ngay', label: 'Cấp ngày', type: 'date', required: true },
          { name: 'a_ong_noi_cap', label: 'Nơi cấp', type: 'text', placeholder: 'Cục cảnh sát', required: true },
          { name: 'a_ba', label: 'Họ tên bà', type: 'text', placeholder: 'Nguyễn Thị B' },
          { name: 'a_ba_sinh_ngay', label: 'Sinh ngày', type: 'date' },
          { name: 'a_ba_cccd', label: 'Số CCCD/CMND', type: 'text', placeholder: '001234567891' },
          { name: 'a_ba_cap_ngay', label: 'Cấp ngày', type: 'date' },
          { name: 'a_ba_noi_cap', label: 'Nơi cấp', type: 'text', placeholder: 'Cục cảnh sát' },
          { name: 'a_dia_chi', label: 'Địa chỉ thường trú', type: 'text', placeholder: 'Thôn Hưng Mỹ - Cẩm Bình - Hà Tĩnh', required: true }
        ]
      },
      {
        key: 'partyB',
        title: 'Bên B (Bên đặt cọc)',
        icon: 'fas fa-user',
        colorClass: 'group-orange',
        fields: [
          { name: 'b_ong', label: 'Họ tên ông', type: 'text', placeholder: 'Trần Văn C', required: true },
          { name: 'b_ong_sinh_ngay', label: 'Sinh ngày', type: 'date', required: true },
          { name: 'b_ong_cccd', label: 'Số CCCD/CMND', type: 'text', placeholder: '001234567892', required: true },
          { name: 'b_ong_cap_ngay', label: 'Cấp ngày', type: 'date', required: true },
          { name: 'b_ong_noi_cap', label: 'Nơi cấp', type: 'text', placeholder: 'Cục cảnh sát', required: true },
          { name: 'b_dia_chi', label: 'Địa chỉ thường trú', type: 'text', placeholder: 'Thôn Hưng Mỹ - Cẩm Bình - Hà Tĩnh', required: true }
        ]
      },
      {
        key: 'partyC',
        title: 'Bên C (Người làm chứng)',
        icon: 'fas fa-user-check',
        colorClass: 'group-purple',
        fields: [
          { name: 'c_ong', label: 'Họ tên ông', type: 'text', placeholder: 'Lê Văn D', required: true },
          { name: 'c_ong_sinh_ngay', label: 'Sinh ngày', type: 'date', required: true },
          { name: 'c_ong_cccd', label: 'Số CCCD/CMND', type: 'text', placeholder: '001234567893', required: true },
          { name: 'c_ong_cap_ngay', label: 'Cấp ngày', type: 'date', required: true },
          { name: 'c_ong_noi_cap', label: 'Nơi cấp', type: 'text', placeholder: 'Cục cảnh sát', required: true },
          { name: 'c_dia_chi', label: 'Địa chỉ thường trú', type: 'text', placeholder: 'Thôn Hưng Mỹ - Cẩm Bình - Hà Tĩnh', required: true },
          { name: 'tien_c', label: 'Tiền Bên C nhận', type: 'text', placeholder: '0', required: true, inputmode: 'numeric' }
        ]
      },
      {
        key: 'property',
        title: 'Thông tin tài sản',
        icon: 'fas fa-home',
        colorClass: 'group-teal',
        fields: [
          { name: 'tds', label: 'Thửa đất số', type: 'number', placeholder: '123', required: true },
          { name: 'bds', label: 'Tờ bản đồ số', type: 'number', placeholder: '45', required: true },
          { name: 's', label: 'Diện tích (m²)', type: 'number', placeholder: '100', required: true },
          { name: 'dia_chi_thua_dat', label: 'Địa chỉ thửa đất', type: 'text', placeholder: 'Thôn Hưng Mỹ - Cẩm Bình - Hà Tĩnh', required: true },
          { name: 'dat_so', label: 'Số giấy CN QSH-QSD', type: 'text', placeholder: 'QSD001234', required: true },
          { name: 'tai_san_gan_lien_dat', label: 'Tài sản gắn liền với đất', type: 'textarea', placeholder: 'Nhà cấp 4, diện tích 80m²', required: true }
        ]
      },
      {
        key: 'payment',
        title: 'Thông tin thanh toán',
        icon: 'fas fa-money-bill-wave',
        colorClass: 'group-emerald',
        fields: [
          { name: 'gia_ban', label: 'Giá bán', type: 'text', placeholder: '2,000,000,000', required: true, inputmode: 'numeric' },
          { name: 'b_coc_tien', label: 'Tiền cọc', type: 'text', placeholder: '200,000,000', required: true, inputmode: 'numeric' },
          { name: 'coc_bang', label: 'Cọc bằng', type: 'text', placeholder: 'Tiền mặt', required: true },
          { name: 'tien_con_lai', label: 'Tiền còn lại', type: 'text', placeholder: '1,800,000,000', required: true, inputmode: 'numeric', readonly: true }
        ]
      },
      {
        key: 'terms',
        title: 'Điều khoản thời hạn',
        icon: 'fas fa-clock',
        colorClass: 'group-indigo',
        fields: [
          { name: 'so_ngay_coc', label: 'Số ngày cọc', type: 'number', placeholder: '30', required: true },
          { name: 'ke_tu_ngay', label: 'Kể từ ngày', type: 'date', required: true },
          { name: 'den_ngay', label: 'Đến ngày', type: 'date', required: true, readonly: true },
          { name: 'x', label: 'Số lần bồi thường', type: 'number', placeholder: '2', required: true },
          { name: 'boi_thuong', label: 'Tổng tiền bồi thường', type: 'text', placeholder: '400,000,000', required: true, readonly: true, inputmode: 'numeric' }
        ]
      },
      {
        key: 'tax',
        title: 'Thuế và lệ phí',
        icon: 'fas fa-file-invoice-dollar',
        colorClass: 'group-pink',
        fields: [
          { name: 'tb', label: 'Bên chịu lệ phí trước bạ', type: 'select', options: ['A', 'B'], placeholder: 'Chọn bên', required: true },
          { name: 'tncn', label: 'Bên chịu thuế TNCN', type: 'select', options: ['A', 'B'], placeholder: 'Chọn bên', required: true },
          { name: 'pnn', label: 'Bên chịu thuế PNN', type: 'select', options: ['A', 'B'], placeholder: 'Chọn bên', required: true },
          { name: 'cc', label: 'Bên chịu phí công chứng', type: 'select', options: ['A', 'B'], placeholder: 'Chọn bên', required: true },
          { name: 'ben_a', label: 'Bên A', type: 'textarea', placeholder: 'Thỏa thuận bên A', required: true },
          { name: 'ben_b', label: 'Bên B', type: 'textarea', placeholder: 'Thỏa thuận bên B', required: true },
          { name: 'thoa_thuan_khac', label: 'Thỏa thuận khác', type: 'textarea', placeholder: 'Ghi chú thêm (nếu có)', required: true }
        ]
      }
    ]

    // Initialize form data
    fieldGroups.forEach(group => {
      group.fields.forEach(field => {
        formData[field.name] = ''
      })
    })

    // Computed
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

    // Methods
    const getStepTitle = (step) => {
      const titles = {
        1: 'Nhập thông tin',
        2: 'Xem trước hợp đồng', 
        3: 'Xuất file và in'
      }
      return titles[step]
    }

    const toggleSection = (section) => {
      expandedSections[section] = !expandedSections[section]
    }

    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      const day = date.getDate().toString().padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    }

    const getDatePart = (dateString, part) => {
      if (!dateString) return part === 'year' ? '____' : '__'
      const date = new Date(dateString)
      if (part === 'day') return date.getDate().toString()
      if (part === 'month') return (date.getMonth() + 1).toString()
      if (part === 'year') return date.getFullYear().toString()
      return '__'
    }

    const formatCurrency = (amount) => {
      if (!amount) return ''
      // Extract numbers from string
      const number = parseFloat(amount.toString().replace(/[^\d]/g, ''))
      if (isNaN(number) || number === 0) return ''
      return number.toLocaleString('en-US')
    }

    const convertToText = (input) => {
    // Hàm xử lý và chuyển đổi input thành số
    function chuyenDoiInput(input) {
        // Nếu đã là số
        if (typeof input === 'number') {
            return input;
        }
        
        // Nếu là string
        if (typeof input === 'string') {
            // Loại bỏ khoảng trắng đầu cuối
            let chuoiSo = input.trim();
            
            // Nếu chuỗi rỗng
            if (chuoiSo === '') {
                return null;
            }
            
            // Loại bỏ các ký tự không phải số, dấu chấm, dấu phẩy
            // Chấp nhận: số, dấu chấm (.), dấu phẩy (,), khoảng trắng
            chuoiSo = chuoiSo.replace(/[^\d.,\s]/g, '');
            
            // Loại bỏ khoảng trắng
            chuoiSo = chuoiSo.replace(/\s/g, '');
            
            // Xử lý trường hợp có cả dấu chấm và phẩy
            // Ví dụ: "1,234.56" hoặc "1.234,56"
            const demCham = (chuoiSo.match(/\./g) || []).length;
            const demPhay = (chuoiSo.match(/,/g) || []).length;
            
            if (demCham > 0 && demPhay > 0) {
                // Tìm vị trí cuối cùng của dấu chấm và phẩy
                const viTriChamCuoi = chuoiSo.lastIndexOf('.');
                const viTriPhayCuoi = chuoiSo.lastIndexOf(',');
                
                if (viTriChamCuoi > viTriPhayCuoi) {
                    // Dấu chấm ở cuối -> format như "1,234.56"
                    chuoiSo = chuoiSo.replace(/,/g, '');
                } else {
                    // Dấu phẩy ở cuối -> format như "1.234,56"
                    chuoiSo = chuoiSo.replace(/\./g, '').replace(',', '.');
                }
            } else if (demPhay === 1) {
                // Chỉ có 1 dấu phẩy -> có thể là dấu thập phân
                const viTriPhay = chuoiSo.indexOf(',');
                const phanSauPhay = chuoiSo.substring(viTriPhay + 1);
                
                // Nếu phần sau phẩy <= 3 ký tự và toàn số -> coi như thập phân
                if (phanSauPhay.length <= 3 && /^\d+$/.test(phanSauPhay)) {
                    chuoiSo = chuoiSo.replace(',', '.');
                } else {
                    // Ngược lại loại bỏ dấu phẩy (coi như phân cách nghìn)
                    chuoiSo = chuoiSo.replace(/,/g, '');
                }
            } else if (demPhay > 1) {
                // Nhiều dấu phẩy -> loại bỏ hết (coi như phân cách nghìn)
                chuoiSo = chuoiSo.replace(/,/g, '');
            } else if (demCham > 1) {
                // Nhiều dấu chấm -> chỉ giữ lại dấu cuối (coi như thập phân)
                const viTriChamCuoi = chuoiSo.lastIndexOf('.');
                chuoiSo = chuoiSo.substring(0, viTriChamCuoi).replace(/\./g, '') + chuoiSo.substring(viTriChamCuoi);
            }
            
            // Chuyển đổi thành số
            const so = parseFloat(chuoiSo);
            return isNaN(so) ? null : so;
        }
        
        return null;
    }
    
    // Chuyển đổi input thành số
    const soTien = chuyenDoiInput(input);
    
    // Mảng các từ số cơ bản
    const chuSo = [
        '', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'
    ];
    
    // Mảng các đơn vị
    const donVi = ['', 'nghìn', 'triệu', 'tỷ'];
    
    // Hàm chuyển đổi một nhóm 3 số
    function chuyenNhom3So(nhom) {
        if (nhom === 0) return '';
        
        let ketQua = '';
        const tram = Math.floor(nhom / 100);
        const chuc = Math.floor((nhom % 100) / 10);
        const donVi = nhom % 10;
        
        // Xử lý hàng trăm
        if (tram > 0) {
            ketQua += chuSo[tram] + ' trăm';
        }
        
        // Xử lý hàng chục
        if (chuc > 1) {
            ketQua += (ketQua ? ' ' : '') + chuSo[chuc] + ' mười';
            if (donVi > 0) {
                if (donVi === 1) {
                    ketQua += ' một';
                } else if (donVi === 5 && chuc > 1) {
                    ketQua += ' lăm';
                } else {
                    ketQua += ' ' + chuSo[donVi];
                }
            }
        } else if (chuc === 1) {
            ketQua += (ketQua ? ' ' : '') + 'mười';
            if (donVi > 0) {
                if (donVi === 5) {
                    ketQua += ' lăm';
                } else {
                    ketQua += ' ' + chuSo[donVi];
                }
            }
        } else if (chuc === 0 && donVi > 0) {
            if (tram > 0) {
                ketQua += ' lẻ ' + chuSo[donVi];
            } else {
                ketQua += chuSo[donVi];
            }
        }
        
        return ketQua.trim();
    }
    
    // Kiểm tra đầu vào
    if (soTien === null || soTien < 0 || !Number.isFinite(soTien)) {
        return 'Số không hợp lệ';
    }
    
    if (soTien === 0) {
        return 'Không đồng';
    }
    
    // Làm tròn đến hàng đồng (loại bỏ phần thập phân)
    const soTienLamTron = Math.floor(soTien);
    
    // Chuyển đổi số thành chuỗi và chia thành các nhóm 3 số
    const chuoiSo = soTienLamTron.toString();
    const doDai = chuoiSo.length;
    let ketQua = '';
    let viTriDonVi = 0;
    
    // Chia số thành các nhóm 3 số từ phải sang trái
    for (let i = doDai; i > 0; i -= 3) {
        const batDau = Math.max(0, i - 3);
        const nhom = parseInt(chuoiSo.substring(batDau, i));
        
        if (nhom > 0) {
            const chuNhom = chuyenNhom3So(nhom);
            if (chuNhom) {
                const donViHienTai = donVi[viTriDonVi] || '';
                ketQua = chuNhom + (donViHienTai ? ' ' + donViHienTai : '') + (ketQua ? ' ' + ketQua : '');
            }
        }
        viTriDonVi++;
    }
    
    // Viết hoa chữ cái đầu và thêm "đồng"
    if (ketQua) {
        ketQua = ketQua.charAt(0).toUpperCase() + ketQua.slice(1) + ' đồng';
    }
    
    return ketQua;
}

    const convertNumberToText = (num) => {
      const numberMap = {
        '1': 'một',
        '2': 'hai', 
        '3': 'ba',
        '4': 'bốn',
        '5': 'năm',
        '6': 'sáu',
        '7': 'bảy',
        '8': 'tám',
        '9': 'chín',
        '10': 'mười',
        '11': 'mười một',
        '12': 'mười hai',
        '13': 'mười ba'
      }
      return numberMap[num?.toString()] || num?.toString() || ''
    }

    const calculateEndDate = () => {
      if (formData.ke_tu_ngay && formData.so_ngay_coc) {
        const startDate = new Date(formData.ke_tu_ngay)
        const days = parseInt(formData.so_ngay_coc) || 0
        const endDate = new Date(startDate)
        endDate.setDate(startDate.getDate() + days)
        formData.den_ngay = endDate.toISOString().split('T')[0]
      }
    }

    const calculateRemainingAmount = () => {
      if (formData.gia_ban && formData.b_coc_tien) {
        const totalPrice = parseFloat(formData.gia_ban.toString().replace(/[^\d]/g, '')) || 0
        const deposit = parseFloat(formData.b_coc_tien.toString().replace(/[^\d]/g, '')) || 0
        const remaining = totalPrice - deposit
        if (remaining >= 0) {
          formData.tien_con_lai = formatCurrency(remaining)
        }
      }
    }

    const calculateCompensation = () => {
      if (formData.b_coc_tien && formData.x) {
        const depositAmount = parseFloat(formData.b_coc_tien.toString().replace(/[^\d]/g, '')) || 0
        const multiplier = parseFloat(formData.x) || 0
        const compensation = depositAmount * multiplier
        if (compensation > 0) {
          formData.boi_thuong = formatCurrency(compensation)
        }
      }
    }

    const validateForm = () => {
      for (const group of fieldGroups) {
        for (const field of group.fields) {
          if (field.required && !formData[field.name]) {
            alert(`Vui lòng nhập ${field.label}`)
            return false
          }
        }
      }
      return true
    }

    // Watch for changes to auto-calculate
    const handleInputChange = (fieldName, value) => {
      formData[fieldName] = value
      
      // Auto-calculate end date when start date or days change
      if (fieldName === 'ke_tu_ngay' || fieldName === 'so_ngay_coc') {
        calculateEndDate()
      }
      
      // Auto-calculate compensation when deposit or multiplier change
      if (fieldName === 'b_coc_tien' || fieldName === 'x') {
        calculateCompensation()
      }

      // Auto-calculate remaining amount when price or deposit change
      if (fieldName === 'gia_ban' || fieldName === 'b_coc_tien') {
        calculateRemainingAmount()
      }

      // Format currency inputs
      if (['gia_ban', 'b_coc_tien', 'tien_con_lai', 'tien_c', 'boi_thuong'].includes(fieldName) && value) {
        const formatted = formatCurrency(value)
        if (formatted) {
          formData[fieldName] = formatted
        }
      }
    }

    const generatePreview = async () => {
      if (!validateForm()) return
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

    const downloadDocx = () => {
      alert('Tính năng tải DOCX sẽ được triển khai sau!')
      activeStep.value = 3
    }

    const printPreview = () => {
      if (!hasPreview.value) return
      if (!validateForm()) return
      
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
              margin: 15mm; 
            }
            
            body {
              font-family: 'Times New Roman', serif;
              line-height: 1.3;
              color: #000;
              font-size: 11pt;
              margin: 0;
              padding: 0;
            }
            
            .contract-document {
              max-width: none;
              margin: 0;
              padding: 0;
            }
            
            .contract-header {
              text-align: center;
              margin-bottom: 20px;
            }
            
            .contract-header h1 {
              font-size: 12pt;
              font-weight: bold;
              margin: 0 0 3px 0;
            }
            
            .contract-header h2 {
              font-size: 14pt;
              font-weight: bold;
              margin: 15px 0 3px 0;
            }
            
            .underline {
              text-decoration: underline;
            }
            
            .contract-section {
              margin: 12px 0;
              page-break-inside: avoid;
            }
            
            .contract-section h3 {
              font-weight: bold;
              margin: 10px 0 6px 0;
              font-size: 11pt;
            }
            
            .party-info p, .contract-body p {
              margin: 3px 0;
            }
            
            .property-box {
              border: 1px solid #000;
              padding: 6px;
              margin: 6px 0;
            }
            
            .party-table,
            .payment-table-full,
            .tax-table-full {
              width: 100%;
              border-collapse: collapse;
              margin: 6px 0;
              page-break-inside: avoid;
            }
            
            .party-table td,
            .payment-table-full td {
              border: 1px solid #000;
              padding: 3px 4px;
              vertical-align: top;
              font-size: 10pt;
            }
            
            .tax-table-full th,
            .tax-table-full td {
              border: 1px solid #000;
              padding: 2px 3px;
              text-align: center;
              vertical-align: middle;
              font-size: 9pt;
            }
            
            .tax-table-full th {
              background-color: #f5f5f5;
              font-weight: bold;
            }
            
            .signature-section {
              margin-top: 25px;
              display: flex;
              justify-content: space-between;
              page-break-inside: avoid;
            }
            
            .signature-box {
              text-align: center;
              width: 32%;
            }
            
            .signature-box h4 {
              font-weight: bold;
              margin-bottom: 25px;
              font-size: 10pt;
            }
            
            .signature-line {
              border-bottom: 1px solid #000;
              margin: 25px 0 8px 0;
              height: 1px;
            }
            
            strong {
              font-weight: bold;
            }
            
            em {
              font-style: italic;
            }
            
            p {
              margin: 4px 0;
              font-size: 11pt;
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

    // Lifecycle
    onMounted(() => {
      // Load draft if exists
      loadDraft()
      
      // Set default date values
      const today = new Date()
      formData.ngay_ky = today.toISOString().split('T')[0]
      
      // Set default values for "Nơi cấp"
      formData.a_ong_noi_cap = 'Cục cảnh sát'
      formData.a_ba_noi_cap = 'Cục cảnh sát'
      formData.b_ong_noi_cap = 'Cục cảnh sát'
      formData.c_ong_noi_cap = 'Cục cảnh sát'
      formData.tb = 'A'
      formData.tncn = 'A'
      formData.cc = 'B'
      formData.pnn = 'A'
      formData.so_ngay_coc = 30
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
      fieldGroups,
      
      // Computed
      progressWidth,
      filteredGroups,
      
      // Methods
      getStepTitle,
      toggleSection,
      formatDate,
      getDatePart,
      convertToText,
      convertNumberToText,
      formatCurrency,
      calculateEndDate,
      calculateRemainingAmount,
      calculateCompensation,
      validateForm,
      handleInputChange,
      generatePreview,
      downloadDocx,
      printPreview,
      resetForm,
      saveAsDraft
    }
  }
}
</script>

<style>
/* Import CSS file */
@import './assets/styles/contract-form.css';
</style>