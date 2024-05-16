import React from "react";
import Select from "react-select";
import customStyles from "../../../../../selectCustomStyle";
import IDelete from "../../../../../_helper/_helperIcons/_delete";
import { IInput } from "../../../../../_helper/_input";
import { getItemQtyforRemoveInv } from "./helper";
import { shallowEqual, useSelector } from "react-redux";

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
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  return (
    <div>
      {rowDto?.length > 0 && (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Item Code</th>
                  <th>Item Name</th>
                  {/* <th>Ref. Qty.</th>
              <th>Rest Qty.</th> */}
                  <th>Location</th>
                  {/* <th>Stock Type</th> */}
                  <th>Available Stock</th>
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
                    {/* <td className="text-center align-middle">
                {item?.refQty}
                </td>
                <td className="text-center align-middle">
                  {" "}
                  {item?.restQty || 0}{" "}
                </td> */}
                    <td
                      className="text-center align-middle"
                      style={{ width: "200px" }}
                    >
                      <Select
                        onChange={(valueOption) => {
                          rowDtoHandler(
                            "location",
                            {
                              value: valueOption?.value,
                              label: valueOption?.label,
                            },
                            index
                          );
                          getItemQtyforRemoveInv(
                            profileData.accountId,
                            selectedBusinessUnit.value,
                            landingData?.plant?.value,
                            landingData?.warehouse?.value,
                            values.transType.label,
                            item?.itemId,
                            valueOption?.value,
                            item.stockType.value,
                            rowDtoHandler,
                            index
                          );
                        }}
                        defaultValue={item?.location || ""}
                        isDisabled={true}
                        isSearchable={true}
                        styles={customStyles}
                        options={locationTypeDDL}
                        placeholder="Location"
                      />
                    </td>
                    {/* <td className="disabled-feedback disable-border">
                <Select
                    onChange={(valueOption) => {
                      getItemQtyforRemoveInv(profileData.accountId, selectedBusinessUnit.value,landingData?.plant?.value,
                        landingData?.warehouse?.value,values.transType.label,item?.itemId,item?.location.value,valueOption?.value, rowDtoHandler, index)
                        rowDtoHandler(
                          "stockType",
                          {
                            value: valueOption?.value,
                            label: valueOption?.label,
                          },
                          index
                        );
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
                    <td className="text-center align-middle">
                      {" "}
                      {item?.avaibleStock}{" "}
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
                        min="0"
                        // max={item?.restQty}
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
