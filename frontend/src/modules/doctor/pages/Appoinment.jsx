import React from 'react'
import { mainSectionStyles } from '../../../styles/dashboardStyles'
import { ArrowBigLeftDashIcon, Loader } from 'lucide-react'
import { Link } from 'react-router-dom'
import { banner } from '../../../styles/componentsStyle'

function Appoinment() {
  return (
    <div className={mainSectionStyles.container}>
        <Link to="/doctor" className={banner.back}>
            <ArrowBigLeftDashIcon /> Back
        </Link>
        <h1 className='text-2xl font-semibold'>Appoinment Page</h1>
        <p className='flex mt-4 gap-2'><Loader /> Under contstraction...</p>
    </div>
  )
}

export default Appoinment