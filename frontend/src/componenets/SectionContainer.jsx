import React from 'react'

function SectionContainer({ title="", children, className, keyData=99999999 }) {
  return (
  <div key={keyData} className={`w-full relative shadow rounded-md p-5 space-y-4 ${className ? className:'bg-white'}`}>
        <h2 className="text-lg font-semibold">{title}</h2>

        <div className="space-y-4">
            {children}
        </div>
    </div>
  )
}

export default SectionContainer