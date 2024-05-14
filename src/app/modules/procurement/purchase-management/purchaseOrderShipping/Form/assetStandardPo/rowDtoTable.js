import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Select from "react-select";
import LastPriceDetails from "../../../../../financialManagement/invoiceManagementSystem/approvebillregister/supplerInvoiceView/LastPriceDetails";
import customStyles from "../../../../../selectCustomStyle";
import { validateDigit } from "../../../../../_helper/validateDigit";
import IDelete from "../../../../../_helper/_helperIcons/_delete";
import IView from "../../../../../_helper/_helperIcons/_view";
import { IInput } from "../../../../../_helper/_input";
import Loading from "../../../../../_helper/_loading";
import { getDownlloadFileView_Action } from "../../../../../_helper/_redux/Actions";
import IViewModal from "../../../../../_helper/_viewModal";
import { getAttachmentId } from "../../../comparativeStatement/requestForQuotation/helper";
import { rowDtoDynamicHandler } from "../../utils";
import ViewForm from "../../View/viewForm";

const RowDtoTable = ({
  isWithoutRef,
  rowDto,
  remover,
  setRowDto,
  values,
  selectedBusinessUnit,
  profileData,
  itemId,
  setItemId,
  porefType,
  VatUpdateHandler,
  netValueHandler,
  getRunTimeGrossDiscount,
  setFieldValue
}) => {
  const [isShowModal, setIsShowModal] = useState(false);
  const [currentRowData] = useState("");
  const [currentIndex] = useState(null);
  const [orderQtyCheck, setOrderQtyCheck] = useState(false);
  const [basicPriceCheck, setBasicPriceCheck] = useState(false);
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
 

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
  const setAllBasicPrice = (basicPriceCheck) => {
      rowDto.forEach((item, index) => {
        console.log("basci Item", item)
        rowDtoDynamicHandler(
          "basicPrice",
          basicPriceCheck ? item?.negotiationRate : 0,
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
      {loading && <Loading />}
      {rowDto?.length > 0 && (
        <>
          <div className="table-responsive">
          <table className="table table-striped table-bordered mt-3 global-table po-table">
            <thead>
              <tr>
                <th style={{ fontSize: "10px" }}>SL</th>
                {isWithoutRef && <th style={{ fontSize: "10px" }}>Ref No.</th>}
                {/* <th style={{ width: "150px" }}>Code</th> */}
                <th style={{ width: "150px", fontSize: "10px" }}>Item</th>
                {rowDto[0]?.itemCategoryId === 624 ? 
                <>
                  <th style={{ width: "70px", fontSize: "10px" }}>Part No</th>
                  <th style={{ width: "70px", fontSize: "10px" }}>Drawing No</th>
                </> : null
                }
                <th style={{ width: "70px", fontSize: "10px" }}>UoM</th>
                <th style={{ width: "150px", fontSize: "10px" }}>
                  Description
                </th>
                {isWithoutRef && (
                  <th style={{ fontSize: "10px" }}>Ref. Qty.</th>
                )}
                {isWithoutRef && (
                  <th style={{ fontSize: "10px" }}>Rest Qty.</th>
                )}
                <th className="po_custom_width" style={{ fontSize: "10px" }}>
                  {isWithoutRef && (
                    <input
                      style={{ transform: "translateY(3px)" }}
                      type="checkbox"
                      defaultChecked={orderQtyCheck}
                      onChange={(e) => {
                        setOrderQtyCheck(!orderQtyCheck);
                        setAllOrderQty(!orderQtyCheck);
                        setFieldValue("discount", getRunTimeGrossDiscount(rowDto))
                      }}
                    />
                  )}
                  Order Qty.
                </th>
                <th className="po_custom_width" style={{ fontSize: "10px" }}>
                {isWithoutRef && (
                    <input
                      style={{ transform: "translateY(3px)" }}
                      type="checkbox"
                      defaultChecked={basicPriceCheck}
                      onChange={(e) => {
                        setBasicPriceCheck(!basicPriceCheck);
                        setAllBasicPrice(!basicPriceCheck);
                        setFieldValue("discount", getRunTimeGrossDiscount(rowDto))
                      }}
                    />
                  )}
                  Basic Price
                </th>
                <th style={{ fontSize: "10px" }}>Last Price</th>
                {porefType === 2 &&
                  <th>PR Attach.</th>
                }                
                {/* <th style={{ fontSize: "10px" }}>Price Structure</th> */}
                <th style={{ fontSize: "10px" }}>Net Value</th>
                <th style={{ fontSize: "10px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {rowDto?.map((item, index) => {
                //getUomDDL(item?.item?.value);

                return (
                  <tr key={index}>
                    <td className="text-center align-middle"> {index + 1} </td>
                    {isWithoutRef && (
                      <td className="align-middle" style={{ fontSize: "10px" }}>
                        {item?.referenceNo?.label || "NA"}
                      </td>
                    )}
                    {/* <td className="align-middle">{item?.item?.code}</td> */}
                    <td className="align-middle" style={{ fontSize: "10px" }}>
                      {item?.item?.itemName}
                    </td>
                    {item?.itemCategoryId === 624 ? 
                    <>
                      <td>{item?.partNo}</td>
                      <td>{item?.drawingNo}</td>
                    </> : null
                    }
                    <td style={{ width: "100px" }}>
                      <Select
                        value={item?.selectedUom || {}}
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
                        styles={customStyles}
                        isSearchable={true}
                        options={item?.item?.convertedUomName}
                        isDisabled
                        placeholder="UoM"
                      />
                    </td>
                    <td
                      className="disabled-feedback disable-border"
                      style={{ fontSize: "10px" }}
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
                      className="disabled-feedback disable-border"
                      style={{ width: "100px" }}
                    >
                      <IInput
                        value={rowDto[index]?.orderQty}
                        name="orderQty"
                        type="tel"
                        min="0"
                        required
                        // max={item?.referenceNo && item?.restofQty}
                        onChange={(e) => {
                          let validNum = validateDigit(e.target.value);

                          // if (validNum > item?.restofQty && item?.referenceNo) {
                          //   alert(`Maximum ${item?.restofQty}`);
                          //   validNum = "";
                          // }
                          rowDtoDynamicHandler(
                            "orderQty",
                            validNum,
                            index,
                            rowDto,
                            setRowDto
                          );
                          setFieldValue("discount", getRunTimeGrossDiscount(rowDto))
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
                          setFieldValue("discount", getRunTimeGrossDiscount(rowDto))
                        }}
                        disabled={porefType === 1}
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
                    {/* <td
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
                        //disabled={porefType === 1}
                      />
                    </td> */}
                    {/* <td
                      className="text-center align-middle"
                      style={{ width: "100px" }}
                    >
                      <IInput
                        value={rowDto[index]?.userGivenVatAmount}
                        name="userGivenVatAmount"
                        type="tel"
                        disabled={!rowDto[index]?.basicPrice}
                        min="0"
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
                    </td> */}
                    {/* <td className="text-center align-middle">
                      {item?.vatAmount?.toFixed(2) || 0}
                    </td> */}
                    {porefType === 2 &&
                      <td className="text-center align-middle">
                        <IView 
                          clickHandler={ ()=>{
                            getAttachmentId(item?.referenceNo?.label, item?.item?.value, setLoading, (attch)=>{
                            dispatch(
                              getDownlloadFileView_Action(
                                  attch?.strAttachment
                                )
                              );
                            })
                          }}
                        />
                      </td> 
                    }                                       

                    <td className="text-center align-middle">
                      {/* {item?.netValue || 0  } */}
                      {item?.netValue?.toFixed(2)}
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
