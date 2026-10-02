# ==========================================
# Getthawa Facebook Bot - Status & Tunnel Check
# ==========================================
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  เก็ดถะหวา - ตรวจสอบสถานะ Facebook Bot" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan

# 1. ตรวจสอบสถานะ Backend Container
$backendStatus = (docker inspect -f '{{.State.Status}}' getthawa-backend 2>$null).Trim()
if ($backendStatus -eq "running") {
    Write-Host "[1/3] Backend (API Port 8000): RUNNING" -ForegroundColor Green
} else {
    Write-Host "[1/3] Backend: STOPPED -> กำลังเริ่มการทำงาน..." -ForegroundColor Red
    docker compose -f docker-compose.dev.yml up -d backend
    Start-Sleep -Seconds 2
}

# 2. ตรวจสอบสถานะ Tunnel Container
$tunnelStatus = (docker inspect -f '{{.State.Status}}' getthawa-tunnel 2>$null).Trim()
if ($tunnelStatus -ne "running") {
    Write-Host "[2/3] กำลังเริ่มเปิด Cloudflare Tunnel..." -ForegroundColor Yellow
    docker compose -f docker-compose.dev.yml up -d tunnel
    Start-Sleep -Seconds 4
} else {
    Write-Host "[2/3] Tunnel (Cloudflare): RUNNING" -ForegroundColor Green
}

# 3. ดึง URL Tunnel ล่าสุด
$allLogs = docker logs getthawa-tunnel 2>&1
$tunnelUrl = ""
foreach ($line in ($allLogs | Select-Object -Last 100)) {
    if ($line -match "(https://[a-zA-Z0-9\.\-]+\.trycloudflare\.com)") {
        $tunnelUrl = $matches[1].Trim()
    }
}

if (-not $tunnelUrl) {
    Write-Host "กำลังรอ Tunnel เชื่อมต่อ..." -ForegroundColor Yellow
    Start-Sleep -Seconds 3
    $allLogs = docker logs getthawa-tunnel 2>&1
    foreach ($line in ($allLogs | Select-Object -Last 100)) {
        if ($line -match "(https://[a-zA-Z0-9\.\-]+\.trycloudflare\.com)") {
            $tunnelUrl = $matches[1].Trim()
        }
    }
}

$verifyToken = "getthawha_fb_secret_2026"
$callbackUrl = "$tunnelUrl/facebook/webhook"

if ($tunnelUrl) {
    # 4. ทดสอบส่ง Handshake จำลองผ่าน curl.exe
    $testUri = "$callbackUrl`?hub.mode=subscribe`&hub.verify_token=$verifyToken`&hub.challenge=test_ok"
    $testRes = & curl.exe -s "$testUri"
    if ($testRes -match "test_ok") {
        Write-Host "[3/3] Webhook Handshake: VERIFIED (ออนไลน์ พร้อมใช้งาน)" -ForegroundColor Green
    } else {
        Write-Host "[3/3] Webhook Response: $testRes" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Tunnel URL ยังไม่พร้อมใช้งาน กรุณาลองใหม่อีกครั้ง" -ForegroundColor Red
}

Write-Host ""
Write-Host "--------------------------------------------------" -ForegroundColor DarkGray
Write-Host "📌 ข้อมูลสำหรับนำไปกรอกใน Meta for Developers:" -ForegroundColor Cyan
Write-Host "--------------------------------------------------" -ForegroundColor DarkGray
Write-Host "🔗 Callback URL : " -NoNewline; Write-Host $callbackUrl -ForegroundColor Yellow
Write-Host "🔑 Verify Token : " -NoNewline; Write-Host $verifyToken -ForegroundColor Yellow
Write-Host "--------------------------------------------------" -ForegroundColor DarkGray
Write-Host "คำแนะนำในการตั้งค่าที่ Meta Developers:" -ForegroundColor White
Write-Host "1. เข้า https://developers.facebook.com/apps/1281754315024109" -ForegroundColor Gray
Write-Host "2. ไปที่ Messenger -> การตั้งค่า (Settings) -> Webhooks" -ForegroundColor Gray
Write-Host "3. กด 'แก้ไข Callback URL' (Edit Callback URL)" -ForegroundColor Gray
Write-Host "4. นำ Callback URL และ Verify Token ด้านบนไปกรอกแล้วกด 'ยืนยันและบันทึก' (Verify and Save)" -ForegroundColor Gray
Write-Host "5. ตรวจสอบว่าได้ติ๊กเลือก 'messages' และ 'messaging_postbacks'" -ForegroundColor Gray
Write-Host "==========================================" -ForegroundColor Cyan
