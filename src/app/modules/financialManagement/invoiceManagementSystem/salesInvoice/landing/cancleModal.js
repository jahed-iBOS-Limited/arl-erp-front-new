import { Form, Formik } from "formik";
import React, { useState } from "react";
import IForm from "../../../../_helper/_form";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import { cancelSalesInvoice } from "../helper";
import { shallowEqual, useSelector } from "react-redux";

const initData = {
  remarks: "",
};

export default function CancelModal({
  singleRowItem,
  setSingleRowItem,
  setIsCancelModalShow,
  additionalInfo: { accId, buId, getGridData, pageNo, pageSize, setLoading },
  parentValues
}) {
  const [objProps, setObjprops] = useState({});
  const {
    profileData: { userId },
  } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const saveHandler = (values, cb) => {
    cancelSalesInvoice(
      accId,
      buId,
      singleRowItem?.strInvoiceNumber,
      setLoading,
      () => {
        getGridData(parentValues, pageNo, pageSize);
        setSingleRowItem(null);
        cb();
        setIsCancelModalShow(false);
      },
      singleRowItem,
      userId,
      values
    );
  };
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
            title="Sales Invoice Cancellation"
            getProps={setObjprops}
            isHiddenBack={true}
            isHiddenReset={true}
          >
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-6">
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
