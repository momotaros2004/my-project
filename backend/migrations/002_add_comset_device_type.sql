-- Separate desktop builds from laptop builds in the SAW catalog.
-- Existing rows are treated as desktop PCs.
ALTER TABLE comset
  ADD COLUMN device_type ENUM('desktop', 'laptop') NOT NULL DEFAULT 'desktop' AFTER name;
