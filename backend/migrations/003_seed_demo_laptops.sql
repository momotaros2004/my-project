-- Demo-only laptop catalog entries for exercising the laptop recommendation flow.
-- Replace their prices and scores before using them as real purchase recommendations.
INSERT INTO comset
  (name, device_type, cpu, gpu, ram, storage, price, tier, performance, price_score, upgrade_score, efficiency)
SELECT
  'DEMO Laptop Low', 'laptop', 'Intel Core i5-12450H', 'RTX 3050 Laptop GPU',
  '16 GB', 'SSD 512GB', 29990, 'Low', 78, 82, 50, 70
WHERE NOT EXISTS (
  SELECT 1 FROM comset WHERE name = 'DEMO Laptop Low' AND device_type = 'laptop'
);

INSERT INTO comset
  (name, device_type, cpu, gpu, ram, storage, price, tier, performance, price_score, upgrade_score, efficiency)
SELECT
  'DEMO Laptop Medium', 'laptop', 'Intel Core i7-13620H', 'RTX 4060 Laptop GPU',
  '32 GB', 'SSD 1TB', 44990, 'Medium', 90, 70, 60, 68
WHERE NOT EXISTS (
  SELECT 1 FROM comset WHERE name = 'DEMO Laptop Medium' AND device_type = 'laptop'
);

INSERT INTO comset
  (name, device_type, cpu, gpu, ram, storage, price, tier, performance, price_score, upgrade_score, efficiency)
SELECT
  'DEMO Laptop High', 'laptop', 'Intel Core i9-14900HX', 'RTX 4080 Laptop GPU',
  '32 GB', 'SSD 2TB', 99990, 'High', 98, 45, 55, 45
WHERE NOT EXISTS (
  SELECT 1 FROM comset WHERE name = 'DEMO Laptop High' AND device_type = 'laptop'
);
