import React from 'react';
import { _dateFormatterTwo } from '../../../../_helper/_dateFormate';
import './style.css';
import { convertToText } from '../helper';

// dynamic table row 1 - 4
const dynamicTableRow = (tableData, index, header) => {
  return (
    <tr>
      <td
        colSpan={2}
        height={
          index === 2 && !header?.foreignPriceUsd
            ? 30
            : index === 4 && !header?.foreignPriceUsd
              ? 80
              : ''
        }
      >
        {/* IIFE Function For Render Left TD */}
        {(() => {
          switch (index) {
            case 1:
              return 'PRICE PER M.TON IN USD';
            case 2:
              return header?.foreignPriceUsd
                ? `${header?.foreignPriceUsd} $`
                : '';
            case 3:
              return 'PRICE PER M. TON IN WORDS';
            case 4:
              return header?.foreignPriceUsd
                ? convertToText(header?.foreignPriceUsd, 'USD')
                : '';
            default:
              return '';
          }
        })()}
      </td>
      <td style={{ textAlign: 'left' }}>{tableData?.godownName || ''}</td>
      <td
        style={{
          textAlign: 'right',
          fontWeight: 'bold',
          width: '100px',
        }}
      >
        {tableData?.quantity || ''}
      </td>
      <td
        style={{
          textAlign: 'right',
          fontWeight: 'bold',
          width: '100px',
        }}
      >
        {tableData?.perQtyTonPriceBd || ''}
      </td>
      <td style={{ textAlign: 'center' }}>
        {tableData?.perQtyPriceWords || ''}
      </td>
    </tr>
  );
};

const ghatTableRow = (tableData, index, rowSpanLength) => {
  return (
    <tr key={index}>
      {index === 0 && <td rowSpan={rowSpanLength} colSpan={2}></td>}
      <td style={{ textAlign: 'left' }}>{tableData?.godownName}</td>
      <td
        style={{
          textAlign: 'right',
          fontWeight: 'bold',
          width: '100px',
        }}
      >
        {tableData?.quantity}
      </td>
      <td
        style={{
          textAlign: 'right',
          fontWeight: 'bold',
          width: '100px',
        }}
      >
        {tableData?.perQtyTonPriceBd}
      </td>
      <td style={{ textAlign: 'center' }}>{tableData?.perQtyPriceWords}</td>
    </tr>
  );
};

const PrintBCICTender = ({ tenderDetails: { header, rows } }) => {
  // first data
  const firstDataOnTable = rows?.length > 0 && rows[0];
  const secondDataOnTable = rows?.length > 1 && rows[1];
  const thirdDataOnTable = rows?.length > 2 && rows[2];
  const fourthDataOnTable = rows?.length > 3 && rows[3];
  const fifthToNineDataOnTable = rows?.length > 4 ? rows?.slice(4, 10) : [];
  const tenToFourteenDataOnTable = rows?.length > 9 ? rows?.slice(10) : [];

  // last half data on table
  // const restofDataOnTable = rows?.length > 4 ? rows?.slice(4) : [];

  return (
    <div className="print-only">
      <div style={{ textAlign: 'center', padding: '10px 0' }}>
        <h2>SCHEDULE OF THE PRICE</h2>
        <small>
          QUOTATION ENQUIRY NO: {header?.enquiryNo} (DUE FOR SUBMISSION:{' '}
          {_dateFormatterTwo(header?.submissionDate)})
        </small>
      </div>
      {rows?.length > 0 && (
        <table style={{ margin: '20px 0' }}>
          <thead style={{ padding: '10px 0' }}>
            <tr>
              <th colSpan={6} style={{ textAlign: 'center' }}>
                DESCRIPTION OF ITEM
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ width: '100%' }}>
              <td
                rowSpan={2}
                colspan={2}
                style={{ width: '30%', textAlign: 'left' }}
              >
                <strong style={{ display: 'block' }}>PART – A</strong>{' '}
                <strong style={{ display: 'block' }}>(FOREIGN PART)</strong>{' '}
                TRANSPORTATION OF {header?.foreignQty} MT (+/-10%){' '}
                {header?.itemName} IN SINGLE SHIPMENT FROM{' '}
                {header?.loadPortName} TO {header?.dischargePortName} PORT,
                BANGLADESH ({header?.laycan})
              </td>
              <td colSpan={4}>
                <strong style={{ display: 'block' }}>PART – B</strong>{' '}
                <strong style={{ display: 'block' }}>
                  (LOCAL TRANSPORTATION)
                </strong>{' '}
                TRANSPORTATION OF {header?.foreignQty} MT (+/-10%){' '}
                {header?.itemName} FROM MOTHER VESSEL AT OUTER ANCHORAGE OF{' '}
                {header?.dischargePortName} PORT AND DELIVER IN 50 KG NET BAG AT
                BELOW MENTION BUFFER / FACTORY GODOWNS:
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold', textAlign: 'center' }}>
                Name of Factory
              </td>
              <td style={{ fontWeight: 'bold', textAlign: 'center' }}>
                PERCENTAGE (%) OF QUANTITY (BASIS B/L QUANTITY)
              </td>
              <td style={{ fontWeight: 'bold', textAlign: 'center' }}>
                PRICE PER M. TON IN BDT.
              </td>
              <td style={{ fontWeight: 'bold', textAlign: 'center' }}>
                PRICE PER M. TON IN WORDS BDT.
              </td>
            </tr>

            {/* First Data */}
            {dynamicTableRow(firstDataOnTable, 1)}

            {/* Second Data */}
            {dynamicTableRow(secondDataOnTable, 2, header)}

            {/* Third Data */}
            {dynamicTableRow(thirdDataOnTable, 3)}

            {/* Fourth Data */}
            {dynamicTableRow(fourthDataOnTable, 4, header)}

            {/* Fifth Data To Nine Data */}
            {fifthToNineDataOnTable?.length > 0 &&
              fifthToNineDataOnTable?.map((item, index) => {
                return ghatTableRow(
                  item,
                  index,
                  fifthToNineDataOnTable?.length
                );
              })}

            {/* Ten Data To Fourteen Data */}
            {tenToFourteenDataOnTable?.length > 0 &&
              tenToFourteenDataOnTable?.map((item, index) => {
                return ghatTableRow(
                  item,
                  index,
                  tenToFourteenDataOnTable?.length
                );
              })}

            <tr height={450}>
              <td colSpan={3}>
                <span style={{ display: 'block', marginBottom: '20px' }}>
                  QUOTATION ENQUIRY NO:
                </span>
                <span className="text-center d-block">
                  REF. {header?.referenceNo} DATED:{' '}
                  {_dateFormatterTwo(header?.referenceDate)}
                </span>
                <span className="text-center d-block">
                  COMC-
                  {header?.commercialNo}, DATED:{' '}
                  {_dateFormatterTwo(header?.commercialDate)}
                </span>
              </td>
              <td
                colSpan={3}
                style={{
                  verticalAlign: 'baseline',
                  textAlign: 'center',
                  paddingTop: '20px',
                }}
              >
                Name and Address of the PROPRIETOR
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PrintBCICTender;
