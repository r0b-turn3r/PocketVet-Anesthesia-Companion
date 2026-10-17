// US label-backed stock concentrations. Values use the calculator's displayed units.
// Label strengths establish formulation, not prevalence or a treatment recommendation.
const labelUrl=id=>'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid='+id;
const concentrationDefaults={
  Epinephrine:[1,'mg','79ca73ca-d3c0-40af-9dec-e2f4ce669cda','Stock vial. 0.1 mg/mL syringes also exist; use actual preparation strength.'],
  Vasopressin:[20,'U','52324969-4536-2b7c-e063-6394a90a9b4d','Stock concentrate; diluted infusion products have different strengths.'],
  Atropine:[.54,'mg','408c06b2-4f96-4ea2-9d33-2b148fd01884','Veterinary vial; 0.4 mg/mL and other strengths also exist.'],
  Amiodarone:[50,'mg','51772745-9ea9-42cd-97e6-7266f41ae3ca','Stock concentrate; verify dilution and administration protocol.'],
  Lidocaine:[20,'mg','89701fac-7536-4f16-87fb-f4cc121e74ee','2% plain lidocaine = 20 mg/mL. Confirm formulation suitable for IV use; no epinephrine.'],
  Naloxone:[.4,'mg','2725b9c0-5b1e-498b-9ec5-ee76a62e656a','Injectable formulation; other injectable and intranasal strengths differ.'],
  Methadone:[10,'mg','092d78eb-6423-495c-bf0d-e6532bea7138','Injectable formulation; not oral concentrate.'],
  Fentanyl:[50,'µg','1ed25b2c-334e-4021-ada1-3396f07630dc','50 µg/mL = 0.05 mg/mL. Enter concentration in µg/mL here.'],
  Buprenorphine:[.3,'mg','adc1167e-910e-4d7b-abdc-751d3df0c3dc','Conventional injection only. Long-acting products and transdermal products are not interchangeable.'],
  Hydromorphone:[2,'mg','9eebd88a-5632-460f-b7b6-26c8a180540d','Selected injectable reference; 0.2, 1, and other strengths exist.'],
  Midazolam:[5,'mg','a91ce254-14a3-4cbf-8ab8-5da252aa3fdc','5 mg/mL injection; 1 mg/mL products also exist.'],
  Diazepam:[5,'mg','f466f8a3-f31c-44f4-b0e8-444464f20f66','Injectable formulation.'],
  Dexmedetomidine:[500,'µg','9afc5d50-8df7-46e9-b5a0-5573627fc1bc','Dexdomitor 0.5 mg/mL = 500 µg/mL. 0.1 mg/mL = 100 µg/mL; human products may differ.'],
  Acepromazine:[10,'mg','11ee8981-46eb-4791-8e40-727c991341fe','Veterinary stock injection. Diluted clinic preparations may be 1 mg/mL; verify.'],
  Maropitant:[10,'mg','https://www.fda.gov/animal-veterinary/animal-drug-compounding/bulk-drug-substances-reviewed-and-not-listed','Cerenia injectable solution; not tablets.'],
  Ondansetron:[2,'mg','97713356-f42b-4a67-95f6-561afa68c0c2','Injectable formulation; not oral solution.'],
  Metoclopramide:[5,'mg','146803a1-199d-4789-b128-e974bdd03322','Injectable formulation; oral solution concentrations differ.'],
  Propofol:[10,'mg','10272dc1-657d-4798-a34a-b6341b92e560','1% injectable emulsion = 10 mg/mL. Verify product handling requirements.'],
  Alfaxalone:[10,'mg','f412f5c3-5ba8-43c2-8920-510f34e67f53','Alfaxan Multidose injectable formulation.'],
  Ketamine:[100,'mg','00931aa1-4b45-41f2-ae2f-f966d308c518','Ketaset veterinary stock injection. Confirm product-specific route and dilution requirements.'],
  Etomidate:[2,'mg','94cde4e7-3b46-419f-8dda-87675da8d89d','Injectable formulation.'],
  Cefazolin:[330,'mg','e82a44ed-8d5b-4991-a2fe-314eec533773','Approximate reconstituted STOCK: labeled 1 g vial + 2.5 mL diluent yields about 3 mL. Further IV dilution may be required; enter actual prepared concentration.'],
  Ampicillin:[250,'mg','302e6df7-37c5-4625-8a61-3e2f302addf2','Reconstituted STOCK per labeled IM table. IV preparation differs; enter actual prepared concentration and follow product-specific instructions.'],
  Atipamezole:[5,'mg','https://animaldrugsatfda.fda.gov/adafda/app/search/public/monthlyUpdates/downloadMonthlyUpdate/1781','Antisedan-type injectable formulation.'],
  Flumazenil:[.1,'mg','442ed32b-b508-40cc-9915-ff05674566da','Injectable formulation.']
};
function concentrationReference(name,unit){const d=concentrationDefaults[name];if(!d||d[1]!==unit)return null;return {value:d[0],unit:d[1],url:d[2].startsWith('https:')?d[2]:labelUrl(d[2]),note:d[3]}}
