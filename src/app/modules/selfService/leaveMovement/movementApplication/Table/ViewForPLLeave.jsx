import React, { useState } from "react";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import InputField from "../../../../_helper/_inputField";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import ButtonStyleOne from "../../../../_helper/button/ButtonStyleOne";
import { toast } from "react-toastify";
import { nextMonth } from "../../../../_helper/nextMonth";
import { changeReqSaveAction } from "../helper";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "../../../../_helper/_loading";

const ViewForPLLeave = ({ currentRowData, PrevValues, changeReqDateCb, setIsShowModal }) => {
  const { profileData } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const [loading, setLoading] = useState(false);

  let data = [currentRowData];

  const saveHandler = (values) => {
    if (!values?.reqDate) return toast.warn("Request date is required");
    let nextMonthFirstDate = new Date(nextMonth());
    let date = new Date(values?.reqDate);

    if (date.getTime() >= nextMonthFirstDate.getTime()) {
      let payload = [{
        partId: 1,
        employeeId: PrevValues?.employee?.value,
        leaveApplicationId: currentRowData?.id,
        requestDate: values?.reqDate,
        insertBy: profileData?.userId,
        plDateChangeReqId: 0,
        remarks: values?.remarks,
      }];
      changeReqSaveAction(payload, setLoading, changeReqDateCb, PrevValues, setIsShowModal);
    } else {
      return toast.warn("Date should be next month");
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ remarks: "", reqDate: "" }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          "";
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          setValues,
          isValid,
        }) => (
          <>
            <Form className="form form-label-right">
              {loading && <Loading />}
              <div className="text-right mt-2">
                <ButtonStyleOne
                  type="button"
                  onClick={() => {
                    saveHandler(values);
                  }}
                  label="Save"
                />
              </div>
              <div className="row global-form">
                <div className="col-lg-3">
                  <label>Request Date</label>
                  <InputField
                    value={values?.reqDate}
                    name="reqDate"
                    placeholder="Request Date"
                    type="date"
                  />
                </div>
                <div className="col-lg-3">
                  <label>Remarks</label>
                  <InputField
                    value={values?.remarks}
                    name="remarks"
                    placeholder="Remarks"
                    type="text"
                  />
                </div>
              </div>
              <div className="table-responsive">
              <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table mr-1">
                <thead>
                  <tr>
                    <th style={{ width: "35px" }}>SL</th>
                    <th style={{ width: "95px" }}>Application Type</th>
                    <th style={{ width: "90px" }}>Submitted Date</th>
                    <th style={{ width: "90px" }}>From Date</th>
                    <th style={{ width: "90px" }}>To Date</th>
                    <th>Reason</th>
                    <th style={{ width: "60px" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((td, index) => (
                    <tr key={index}>
                      <td> {td?.sl} </td>
                      <td>
                        <div className="pl-2">{td?.leaveType}</div>
                      </td>
                      <td>
                        <div className="text-center">
                          {_dateFormatter(td?.applicationDate)}
                        </div>
                      </td>
                      <td>
                        <div className="text-center">
                          {_dateFormatter(td?.appliedFromDate)}
                        </div>
                      </td>
                      <td>
                        <div className="text-center">
                          {_dateFormatter(td?.appliedToDate)}
                        </div>
                      </td>
                      <td>
                        <div className="text-left pl-2">{td?.reason}</div>
                      </td>
                      <td>
                        <div className="pl-2">{td?.status}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default ViewForPLLeave;
