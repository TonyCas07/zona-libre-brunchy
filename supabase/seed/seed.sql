insert into public.restaurants (name, slug, contact_name, zone, status)
values ('Brunchy', 'brunchy', 'Equipo Brunchy', 'Ciudad Colonial', 'active')
on conflict (slug) do nothing;

insert into public.benefits (name, benefit_type, discount_label, discount_percentage, active, is_fiscal_exemption, disclaimer)
values (
  'Descuento equivalente ITBIS',
  'descuento comercial',
  'Beneficio aplicado como descuento comercial',
  18,
  true,
  false,
  'Beneficio aplicado como descuento comercial. No constituye exención fiscal.'
);

insert into public.ally_codes (code, organization_name, contact_name, zone, status, notes)
values ('BRUNCHYTEST', 'Código aliado de prueba Brunchy', 'Equipo Brunchy', 'Ciudad Colonial', 'active', 'Seed inicial para pruebas del PMV.')
on conflict (code) do nothing;

insert into public.delivery_zones (name, description, minimum_order_amount, delivery_fee, free_delivery_threshold, active)
values
  ('Ciudad Colonial', 'Zona base futura de delivery local.', 500, 100, 1200, true),
  ('Ciudad Nueva', 'Zona cercana futura.', 700, 125, 1500, true),
  ('Gazcue', 'Zona cercana futura.', 800, 150, 1800, true),
  ('San Carlos', 'Zona cercana futura.', 800, 150, 1800, true),
  ('Villa Francisca', 'Zona cercana futura.', 800, 150, 1800, true),
  ('San Miguel', 'Zona cercana futura.', 800, 150, 1800, true);
