import React from 'react'
import PaymentBanner from './PaymentBanner'
import { banner, btnStyle } from '../../../styles/componentsStyle'
import { ArrowBigLeftDashIcon, Cog } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { fetchPrescriptionHeader, getAllMedicine } from '../../../api/doctorAPI'
import { useState } from 'react'
import SimpleTemplate from './PrescriptionTemplates/SimpleTemplate'
import SecondaryTemplate from './PrescriptionTemplates/SecondaryTemplate'
import ModernTemplate from './PrescriptionTemplates/ModernTemplate'
import ClassicTemplate from './PrescriptionTemplates/ClassicTemplate'
import { useAuth } from '../../../hooks/useAuth'
import { offlineDB } from '../../../utils/offlineDB'
import { toast } from 'react-toastify'
// import "./PrescriptionTemplates/SimplePrescriptionA4.css"
// import "./PrescriptionTemplates/SecondaryPrescriptionA4.css"


function PrescriptionPage() {
    const [ ph, setPh ] = useState([])
    const [ medicine, setMedicine ] = useState([])
    const [templateType, setTemplateType] = useState('simple'); // default template
    const { isOffline } = useAuth()

    async function offlineMode({ setPh, setMed }){
        try{
            const cachedData = await offlineDB.getItem("medicines");
            const cachedData2 = await offlineDB.getItem("prescription_header");
            if (cachedData && cachedData2) {
              setMed(cachedData)
              setPh(cachedData2)
            }
            else{
               toast.error("Session expired. Please connect to internet and login again.");
            }
        }catch(err){
            console.log(err)
        }
    } 

    useEffect(() => { 
      if(!isOffline){
        fetchPrescriptionHeader({ seter: setPh });
        getAllMedicine({ seter: setMedicine })
      }else{
        offlineMode({ setPh: setPh, setMed: setMedicine })
      }
        const storedTemplate = localStorage.getItem('prescriptionTemplate');
        if (storedTemplate) setTemplateType(storedTemplate.toLowerCase());
    }, [isOffline])

    const renderTemplate = () => {
      switch(templateType) {
        case 'secondary': return <SecondaryTemplate doctor={ph} medicines={medicine} />;
        case 'modern': return <ModernTemplate doctor={ph} medicines={medicine} />;
        case 'classic': return <ClassicTemplate doctor={ph} medicines={medicine} />;
        case 'simple':
        default: return <SimpleTemplate doctor={ph} medicines={medicine} />;
      }
    };
  // console.log(medicine)
  return (<>
    <Link to="/doctor" className={banner.back+" print:hidden"}>
      <ArrowBigLeftDashIcon /> Back
    </Link>
    {/* {!payments?.status &&  <PaymentBanner payments={payments} />} */}
    <div className='lg:max-w-[310mm] relative mx-auto  md:p-5 '>
      <div className='flex justify-between items-center mb-4 print:hidden'>
        <h1 className='text-2xl font-semibold'>Prescription Page</h1>
        <Link to="./settings" className={btnStyle.filled+" flex items-center gap-2"}><Cog /> Settings</Link>
      </div>

      {/* <SimpleTemplate doctor={ph} medicines={medicine} /> */}
      {/* <ClassicTemplate doctor={ph} medicines={medicine} /> */}
      {renderTemplate()}
    </div>
  </>
  )
}

export default PrescriptionPage