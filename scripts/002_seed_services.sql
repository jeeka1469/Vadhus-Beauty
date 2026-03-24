-- Seed full service catalog for Vadhus Beauty
-- Source: latest provided price-list cards

-- Keep category labels consistent for filtering in UI.
UPDATE public.services
SET category = CASE
	WHEN LOWER(category) = 'hair' THEN 'Hair Treatment'
	WHEN LOWER(category) = 'facial' THEN 'Facial'
	WHEN LOWER(category) = 'wax' THEN 'Wax'
	WHEN LOWER(category) = 'nails' THEN 'Nails'
	WHEN LOWER(category) = 'spa' THEN 'Spa'
	WHEN LOWER(category) = 'makeup' THEN 'Others'
	ELSE category
END;

CREATE UNIQUE INDEX IF NOT EXISTS services_name_category_key
ON public.services (name, category);

-- Treat this seed as source-of-truth: hide old catalog rows not present below.
UPDATE public.services
SET is_active = false,
	updated_at = NOW();

INSERT INTO public.services (name, category, description, price, duration, is_active) VALUES
-- Facial
('Hydra+ Galvani', 'Facial', 'Hydra and galvanic facial treatment', 1500.00, 75, true),
('Galvanic Facial', 'Facial', 'Classic galvanic facial', 1000.00, 60, true),
('Clean Up', 'Facial', 'Quick skin cleanup treatment', 700.00, 35, true),
('Body Bleach', 'Facial', 'Body bleach service', 1500.00, 60, true),
('Body Massage', 'Facial', 'Relaxing body massage', 800.00, 45, true),
('Body Spa/Polish', 'Facial', 'Body spa and polishing treatment', 2000.00, 75, true),

-- Wax
('Hand Wax', 'Wax', 'Hand waxing service', 350.00, 20, true),
('Half Leg Wax', 'Wax', 'Half leg waxing service', 300.00, 25, true),
('Full Leg Wax', 'Wax', 'Full leg waxing service', 500.00, 40, true),
('Bikini Wax', 'Wax', 'Bikini waxing service', 700.00, 30, true),
('Stomach Wax', 'Wax', 'Stomach waxing service', 200.00, 20, true),
('Back Wax', 'Wax', 'Back waxing service', 300.00, 25, true),
('Face Wax', 'Wax', 'Face waxing service', 100.00, 15, true),
('Full Body Wax', 'Wax', 'Full body waxing service', 2000.00, 90, true),

-- Others
('Eyebrows', 'Others', 'Eyebrow grooming', 40.00, 10, true),
('Upper Lips', 'Others', 'Upper lip threading/wax', 10.00, 10, true),
('Forehead', 'Others', 'Forehead threading/wax', 10.00, 10, true),
('Manicure', 'Others', 'Classic manicure', 500.00, 45, true),
('Pedicure', 'Others', 'Classic pedicure', 400.00, 45, true),
('Protein Hairwash', 'Others', 'Protein hair wash treatment', 300.00, 25, true),
('Hairwash', 'Others', 'Basic hair wash', 200.00, 20, true),
('Hair Straight', 'Others', 'Hair straightening service', 250.00, 30, true),
('Blow Dry', 'Others', 'Blow dry styling', 250.00, 30, true),

-- Nails
('Gel Polish', 'Nails', 'Gel polish application', 400.00, 40, true),
('Temporary Nails', 'Nails', 'Temporary nail extension/application', 800.00, 60, true),
('Nail Removal', 'Nails', 'Removal of nail extensions/gel', 150.00, 25, true),
('Leg Gel Polish', 'Nails', 'Gel polish for toes', 300.00, 35, true),

-- Hair Treatment
('Protein 16', 'Hair Treatment', 'Protein 16 hair treatment', 4000.00, 150, true),
('Pro Liss', 'Hair Treatment', 'Pro Liss smoothing treatment', 5000.00, 180, true),
('Keratin', 'Hair Treatment', 'Keratin treatment', 3000.00, 150, true),
('Anti Dandruff', 'Hair Treatment', 'Anti-dandruff treatment', 250.00, 30, true),
('Anti Hairfall', 'Hair Treatment', 'Anti-hairfall treatment', 250.00, 30, true),

-- Colour
('Root Touch Up', 'Colour', 'Root touch-up colouring', 600.00, 60, true),
('Highlights', 'Colour', 'Hair highlights', 3000.00, 150, true),
('Global Colour', 'Colour', 'Global hair colour', 3000.00, 150, true),
('Global + Highlight', 'Colour', 'Global colour with highlights', 6000.00, 210, true),

-- Hair Cut
('Straight Cut', 'Hair Cut', 'Straight hair cut', 100.00, 25, true),
('U-Cut', 'Hair Cut', 'U-shape haircut', 200.00, 30, true),
('Baby Hair Cut', 'Hair Cut', 'Kids haircut', 200.00, 30, true),
('Layer Cut', 'Hair Cut', 'Layered haircut', 300.00, 40, true),
('Step + Layer', 'Hair Cut', 'Step and layer haircut', 350.00, 45, true),
('Advance Cut', 'Hair Cut', 'Advanced styled haircut', 400.00, 50, true),
('Flix Cut', 'Hair Cut', 'Flix-style haircut', 60.00, 20, true),

-- Spa
('Protein Spa', 'Spa', 'Protein spa treatment', 700.00, 45, true),
('Keratin Spa', 'Spa', 'Keratin spa treatment', 550.00, 45, true),
('Normal Spa', 'Spa', 'Regular spa treatment', 400.00, 40, true),
('Head Massage', 'Spa', 'Head massage', 300.00, 30, true),

-- Essentials
('Protein 16 Shampoo', 'Essentials', 'Retail product: Protein 16 shampoo', 1305.00, 5, true),
('Protein 16 Mask', 'Essentials', 'Retail product: Protein 16 mask', 1305.00, 5, true),
('Pro Liss Shampoo', 'Essentials', 'Retail product: Pro Liss shampoo', 1620.00, 5, true),
('Pro Liss Mask', 'Essentials', 'Retail product: Pro Liss mask', 1863.00, 5, true),
('Pro Liss Serum', 'Essentials', 'Retail product: Pro Liss serum', 2025.00, 5, true)

ON CONFLICT (name, category)
DO UPDATE SET
	description = EXCLUDED.description,
	price = EXCLUDED.price,
	duration = EXCLUDED.duration,
	is_active = EXCLUDED.is_active,
	updated_at = NOW();
