import axios from "axios";
import html2pdf from "html2pdf.js";
import { toast } from "react-toastify";

// PDF Export function using html2pdf.js
export const exportToPDF = (elementId, fileName) => {
  return new Promise((resolve, reject) => {
    const element = document.getElementById(elementId); // Select the HTML element for PDF
    const options = {
      margin: 20,
      filename: `${fileName}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 5, dpi: 300, letterRendering: true },
      jsPDF: { unit: "px", hotfixes: ["px_scaling"], orientation: "landscape" },
    };

    // Generate PDF from the selected HTML element
    html2pdf()
      .set(options)
      .from(element)
      .toPdf()
      .output("blob")
      .then((pdfBlob) => {
        resolve(pdfBlob); // Return PDF blob for upload
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// File Upload function
export const uploadPDF = async (pdfBlob) => {
  const hardcodedToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJkMTIyNTkzYy0xNGM3LTRmNDYtYjliNC04NGI3YjlhNDZlNTgiLCJlbnJvbGwiOiJleE5qUk1Wa2FpQm02YnJPclY2MjVnPT0iLCJlbWFpbGFkZHJlc3MiOiJtaXJhakBpYm9zLmlvIiwic3ViIjoibWlyYWpAaWJvcy5pbyIsImp0aSI6ImY1MmJlMDljLTc3MDYtNGM1Zi1iMTk4LTkyZDQ2Y2E5YTE5YiIsImlhdCI6IjkvMjMvMjAyNCA2OjEyOjE4IEFNIiwiZXhwIjoxNzU4NjA3OTM4LCJpc3MiOiJBa2lqSW5mb1RlY2ggTHRkLiAiLCJhdWQiOiJBdWRpZW5jZSJ9.06aBO2uUCHG0IViaUpSbecHp_JUtkzXCBi-oFJwT4Ek"; // 1 year expire date

  const formData = new FormData();
  formData.append("files", pdfBlob, "document.pdf"); // Append the PDF blob

  try {
    const { data } = await axios.post("/domain/Document/UploadFile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${hardcodedToken}`, // Correct usage: "Authorization" as the key
      },
    });
    toast.success("File uploaded successfully"); // Success message
    return data; // Return the response data (upload result)
  } catch (error) {
    toast.error("Failed to upload file"); // Error message
    throw new Error("Upload failed");
  }
};
