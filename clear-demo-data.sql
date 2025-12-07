-- Demo verileri temizleme scripti
-- Önce admin kullanıcının ID'sini al ve demo kullanıcıya ait verileri sil

-- 1. Activity logları sil (foreign key bağımlılığı)
DELETE FROM "Activity" WHERE "userId" IN (
  SELECT id FROM "User" WHERE email = 'demo@fikir.agency'
);

-- 2. Event'leri sil
DELETE FROM "Event" WHERE "userId" IN (
  SELECT id FROM "User" WHERE email = 'demo@fikir.agency'
);

-- 3. Equipment'leri sil
DELETE FROM "Equipment" WHERE "userId" IN (
  SELECT id FROM "User" WHERE email = 'demo@fikir.agency'
);

-- 4. Report'ları sil
DELETE FROM "Report" WHERE "userId" IN (
  SELECT id FROM "User" WHERE email = 'demo@fikir.agency'
);

-- 5. Transaction'ları sil
DELETE FROM "Transaction" WHERE "userId" IN (
  SELECT id FROM "User" WHERE email = 'demo@fikir.agency'
);

-- 6. Task'ları sil
DELETE FROM "Task" WHERE "userId" IN (
  SELECT id FROM "User" WHERE email = 'demo@fikir.agency'
);

-- 7. Project'leri sil
DELETE FROM "Project" WHERE "userId" IN (
  SELECT id FROM "User" WHERE email = 'demo@fikir.agency'
);

-- 8. Client'ları sil
DELETE FROM "Client" WHERE "userId" IN (
  SELECT id FROM "User" WHERE email = 'demo@fikir.agency'
);

-- 9. Demo kullanıcıyı sil
DELETE FROM "User" WHERE email = 'demo@fikir.agency';

-- Admin kullanıcı kalsın!
-- Admin: admin@fikir.agency / Admin123!
