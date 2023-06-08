import React from "react";
import { Formik, Form } from "formik";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import * as Yup from "yup";
import { getInventoryLocationDDL, getWareHouseDDL } from "../helper";

const validationSchema = Yup.object().shape({
  plantName: Yup.object().shape({
    label: Yup.string().required("Plant Name  is required"),
    value: Yup.string().required("Plant Name  is required"),
  }),
  shopFloorName: Yup.string().required("Shop Floor Name is required"),
  shopFloorCode: Yup.string().required("Shop Floor Code is required"),
  warehouse: Yup.object().shape({
    label: Yup.string().required("Warehouse is required"),
    value: Yup.string().required("Warehouse is required"),
  }),
  intLocation: Yup.object().shape({
    label: Yup.string().required("Location is required"),
    value: Yup.string().required("Location is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  plantNameDDl,
  isEdit,
  warehouseDDL,
  profileData,
  selectedBusinessUnit,
  setWarehouseDDL,
  intLocationDDL,
  setIntLocationDDL,
}) {
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
            {/* {console.log(values)} */}
            <Form className="form form-label-right global-form">
              <div className="form-group row">
                <div className="col-lg-3">
                  <NewSelect
                    name="plantName"
                    options={plantNameDDl}
                    value={values?.plantName}
                    label="Plant Name"
                    onChange={(valueOption) => {
                      setFieldValue("plantName", valueOption);
                      getWareHouseDDL(
                        profileData?.userId,
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        valueOption?.value,
                        setWarehouseDDL
                      );
                      setFieldValue("warehouse", "");
                      setFieldValue("intLocation", "");
                    }}
                    placeholder="Plant Name"
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="warehouse"
                    options={warehouseDDL}
                    value={values?.warehouse || ""}
                    label="Warehouse Name"
                    onChange={(valueOption) => {
                      setFieldValue("warehouse", valueOption);
                      setFieldValue("intLocation", "");
                      getInventoryLocationDDL(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        values?.plantName?.value,
                        valueOption?.value,
                        setIntLocationDDL
                      );
                    }}
                    placeholder="Warehouse Name"
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="intLocation"
                    options={intLocationDDL}
                    value={values?.intLocation || ""}
                    label="Location"
                    onChange={(valueOption) => {
                      setFieldValue("intLocation", valueOption);
                    }}
                    placeholder="Location"
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    value={values?.shopFloorName}
                    label="Shop Floor Name"
                    name="shopFloorName"
                    type="text"
                    placeholder="Shop Floor Name"
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    value={values?.shopFloorCode}
                    label="Shop Floor Code"
                    name="shopFloorCode"
                    type="text"
                    placeholder="Shop Floor Code"
                    disabled={isEdit}
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
