import React from "react";
import moment from "moment";

const GridView = ({ gridData, setGridData }) => {
  // One item select
  // const itemSlectedHandler = (value, index, gridData) => {
  //   const copyRowDto = [...gridData];
  //   copyRowDto[index].itemCheck = !copyRowDto[index]?.itemCheck;
  //   return copyRowDto;
  // };

  // All item select
  // const allGridCheck = (value, gridData) => {
  //   const modifyGridData = gridData?.map((itm) => ({
  //     ...itm,
  //     itemCheck: value,
  //   }));
  //   return modifyGridData;
  // };
  return (
    <>
      <>
        <div className="react-bootstrap-table table-responsive pendingDeliveryReport">
          <div className="loan-scrollable-table scroll-table-auto">
            <div
              style={{ maxHeight: "500px" }}
              className="scroll-table _table scroll-table-auto"
            >
              <table id="table-to-xlsx" className="table table-striped table-bordered global-table table-font-size-sm">
                <thead>
                  <tr>
                    {/* 
                      <th style={{ width: "25px" }}>
                        <input
                          type="checkbox"
                          id="parent"
                          onChange={(event) => {
                            setGridData(allGridCheck(event.target.checked, gridData));
                          }}
                        />
                      </th> 
                    */}
                    <th style={{ minWidth: "30px" }}>SL</th>
                    <th>Sold To Party</th>
                    <th>Ship To Party</th>
                    <th>Ship To Party Address</th>
                    <th style={{ minWidth: "120px" }}>Challan No</th>
                    <th style={{ minWidth: "120px" }}>Challan Date/Time</th>
                    <th>Item Name</th>
                    <th style={{ minWidth: "70px" }}>Challan Qty.</th>
                    {/* <th>Pending Qty.</th> */}
                    {/* <th>Vehicle Type</th> */}
                    <th style={{ minWidth: "120px" }}>Unloading Time</th>
                    <th>Region</th>
                    <th>Area</th>
                    <th>Territory</th>
                  </tr>
                </thead>

                <tbody>
                  {gridData?.map((item, index) => {
                    return (
                      <tr key={index}>
                        {/* 
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
                                itemSlectedHandler(e.target.checked, index, gridData)
                              );
                            }}
                          />
                        </td>
                        */}
                        <td>{index + 1}</td>
                        <td>{item?.soldToPartnerName}</td>
                        <td>{item?.shipToPartnerName}</td>
                        <td style={{ width: "80px" }}>
                          {item?.shipToPartnerAddress}
                        </td>
                        <td>{item?.deliveryCode}</td>
                        <td className="text-center">
                          {moment(item?.challanTime).format(
                            "YYYY-MM-DD hh:mm A"
                          )}
                        </td>
                        <td>{item?.itemName}</td>
                        <td className="text-center">{item?.numQuantity}</td>
                        {/* <td>{item?.pendingQty}</td> */}
                        {/* <td>{item?.address}</td> */}
                        <td className="text-center">
                          {moment(item?.unloadingTime).format(
                            "YYYY-MM-DD hh:mm A"
                          )}
                        </td>
                        <td>{item?.region}</td>
                        <td>{item?.area}</td>
                        <td>{item?.territory}</td>
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
