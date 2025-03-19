import React, { useRef } from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import printIcon from "../../../../_helper/images/print-icon.png";
import ReactToPrint from "react-to-print";

function ReportBody({ gridData, gridDataTwo }) {
  const printRef = useRef();
  const total = {
    numQuantity: 0,
    numBaseTotal: 0,
    numSurcharge: 0,
    numSD: 0,
    numVAT: 0,
    numGrandTotal: 0,
  };
  return (
    <>
      <div className="text-right mt-4 mb-8">
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

      <div componentRef={printRef} ref={printRef}>
        {/* First Table */}
        <div className="mb-30">
          <div className="text-center">
            <h4>"ছক-ক"</h4>
            <h4>
              কেন্দ্রীয় ইউনিট হইতে বিক্রয় ইউনিটে স্থানান্তরিত পণ্য/সেবা বিবরণী
            </h4>
            <h6>[বিধি ৭ দ্রষ্টব্য]</h6>
          </div>
          <table className="table table-striped table-bordered bj-table border">
            <thead>
              <tr>
                <th>কেন্দ্রীয় নিবন্ধিত ব্যক্তির নাম ও বিআইএন</th>
                <th>পণ্য/সেবা প্রেরনকারী ইউনিটের নাম ও ঠিকানা</th>
                <th>পণ্য/সেবা গ্রহীতা ইউনিটের নাম ও ঠিকানা </th>
                <th>
                  কেন্দ্রীয় ইউনিট হইতে ইস্যুকৃত পণ্য/সেবা স্থানান্তর চালানপত্র
                  বইয়ের নম্বর ও ইস্যুর তারিখ
                </th>
                <th>
                  পণ্য/সেবা স্থানান্তর চালানপত্র ফরম "মূসক-৬.৫" নম্বর ও তারিখ
                </th>
                <th>
                  স্থানান্তরিত পণ্য বা সেবার বিবরণ (প্রযোজ্য ক্ষেত্রে
                  সুনির্দিষ্ট ব্যান্ড নামসহ)
                </th>
                <th>স্থানান্তরিত পণ্য বা সেবার পরিমাণ</th>
                <th>স্থানান্তরিত পণ্য বা সেবার কর ব্যতীত মূল্য</th>
                <th>
                  স্থানান্তরিত পণ্য বা সেবার ক্ষেত্রে প্রযোজ্য করের পরিমাণ
                </th>
              </tr>
              <tr>
                <th>(১)</th>
                <th>(২)</th>
                <th>(৩)</th>
                <th>(৪)</th>
                <th>(৫)</th>
                <th>(৬)</th>
                <th>(৭)</th>
                <th>(৮)</th>
                <th>(৯)</th>
              </tr>
            </thead>
            <tbody>
              {gridData?.map((item, key) => (
                <tr key={key}>
                  <td>
                    <div className="pl-2">
                      {item?.businessUnitName}{" "}
                      {item?.binNo ? <> [{item?.binNo}] </> : ""}
                    </div>
                  </td>
                  <td>
                    <div className="pl-2">
                      {item?.supplierName}, {item?.supplierAddress}
                    </div>
                  </td>
                  <td>
                    <div className="pl-2">
                      {item?.businessUnitName}, {item?.taxBranchAddress}
                    </div>
                  </td>
                  <td className="text-center">{item?.taxPurchaseDate}</td>
                  <td className="text-center">
                    {item?.referenceNo} [{_dateFormatter(item?.referenceDate)}]
                  </td>
                  <td>
                    <div className="pl-2">{item?.taxItemGroupName}</div>
                  </td>
                  <td className="text-center">{item?.numQuantity}</td>
                  <td className="text-right">
                    <div className="pr-2">{item?.numBaseTotal}</div>
                  </td>
                  <td className="text-right">
                    <div className="pr-2">{item?.numVATTotal}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* First Table End */}

        {/* Second Table */}
        <div className="mb-8">
          <div className="text-center">
            <h4>"ছক-খ"</h4>
            <h4>
              কেন্দ্রীয় ইউনিট বা বিক্রয় ইউনিট হইতে পণ্য/সেবা সরবারহ ও রাজস্ব
              বিবরণী
            </h4>
            <h6>[বিধি ৭ দ্রষ্টব্য]</h6>
          </div>
          <table className="table table-striped table-bordered bj-table border">
            <thead>
              <tr>
                <th rowSpan="2">কেন্দ্রীয় নিবন্ধিত ব্যক্তির নাম ও বিআইএন</th>
                <th rowSpan="2">পণ্য/সেবা প্রেরনকারী ইউনিটের নাম ও ঠিকানা</th>
                <th rowSpan="2">পণ্য/সেবা গ্রহীতা ইউনিটের নাম ও ঠিকানা </th>
                <th rowSpan="2">
                  কেন্দ্রীয় ইউনিট হইতে ইস্যুকৃত পণ্য/সেবার কর চালানপত্র বইয়ের
                  নম্বর ও ইস্যুর তারিখ
                </th>
                <th rowSpan="2">কর চালানপত্র ফরম "মূসক-৬.৩" নম্বর ও তারিখ</th>
                <th rowSpan="2">
                  সরবারহকৃত পণ্য বা সেবার বিবরণ (প্রযোজ্য ক্ষেত্রে সুনির্দিষ্ট
                  ব্যান্ড নামসহ)
                </th>
                <th rowSpan="2">সরবারহকৃত পণ্য বা সেবার পরিমাণ</th>
                <th rowSpan="2">সরবারহকৃত পণ্য বা সেবার কর ব্যতীত মূল্য</th>
                <th colSpan="4" rowSpan="1">
                  সরবারহকৃত পণ্য বা সেবার ক্ষেত্রে প্রযোজ্য করের পরিমাণ{" "}
                </th>
              </tr>
              <tr>
                <th colSpan="1">মূসক</th>
                <th colSpan="1">এসডি</th>
                <th colSpan="1">সুনির্দিষ্ট কর</th>
                <th colSpan="1">মোট</th>
              </tr>
              <tr>
                <th>(১)</th>
                <th>(২)</th>
                <th>(৩)</th>
                <th>(৪)</th>
                <th>(৫)</th>
                <th>(৬)</th>
                <th>(৭)</th>
                <th>(৮)</th>
                <th>(৯)</th>
                <th>(১০)</th>
                <th>(১১)</th>
                <th>(১২)</th>
              </tr>
            </thead>
            <tbody>
              {gridDataTwo?.map((item, key) => {
                total.numBaseTotal += item?.numBaseTotal;
                total.numGrandTotal += item?.numGrandTotal;
                total.numVAT += item?.numVAT;
                total.numSD += item?.numSD;
                total.numSurcharge += item?.numSurcharge;
                total.numQuantity += item?.numQuantity;
                return (
                  <tr key={key}>
                    <td>
                      <div className="pl-2">
                        {item?.businessUnitName}{" "}
                        {item?.binNo ? <> [{item?.binNo}] </> : ""}
                      </div>
                    </td>
                    <td>
                      <div className="pl-2">
                        {item?.businessUnitName} [{item?.taxBranchAddress}]
                      </div>
                    </td>
                    <td>
                      <div className="pl-2">
                        {item?.soldtoPartnerName} [{item?.soldtoPartnerAddress}]
                      </div>
                    </td>
                    <td className="text-center">{item?.taxDelivaryDate}</td>
                    <td className="text-center">
                      {item?.referenceNo} [{_dateFormatter(item?.referenceDate)}
                      ]
                    </td>
                    <td>
                      <div className="pl-2">{item?.taxItemGroupName}</div>
                    </td>
                    <td className="text-center">{item?.numQuantity}</td>
                    <td className="text-right">
                      <div className="pr-2">{item?.numBaseTotal}</div>
                    </td>
                    <td className="text-right">
                      <div className="pr-2">{item?.numSurcharge}</div>
                    </td>
                    <td className="text-right">
                      <div className="pr-2">{item?.numSD}</div>
                    </td>
                    <td className="text-right">
                      <div className="pr-2">{item?.numVAT}</div>
                    </td>
                    <td className="text-right">
                      <div className="pr-2">{item?.numGrandTotal}</div>
                    </td>
                  </tr>
                );
              })}
              <tr style={{ fontWeight: "bold" }}>
                <td colSpan="6" className="text-right">
                  {" "}
                  Total
                </td>
                <td className="text-center">{total?.numQuantity.toFixed(2)}</td>
                <td className="text-right">
                  <div className="pr-2">{total?.numBaseTotal.toFixed(2)}</div>
                </td>
                <td className="text-right">
                  <div className="pr-2">{total?.numSurcharge.toFixed(2)}</div>
                </td>
                <td className="text-right">
                  <div className="pr-2">{total?.numSD.toFixed(2)}</div>
                </td>
                <td className="text-right">
                  <div className="pr-2">{total?.numVAT.toFixed(2)}</div>
                </td>
                <td className="text-right">
                  <div className="pr-2">{total?.numGrandTotal.toFixed(2)}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Second Table End */}
      </div>
    </>
  );
}

export default ReportBody;
