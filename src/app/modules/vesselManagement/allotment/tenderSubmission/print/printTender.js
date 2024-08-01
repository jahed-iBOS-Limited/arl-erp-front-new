import React from 'react'
import './style.css'
import { _dateFormatterTwo } from '../../../../_helper/_dateFormate'

const PrintPage = ({ tenderDetails: { header, rows } }) => {

  const firstDataOnTable = rows?.length > 0 && rows[0]
  const restDataOnTable = rows?.length > 0 && rows?.slice(1)

  return (
    <div className='print-only'>
      <div style={{ textAlign: 'center', padding: '10px 0' }}>
        <h2>SCHEDULE OF THE PRICE</h2>
        <small>
          QUOTATION ENQUIRY NO: {header?.enquiryNo} {" "} (DUE FOR SUBMISSION:{" "}
          {_dateFormatterTwo(header?.submissionDate)})
        </small>
      </div>
      {
        rows?.length > 0 && <table style={{ margin: '20px 0' }}>
          <thead style={{ padding: '10px 0' }}>
            <tr>
              <th colSpan={6} style={{ textAlign: 'center' }}>DESCRIPTION OF ITEM</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ width: "100%" }}>
              <td rowSpan={2} colspan={2} style={{ width: "30%", textAlign: "left" }}>
                <strong style={{ display: 'block' }}>PART – A</strong> <strong style={{ display: 'block' }}>(FOREIGN PART)</strong> TRANSPORTATION OF {header?.foreignQty} {header?.uomname} (+/-10%) BULK{" "}
                {header?.itemName} IN SINGLE SHIPMENT FROM {header?.loadPortName} TO {header?.dischargePortName} PORT, BANGLADESH (FREE IN & LINER OUT BASIS)
              </td>
              <td colSpan={4}>
                <strong style={{ display: 'block' }}>PART – B</strong> <strong style={{ display: 'block' }}>(LOCAL TRANSPORTATION)</strong> TRANSPORTATION OF {header?.foreignQty} {header?.uomname}
                (+/-10%) BULK {header?.itemName} FROM MOTHER VESSEL AT OUTER ANCHORAGE
                OF {header?.dischargePortName} PORT AND DELIVER IN 50 KG NET BAG AT BELOW MENTION BUFFER /
                FACTORY GODOWNS:
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: "bold", textAlign: 'center' }}>Name of Factory</td>
              <td style={{ fontWeight: "bold", textAlign: 'center' }}>PERCENTAGE (%) OF QUANTITY (BASIS B/L QUANTITY)</td>
              <td style={{ fontWeight: "bold", textAlign: 'center' }}>PRICE PER M. TON IN BDT.</td>
              <td style={{ fontWeight: "bold", textAlign: 'center' }}>PRICE PER M. TON IN WORDS BDT.</td>
            </tr>
            <tr>

              <td >PRICE PER M.TON IN USD</td>
              <td style={{ width: "150px" }}></td>
              <td style={{ textAlign: 'left' }}>{firstDataOnTable?.godownName}</td>
              <td style={{ textAlign: 'right', fontWeight: "bold", width: "100px" }}>{firstDataOnTable?.quantity}</td>
              <td style={{ textAlign: 'right', fontWeight: "bold", width: "100px" }}>{firstDataOnTable?.perQtyTonPriceBd}</td>
              <td style={{ textAlign: 'center' }}>{firstDataOnTable?.perQtyPriceWords}</td>

            </tr>
            {restDataOnTable?.map((item, index) => {
              return (
                <>
                  <tr>
                    {index === 0 && <>
                      <td rowSpan={restDataOnTable.length}>PRICE PER M. TON IN WORDS</td>
                      <td rowSpan={restDataOnTable.length} style={{ width: "150px" }}></td>
                    </>
                    }
                    <>
                      <td style={{ textAlign: 'left' }}>{item?.godownName}</td>
                      <td style={{ textAlign: 'right', fontWeight: "bold", width: "100px" }}>{item?.quantity}</td>
                      <td style={{ textAlign: 'right', fontWeight: "bold", width: "100px" }}>{item?.perQtyTonPriceBd}</td>
                      <td style={{ textAlign: 'center' }}>{item?.perQtyPriceWords}</td>
                    </>
                  </tr>
                </>
              )
            })}
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
      }
    </div >
  )
}

export default PrintPage