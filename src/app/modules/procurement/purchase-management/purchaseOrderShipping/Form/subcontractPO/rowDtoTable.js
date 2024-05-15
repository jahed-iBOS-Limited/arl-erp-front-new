import React, { useState } from "react";
import Select from "react-select";
import customStyles from "../../../../../selectCustomStyle";
import IDelete from "../../../../../_helper/_helperIcons/_delete";
import IView from "../../../../../_helper/_helperIcons/_view";
import { IInput } from "../../../../../_helper/_input";
import IViewModal from "../../../../../_helper/_viewModal";
import ViewForm from "../../View/viewForm";
import { updatePriceStructure } from "../../helper";
import { toast } from "react-toastify";
import { validateDigit } from "../../../../../_helper/validateDigit";

const RowDtoTable = ({
  isWithoutRef,
  rowDto,
  remover,
  uomDDL,
  rowDtoHandler,
  setRowDto,
  values,
}) => {
  const [isShowModal, setIsShowModal] = useState(false);
  const [currentRowData, setCurrentRowData] = useState("");
  const [currentIndex, setCurrentIndex] = useState(null);

  return (
    <div>
      {rowDto?.length > 0 && (
        <>
          <div className="table-responsive">
          <table className="table table-striped table-bordered global-table mt-3">
            <thead>
              <tr>
                <th>SL</th>
                {isWithoutRef && <th>Ref No.</th>}
                <th style={{ width: "150px" }}>Code</th>
                <th style={{ width: "150px" }}>Item</th>
                <th style={{ width: "70px" }}>UoM</th>
                <th style={{ width: "150px" }}>Description</th>
                {isWithoutRef && <th>Ref Qty.</th>}
                {isWithoutRef && <th>Rest Qty.</th>}
                <th className="po_custom_width">Order Qty.</th>
                <th className="po_custom_width">Basic Price</th>
                <th>Price Structure</th>
                {/* <th>BOM</th> */}
                <th>Net Value</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rowDto?.map((item, index) => (
                <tr key={index}>
                  <td className="text-center align-middle"> {index + 1} </td>
                  {isWithoutRef && (
                    <td className="align-middle">
                      {item?.referenceNo?.label || "NA"}
                    </td>
                  )}
                  <td className="text-center align-middle">
                    {" "}
                    {item?.item?.code}{" "}
                  </td>
                  <td className="text-center align-middle">
                    {item?.item?.label}
                  </td>
                  <td style={{ width: "100px" }}>
                    <Select
                      onChange={(valueOption) => {
                        rowDtoHandler(
                          "selectedUom",
                          {
                            value: valueOption?.value,
                            label: valueOption?.label,
                          },
                          index
                        );
                      }}
                      defaultValue={
                        item?.selectedUom || { value: "", label: "" }
                      }
                      isSearchable={true}
                      styles={customStyles}
                      // options={uomDDL}
                      options={item?.item?.convertedUomName}
                      placeholder="UoM"
                    />
                  </td>
                  <td className="disabled-feedback disable-border">
                    <IInput
                      value={rowDto[index]?.desc}
                      name="desc"
                      required
                      placeholder="Description"
                      onChange={(e) => {
                        rowDtoHandler("desc", e.target.value, index);
                      }}
                    />
                  </td>
                  {isWithoutRef && (
                    <td className="text-center align-middle">
                      {item?.refQty || 0}
                    </td>
                  )}
                  {isWithoutRef && (
                    <td className="text-center align-middle">
                      {item?.restofQty || 0}
                    </td>
                  )}
                  <td
                    style={{ width: "90px" }}
                    className="disabled-feedback disable-border"
                  >
                    <IInput
                      value={rowDto[index]?.orderQty}
                      name="orderQty"
                      required
                      placeholder="Order Qty"
                      max={item?.referenceNo && item?.restofQty}
                      type="tel"
                      min="0"
                      onChange={(e) => {
                        let validNum = validateDigit(e.target.value);

                        if (validNum > item?.restofQty && item?.referenceNo) {
                          alert(`Maximum ${item?.restofQty}`);
                          validNum = "";
                        }

                        rowDtoHandler("orderQty", validNum, index);
                        // calculateNetValue(
                        //   validNum * item?.basicPrice,
                        //   item?.priceStructure,
                        //   rowDto,
                        //   index
                        // );
                        updatePriceStructure(
                          validNum,
                          item?.basicPrice,
                          rowDto,
                          setRowDto,
                          index
                        );
                      }}
                    />
                  </td>
                  <td
                    style={{ width: "120px" }}
                    className="disabled-feedback disable-border"
                  >
                    <IInput
                      value={rowDto[index]?.basicPrice}
                      name="basicPrice"
                      required
                      type="tel"
                      min="0"
                      placeholder="Basic Price"
                      onChange={(e) => {
                        const validNum = validateDigit(e.target.value);
                        rowDtoHandler("basicPrice", validNum, index);
                        // calculateNetValue
                        updatePriceStructure(
                          item?.orderQty,
                          validNum,
                          rowDto,
                          setRowDto,
                          index
                        );
                      }}
                    />
                  </td>
                  <td
                    style={{ width: "80px" }}
                    className="text-center align-middle"
                  >
                    <IView
                      clickHandler={() => {
                        if (item?.orderQty < 1 || item.basicPrice < 1) {
                          toast.warn(
                            "Not allowed without order qty and basic price"
                          );
                        } else {
                          setCurrentRowData(item);
                          setIsShowModal(true);
                          setCurrentIndex(index);
                        }
                      }}
                    />
                  </td>

                  <td className="text-center align-middle">
                    {item?.netValue || 0}
                  </td>
                  <td className="text-center align-middle">
                    <IDelete
                      remover={remover}
                      // id={item?.item?.value}
                      id={item}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <IViewModal
            title="Price structure"
            show={isShowModal}
            onHide={() => setIsShowModal(false)}
          >
            <ViewForm
              currentIndex={currentIndex}
              currentRowData={currentRowData}
              setRowDto={setRowDto}
              rowDto={rowDto}
              values={values}
              setIsShowModal={setIsShowModal}
            />
          </IViewModal>
        </>
      )}
    </div>
  );
};

export default RowDtoTable;
