import React, { useState } from "react";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { toast } from "react-toastify";
import IViewModal from "../../../../_helper/_viewModal";
import EditTable from "../challanPrintModal/editModal";
import Loading from "../../../../_helper/_loading";

function PendingTable({ rowDto, history }) {
  return (
    <>
      {rowDto?.length > 0 && (
        <div className="react-bootstrap-table table-responsive">
          <table className={"table table-striped table-bordered global-table "}>
            <thead>
              <tr>
                <th>SL</th>
                <th>Customer Name</th>
                <th>Upozila Name</th>
                <th>Item Name</th>
                <th>UoM Name</th>
                <th>Total Order Qty</th>
                <th>Total Pending Qty</th>
                <th>Alloted Qnt</th>
                <th>Item Rate</th>
                <th>Total Amount</th>
                <th>Remarks</th>
                <th style={{ width: "100px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {rowDto?.map((item, index) => {
                return (
                  <>
                    <tr key={index}>
                      <td style={{ width: "30px" }} className="text-center">
                        {index + 1}
                      </td>
                      <td>{item?.customerName}</td>
                      <td>{item?.upzilaName}</td>
                      <td>{item?.itemName}</td>
                      <td>{item?.uomName}</td>
                      <td className="text-right">{item?.totalOrderQty}</td>
                      <td className="text-right">{item?.totalPendingQty}</td>
                      <td className="text-right">{item?.allotedQty}</td>
                      <td className="text-right">{item?.itemRate}</td>
                      <td className="text-right">{item?.totalAmount}</td>
                      <td>{item?.remarks}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-primary"
                          style={{
                            padding: "2px 5px",
                            fontSize: "12px",
                          }}
                          onClick={() => {
                            history.push({
                              pathname: `/sales-management/ordermanagement/partnerAllotmentChallan/create/${item?.allotmentId}`,
                              state: item,
                            });
                          }}
                        >
                          Challan Create
                        </button>
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export function PendingTableForModify({ rowDto, accId, buId }) {
  const [rowData, getRowData, loading, setRowData] = useAxiosGet();
  const [open, setOpen] = useState(false);

  return (
    <>
      {loading && <Loading />}
      {rowDto?.data?.length > 0 && (
        <div className="react-bootstrap-table table-responsive">
          <table className={"table table-striped table-bordered global-table "}>
            <thead>
              <tr>
                <th>SL</th>
                <th>Customer Name</th>
                <th>Delivery Address</th>
                <th>Bill Register Code</th>
                <th>Total Bag</th>
                <th>Total Qty</th>
                <th>Total Price</th>
                <th>Total Commission</th>
                <th style={{ width: "100px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {rowDto?.data?.map((item, index) => {
                return (
                  <>
                    <tr key={index}>
                      <td style={{ width: "30px" }} className="text-center">
                        {index + 1}
                      </td>
                      <td>{item?.soldToPartnerName}</td>
                      <td>{item?.deliveryAddress}</td>
                      <td>{item?.billRegisterCode}</td>
                      <td>{item?.totalBag}</td>
                      <td className="text-right">{item?.totalQuantity}</td>
                      <td className="text-right">{item?.totalprice}</td>
                      <td className="text-right">{item?.totalCommission}</td>
                      <td className="text-center">
                        <div className="d-flex justify-content-around">
                          <span>
                            <IEdit
                              onClick={() => {
                                // setDeliveryId(item?.secondaryDeliveryId);
                                getRowData(
                                  `/wms/SecondaryDelivery/SecondaryDeliveryUnApprovedBillByRegisterId?accountId=${accId}&businessUnitId=${buId}&billRegisterId=${item?.billRegisterId}`,
                                  (resData) => {
                                    if (resData?.data?.length) {
                                      setOpen(true);
                                    } else {
                                      toast.warn("Data not found!");
                                    }
                                  }
                                );
                              }}
                            />
                          </span>
                        </div>
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
          <IViewModal show={open} onHide={() => setOpen(false)}>
            <EditTable rowData={rowData} setRowData={setRowData} />
          </IViewModal>
        </div>
      )}
    </>
  );
}

export default PendingTable;
