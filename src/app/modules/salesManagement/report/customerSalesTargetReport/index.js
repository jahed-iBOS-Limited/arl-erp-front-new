import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import ICustomCard from "../../../_helper/_customCard";
import NewSelect from "../../../_helper/_select";
import Loading from "../../../_helper/_loading";
import { _dateFormatter } from "./../../../_helper/_dateFormate";
import { _todayDate } from "./../../../_helper/_todayDate";
import FormikInput from "./../../../chartering/_chartinghelper/common/formikInput";
import {
  getRegionAreaTerritory,
  getDistributionChannelDDL_api,
  getCustomersSalesTarget_Api,
  editSalesTarget,
} from "./helper";
import { getMonth } from "../customerSalesTarget/utils";
import PaginationTable from "./../../../_helper/_tablePagination";
import { _fixedPoint } from "./../../../_helper/_fixedPoint";
import InputField from "../../../_helper/_inputField";
import IEdit from "../../../_helper/_helperIcons/_edit";
import IApproval from "../../../_helper/_helperIcons/_approval";
import IClose from "../../../_helper/_helperIcons/_close";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";

const CustomerSalesTargetReport = () => {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [areaDDL, setAreaDDL] = useState([]);
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);
  const [territoryDDl, getTerritory, load, setTerritory] = useAxiosGet();
  const [regionDDL, setRegionDDL] = useState([]);
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getDistributionChannelDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setDistributionChannelDDL
      );
    }
  }, [selectedBusinessUnit, profileData]);
  const commonGridFunc = (values, _pageNo = pageNo, _pageSize = pageSize) => {
    // setRowDto([]);
    getCustomersSalesTarget_Api(
      setLoading,
      setRowDto,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.fromDate,
      values?.toDate,
      values?.distributionChannel?.value,
      values?.area?.value,
      values?.region?.value,
      values?.territory?.value,
      values?.reportType?.value,
      _pageNo,
      _pageSize
    );
  };

  const rowDataHandler = (name, index, value) => {
    const newRowDto = [...rowDto?.objdata];
    newRowDto[index][name] = value;
    setRowDto({ ...rowDto, objdata: newRowDto });
  };

  return (
    <ICustomCard title="Customer Sales Target Report">
      {/* {loading && <Loading />} */}
      <Formik
        enableReinitialize={true}
        initialValues={{
          fromDate: _todayDate(),
          toDate: _todayDate(),
          distributionChannel: "",
          area: "",
          region: "",
          reportType: { value: 1, label: "Details" },
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
            {(loading || load) && <Loading />}
            <Form className="form form-label-right">
              <div className="row mt-2">
                <div className="col-lg-12">
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <NewSelect
                        name="reportType"
                        options={[
                          { value: 1, label: "Details" },
                          { value: 2, label: "Region" },
                          { value: 3, label: "Area" },
                        ]}
                        value={values?.reportType}
                        label="Report Type"
                        onChange={(valueOption) => {
                          setRowDto([]);
                          setFieldValue("reportType", valueOption);
                        }}
                        placeholder="Report Type"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="distributionChannel"
                        options={[
                          { value: 0, label: "All" },
                          ...distributionChannelDDL,
                        ]}
                        value={values?.distributionChannel}
                        label="Distribution Channel"
                        onChange={(valueOption) => {
                          setRowDto([]);
                          setFieldValue("distributionChannel", valueOption);
                          setFieldValue("region", "");
                          setFieldValue("area", "");
                          if (valueOption) {
                            getRegionAreaTerritory({
                              channelId: valueOption?.value,
                              setter: setRegionDDL,
                              setLoading: setLoading,
                              value: "regionId",
                              label: "regionName",
                            });
                          }
                          if (valueOption?.value === 0) {
                            setFieldValue("region", { value: 0, label: "All" });
                            setFieldValue("area", { value: 0, label: "All" });
                          }
                          getTerritory(
                            `/oms/TerritoryInfo/GetTerrotoryRegionAreaByChannel?channelId=${valueOption?.value}&regionId=${values?.region?.value}&areaId=${values?.area?.value}`,
                            (data) => {
                              const modifiedData = data?.map((item) => {
                                return {
                                  ...item,
                                  value: item?.territoryId,
                                  label: item?.territoryName,
                                };
                              });
                              setTerritory(modifiedData);
                            }
                          );
                        }}
                        placeholder="Distribution Channel"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="region"
                        options={[{ value: 0, label: "All" }, ...regionDDL]}
                        value={values?.region}
                        label="Region"
                        onChange={(valueOption) => {
                          setRowDto([]);
                          setFieldValue("region", valueOption);
                          setFieldValue("area", "");
                          if (valueOption) {
                            getRegionAreaTerritory({
                              channelId: values?.distributionChannel?.value,
                              regionId: valueOption?.value,
                              setter: setAreaDDL,
                              setLoading: setLoading,
                              value: "areaId",
                              label: "areaName",
                            });
                            getTerritory(
                              `/oms/TerritoryInfo/GetTerrotoryRegionAreaByChannel?channelId=${values?.distributionChannel?.value}&regionId=${valueOption?.value}&areaId=${values?.area?.value}`,
                              (data) => {
                                const modifiedData = data?.map((item) => {
                                  return {
                                    ...item,
                                    value: item?.territoryId,
                                    label: item?.territoryName,
                                  };
                                });
                                setTerritory(modifiedData);
                              }
                            );
                          }
                          if (valueOption?.value === 0) {
                            setFieldValue("area", { value: 0, label: "All" });
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
                        options={[{ value: 0, label: "All" }, ...areaDDL]}
                        value={values?.area}
                        label="Area"
                        onChange={(valueOption) => {
                          setRowDto([]);
                          setFieldValue("area", valueOption);
                          getTerritory(
                            `/oms/TerritoryInfo/GetTerrotoryRegionAreaByChannel?channelId=${values?.distributionChannel?.value}&regionId=${values?.region?.value}&areaId=${valueOption?.value}`,
                            (data) => {
                              const modifiedData = data?.map((item) => {
                                return {
                                  ...item,
                                  value: item?.territoryId,
                                  label: item?.territoryName,
                                };
                              });
                              setTerritory(modifiedData);
                            }
                          );
                        }}
                        placeholder="Area"
                        errors={errors}
                        touched={touched}
                        isDisabled={
                          !values?.region || values?.region?.value === 0
                        }
                      />
                    </div>
                    {/* {selectedBusinessUnit?.value === 4 &&
                      values?.distributionChannel?.value !== 46 && ( */}
                    <div className="col-lg-3">
                      <NewSelect
                        name="territory"
                        options={territoryDDl}
                        value={values?.territory}
                        label="Territory"
                        onChange={(valueOption) => {
                          setRowDto([]);
                          setFieldValue("territory", valueOption);
                        }}
                        placeholder="Territory"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    {/* // )} */}
                    <div className="col-lg-3">
                      <FormikInput
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From Date"
                        type="date"
                        onChange={(e) => {
                          setRowDto([]);
                          setFieldValue("fromDate", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                        label="From Date "
                      />
                    </div>
                    <div className="col-lg-3">
                      <FormikInput
                        value={values?.toDate}
                        name="toDate"
                        placeholder="To Date"
                        type="date"
                        min={values?.fromDate}
                        onChange={(e) => {
                          setRowDto([]);
                          setFieldValue("toDate", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                        label="To Date "
                      />
                    </div>
                    <div className="col-lg-3 d-flex align-items-center">
                      <button
                        type="button"
                        className="btn btn-primary mt-4 mr-4"
                        disabled={
                          !values?.region ||
                          !values?.area ||
                          !values?.distributionChannel
                        }
                        onClick={() => {
                          commonGridFunc(values);
                        }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table Start */}
              {rowDto?.objdata?.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        <th style={{ width: "30px" }}>SL</th>
                        {values?.reportType?.value === 1 && (
                          <>
                            <th>Partner Code</th>
                            <th>Partner Name</th>
                            <th>Distribution Channel</th>
                          </>
                        )}
                        <th>Region</th>
                        {[1, 3].includes(values?.reportType?.value) && (
                          <th>Area</th>
                        )}
                        {values?.reportType?.value === 1 && <th>Territory</th>}
                        <th>Target Year</th>
                        <th>Target Month</th>
                        {values?.reportType?.value === 1 &&
                          selectedBusinessUnit?.value !== 4 && (
                            <>
                              <th>Target Start Date</th>
                              <th>Target End Date</th>
                            </>
                          )}
                        <th style={{ width: "150px" }}>Target Quantity</th>
                        <th>Addition Qty</th>
                        <th>Deduction Qty</th>
                        <th>isApprove</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto?.objdata?.map((td, index) => (
                        <tr key={index}>
                          <td className="text-center">{td?.sl}</td>
                          {values?.reportType?.value === 1 && (
                            <>
                              <td>
                                <div className="pl-2">
                                  {td?.businessPartnerCode}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {td?.businessPartnerName}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {td?.distributionChannelName}
                                </div>
                              </td>
                            </>
                          )}
                          <td>
                            <div className="pl-2">{td?.nl5}</div>
                          </td>
                          {[1, 3].includes(values?.reportType?.value) && (
                            <td>
                              <div className="pl-2">{td?.nl6}</div>
                            </td>
                          )}
                          {values?.reportType?.value === 1 && (
                            <td>
                              <div className="pl-2">{td?.nl7}</div>
                            </td>
                          )}
                          <td>
                            <div className="pl-2">{td?.targetYear}</div>
                          </td>
                          <td>
                            <div className="pl-2">
                              {getMonth(td?.targetMonth)}
                            </div>
                          </td>
                          {values?.reportType?.value === 1 &&
                            selectedBusinessUnit?.value !== 4 && (
                              <>
                                <td>
                                  <div className="pl-2">
                                    {_dateFormatter(td?.targetStartDate)}
                                  </div>
                                </td>
                                <td>
                                  <div className="pl-2">
                                    {_dateFormatter(td?.targetEndDate)}
                                  </div>
                                </td>
                              </>
                            )}
                          <td className="text-right">
                            <div className="pl-2">
                              {td?.isEdit ? (
                                <InputField
                                  value={td?.editedTargetQuantity}
                                  name="editedTargetQuantity"
                                  placeholder="Date"
                                  type="number"
                                  onChange={(e) => {
                                    rowDataHandler(
                                      "editedTargetQuantity",
                                      index,
                                      e.target.value
                                    );
                                  }}
                                />
                              ) : (
                                _fixedPoint(td?.targetQuantity)
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="pl-2">{td?.additionQuantity}</div>
                          </td>
                          <td>
                            <div className="pl-2">{td?.deductionQuantity}</div>
                          </td>
                          <td>
                            <div className="pl-2">
                              {td?.isApprove ? "Yes" : "No"}
                            </div>
                          </td>
                          <td className="text-center">
                            {!td?.isEdit ? (
                              <span
                                className="cursor-pointer"
                                onClick={() => {
                                  rowDataHandler("isEdit", index, true);
                                }}
                              >
                                <IEdit />
                              </span>
                            ) : (
                              <span className="d-flex justify-content-between">
                                <span
                                  className="cursor-pointer"
                                  onClick={() => {
                                    rowDataHandler("isEdit", index, false);
                                  }}
                                >
                                  <IClose title="Cancel" />
                                </span>
                                <span
                                  onClick={() => {
                                    const additionQnt =
                                      td?.targetQuantity <
                                      td?.editedTargetQuantity
                                        ? td?.editedTargetQuantity -
                                          td?.targetQuantity
                                        : 0;

                                    const deductionQnt =
                                      td?.targetQuantity >
                                      td?.editedTargetQuantity
                                        ? td?.targetQuantity -
                                          td?.editedTargetQuantity
                                        : 0;

                                    editSalesTarget(
                                      {
                                        businessUnitId:
                                          selectedBusinessUnit?.value,
                                        targetId: td?.targetId,
                                        intTargetRowId: td?.intTargetRowId,
                                        targetQty: +td?.editedTargetQuantity,
                                        actionid: profileData?.employeeId,
                                        enroleid: profileData?.userId,
                                        additionQnt,
                                        deductionQnt,
                                      },
                                      setLoading,
                                      () => {
                                        commonGridFunc(
                                          values,
                                          pageNo,
                                          pageSize
                                        );
                                        rowDataHandler("isEdit", index, false);
                                      }
                                    );
                                  }}
                                >
                                  <IApproval title="Done" />
                                </span>
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                      <tr style={{ fontWeight: "bold" }}>
                        <td
                          className="text-right"
                          colSpan={
                            values?.reportType?.value === 1 &&
                            selectedBusinessUnit?.value !== 4
                              ? 11
                              : values?.reportType?.value === 1 &&
                                selectedBusinessUnit?.value === 4
                              ? 9
                              : values?.reportType?.value === 3
                              ? 5
                              : 4
                          }
                        >
                          Total
                        </td>
                        <td className="text-right">
                          {_fixedPoint(
                            rowDto?.objdata?.reduce(
                              (a, b) => a + b?.targetQuantity,
                              0
                            ),
                            true,
                            0
                          )}
                        </td>
                        <td></td>
                        <td></td>
                        <td colSpan={2}></td>
                      </tr>
                    </tbody>
                  </table>{" "}
                </div>
              )}
              {rowDto?.objdata?.length > 0 && (
                <PaginationTable
                  count={rowDto?.totalCount}
                  setPositionHandler={(pageNo, pageSize) => {
                    commonGridFunc(values, pageNo, pageSize);
                  }}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                />
              )}
            </Form>
          </>
        )}
      </Formik>
    </ICustomCard>
  );
};

export default CustomerSalesTargetReport;
