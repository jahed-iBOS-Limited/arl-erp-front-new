import { Formik } from "formik";
import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import ICustomCard from "../../../_helper/_customCard";
import IApproval from "../../../_helper/_helperIcons/_approval";
import IClose from "../../../_helper/_helperIcons/_close";
import IEdit from "../../../_helper/_helperIcons/_edit";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import FromDateToDateForm from "../../../_helper/commonInputFieldsGroups/dateForm";
import RATForm from "../../../_helper/commonInputFieldsGroups/ratForm";
import IButton from "../../../_helper/iButton";
import { getMonth } from "../customerSalesTarget/utils";
import { _dateFormatter } from "./../../../_helper/_dateFormate";
import { _fixedPoint } from "./../../../_helper/_fixedPoint";
import PaginationTable from "./../../../_helper/_tablePagination";
import { _todayDate } from "./../../../_helper/_todayDate";
import { editSalesTarget, getCustomersSalesTarget_Api } from "./helper";

const initData = {
  reportType: { value: 1, label: "Details" },
  channel: "",
  region: "",
  area: "",
  territory: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

const CustomerSalesTargetReport = () => {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state.authData,
    shallowEqual
  );

  const commonGridFunc = (values, _pageNo = pageNo, _pageSize = pageSize) => {
    getCustomersSalesTarget_Api(
      setLoading,
      setRowDto,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.fromDate,
      values?.toDate,
      values?.channel?.value,
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
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, errors, touched, setFieldValue }) => (
          <>
            {loading && <Loading />}
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
                    <RATForm
                      obj={{
                        values,
                        setFieldValue,
                        onChange: () => {
                          setRowDto([]);
                        },
                      }}
                    />
                    <FromDateToDateForm
                      obj={{
                        values,
                        setFieldValue,
                        onChange: () => {
                          setRowDto([]);
                        },
                      }}
                    />
                    <IButton
                      disabled={!values?.reportType || !values?.territory}
                      onClick={() => {
                        commonGridFunc(values);
                      }}
                    />
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
