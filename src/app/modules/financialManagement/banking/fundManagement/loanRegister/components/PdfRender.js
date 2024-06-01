import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import PdfHeader from "./PdfHeader";
import EBLPdf from "./EBLPdf";
import WorkingCapitalPdf from "./WorkingCapitalPdf";
import OthersPdf from "./OthersPdf";
import './pdf.css'
import G2GPdf from "./G2GPdf";
const EBLBankId = 17;
const NRBCBankId = 61;
const PdfRender = ({ singleItem, printRef }) => {
  const {selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  return (
    <div className="loan_register_pdf" ref={printRef}>
      <PdfHeader selectedBusinessUnit={selectedBusinessUnit} />
      <div
                  style={{
                    height: "110px",
                  }}
                ></div>
      <ConditionallyRenderPdf
        singleItem={singleItem}
        selectedBusinessUnit={selectedBusinessUnit}
      />
    </div>
  );
};

const ConditionallyRenderPdf = ({ singleItem, selectedBusinessUnit }) => {
  if (singleItem?.disbursementPurposeName === "Working Capital") {
    return (
      <WorkingCapitalPdf
        singleItem={singleItem}
        selectedBusinessUnit={selectedBusinessUnit}
      />
    );
  }
  if (singleItem?.intBankId === EBLBankId) {
    return (
      <EBLPdf
        singleItem={singleItem}
        selectedBusinessUnit={selectedBusinessUnit}
      />
    );
  }
  if (
    singleItem?.intBankId === NRBCBankId &&
    (singleItem?.intBusinessUnitId === 94 ||
      singleItem?.intBusinessUnitId === 178)
  ) {
    return (
      <G2GPdf
        singleItem={singleItem}
        selectedBusinessUnit={selectedBusinessUnit}
      />
    );
  }
  return (
    <OthersPdf
      singleItem={singleItem}
      selectedBusinessUnit={selectedBusinessUnit}
    />
  );
};

export default PdfRender;
