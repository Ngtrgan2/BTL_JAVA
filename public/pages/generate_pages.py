import os

template = """<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} | An LUXURY</title>
    <style>
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #1a1a1a;
            color: #fff;
            text-align: center;
            padding-top: 100px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 80vh;
            margin: 0;
        }}
        .container {{
            background-color: #2a2a2a;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            max-width: 500px;
            border: 1px solid #444;
        }}
        h1 {{
            color: #d4af37;
            font-size: 2rem;
            margin-bottom: 1.5rem;
        }}
        p {{
            color: #ccc;
            margin-bottom: 2rem;
            line-height: 1.6;
        }}
        .back-btn {{
            display: inline-block;
            padding: 12px 30px;
            background-color: transparent;
            color: #d4af37;
            border: 1px solid #d4af37;
            border-radius: 8px;
            cursor: pointer;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
        }}
        .back-btn:hover {{
            background-color: #d4af37;
            color: #111;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>{title}</h1>
        <p>Nội dung phần <strong>{title}</strong> đang trong quá trình hoàn thiện. Xin cảm ơn quý khách đã quan tâm!</p>
        <a href="index.html" class="back-btn">Quay về Trang Chủ</a>
    </div>
</body>
</html>"""

pages = {
    'ir.html': 'Quan hệ cổ đông (IR)',
    'careers.html': 'Tuyển dụng',
    'export.html': 'Xuất khẩu',
    'wholesale.html': 'Kinh doanh sỉ',
    'corporate-gifts.html': 'Quà tặng doanh nghiệp',
    'size-guide.html': 'Hướng dẫn đo size trang sức',
    'installment.html': 'Mua hàng trả góp',
    'shopping-guide.html': 'Hướng dẫn mua hàng và thanh toán',
    'price-lookup.html': 'Hướng dẫn tra cứu giá',
    'jewelry-manual.html': 'Cẩm nang sử dụng trang sức',
    'faq.html': 'Câu hỏi thường gặp',
    'delivery-policy.html': 'Chính sách giao hàng',
    'warranty-policy.html': 'Chính sách bảo hành thu đổi',
    'loyalty-policy.html': 'Chính sách khách hàng thân thiết',
    'privacy-policy.html': 'Chính sách bảo mật thông tin khách hàng',
    'data-processing-policy.html': 'Chính sách xử lý dữ liệu cá nhân'
}

for filename, title in pages.items():
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(template.format(title=title))
print('Pages created successfully.')
