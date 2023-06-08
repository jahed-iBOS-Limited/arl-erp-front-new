import React, { useRef } from "react";
import { withRouter } from "react-router-dom";
import ReactToPrint from "react-to-print";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import printIcon from "../../../../_helper/images/print-icon.png";
import { useSelector, shallowEqual } from "react-redux";
import { _fixedPointVat } from "./../../../../_helper/_fixedPointVat";
const GridData = ({
  rowDto,

  headerData,
}) => {
  const { selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);
  const printRef = useRef();
  const total = {
    SalesVal: 0,
    ClosingVal: 0,
    ClosingQty: 0,
    VatValue: 0,
    SDValue: 0,
    SalesQty: 0,
    ProduceValue: 0,
    ProduceQty: 0,
    OpeningVal: 0,
    OpeningQty: 0,
  };
  let isMagnum = selectedBusinessUnit?.value === 171;
  let isPat = selectedBusinessUnit?.value === 224;
  return (
    <>
      {rowDto?.length > 0 && (
        <div componentRef={printRef} ref={printRef} className="print_wrapper">
          <div className="row global-table purchaseRegistration">
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
              <div className="d-flex justify-content-center mt-5">
                <div className="text-center">
                  <h2>
                    <b>Government of the People's Republic of Bangladesh</b>
                  </h2>
                  <h6>
                    <b>National Board of Revenue(Dhaka)</b>
                  </h6>
                  <h5>Sales Accounts Book</h5>
                  <h5>
                    Applicable to registered or enlisted persons involved in the
                    processing of goods or services
                  </h5>
                  <h5>
                    [See clauses (a) of Sub-Rules 40 and clause(a) of Rule 41
                  </h5>
                  <h5>Goods/Services sales</h5>
                </div>
                <div
                  className="MushakBox"
                  style={{
                    position: "absolute",
                    right: "14px",
                    top: "17px",
                    border: "1px solid",
                    padding: "2px",
                  }}
                >
                  <h3 className="mb-0">Mushak 6.2</h3>
                </div>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="">
                <b>
                  <p className="mb-1">Name: {headerData?.nameOfTaxpayer}</p>
                  <p className="mb-1">
                    Address:{headerData?.addressOfTaxpayer}
                  </p>
                  <p className="mb-1">Bin No:{headerData?.bin}</p>
                </b>
              </div>
            </div>
            <div className="col-lg-12 purchaseRegistrationTable">
              <table class="table  text-center">
                <thead>
                  <tr>
                    <th rowspan="2">
                      Sl No. <br /> 1
                    </th>
                    <th rowspan="2">
                      Date
                      <br /> 2
                    </th>
                    <th colspan="2">Opening stock of Goods/Service</th>
                    <th colspan="2">Procuction</th>
                    <th colspan="2">Total Produced goods/Service</th>
                    <th colspan="3">Buyer/Supply Recipient</th>
                    <th colspan="2">Challan Details</th>
                    <th colspan="5">Sold/Supplied Goods Description</th>
                    <th colspan="2">Close Balance of Material</th>
                    <th rowspan="2">
                      Comments
                      <br /> 21
                    </th>
                  </tr>
                  <tr>
                    <th>
                      Quantity (Unit)
                      <br /> 3
                    </th>
                    <th>
                      Value (Excluding all type of taxes)
                      <br /> 4
                    </th>
                    <th>
                      Quantity (Unit)
                      <br /> 5
                    </th>
                    <th>
                      Value ( Excluding all type of taxes)
                      <br /> 6
                    </th>
                    <th>
                      Quantity (Unit)
                      <br /> 7=(3+5)
                    </th>
                    <th>
                      Value ( Excluding all type of taxes)
                      <br /> 8=(4+6)
                    </th>
                    <th>
                      Name
                      <br /> 9
                    </th>
                    <th>
                      Address
                      <br /> 10
                    </th>
                    <th>
                      Registration/Enlist/National ID NO
                      <br /> 11
                    </th>
                    <th>
                      Number
                      <br /> 12
                    </th>
                    <th>
                      Sales Date
                      <br /> 13
                    </th>
                    <th>
                      Description
                      <br /> 14
                    </th>
                    <th>
                      Quantity
                      <br /> 15
                    </th>
                    <th>
                      Taxable Value
                      <br /> 16
                    </th>
                    <th>
                      Supplementary Duty (if Have)
                      <br /> 17
                    </th>
                    <th>
                      VAT
                      <br /> 18
                    </th>
                    <th>
                      Quantity (PCS)
                      <br /> 19(7-15)
                    </th>
                    <th>
                      Value ( Excluding all type of taxes)
                      <br /> 20(8-16)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr></tr>
                  {rowDto?.map((itm, index) => {
                    total.OpeningQty += itm?.OpeningQty;
                    total.OpeningVal += itm?.OpeningVal;
                    total.ProduceQty += itm?.ProduceQty;
                    total.ProduceValue += itm?.ProduceValue;
                    total.SalesQty += itm?.SalesQty;
                    total.SalesVal += itm?.SalesVal;
                    total.SDValue += itm?.SDValue;
                    total.VatValue += itm?.VatValue;
                    total.ClosingQty += itm?.ClosingQty;
                    total.ClosingVal += itm?.ClosingVal;
                    return (
                      <tr>
                        <td>{index + 1}</td>
                        <td>{_dateFormatter(itm?.ChDate)}</td>
                        {/* 3 */}
                        <td>{_fixedPointVat(itm?.OpeningQty, 3)}</td>
                        {/* 4 */}
                        <td>{_fixedPointVat(itm?.OpeningVal)}</td>
                        {/* 5 */}
                        <td>{_fixedPointVat(itm?.ProduceQty)}</td>
                        {/* 6 */}
                        <td>{_fixedPointVat(itm?.ProduceValue)}</td>
                        {/* 7 */}
                        <td>
                          {_fixedPointVat(itm?.OpeningQty + itm?.ProduceQty)}
                        </td>
                        {/* 8 */}
                        <td>
                          {_fixedPointVat(itm?.OpeningVal + itm?.ProduceValue)}
                        </td>
                        {/* 9 */}
                        <td>{itm?.BuyerName}</td>
                        {/* 10 */}
                        <td>{itm?.BuyerAdd}</td>
                        {/* 11 */}
                        <td>{itm?.BuyerRegNo}</td>
                        {/* 12 */}
                        <td>{itm?.Chalan}</td>
                        {/* 13 */}
                        <td>{_dateFormatter(itm?.ChDate)}</td>
                        {/* 14 */}
                        <td>{itm?.MaterialName}</td>
                        {/* 15 */}
                        <td>{_fixedPointVat(itm?.SalesQty, 3)}</td>
                        {/* 16 */}
                        <td>{_fixedPointVat(itm?.SalesVal)}</td>
                        {/* 17 */}
                        <td>{_fixedPointVat(itm?.SDValue)}</td>
                        {/* 18 */}
                        <td>{_fixedPointVat(itm?.VatValue)}</td>
                        {/* 19 */}
                        <td>{_fixedPointVat(itm?.ClosingQty, 2)}</td>
                        {/* 20 */}
                        <td>{_fixedPointVat(itm?.ClosingVal)}</td>
                        {/* 21 */}
                        <td>{itm?.Remarks}</td>
                      </tr>
                    );
                  })}
                  <tr style={{ fontWeight: "bold" }}>
                    <td colSpan="2">Total</td>
                    <td>
                      {!isMagnum && !isPat && (
                        <> {_fixedPointVat(total?.OpeningQty, 3)}</>
                      )}
                    </td>
                    <td>{_fixedPointVat(total?.OpeningVal)}</td>
                    <td>{_fixedPointVat(total?.ProduceQty, 3)}</td>
                    <td>{_fixedPointVat(total?.ProduceValue)}</td>
                    <td>{_fixedPointVat(total?.ProduceQty, 3)}</td>
                    <td>{_fixedPointVat(total?.ProduceValue)}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      {!isMagnum && !isPat && (
                        <> {_fixedPointVat(total?.SalesQty, 3)}</>
                      )}
                    </td>
                    <td>{_fixedPointVat(total?.SalesVal)}</td>
                    <td>{_fixedPointVat(total?.SDValue)}</td>
                    <td>{_fixedPointVat(total?.VatValue)}</td>
                    <td>
                      {!isMagnum && !isPat && (
                        <> {_fixedPointVat(total?.ClosingQty, 3)}</>
                      )}
                    </td>
                    <td>{_fixedPointVat(total?.ClosingVal)}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>

              <div className="d-flex">
                <div className="left mr-3">
                  <p className="mb-0">
                    <span style={{ width: "150px", display: "inline-block" }}>
                      Total opening quantity
                    </span>
                    : <b>{_fixedPointVat(rowDto?.[0]?.OpeningQty, 3)}</b>
                  </p>

                  <p className="mb-0">
                    <span style={{ width: "150px", display: "inline-block" }}>
                      Total procuction quantity
                    </span>
                    : <b>{_fixedPointVat(total?.ProduceQty, 3)}</b>
                  </p>
                  <p className="mb-0">
                    <span style={{ width: "150px", display: "inline-block" }}>
                      Total stock quantity
                    </span>
                    :{" "}
                    <b>
                      {_fixedPointVat(
                        rowDto?.[0]?.OpeningQty + total?.ProduceQty,
                        3
                      )}
                    </b>
                  </p>

                  <p className="mb-0">
                    <span style={{ width: "150px", display: "inline-block" }}>
                      Total sales quantity
                    </span>
                    : <b>{_fixedPointVat(total?.SalesQty, 3)}</b>
                  </p>

                  <p className="mb-0">
                    <span style={{ width: "150px", display: "inline-block" }}>
                      Total closing quantity
                    </span>
                    :{" "}
                    <b>
                      {_fixedPointVat(
                        rowDto?.[0]?.OpeningQty +
                          total?.ProduceQty -
                          total?.SalesQty,
                        3
                      )}
                    </b>
                  </p>
                </div>
                <div className="right ">
                  <p className="mb-0">
                    <span style={{ width: "150px", display: "inline-block" }}>
                      Total opening value
                    </span>
                    : <b>{_fixedPointVat(rowDto?.[0]?.OpeningVal)}</b>
                  </p>

                  <p className="mb-0">
                    <span style={{ width: "150px", display: "inline-block" }}>
                      Total procuction value
                    </span>
                    : <b>{_fixedPointVat(total?.ProduceValue)}</b>
                  </p>
                  <p className="mb-0">
                    <span style={{ width: "150px", display: "inline-block" }}>
                      Total stock value
                    </span>
                    :{" "}
                    <b>
                      {_fixedPointVat(
                        rowDto?.[0]?.OpeningVal + total?.ProduceValue
                      )}
                    </b>
                  </p>

                  <p className="mb-0">
                    <span style={{ width: "150px", display: "inline-block" }}>
                      Total sales value
                    </span>
                    : <b>{_fixedPointVat(total?.SalesVal)}</b>
                  </p>

                  <p className="mb-0">
                    <span style={{ width: "150px", display: "inline-block" }}>
                      Total closing value
                    </span>
                    :{" "}
                    <b>
                      {_fixedPointVat(
                        rowDto?.[0]?.OpeningVal +
                          total?.ProduceValue -
                          total?.SalesVal
                      )}
                    </b>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default withRouter(GridData);
