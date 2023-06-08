import React, { useRef, useEffect } from "react";
import ReactToPrint from "react-to-print";
import "./style.css";
import {
  EditTaxSalesInvoicePrintStatus_api,
  GetTaxSalesInvoicePrintStatus_api,
  getViewModalDataBySalesId,
} from "./helper";
import Loading from "../../_helper/_loading";
import IViewModal from "../../_helper/_viewModal";
import printIcon from "../../_helper/images/print-icon.png";
import { _dateFormatter } from "../../_helper/_dateFormate";
import govLogo from "./images/govLogo.png";
import { useState } from "react";

export default function SalesInvoiceModel({
  show,
  onHide,
  setSalesInvoicePrintStatus,
  loading,
  viewClick,
  salesTableRowDto,
}) {
  let taxSalesId = salesTableRowDto?.taxSalesId || viewClick?.taxSalesId;
  const printRef = useRef();
  const [gridData, setGridData] = useState();

  const cb = (id) => {
    setSalesInvoicePrintStatus &&
      GetTaxSalesInvoicePrintStatus_api(id, setSalesInvoicePrintStatus);
  };

  useEffect(() => {
    if (taxSalesId) {
      getViewModalDataBySalesId(taxSalesId, setGridData);
    }
  }, [taxSalesId]);

  return (
    <div>
      {loading && <Loading />}
      <IViewModal
        show={show}
        onHide={onHide}
        title={"Sales Invoice iBOS"}
        btnText="Close"
        componentRef={printRef}
      >
        <div
          className="sales-invoice-model_top sales-invoice-model-print print_wrapper"
          ref={printRef}
        >
          <div className="row sales-invoice-model  m-0">
            <div className="col-lg-2 offset-10 d-flex justify-content-end">
              <span
                onClick={() => {
                  EditTaxSalesInvoicePrintStatus_api(taxSalesId, cb);
                }}
              >
                <ReactToPrint
                  trigger={() => (
                    <button
                      type="button"
                      className="btn btn-primary sales_invoice_btn"
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
              </span>
            </div>
            <div className="col-lg-12" componentRef={printRef} ref={printRef}>
              <table className="table w-100 table-sixPointone">
                <thead>
                  <tr>
                    <th className="sixOne-th" valign="center" halign="center">
                      <div>
                        <img src={govLogo} alt={"Ibos"} />
                      </div>
                    </th>
                    <th className="sixOne-th">
                      <h2 className="text-center">
                        গণপ্রজাতন্ত্রী বাংলাদেশ সরকার
                      </h2>
                      <div className="text-center">
                        <h4>
                          <strong>জাতীয় রাজস্ব বোর্ড</strong>
                        </h4>
                      </div>
                      <h4 className="text-center mt-4">
                        টার্নওভার কর চালানপত্র
                      </h4>
                      <h6>[ বিধি ৪১ এর দফা (খ) দ্রষ্টব্য ]</h6>
                    </th>
                    <th className="sixOne-th" valign="center" halign="center">
                      <div>
                        <span>মুসক ৬.৯</span>
                      </div>
                    </th>
                  </tr>
                </thead>
              </table>
              <div className="text-left mt-5">
                <h5>তালিকাভুক্ত ব্যক্তির নাম : {gridData?.data?.name} </h5>
                <h5>তালিকাভুক্ত ব্যক্তির বিআইএন : {gridData?.data?.binNo} </h5>
                <h5>চালান ইস্যুর ঠিকানা : {gridData?.data?.issueAddress}</h5>
                <h5>চালান নম্বর : {gridData?.data?.challanNo} </h5>
                <h5>
                  চালান ইস্যুর তারিখ :{" "}
                  {_dateFormatter(gridData?.data?.issueDate)}
                </h5>
              </div>
              <div className="text-left mt-5 pl-40">
                <h5>ক্রেতার নাম : {gridData?.data?.buyerName}</h5>
                <h5>ক্রেতার বিআইএন : {gridData?.data?.buyerBin}</h5>
              </div>
              {/* First Table */}
              <div className="my-10">
                <div className="text-left">
                  <h4>সরবারহের বিবরণ:</h4>
                </div>
                <table className="table table-striped table-bordered bj-table border">
                  <thead>
                    <tr>
                      <th colSpan="1" rowSpan="2">
                        ক্রমিক নং
                      </th>
                      <th colSpan="1" rowSpan="1">
                        সরবারহের বর্ণনা
                      </th>
                      <th colSpan="1" rowSpan="1">
                        সরবারহের একক
                      </th>
                      <th colSpan="1" rowSpan="1">
                        পরিমাণ
                      </th>
                      <th colSpan="1" rowSpan="1">
                        একক মূল্য (টাকায়)১
                      </th>
                      <th colSpan="1" rowSpan="1">
                        মোট মূল্য (টাকায়)১
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {gridData?.details?.map((item, key) => (
                      <tr key={key}>
                        <td className="text-center">{key + 1}</td>
                        <td>
                          <div className="text-left pl-2">{item?.itemName}</div>
                        </td>
                        <td>
                          <div className="text-left pl-2">{item?.uom}</div>
                        </td>
                        <td>
                          <div className="text-center">{item?.qty}</div>
                        </td>
                        <td>
                          <div className="text-right pr-2">{item?.rate}</div>
                        </td>
                        <td>
                          <div className="text-right pr-2">{item?.total}</div>
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colspan="5">
                        <div className="text-right pr-2">সর্বমোট মূল্য</div>
                      </td>
                      <td colspan="1">
                        <div className="text-right pr-2">
                          {gridData?.details?.reduce(
                            (acc, item) => acc + +item?.total,
                            0
                          )}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="5">
                        <div className="text-right pr-2">
                          টার্নওভার করের পরিমাণ (টাকা)২
                        </div>
                      </td>
                      <td colspan="1">
                        <div className="text-right pr-2">
                          {(gridData?.details?.reduce(
                            (acc, item) => acc + +item?.total,
                            0
                          ) *
                            gridData?.data?.turnoverTaxPercentage) /
                            100}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="mt-40">
                  <h5>দায়িত্বপ্রাপ্ত ব্যক্তির সাক্ষর </h5>
                </div>

                <div className="mt-20">
                  <p>
                    ১. একক এবং মোট মূল্যের মধ্যে ৩% টার্নওভার কর অন্তর্ভুক্ত
                    আছে।
                  </p>
                  <p>২. মোট মূল্যকে ৩/১০৩ দিয়ে গুণন করে প্রাপ্ত পরিমাণ।</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </IViewModal>
    </div>
  );
}
