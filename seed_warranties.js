const { connectDB } = require('./db');

async function seedWarranties() {
    try {
        const db = await connectDB();
        const warrantiesCollection = db.collection('warranties');

        await warrantiesCollection.deleteMany({});

        const warranties = [
            {
                warrantyCode: 'AL-123456',
                productName: 'Nhẫn Cầu Hôn Soleil 1.5 Carat',
                customerName: 'Nguyễn Văn An',
                phone: '0912345678',
                startDate: '2025-01-10',
                expiryDate: '2030-01-10',
                status: 'active',
                specs: 'Kim cương GIA 1.5ct, Vàng trắng 18K',
                benefits: [
                    'Làm sạch và đánh bóng miễn phí trọn đời',
                    'Bảo hành thay đá tấm miễn phí trong 2 năm đầu',
                    'Hỗ trợ thu đổi theo chính sách An LUXURY'
                ]
            },
            {
                warrantyCode: 'AL-888888',
                productName: 'Mặt Dây Chuyền Sapphire Xanh',
                customerName: 'Trần Thị Mỹ',
                phone: '0988888888',
                startDate: '2024-05-15',
                expiryDate: '2029-05-15',
                status: 'active',
                specs: 'Sapphire Ceylon 3.2ct, Vàng trắng 18K',
                benefits: [
                    'Làm sạch định kỳ miễn phí',
                    'Bảo hành móc khóa và mối hàn trọn đời'
                ]
            }
        ];

        await warrantiesCollection.insertMany(warranties);
        console.log('Đã tạo dữ liệu bảo hành mẫu!');
        process.exit(0);
    } catch (error) {
        console.error('Lỗi seed bảo hành:', error);
        process.exit(1);
    }
}

seedWarranties();
