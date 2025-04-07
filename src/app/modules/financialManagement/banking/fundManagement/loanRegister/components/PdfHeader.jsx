import React from 'react';
import { commonGetLetterHead } from '../../../../../_helper/letterHead/commonGetLetterHead';

const PdfHeader = ({ selectedBusinessUnit }) => {
  return (
    <>
      <div
        className="invoice-header"
        style={{
          backgroundImage: `url(${commonGetLetterHead({
            buId: selectedBusinessUnit?.value,
          })})`,
          backgroundRepeat: 'no-repeat',
          height: '150px',
          backgroundPosition: 'left 10px',
          backgroundSize: 'cover',
          position: 'fixed',
          width: '100%',
          top: '-40px',
        }}
      ></div>
      <div
        className="invoice-footer"
        style={{
          backgroundImage: `url(${commonGetLetterHead({
            buId: selectedBusinessUnit?.value,
          })})`,
          backgroundRepeat: 'no-repeat',
          height: '100px',
          backgroundPosition: 'left bottom',
          backgroundSize: 'cover',
          bottom: '-0px',
          position: 'fixed',
          width: '100%',
        }}
      ></div>
    </>
  );
};

export default PdfHeader;
