import React from 'react'
import PaymentBanner from './PaymentBanner'
import { banner, btnStyle } from '../../../styles/componentsStyle'
import { ArrowBigLeftDashIcon, Cog } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { fetchPrescriptionHeader, getAllMedicine } from '../../../api/doctorAPI'
import { useState } from 'react'
import SimpleTemplate from './PrescriptionTemplates/SimpleTemplate'

function PrescriptionPage({ payments }) {
  const [ ph, setPh ] = useState([])
  const [ medicine, setMedicine ] = useState([])
  useEffect(() => { 
    fetchPrescriptionHeader({ seter: setPh });
    getAllMedicine({ seter: setMedicine })
 }, [])
  // console.log(medicine)
  return (<>
    <Link to="/doctor" className={banner.back}>
      <ArrowBigLeftDashIcon /> Back
    </Link>
    {!payments?.status &&  <PaymentBanner payments={payments} />}
    <div className='lg:max-w-[310mm] relative mx-auto  p-2 md:p-5'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-semibold'>Prescription Page</h1>
        <Link to="./settings" className={btnStyle.filled+" flex items-center gap-2"}><Cog /> Settings</Link>
      </div>

      <SimpleTemplate doctor={ph} medicines={medicine} />
    </div>
  </>
  )
}

export default PrescriptionPage