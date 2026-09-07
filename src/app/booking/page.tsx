"use client";

import { useCallback, useEffect, useState, useMemo, type ChangeEvent } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { getBranches, type Branch } from "@/hooks/useBranch";
import { getPackage, type Package } from "@/hooks/usePackage";
import { createBooking, verifyVoucher } from "@/hooks/useBooking";
import "@/locales/i18n";

const TYPE_FILTER_OPTIONS = ["all", "service", "promotion"] as const;
type TypeFilterOption = (typeof TYPE_FILTER_OPTIONS)[number];

const SORT_OPTIONS = [
  "recommended",
  "priceAsc",
  "priceDesc",
  "durationAsc",
  "durationDesc",
  "nameAsc",
] as const;
type SortKeyOption = (typeof SORT_OPTIONS)[number];

function isTypeFilterOption(value: string): value is TypeFilterOption {
  return TYPE_FILTER_OPTIONS.some((option) => option === value);
}

function isSortKeyOption(value: string): value is SortKeyOption {
  return SORT_OPTIONS.some((option) => option === value);
}

// 5 Authentic branches
const DEFAULT_BRANCHES: Branch[] = [
  {
    id: "e9630f2c-1a74-4b3e-82c1-1a5350e6a96a",
    name: "Rimping",
    address: "129 Lamphun Road, Watket, Muang, Chiangmai 50000",
    googleMapUrl: "https://maps.google.com",
    googleMapEmbedUrl: "https://maps.google.com",
    phone: "087-657-9546",
    pictureUrl: "/branch-1.jpg",
    description: "ริมปิง",
  },
  {
    id: "4e66d78c-4809-4af4-8532-43b2bda50d86",
    name: "Chareonmuang (เจริญเมือง)",
    address: "9/3 Charoenmuang soi3, Watket, Muang, Chiangmai 50000",
    googleMapUrl: "https://maps.google.com",
    googleMapEmbedUrl: "https://maps.google.com",
    phone: "087-657-9546",
    pictureUrl: "/branch-2.jpg",
    description: "เจริญเมือง",
  },
  {
    id: "890cba2d-1740-447a-be45-0133d653d0cb",
    name: "Rimping2",
    address: "5/1 Osathaphan Rd, Tambon Wat Ket, Muang, Chiang Mai 50000",
    googleMapUrl: "https://maps.google.com",
    googleMapEmbedUrl: "https://maps.google.com",
    phone: "087-657-9546",
    pictureUrl: "/branch-4.jpg",
    description: "ริมปิง 2",
  },
  {
    id: "55346837-dcf8-4afa-a094-9f7280b3ac11",
    name: "ChiangKang (อรศิริน วิลล์มอนต์ เชียงใหม่)",
    address: "106/17 Onsirin Business2, Chai Sathan, Saraphi District, Chiang Mai 50140",
    googleMapUrl: "https://maps.google.com",
    googleMapEmbedUrl: "https://maps.google.com",
    phone: "087-657-9546",
    pictureUrl: "/branch-3.jpg",
    description: "เชียงคาน",
  },
  {
    id: "be74f0bf-7cd2-4991-a001-c27ad9c368d0",
    name: "Phrasingh (พระสิงห์)",
    address: "Arak Rd Soi5, Tambon Si Phum, Muang, Chiang Mai 50200",
    googleMapUrl: "https://maps.google.com",
    googleMapEmbedUrl: "https://maps.google.com",
    phone: "087-657-9546",
    pictureUrl: "/branch-5.jpg",
    description: "พระสิงห์",
  },
];

// Grouped service item containing its duration variants
interface ServiceGroup {
  baseTitle: string;
  description: string;
  type: "service" | "promotion";
  pictureUrl: string;
  variants: {
    id: string;
    duration: number; // 60, 90, 120
    price: number;
    rawTitle: string;
  }[];
}

// Full Official Massage Menu Poster Services
const OFFICIAL_MENU_GROUPS: ServiceGroup[] = [
  // 1. THAI MASSAGE นวดไทย
  {
    baseTitle: "1.1 นวดไทย (Thai Massage)",
    description: "泰式按摩 / 타이 마사지",
    type: "service",
    pictureUrl: "/figma-assets/498205899_1317171190414607_4302194740465620141_n.jpg",
    variants: [
      { id: "598c8bae-42af-4ee4-81d1-decb50778e17", duration: 60, price: 300, rawTitle: "นวดไทย (Thai Massage) (60 mins)" },
      { id: "0ef8bcb3-a14e-4664-ba12-32e105ef238c", duration: 90, price: 450, rawTitle: "นวดไทย (Thai Massage) (90 mins)" },
      { id: "e199b1bc-e83a-4cf4-8f11-57658818d1a2", duration: 120, price: 600, rawTitle: "นวดไทย (Thai Massage) (120 mins)" },
    ],
  },
  {
    baseTitle: "1.2 นวดไทยใส่ยาหม่อง (Thai Massage + Herbal Balm)",
    description: "泰式按摩 + 草药膏 / 타이 마사지 + 허브 밤",
    type: "service",
    pictureUrl: "/figma-assets/360_F_676368959_pUZwtpsC8wqsEXy7vqR6UlLbxDCkoBdT.jpg",
    variants: [
      { id: "165f7ddb-b1f3-4f52-a0a2-16b2eacd423b", duration: 60, price: 350, rawTitle: "นวดไทยใส่ยาหม่อง (60 mins)" },
      { id: "99ee7eb6-0095-4759-96a5-9a83180dce8d", duration: 90, price: 525, rawTitle: "นวดไทยใส่ยาหม่อง (90 mins)" },
      { id: "d46b5c7d-38b4-4167-94b5-92db14916fc9", duration: 120, price: 700, rawTitle: "นวดไทยใส่ยาหม่อง (120 mins)" },
    ],
  },
  {
    baseTitle: "1.3 นวดไทยใส่น้ำมัน (Thai Massage + Oil)",
    description: "泰式按摩 + 精油 / 타이 마사지 + 오일",
    type: "service",
    pictureUrl: "/aromapics.png",
    variants: [
      { id: "655f9b43-0f58-40dc-8c6d-1ba26404ad7d", duration: 60, price: 350, rawTitle: "นวดไทยใส่น้ำมัน (60 mins)" },
      { id: "7506e25f-fd3d-49ab-a797-3d6b2f5b624d", duration: 90, price: 525, rawTitle: "นวดไทยใส่น้ำมัน (90 mins)" },
      { id: "28c184e3-5911-439e-bcba-5f82401fcea3", duration: 120, price: 700, rawTitle: "นวดไทยใส่น้ำมัน (120 mins)" },
    ],
  },
  {
    baseTitle: "1.4 นวดไทยล้านนา ประคบสมุนไพร (Thai Lanna Herbal Compress)",
    description: "泰式兰纳按摩 + 草药热敷 / 타이 란나 마사지 + 허브 압축",
    type: "service",
    pictureUrl: "/figma-assets/499423492_1317171240414602_1759116723071476687_n.jpg",
    variants: [
      { id: "d48fd54d-cd8b-47c9-b2e1-f1b851628410", duration: 60, price: 400, rawTitle: "นวดไทยล้านนา ประคบสมุนไพร (60 mins)" },
      { id: "5d9e794e-c8ec-4100-a583-d0e2c53e7325", duration: 90, price: 600, rawTitle: "นวดไทยล้านนา ประคบสมุนไพร (90 mins)" },
      { id: "ea94e6f9-b33f-4d9e-ba3c-b3114e114bb6", duration: 120, price: 800, rawTitle: "นวดไทยล้านนา ประคบสมุนไพร (120 mins)" },
    ],
  },

  // 2. FOOT MASSAGE นวดเท้า
  {
    baseTitle: "2.1 นวดเท้า (Foot Massage)",
    description: "足部按摩 / 발 마사지",
    type: "service",
    pictureUrl: "/figma-assets/66a0ca9d9d29769359124398_S__8716295.jpg",
    variants: [
      { id: "165b7a61-deec-4d6d-b2f0-bcce8d38ef6a", duration: 60, price: 300, rawTitle: "นวดเท้า (Foot Massage) (60 mins)" },
      { id: "956e305f-a98d-4243-94cd-cbdd805463bf", duration: 90, price: 450, rawTitle: "นวดเท้า (Foot Massage) (90 mins)" },
      { id: "8de4d8ba-c4fa-4b19-9d6b-2607f8bf1c55", duration: 120, price: 600, rawTitle: "นวดเท้า (Foot Massage) (120 mins)" },
    ],
  },
  {
    baseTitle: "2.2 นวดเท้าใส่ยาหม่อง (Foot Massage + Herbal Balm)",
    description: "足部按摩 + 草药膏 / 발 마사지 + 허브 밤",
    type: "service",
    pictureUrl: "/figma-assets/360_F_676368959_pUZwtpsC8wqsEXy7vqR6UlLbxDCkoBdT.jpg",
    variants: [
      { id: "4b512707-8be1-4bd1-b0b0-adeb8dc53bc1", duration: 60, price: 350, rawTitle: "นวดเท้าใส่ยาหม่อง (60 mins)" },
      { id: "7006e51b-6a45-4b38-a0e7-f5b8cef5687b", duration: 90, price: 525, rawTitle: "นวดเท้าใส่ยาหม่อง (90 mins)" },
      { id: "ab117945-6647-4347-8145-eb62b2111b7c", duration: 120, price: 700, rawTitle: "นวดเท้าใส่ยาหม่อง (120 mins)" },
    ],
  },
  {
    baseTitle: "2.3 นวดเท้า คอ หัว ไหล่ (Foot + Head + Shoulder)",
    description: "足部、颈部、头部和肩部按摩 / 발, 목, 머리, 어깨 마사지",
    type: "service",
    pictureUrl: "/figma-assets/498205899_1317171190414607_4302194740465620141_n.jpg",
    variants: [
      { id: "daad62cb-f1c7-4b77-bfc0-216f38919e96", duration: 60, price: 400, rawTitle: "นวดเท้า คอ หัว ไหล่ (60 mins)" },
      { id: "bfb13cdb-7a1b-47b4-acf0-387072307094", duration: 90, price: 600, rawTitle: "นวดเท้า คอ หัว ไหล่ (90 mins)" },
      { id: "179d72ad-09fe-4aff-b117-6b0b6190d6a0", duration: 120, price: 800, rawTitle: "นวดเท้า คอ หัว ไหล่ (120 mins)" },
    ],
  },
  {
    baseTitle: "2.4 นวดเท้า หลัง ไหล่ ศีรษะ (Foot + Back + Head + Shoulder)",
    description: "足部按摩 + 背部按摩 + 头部按摩 + 肩部按摩",
    type: "service",
    pictureUrl: "/figma-assets/487480568_1222783176523000_6232950887757154845_n.jpg",
    variants: [
      { id: "86e23935-d4ff-4c8e-bccd-9d926ae694b6", duration: 60, price: 450, rawTitle: "นวดเท้า หลัง ไหล่ ศีรษะ (60 mins)" },
      { id: "b2152c13-cb1b-4749-9039-bb9fc8a174a8", duration: 90, price: 675, rawTitle: "นวดเท้า หลัง ไหล่ ศีรษะ (90 mins)" },
      { id: "fccf9c3f-3c5e-4276-8207-60a9f7b20765", duration: 120, price: 900, rawTitle: "นวดเท้า หลัง ไหล่ ศีรษะ (120 mins)" },
    ],
  },

  // 3. HEAD, BACK & SHOULDER MASSAGE นวดหลัง ไหล่ ศีรษะ
  {
    baseTitle: "3.1 นวดหลังไหล่ (Back + Shoulder Massage)",
    description: "背部 + 肩部按摩 / 등 + 어깨 마사지",
    type: "service",
    pictureUrl: "/figma-assets/487480568_1222783176523000_6232950887757154845_n.jpg",
    variants: [
      { id: "b3ed11a5-e758-4afb-afa5-2d47c9a8a4d9", duration: 60, price: 450, rawTitle: "นวดหลังไหล่ (60 mins)" },
      { id: "8a277c9f-4402-4deb-94f6-16ab7c36e2ef", duration: 90, price: 675, rawTitle: "นวดหลังไหล่ (90 mins)" },
      { id: "ccf2264c-9291-40ea-8a51-b9f33d3ff76b", duration: 120, price: 900, rawTitle: "นวดหลังไหล่ (120 mins)" },
    ],
  },
  {
    baseTitle: "3.2 นวดศีรษะ หลัง ไหล่ (Head, Back & Shoulder Massage)",
    description: "头部、背部和肩部按摩 / 머리, 등, 어깨 마사지",
    type: "service",
    pictureUrl: "/figma-assets/498205899_1317171190414607_4302194740465620141_n.jpg",
    variants: [
      { id: "6e61eea3-2902-499c-a17e-e8e6bad03bad", duration: 60, price: 500, rawTitle: "นวดศีรษะ หลัง ไหล่ (60 mins)" },
      { id: "cb9026af-3a18-44c8-a776-ec7d067f1d5d", duration: 90, price: 750, rawTitle: "นวดศีรษะ หลัง ไหล่ (90 mins)" },
      { id: "24351a6e-4b59-4366-8e8b-e0494d3a1d00", duration: 120, price: 1000, rawTitle: "นวดศีรษะ หลัง ไหล่ (120 mins)" },
    ],
  },

  // 4. NOURISHING TREATMENT MASSAGE นวดบำรุงผิว / ทรีทเมนต์
  {
    baseTitle: "4.1 นวดน้ำมัน (Oil Massage)",
    description: "精油按摩 / 오일 마사지",
    type: "service",
    pictureUrl: "/aromapics.png",
    variants: [
      { id: "5d6249cc-ee3d-40cb-98a9-0a0abd142d29", duration: 60, price: 500, rawTitle: "นวดน้ำมัน (Oil Massage) (60 mins)" },
      { id: "c37e3d54-c61a-4c69-9494-c546f64b08c8", duration: 90, price: 750, rawTitle: "นวดน้ำมัน (Oil Massage) (90 mins)" },
      { id: "ca573bfa-8bd3-433d-b6a6-0e81ab119c3a", duration: 120, price: 1000, rawTitle: "นวดน้ำมัน (Oil Massage) (120 mins)" },
    ],
  },
  {
    baseTitle: "4.2 นวดน้ำมันอโรม่า (Aroma Oil Massage)",
    description: "香薰精油按摩 / 아로마 오일 마사지",
    type: "service",
    pictureUrl: "/aromapics.png",
    variants: [
      { id: "1e686cd8-536d-4f7d-9797-86b6aad15d4d", duration: 60, price: 600, rawTitle: "นวดน้ำมันอโรม่า (60 mins)" },
      { id: "d5b8ccad-a245-4a32-8cd3-278a72536807", duration: 90, price: 900, rawTitle: "นวดน้ำมันอโรม่า (90 mins)" },
      { id: "7b731497-b91c-4aed-8430-1192d1afbe57", duration: 120, price: 1200, rawTitle: "นวดน้ำมันอโรม่า (120 mins)" },
    ],
  },
  {
    baseTitle: "4.3 นวดน้ำมันเซรั่มมะพร้าว (Coconut Oil Serum Massage)",
    description: "椰子油精华按摩 / 코코넛 오일 세럼 마사지",
    type: "service",
    pictureUrl: "/figma-assets/360_F_676368959_pUZwtpsC8wqsEXy7vqR6UlLbxDCkoBdT.jpg",
    variants: [
      { id: "6c966d91-256c-4947-8456-8bedb7ad5f7a", duration: 60, price: 650, rawTitle: "นวดน้ำมันเซรั่มมะพร้าว (60 mins)" },
      { id: "6dd3ded7-f4d3-4e89-bceb-f39381b8540d", duration: 90, price: 975, rawTitle: "นวดน้ำมันเซรั่มมะพร้าว (90 mins)" },
      { id: "efb4dcf0-81ff-44eb-bd56-ec3f82e8ffb1", duration: 120, price: 1300, rawTitle: "นวดน้ำมันเซรั่มมะพร้าว (120 mins)" },
    ],
  },
  {
    baseTitle: "4.4 ขัดผิวกาย (Body Scrub)",
    description: "身体磨砂膏 / 바디 스크럽",
    type: "service",
    pictureUrl: "/figma-assets/1fff3681-6558-40ee-81ae-c652f729444a1762428977626.webp",
    variants: [
      { id: "cc142e5e-fa2e-4bc1-af7d-e8a4d3216ac9", duration: 90, price: 900, rawTitle: "ขัดผิวกาย (90 mins)" },
      { id: "13201458-5d78-4f0c-96f8-a770e47d38c7", duration: 120, price: 1300, rawTitle: "ขัดผิวกาย (120 mins)" },
    ],
  },

  // 5. TRADITIONAL LANNA MASSAGE นวดล้านนา
  {
    baseTitle: "5.1 นวดไทยล้านนา ประคบสมุนไพร พิเศษ (Traditional Lanna Herbal)",
    description: "泰式兰纳按摩 + 草药热敷",
    type: "service",
    pictureUrl: "/figma-assets/499423492_1317171240414602_1759116723071476687_n.jpg",
    variants: [
      { id: "bb5a0ba2-d98e-469d-85aa-a85ead43e7f5", duration: 90, price: 1050, rawTitle: "นวดไทยล้านนา ประคบสมุนไพร พิเศษ (90 mins)" },
      { id: "2da55247-13bd-4de9-9271-5c04db3bc1eb", duration: 120, price: 1400, rawTitle: "นวดไทยล้านนา ประคบสมุนไพร พิเศษ (120 mins)" },
    ],
  },
  {
    baseTitle: "5.2 นวดน้ำมัน ประคบสมุนไพร (Oil Massage + Herbal Compress)",
    description: "精油按摩 + 草药热敷",
    type: "service",
    pictureUrl: "/figma-assets/487480568_1222783176523000_6232950887757154845_n.jpg",
    variants: [
      { id: "25725579-5a26-42ed-a1d6-cbf600e9a3ac", duration: 90, price: 1100, rawTitle: "นวดน้ำมัน ประคบสมุนไพร (90 mins)" },
      { id: "597806cf-1ad7-4aa2-af22-3a38a26f7052", duration: 120, price: 1500, rawTitle: "นวดน้ำมัน ประคบสมุนไพร (120 mins)" },
    ],
  },
  {
    baseTitle: "5.3 นวดน้ำมันอโรม่า ประคบสมุนไพร (Aroma Oil + Herbal Compress)",
    description: "香薰精油按摩 + 草药热敷",
    type: "service",
    pictureUrl: "/aromapics.png",
    variants: [
      { id: "d253bb06-1f9c-4249-91eb-b1696b5518d3", duration: 90, price: 1200, rawTitle: "นวดน้ำมันอโรม่า ประคบสมุนไพร (90 mins)" },
      { id: "e92f73a0-78f7-4ea6-94d1-42558e31df1c", duration: 120, price: 1600, rawTitle: "นวดน้ำมันอโรม่า ประคบสมุนไพร (120 mins)" },
    ],
  },

  // 6. THE BEST MASSAGE ชุดสุดคุ้ม เพื่อสุขภาพ (Promotions)
  {
    baseTitle: "6.1 นวดออฟฟิศซินโดรม (Office Syndrome Massage)",
    description: "泰式肩颈舒缓按摩拉伸 / 오피스 증후군 타이 마사지",
    type: "promotion",
    pictureUrl: "/figma-assets/487480568_1222783176523000_6232950887757154845_n.jpg",
    variants: [
      { id: "addd2a9c-edd3-48e8-bfe2-c9a075dfafad", duration: 90, price: 799, rawTitle: "นวดออฟฟิศซินโดรม (90 mins)" },
      { id: "8326c90a-ca8e-44d6-9b28-99c6a7968d37", duration: 120, price: 1000, rawTitle: "นวดออฟฟิศซินโดรม (120 mins)" },
    ],
  },
  {
    baseTitle: "6.2 นวดไทยล้านนา ประคบสมุนไพร ชุดสุดคุ้ม (Best Value Lanna)",
    description: "泰式兰纳按摩 + 草药热敷",
    type: "promotion",
    pictureUrl: "/home-pic1.jpg",
    variants: [
      { id: "e24e5827-cdcf-43d3-af96-b7b528e218da", duration: 90, price: 899, rawTitle: "นวดไทยล้านนา ประคบสมุนไพร ชุดสุดคุ้ม (90 mins)" },
      { id: "e13c3171-62d1-4214-b3a9-178f0c319057", duration: 120, price: 1200, rawTitle: "นวดไทยล้านนา ประคบสมุนไพร ชุดสุดคุ้ม (120 mins)" },
    ],
  },
  {
    baseTitle: "6.3 อบตัว ขัดผิวกาย (Thai Herbal Steam + Body Scrub)",
    description: "泰式草药蒸汽浴 + 身体磨砂",
    type: "promotion",
    pictureUrl: "/figma-assets/1fff3681-6558-40ee-81ae-c652f729444a1762428977626.webp",
    variants: [
      { id: "70199399-4e96-4e60-8377-e620a86e7c61", duration: 90, price: 990, rawTitle: "อบตัว ขัดผิวกาย (90 mins)" },
      { id: "6069d1d0-833d-4169-8a55-b7e882d76cb7", duration: 120, price: 1300, rawTitle: "อบตัว ขัดผิวกาย (120 mins)" },
    ],
  },

  // 7. PREMIUM EXPERIENCE ประสบการณ์พิเศษ
  {
    baseTitle: "7.1 นวดหินร้อน (Hot Stone + Aroma Oil Massage)",
    description: "热石 + 香薰精油按摩 / 핫스톤 + 아로마 오일 마사지",
    type: "service",
    pictureUrl: "/figma-assets/487480568_1222783176523000_6232950887757154845_n.jpg",
    variants: [
      { id: "08ae25c4-c7ae-4078-96f3-99c9fb1a13b0", duration: 90, price: 1200, rawTitle: "นวดหินร้อน (Hot Stone) (90 mins)" },
      { id: "7b731497-b91c-4aed-8430-1192d1afbe57", duration: 120, price: 1500, rawTitle: "นวดหินร้อน (Hot Stone) (120 mins)" },
    ],
  },
];

export default function BookingPage() {
  // Data state: default immediately to 5 authentic branches
  const [branches, setBranches] = useState<Branch[]>(DEFAULT_BRANCHES);
  const [packages, setPackages] = useState<Package[]>([]);

  // Selections: Default to Chareonmuang branch
  const [selectedBranchId, setSelectedBranchId] = useState<string>("4e66d78c-4809-4af4-8532-43b2bda50d86");
  const [selectedBaseTitle, setSelectedBaseTitle] = useState<string>(OFFICIAL_MENU_GROUPS[0].baseTitle);
  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const [selectedPackageId, setSelectedPackageId] = useState<string>("598c8bae-42af-4ee4-81d1-decb50778e17");

  // UX controls
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilterOption>("all");
  const [sortKey, setSortKey] = useState<SortKeyOption>("recommended");

  // Booking inputs
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [voucher, setVoucher] = useState("");

  // Voucher validation
  const [voucherStatus, setVoucherStatus] = useState<
    "idle" | "checking" | "valid" | "invalid"
  >("idle");
  const [voucherMessage, setVoucherMessage] = useState("");
  const [voucherId, setVoucherId] = useState<string | null>(null);

  // Submission feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const { t, i18n } = useTranslation();
  const readyText = useCallback(
    (k: string, fb: string) => (i18n.isInitialized ? t(k) : fb),
    [i18n.isInitialized, t]
  );

  const handleTypeFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    if (isTypeFilterOption(value)) {
      setTypeFilter(value);
    }
  };

  const handleSortKeyChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    if (isSortKeyOption(value)) {
      setSortKey(value);
    }
  };

  // Fetch branches from API - Merge so 5 branches NEVER disappear!
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getBranches();
        if (active && data && data.length > 0) {
          // Merge API data with default branches
          setBranches(data);
          // Preserve Chareonmuang or current selection
          const found = data.find((b) => b.id === selectedBranchId) ||
                        data.find((b) => b.name.includes("Chareonmuang") || b.name.includes("เจริญเมือง"));
          if (found) setSelectedBranchId(found.id);
        }
      } catch (e) {
        console.error("Failed to load branches", e);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Fetch packages from API
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getPackage();
        if (active && data && data.length > 0) {
          setPackages(data);
        }
      } catch (e) {
        console.error("Failed to load packages", e);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Auto-select promo or package when arriving with ?packageId=... or ?branchId=...
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const params = new URLSearchParams(window.location.search);
      const qPackage = params.get("packageId");
      const qBranch = params.get("branchId");
      if (qBranch) setSelectedBranchId(qBranch);

      if (qPackage) {
        // Find which service group and variant matches this packageId
        for (const group of OFFICIAL_MENU_GROUPS) {
          const matchedVariant = group.variants.find(
            (v) => v.id === qPackage || (packages.length > 0 && packages.find(p => p.id === qPackage && p.duration === v.duration && (p.title.includes(group.baseTitle.slice(4, 15)) || group.baseTitle.includes(p.title.split(" (")[0]))))
          );
          if (matchedVariant) {
            setSelectedBaseTitle(group.baseTitle);
            setSelectedDuration(matchedVariant.duration);
            setSelectedPackageId(matchedVariant.id);
            // Smooth scroll into Appointment Details section so user sees the auto-selected promo immediately!
            setTimeout(() => {
              const el = document.getElementById("appointment-details");
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 300);
            break;
          }
        }
      }
    } catch (err) {
      console.error("Error reading URL parameters:", err);
    }
  }, [packages]);

  // Construct combined Service Groups (from Official Menu + matching API package IDs)
  const serviceGroups = useMemo<ServiceGroup[]>(() => {
    return OFFICIAL_MENU_GROUPS.map((og) => {
      const cleanTitle = og.baseTitle.replace(/^\d+\.\d+\s*/, "").trim().toLowerCase();
      const updatedVariants = og.variants.map((v) => {
        const expectedTitle = `${cleanTitle} (${v.duration} mins)`.toLowerCase();
        // Find matching API package if exists
        const matched = packages.find(
          (p) =>
            p.duration === v.duration &&
            (p.title.trim().toLowerCase() === expectedTitle ||
             p.title.toLowerCase().includes(cleanTitle) ||
             cleanTitle.includes(p.title.replace(/\s*\(\d+\s*mins?\)/i, "").trim().toLowerCase()))
        );
        return {
          ...v,
          id: matched ? matched.id : v.id,
        };
      });
      return {
        ...og,
        variants: updatedVariants,
      };
    });
  }, [packages]);

  // Selected Service Group synchronized with serviceGroups
  const selectedServiceGroup = useMemo(() => {
    return (
      serviceGroups.find((g) => g.baseTitle === selectedBaseTitle) ||
      serviceGroups[0]
    );
  }, [serviceGroups, selectedBaseTitle]);

  // Find currently selected variant details
  const activeVariant = useMemo(() => {
    if (!selectedServiceGroup) return null;
    return (
      selectedServiceGroup.variants.find((v) => v.duration === selectedDuration) ||
      selectedServiceGroup.variants[0]
    );
  }, [selectedServiceGroup, selectedDuration]);

  // Current price
  const currentPrice = activeVariant ? activeVariant.price : 0;

  // Filter & search service groups
  const filteredGroups = useMemo(() => {
    return serviceGroups.filter((g) => {
      if (typeFilter !== "all" && g.type !== typeFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          g.baseTitle.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [serviceGroups, typeFilter, search]);

  // Sort groups
  const sortedGroups = useMemo(() => {
    return [...filteredGroups].sort((a, b) => {
      const minPriceA = a.variants[0]?.price || 0;
      const minPriceB = b.variants[0]?.price || 0;
      switch (sortKey) {
        case "priceAsc":
          return minPriceA - minPriceB;
        case "priceDesc":
          return minPriceB - minPriceA;
        case "nameAsc":
          return a.baseTitle.localeCompare(b.baseTitle);
        case "durationAsc":
          return (a.variants[0]?.duration || 0) - (b.variants[0]?.duration || 0);
        case "durationDesc":
          return (b.variants[b.variants.length - 1]?.duration || 0) - (a.variants[a.variants.length - 1]?.duration || 0);
        case "recommended":
        default:
          return 0;
      }
    });
  }, [filteredGroups, sortKey]);

  // Select service and specific duration
  const selectServiceAndDuration = (group: ServiceGroup, duration: number) => {
    setSelectedBaseTitle(group.baseTitle);
    setSelectedDuration(duration);
    const variant = group.variants.find((v) => v.duration === duration) || group.variants[0];
    if (variant) {
      setSelectedPackageId(variant.id);
    }
  };

  // Change duration for currently active service
  const changeDuration = (duration: number) => {
    if (!selectedServiceGroup) return;
    const variant = selectedServiceGroup.variants.find((v) => v.duration === duration);
    if (variant) {
      setSelectedDuration(duration);
      setSelectedPackageId(variant.id);
    }
  };

  // Handle Voucher validation
  const validateVoucherCode = async (codeToVerify?: string) => {
    const code = (codeToVerify ?? voucher).trim();
    if (!code) {
      setVoucherStatus("idle");
      setVoucherMessage("");
      setVoucherId(null);
      return;
    }
    setVoucherStatus("checking");
    setVoucherMessage("Validating voucher…");
    try {
      const result = await verifyVoucher(code);
      if (result.isValid) {
        setVoucherStatus("valid");
        setVoucherMessage("Voucher applied successfully!");
        setVoucherId(result.id || null);
      } else {
        setVoucherStatus("invalid");
        setVoucherMessage("Voucher code is invalid or expired.");
        setVoucherId(null);
      }
    } catch {
      setVoucherStatus("invalid");
      setVoucherMessage("Unable to validate voucher.");
      setVoucherId(null);
    }
  };

  // Auto hide feedback toasts
  useEffect(() => {
    if (!successId) return;
    const t = setTimeout(() => setSuccessId(null), 6000);
    return () => clearTimeout(t);
  }, [successId]);

  useEffect(() => {
    if (!submitError) return;
    const t = setTimeout(() => setSubmitError(null), 6000);
    return () => clearTimeout(t);
  }, [submitError]);

  const selectedBranch =
    branches.find((b) => b.id === selectedBranchId) ||
    branches.find((b) => b.name.includes("Chareonmuang") || b.name.includes("เจริญเมือง")) ||
    branches[0];

  const baseReady = !!(selectedBranchId && selectedPackageId && date && time);
  const voucherReady = voucher.trim() === "" ? true : voucherStatus === "valid";
  const canSubmit = baseReady && voucherReady && !isSubmitting && voucherStatus !== "checking";

  const resetForm = () => {
    setDate("");
    setTime("");
    setVoucher("");
    setVoucherStatus("idle");
    setVoucherMessage("");
    setVoucherId(null);
  };

  return (
    <main className="min-h-screen w-full pb-20 relative text-[#38281F]">
      {/* Authentic Spa Interior Background with ambient warm lighting & Thai Pattern */}
      <div className="fixed inset-0 -z-20">
        <Image
          src="/figma-assets/66a0ca9d9d29769359124398_S__8716295.jpg"
          alt="Spa ambience"
          fill
          priority
          className="object-cover object-center filter blur-md scale-105 opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#180E09]/90 via-[#27170F]/85 to-[#180E09]/92" />
        <div className="absolute inset-0 thai-pattern-bg opacity-15" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12">
        {/* Page Header with High-Contrast Elegant Gold Colors */}
        <div className="text-center mb-8 animate-fadeInUp">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#FBF5E8] tracking-wide mb-2 drop-shadow-md font-medium">
            Book Appointment
          </h1>
          <p className="text-[#DFC39C] text-xs sm:text-sm md:text-base font-light max-w-xl mx-auto">
            Schedule your perfect Thai massage experience
          </p>

          {/* Golden Lotus Ornament Divider */}
          <div className="flex items-center justify-center gap-3 my-3">
            <div className="w-16 md:w-28 h-[1px] bg-gradient-to-r from-transparent to-[#D29F38]" />
            <span className="text-[#D29F38] text-base">🪷</span>
            <div className="w-16 md:w-28 h-[1px] bg-gradient-to-l from-transparent to-[#D29F38]" />
          </div>

          {/* 3 Value Proposition Badges */}
          <div className="flex flex-wrap items-center justify-center gap-5 md:gap-8 text-[#E4B34B] text-xs md:text-[13px] font-medium mt-2">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#E4B34B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Professional Therapists
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#E4B34B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Premium Environment
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#E4B34B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Relax &amp; Rejuvenate
            </span>
          </div>
        </div>

        {/* Top Two Column Layout: Section 1 (Branch) & Section 2 (Appointment Details) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Section 1: Select Branch (5 branches always shown!) */}
          <section className="bg-[#FAF7F2] rounded-2xl shadow-xl p-5 md:p-6 border border-[#EAE2D5] flex flex-col justify-between">
            <div>
              {/* Header with circular gold storefront icon */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#C99127] text-white flex items-center justify-center shadow-sm flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-serif font-bold text-[#38281F]">
                    Select Branch
                  </h2>
                  <p className="text-xs text-[#7D6C63]">
                    Choose your preferred branch (5 branches available)
                  </p>
                </div>
              </div>

              {/* Branches Grid (2 Columns: Rimping, Chareonmuang, Rimping2, ChiangKang, Phrasingh) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {branches.map((b) => {
                  const isSelected = selectedBranchId === b.id;
                  const initialLetter = b.name.trim().charAt(0).toUpperCase();
                  return (
                    <button
                      type="button"
                      key={b.id}
                      onClick={() => setSelectedBranchId(b.id)}
                      className={`relative text-left rounded-xl p-3 flex items-center gap-2.5 transition-all duration-200 border cursor-pointer ${
                        isSelected
                          ? "bg-[#FDF9EE] border-2 border-[#C59226] shadow-sm"
                          : "bg-[#F3EEE6] hover:bg-[#EBE3D7] border-[#DFD6C8]"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 transition-colors ${
                          isSelected
                            ? "bg-[#BA8223] text-white"
                            : "bg-[#4B3931] text-white"
                        }`}
                      >
                        {initialLetter}
                      </div>
                      <span className="text-xs font-semibold text-[#38281F] truncate leading-tight flex-1">
                        {b.name}
                      </span>
                      {isSelected && (
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#C59226] text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-md">
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Branch Image Card */}
            {selectedBranch && (
              <div className="mt-4 relative rounded-xl overflow-hidden shadow-md border border-[#E3D8C8]">
                <div className="relative h-44 sm:h-48 w-full bg-[#38281F]/20">
                  <Image
                    src={selectedBranch.pictureUrl || "/branch-2.jpg"}
                    alt={selectedBranch.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Bottom info banner */}
                  <div className="absolute inset-x-0 bottom-0 bg-black/75 backdrop-blur-sm px-4 py-2 flex items-center justify-between text-xs text-white">
                    <div className="flex items-center gap-1.5 text-[#34D399] font-medium">
                      <span className="w-4 h-4 rounded-full bg-[#10B981] text-white flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                      <span>Selected Branch</span>
                    </div>
                    <span className="font-semibold text-white/95 truncate max-w-[55%] text-right">
                      {selectedBranch.name}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Section 2: Appointment Details */}
          <section id="appointment-details" className="scroll-mt-[100px] bg-[#FAF7F2] rounded-2xl shadow-xl p-5 md:p-6 border border-[#EAE2D5] space-y-4">
            {/* Header with circle 2 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#E8DCBE] text-[#8C6418] flex items-center justify-center font-serif font-bold text-lg shadow-sm flex-shrink-0">
                2
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-serif font-bold text-[#38281F]">
                  Appointment Details
                </h2>
                <p className="text-xs text-[#7D6C63]">
                  Review your selections and choose date &amp; time
                </p>
              </div>
            </div>

            {/* Summary Box */}
            <div className="bg-[#F4EFE6] rounded-xl p-4 border border-[#E2D7C7] text-xs">
              <div className="flex items-center gap-2 mb-3 text-[#38281F] font-semibold text-[13px]">
                <svg className="w-4 h-4 text-[#8C6418]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Summary</span>
              </div>
              <div className="grid grid-cols-2 gap-y-2 text-[#6D5D55]">
                <span className="text-[#84746C]">Branch</span>
                <span className="font-semibold text-[#38281F] text-right truncate">
                  {selectedBranch?.name || "-"}
                </span>

                <span className="text-[#84746C]">Service (บริการ)</span>
                <span className="font-semibold text-[#38281F] text-right truncate">
                  {selectedServiceGroup?.baseTitle || "-"}
                </span>

                <span className="text-[#84746C]">Duration (ระยะเวลา)</span>
                <span className="font-semibold text-[#BA8223] text-right">
                  {selectedDuration} นาที ({selectedDuration === 60 ? "1 ชม." : selectedDuration === 90 ? "1.5 ชม." : "2 ชม."})
                </span>

                <span className="text-[#84746C]">Price (ราคา)</span>
                <span className="font-bold text-[#BA8223] text-right text-sm">
                  ฿{currentPrice.toLocaleString()}
                </span>

                <span className="text-[#84746C]">Date</span>
                <span className="font-semibold text-[#38281F] text-right">
                  {date || "-"}
                </span>

                <span className="text-[#84746C]">Time</span>
                <span className="font-semibold text-[#38281F] text-right">
                  {time || "-"}
                </span>

                {voucher.trim() !== "" && voucherStatus === "valid" && (
                  <>
                    <span className="text-[#84746C]">Voucher</span>
                    <span className="font-semibold text-[#059669] text-right">
                      Applied ({voucher})
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Interactive Duration Selector Pills */}
            {selectedServiceGroup && selectedServiceGroup.variants.length > 0 && (
              <div className="p-3 bg-[#F4EFE6] rounded-xl border border-[#E2D7C7]">
                <label className="block text-xs font-semibold text-[#38281F] mb-2 flex items-center gap-1.5">
                  <span className="text-[#BA8223]">⏱️</span> เลือกจำนวนชั่วโมง (Select Duration)
                </label>
                <div className="flex gap-2">
                  {selectedServiceGroup.variants.map((v) => {
                    const isSelected = selectedDuration === v.duration;
                    const hours = v.duration === 60 ? "1 ชั่วโมง" : v.duration === 90 ? "1.5 ชั่วโมง" : "2 ชั่วโมง";
                    return (
                      <button
                        key={v.duration}
                        type="button"
                        onClick={() => changeDuration(v.duration)}
                        className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer text-center ${
                          isSelected
                            ? "bg-[#BA8223] text-white border-[#A8711D] shadow-sm ring-1 ring-[#BA8223]"
                            : "bg-white text-[#38281F] border-[#DCD3C5] hover:bg-[#FDF9EE]"
                        }`}
                      >
                        <div>{v.duration} นาที ({hours})</div>
                        <div className={`text-[11.5px] font-bold mt-0.5 ${isSelected ? "text-[#FFF3D6]" : "text-[#BA8223]"}`}>
                          ฿{v.price.toLocaleString()}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Date and Time Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Select Date */}
              <div>
                <label className="block text-xs font-semibold text-[#38281F] mb-1.5 flex items-center gap-1.5">
                  <span className="text-[#BA8223]">📅</span> Select Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-white border border-[#DCD3C5] text-xs text-[#38281F] focus:outline-none focus:ring-2 focus:ring-[#BA8223] focus:border-transparent transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Select Time (Shop opens 09:30 - 20:00 as per menu poster) */}
              <div>
                <label className="block text-xs font-semibold text-[#38281F] mb-1.5 flex items-center gap-1.5">
                  <span className="text-[#BA8223]">🕒</span> Select Time (09:30 - 20:00)
                </label>
                <div className="relative">
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-white border border-[#DCD3C5] text-xs text-[#38281F] focus:outline-none focus:ring-2 focus:ring-[#BA8223] focus:border-transparent transition-all shadow-sm appearance-none cursor-pointer"
                  >
                    <option value="" className="text-[#998A82]">
                      Choose a time...
                    </option>
                    {Array.from({ length: 24 }, (_, h) =>
                      Array.from({ length: 2 }, (_, half) => {
                        if (h < 9 || (h === 9 && half === 0) || h > 20) return null; // 09:30 - 20:00
                        const hour = h.toString().padStart(2, "0");
                        const minute = (half * 30).toString().padStart(2, "0");
                        const val = `${hour}:${minute}`;
                        return (
                          <option key={val} value={val}>
                            {val}
                          </option>
                        );
                      })
                    )
                      .flat()
                      .filter(Boolean)}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-[#BA8223] text-xs">
                    ▼
                  </div>
                </div>
              </div>
            </div>

            {/* Voucher Code (optional) */}
            <div>
              <label className="block text-xs font-semibold text-[#38281F] mb-1.5 flex items-center gap-1.5">
                <span className="text-[#BA8223]">🏷️</span> Voucher Code (optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={voucher}
                  onChange={(e) => setVoucher(e.target.value)}
                  placeholder="Enter voucher code"
                  className="flex-1 px-3 py-2.5 rounded-lg bg-white border border-[#DCD3C5] text-xs text-[#38281F] placeholder-[#9E9087] focus:outline-none focus:ring-2 focus:ring-[#BA8223] shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => validateVoucherCode()}
                  className="px-5 py-2.5 bg-[#BA8223] hover:bg-[#A3701B] text-white text-xs font-semibold rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {voucherMessage && (
                <p
                  className={`text-[11px] mt-1.5 font-medium ${
                    voucherStatus === "valid"
                      ? "text-[#059669]"
                      : voucherStatus === "invalid"
                      ? "text-[#DC2626]"
                      : "text-[#D97706]"
                  }`}
                >
                  {voucherMessage}
                </p>
              )}
            </div>

            {/* CTA Book Appointment Button */}
            <button
              type="button"
              disabled={!canSubmit}
              onClick={async () => {
                if (!canSubmit) return;
                setIsSubmitting(true);
                setSubmitError(null);
                setSuccessId(null);
                try {
                  const dateIso = new Date(`${date}T${time}:00`).toISOString();
                  // Ensure targetPackageId is a valid UUID
                  let targetPackageId = activeVariant?.id || selectedPackageId;
                  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                  if (!uuidRegex.test(targetPackageId)) {
                    // Fallback to match by title & duration from packages array
                    const foundInPkgs = packages.find(
                      (p) => p.duration === selectedDuration && (
                        p.title.includes(selectedBaseTitle.slice(4, 15)) ||
                        selectedBaseTitle.includes(p.title.split(" (")[0])
                      )
                    );
                    if (foundInPkgs) {
                      targetPackageId = foundInPkgs.id;
                    }
                  }

                  const res = await createBooking({
                    branchId: selectedBranchId,
                    packageId: targetPackageId,
                    date: dateIso,
                    voucherId:
                      voucher.trim() && voucherStatus === "valid"
                        ? voucherId ?? undefined
                        : undefined,
                  });
                  setSuccessId(res.id || "CONFIRMED");
                  resetForm();
                } catch (e: unknown) {
                  setSubmitError(
                    e instanceof Error
                      ? e.message
                      : "Failed to create booking. Please try again."
                  );
                } finally {
                  setIsSubmitting(false);
                }
              }}
              className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                canSubmit
                  ? "bg-gradient-to-r from-[#A8711D] via-[#BA8223] to-[#A8711D] hover:from-[#966316] hover:to-[#966316] text-white cursor-pointer active:scale-[0.99]"
                  : "bg-[#D6CBC0] text-[#7A6C63] cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>📅</span>
                  <span>Book Appointment (จองบริการ ฿{currentPrice.toLocaleString()})</span>
                </>
              )}
            </button>
          </section>
        </div>

        {/* Section 3: Select Package with Dynamic Duration Selector */}
        <section className="bg-[#FAF7F2] rounded-2xl shadow-xl p-5 md:p-6 border border-[#EAE2D5] mt-6">
          {/* Header Row: Title & Right Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#EAE2D5]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#BA8223] text-white flex items-center justify-center font-serif font-bold text-lg shadow-sm flex-shrink-0">
                3
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-serif font-bold text-[#38281F]">
                  Select Package &amp; Duration (เลือกลายการและจำนวนชั่วโมง)
                </h2>
                <p className="text-xs text-[#7D6C63]">
                  เลือกบริการที่ต้องการ และกดปุ่มเลือกระยะเวลา (60 / 90 / 120 นาที)
                </p>
              </div>
            </div>

            {/* Filters on Right */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Search */}
              <div className="relative flex-1 sm:w-48">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search packages..."
                  className="w-full pl-8 pr-3 py-2 rounded-lg bg-white border border-[#DCD3C5] text-xs text-[#38281F] placeholder-[#9E9087] focus:outline-none focus:ring-2 focus:ring-[#BA8223]"
                />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9E9087]">
                  🔍
                </span>
              </div>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={handleTypeFilterChange}
                className="px-3 py-2 rounded-lg bg-white border border-[#DCD3C5] text-xs text-[#38281F] focus:outline-none focus:ring-2 focus:ring-[#BA8223] cursor-pointer"
              >
                <option value="all">All Types (ทั้งหมด)</option>
                <option value="service">Services (นวดทั่วไป)</option>
                <option value="promotion">Promotions (ชุดสุดคุ้ม)</option>
              </select>

              {/* Sort Filter */}
              <select
                value={sortKey}
                onChange={handleSortKeyChange}
                className="px-3 py-2 rounded-lg bg-white border border-[#DCD3C5] text-xs text-[#38281F] focus:outline-none focus:ring-2 focus:ring-[#BA8223] cursor-pointer"
              >
                <option value="recommended">Recommended (แนะนำ)</option>
                <option value="priceAsc">Price: Low to High (ราคาต่ำ-สูง)</option>
                <option value="priceDesc">Price: High to Low (ราคาสูง-ต่ำ)</option>
                <option value="nameAsc">Name A-Z</option>
              </select>
            </div>
          </div>

          {/* Sub Bar: Description */}
          <div className="flex items-center justify-between py-3 text-xs text-[#7D6C63]">
            <span className="font-medium text-[#4B3931]">
              🌟 เมนูและราคามาตรฐานตามป้ายร้าน เก็ดถะหวา นวดแผนไทย
            </span>
            <span>Showing {sortedGroups.length} services</span>
          </div>

          {/* Service Group Rows List */}
          <div className="space-y-3">
            {sortedGroups.map((group) => {
              const isPromotion = group.type === "promotion";
              const avatarLetter = isPromotion ? "P" : "S";
              const isGroupActive = selectedServiceGroup?.baseTitle === group.baseTitle;

              return (
                <div
                  key={group.baseTitle}
                  className={`rounded-xl p-3 sm:p-4 transition-all duration-200 border ${
                    isGroupActive
                      ? "bg-[#FDF9EE] border-2 border-[#C59226] ring-1 ring-[#C59226]/40 shadow-sm"
                      : "bg-[#F5F0E8] hover:bg-[#EFE7DC] border-[#DFD6C8]"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Left: Avatar + Image + Title & Description */}
                    <div
                      className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                      onClick={() => selectServiceAndDuration(group, group.variants[0].duration)}
                    >
                      {/* Avatar Icon */}
                      <div
                        className={`w-9 h-9 rounded-lg text-white flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                          isPromotion ? "bg-[#4B3931]" : "bg-[#6A574E]"
                        }`}
                      >
                        {avatarLetter}
                      </div>

                      {/* Thumbnail Image */}
                      <div className="relative w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden flex-shrink-0 bg-[#38281F]/15 border border-[#DDD3C4]">
                        <Image
                          src={group.pictureUrl || "/aromapics.png"}
                          alt={group.baseTitle}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>

                      {/* Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span className="font-semibold text-xs sm:text-sm text-[#38281F]">
                            {group.baseTitle}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${
                              isPromotion
                                ? "bg-[#FEE2E2] text-[#DC2626]"
                                : "bg-[#FEF3C7] text-[#D97706]"
                            }`}
                          >
                            {isPromotion ? "PROMO" : "SERVICE"}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#7D6C63] line-clamp-1">
                          {group.description || "Traditional Thai massage experience"}
                        </p>
                      </div>
                    </div>

                    {/* Right: Duration Buttons with Prices! */}
                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-end pt-1 sm:pt-0">
                      {group.variants.map((v) => {
                        const isThisSelected = isGroupActive && selectedDuration === v.duration;
                        const hourText = v.duration === 60 ? "1 ชม." : v.duration === 90 ? "1.5 ชม." : "2 ชม.";
                        return (
                          <button
                            key={v.duration}
                            type="button"
                            onClick={() => selectServiceAndDuration(group, v.duration)}
                            className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer flex flex-col items-center min-w-[76px] border ${
                              isThisSelected
                                ? "bg-[#BA8223] text-white border-[#A8711D] shadow-sm scale-105 ring-1 ring-[#BA8223]"
                                : "bg-white hover:bg-[#FDF9EE] text-[#38281F] border-[#DCD3C5]"
                            }`}
                          >
                            <span className="text-[10.5px] opacity-90">{v.duration} นาที ({hourText})</span>
                            <span className={`text-xs font-bold ${isThisSelected ? "text-[#FFF3D6]" : "text-[#BA8223]"}`}>
                              ฿{v.price.toLocaleString()}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}

            {sortedGroups.length === 0 && (
              <div className="text-center py-10 text-xs text-[#8A7970]">
                No services match your search criteria.
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Floating Feedback Toasts */}
      {(submitError || successId) && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full space-y-3">
          {submitError && (
            <div className="bg-white border-l-4 border-red-500 rounded-xl p-4 shadow-2xl flex items-start gap-3">
              <span className="text-red-500 text-lg">⚠️</span>
              <div>
                <p className="text-sm font-semibold text-gray-900">Booking Failed</p>
                <p className="text-xs text-gray-600 mt-0.5">{submitError}</p>
              </div>
            </div>
          )}
          {successId && (
            <div className="bg-white border-l-4 border-emerald-500 rounded-xl p-4 shadow-2xl flex items-start gap-3">
              <span className="text-emerald-500 text-lg">🎉</span>
              <div>
                <p className="text-sm font-semibold text-gray-900">Booking Confirmed!</p>
                <p className="text-xs text-gray-600 mt-0.5">
                  Thank you for booking with Getthawa. We look forward to seeing you.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
