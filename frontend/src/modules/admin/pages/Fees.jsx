import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Modal from "../../../componenets/ModalContainer";
import { btnStyle, divStyle, gridStyle, inputStyle, labelStyle, cardStyle, flexStyle, badge } from "../../../styles/componentsStyle";
import { fetchFees, createFee, updateFee, deleteFee } from "../../../api/adminAPI"; // your API functions
import { Pen, Trash2 } from "lucide-react";
import { ConfirmToast } from "../../../componenets/Toaster";

const Fees = () => {
  const [fees, setFees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState(null); // store fee when editing
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    fetchFees({ seter: setFees });
  }, []);

  const filteredFees = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return fees.filter(fee => 
      `${fee.class} ${fee.fee}`.toLowerCase().includes(term)
    );
  }, [fees, searchTerm]);

  const closeModal = () => {
    reset();
    setEditingFee(null);
    setIsModalOpen(false);
  };
  const handleModal = ()=>{
    setEditingFee(null)
    reset({
      class_name: '',
      fee: '',
    })
    setIsModalOpen(true)
  }

  const onSubmit = async (data) => {
    try {
      if(editingFee) {
        const updated = await updateFee(editingFee.id, data);
        setFees(prev => prev.map(f => f.id == editingFee.id ? {...f, ...updated} : f));
        toast.success("Fee updated successfully");
      } else {
        const newFee = await createFee(data);
        setFees(prev => [{ class: newFee.class_name, ...newFee}, ...prev]);
        toast.success("Fee created successfully");
      }
      closeModal();
    } catch(err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleEdit = (fee) => {
    setEditingFee(fee);
    reset({
      class_name: fee.class,
      fee: fee.fee,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (feeId) => {
    ConfirmToast("Are you sure you want to delete this fee?", async()=>{
      try {
        await deleteFee(feeId);
        setFees(prev => prev.filter(f => f.id !== feeId));
        toast.success("Fee deleted successfully");
      } catch(err) {
        console.error(err);
        toast.error(err.response?.data?.message || err.message);
      }
    })
  };

  return (
    <>
      <HeaderSection 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        handleModal={handleModal} 
      />
      <CardFees 
        filteredFees={filteredFees} 
        handleEdit={handleEdit} 
        handleDelete={handleDelete} 
      />
      <FeeModal 
        isModalOpen={isModalOpen} 
        closeModal={closeModal} 
        register={register} 
        handleSubmit={handleSubmit} 
        onSubmit={onSubmit} 
        errors={errors} 
        isSubmitting={isSubmitting} 
        editingFee={editingFee}
      />
    </>
  );
};

function HeaderSection({ searchTerm, setSearchTerm, handleModal }) {
  return (
    <div className={divStyle.betweenResponsiveReverse}>
      <div className="relative w-full">
        <input
          type="text"
          className={inputStyle.primary}
          placeholder="Search fee by class or amount"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <button onClick={handleModal} className={btnStyle.filled}>
        + Add Fee
      </button>
    </div>
  );
}

function CardFees({ filteredFees, handleEdit, handleDelete }) {
  return (
    <div className={gridStyle.item4atRowNoScroll}>
      {filteredFees.length > 0 ? filteredFees.map((fee, i) => (
        <div key={i} className={cardStyle.cardContainer}>
          <div className={`${flexStyle.between} pb-2 mb-2 border-b-1 border-gray-200`}>
            <h1 className="text-xl font-bold text-gray-600">Class: {fee.class}</h1>
            <div className="space-x-2">
              <button className="cursor-pointer" onClick={() => handleEdit(fee)}>
                <Pen className="h-5 w-5 text-sky-500" />
              </button>
              <button className="cursor-pointer" onClick={() => handleDelete(fee.id)}>
                <Trash2 className="h-5 w-5 text-red-500" />
              </button>
            </div>
          </div>
          <div className={flexStyle.between}>
            <p className={badge.primarySm}>
              Fee: {fee.fee} AF
            </p>
          </div>
        </div>
      )) : (
        <p className="text-gray-500">No fees added</p>
      )}
    </div>
  );
}

function FeeModal({ isModalOpen, closeModal, register, handleSubmit, onSubmit, errors, isSubmitting, editingFee }) {
  return (
    <Modal isOpen={isModalOpen} containerStyle="sm" onClose={closeModal} title={editingFee ? "Edit Fee" : "Add Fee"}>
      <form onSubmit={handleSubmit(onSubmit)} className={gridStyle.item2atRow}>
        
        <div className="flex flex-col">
          <label className={labelStyle.primary}>Class Name</label>
          <input 
            type="text" 
            placeholder="Class" 
            className={inputStyle.primary} 
            {...register("class_name", { required: "Class is required" })}
          />
          {errors.class && <p className={inputStyle.fieldError}>⭕ {errors.class.message}</p>}
        </div>

        <div className="flex flex-col">
          <label className={labelStyle.primary}>Fee Amount</label>
          <input 
            type="number" 
            placeholder="Fee Amount" 
            className={inputStyle.primary} 
            {...register("fee", { required: "Fee amount is required" })}
          />
          {errors.fee && <p className={inputStyle.fieldError}>⭕ {errors.fee.message}</p>}
        </div>

        <div className="col-span-full flex justify-end mt-4">
          <button type="submit" disabled={isSubmitting} className={btnStyle.filled}>
            {isSubmitting ? "Saving..." : "Save"}
          </button>
          <button type="button" onClick={closeModal} className={`${btnStyle.secondary} ml-2`} disabled={isSubmitting}>Cancel</button>
        </div>
      </form>
    </Modal>
  );
}

export default Fees;
