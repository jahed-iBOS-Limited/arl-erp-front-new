import React from "react";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import Loading from "../../../../_helper/_loading";
import NewSelect from "./../../../../_helper/_select";
import { saveShippointTransfer } from "../helper";
import { useSelector, shallowEqual } from "react-redux";

const initData = {
  shippoint: "",
  curentShippoint: "",
};

const validationSchema = Yup.object().shape({
  shippoint: Yup.object().shape({
    label: Yup.string().required("shippoint is required"),
    value: Yup.string().required("shippoint is required"),
  }),
});

export default function ShippointTransferModel({
  values,
  shipPointDDL,
  clickRowData,
  setIsTransferModel,
  callBackFuncGridData
}) {
  const [loading, setLoading] = React.useState(false);

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);
  const saveShippointTransferModel = (values, cb) => {
    const obj = {
      acdId: profileData.accountId,
      buid: selectedBusinessUnit?.value,
      shipmentId: values?.shippoint?.value,
      shipPointName: values?.shippoint?.label,
      salesOrderId: clickRowData?.salesOrderId,
      cb: cb,
      setLoading,
      setIsTransferModel,
      callBackFuncGridData
    };
    saveShippointTransfer(obj);
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        validationSchema={validationSchema}
        initialValues={{ ...initData, curentShippoint: values?.shippoint }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveShippointTransferModel(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
          setValues,
        }) => (
          <>
            {loading && <Loading />}
            <FormikForm>
              <div className="form-card">
                <div
                  style={{
                    justifyContent: "space-between",
                    display: "flex",
                    padding: "10px 0",
                  }}
                >
                  <p></p>
                  <div>
                    <button type="submit" className="btn btn-primary save-btn">
                      Save
                    </button>
                  </div>
                </div>
              </div>
              <div className="form form-label-right my-2">
                <div className="form-group row global-form">
                  <div className="col-lg-3">
                    <NewSelect
                      name="curentShippoint"
                      options={[]}
                      value={values?.curentShippoint}
                      label="Curent Shippoint"
                      onChange={(valueOption) => {
                        setFieldValue("curentShippoint", valueOption);
                      }}
                      placeholder="Curent Shippoint"
                      errors={errors}
                      touched={touched}
                      isDisabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="shippoint"
                      options={shipPointDDL || []}
                      value={values?.shippoint}
                      label="Shippoint"
                      onChange={(valueOption) => {
                        setFieldValue("shippoint", valueOption);
                      }}
                      placeholder="Shippoint"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
              </div>
            </FormikForm>
          </>
        )}
      </Formik>
    </>
  );
}
