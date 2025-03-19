import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { yearsDDL } from "../../../../inventoryManagement/warehouseManagement/liftingEntry/form/addEditForm";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import { monthDDL } from "../../salesanalytics/utils";
import {
  getBusinessUnitSalesOrgApi,
  getRegionAreaTerritory,
  GetSalesTargetEntry,
} from "../helper";
import Table from "./table";

const validationSchema = Yup.object().shape({
  targetMonth: Yup.object().shape({
    label: Yup.string().required("Target Month  is required"),
    value: Yup.string().required("Target Month  is required"),
  }),
  targetYear: Yup.object().shape({
    label: Yup.string().required("Target Year  is required"),
    value: Yup.string().required("Target Year  is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  isEdit,
  setRowDto,
  rowDto,
  distributionChannelDDL,
  buId,
  accId,
  setLoading,
}) {
  const [regionDDL, setRegionDDL] = useState([]);
  const [areaDDL, setAreaDDL] = useState([]);
  const [salesOrgDDL, setSalesOrgDDL] = useState([]);

  useEffect(() => {
    if (buId && accId) {
      getBusinessUnitSalesOrgApi(accId, buId, setSalesOrgDDL);
    }
  }, [buId, accId]);

  const rowDtoHandler = (e, sl) => {
    const cloneArray = [...rowDto];
    cloneArray[sl][e.target?.name] =
      e?.target?.name === "isSelected" ? e?.target?.checked : e.target?.value;
    cloneArray[sl].amount = cloneArray[sl]?.itemSalesRate * e.target?.value;
    setRowDto([...cloneArray]);
  };

  useEffect(() => {
    if (isEdit && initData?.distributionChannel?.value) {
      getRegionAreaTerritory({
        channelId: initData?.distributionChannel?.value,
        setter: setRegionDDL,
        setLoading: setLoading,
        value: "regionId",
        label: "regionName",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          salesOrg: salesOrgDDL?.[0] || "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          console.log(values, "values");
          saveHandler(values, rowDto, () => {
            resetForm(initData);
            setRowDto([]);
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
        }) => (
          <>
            {console.log(errors, "errors")}
            <Form className="form form-label-right">
              <div className="global-form p-2">
                <div className="form-group row">
                  <div className="col-lg-3">
                    <InputField
                      value={values?.sbu?.label}
                      label="SBU"
                      name="sbu"
                      type="text"
                      disabled={true}
                    />
                  </div>

                  <div className="col-lg-3 mt-5">
                    <h6>
                      Total Target Amount:{" "}
                      {rowDto
                        ?.filter((element) => element?.isSelected)
                        ?.reduce((a, b) => a + +b.targetAmount, 0)}
                    </h6>
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="targetMonth"
                      options={monthDDL || []}
                      value={values?.targetMonth}
                      label="Target Month"
                      onChange={(valueOption) => {
                        setFieldValue("targetMonth", valueOption);
                        setRowDto([]);
                      }}
                      placeholder="Target Month"
                      errors={errors}
                      touched={touched}
                      isDisabled={isEdit}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="targetYear"
                      options={yearsDDL || []}
                      value={values?.targetYear}
                      label="Target Year"
                      onChange={(valueOption) => {
                        setFieldValue("targetYear", valueOption);
                        setRowDto([]);
                      }}
                      placeholder="Select Target Year"
                      errors={errors}
                      touched={touched}
                      isDisabled={isEdit}
                    />
                  </div>
                  {isEdit && (
                    <div className="col-lg-3">
                      <InputField
                        value={values?.distributionChannel?.label}
                        label="Distribution Channel"
                        name="distributionChannel"
                        type="text"
                        disabled
                      />
                    </div>
                  )}
                  {[171, 224].includes(buId) && !isEdit && (
                    <>
                      <div className="col-lg-3">
                        <NewSelect
                          name="salesOrg"
                          options={salesOrgDDL}
                          value={values?.salesOrg}
                          label="Sales Org"
                          onChange={(valueOption) => {
                            setRowDto([]);
                            setFieldValue("salesOrg", valueOption);
                            setFieldValue("item", "");
                          }}
                          placeholder="Sales Org"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="distributionChannel"
                          options={distributionChannelDDL}
                          value={values?.distributionChannel}
                          label="Distribution Channel"
                          onChange={(valueOption) => {
                            setRowDto([]);
                            setFieldValue("distributionChannel", valueOption);
                            setFieldValue("region", "");
                            setFieldValue("area", "");
                            setFieldValue("item", "");
                            getRegionAreaTerritory({
                              channelId: valueOption?.value,
                              setter: setRegionDDL,
                              setLoading: setLoading,
                              value: "regionId",
                              label: "regionName",
                            });
                          }}
                          placeholder="Distribution Channel"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      {/* <div className="col-lg-3">
                        <NewSelect
                          name="item"
                          options={itemDDL}
                          value={values?.item}
                          label="Item"
                          onChange={(valueOption) => {
                            setRowDto([]);
                            setFieldValue("item", valueOption);
                          }}
                          placeholder="Item"
                          errors={errors}
                          touched={touched}
                          isDisabled={!values?.distributionChannel}
                        />
                      </div> */}
                      <div className="col-lg-3">
                        <NewSelect
                          name="region"
                          options={regionDDL || []}
                          value={values?.region}
                          label="Region"
                          onChange={(valueOption) => {
                            setFieldValue("area", "");
                            setRowDto([]);
                            setFieldValue("region", valueOption);
                            if (valueOption) {
                              getRegionAreaTerritory({
                                channelId: values?.distributionChannel?.value,
                                regionId: valueOption?.value,
                                setter: setAreaDDL,
                                setLoading: setLoading,
                                value: "areaId",
                                label: "areaName",
                              });
                            }
                          }}
                          placeholder="Region"
                          errors={errors}
                          touched={touched}
                          isDisabled={!values?.distributionChannel}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="area"
                          options={areaDDL || []}
                          value={values?.area}
                          label="Area"
                          onChange={(valueOption) => {
                            setRowDto([]);
                            setFieldValue("area", valueOption);
                          }}
                          placeholder="Area"
                          errors={errors}
                          touched={touched}
                          isDisabled={!values?.region}
                        />
                      </div>
                      <div className="col-lg-3 mt-5">
                        <div className="d-flex">
                          <button
                            className="btn btn-primary"
                            type="button"
                            disabled={
                              !values?.area ||
                              !values?.salesOrg ||
                              !values?.targetYear ||
                              !values?.targetMonth ||
                              !values?.sbu
                            }
                            onClick={() => {
                              setRowDto([]);
                              GetSalesTargetEntry(
                                accId,
                                buId,
                                values,
                                setRowDto,
                                setLoading
                              );
                            }}
                          >
                            Target Entry
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {rowDto?.length > 0 && (
                <Table
                  rowDto={rowDto}
                  rowDtoHandler={rowDtoHandler}
                  setRowDto={setRowDto}
                />
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
