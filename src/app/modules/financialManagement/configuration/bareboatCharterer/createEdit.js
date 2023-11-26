import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { dateFormatterForInput } from "../../../productionManagement/msilProduction/meltingProduction/helper";
import { _dateFormatter } from "../../../_helper/_dateFormate";

const initData = {
  vessel: "",
  dateRange: "",
  categoryType: "",
  baseType: "",
  particularsType: "",
  rate: "",
  fromDate: "",
  toDate: "",
  insuranceType: "",
  supplier: "",
  profitCenter: "",
  costCenter: "",
  costElement: "",
  isTransfer: false,
  transferBusinessUnit: "",
  transferProfitCenter: "",
  transferRevenueCenter: "",
  transferRevenueElement: "",
};

const validationSchema = Yup.object().shape({
  vessel: Yup.object()
    .shape({
      label: Yup.string().required("Vessel is required"),
      value: Yup.string().required("Vessel is required"),
    })
    .typeError("Vessel is required"),
  categoryType: Yup.object()
    .shape({
      label: Yup.string().required("Category Type is required"),
      value: Yup.string().required("Category Type is required"),
    })
    .typeError("Category Type is required"),
  baseType: Yup.object()
    .shape({
      label: Yup.string().required("Base Type is required"),
      value: Yup.string().required("Base Type is required"),
    })
    .typeError("Base Type is required"),
  rate: Yup.number().required("Rate is required"),
});

export default function BareboatChartererConfigCreateEdit() {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [vesselAssetDDL, getVesselAssetDDL, vesselAssetLoading] = useAxiosGet();
  const [baseTypeDDL, getBaseTypeDDL, baseTypeLoading] = useAxiosGet();
  const [supplierDDL, getSupplierDDL, supplierLoading] = useAxiosGet();
  const [
    ,
    bareboatManagementAndInsuranceCreate,
    loaderOnCreate,
  ] = useAxiosPost();
  const [, getSingleData, singleLoading] = useAxiosGet();
  const [
    profitCenterDDL,
    getProfitCenterDDL,
    profitCenterDDLloader,
    setProfitCenterDDL,
  ] = useAxiosGet();
  const [costCenterDDL, getCostCenterDDL, costCenterDDLloader] = useAxiosGet();
  const [
    costElementDDL,
    getCostElementDDL,
    costElementDDLloader,
  ] = useAxiosGet();
  const [
    transferBusinessUnitDDL,
    getTransferBusinessUnitDDL,
    transferBusinessUnitDDLloader,
    setTransferBusinessUnitDDL,
  ] = useAxiosGet();
  const [
    transferProfitCenterDDL,
    getTransferProfitCenterDDL,
    transferProfitCenterDDLloader,
    setTransferProfitCenterDDL,
  ] = useAxiosGet();
  const [
    transferRevenueCenterDDL,
    getTransferRevenueCenterDDL,
    transferRevenueCenterDDLloader,
  ] = useAxiosGet();
  const [
    transferRevenueElementDDL,
    getTransferRevenueElementDDL,
    transferRevenueElementDDLloader,
  ] = useAxiosGet();

  const [
    dateRangeDDL,
    getDateRangeDDL,
    dateRangeDDLloader,
    setDateRangeDDL,
  ] = useAxiosGet();

  const [modifyData, setModifyData] = useState({});
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getSingleData(
        `/fino/BareBoatManagement/GetBareBoatConfig?id=${id}&businessUnitId=${selectedBusinessUnit?.value}`,
        (res) => {
          const data = {
            categoryType: {
              value:
                res?.intCategoryTypeId === 1
                  ? 1
                  : res?.intCategoryTypeId === 2
                  ? 2
                  : 3,
              label:
                res?.intCategoryTypeId === 1
                  ? "Bareboat Management"
                  : res?.intCategoryTypeId === 2
                  ? "Insurance"
                  : "Dry Dock",
            },
            vessel: {
              value: res?.vesselId,
              label: res?.vesselName,
            },
            dateRange:
              res?.intCategoryTypeId === 3
                ? {
                    value: 4,
                    label: `${_dateFormatter(
                      res?.dteFromDate
                    )} - ${_dateFormatter(res?.dteToDate)}`,
                  }
                : "",
            baseType: {
              value: res?.baseType,
              label: res?.baseName,
            },
            particularsType: {
              value: res?.businessTransaction,
              label: res?.businessTransactionName,
            },
            supplier: {
              value: res?.intSupplierId,
              label: res?.strSupplierName,
            },
            insuranceType: {
              value: res?.intInsuranceId,
              label: res?.strInsuranceName,
            },
            fromDate: res?.dteFromDate
              ? dateFormatterForInput(res?.dteFromDate)
              : null,
            toDate: res?.dteToDate
              ? dateFormatterForInput(res?.dteToDate)
              : null,
            rate: res?.rate,
            isTransfer: res?.isTransfer,
            profitCenter: {
              value: res?.intProfitCenterId,
              label: res?.strProfitCenterName,
            },
            costCenter: {
              value: res?.intCostCenterId,
              label: res?.strCostCenterName,
            },
            costElement: {
              value: res?.intCostElementId,
              label: res?.strCostElementName,
            },
            transferBusinessUnit: res?.isTransfer
              ? {
                  value: res?.intTransferBusinessId,
                  label: res?.strTransferBusinessUnitName,
                }
              : "",
            transferProfitCenter: res?.isTransfer
              ? {
                  value: res?.intTransferProfitCenterId,
                  label: res?.strTransferProfitCenterName,
                }
              : "",
            transferRevenueCenter: res?.isTransfer
              ? {
                  value: res?.intTransferRevenueCenterId,
                  label: res?.strTransferRevenueCenterName,
                }
              : "",
            transferRevenueElement: res?.isTransfer
              ? {
                  value: res?.intTransferRevenueElementId,
                  label: res?.strTransferRevenueElementName,
                }
              : "",
          };
          setModifyData(data);

          getCostElementDDL(
            `/procurement/PurchaseOrder/GetCostElementByCostCenter?AccountId=${profileData?.accountId}&UnitId=${selectedBusinessUnit?.value}&CostCenterId=${res?.intCostCenterId}`
          );

          getDateRangeDDL(
            `/fino/Expense/GetDocScheduleListByVesselId?businessUnitId=${selectedBusinessUnit?.value}&vesselId=${res?.vesselId}`,
            (data) => {
              const modifiedData = data?.map((item) => {
                return {
                  ...item,
                  value: 4,
                  label: item?.strScheduleRange,
                };
              });
              setDateRangeDDL(modifiedData);
            }
          );

          if (res?.isTransfer) {
            getTransferProfitCenterDDL(
              `/fino/CostSheet/ProfitCenterDetails?UnitId=${res?.intTransferBusinessId}`,
              (res) => {
                const newData = res?.map((itm) => {
                  itm.value = itm?.profitCenterId;
                  itm.label = itm?.profitCenterName;
                  return itm;
                });
                setTransferProfitCenterDDL(newData);
              }
            );
            getTransferRevenueCenterDDL(
              `/fino/AccountingConfig/GetRevenueCenterList?businessUnitId=${res?.intTransferBusinessId}`
            );
            getTransferRevenueElementDDL(
              `/fino/AccountingConfig/GetRevenueElementList?businessUnitId=${res?.intTransferBusinessId}`
            );
          }
        }
      );
    }
    getSupplierDDL(
      `/procurement/PurchaseOrder/GetSupplierListDDL?AccountId=${profileData?.accountId}&UnitId=${selectedBusinessUnit?.value}&SBUId=0`
    );
    getVesselAssetDDL(
      `/asset/Asset/GetAssetVesselDdl?IntBussinessUintId=${selectedBusinessUnit?.value}`
    );

    getBaseTypeDDL(`/fino/BareBoatManagement/GetBaseTypeDDL`);

    getProfitCenterDDL(
      `/fino/CostSheet/ProfitCenterDetails?UnitId=${selectedBusinessUnit?.value}`,
      (data) => {
        const newData = data?.map((itm) => {
          itm.value = itm?.profitCenterId;
          itm.label = itm?.profitCenterName;
          return itm;
        });
        setProfitCenterDDL(newData);
      }
    );
    getCostCenterDDL(
      `/procurement/PurchaseOrder/GetCostCenter?AccountId=${profileData?.accountId}&UnitId=${selectedBusinessUnit?.value}`
    );
    // getTransferBusinessUnitDDL(`/procurement/PurchaseOrder/TransferPoBusinessUnit?UnitId=${selectedBusinessUnit?.value}`);
    getTransferBusinessUnitDDL(
      `/procurement/PurchaseOrder/TransferPoBusinessUnit_reverse?UnitId=${selectedBusinessUnit?.value}`,
      (res) => {
        const newData = res?.map((itm) => {
          return {
            ...itm,
            value: itm?.businessUnitId,
            label: itm?.businessUnitName,
          };
        });
        setTransferBusinessUnitDDL(newData);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, selectedBusinessUnit, profileData]);

  const [objProps, setObjprops] = useState({});

  const rateCalculateFromDateRange = (date1, date2, rate) => {
    const start = new Date(date1);
    const end = new Date(date2);
    const dateDiffInDays = Math.floor((end - start) / (1000 * 3600 * 24)) + 1;
    const ratePerDay = rate / dateDiffInDays;
    const rateWithFourDecimals = ratePerDay.toFixed(4);
    return parseFloat(rateWithFourDecimals);
  };

  const saveHandler = (values, cb) => {
    const payload = {
      id: id ? +id : 0,
      businessUnitId: selectedBusinessUnit?.value || 0,
      vesselId: values?.vessel?.value || 0,
      vesselName: values?.vessel?.label || "",
      businessTransaction: values?.particularsType?.value || 0,
      businessTransactionName: values?.particularsType?.label || "",
      rate:
        values?.categoryType?.value === 3
          ? rateCalculateFromDateRange(
              values?.fromDate,
              values?.toDate,
              +values?.rate
            )
          : +values?.rate || 0,
      intCategoryTypeId: values?.categoryType?.value || 0,
      baseType: values?.baseType?.value || 0,
      baseName: values?.baseType?.label || "",
      actionById: profileData?.userId,
      actionDateTime: _todayDate(),
      dteFromDate: values?.fromDate || null,
      dteToDate: values?.toDate || null,
      intSupplierId: values?.supplier?.value || 0,
      strSupplierName: values?.supplier?.label || "",
      intInsuranceId: values?.insuranceType?.value || 0,
      strInsuranceName: values?.insuranceType?.label || "",

      isTransfer: values?.isTransfer || false,
      intProfitCenterId: values?.profitCenter?.value || 0,
      intCostCenterId: values?.costCenter?.value || 0,
      intCostElementId: values?.costElement?.value || 0,
      intTransferBusinessId: values?.transferBusinessUnit?.value || 0,
      intTransferProfitCenterId: values?.transferProfitCenter?.value || 0,
      intTransferRevenueCenterId: values?.transferRevenueCenter?.value || 0,
      intTransferRevenueElementId: values?.transferRevenueElement?.value || 0,
    };

    if (id) {
      bareboatManagementAndInsuranceCreate(
        `/fino/BareBoatManagement/EditBareBoatConfig`,
        payload,
        cb,
        true
      );
    } else {
      bareboatManagementAndInsuranceCreate(
        `/fino/BareBoatManagement/CreateBareBoatConfig`,
        payload,
        cb,
        true
      );
    }
  };

  function formatDateRange(dateRange) {
    const [startDateStr, endDateStr] = dateRange.split(" - ");
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    const formattedStartDate = startDate.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
    const formattedEndDate = endDate.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });

    return `${formattedStartDate} - ${formattedEndDate}`;
  }

  return (
    <Formik
      enableReinitialize={true}
      initialValues={id ? modifyData : initData}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          if (!id) resetForm(initData);
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {(singleLoading ||
            supplierLoading ||
            baseTypeLoading ||
            vesselAssetLoading ||
            profitCenterDDLloader ||
            costCenterDDLloader ||
            costElementDDLloader ||
            transferBusinessUnitDDLloader ||
            transferProfitCenterDDLloader ||
            transferRevenueCenterDDLloader ||
            transferRevenueElementDDLloader ||
            loaderOnCreate ||
            // rateForDryDocLoading ||
            dateRangeDDLloader) && <Loading />}
          <IForm
            title={
              id
                ? "Edit Bareboat Management, Insurance And Dry Dock"
                : "Create Bareboat Management, Insurance And Dry Dock"
            }
            getProps={setObjprops}
          >
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="categoryType"
                    options={[
                      {
                        value: 1,
                        label: "Bareboat Management",
                      },
                      { value: 2, label: "Insurance" },
                      { value: 3, label: "Dry Doc" },
                    ]}
                    label="Category Type"
                    value={values?.categoryType}
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("categoryType", valueOption);
                        setFieldValue(
                          "isTransfer",
                          valueOption?.value === 1 ? true : false
                        );
                        setFieldValue("particularsType", "");
                        setFieldValue("supplier", "");
                        setFieldValue("insuranceType", "");
                        setFieldValue("fromDate", "");
                        setFieldValue("toDate", "");
                        setFieldValue("transferBusinessUnit", "");
                        setFieldValue("transferProfitCenter", "");
                        setFieldValue("transferRevenueCenter", "");
                        setFieldValue("transferRevenueElement", "");
                        setFieldValue("baseType", "");
                      } else {
                        setFieldValue("categoryType", "");
                        setFieldValue("isTransfer", false);
                        setFieldValue("particularsType", "");
                        setFieldValue("supplier", "");
                        setFieldValue("insuranceType", "");
                        setFieldValue("fromDate", "");
                        setFieldValue("toDate", "");
                        setFieldValue("transferBusinessUnit", "");
                        setFieldValue("transferProfitCenter", "");
                        setFieldValue("transferRevenueCenter", "");
                        setFieldValue("transferRevenueElement", "");
                        setFieldValue("baseType", "");
                      }
                    }}
                    isDisabled={id}
                    placeholder="Category Type"
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-3">
                  <NewSelect
                    name="vessel"
                    options={vesselAssetDDL}
                    label="Vessel"
                    value={values?.vessel}
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("vessel", valueOption);
                        setFieldValue("dateRange", "");
                        getDateRangeDDL(
                          `/fino/Expense/GetDocScheduleListByVesselId?businessUnitId=${selectedBusinessUnit?.value}&vesselId=${valueOption?.value}`,
                          (data) => {
                            const modifiedData = data?.map((item) => {
                              return {
                                ...item,
                                value: 4,
                                label: formatDateRange(item?.strScheduleRange),
                              };
                            });
                            setDateRangeDDL(modifiedData);
                          }
                        );
                      } else {
                        setFieldValue("vessel", "");
                        setFieldValue("rate", "");
                      }
                    }}
                    placeholder="Vessel"
                    errors={errors}
                    isDisabled={id}
                    touched={touched}
                  />
                </div>
                {values?.categoryType?.value === 3 ? (
                  <div className="col-lg-3">
                    <NewSelect
                      name="dateRange"
                      options={dateRangeDDL || []}
                      label="Date Range"
                      value={values?.dateRange}
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue("dateRange", valueOption);
                          setFieldValue("rate", valueOption?.budgetAmount);
                          setFieldValue("fromDate", valueOption?.dteFromDate);
                          setFieldValue("toDate", valueOption?.dteToDate);
                        } else {
                          setFieldValue("dateRange", "");
                          setFieldValue("rate", "");
                          setFieldValue("fromDate", "");
                          setFieldValue("toDate", "");
                        }
                      }}
                      isDisabled={false}
                      placeholder="Date Range"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                ) : null}

                <div className="col-lg-3">
                  <NewSelect
                    name="baseType"
                    options={
                      values?.categoryType?.value === 3
                        ? [{ value: 1, label: "Schedule Range" }]
                        : baseTypeDDL || []
                    }
                    label="Base Type"
                    value={values?.baseType}
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("baseType", valueOption);
                      } else {
                        setFieldValue("baseType", "");
                      }
                    }}
                    isDisabled={false}
                    placeholder="Base Type"
                    errors={errors}
                    touched={touched}
                  />
                </div>

                {values?.categoryType?.value === 2 ? (
                  <>
                    <div className="col-lg-3">
                      <NewSelect
                        name="supplier"
                        options={supplierDDL || []}
                        label="Supplier"
                        value={values?.supplier}
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue("supplier", valueOption);
                          } else {
                            setFieldValue("supplier", "");
                          }
                        }}
                        isDisabled={false}
                        placeholder="Supplier"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="insuranceType"
                        options={[
                          {
                            value: 1,
                            label: "H&M Insurance Policy",
                          },
                          { value: 2, label: "P&I Coverage" },
                        ]}
                        label="Insurance Type"
                        value={values?.insuranceType}
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue("insuranceType", valueOption);
                          } else {
                            setFieldValue("insuranceType", "");
                          }
                        }}
                        isDisabled={false}
                        placeholder="Insurance Type"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.fromDate}
                        label="From Date"
                        name="fromDate"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("fromDate", e.target.value);
                          setFieldValue("vessel", "");
                          setFieldValue("toDate", "");
                          setFieldValue("rate", "");
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.toDate}
                        min={values?.fromDate}
                        label="To Date"
                        name="toDate"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("toDate", e.target.value);
                          setFieldValue("vessel", "");
                          setFieldValue("rate", "");
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-lg-3">
                      <NewSelect
                        name="particularsType"
                        options={
                          values?.categoryType?.value === 3
                            ? [{ value: 3, label: "DRY DOC" }]
                            : [
                                { value: 1, label: "BARE BOAT" },
                                { value: 2, label: "MANAGEMENT" },
                              ]
                        }
                        label="Particulars Type"
                        value={values?.particularsType}
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue("particularsType", valueOption);
                          } else {
                            setFieldValue("particularsType", "");
                          }
                        }}
                        isDisabled={false}
                        placeholder="Particulars Type"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </>
                )}

                <div className="col-lg-3">
                  <InputField
                    value={values?.rate}
                    label="Rate"
                    name="rate"
                    type="number"
                    onChange={(e) => {
                      if (e.target.value > 0) {
                        setFieldValue("rate", e.target.value);
                      } else {
                        setFieldValue("rate", "");
                      }
                    }}
                    disabled={values?.categoryType?.value === 3}
                  />
                </div>

                <div className="col-lg-3">
                  <NewSelect
                    name="Profit Center"
                    options={profitCenterDDL || []}
                    value={values?.profitCenter}
                    label="Profit Center"
                    onChange={(valueOption) => {
                      setFieldValue("profitCenter", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="Cost Center"
                    options={costCenterDDL || []}
                    value={values?.costCenter}
                    label="Cost Center"
                    onChange={(valueOption) => {
                      setFieldValue("costCenter", valueOption);
                      getCostElementDDL(
                        `/procurement/PurchaseOrder/GetCostElementByCostCenter?AccountId=${profileData?.accountId}&UnitId=${selectedBusinessUnit?.value}&CostCenterId=${valueOption?.value}`
                      );
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="costElement"
                    options={costElementDDL || []}
                    value={values?.costElement}
                    label="Cost Element"
                    onChange={(valueOption) => {
                      setFieldValue("costElement", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={!values?.costCenter}
                  />
                </div>

                {values?.categoryType?.value === 1 ? (
                  <div className="col-lg-3">
                    <div
                      style={{ marginTop: "23px" }}
                      className="d-flex align-items-center"
                    >
                      <span className="mr-2">Is Transfer</span>
                      <Field
                        type="checkbox"
                        name="isTransfer"
                        checked={values?.isTransfer}
                        onChange={(e) => {
                          setFieldValue("isTransfer", e.target.checked);
                        }}
                      />
                    </div>
                  </div>
                ) : null}
                {values?.isTransfer ? (
                  <>
                    <div className="col-lg-3">
                      <NewSelect
                        name="transferBusinessUnit"
                        options={transferBusinessUnitDDL || []}
                        value={values?.transferBusinessUnit}
                        label="Transfer Business Unit"
                        onChange={(valueOption) => {
                          setFieldValue("transferBusinessUnit", valueOption);
                          getTransferProfitCenterDDL(
                            `/fino/CostSheet/ProfitCenterDetails?UnitId=${valueOption?.value}`,
                            (res) => {
                              const newData = res?.map((itm) => {
                                itm.value = itm?.profitCenterId;
                                itm.label = itm?.profitCenterName;
                                return itm;
                              });
                              setTransferProfitCenterDDL(newData);
                            }
                          );
                          getTransferRevenueCenterDDL(
                            `/fino/AccountingConfig/GetRevenueCenterList?businessUnitId=${valueOption?.value}`
                          );
                          getTransferRevenueElementDDL(
                            `/fino/AccountingConfig/GetRevenueElementList?businessUnitId=${valueOption?.value}`
                          );
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="transferProfitCenter"
                        options={transferProfitCenterDDL || []}
                        value={values?.transferProfitCenter}
                        label="Transfer Profit Center"
                        onChange={(valueOption) => {
                          setFieldValue("transferProfitCenter", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="transferRevenueCenter"
                        options={transferRevenueCenterDDL || []}
                        value={values?.transferRevenueCenter}
                        label="Transfer Revenue Center"
                        onChange={(valueOption) => {
                          setFieldValue("transferRevenueCenter", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="transferRevenueElement"
                        options={transferRevenueElementDDL || []}
                        value={values?.transferRevenueElement}
                        label="Transfer Revenue Element"
                        onChange={(valueOption) => {
                          setFieldValue("transferRevenueElement", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    {/* <div className="col-lg-3">
                                 <label>Narration</label>
                                 <InputField
                                    value={values?.narration}
                                    name="narration"
                                    placeholder="narration"
                                    type="text"
                                    onChange={e => {
                                       setFieldValue(
                                          'narration',
                                          e?.target?.value
                                       );
                                    }}
                                 />
                              </div> */}
                  </>
                ) : null}
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={objProps?.resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
