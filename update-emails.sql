-- Mevcut admin ve demo kullanıcıların email adreslerini güncelle

UPDATE "User" 
SET email = 'admin@fikircreative.com' 
WHERE email = 'admin@fikir.agency';

UPDATE "User" 
SET email = 'demo@fikircreative.com' 
WHERE email = 'demo@fikir.agency';

-- Kontrol et
SELECT id, name, email, role FROM "User";
