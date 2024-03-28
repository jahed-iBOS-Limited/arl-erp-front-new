/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react"; 
import { Formik } from "formik";
import { shallowEqual, useSelector } from "react-redux"; 
import ICard from "../../../../../_helper/_card";
import Loading from "../../../../../_helper/_loading";
// import { getDownlloadFileView_Action } from "../../../../../_helper/_redux/Actions";
import useAxiosGet from "../../../../../_helper/customHooks/useAxiosGet";

function ViewDamDeliveryBill({ billRegisterId }) {
  const [loading, ] = useState(false);
  // const dispatch = useDispatch();
  // get profile data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [, getGridData, loadingGridData] = useAxiosGet();

  useEffect(() => {
    // const url = `/tms/LigterLoadUnload/GetLighterDumpToTruckDeliveryDetaills?lighterVesselId=2012&shipPointId=272&FromDate=2023-12-01&ToDate=2023-12-31&isDumpToTruckApprove=0`;
    // getGridData("");
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
                    <th>Mother Vessel</th>
                    <th>Lighter Vessel</th>
                    <th>Hatch Labor Supplier Name</th>
                    <th>Port Name</th>
                    <th>Program Qty</th>
                    <th>Hatch Labor Rate</th>
                    <th>Attachment</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {gridData?.map((item, index) => {
                    return (
                      <>
                        <tr key={index}>
                          <td style={{ width: "30px" }} className="text-center">
                            {index + 1}
                          </td>
                          <td>{item?.motherVesselName}</td>
                          <td>{item?.lighterVesselName}</td>
                          <td>{item?.hatchLabour}</td>
                          <td>{item?.portName}</td>
                          <td className="text-right">{item?.programQnt}</td>
                          <td className="text-right">
                            {item?.hatchLabourRate || 0}
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
                  })} */}
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
