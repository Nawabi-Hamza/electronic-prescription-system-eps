import React from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { JalaliDateField } from "./ShamsiDatePicker";
import ImageUpload from "./ImageUpload";
import { btnStyle, dropdownStyle, inputStyle, labelStyle } from "../styles/componentsStyle";
import SectionContainer from "./SectionContainer";
// import { Select } from "react-select"
import Select from "react-select";


/**
 * FieldsGroupForm
 *
 * Props:
 * - fields (array) grouped fields (see usage above)
 * - register, control, errors, defaultValues, setValue, isSubmitting (react-hook-form)
 * - onSubmit (function) -> will be used as handleSubmit(onSubmit)
 * - inputStyle, dropdownStyle, labelStyle, btnStyle (optional styles)
 * - renderCustom? (optional) function(field, fieldKey) => JSX for custom field types
 */
export default function FieldsGroupForm({
  fields = [],
  register,
  control,
  errors = {},
  defaultValues = {},
  setValue,
  isSubmitting = false,
  onSubmit = () => {},
  renderCustom, // optional hook to render custom field types
}) {
  // helper: get nested value by path "group.field"
  const getNestedValue = (obj, path) =>
    path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);

  const formatDate = (value) => (!value ? "" : String(value).split("T")[0]);

  // resolve default value for a fieldKey like "group.name" or "name"
  const resolveDefault = (fieldKey, fieldType) => {
    let v = getNestedValue(defaultValues, fieldKey);
    if (v === undefined || v === null) return fieldType === "checkbox" ? false : "";
    if (fieldType === "date") return formatDate(v);
    return v;
  };

  // Render a single field
  const renderField = (field, parentName = null) => {
    const fieldKey = parentName ? `${parentName}.${field.name}` : field.name;
    const defaultValue = resolveDefault(fieldKey, field.type);

    // Nested group
    if (field.type === "group") {
      return (
        <div key={fieldKey} className="mb-6 p-4 bg-white rounded-lg border shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase">{field.label}</h3>
          <div className="grid grid-cols gap-4">
            {field.fields.map((sub) => renderField(sub, fieldKey))}
          </div>
        </div>
      );
    }

    // Image / file upload
    if (field.type === "image" || field.type === "file") {
      return (
        <div key={fieldKey} className="flex col-span-2 flex-col">
          <label className={labelStyle.primary}>{field.label}</label>
          <ImageUpload
            onImageSelect={(files) => {
              // if array / multiple allowed by field.multiple
              if (field.multiple) {
                setValue(fieldKey, files);
              } else {
                setValue(fieldKey, files[0] ?? null);
              }
            }}
            maxImages={field.multiple ? 5 : 1}
            columns={field.columns || 1}
            rows={field.rows || 1}
            aspectRatio={field.aspectRatio || "1/1"}
            previewHeight={field.previewHeight || "h-24"}
            label={field.label}
            description={field.description}
            className="w-full"
          />
          {getNestedError(fieldKey) && <p className="text-red-600 text-xs mt-1">⭕ {getNestedError(fieldKey)}</p>}
        </div>
      );
    }

    // Allow custom render hook
    if (renderCustom) {
      const custom = renderCustom(field, fieldKey);
      if (custom) return <div key={fieldKey}>{custom}</div>;
    }

    // Controlled components and basic input types
    // Checkbox group vs single checkbox
    if (field.type === "checkbox" && Array.isArray(field.options)) {
      // Checkbox group: multiple options stored as array of selected values
      const values = resolveDefault(fieldKey, field.type) || [];
      return (
        <div key={fieldKey} className="flex flex-col ">
          <label className={labelStyle.primary}>{field.label}</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {field.options.map((opt, idx) => {
              const optValue = typeof opt === "string" ? opt : opt.value;
              const optLabel = typeof opt === "string" ? opt : opt.label;
              return (
                <label key={optValue} className="inline-flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    defaultChecked={Array.isArray(values) ? values.includes(optValue) : false}
                    {...register(`${fieldKey}`, field.validation)}
                    value={optValue}
                  />
                  <span>{optLabel}</span>
                </label>
              );
            })}
          </div>
          {getNestedError(fieldKey) && <p className="text-red-600 text-xs mt-1">⭕ {getNestedError(fieldKey)}</p>}
        </div>
      );
    }

    // ARRAY / REPEATABLE GROUP
    // ARRAY / REPEATABLE GROUP (NOW USING RHF FIELD ARRAY)
      if (field.type === "array") {
        const fullKey = parentName ? `${parentName}.${field.name}` : field.name;

        const { fields: items, append, remove } = useFieldArray({
          control,
          name: fullKey
        });

        return (
          <div key={fullKey} className="p-4 border rounded-lg bg-white shadow-sm mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">{field.label}</h3>
              <button
                type="button"
                className="text-blue-600 text-sm"
                onClick={() => append({})}
              >
                + Add {field.label}
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, idx) => {
                const itemBase = `${fullKey}[${idx}]`;

                return (
                  <div key={item.id} className="border p-3 rounded relative bg-gray-50">
                    {/* Render sub fields using EXISTING renderField */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {field.fields.map((sub) =>
                        renderField(sub, itemBase)
                      )}
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => remove(idx)}
                      className="absolute top-2 right-2 text-red-500 text-sm"
                    >
                      ✖
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }


    // Single checkbox boolean
    if (field.type === "checkbox") {
      return (
        <div key={fieldKey} className="flex items-center gap-3">
          <input
            id={fieldKey}
            type="checkbox"
            defaultChecked={!!defaultValue}
            {...register(fieldKey, field.validation)}
            className="h-4 w-4"
          />
          <label htmlFor={fieldKey} className="text-sm">{field.label}</label>
          {getNestedError(fieldKey) && <p className="text-red-600 text-xs mt-1">⭕ {getNestedError(fieldKey)}</p>}
        </div>
      );
    }

    // Radio group
    if (field.type === "radio") {
      return (
        <div key={fieldKey} className="flex flex-col">
          <label className={labelStyle.primary}>{field.label}</label>
          <div className="flex gap-3 mt-1">
            {field.options.map((opt) => {
              const val = typeof opt === "string" ? opt : opt.value;
              const lbl = typeof opt === "string" ? opt : opt.label;
              return (
                <label key={val} className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    value={val}
                    defaultChecked={defaultValue === val}
                    {...register(fieldKey, field.validation)}
                  />
                  <span>{lbl}</span>
                </label>
              );
            })}
          </div>
          {getNestedError(fieldKey) && <p className="text-red-600 text-xs mt-1">⭕ {getNestedError(fieldKey)}</p>}
        </div>
      );
    }

    // Searchable Select (React-Select)
    if (field.type === "searchable-select") {
      return (
        <div key={fieldKey} className="flex flex-col">
          <label className={labelStyle.primary}>{field.label}</label>

          <Controller
            name={fieldKey}
            control={control}
            rules={field.validation}
            render={({ field: ctrl }) => (
              <Select
                {...ctrl}
                options={field.options}
                placeholder={field.placeholder || `Select ${field.label}`}
                isSearchable={true}
                onChange={(val) => ctrl.onChange(val?.value)}
                value={
                  field.options.find(o => o.value === ctrl.value) || null
                }
                className="react-select-container"
                classNamePrefix="react-select"
              />
            )}
          />

          {getNestedError(fieldKey) && (
            <p className="text-red-600 text-xs mt-1">
              ⭕ {getNestedError(fieldKey)}
            </p>
          )}
        </div>
      );
    }

    // Select
    if (field.type === "select") {
      return (
        <div key={fieldKey} className="flex flex-col">
          <label className={labelStyle.primary}>{field.label}</label>
          <select
            id={fieldKey}
            defaultValue={defaultValue}
            {...register(fieldKey, field.validation)}
            className={dropdownStyle.base}
          >
            <option value="">{field.placeholder || `Select ${field.label}`}</option>
            {field.options?.map((opt, i) => (
              typeof opt === "string" ? (
                <option key={i} value={opt}>{opt}</option>
              ) : (
                <option key={i} value={opt.value}>{opt.label}</option>
              )
            ))}
          </select>
          {getNestedError(fieldKey) && <p className="text-red-600 text-xs mt-1">⭕ {getNestedError(fieldKey)}</p>}
        </div>
      );
    }

    // Textarea
    if (field.type === "textarea") {
      return (
        <div key={fieldKey} className="flex flex-col">
          <label className={labelStyle.primary}>{field.label}</label>
          <textarea
            defaultValue={defaultValue}
            placeholder={field.placeholder}
            {...register(fieldKey, field.validation)}
            className={inputStyle.primary + " min-h-[84px] resize-y"}
          />
          {getNestedError(fieldKey) && <p className="text-red-600 text-xs mt-1">⭕ {getNestedError(fieldKey)}</p>}
        </div>
      );
    }

    // Date / time / datetime controlled via Controller (JalaliDateField used for date)
    if (field.type === "date") {
      return (
        <div key={fieldKey} className="flex flex-col">
          <label className={labelStyle.primary}>{field.label}</label>
          <Controller
            name={fieldKey}
            control={control}
            defaultValue={defaultValue}
            render={({ field: { onChange, value } }) => (
              <JalaliDateField value={value} onChange={onChange} />
            )}
          />
          {getNestedError(fieldKey) && <p className="text-red-600 text-xs mt-1">⭕ {getNestedError(fieldKey)}</p>}
        </div>
      );
    }

    if (field.type === "miladidate") {
      return (
        <div key={fieldKey} className="flex flex-col">
          <label className={labelStyle.primary}>{field.label}</label>
          <input
            type={"date"}
            defaultValue={defaultValue}
            {...register(fieldKey, field.validation)}
            className={inputStyle.primary}
          />
          {getNestedError(fieldKey) && <p className="text-red-600 text-xs mt-1">⭕ {getNestedError(fieldKey)}</p>}
        </div>
      );
    }

    if (field.type === "time" || field.type === "datetime-local") {
      return (
        <div key={fieldKey} className="flex flex-col">
          <label className={labelStyle.primary}>{field.label}</label>
          <input
            type={field.type}
            defaultValue={defaultValue}
            {...register(fieldKey, field.validation)}
            className={inputStyle.primary}
          />
          {getNestedError(fieldKey) && <p className="text-red-600 text-xs mt-1">⭕ {getNestedError(fieldKey)}</p>}
        </div>
      );
    }

    // Default input types: text, number, email, password, tel, url
    return (
      <div key={fieldKey} className="flex flex-col">
        <label className={labelStyle.primary}>{field.label}</label>
        <input
          id={fieldKey}
          type={field.type || "text"}
          placeholder={field.placeholder || field.label}
          defaultValue={defaultValue}
          {...register(fieldKey, field.validation)}
          className={inputStyle.primary}
        />
        {getNestedError(fieldKey) && <p className="text-red-600 text-xs mt-1">⭕ {getNestedError(fieldKey)}</p>}
      </div>
    );
  };

  // Helper to read nested error message (supports dot paths)
  const getNestedError = (fieldKey) => {
    const parts = fieldKey.split(".");
    let cur = errors;
    for (const p of parts) {
      if (!cur) return undefined;
      cur = cur[p];
    }
    // try message if it's an object like { message: '...' } or nested
    return cur?.message ?? (typeof cur === "string" ? cur : undefined);
  };

  // Render groups as cards
  return (
    <form onSubmit={(e)=>{
      e.preventDefault()
      onSubmit()
    }}>
      <div className="space-y-6">
        {fields.map((group) => (
          <SectionContainer key={group.name} title={group.label}>
            <header className="mb-4 flex items-center justify-between">
              {/* <h2 className="text-base font-bold text-gray-700 uppercase tracking-wide">{group.label}</h2> */}
              {group.description && <p className="text-sm text-gray-500">{group.description}</p>}
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
              {group.fields.map((f) => renderField(f, group.name))}
            </div>
          </SectionContainer>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="submit"
          // onClick={() => onSubmit()} // parent should call handleSubmit(...) wrapper
          disabled={isSubmitting}
          className={btnStyle.filled || "bg-sky-600 text-white px-4 py-2 rounded"}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
