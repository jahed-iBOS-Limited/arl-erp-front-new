import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import PdfHeader from './PdfHeader';
import EBLPdf from './EBLPdf';
import WorkingCapitalPdf from './WorkingCapitalPdf';
import OthersPdf from './OthersPdf';
import './pdf.css';
import G2GPdf from './G2GPdf';
import SanctionedWorkingCapitalPdf from './SanctionedWorkingCapitalPdf';
const EBLBankId = 17;
const NRBCBankId = 61;
const PdfRender = ({ singleItem, printRef }) => {
  const { selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);
  return (
    <div className="loan_register_pdf" ref={printRef} contentEditable={true}>
      <div className="loan_pdf_header">
        <PdfHeader selectedBusinessUnit={selectedBusinessUnit} />
      </div>
      <div
        style={{
          height: '110px',
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
  if (singleItem?.disbursementPurposeName === 'Working Capital') {
    return (
      <WorkingCapitalPdf
        singleItem={singleItem}
        selectedBusinessUnit={selectedBusinessUnit}
      />
    );
  }
  if (singleItem?.disbursementPurposeName === 'Sanctioned Working Capital') {
    return (
      <SanctionedWorkingCapitalPdf
        singleItem={singleItem}
        selectedBusinessUnit={selectedBusinessUnit}
      />
    );
  }
  if (
    singleItem?.intBankId === EBLBankId &&
    singleItem?.disbursementPurposeName === 'Bill Payment'
  ) {
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
