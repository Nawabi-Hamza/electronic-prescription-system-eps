import React from 'react'
import { mainSectionStyles } from '../../../styles/dashboardStyles'
import { ArrowBigLeftDashIcon, CircleCheck, CircleMinus, Loader } from 'lucide-react'
import { Link } from 'react-router-dom'
import { banner, tableStyles } from '../../../styles/componentsStyle'
import { useEffect } from 'react'
import { acceptVisitorAppointment, fetchVisitorsAppointment, rejectVisitorAppointment } from '../../../api/doctorAPI'
import { useState } from 'react'
import Table from '../../../componenets/Table'
import { toast } from 'react-toastify'
import { ConfirmToast } from '../../../componenets/Toaster'

function Appoinment() {

  
  return (
    <>
        <Link to="/doctor" className={banner.back}>
            <ArrowBigLeftDashIcon /> Back
        </Link>
        <h1 className='text-xl text-sky-600 font-semibold mb-4'>Appoinment Page</h1>
        <Appointments />
    </>
  )
}

export default Appoinment


function Appointments(){
  const [appointments, setAppointments] = useState([])
  useEffect(() => { fetchVisitorsAppointment({ seter: setAppointments}) }, [])
  const handleReject = (visit_id) => {
    ConfirmToast("Are your sure reject this appointment", async() => {
      try{
        const res = await rejectVisitorAppointment(visit_id)
        setAppointments( prev => prev.filter( v => v.visit_id != visit_id ))
        toast.success(res.message)
      }catch(err){
        toast.error("Error reject appointmnet")
        console.log(err)
      }
    })
  } 

  const handleAccept = async(visit_id) => {
      try{
        const res = await acceptVisitorAppointment(visit_id)
        setAppointments( prev => prev.filter( v => v.visit_id != visit_id ))
        toast.success(res.message)
      }catch(err){
        toast.error("Error accept appointmnet")
        console.log(err)
      }
  } 
  return(<>
    <Table
      columns={[
        { key: 'patient_name', label: 'Name'},
        // { key: 'phone', label: 'phone'},
        // { key: 'age', label: 'age'},
        // { key: 'description', label: 'comment',
        //    render: val =>
        //     <div class="w-32"> 
        //       <p class="truncate" title={val}>
        //         {val}
        //       </p>
        //     </div>
        // },
        // { key: 'status', label: 'status', render: val => <span className='uppercase'>{val}</span>},
        { key: 'visit_number', label: 'visit number', render: (val) => (<p className='text-center'>{val}</p>)},
      ]}
      records={appointments}
      actions={(row) => [
        {
            label: <CircleMinus size={30} />,
            className: tableStyles.dangerBtn,
            onClick: () =>  handleReject(row.visit_id),
        },
        {
            label: <CircleCheck size={30} />,
            className: tableStyles.primaryBtn,
            onClick: () =>  handleAccept(row.visit_id),
        },
      ]}
    
    />
  
  </>)
}