
import React, { forwardRef } from "react";
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

    const styles = {
      root: {
        width: "100%",
        minHeight: "1123px",
        padding: "24px",
        fontFamily: "Arial, Helvetica, sans-serif",
        background: "#ffffff",
        color: "#000000",
        boxSizing: "border-box",
        position: "relative",
        letterSpacing: "0.3em",
      },

      header: {
        display: "flex",
        justifyContent: "space-between",
        paddingBottom: "18px",
      },

      doctorHeader: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
      },

      h1: {
        margin: 0,
        fontSize: "22px",
        textTransform: "uppercase",
      },

      clinic: {
        fontWeight: "bold",
        fontSize: "16px",
      },

      desc: {
        fontSize: "12px",
        marginTop: "4px",
      },

      meta: {
        fontSize: "13px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
      },

      patientRow: {
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1.5fr 1.5fr",
        fontSize: "13px",
        marginTop: "10px",
        borderTop: "1px solid #aaa",
        borderBottom: "1px solid #aaa",
        height: "50px",
      },

      bodySection: {
        position: "relative",
        paddingLeft: "15px",
      },

      leftBorder: {
        border: "1px solid #444",
        position: "absolute",
        top: "10px",
        left: 0,
        height: "100vh",
      },

      rx: {
        marginBottom: "20px",
        fontSize: "18px",
      },

      table: {
        width: "100%",
        fontSize: "12px",
        // minHeight: "600px",
        // background: "skyblue",
        borderCollapse: "collapse",
      },

      thead: {
        backgroundColor: "#eee",
      },

      thtd: {
        border: "1px solid #eee",
        paddingBottom: "24px",
      },

      footer: {
        position: "absolute",
        bottom: "24px",
        width: "calc(100% - 48px)",
        fontSize: "11px",
      },

      doctorSign: {
        fontWeight: "bold",
        display: "flex",
        position: "relative",
        justifyContent: "end",
        marginBottom: "24px",
        width: "auto",
      },

      signLine: {
        borderTop: "1px solid #000",
      },

      signatureImg: {
        position: "absolute",
        bottom: 0,
        right: 0,
        height: '300px',
        // zIndex: -1,
      },
      signatureWrapper: {
        position: "absolute",
        bottom: 0,
        zIndex: -1,
        height: "126px",
        width: "160px",
      },


      address: {
        borderTop: "1px solid #000",
        marginTop: "8px",
        letterSpacing: "3px",
      },

      copyright: {
        marginTop: "6px",
        fontSize: "10px",
      },
    };

    return (
      <div ref={ref} style={styles.root}>
        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.doctorHeader}>
            <h1 style={styles.h1}>
              {doctor.prefix} {doctor.name} {doctor.lastname}
            </h1>
            <div style={styles.clinic}>{doctor.clinic}</div>
            {doctor.description && (
              <div style={styles.desc}>{doctor.description}</div>
            )}
          </div>

          <div style={styles.meta}>
            <p>Phone: <span>{doctor.phone}</span></p>
            <p>Bill No: <span>{billNumber}</span></p>
            <p>Date: <span>{date}</span></p>
          </div>
        </div>

        {/* PATIENT */}
        <div style={styles.patientRow}>
          <p><b>Name:</b> {patient.name || "____________________"}</p>
          <p><b>Age:</b> {patient.age || "____"}</p>
          <p><b>Gender:</b> {patient.gender || "____"}</p>
          <p><b>Next Visit:</b> {patient.nextVisit}</p>
        </div>

        <div style={styles.bodySection}>
          <div style={styles.leftBorder}></div>
          <h3 style={styles.rx}>RX:</h3>

          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                <th style={styles.thtd}>Medicine</th>
                <th style={styles.thtd}>Form</th>
                <th style={styles.thtd}>Dosage</th>
                <th style={styles.thtd}>Number</th>
                <th style={styles.thtd}>Time</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((m, i) => (
                <tr key={i} style={{ textAlign: "center" }}>
                  <td style={styles.thtd}>{m.name}</td>
                  <td style={styles.thtd}>{m.form || "—"}</td>
                  <td style={styles.thtd}>{m.dosage || "—"}</td>
                  <td style={styles.thtd}>{m.number || "—"}</td>
                  <td style={styles.thtd}>{m.time || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div style={styles.footer}>
            <div style={styles.doctorSign}>
              {signatureUrl && (
                <div style={styles.signatureWrapper}>
                  <ImageViewer
                    imagePath={signatureUrl}
                    altText="Signature"
                    className="h-full w-auto"
                  />
                </div>
              )}
              <p style={styles.signLine}>
                Dr. {doctor.name} {doctor.lastname}
              </p>
            </div>

          <div style={styles.address}>
            Address: {footer.address}/ {footer.province}, {footer.country} —
            District: {footer.district}/ Room: {footer.room}, Floor: {footer.floor}
          </div>

          <div style={styles.copyright}>
            © All RIGHTS RESERVED BY: https://paikareps.com / SUPPORT: +93 771844770
          </div>
        </div>
      </div>
    );
  }
);

export default PrescriptionPrintA4;








// import React, { forwardRef } from "react";
// import "./SimplePrescriptionA4.css"
// import ImageViewer from "../../../../componenets/ImageViewer";

// const PrescriptionPrintA4 = forwardRef(
//   (
//     {
//       billNumber,
//       date,
//       doctor,
//       patient,
//       medicines,
//       signatureUrl,
//       footer,
//     },
//     ref
//   ) => {

//     // console.log(medicines)
//     return (
//       <div ref={ref} className="a4-root">
//         {/* HEADER */}
//         <div className="a4-header">
//           <div className="doctor-details-header">
//             <h1>
//               {doctor.prefix} {doctor.name} {doctor.lastname}
//             </h1>
//             <div className="clinic">{doctor.clinic}</div>
//             {doctor.description && (
//               <div className="desc">{doctor.description}</div>
//             )}
//           </div>

//           <div className="meta">
//             <p>Phone: <span>{doctor.phone}</span></p>
//             <p>Bill No: <span>{billNumber}</span></p>
//             <p>Date:  <span>{date}</span></p>
//           </div>
//         </div>

//         {/* PATIENT */}
//         <div className="patient-row">
//           <p><b>Name:</b> {patient.name || "____________________"}</p>
//           <p><b>Age:</b> {patient.age || "____"}</p>
//           <p><b>Gender:</b> {patient.gender || "____"}</p>
//           <p><b>Next Visit:</b> {patient.nextVisit}</p>
//         </div>
//         <div className="body-section">
//         {/* RX */}
//             <div className="left-side-border"></div>
//             <h3 className="rx">RX:</h3>

//             <table className="rx-table">
//             <thead>
//                 <tr>
//                 <th>Medicine</th>
//                 <th>Form</th>
//                 <th>Dosage</th>
//                 <th>Number</th>
//                 <th>Time</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 {medicines.map((m, i) => (
//                 <tr key={i} style={{ textAlign: "center"}}>
//                     <td>{m.name}</td>
//                     <td>{m.form || "—"}</td>
//                     <td>{m.dosage || "—"}</td>
//                     <td>{m.number || "—"}</td>
//                     <td>{m.time || "—"}</td>
//                 </tr>
//                 ))}
//             </tbody>
//             </table>
//         </div>


//         {/* FOOTER */}
//         <div className="a4-footer">

//           <div className="doctor-sign">
//             {signatureUrl && (
//                 <ImageViewer imagePath={signatureUrl} altText="Signature" className="h-34 w-40  signature" />
//             )}
//             <p>Dr. {doctor.name} {doctor.lastname}</p>
//           </div>

//           <div className="address">
//             Address: {footer.address}/ {footer.province}, {footer.country} — District: {footer.district}/
//             Room: {footer.room}, Floor: {footer.floor}
//           </div>

//           <div className="copyright">
//             © All RIGHTS RESERVED BY: https://paikareps.com / SUPPORT: +93
//             771844770
//           </div>
//         </div>
//       </div>
//     );
//   }
// );

// export default PrescriptionPrintA4;
