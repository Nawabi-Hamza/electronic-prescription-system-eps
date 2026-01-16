
// Predefined options
export const medicineForms = [
  { value: "Tablet", label: "Tablet" },
  { value: "Capsule", label: "Capsule" },
  { value: "Syrup", label: "Syrup" },
  { value: "Serum", label: "Serum" },
  { value: "Injection", label: "Injection" },
  { value: "Cream", label: "Cream" },
  { value: "Ointment", label: "Ointment" },
  { value: "Drops", label: "Drops" },
  { value: "Inhaler", label: "Inhaler" },
  { value: "Powder", label: "Powder" },
  { value: "Suspension", label: "Suspension" },
  { value: "Spray", label: "Spray" },
  { value: "Gel", label: "Gel" },
  { value: "Lozenge", label: "Lozenge" },
  { value: "Patch", label: "Patch" },
  { value: "Solution", label: "Solution" },
  { value: "Elixir", label: "Elixir" },
  { value: "Suppository", label: "Suppository" }
];


export const dosageOptions = [
    // Tablets / Capsules
    { value: "1 tablet", label: "1 tablet" },
    { value: "2 tablets", label: "2 tablets" },
    { value: "1 capsule", label: "1 capsule" },
    { value: "2 capsules", label: "2 capsules" },

    // Milligrams
    { value: "5 mg", label: "5 mg" },
    { value: "10 mg", label: "10 mg" },
    { value: "20 mg", label: "20 mg" },
    { value: "50 mg", label: "50 mg" },
    { value: "100 mg", label: "100 mg" },

    // Milliliters / Syrup / Drops
    { value: "2 ml", label: "2 ml" },
    { value: "5 ml", label: "5 ml" },
    { value: "10 ml", label: "10 ml" },
    { value: "15 ml", label: "15 ml" },
    { value: "20 ml", label: "20 ml" },

    // Injection
    { value: "1 ampoule", label: "1 ampoule" },
    { value: "2 ampoules", label: "2 ampoules" },

    // Topical / Other
    { value: "Apply thin layer", label: "Apply thin layer" },
    { value: "1 puff", label: "1 puff" },
    { value: "2 puffs", label: "2 puffs" },
    { value: "As needed", label: "As needed" }
];


export const timeOptions = [
  { value: "Once a day", label: "Once a day" },
  { value: "Twice a day", label: "Twice a day" },
  { value: "Three times a day", label: "Three times a day" },
  { value: "Four times a day", label: "Four times a day" },
  { value: "Before meal", label: "Before meal" },
  { value: "After meal", label: "After meal" },
  { value: "Morning", label: "Morning" },
  { value: "Afternoon", label: "Afternoon" },
  { value: "Evening", label: "Evening" },
  { value: "At bedtime", label: "At bedtime" },
  { value: "Every 6 hours", label: "Every 6 hours" },
  { value: "Every 8 hours", label: "Every 8 hours" },
  { value: "Every 12 hours", label: "Every 12 hours" },
  { value: "As needed", label: "As needed" }
];


export const numberOptions = Array.from({ length: 20 }, (_, i) => {
  const num = i + 1;
  return { value: String(num), label: String(num) };
});
