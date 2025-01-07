import React from 'react';
import './profitAndLossInfo.css';

function ProfitAndLossInfo({ values }) {
  const [listOne] = React.useState([]);
  const [listTwo] = React.useState([]);
  return (
    <div className="porfitAndLossWrapper">
      <div className="row">
        <div className="col-lg-12">
          <div className="">
            <h6 className="text-center">
              INVOICE ({values?.modeOfTransport?.label || ''} EXPORT)
            </h6>
          </div>
        </div>
        <div className="col-lg-12">
          <div>
            <div className="d-flex justify-content-between">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: 'column',
                }}
              >
                <div>
                  <p>
                    <b>To</b>
                  </p>
                  <p></p>
                </div>
                <div>
                  <p>
                    <b>APPLICABLE CURRENCY:</b>
                  </p>
                </div>
              </div>
              <div>
                <p>
                  <b>JOB NO:</b>{' '}
                </p>
                <p>
                  <b>REF No.: </b>
                </p>
                <p>
                  <b>Date: </b>
                </p>
                <p>
                  <b>Due Date: </b>
                </p>
                <p>
                  <b>Correction No.: </b>
                </p>
                <p>
                  <b>Transport Mode: </b>
                </p>
                <p>
                  <b>Import/Export: </b>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* table one */}
        <div className="col-lg-12">
          <div className="table-responsive">
            <table className="table table-striped table-bordered global-table">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>HAWB/BL NO </th>
                  <th>MAWB/BL NO</th>
                  <th>CHARGE HEAD</th>
                  <th>CUR.</th>
                  <th>UNIT COST</th>
                  <th>UNIT QTY.</th>
                  <th>UNIT NAME</th>
                  <th>CHARGE</th>
                  <th>ROE</th>
                  <th>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {listOne?.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.hawbBlNo}</td>
                    <td>{item.mawbBlNo}</td>
                    <td>{item.chargeHead}</td>
                    <td>{item.currency}</td>
                    <td>{item.unitCost}</td>
                    <td>{item.unitQty}</td>
                    <td>{item.unitName}</td>
                    <td>{item.charge}</td>
                    <td>{item.roe}</td>
                    <td>{item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* table two */}
        <div className="col-lg-12">
          <div className="table-responsive">
            <table className="table table-striped table-bordered global-table">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>HBL/MBL</th>
                  <th>SHIPPER/CONSIGNEE</th>
                  <th>COMMERCIAL REF.</th>
                  <th>FROM/TO</th>
                  <th>ETD/ETA</th>
                  <th>PKG/CBM</th>
                  <th>C.WEIGHT</th>
                </tr>
              </thead>
              <tbody>
                {listTwo?.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.hblMbl}</td>
                    <td>{item.shipperConsignee}</td>
                    <td>{item.commercialRef}</td>
                    <td>{item.fromTo}</td>
                    <td>{item.etdEta}</td>
                    <td>{item.pkgCbm}</td>
                    <td>{item.cWeight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* REMARKS:	 */}
        <div className="col-lg-12 mt-5">
          <div>
            <p>
              <b>REMARKS:</b>
            </p>
          </div>
        </div>
        <div className="col-lg-12" style={{ marginTop: '300px' }}>
          {/* PREPARED BY */}
          <div
            className="d-flex"
            style={{
              marginBottom: '20px',
            }}
          >
            <div>
              <p>
                <b>PREPARED BY:</b>
              </p>
            </div>
          </div>
          {/* NOTE  */}
          <div className="d-flex">
            <div>
              <p>
                <b>NOTE :</b>
                THIS IS A SYSTEM GENERATED DOCUMENT HENCE NO SIGNATURE IS
                REQUIRED
              </p>
            </div>
          </div>
          {/* TERM */}
          <div className="d-flex">
            <div>
              <p>
                <b>TERM :</b>
                SERVICE RENDERED AS PER OUR TRADING CONDITIONS. THE ACCOUNT WILL
                BE CORRECTED UNLESS QUERIED WITHIN 7 CALENDAR DAYS
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfitAndLossInfo;
