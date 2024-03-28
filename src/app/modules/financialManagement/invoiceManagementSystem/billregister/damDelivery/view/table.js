/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Formik } from "formik";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import ICard from "../../../../../_helper/_card";
import Loading from "../../../../../_helper/_loading";
import { getDownlloadFileView_Action } from "../../../../../_helper/_redux/Actions";
import useAxiosGet from "../../../../../_helper/customHooks/useAxiosGet";
import { toast } from "react-toastify";

function ViewDamDeliveryBill({ billRegisterId }) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  // get profile data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state.authData, shallowEqual);

  const [gridData, getGridData, loadingGridData] = useAxiosGet();

  useEffect(() => {
    const url = `/tms/LigterLoadUnload/GetLighterDumpToTruckDeliveryDetails?billRegisterId=${billRegisterId}`;
    getGridData(url);
  }, [accId, buId]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{}}
        onSubmit={(values) => {}}
      >
        {() => (
          <ICard title={`View Dam Delivery Bill`}>
            {(loadingGridData || loading) && <Loading />}

            <form className="form form-label-right ">
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
                    <th>Attachment</th>
                  </tr>
                </thead>
                <tbody>
                  {gridData?.map((item, index) => {
                    return (
                      <>
                        <tr key={index}>
                          <td style={{ width: "30px" }} className="text-center">
                            {index + 1}
                          </td>
                          <td>{item?.shipPointName}</td>
                          <td>{item?.supplierName}</td>
                          <td>{item?.lighterVesselName}</td>
                          <td>{item?.dumpToTruckQnt}</td>
                          <td className="text-right">{item?.dumpToTruckAmount / item?.dumpToTruckQnt}</td>
                          <td className="text-right">
                            {item?.dumpToTruckAmount}
                          </td>
                          <td className="text-right">
                            {item?.dailyLaboureQnt}
                          </td>
                          <td className="text-right">
                            {item?.labourAmount / item?.dailyLaboureQnt}
                          </td>
                          <td className="text-right">
                            {item?.labourAmount}
                          </td>
                          <td className="text-right">
                            {item?.dumpOtherCost}
                          </td>
                          <td className="text-center">
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
                          </td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </form>
          </ICard>
        )}
      </Formik>
    </>
  );
}

export default ViewDamDeliveryBill;
