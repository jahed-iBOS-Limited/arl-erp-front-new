import React, { useState } from "react";
import Select from "react-select";
import customStyles from "../../../../../selectCustomStyle";
import IDelete from "../../../../../_helper/_helperIcons/_delete";
import { IInput } from "../../../../../_helper/_input";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import IViewModal from "../../../../../_helper/_viewModal";
import ReferenceViewModal from "./referenceView";

const RowDtoTable = ({
  rowDto,
  remover,
  stockDDL,
  locationTypeDDL,
  rowDtoHandler,
  setRowDto,
  values,
}) => {
  console.log(rowDto);
  const [isShowRefView, setIsShowRefView] = useState(false);
  const [refData, setRefData] = useState(null);
  return (
    <div className="mt-2">
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
                  <th>Ref. Qty.</th>
                  <th>Rest Qty.</th>
                  <th>Current Stock</th>
                  <th>Location</th>
                  <th>Bin Number</th>
                  {/* <th>Stock Type</th> */}
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
                    <td className="text-left">{item?.itemName}</td>
                    <td className="text-left">{item?.uoMname}</td>
                    <td className="text-center align-middle">{item?.refQty}</td>
                    <td className="text-center align-middle">
                      {" "}
                      {item?.restQty || 0}{" "}
                    </td>
                    <td className="text-center align-middle">
                      {" "}
                      {item?.availableStock}
                    </td>
                    <td
                      className="text-center align-middle"
                      style={{ width: "150px" }}
                    >
                      <Select
                        onChange={(valueOption) => {
                          rowDtoHandler(
                            "location",
                            {
                              value: valueOption?.value,
                              label: valueOption?.label,
                              binNumber: valueOption?.binNumber,
                            },
                            index
                          );
                          rowDtoHandler(
                            "availableStock",
                            valueOption?.currentStock,
                            index
                          );
                        }}
                        value={item?.location || ""}
                        isSearchable={true}
                        styles={customStyles}
                        options={item?.LocationDDL}
                        placeholder="Location"
                      />
                    </td>
                    <td className="text-center align-middle">
                      {" "}
                      {item?.location?.binNumber}
                    </td>
                    {/* <td className="disabled-feedback disable-border">
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
                          // if (
                          //   e.target.value >=0 &&
                          //   e.target.value <= Number(item?.availableStock)
                          // ) {
                          //   rowDtoHandler("quantity", e.target.value, index);
                          // }
                          let validQty =
                            item?.restQty > item?.availableStock
                              ? item?.availableStock
                              : item?.restQty;
                          if (e.target.value && e.target.value > validQty) {
                            alert(`Accepted qty is ${validQty}`);
                            rowDtoHandler("quantity", "", index);
                          } else {
                            rowDtoHandler("quantity", e.target.value, index);
                          }
                        }}
                        min={0.00001}
                        step="any"
                        // max={item?.restQty > item?.availableStock ? item?.availableStock : item?.restQty }
                      />
                    </td>
                    <td className="text-center align-middle">
                      <div className="d-flex justify-content-around">
                        <IDelete
                          remover={remover}
                          id={item?.itemId}
                          style={{ fontSize: "14px" }}
                        />
                        {item?.issueRef?.length ? (
                          <OverlayTrigger
                            overlay={<Tooltip>Reference</Tooltip>}
                          >
                            <span>
                              <i
                                style={{ fontSize: "14px" }}
                                onClick={() => {
                                  setRefData(item?.issueRef);
                                  setIsShowRefView(true);
                                }}
                                className="fa fa-camera-retro"
                                aria-hidden="true"
                              ></i>
                            </span>
                          </OverlayTrigger>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <IViewModal
            show={isShowRefView}
            modelSize="sm"
            onHide={() => {
              setIsShowRefView(false);
              setRefData(null);
            }}
          >
            <ReferenceViewModal refData={refData} />
          </IViewModal>
        </>
      )}
    </div>
  );
};

export default RowDtoTable;
