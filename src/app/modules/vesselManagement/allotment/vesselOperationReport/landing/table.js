/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";

const headersOne = [
  "SL",
  "Mother Vessel",
  "Lighter Vessel",
  "Program",
  "Ghat Name",
  "Item Name",
  "Alloted Qty",
  "Loaded Qty",
  "Load Remaining Qty",
  "Challan Qty",
  "Challan Remaining",
];

const headersTwo = [
  "SL",
  "Truck No",
  "Driver Name",
  "Mobile No",
  "Name of BADC Godown",
  "Delivery in MT",
  "Empty bag",
  "C&F Challan No",
  "Shipping Challan No",
  "Loading Point",
];

const headersThree = [
  "SL",
  "Name of BADC Godown",
  "Allotment",
  "Last 24 hrs Delivery",
  "Previous Delivery",
  "Total Delivery",
  "Balance",
];

const GridView = ({ rowData, values }) => {
  return (
    <>
      {rowData?.length > 0 &&
        (values?.reportType?.value === 1 ? (
          <div className="table-responsive">
            <table
              id="table-to-xlsx"
              className={
                "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
              }
            >
              <thead>
                <tr className="cursor-pointer">
                  {headersOne?.map((th, index) => {
                    return <th key={index}> {th} </th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {rowData?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td style={{ width: "40px" }} className="text-center">
                        {index + 1}
                      </td>
                      <td>{item?.strMotherVesselName}</td>
                      <td>{item?.strLighterVesselName}</td>
                      <td>{item?.strProgram}</td>
                      <td>{item?.strShipPointName}</td>
                      <td>{item?.strItemName}</td>
                      <td className="text-right">{item?.numAllotedQnt}</td>
                      <td className="text-right">{item?.numloadqnt}</td>
                      <td className="text-right">{item?.numLoadRemaining}</td>
                      <td className="text-right">{item?.numchallanqnt}</td>
                      <td className="text-right">
                        {item?.numChalalnRemaining}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : values?.reportType?.value === 2 ? (
          <div className="table-responsive">
            <table
              id="table-to-xlsx"
              className={
                "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
              }
            >
              <thead>
                <tr className="cursor-pointer">
                  {headersTwo?.map((th, index) => {
                    return <th key={index}> {th} </th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {rowData?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td style={{ width: "40px" }} className="text-center">
                        {index + 1}
                      </td>
                      <td>{item?.strTruchNumber}</td>
                      <td>{item?.strDriverName}</td>
                      <td>{item?.strMobileNumber}</td>
                      <td>{item?.strNameofBADCGoDown}</td>
                      <td className="text-right">{item?.decDelQntMT}</td>
                      <td className="text-right">{item?.intEmptyBag}</td>
                      <td>{item?.strCNFChallan}</td>
                      <td>{item?.strShippingChallan}</td>
                      <td>{item?.strShipPointName}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : values?.reportType?.value === 3 ? (
          <div className="table-responsive">
            <table
              id="table-to-xlsx"
              className={
                "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
              }
            >
              <thead>
                <tr className="cursor-pointer">
                  {headersThree?.map((th, index) => {
                    return <th key={index}> {th} </th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {rowData?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td style={{ width: "40px" }} className="text-center">
                        {index + 1}
                      </td>
                      <td>{item?.strNameofBADCGoDown}</td>
                      <td className="text-right">{item?.decAllotMentQnt}</td>
                      <td className="text-right">
                        {item?.decTwentyFourHDeliveryTon}
                      </td>
                      <td className="text-right">{item?.decPreviouseDelv}</td>
                      <td className="text-right">{item?.decTotalDelv}</td>
                      <td className="text-right">{item?.decBalance}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null)}
    </>
  );
};

export default GridView;
