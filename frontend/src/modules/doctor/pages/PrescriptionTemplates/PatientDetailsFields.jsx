import React from 'react'
import SectionContainer from '../../../../componenets/SectionContainer'
import { dropdownStyle, inputStyle, labelStyle } from '../../../../styles/componentsStyle'


function Field({ label, children, className = "" }) {
  return (
    <div className={className}>
      <label className={labelStyle.primary}>{label}</label>
      <div>{children}</div>
    </div>
  );
}


export function PatientDetailsFields({ patientName, setPatientName, patientAge, setPatientAge, nextVisit, setNextVisit, patientGender, setPatientGender }) {
  return (
    <SectionContainer title="Patient Information Fields" className="bg-white print:hidden">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
        <Field label="Patient Name" className="md:col-span-2">
            <input className={inputStyle.primary} placeholder="Enter name..." value={patientName} onChange={(e) => setPatientName(e.target.value)} />
        </Field>

        <Field label="Age">
            <input className={inputStyle.primary} type="number" placeholder="Age" value={patientAge} onChange={(e) => setPatientAge(e.target.value)} />
        </Field>

        <Field label="Gender">
            <select className={dropdownStyle.base} value={patientGender} onChange={(e) => setPatientGender(e.target.value)}>
            <option value="" disabled>Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            </select>
        </Field>

        <Field label="Next Visit">
            <input className={inputStyle.primary} type="date" value={nextVisit} onChange={(e) => setNextVisit(e.target.value)} />
        </Field>
        </div>
    </SectionContainer>
  )
}
