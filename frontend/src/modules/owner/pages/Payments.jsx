import React, { useEffect, useMemo, useState } from "react";
import FieldsGroupForm from "../../../componenets/FieldsGroupForm";
import api from "../../../api/axios";
import { useForm } from "react-hook-form";
import { fetchUsers, loadDoctorsDidNotPayments, loadDoctorsPayments } from "../../../api/ownerAPI";
import { ConfirmToast } from "../../../componenets/Toaster";
import { toast } from "react-toastify";
import Table from "../../../componenets/Table";
import SectionContainer from "../../../componenets/SectionContainer";
import { btnStyle, dropdownStyle, inputStyle } from "../../../styles/componentsStyle";
import Select from "react-select"
import Modal from "../../../componenets/ModalContainer";
import { FormatLastLogin } from "../../../componenets/Date&Time";
function Payments() {
    const [doctors,setDoctors] = useState([])
    
    const [isModalOpen,setIsModalOpen] = useState(false)
    useEffect(()=>{ fetchUsers({ seter: setDoctors }) }, [])
    
    // const [payments, setPayments] = useState([]);
    // const currentYear = new Date().getFullYear();
    // const currentMonth = new Date().getMonth() + 1;
    // const [year, setYear] = useState(currentYear);
    // const [month, setMonth] = useState(currentMonth);

    // useEffect(()=>{  loadDoctorsPayments({ seter: setPayments, year: year, month: month }) }, [year, month])


  return (
    <div className="">
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">Payments</h1>
            <button className={btnStyle.filled} onClick={() => setIsModalOpen(true)}>Add Payment</button>
        </div>
        <AllPayment />
        <br />
        <AllUnpaid />
        <AddPayment doctors={doctors} isModalOpen={isModalOpen} handleClose={()=> setIsModalOpen(false)} />
    </div>
  );
}

export default Payments;



function AddPayment({ doctors, isModalOpen, handleClose }){
    const { register, handleSubmit, reset, control, trigger, setValue, formState: { errors, isSubmitting } } = useForm();


    const paymentFieldsGroup = [
        {
            name: "payment_info",
            label: "💰 Doctor Payment",
            fields: [
                {
                    name: "doctor_id",
                    label: "Select Doctor",
                    type: "searchable-select",
                    required: true,
                    validation: {
                    required: "Doctor is required",
                    },
                    options: doctors?.map((d) => ({
                    label: d.generated_id+": "+d.doctor_name,
                    value: d.id,
                    })),
                },
                {
                    name: "month_number",
                    label: "Select Month",
                    type: "searchable-select",
                    required: true,
                    validation: {
                    required: "Month is required",
                    },
                    options: [
                    { label: "January", value: 1 },
                    { label: "February", value: 2 },
                    { label: "March", value: 3 },
                    { label: "April", value: 4 },
                    { label: "May", value: 5 },
                    { label: "June", value: 6 },
                    { label: "July", value: 7 },
                    { label: "August", value: 8 },
                    { label: "September", value: 9 },
                    { label: "October", value: 10 },
                    { label: "November", value: 11 },
                    { label: "December", value: 12 }
                    ],
                },
                {
                    name: "amount",
                    label: "Amount (AFN)",
                    type: "number",
                    required: true,
                    validation: {
                    required: "Amount is required",
                    min: {
                        value: 0,
                        message: "Amount cannot be negative",
                    },
                    max: {
                        value: 100000,
                        message: "Amount cannot be more than 100000",
                    },
                    pattern: {
                        value: /^[0-9]+$/,
                        message: "Amount must be a valid number",
                    },
                    },
                },
            ],
        },
    ];

    const onSubmit = async (data) => {
        const user_data = Object.entries(data).reduce((a, [k, v]) => typeof v === "object" && v !== null ? { ...a, ...v } : { ...a, [k]: v }, {});
        ConfirmToast("Are you sure want to add payment to the user", async() => {
            try {
                const res = await api.post("/owner/payments", user_data);
                if (res.data.status) {
                    toast.success("Payment saved successfully!");
                    // reset(); // clear form
                } else {
                    alert(res.data.message || "Something went wrong");
                }
            } catch (err) {
                console.error(err.response.data);
                toast.error(err.response.data.message);
            }
        })
    };

    return(
        <Modal isOpen={isModalOpen} onClose={handleClose} containerStyle={"sm"} title={"Add Payment to Doctor"}>
            <FieldsGroupForm
                 fields={paymentFieldsGroup}
                 register={register}
                 control={control}
                 errors={errors}
                 trigger={trigger}
                 setValue={setValue}
                 isSubmitting={isSubmitting}
                 onSubmit={handleSubmit(onSubmit)}
             />
        </Modal>
    )
}


function AllPayment() {

    const [payments, setPayments] = useState([]);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const [year, setYear] = useState(currentYear);
    const [month, setMonth] = useState(currentMonth);

    useEffect(()=>{  loadDoctorsPayments({ seter: setPayments, year: year, month: month }) }, [year, month])


  const [search, setSearch] = useState("");

  const months = [
    { label: "January", value: 1 },
    { label: "February", value: 2 },
    { label: "March", value: 3 },
    { label: "April", value: 4 },
    { label: "May", value: 5 },
    { label: "June", value: 6 },
    { label: "July", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "October", value: 10 },
    { label: "November", value: 11 },
    { label: "December", value: 12 },
  ];

  // last 5 years
  const years = Array.from({ length: 6 }, (_, i) => ({
    label: currentYear - i,
    value: currentYear - i,
  }));

  // 🔍 Filter payments by search
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const text = search.toLowerCase();
      return (
        p.full_name?.toLowerCase().includes(text) ||
        p.generated_id?.toString().toLowerCase().includes(text) ||
        p.amount?.toString().includes(text)
      );
    });
  }, [payments, search]);

  return (
    <SectionContainer title="Done Payments">
      
      {/* Filters Area */}
      <div className="grid grid-cols-4 gap-2 flex-wrap mb-4 items-center">

        {/* Search Box */}
        <div className="col-span-2">
            <input
            type="text"
            placeholder="Search by name, ID, amount…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={inputStyle.primary}
            />
        </div>

        {/* Month Select */}
        <div className="">
          <Select
            options={months}
            value={months.find((m) => m.value === month)}
            onChange={(v) => setMonth(v.value)}
            placeholder="Select Month"
            isSearchable
          />
        </div>

        {/* Year Select */}
        <div className="">
          <Select
            options={years}
            value={years.find((y) => y.value === year)}
            onChange={(v) => setYear(v.value)}
            placeholder="Select Year"
            isSearchable
          />
        </div>

      </div>

      {/* Table */}
      {filteredPayments.length === 0 ? (
        <p className="text-gray-500">No payments found.</p>
      ) : (
        <Table
          columns={[
            { key: "generated_id", label: "U_ID" },
            { key: "full_name", label: "USERNAME" },
            { key: "amount", label: "Amount" },
            { key: "year_pay", label: "Year" },
            { key: "month_number", label: "Month" },
            { key: "created_at", label: "Payment Date", render: (val) => (FormatLastLogin(val)) },
          ]}
          records={filteredPayments}
        />
      )}
    </SectionContainer>
  );
}


function AllUnpaid() {

  const [search, setSearch] = useState("");
    const [unpaid, setUnpaid] = useState([]);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const [year, setYear] = useState(currentYear);
    const [month, setMonth] = useState(currentMonth);

    useEffect(()=>{  loadDoctorsDidNotPayments({ seter: setUnpaid, year: year, month: month }) }, [year, month])

    const months = [
        { label: "January", value: 1 },
        { label: "February", value: 2 },
        { label: "March", value: 3 },
        { label: "April", value: 4 },
        { label: "May", value: 5 },
        { label: "June", value: 6 },
        { label: "July", value: 7 },
        { label: "August", value: 8 },
        { label: "September", value: 9 },
        { label: "October", value: 10 },
        { label: "November", value: 11 },
        { label: "December", value: 12 },
    ];

  const years = Array.from({ length: 6 }, (_, i) => ({
    label: currentYear - i,
    value: currentYear - i,
  }));

  // search filter
  const filtered = useMemo(() => {
    return unpaid.filter((d) => {
      const s = search.toLowerCase();
      return (
        d.full_name?.toLowerCase().includes(s) ||
        d.generated_id?.toLowerCase().includes(s)
      );
    });
  }, [search, unpaid]);

  return (
    <SectionContainer title="Doctors Without Payment">

      {/* Filters */}
      <div className="grid grid-cols-4 gap-2 mb-4 items-center">

        {/* Search box */}
        <div className="col-span-2">
          <input
            type="text"
            placeholder="Search doctor…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={inputStyle.primary}
          />
        </div>

        {/* Month Select */}
        <div>
          <Select
            options={months}
            value={months.find((m) => m.value === month)}
            onChange={(v) => setMonth(v.value)}
            placeholder="Select Month"
            isSearchable
          />
        </div>

        {/* Year Select */}
        <div>
          <Select
            options={years}
            value={years.find((y) => y.value === year)}
            onChange={(v) => setYear(v.value)}
            placeholder="Select Year"
            isSearchable
          />
        </div>

      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <p className="text-gray-500">All doctors have been paid.</p>
      ) : (
        <Table
          columns={[
            { key: "generated_id", label: "U_ID" },
            { key: "full_name", label: "Doctor Name" },
          ]}
          records={filtered}
        />
      )}
    </SectionContainer>
  );
}