import { Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";

const initData = {
  businessUnit: "",
  shipPoint: "",
};

export const validationSchema = Yup.object().shape({
  businessUnit: Yup.object().shape({
    label: Yup.string().required("Business Unit is required"),
    value: Yup.string().required("Business Unit is required"),
  }),
  shipPoint: Yup.object().shape({
    label: Yup.string().required("Ship Ponit is required"),
    value: Yup.string().required("Ship Ponit is required"),
  }),
});
export default function LogisticEquipmentEntry() {
  const [objProps, setObjprops] = useState({});
  const { profileData, businessUnitList } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const [
    shipPointList,
    getShipPointList,
    shipPointLoader,
    setShipPointList,
  ] = useAxiosGet();

  const [formList, setFormList] = useState([]);

  const saveHandler = async (values, cb) => {
    console.log(values);
    alert("Submitted Successful");
  };

  return (
    <IForm
      title="Create Logistic Equipment Availability"
      getProps={setObjprops}
      isHiddenReset={true}
    >
      {shipPointLoader && <Loading />}
      <>
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          validationSchema={validationSchema}
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
              <Form className="form form-label-right">
                {false && <Loading />}
                <div className="form-group  global-form row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="businessUnit"
                      options={businessUnitList || []}
                      value={values?.businessUnit}
                      label="Select Business Unit"
                      onChange={(valueOption) => {
                        setFieldValue("businessUnit", valueOption || "");
                        setFieldValue("shipPoint", "");
                        setShipPointList([]);

                        if (valueOption) {
                          getShipPointList(
                            `/wms/ShipPoint/GetShipPointDDL?accountId=${profileData?.accountId}&businessUnitId=${valueOption?.value}`
                          );
                        }
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="shipPoint"
                      options={shipPointList || []}
                      value={values?.shipPoint}
                      label="Select Ship Point"
                      onChange={(valueOption) => {
                        setFieldValue("shipPoint", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>

                <div className="form-group  global-form row">
                  <>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.availableTM}
                        label="Available TM"
                        name="availableTM"
                        type="number"
                        onChange={(e) => {
                          setFieldValue("availableTM", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.remarks}
                        label="Explanations"
                        name="remarks"
                        type="text"
                        onChange={(e) => {
                          setFieldValue("remarks", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </>
                  <>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.availableConcrete}
                        label="Available Concrete"
                        name="availableConcrete"
                        type="number"
                        onChange={(e) => {
                          setFieldValue("availableConcrete", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.remarks}
                        label="Explanations"
                        name="remarks"
                        type="text"
                        onChange={(e) => {
                          setFieldValue("remarks", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </>
                  <>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.availablePickup}
                        label="Available Pickup(Nos)"
                        name="availablePickup"
                        type="number"
                        onChange={(e) => {
                          setFieldValue("availablePickup", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.remarks}
                        label="Explanations"
                        name="remarks"
                        type="text"
                        onChange={(e) => {
                          setFieldValue("remarks", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </>
                  <>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.availablePipeLine}
                        label="Available PipeLine(RFT)"
                        name="availablePipeLine"
                        type="number"
                        onChange={(e) => {
                          setFieldValue("availablePipeLine", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.remarks}
                        label="Explanations"
                        name="remarks"
                        type="text"
                        onChange={(e) => {
                          setFieldValue("remarks", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </>
                  <div className="col-lg-3">
                    <button type="button" className="btn btn-primary mt-5">
                      Add
                    </button>
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
            </>
          )}
        </Formik>
      </>
    </IForm>
  );
}
