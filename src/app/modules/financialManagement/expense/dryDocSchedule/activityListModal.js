import React, { useEffect } from "react";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../_helper/_loading";
import { Form, Formik } from "formik";
import IForm from "../../../_helper/_form";
const initData = {};
export default function ActivityListModal() {
  const [rowData, getRowData, rowDataLoader] = useAxiosGet();
  const saveHandler = (values, cb) => {};
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
          {false && <Loading />}
          <IForm
            title="Dry Doc Schedule Details"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return <div></div>;
            }}
          >
            <Form>
              <div>
                <div>
                  {rowDataLoader && <Loading />}
                  <div className="row">
                    <div className="col-lg-6">
                      <strong>Vessel Name:</strong>MV Akij Ocean <br />
                      <strong>Dockyard Name:</strong> <br />
                      <strong>Remarks:</strong>
                    </div>
                    <div className="col-lg-6">
                      <strong>From Date:</strong> <br />
                      <strong>To Date:</strong>
                    </div>
                  </div>
                  <table className="table table-striped table-bordered global-table mt-3">
                    <thead>
                      <tr>
                        <th>Sl</th>
                        <th>Activities</th>
                        <th>Supplier Name</th>
                        <th>Currency</th>
                        <th>Budget Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowData?.length
                        ? rowData?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item?.activityName}</td>
                              <td>{item?.supplierName}</td>
                              <td>{item?.currencyName}</td>
                              <td>{item?.budgetAmount}</td>
                            </tr>
                          ))
                        : null}
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
