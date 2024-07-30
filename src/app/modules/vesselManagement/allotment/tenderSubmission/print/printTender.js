import React from 'react'
import './style.css'
import { _dateFormatterTwo } from '../../../../_helper/_dateFormate'

const PrintPage = ({ tenderDetails: { header, rows } }) => {

  return (
    <div className='print-only'>
      <div style={{ textAlign: 'center', padding: '10px 0' }}>
        <h2>SCHEDULE OF THE PRICE</h2>
        <small>
          QUOTATION ENQUIRY NO: {header?.enquiryNo} {" "} (DUE FOR SUBMISSION:{" "}
          {_dateFormatterTwo(header?.submissionDate)})
        </small>
      </div>
      <table style={{ margin: '20px 0' }}>
        <thead>
          <tr>
            <th colSpan={6} style={{ textAlign: 'center' }}>DESCRIPTION OF ITEM</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ width: "100%" }}>
            <td rowSpan={2} colspan={2} style={{ width: "30%" }}>
              PART – A (FOREIGN PART) TRANSPORTATION OF {header?.foreignQty} {header?.uomname} (+/-10%) BULK{" "}
              {header?.itemName} IN SINGLE SHIPMENT FROM {header?.loadPortName} TO {header?.dischargePortName} PORT, BANGLADESH (FREE IN & LINER OUT BASIS)
            </td>
            <td colSpan={4}>
              PART – B (LOCAL TRANSPORTATION) TRANSPORTATION OF {header?.foreignQty} {header?.uomname}
              (+/-10%) BULK {header?.itemName} FROM MOTHER VESSEL AT OUTER ANCHORAGE
              OF {header?.dischargePortName} PORT AND DELIVER IN 50 KG NET BAG AT BELOW MENTION BUFFER /
              FACTORY GODOWNS:
            </td>
          </tr>
          <tr>
            <td>Name of Factory</td>
            <td>PERCENTAGE (%) OF QUANTITY (BASIS B/L QUANTITY)</td>
            <td>PRICE PER M. TON IN BDT.</td>
            <td>PRICE PER M. TON IN WORDS BDT.</td>
          </tr>
          {rows?.map((item, index) => (
            <>
              <tr>
                {index === 0 && <>
                  <td>PRICE PER M.TON IN USD</td>
                  <td style={{ width: "150px" }}></td>
                </>}
                {<>
                  <td style={{ textAlign: 'center' }}>{item?.godownName}</td>
                  <td style={{ textAlign: 'right' }}>{item?.quantity}</td>
                  <td style={{ textAlign: 'right' }}>{item?.perQtyTonPriceBd}</td>
                  <td style={{ textAlign: 'center' }}>{item?.perQtyPriceWords}</td>
                </>}
              </tr>
              <tr>
                {index === 0 && <>
                  <td rowSpan={5}>PRICE PER M. TON IN WORDS</td>
                  <td rowSpan={5} style={{ width: "150px" }}></td></>
                }
              </tr>
            </>
          ))}
          <tr>
            <td colSpan={3}>
              <span style={{ display: "block", marginBottom: "30px" }}
              >QUOTATION ENQUIRY NO:</span>

              REF. {header?.referenceNo} DATED: {_dateFormatterTwo(header?.referenceDate)} COMC-{header?.commercialNo},
              DATED: {_dateFormatterTwo(header?.commercialDate)}
            </td>
            <td colSpan={3}>Name and address of the PROPRIETOR</td>
          </tr>
        </tbody>
      </table>
    </div >
  )
}

export default PrintPage