import React, { useRef } from "react";
import { withRouter } from "react-router-dom";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";
import { _fixedPointVat } from "./../../../../_helper/_fixedPointVat";
const GridData = ({
  history,
  rowDto,
  loading,
  setModelshow,
  setOrdertableRow,
}) => {
  const printRef = useRef();
  const total = {
    OpeningQty: 0,
    OpeningVal: 0,
    PurchaseQty: 0,
    PurchaseValue: 0,
    SalesQty: 0,
    SalesVal: 0,
    SalesSDValue: 0,
    SalesVatValue: 0,
    ClosingQty: 0,
    ClosingVal: 0,
  };
  return (
    <>
      {rowDto?.length > 0 && (
        <div
          className="global-table purchaseRegistration print_wrapper"
          componentRef={printRef}
          ref={printRef}
        >
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
              <div className="report_top mt-5 d-flex flex-column justify-content-center align-items-center">
                <h4>প্রতিষ্ঠানের নাম, ঠিকানা ও বিন</h4>
                <h4>ক্রয় বিক্রয় হিসাব</h4>
                <h4>
                  (পণ্য বা সেবা প্রক্রিয়াকরণে সম্পৃক্ত নয় (ব্যবসায়ী) এমন
                  নিবন্ধিত বা তালিকাভুক্ত ব্যক্তির জন্য প্রযোজ্য )
                </h4>
                <h4>
                  [ বিধি ৪০ এর উপ-বিধি (১) এর দফা (খখ) ও বিধি ৪১(ক) দ্রষ্টব্য ]
                </h4>
              </div>
            </div>
            <div className="col-lg-12 pr-0 pl-0 purchaseRegistrationTable">
              <table class="table  text-center">
                <thead>
                  <tr>
                    <th rowSpan="3">ক্রমিক সংখ্যা</th>
                    <th rowSpan="3">তারিখ</th>
                    <th colSpan="2">বিক্রিযোগ্য পণ্যের প্রারম্ভিক জের</th>
                    <th colSpan="2"> ক্রয়</th>
                    <th colSpan="2">মোট পণ্য </th>
                    <th colSpan="3">বিক্রেতার তথ্য </th>
                    <th colSpan="2">
                      ক্রয় চালানপত্রের/ বিল অব এন্ট্রির বিবরণ{" "}
                    </th>
                    <th colSpan="5">বিক্রিত/সরবরাহকৃত পণ্যের বিবরণ </th>
                    <th colSpan="3">ক্রেতার তথ্য </th>
                    <th colSpan="2">বিক্রয় চালানপত্রের বিবরণ </th>
                    <th colSpan="2">পণ্যের প্রান্তিক জের </th>
                    <th colSpan="1">মন্তব্য </th>
                  </tr>
                  <tr>
                    <th rowSpan="2">পরিমাণ (একক)</th>
                    <th rowSpan="2">মূল্য (সকল প্রকার কর ব্যতীত)</th>
                    <th rowSpan="2">পরিমাণ (একক)</th>
                    <th rowSpan="2">মূল্য (সকল প্রকার কর ব্যতীত)</th>
                    <th rowSpan="2">ক্রমিক সংখ্যা</th>
                    <th rowSpan="2">মূল্য (সকল প্রকার কর ব্যতীত)</th>
                    <th colSpan="3"></th>
                    <th>নম্বর</th>
                    <th>তারিখ</th>
                    <th>বিবরণ</th>
                    <th>পরিমাণ</th>
                    <th>করযোগ্য মূল্য (সকল প্রকার কর ব্যতীত)</th>
                    <th>সম্পূরক শুল্ক (যদি থাকে)</th>
                    <th>মূসক</th>
                    <th colSpan="3"></th>
                    <th colSpan="2"></th>
                    <th>পরিমাণ</th>
                    <th rowSpan="1">মূল্য (সকল প্রকার কর ব্যতীত)</th>
                    <th></th>
                  </tr>
                  <tr>
                    <th>নাম</th>
                    <th>ঠিকানা</th>
                    <th>নিবন্ধন/তালিকাভুক্তি/জাতীয় পরিচয়পত্র নং</th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th>নাম</th>
                    <th>ঠিকানা</th>
                    <th>নিবন্ধন/তালিকাভুক্তি/জাতীয় পরিচয়পত্র নং</th>
                    <th>নম্বর</th>
                    <th>তারিখ</th>
                    <th></th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {rowDto?.map((itm, index) => {
                    total.OpeningQty += itm?.OpeningQty;
                    total.OpeningVal += itm?.OpeningVal;
                    total.PurchaseQty += itm?.PurchaseQty;
                    total.PurchaseValue += itm?.PurchaseValue;
                    total.SalesQty += itm?.SalesQty;
                    total.SalesVal += itm?.SalesVal;
                    total.SalesSDValue += itm?.SalesSDValue;
                    total.SalesVatValue += itm?.SalesVatValue;
                    total.ClosingQty += itm?.ClosingQty;
                    total.ClosingVal += itm?.ClosingVal;
                    return (
                      <tr>
                        <td>{index + 1}</td>
                        <td>{_dateFormatter(itm?.Date_)}</td>
                        <td>{_fixedPointVat(itm?.OpeningQty, 3)}</td>
                        <td>{_fixedPointVat(itm?.OpeningVal)}</td>
                        <td>{_fixedPointVat(itm?.PurchaseQty, 3)}</td>
                        <td>{_fixedPointVat(itm?.PurchaseValue)}</td>
                        <td>{index + 1}</td>
                        <td>
                          {_fixedPointVat(
                            +itm?.OpeningVal + +itm?.PurchaseValue
                          )}
                        </td>
                        <td>{itm?.SupName}</td>
                        <td>{itm?.SupAdd}</td>
                        <td>{itm?.SupRegNo}</td>
                        <td>{itm?.PurChalan}</td>
                        <td>
                          {itm?.PurChDate && _dateFormatter(itm?.PurChDate)}
                        </td>
                        <td>{itm?.SalesChalan}</td>
                        <td>{_fixedPointVat(itm?.SalesQty, 3)}</td>
                        <td>{_fixedPointVat(itm?.SalesVal)}</td>
                        <td>{_fixedPointVat(itm?.SalesSDValue)}</td>
                        <td>{_fixedPointVat(itm?.SalesVatValue)}</td>
                        <td>{itm?.BuyerName}</td>
                        <td>{itm?.BuyerAdd}</td>
                        <td>{itm?.BuyerRegNo}</td>
                        <td>{itm?.SalesChalan}</td>
                        <td>
                          {itm?.SalesChDate && _dateFormatter(itm?.SalesChDate)}
                        </td>
                        <td>{_fixedPointVat(itm?.ClosingQty, 3)}</td>
                        <td>{_fixedPointVat(itm?.ClosingVal)}</td>
                        <td>{itm?.Remarks}</td>
                      </tr>
                    );
                  })}
                  <tr style={{ fontWeight: "bold" }}>
                    <td colSpan="2">Total</td>
                    <td>{_fixedPointVat(total?.OpeningQty, 3)}</td>
                    <td>{_fixedPointVat(total?.OpeningVal)}</td>
                    <td>{_fixedPointVat(total?.PurchaseQty, 3)}</td>
                    <td>{_fixedPointVat(total?.PurchaseValue)}</td>
                    <td></td>
                    <td>
                      {_fixedPointVat(
                        +total?.OpeningVal + +total?.PurchaseValue
                      )}
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>{_fixedPointVat(total?.SalesQty, 3)}</td>
                    <td>{_fixedPointVat(total?.SalesVal)}</td>
                    <td>{_fixedPointVat(total?.SalesSDValue)}</td>
                    <td>{_fixedPointVat(total?.SalesVatValue)}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>{_fixedPointVat(total?.ClosingQty, 3)}</td>
                    <td>{_fixedPointVat(total?.ClosingVal)}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default withRouter(GridData);
