# Project Proposal & Charter
## Getthawha Omnichannel Spa & Wellness Booking Platform

| Document Control | Details |
| :--- | :--- |
| **Project Title** | Getthawha Omnichannel Spa & Wellness Platform |
| **Document Classification** | Commercial Proposal & Technical Feasibility Baseline |
| **Standards Alignment** | IEEE Std 1058 / PMBOK 7th Edition Guide |
| **Version & Status** | Version 2.0 (Enterprise Comprehensive Baseline) |
| **Prepared For** | Executive Board, Getthawha Wellness Group, Chiang Mai, Thailand |
| **Lead Technical Author** | Fullstack Solutions Architecture Team |
| **Effective Date** | September 2026 |

---

### Document Revision History

| Version | Release Date | Author & Role | Primary Changes & Description |
| :---: | :---: | :--- | :--- |
| **1.0** | August 1, 2026 | Solutions Architect | Initial feasibility proposal and preliminary architecture |
| **1.5** | August 20, 2026 | Product Engineering Lead | Added multi-channel scope, pricing catalog, and sprint roadmaps |
| **2.0** | September 14, 2026 | Chief Software Architect | Comprehensive revision: Work Breakdown Structure, RACI, Financial ROI, and Risk Register |

---

## 1. Executive Summary

Getthawha Thai Massage & Wellness Group is an established wellness provider operating five flagship branches across Chiang Mai, Thailand. The brand is renowned for preserving traditional Lanna herbal treatments and authentic northern Thai bodywork. Today, Chiang Mai serves as a major international destination for wellness tourism, attracting significant numbers of visitors from English-speaking countries, Greater China, and South Korea, alongside a steady domestic customer base.

To meet modern consumer expectations and optimize front-desk operations, Getthawha is undertaking a full digital transformation. The **Getthawha Omnichannel Booking Platform** replaces fragmented manual scheduling with a unified, cloud-native reservation and store management system.

```
[CUSTOMER CHANNELS]
  * Mobile Web App (Next.js 15 PWA - Thai, English, Chinese, Korean)
  * LINE Official Account (LIFF In-App Booking & Push Confirmations)
  * Facebook Messenger (Conversational Inquiries & Instant Booking Links)
          │
          ▼  (Secure HTTPS / TLS 1.3 REST API)
[CENTRAL PLATFORM ENGINE]
  * Backend API: Node.js / Bun Runtime + Express 5
  * Admin Portal: Daily/Monthly Booking Calendar & Manual Reservations
  * Automation: Transactional Email & Webhook Processors
          │
          ▼  (Sequelize ORM / Connection Pool)
[PERSISTENCE TIER]
  * PostgreSQL 15: ACID Transactions, Row-Level Locking, UUID Keys
```

### Core Value Drivers:
1. **Frictionless Omnichannel Ingress:** Customers can complete reservations via Mobile Web, LINE, or Facebook Messenger within four screen interactions, with no third-party app installations required.
2. **True Multilingual Experience:** Native interfaces in Thai, English, Simplified Chinese, and Korean with dynamic CJK font loading, eliminating tourist miscommunication.
3. **Automated Store Discovery:** HTML5 Geolocation computes the customer's distance to all five branches using the Haversine formula, automatically recommending the nearest location.
4. **Unified Operational Oversight:** Front-desk receptionists and central management work from a synchronized real-time booking calendar, preventing scheduling conflicts and room overbooking.

---

## 2. Business Case & Problem Statement

### 2.1 Current Operational Bottlenecks (As-Is State)
* **Excessive Front-Desk Workload:** Reception staff spend approximately 35% of their daily working hours responding to repetitive inquiries via telephone, LINE chats, and Facebook messages regarding service menus, pricing, branch locations, and available timeslots.
* **Double-Booking and Concurrency Failures:** During peak evening hours (17:00 to 21:00) and tourist seasons, manual paper and spreadsheet scheduling frequently causes overlapping room assignments and unallocated therapists.
* **International Customer Churn:** International tourists encounter language barriers during telephone inquiries and often abandon booking attempts when menus are not clearly explained in their language.
* **Absence of Centralized Data Analytics:** Store managers lack visibility into customer retention, branch-by-branch revenue, top-performing treatments, and voucher marketing attribution.

### 2.2 Future Operational Objectives (To-Be State)
* **Autonomous Self-Service:** At least 75% of reservations completed directly by customers online.
* **Guaranteed Scheduling Integrity:** Zero double-bookings achieved through database transactions and concurrency control.
* **Immediate Multilingual Onboarding:** Foreign tourists complete reservations in their native language in under two minutes.
* **Automated Customer Retention:** Automated email confirmations and post-visit review requests drive repeat visits and customer loyalty.

---

## 3. Strategic Objectives & Success Metrics (KPIs)

Project progress will be tracked and evaluated against the following performance indicators over the initial six-month rollout:

| Business Objective | Key Performance Indicator (KPI) | Current Baseline | Target Milestone | Review Cadence |
| :--- | :--- | :---: | :---: | :---: |
| **Self-Service Adoption** | Share of total bookings made autonomously online | 0% (All manual) | **≥ 75%** | Monthly |
| **Reception Handling Time** | Average staff time spent scheduling per reservation | 8.5 minutes | **≤ 2.0 minutes** | Weekly sample |
| **International Bookings** | Bookings completed in English, Chinese, or Korean | ~15% (Phone) | **≥ 45%** | Monthly |
| **Scheduling Accuracy** | Duplicate room or therapist booking collisions | 12 - 15 / month | **0 incidents** | Continuous |
| **Customer Feedback** | Verified reviews collected from customers | < 20 / month | **≥ 250 / month** | Monthly |
| **System Availability** | Core REST API uptime during business hours | N/A | **≥ 99.8%** | Continuous |

---

## 4. Scope Baseline: In-Scope vs. Out-of-Scope

### 4.1 In-Scope Deliverables
* **Customer Facing Web Application (`getthawha-client-frontend`):**
  * Modern, responsive interface tailored for smartphones and tablets.
  * Native quadrilingual support: Thai, English, Simplified Chinese, Korean.
  * Interactive treatment catalog with dynamic duration toggling (60, 90, 120 minutes) and real-time price recalculation.
  * Multi-step reservation wizard (Branch, Package, Date/Timeslot 09:30–20:00, Customer Details, Voucher Code).
  * Customer account portal with appointment history and self-service cancellation.
  * Social Single Sign-On (SSO) via LINE Login and Google OAuth 2.0 with PKCE security.
  * Geolocation-powered nearest branch calculation and Google Maps navigation.
* **Administrative Operations Portal (`getthawha-admin-frontend`):**
  * Role-based staff authentication (Bcrypt password hashing + JWT session tokens).
  * Master daily schedule grid and monthly booking density calendar.
  * Front-desk manual booking modal for walk-in and telephone guests.
  * Complete management (CRUD) for Branches, Packages, Promotions, Vouchers, and Staff.
  * Customer review moderation interface (Approve / Reject).
* **Backend API & Service Engine (`getthawha-backend`):**
  * 26+ RESTful endpoints documented interactively via OpenAPI / Swagger UI.
  * Transactional email delivery via Nodemailer SMTP gateway.
  * Meta Facebook Messenger Webhook engine with automated quick-reply responses.
  * Secure multipart file upload service (Multer) for promotional media.
* **Containerized Infrastructure & Deployment:**
  * Docker Compose configurations for development (hot-reload enabled) and production.
  * Automated Cloudflare Ingress Tunnel (`cloudflared`) for secure external webhook delivery.

### 4.2 Out-of-Scope (Deferred to Future Releases)
* In-app credit card payment processing (current phase implements reserve-online, pay-at-store).
* Native iOS/Android store application packages (fully served via responsive PWA and LINE LIFF).
* Therapist commission and store payroll accounting.
* Physical warehouse inventory tracking for massage oils and retail supplies.

---

## 5. Technology Stack & Technical Justification

```
+---------------------------------------------------------------------------------+
|                                 CLIENT LAYER                                    |
|   Next.js 15 (React 19) | TypeScript | Tailwind CSS | i18next | Lucide Icons   |
+---------------------------------------------------------------------------------+
                                      | (HTTPS / REST)
+---------------------------------------------------------------------------------+
|                                APPLICATION LAYER                                |
|       Node.js / Bun Runtime | Express 5.1.0 | Swagger UI | Multer | Bcrypt      |
+---------------------------------------------------------------------------------+
                                      | (Sequelize ORM)
+---------------------------------------------------------------------------------+
|                                PERSISTENCE LAYER                                |
|                PostgreSQL 15 Alpine (ACID, UUIDv4, Row-level Locks)              |
+---------------------------------------------------------------------------------+
                                      |
+---------------------------------------------------------------------------------+
|                           DEVOPS & INTEGRATION LAYER                            |
|       Docker Compose | Cloudflare Tunnel | Google OAuth PKCE | LINE LIFF | Meta |
+---------------------------------------------------------------------------------+
```

| Layer / Component | Technology Selected | Evaluation Summary & Engineering Justification |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 15 (App Router)** | Server-Side Rendering (SSR) delivers superior search engine optimization (SEO) for tourists and rapid initial page loads on mobile networks. |
| **Styling Engine** | **Tailwind CSS v4** | Utility-first architecture ensures zero runtime CSS overhead, high responsiveness across devices, and clean component isolation. |
| **Backend Runtime** | **Bun / Node.js** | Bun provides near-instant container startup and high-speed test suite execution while maintaining complete Express 5 compatibility. |
| **API Framework** | **Express 5.1.0** | Mature, lightweight framework with native Promise error handling and modular routing for microservice endpoints. |
| **Database System** | **PostgreSQL 15** | Guarantees ACID transactional compliance, foreign key integrity, and row-level locking necessary to prevent appointment collisions. |
| **DevOps Ingress** | **Cloudflare Tunnel** | Provides an encrypted ingress route directly to Docker containers without exposing static IP addresses or requiring router port forwarding. |

---

## 6. Work Breakdown Structure (WBS)

The project is structured into four levels of deliverables to ensure systematic execution and accountability:

* **1.0 Getthawha Platform Delivery**
  * **1.1 Core Architecture & Persistence (Sprint 1)**
    * 1.1.1 Database Schema Modeling & Sequelize Entities (`User`, `Branch`, `Package`, `Booking`, `Voucher`, `Review`)
    * 1.1.2 Docker Multi-Container Network Configuration (`docker-compose.dev.yml`, `docker-compose.yml`)
    * 1.1.3 Centralized Express 5 Routing & Middleware Pipeline
    * 1.1.4 Interactive Swagger / OpenAPI 3.0 Documentation Setup
  * **1.2 Administrative Operations Portal (Sprint 1 - 2)**
    * 1.2.1 Secure Staff Authentication (Bcrypt + JWT + HttpOnly Cookies)
    * 1.2.2 Master Booking Calendar (Monthly aggregation and daily timeslot schedule)
    * 1.2.3 Manual Walk-in & Phone Reservation Interface
    * 1.2.4 Master Data Management (Branches, Packages, Promotions, Vouchers)
    * 1.2.5 Customer Review Moderation Workflow
  * **1.3 Customer Experience & Booking Wizard (Sprint 2)**
    * 1.3.1 Mobile-First UI/UX Built to Figma Specifications
    * 1.3.2 Quadrilingual Localization Engine (TH, EN, ZH, KO) & Dynamic Typography
    * 1.3.3 Geolocation Proximity Engine with Haversine Nearest Branch Calculation
    * 1.3.4 Dynamic Duration Selector (60m/90m/120m) & Real-Time Price Calculation
    * 1.3.5 Voucher Verification & Server-Side Discount Calculation
    * 1.3.6 Customer Profile, Booking History & Self-Cancellation Flow
  * **1.4 Omnichannel Integrations & Social Commerce (Sprint 2)**
    * 1.4.1 Google OAuth 2.0 Single Sign-On with PKCE Code Challenge
    * 1.4.2 LINE Official Account Integration & LIFF In-App Webview
    * 1.4.3 Meta Facebook Messenger Webhook Handshake & Conversational Bot
    * 1.4.4 Transactional Email Notification Dispatcher via Nodemailer
  * **1.5 Quality Assurance, Security & Production Deployment (Sprint 3)**
    * 1.5.1 Automated Unit & Integration Testing (`bun test`)
    * 1.5.2 Facebook Bot Handshake Verification Script (`check-facebook-bot.ps1`)
    * 1.5.3 Cloud VPS Production Deployment, Reverse Proxy & SSL Configuration
    * 1.5.4 Disaster Recovery Drills & Automated Database Backup Routines

---

## 7. RACI Responsibility Assignment Matrix

Roles correspond to the project governance model established in the Getthawha Project Hub:

* **Roles:**
  * **PL:** Project Lead & Fullstack Solutions Architect
  * **FE:** Frontend Applications Engineer
  * **BE:** Backend API & Integrations Engineer
  * **QA:** Quality Assurance & Product Specialist

* **Key:**
  * **R (Responsible):** The role directly performing the deliverable.
  * **A (Accountable):** The individual with final approval authority.
  * **C (Consulted):** Key stakeholder providing technical or domain input.
  * **I (Informed):** Individuals kept updated on progress.

| WBS Deliverable / Activity | Project Lead (PL) | Frontend Dev (FE) | Backend Dev (BE) | QA / Product (QA) |
| :--- | :---: | :---: | :---: | :---: |
| **System Architecture & Database Modeling** | **A / R** | C | R | I |
| **Docker Multi-Container Orchestration** | **A / R** | I | R | I |
| **Client Frontend UI & Mobile Responsiveness** | A | **R** | C | C |
| **Quadrilingual Localization (TH/EN/ZH/KO)** | A | **R** | I | C |
| **Admin Booking Calendar & Walk-in Modal** | A | **R** | C | C |
| **Express RESTful Endpoints & OpenAPI Spec** | A | I | **R** | C |
| **Google OAuth 2.0 PKCE Implementation** | A | C | **R** | I |
| **Meta Facebook Messenger Webhook & Bot** | A | I | **R** | C |
| **LINE LIFF In-App Integration** | A | C | **R** | C |
| **Automated Test Suites & Regression Runs** | A | C | C | **R** |
| **Disaster Recovery Drills & Backup Verification** | **A / R** | I | R | I |
| **Final User Acceptance Testing (UAT)** | A | C | C | **R** |

---

## 8. Milestone Schedule & Delivery Roadmaps

```
Sprint 1: Core Foundation (Weeks 1 - 3)
  [X] Database Schema & Sequelize Relational Models
  [X] Express 5 Backend REST Engine & Swagger UI
  [X] Admin Operations Portal CRUD & Calendar Roster
Sprint 2: Omnichannel Experience (Weeks 4 - 6)
  [X] Customer Web Booking Wizard & Dynamic Duration Engine
  [X] Google OAuth 2.0 PKCE & LINE LIFF In-App Flow
  [X] Meta Facebook Messenger Bot Webhook & Cloudflare Tunnel
  [X] Quadrilingual Localization (TH / EN / ZH / KO) & CJK Fonts
Sprint 3: Production Hardening (Weeks 7 - 8)
  [>] Automated Testing & Regression Test Harness
  [ ] Cloud VPS Production Launch & Nginx Reverse Proxy
  [ ] Final UAT Sign-Off & Store Reception Training
```

---

## 9. Risk Management Register

| Risk ID | Risk Event & Potential Impact | Likelihood | Impact | Preventative Mitigation Strategy | Contingency Plan |
| :---: | :--- | :---: | :---: | :--- | :--- |
| **RSK-01** | **OAuth Callback Mismatch:** Google redirects fail on production due to protocol, port, or trailing slash discrepancies. | Medium | High | Maintain strict environment parity (`GOOGLE_REDIRECT_URI`) across dev and prod. Unit tests in `google.config.test.js`. | Revert to fallback LINE Login or direct booking workflow. |
| **RSK-02** | **Booking Concurrency Collision:** Multiple customers reserve the same room or therapist simultaneously. | Medium | High | Atomic PostgreSQL transactions with capacity checks in `booking.validation.js`. | Prompt customer with a clear 409 Conflict message and suggest adjacent timeslots. |
| **RSK-03** | **Meta Facebook API Version Drift:** Meta updates Graph API parameters, breaking webhook responses. | Medium | Medium | Pin API version to `v21.0`; verify handshake automatically using `check-facebook-bot.ps1`. | Deploy updated webhook route container using Docker hot-reload. |
| **RSK-04** | **Data Privacy Violation (PDPA/GDPR):** Unauthorized exposure of customer phone numbers or email addresses. | Low | Critical | Store session JWTs in `HttpOnly` Secure cookies; exclude user contact data from public API endpoints. | Immediate incident disclosure protocol and session token invalidation. |
| **RSK-05** | **Next.js Hydration Mismatch:** Timestamp discrepancies between server UTC clock and customer browser local time. | Medium | Low | Wrap date renders in client-mounted hooks and set container timezone explicitly to `Asia/Bangkok`. | Add `suppressHydrationWarning` on date-rendering components. |

---

## 10. Financial Analysis: Return on Investment (ROI) & TCO

### 10.1 Operational Cost Savings (Monthly Estimate)
* **Front-Desk Hours Saved:** 5 branches × 2 staff × 2 hours/day × 30 days = **600 hours / month**.
* **Direct Labor Savings:** 600 hours × 100 THB/hour = **60,000 THB / month**.
* **Recovered International Bookings:** Estimated 45 additional bookings/month × 1,200 THB average ticket = **54,000 THB / month**.
* **Total Estimated Value Generated:** **~114,000 THB / month**.

### 10.2 Total Cost of Ownership (Cloud VPS Infrastructure)
* Cloud VPS Host (Ubuntu 22.04 LTS, 4 vCPU, 8GB RAM): ~850 THB / month ($24).
* Domain & Managed DNS (Cloudflare): ~35 THB / month ($12 / year).
* Transactional Email Gateway (SMTP): Free tier up to 10,000 emails.
* **Total Monthly Infrastructure Overhead:** **< 1,000 THB / month**.
* **Project Payback Period:** Estimated at **less than 1.5 months** following production go-live.

---

## 11. Service Level Agreement (SLA) & Operational Commitments

* **Service Availability:** The platform targets **≥ 99.8% operational uptime** during business operating hours (08:00 to 22:00 Asia/Bangkok time).
* **Recovery Time Objective (RTO):** In the event of primary server failure, system operation will be restored from backup within **< 30 minutes**.
* **Recovery Point Objective (RPO):** Maximum allowable data loss in the event of hardware failure is **< 24 hours** (governed by daily automated backup routines).
* **Security Auditing:** Docker base images and application dependencies will undergo automated monthly vulnerability scans.

---

## 12. Stakeholder Approval & Formal Sign-Off

By signing below, the authorized representatives acknowledge that this Project Proposal accurately represents the agreed scope, technical architecture, and implementation roadmap:

| Representative Role | Full Name | Signature | Approval Date |
| :--- | :--- | :---: | :---: |
| **Executive Sponsor** | Management Representative | ___________________________ | ___ / ___ / 2026 |
| **Project Lead & Architect** | Mawin Skalet | ___________________________ | ___ / ___ / 2026 |
| **Lead Solutions Engineer** | Fullstack Engineering Lead | ___________________________ | ___ / ___ / 2026 |
| **Quality Assurance Lead** | QA & Product Specialist | ___________________________ | ___ / ___ / 2026 |
