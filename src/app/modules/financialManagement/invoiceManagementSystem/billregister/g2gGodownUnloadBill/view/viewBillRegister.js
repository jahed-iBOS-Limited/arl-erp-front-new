import { Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "../../../../../_helper/_loading";
import useAxiosGet from "../../../../../_helper/customHooks/useAxiosGet";
import IForm from "../../../../../_helper/_form";

export default function ViewG2GGodownUnloadBill({ billRegisterId }) {
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
      `/tms/LigterLoadUnload/GetTruckNLabourSupplierByBillRegisterId?accountId=${accId}&buisinessUnitId=${buId}&billRegisterId=${billRegisterId}&billTypeId=21`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  return (
    <Formik enableReinitialize={true} initialValues={{}} onSubmit={(values) => {}}>
      {() => (
        <IForm
          title="View G2G Godown Unload Bill"
          isHiddenReset
          isHiddenBack
          isHiddenSave
          renderProps={() => {}}
        >
          {gridDataLoading && <Loading />}
          <form className="form form-label-right ">
            <div className="common-scrollable-table two-column-sticky">
              <div className="scroll-table _table overflow-auto">
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
                          <td className="text-right">{item?.godownUnloadLabouRate}</td>
                          <td className="text-right">
                            {Number(item?.quantity * item?.godownUnloadLabouRate)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </form>
        </IForm>
      )}
    </Formik>
  );
}
