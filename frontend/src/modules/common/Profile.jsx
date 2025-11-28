import ImageViewer from '../../componenets/ImageViewer';
import { Eye, EyeOff, KeyIcon, KeyRoundIcon, SquarePen } from 'lucide-react';
import { btnStyle, gridStyle, icon, inputStyle, labelStyle } from '../../styles/componentsStyle';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import Modal from '../../componenets/ModalContainer';
import { updateUserPassword, updateUserProfile } from '../../api/me';
import ImageUpload from '../../componenets/ImageUpload';
import ProgressContainer from '../../componenets/ProgressContainer';
import { useAuth } from '../../hooks/useAuth';

const Profile = ({ title }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(user?.photo)
  const [isPasswordModal,setIsPasswordModal] = useState(false)
  const [isProfileModal,setIsProfileModal] = useState(false)

  if (!user) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <div className='md:p-4 rounded-md'>
        <h1 className="text-3xl font-meduim mb-6">{title}</h1>
        <div className="md:flex items-center mb-6 relative">
            {user.photo ? (
              <ImageViewer
                imagePath={`/uploads/profiles/${profile}`}
                altText={`${user.full_name}`}
                className="w-auto h-24 rounded-md object-cover mr-6"
                showPreview={false}
              />
              ) : (
              <div className="w-24 h-24 rounded-md bg-gray-300 flex items-center justify-center mr-6 text-2xl font-bold text-gray-700">
                {user.full_name}
              </div>
            )}
            
          <div className='mt-4 md:mt-0'>
            <h2 className="text-xl font-semibold capitalize">
              {user.full_name}
            </h2>
            <p className="text-gray-600">{user.role.toUpperCase()}</p>
            <p className="text-gray-600">{user.branch}</p>
          </div>

          <div className='absolute top-0 right-0 flex space-x-2'>
              <SquarePen className={icon.primary} onClick={() => setIsProfileModal(true)} />
              <KeyRoundIcon className={icon.danger} onClick={() => setIsPasswordModal(true)} />
            </div>
        </div>
          <hr className='border-sky-500' />
        <div className="flex flex-col">
          <div className='w-full sm:w-1/2 md:w-1/3 p-4'>
            <h3 className="font-semibold">Username</h3>
            <p>{user.full_name}</p>
          </div>

          <div className="w-full sm:w-1/2 md:w-1/3 p-4">
            <h3 className="font-semibold">Email</h3>
            <p>{user.email}</p>
          </div>

          <div className="w-full sm:w-1/2 md:w-1/3 p-4">
            <h3 className="font-semibold">Phone</h3>
            <p>{user.phone}</p>
          </div>

          <div className="w-full sm:w-1/2 md:w-1/3 p-4">
            <h3 className="font-semibold">Status</h3>
            <p className={`font-semibold capitalize ${user.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
              {user.status}
            </p>
          </div>
        </div>
      </div>
      <PasswordModal isModalOpen={isPasswordModal} closeModal={()=> setIsPasswordModal(false)} setIsPasswordModal={setIsPasswordModal} />
      <UpdateProfilePicture profile={profile} setProfile={setProfile} isModalOpen={isProfileModal} closeModal={()=> setIsProfileModal(false)} setIsProfileModal={setIsProfileModal} />
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
    if(!profilePic) toast.error("Please select your new profile!")      
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