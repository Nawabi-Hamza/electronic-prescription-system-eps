
export const afghanistanProvinces = [
  "Badakhshan", "Badghis", "Baghlan", "Bamyan", "Daykundi", "Farah", "Faryab",
  "Ghazni", "Ghor", "Helmand", "Herat", "Jowzjan", "Kabul", "Kandahar",
  "Kapisa", "Khost", "Kunar", "Kunduz", "Laghman", "Logar", "Nangarhar",
  "Nimroz", "Nuristan", "Paktia", "Paktika", "Panjshir", "Parwan", "Samangan",
  "Sar-e Pol", "Takhar", "Urozgan", "Wardak", "Zabul"
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

export const updateUserFieldsGroup = [
  {
    name: "profile",
    label: "🧑🏻 Profile",
    fields: [
      // {
      //   name: "profile",
      //   label: "Doctor Picture",
      //   type: "image",
      //   required: false, // ✅ optional on update
      // },
      {
        name: "doctor_name",
        label: "Doctor name",
        type: "text",
        required: true,
      },
      {
        name: "lastname",
        label: "Lastname",
        type: "text",
        required: true,
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
      },
      {
        name: "gender",
        label: "Gender",
        type: "select",
        options: ["male", "female", "other"],
        required: true,
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
        type: "date",
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["active", "inactive"],
        required: true,
      },
      {
        name: "calendar_type",
        label: "Calendar type",
        type: "select",
        options: ["shamsi", "qamari", "miladi"],
        required: true,
      },
      {
        name: "clinic_fee",
        label: "Clinic fee",
        type: "number",
      },
    ],
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
      },
      {
        name: "email",
        label: "Email",
        type: "text",
        required: true,
      },
    ],
  },
];


const timePattern = /^([0-1]\d|2[0-3]):([0-5]\d)$/; 

export const timingFields = ["saturday","sunday","monday","tuesday","wednesday","thursday","friday"].map(day => ({
  name: day,
  label: `${day[0].toUpperCase()}${day.slice(1)}`, // just label, you can add emoji if you want
  type: "group",
  fields: [
    {
      name: "status",
      label: "Status",
      type: "select",
      options: ["open", "close"],
      required: true,
      validation: { required: "Status is required" },
    },
    {
      name: "slot_duration",
      label: "Slot Duration (min)",
      type: "number",
      required: true, // keep true, we will handle conditional validation in react-hook-form
      min: 5,
      max: 180,
      validation: {
        required: "Slot duration is required when status is open",
        min: { value: 5, message: "Minimum 5 minutes" },
        max: { value: 180, message: "Maximum 180 minutes" },
      },
      // optional: add `dependsOn` property to hide/disable when status=close
      dependsOn: { field: "status", value: "open" },
    },
    {
      name: "in_time",
      label: "Open Time",
      type: "time",
      required: true,
      validation: {
        required: "Open time is required when status is open",
        pattern: { value: timePattern, message: "Invalid time format (HH:MM)" },
      },
      dependsOn: { field: "status", value: "open" },
    },
    {
      name: "out_time",
      label: "Close Time",
      type: "time",
      required: true,
      validation: {
        required: "Close time is required when status is open",
        pattern: { value: timePattern, message: "Invalid time format (HH:MM)" },
      },
      dependsOn: { field: "status", value: "open" },
    },
  ],
}));



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
];


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




