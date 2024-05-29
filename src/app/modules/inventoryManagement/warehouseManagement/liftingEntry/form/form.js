import { Form, Formik } from "formik";
import moment from "moment";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import TextArea from "../../../../_helper/TextArea";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { getAreaList, getItemList, getRegionList } from "../helper";

export default function _Form({
  initData,
  btnRef,
  rowData,
  distributionChannelDDL,
  commonGridFunc,
  loading,
  dataChangeHandler,
  saveHandler,
  monthDDL,
  salesOrgs,
  profileData,
  selectedBusinessUnit,
  setLoading,
  yearsDDL,
  validationSchema,
  selectedAll,
  allSelect,
  totalLiftingQty,
}) {
  const [itemList, setItemList] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const [areaList, setAreaList] = useState([]);
  const {
    profileData: { userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);
  return (
    <>
      {loading && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData, salesOrg: salesOrgs[0] }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          saveHandler(values);
        }}
      >
        {({ values, errors, touched, setFieldValue, handleSubmit }) => (
          <>
            <Form className="form form-label-right">
              <div className="row mt-2">
                <div className="col-lg-12">
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <NewSelect
                        name="liftingPlanType"
                        options={[
                          { value: 1, label: "Lifting Entry" },
                          { value: 2, label: "Bag Production" },
                        ]}
                        value={values?.liftingPlanType}
                        label="Lifting Plan Type"
                        onChange={(valueOption) => {
                          setFieldValue("liftingPlanType", valueOption);
                        }}
                        placeholder="Lifting Plan Type"
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    <div className="col-lg-3">
                      <NewSelect
                        name="month"
                        options={monthDDL}
                        value={values?.month}
                        label="Month"
                        onChange={(valueOption) => {
                          setFieldValue("month", valueOption);
                        }}
                        placeholder="Month"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="year"
                        options={yearsDDL}
                        value={values?.year}
                        label="Year"
                        onChange={(valueOption) => {
                          setFieldValue("year", valueOption);
                        }}
                        placeholder="Year"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="salesOrg"
                        options={salesOrgs || []}
                        value={values?.salesOrg}
                        label="Sales Organization"
                        onChange={(valueOption) => {
                          setFieldValue("salesOrg", valueOption);
                        }}
                        placeholder="Sales Organization"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="channel"
                        options={distributionChannelDDL || []}
                        value={values?.channel}
                        label="Distribution Channel"
                        onChange={(valueOption) => {
                          setFieldValue("channel", valueOption);
                          getItemList(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            valueOption?.value,
                            values?.salesOrg?.value,
                            setItemList,
                            setLoading
                          );
                          getRegionList(
                            buId,
                            userId,
                            valueOption?.value,
                            setRegionList,
                            setLoading
                          );
                        }}
                        placeholder="Distribution Channel"
                        errors={errors}
                        touched={touched}
                        isDisabled={!values?.salesOrg}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="item"
                        options={itemList || []}
                        value={values?.item}
                        label="Item"
                        onChange={(valueOption) => {
                          setFieldValue("item", valueOption);
                        }}
                        placeholder="Item"
                        errors={errors}
                        touched={touched}
                        isDisabled={!values?.channel || !values?.salesOrg}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="region"
                        options={regionList || []}
                        value={values?.region}
                        label="Region"
                        onChange={(valueOption) => {
                          setFieldValue("region", valueOption);
                          getAreaList(
                            buId,
                            userId,
                            valueOption?.value,
                            values?.channel?.value,
                            setAreaList,
                            setLoading
                          );
                        }}
                        placeholder="Region"
                        errors={errors}
                        touched={touched}
                        isDisabled={!values?.channel || !values?.salesOrg}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="area"
                        options={areaList || []}
                        value={values?.area}
                        label="Area"
                        onChange={(valueOption) => {
                          setFieldValue("area", valueOption);
                        }}
                        placeholder="Area"
                        errors={errors}
                        touched={touched}
                        isDisabled={
                          !values?.channel ||
                          !values?.salesOrg ||
                          !values?.region
                        }
                      />
                    </div>

                    <div className="col-lg-3 d-flex align-items-center">
                      <button
                        type="button"
                        className="btn btn-primary mt-4 mr-4"
                        disabled={
                          !values?.month || !values?.year || !values?.area
                        }
                        onClick={() => {
                          commonGridFunc(values);
                        }}
                      >
                        View
                      </button>
                    </div>
                    <div className="col d-flex justify-content-between mt-5">
                      <h3 style={{ color: "green" }}>
                        Total Lifting Qty: {totalLiftingQty}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table Start */}
              {rowData?.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        <th
                          onClick={() => allSelect(!selectedAll())}
                          className="text-center cursor-pointer"
                          style={{ width: "40px" }}
                        >
                          <input
                            type="checkbox"
                            value={selectedAll()}
                            checked={selectedAll()}
                            onChange={() => {}}
                          />
                        </th>
                        <th style={{ width: "30px" }}>SL</th>
                        <th>Date</th>
                        <th>Average Target</th>
                        <th style={{ width: "150px" }}>Lifting Qty</th>
                        <th style={{ width: "600px" }}>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowData?.map((td, index) => (
                        <tr key={index}>
                          <td className="text-center">
                            <input
                              onClick={() => {
                                dataChangeHandler(
                                  index,
                                  "isSelected",
                                  !td.isSelected
                                );
                              }}
                              disabled={td?.isApprove}
                              type="checkbox"
                              value={td?.isSelected}
                              checked={td?.isSelected}
                              onChange={() => {}}
                            />
                          </td>
                          <td className="text-center">{index + 1}</td>
                          <td>
                            <div className="pl-2">
                              {moment(td?.date).format("LL")}
                            </div>
                          </td>
                          <td className="text-right">
                            <div className="pl-2">
                              {td?.avgTargetQty ? td?.avgTargetQty : 0}
                            </div>
                          </td>
                          <td>
                            <InputField
                              value={td?.liftingQty}
                              name="liftingQty"
                              placeholder="Lifting Qty"
                              type="number"
                              disabled={td?.isApprove}
                              onChange={(e) => {
                                dataChangeHandler(
                                  index,
                                  "liftingQty",
                                  e?.target?.value
                                );

                                if (e?.target?.value > 0 && !td?.isSelected) {
                                  dataChangeHandler(index, "isSelected", true);
                                } else if (
                                  td?.isSelected &&
                                  e?.target?.value <= 0
                                ) {
                                  dataChangeHandler(index, "isSelected", false);
                                }
                              }}
                            />
                          </td>
                          <td>
                            <TextArea
                              value={td?.remarks}
                              name="remarks"
                              placeholder="Remarks"
                              type="text"
                              disabled={td?.isApprove}
                              onChange={(e) => {
                                dataChangeHandler(
                                  index,
                                  "remarks",
                                  e?.target?.value
                                );
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
