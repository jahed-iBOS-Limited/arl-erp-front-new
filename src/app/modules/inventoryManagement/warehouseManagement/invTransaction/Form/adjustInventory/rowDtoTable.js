import React from "react";
import IDelete from "../../../../../_helper/_helperIcons/_delete";
import { IInput } from "../../../../../_helper/_input";
const RowDtoTable = ({
  rowDto,
  remover,
  locationTypeDDL,
  stockDDL,
  rowDtoHandler,
  setRowDto,
  values,
  landingData,
}) => {
  return (
    <div className="mt-2 invTable">
      {rowDto?.length > 0 && (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-bordered inv-table">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Item Code</th>
                  <th>Item Name</th>
                  <th>Uom</th>
                  <th>Location</th>
                  {/* <th>Stock Type</th> */}
                  <th>Current Stock</th>
                  {/* <th>Blocked Stock Qty</th> */}
                  <th>Quantity</th>
                  <th>Action</th>
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
                    <td className="">{item?.uoMname}</td>
                    <td
                      className="text-center align-middle"
                      style={{ width: "200px" }}
                    >
                      {item?.location?.label}
                      {/* <Select
                    onChange={(valueOption) => {
                      rowDtoHandler(
                        "location",
                        {
                          value: valueOption?.value,
                          label: valueOption?.label,
                        },
                        index
                      );
                      getItemQtyforAdjustInv(profileData.accountId, selectedBusinessUnit.value,landingData?.plant?.value,
                        landingData?.warehouse?.value,values.transType.label,item?.itemId,valueOption?.value,item.stockType.value, rowDtoHandler, index)
                    }}
                    defaultValue={
                      item?.location || ""
                    }
                    isSearchable={true}
                    styles={customStyles}
                    options={locationTypeDDL}
                    placeholder="Location"
                  /> */}
                    </td>
                    {/* <td className="disabled-feedback disable-border" style={{ width: "150px" }}>
                <Select
                    onChange={(valueOption) => {
                      rowDtoHandler(
                        "stockType",
                        {
                          value: valueOption?.value,
                          label: valueOption?.label,
                        },
                        index
                      );
                      getItemQtyforAdjustInv(profileData.accountId, selectedBusinessUnit.value,landingData?.plant?.value,
                        landingData?.warehouse?.value,values.transType.label,item?.itemId,item?.location.value,valueOption?.value, rowDtoHandler, index)
                    }}
                    defaultValue={
                      item?.stockType || ""
                    }
                    isSearchable={true}
                    styles={customStyles}
                    options={stockDDL}
                    placeholder="Stock"
                  />
                </td> */}
                    {/* <td className="text-center align-middle"> {item?.blockStockQty} </td> */}
                    <td className="text-center align-middle">
                      {" "}
                      {item?.openStockQty}{" "}
                    </td>
                    <td
                      style={{ width: "100px" }}
                      className="disabled-feedback disable-border"
                    >
                      <IInput
                        value={rowDto[index]?.quantity}
                        name="quantity"
                        type="number"
                        placeholder="Quantity"
                        required
                        onChange={(e) => {
                          rowDtoHandler("quantity", e.target.value, index);
                        }}
                        step="any"
                      />
                    </td>
                    <td className="text-center align-middle">
                      <IDelete remover={remover} id={index} />
                    </td>
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
