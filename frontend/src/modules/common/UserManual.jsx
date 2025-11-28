import React from "react";

const UserManual = ({ pdfUrl, title }) => {
  return (
    pdfUrl.length > 0 ? 
      <div style={{ height: "100vh", width: "100%", padding: "1rem" }}>
        <h1 className="mb-3">{title}</h1>
        <embed
          src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
          type="application/pdf"
          width="100%"
          height="90%"
        />
      </div>
      :
      <h1>PDF Path is invalid </h1>
  );
};

export default UserManual;
