import html2pdf from 'html2pdf.js';

export const pdfExport = (fileName) => {
  var element = document.getElementById('pdf-section');
  var opt = {
    margin: 1,
    filename: `${fileName}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 5, dpi: 300, letterRendering: true },
    jsPDF: { unit: 'px', hotfixes: ['px_scaling'], orientation: 'p' },
  };
  html2pdf().set(opt).from(element).save();
};
