import React, { useEffect, useState } from "react";
import { ArrowBigLeftDashIcon, Section, SquarePen } from "lucide-react";
import { Link } from "react-router-dom";
import { badge, banner, btnStyle, dropdownStyle, gridStyle, icon, inputStyle, labelStyle } from "../../../styles/componentsStyle";
import PaymentBanner from "./PaymentBanner";
import api from "../../../api/axios";
import { fetchPrescriptionHeader } from "../../../api/doctorAPI";
import SectionContainer from "../../../componenets/SectionContainer";
import ImageUpload from "../../../componenets/ImageUpload";
import { useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import { toast } from "react-toastify";
import FieldsGroupForm from "../../../componenets/FieldsGroupForm";
import { ConfirmToast } from "../../../componenets/Toaster";
import ImageViewer from "../../../componenets/ImageViewer";
import Modal from "../../../componenets/ModalContainer";
import ProgressContainer from "../../../componenets/ProgressContainer";

function PrescriptionSettings({ payments }) {
  const [header, setHeader] = useState();

  // ▶ Load existing header on mount
  useEffect(() => { fetchPrescriptionHeader({ seter: setHeader }) }, []);

  return (
    <>
      <Link to="/doctor/prescription" className={banner.back}>
        <ArrowBigLeftDashIcon /> Back
      </Link>

      {!payments?.status ? (
        <PaymentBanner payments={payments} />
      ) : (
       header && 
      <>
        <ClientDoctument header={header} /><br />
        <DoctorDetails header={header} /><br /><br />
        {/* <PrescriptionForm header={header} /> */}
      </>
      )}
    </>
  );
}

export default PrescriptionSettings;

// -----------------------------------------------------
//   FORM USING react-hook-form
// -----------------------------------------------------

function DoctorDetails({ header }) {
  const { register, handleSubmit, control, setValue, trigger, formState: { errors, isSubmitting } } = useForm();
 
  const doctorDetails = [
      {
        name: "doctor_info",
        label: "Doctor Information",
        fields: [
          {
            name: "name_prefex",
            label: "Doctor Name Prefix",
            type: "text",
            required: true,
            placeholder: "e.g. Dr. Ahmad, Pro. Smith",
          },
          {
            name: "registration_number",
            label: "Registration Number",
            type: "text",
            required: true,
            placeholder: "e.g. 12345",
          },
          {
            name: "address_id",
            label: "Clinic Address",
            type: "select",
            required: true,
            options: header?.addresses.map( i => ({ label: i.type, value: i.id })),
            placeholder: "Select clinic address",
          },
          {
            name: "description",
            label: "Description",
            type: "text", // because you use <p> ... </p>
            placeholder: "Short clinic description...",
          },
          {
            name: "template_design",
            label: "Template Style",
            type: "select",
            required: true,
            options: [
              { label: "Simple", value: "simple" },
              { label: "Elegant", value: "elegant" },
              { label: "Modern", value: "modern" },
              { label: "Minimal", value: "minimal" },
            ],
          },
        ],
      },

    ];

  const defaultValues = {
      name_prefex: header.name_prefex || "",
      registration_number: header.registration_number || "",
      address_id: header.address_id || "",
      description: header.description || "",
    }

  // -------------------- SUBMIT HANDLER --------------------
  const onSubmit = async (data) => {
    ConfirmToast("Are you sure want to update your prescription header ?", async function(){
      try {
        const user_data = Object.entries(data).reduce((a, [k, v]) => typeof v === "object" && v !== null ? { ...a, ...v } : { ...a, [k]: v }, {});
        const res = await api.post("/doctor/prescription/header", user_data);  
        toast.success(res.data.message);
      } catch (err) {
        console.error(err);
        toast.error("Upload failed!");
      } 
    })
  };

  return (
      <FieldsGroupForm
        fields={doctorDetails}
        register={register}
        control={control}
        errors={errors}
        trigger={trigger}
        setValue={setValue}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit(onSubmit)}
        defaultValues={{ doctor_info: defaultValues }}
      />
  );
}


function PrescriptionForm({ header }) {
  const [clinicLogo, setClinicLogo] = useState(null);
  const [signatureLogo, setSignatureLogo] = useState(null);

  const headerFields = [{
      name: "media",
      label: "Logos & Signature",
      fields: [
        {
          name: "clinic_logo",
          label: "Clinic Logo",
          type: "file",
          required: false,
          accept: "image/*",
        },
        {
          name: "signature_logo",
          label: "Signature Image",
          type: "file",
          required: false,
          accept: "image/*",
        },
      ],
    }];

  const { register, handleSubmit, control, setValue, trigger, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      template_design: header?.template_design || ""
    }
  });

 

  // -------------------- SUBMIT HANDLER --------------------
  const onSubmit = async (formValues) => {

    try {

      const fd = new FormData();

      // Add text values
      Object.entries(formValues).forEach(([k, v]) => fd.append(k, v));

      // Add files (MUST NOT be undefined)
      if (clinicLogo instanceof File) {
        fd.append("clinic_logo", clinicLogo);
      }

      if (signatureLogo instanceof File) {
        fd.append("signature_logo", signatureLogo);
      }

      const res = await api.post("/doctor/prescription/header", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Saved Successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed!");
    } 
  };

  // ---------------------------------------------------------
  //          FINAL RETURN (CLEAN + FIXED PROPS)
  // ---------------------------------------------------------
  return (

      <FieldsGroupForm
        fields={headerFields}
        register={register}
        control={control}
        errors={errors}
        trigger={trigger}
        setValue={setValue}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit(onSubmit)}
        // required when editing
        defaultValues={header}
      />

  );
}


function ClientDoctument({ header }){
    const [profile, setProfile] = useState(header?.clinic_logo)
    const [signature, setSignature] = useState(header?.signature_logo)

    const [clinicLogoModal,setClinicLogoModal] = useState(false)

    return(
     <SectionContainer title='Doctor Profile' className=' md:p-4 bg-white rounded-md'>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="md:flex gap-2 items-center p-4 shadow-md shadow-slate-200 rounded mb-6 relative">
            {profile && (
              <ImageViewer
                imagePath={`/uploads/clinic_logo/${profile}`}
                altText={`doctor`}
                className="w-auto h-24 rounded-md object-cover "
                showPreview={false}
              />
              )}
    
            <div className='mt-4 md:mt-0'>
              <h2 className="text-xl font-semibold capitalize">
                Clinic Logo
              </h2>
            </div>

            <div className=' ml-auto'>
              <SquarePen className={icon.primary} onClick={() => setClinicLogoModal(true)} />
            </div>
        </div>

        <div className="md:flex gap-2 items-center p-4 shadow-md shadow-slate-200 rounded mb-6 relative">
            {signature && (
              <ImageViewer
                imagePath={`/uploads/doctor_signatures/${signature}`}
                altText={`doctor`}
                className="w-auto h-24 rounded-md object-cover "
                showPreview={false}
              />
              )}
    
            <div className='mt-4 md:mt-0'>
              <h2 className="text-xl font-semibold capitalize">
                Your Signature
              </h2>
            </div>

            <div className=' ml-auto'>
              <SquarePen className={icon.primary} onClick={() => setClinicLogoModal(true)} />
            </div>
        </div>

      </div>

        <UpdateProfilePicture profile={profile} setProfile={setProfile} isModalOpen={clinicLogoModal} closeModal={()=> setClinicLogoModal(false)} setIsProfileModal={setClinicLogoModal} />
      </SectionContainer>
    )

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

      return console.log(profilePic)
      setIsProgressOpen(true)

      const res = await confirm.updateUserProfile(profilePic, (precent) =>{
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
                imagePath={`/uploads/clinic_logo/${profile}`}
                altText={'doctor'}
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
