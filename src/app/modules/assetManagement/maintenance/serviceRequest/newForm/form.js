import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { ISelect } from "../../../../_helper/_inputDropDown";
import InputField from "../../../../_helper/_inputField";
import Axios from "axios";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import FormikError from "../../../../_helper/_formikError";
// import IDelete from "../../../../_helper/_helperIcons/_delete";
// import { _dateFormatter } from "../../../../_helper/_dateFormate";

// Validation schema
const validationSchema = Yup.object().shape({
  problem: Yup.string().required("Problem is required"),
  assetNo: Yup.object().shape({
    label: Yup.string().required("Asset No is required"),
    value: Yup.string().required("Asset No is required"),
  }).nullable(),
  service: Yup.object().shape({
    label: Yup.string().required("Service is required"),
    value: Yup.string().required("Service is required"),
  }),
  priority: Yup.object().shape({
    label: Yup.string().required("Priority is required"),
    value: Yup.string().required("Priority is required"),
  }),
  assetDate: Yup.string().required("Date is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  serviceDDL,
  assetListDDL,
  plantId,
  setAssetListDDL,
  selectedBusinessUnit
}) {
  const loadAssetList = (v) => {
     if (v?.length < 3) return []
    return Axios.get(
     `/asset/DropDown/GetAssetListForWorkOrder?UnitId=${selectedBusinessUnit?.value}&PlantId=${plantId}&searchTearm=${v}`
    ).then((res) => {
      const updateList = res?.data.map((item) => ({
        ...item,
        value: item?.value,
        assetproName: item?.label,
        label: item?.labelCode     
      }));
      return updateList;
    });
  };
  return (
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
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {/* {disableHandler(!isValid)} */}
            
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <label>Asset NO.</label>
                  <SearchAsyncSelect
                    selectedValue={values?.assetNo}
                    handleChange={(valueOption) => {
                      setFieldValue("assetNo", valueOption);
                      setFieldValue("assetName", valueOption?.assetproName);
                      setFieldValue(
                        "businessUnit",
                        valueOption?.businessUnitName
                      );
                    }}
                    placeholder={"Asset Id and Code"}
                    loadOptions={loadAssetList}
                    disabled={true}
                  />
                  <FormikError
                    errors={errors}
                    name="assetNo"
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.assetName}
                    label="Asset Name"
                    placeholder="Asset Name"
                    disabled={true}
                    name="assetName"
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.businessUnit}
                    label="Business Unit"
                    placeholder="Business Unit"
                    disabled={true}
                    name="businessUnit"
                  />
                </div>
                <div className="col-lg-3 mt-7 d-flex">
                  <label className="mr-3">
                    <Field type="radio" name="picked" value="Preventive" />
                    <span className="ml-2">Preventive</span>
                  </label>
                  <label>
                    <Field type="radio" name="picked" value="Corrective" />
                    <span className="ml-2">Corrective</span>
                  </label>
                </div>
                <div className="col-lg-3">
                  <ISelect
                    label="Select Service"
                    options={serviceDDL}
                    value={values?.service}
                    name="service"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-3">
                  <ISelect
                    label="Select Priority"
                    options={[
                      { label: "High", value: 1 },
                      { label: "Medium", value: 2 },
                      { label: "Low", value: 3 },
                    ]}
                    value={values?.priority}
                    name="priority"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.assetDate}
                    type="date"
                    label="Date"
                    placeholder="Date"
                    name="assetDate"
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.problem}
                    label="Problem"
                    placeholder="Problem"
                    name="problem"
                  />
                </div>
              </div>
              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
