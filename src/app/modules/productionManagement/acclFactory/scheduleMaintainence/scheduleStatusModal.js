import { Form, Formik } from "formik";
import React, { useState } from "react";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import InputField from "../../../_helper/_inputField";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { toast } from "react-toastify";
const initData = {
  completeDate: _todayDate(),
  remarks: "",
};
export default function ScheduleStatusModal({
  clickedRowData,
  profileData,
  selectedBusinessUnit,
  setIsShowCompleteModal,
  getData,
  landingValues,
  setClickedRowData,
}) {
  const [objProps, setObjprops] = useState({});
  const [, saveData, saveDataLoader] = useAxiosPost();

  const saveHandler = (values, cb) => {
    if (!values?.completeDate) {
      return toast.warn("Complete date is required");
    }
    const payload = [
      {
        scheduleMaintenanceId: clickedRowData?.scheduleMaintenanceId,
        completedDateTime: values?.completeDate,
        remarks: values?.remarks,
        actionBy: profileData?.userId,
        businessUnitId: selectedBusinessUnit?.value,
      },
    ];
    saveData(
      `/mes/ScheduleMaintenance/ScheduleMaintenanceCreateAndEdit`,
      payload,
      cb,
      true
    );
  };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
          setIsShowCompleteModal(false);
          getData(landingValues);
          setClickedRowData(null);
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
          {saveDataLoader && <Loading />}
          <IForm
            title="Schedule Complete Status"
            isHiddenBack={true}
            isHiddenReset={true}
            getProps={setObjprops}
          >
            <Form>
              <div className="row form-group global-form">
                <div className="col-lg-4">
                  <InputField
                    value={values?.completeDate}
                    label="Complete Date"
                    type="date"
                    name="completeDate"
                    onChange={(e) => {
                      setFieldValue("completeDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-4">
                  <InputField
                    value={values?.remarks}
                    label="Remarks"
                    name="remarks"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("remarks", e.target.value);
                    }}
                  />
                </div>
              </div>
              <button
                type="submit"
                style={{ display: "none" }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={objProps?.resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
