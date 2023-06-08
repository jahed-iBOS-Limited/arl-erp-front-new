import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import {
  GetHSCodeByTarrifSchedule_api,
  getItemCategoryDDLByTypeId_api,
} from "../helper";
import moment from "moment";
import { useSelector, shallowEqual } from "react-redux";
// Validation schema
const validationSchema = Yup.object().shape({
  taxItemCategoryId: Yup.object().shape({
    label: Yup.string().required("Item Category is required"),
    value: Yup.string().required("Item Category is required"),
  }),
  taxItemGroupName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Item Name is required"),
  itemTypeId: Yup.object().shape({
    label: Yup.string().required("Tax Item Type is required"),
    value: Yup.string().required("Tax Item Type is required"),
  }),
  supplyTypeId: Yup.object().shape({
    label: Yup.string().required("Supply Type  is required"),
    value: Yup.string().required("Supply Type is required"),
  }),
  hsCode: Yup.object().shape({
    label: Yup.string().required("HSCode is required"),
    value: Yup.string().required("HSCode is required"),
  }),
  taxItemTypeId: Yup.object().shape({
    label: Yup.string().required("Item Type is required"),
    value: Yup.string().required("Item Type is required"),
  }),
  uomName: Yup.object().shape({
    label: Yup.string().required("UOM is required"),
    value: Yup.string().required("UOM is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  taxItemTypeDDL,
  supplyTypeDDL,
  hsCodeDDL,
  itemTypeListDDL,
  itemUOMDDL,
  isEdit,
}) {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const [tarrifScheduleInfoOne, setTarrifScheduleInfoOne] = useState([]);
  const [tarrifScheduleInfoTwo, setTarrifScheduleInfoTwo] = useState([]);
  const [itemCategoryDDL, setItemCategoryDDL] = useState("");

  useEffect(() => {
    if (initData?.itemTypeId?.value) {
      setItemCategoryDDL([]);
      getItemCategoryDDLByTypeId_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        initData?.itemTypeId?.value,
        setItemCategoryDDL
      );
      GetHSCodeByTarrifSchedule_api(
        initData?.hsCode?.label,
        1,
        setTarrifScheduleInfoOne
      );
      GetHSCodeByTarrifSchedule_api(
        initData?.hsCode?.label,
        2,
        setTarrifScheduleInfoTwo
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initData]);
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
                {!isEdit && (
                  <div className="col-lg-3">
                    <NewSelect
                      name="itemTypeId"
                      options={itemTypeListDDL}
                      value={values?.itemTypeId}
                      label="Item Type"
                      onChange={(valueOption) => {
                        setFieldValue("itemTypeId", valueOption);
                        setFieldValue("taxItemCategoryId", "");
                        setItemCategoryDDL([]);
                        getItemCategoryDDLByTypeId_api(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          valueOption?.value,
                          setItemCategoryDDL
                        );
                      }}
                      placeholder="Item Type"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                )}
                <div className="col-lg-3">
                  <NewSelect
                    name="taxItemCategoryId"
                    options={itemCategoryDDL}
                    value={values?.taxItemCategoryId}
                    label="Item Category"
                    onChange={(valueOption) => {
                      setFieldValue("taxItemCategoryId", valueOption);
                      // dispatch(getDivisionDDLAction(valueOption?.value));
                    }}
                    placeholder="Item Category"
                    errors={errors}
                    touched={touched}
                    isDisabled={!values?.itemTypeId}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Item Name</label>
                  <InputField
                    value={values?.taxItemGroupName || ""}
                    name="taxItemGroupName"
                    placeholder="Item Name"
                    type="text"
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="uomName"
                    options={itemUOMDDL}
                    value={values?.uomName}
                    label="UOM"
                    onChange={(valueOption) => {
                      setFieldValue("uomName", valueOption);
                    }}
                    placeholder="UOM"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="supplyTypeId"
                    options={supplyTypeDDL}
                    value={values?.supplyTypeId}
                    label="Supply Type"
                    onChange={(valueOption) => {
                      setFieldValue("supplyTypeId", valueOption);
                    }}
                    placeholder="Supply Type"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="hsCode"
                    options={hsCodeDDL}
                    value={values?.hsCode}
                    label="HS Code"
                    onChange={(valueOption) => {
                      setTarrifScheduleInfoOne([]);
                      setTarrifScheduleInfoTwo([]);
                      GetHSCodeByTarrifSchedule_api(
                        valueOption?.label,
                        1,
                        setTarrifScheduleInfoOne
                      );
                      GetHSCodeByTarrifSchedule_api(
                        valueOption?.label,
                        2,
                        setTarrifScheduleInfoTwo
                      );
                      setFieldValue("hsCode", valueOption);
                    }}
                    placeholder="HS Code"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="taxItemTypeId"
                    options={taxItemTypeDDL}
                    value={values?.taxItemTypeId}
                    label="Tax Item Type"
                    onChange={(valueOption) => {
                      setFieldValue("taxItemTypeId", valueOption);
                    }}
                    placeholder=" Tax Item Type"
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>

              {values?.hsCode && (
                <>
                  {/* part One */}
                  <div className="form-group row global-form pt-1 mt-1">
                    <div className="col-lg-4 d-flex">
                      <div className="mr-8">
                        <label style={{ display: "block" }}>
                          <span style={{ fontWeight: "bold" }}>HSCode: </span>{" "}
                          {values?.hsCode?.label}
                        </label>
                      </div>
                      {tarrifScheduleInfoOne?.length > 0 && (
                        <div className="">
                          <label style={{ display: "block" }}>
                            <span style={{ fontWeight: "bold" }}>Unit: </span>{" "}
                            {tarrifScheduleInfoOne?.[0]?.strUnit}
                          </label>
                        </div>
                      )}
                    </div>
                    <div className="col-lg-8">
                      <label style={{ display: "block" }}>
                        <span style={{ fontWeight: "bold" }}>
                          Description:{" "}
                        </span>{" "}
                        {values?.hsCode?.description}
                      </label>
                    </div>
                    {tarrifScheduleInfoOne?.length > 0 && (
                      <>
                        <div
                          className="col-12 text-center"
                          style={{ fontSize: "14px" }}
                        >
                          <b>Tarrif Schedule</b>
                        </div>
                        <div className="d-flex justify-content-between w-100 px-4">
                          <div className="">
                            <label style={{ display: "block" }}>
                              <span style={{ fontWeight: "bold" }}>CD: </span>{" "}
                              {tarrifScheduleInfoOne?.[0]?.cd}
                            </label>
                          </div>
                          <div className="">
                            <label style={{ display: "block" }}>
                              <span style={{ fontWeight: "bold" }}>RD: </span>{" "}
                              {tarrifScheduleInfoOne?.[0]?.rd}
                            </label>
                          </div>

                          <div className="">
                            <label style={{ display: "block" }}>
                              <span style={{ fontWeight: "bold" }}>SD: </span>{" "}
                              {tarrifScheduleInfoOne?.[0]?.sd}
                            </label>
                          </div>
                          <div className="">
                            <label style={{ display: "block" }}>
                              <span style={{ fontWeight: "bold" }}>Vat: </span>{" "}
                              {tarrifScheduleInfoOne?.[0]?.vat}
                            </label>
                          </div>
                          <div className="">
                            <label style={{ display: "block" }}>
                              <span style={{ fontWeight: "bold" }}>AIT: </span>{" "}
                              {tarrifScheduleInfoOne?.[0]?.ait}
                            </label>
                          </div>

                          <div className="">
                            <label style={{ display: "block" }}>
                              <span style={{ fontWeight: "bold" }}>AT: </span>{" "}
                              {tarrifScheduleInfoOne?.[0]?.atv}
                            </label>
                          </div>
                          <div className="">
                            <label style={{ display: "block" }}>
                              <span style={{ fontWeight: "bold" }}>TTI: </span>{" "}
                              {tarrifScheduleInfoOne?.[0]?.tti}
                            </label>
                          </div>
                          <div className="">
                            <label style={{ display: "block" }}>
                              <span style={{ fontWeight: "bold" }}>EXD: </span>{" "}
                              {tarrifScheduleInfoOne?.[0]?.exd}
                            </label>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  {/* part Two */}
                  {tarrifScheduleInfoTwo?.length > 0 && (
                    <div className="form-group row global-form mt-1 pt-1">
                      <div
                        className="col-lg-12 text-center"
                        style={{ fontSize: "14px" }}
                      >
                        <b>Tafsil</b>
                      </div>

                      <div className="table-responsive">
                        <table className="table table-striped table-bordered global-table mt-1">
                          <thead>
                            <tr>
                              <th>SL</th>
                              <th>Tafsil</th>
                              <th>SD</th>
                              <th>Vat</th>
                              <th>Year</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tarrifScheduleInfoTwo?.map((item, idx) => (
                              <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>{item?.scheduleType}</td>
                                <td>{item?.sd}</td>
                                <td>{item?.vat}</td>
                                <td>
                                  {`${moment(item?.fiscalYear).format(
                                    "YYYY"
                                  )}-${+moment(item?.fiscalYear).format(
                                    "YYYY"
                                  ) + 1}`}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              )}
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
