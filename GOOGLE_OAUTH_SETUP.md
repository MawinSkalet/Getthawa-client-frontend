# Google OAuth — localhost และ production

โค้ดและค่าที่ไม่ใช่ความลับเตรียมไว้แล้ว แต่ยังไม่ได้สร้าง OAuth client ในบัญชี Google Cloud และยังไม่ได้ทดสอบด้วยบัญชี Google จริง

## 1. สร้าง client สำหรับ localhost

เปิด https://console.cloud.google.com/auth/clients เลือกหรือสร้างโปรเจกต์ของร้าน
ตั้งค่า Google Auth Platform / Branding เป็น Getthawha Thai Massage และกรอกอีเมลติดต่อของร้าน
เลือก Audience ให้เหมาะกับลูกค้าภายนอกองค์กร หากแอปอยู่ใน Testing ให้เพิ่มบัญชีที่จะทดสอบเมื่อ Console กำหนด
สร้าง OAuth client ประเภท Web application ชื่อ Getthawha Local

Authorized redirect URI (ต้องตรงทุกตัว ไม่มี / เพิ่มท้าย):

    http://localhost:8000/google/authorization

ระบบนี้ใช้ server redirect flow จึงไม่ต้องตั้ง Authorized JavaScript origins สำหรับการล็อกอินนี้
หากเพิ่ม Google Identity Services ฝั่ง browser ภายหลัง จึงค่อยตั้ง origin http://localhost:3000

ใส่ Client ID และ Client Secret ที่ได้ลงใน getthawha-backend-main/.env:

    GOOGLE_CLIENT_ID=ค่าจาก-Google
    GOOGLE_CLIENT_SECRET=ค่าจาก-Google
    GOOGLE_REDIRECT_URI=http://localhost:8000/google/authorization
    FRONTEND_ORIGIN=http://localhost:3000
    REDIRECT_URI_AFTER_LOGIN=http://localhost:3000
    COOKIE_DOMAIN=

อย่าส่ง Client Secret ลงแชตหรือ commit ลง Git
ค่าฐานข้อมูลและ JWT_SECRET เดิมให้เก็บไว้
เปิดเว็บด้วย localhost:3000 อย่าสลับเป็น 127.0.0.1 ระหว่างล็อกอิน

หลังแก้ .env ให้สร้างเฉพาะ backend container ใหม่เพื่อรับ environment ล่าสุด (ไม่ลบฐานข้อมูล):

    docker compose -f docker-compose.dev.yml up -d --no-deps --force-recreate backend
    docker exec getthawa-backend bun scripts/check-google-oauth.js

## 2. เตรียม production (ยังไม่เผยแพร่)

สร้าง OAuth client อีกตัวชื่อ Getthawha Production แยกจาก Local
ตัวอย่างโดเมนต่อไปนี้เป็น placeholder ต้องเปลี่ยนเป็นโดเมนที่คุณควบคุมจริง:

| ค่า | Local | Production ตัวอย่าง |
|---|---|---|
| Frontend | http://localhost:3000 | https://www.example.com |
| API | http://localhost:8000 | https://api.example.com |
| Google callback | http://localhost:8000/google/authorization | https://api.example.com/google/authorization |
| Cookie domain | เว้นว่าง | .example.com |
| Cookie Secure | ปิด | เปิดเมื่อ NODE_ENV=production |

นำ getthawha-backend-main/.env.oauth.production.example มารวมกับค่าฐานข้อมูล production ใน .env.production
นำ getthawha-client-frontend-main/.env.production.example ไปสร้าง .env.production ของ frontend
ใช้ JWT_SECRET แบบสุ่มอย่างน้อย 32 ตัวอักษร แยกจากเครื่อง local
ห้ามนำ Client Secret ไปใส่ตัวแปร NEXT_PUBLIC_* เพราะจะถูกเปิดเผยใน browser

ต้องตั้ง HTTPS ที่ reverse proxy ของทั้ง frontend และ API และให้ทั้งคู่ใช้โดเมนแม่เดียวกัน
COOKIE_DOMAIN ต้องครอบคลุมทั้งสอง host เพื่อให้ frontend ตรวจ session ที่ API ตั้งไว้ได้
อย่าแชร์ cookie domain กับ subdomain ที่บุคคลอื่นควบคุม

Dockerfile frontend รองรับ build argument NEXT_PUBLIC_API_URL แล้ว
ค่า runtime อย่างเดียวเปลี่ยน URL ที่ถูกฝังใน JavaScript ไปแล้วไม่ได้ ต้อง build ใหม่สำหรับ production
ไฟล์ docker-compose.oauth-production.example.yml เป็นเฉพาะ overlay สำหรับ OAuth ไม่ใช่การตั้งค่า infrastructure production ทั้งหมด
แก้โดเมนใน build args ก่อนใช้งาน และใช้เฉพาะบนเครื่อง production:

    docker compose -f docker-compose.yml -f docker-compose.oauth-production.example.yml up -d --build

ก่อนเปิด production ให้จัดการฐานข้อมูล/รหัสผ่าน/การเปิดพอร์ตตามระบบโฮสต์จริงด้วย (ไฟล์ compose หลักเดิมเป็นค่า development)
ตรวจ Branding, Audience, โดเมน, consent screen และสถานะ publishing ตามที่ Google Console กำหนด
โค้ด production ปิด /line/dev-login และบังคับค่าที่จำเป็นสำหรับ Google OAuth แล้ว

## 3. ทดสอบหลังใส่ credentials

1. เปิด http://localhost:3000/booking?packageId=รหัสแพ็กเกจจริง
2. หากยังไม่ล็อกอิน ต้องไปหน้าเลือก LINE / Google โดย next ยังเก็บ packageId
3. เลือก Google และตรวจว่าเข้าสู่หน้า accounts.google.com
4. ล็อกอินและยินยอม แล้วกลับมาหน้าจองพร้อมแพ็กเกจเดิม
5. รีเฟรชหน้าจองแล้วต้องยังอยู่ในระบบ
6. ทดสอบยกเลิกที่ Google ต้องกลับหน้า login พร้อมข้อความ ไม่สร้าง session
7. ทำซ้ำบน HTTPS production ด้วย OAuth client ของ production

การตรวจที่ทำได้โดยไม่ใช้บัญชีจริง:

    docker exec getthawa-backend bun test tests/oauth.helpers.test.js tests/google.config.test.js

ข้อผิดพลาดพบบ่อย: redirect_uri_mismatch ให้เทียบ callback ที่ Google กับ GOOGLE_REDIRECT_URI แบบตัวต่อตัว
invalid_client ให้ตรวจว่า Client ID/Secret มาจาก OAuth client ตัวเดียวกัน
วนกลับหน้า login ให้ตรวจ cookie domain, Secure/HTTPS, FRONTEND_ORIGIN และ INTERNAL_API_URL

อ้างอิง Google: https://developers.google.com/identity/openid-connect/openid-connect
