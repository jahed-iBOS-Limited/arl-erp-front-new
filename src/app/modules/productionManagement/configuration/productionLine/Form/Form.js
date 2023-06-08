import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import { getShopFloorDDL } from "../../../manufacturingExecutionSystem/billOfMaterial/helper";

const validationSchema = Yup.object().shape({
  productionLineName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Production line name is required"),
  productionLineCode: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Production line code is required"),
  plantName: Yup.object().shape({
    label: Yup.string().required("Plant Name is required"),
    value: Yup.string().required("Plant Name is required"),
  }),
  shopFloorName: Yup.object().shape({
    label: Yup.string().required("Shop Floor is required"),
    value: Yup.string().required("Shop Floor is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  isEdit,
  plantNameDDL,
  shopFloorDDL,
  setShopFloorDDL,
  selectedBusinessUnit,
  profileData,
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

            <Form>
              <div className="row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="plantName"
                    options={plantNameDDL}
                    value={values?.plantName}
                    onChange={(valueOption) => {
                      getShopFloorDDL(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        valueOption?.value,
                        setShopFloorDDL
                      );
                      setFieldValue("plantName", valueOption);
                      setFieldValue("shopFloorName", "");
                    }}
                    placeholder="Plant Name"
                    label="Plant Name"
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
                  />{" "}
                              
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="shopFloorName"
                    options={shopFloorDDL}
                    value={values?.shopFloorName}
                    onChange={(valueOption) => {
                      setFieldValue("shopFloorName", valueOption);
                    }}
                    placeholder="Shop Floor"
                    label="Shop Floor"
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={
                      values?.productionLineName
                        ? values?.productionLineName
                        : ""
                    }
                    label="Production Line Name"
                    name="productionLineName"
                    type="text"
                    placeholder="Production Line Name"
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.productionLineCode || ""}
                    label="Production Line Code"
                    name="productionLineCode"
                    type="text"
                    placeholder="Production Line Code"
                    disabled={isEdit}
                  />
                </div>
              </div>
              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onClick={() => handleSubmit}
              ></button>
              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
            <br />
          </>
        )}
      </Formik>
    </>
  );
}
