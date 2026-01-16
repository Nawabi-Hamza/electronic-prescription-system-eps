import React, { useEffect, useState } from "react";
import { ArrowBigLeftDashIcon, CheckCircle, Section, SquarePen } from "lucide-react";
import { Link } from "react-router-dom";
import { badge, banner, btnStyle, dropdownStyle, gridStyle, icon, inputStyle, labelStyle } from "../../../styles/componentsStyle";
import PaymentBanner from "./PaymentBanner";
import api from "../../../api/axios";
import { fetchPrescriptionHeader, getAllMedicine } from "../../../api/doctorAPI";
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
import SimpleTemplate from "./PrescriptionTemplates/SimpleTemplate";
import SecondaryTemplate from "./PrescriptionTemplates/SecondaryTemplate";

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
        <TemplateDesign header={header} /><br /><br />
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


function ClientDoctument({ header }) {
  const [profile, setProfile] = useState(header?.clinic_logo);
  const [signature, setSignature] = useState(header?.signature_logo);

  const [uploadModal, setUploadModal] = useState({
    open: false,
    type: null, // "clinic" or "signature"
  });

  return (
    <SectionContainer title="Prescription Settings" className="md:p-4 bg-white rounded-md">
      <div className="grid grid-cols-2 gap-4">

        {/* CLINIC LOGO */}
        <div className="flex flex-col md:flex-row gap-2 items-center justify-center md:justify-start p-4 shadow-md shadow-slate-200 rounded relative">
          {profile && (
            <ImageViewer
              imagePath={`/uploads/clinic_logo/${profile}`}
              altText="clinic"
              className="w-auto h-16 md:h-24 rounded-md object-cover"
              showPreview={false}
            />
          )}
          <div className="mt-4 md:mt-0">
            <h2 className="text-md text-center font-semibold capitalize">Clinic Logo</h2>
          </div>


          <div className="absolute top-2 right-2">
            <SquarePen
              className={icon.primary}
              onClick={() => setUploadModal({ open: true, type: "clinic" })}
            />
          </div>
        </div>

        {/* SIGNATURE */}
        <div className="flex flex-col md:flex-row gap-2 items-center justify-center md:justify-start p-4 shadow-md shadow-slate-200 rounded relative">
          {signature && (
            <ImageViewer
              imagePath={`/uploads/doctor_signatures/${signature}`}
              altText="signature"
              className="w-auto h-16 md:h-24 rounded-md object-cover"
              showPreview={false}
            />
          )}

          <div className="mt-4 md:mt-0">
            <h2 className="text-md text-center font-semibold capitalize">Your Signature</h2>
          </div>

          <div className="absolute top-2 right-2">
            <SquarePen
              className={icon.primary}
              onClick={() => setUploadModal({ open: true, type: "signature" })}
            />
          </div>
        </div>

      </div>

      <UpdatePrescriptionFile
        isModalOpen={uploadModal.open}
        type={uploadModal.type}
        closeModal={() => setUploadModal({ open: false, type: null })}
        setProfile={uploadModal.type === "clinic" ? setProfile : setSignature}
        currentImage={uploadModal.type === "clinic" ? profile : signature}
      />
    </SectionContainer>
  );
}


function UpdatePrescriptionFile({ isModalOpen, closeModal, type, setProfile, currentImage }) {
  const { handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const [progress, setProgress] = useState(0);
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [file, setFile] = useState(null);

  const handleSelect = (f) => setFile(f[0]);

  const onSubmit = async () => {
    if (!file) return toast.error("Please select an image");

    try {
      setIsProgressOpen(true);

      const fd = new FormData();
      const fieldName = type === "clinic" ? "clinic_logo" : "signature_logo";
      fd.append(fieldName, file);

      // Debug
      for (let [k, v] of fd.entries()) console.log("FD =", k, v);

      const endpoint =
        type === "clinic"
          ? "/doctor/prescription/header/clinic-logo"
          : "/doctor/prescription/header/signature";

      const res = await api.post(endpoint, fd, {
        headers: { "Content-Type": undefined },
        onUploadProgress: (e) =>
          setProgress(Math.round((e.loaded * 100) / e.total)),
      });

      //  console.log(res)

      toast.success("Updated successfully");
      setProfile(res.data.filename);
      reset();
      closeModal();
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally {
      setIsProgressOpen(false);
    }
  };


  return (
    <Modal
      isOpen={isModalOpen}
      containerStyle="xsm"
      onClose={closeModal}
      title={`Upload ${type === "clinic" ? "Clinic Logo" : "Signature"}`}
    >
      <ProgressContainer progress={progress} isOpen={isProgressOpen} />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={gridStyle.item2atRow}
        encType="multipart/form-data"
      >
        {currentImage && (
          <ImageViewer
            imagePath={
              type === "clinic"
                ? `/uploads/clinic_logo/${currentImage}`
                : `/uploads/doctor_signatures/${currentImage}`
            }
            className="w-auto h-auto rounded-md object-cover mr-6"
            showPreview={false}
          />
        )}

        <div>
          <label className={labelStyle.primary}>
            Upload New {type === "clinic" ? "Clinic Logo" : "Signature"}
          </label>

          <ImageUpload
            onImageSelect={handleSelect}
            maxImages={1}
            accept="image/*"
            label="Upload Image"
            className="w-full"
            aspectRatio="1/1"
          />
        </div>

        <div className="col-span-full flex justify-end mt-4">
          <button type="submit" disabled={isSubmitting} className={btnStyle.filled}>
            {isSubmitting ? "Saving..." : "Update"}
          </button>

          <button
            type="button"
            onClick={closeModal}
            className={`${btnStyle.secondary} ml-2`}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}


function TemplateDesign() {
  const [selectedTemplate, setSelectedTemplate] = useState(
    localStorage.getItem("prescriptionTemplate") || "simple"
  );

  const templates = [
    { id: "simple", name: "Simple Template", img: "/templates/simple.png" },
    { id: "secondary", name: "Secondary Template", img: "/templates/secondary.png" },
    { id: "modern", name: "Modern Template", img: "/templates/modern.png" },
  ];

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    localStorage.setItem("prescriptionTemplate", templateId);
    toast.success(`Prescription Design Changed to ${templateId}`)
  };

  return (
    <>
      {/* Template Selection Section */}
      <SectionContainer title="Select Prescription Template">
        <div className="flex gap-4 overflow-auto p-4">
          {templates.map((t) => (
            <div
              key={t.id}
              className="relative cursor-pointer min-w-[200px] border border-sky-200 rounded overflow-hidden shadow hover:scale-[102%] transition-transform"
              onClick={() => handleTemplateSelect(t.id)}
              style={{ width: "200px" }}
            >
              <img
                src={t.img}
                alt={t.name}
                className="w-full h-auto block"
              />

              {/* Overlay tick if selected */}
              {selectedTemplate === t.id && (
                <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow">
                  <CheckCircle size={20} className="text-green-500" />
                </div>
              )}

              <div className="text-center bg-gray-50 p-1 text-sm">{t.name}</div>
            </div>
          ))}
        </div>
      </SectionContainer>
    </>
  );
}
