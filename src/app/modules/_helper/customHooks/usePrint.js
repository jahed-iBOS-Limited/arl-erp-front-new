/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
function usePrint(printRef) {
  const [isPrint, setIsPrint] = useState(false);
  useEffect(() => {
    if (isPrint && printRef.current) {
        console.log("ref", printRef)
      const printSection = printRef.current.innerHTML;
      const newDiv = document.createElement("div");
      newDiv.className = "printSection";
      newDiv.innerHTML = printSection;
      document.body.appendChild(newDiv);
      const style = document.createElement("style");
      style.textContent = `
            @media print {
              body > div:not(.printSection) {
                display: none !important;
              }
              .printSection {
                display: block !important;
              }
            }
          `;
      document.head.appendChild(style);

      window.print();
      window.close();
      setIsPrint(false);
      // remove print section
      return () => {
        document.body.removeChild(newDiv);
        document.head.removeChild(style);
      };
    }
  }, [isPrint, printRef]);
  return () => {
    setIsPrint(true);
  };
}

export default usePrint;
