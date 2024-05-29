import { Form, Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";

const initData = {
  receiverName: "",
  remarks: "",
};

export default function OwnerSendModal({ handleGetRowData, propsObj }) {
  const [objProps, setObjprops] = useState({});
  const { status, pageNo, pageSize, singleItem } = propsObj;

  const {
    profileData: { userId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const [, sendHandler] = useAxiosPost();

  // all handler
  const saveHandler = (values, cb) => {
    sendHandler(
      `/tms/DocumentDispatch/DocumentOwnerReceived?DispatchId=${singleItem?.dispatchHeaderId}&ReceiverName=${values?.receiverName}&Remarks=${values?.remarks}&UserId=${userId}`,
      null,
      () => {
        handleGetRowData(status, pageNo, pageSize);
      }
    );
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      //   validationSchema={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        if (!values?.receiverName)
          return toast.warn("Receiver name is required");
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
        setValues,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {false && <Loading />}
          <IForm
            title="Send To Owner"
            isHiddenBack={true}
            getProps={setObjprops}
          >
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <InputField
                    value={values?.receiverName}
                    label="Receiver Name"
                    name="receiverName"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("receiverName", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
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
