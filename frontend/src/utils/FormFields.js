export const afghanistanProvinces = [
  "Badakhshan", "Badghis", "Baghlan", "Bamyan", "Daykundi", "Farah", "Faryab",
  "Ghazni", "Ghor", "Helmand", "Herat", "Jowzjan", "Kabul", "Kandahar",
  "Kapisa", "Khost", "Kunar", "Kunduz", "Laghman", "Logar", "Nangarhar",
  "Nimroz", "Nuristan", "Paktia", "Paktika", "Panjshir", "Parwan", "Samangan",
  "Sar-e Pol", "Takhar", "Urozgan", "Wardak", "Zabul"
];




export const studentFields = [
  {
    name: "firstname",
    label: "Firstname",
    type: "text",
    required: true,
    validation: { required: "Firstname is required" },
  },
  {
    name: "father_name",
    label: "Father Name",
    type: "text",
    required: true,
    validation: { required: "Father Name is required" },
  },
  {
    name: "grand_father_name",
    label: "Grand father Name",
    type: "text",
    required: true,
    validation: { required: "Grand father Name is required" },
  },
  {
    name: "lastname",
    label: "Lastname",
    type: "text",
    required: true,
    validation: { required: "Lastname is required" },
  },
  {
    name: "date_of_birth",
    label: "Date of Birth",
    type: "date",
    required: true,
    validation: {
      required: "DOB is required",
    },
  },
  {
    name: "join_date",
    label: "Join Date",
    type: "date",
    required: true,
    validation: { required: "Join Date is required" },
  },
  {
    name: "nationality",
    label: "Nationality",
    type: "text",
    required: true,
    validation: { required: "Nationality is required" },
  },
  {
    name: "mother_language",
    label: "Mother Language",
    type: "text",
    required: true,
    validation: { required: "Mother Language is required" },
  },
  {
    name: "father_job",
    label: "Father's Job",
    type: "text",
    required: true,
    validation: { required: "Father's Job is required" },
  },
  {
    name: "permanent_address",
    label: "Permanent Address",
    type: "group",
    fields: [
      { name: "country", label: "Country", type: "select", options: ["Afghanistan"], required: true },
      { name: "province", label: "Province", type: "select", options: afghanistanProvinces, required: true },
      { name: "district", label: "District", type: "text", required: false },
      { name: "home_address", label: "Home Address", type: "text", required: true },
    ],
  },
  {
    name: "current_address",
    label: "Current Address",
    type: "group",
    fields: [
      { name: "country", label: "Country", type: "select", options: ["Afghanistan"], required: true },
      { name: "province", label: "Province", type: "select", options: afghanistanProvinces, required: true },
      { name: "district", label: "District", type: "text", required: false },
      { name: "home_address", label: "Home Address", type: "text", required: true },
    ],
  },
  {
    name: "brother_name",
    label: "Brother Name",
    type: "text",
    required: false,
    // validation: { required: "Brother Name is required" },
  },
  {
    name: "brother_name2",
    label: "Second Brother Name",
    type: "text",
    required: false,
    // validation: { required: "Second Brother Name is required" },
  },
  {
    name: "mama_name",
    label: "Uncle (Maternal) Name",
    type: "text",
    required: false,
    // validation: { required: "Uncle (Maternal) Name is required" },
  },
  {
    name: "kaka_name",
    label: "Uncle Name",
    type: "text",
    required: false,
    // validation: { required: "Uncle Name is required" },
  },
  {
    name: "bacha_kaka_name",
    label: "Cousin (Paternal) Name",
    type: "text",
    required: false,
    // validation: { required: "Cousin (Paternal) Name is required" },
  },
  {
    name: "bacha_mama_name",
    label: "Cousin (Maternal) Name",
    type: "text",
    required: false,
    // validation: { required: "Cousin (Maternal) Name is required" },
  },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    options: ["male", "female"],
    required: true,
    validation: { required: "Gender is required" },
  },
  {
    name: "national_id",
    label: "National ID",
    type: "text", // use "text" instead of "number" to allow dashes
    required: true,
    validation: {
      pattern: {
        value: /^[0-9-]{5,}$/, // numbers and dashes, at least 5 characters
        message: "National ID must be numeric or can include dashes (e.g. 123456 or 123-4124-2343)",
      },
    },
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    validation: {
      required: "Email is required",
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Invalid email address",
      },
    },
  },
  {
    name: "phone",
    label: "Phone",
    type: "text",
    required: true,
    validation: {
      required: "Phone is required",
      pattern: {
        value: /^\+?[0-9\s\-()]{7,}$/,
        message: "Invalid phone number",
      },
    },
  },
  {
    name: "whatsapp_phone",
    label: "Whatsapp Number",
    type: "text",
    required: true,
    validation: {
      required: "Phone is required",
      pattern: {
        value: /^\+?[0-9\s\-()]{7,}$/,
        message: "Invalid phone number",
      },
    },
  },
  {
    name: "assas_number",
    label: "Assas Number",
    type: "number",
    required: true,
    validation: {
      required: "assas number is required",
      pattern: {
        value: /^\d/,
        message: "Invalid assas number",
      },
    },
  },
  {
    name: "description",
    label: "Details",
    type: "text",
    required: false,
    validation: {
      required: "assas number is required",
    },
  },
];


export const studentFieldsGroups = [
  {
    name: "profile",
    label: "🧑🏻 Profile",
    fields: [
      {
        name: "students_profile",
        label: "Student Picture",
        type: "image",
        required: true,
        validation: { required: "Student profile is required" },
      },
      ...studentFields.filter(f =>
        ["firstname","lastname","date_of_birth","gender","join_date","nationality","mother_language",].includes(f.name)
      )
    ],
  },
  {
    name: "family_info",
    label: "👨‍👩‍👧‍👦 Family Information",
    fields: studentFields.filter(f =>
      ["father_name", "grand_father_name", "father_job", "brother_name", "brother_name2", "mama_name", "kaka_name", "bacha_kaka_name", "bacha_mama_name"].includes(f.name)
    ),
  },
  {
    name: "address_info",
    label: "📍 Address",
    fields: studentFields.filter(f =>
      ["permanent_address", "current_address"].includes(f.name)
    ),
  },
  {
    name: "contact_id",
    label: "📱 Contact & ID",
    fields: studentFields.filter(f =>
      ["phone", "whatsapp_phone", "email", "national_id", "assas_number", "description"].includes(f.name)
    ),
  },
];



export const userFieldsaksldjfla = [
  {
    name: "username",
    label: "Username",
    type: "text",
    required: true,
    validation: { required: "Username is required" },
  },
  {
    name: "firstname",
    label: "First Name",
    type: "text",
    required: true,
    validation: { required: "First name is required" },
  },
  {
    name: "father_name",
    label: "Father Name",
    type: "text",
    required: true,
  },
  {
    name: "lastname",
    label: "Last Name",
    type: "text",
    required: true,
    validation: { required: "Last name is required" },
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    validation: {
      required: "Email is required",
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Invalid email address",
      },
    },
  },
  {
    name: "phone",
    label: "Phone",
    type: "text",
    required: true,
    validation: {
      pattern: {
        value: /^\+?[0-9\s\-()]{7,}$/,
        message: "Invalid phone number",
      },
    },
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    required: true,
    validation: { required: "Password is required" },
  },
  {
    name: "passwordAgain",
    label: "Confirm Password",
    type: "password",
    required: true,
    validation: { required: "Please confirm password" },
  },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    options: ["male", "female", "other"],
    required: true,
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: ["active", "inactive", "disabled", "deleted"],
    required: true,
  },
  {
    name: "shift",
    label: "Shift",
    type: "select",
    options: ["full time", "morning", "afternoon", "evening"],
    required: true,
    validation: { required: "Shift is required" },
  },
  {
    name: "salary",
    label: "Salary",
    type: "number",
    step: "100",
    required: true,
    validation: {
      pattern: {
        value: /^\d+(\.\d{1,2})?$/,
        message: "Salary must be a valid number with up to 2 decimal places",
      },
    },
  },
  {
    name: "national_id",
    label: "National ID",
    type: "text", // use "text" instead of "number" to allow dashes
    required: true,
    validation: {
      pattern: {
        value: /^[0-9-]{5,}$/, // numbers and dashes, at least 5 characters
        message: "National ID must be numeric or can include dashes (e.g. 123456 or 123-4124-2343)",
      },
    },
  },
  // ✅ New fields
  { name: "blood_group", label: "Blood Group", type: "select", options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], required: false },
  { name: "date_of_birth", label: "Date of Birth", type: "date", required: true },
  { name: "education_major", label: "Education Major", type: "text", required: false },
  { name: "education_grade", label: "Education Grade", type: "select", options:["Under Graduated", "12th Graduated", "Bacholar", "Master", "PHD"], required: true },
  { name: "marital_status", label: "Marital Status", type: "select", options:["single", "maried", "divorced", "widowed"], required: true },
  { name: "start_contract_date", label: "Start Contract Date", type: "date", required: true },
  { name: "end_contract_date", label: "End Contract Date", type: "date", required: true },
  { name: "tax", label: "Tax", type: "number", step: "0.01", required: false },
  { name: "tin_number", label: "TIN", type: "number", step: "1", required: false },
  { name: "guarantee_money", label: "Guaranty Money", type: "number", step: "100", required: false },
  {
    name: "role_id",
    label: "Role",
    type: "select",
    options: [
      { value: 3, label: "Admin" },
      { value: 4, label: "Teacher" },
      { value: 6, label: "Committee" },
      { value: 7, label: "Reception" },
      // { value: 10, label: "Finance" },
    ],
    required: true,
    validation: { required: "Role is required" },
  },
  // ✅ Nested addresses
  {
    name: "permanent_address",
    label: "Permanent Address",
    type: "group",
    fields: [
      { name: "country", label: "Country", type: "select", options: ["Afghanistan"], required: true },
      { name: "province", label: "Province", type: "select", options: afghanistanProvinces, required: true },
      { name: "district", label: "District", type: "text", required: false },
      { name: "home_address", label: "Home Address", type: "text", required: true },
    ],
  },
  {
    name: "current_address",
    label: "Current Address",
    type: "group",
    fields: [
      { name: "country", label: "Country", type: "select", options: ["Afghanistan"], required: true },
      { name: "province", label: "Province", type: "select", options: afghanistanProvinces, required: true },
      { name: "district", label: "District", type: "text", required: false },
      { name: "home_address", label: "Home Address", type: "text", required: true },
    ],
  },

];







export const userFieldsGroup = [
  {
    name: "profile",
    label: "🧑🏻 Profile",
    fields: [
      {
        name: "profile",
        label: "Doctor Picture",
        type: "image",
        required: false,
        validation: { required: "Doctor profile is required" },
      },
      {
        name: "doctor_name",
        label: "Doctor name",
        type: "text",
        required: true,
        validation: { required: "Doctor name is required" },
      },
      {
        name: "lastname",
        label: "Lastname",
        type: "text",
        required: true,
        validation: { required: "Lastname is required" },
      },
    ],
  },
  {
    name: "personal_info",
    label: "😐 Personal Details",
    fields: [
      {
        name: "clinic_name",
        label: "Clinic name",
        type: "text",
        required: true,
        validation: { required: "Firstname is required" },
      },
      {
        name: "gender",
        label: "Gender",
        type: "select",
        required: true,
        options: ["male", "female", "other"]
      },
      {
        name: "experience_year",
        label: "Experience Year",
        type: "number",
        required: true,
      },
      {
        name: "date_of_birth",
        label: "Birth Date",
        type: "miladidate",
        required: true,
        validation: { required: "date of birth is required" },
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        required: true,
        validation: { required: "status is required" },
        options: ["active", "inactive", "deleted"],
      },
      {
        name: "calendar_type",
        label: "Calendar type",
        type: "select",
        required: true,
        validation: { required: "calendar is required" },
        options: ["shamsi", "qamari", "miladi"]
      },
      {
        name: "clinic_fee",
        label: "Clinic fee",
        type: "number",
        required: true,
        validation: { required: "clinic fee is required" },
      },
    ]
  },
  {
    name: "account_info",
    label: "🔐 Account Information",
    fields: [
      {
        name: "phone",
        label: "Phone",
        type: "text",
        required: true,
        validation: {
          pattern: {
            value: /^\+?[0-9]{7,15}$/,
            message: "Invalid phone number number should be like(0789123456)",
          },
        },
    },  
    {
      name: "email",
      label: "Email",
      type: "text",
      required: true,
      validation: {
        required: "Email is required",
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "Invalid email address",
        },
      },
    },
    {
      name: "password",
      label: "Password",
      type: "text",
      required: true,
      validation: { required: "Password is required" },
    },
    {
      name: "passwordAgain",
      label: "Repeat Password",
      type: "text",
      required: true,
      validation: { required: "Please retype your password" },
    },]
  },
];

// "monday","tuesday","wednesday","thursday","friday","saturday","sunday"
export const timingFields = [
  {
    name: "days",
    label: "📜Days",
    fields: [
      {
        name: "saturday",
        label: "Saturday",
        type: "checkbox",
      },
            {
        name: "sunday",
        label: "Sunday",
        type: "checkbox",
      },
      {
        name: "monday",
        label: "Monday",
        type: "checkbox",
      },
      {
        name: "tuesday",
        label: "Tuesday",
        type: "checkbox",
      },
      {
        name: "wednesday",
        label: "Wednesday",
        type: "checkbox",
      },
      {
        name: "thursday",
        label: "Thursday",
        type: "checkbox",
      },
      {
        name: "friday",
        label: "Friday",
        type: "checkbox",
      },    
    ]
  },
  {
    name: "time",
    label: "⌚Timing",
    fields: [
      {
        name: "in_time",
        label: "Open Time",
        type: "time",
      },
      {
        name: "out_time",
        label: "Close Time",
        type: "time",
      }
    ]
  }
]

export const specializationFields = [
  {
    name: "specializaion",
    label: "📜 About Your Experience (max: 5)",
    fields: [
      {
        name: "name",
        label: "Field",
        type: "text",
        required: true,
        validation: { required: "name is required" },
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        required: true,
        validation: { required: "status is required" },
        options: ["active", "inactive"],
      },
      {
        name: "description",
        label: "Details",
        type: "textarea",
        required: false
      },
    ]
  },
]

export const addressFields = [
  {
    name: "address",
    label: "🏠 Add Address (max: 3)",
    fields: [
      {
        name: "type",
        label: "Address Type",
        type: "select",
        required: true,
        validation: { required: "Address type is required" },
        options: ["Clinic", "Office", "Home", "Other"],
      },

      {
        name: "country",
        label: "Country",
        type: "select",
        required: true,
        validation: { required: "Country is required" },
        options: ["Afghanistan"],
      },

      {
        name: "province",
        label: "Province",
        type: "select",
        required: true,
        validation: { required: "Province is required" },
        options: [ ...afghanistanProvinces ],
      },

      {
        name: "district",
        label: "District",
        type: "text",
        required: true,
        validation: { required: "District is required" },
      },

      {
        name: "address",
        label: "Full Address",
        type: "textarea",
        required: true,
        validation: { required: "Full address is required" },
      },

      {
        name: "floor_number",
        label: "Floor Number",
        type: "number",
        required: false,
      },

      {
        name: "room_number",
        label: "Room Number",
        type: "number",
        required: false,
      },

      {
        name: "status",
        label: "Status",
        type: "select",
        required: true,
        validation: { required: "Status is required" },
        options: ["active", "inactive"],
      },
    ]
  }
];

// export const medicineFields = [
//   {
//     name: "basic_info",
//     label: "Basic Information",
//     fields: [
//       {
//         name: "name",
//         label: "Generic Name",
//         type: "text",
//         required: true,
//         placeholder: "e.g. Paracetamol",
//       },
//       {
//         name: "brand_name",
//         label: "Brand Name",
//         type: "text",
//         placeholder: "e.g. Panadol, Calpol",
//       },
//     ],
//   },

//   {
//     name: "form_details",
//     label: "Form & Medical Details",
//     fields: [
//       {
//         name: "form",
//         label: "Dosage Form",
//         type: "select",
//         required: true,
//         options: [
//           { label: "Tablet", value: "Tablet" },
//           { label: "Syrup", value: "Syrup" },
//           { label: "Capsule", value: "Capsule" },
//           { label: "Injection", value: "Injection" },
//           { label: "Cream", value: "Cream" },
//           { label: "Drops", value: "Drops" },
//           { label: "Ointment", value: "Ointment" },
//           { label: "Inhaler", value: "Inhaler" },
//           { label: "Powder", value: "Powder" },
//         ],
//       },
//       {
//         name: "strength",
//         label: "Strength / Dose",
//         type: "text",
//         placeholder: "e.g. 500mg, 5mg/5ml",
//       },
//       {
//         name: "category",
//         label: "Category",
//         type: "text",
//         placeholder: "e.g. Analgesic, Antibiotic",
//       },
//       {
//         name: "description",
//         label: "Description",
//         type: "textarea",
//         placeholder: "Short description about the medicine...",
//       },
//     ],
//   },

//   {
//     name: "safety_info",
//     label: "Safety & Warnings",
//     fields: [
//       {
//         name: "side_effects",
//         label: "Side Effects",
//         type: "textarea",
//         placeholder: "Possible side effects...",
//       },
//       {
//         name: "interactions",
//         label: "Drug Interactions",
//         type: "textarea",
//         placeholder: "Interactions with other medicines...",
//       },
//     ],
//   },
// ];



export const medicineFields = [
  {
    name: "medical_info",
    label: "Medicine Information",
    fields: [
      {
        name: "name",
        label: "Generic Name",
        type: "text",
        required: true,
        placeholder: "e.g. Paracetamol",
      },
      {
        name: "brand_name",
        label: "Brand Name",
        type: "text",
        placeholder: "e.g. Panadol, Calpol",
      },
      {
        name: "form",
        label: "Dosage Form",
        type: "select",
        required: true,
        options: [
          { label: "Tablet", value: "Tablet" },
          { label: "Syrup", value: "Syrup" },
          { label: "Capsule", value: "Capsule" },
          { label: "Injection", value: "Injection" },
          { label: "Cream", value: "Cream" },
          { label: "Drops", value: "Drops" },
          { label: "Ointment", value: "Ointment" },
          { label: "Inhaler", value: "Inhaler" },
          { label: "Powder", value: "Powder" },
        ],
      },
      {
        name: "strength",
        label: "Strength / Dose",
        type: "text",
        placeholder: "e.g. 500mg, 5mg/5ml",
      },
      {
        name: "category",
        label: "Category",
        type: "text",
        placeholder: "e.g. Analgesic, Antibiotic",
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Short description...",
      },
    ],
  },

  {
    name: "safety_info",
    label: "Safety & Warnings",
    fields: [
      {
        name: "side_effects",
        label: "Side Effects",
        type: "textarea",
        placeholder: "Possible side effects...",
      },
      {
        name: "interactions",
        label: "Drug Interactions",
        type: "textarea",
        placeholder: "Interactions with other medicines...",
      },
      {
        name: "is_common",
        label: "Most Used",
        type: "checkbox",
        placeholder: "Interactions with other medicines...",
      },
    ],
  },
];


