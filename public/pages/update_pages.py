import os
import re

html_dir = r"f:\FBU\học tập\Javascript và lập trình web\jewelry-luxury\public\pages"

contents = {
    'ir.html': {
        'title': 'Quan hệ cổ đông (IR)',
        'content': '''<h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem;">1. Thông tin chung</h2>
            <p style="text-align: left; line-height: 1.8;">An LUXURY cam kết minh bạch hóa thông tin, đảm bảo quyền lợi tối đa cho các cổ đông. Chúng tôi luôn duy trì các kênh giao tiếp mở, cập nhật thường xuyên các báo cáo tài chính, chiến lược kinh doanh và định hướng phát triển của công ty trong dài hạn.</p>
            <h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem; margin-top: 2rem;">2. Báo cáo tài chính</h2>
            <p style="text-align: left; line-height: 1.8;">Các báo cáo thường niên, báo cáo quý và các công bố thông tin bất thường được đăng tải đầy đủ tại chuyên mục này. Cổ đông có thể tải về các tài liệu liên quan đến Đại hội đồng cổ đông thường niên và các nghị quyết đã được thông qua.</p>
            <h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem; margin-top: 2rem;">3. Liên hệ IR</h2>
            <p style="text-align: left; line-height: 1.8;">Quý cổ đông và nhà đầu tư có nhu cầu tìm hiểu thông tin chi tiết vui lòng liên hệ Ban Quan hệ Cổ đông qua email: ir@anluxury.com.vn hoặc số điện thoại: (028) 3995 1702.</p>'''
    },
    'careers.html': {
        'title': 'Tuyển dụng',
        'content': '''<h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem;">1. Môi trường làm việc</h2>
            <p style="text-align: left; line-height: 1.8;">Tại An LUXURY, chúng tôi tự hào xây dựng một môi trường làm việc chuyên nghiệp, sáng tạo và đẳng cấp. Nhân sự là tài sản quý giá nhất, do đó, công ty luôn tạo điều kiện để mỗi cá nhân phát huy tối đa năng lực, với lộ trình thăng tiến rõ ràng.</p>
            <h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem; margin-top: 2rem;">2. Các vị trí đang tuyển</h2>
            <ul style="text-align: left; line-height: 1.8; color: var(--text-secondary); margin-left: 20px;">
                <li><strong>Chuyên viên Tư vấn Trang sức:</strong> Số lượng 05. Yêu cầu ngoại hình ưa nhìn, kỹ năng giao tiếp xuất sắc.</li>
                <li><strong>Thợ kim hoàn bậc cao:</strong> Số lượng 02. Yêu cầu ít nhất 5 năm kinh nghiệm trong chế tác kim cương.</li>
                <li><strong>Chuyên viên Marketing:</strong> Số lượng 01. Quản lý các chiến dịch truyền thông thương hiệu cao cấp.</li>
            </ul>
            <h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem; margin-top: 2rem;">3. Cách thức ứng tuyển</h2>
            <p style="text-align: left; line-height: 1.8;">Vui lòng gửi CV đính kèm hình ảnh cá nhân và Portfolio (nếu có) về địa chỉ email: hr@anluxury.com.vn. Tiêu đề email ghi rõ: [Vị trí ứng tuyển] - [Họ và tên].</p>'''
    },
    'export.html': {
        'title': 'Xuất khẩu',
        'content': '''<h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem;">1. Vươn tầm thế giới</h2>
            <p style="text-align: left; line-height: 1.8;">Với chất lượng chế tác đạt tiêu chuẩn quốc tế và nguồn kim cương 100% kiểm định GIA, các sản phẩm của An LUXURY đã và đang chinh phục nhiều thị trường khó tính như Mỹ, Châu Âu, và Nhật Bản. Chúng tôi không ngừng mở rộng mạng lưới đối tác phân phối trên toàn cầu.</p>
            <h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem; margin-top: 2rem;">2. Chính sách đối tác xuất khẩu</h2>
            <p style="text-align: left; line-height: 1.8;">An LUXURY cung cấp các chính sách ưu đãi đặc biệt về giá, hỗ trợ logistic, và quy trình thông quan chuyên nghiệp cho các đối tác nhập khẩu. Các sản phẩm xuất khẩu được đảm bảo tiêu chuẩn đóng gói cao cấp và an toàn tuyệt đối.</p>
            <h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem; margin-top: 2rem;">3. Liên hệ hợp tác</h2>
            <p style="text-align: left; line-height: 1.8;">Để thảo luận về các cơ hội hợp tác xuất khẩu, quý đối tác vui lòng liên hệ phòng Kinh doanh Quốc tế: export@anluxury.com.vn.</p>'''
    },
    'wholesale.html': {
        'title': 'Kinh doanh sỉ',
        'content': '''<h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem;">1. Giải pháp kinh doanh sỉ</h2>
            <p style="text-align: left; line-height: 1.8;">An LUXURY tự hào là nhà cung cấp trang sức kim cương sỉ uy tín cho hàng trăm đại lý và cửa hàng trang sức trên toàn quốc. Chúng tôi cung cấp nguồn hàng ổn định, chất lượng cao với mức chiết khấu cực kỳ cạnh tranh.</p>
            <h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem; margin-top: 2rem;">2. Quyền lợi đại lý</h2>
            <ul style="text-align: left; line-height: 1.8; color: var(--text-secondary); margin-left: 20px;">
                <li>Chiết khấu hấp dẫn theo doanh số tháng/quý.</li>
                <li>Hỗ trợ tài liệu truyền thông, hình ảnh sản phẩm chất lượng cao.</li>
                <li>Hỗ trợ đào tạo kiến thức chuyên sâu về kim cương và kỹ năng bán hàng trang sức cao cấp.</li>
                <li>Chính sách đổi trả hàng hóa linh hoạt.</li>
            </ul>
            <h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem; margin-top: 2rem;">3. Đăng ký đại lý</h2>
            <p style="text-align: left; line-height: 1.8;">Quý khách hàng có nhu cầu làm đại lý phân phối vui lòng liên hệ: wholesale@anluxury.com.vn hoặc gọi số Hotline sỉ: 0909 123 456.</p>'''
    },
    'corporate-gifts.html': {
        'title': 'Quà tặng doanh nghiệp',
        'content': '''<h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem;">1. Quà tặng đẳng cấp</h2>
            <p style="text-align: left; line-height: 1.8;">Trang sức kim cương và các vật phẩm chế tác độc quyền từ An LUXURY là lựa chọn hoàn hảo để tri ân đối tác, khách hàng VIP, hoặc khen thưởng nhân sự xuất sắc. Món quà không chỉ mang giá trị vật chất mà còn thể hiện đẳng cấp và sự tôn trọng của doanh nghiệp.</p>
            <h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem; margin-top: 2rem;">2. Dịch vụ cá nhân hóa</h2>
            <p style="text-align: left; line-height: 1.8;">Chúng tôi cung cấp dịch vụ thiết kế và chế tác theo yêu cầu riêng của doanh nghiệp: khắc logo, thiết kế theo bộ nhận diện thương hiệu, và đóng gói hộp quà tặng sang trọng, mang đậm dấu ấn riêng.</p>
            <h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem; margin-top: 2rem;">3. Ưu đãi số lượng</h2>
            <p style="text-align: left; line-height: 1.8;">An LUXURY có chính sách chiết khấu linh hoạt cho các đơn hàng quà tặng doanh nghiệp với số lượng lớn. Liên hệ ngay bộ phận Khách hàng Doanh nghiệp qua email b2b@anluxury.com.vn để nhận báo giá chi tiết.</p>'''
    },
    'size-guide.html': {
        'title': 'Hướng dẫn đo size trang sức',
        'content': '''<h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem;">1. Hướng dẫn đo size nhẫn</h2>
            <p style="text-align: left; line-height: 1.8;">Sử dụng một sợi chỉ hoặc mảnh giấy dài, quấn quanh ngón tay bạn muốn đeo nhẫn (lưu ý quấn vòng qua khớp ngón tay để đảm bảo nhẫn có thể qua lọt). Đánh dấu điểm giao nhau và dùng thước kẻ đo chiều dài. Lấy chiều dài chia cho 3.14 sẽ ra đường kính nhẫn.</p>
            <h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem; margin-top: 2rem;">2. Hướng dẫn đo size vòng/lắc tay</h2>
            <p style="text-align: left; line-height: 1.8;">Đo chu vi cổ tay của bạn bằng thước dây. Đối với lắc tay, cộng thêm khoảng 1.5 - 2 cm để đeo thoải mái. Đối với vòng tay tròn cứng, đo chiều ngang của lòng bàn tay (từ gốc ngón trỏ đến gốc ngón út) để chọn kích thước vòng lọt tay.</p>
            <h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem; margin-top: 2rem;">3. Hướng dẫn đo size dây chuyền</h2>
            <p style="text-align: left; line-height: 1.8;">Chiều dài dây chuyền phổ biến: 40-45 cm (ngang xương quai xanh), 50-55 cm (giữa ngực), 60 cm (dưới ngực). Bạn có thể dùng một sợi dây để ướm thử chiều dài mong muốn trước khi quyết định kích thước.</p>'''
    },
    'installment.html': {
        'title': 'Mua hàng trả góp',
        'content': '''<h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem;">1. Trả góp 0% qua thẻ tín dụng</h2>
            <p style="text-align: left; line-height: 1.8;">An LUXURY liên kết với hơn 20 ngân hàng lớn tại Việt Nam (Vietcombank, Techcombank, VPBank, Sacombank...) hỗ trợ trả góp 0% lãi suất bằng thẻ tín dụng. Kỳ hạn linh hoạt 3, 6, 9, 12 tháng. Thủ tục đơn giản, duyệt tự động không cần hồ sơ chứng minh thu nhập.</p>
            <h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem; margin-top: 2rem;">2. Trả góp qua công ty tài chính</h2>
            <p style="text-align: left; line-height: 1.8;">Khách hàng không có thẻ tín dụng có thể trả góp qua các công ty tài chính như Home Credit, HD Saison, FE Credit. Chỉ cần mang theo CMND/CCCD và bằng lái xe/hộ khẩu đến trực tiếp showroom, nhân viên sẽ hỗ trợ làm hồ sơ xét duyệt trong 15 phút.</p>
            <h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem; margin-top: 2rem;">3. Điều kiện áp dụng</h2>
            <p style="text-align: left; line-height: 1.8;">Chương trình áp dụng cho đơn hàng có giá trị thanh toán cuối cùng từ 3.000.000 VNĐ trở lên. Vui lòng liên hệ Hotline 1800545457 để được tư vấn chi tiết về các loại thẻ và phí chuyển đổi (nếu có).</p>'''
    },
    'shopping-guide.html': {
        'title': 'Hướng dẫn mua hàng và thanh toán',
        'content': '''<h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem;">1. Mua hàng trực tuyến</h2>
            <p style="text-align: left; line-height: 1.8;">Bước 1: Lựa chọn sản phẩm và thêm vào giỏ hàng. <br>Bước 2: Tiến hành Đặt hàng, điền đầy đủ thông tin giao nhận. <br>Bước 3: Chọn phương thức thanh toán và hoàn tất đơn hàng. <br>Bước 4: An LUXURY sẽ gọi điện xác nhận đơn hàng và tiến hành giao hàng.</p>
            <h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem; margin-top: 2rem;">2. Mua hàng tại Showroom</h2>
            <p style="text-align: left; line-height: 1.8;">Quý khách có thể đến trực tiếp hệ thống Showroom của An LUXURY trên toàn quốc để trải nghiệm thực tế và nhận sự tư vấn chuyên nghiệp từ đội ngũ nhân viên. Khuyến khích đặt lịch hẹn trước để được phục vụ chu đáo nhất.</p>
            <h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem; margin-top: 2rem;">3. Phương thức thanh toán</h2>
            <ul style="text-align: left; line-height: 1.8; color: var(--text-secondary); margin-left: 20px;">
                <li>Thanh toán tiền mặt hoặc quẹt thẻ (Napas, Visa, Mastercard, JCB) tại Showroom.</li>
                <li>Thanh toán chuyển khoản ngân hàng (Vui lòng ghi rõ mã đơn hàng trong nội dung).</li>
                <li>Thanh toán COD (giao hàng nhận tiền) áp dụng với các đơn hàng dưới 20.000.000 VNĐ.</li>
                <li>Thanh toán qua ví điện tử: Momo, ZaloPay, VNPay.</li>
            </ul>'''
    },
    'price-lookup.html': {
        'title': 'Hướng dẫn tra cứu giá',
        'content': '''<h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem;">1. Bảng giá kim cương rời</h2>
            <p style="text-align: left; line-height: 1.8;">An LUXURY cung cấp công cụ tra cứu giá kim cương trực tuyến. Giá kim cương thay đổi theo thị trường và phụ thuộc vào tiêu chuẩn 4C (Cut, Color, Clarity, Carat). Hệ thống được cập nhật giá liên tục mỗi ngày theo biến động tỷ giá và thị trường quốc tế.</p>
            <h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem; margin-top: 2rem;">2. Cách thức tra cứu</h2>
            <p style="text-align: left; line-height: 1.8;">Truy cập vào mục "Kim cương viên", sử dụng các bộ lọc về Trọng lượng (Carat), Nước màu (Color), Độ tinh khiết (Clarity), và Giác cắt (Cut) để tìm kiếm viên kim cương mong muốn. Giá niêm yết đã bao gồm thuế phí và giấy chứng nhận GIA.</p>
            <h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem; margin-top: 2rem;">3. Báo giá thiết kế riêng</h2>
            <p style="text-align: left; line-height: 1.8;">Đối với các mẫu trang sức thiết kế riêng biệt (Bespoke Jewelry), giá cả sẽ phụ thuộc vào khối lượng vàng/platinum thực tế, loại và số lượng đá tấm, cùng chi phí chế tác. Vui lòng liên hệ chuyên viên tư vấn để nhận phác thảo 3D và báo giá chi tiết.</p>'''
    },
    'jewelry-manual.html': {
        'title': 'Cẩm nang sử dụng trang sức',
        'content': '''<h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem;">1. Cách bảo quản kim cương</h2>
            <p style="text-align: left; line-height: 1.8;">Mặc dù kim cương là loại đá cứng nhất, nhưng nó vẫn có thể bị nứt mẻ nếu chịu lực tác động quá mạnh theo một hướng nhất định. Hãy tháo trang sức kim cương khi làm việc nặng, chơi thể thao, hoặc tiếp xúc với hóa chất mạnh. Để các món trang sức riêng biệt trong hộp có lót nhung để tránh trầy xước lẫn nhau.</p>
            <h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem; margin-top: 2rem;">2. Làm sạch trang sức tại nhà</h2>
            <p style="text-align: left; line-height: 1.8;">Ngâm trang sức trong nước ấm pha một chút xà phòng nhẹ (như dầu gội đầu trẻ em) khoảng 15 phút. Dùng bàn chải đánh răng lông thật mềm chải nhẹ nhàng các ngóc ngách, đặc biệt là phía dưới ổ đá. Rửa sạch lại bằng nước ấm và lau khô bằng khăn mềm không có xơ.</p>
            <h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem; margin-top: 2rem;">3. Kiểm tra định kỳ</h2>
            <p style="text-align: left; line-height: 1.8;">An LUXURY khuyến nghị quý khách nên mang trang sức đến cửa hàng ít nhất 6 tháng 1 lần để chuyên gia kiểm tra độ chắc chắn của chấu giữ đá và tiến hành làm sạch sâu bằng sóng siêu âm chuyên dụng, hoàn toàn miễn phí trọn đời.</p>'''
    },
    'faq.html': {
        'title': 'Câu hỏi thường gặp',
        'content': '''<h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem;">1. Tất cả kim cương của An LUXURY đều có giấy kiểm định?</h2>
            <p style="text-align: left; line-height: 1.8;">Đúng vậy. Tất cả kim cương viên từ 3.6 ly trở lên tại An LUXURY đều đi kèm giấy chứng nhận quốc tế từ GIA (Viện Đá quý Hoa Kỳ), đảm bảo giá trị toàn cầu và thông tin minh bạch tuyệt đối.</p>
            <h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem; margin-top: 2rem;">2. Tôi có thể đổi vỏ nhẫn mới sau một thời gian sử dụng không?</h2>
            <p style="text-align: left; line-height: 1.8;">Có. Theo chính sách thu đổi của An LUXURY, bạn hoàn toàn có thể thu lại vỏ nhẫn cũ và bù tiền đổi vỏ nhẫn mới với tỷ lệ thu đổi cực kỳ ưu đãi. Kim cương chủ có thể giữ lại hoặc nâng cấp theo nhu cầu.</p>
            <h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem; margin-top: 2rem;">3. Thời gian giao hàng online là bao lâu?</h2>
            <p style="text-align: left; line-height: 1.8;">Đối với nội thành Hà Nội và TP.HCM: Giao hỏa tốc trong 2-4 tiếng. Đối với các tỉnh thành khác: Thời gian từ 2-5 ngày làm việc thông qua đơn vị vận chuyển bảo đảm có mua bảo hiểm 100% giá trị hàng hóa.</p>'''
    },
    'delivery-policy.html': {
        'title': 'Chính sách giao hàng',
        'content': '''<h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem;">1. Hình thức giao nhận</h2>
            <p style="text-align: left; line-height: 1.8;">An LUXURY cung cấp dịch vụ giao hàng tận nơi trên toàn quốc, đảm bảo an toàn tuyệt đối cho mọi sản phẩm trang sức. Chúng tôi sử dụng các dịch vụ vận chuyển uy tín và mua bảo hiểm 100% giá trị kiện hàng.</p>
            <h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem; margin-top: 2rem;">2. Cước phí và thời gian</h2>
            <p style="text-align: left; line-height: 1.8;"><strong>Miễn phí vận chuyển toàn quốc</strong> cho mọi đơn hàng trang sức kim cương. Thời gian giao hàng từ 2-4 tiếng đối với nội thành, và 2-5 ngày đối với khu vực ngoại tỉnh.</p>
            <h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem; margin-top: 2rem;">3. Quy định kiểm tra hàng</h2>
            <p style="text-align: left; line-height: 1.8;">Khách hàng được quyền kiểm tra tình trạng niêm phong của gói hàng trước khi nhận. Đề nghị quay video quá trình mở hộp (unboxing) để làm cơ sở đối chiếu trong trường hợp phát sinh khiếu nại về sau. Chỉ ký nhận khi sản phẩm đúng mẫu mã và đầy đủ giấy tờ, hóa đơn, giấy kiểm định.</p>'''
    },
    'warranty-policy.html': {
        'title': 'Chính sách bảo hành thu đổi',
        'content': '''<h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem;">1. Chính sách bảo hành trọn đời</h2>
            <p style="text-align: left; line-height: 1.8;">An LUXURY cung cấp dịch vụ làm sạch, đánh bóng, xi mới, nong/bóp size (trong giới hạn cho phép của thiết kế) hoàn toàn MIỄN PHÍ TRỌN ĐỜI. Hỗ trợ thay đá CZ/đá phụ tấm miễn phí trong 6 tháng đầu sử dụng.</p>
            <h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem; margin-top: 2rem;">2. Chính sách thu mua - đổi mới</h2>
            <ul style="text-align: left; line-height: 1.8; color: var(--text-secondary); margin-left: 20px;">
                <li><strong>Kim cương viên GIA:</strong> Thu đổi sang sản phẩm giá trị lớn hơn: 95%. Bán lại lấy tiền mặt: 90%.</li>
                <li><strong>Vỏ trang sức kim cương:</strong> Thu đổi sang sản phẩm khác: 70%. Bán lại lấy tiền mặt: 60%.</li>
                <li><strong>Trang sức vàng/platinum (không đính kim cương):</strong> Áp dụng theo trọng lượng vàng thực tế nhân với đơn giá vàng mua vào của An LUXURY tại thời điểm giao dịch.</li>
            </ul>
            <h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem; margin-top: 2rem;">3. Điều kiện áp dụng</h2>
            <p style="text-align: left; line-height: 1.8;">Sản phẩm còn nguyên vẹn, không bị biến dạng, móp méo nghiêm trọng. Kim cương không bị nứt vỡ, trầy xước, không bị tác động nhiệt/hóa chất làm thay đổi tính chất. Khách hàng bắt buộc phải xuất trình đầy đủ Hóa đơn mua hàng và Giấy chứng nhận GIA (nếu có).</p>'''
    },
    'loyalty-policy.html': {
        'title': 'Chính sách khách hàng thân thiết',
        'content': '''<h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem;">1. Hạng thẻ thành viên</h2>
            <p style="text-align: left; line-height: 1.8;">Chương trình An LUXURY Elite Club được thiết kế nhằm mang lại những đặc quyền xứng tầm. Các hạng thẻ bao gồm: Silver, Gold, Platinum, và Diamond, dựa trên tổng chi tiêu tích lũy của khách hàng.</p>
            <h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem; margin-top: 2rem;">2. Ưu đãi theo hạng thẻ</h2>
            <ul style="text-align: left; line-height: 1.8; color: var(--text-secondary); margin-left: 20px;">
                <li><strong>Silver:</strong> Chiết khấu 2% cho đơn hàng tiếp theo.</li>
                <li><strong>Gold:</strong> Chiết khấu 3%, quà tặng sinh nhật trị giá 1.000.000đ.</li>
                <li><strong>Platinum:</strong> Chiết khấu 5%, ưu tiên thiết kế 3D miễn phí, quà tặng sinh nhật đặc biệt.</li>
                <li><strong>Diamond:</strong> Chiết khấu 8%, vé mời V.I.P dự các sự kiện ra mắt BST, dịch vụ xe đưa đón đến Showroom.</li>
            </ul>
            <h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem; margin-top: 2rem;">3. Tích điểm đổi quà</h2>
            <p style="text-align: left; line-height: 1.8;">Mỗi 100.000đ chi tiêu = 1 điểm. Điểm tích lũy có thể dùng để trừ trực tiếp vào hóa đơn thanh toán hoặc quy đổi thành các voucher trải nghiệm dịch vụ cao cấp tại các đối tác liên kết của An LUXURY.</p>'''
    },
    'privacy-policy.html': {
        'title': 'Chính sách bảo mật thông tin khách hàng',
        'content': '''<h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem;">1. Mục đích thu thập</h2>
            <p style="text-align: left; line-height: 1.8;">Chúng tôi thu thập thông tin cá nhân (Tên, số điện thoại, địa chỉ, email) chỉ để phục vụ cho việc xử lý đơn hàng, giao nhận hàng hóa, thực hiện các chính sách bảo hành, và gửi thông tin khuyến mãi nếu quý khách đồng ý.</p>
            <h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem; margin-top: 2rem;">2. Cam kết bảo mật</h2>
            <p style="text-align: left; line-height: 1.8;">An LUXURY cam kết bảo mật tuyệt đối thông tin cá nhân của khách hàng. Chúng tôi không mua bán, trao đổi hay chia sẻ thông tin cho bất kỳ bên thứ ba nào vì mục đích thương mại, ngoại trừ các đơn vị đối tác vận chuyển và thanh toán để thực hiện đơn hàng.</p>
            <h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem; margin-top: 2rem;">3. Quyền của khách hàng</h2>
            <p style="text-align: left; line-height: 1.8;">Khách hàng có quyền yêu cầu An LUXURY cập nhật, điều chỉnh hoặc xóa bỏ thông tin cá nhân khỏi hệ thống dữ liệu bất kỳ lúc nào bằng cách liên hệ bộ phận CSKH.</p>'''
    },
    'data-processing-policy.html': {
        'title': 'Chính sách xử lý dữ liệu cá nhân',
        'content': '''<h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem;">1. Thu thập dữ liệu trên Website</h2>
            <p style="text-align: left; line-height: 1.8;">Khi quý khách truy cập anluxury.com.vn, hệ thống tự động ghi nhận các thông tin cơ bản như địa chỉ IP, loại trình duyệt, thời gian truy cập nhằm mục đích phân tích lưu lượng và cải thiện trải nghiệm người dùng. Dữ liệu này được thu thập qua Cookies.</p>
            <h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem; margin-top: 2rem;">2. Bảo vệ dữ liệu</h2>
            <p style="text-align: left; line-height: 1.8;">Dữ liệu truyền tải trên website được mã hóa bằng chuẩn SSL (Secure Sockets Layer) cao cấp nhất. Mọi giao dịch thanh toán trực tuyến được thực hiện qua các cổng thanh toán quốc tế được chứng nhận PCI DSS an toàn.</p>
            <h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem; margin-top: 2rem;">3. Thời gian lưu trữ</h2>
            <p style="text-align: left; line-height: 1.8;">Dữ liệu cá nhân của khách hàng sẽ được lưu trữ cho đến khi có yêu cầu hủy bỏ, hoặc tự động hủy trên hệ thống đối với những dữ liệu không còn cần thiết cho hoạt động vận hành và tuân thủ pháp luật.</p>'''
    },
    'hoantien.html': {
        'title': 'Chính sách hoàn tiền',
        'content': '''<h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem;">1. Điều kiện hoàn tiền</h2>
            <p style="text-align: left; line-height: 1.8;">An LUXURY hỗ trợ hoàn tiền 100% trong vòng 48 giờ đối với các đơn hàng trực tuyến nếu phát sinh lỗi từ phía hệ thống (thanh toán dư, thanh toán trùng) hoặc sản phẩm nhận được không đúng như mô tả trên website và xác nhận qua điện thoại.</p>
            <h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem; margin-top: 2rem;">2. Quy trình xử lý</h2>
            <p style="text-align: left; line-height: 1.8;">Ngay sau khi tiếp nhận yêu cầu và xác minh sự việc hợp lệ, bộ phận Kế toán sẽ tiến hành làm lệnh hoàn tiền. Thời gian quý khách nhận được tiền phụ thuộc vào ngân hàng thụ hưởng, thường từ 1-7 ngày làm việc đối với thẻ nội địa và tối đa 15 ngày đối với thẻ tín dụng quốc tế.</p>
            <h2 style="color: var(--gold-primary); text-align: left; margin-bottom: 1rem; margin-top: 2rem;">3. Hình thức hoàn tiền</h2>
            <p style="text-align: left; line-height: 1.8;">Tiền sẽ được hoàn trả đúng vào tài khoản/thẻ ngân hàng, hoặc ví điện tử mà quý khách đã sử dụng để thực hiện giao dịch ban đầu. Trong trường hợp thanh toán COD, số tiền hoàn lại sẽ được chuyển khoản qua STK do khách hàng cung cấp chính chủ.</p>'''
    }
}

for filename, data in contents.items():
    filepath = os.path.join(html_dir, filename)
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace the policy-content div contents
        pattern = r'(<div class="policy-content[^>]*>).*?(</div>\s*</main>)'
        
        # We need to build the replacement
        title = data['title']
        body = data['content']
        
        replacement = f'\\1\n            <h1 style="color: var(--gold-primary); font-size: 2.5rem; margin-bottom: 3rem; font-family: var(--font-heading);">{title}</h1>\n            <div style="text-align: left;">\n                {body}\n            </div>\n            <div style="margin-top: 4rem;">\n                <a href="index.html" class="btn btn-outline" style="border-color: var(--gold-primary); color: var(--gold-primary);">Quay về Trang Chủ</a>\n            </div>\n        \\2'
        
        new_content, count = re.subn(pattern, replacement, content, flags=re.DOTALL)
        
        if count > 0:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filename}")
        else:
            print(f"Failed to update {filename} - pattern not found")
    else:
        print(f"File {filename} not found!")
