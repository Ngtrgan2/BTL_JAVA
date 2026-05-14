const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = "mongodb+srv://truongandzaisomot_db_user:an101205@anluxury.nnqcyjd.mongodb.net/?appName=anluxury";
const client = new MongoClient(uri);

async function seedUsers() {
    try {
        await client.connect();
        const db = client.db('jewelry_db');
        const users = db.collection('users');

        // Clear existing admin/staff to avoid duplicates during testing
        await users.deleteMany({ role: { $in: ['admin', 'staff'] } });

        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash('admin123', salt);
        const staffPassword = await bcrypt.hash('staff123', salt);

        const adminUser = {
            fullName: 'Admin User',
            email: 'admin@anluxury.com',
            phone: '0999999999',
            password: adminPassword,
            role: 'admin',
            createdAt: new Date()
        };

        const staffUser = {
            fullName: 'Staff Member',
            email: 'staff@anluxury.com',
            phone: '0888888888',
            password: staffPassword,
            role: 'staff',
            createdAt: new Date()
        };

        await users.insertMany([adminUser, staffUser]);

        console.log('✅ Đã tạo tài khoản Admin & Staff thành công!');
        console.log('-------------------------------------------');
        console.log('Admin: admin@anluxury.com / admin123');
        console.log('Staff: staff@anluxury.com / staff123');
        console.log('-------------------------------------------');

    } catch (error) {
        console.error('Lỗi seeding users:', error);
    } finally {
        await client.close();
    }
}

seedUsers();
