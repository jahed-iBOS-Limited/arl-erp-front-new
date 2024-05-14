/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import IDelete from "../../../../../_helper/_helperIcons/_delete";
import IView from "../../../../../_helper/_helperIcons/_view";
import InputField from "../../../../../_helper/_inputField";
import IViewModal from "../../../../../_helper/_viewModal";
import ViewForm from "../../View/viewForm";
import { updatePriceStructure } from "../../helper";
import { toast } from "react-toastify";
import { QuantityCheck } from "../../../../../_helper/_QuantityCheck";
import { validateDigit } from "../../../../../_helper/validateDigit";
import { IInput } from "../../../../../_helper/_input";

const RowDtoTable = ({
  isWithoutRef,
  rowDto,
  remover,
  rowDtoHandler,
  setRowDto,
  values,
  viewPage,
}) => {
  const [isShowModal, setIsShowModal] = useState(false);
  const [currentRowData, setCurrentRowData] = useState("");
  const [currentIndex, setCurrentIndex] = useState(null);

  return (
    <div>
      {rowDto.length > 0 && (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-bordered global-table mt-3 po-table">
              <thead>
                <tr>
                  <th>SL</th>
                  {isWithoutRef && <th style={{ width: "150px" }}>Ref No.</th>}
                  <th style={{ width: "80px" }}>Item Code</th>
                  <th style={{ width: "150px" }}>Item Name</th>
                  <th style={{ width: "70px" }}>UoM</th>
                  <th style={{ width: "150px" }}>Description</th>
                  <th>PO Qty</th>
                  <th>Received Qty</th>
                  <th className="po_custom_width">Previous Return Quantity</th>
                  <th className="po_custom_width">Return Qty.</th>
                  <th className="po_custom_width">Basic Price</th>
                  <th>Vat</th>
                  <th>Vat Amount</th>
                  {/* <th>Price Structure</th> */}
                  <th>Net Value</th>
                  {!viewPage && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {rowDto?.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center align-middle"> {index + 1} </td>
                    {isWithoutRef && (
                      <td className="">{item?.referenceNo?.label || "NA"}</td>
                    )}
                    <td className="align-middle">{item?.item?.code}</td>
                    <td className="align-middle">{item?.item?.itemName}</td>
                    <td className="text-center align-middle">
                      {item?.selectedUom?.label}
                    </td>
                    <td className="text-center align-middle">{item?.desc}</td>
                    <td className="text-center align-middle">
                      {item?.poQuantity}
                    </td>
                    <td className="text-center align-middle">
                      {item?.restofQty}
                    </td>
                    <td className="text-center align-middle">
                      {item?.invReturnQty || 0}
                    </td>
                    <td className="disabled-feedback disable-border">
                      {/* this field is for return qty, but we save this for orderQty as back end API accept as orderQty */}
                      <InputField
                        value={rowDto[index]?.orderQty}
                        name="orderQty"
                        type="tel"
                        min="0"
                        required
                        // max={item?.referenceNo && item?.restofQty}
                        // max={
                        //   !item?.newItem
                        //     ? item?.restofQty + item?.initOrderQty
                        //     : item?.restofQty
                        // }
                        onChange={(e) => {
                          let validNum = validateDigit(e.target.value);

                          // let condition = item?.restofQty - item?.invReturnQty

                          // if (validNum > condition) {
                          //   alert(
                          //     `Maximum ${
                          //       condition
                          //     }`
                          //   );
                          //   validNum = "";
                          // }

                          let condition = !item?.newItem
                            ? item?.restofQty -
                              item?.invReturnQty +
                              item?.initOrderQty
                            : item?.restofQty - item?.invReturnQty;

                          if (+validNum > condition) {
                            alert(
                              `Maximum ${
                                !item?.newItem
                                  ? item?.restofQty -
                                    item?.invReturnQty +
                                    item?.initOrderQty
                                  : item?.restofQty - item?.invReturnQty
                              }`
                            );
                            validNum = !item?.newItem ? item?.initOrderQty : 0;
                          }

                          rowDtoHandler("orderQty", validNum, index);
                          // updatePriceStructure(
                          //   validNum,
                          //   item?.basicPrice,
                          //   rowDto,
                          //   setRowDto,
                          //   index
                          // );
                        }}
                        disabled={viewPage}
                      />
                    </td>
                    <td className="disabled-feedback disable-border">
                      <InputField
                        value={rowDto[index]?.basicPrice}
                        name="basicPrice"
                        type="tel"
                        min="0"
                        required
                        onChange={(e) => {
                          let validNum = validateDigit(e.target.value);

                          rowDtoHandler("basicPrice", validNum, index);
                          // updatePriceStructure(
                          //   item?.orderQty,
                          //   validNum,
                          //   rowDto,
                          //   setRowDto,
                          //   index
                          // );
                        }}
                        disabled={true}
                      />
                    </td>
                    <td
                      className="text-center align-middle"
                      style={{ width: "100px" }}
                    >
                      <IInput
                        value={rowDto[index]?.vat}
                        name="vat"
                        type="tel"
                        min="0"
                        required
                        onChange={(e) => {
                          const validNum = validateDigit(e.target.value);
                          rowDtoHandler("vat", validNum, index);
                        }}
                      />
                    </td>
                    <td className="text-center align-middle">
                      {item?.vatAmount.toFixed(4) || 0}
                    </td>
                    {/* <td className="text-center align-middle">
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
                  </td> */}
                    <td className="text-center align-middle">
                      {item?.netValue || 0}
                    </td>
                    {!viewPage && (
                      <td className="text-center align-middle">
                        <IDelete
                          remover={remover}
                          // id={item?.item?.value}
                          id={item}
                        />
                      </td>
                    )}
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
