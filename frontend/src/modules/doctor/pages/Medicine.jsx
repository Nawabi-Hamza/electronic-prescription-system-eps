import React, { useEffect, useMemo, useState } from 'react'
import PaymentBanner from './PaymentBanner'
import FieldsGroupForm from '../../../componenets/FieldsGroupForm'
import { medicineFields } from '../../../utils/FormFields'
import { useForm } from 'react-hook-form'
import { banner, btnStyle, inputStyle, tableStyles } from '../../../styles/componentsStyle'
import { Link } from 'react-router-dom'
import { ArrowBigLeftDashIcon, Eye, Search, Trash, UserPen, Pill, AlertTriangle, Beaker } from 'lucide-react'
import Table from '../../../componenets/Table'
import { addNewMedicine, deleteMedicine, getAllMedicine } from '../../../api/doctorAPI'
import { toast } from 'react-toastify'
import { ConfirmToast } from '../../../componenets/Toaster'
import Modal from '../../../componenets/ModalContainer'


function Medicine({ payments }) {
    const [medicine, setMedicine] = useState([])
    const [updateMedicine, setUpdateMedicine] = useState({})

  return (
    !payments?.status ?  <>
        <Link to="/doctor" className={banner.back}><ArrowBigLeftDashIcon/> Back</Link>
        <PaymentBanner payments={payments} />
    </>
    :
    <div>
      <Link to="/doctor" className={banner.back}><ArrowBigLeftDashIcon/> Back</Link>
        <div className='grid lg:grid-cols-2 gap-4'>
            <div className=' rounded-md shadow-md shadow-indigo-50 lg:max-h-[74vh] overflow-y-auto p-4'>
                <MedicineForm setMedicine={setMedicine} updateMedicine={updateMedicine} setUpdateMedicine={setUpdateMedicine} />
            </div>
            <div className='rounded-r lg:max-h-[74vh] overflow-y-auto'>
                <MedicineTable medicine={medicine} setMedicine={setMedicine} setUpdateMedicine={setUpdateMedicine} />
            </div>

        </div>
    </div>
  )
}

export default Medicine



function MedicineForm({ setMedicine, updateMedicine, setUpdateMedicine }){
    const { register, control, errors, trigger, reset, setValue, isSubmitting, handleSubmit } = useForm()

    const onSubmit = async(data) =>{
        try{
            const user_data = Object.entries(data).reduce((a, [k, v]) => typeof v === "object" && v !== null ? { ...a, ...v } : { ...a, [k]: v }, {});        
            const res = await addNewMedicine(user_data)
            setMedicine( prev => [{ ...user_data, id:res.medicine_id }, ...prev])
            reset()
            toast.success(res.message)
        }catch(err){
            console.error(err)
            toast.error(err?.response?.data?.message)
        }
    }

    const defaultValues = updateMedicine && {
        medical_info: {
            name: updateMedicine.name,
            brand_name: updateMedicine.brand_name,
            form: updateMedicine.form,
            strength: updateMedicine.strength,
            category: updateMedicine.category,
            description: updateMedicine.description,
        },
        safety_info: {
            side_effects: updateMedicine.side_effects,
            interactions: updateMedicine.interactions,
            is_common: updateMedicine.is_common
        }
    }

    const handleReset = ()=>{
        setUpdateMedicine({})
        reset()
    }

    return(<>
        
        <h1 className='font-bold text-2xl mb-3 flex items-center justify-between text-slate-600'>{updateMedicine.name ? "Update: "+updateMedicine?.name:"Add New Medicine"} <button className={btnStyle.outlined+" text-sm"} onClick={handleReset}>Reset</button></h1>
        <FieldsGroupForm
            fields={medicineFields}
            register={register}
            control={control}
            errors={errors}
            trigger={trigger}
            setValue={setValue}
            isSubmitting={isSubmitting}
            defaultValues={updateMedicine && defaultValues}
            onSubmit={handleSubmit(onSubmit)}
        />
    </>)
}


function MedicineTable({ medicine, setMedicine, setUpdateMedicine }){
    useEffect(() => { getAllMedicine({ seter: setMedicine }) }, [])
    const [searchTerm, setSearchTerm] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [details, setDetails] = useState({})

    const handleDelete = (id) => {
       ConfirmToast("Are you sure to remove this medicine",async()=>{
        try{
            await deleteMedicine(id)
            setMedicine( prev => prev.filter( p => p.id != id))
            toast.success("Medicine Removed Successfuly")
        }catch(err){
            console.log(err)
            toast.error("Error delete medicine")
        }
       })
    }


    const filteredMedicine = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return medicine?.filter((s) => 
            // s?.id?.includes(term) ||
            s?.name?.toLowerCase().includes(term) ||
            s?.category?.toLowerCase().includes(term) ||
            s?.form?.toLowerCase().includes(term) ||
            s?.brand_name?.toLowerCase().includes(term)
        )
    }, [medicine, searchTerm]);

    return(<>
        <h1 className='font-bold text-2xl mb-3 text-sky-600'>All Medicine</h1>
        <div className="relative w-full mb-2">
            <Search className={inputStyle.searchIcon} />
            <input
                type="text"
                className={inputStyle.primary}
                placeholder="Search Medicine by Name, Brand, Category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <Table 
            recordsPerPage={8}
            columns={[
                { key: "name", label: "Name" },
                { key: "form", label: "form"},
                { key: "category", label: "category"},
            ]}
            records={filteredMedicine}
            actions={(row) => [
                {
                    label: <Eye size={20} />,
                    className: tableStyles.primaryBtn,
                    onClick: () => {
                        setDetails(row)
                        setIsModalOpen(true)
                    },
                },
                {
                    label: <UserPen size={20} />,
                    className: tableStyles.primaryBtn, 
                    onClick: () =>  setUpdateMedicine(row),
                },
                {
                    label: <Trash size={20} />,
                    className: tableStyles.dangerBtn,
                    onClick: () =>  handleDelete(row.id),
                }
                
              ]}
        />
        <MedicineDetails isModalOpen={isModalOpen} handleClose={()=> setIsModalOpen(false)} medicine={details} />
    </>)
}




function MedicineDetails({ isModalOpen, handleClose, medicine }) {
  return (
    <Modal isOpen={isModalOpen} onClose={handleClose} containerStyle={"sm"} title={`Medicine: ${medicine?.name}`}>
      <div className="space-y-2">
        {/* MAIN INFO */}
        <div className="bg-sky-50 border border-sky-200 p-4 rounded shadow-sm">
          <h3 className="text-lg font-bold text-sky-700 mb-2 flex items-center gap-2">
            <Pill size={20} /> Basic Information
          </h3>
          <DetailItem label="Generic Name" value={medicine?.name} />
          <DetailItem label="Brand Name" value={medicine?.brand_name} />
          <DetailItem label="Category" value={medicine?.category} />
        </div>

        {/* FORM & DOSAGE */}
        <div className="bg-pink-50 border border-pink-200 p-4 rounded shadow-sm">
          <h3 className="text-lg font-bold text-pink-700 mb-2 flex items-center gap-2">
            <Beaker size={20} /> Form & Dosage
          </h3>
          <DetailItem label="Form" value={medicine?.form} />
          <DetailItem label="Strength" value={medicine?.strength} />
          <DetailItem label="Description" value={medicine?.description} long />
        </div>

        {/* SAFETY INFO */}
        <div className="bg-rose-50 border border-rose-200 p-4 rounded shadow-sm">
          <h3 className="text-lg font-bold text-rose-700 mb-2 flex items-center gap-2">
            <AlertTriangle size={20} /> Safety & Warnings
          </h3>
          <DetailItem label="Side Effects" value={medicine?.side_effects} long />
          <DetailItem label="Interactions" value={medicine?.interactions} long />
        </div>

      </div>
    </Modal>
  );
}

// Reusable Field
const DetailItem = ({ label, value, long }) => (
  <div className="mb-2">
    <span className="font-semibold text-gray-700">{label}: </span>
    <span className={`text-gray-800 ${long ? "block mt-1" : ""}`}>
      {value || "—"}
    </span>
  </div>
);

// export default MedicineDetails;
