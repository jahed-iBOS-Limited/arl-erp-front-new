import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import IView from "../../../_helper/_helperIcons/_view";
import Loading from "../../../_helper/_loading";
import { getDownlloadFileView_Action } from "../../../_helper/_redux/Actions";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
const initData = {};
export default function ActivityListModal({ clickedItem }) {
  const dispatch = useDispatch();
  const [rowData, getRowData, rowDataLoader] = useAxiosGet();
  useEffect(() => {
    if (clickedItem) {
      getRowData(
        `/fino/Expense/GetDocScheduleBudgetList?DocScheduleId=${clickedItem?.intDocScheduleId}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
            title="Dry Dock Schedule Details"
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
                      <strong>Vessel Name:</strong>
                      {rowData?._header?.strVesselName} <br />
                      <strong>Dockyard Name:</strong>
                      {rowData?._header?.strDockYardName} <br />
                      <strong>Remarks:</strong> {rowData?._header?.reMarks}
                    </div>
                    <div className="col-lg-6">
                      <strong>From Date:</strong>{" "}
                      {_dateFormatter(rowData?._header?.dteFromDate)}
                      <br />
                      <strong>To Date:</strong>
                      {} {_dateFormatter(rowData?._header?.dteToDate)}
                    </div>
                  </div>
                  <div className="table-responsive">
                  <table className="table table-striped table-bordered global-table mt-3">
                    <thead>
                      <tr>
                        <th>Sl</th>
                        <th>Activities</th>
                        <th>Supplier Name</th>
                        <th>Currency</th>
                        <th>Budget Amount</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowData?._rows?.length
                        ? rowData?._rows?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item?.strActivity}</td>
                              <td>{item?.strSupplierName}</td>
                              <td>{item?.strCurrencyName}</td>
                              <td>{item?.numBudgetAmount}</td>
                              <td className="text-center">
                                {item?.strAttachmentLink ? (
                                  <IView
                                    title="View Attachment"
                                    clickHandler={() => {
                                      dispatch(
                                        getDownlloadFileView_Action(
                                          item?.strAttachmentLink
                                        )
                                      );
                                    }}
                                  />
                                ) : null}
                              </td>
                            </tr>
                          ))
                        : null}
                    </tbody>
                  </table>
                  </div>
                </div>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
