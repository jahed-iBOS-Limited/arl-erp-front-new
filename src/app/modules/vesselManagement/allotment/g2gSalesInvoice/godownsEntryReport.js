import React from "react";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../_helper/_fixedPoint";
import InputField from "../../../_helper/_inputField";
import "./style.scss";
const GodownsEntryReport = ({
  printRef,
  gridData,
  buUnName,
  values,
  setFieldValue,
  userPrintBtnClick,
}) => {
  const motherVessel = values?.motherVessel?.label || "";
  const motherVesselName = motherVessel?.split("(")?.[0].trim();
  return (
    <div ref={printRef}>
      <div>
        <div className="row">
          <div className="col-lg-12">
            <p
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                marginBottom: "15px",
              }}
            >
              তারিখ:{" "}
              {userPrintBtnClick ? (
                values?.godownsEntryTopDate
              ) : (
                <InputField
                  className="printFormat"
                  value={values?.godownsEntryTopDate}
                  name="fromDate"
                  type="date"
                  onChange={(e) => {
                    setFieldValue("godownsEntryTopDate", e.target.value);
                  }}
                />
              )}
            </p>
            <p>বরাবর</p>
            <p>যুগ্ন পরিচালক ( সার )</p>
            <p>বাংলাদেশ কৃষি উন্নায়ন কর্পোরেশন,</p>
            <p>১/বি, আগ্রাবাদ বা/এ, চট্টগ্রাম।</p>
            <p>
              বিষয়: বি এ ডি সি কর্তৃক প্রেরিত কর্মসূচী মোতাবেক চট্টগ্রাম হইতে
              বিভিন্ন গন্তব্য স্থলে পরিবহনকৃত সারের চুড়ান্ত প্রতিবেদন ও ইনভয়েজ
              ইস্যু করণ প্রসঙ্গে ।
            </p>
            <p>জহাজের নাম: {motherVesselName}</p>
            <p>সারের নাম: {values?.item?.label}</p>
            <p
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              কর্মসূচী নং: {values?.programNo}, তারিখ:{" "}
              {userPrintBtnClick ? (
                values?.godownsEntryBottomDate
              ) : (
                <InputField
                  value={values?.godownsEntryBottomDate}
                  className="printFormat"
                  name="fromDate"
                  type="date"
                  onChange={(e) => {
                    setFieldValue("godownsEntryBottomDate", e.target.value);
                  }}
                />
              )}{" "}
              ইং ।
            </p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="scroll-table-auto asset_list">
            <table className="table table-striped table-bordered global-table table-font-size-sm">
              <thead>
                <tr>
                  <th rowSpan={2}>SL</th>
                  <th rowSpan={2}>Godowns Name</th>
                  <th rowSpan={2}>Total Delivery(MT)</th>
                  <th rowSpan={2}>Bag</th>
                  <th rowSpan={2}>Empty Bag</th>
                  <th colSpan={2}>Sending</th>
                  <th rowSpan={2}>Remarks</th>
                </tr>
                <tr>
                  <th>Form</th>
                  <th>To</th>
                </tr>
              </thead>

              <tbody>
                {gridData?.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item?.shipToPartnerName}</td>
                    <td className="text-right">
                      {item?.totalDeliveryQuantityTon}
                    </td>
                    <td className="text-right">
                      {item?.totalDeliveryQuantityBag}
                    </td>
                    <td className="text-right">{item?.emptyBag}</td>
                    <td>{_dateFormatter(item?.fromDate)}</td>
                    <td>{_dateFormatter(item?.toDate)}</td>
                    <td>{item?.remarks}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={2}>Total</td>
                  <td className="text-right">
                    <b>
                      {_fixedPoint(
                        gridData?.reduce((acc, cur) => {
                          return (acc += +cur?.totalDeliveryQuantityTon || 0);
                        }, 0)
                      )}
                    </b>
                  </td>
                  <td className="text-right">
                    <b>
                      {_fixedPoint(
                        gridData?.reduce((acc, cur) => {
                          return (acc += +cur?.totalDeliveryQuantityBag || 0);
                        }, 0)
                      )}
                    </b>
                  </td>
                  <td className="text-right">
                    <b>
                      {_fixedPoint(
                        gridData?.reduce((acc, cur) => {
                          return (acc += +cur?.emptyBag || 0);
                        }, 0)
                      )}
                    </b>
                  </td>
                  <td colSpan={3}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GodownsEntryReport;
