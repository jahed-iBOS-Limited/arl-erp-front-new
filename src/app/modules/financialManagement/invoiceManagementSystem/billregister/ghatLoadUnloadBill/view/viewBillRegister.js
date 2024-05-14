import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Loading from "../../../../../_helper/_loading";
import useAxiosGet from "../../../../../_helper/customHooks/useAxiosGet";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { getDownlloadFileView_Action } from "../../../../../_helper/_redux/Actions";
import IForm from "../../../../../_helper/_form";
import BillApproveForm from "../../../approvebillregister/approveForm";

const initData = {
  approveAmount: "",
  approveAmountMax: "",
  remarks: "",
};

export default function ViewGhatLoadUnloadBill({
  billRegisterId,
  gridItem,
  landingValues,
  setModalShow,
  gridDataFunc,
}) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [gridData, getGridData, gridDataLoading] = useAxiosGet();

  // get profile data from redux store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    getGridData(
      `/tms/LigterLoadUnload/GetUnloadLabourBillByBillregesterId?accountId=${accId}&buisinessUnitId=${buId}&billRegisterId=${billRegisterId}`
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
          title="View Ghat Load Unload Bill"
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
                      <th>Mother Vessel Name</th>
                      <th>Program No</th>
                      <th>Lighter Vessel Name</th>
                      <th>Unload Quantity</th>
                      <th>Ghat Labour Supplier Name</th>
                      <th>Direct Amount</th>
                      <th>Dump Amount</th>
                      <th>Dump To Truck Amount</th>
                      <th>Lighter To Bolgate Amount</th>
                      <th>Bolgate To Dam Amount</th>
                      <th>Truck To Dump Outside Amount</th>
                      <th>Truck To Dam Amount</th>
                      <th>Others Cost Amount</th>
                      <th>Biwta Amount</th>
                      <th>Ship Sweeping Amount</th>
                      <th>Scale Amount</th>
                      <th>Daily Laboure Amount</th>
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
                          <td>{item?.motherVesselName}</td>
                          <td>{item?.programNo}</td>
                          <td>{item?.lighterVesselName}</td>
                          <td className="text-right">{item?.unLoadQuantity}</td>
                          <td>{item?.ghatLabourSupplierName}</td>
                          <td className="text-right">{item?.directAmount}</td>
                          <td className="text-right">{item?.dumpAmount}</td>
                          <td className="text-right">
                            {item?.dumpToTruckAmount}
                          </td>
                          <td className="text-right">
                            {item?.lighterToBolgateAmount}
                          </td>
                          <td className="text-right">
                            {item?.bolgateToDamAmount}
                          </td>
                          <td className="text-right">
                            {item?.truckToDumpOutsideAmount}
                          </td>
                          <td className="text-right">
                            {item?.truckToDamAmount}
                          </td>
                          <td className="text-right">
                            {item?.othersCostAmount}
                          </td>
                          <td className="text-right">{item?.biwtaAmount}</td>
                          <td className="text-right">
                            {item?.shipSweepingRate}
                          </td>
                          <td className="text-right">{item?.scaleRate}</td>
                          <td className="text-right">
                            {item?.dailyLaboureRate}
                          </td>
                          <td className="text-right">{item?.totalAmount}</td>
                          <td className="text-center">
                            <OverlayTrigger
                              overlay={
                                <Tooltip id="cs-icon">View Attachment</Tooltip>
                              }
                            >
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dispatch(
                                    getDownlloadFileView_Action(
                                      item?.attachment,
                                      null,
                                      null,
                                      setLoading
                                    )
                                  );
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
