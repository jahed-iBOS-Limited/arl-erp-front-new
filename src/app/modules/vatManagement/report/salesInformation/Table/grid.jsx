import React, { useRef } from "react";
import { withRouter } from "react-router-dom";
import Loading from "./../../../../_helper/_loading";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";
import { _fixedPointVat } from "../../../../_helper/_fixedPointVat";
const GridData = ({ rowDto, loading, headerData }) => {
  const printRef = useRef();
  const total = {
    quantity: 0,
    grandTotal: 0,
    sd: 0,
    vat: 0,
  };
  return (
    <>
      <div componentRef={printRef} ref={printRef} className="print_wrapper">
        <div className="row global-table">
          <div className="col-lg-12 text-right printSectionNone">
            <ReactToPrint
              trigger={() => (
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ padding: "2px 5px" }}
                >
                  <img
                    style={{
                      width: "25px",
                      paddingRight: "5px",
                    }}
                    src={printIcon}
                    alt="print-icon"
                  />
                  Print
                </button>
              )}
              content={() => printRef.current}
            />
          </div>
          <div className="col-lg-12">
            <div className="report_top mt-5 d-flex flex-column justify-content-center align-items-center">
              <h4>Government of the People's Republic of Bangladesh</h4>
              <h4 className="mb-3">National Board of Revenue</h4>
              <h4>
                Invoice data for Purchase/Sales valued more than taka Two Lakh
              </h4>
              <p>[see Clauses(1) of Rule (42)]</p>
            </div>
            <strong className="mt-2">
              Name of registered/enlisted Person:
            </strong>
            {headerData?.nameOfTaxpayer}
            <br></br>
            <strong>BIN: </strong>
            {headerData?.bin}
            <h5>PART B: Sales information</h5>
          </div>
          <div className="col-lg-12 ">
            <table className="table table-striped table-bordered mt-3 slaesInformaitionPrint">
              <thead>
                <tr>
                  <th style={{ width: "26px" }} rowspan="2">
                    SL
                  </th>
                  <th style={{ width: "749px" }} colspan="9">
                    Sales
                  </th>
                </tr>
                <tr>
                  <th style={{ width: "121px" }}>Invoice No</th>
                  <th style={{ width: "106px" }}>Date of Issue</th>
                  <th style={{ width: "106px" }}>Quantity</th>
                  <th style={{ width: "101px" }}>Value</th>
                  <th style={{ width: "101px" }}>SD</th>
                  <th style={{ width: "101px" }}>VAT</th>
                  <th style={{ width: "116px" }}>Name of Purchaser</th>
                  <th style={{ width: "128px" }}>Address of Purchaser</th>
                  <th style={{ width: "150px" }}>
                    BIN of Purchaser/National Id No
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading && <Loading />}
                {rowDto?.map((tableData, index) => {
                  total.quantity += tableData?.quantity;
                  total.grandTotal += tableData?.grandTotal;
                  total.sd += tableData?.sd;
                  total.vat += tableData?.vat;
                  return (
                    <tr key={index}>
                      <td> {index + 1} </td>
                      <td> {tableData?.invoiceNo} </td>
                      <td> {_dateFormatter(tableData?.dateofissue)} </td>
                      <td className="text-right">
                        {_fixedPointVat(tableData?.quantity, 3)}
                      </td>
                      <td className="text-right">
                        {_fixedPointVat(tableData?.grandTotal)}
                      </td>
                      <td className="text-right">
                        {_fixedPointVat(tableData?.sd)}
                      </td>
                      <td className="text-right">
                        {_fixedPointVat(tableData?.vat)}
                      </td>
                      <td> {tableData?.soldToPartnerName} </td>
                      <td> {tableData?.soldToPartnerAddress} </td>
                      <td> {tableData?.bin} </td>
                    </tr>
                  );
                })}
                <tr className="text-right" style={{ fontWeight: "bold" }}>
                  <td colSpan="3" className="text-right">
                    Total
                  </td>
                  <td> {_fixedPointVat(total?.quantity, 3)} </td>
                  <td> {_fixedPointVat(total?.grandTotal)} </td>
                  <td> {_fixedPointVat(total?.sd)} </td>
                  <td> {_fixedPointVat(total?.vat)} </td>
                  <td> </td>
                  <td> </td>
                  <td> </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default withRouter(GridData);
