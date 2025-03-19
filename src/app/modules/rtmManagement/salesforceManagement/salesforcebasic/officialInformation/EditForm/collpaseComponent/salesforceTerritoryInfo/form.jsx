import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "../../../../../../../_helper/_select";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../../../../_metronic/_partials/controls";
import {
  // getTerritoryByTypeIdDDL,
  getTerritoryDDLByTypeAndDisId,
  // getRegionDDL,
  // getPointDDL,
  // getAreaDDL,
  // getTerritoryDDL,
  // getSectionDDL,
} from "./helper";

// Validation schema
const validationSchema = Yup.object().shape({
  territoryType: Yup.object().shape({
    label: Yup.string().required("Territory Type is required"),
    value: Yup.string().required("Territory Type is required"),
  }),
  territory: Yup.object().shape({
    label: Yup.string().required("Territory is required"),
    value: Yup.string().required("Territory is required"),
  }),
  distributionChannel: Yup.object().shape({
    label: Yup.string().required("Distribution Channel is required"),
    value: Yup.string().required("Distribution Channel is required"),
  }),
  // section: Yup.object().shape({
  //   label: Yup.string().required("Section is required"),
  //   value: Yup.string().required("Section is required"),
  // }),
});

export default function _Form({
  initData,
  saveHandler,
  setEdit,
  edit,
  isDisabled,
  profileData,
  selectedBusinessUnit,
  singleData,
  distributionChannelDDL,
  territoryTypeDDL,
}) {
  // Last Change DDL | Assign By Iftakhar Alam
  const [territoryDDL, setTerritoryDDL] = useState([]);
  // const [regionDDL, setRegionDDL] = useState([]);
  // const [areaDDL, setAreaDDL] = useState([]);
  // const [pointDDL, setPointDDL] = useState([]);
  // const [sectionDDL, setSectionDDL] = useState([]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            // resetForm(initData);
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
          <div className={!edit ? "editForm" : ""}>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Create Salesforce Territory Information"}>
                <CardHeaderToolbar>
                  {edit ? (
                    <>
                      <button
                        onClick={() => {
                          setEdit(false);
                          resetForm(initData);
                        }}
                        className="btn btn-light "
                        type="button"
                      >
                        <i className="fas fa-times pointer"></i>
                        Close
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="btn btn-primary ml-2"
                        type="submit"
                        disabled={isDisabled}
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    !initData?.configId && (
                      <button
                        onClick={() => setEdit(true)}
                        className="btn btn-light"
                        type="button"
                      >
                        <i className="fas fa-pen-square pointer"></i>
                        Edit
                      </button>
                    )
                  )}
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="row global-form global-form-custom bj-left pb-2">
                    {/* Bussiness Chnage | Assign By Iftakhar Alam */}
                    <div className="col-lg-3">
                      <NewSelect
                        name="distributionChannel"
                        options={[...distributionChannelDDL, {value:0, label: "Top"}] || []}
                        value={values?.distributionChannel}
                        label="Distribution Channel"
                        onChange={(valueOption) => {
                          setFieldValue("distributionChannel", valueOption);
                        }}
                        placeholder="Distribution Channel"
                        errors={errors}
                        touched={touched}
                        isDisabled={!edit}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="territoryType"
                        options={territoryTypeDDL || []}
                        value={values?.territoryType}
                        label="Territory Type"
                        onChange={(valueOption) => {
                          // Bussiness Change
                          // getTerritoryByTypeIdDDL(
                          //   profileData?.accountId,
                          //   selectedBusinessUnit?.value,
                          //   valueOption?.value,
                          //   setTerritoryDDL
                          // );
                          getTerritoryDDLByTypeAndDisId(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.distributionChannel?.value,
                            valueOption?.value,
                            setTerritoryDDL
                          );
                          setFieldValue("territory", "");
                          setFieldValue("territoryType", valueOption);
                        }}
                        placeholder="Territory Type"
                        errors={errors}
                        touched={touched}
                        isDisabled={!edit}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="territory"
                        options={territoryDDL || []}
                        value={values?.territory}
                        label="Territory"
                        onChange={(valueOption) => {
                          setFieldValue("territory", valueOption);
                        }}
                        placeholder="Territory"
                        errors={errors}
                        touched={touched}
                        isDisabled={!edit}
                      />
                    </div>

                    {/* Business Change | Assign By Iftakhar Alam */}
                    {/* <div className="col-lg-3">
                      <NewSelect
                        name="distributionChannel"
                        options={distributionChannelDDL || []}
                        value={values?.distributionChannel}
                        label="Distribution Channel"
                        onChange={(valueOption) => {
                          setFieldValue("distributionChannel", valueOption);
                          getRegionDDL(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            valueOption?.value,
                            setRegionDDL
                          );

                          setFieldValue("region", "");
                          setFieldValue("area", "");
                          setFieldValue("territory", "");
                          setFieldValue("point", "");
                          setFieldValue("section", "");
                        }}
                        placeholder="Distribution Channel"
                        errors={errors}
                        touched={touched}
                        isDisabled={!edit}
                      />
                    </div>

                    <div className="col-lg-3">
                      <NewSelect
                        name="region"
                        options={regionDDL}
                        value={values?.region}
                        label="Select Region"
                        onChange={(valueOption) => {
                          setFieldValue("region", valueOption);
                          setFieldValue("area", "");
                          setFieldValue("territory", "");
                          setFieldValue("point", "");
                          setFieldValue("section", "");
                          getAreaDDL(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.distributionChannel?.value,
                            valueOption?.value,
                            setAreaDDL
                          );
                        }}
                        placeholder="Region"
                        errors={errors}
                        touched={touched}
                        isDisabled={regionDDL?.length === 0 || !edit}
                      />
                    </div>

                    <div className="col-lg-3">
                      <NewSelect
                        name="area"
                        options={areaDDL}
                        value={values?.area}
                        label="Select Area"
                        onChange={(valueOption) => {
                          setFieldValue("area", valueOption);
                          setFieldValue("territory", "");
                          setFieldValue("point", "");
                          setFieldValue("section", "");
                          getTerritoryDDL(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.distributionChannel?.value,
                            valueOption?.value,
                            setTerritoryDDL
                          );
                        }}
                        placeholder="Area"
                        errors={errors}
                        touched={touched}
                        isDisabled={areaDDL?.length === 0 || !edit}
                      />
                    </div>

                    <div className="col-lg-3">
                      <NewSelect
                        name="territory"
                        options={territoryDDL}
                        value={values?.territory}
                        label="Select Territory"
                        onChange={(valueOption) => {
                          setFieldValue("territory", valueOption);
                          setFieldValue("point", "");
                          setFieldValue("section", "");
                          getPointDDL(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.distributionChannel?.value,
                            valueOption?.value,
                            setPointDDL
                          );
                        }}
                        placeholder="Territory"
                        errors={errors}
                        touched={touched}
                        isDisabled={territoryDDL?.length === 0 || !edit}
                      />
                    </div>

                    <div className="col-lg-3">
                      <NewSelect
                        name="point"
                        options={pointDDL}
                        value={values?.point}
                        label="Select Point"
                        onChange={(valueOption) => {
                          setFieldValue("point", valueOption);
                          setFieldValue("section", "");
                          getSectionDDL(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.distributionChannel?.value,
                            valueOption?.value,
                            setSectionDDL
                          );
                        }}
                        placeholder="Point"
                        errors={errors}
                        touched={touched}
                        isDisabled={pointDDL?.length === 0 || !edit}
                      />
                    </div>

                    <div className="col-lg-3">
                      <NewSelect
                        name="section"
                        options={sectionDDL}
                        value={values?.section}
                        label="Select Section"
                        onChange={(valueOption) => {
                          setFieldValue("section", valueOption);
                        }}
                        placeholder="Section"
                        errors={errors}
                        touched={touched}
                        isDisabled={sectionDDL?.length === 0 || !edit}
                      />
                    </div> */}
                  </div>
                </Form>
              </CardBody>
            </Card>
          </div>
        )}
      </Formik>
    </>
  );
}
