import React, { useState } from "react";
import { Formik, Form } from "formik";
import InputField from "../../../../_helper/_inputField";
import ButtonStyleOne from "../../../../_helper/button/ButtonStyleOne";
import { toast } from "react-toastify";
import { savePlDateChangeAction } from "../helper";
import Loading from "../../../../_helper/_loading";
import { addDaysToADate } from "../../../../_helper/_dateFormate";
import { _todayDate } from "../../../../_helper/_todayDate";

const ChangeDateModal = ({ currentItem, cb, userId }) => {
  const [loading, setLoading] = useState(false);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ fromDate: "", toDate: "" }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          if (!values?.fromDate) return toast.warn("From date is required");
          let data = {
            leaveApplicationId: currentItem?.leaveApplicationId,
            employeeId: currentItem?.employeeId,
            fromDate: values?.fromDate,
            toDate: values?.toDate,
            actionBy: userId,
            narration: values?.reason || "",
          };
          savePlDateChangeAction(setLoading, data, cb);
        }}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Form className="form form-label-right">
              {loading && <Loading />}
              <div className="text-right mt-1">
                <ButtonStyleOne type="submit" label="Save" />
              </div>
              <div className="row global-form">
                <div className="col-lg-4">
                  <label>From Date</label>
                  <InputField
                    value={values?.fromDate}
                    name="fromDate"
                    min={_todayDate()}
                    onChange={(e) => {
                      if (currentItem?.plDays < 1) {
                        return toast.warn("Total PL days not found!");
                      }
                      setFieldValue("fromDate", e.target.value);
                      setFieldValue(
                        "toDate",
                        addDaysToADate(e.target.value, currentItem?.plDays)
                      );
                    }}
                    type="date"
                  />
                </div>
                <div className="col-lg-4">
                  <label>To Date</label>
                  <InputField
                    value={values?.toDate}
                    name="toDate"
                    onChange={(e) => {}}
                    type="date"
                    disabled
                  />
                </div>
                <div className="col-lg-4">
                  <label>Reason</label>
                  <InputField
                    value={values?.reason}
                    name="reason"
                    onChange={(e) => {
                      setFieldValue("reason", e.target.value);
                    }}
                    type="text"
                  />
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default ChangeDateModal;
