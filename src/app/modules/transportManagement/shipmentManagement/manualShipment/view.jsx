import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
const initData = {};
export default function ViewManualShipment({ viewData, intLoadingId }) {
  const saveHandler = (values, cb) => { };
  const [data, getData, dataLoader] = useAxiosGet();
  useEffect(() => {
    if (intLoadingId) {
      // getData(`/tms/Vehicle/GetLoadingSlip?ShipPointId=${intLoadingId}`)
      getData(`/tms/Vehicle/GetLoadingSlipById?LoadingId=${intLoadingId}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {dataLoader && <Loading />}
          <IForm
            title=""
            isHiddenReset
            isHiddenBack
            isHiddenSave
          >
            <Form>
              <div className="row">
                <div className="col-lg-4">
                  <h5>Entry Code: {viewData?.strGateEntryCode}</h5>                
                </div>
                <div className="col-lg-4">
                  <h5>Ship Point: {viewData?.shipPointName}</h5>
                </div>
                <div className="col-lg-4">                 
                  <h5>Vehicle No: {viewData?.strVehicleName}</h5>
                </div>
                <div className="col-lg-4">        
                  <h5>Driver Name: {viewData?.driverName}</h5>
                </div>
                <div className="col-lg-4">
                  <h5>Driver Contact No : {viewData?.driverContactNO}</h5>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12 table-responsive">
                  <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th style={{ width: "30px" }}>SL</th>
                        <th>Date</th>
                        <th>Item Name</th>
                        <th>Item Code</th>
                        <th>Uom</th>
                        <th>Quantity</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.data?.rowDTO?.length > 0 &&
                        data?.data?.rowDTO?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td className="text-center">{_todayDate(item?.dteDate)}</td>
                              <td>{item?.strItemName}</td>
                              <td className="text-center">{item?.strItemCode}</td>
                              <td>{item?.strUomname}</td>
                              <td className="text-center">{item?.numQnt}</td>
                              <td>{item?.strRemarks}</td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}