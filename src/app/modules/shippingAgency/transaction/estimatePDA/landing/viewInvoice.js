import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import ICustomCard from "../../../../_helper/_customCard";
import PrintRef from "./printRef";
import "./viewInvoice.css";
function ViewInvoice({ estimatePdaid }) {
  
  console.log(estimatePdaid)
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Estimate PDA ",
    pageStyle:
      "@media print{body { -webkit-print-color-adjust: exact; margin: 0mm;}@page {size: portrait ! important}}",
  });

  return (
    <>
      <ICustomCard
        title='Estimate PDA View'
        renderProps={() => {
          return (
            <>
              <button
                type='button'
                className='btn btn-primary px-3 py-2'
                onClick={handlePrint}
              >
                <i className='mr-1 fa fa-print pointer' aria-hidden='true'></i>
                Print
              </button>
            </>
          );
        }}
      >
        <PrintRef
          componentRef={componentRef}
          estimatePdaid={estimatePdaid}
        />
      </ICustomCard>
    </>
  );
}

export default ViewInvoice;
