const fs = require('fs');
const path = require('path');

const baseHtml = fs.readFileSync(path.join(__dirname, 'faq.html'), 'utf8');

const pages = [
    {
        filename: 'kiem-dinh.html',
        title: 'Kiểm định Quốc tế',
        content: `
            <h1 style="color: var(--gold-primary); font-size: 2.5rem; margin-bottom: 2rem; font-family: var(--font-heading);">Kiểm định Quốc tế GIA</h1>
            <img src="../images/about-store.png" alt="Kiểm định GIA" style="width: 100%; max-width: 600px; border-radius: 8px; margin-bottom: 2rem;">
            <p style="text-align: left; line-height: 1.8; font-size: 1.1rem; color: var(--text-secondary);">
                100% kim cương tự nhiên từ 3.6 ly trở lên tại An LUXURY đều được kiểm định khắt khe bởi Viện ngọc học Hoa Kỳ (GIA). 
                Giấy kiểm định GIA giống như "tờ giấy khai sinh" của viên kim cương, ghi chép lại đầy đủ 4 yếu tố quan trọng nhất (4C):
                <strong>Color (Màu sắc)</strong>, <strong>Clarity (Độ tinh khiết)</strong>, <strong>Cut (Giác cắt)</strong>, và <strong>Carat (Trọng lượng)</strong>.
            </p>
            <p style="text-align: left; line-height: 1.8; font-size: 1.1rem; color: var(--text-secondary);">
                Sự minh bạch tuyệt đối này đảm bảo mỗi sản phẩm bạn sở hữu từ An LUXURY không chỉ có giá trị thẩm mỹ vượt thời gian mà còn mang lại sự an tâm tuyệt đối về chất lượng và giá trị lưu trữ.
            </p>
        `
    },
    {
        filename: 'che-tac.html',
        title: 'Chế tác Thủ công',
        content: `
            <h1 style="color: var(--gold-primary); font-size: 2.5rem; margin-bottom: 2rem; font-family: var(--font-heading);">Nghệ thuật Chế tác Thủ công</h1>
            <p style="text-align: left; line-height: 1.8; font-size: 1.1rem; color: var(--text-secondary);">
                Mỗi tác phẩm trang sức tại An LUXURY là sự kết hợp hoàn mỹ giữa <strong>công nghệ 3D hiện đại</strong> và <strong>bàn tay tài hoa của nghệ nhân kim hoàn</strong> bậc thầy.
            </p>
            <p style="text-align: left; line-height: 1.8; font-size: 1.1rem; color: var(--text-secondary);">
                Từ ý tưởng phác thảo, thiết kế kỹ thuật số độ xác cao, cho đến quá trình đổ khuôn, đánh bóng và nạm kim cương, mỗi công đoạn đều được thực hiện với độ tỉ mỉ lên đến từng micromet. 
                Chúng tôi cam kết mỗi món trang sức đều đạt độ hoàn hảo tuyệt đối trước khi trao đến tay khách hàng.
            </p>
        `
    },
    {
        filename: 'bao-hanh.html',
        title: 'Bảo hành Trọn đời',
        content: `
            <h1 style="color: var(--gold-primary); font-size: 2.5rem; margin-bottom: 2rem; font-family: var(--font-heading);">Đặc quyền Bảo hành Trọn đời</h1>
            <p style="text-align: left; line-height: 1.8; font-size: 1.1rem; color: var(--text-secondary);">
                Trang sức không chỉ là món đồ làm đẹp, mà còn là kỷ vật đi cùng năm tháng. Vì vậy, An LUXURY mang đến <strong>đặc quyền bảo hành kỹ thuật trọn đời</strong> cho mọi sản phẩm.
            </p>
            <ul style="text-align: left; line-height: 1.8; font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 2rem; list-style-position: inside;">
                <li>Miễn phí làm sạch, đánh bóng trọn đời.</li>
                <li>Hỗ trợ kiểm tra định kỳ chấu giữ kim cương để đảm bảo an toàn tuyệt đối.</li>
                <li>Bảo hành kỹ thuật, chỉnh sửa size nhẫn linh hoạt.</li>
            </ul>
            <p style="text-align: left; line-height: 1.8; font-size: 1.1rem; color: var(--text-secondary);">
                Sự đồng hành của chúng tôi giúp món trang sức của bạn luôn sáng bóng và giữ trọn vẻ đẹp như ngày đầu tiên.
            </p>
        `
    }
];

pages.forEach(page => {
    let newHtml = baseHtml;
    // Replace Title
    newHtml = newHtml.replace('<title>Câu hỏi thường gặp | An LUXURY</title>', '<title>' + page.title + ' | An LUXURY</title>');
    
    // Replace Content inside policy-content
    // We find everything between <div class="policy-content reveal"> and <div style="margin-top: 4rem;">
    const startTag = '<div class="policy-content reveal">';
    const endTag = '<div style="margin-top: 4rem;">';
    
    const startIndex = newHtml.indexOf(startTag) + startTag.length;
    const endIndex = newHtml.indexOf(endTag);
    
    if (startIndex > startTag.length - 1 && endIndex > -1) {
        newHtml = newHtml.substring(0, startIndex) + '\\n' + page.content + '\\n            ' + newHtml.substring(endIndex);
    }
    
    fs.writeFileSync(path.join(__dirname, page.filename), newHtml);
    console.log('Created: ' + page.filename);
});
