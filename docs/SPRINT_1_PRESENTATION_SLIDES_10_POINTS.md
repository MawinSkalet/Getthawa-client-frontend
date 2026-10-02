# 🌸 Getthawha Omnichannel Spa & Wellness Platform
## Sprint 1 Demo & Presentation — 10 Points Deck Guide for Canva

> **เอกสารคู่มือจัดทำสไลด์การนำเสนอและสาธิต Sprint 1 (10 คะแนนเต็ม)**  
> รวบรวมข้อมูลครบถ้วนจาก: **Notion Project Hub**, **Figma Design System**, และ **Source Code**  
> 
> * **Canva Presentation:** [canva.link/z3yr65gaso97l5i](https://canva.link/z3yr65gaso97l5i)
> * **Figma Prototype:** [figma.com/design/BZUBLQWs119aI4Pq6LG6oZ/massage](https://www.figma.com/design/BZUBLQWs119aI4Pq6LG6oZ/massage?t=TmItcCMftgEHiFSX-0)
> * **Notion Project Hub:** [app.notion.com/p/Getthawha-Project-Hub-3b2c3b4796378093840aeedb7d82d58a](https://app.notion.com/p/Getthawha-Project-Hub-3b2c3b4796378093840aeedb7d82d58a)

---

### 🎨 Canva Design System & Branding Directives (คู่มือคุมโทนสไลด์ใน Canva)
* **Theme & Mood:** Modern Lanna Heritage Luxury Wellness (หรูหรา สงบ อบอุ่น ผ่อนคลาย สะท้อนอัตลักษณ์ล้านนาร่วมสมัย)
* **Color Palette (คัดลอก Hex Code ไปใส่ใน Color Palette ของ Canva ได้ทันที):**
  * `Primary Dark (Teak Wood):` **`#382218`** (พื้นหลังสไลด์หลัก สไตล์ไม้สักโบราณ)
  * `Primary Gold (Lanna Gold):` **`#DCA900`** หรือ **`#E5B800`** (หัวข้อเด่น, Accent, ขอบการ์ด, ปุ่ม Call-to-Action)
  * `Warm Amber:` **`#F59E0B`** (Badge สถานะ, ไอคอนไฮไลต์)
  * `Off-White / Cream:` **`#FAFAFA`** / **`#F5F5F5`** (ตัวหนังสือหลัก อ่านง่าย คมชัดบนพื้นเข้ม)
  * `Card Surface:` **`#261812`** หรือพื้นหลังโปร่งแสง Glassmorphism `rgba(255, 255, 255, 0.05)` ขอบทองบาง 1px
* **Typography แนะนำใน Canva:**
  * **หัวเรื่องภาษาไทย:** Sarabun (Bold) หรือ Noto Sans Thai / Bai Jamjuree
  * **หัวเรื่องภาษาอังกฤษ:** Cinzel (สไตล์ Luxury Spa) หรือ Montserrat / Archivo
  * **เนื้อหา (Body text):** Sarabun (Regular) หรือ Inter (อ่านสบายตา)
* **Asset กราฟิกที่เตรียมไว้ในโปรเจกต์ (นำไปอัปโหลดใส่ Canva):**
  * `getthawha-client-frontend-main/public/Shopname.png` (โลโก้ตัวอักษร "เก็ทถะหวา")
  * `getthawha-client-frontend-main/public/figma-assets/kanok-crest.png` (ตราลายไทยประจำยามสีทอง)
  * `docker_architecture_diagram.jpg` (ผัง System Architecture สมบูรณ์)
  * `getthawha-client-frontend-main/public/figma-assets/massage-menu-poster.png` (โปสเตอร์เมนูและราคา)

---

## 📑 โครงสร้างสไลด์การนำเสนอ 10 ประเด็น (10 Points Slide Deck Structure)

---

### 📍 Slide 1 (Point 1): Project Identity, Vision & Problem Statement
* **หัวข้อสไลด์:** **Getthawha: Omnichannel Spa & Wellness Platform**
* **สโลแกน:** *"Transforming Chiang Mai’s Traditional Wellness into a Unified Digital Experience"*
* **การจัดวางใน Canva (Layout):** Full Hero Cover แบ่ง 2 ฝั่ง (ฝั่งซ้ายข้อความโครงการ / ฝั่งขวาภาพ Mockup หน้าร้าน + โลโก้แบรนด์ `Shopname.png`)
* **เนื้อหาสำหรับวางในสไลด์:**
  * **Project Vision:** แพลตฟอร์มบริหารจัดการและสำรองเวลาบริการสปาครบวงจร เชื่อมโยง 5 สาขาทั่วเชียงใหม่ เข้ากับระบบจองออนไลน์อัจฉริยะแบบ Omnichannel
  * **Pain Points ที่แก้ใน Sprint 1:**
    * ❌ **Manual Scheduling Overload:** พนักงานต้อนรับเสียเวลาตอบแชทและโทรศัพท์กว่า 35% ของเวลาทำงาน
    * ❌ **Double-Booking Collisions:** การจองห้องและเตียงนวดชนกันในช่วงเวลาเร่งด่วน (17:00–21:00) จากการจดสมุด
    * ❌ **Tourist Communication Barriers:** นักท่องเที่ยวต่างชาติสื่อสารลำบาก เมนูไม่ชัดเจน
  * **The Solution:** ระบบ Self-Service Booking 4 คลิกจบ พร้อมระบบปฏิทินกลางสำหรับหน้าร้านที่อัปเดตแบบเรียลไทม์
* **รูปภาพประกอบที่ใช้:**
  * โลโก้: `getthawha-client-frontend-main/public/Shopname.png`
  * ตรากนก: `getthawha-client-frontend-main/public/figma-assets/kanok-crest.png`
  * ภาพบรรยากาศสาขา: `getthawha-client-frontend-main/public/branch-1.jpg`
* **Speaker Note (บทพูด 45 วินาที):**
  > "สวัสดีครับอาจารย์และคณะกรรมการ วันนี้ทีมเราขอพรีเซนต์ Getthawha Omnichannel Platform แพลตฟอร์มบริหารจัดการร้านนวดและสปา 5 สาขาในเชียงใหม่ ปัญหาหลักของธุรกิจคือการจดคิวในสมุด ทำให้เกิดปัญหาห้องเต็มชนกัน และเสียเวลารับสายลูกค้าต่างชาติ ใน Sprint 1 นี้ เราจึงมุ่งเป้าไปที่การวางรากฐานระบบจองดิจิทัล และระบบปฏิทินกลางสำหรับพนักงานเพื่อแก้ปัญหานี้อย่างเบ็ดเสร็จครับ"

---

### 📍 Slide 2 (Point 2): Agile Governance, Team Roles & Notion Sprint Hub
* **หัวข้อสไลด์:** **Agile Methodology & Sprint 1 Governance**
* **การจัดวางใน Canva (Layout):** Grid 4 การ์ดแสดงบทบาททีม (Team Structure) + แถบสรุปสถานะความคืบหน้าจาก Notion
* **เนื้อหาสำหรับวางในสไลด์:**
  * **Team Structure & Responsibilities (RACI Matrix):**
    * 👑 **Project Lead & Fullstack Architect:** ออกแบบ System Architecture, Concurrency Control, Docker & DevOps
    * 🎨 **Frontend Engineer:** พัฒนา Client Booking UI ตาม Figma, Admin Dashboard, Multi-language i18n
    * ⚙️ **Backend Engineer:** พัฒนา Express 5 API, Google OAuth PKCE, LINE / Meta Webhook
    * 🧪 **QA & Product Specialist:** ออกแบบ Test Case, วางแผน Backlog ใน Notion, User Acceptance Testing
  * **Sprint 1 Execution Metrics (อ้างอิงจาก Notion Hub):**
    * 🎯 **Sprint 1 Goal:** Deliver Core Booking Engine, PostgreSQL Schema, Master Admin Calendar & Docker Orchestration
    * 📊 **Task Completion:** ส่งมอบฟีเจอร์หลักเสร็จสิ้น 100% ตาม Sprint Backlog
    * 🛠️ **Project Tracking Hub:** บริหารจัดการงานผ่าน Notion Kanban Board & Burndown Chart
* **รูปภาพประกอบที่ใช้:**
  * ภาพหน้าจอ Notion Board (`Tasks & Features`, `บอร์ด Sprint`)
* **Speaker Note (บทพูด 45 วินาที):**
  > "ในกระบวนการทำงานแบบ Agile เราแบ่งหน้าที่กันอย่างชัดเจนตามตาราง RACI โดยใช้ Notion Project Hub ในการติดตาม User Stories ทั้ง 18 งาน ใน Sprint 1 ทีมเราสามารถทำตามเป้าหมายของ Core Foundation ได้ครบถ้วน ทั้งงานฐานข้อมูล, API Backend, หน้าบ้านลูกค้า และปฏิทินฝั่งแอดมินครับ"

---

### 📍 Slide 3 (Point 3): System Architecture & Multi-Container Topology
* **หัวข้อสไลด์:** **Cloud-Native Architecture & Container Topology**
* **การจัดวางใน Canva (Layout):** วางภาพผังสถาปัตยกรรมระบบกึ่งกลาง ล้อมรอบด้วย 4 การ์ด Microservices
* **เนื้อหาสำหรับวางในสไลด์:**
  * **Multi-Container Architecture (Docker Compose Bridge Network):**
    * 🌐 **Client Frontend (`Port 3000`):** Next.js 15 (React 19), SSR Rendering, Tailwind CSS v4, PWA Ready
    * 💻 **Admin Portal (`Port 3001`):** Next.js 15 Dashboard, Full Calendar Grid, Walk-in Management
    * ⚡ **Backend Engine (`Port 8000`):** Node.js / Bun Runtime + Express 5.1.0, 26+ RESTful Endpoints
    * 🐘 **Database Persistence (`Port 5432`):** PostgreSQL 15 Alpine, ACID Compliant, UUID Primary Keys
    * 🔒 **Ingress Security:** Cloudflare Tunnel สำหรับส่งต่อ Webhook ภายนอกเข้า Local Container โดยไม่ต้อง Forward Port
  * **Engineering Highlights:**
    * Dynamic SSR/Client Base URL Resolver รองรับการเรียกข้าม Container ภายใน Docker
    * Stateless JWT Session ในรูปแบบ Secure `HttpOnly` Cookie
* **รูปภาพประกอบที่ใช้:**
  * รูปภาพ: `docker_architecture_diagram.jpg` (อยู่ในโฟลเดอร์โปรเจกต์ นำไปแปะบนสไลด์ได้ทันที)
* **Speaker Note (บทพูด 60 วินาที):**
  > "ด้านสถาปัตยกรรมระบบ เราออกแบบเป็น 4 Microservices แยกอิสระผ่าน Docker Compose โดยแยก Client Web สำหรับลูกค้าที่เน้น SEO และ Mobile Performance ออกจาก Admin Portal เพื่อความปลอดภัย และเชื่อมต่อกับ Express 5 Backend ที่ทำงานบน Bun Runtime ซึ่งให้ความเร็วในการประมวลผลสูง และมี PostgreSQL คอยการันตีความถูกต้องของธุรกรรมการจองครับ"

---

### 📍 Slide 4 (Point 4): UX/UI Design System & Figma Translation
* **หัวข้อสไลด์:** **Figma Design System to Code: Lanna Heritage Luxury**
* **การจัดวางใน Canva (Layout):** Before & After Comparison (ฝั่งซ้าย: Figma Design Frame / ฝั่งขวา: Next.js Implementation Screenshot)
* **เนื้อหาสำหรับวางในสไลด์:**
  * **Design Tokens & Brand Identity:**
    * สีเอกลักษณ์: ไม้สักทองล้านนา (`#382218`) ผสานประกายทองคำบริสุทธิ์ (`#DCA900`)
    * ลวดลายไทยประยุกต์: Thai Diamond Tile Wallpaper และตราสัญลักษณ์ประจำยาม
  * **Figma to Code High Fidelity Highlights:**
    * 📱 **Mobile-First Experience:** ออกแบบให้ใช้งานสะดวกด้วยมือเดียวบนสมาร์ตโฟน (360px – 430px)
    * 🌏 **Quadrilingual Typography:** รองรับภาษาไทย (TH), อังกฤษ (EN), จีนตัวย่อ (ZH), และเกาหลี (KO) พร้อมระบบ Dynamic CJK Font Loading
    * 🎨 **Component Reusability:** สร้างชิ้นส่วน UI แบบแยกส่วน เช่น Hero Banner, Service Cards, Duration Pill Tabs, และ Confirmation Drawers
* **รูปภาพประกอบที่ใช้:**
  * Figma Prototype Link: `figma.com/design/BZUBLQWs119aI4Pq6LG6oZ/massage`
  * ภาพเมนู: `getthawha-client-frontend-main/public/figma-assets/massage-menu-poster.png`
  * ภาพเปรียบเทียบหน้าจอ: `getthawha-client-frontend-main/public/figma-assets/playwright-full-v2.png`
* **Speaker Note (บทพูด 45 วินาที):**
  > "จากการวิเคราะห์กลุ่มลูกค้าสปาในเชียงใหม่ เราใช้ Figma ออกแบบโดยเน้นเอกลักษณ์ศิลปะล้านนาร่วมสมัย ใช้โทนสีน้ำตาลไม้สักและทองคำ และเมื่อแปลงเป็นโค้ด Next.js เราเก็บรายละเอียดตรงตาม Mockup 100% ทั้งเรื่องระยะขอบ, การแสดงผลภาษาต่างประเทศ และการใช้งานบนมือถือครับ"

---

### 📍 Slide 5 (Point 5): Client Frontend Deliverables (Core Booking Flow)
* **หัวข้อสไลด์:** **Delivered Features: Intelligent Customer Booking Wizard**
* **การจัดวางใน Canva (Layout):** แนวนอน 4 ขั้นตอนการจอง (Step Flow) + การ์ดฟีเจอร์เด่น 3 ใบ
* **เนื้อหาสำหรับวางในสไลด์:**
  * **4 นวัตกรรมหลักที่พัฒนาเสร็จสมบูรณ์ใน Sprint 1:**
    1. ⏱️ **Dynamic Duration Selector (60 / 90 / 120 นาที):**
       * สลับระยะเวลาได้แบบ Real-time พร้อมคำนวณราคาแพ็กเกจทันที
       * รองรับแพ็กเกจทางการกว่า 55 รายการ (Thai Massage, Aroma, Herbal Compress ฯลฯ)
    2. 📍 **GPS Geolocation & Haversine Nearest Branch:**
       * คำนวณพิกัดละติจูด/ลองจิจูดของผู้ใช้ผ่าน HTML5 Geolocation API
       * แนะนำสาขาที่ใกล้ที่สุดโดยอัตโนมัติ พร้อมปุ่มนำทางผ่าน Google Maps
    3. 🎟️ **Homepage Promo Auto-Selection:**
       * ลูกค้ากดเลือกโปรโมชั่นจากหน้าแรก ระบบจะส่งต่อไปยังหน้าจองพร้อมเลือกบริการให้อัตโนมัติ
    4. 📅 **Interactive Timeslot & Calendar Selection:**
       * เลือกรอบเวลา (09:30 – 20:00) และตรวจสอบความพร้อมของเตียง/ห้องให้บริการ
* **รูปภาพประกอบที่ใช้:**
  * ภาพหน้าจอหน้า Booking บนมือถือ
  * `getthawha-client-frontend-main/public/figma-assets/1.png`
* **Speaker Note (บทพูด 60 วินาที):**
  > "ในฝั่งลูกค้า เราพัฒนา Booking Wizard ที่ใช้งานง่ายมากครับ ฟีเจอร์เด่นคือ Dynamic Duration Toggler 60, 90, 120 นาที ที่เปลี่ยนราคาและคำนวณส่วนลดทันที และระบบ Geolocation ที่ใช้สูตร Haversine คำนวณระยะทางจริงเพื่อแนะนำสาขาที่ใกล้ลูกค้านักท่องเที่ยวที่สุด ทำให้การจองเสร็จสิ้นได้ในเวลาไม่ถึง 2 นาทีครับ"

---

### 📍 Slide 6 (Point 6): Admin Operations Portal Deliverables
* **หัวข้อสไลด์:** **Delivered Features: Admin Operations & Booking Calendar**
* **การจัดวางใน Canva (Layout):** Mockup หน้าจอ Desktop แอดมิน + กล่อง Callout 3 จุดเน้น
* **เนื้อหาสำหรับวางในสไลด์:**
  * **ศูนย์ควบคุมการปฏิบัติงานสำหรับพนักงานต้อนรับ (Reception & Manager Portal):**
    * 🗓️ **Master Daily & Monthly Calendar Grid:**
      * ปฏิทินแสดงความหนาแน่นของการจองแบบเรียลไทม์ มองเห็นช่วงเวลาว่างและคิวที่ต้องรับรอง
    * 🚶 **Front-Desk Walk-in & Telephone Modal:**
      * ฟอร์มจองด่วนสำหรับลูกค้าวอล์กอินหรือโทรมาจอง ตัดสต็อกห้องพักและลงคิวทันทีใน 30 วินาที
    * 📦 **Master Data Management (CRUD):**
      * ระบบจัดการข้อมูลสาขา (Branch), แพ็กเกจการนวด (Packages), โปรโมชั่น และเวาเชอร์ส่วนลด
    * ⭐ **Customer Review Moderation:**
      * ตรวจสอบและอนุมัติรีวิวจากลูกค้าก่อนขึ้นแสดงบนหน้าแรกของเว็บไซต์
* **รูปภาพประกอบที่ใช้:**
  * ภาพหน้าจอ `/bookingCalendar` และ `/manualBooking` จาก Admin Frontend
* **Speaker Note (บทพูด 60 วินาที):**
  > "สำหรับพนักงานหน้าร้าน เราสร้าง Admin Portal แยกออกมาที่พอร์ต 3001 จุดเด่นคือ Master Booking Calendar ที่ทำให้ฟร้อนท์เห็นภาพรวมทั้งเดือนและรายวัน มีฟังก์ชัน Walk-in Modal ไว้รับลูกค้าหน้าร้านที่ไม่ได้จองผ่านเว็บ ช่วยขจัดปัญหาสมุดคิวหายหรือการนัดซ้อน และมีระบบจัดการสาขาและราคาได้จากส่วนกลางครับ"

---

### 📍 Slide 7 (Point 7): Backend Engineering, API & Database Schema
* **หัวข้อสไลด์:** **Backend Architecture, 26+ APIs & Relational ERD**
* **การจัดวางใน Canva (Layout):** Entity Relationship Diagram (ERD) ฝั่งซ้าย + ตารางสรุป API Modules & Swagger UI ฝั่งขวา
* **เนื้อหาสำหรับวางในสไลด์:**
  * **Relational Database Design (PostgreSQL + Sequelize):**
    * ตารางหลัก: `Users`, `UserStaff`, `Branches`, `Packages`, `Bookings`, `Vouchers`, `Reviews`
    * คีย์หลักแบบ UUIDv4 เพื่อป้องกันการชนกันของข้อมูลและปลอดภัยต่อการโจมตีแบบ ID Enumeration
    * กำหนด Foreign Keys และ Referential Integrity อย่างเคร่งครัด
  * **API Architecture & Concurrency Prevention:**
    * สร้าง **26+ RESTful Endpoints** ครอบคลุม Authentication, Booking, Services, Admin Analytics
    * เอกสารประกอบ API แบบ Interactive 100% ผ่าน **Swagger UI / OpenAPI 3.0** (`/api-docs`)
    * ป้องกัน Double-booking ด้วย **PostgreSQL Row-level Locking** และ ACID Transactions
* **รูปภาพประกอบที่ใช้:**
  * แผนผัง ERD จาก `docs/3_SOFTWARE_DESIGN_SPECIFICATION.md`
  * ภาพหน้าจอ Swagger UI
* **Speaker Note (บทพูด 60 วินาที):**
  > "ด้าน Backend เราพัฒนา REST API รวมกว่า 26 Endpoints โดยมีเอกสาร Swagger UI กำกับทุกเส้นทาง ในส่วนของฐานข้อมูล PostgreSQL เราใช้ UUID และวางสคีมาอย่างรัดกุม มีระบบ Transaction Lock เพื่อป้องกันสภาวะ Race Condition ไม่ให้ลูกค้าสองคนจองเตียงเดียวกันในเวลาเดียวกันได้เด็ดขาดครับ"

---

### 📍 Slide 8 (Point 8): Enterprise Security & Omnichannel Integrations
* **หัวข้อสไลด์:** **Security Hardening & Social Ecosystem Integrations**
* **การจัดวางใน Canva (Layout):** 3 คอลัมน์ Security & Integration Badges พร้อม Flow diagram สั้นๆ
* **เนื้อหาสำหรับวางในสไลด์:**
  * **1. Google OAuth 2.0 with PKCE Flow:**
    * เสริมความปลอดภัยสูงสุดด้วย Proof Key for Code Exchange (RFC 7636) ป้องกันการดักจับ Auth Code
    * ตรวจสอบความถูกต้องของ Redirect URI และป้องกัน CSRF ผ่าน State Tokens
  * **2. LINE Official Account & LIFF Ready:**
    * สถาปัตยกรรมรองรับ LINE Login 2.1 และการเปิดเว็บแอปพลิเคชันผ่าน LINE LIFF In-App Browser
  * **3. Meta Facebook Messenger Webhook Engine:**
    * รองรับ Handshake Verification และเชื่อมต่อ Meta Graph API
    * มีสคริปต์ทดสอบอัตโนมัติ `check-facebook-bot.ps1` เพื่อจำลอง Webhook Request
* **รูปภาพประกอบที่ใช้:**
  * สถาปัตยกรรม OAuth PKCE จาก `GOOGLE_OAUTH_SETUP.md`
  * โค้ดทดสอบ `check-facebook-bot.ps1`
* **Speaker Note (บทพูด 45 วินาที):**
  > "ความปลอดภัยและการเข้าถึงง่ายคือหัวใจของระบบเราครับ เรานำมาตรฐานความปลอดภัยระดับ Enterprise อย่าง Google OAuth 2.0 ร่วมกับ PKCE มาใช้ ทำให้ลูกค้าล็อกอินได้โดยไม่ต้องจำรหัสผ่าน พร้อมทั้งเตรียมระบบรองรับ LINE LIFF และ Facebook Messenger Webhook เพื่อให้ลูกค้าเข้าถึงบริการได้จากทุกแพลตฟอร์มโซเชียลมีเดียครับ"

---

### 📍 Slide 9 (Point 9): Sprint 1 Live Demo Script & Test Execution
* **หัวข้อสไลด์:** **Sprint 1 Live Demonstration & Quality Verification**
* **การจัดวางใน Canva (Layout):** Live Demo 3-Step Journey Timeline + Test Summary Badge (22+ Tests Passed)
* **ลำดับการสาธิตสด (Demo Walkthrough Plan — 2 ถึง 3 นาที):**
  1. 👤 **Scene 1 (Customer Journey):**
     * เปิดหน้าเว็บลูกค้า (`localhost:3000`)
     * ทดสอบ Geolocation ค้นหาสาขาใกล้ฉัน (แนะนำสาขา นิมมานเหมินท์)
     * เลือกแพ็กเกจ Traditional Thai Massage สลับเวลา 60 เป็น 90 นาที (ราคาปรับจาก 400 เป็น 600 บาท)
     * ดำเนินการจองและกรอกข้อมูลสำเร็จ ได้รับ Booking Reference UUID
  2. 🏢 **Scene 2 (Admin Portal):**
     * สลับไปหน้าจอแอดมิน (`localhost:3001`) ล็อกอินด้วยบัญชีสตาฟฟ์
     * ดู Master Calendar จะพบคิวการจองของลูกค้าปรากฏทันทีแบบ Real-time
     * สาธิตการกด "Walk-in Booking" เพื่อจองคิวให้กับลูกค้าหน้าร้าน
  3. 🧪 **Scene 3 (Automated Test Execution):**
     * แสดงผลลัพธ์การรัน `bun test` ผ่าน 22+ Test Suites ครอบคลุม Booking Concurrency, Vouchers และ OAuth
* **รูปภาพประกอบที่ใช้:**
  * ภาพหน้าจอคู่ Client vs Admin
  * Terminal Output ของ `bun test`
* **Speaker Note (บทพูด 60 วินาที):**
  > "เดี๋ยวทางทีมขออนุญาตสาธิตระบบจริงครับ เริ่มจากฝั่งลูกค้ากดเลือกดูสาขาใกล้ตัวผ่าน GPS เลือกระยะเวลานวด 90 นาทีแล้วกดยืนยันการจอง จากนั้นสลับมาที่จอของพนักงานต้อนรับใน Admin Calendar จะเห็นรายการจองขึ้นมาบนปฏิทินทันที พร้อมทั้งสามารถคีย์ลูกค้าวอล์กอินได้ และระบบเบื้องหลังผ่านการทดสอบ Automated Unit Test เรียบร้อยครับ"

---

### 📍 Slide 10 (Point 10): Sprint 1 Retrospective & Sprint 2 Roadmap
* **หัวข้อสไลด์:** **Sprint 1 Retrospective & Sprint 2 Strategic Roadmap**
* **การจัดวางใน Canva (Layout):** ตาราง 2 ฝั่ง (ฝั่งซ้าย: Retrospective What Went Well / What We Learned | ฝั่งขวา: Sprint 2 Deliverables)
* **เนื้อหาสำหรับวางในสไลด์:**
  * **Sprint 1 Retrospective:**
    * 🌟 **What Went Well:** การแยก Container ชัดเจนทำให้พัฒนาหน้าบ้านและหลังบ้านไปพร้อมกันได้รวดเร็ว, การใช้ Tailwind v4 ทำให้ UI ตรงกับ Figma แม่นยำ
    * 💡 **Challenges Overcome:** แก้ไขปัญหา Cross-Container SSR Fetching ใน Next.js และการจัดการ Dynamic Cookie Domain ระหว่าง dev/prod
  * **Sprint 2 Roadmap (แผนการส่งมอบในสปรินต์ถัดไป):**
    * 💬 **LINE Flex Messages:** ระบบส่งการ์ดยืนยันการจองและใบเสร็จผ่าน LINE Official Account
    * 🤖 **Conversational AI Chatbot:** แชตบอตตอบคำถามเมนูและแนะนำบริการอัตโนมัติบน Facebook Messenger
    * 💳 **Payment Integration & E-Vouchers:** ระบบชำระเงินมัดจำออนไลน์และระบบตรวจสอบเวาเชอร์ขั้นสูง
    * 📊 **Executive Analytics Dashboard:** กราฟวิเคราะห์ยอดขายและสถิตินักท่องเที่ยวรายสาขา
* **รูปภาพประกอบที่ใช้:**
  * ภาพ Notion Sprint Board Roadmap view
* **Speaker Note (บทพูด 45 วินาที):**
  > "สรุปผล Sprint 1 ทีมเราสามารถส่งมอบ Core Engine ได้ตามเป้าหมาย 100% พร้อมแก้ไขความท้าทายเรื่อง Docker SSR สำเร็จ สำหรับใน Sprint 2 ที่กำลังจะมาถึง เราจะต่อยอดระบบ Social Commerce เต็มรูปแบบ ทั้ง LINE Flex Message และ Facebook Chatbot อัตโนมัติ เพื่อขับเคลื่อน Getthawha สู่ระบบสปาอัจฉริยะอย่างสมบูรณ์ ขอบคุณอาจารย์และคณะกรรมการทุกท่านครับ"

---

## 🚀 Quick Step-by-Step for Your Canva Deck
1. เปิดลิงก์ Canva ของคุณ: [https://canva.link/z3yr65gaso97l5i](https://canva.link/z3yr65gaso97l5i)
2. สร้างหน้าสไลด์จำนวน **10 หน้า** ตรงตาม 10 Points ด้านบน
3. ตั้งสีพื้นหลังเป็นน้ำตาลไม้สักทอง `#382218` และใช้สีทอง `#DCA900` สำหรับหัวข้อ
4. อัปโหลดภาพจากโปรเจกต์:
   - `docker_architecture_diagram.jpg` สำหรับ Slide 3
   - `Shopname.png` และ `kanok-crest.png` สำหรับ Slide 1 & 4
   - แคปหน้าเว็บปัจจุบัน `localhost:3000` เทียบกับ Figma สำหรับ Slide 4, 5, 6
5. นำเนื้อหาและ Speaker Notes ในเอกสารนี้ไปใช้ในการนำเสนอเพื่อคว้า **10 คะแนนเต็ม** ได้ทันที!
