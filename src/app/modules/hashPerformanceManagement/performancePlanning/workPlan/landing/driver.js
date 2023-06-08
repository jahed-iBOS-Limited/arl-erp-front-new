
export const pdfExport = (fileName, html2pdf) => {
    var element = document.getElementById("pdf-section");
    element.style.width = "100%";
    var clonedElement = element.cloneNode(true);
    clonedElement.classList.add("d-block")
    clonedElement.classList.remove("d-none")
    clonedElement.style.width = "100% !important";
    clonedElement.classList.remove("d-block")
    clonedElement.childNodes[0].lastChild.firstChild.classList.add('text-center')


    var opt = {
        margin: 60,
        filename: `${fileName}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
            scale: 5,
            dpi: 300,
            letterRendering: true,
            padding: "50px",
            scrollX: -window.scrollX,
            scrollY: -window.scrollY,
            windowWidth: document.documentElement.offsetWidth,
            windowHeight: document.documentElement.offsetHeight,
        },
        jsPDF: { unit: "px", hotfixes: ["px_scaling"], orientation: "portrait" },
    };
    html2pdf()
        .set(opt)
        .from(clonedElement)
        .save();


};
