
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



export const SYMPTOM_OPTIONS = [
  // General
  { value: "fever", label: "Fever" },
  { value: "fatigue", label: "Fatigue / Weakness" },
  { value: "weight_loss", label: "Weight Loss" },
  { value: "weight_gain", label: "Weight Gain" },
  { value: "loss_of_appetite", label: "Loss of Appetite" },
  { value: "night_sweats", label: "Night Sweats" },

  // Respiratory
  { value: "cough", label: "Cough" },
  { value: "dry_cough", label: "Dry Cough" },
  { value: "productive_cough", label: "Productive Cough" },
  { value: "shortness_of_breath", label: "Shortness of Breath" },
  { value: "wheezing", label: "Wheezing" },
  { value: "sore_throat", label: "Sore Throat" },

  // Cardiovascular
  { value: "chest_pain", label: "Chest Pain" },
  { value: "palpitations", label: "Palpitations" },
  { value: "dizziness", label: "Dizziness" },
  { value: "syncope", label: "Fainting / Syncope" },

  // Gastrointestinal
  { value: "abdominal_pain", label: "Abdominal Pain" },
  { value: "nausea", label: "Nausea" },
  { value: "vomiting", label: "Vomiting" },
  { value: "diarrhea", label: "Diarrhea" },
  { value: "constipation", label: "Constipation" },
  { value: "heartburn", label: "Heartburn" },
  { value: "bloating", label: "Bloating" },

  // Neurological
  { value: "headache", label: "Headache" },
  { value: "seizures", label: "Seizures" },
  { value: "numbness", label: "Numbness / Tingling" },
  { value: "weakness_limb", label: "Limb Weakness" },

  // Musculoskeletal
  { value: "joint_pain", label: "Joint Pain" },
  { value: "muscle_pain", label: "Muscle Pain" },
  { value: "back_pain", label: "Back Pain" },
  { value: "neck_pain", label: "Neck Pain" },

  // Genitourinary
  { value: "burning_urination", label: "Burning Urination" },
  { value: "frequency_urination", label: "Increased Urination Frequency" },
  { value: "hematuria", label: "Blood in Urine" },

  // Dermatological
  { value: "rash", label: "Skin Rash" },
  { value: "itching", label: "Itching" },
];


export const SIGN_OPTIONS = [
  // Vital signs
  { value: "high_bp", label: "High Blood Pressure" },
  { value: "low_bp", label: "Low Blood Pressure" },
  { value: "tachycardia", label: "Tachycardia" },
  { value: "bradycardia", label: "Bradycardia" },
  { value: "fever_sign", label: "Fever (Raised Temperature)" },
  { value: "hypoxia", label: "Low Oxygen Saturation" },

  // General examination
  { value: "pallor", label: "Pallor" },
  { value: "cyanosis", label: "Cyanosis" },
  { value: "jaundice", label: "Jaundice" },
  { value: "clubbing", label: "Clubbing" },
  { value: "edema", label: "Edema" },
  { value: "lymphadenopathy", label: "Lymphadenopathy" },

  // Respiratory
  { value: "crepitations", label: "Crepitations" },
  { value: "reduced_air_entry", label: "Reduced Air Entry" },
  { value: "wheeze", label: "Wheeze" },

  // Cardiovascular
  { value: "heart_murmur", label: "Heart Murmur" },
  { value: "raised_jvp", label: "Raised JVP" },

  // Abdominal
  { value: "tenderness", label: "Abdominal Tenderness" },
  { value: "hepatomegaly", label: "Hepatomegaly" },
  { value: "splenomegaly", label: "Splenomegaly" },
  { value: "ascites", label: "Ascites" },

  // Neurological
  { value: "altered_sensorium", label: "Altered Sensorium" },
  { value: "focal_deficit", label: "Focal Neurological Deficit" },
];

export const INVESTIGATION_OPTIONS = [
  // Blood tests
  { value: "cbc", label: "Complete Blood Count (CBC)" },
  { value: "esr", label: "ESR" },
  { value: "crp", label: "CRP" },
  { value: "blood_sugar_fasting", label: "Fasting Blood Sugar" },
  { value: "blood_sugar_random", label: "Random Blood Sugar" },
  { value: "hba1c", label: "HbA1c" },

  // Biochemistry
  { value: "lft", label: "Liver Function Test (LFT)" },
  { value: "rft", label: "Renal Function Test (RFT)" },
  { value: "electrolytes", label: "Serum Electrolytes" },
  { value: "lipid_profile", label: "Lipid Profile" },

  // Urine / Stool
  { value: "urine_exam", label: "Urine Examination" },
  { value: "urine_culture", label: "Urine Culture" },
  { value: "stool_exam", label: "Stool Examination" },

  // Cardiac
  { value: "ecg", label: "ECG" },
  { value: "echocardiography", label: "Echocardiography" },

  // Imaging
  { value: "xray_chest", label: "X-Ray Chest" },
  { value: "xray_abdomen", label: "X-Ray Abdomen" },
  { value: "ultrasound", label: "Ultrasound" },
  { value: "ct_scan", label: "CT Scan" },
  { value: "mri", label: "MRI" },

  // Infectious
  { value: "covid_test", label: "COVID-19 Test" },
  { value: "hbsag", label: "HBsAg" },
  { value: "anti_hcv", label: "Anti-HCV" },
];
