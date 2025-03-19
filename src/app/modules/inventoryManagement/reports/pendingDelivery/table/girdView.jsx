import React from "react";
import moment from "moment";
import { _dateFormatterTwo } from "../../../../_helper/_dateFormate";
import "./style.css";

const GridView = ({ gridData, setGridData, selectedBusinessUnit, reportTypeId }) => {
  // one item select
  const itemSlectedHandler = (index, gridData, item) => {
    const isItemCheck = gridData?.find((item) => item?.itemCheck);
    if (
      isItemCheck?.objRowData?.soldToPartnerId ===
      item?.objRowData?.soldToPartnerId ||
      !isItemCheck
    ) {
      const copyRowDto = [...gridData];
      copyRowDto[index].itemCheck = !copyRowDto[index]?.itemCheck;
      return copyRowDto;
    } else {
      return gridData;
    }
  };
  // All item select
  // const allGridCheck = (value, gridData) => {
  //   const modifyGridData = gridData?.map((itm) => ({
  //     ...itm,
  //     itemCheck: value,
  //   }));
  //   return modifyGridData;
  // };

  const buUnId=selectedBusinessUnit?.value

  return (
    <>
      <>
        <div className="react-bootstrap-table table-responsive pendingDeliveryReport">
          <div className="loan-scrollable-table scroll-table-auto">
            <div
              style={{ maxHeight: "540px" }}
              className="scroll-table _table scroll-table-auto"
            >
              {" "}
              <table id="table-to-xlsx" className="table table-striped table-bordered global-table table-font-size-sm">
                <thead>
                  <tr>
                    <th style={{ minWidth: "25px" }}>
                      {/* <input
                        type="checkbox"
                        id="parent"
                        onChange={(event) => {
                          setGridData(
                            allGridCheck(event.target.checked, gridData)
                          );
                        }}
                      /> */}
                    </th>
                    <th style={{ minWidth: "30px" }}>SL</th>
                    {reportTypeId === 2 && ( <th style={{ minWidth: "120px" }}>Current Stage</th>)}
                    <th style={{ minWidth: "220px" }}>Sold To Party</th>
                    <th style={{ minWidth: "150px" }}>Ship To Party</th>
                    <th style={{ minWidth: "250px" }}>Ship To Party Address</th>
                    <th>Order No.</th>
                    {reportTypeId === 2 && ( <th style={{ minWidth: "120px" }}>DO Code</th>)}
                    {reportTypeId === 2 && ( <th style={{ minWidth: "120px" }}>Shipment Code</th>)}
                    <th>Order Date/Time</th>
                    <th style={{ minWidth: "120px" }}>Item Name</th>
                    <th>Item Price</th>
                    <th>Order Qty.</th>
                    {buUnId === 144 && <th>Order Qty.&nbsp;(Ton)</th>}
                    <th>DO Pending</th>
                    {buUnId === 144 && <th>DO Pending&nbsp;(Ton)</th>}
                    {reportTypeId === 2 && buUnId === 144 && <th>DO QTY</th>}
                    {reportTypeId === 2 && buUnId === 144 && <th>DO QTY&nbsp;(Ton)</th>}
                    <th>Vehicle Type</th>
                    <th>Unloading Time</th>
                    <th>Region</th>
                    <th>Area</th>
                    <th>Territory</th>
                  </tr>
                </thead>

                <tbody>
                  {gridData?.map((item, index) => {
                    const {
                      shipToPartnerName,
                      shipToPartnerAddress,
                      itemName,
                      numOrderQuantity,
                      pendingQty,
                      soldToPartnerName,
                      orderCode,
                      orderDateTime,
                      deliveryTime,
                      region,
                      area,
                      territory,
                      numItemPrice,
                      numOrderQuantityTon,
                      pendingQtyTon,
                      currentStage,
                      deliveryCode,
                      shipmentCode,
                      deliveryQuantity,
                      deliveryQuantityTon,
                    } = item?.objRowData;

                    return (
                      <tr key={index}>
                        <td>
                          <input
                            id="itemCheck"
                            type="checkbox"
                            className=""
                            value={item?.itemCheck}
                            checked={item?.itemCheck}
                            name={item?.itemCheck}
                            onChange={(e) => {
                              setGridData(
                                itemSlectedHandler(index, gridData, item)
                              );
                            }}
                          />
                        </td>
                        <td className="text-center">{index + 1}</td>
                        {reportTypeId === 2 && (<td>{currentStage}</td>)}
                        <td>{soldToPartnerName}</td>
                        <td>{shipToPartnerName}</td>
                        <td>{shipToPartnerAddress}</td>
                        <td>{orderCode}</td>
                        {reportTypeId === 2 && (<td>{deliveryCode}</td>)}
                        {reportTypeId === 2 && (<td>{shipmentCode}</td>)}
                        <td>
                          {_dateFormatterTwo(orderDateTime)}
                          <br />
                          {moment(orderDateTime).format("LT")}
                        </td>
                        <td>{itemName}</td>
                        <td className="text-right">{numItemPrice}</td>
                        <td className="text-right">{numOrderQuantity}</td>
                        {buUnId === 144 && <td className="text-right">{numOrderQuantityTon}</td>}
                        <td className="text-right">{pendingQty}</td>
                        {buUnId === 144 && <td className="text-right">{pendingQtyTon}</td>}
                        {reportTypeId === 2 && buUnId === 144 && <td className="text-right">{deliveryQuantity}</td>}
                        {reportTypeId === 2 && buUnId === 144 && <td className="text-right">{deliveryQuantityTon}</td>}
                        <td></td>
                        <td>{_dateFormatterTwo(deliveryTime)}</td>
                        <td>{region}</td>
                        <td>{area}</td>
                        <td>{territory}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
    </>
  );
};
export default GridView;
