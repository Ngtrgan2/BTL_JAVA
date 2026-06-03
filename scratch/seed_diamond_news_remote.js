const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('jewelry_db'); 
    
    const diamondNews = [
      {
        title: "Khám phá vẻ đẹp vĩnh cửu của bộ sưu tập nhẫn kim cương mới nhất năm 2024",
        summary: "An LUXURY hân hạnh giới thiệu bộ sưu tập nhẫn kim cương cao cấp với thiết kế tinh xảo, tôn vinh vẻ đẹp sang trọng và đẳng cấp của phái đẹp trong những dịp đặc biệt.",
        image: "https://images.unsplash.com/photo-1605100804763-247f6612d48e?auto=format&fit=crop&q=80&w=800",
        isLatest: true,
        source: "Trang sức",
        createdAt: new Date(Date.now() - 9 * 3600000)
      },
      {
        title: "Bí quyết chọn mua kim cương GIA chuẩn xác nhất cho người mới bắt đầu",
        summary: "Hiểu rõ về tiêu chuẩn 4C (Color, Clarity, Cut, Carat) và chứng nhận GIA sẽ giúp bạn tự tin hơn khi đầu tư vào những viên kim cương đắt giá.",
        image: "https://images.unsplash.com/photo-1599643478514-4a820cbf311e?auto=format&fit=crop&q=80&w=800",
        isLatest: false,
        source: "Cẩm nang",
        createdAt: new Date(Date.now() - 12 * 3600000)
      },
      {
        title: "Xu hướng trang sức cưới 2024: Nhẫn cầu hôn đính kim cương tự nhiên lên ngôi",
        summary: "Theo dự báo từ các chuyên gia, nhẫn cầu hôn kim cương với kiểu dáng tối giản (minimalism) nhưng tôn lên viên chủ đang là lựa chọn hàng đầu của giới trẻ.",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800",
        isLatest: false,
        source: "Xu hướng",
        createdAt: new Date(Date.now() - 15 * 3600000)
      },
      {
        title: "Sự khác biệt giữa kim cương tự nhiên và kim cương nhân tạo",
        summary: "Cùng An LUXURY tìm hiểu những điểm khác biệt cốt lõi về giá trị, nguồn gốc và ý nghĩa phong thủy giữa hai loại kim cương phổ biến trên thị trường.",
        image: "https://images.unsplash.com/photo-1573408301145-b98c41d014c4?auto=format&fit=crop&q=80&w=800",
        isLatest: false,
        source: "Kiến thức",
        createdAt: new Date(Date.now() - 20 * 3600000)
      },
      {
        title: "Bảo quản trang sức kim cương luôn sáng bóng như mới ngay tại nhà",
        summary: "Những mẹo nhỏ làm sạch và bảo quản trang sức an toàn giúp những bộ trang sức kim cương của bạn luôn giữ được vẻ đẹp lấp lánh nguyên bản.",
        image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=800",
        isLatest: false,
        source: "Mẹo vặt",
        createdAt: new Date(Date.now() - 24 * 3600000)
      },
      {
        title: "Công Hậu lập hattrick, U19 Việt Nam đại thắng trận ra quân giải Đông Nam Á",
        summary: "Thi đấu lấn lướt trong phần lớn thời gian, U19 Việt Nam đã đánh bại U19 Timor Leste với tỷ số 3-0 nhờ cú hattrick của tiền đạo Công Hậu.",
        image: "https://images2.thanhnien.vn/528068263637045248/2024/7/17/u19-vn-2-17212260655761828859942.jpg",
        isLatest: false,
        source: "Thể thao",
        createdAt: new Date(Date.now() - 2 * 60000)
      },
      {
        title: "Ảnh vệ tinh tiết lộ thiệt hại của 20 cơ sở quân sự Mỹ khắp Trung Đông bị Iran tấn công",
        summary: "",
        image: "https://media.vov.vn/sites/default/files/styles/large/public/2024-04/1_156.jpg",
        isLatest: false,
        source: "Tin tức",
        createdAt: new Date(Date.now() - 1 * 3600000) 
      },
      {
        title: "Sở GD-ĐT TPHCM nói về sự cố bất thường và các trường hợp đặc biệt trong ngày đầu thi lớp 10",
        summary: "",
        image: "https://icdn.dantri.com.vn/thumb_w/770/2024/06/06/thi-sinh-tphcm-thi-lop-10-1717646505876.jpeg",
        isLatest: false,
        source: "Giáo dục",
        createdAt: new Date(Date.now() - 1.5 * 3600000) 
      },
      {
        title: "Tổng Bí thư, Chủ tịch nước Tô Lâm: Hợp tác kinh tế Việt Nam - Philippines cần nâng lên tầm cao mới",
        summary: "",
        image: "https://vtv1.mediacdn.vn/thumb_w/650/562122370168008704/2024/7/17/chu-tich-nuoc-to-lam-hoi-dam-voi-tong-thong-philippines-3-17212030613861214811904.jpg",
        isLatest: false,
        source: "Chính trị",
        createdAt: new Date(Date.now() - 2 * 3600000)
      }
    ];

    // Xóa hết tin tức cũ để nhìn cho sạch sẽ, dễ đồng bộ
    await db.collection('news').deleteMany({});
    await db.collection('news').insertMany(diamondNews);
    console.log("Successfully seeded diamond news to remote Atlas DB!");
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
