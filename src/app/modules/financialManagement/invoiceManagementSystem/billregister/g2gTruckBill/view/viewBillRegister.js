import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import IForm from "../../../../../_helper/_form";
import Loading from "../../../../../_helper/_loading";
import { getDownlloadFileView_Action } from "../../../../../_helper/_redux/Actions";
import useAxiosGet from "../../../../../_helper/customHooks/useAxiosGet";
import BillApproveForm from "../../../approvebillregister/approveForm";

const initData = {
  approveAmount: "",
  approveAmountMax: "",
  remarks: "",
};

export default function ViewG2GTruckBill({
  billRegisterId,
  gridItem,
  landingValues,
  setModalShow,
  gridDataFunc,
}) {
  const [loading, setLoading] = useState(false);
  const [gridData, getGridData, gridDataLoading] = useAxiosGet();
  const dispatch = useDispatch();

  // get profile data from redux store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state.authData, shallowEqual);

  useEffect(() => {
    getGridData(
      `/tms/LigterLoadUnload/GetTruckNLabourSupplierByBillRegisterId?accountId=${accId}&buisinessUnitId=${buId}&billRegisterId=${billRegisterId}&billTypeId=16`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...initData,
        approveAmount: gridItem?.monTotalAmount,
        approveAmountMax: gridItem?.monTotalAmount,
      }}
      onSubmit={(values) => {}}
    >
      {({ values }) => (
        <IForm
          title="View G2G Truck Bill"
          isHiddenReset
          isHiddenBack
          isHiddenSave
          renderProps={() => {}}
        >
          {(gridDataLoading || loading) && <Loading />}
          <form className="form form-label-right ">
            <BillApproveForm
              obj={{
                values,
                gridItem,
                gridDataFunc,
                landingValues,
                setModalShow,
              }}
            />
            <div className="common-scrollable-table two-column-sticky">
              <div className="scroll-table _table overflow-auto">
                <div className="table-responsive">
                <table className="table table-striped table-bordered global-table">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Ship Point Name</th>
                      <th>Delivery Code</th>
                      <th>Supplier Name</th>
                      <th>Lighter Vessel Name</th>
                      <th>Mother Vessel Name</th>
                      <th>Vehicle Reg No</th>
                      <th>Ship To Partner Name</th>
                      <th>Delvery Date</th>
                      <th>Quantity (Bag)</th>
                      <th>Quantity (Ton)</th>
                      <th>Godown Unload Labour Rate</th>
                      <th>Total Amount</th>
                      <th>Attachment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gridData?.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td style={{ width: "30px" }} className="text-center">
                            {index + 1}
                          </td>
                          <td>{item?.shipPointName}</td>
                          <td className="text-center">{item?.deliveryCode}</td>
                          <td>{item?.supplierName}</td>
                          <td>{item?.lighterVesselName}</td>
                          <td>{item?.motherVesselName}</td>
                          <td className="text-center">{item?.vehicleRegNo}</td>
                          <td>{item?.shipToPartnerName}</td>
                          <td className="text-center">{item?.delveryDate}</td>
                          <td className="text-right">{item?.quantity}</td>
                          <td className="text-right">{item?.quantityTon}</td>
                          <td className="text-right">
                            {item?.godownUnloadLabouRate}
                          </td>
                          <td className="text-right">
                            {Number(
                              item?.quantity * item?.godownUnloadLabouRate
                            )}
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
                      );
                    })}
                  </tbody>
                </table>
                </div>
              </div>
            </div>
          </form>
        </IForm>
      )}
    </Formik>
  );
}
