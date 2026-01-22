import ImageViewer from '../../../componenets/ImageViewer';
import { ArrowBigLeftDashIcon, Bean, Eye, EyeOff, KeyIcon, KeyRoundIcon, PenBox, Recycle, SquarePen, Trash, Trash2 } from 'lucide-react';
import { badge, banner, btnStyle, gridStyle, icon, inputStyle, labelStyle } from '../../../styles/componentsStyle';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import Modal from '../../../componenets/ModalContainer';
import { addAddress, addSpecialization, deleteAddress, deleteSpecialization, getDetails, updateDoctorTiming, updateUserPassword, updateUserProfile } from '../../../api/me';
import ImageUpload from '../../../componenets/ImageUpload';
import ProgressContainer from '../../../componenets/ProgressContainer';
import { useAuth } from '../../../hooks/useAuth';
import SectionContainer from '../../../componenets/SectionContainer';
import { Link } from 'react-router-dom';
import { FormatLastLogin, FormatTimeHHMM, FormatToAmPm } from '../../../componenets/Date&Time';
import FieldsGroupForm from '../../../componenets/FieldsGroupForm';
import { addressFields, specializationFields, timingFields } from '../../../utils/FormFields';
import { ConfirmToast } from '../../../componenets/Toaster';

const Profile = () => {
  const { user } = useAuth();
  const [data, setData] = useState([])



  useEffect(()=>{ getDetails({ seter: setData }) }, [])


  if (!user) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <Link to="/doctor" className={banner.back}><ArrowBigLeftDashIcon/> Back</Link>
      <div className='space-y-4'>
        <ClientProfile user={user} />
        {data?.available_days && <ClientAvailableTime available_days={data.available_days} />}
        {data?.specializations && <ClientSpecializations specializations={data.specializations} />}
        {data?.addresses && <ClientAddresses addresses={data.addresses} /> }
        
      </div>

    </>
  );
};

export default Profile;

function PasswordModal({ isModalOpen, closeModal, setIsPasswordModal }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const [showPassword,setShowPassword] = useState({
    prevPassword: false,
    newPassword: false,
    repeatPassword: false
  })
  
  const onSubmit = async (data) => {
    try {
       const re = await updateUserPassword(data);
      toast.success(re.message);
      reset();
      setIsPasswordModal(false);
    } catch (err) {
      if (err?.response?.status === 400) toast.error(err?.response?.data?.message);
      else toast.error(err?.response?.data?.message);
    }
  };

  return (
    <Modal isOpen={isModalOpen} containerStyle="xsm" onClose={closeModal} title="New Password">
      <form onSubmit={handleSubmit(onSubmit)} className={gridStyle}>

        <div>
          <label className={labelStyle.primary}>Current Password</label>
          <div className="relative">
            <input
              {...register('currentPassowrd', { required: 'Current Password is required' })}
              type={showPassword.prevPassword ? 'text' : 'password'}
              className={`${inputStyle.primary} pr-10`} // add padding so icon doesn’t overlap
            />
            <button
              type="button"
              onClick={() => setShowPassword({ prevPassword: !showPassword.prevPassword, newPassword: showPassword.newPassword, repeatPassword: showPassword.repeatPassword })}
              className="absolute right-2 cursor-pointer top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword.prevPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.currentPassowrd && <p className={inputStyle.fieldError}>{errors.currentPassowrd.message}</p>}
        </div>

        <div>
          <label className={labelStyle.primary}>New Password</label>
          <div className="relative">
            <input
              {...register('newPassword', { required: 'New Password is required' })}
              type={showPassword.newPassword ? 'text' : 'password'}
              className={`${inputStyle.primary} pr-10`} // add padding so icon doesn’t overlap
            />
            <button
              type="button"
              onClick={() => setShowPassword({ prevPassword: showPassword.prevPassword, newPassword: !showPassword.newPassword, repeatPassword: showPassword.repeatPassword })}
              className="absolute right-2 cursor-pointer top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword.newPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.newPassword && <p className={inputStyle.fieldError}>{errors.newPassword.message}</p>}
        </div>

        <div>
          <label className={labelStyle.primary}>Retype Password</label>
          <div className="relative">
            <input
              {...register('repeatPassword', { required: 'Enter New Password again' })}
              type={showPassword.repeatPassword ? 'text' : 'password'}
              className={`${inputStyle.primary} pr-10`} // add padding so icon doesn’t overlap
            />
            <button
              type="button"
              onClick={() => setShowPassword({ prevPassword: showPassword.prevPassword, newPassword: showPassword.newPassword, repeatPassword: !showPassword.repeatPassword })}
              className="absolute right-2 cursor-pointer top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword.repeatPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.repeatPassword && <p className={inputStyle.fieldError}>{errors.repeatPassword.message}</p>}
        </div>
        {/* Submit */}
        <div className="col-span-full flex justify-end mt-4">
          <button type="submit" disabled={isSubmitting} className={btnStyle.filled}>
            {isSubmitting ? "Saving..." : "Update"}
          </button>
          <button type="button" onClick={closeModal} className={`${btnStyle.secondary} ml-2`} disabled={isSubmitting}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}       

function UpdateProfilePicture({ isModalOpen, closeModal, setIsProfileModal, setProfile, profile }) {
  const { handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const [progress,setProgress] = useState(0)
  const [isProgressOpen,setIsProgressOpen] = useState(false)
  const [profilePic, setProfilePic] = useState(null);

  const handleProfileSelect = (file) => {
    setProfilePic(file[0]); // single file
  };
  
  const onSubmit = async () => {
    if(!profilePic) throw toast.error("Please select your new profile!")      
    try {
      setIsProgressOpen(true)
      const res = await updateUserProfile(profilePic, (precent) =>{
        setProgress(precent)
      });
      setIsProgressOpen(false)
      toast.success(res.message);
      setProfile(res.photo)
      reset();
      setIsProfileModal(false);
    } catch (err) {
      if (err?.response?.status === 400) toast.error(err?.response?.data?.message);
      else toast.error(err?.response?.data?.message);
    }finally{
      setIsProgressOpen(false)
    }
  };

  return (
    <Modal isOpen={isModalOpen} containerStyle="xsm" onClose={closeModal} title="Upload New Profile">
      <ProgressContainer progress={progress} isOpen={isProgressOpen}/>
      <form onSubmit={handleSubmit(onSubmit)} className={gridStyle.item2atRow}>
        
        {profile && (
              <ImageViewer
                imagePath={`/uploads/profiles/${profile}`}
                altText={'User profile'}
                className="w-auto h-auto rounded-md object-cover mr-6"
                showPreview={false}
              />
              )
        }
        <div >
          <label className={labelStyle.primary}>New Profile Picture</label>
          <ImageUpload
            onImageSelect={handleProfileSelect}
            maxImages={1}
            columns={1}
            rows={1}
            accept="image/*"
            aspectRatio="1/1"
            label="Upload Profile Picture"
            description="Click to upload a profile picture"
            className="w-full"
          />
        </div>

        {/* Submit */}
        <div className="col-span-full flex justify-end mt-4">
          <button type="submit" disabled={isSubmitting} className={btnStyle.filled}>
            {isSubmitting ? "Saving..." : "Update"}
          </button>
          <button type="button" onClick={closeModal} className={`${btnStyle.secondary} ml-2`} disabled={isSubmitting}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}



function ClientProfile({ user }){
    const [profile, setProfile] = useState(user?.photo)
    const [isPasswordModal,setIsPasswordModal] = useState(false)
    const [isProfileModal,setIsProfileModal] = useState(false)

    return(
     <SectionContainer title='Doctor Profile' className=' md:p-4 bg-white rounded-md'>
        <div className="flex items-center relative">
            {user.photo ? (
              <ImageViewer
                imagePath={`/uploads/profiles/${profile}`}
                altText={`${user.full_name}`}
                className="w-auto h-24 rounded-md object-cover mr-2"
                showPreview={false}
              />
              ) : (
              <div className="w-24 h-24 rounded-md bg-gray-300 flex items-center justify-center mr-6 text-2xl font-bold text-gray-700">
                {user.full_name}
              </div>
            )}
            
          <div className='border-l border-sky-500 ps-3'>
            <h2 className="text-xl font-semibold capitalize">
              {user.full_name}
            </h2>
            <p className="text-gray-600">{user.role.toUpperCase()}</p>
            <p className="text-gray-600">{user.generated_id}</p>
          </div>

          <div className='absolute top-0 right-0 flex space-x-2'>
              <SquarePen className={icon.primary} onClick={() => setIsProfileModal(true)} />
              <KeyRoundIcon className={icon.danger} onClick={() => setIsPasswordModal(true)} />
            </div>
        </div>
        <hr className='border-sky-500' />   
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 flex-wrap gap-2 ">
          <div className='bg-gray-50 p-3 md:p-4'>
            <h3 className="text-slate-600">Username</h3>
            <p>{user.full_name}</p>
          </div>
          <div className='bg-gray-50 p-3 md:p-4'>
            <h3 className="text-slate-600">Clinic Name</h3>
            <p>{user.clinic_name}</p>
          </div>
          <div className='bg-gray-50 p-3 md:p-4'>
            <h3 className="text-slate-600">Clinic Fee</h3>
            <p>{user.clinic_fee}AF</p>
          </div>

          <div className="bg-gray-50 p-3 md:p-4">
            <h3 className="text-slate-600">Email</h3>
            <p className='break-all'>{user.email}</p>
          </div>

          <div className="bg-gray-50 p-3 md:p-4">
            <h3 className="text-slate-600">Phone</h3>
            <p>{user.phone}</p>
          </div>
          <div className="bg-gray-50 p-3 md:p-4">
            <h3 className="text-slate-600">Calendar Type</h3>
            <p className='uppercase'>{user.calendar_type}</p>
          </div>

          <div className="bg-gray-50 p-3 md:p-4">
            <h3 className="text-slate-600">Join Date</h3>
            <p className='text-red-300'>{(user?.join_date)?.split('T')[0]}</p>
          </div>

          <div className="bg-gray-50 p-3 md:p-4">
            <h3 className="text-slate-600">Status</h3>
            <p className={`font-semibold capitalize ${user.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
              {user.status}
            </p>
          </div>
        </div>
        <PasswordModal isModalOpen={isPasswordModal} closeModal={()=> setIsPasswordModal(false)} setIsPasswordModal={setIsPasswordModal} />
        <UpdateProfilePicture profile={profile} setProfile={setProfile} isModalOpen={isProfileModal} closeModal={()=> setIsProfileModal(false)} setIsProfileModal={setIsProfileModal} />
      </SectionContainer>
    )

}

function ClientSpecializations({ specializations }){
    const [isModalOpen,setIsModalOpen] = useState(false)
    const [sp, setSp] = useState(specializations || [])
    return(
    <SectionContainer title='Specialization'>
        <PenBox className={`${icon.primary} absolute top-4 right-4`} onClick={()=> setIsModalOpen(true)} />
        {sp.map((sp, i) => (
            <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-gray-800">{sp.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${sp.status === "active" ? badge.successSm : badge.dangerSm}`}>
                        {sp.status}
                    </span>
                </div>
                <p className="text-sm text-gray-600">{sp.description}</p>
            </div>
        ))}
        <UpdateSpecialization isModalOpen={isModalOpen} closeModal={()=> setIsModalOpen(false)} sp={sp} setSp={setSp} />
    </SectionContainer>)
}

function UpdateSpecialization({ isModalOpen, closeModal, sp, setSp }){
    const { register, handleSubmit, control, reset, trigger, setValue, formState: { errors, isSubmitting } } = useForm();
    const [spUpdate,setSpUpdate] =  useState({})
    const [updateId,setUpdateId] = useState(null)
    // console.log(spUpdate)
    const onSubmit = async(data)=>{
        try{
            const user_data = Object.entries(data).reduce((a, [k, v]) => typeof v === "object" && v !== null ? { ...a, ...v } : { ...a, [k]: v }, {});        
            if(updateId){
                // const res = await updateDoctorTiming(user_data)
                // toast.success(res.message)
                // setSp()
            }else{
                const res = await addSpecialization(user_data)
                setSp( prev => [...prev, { ...user_data, id: res.insertedId }])
                toast.success(res.message)
            }
            reset()
            closeModal()
        }catch(err){
            console.error("❌ Student submission failed:", err);
            toast.error(err?.response?.data?.message || err || "Something went wrong");
        }
    }

    const handleDeleteRecord = async (id) => {
        ConfirmToast("Are you sure want to delete this record!",async()=>{
            try {
                const res = await deleteSpecialization(id);
                toast.success(res.message || "Deleted successfully");
                setSp( prev => prev.filter( p => p.id != id))
    
            } catch (error) {
                toast.error(
                error.response?.data?.message || "Failed to delete specialization"
                );
            }
        })
    };


    const defaultValues = spUpdate && {
        specializaion: {
            name: spUpdate.name,
            description: spUpdate.description,
            status: spUpdate.status,
        },
    }
    return(
        <Modal isOpen={isModalOpen} containerStyle="md" onClose={closeModal} title="Modify Specialization">
            <SectionContainer title='Your Specialization'>
                {sp?.map((spi, i) => (
                    <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-sm font-bold text-gray-800">{spi.name} <span className={`${spi.status === "active" ? badge.successSm : badge.dangerSm}`}>{spi.status}</span></p>
                            <div className='flex gap-2'>
                                {/* <span className={icon.primary} >
                                    <PenBox onClick={() => setSpUpdate(spi)} />
                                </span> */}
                                <span className={icon.danger} >
                                    <Trash2 onClick={() => handleDeleteRecord(spi.id) } />
                                </span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600">{spi.description}</p>
                    </div>
                ))}
            </SectionContainer>
            <br />
            {sp.length < 5 && 
                <FieldsGroupForm
                    fields={specializationFields}
                    register={register}
                    control={control}
                    errors={errors}
                    trigger={trigger}
                    setValue={setValue}
                    isSubmitting={isSubmitting}
                    defaultValues={sp && defaultValues}
                    onSubmit={handleSubmit(onSubmit)}
                />
            }
        </Modal>
    )
}

function ClientAvailableTime({ available_days }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timing, setTiming] = useState(
    available_days.reduce((acc, day) => {
      acc[day.day_of_week] = day;
      return acc;
    }, {})
  );
  const [selectedDay, setSelectedDay] = useState(null);

  const daysOrder = [
    { key: "saturday", label: "Saturday", emoji: "👋🏻" },
    { key: "sunday", label: "Sunday", emoji: "🌞" },
    { key: "monday", label: "Monday", emoji: "🌙" },
    { key: "tuesday", label: "Tuesday", emoji: "🔥" },
    { key: "wednesday", label: "Wednesday", emoji: "💧" },
    { key: "thursday", label: "Thursday", emoji: "⚡" },
    { key: "friday", label: "Friday", emoji: "🎉" },
  ];

  return (
    <SectionContainer title="Available Days">
      {/* <PenBox
        className={`${icon.primary} absolute top-4 right-4 cursor-pointer`}
        onClick={() => setIsModalOpen(true)}
      /> */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {daysOrder.map(({ key, label, emoji }) => {
          const dayData = timing[key];
          // if (!dayData) return null;

          return (
            <div
              key={key}
              className={`relative p-4 rounded-md shadow-md ${dayData?.status === "open" ? "bg-sky-50  shadow-sky-200":"bg-red-50  shadow-red-200"} `}
            >
              <PenBox
                className={`${icon.primary} absolute top-4 right-4 cursor-pointer`}
                onClick={() => {
                  setIsModalOpen(true) 
                  // console.log(key)
                  setSelectedDay(key);

                }}  
              />

              <span className="text-lg font-semibold">
                {emoji} {label}
              </span>
              {dayData && dayData.status === "open" ?
                <div className="mt-2 space-y-1 text-gray-700 text-sm">
                  <div>
                    <strong>Open Time:</strong> {FormatToAmPm(dayData.in_time) || "--"}
                  </div>
                  <div>
                    <strong>Close Time:</strong> {FormatToAmPm(dayData.out_time) || "--"}
                  </div>
                  <div>
                    <strong>Visit Duration:</strong> {dayData.slot_duration} min
                  </div>
                </div>
                :
                <div className="mt-2 text-center font-bold  text-red-700 text-lg">
                  Closed
                </div>
              }
            </div>
          );
        })}
      </div>

      <UpdateAvailabelTime
          isModalOpen={isModalOpen}
          closeModal={() => {
            setSelectedDay(null);
            setIsModalOpen(false);
          }}
          dayKey={selectedDay}
          dayData={selectedDay ? timing[selectedDay] : null}
          setTiming={setTiming}
        />
    </SectionContainer>
  );
}



function UpdateAvailabelTime({ isModalOpen, closeModal, dayKey, dayData, setTiming }){

    const { register, handleSubmit, control, trigger, setValue, formState: { errors, isSubmitting } } = useForm();
    
    const onSubmit = async (data) => {
        try {
          const updatedDay = data[dayKey];
          const payload = { day_of_week: dayKey, ...updatedDay };
          const res = await updateDoctorTiming(payload);
          toast.success(res.message);
          setTiming(prev => ({
            ...prev,
            [dayKey]: payload,
          }));

          closeModal();
        } catch (err) {
          if (err.status == 400 ) toast.error(err.response.data.error)
          else toast.error("Something went wrong");
        }
      };


    const defaultValues = dayKey
      ? {
          [dayKey]: {
            status: dayData?.status || "open",
            in_time: dayData?.in_time || "",
            out_time: dayData?.out_time || "",
            slot_duration: dayData?.slot_duration || 30,
          },
        }
      : {};

    const singleDayFields = timingFields.filter(field => field.name === dayKey);

    return(
        <Modal isOpen={isModalOpen} containerStyle="sm" onClose={closeModal} title={`📅 Update ${dayKey}`}>
          <FieldsGroupForm
            fields={singleDayFields}
            register={register}
            control={control}
            errors={errors}
            trigger={trigger}
            setValue={setValue}
            isSubmitting={isSubmitting}
            defaultValues={defaultValues}
            onSubmit={handleSubmit(onSubmit)}
          />
        </Modal>
    )
}

function ClientAddresses({ addresses }){
    const [isModalOpen,setIsModalOpen] = useState(false)
    const [address, setAddress] = useState(addresses || [])
    
    return(
    <SectionContainer title='Addresses'>
        <PenBox className={`${icon.primary} absolute top-4 right-4`} onClick={()=> setIsModalOpen(true)} />

        {address.map((add, i) => (
            <div
            key={i}
            className="bg-gray-50 p-4 rounded-lg border border-gray-200"
            >
            <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold uppercase text-gray-700">
                📍 {add.type}
                </span>
            </div>

            <div className="text-sm text-gray-700 space-y-1">
                <div className="capitalize">
                {add.country} / {add.province} / {add.district} / {add.address}
                </div>

                {(add.floor_number || add.room_number) && (
                <div className='space-x-3'>
                    <span>
                        Floor:{" "}{add.floor_number}
                    </span>
                    <span>
                        Room:{" "}{add.room_number}
                    </span>
                </div>
                )}
            </div>
            </div>
        ))}
        <UpdateAddress isModalOpen={isModalOpen} closeModal={()=> setIsModalOpen(false)} address={address} setAddress={setAddress} />
    </SectionContainer>)
}

function UpdateAddress({ isModalOpen, closeModal, address, setAddress }){
    const { register, handleSubmit, control, reset, trigger, setValue, formState: { errors, isSubmitting } } = useForm();
    // const [spUpdate,setSpUpdate] = useState({})
    const [updateId,setUpdateId] = useState(null)
    // console.log(spUpdate)
    const onSubmit = async(data)=>{
        try{
            const user_data = Object.entries(data).reduce((a, [k, v]) => typeof v === "object" && v !== null ? { ...a, ...v } : { ...a, [k]: v }, {});        
            if(updateId){
                // const res = await updateDoctorTiming(user_data)
                // toast.success(res.message)
                // setSp()
            }
            else{
                const res = await addAddress(user_data)
                setAddress( prev => [...prev, { ...user_data, id: res.insertedId }])
                toast.success(res.message)
            }
            reset()
            closeModal()
        }catch(err){
            console.error("❌ Student submission failed:", err);
            toast.error(err?.response?.data?.message || err || "Something went wrong");
        }
    }

    const handleDeleteRecord = async (id) => {
        ConfirmToast("Are you sure want to delete this record!",async()=>{
            try {
                const res = await deleteAddress(id);
                toast.success(res.message || "Deleted successfully");
                setAddress( prev => prev.filter( p => p.id != id))
    
            } catch (error) {
                toast.error(
                error.response?.data?.message || "Failed to delete specialization"
                );
            }
        })
    };


    const defaultValues = address && {
        // specializaion: {
        //     name: spUpdate.name,
        //     description: spUpdate.description,
        //     status: spUpdate.status,
        // },
    }
    return(
        <Modal isOpen={isModalOpen} containerStyle="md" onClose={closeModal} title="Modify Addresses">
            <SectionContainer title='Your Location'>
                {address && address.map((add, i) => (
                    <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-sm font-semibold uppercase text-gray-700">
                            📍 {add.type}
                            </span>
                        <span className={icon.danger} >
                            <Trash2 onClick={() => handleDeleteRecord(add.id) } />
                        </span>
                        </div>

                        <div className="text-sm text-gray-700 space-y-1">
                            <div className="capitalize">
                            {add.country} / {add.province} / {add.district} / {add.address}
                            </div>

                            {(add.floor_number || add.room_number) && (
                            <div className='space-x-3'>
                                <span>
                                    Floor:{" "}{add.floor_number}
                                </span>
                                <span>
                                    Room:{" "}{add.room_number}
                                </span>
                            </div>
                            )}
                        </div>
                    </div>
                ))}
            </SectionContainer>
            <br />
            {address.length < 3 && 
                <FieldsGroupForm
                    fields={addressFields}
                    register={register}
                    control={control}
                    errors={errors}
                    trigger={trigger}
                    setValue={setValue}
                    isSubmitting={isSubmitting}
                    defaultValues={address && defaultValues}
                    onSubmit={handleSubmit(onSubmit)}
                />
            }
        </Modal>
    )
}