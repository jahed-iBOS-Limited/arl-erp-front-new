import React, { useRef } from "react";
import moment from "moment";
import ReactToPrint from "react-to-print";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import printIcon from "../../../../_helper/images/print-icon.png";
import { editContractManufacturePrintStatus_api } from "../helper";
import { _fixedPointVat } from './../../../../_helper/_fixedPointVat';
function ReportBody({ singleData, tableRowData }) {
  const printRef = useRef();

  return (
    <div
      ref={printRef}
      className="global-table print_wrapper"
      componentRef={printRef}
    >
      <div>
        <div className="col-lg-12 text-right printSectionNone">
          <span
            onClick={() => {
              editContractManufacturePrintStatus_api(
                tableRowData.taxPurchaseId || tableRowData?.taxSalesId,
                tableRowData?.typeId
              );
            }}
          >
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
          </span>
        </div>
        <div className="text-right">মূসক -৬.৪</div>
        {/* Header Part */}
        <div className="text-center mb-8">
          <h3 className="font-weight-bold">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</h3>
          <h3 className="font-weight-bold">জাতীয় রাজস্ব বোর্ড</h3>
        </div>
        {/* Header Part End */}

        {/* Middle Part */}
        <div className="text-center mb-8">
          <h6>চুক্তিভিত্তিক উৎপাদনের চালানপত্র</h6>
          <h6>[বিধি ৪০ এর উপ-বিধি (১) এর দফা (ঘ) দ্রষ্টব্য ]</h6>
        </div>

        <div className="row">
          <div style={{ width: "45%", paddingLeft: "27px" }}>
            <h6>
              গ্রহীতার নাম :
              {singleData?.objHeaderDTO?.supplierName ||
                singleData?.objHeaderDTO?.soldtoPartnerName}{" "}
            </h6>
            <h6>
              গ্রহীতার বিআইএন :{" "}
              {singleData?.objHeaderDTO?.supplierBin ||
                singleData?.objHeaderDTO?.partnerBin}
            </h6>
            <h6>
              গন্তব্য স্থল :{" "}
              {singleData?.objHeaderDTO?.supplierAddress ||
                singleData?.objHeaderDTO?.soldtoPartnerAddress}
            </h6>
          </div>
          <div style={{ width: "55%" }}>
            <h6>
              নিবন্ধিত ব্যক্তির নাম :{" "}
              {singleData?.objHeaderDTO?.businessUnitName}
            </h6>
            <h6>
              নিবন্ধিত ব্যক্তির বিআইএন :{singleData?.objHeaderDTO?.companyBin}{" "}
            </h6>
            <h6>
              চালানপত্র ইস্যুর ঠিকানা :
              {singleData?.objHeaderDTO?.taxBranchAddress}{" "}
            </h6>
            <h6>
              চালানপত্র নম্বর :{" "}
              {singleData?.objHeaderDTO?.taxPurchaseCode ||
                singleData?.objHeaderDTO?.taxSalesCode}
            </h6>
            <h6>
              ইস্যুর তারিখ :
              {_dateFormatter(
                singleData?.objHeaderDTO?.purchaseDateTime ||
                  singleData?.objHeaderDTO?.deliveryDateTime
              )}{" "}
            </h6>
            <h6>
              ইস্যুর টাইম :{" "}
              {moment(
                singleData?.objHeaderDTO?.purchaseDateTime ||
                  singleData?.objHeaderDTO?.deliveryDateTime
              ).format("LT")}
            </h6>
          </div>
        </div>
        {/* Middle Part End */}

        {/* Table Part */}
        <div className="mb-8">
          <table className="table table-striped table-bordered global-table ">
            <thead>
              <tr>
                <th>ক্রমিক সংখ্যা</th>
                <th>প্রকৃতি (উপকরণ বা উৎপাদিত পণ্য)</th>
                <th>পণ্যের বিবরণ</th>
                <th>পরিমাণ</th>
                <th>মন্তব্য</th>
              </tr>
            </thead>
            <tbody>
              {singleData?.objListRowDTO?.map((itm, index) => (
                <tr>
                  <td>{index + 1}</td>
                  <td>{itm?.taxItemGroupName}</td>
                  <td>{itm?.uomname}</td>
                  <td className="text-center">{_fixedPointVat(itm?.quantity)}</td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Table Part End */}
      </div>

      {/* Footer Part */}
      <div className="mb-8">
        <h6 className="mb-2">দায়িত্বপ্রাপ্ত কর্মকর্তার সাক্ষর</h6>
        <div>নাম: ...</div>
      </div>
      {/* Footer Part End */}
    </div>
  );
}

export default ReportBody;
