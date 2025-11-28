import React from "react";
import { Controller } from "react-hook-form";
import { JalaliDateField } from "./ShamsiDatePicker";

const formatDate = (value) => {
  if (!value) return "";
  return value.split("T")[0];
};

export default function FieldsResult({
  fields,
  register,
  control,       // ✅ add control from react-hook-form
  errors,
  inputStyle,
  dropdownStyle,
  labelStyle,
  defaultValues = {},
}) {
  const renderField = (field, parentName = null) => {
    const fieldKey = parentName ? `${parentName}.${field.name}` : field.name;

    if (field.type === "group") {
      return (
        <div key={field.name} className="flex md:col-span-3 xl:col-span-4 flex-col mb-2">
          <label className={labelStyle.primary}>{field.label}</label>
          <hr className="border-1 border-slate-100 mb-4" />
          <div className="grid gap-2 grid-col-2 md:grid-cols-4">
            {field.fields.map((subField) => renderField(subField, field.name))}
          </div>
        </div>
      );
    }

    let rawValue = parentName
      ? defaultValues[parentName]?.[field.name]
      : defaultValues[field.name];

    if (rawValue === null || rawValue === undefined) rawValue = "";

    if (field.type === "date") rawValue = formatDate(rawValue);

    return (
      <div key={fieldKey} className="flex flex-col mb-2">
        <label htmlFor={fieldKey} className={labelStyle.primary}>
          {field.label}
        </label>
          
        {field.type === "date" ? (
          <Controller
            name={fieldKey}
            control={control}
            defaultValue={rawValue}
            render={({ field: { onChange, value } }) => (
                <JalaliDateField
                  value={value}
                  onChange={onChange}
                  />
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
                <option key={idx} value={opt}>
                  {opt}
                </option>
              ) : (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
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

  return <>{fields.map((field) => renderField(field))}</>;
}
