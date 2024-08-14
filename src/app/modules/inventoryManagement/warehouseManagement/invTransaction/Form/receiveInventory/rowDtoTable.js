import React from "react";
import Select from "react-select";
import customStyles from "../../../../../selectCustomStyle";
import IDelete from "../../../../../_helper/_helperIcons/_delete";
import InputField from "../../../../../_helper/_inputField";
import IHistory from "../../../../../_helper/_helperIcons/_history";
import IViewModal from "../../../../../_helper/_viewModal";
import ItemInformation from "./view/ItemInformation";
import { toast } from "react-toastify";

export const getUpdatedFirstLevelList = (list, key, index, value) => {
  const prevList = [...list];
  let sl = prevList[index];
  sl[key] = value;
  return prevList;
};

const RowDtoTable = ({
  rowDto,
  remover,
  rowDtoHandler,
  setRowDto,
  //locationTypeDDL,
  stockDDL,
  values,
  landingData,
  setInLineRowItemView,
  inLineRowItemView,
  setFieldValue,
  isWorkable
}) => {
  const getSerialList = (row) => {
    const list = [];
    for (let i = 0; i < +row?.quantity; i++) {
      list.push({ ...row });
    }
    return list;
  };

  const onRowSerialClick = (item, index) => {
    if (+item?.quantity <= 0) return toast.warn("quantity is zero");

    const serialList = item?.serialList?.length > 0 && item?.serialList?.length === +item?.quantity ? item?.serialList : getSerialList(item);
    const updateRowDto = getUpdatedFirstLevelList(rowDto, "serialList", index, serialList);
    setRowDto(updateRowDto);
    setInLineRowItemView({
      isView: true,
      data: item,
      rowIndex: index,
    });
  };

  return (
    <div className="mt-2">
      {rowDto?.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-bordered inv-table">
            <thead>
              <tr>
                <th>SL</th>
                <th>Item Code</th>
                <th>Item Name</th>
                <th>Uom</th>
                {values?.refType?.label === "PO (Purchase Order)" && (
                  <>
                    <th>Ref. Qty.</th>
                    <th>Rest Qty.</th>
                    <th>Vat</th>
                  </>
                )}
                {values?.refType?.label === "Inventory Request" && (
                  <>
                    <th>Request Qty.</th>
                    <th>Issue Qty.</th>
                    <th>Return Qty</th>
                  </>
                )}

                <th>Location</th>
                <th>Bin Number</th>
                {/* <th>Stock Type</th> */}
                <th>Quantity</th>
                {values?.refType?.value === 1 && landingData?.warehouse?.isPOS && (
                  <>
                    <th>MRP</th>
                    <th>Sales Rate</th>
                    <th>Expired</th>
                  </>
                )}
                {values?.refType?.value === 1 && values?.refNo?.refTypeId === 1 && <th>Price</th>}
                {values?.refType?.label === "NA (Without Reference)" && (
                  <>
                    <th>Rate</th>
                    <th>Amount</th>{" "}
                  </>
                )}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rowDto?.map((item, index) => (
                <tr key={index}>
                  <td className="text-center align-middle"> {index + 1} </td>
                  <td className="text-center align-middle"> {item?.itemCode} </td>
                  <td className="">
                    {(item?.isSerialMaintain && isWorkable) && (
                      <IHistory
                        title={"Info"}
                        styles={{ margin: "5px" }}
                        clickHandler={() => {
                          onRowSerialClick(item, index);
                        }}
                      />
                    )}
                    {item?.itemName}
                  </td>
                  <td className="">{item?.uoMname}</td>
                  {values?.refType?.label === "PO (Purchase Order)" && (
                    <>
                      <td className="text-center align-middle">{item?.refQty}</td>
                      <td className="text-center align-middle"> {item?.restQty || 0} </td>
                      <td className="text-center align-middle"> {item?.vatValue || 0} </td>
                    </>
                  )}
                  {values?.refType?.label === "Inventory Request" && (
                    <>
                      <td className="text-center align-middle">{item?.refQty}</td>
                      <td className="text-center align-middle"> {item?.issueQuantity || 0} </td>
                      <td className="text-center align-middle"> {item?.returnQuntity || 0} </td>
                    </>
                  )}
                  <td className="text-center align-middle" style={{ width: "150px" }}>
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
                      }}
                      value={item?.location || ""}
                      isSearchable={true}
                      styles={customStyles}
                      options={item.locationddl}
                      placeholder="Location"
                    />
                  </td>
                  <td className="text-center align-middle"> {item?.location?.binNumber}</td>
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
                      }}MRP
                      isSearchable={true}
                      styles={customStyles}
                      options={stockDDL}
                      placeholder="Stock"
                    />
                  </td> */}
                  <td style={{ width: "100px" }} className="disabled-feedback disable-border">
                    <InputField
                      value={rowDto[index]?.quantity}
                      name="quantity"
                      type="number"
                      placeholder="Quantity"
                      required
                      onChange={(e) => {
                        if (values.refType.label !== "NA (Without Reference)") {
                          //user can take 5% extra qty
                          let calcWithFivePercent = (item?.refQty * 5) / 100;
                          let canTakeQty = (item?.restQty + calcWithFivePercent).toFixed(4);
                          if (+e.target.value > canTakeQty) {
                            alert(`Max ${canTakeQty}`);
                            return null;
                          }
                        }
                        rowDtoHandler("quantity", e.target.value, index);
                      }}
                      min={0.1}
                      step="any"
                      max={
                        values.refType.label === "NA (Without Reference)"
                          ? item.quantity
                          : values.refType.label === "Inventory Request"
                          ? item?.issueQuantity - item?.returnQuntity
                          : item?.restQty
                      }
                    />
                  </td>
                  {values?.refType?.value === 1 && landingData?.warehouse?.isPOS && (
                    <>
                      <td style={{ width: "100px" }} className="disabled-feedback disable-border">
                        <InputField
                          value={rowDto[index]?.mrpRate}
                          name="mrpRate"
                          type="number"
                          placeholder="MRP"
                          onChange={(e) => {
                            rowDtoHandler("mrpRate", e.target.value, index);
                          }}
                          min={0.1}
                          step="any"
                        />
                      </td>
                      <td style={{ width: "100px" }} className="disabled-feedback disable-border">
                        <InputField
                          value={rowDto[index]?.salesRate}
                          name="salesRate"
                          type="number"
                          placeholder="Sales Rate"
                          onChange={(e) => {
                            rowDtoHandler("salesRate", e.target.value, index);
                          }}
                          min={0.1}
                          step="any"
                        />
                      </td>
                      <td style={{ width: "100px" }} className="disabled-feedback disable-border">
                        <InputField
                          value={item.expiredDate}
                          placeholder="Expired Date"
                          name="expiredDate"
                          type="date"
                          onChange={(e) => {
                            rowDtoHandler("expiredDate", e.target.value, index);
                          }}
                        />
                      </td>
                    </>
                  )}
                  {values?.refType?.value === 1 && values?.refNo?.refTypeId === 1 && (
                    <>
                      <td style={{ width: "100px" }} className="disabled-feedback disable-border">
                        <InputField
                          value={rowDto[index]?.mrpRate}
                          name="mrpRate"
                          type="number"
                          placeholder="MRP"
                          onChange={(e) => {
                            rowDtoHandler("mrpRate", e.target.value, index);
                          }}
                          min={0.1}
                          step="any"
                        />
                      </td>
                    </>
                  )}
                  {values.refType.label === "NA (Without Reference)" && (
                    <>
                      <td style={{ width: "100px" }} className="disabled-feedback disable-border">
                        <input
                          value={rowDto[index]?.baseValue}
                          name="baseValue"
                          type="number"
                          placeholder="Base Value"
                          step="any"
                          required
                          onChange={(e) => {
                            rowDtoHandler("baseValue", e.target.value, index);
                          }}
                          min="0"
                          //max={item?.restQty}
                        />
                      </td>
                      <td className="text-center align-middle">{item?.quantity * item?.baseValue}</td>{" "}
                    </>
                  )}
                  <td className="text-center align-middle">
                    <IDelete remover={remover} id={index} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <IViewModal
        show={inLineRowItemView?.isView}
        onHide={() =>
          setInLineRowItemView((prev) => ({
            ...prev,
            isView: false,
          }))
        }
      >
        <ItemInformation
          currRowInfo={inLineRowItemView}
          setFieldValue={setFieldValue}
          values={values}
          rowDto={rowDto}
          setRowDto={setRowDto}
        />
      </IViewModal>
    </div>
  );
};

export default RowDtoTable;
