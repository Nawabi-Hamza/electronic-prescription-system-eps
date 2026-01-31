import React, { forwardRef } from "react";
import "./SecondaryPrescriptionA4.css"
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
      sideContent
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

        <div className="main-section flex">
            <div
              className="w-[28%] print:block p-2"
              dangerouslySetInnerHTML={{ __html: sideContent }}
            />
          <div className="w-[72%] body-section">
          {/* RX */}
              <div className="left-side-border"></div>
              <h3 className="rx">RX:</h3>

              <table className="rx-table">
              <thead>
                  <tr>
                    <th style={{ fontSize: '10px'}}>Medicine</th>
                    <th style={{ fontSize: '10px'}}>Form</th>
                    <th style={{ fontSize: '10px'}}>Dosage</th>
                    <th style={{ fontSize: '10px'}}>Number</th>
                    <th style={{ fontSize: '10px'}}>Time</th>
                  </tr>
              </thead>
              <tbody>
                  {medicines.map((m, i) => (
                  <tr key={i} style={{ textAlign: "center"}}>
                      <td style={{ fontSize: '8px'}}>{m.name}</td>
                      <td style={{ fontSize: '8px'}}>{m.form || "—"}</td>
                      <td style={{ fontSize: '8px'}}>{m.dosage || "—"}</td>
                      <td style={{ fontSize: '8px'}}>{m.number || "—"}</td>
                      <td style={{ fontSize: '8px'}}>{m.time || "—"}</td>
                  </tr>
                  ))}
              </tbody>
              </table>
          </div>
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
