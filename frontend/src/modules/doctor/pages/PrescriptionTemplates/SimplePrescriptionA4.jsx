import React, { forwardRef } from "react";
import "./SimplePrescriptionA4.css"
import ImageViewer from "../../../../componenets/ImageViewer";

const PrescriptionPrintA4 = forwardRef(
  (
    {
      billNumber,
      date,
      doctor,
      patient,
      medicines,
      signatureUrl,
      footer,
    },
    ref
  ) => {

    // console.log(medicines)
    return (
      <div ref={ref} className="a4-root">
        {/* HEADER */}
        <div className="a4-header">
          <div className="doctor-details-header">
            <h1>
              {doctor.prefix} {doctor.name} {doctor.lastname}
            </h1>
            <div className="clinic">{doctor.clinic}</div>
            {doctor.description && (
              <div className="desc">{doctor.description}</div>
            )}
          </div>

          <div className="meta">
            <p>Phone: <span>{doctor.phone}</span></p>
            <p>Bill No: <span>{billNumber}</span></p>
            <p>Date:  <span>{date}</span></p>
          </div>
        </div>

        {/* PATIENT */}
        <div className="patient-row">
          <p><b>Name:</b> {patient.name || "____________________"}</p>
          <p><b>Age:</b> {patient.age || "____"}</p>
          <p><b>Gender:</b> {patient.gender || "____"}</p>
          <p><b>Next Visit:</b> {patient.nextVisit}</p>
        </div>
        <div className="body-section">
        {/* RX */}
            <div className="left-side-border"></div>
            <h3 className="rx">RX:</h3>

            <table className="rx-table">
            <thead>
                <tr>
                <th>Medicine</th>
                <th>Form</th>
                <th>Dosage</th>
                <th>Number</th>
                <th>Time</th>
                </tr>
            </thead>
            <tbody>
                {medicines.map((m, i) => (
                <tr key={i} style={{ textAlign: "center"}}>
                    <td>{m.name}</td>
                    <td>{m.form || "—"}</td>
                    <td>{m.dosage || "—"}</td>
                    <td>{m.number || "—"}</td>
                    <td>{m.time || "—"}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>


        {/* FOOTER */}
        <div className="a4-footer">

          <div className="doctor-sign">
            {signatureUrl && (
                <ImageViewer imagePath={signatureUrl} altText="Signature" className="h-34 w-40  signature" />
            )}
            <p>Dr. {doctor.name} {doctor.lastname}</p>
          </div>

          <div className="address">
            Address: {footer.address}/ {footer.province}, {footer.country} — District: {footer.district}/
            Room: {footer.room}, Floor: {footer.floor}
          </div>

          <div className="copyright">
            © All RIGHTS RESERVED BY: https://paikareps.com / SUPPORT: +93
            771844770
          </div>
        </div>
      </div>
    );
  }
);

export default PrescriptionPrintA4;
