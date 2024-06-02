import React, { Fragment, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { validateDigit } from "../../../../_helper/validateDigit";
import IView from "../../../../_helper/_helperIcons/_view";
import { IInput } from "../../../../_helper/_input";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import { attachment_action } from "./helper";

const NegotiationCreateRowDtoTable = ({
  negotiationItemList,
  setNegotiationItemList,
  discountPercentage,
  transportCost,
  othersCost,
}) => {
  const [myIndex, setMyIndex] = useState(null);
  const [, setLoading] = useState();

  const dispatch = useDispatch();
  const inputCVFile = useRef(null);
  // eslint-disable-next-line no-unused-vars
  const [attachmentFile, setAttachmentFile] = useState("");
  // const [attachmentFileName, setAttachmentFileName] = useState("");
  const onButtonCVClick = (e) => {
    e.stopPropagation();
    inputCVFile.current.click();
  };

  const rowDtoHandler = (name, index, value) => {
    const data = [...negotiationItemList?.objSupplierRow];
    if (name === "negotiationRate") {
      data[index][name] = value;
      data[index]["numAmount"] =
        (value || 0) * (data[index]["numRequestQuantity"] || 0);
    } else if (name === "strRemarks") {
      data[index][name] = value;
    } else {
      data[index][name] = value;
    }
    setNegotiationItemList({ ...negotiationItemList });
  };

  const getSubTotal = (data) => {
    if (!data?.length) return 0;
    let total = data?.reduce((total, curr) => total + curr?.numAmount, 0);
    return total || 0;
  };

  const getDiscount = (getSubTotal, discountPercentage, data) => {
    if (!discountPercentage) {
      return 0;
    }
    return (discountPercentage / 100) * getSubTotal(data) || 0;
  };

  return (
    <div>
      {negotiationItemList?.objSupplierRow?.length > 0 && (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-bordered mt-3 global-table po-table">
              <thead>
                <tr>
                  <th style={{ fontSize: "10px" }}>SL</th>
                  <th style={{ width: "100px", fontSize: "10px" }}>
                    Item Code
                  </th>
                  <th style={{ fontSize: "10px" }}>Item Name</th>
                  {negotiationItemList?.objSupplierRow[0]?.intItemCategoryId ===
                  624 ? (
                    <>
                      <th style={{ fontSize: "10px" }}>Part No</th>
                      <th style={{ fontSize: "10px" }}>Drawing No</th>
                    </>
                  ) : null}
                  <th style={{ fontSize: "10px" }}>Item Remarks</th>
                  <th style={{ fontSize: "10px" }}>UOM</th>
                  <th style={{ fontSize: "10px" }}>Quantity</th>
                  <th className="po_custom_width" style={{ fontSize: "10px" }}>
                    Rate
                  </th>
                  <th className="po_custom_width" style={{ fontSize: "10px" }}>
                    Last Negotiated Rate
                  </th>
                  <th className="po_custom_width" style={{ fontSize: "10px" }}>
                    Negotiated Rate
                  </th>
                  <th className="po_custom_width" style={{ fontSize: "10px" }}>
                    Amount
                  </th>
                  <th className="po_custom_width" style={{ fontSize: "10px" }}>
                    Remarks
                  </th>
                  <th style={{ fontSize: "10px" }}>Attachment</th>
                </tr>
              </thead>
              <tbody>
                {negotiationItemList?.objSupplierRow?.map((item, index) => {
                  //getUomDDL(item?.item?.value);

                  return (
                    <>
                      {(index === 0 || item.strShippingItemSubHead !== negotiationItemList?.objSupplierRow[index - 1].strShippingItemSubHead) && item?.strShippingItemSubHead ? (
                        <tr style={{background:'#ADD8E6', paddingTop: '5px', paddingBottom: '5px' }}>
                            <td colSpan={negotiationItemList?.objSupplierRow[0]?.intItemCategoryId === 624 ? '14' : '12'}>
                                <div style={{fontSize: '20'}} className="text-bold text-center">
                                    {item.strShippingItemSubHead}
                                </div>
                            </td>
                        </tr>
                      ) : null}

                    <tr key={index}>
                      <td className="text-center align-middle">
                        {" "}
                        {index + 1}{" "}
                      </td>
                      <td className="align-middle" style={{ fontSize: "10px" }}>
                        {item?.strItemCode}
                      </td>
                      <td className="align-middle" style={{ fontSize: "10px" }}>
                        {item?.strItemName}
                      </td>
                      {item?.intItemCategoryId === 624 ? (
                        <>
                          <td> {item?.strPartNo} </td>
                          <td> {item?.strDrawingNo} </td>
                        </>
                      ) : null}
                      <td>{item?.strDescription}</td>
                      <td>{item?.strUoMname}</td>
                      <td style={{ width: "150px" }}>
                        {item?.numRequestQuantity}
                      </td>
                      <td style={{ width: "100px" }}>{item?.numRate || 0}</td>
                      <td className="text-center align-middle">
                        {item?.numNegotiationRate}
                      </td>
                      <td
                        className="disabled-feedback disable-border"
                        style={{ width: "100px" }}
                      >
                        <IInput
                          value={
                            negotiationItemList?.objSupplierRow[index]
                              ?.negotiationRate || 0
                          }
                          name="negotiationRate"
                          type="tel"
                          min="0"
                          onChange={(e) => {
                            let validNum = validateDigit(e.target.value);
                            rowDtoHandler("negotiationRate", index, validNum);
                          }}
                        />
                      </td>
                      <td className="text-right align-middle">
                        {item?.numAmount}
                      </td>
                      <td
                        className="disabled-feedback disable-border"
                        style={{ width: "100px" }}
                      >
                        <IInput
                          value={item?.strRemarks || ""}
                          name="strRemarks"
                          type="text"
                          onChange={(e) => {
                            rowDtoHandler("strRemarks", index, e.target.value);
                          }}
                        />
                      </td>
                      <td>
                        <div className="d-flex justify-content-around align-items-center">
                          {/* {item.attachment ? ( */}
                          <div
                            className={"image-upload-box"}
                            onClick={onButtonCVClick}
                            style={{
                              cursor: "pointer",
                              position: "relative",
                              height: "25px",
                            }}
                          >
                            <input
                              onChange={(e) => {
                                // e.stopPropagation();
                                if (e.target.files?.[0]) {
                                  attachment_action(e.target.files, setLoading)
                                    .then((data) => {
                                      setAttachmentFile(data?.[0]?.id);
                                      rowDtoHandler(
                                        "strAttachment",
                                        myIndex,
                                        data?.[0]?.id
                                      );
                                    })
                                    .catch((error) => {
                                      setAttachmentFile("");
                                    });
                                }
                              }}
                              type="file"
                              ref={inputCVFile}
                              id="file"
                              style={{ display: "none" }}
                            />
                            {/* {!item?.vesselAttachment &&  */}
                            <div className="">
                              <i
                                class="fa fa-upload"
                                aria-hidden="true"
                                onClick={(e) => {
                                  setMyIndex(index);
                                }}
                              ></i>
                            </div>
                          </div>
                          {/* } */}
                          {item?.strAttachment && (
                            <IView
                              title={"Attachment"}
                              classes={"text-primary"}
                              clickHandler={() => {
                                dispatch(
                                  getDownlloadFileView_Action(
                                    item?.strAttachment
                                  )
                                );
                              }}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                    </>
                    
                  );
                })}
                <tr>
                  <td
                    colSpan={
                      negotiationItemList?.objSupplierRow[0]
                        ?.intItemCategoryId === 624
                        ? 11
                        : 9
                    }
                    className="text-right font-weight-bold "
                    style={{ fontSize: "12px" }}
                  >
                    Sub Total
                  </td>
                  <td
                    className="text-right font-weight-bold "
                    style={{ fontSize: "12px" }}
                  >
                    {(
                      getSubTotal(negotiationItemList?.objSupplierRow) || 0
                    ).toFixed(2)}
                  </td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td
                    colSpan={
                      negotiationItemList?.objSupplierRow[0]
                        ?.intItemCategoryId === 624
                        ? 11
                        : 9
                    }
                    className="text-right font-weight-bold "
                    style={{ fontSize: "12px" }}
                  >
                    Discount
                  </td>
                  <td
                    className="text-right font-weight-bold "
                    style={{ fontSize: "12px" }}
                  >
                    {`${getDiscount(
                      getSubTotal,
                      discountPercentage,
                      negotiationItemList?.objSupplierRow
                    ).toFixed(2)} (${discountPercentage || 0}%)`}
                  </td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td
                    colSpan={
                      negotiationItemList?.objSupplierRow[0]
                        ?.intItemCategoryId === 624
                        ? 11
                        : 9
                    }
                    className="text-right font-weight-bold "
                    style={{ fontSize: "12px" }}
                  >
                    Total After Discount
                  </td>
                  <td
                    className="text-right font-weight-bold "
                    style={{ fontSize: "12px" }}
                  >
                    {(
                      (getSubTotal(negotiationItemList?.objSupplierRow) || 0) -
                      (getDiscount(
                        getSubTotal,
                        discountPercentage,
                        negotiationItemList?.objSupplierRow
                      ) || 0)
                    ).toFixed(2)}
                  </td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td
                    colSpan={
                      negotiationItemList?.objSupplierRow[0]
                        ?.intItemCategoryId === 624
                        ? 11
                        : 9
                    }
                    className="text-right font-weight-bold "
                    style={{ fontSize: "12px" }}
                  >
                    Transportation
                  </td>
                  <td
                    className="text-right font-weight-bold "
                    style={{ fontSize: "12px" }}
                  >
                    {transportCost}
                  </td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td
                    colSpan={
                      negotiationItemList?.objSupplierRow[0]
                        ?.intItemCategoryId === 624
                        ? 11
                        : 9
                    }
                    className="text-right font-weight-bold "
                    style={{ fontSize: "12px" }}
                  >
                    Other Cost
                  </td>
                  <td
                    className="text-right font-weight-bold "
                    style={{ fontSize: "12px" }}
                  >
                    {othersCost}
                  </td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td
                    colSpan={
                      negotiationItemList?.objSupplierRow[0]
                        ?.intItemCategoryId === 624
                        ? 11
                        : 9
                    }
                    className="text-right font-weight-bold "
                    style={{ fontSize: "12px" }}
                  >
                    Grand Total
                  </td>
                  <td
                    className="text-right font-weight-bold "
                    style={{ fontSize: "12px" }}
                  >
                    {(
                      (getSubTotal(negotiationItemList?.objSupplierRow) || 0) -
                      (getDiscount(
                        getSubTotal,
                        discountPercentage,
                        negotiationItemList?.objSupplierRow
                      ) || 0) +
                      (+transportCost || 0) +
                      (+othersCost || 0)
                    ).toFixed(2)}
                  </td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default NegotiationCreateRowDtoTable;
