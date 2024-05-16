import React from "react";

const RowDtoTable = ({ rowDto }) => {
  return (
    <div className="mt-2">
      {rowDto?.length > 0 && (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Item Code</th>
                  <th>Item Name</th>
                  <th>Location</th>
                  <th>Stock Type</th>
                  <th>Ref. Qty.</th>
                  <th>Cancel Qty.</th>

                  {/* <th>Quantity</th> */}
                </tr>
              </thead>
              <tbody>
                {rowDto?.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center align-middle"> {index + 1} </td>
                    <td className="text-center align-middle">
                      {" "}
                      {item?.itemCode}{" "}
                    </td>
                    <td className="">{item?.itemName}</td>
                    <td className="text-center align-middle">
                      {item?.locationName}
                    </td>
                    <td className="text-center align-middle">
                      {item.stockTypeName}
                    </td>
                    <td className="text-center align-middle">{item?.refQty}</td>
                    <td className="text-center align-middle">
                      {" "}
                      {item?.restQty}
                    </td>

                    {/* <td  className="text-center align-middle">
                   {item.refQty}
                  </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default RowDtoTable;
