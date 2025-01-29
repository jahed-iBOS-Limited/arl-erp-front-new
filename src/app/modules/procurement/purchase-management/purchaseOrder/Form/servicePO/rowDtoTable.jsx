import React, { useState } from "react";
import Select from "react-select";
import customStyles from "../../../../../selectCustomStyle";
import IDelete from "../../../../../_helper/_helperIcons/_delete";
import { IInput } from "../../../../../_helper/_input";
import IViewModal from "../../../../../_helper/_viewModal";
import ViewForm from "../../View/viewForm";
import { validateDigit } from "../../../../../_helper/validateDigit";
import { rowDtoDynamicHandler } from "../../utils";
import LastPriceDetails from "../../../../../financialManagement/invoiceManagementSystem/approvebillregister/supplerInvoiceView/LastPriceDetails";

const RowDtoTable = ({
  isWithoutRef,
  rowDto,
  remover,
  uomDDL,
  setRowDto,
  values,
}) => {
  const [isShowModal, setIsShowModal] = useState(false);
  const [currentRowData] = useState("");
  const [currentIndex] = useState(null);
  const [orderQtyCheck, setOrderQtyCheck] = useState(false);

  const setAllOrderQty = (orderQtyCheck) => {
    // set every row orderQty = restofQty
    // we use rowDtoHandler because this function will set orderQty, and also calculate net amount
    rowDto.forEach((item, index) => {
      rowDtoDynamicHandler(
        "orderQty",
        orderQtyCheck ? item?.restofQty : 0,
        index,
        rowDto,
        setRowDto
      );
    });
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const [currentItem, setCurrentItem] = useState("");

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
                <th style={{ width: "150px" }}>Description</th>
                 <th>Cost Element</th>
                {isWithoutRef && <th>Ref Qty.</th>}
                {isWithoutRef && <th>Rest Qty.</th>}
                <th className="po_custom_width">
                  {isWithoutRef && (
                    <input
                      style={{ transform: "translateY(3px)" }}
                      type="checkbox"
                      defaultChecked={orderQtyCheck}
                      onChange={(e) => {
                        setOrderQtyCheck(!orderQtyCheck);
                        setAllOrderQty(!orderQtyCheck);
                      }}
                    />
                  )}
                  Order Qty.
                </th>
                <th className="po_custom_width">Basic Price</th>
                <th>Last Price</th>
                <th>Vat (%)</th>
                <th>Vat Amount</th>
                <th>Total Vat</th>
                {/* <th>Price Structure</th> */}
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
                  {/* <td className="text-center align-middle">
                    {" "}
                    {item?.item?.code}{" "}
                  </td> */}
                  <td className="">{item?.item?.itemName}</td>
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
                      defaultValue={
                        item?.selectedUom || { value: "", label: "" }
                      }
                      isSearchable={true}
                      styles={customStyles}
                      // options={uomDDL}
                      options={item?.item?.convertedUomName}
                      placeholder="UoM"
                      isDisabled
                    />
                  </td>
                  <td className="disabled-feedback disable-border">
                    <IInput
                      value={rowDto[index]?.desc}
                      name="desc"
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
                    />
                  </td>
                  <td className="text-center align-middle">
                    {values?.isTransfer ? item?.costElement?.label : item?.costElementTwo?.label}
                  </td>
                  {isWithoutRef && (
                    <td className="text-center align-middle">
                      {item?.refQty || 0}
                    </td>
                  )}
                  {isWithoutRef && (
                    <td
                      onClick={(e) =>
                        rowDtoDynamicHandler(
                          "orderQty",
                          item?.restofQty || 0,
                          index,
                          rowDto,
                          setRowDto
                        )
                      }
                      className="text-center align-middle pointer"
                    >
                      <span style={{ color: "blue" }}>
                        {item?.restofQty || 0}
                      </span>
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
                      // max={item?.referenceNo && item?.restofQty}
                      type="tel"
                      min="0"
                      onChange={(e) => {
                        let validNum = validateDigit(e.target.value);

                        if (validNum > item?.restofQty && item?.referenceNo) {
                          alert(`Maximum ${item?.restofQty}`);
                          validNum = "";
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
                  <td
                    style={{ width: "120px" }}
                    className="disabled-feedback disable-border"
                  >
                    <IInput
                      value={rowDto[index]?.basicPrice}
                      name="basicPrice"
                      type="tel"
                      min="0"
                      required
                      placeholder="Basic Price"
                      onChange={(e) => {
                        const validNum = validateDigit(e.target.value);

                        rowDtoDynamicHandler(
                          "basicPrice",
                          validNum,
                          index,
                          rowDto,
                          setRowDto
                        );
                      }}
                    />
                  </td>
                  <td className="text-center align-middle">
                    <div
                      onClick={(e) => {
                        setCurrentItem(item);
                        handlePopoverOpen(e);
                      }}
                      className="text-primary pointer"
                    >
                      {item?.lastPrice}
                    </div>
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
                      disabled={!rowDto[index]?.basicPrice}
                      required
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
                  {/* <td
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
                  </td> */}
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
          <LastPriceDetails
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            currentItem={currentItem?.item}
          />
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
