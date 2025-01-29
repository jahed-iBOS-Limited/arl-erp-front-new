import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import {
  getDistributionChannelDDL,
  getTerritoryTypeDDL,
  getTerritoryDDLByTypeAndDisId,
} from "../helper";

// Validation schema
const validationSchema = Yup.object().shape({
  territoryName: Yup.object().shape({
    label: Yup.string().required("Territory Name is required"),
    value: Yup.string().required("Territory Name is required"),
  }),
  distributionChannel: Yup.object().shape({
    label: Yup.string().required("Distribution Channel is required"),
    value: Yup.string().required("Distribution Channel is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  profileData,
  selectedBusinessUnit,
  // disableHandler,
  location,
  setIsRoutePlanWeekwise,
  weeklyRowDto,
  setWeeklyCategoryHandler,
  monthlyRowDto,
  setMonthlyCategoryHandler,
  isEdit,
}) {
  const [territoryNameDDL, setTerritoryNameDDL] = useState([]);
  const [territoryTypeNameDDL, setTerritoryTypeNameDDL] = useState([]);
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);

  useEffect(() => {
    if (profileData && selectedBusinessUnit) {
      getDistributionChannelDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setDistributionChannelDDL
      );
      getTerritoryTypeDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setTerritoryTypeNameDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

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
              <div className="global-form">
                <div className="form-group row">
                  <div className="col-lg-3">
                    <InputField
                      type="text"
                      value={location?.employee?.label}
                      label="Employee Name"
                      placeholder="Employee Name"
                      name="employeeName"
                      disabled
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      type="text"
                      value={location?.territoryName}
                      label="Existing Territory Name"
                      placeholder="Existing Territory Name"
                      name="existingTerritoryName"
                      disabled
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      type="text"
                      value={location?.distributionChanelId}
                      label="Existing Distribution Channel"
                      placeholder="Existing Distribution Channel"
                      name="existingDistributionChannel"
                      disabled
                    />
                  </div>
                  <div className="col-lg-12"></div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="distributionChannel"
                      options={
                        [
                          ...distributionChannelDDL,
                          { value: 0, label: "Top" },
                        ] || []
                      }
                      value={values?.distributionChannel}
                      label="Distribution Channel Name"
                      onChange={(valueOption) => {
                        setFieldValue("distributionChannel", valueOption);
                      }}
                      placeholder="Distribution Name"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="territoryTypeName"
                      options={territoryTypeNameDDL}
                      value={values?.territoryTypeName}
                      label="Territory Type"
                      onChange={(valueOption) => {
                        setFieldValue("territoryTypeName", valueOption);
                        setFieldValue("territoryName", "");
                        getTerritoryDDLByTypeAndDisId(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          values?.distributionChannel?.value,
                          valueOption?.value,
                          setTerritoryNameDDL
                        );
                      }}
                      placeholder="Territory Type"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="territoryName"
                      options={territoryNameDDL}
                      value={values?.territoryName}
                      label="Territory Name"
                      onChange={(valueOption) => {
                        setFieldValue("territoryName", valueOption);
                      }}
                      placeholder="Territory Name"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
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
