import React, { useRef } from "react";
import { withRouter } from "react-router-dom";
import Loading from "./../../../../_helper/_loading";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";
import { useSelector, shallowEqual } from "react-redux";
import { _fixedPointVat } from "../../../../_helper/_fixedPointVat";

const GridData = ({ rowDto, loading, headerData }) => {
  const { selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const printRef = useRef();
  let OpeningQty = 0,
    OpeningVal = 0,
    RcvQty = 0,
    WithoutSDvatValue = 0,
    VatValue = 0,
    cal15 = 0,
    cal16 = 0,
    IssueQty = 0,
    IssueVal = 0,
    ClosingQty = 0,
    ClosingVal = 0,
    SDValue = 0;

  //total calculation for every quantity and amount, and this function is calling under a loop in JSX.
  // const totalCalculation = (itm) => {
  //   itm?.TaxTransactionTypeId === 4
  //     ? (total.IssueQuantityProduction += itm?.RcvQty)
  //     : (total.IssueQuantityProduction += 0);
  //   itm?.TaxTransactionTypeId === 4
  //     ? (total.IssueValueProduction += itm?.WithoutSDvatValue)
  //     : (total.IssueValueProduction += null);
  //   itm?.TaxTransactionTypeId === 4
  //     ? (total.OpeningRcvQty += itm?.OpeningQty)
  //     : (total.OpeningRcvQty += itm?.OpeningQty + itm?.RcvQty);
  //   itm?.TaxTransactionTypeId === 4
  //     ? (total.OpeningRcvValue += itm?.OpeningVal)
  //     : (total.OpeningRcvValue += itm?.OpeningVal + itm?.WithoutSDvatValue);
  //   total.OpeningQty += itm?.OpeningQty;
  //   // total.OpeningRcvQty += itm?.OpeningQty + itm?.RcvQty
  //   total.OpeningVal += itm?.OpeningVal;
  //   total.RcvQty += itm?.RcvQty;
  //   total.WithoutSDvatValue += itm?.WithoutSDvatValue;
  //   total.SDValue += itm?.SDValue;
  //   total.VatValue += itm?.VatValue;
  //   total.IssueQty += itm?.IssueQty;
  //   total.IssueVal += itm?.IssueVal;
  //   total.ClosingQty += itm?.ClosingQty;
  //   total.ClosingVal += itm?.ClosingVal;
  //   total.TaxTransactionTypeId = itm?.TaxTransactionTypeId;
  // };

  const TaxTransactionPurchase = 1;

  let isMagnum = selectedBusinessUnit?.value === 171;
  let isPat = selectedBusinessUnit?.value === 224;
  // let isMagnum = selectedBusinessUnit?.value === 171;
  return (
    <>
      {loading && <Loading />}
      {rowDto?.length > 0 && (
        <div
          className="global-table purchaseRegistration print_wrapper"
          componentRef={printRef}
          ref={printRef}
        >
          <div className="row">
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
              <div className="d-flex justify-content-center mt-5 mb-3">
                <div className="text-center">
                  <h2>
                    <b>Government of the People's Republic of Bangladesh</b>
                  </h2>
                  <h6>
                    <b>National Board of Revenue(Dhaka)</b>
                  </h6>
                  <h3>
                    <b>Purchase Accounts Book</b>
                  </h3>
                  <h5>
                    Applicable to registered or enlisted persons involved in the
                    processing of goods or services
                  </h5>
                  <h5>
                    [See clauses (a) of Sub-Rules 40 and clause(a) of Rule 41
                  </h5>
                  <h5>Goods/Services input Purchase</h5>
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
                  <h3 className="mb-0">Mushak 6.1</h3>
                </div>
                <p></p>
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
              <table class="table ">
                <thead>
                  <tr>
                    <th rowspan="3">
                      Sl No. <br />1
                    </th>
                    <th rowspan="3">
                      Date <br /> 2
                    </th>
                    <th colspan="2">Opening Balance of Input Stock</th>
                    <th colspan="14">Purchased Stock</th>
                    <th colspan="2">Closing Balance Stock</th>
                    <th rowspan="3">
                      Comments <br /> 21
                    </th>
                  </tr>
                  <tr>
                    <th rowspan="2">
                      Quantity <br /> 3
                    </th>
                    <th rowspan="2">
                      Value <br /> 4
                    </th>
                    <th rowspan="2">
                      Chalan <br /> 5
                    </th>
                    <th rowspan="2">
                      Date <br /> 6
                    </th>
                    <th colspan="3">Seller/Supplier</th>
                    <th rowspan="2">
                      Description <br /> 10
                    </th>
                    <th rowspan="2">
                      Quantity <br /> 11
                    </th>
                    <th rowspan="2">
                      Value <br /> 12
                    </th>
                    <th rowspan="2">
                      Supplementary <br /> 13
                    </th>
                    <th rowspan="2">
                      Vat <br /> 14
                    </th>
                    <th colspan="2">Total Stock</th>
                    <th colspan="2">Issue</th>
                    <th rowspan="2">
                      Quantity <br /> 19 <br /> =(15-17)
                    </th>
                    <th rowspan="2">
                      Value <br /> 20 <br /> =(16-18)
                    </th>
                  </tr>
                  <tr>
                    <th>
                      Name <br /> 7
                    </th>
                    <th>
                      Address <br /> 8
                    </th>
                    <th>
                      National ID <br /> 9
                    </th>
                    <th>
                      Quantity <br /> 15 <br /> =(3+11)
                    </th>
                    <th>
                      Value <br /> 16 <br /> =(4+12)
                    </th>
                    <th>
                      Quantity <br /> 17
                    </th>
                    <th>
                      Value <br /> 18
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rowDto?.map((itm, index) => {
                    // 11
                    const calRcvQty =
                      itm?.TaxTransactionTypeId === 4 ? 0 : itm?.RcvQty || 0;
                    //12
                    const calWithoutSDvatValue =
                      itm?.TaxTransactionTypeId === 4
                        ? 0
                        : itm?.WithoutSDvatValue;
                    //15
                    const _cal15 =
                      itm?.TaxTransactionTypeId === 4
                        ? itm?.OpeningQty || 0
                        : (itm?.OpeningQty || 0) + (itm?.RcvQty || 0);

                    const _cal16 =
                      itm?.TaxTransactionTypeId === 4
                        ? itm?.OpeningVal
                        : itm?.OpeningVal + itm?.WithoutSDvatValue;

                    OpeningQty += itm?.OpeningQty || 0;
                    OpeningVal += itm?.OpeningVal || 0;
                    RcvQty += calRcvQty || 0;
                    cal15 += _cal15 || 0;
                    cal16 += _cal16 || 0;
                    WithoutSDvatValue += calWithoutSDvatValue || 0;
                    SDValue += itm?.SDValue || 0;
                    VatValue += itm?.VatValue || 0;
                    IssueQty += itm?.IssueQty || 0;
                    IssueVal += itm?.IssueVal || 0;
                    ClosingQty += itm?.ClosingQty || 0;
                    ClosingVal += itm?.ClosingVal || 0;

                    return (
                      <tr>
                        <td>{index + 1}</td>
                        <td
                          className="text-center"
                          style={{ minWidth: "60px" }}
                        >
                          {_dateFormatter(itm?.Date_)}
                        </td>
                        <td className="text-center">
                          {_fixedPointVat(itm?.OpeningQty, 3)}
                        </td>
                        <td className="text-right">
                          {_fixedPointVat(itm?.OpeningVal)}
                        </td>
                        <td>{itm?.Chalan}</td>
                        <td
                          className="text-center"
                          style={{ minWidth: "60px" }}
                        >
                          {itm?.TaxTransactionTypeId === TaxTransactionPurchase
                            ? _dateFormatter(itm?.ChDate)
                            : ""}
                        </td>
                        <td>{itm?.SupName}</td>
                        <td>{itm?.SupAdd}</td>
                        <td>{itm?.SupRegNo}</td>
                        <td>{itm?.Descriptions}</td>
                        <td className="text-center">
                          {/* 11 */}
                          {_fixedPointVat(calRcvQty, 3)}
                        </td>
                        <td className="text-right">
                          {/* 12 */}
                          {_fixedPointVat(calWithoutSDvatValue)}
                        </td>
                        <td className="text-right">
                          {/* 13 */}
                          {_fixedPointVat(itm?.SDValue)}
                        </td>
                        <td className="text-right">
                          {" "}
                          {/* 14 */}
                          {_fixedPointVat(itm?.VatValue)}
                        </td>
                        <td className="text-center">
                          {/* 15 */}
                          {_fixedPointVat(_cal15, 3)}
                        </td>
                        <td className="text-right">
                          {/* 16 */}
                          {_fixedPointVat(_cal16)}
                        </td>
                        <td className="text-center">
                          {/* 17 */}
                          {_fixedPointVat(itm?.IssueQty, 4)}
                        </td>
                        <td className="text-right">
                          {/* 18 */}
                          {_fixedPointVat(itm?.IssueVal, 4)}
                        </td>
                        <td className="text-center">
                          {/* 19 no  | 15 - 17*/}
                          {_fixedPointVat(itm?.ClosingQty, 3)}
                        </td>
                        <td className="text-right">
                          {/* 20 | 16 - 18 */}
                          {_fixedPointVat(itm?.ClosingVal)}
                        </td>
                        <td>{itm?.Remarks}</td>
                      </tr>
                    );
                  })}
                  <tr style={{ fontWeight: "bold" }}>
                    <td colSpan="2">Total</td>
                    <td className="text-center">
                      {!isMagnum && !isPat && (
                        <> {_fixedPointVat(OpeningQty, 3)}</>
                      )}
                    </td>
                    <td className="text-right">{_fixedPointVat(OpeningVal)}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td className="text-center">
                      {/* 11 */}
                      {_fixedPointVat(RcvQty, 3)}
                    </td>
                    <td className="text-right">
                      {/* 12 */}
                      {_fixedPointVat(WithoutSDvatValue)}
                    </td>
                    <td className="text-right">{_fixedPointVat(SDValue)}</td>
                    {/* 14 */}
                    <td className="text-right">{_fixedPointVat(VatValue)}</td>
                    <td className="text-center">
                      {/* 15 */}
                      {!isMagnum && !isPat && <> {_fixedPointVat(cal15, 3)}</>}
                    </td>
                    <td className="text-right">
                      {/* 16 */}
                      {_fixedPointVat(cal16)}
                    </td>
                    <td className="text-center">
                      {/* 17 */}
                      {_fixedPointVat(IssueQty, 4)}
                    </td>
                    <td className="text-right">
                      {/* 18 */}
                      {_fixedPointVat(IssueVal, 4)}
                    </td>
                    <td className="text-center">
                      {/* 19 */}
                      {!isMagnum && !isPat && (
                        <> {_fixedPointVat(ClosingQty, 3)}</>
                      )}
                    </td>
                    <td className="text-right">
                      {/* 20 */}
                      {_fixedPointVat(ClosingVal)}
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
              <div className="d-flex">
                <div className="left mr-4">
                  <p className="mb-0">
                    <span style={{ width: "150px", display: "inline-block" }}>
                      Total opening quantity
                    </span>
                    : <b>{_fixedPointVat(rowDto?.[0]?.OpeningQty, 3)}</b>
                  </p>

                  <p className="mb-0">
                    <span style={{ width: "150px", display: "inline-block" }}>
                      Total purchased quantity
                    </span>
                    : <b>{_fixedPointVat(RcvQty, 3)}</b>
                  </p>

                  <p className="mb-0">
                    <span style={{ width: "150px", display: "inline-block" }}>
                      Total stock quantity
                    </span>
                    :{" "}
                    <b>{_fixedPointVat(rowDto?.[0]?.OpeningQty + RcvQty, 3)}</b>
                  </p>

                  <p className="mb-0">
                    <span style={{ width: "150px", display: "inline-block" }}>
                      Total Issue quantity
                    </span>
                    : <b>{_fixedPointVat(IssueQty, 3)}</b>
                  </p>

                  <p className="mb-0">
                    <span style={{ width: "150px", display: "inline-block" }}>
                      Total closing quantity
                    </span>
                    :{" "}
                    <b>
                      {_fixedPointVat(
                        rowDto?.[0]?.OpeningQty + RcvQty - IssueQty,
                        3
                      )}
                    </b>
                  </p>
                </div>
                <div className="right">
                  <p className="mb-0">
                    <span style={{ width: "150px", display: "inline-block" }}>
                      Total opening value
                    </span>
                    : <b>{_fixedPointVat(rowDto?.[0]?.OpeningVal)}</b>
                  </p>

                  <p className="mb-0">
                    <span style={{ width: "150px", display: "inline-block" }}>
                      Total purchased value
                    </span>
                    : <b>{_fixedPointVat(WithoutSDvatValue)}</b>
                  </p>

                  <p className="mb-0">
                    <span style={{ width: "150px", display: "inline-block" }}>
                      Total stock value
                    </span>
                    :{" "}
                    <b>
                      {_fixedPointVat(
                        rowDto?.[0]?.OpeningVal + WithoutSDvatValue
                      )}
                    </b>
                  </p>

                  <p className="mb-0">
                    <span style={{ width: "150px", display: "inline-block" }}>
                      Total Issue value
                    </span>
                    : <b>{_fixedPointVat(IssueVal)}</b>
                  </p>

                  <p className="mb-0">
                    <span style={{ width: "150px", display: "inline-block" }}>
                      Total closing value
                    </span>
                    :{" "}
                    <b>
                      {_fixedPointVat(
                        rowDto?.[0]?.OpeningVal + WithoutSDvatValue - IssueVal
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
