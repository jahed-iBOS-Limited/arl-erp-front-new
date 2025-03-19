import React, { useState } from "react";
import { Formik, Form } from "formik";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import {
  getAreaList,
  getItemList,
  getApproveLiftingEntryList,
  getRegionList,
} from "../helper";
import { ApprovedList } from "./components/approvedList";
import { UnApprovedList } from "./components/unApprovedList";

export default function _Form({
  initData,
  btnRef,
  rowData,
  setRowData,
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
  const [gridData, setGridData] = useState([]);

  const getApprovedData = (values) => {
    getApproveLiftingEntryList(
      values?.year?.value,
      values?.month?.value,
      values?.area?.value,
      values?.item?.value,
      values?.liftingPlanType?.value,
      setGridData,
      setLoading,
      1 // 1 for Approve Data
    );
  };

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
                            values?.channel?.value,
                            valueOption?.value,
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
                      <div className="d-flex align-items-center">
                        <input
                          type="radio"
                          name="status"
                          onChange={(valueOption) => {
                            setFieldValue("status", "unapproved");
                          }}
                          checked={values?.status === "unapproved"}
                        />
                        <label className="mx-2">Unapproved</label>
                      </div>
                      <div className="d-flex align-items-center">
                        <input
                          type="radio"
                          name="status"
                          onChange={() => {
                            setFieldValue("status", "approve");
                          }}
                          checked={values?.status === "approve"}
                        />
                        <label className="mx-2">Approved</label>
                      </div>
                    </div>

                    <div className="col-lg-3 d-flex align-items-center">
                      <button
                        type="button"
                        className="btn btn-primary mt-4 mr-4"
                        disabled={
                          !values?.month || !values?.year || !values?.area
                        }
                        onClick={() => {
                          if (values?.status === "unapproved") {
                            setGridData([]);
                            commonGridFunc(values);
                          } else {
                            setRowData([]);
                            getApprovedData(values);
                          }
                        }}
                      >
                        View
                      </button>
                    </div>
                    <div className="col d-flex justify-content-between mt-5">
                      <h3 style={{ color: "green" }}>
                        Total Lifting Qty:{" "}
                        {values?.status === "unapproved"
                          ? totalLiftingQty
                          : gridData?.reduce(
                              (acc, obj) => acc + +obj?.numTargetQuantity,
                              0
                            )}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* UnApproved Data List & Form */}
              {values?.status === "unapproved" ? (
                <ApprovedList
                  rowData={rowData}
                  dataChangeHandler={dataChangeHandler}
                  selectedAll={selectedAll}
                  allSelect={allSelect}
                />
              ) : null}

              {/* Approved Data List & Form */}
              {values?.status === "approve" ? (
                <>
                  <UnApprovedList
                    rowData={gridData}
                    dataChangeHandler={dataChangeHandler}
                    selectedAll={selectedAll}
                    allSelect={allSelect}
                  />
                </>
              ) : null}

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
