/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import moment from "moment";
import React, { useState } from "react";
import * as Yup from "yup";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import { getRegionAreaTerritory } from "../../../report/customerSalesTargetReport/helper";

// Validation schema
const validationSchema = Yup.object().shape({
  customerName: Yup.string().required("Customer Name is required"),
  customerPhone: Yup.string()
    .min(11, "Minimum 11 digit")
    .max(11, "Maximum 11 digit"),
  customerAddress: Yup.string().required("Customer Address is required"),
  contractPersonName: Yup.string().required("Contract Person Name is required"),
  contractPersonPhone: Yup.string()
    .min(11, "Minimum 11 digit")
    .max(11, "Maximum 11 digit"),
  conversionDate: Yup.string().required("Conversion Date is required"),
  conversionDeadline: Yup.string().required("Conversion Deadline is required"),
  territory: Yup.object().shape({
    label: Yup.string().required("Territory is required"),
    value: Yup.string().required("Territory is required"),
  }),
  category: Yup.object().shape({
    label: Yup.string().required("Customer Visit Category is required"),
    value: Yup.string().required("Customer Visit Category is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  isEdit,
  categoryDDL,
  channelList,
  setDisabled,
}) {
  const [regionList, setRegionList] = useState([]);
  const [areaList, setAreaList] = useState([]);
  const [territoryList, setTerritoryList] = useState([]);

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
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-12">
                  <div className="row global-form">
                    <>
                      {!isEdit ? (
                        <>
                          <div className="col-lg-3">
                            <NewSelect
                              name="distributionChannel"
                              options={channelList}
                              value={values?.distributionChannel}
                              label="Distribution Channel"
                              onChange={(valueOption) => {
                                setFieldValue(
                                  "distributionChannel",
                                  valueOption
                                );
                                setFieldValue("region", "");
                                setFieldValue("area", "");
                                setFieldValue("territory", "");
                                if (valueOption) {
                                  getRegionAreaTerritory({
                                    channelId: valueOption?.value,
                                    setter: setRegionList,
                                    setLoading: setDisabled,
                                    value: "regionId",
                                    label: "regionName",
                                  });
                                }
                              }}
                              placeholder="Distribution Channel"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-lg-3">
                            <NewSelect
                              name="region"
                              options={regionList}
                              value={values?.region}
                              label="Region"
                              onChange={(valueOption) => {
                                setFieldValue("region", valueOption);
                                setFieldValue("area", "");
                                setFieldValue("territory", "");
                                if (valueOption) {
                                  getRegionAreaTerritory({
                                    channelId:
                                      values?.distributionChannel?.value,
                                    regionId: valueOption?.value,
                                    setter: setAreaList,
                                    setLoading: setDisabled,
                                    value: "areaId",
                                    label: "areaName",
                                  });
                                }
                              }}
                              placeholder="Region"
                              errors={errors}
                              touched={touched}
                              isDisabled={
                                !values?.distributionChannel ||
                                values?.distributionChannel?.value === 0
                              }
                            />
                          </div>
                          <div className="col-lg-3">
                            <NewSelect
                              name="area"
                              options={areaList}
                              value={values?.area}
                              label="Area"
                              onChange={(valueOption) => {
                                setFieldValue("area", valueOption);
                                setFieldValue("territory", "");
                                if (valueOption) {
                                  getRegionAreaTerritory({
                                    channelId:
                                      values?.distributionChannel?.value,
                                    regionId: values?.region?.value,
                                    areaId: valueOption?.value,
                                    setter: setTerritoryList,
                                    setLoading: setDisabled,
                                    value: "territoryId",
                                    label: "territoryName",
                                  });
                                }
                              }}
                              placeholder="Area"
                              errors={errors}
                              touched={touched}
                              isDisabled={
                                !values?.region || values?.region?.value === 0
                              }
                            />
                          </div>
                        </>
                      ) : null}

                      <div className="col-lg-3">
                        <NewSelect
                          name="territory"
                          options={territoryList}
                          value={values?.territory}
                          label="Territory"
                          onChange={(valueOption) => {
                            setFieldValue("territory", valueOption);
                          }}
                          placeholder="Territory"
                          errors={errors}
                          touched={touched}
                          isDisabled={
                            isEdit ||
                            !values?.region ||
                            !values?.area ||
                            values?.region?.value === 0
                          }
                        />
                      </div>

                      <div className="col-lg-3">
                        <NewSelect
                          name="category"
                          options={categoryDDL || []}
                          value={values?.category}
                          label="Customer Visit Type"
                          onChange={(valueOption) => {
                            setFieldValue("category", valueOption);
                          }}
                          placeholder="Customer Visit Type"
                          errors={errors}
                          touched={touched}
                          isDisabled={isEdit}
                        />
                      </div>

                      <div className="col-lg-3">
                        <InputField
                          value={values?.customerName}
                          placeholder="Customer Name"
                          label="Customer Name"
                          name="customerName"
                          disabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.customerPhone}
                          placeholder="Customer Phone"
                          label="Customer Phone"
                          name="customerPhone"
                          disabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.customerAddress}
                          label="Customer Address"
                          placeholder="Customer Address"
                          name="customerAddress"
                          type="text"
                          disabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.contractPersonName}
                          placeholder="Contract Person Name"
                          label="Contract Person Name"
                          name="contractPersonName"
                          disabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.contractPersonPhone}
                          placeholder="Contract Person Phone"
                          label="Contract Person Phone"
                          name="contractPersonPhone"
                          disabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.contractPersonDesignation}
                          label="Contract Person Designation"
                          placeholder="Contract Person Designation"
                          name="contractPersonDesignation"
                          type="text"
                          disabled={isEdit}
                        />
                      </div>

                      <div className="col-lg-3">
                        <InputField
                          label="Conversion Deadline"
                          value={values?.conversionDeadline}
                          name="conversionDeadline"
                          type="date"
                          disabled={true}
                        />
                      </div>

                      <div className="col-lg-3">
                        <InputField
                          label="Conversion Date"
                          value={values?.conversionDate}
                          onChange={(e) => {
                            setFieldValue("conversionDate", e.target.value);
                            setFieldValue(
                              "conversionDeadline",
                              _dateFormatter(
                                moment(e.target.value).add(30, "days")
                              )
                            );
                          }}
                          name="conversionDate"
                          type="date"
                          disabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.remarks}
                          label="Remarks"
                          placeholder="Remarks"
                          name="remarks"
                          type="text"
                        />
                      </div>
                    </>
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
