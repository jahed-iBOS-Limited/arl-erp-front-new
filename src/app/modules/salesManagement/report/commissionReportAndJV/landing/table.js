/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import InputField from "../../../../_helper/_inputField";
import { toast } from "react-toastify";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IApproval from "../../../../_helper/_helperIcons/_approval";
import ICon from "../../../../chartering/_chartinghelper/icons/_icon";

const header = (buId, values) => {
  const typeId = values?.type?.value;
  const H_one = [
    "SL",
    "Customer ID",
    "Customer Code",
    "Customer Name",
    "Address",
    "Region",
    "Area",
    "Territory",
    "Target Qty",
    "Delivery Quantity",
    "Achievement",
    "Commission",
  ];

  const H_two = [
    "SL",
    "Customer ID",
    "Customer Code",
    "Customer Name",
    "Address",
    "Party Status",
    "Payment Type",
    "Region",
    "Area",
    "Territory",
    "Target Qty",
    "Delivery Quantity",
    "Achievement",
    "Commission",
  ];

  const H_three = [
    "SL",
    "Customer ID",
    "Customer Code",
    "Customer Name",
    "Address",
    "Party Status",
    "Payment Type",
    "Region",
    "Area",
    "Territory",
    "Target Qty",
    "Delivery Quantity",
    "Achievement",
    "Commission",
    "ShipToPartner Id",
    "ShipToPartner Name"
  ];

  if (buId === 144) {
    return H_one;
  }else if (typeId === 26) {
    return H_three;
  } else if (typeId !== 8) {
    return H_two;
  } else if (typeId === 8) {
    return H_two.toSpliced(13, 0, "Commission Rate");
  }
};

const CommissionReportAndJVTable = ({ obj }) => {
  const {
    buId,
    values,
    rowData,
    allSelect,
    selectedAll,
    editCommission,
    rowDataHandler,
  } = obj;

  return (
    <>
      {rowData?.length > 0 && (
        <table
          className={
            "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
          }
        >
          <thead>
            <tr
              onClick={() => allSelect(!selectedAll())}
              className="cursor-pointer"
            >
              {![26].includes(values?.type?.value) && ( <th style={{ width: "40px" }}>
                <input
                  type="checkbox"
                  value={selectedAll()}
                  checked={selectedAll()}
                  onChange={() => {}}
                />
              </th>)}
              {header(buId, values).map((th, index) => {
                return <th key={index}> {th} </th>;
              })}
              {values?.type?.value === 5 && (
                <>
                  {/* <th>Narration</th> */}
                  <th>Action</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {rowData?.map((item, index) => {
              // totalQty += item?.deliveryQty;
              // totalCommission += item?.commissiontaka;
              // totalTargetQty += item?.targetQty;
              // totalAchievement += item?.achievement;

              return (
                <tr className="cursor-pointer" key={index}>
                 {![26].includes(values?.type?.value) && ( <td
                    onClick={() => {
                      rowDataHandler(index, "isSelected", !item.isSelected);
                    }}
                    className="text-center"
                    style={
                      item?.isSelected
                        ? {
                            backgroundColor: "#aacae3",
                            width: "40px",
                          }
                        : { width: "40px" }
                    }
                  >
                    <input
                      type="checkbox"
                      value={item?.isSelected}
                      checked={item?.isSelected}
                      onChange={() => {}}
                    />
                  </td>)}
                  <td style={{ width: "40px" }} className="text-center">
                    {index + 1}
                  </td>
                  <td>{item?.customerId}</td>
                  <td>{item?.customerCode}</td>
                  <td>{item?.customerName}</td>
                  <td>{item?.customerAddress}</td>
                  {buId !== 144 && (
                    <>
                      <td>{item?.partyStatus}</td>
                      <td>{item?.paymentType}</td>
                    </>
                  )}

                  <td>{item?.region}</td>
                  <td>{item?.area}</td>
                  <td>{item?.territory}</td>
                  <td className="text-right">
                    {_fixedPoint(item?.targetQty, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.deliveryQty, true, 4)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.achievement, true)}
                  </td>
                  {values?.type?.value === 8 && (
                    <td className="text-right">
                      {_fixedPoint(item?.commissionRate, true, 4)}
                    </td>
                  )}

                  <td className="text-right" style={{ width: "150px" }}>
                    {item?.isEdit ? (
                      <InputField
                        name="commissiontaka"
                        value={item?.commissiontaka}
                        type="number"
                        onChange={(e) => {
                          if (item?.constCom < e?.target?.value) {
                            toast.warn("You can't increase the value!");
                          } else {
                            rowDataHandler(
                              index,
                              "commissiontaka",
                              +e?.target?.value
                            );
                          }
                        }}
                      />
                    ) : (
                      _fixedPoint(item?.commissiontaka, true, 4)
                    )}
                  </td>

                  {values?.type?.value === 5 && (
                    <>
                      <td style={{ width: "40px" }}>
                        <div className="d-flex justify-content-around">
                          {!item?.isEdit ? (
                            <span
                              onClick={() => {
                                rowDataHandler(index, "isEdit", true);
                              }}
                            >
                              <IEdit title="Edit Commission Amount" />
                            </span>
                          ) : (
                            <>
                              <span
                                onClick={() => {
                                  editCommission(index, item, "done");
                                }}
                              >
                                <IApproval title="Done" />
                              </span>
                              <span
                                onClick={() => {
                                  editCommission(index, item, "cancel");
                                }}
                              >
                                <ICon title="Cancel">
                                  <i class="fas fa-times-circle"></i>{" "}
                                </ICon>
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                    </>
                  )}
                  {values?.type?.value === 26 && (
                    <>
                    <td className="text-center">
                      {item?.intShipToPartnerid}
                    </td>
                    <td className="">
                    {item?.strShipToPartnername}
                  </td>
                    </>
                  )}
                </tr>
              );
            })}
            <tr style={{ textAlign: "right", fontWeight: "bold" }}>
              <td colSpan={values?.type?.value === 26 ? 10 : buId === 144 ? 9 : 11} className="text-right">
                Total
              </td>
              <td>
                {_fixedPoint(
                  rowData?.reduce((acc, cur) => acc + cur?.targetQty, 0),
                  true
                )}
              </td>
              <td>
                {_fixedPoint(
                  rowData?.reduce((acc, cur) => acc + cur?.deliveryQty, 0),
                  true
                )}
              </td>
              <td>
                {_fixedPoint(
                  rowData?.reduce((acc, cur) => acc + cur?.achievement, 0),
                  true
                )}
              </td>
              {values?.type?.value === 8 && <td></td>}
              <td>
                {_fixedPoint(
                  rowData?.reduce((acc, cur) => acc + cur?.commissiontaka, 0),
                  true
                )}
              </td>
              {values?.type?.value === 5 && <td></td>}
            </tr>
          </tbody>
        </table>
      )}
    </>
  );
};

export default CommissionReportAndJVTable;
