const html2pdf = require("html2pdf.js");

export const ExportPDF = (fileName, setLoading) => {
  setLoading(true);
  var element = document.getElementById("pdf-section");
  var opt = {
    margin: 5,
    filename: `${fileName}.pdf`,
    image: { type: "jpeg", quality: 1 },
    html2canvas: { scale: 5, dpi: 300, letterRendering: true },
    jsPDF: { unit: "px", hotfixes: ["px_scaling"], orientation: "p" },
  };
  html2pdf()
    .set(opt)
    .from(element)
    .save()
    .then(() => {
      setLoading && setLoading(false);
    });
};
