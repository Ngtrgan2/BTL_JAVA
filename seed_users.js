const { connectDB } = require('./db');
const bcrypt = require('bcryptjs');

const lastNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'];
const middleNames = ['Văn', 'Thị', 'Đăng', 'Minh', 'Thanh', 'Hữu', 'Anh', 'Bảo', 'Kim', 'Ngọc', 'Phương', 'Tùng', 'Sơn', 'Hải'];
const firstNames = ['An', 'Bình', 'Chi', 'Dũng', 'Em', 'Giang', 'Hương', 'Khánh', 'Linh', 'Minh', 'Nam', 'Oanh', 'Phúc', 'Quỳnh', 'Sơn', 'Thảo', 'Uyên', 'Việt', 'Xuân', 'Yến'];

async function seedUsers() {
    try {
        const db = await connectDB();
        const usersCollection = db.collection('users');

        console.log('Đang tạo thêm 50 tài khoản khách hàng (từ 51 đến 100)...');
        const hashedPassword = await bcrypt.hash('123456', 10);
        
        const newUsers = [];
        for (let i = 51; i <= 100; i++) {
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const middleName = middleNames[Math.floor(Math.random() * middleNames.length)];
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const fullName = `${lastName} ${middleName} ${firstName}`;
            
            const email = `khachhang${i}@gmail.com`;
            const phone = `0${Math.floor(300000000 + Math.random() * 700000000)}`;
            
            newUsers.push({
                fullName,
                phone,
                email,
                password: hashedPassword,
                role: 'customer',
                createdAt: new Date(),
                avatar: null
            });
        }

        // Kiểm tra trùng email trước khi insert (để an toàn nếu chạy lại script)
        for (const user of newUsers) {
            const exists = await usersCollection.findOne({ email: user.email });
            if (!exists) {
                await usersCollection.insertOne(user);
                console.log(`Đã tạo: ${user.fullName} (${user.email})`);
            } else {
                console.log(`Bỏ qua: ${user.email} (Đã tồn tại)`);
            }
        }

        console.log('Hoàn thành tạo 50 tài khoản khách hàng!');
        process.exit(0);
    } catch (error) {
        console.error('Lỗi khi seed data:', error);
        process.exit(1);
    }
}

seedUsers();
