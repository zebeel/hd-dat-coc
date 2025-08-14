// Hàm chuyển đổi số tiền thành chữ (Tiếng Việt)
function soTienThanhChu(soTien) {
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
    if (typeof soTien !== 'number' || soTien < 0 || !Number.isFinite(soTien)) {
        return 'Số không hợp lệ';
    }
    
    if (soTien === 0) {
        return 'Không đồng';
    }
    
    // Làm tròn đến hàng đồng (loại bỏ phần thập phân)
    soTien = Math.floor(soTien);
    
    // Chuyển đổi số thành chuỗi và chia thành các nhóm 3 số
    const chuoiSo = soTien.toString();
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

// Hàm phụ để format số tiền với dấu phẩy
function formatTien(soTien) {
    return soTien.toLocaleString('vi-VN');
}

// Ví dụ sử dụng
console.log('=== VÍ DỤ SỬ DỤNG ===');
console.log('123 =>', soTienThanhChu(123));
console.log('1,234 =>', soTienThanhChu(1234));
console.log('12,345 =>', soTienThanhChu(12345));
console.log('123,456 =>', soTienThanhChu(123456));
console.log('1,234,567 =>', soTienThanhChu(1234567));
console.log('12,345,678 =>', soTienThanhChu(12345678));
console.log('123,456,789 =>', soTienThanhChu(123456789));
console.log('1,000,000,000 =>', soTienThanhChu(1000000000));
console.log('2,500,000,000 =>', soTienThanhChu(2500000000));

// Hàm demo tương tác
function demo(soTien) {
    console.log(`\nSố tiền: ${formatTien(soTien)} VNĐ`);
    console.log(`Bằng chữ: ${soTienThanhChu(soTien)}`);
    console.log('---');
}