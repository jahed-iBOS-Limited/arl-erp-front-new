import React, { useRef } from "react";
import ICustomTable from "../../../_chartinghelper/_customTable";
import { ToWords } from "to-words";
import { _formatMoney } from "../../../_chartinghelper/_formatMoney";
import { _dateFormatter } from "../../../_chartinghelper/_dateFormatter";
import ReactToPrint from "react-to-print";
import { months } from "../../reports/helper";
import { shallowEqual, useSelector } from "react-redux";
import { ExportPDF } from "../../../_chartinghelper/exportPdf";
import Loading from "../../../_chartinghelper/loading/_loading";

const headers = [
  { name: "SL" },
  { name: "Description" },
  { name: "Voyage No" },
  { name: "Qty in Mts" },
  { name: "Rate" },
  { name: "Total(Taka)" },
];

export default function InvoicePrintView({ singleData }) {
  const [loading, setLoading] = React.useState(false);
  const printRef = useRef();
  const toWords = new ToWords({
    localeCode: "en-BD",
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
    },
  });

  const { selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  return (
    <>
      {loading && <Loading />}
      <div className="text-right">
        <button
          className="btn btn-primary px-3 py-2 mr-2"
          onClick={() => {
            ExportPDF(
              `Freight Bill Of 
            ${months[new Date(singleData?.objHead?.billDate).getMonth()] +
              "-" +
              new Date(singleData?.objHead?.billDate)?.getFullYear()}`,
              setLoading
            );
          }}
        >
          Export PDF
        </button>
        <ReactToPrint
          pageStyle={
            "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
          }
          trigger={() => (
            <button type="button" className="btn btn-primary px-3 py-2">
              <i className="mr-1 fa fa-print pointer" aria-hidden="true"></i>
              Print
            </button>
          )}
          content={() => printRef.current}
        />
      </div>
      <div className="mt-3 px-5" ref={printRef} id="pdf-section">
        <div className="text-center">
          <h2>{selectedBusinessUnit?.label}</h2>
          <h4 style={{ width: "50%", margin: "auto" }}>
            {selectedBusinessUnit?.address}
          </h4>
          <h3 className="text-uppercase mt-1">
            Freight Bill Of{" "}
            {months[new Date(singleData?.objHead?.billDate).getMonth()] +
              "-" +
              new Date(singleData?.objHead?.billDate)?.getFullYear()}
          </h3>
        </div>
        <br />
        <div className="d-flex justify-content-between">
          <div style={{ width: "65%" }}>
            <h4>
              Billing Unit: <br /> {singleData?.objHead?.consigneePartyName}
            </h4>
            <p style={{ width: "50%" }}>
              {singleData?.objHead?.consigneeAddress}
            </p>
          </div>
          <div style={{ width: "35%" }}>
            <h4>
              Bill No: {singleData?.objHead?.billNo} <br />
              Date: {_dateFormatter(singleData?.objHead?.billDate)}
            </h4>
          </div>
        </div>
        <h4>Party Name: {selectedBusinessUnit?.label}</h4>
        <ICustomTable ths={headers} style={{ borderTop: "1px solid red" }}>
          <tr>
            <td>-</td>
            <td colSpan="2">
              <b className="mb-0">
                Coaster Hire Charges for carrying{" "}
                {singleData?.objHead?.cargoName} (SR#{" "}
                {singleData?.objHead?.surveyNo} )
              </b>
            </td>
            <td colSpan={3}></td>
          </tr>
          <tr>
            <td>-</td>
            <td colSpan="2">
              <h4 className="mb-0">
                LC #{singleData?.objHead?.lcnumber},{" "}
                {singleData?.objHead?.motherVesselName},{" "}
                {singleData?.objHead?.voyageNo}
              </h4>
            </td>
            <td colSpan={3}></td>
          </tr>
          {singleData?.objList?.map((item, index) => (
            <tr key={index}>
              <td className="text-center" style={{ width: "40px" }}>
                {index + 1}
              </td>
              <td>{item?.lighterVesselName}</td>
              <td>{item?.tripNo}</td>
              <td className="text-right">{_formatMoney(item?.numQty, 0)}</td>
              <td className="text-right">{_formatMoney(item?.numRate)}</td>
              <td className="text-right">{_formatMoney(item?.numAmount)}</td>
            </tr>
          ))}
          <tr style={{ fontWeight: "bold" }}>
            <td className="text-right" colSpan={3}>
              Total
            </td>
            <td className="text-right">
              {" "}
              {_formatMoney(
                singleData?.objList?.reduce((a, b) => {
                  return a + b?.numQty;
                }, 0),
                0
              )}{" "}
            </td>
            <td></td>
            <td className="text-right">
              {_formatMoney(
                singleData?.objList?.reduce((a, b) => {
                  return a + b?.numAmount;
                }, 0)
              )}
            </td>
          </tr>
          <tr>
            <td colSpan={6} className="text-left">
              <h4 className="mb-0">{`In Words: ${toWords.convert(
                singleData?.objList?.reduce((a, b) => {
                  return a + b?.numAmount;
                }, 0)
              )}`}</h4>
            </td>
          </tr>
        </ICustomTable>
        <div
          className="d-flex justify-content-between"
          style={{ marginTop: "100px" }}
        >
          <div className="w-50">
            <div
              style={{
                borderTop: "1px solid #000",
                width: "150px",
              }}
            ></div>
            <p className="mb-0">Prepared By</p>
            {/* <p>Asst. Officer (A & F)</p> */}
          </div>
          <div className="w-50 d-flex justify-content-center">
            <div>
              <div
                style={{
                  borderTop: "1px solid #000",
                  width: "160px",
                }}
              ></div>
              <p className="text-center">
                Approved By
                {/* DM (Accounts & Finance) */}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
