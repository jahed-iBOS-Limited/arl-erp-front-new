/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ICard from "../../../../../_helper/_card";
import Loading from "../../../../../_helper/_loading";
import useAxiosGet from "../../../../../_helper/customHooks/useAxiosGet";
import { common_api_for_4_types_of_bill } from "../../helper";

function ViewHatchLaborBill({ billRegisterId }) {
  // get profile data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [gridData, getGridData, loading] = useAxiosGet();

  useEffect(() => {
    const url = common_api_for_4_types_of_bill(accId, buId, billRegisterId, 28);
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
          <ICard title={`View Hatch Labor Bill`}>
            {loading && <Loading />}

            <form className="form form-label-right ">
              <table className="table table-striped table-bordered mt-3 global-table">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Mother Vessel Name</th>
                    <th>Hatch Labor Supplier Name</th>
                    <th>Port Name</th>
                    <th>Program Qty</th>
                    <th>Hatch Labor Rate</th>
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
                          <td>{item?.motherVesselName}</td>
                          <td>{item?.hatchLabour}</td>
                          <td>{item?.portName}</td>
                          <td className="text-right">{item?.programQnt}</td>
                          <td className="text-right">
                            {item?.hatchLabourRate || 0}
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

export default ViewHatchLaborBill;
