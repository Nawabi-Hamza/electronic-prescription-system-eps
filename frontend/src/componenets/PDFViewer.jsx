import { useEffect, useState } from "react";
import api from "../api/axios";
import Modal from "./ModalContainer";
import { toast } from "react-toastify";

export default function PDFViewer({ path="expenses_files", fileName }) {
  const [pdfUrl, setPdfUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenPdf = async (pn) => {
    try {
      const response = await api.get(`/uploads/${path}/${pn}`, {
        responseType: "blob", // important for PDF
      });

      const url = URL.createObjectURL(response.data); // create a URL from Blob
      setPdfUrl(url); 
      setIsModalOpen(true)
    } catch (err) {
      console.error("Failed to load PDF:", err);
      toast.error("Failed to load PDF !")
    }
  };

  useEffect(() => {
    if (fileName) handleOpenPdf(fileName);
  }, [fileName]);

  const handleClose = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setIsModalOpen(false);
    setPdfUrl("");
};


  return (
    <Modal onClose={handleClose} containerStyle={'sm'} isOpen={isModalOpen} title={`PDF View ${fileName ? fileName.split("_")[1] : ""}`}>
        <div>
            {pdfUrl ? (
                <iframe
                src={pdfUrl}
                width="100%"
                height="600px"
                title="PDF Viewer"
                />
            ) : (
                <p>No PDF selected</p>
            )}
        </div>
    </Modal>
  );
}

