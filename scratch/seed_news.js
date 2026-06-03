const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('jewelry_db'); // Let's guess the DB name, wait, let me check db.js
    
    const newsData = [
      {
        title: "Công Hậu lập hattrick, U19 Việt Nam đại thắng trận ra quân giải Đông Nam Á",
        summary: "Thi đấu lấn lướt trong phần lớn thời gian, U19 Việt Nam đã đánh bại U19 Timor Leste với tỷ số 3-0 nhờ cú hattrick của tiền đạo Công Hậu.",
        image: "https://images2.thanhnien.vn/528068263637045248/2024/7/17/u19-vn-2-17212260655761828859942.jpg",
        isLatest: true,
        source: "Thể thao",
        createdAt: new Date(Date.now() - 20 * 60000) // 20 mins ago
      },
      {
        title: "Ảnh vệ tinh tiết lộ thiệt hại của 20 cơ sở quân sự Mỹ khắp Trung Đông bị Iran tấn công",
        summary: "",
        image: "https://media.vov.vn/sites/default/files/styles/large/public/2024-04/1_156.jpg",
        isLatest: false,
        source: "Tin tức",
        createdAt: new Date(Date.now() - 1 * 3600000) // 1 hour ago
      },
      {
        title: "Sở GD-ĐT TPHCM nói về sự cố bất thường và các trường hợp đặc biệt trong ngày đầu thi lớp 10",
        summary: "",
        image: "https://icdn.dantri.com.vn/thumb_w/770/2024/06/06/thi-sinh-tphcm-thi-lop-10-1717646505876.jpeg",
        isLatest: false,
        source: "Giáo dục",
        createdAt: new Date(Date.now() - 1.5 * 3600000) // 1.5 hours ago
      },
      {
        title: "Tổng Bí thư, Chủ tịch nước Tô Lâm: Hợp tác kinh tế Việt Nam - Philippines cần nâng lên tầm cao mới",
        summary: "",
        image: "https://vtv1.mediacdn.vn/thumb_w/650/562122370168008704/2024/7/17/chu-tich-nuoc-to-lam-hoi-dam-voi-tong-thong-philippines-3-17212030613861214811904.jpg",
        isLatest: false,
        source: "Chính trị",
        createdAt: new Date(Date.now() - 2 * 3600000) // 2 hours ago
      },
      {
        title: "Tổng Bí thư, Chủ tịch nước Tô Lâm dâng hoa tại Đài tưởng niệm anh hùng dân tộc Philippines Jose Rizal",
        summary: "",
        image: "https://vtv1.mediacdn.vn/thumb_w/650/562122370168008704/2024/7/17/chu-tich-nuoc-to-lam-dang-hoa-tai-dai-tuong-niem-1-1721199341103738012678.jpg",
        isLatest: false,
        source: "Chính trị",
        createdAt: new Date(Date.now() - 3 * 3600000) // 3 hours ago
      },
      {
        title: "Ấn tượng màn trình diễn kỹ thuật sử dụng khiên chống bạo động của chiến sĩ nghĩa vụ",
        summary: "",
        image: "",
        isLatest: false,
        source: "An ninh",
        createdAt: new Date(Date.now() - 4 * 3600000) 
      },
      {
        title: "Quán triệt, triển khai Chỉ thị 05 của Bộ Chính trị về báo chí, truyền thông",
        summary: "",
        image: "",
        isLatest: false,
        source: "Chính trị",
        createdAt: new Date(Date.now() - 5 * 3600000) 
      },
      {
        title: "Trao quà tổng trị giá 465 triệu đồng cho trẻ em và đồng bào vùng khó khăn",
        summary: "",
        image: "",
        isLatest: false,
        source: "Xã hội",
        createdAt: new Date(Date.now() - 6 * 3600000) 
      },
      {
        title: "Trường chuyên đầu tiên ở Hà Nội công bố điểm chuẩn lớp 10: Cao nhất 20,25 điểm",
        summary: "",
        image: "",
        isLatest: false,
        source: "Giáo dục",
        createdAt: new Date(Date.now() - 7 * 3600000) 
      },
      {
        title: "Công bố 3 khu vực quặng vonfram và quặng vàng không đấu giá quyền khai thác",
        summary: "",
        image: "",
        isLatest: false,
        source: "Kinh tế",
        createdAt: new Date(Date.now() - 8 * 3600000) 
      }
    ];

    await db.collection('news').deleteMany({});
    await db.collection('news').insertMany(newsData);
    console.log("Successfully seeded news!");
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
