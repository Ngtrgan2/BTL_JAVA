const fs = require('fs');
const path = require('path');

const dbDir = path.join(__dirname, 'DB');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const firstNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương'];
const middleNames = ['Thị', 'Văn', 'Hữu', 'Đức', 'Minh', 'Ngọc', 'Quang', 'Hải', 'Tuấn', 'Thanh', 'Quốc', 'Gia', 'Hoài'];
const lastNames = ['Anh', 'Bình', 'Cường', 'Dũng', 'Hà', 'Hương', 'Lan', 'Nam', 'Phong', 'Thảo', 'Trang', 'Sơn', 'Tùng', 'Yến', 'Linh'];
const categories = ['Tư vấn mua hàng', 'Thiết kế trang sức', 'Bảo hành & Sửa chữa', 'Làm mới trang sức', 'Mua quà tặng'];
const statuses = ['pending', 'confirmed', 'completed', 'cancelled'];
const times = ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '16:00', '16:30', '17:00'];
const notes = [
    'Tôi muốn xem nhẫn kim cương', 
    'Cần tư vấn thiết kế dây chuyền cưới', 
    'Mang nhẫn đến đánh bóng', 
    'Tư vấn quà tặng sinh nhật cho vợ', 
    '', 
    'Quan tâm đến bộ sưu tập mới Soleil',
    'Tôi muốn thiết kế nhẫn đôi theo yêu cầu',
    'Bảo hành bông tai bị rớt hột'
];

const generateName = () => {
    const f = firstNames[Math.floor(Math.random() * firstNames.length)];
    const m = middleNames[Math.floor(Math.random() * middleNames.length)];
    const l = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${f} ${m} ${l}`;
};

const generatePhone = () => {
    const prefixes = ['090', '091', '098', '097', '034', '035', '086', '070', '079'];
    const p = prefixes[Math.floor(Math.random() * prefixes.length)];
    const rest = Math.floor(1000000 + Math.random() * 9000000);
    return `${p}${rest}`;
};

const removeAccents = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
};

const bookings = [];

for (let i = 0; i < 30; i++) {
    const name = generateName();
    const emailName = removeAccents(name).toLowerCase().replace(/ /g, '');
    
    // Tạo ngày ngẫu nhiên trong khoảng 7 ngày trước đến 30 ngày sau
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() + Math.floor(Math.random() * 37) - 7);
    const dateStr = dateObj.toISOString().split('T')[0]; // Format YYYY-MM-DD
    
    // Ngày tạo đơn (lùi lại vài ngày)
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 10) - 1);
    
    bookings.push({
        userId: null,
        customerName: name,
        phone: generatePhone(),
        email: `${emailName}${Math.floor(Math.random()*100)}@gmail.com`,
        category: categories[Math.floor(Math.random() * categories.length)],
        date: dateStr,
        time: times[Math.floor(Math.random() * times.length)],
        note: notes[Math.floor(Math.random() * notes.length)],
        productIds: [],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createdAt: { "$date": createdDate.toISOString() }
    });
}

const outputPath = path.join(dbDir, 'lichhen.json');
fs.writeFileSync(outputPath, JSON.stringify(bookings, null, 2), 'utf8');
console.log('Done!');
