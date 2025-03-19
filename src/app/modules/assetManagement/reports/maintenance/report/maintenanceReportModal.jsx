// /* eslint-disable react/react-in-jsx-scope */
import React, { useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
// import ICustomTable from "../../../../_helper/_customTable";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { getMaintenanceReport } from "../helper";
import printIcon from "../../../../_helper/images/print-icon.png";
import "../style.css";
import { _formatMoney } from "../../../../_helper/_formatMoney";
function MaintenanceDetailReport({
  item,
  values,
  selectedBusinessUnit,
  setLoading,
}) {
  const [landing, setLanding] = useState([]);
  useEffect(() => {
    if (selectedBusinessUnit && values && item) {
      getMaintenanceReport({
        warehouseId: values?.warehouse?.value,
        part: 2,
        businessUnitId: selectedBusinessUnit?.value,
        plantId: values?.plant?.value,
        reportType: values?.reportType?.value,
        status: values?.status?.value,
        fromDate: values?.fromDate,
        toDate: values?.toDate,
        intReffId: item?.intMaintenanceNo,
        setter: setLanding,
        setLoading: setLoading,
      });
    }
  }, [selectedBusinessUnit, values, item, setLoading]);
  const printRef = useRef();
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
      {landing?.length > 0 && (
        <div componentRef={printRef} ref={printRef}>
          <div className="text-center">
            <h2>{selectedBusinessUnit?.label.toUpperCase()}</h2>
            <h6
              style={{
                // borderBottom: "2px solid #ccc",
                // paddingBottom: "10px",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              {selectedBusinessUnit?.address}
            </h6>
            <h3 className="m-0">Estimation Report</h3>
          </div>
        <div className="table-responsive">
        <table className="table w-100 global-table mt-5 text-right table-upper">
            <thead>
              <tr>
                <td>Vehicle Reg. No :</td>
                <td className="text-left">{landing[0]["strNameOfAsset"]}</td>
                <td className="text-right">Job Card. No :</td>
                <td className="text-left">{landing[0]["intMaintenanceNo"]}</td>
              </tr>
              <tr>
                <td className="text-right">Nature Of Vehicle :</td>
                <td className="text-left"></td>
                <td>Job Entrance Date :</td>
                <td className="text-left">
                  {_dateFormatter(landing[0]["dteStart"])}
                </td>
              </tr>
              <tr>
                <td className="text-right">Model & CC :</td>
                <td className="text-left"></td>
                <td className="text-right">Delivery Date :</td>
                <td className="text-left">
                  {_dateFormatter(landing[0]["dteEnd"])}
                </td>
              </tr>
              <tr>
                <td className="text-right">Company Name :</td>
                <td className="text-left"></td>
                <td className="text-right">Present Mileage :</td>
                <td className="text-left">{landing[0]["strPresentMilege"]}</td>
              </tr>
              <tr>
                <td className="text-right">Name of User :</td>
                <td className="text-left"></td>
                <td className="text-right">Next Mileage :</td>
                <td className="text-left">{landing[0]["strNextMilege"]}</td>
              </tr>
              <tr>
                <td className="text-right">Driver Name :</td>
                <td className="text-left"></td>
                <td className="text-right">Contact No :</td>
                <td className="text-left">{landing[0]["strContacNo"]}</td>
              </tr>
              <tr>
                <td className="text-right">Problem :</td>
                <td className="text-left"></td>
                <td className="text-right">User Name :</td>
                <td className="text-left">{landing[0]["strUserName"]}</td>
              </tr>
            </thead>
          </table>
        </div>
         <div className="table-responsive">
         <table className="table w-100 global-table">
            <thead>
              <tr>
                <th>SL</th>
                <th>Date</th>
                <th>Particulars(Spare Parts)</th>
                <th>Uom</th>
                <th>Quantity</th>
                <th>Material Cost Tk</th>
                <th>Particulars(Service Charge)</th>
                <th>Service Charge Tk</th>
              </tr>
            </thead>
            <tbody>
              {landing?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{_dateFormatter(item?.dteEnd)}</td>
                    <td>{item?.strSpareParts}</td>
                    <td>{item?.strUom}</td>
                    <td>{item?.numQty}</td>
                    <td>{_formatMoney(item?.monMaterial)}</td>
                    <td>{item?.strServiceName}</td>
                    <td>{_formatMoney(item?.monServiceCost)}</td>
                  </tr>
                );
              })}
              <tr>
                <td colSpan="4"></td>
                <td className="font-weight-bolder">Total</td>
                <td className="font-weight-bolder">{_formatMoney(landing?.reduce((acc,item)=>acc+item?.monMaterial||0,0))}</td>
                <td></td>
                <td className="font-weight-bolder">{_formatMoney(landing?.reduce((acc,item)=>acc+item?.monServiceCost||0,0))}</td>
              </tr>
            </tbody>
          </table>
         </div>
          {/* <ICustomTable
            ths={[
              "SL",
              "Date",
              "Particulars(Spare Parts)",
              "Uom",
              "Quantity",
              "Material Cost Tk",
              "Particulars(Service Charge)",
              "Service Charge Tk",
            ]}
          >

          </ICustomTable> */}
        </div>
      )}
    </>
  );
}

export default MaintenanceDetailReport;
