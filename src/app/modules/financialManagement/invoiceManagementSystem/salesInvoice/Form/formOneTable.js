import { Field } from "formik";
import React, { useState } from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import IViewModal from "../../../../_helper/_viewModal";
import DeliveryReport from "./deliveryReport/table";
import { ChallanListTable } from "./challanListTable";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loading from "../../../../_helper/_loading";

export const FormOneTable = ({ obj }) => {
  const { rowDto, allSelect, selectedAll, rowDtoHandler, values } = obj;
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  return (
    <>
      {rowDto?.length > 0 && (
        <div className="row">
          <div className="col-12">
            {[94, 175].includes(buId) ? (
              <TableOne
                obj={{ allSelect, selectedAll, rowDto, rowDtoHandler }}
              />
            ) : (
              <TableTwo
                obj={{
                  allSelect,
                  selectedAll,
                  rowDto,
                  rowDtoHandler,
                  values,
                  accId,
                  buId,
                }}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

const TableOne = ({ obj }) => {
  const { allSelect, selectedAll, rowDto, rowDtoHandler } = obj;

  let grandTotalDeliveredQtyCFT = 0;
  let grandTotalDeliveredQtyCUM = 0;
  let grandTotalAmount1 = 0;

  return (
    <>
      <table className="global-table table">
        <thead>
          <tr onClick={() => allSelect(!selectedAll())}>
            <th
              className="check-box"
              style={{
                width: "45px",
              }}
            >
              <input
                type="checkbox"
                style={{
                  marginRight: "4px",
                }}
                value={selectedAll()}
                checked={selectedAll()}
                onChange={() => {}}
              />
            </th>
            <th
              style={{
                width: "45px",
              }}
            >
              SL
            </th>
            <th>Date</th>
            <th>Item</th>
            <th>Total Delivery Qty (CFT)</th>
            <th>Total Delivery Qty (CUM)</th>

            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {rowDto?.map((item, index) => {
            grandTotalDeliveredQtyCFT += item.totalDeliveredQtyCFT;
            grandTotalDeliveredQtyCUM += item.totalDeliveredQtyCUM;
            grandTotalAmount1 += item.totalAmount;

            return (
              <tr
                key={index}
                style={
                  rowDto[index]?.presentStatus
                    ? {
                        backgroundColor: "#aacae3",
                      }
                    : {}
                }
                onClick={() => {
                  rowDtoHandler(
                    "presentStatus",
                    !rowDto[index]?.presentStatus,
                    index
                  );
                }}
              >
                <td className="text-center align-middle check-box">
                  <Field
                    type="checkbox"
                    name="presentStatus"
                    checked={rowDto[index]?.presentStatus}
                    value={rowDto[index]?.presentStatus}
                    onChange={(e) => {}}
                  />
                </td>
                <td className="text-center">{index + 1}</td>
                <td className="ml-2">{_dateFormatter(item?.deliveriDate)}</td>

                <td className="ml-2">{item?.itemName}</td>
                <td className="text-right">
                  {item?.totalDeliveredQtyCFT.toFixed(2)}
                </td>
                <td className="text-right">
                  {item?.totalDeliveredQtyCUM.toFixed(2)}
                </td>

                <td className="text-right">
                  {_fixedPoint(item?.totalAmount, true)}
                </td>
              </tr>
            );
          })}
          <tr
            style={{
              fontWeight: "bold",
              textAlign: "right",
            }}
          >
            <td colSpan={4}> Total </td>

            <td>{_fixedPoint(grandTotalDeliveredQtyCFT, true)}</td>
            <td>{_fixedPoint(grandTotalDeliveredQtyCUM, true)}</td>
            <td>{_fixedPoint(grandTotalAmount1, true)}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

const TableTwo = ({ obj }) => {
  const {
    allSelect,
    selectedAll,
    rowDto,
    rowDtoHandler,
    values,
    accId,
    buId,
  } = obj;
  const [isDeliveryReportModal, setIsDeliveryReportModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [open, setOpen] = useState(false);
  const [challanList, getChallanList, loading] = useAxiosGet();

  let grandTotalDeliveredQty = 0,
    grandTotalAmount = 0,
    totalReturnQty = 0,
    totalReturnAmount = 0,
    totalSalesAmount = 0,
    totalNetQty = 0;

  const getChallanBySO = (item) => {
    getChallanList(
      `/wms/ShopBySales/GetDeliveryInfoBasedOnSalesOrder?accountId=${accId}&businessUnitId=${buId}&salesOrderId=${item?.orderId}`,
      (resData) => {
        if (resData?.length > 0) {
          setOpen(true);
        } else {
          toast.warn("Data not found");
        }
      }
    );
  };

  return (
    <>
      {loading && <Loading />}
      <table className="global-table table">
        <thead>
          <tr onClick={() => allSelect(!selectedAll())}>
            <th className="check-box" style={{ width: "45px" }}>
              <input
                type="checkbox"
                style={{
                  marginRight: "4px",
                }}
                value={selectedAll()}
                checked={selectedAll()}
              />
            </th>
            <th style={{ width: "45px" }}>SL</th>
            {values?.invoiceType?.value === 1 && <th>Delivery Order</th>}
            <th>Challan No</th>
            <th>Challan Date</th>
            <th>Primary Qty</th>
            <th>Total Amount</th>
            <th>Return Quantity</th>
            <th>Return Amount</th>
            <th>Sales Amount</th>
            <th>Net Qty</th>
          </tr>
        </thead>
        <tbody>
          {rowDto?.map((item, index) => {
            grandTotalDeliveredQty += item.totalDeliveredQty;
            grandTotalAmount += item.totalAmount;
            totalReturnQty += item.returnQuantity;
            totalReturnAmount += item.returnAmount;
            totalSalesAmount += item?.totalAmount - item?.returnAmount;
            totalNetQty += item?.totalDeliveredQty - item?.returnQuantity;
            return (
              <tr
                className="cursor-pointer"
                key={index}
                style={
                  rowDto[index]?.presentStatus
                    ? { backgroundColor: "#aacae3" }
                    : {}
                }
                onClick={() => {
                  rowDtoHandler(
                    "presentStatus",
                    !rowDto[index]?.presentStatus,
                    index
                  );
                }}
              >
                <td className="text-center align-middle check-box">
                  <Field
                    type="checkbox"
                    name="presentStatus"
                    checked={rowDto[index]?.presentStatus}
                    onChange={(e) => {}}
                  />
                </td>
                <td className="text-center">{index + 1}</td>
                {values?.invoiceType?.value === 1 && (
                  <td className="ml-2">
                    <span
                      style={{
                        borderBottom: "1px solid blue",
                        cursor: "pointer",
                        color: "blue",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(item);
                        getChallanBySO(item);
                      }}
                    >
                      {item?.orderCode}
                    </span>
                  </td>
                )}
                <td className="ml-2">
                  <span
                    style={{
                      borderBottom: "1px solid blue",
                      cursor: "pointer",
                      color: "blue",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDeliveryReportModal(true);
                      setSelectedItem(item);
                    }}
                  >
                    {item?.deliveryCode}
                  </span>
                </td>
                <td className="ml-2">{_dateFormatter(item?.deliveryDate)}</td>
                <td className="text-right">{item?.totalDeliveredQty}</td>
                <td className="text-right">{item?.totalAmount.toFixed(2)}</td>

                <td className="text-right">{item?.returnQuantity}</td>
                <td className="text-right">{item?.returnAmount}</td>
                <td className="text-right">
                  {item?.totalAmount - item?.returnAmount}
                </td>
                <td className="text-right">
                  {_fixedPoint(
                    item?.totalDeliveredQty - item?.returnQuantity,
                    true
                  )}
                </td>
              </tr>
            );
          })}
          <tr style={{ fontWeight: "bold", textAlign: "right" }}>
            <td colSpan={values?.invoiceType?.value === 1 ? 5 : 4}> Total </td>
            <td>{_fixedPoint(grandTotalDeliveredQty, true)}</td>
            <td>{_fixedPoint(grandTotalAmount, true)}</td>
            <td>{_fixedPoint(totalReturnQty, true)}</td>
            <td>{_fixedPoint(totalReturnAmount, true)}</td>
            <td>{_fixedPoint(totalSalesAmount, true)}</td>
            <td>{_fixedPoint(totalNetQty, true)}</td>
          </tr>
        </tbody>
      </table>

      {// Delivery Report Modal
      isDeliveryReportModal && (
        <IViewModal
          show={isDeliveryReportModal}
          onHide={() => {
            setIsDeliveryReportModal(false);
            setSelectedItem({});
          }}
        >
          <DeliveryReport id={selectedItem?.deliveryId} />
        </IViewModal>
      )}
      {}
      <IViewModal
        title={`Challan List, SO: ${selectedItem?.orderCode}`}
        show={open}
        onHide={() => {
          setOpen(false);
          setSelectedItem({});
        }}
      >
        <ChallanListTable obj={{ values, challanList }} />
      </IViewModal>
    </>
  );
};
