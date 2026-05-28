@echo off
chcp 65001 > nul
echo ===================================================
echo   Đang khởi chạy Website An Luxury (Local Server)
echo   Database: MongoDB Atlas (Kết nối thành công!)
echo ===================================================
echo.
"C:\Users\Admin\AppData\Local\ms-playwright-go\1.57.0\node.exe" server.js
pause
