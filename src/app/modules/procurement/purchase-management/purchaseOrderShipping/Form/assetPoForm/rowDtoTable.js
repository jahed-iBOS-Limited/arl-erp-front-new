import React, { useState } from "react";
import Select from "react-select";
import customStyles from "../../../../../selectCustomStyle";
import { validateDigit } from "../../../../../_helper/validateDigit";
import IDelete from "../../../../../_helper/_helperIcons/_delete";
import { IInput } from "../../../../../_helper/_input";
import IViewModal from "../../../../../_helper/_viewModal";
import { rowDtoDynamicHandler } from "../../utils";
import ViewForm from "../../View/viewForm";
import LastPriceDetails from "../../../../../financialManagement/invoiceManagementSystem/approvebillregister/supplerInvoiceView/LastPriceDetails";

const RowDtoTable = ({
  isWithoutRef,
  rowDto,
  remover,
  // uomDDL,
  setRowDto,
  values,
  selectedBusinessUnit,
  profileData,
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

  //const [, setUomDDL] = useState([]);

  // const getUomDDL = (itemId) => {
  //   getUOMList(
  //     itemId,
  //     selectedBusinessUnit?.value,
  //     profileData?.accountId,
  //     setUomDDL
  //   );
  // };

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
          <table className="table table-striped table-bordered mt-3 global-table po-table">
            <thead>
              <tr>
                <th>SL</th>
                {isWithoutRef && <th>Ref No.</th>}
                {/* <th style={{ width: "150px" }}>Code</th> */}
                <th style={{ width: "150px" }}>Item</th>
                <th style={{ width: "70px" }}>UoM</th>
                <th style={{ width: "150px" }}>Description</th>
                {isWithoutRef && <th>Ref. Qty.</th>}
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
                {/* <th>Price Structure</th>               */}
                <th>Net Value</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rowDto?.map((item, index) => {
                return (
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
                        value={item?.selectedUom || {}}
                        isDisabled
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
                        // defaultValue={item?.selectedUom || ""}
                        isSearchable={true}
                        styles={customStyles}
                        options={item?.item?.convertedUomName}
                        placeholder="UoM"
                      />
                    </td>
                    <td
                      className="disabled-feedback disable-border"
                      style={{ width: "60px" }}
                    >
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
                    {isWithoutRef && (
                      <td className="text-center align-middle">
                        {item?.refQty || 0}
                      </td>
                    )}
                    {isWithoutRef && (
                      <td
                        className="text-center align-middle pointer"
                        onClick={(e) =>
                          rowDtoDynamicHandler(
                            "orderQty",
                            item?.restofQty || 0,
                            index,
                            rowDto,
                            setRowDto
                          )
                        }
                      >
                        <span style={{ color: "blue" }}>
                          {item?.restofQty || 0}
                        </span>
                      </td>
                    )}
                    <td
                      className="disabled-feedback disable-border"
                      style={{ width: "100px" }}
                    >
                      <IInput
                        value={rowDto[index]?.orderQty}
                        name="orderQty"
                        type="tel"
                        min="0"
                        required
                        max={item?.restofQty}
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
                      className="disabled-feedback disable-border"
                      style={{ width: "100px" }}
                    >
                      <IInput
                        value={rowDto[index]?.basicPrice}
                        name="basicPrice"
                        type="tel"
                        min="0"
                        required
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
                        disabled={!rowDto[index]?.basicPrice}
                        min="0"
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
                    <td className="text-center align-middle">
                      <IDelete
                        remover={remover}
                        // id={item?.item?.value}
                        id={item}
                      />
                    </td>
                  </tr>
                );
              })}
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
