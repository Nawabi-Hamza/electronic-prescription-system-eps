
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { JalaliDateField } from "./ShamsiDatePicker";
import ImageUpload from "./ImageUpload";
import { btnStyle, dropdownStyle, inputStyle, labelStyle, stepper } from "../styles/componentsStyle";

// helper to get nested values from defaultValues
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, key) => acc?.[key] ?? '', obj);
};

const formatDate = (value) => (!value ? "" : value.split("T")[0]);

export default function FieldsResultStepper({
  fields, // grouped fields
  register,
  handleSubmit,
  control,
  errors,
  defaultValues = {},
  trigger,
  setValue,
  isSubmitting,
}) {
  const [step, setStep] = useState(0);
  const currentGroup = fields[step];

  const renderField = (field, parentName = null) => {
    const fieldKey = parentName ? `${parentName}.${field.name}` : field.name;

    // Handle nested group
    if (field.type === "group") {
      return (
        <div key={field.name} className="flex flex-col mb-2">
          <label className={labelStyle.primary}>{field.label}</label>
          <hr className="border-1 border-slate-100 mb-4" />
          <div className="grid gap-2 grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
            {field.fields.map((subField) => renderField(subField, fieldKey))}
          </div>
        </div>
      );
    }

    // Handle image upload
    if (field.type === "image") {
      return (
        <div key={fieldKey} className="flex flex-col row-span-3 mb-4">
          <label className={labelStyle.primary}>{field.label}</label>
          <ImageUpload
            onImageSelect={(files) => setValue(fieldKey, files[0])}
            maxImages={1}
            columns={1}
            rows={1}
            aspectRatio="1/1"
            previewHeight="h-20"
            label="Upload Student Profile Picture"
            description="Click to upload a profile photo"
            className="w-full"
          />
          {errors[fieldKey] && (
            <p className="text-red-800 text-xs mt-1">⭕ {errors[fieldKey]?.message}</p>
          )}
        </div>
      );
    }

    // ✅ get default value from nested defaultValues
    let rawValue = getNestedValue(defaultValues, fieldKey);
    if (rawValue === null || rawValue === undefined) rawValue = '';
    if (field.type === "date") rawValue = formatDate(rawValue);

    return (
      <div key={fieldKey} className="flex flex-col mb-2">
        <label htmlFor={fieldKey} className={labelStyle.primary}>{field.label}</label>

        {field.type === "date" ? (
          <Controller
            name={fieldKey}
            control={control}
            defaultValue={rawValue}
            render={({ field: { onChange, value } }) => (
              <JalaliDateField value={value} onChange={onChange} />
            )}
          />
        ) : field.type === "select" && field.options ? (
          <select
            id={fieldKey}
            className={`${dropdownStyle.base} ${dropdownStyle.withIcon}`}
            defaultValue={rawValue}
            {...register(fieldKey, field.validation)}
          >
            <option value="">Select {field.label}</option>
            {field.options.map((opt, idx) =>
              typeof opt === "string" ? (
                <option key={idx} value={opt}>{opt}</option>
              ) : (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              )
            )}
          </select>
        ) : (
          <input
            id={fieldKey}
            type={field.type || "text"}
            placeholder={field.label}
            defaultValue={rawValue}
            className={inputStyle.primary}
            {...register(fieldKey, field.validation)}
          />
        )}

        {parentName ? (
          errors[parentName]?.[field.name] && (
            <p className="text-red-800 text-xs m-0 mt-1">
              ⭕ {errors[parentName][field.name]?.message}
            </p>
          )
        ) : (
          errors[field.name] && (
            <p className="text-red-800 text-xs m-0 mt-1">
              ⭕ {errors[field.name]?.message}
            </p>
          )
        )}
      </div>
    );
  };

  const handleNext = async () => {
    let fieldNames = [];
    currentGroup.fields.forEach(f => {
      if (f.type === "group") {
        f.fields.forEach(sub => fieldNames.push(`${currentGroup.name}.${sub.name}`));
      } else {
        fieldNames.push(`${currentGroup.name}.${f.name}`);
      }
    });
    const valid = await trigger(fieldNames);
    if (valid) setStep(prev => Math.min(prev + 1, fields.length - 1));
  };

  const handleBack = () => setStep(prev => Math.max(prev - 1, 0));

  return (
    <div>
      {/* Step Header */}
      <div className="flex items-center justify-center mb-4">
        {fields.map((g, idx) => (
          <div key={g.name} className="flex items-center">
            <div className={`${stepper.steps} ${idx === step ? stepper.current : idx < step ? stepper.passed : stepper.remain}`}>
              {idx + 1}
            </div>
            {idx < fields.length - 1 && <div className={`w-2 md:w-10 h-1 ${idx < step ? stepper.passed : stepper.remain} mx-2`}></div>}
          </div>
        ))}
      </div>

      {/* Group Title */}
      <h2 className={stepper.title}>{currentGroup.label}</h2>

      {/* Fields */}
      <div className="grid gap-2 grid-cols-1 lg:grid-cols-2">
        {currentGroup.fields.map(field => renderField(field, currentGroup.name))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-end gap-2 mt-4">
        {step > 0 ? (
          <button type="button" onClick={handleBack} className={btnStyle.secondary}>Back</button>
        ) : <div></div>}

        {step < fields.length - 1 ? (
          <button type="button" onClick={handleNext} className={btnStyle.filled}>Next</button>
        ) : (
          <button type="button" onClick={() => handleSubmit()} disabled={isSubmitting} className={btnStyle.filled}>
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        )}
      </div>
    </div>
  );
}







// import React, { useState } from "react";
// import { Controller } from "react-hook-form";
// import { JalaliDateField } from "./ShamsiDatePicker";
// import ImageUpload from "./ImageUpload";
// import { btnStyle, stepper } from "../styles/componentsStyle";

// const formatDate = (value) => (!value ? "" : value.split("T")[0]);

// export default function FieldsResultStepper({
//   fields, // grouped fields
//   register,
//   handleSubmit,
//   control,
//   errors,
//   inputStyle,
//   dropdownStyle,
//   labelStyle,
//   defaultValues = {},
//   trigger, // from react-hook-form
//   setValue, // for image upload
//   isSubmitting
// }) {
//   const [step, setStep] = useState(0);
//   const currentGroup = fields[step];

//   const renderField = (field, parentName = null) => {
//     const fieldKey = parentName ? `${parentName}.${field.name}` : field.name;

//     // handle nested group
//     if (field.type === "group") {
//       return (
//         <div key={field.name} className="flex flex-col mb-2">
//           <label className={labelStyle.primary}>{field.label}</label>
//           <hr className="border-1 border-slate-100 mb-4" />
//           <div className="grid gap-2 grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
//             {field.fields.map((subField) => renderField(subField, field.name))}
//           </div>
//         </div>
//       );
//     }

//     // handle image type
//     if (field.type === "image") {
//       return (
//         <div key={fieldKey} className="flex flex-col row-span-3 mb-4">
//           <label className={labelStyle.primary}>{field.label}</label>
//           <ImageUpload
//             onImageSelect={(files) => setValue(fieldKey, files[0])}
//             maxImages={1}
//             columns={1}
//             rows={1}
//             aspectRatio="1/1"
//             previewHeight="h-20"
//             label="Upload Student Profile Picture"
//             description="Click to upload a profile photo"
//             className="w-full"
//           />
//           {errors[fieldKey] && (
//             <p className="text-red-800 text-xs mt-1">⭕ {errors[fieldKey]?.message}</p>
//           )}
//         </div>
//       );
//     }

//     let rawValue = parentName
//       ? defaultValues[parentName]?.[field.name]
//       : defaultValues[field.name];

//     if (rawValue === null || rawValue === undefined) rawValue = "";
//     if (field.type === "date") rawValue = formatDate(rawValue);

//     return (
//       <div key={fieldKey} className="flex flex-col mb-2">
//         <label htmlFor={fieldKey} className={labelStyle.primary}>{field.label}</label>

//         {field.type === "date" ? (
//           <Controller
//             name={fieldKey}
//             control={control}
//             defaultValue={rawValue}
//             render={({ field: { onChange, value } }) => (
//               <JalaliDateField value={value} onChange={onChange} />
//             )}
//           />
//         ) : field.type === "select" && field.options ? (
//           <select
//             id={fieldKey}
//             className={`${dropdownStyle.base} ${dropdownStyle.withIcon}`}
//             defaultValue={rawValue}
//             {...register(fieldKey, field.validation)}
//           >
//             <option value="">Select {field.label}</option>
//             {field.options.map((opt, idx) =>
          
//               typeof opt === "string" ? (
//                 <option key={idx} value={opt}>{opt}</option>
//               ) : (
//                 <option key={opt.value} value={opt.value}>{opt.label}</option>
//               )
//             )}
//           </select>
//         ) : (
//           <input
//             id={fieldKey}
//             type={field.type || "text"}
//             placeholder={field.label}
//             defaultValue={rawValue}
//             className={inputStyle.primary}
//             {...register(fieldKey, field.validation)}
//           />
//         )}

//         {parentName ? (
//           errors[parentName]?.[field.name] && (
//             <p className="text-red-800 text-xs m-0 mt-1">
//               ⭕ {errors[parentName][field.name]?.message}
//             </p>
//           )
//         ) : (
//           errors[field.name] && (
//             <p className="text-red-800 text-xs m-0 mt-1">
//               ⭕ {errors[field.name]?.message}
//             </p>
//           )
//         )}
//       </div>
//     );
//   };

//   const handleNext = async () => {
//     // validate current step fields
//     let fieldNames = [];
//     currentGroup.fields.forEach(f => {
//       if (f.type === "group") {
//         f.fields.forEach(sub => fieldNames.push(`${currentGroup.name}.${sub.name}`));
//       } else {
//         fieldNames.push(`${currentGroup.name}.${f.name}`);
//       }
//     });

//     const valid = await trigger(fieldNames);
//     if (valid) setStep((prev) => Math.min(prev + 1, fields.length - 1));
//   };

//   const handleBack = () => setStep((prev) => Math.max(prev - 1, 0));

//   return (
//     <div>
//       {/* Step Header */}
//       <div className="flex items-center justify-center mb-4">
//         {fields.map((g, idx) => (
//           <div key={g.name} className="flex items-center">
//             <div
//               className={`${stepper.steps} ${idx === step ? stepper.current : idx < step ? stepper.passed : stepper.remain}`}
//             >
//               {idx + 1}
//             </div>
//             {idx < fields.length - 1 && <div className={`w-2 md:w-10 h-1 ${idx < step ? stepper.passed:stepper.remain} mx-2`}></div>}
//           </div>
//         ))}
//       </div>

//       {/* Group Title */}
//       <h2 className={stepper.title}>{currentGroup.label}</h2>

//       {/* Fields */}
//       <div className="grid gap-2 grid-cols-1 lg:grid-cols-2">
//         {currentGroup.fields.map((field) => renderField(field, currentGroup.name))}
//       </div>

//       {/* Navigation Buttons */}
//       <div className="flex justify-end gap-2 mt-4">
//         {step > 0 ? (
//           <button type="button" onClick={handleBack} className={btnStyle.secondary}>
//             Back
//           </button>
//         ) : <div></div>}

//         {step < fields.length - 1 ? (
//           <button type="button" onClick={handleNext} className={btnStyle.filled}>
//             Next
//           </button>
//         ) : (
//           <button
//             type="button" // <-- change to "button" to prevent auto-submit
//             onClick={() => handleSubmit()} // <-- manually call handleSubmit
//             disabled={isSubmitting}
//             className={btnStyle.filled}
//           >
//             {isSubmitting ? "Saving..." : "Save"}
//           </button>
//         )}
//       </div>

//     </div>
//   );
// }
