/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import ICard from "../../../../../_helper/_card";
import Loading from "../../../../../_helper/_loading";
import useAxiosGet from "../../../../../_helper/customHooks/useAxiosGet";
import { getDownlloadFileView_Action } from "../../../../../_helper/_redux/Actions";
import { toast } from "react-toastify";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

function ViewDamDeliveryBill({ billRegisterId, billTypeId, values }) {
  // get profile data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state.authData, shallowEqual);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)

  const [gridData, getGridData, loadingGridData] = useAxiosGet();

  useEffect(() => {
    const url = `/tms/LigterLoadUnload/GetLighterDumpToTruckDeliveryDetails?billRegisterId=${billRegisterId}&IntBillTypeId=${billTypeId}`;
    getGridData(url);
  }, [accId, buId]);

  let totalDampToTruckQty = 0,
    totalAmount = 0,
    totalLaborQty = 0,
    totalLaborAmount = 0,
    totalOtherCost = 0;

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{}}
        onSubmit={(values) => {}}
      >
        {() => (
          <ICard title={`View ${values?.billType?.label}`}>
            {(loadingGridData || loading) && <Loading />}

            <form className="form form-label-right ">
              <div className="table-responsive">
                <table className="table global-table">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Buffer Name</th>
                      <th>Supplier Name</th>
                      <th>Lighter Vessel</th>
                      <th>Damp to Truck Qty</th>
                      <th>Damp to Truck Rate</th>
                      <th>Amount</th>
                      <th>Labor Qty</th>
                      <th>Labor Rate</th>
                      <th>Labor Amount</th>
                      <th>Other Cost</th>
                      <th>Action</th>
                      {/* <th>Attachment</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {gridData?.map((item, index) => {
                      totalDampToTruckQty += item?.dumpToTruckQnt;
                      totalAmount += item?.dumpToTruckAmount;
                      totalLaborQty += item?.dailyLaboureQnt;
                      totalLaborAmount += item?.labourAmount;
                      totalOtherCost += item?.dumpOtherCost;
                      return (
                        <>
                          <tr key={index}>
                            <td
                              style={{ width: "30px" }}
                              className="text-center"
                            >
                              {index + 1}
                            </td>
                            <td>{item?.shipPointName}</td>
                            <td>{item?.supplierName}</td>
                            <td>{item?.lighterVesselName}</td>
                            <td className="text-right">
                              {item?.dumpToTruckQnt}
                            </td>
                            <td className="text-right">
                              {item?.dumpToTruckRate}
                            </td>
                            <td className="text-right">
                              {item?.dumpToTruckAmount}
                            </td>
                            <td className="text-right">
                              {item?.dailyLaboureQnt}
                            </td>
                            <td className="text-right">
                              {item?.dailyLaboureRate}
                            </td>
                            <td className="text-right">{item?.labourAmount}</td>
                            <td className="text-right">
                              {item?.dumpOtherCost}
                            </td>
                           {index === 0 && ( <td rowSpan={gridData?.length + 1} className="text-center">
                            <OverlayTrigger
                              overlay={
                                <Tooltip id="cs-icon">View Attachment</Tooltip>
                              }
                            >
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (item?.attachment) {
                                    dispatch(
                                      getDownlloadFileView_Action(
                                        item?.attachment,
                                        null,
                                        null,
                                        setLoading
                                      )
                                    );
                                  } else {
                                    toast.warn("No Attachment Found");
                                  }
                                }}
                                className="ml-2"
                              >
                                <i
                                  style={{ fontSize: "16px" }}
                                  className={`fa pointer fa-eye`}
                                  aria-hidden="true"
                                ></i>
                              </span>
                            </OverlayTrigger>
                          </td>)}
                          </tr>
                        </>
                      );
                    })}
                    <tr style={{ textAlign: "right", fontWeight: "bold" }}>
                      <td colSpan={4}>Total</td>
                      <td>{totalDampToTruckQty}</td>
                      <td> </td>
                      <td>{totalAmount}</td>
                      <td>{totalLaborQty}</td>
                      <td> </td>
                      <td>{totalLaborAmount}</td>
                      <td>{totalOtherCost}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </form>
          </ICard>
        )}
      </Formik>
    </>
  );
}

export default ViewDamDeliveryBill;
