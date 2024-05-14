import React, { useState } from "react";
import Select from "react-select";
import customStyles from "../../../../../selectCustomStyle";
import { validateDigit } from "../../../../../_helper/validateDigit";
import IDelete from "../../../../../_helper/_helperIcons/_delete";
import { IInput } from "../../../../../_helper/_input";
import IViewModal from "../../../../../_helper/_viewModal";
import ViewForm from "../../View/viewForm";
import { rowDtoDynamicHandler } from "../../utils";

const RowDtoTable = ({
  isWithoutRef,
  rowDto,
  remover,
  uomDDL,
  setRowDto,
  values,
  viewPage,
}) => {
  const [isShowModal, setIsShowModal] = useState(false);
  const [currentRowData] = useState("");
  const [currentIndex] = useState(null);

  return (
    <div>
      {rowDto?.length > 0 && (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-bordered global-table mt-3 po-table">
              <thead>
                <tr>
                  <th>SL</th>
                  {isWithoutRef && <th>Ref No.</th>}
                  {/* <th style={{ width: "150px" }}>Code</th> */}
                  <th style={{ width: "150px" }}>Item</th>
                  <th style={{ width: "70px" }}>UoM</th>
                  <th style={{ width: "150px" }}>Purchase Description</th>
                  {isWithoutRef && <th>Ref. Qty.</th>}
                  {isWithoutRef && <th>Rest Qty.</th>}
                  <th className="po_custom_width">Order Qty.</th>
                  <th className="po_custom_width">Basic Price</th>
                  <th className="po_custom_width" style={{ fontSize: "10px" }}>
                    Vat (%)
                  </th>
                  <th className="po_custom_width" style={{ fontSize: "10px" }}>
                    Vat Amount
                  </th>
                  <th>Total Vat</th>
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
                      <td className="align-middle">
                        {item?.referenceNo?.label || "NA"}
                      </td>
                    )}
                    {/* <td className="align-middle">{item?.item?.code}</td> */}
                    <td className="align-middle">{item?.item?.itemName}</td>
                    <td style={{ width: "100px" }}>
                      <Select
                        onChange={(valueOption) => {
                          rowDtoDynamicHandler(
                            "selectedUom",
                            {
                              value: valueOption?.value,
                              label: valueOption?.label,
                            },
                            index,
                            rowDto,
                            setRowDto
                          );
                        }}
                        defaultValue={item?.selectedUom || ""}
                        isSearchable={true}
                        styles={customStyles}
                        options={uomDDL}
                        placeholder="UoM"
                        isDisabled
                      />
                    </td>
                    <td className="disabled-feedback disable-border">
                      <IInput
                        value={rowDto[index]?.desc}
                        name="desc"
                        required
                        style={{ fontSize: "10px" }}
                        placeholder="Description"
                        onChange={(e) => {
                          rowDtoDynamicHandler(
                            "desc",
                            e.target.value,
                            index,
                            rowDto,
                            setRowDto
                          );
                        }}
                        disabled={viewPage}
                      />
                    </td>
                    {isWithoutRef && (
                      <td className="text-center align-middle">
                        {item?.item?.refQty || 0}
                      </td>
                    )}
                    {isWithoutRef && (
                      <td className="text-center align-middle">
                        {item?.restofQty || 0}
                      </td>
                    )}
                    <td className="disabled-feedback disable-border">
                      <IInput
                        disabled={viewPage}
                        value={rowDto[index]?.orderQty}
                        name="orderQty"
                        type="tel"
                        min="0"
                        // max={item?.referenceNo && item?.restofQty}
                        // max={
                        //   isWithoutRef
                        //     ? !item?.newItem
                        //       ? item?.restofQty + item?.initOrderQty
                        //       : item?.restofQty
                        //     : Infinity
                        // }
                        required
                        onChange={(e) => {
                          let validNum = validateDigit(e.target.value);

                          let condition = isWithoutRef
                            ? !item?.newItem
                              ? validNum > item?.restofQty + item?.initOrderQty
                              : validNum > item?.restofQty
                            : validNum > Infinity;

                          if (condition) {
                            alert(
                              `Maximum ${
                                !item?.newItem
                                  ? item?.restofQty + item?.initOrderQty
                                  : item?.restofQty
                              }`
                            );
                            validNum = !item?.newItem ? item?.initOrderQty : 0;
                          }

                          rowDtoDynamicHandler(
                            "orderQty",
                            validNum,
                            index,
                            rowDto,
                            setRowDto
                          );
                        }}
                      />
                    </td>
                    <td className="disabled-feedback disable-border">
                      <IInput
                        value={rowDto[index]?.basicPrice}
                        name="basicPrice"
                        type="tel"
                        min="0"
                        required
                        onChange={(e) => {
                          let validNum = validateDigit(e.target.value);

                          rowDtoDynamicHandler(
                            "basicPrice",
                            validNum,
                            index,
                            rowDto,
                            setRowDto
                          );
                        }}
                        disabled={viewPage}
                      />
                    </td>
                    <td className="text-center align-middle">
                      <IInput
                        value={rowDto[index]?.vat}
                        name="vat"
                        type="tel"
                        min="0"
                        disabled={!rowDto[index]?.basicPrice}
                        required
                        onChange={(e) => {
                          const validNum = validateDigit(e.target.value);
                          rowDtoDynamicHandler(
                            "vat",
                            validNum,
                            index,
                            rowDto,
                            setRowDto
                          );
                        }}
                      />
                    </td>
                    <td
                      className="text-center align-middle"
                      style={{ width: "100px" }}
                    >
                      <IInput
                        value={rowDto[index]?.userGivenVatAmount}
                        name="userGivenVatAmount"
                        type="tel"
                        min="0"
                        required
                        disabled={!rowDto[index]?.basicPrice}
                        onChange={(e) => {
                          const validNum = validateDigit(e.target.value);
                          rowDtoDynamicHandler(
                            "userGivenVatAmount",
                            validNum,
                            index,
                            rowDto,
                            setRowDto
                          );
                        }}
                      />
                    </td>
                    <td className="text-center align-middle">
                      {item?.vatAmount || 0}
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
