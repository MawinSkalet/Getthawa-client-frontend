INSERT INTO "userStaffs" (id, username, email, password, "createdAt", "updatedAt") 
VALUES (gen_random_uuid(), 'admin', 'admin@getthawa.com', '$2b$10$MK80VmSREIvx4SJvyKYeRu6Q0oBNbTNUEpAVDJ5/mf05YUNXHpE76', NOW(), NOW())
ON CONFLICT (username) DO NOTHING;

INSERT INTO users (id, "displayName", "pictureUrl", "createdAt", "updatedAt") 
VALUES ('user-demo-001', 'Getthawa Guest', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO branches (id, name, address, "googleMapUrl", phone, "googleMapEmbedUrl", "pictureUrl", description, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Getthawa Spa (Main Branch)',
  '123 Sukhumvit Road, Khlong Toei, Bangkok 10110',
  'https://maps.google.com',
  '02-123-4567',
  'https://www.google.com/maps/embed',
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef',
  'Luxurious relaxation spa in the heart of Bangkok',
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;

INSERT INTO packages (id, title, description, price, duration, "pictureUrl", note, type, "isActive", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Signature Thai Aroma Massage',
  'Deep tissue traditional Thai massage with organic essential oils',
  '1500',
  90,
  'https://images.unsplash.com/photo-1544161515-4ab6ce6db874',
  'Includes complimentary herbal tea session',
  'promotion',
  true,
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;
