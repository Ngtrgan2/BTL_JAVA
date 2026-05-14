const newsData = [
    {
        id: 1,
        category: 'Làm đẹp',
        title: 'Ngại Mua Trang Sức Online? Giải Mã 4 Nỗi Lo Khi Chốt Đơn',
        image: '../images/news-1.png',
        date: '09/05/2026',
        content: `
            <p>Mua sắm trang sức trực tuyến đang trở thành xu hướng tất yếu trong kỷ nguyên số. Tuy nhiên, với những mặt hàng giá trị cao như kim cương hay vàng bạc, khách hàng thường không khỏi lo lắng. Dưới đây là 4 nỗi lo phổ biến nhất và cách An LUXURY giúp bạn giải quyết chúng.</p>
            
            <h3>1. Lo ngại về chất lượng thực tế</h3>
            <p>Khách hàng thường sợ hình ảnh trên mạng quá khác xa so với sản phẩm thật. Tại An LUXURY, chúng tôi cam kết sử dụng hình ảnh thực tế 100% và cung cấp video quay cận cảnh từng chi tiết sản phẩm. Đặc biệt, công nghệ 3D interactive cho phép bạn xoay và thu phóng sản phẩm ngay trên website.</p>
            
            <h3>2. Rủi ro về kiểm định</h3>
            <p>Kim cương tại An LUXURY luôn đi kèm với giấy chứng nhận GIA (Gemological Institute of America) - tiêu chuẩn kiểm định uy tín nhất thế giới. Bạn có thể tra cứu mã số cạnh của viên kim cương trực tiếp trên hệ thống GIA toàn cầu.</p>
            
            <h3>3. Vấn đề về size tay</h3>
            <p>Chúng tôi cung cấp hướng dẫn đo size chi tiết và hỗ trợ đổi size miễn phí nếu khách hàng đo chưa chính xác. Đội ngũ tư vấn viên luôn sẵn sàng gọi video để hướng dẫn bạn cách đo đúng nhất.</p>
            
            <h3>4. An toàn trong vận chuyển</h3>
            <p>Mọi đơn hàng của An LUXURY đều được bảo hiểm 100% giá trị và vận chuyển bởi các đối tác logistics chuyên nghiệp nhất. Sản phẩm được đóng gói trong hộp chuyên dụng bảo mật cao.</p>
            
            <p>Hãy để An LUXURY mang đến cho bạn trải nghiệm mua sắm an tâm và đẳng cấp ngay tại nhà!</p>
        `
    },
    {
        id: 2,
        category: 'Trang sức',
        title: 'LiLi’s Pink Muse Club: Diện Giáp Hồng – Hóa Nàng Thơ',
        image: '../images/news-2.png',
        date: '08/05/2026',
        content: `
            <p>Bộ sưu tập "Pink Muse" vừa ra mắt đã tạo nên một cơn sốt trong cộng đồng yêu trang sức. Lấy cảm hứng từ vẻ đẹp dịu dàng nhưng đầy bản lĩnh của phụ nữ hiện đại, các thiết kế sử dụng kim cương hồng và vàng hồng tinh xảo.</p>
            
            <h3>Sức mạnh của sắc hồng</h3>
            <p>Màu hồng không chỉ là sự nữ tính. Tại An LUXURY, chúng tôi định nghĩa màu hồng là một loại "giáp" lộng lẫy, giúp phái đẹp tự tin hơn vào bản thân. Những viên đá quý mang sắc hồng giúp tôn vinh làn da và tạo điểm nhấn thanh lịch cho mọi trang phục.</p>
            
            <h3>Nàng thơ của mọi thời đại</h3>
            <p>Dù bạn đi làm, dự tiệc hay dạo phố, các thiết kế trong Pink Muse Club đều có thể biến bạn thành một nàng thơ thực thụ. Sự kết hợp giữa phong cách cổ điển và hơi thở hiện đại giúp trang sức Pink Muse không bao giờ lỗi mốt.</p>
        `
    },
    {
        id: 3,
        category: 'Trang sức',
        title: 'Chọn Lắc Tay Hợp Mệnh 2026 Để Thu Hút Tài Lộc, May Mắn',
        image: '../images/news-3.png',
        date: '07/05/2026',
        content: `
            <p>Năm 2026 mang theo những vận hội mới. Việc lựa chọn một món trang sức hợp phong thủy không chỉ làm đẹp mà còn mang lại sự an tâm và thu hút năng lượng tích cực. Hãy cùng chuyên gia An LUXURY chọn lắc tay phù hợp với mệnh của bạn.</p>
            
            <h3>Mệnh Kim</h3>
            <p>Nên chọn các mẫu lắc tay vàng trắng hoặc bạch kim với đá quý màu trắng, vàng hoặc nâu. Các thiết kế tối giản nhưng sắc sảo sẽ rất phù hợp.</p>
            
            <h3>Mệnh Thủy</h3>
            <p>Sắc xanh biển hoặc đen là lựa chọn tối ưu. Những viên Sapphire hay Topaz xanh kết hợp cùng bạc hoặc vàng trắng sẽ mang lại sự hài hòa.</p>
            
            <h3>Mệnh Mộc</h3>
            <p>Màu xanh lá hoặc các thiết kế lấy cảm hứng từ thiên nhiên, cây cỏ sẽ giúp người mệnh Mộc thăng hoa hơn trong công việc.</p>
            
            <h3>Mệnh Hỏa</h3>
            <p>Màu đỏ, hồng hoặc tím của Ruby, Amethyst sẽ kích hoạt năng lượng rực rỡ và đam mê cho chủ nhân.</p>
            
            <h3>Mệnh Thổ</h3>
            <p>Vàng, nâu hoặc cam là màu sắc may mắn. Kim cương vàng hoặc Citrine là những lựa chọn không thể bỏ qua.</p>
        `
    },
    {
        id: 4,
        category: 'Cẩm nang',
        title: 'Cách Vệ Sinh Trang Sức Kim Cương Luôn Sáng Bóng Tại Nhà',
        image: '../images/news-4.png',
        date: '06/05/2026',
        content: `
            <p>Kim cương có đặc tính hút dầu mỡ, khiến chúng dễ bị mờ sau một thời gian sử dụng. Để giữ cho món trang sức luôn lấp lánh như ngày đầu, hãy thực hiện các bước vệ sinh đơn giản sau đây.</p>
            
            <h3>Các bước thực hiện</h3>
            <p>1. Pha dung dịch nước ấm và một ít nước rửa chén dịu nhẹ.<br>
               2. Ngâm trang sức trong khoảng 20-30 phút.<br>
               3. Dùng bàn chải lông mềm chải nhẹ nhàng các ngóc ngách, đặc biệt là mặt dưới viên đá.<br>
               4. Rửa sạch bằng nước ấm và lau khô bằng khăn mềm không xơ.</p>
            
            <h3>Lưu ý quan trọng</h3>
            <p>- Tránh sử dụng các hóa chất tẩy rửa mạnh.<br>
               - Không nên vệ sinh trang sức ngay trên bồn rửa mặt để tránh rơi rớt.<br>
               - Định kỳ 6 tháng hãy mang trang sức đến An LUXURY để được bảo dưỡng chuyên nghiệp miễn phí.</p>
        `
    },
    {
        id: 5,
        category: 'Sự kiện',
        title: 'Đặc Quyền VIP: Trải Nghiệm Không Gian Mua Sắm Riêng Tư',
        image: '../images/news-5.png',
        date: '05/05/2026',
        content: `
            <p>An LUXURY chính thức khai trương phòng chờ VIP tại showroom Hà Nội. Đây là không gian được thiết kế dành riêng cho các khách hàng thượng lưu muốn tìm kiếm sự riêng tư và sang trọng tuyệt đối.</p>
            
            <h3>Không gian nghệ thuật</h3>
            <p>Với nội thất bọc nhung, ánh sáng được tinh chỉnh để làm nổi bật vẻ đẹp của đá quý, phòng VIP mang đến cảm giác thư giãn như trong một triển lãm nghệ thuật thực thụ.</p>
            
            <h3>Dịch vụ cá nhân hóa</h3>
            <p>Mỗi khách hàng VIP sẽ được đón tiếp bởi chuyên gia tư vấn riêng, thưởng thức trà/rượu vang hảo hạng và trực tiếp chiêm ngưỡng các bộ sưu tập giới hạn trước khi được công bố rộng rãi.</p>
        `
    },
    {
        id: 6,
        category: 'Xu hướng',
        title: 'Top 10 Mẫu Nhẫn Cưới Được Ưa Chuộng Nhất Mùa Cưới 2026',
        image: '../images/news-6.png',
        date: '04/05/2026',
        content: `
            <p>Mùa cưới 2026 chứng kiến sự lên ngôi của các thiết kế nhẫn cưới độc bản và mang tính cá nhân hóa cao. Dưới đây là 3 xu hướng dẫn đầu tại An LUXURY.</p>
            
            <h3>1. Nhẫn cưới Solitaire hiện đại</h3>
            <p>Vẫn giữ vẻ đẹp vượt thời gian nhưng được cách tân với phần đai mảnh hơn và kỹ thuật gắn đá giấu kín phía dưới.</p>
            
            <h3>2. Cặp nhẫn "Lồng quyện"</h3>
            <p>Hai chiếc nhẫn khi đặt cạnh nhau sẽ tạo nên một biểu tượng hoàn chỉnh, tượng trưng cho sự gắn kết không thể tách rời của lứa đôi.</p>
            
            <h3>3. Nhẫn cưới khắc dấu ấn riêng</h3>
            <p>Khắc vân tay hoặc tọa độ nơi gặp gỡ đầu tiên lên mặt trong của nhẫn đang là dịch vụ được yêu cầu nhiều nhất tại chúng tôi.</p>
        `
    }
];
