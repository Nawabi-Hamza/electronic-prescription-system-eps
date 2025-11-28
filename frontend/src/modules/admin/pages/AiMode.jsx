import React from 'react'
import { mainSectionStyles } from '../../../styles/dashboardStyles'
import { Loader } from 'lucide-react'

function AiMode() {
  return (
    <div className={mainSectionStyles.container}>
        <h1 className='text-2xl font-semibold'>AiMode</h1>
        <p className='flex mt-4 gap-2'><Loader /> Under contstraction...</p>
    </div>
  )
}

export default AiMode