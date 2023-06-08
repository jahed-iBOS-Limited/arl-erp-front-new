/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
// import InputField from "./../../../../_helper/_inputField";
import { useSelector } from "react-redux";
import GridData from "./grid";
import { shallowEqual } from "react-redux";
import {
  // employeeBasicInformation_landing_api,
  // employeeBasicInformation_landing_top_api,
  employeeBasicInformation_landing_api_new,
} from "../helper";
import {
  ModalProgressBar,
  Card,
  CardBody,
} from "./../../../../../../_metronic/_partials/controls";
import PaginationTable from "../../../../_helper/_tablePagination";
import InputField from "../../../../_helper/_inputField";
import PaginationSearch from "../../../../_helper/_search";
import { CardHeader } from "@material-ui/core";
import { downloadFile } from "../../../../_helper/downloadFile";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import NewSelect from "../../../../_helper/_select";

// Validation schema
const validationSchema = Yup.object().shape({});

const initData = {
  id: undefined,
  fromDate: "",
  toDate: "",
  businessUnit: { value: 0, label: "All" },
};

export default function HeaderForm({ createHandler }) {
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [ddl, getBuDDL] = useAxiosGet();
  const [businessUnitDDL, setBusinessUnitDDL] = useState([]);
  const [buId, setBuId] = useState(0);
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  useEffect(() => {
    getBuDDL(
      `/hcm/HCMReport/GetOnboardedBusinessUnitList?accountId=${profileData?.accountId}`,
      (data) => {
        setBusinessUnitDDL([{ value: 0, label: "All" }, ...data]);
      }
    );
  }, [profileData]);

  useEffect(() => {
    if (profileData?.accountId) {
      employeeBasicInformation_landing_api_new(
        profileData?.accountId,
        0,
        setRowDto,
        setLoading,
        pageNo,
        pageSize
      );
    }
  }, [profileData]);

  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    employeeBasicInformation_landing_api_new(
      profileData?.accountId,
      buId,
      setRowDto,
      setLoading,
      pageNo,
      pageSize,
      searchValue
    );
  };

  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(pageNo, pageSize, searchValue);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title="Employee Re-registration"></CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="row">
                    <div className="col-lg-3">
                      <label>Business Unit</label>
                      <NewSelect
                        name="businessUnit"
                        options={businessUnitDDL}
                        value={values?.businessUnit}
                        onChange={(valueOption) => {
                          setFieldValue("businessUnit", valueOption);
                          setRowDto([]);
                          setBuId(valueOption?.value);
                        }}
                        errors={errors}
                        isDisabled={false}
                        touched={touched}
                      />
                    </div>

                    <div className="col-lg-4">
                      <label>Employee</label>
                      <PaginationSearch
                        placeholder="Employee Name & Code Search"
                        paginationSearchHandler={paginationSearchHandler}
                      />
                    </div>

                    <div style={{marginLeft:"-33px"}} className="col-lg-2">
                      <label>From Date</label>
                      <InputField
                        value={values?.fromDate}
                        name="fromDate"
                        type="date"
                      />
                    </div>

                    <div className="col-lg-2">
                      <label>To Date</label>
                      <InputField
                        value={values?.toDate}
                        name="toDate"
                        type="date"
                      />
                    </div>

                    <div style={{ marginTop: "18px" }} className="col-lg-3">
                      <button
                        className="btn btn-primary"
                        type="button"
                        disabled={false}
                        onClick={() => {
                          employeeBasicInformation_landing_api_new(
                            profileData?.accountId,
                            values?.businessUnit?.value,
                            setRowDto,
                            setLoading,
                            pageNo,
                            pageSize,
                            "",
                            values?.fromDate,
                            values?.toDate,
                            false,
                            () => {
                              setFieldValue("fromDate", "");
                              setFieldValue("toDate", "");
                            }
                          );
                        }}
                      >
                        Show
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary ml-3"
                        disabled={false}
                        onClick={() => {
                          const strFromDate = values?.fromDate
                            ? `&fromDate=${values?.fromDate}`
                            : "";
                          const strToDate = values?.toDate
                            ? `&toDate=${values?.toDate}`
                            : "";
                          downloadFile(
                            `/hcm/EmployeeBasicInformation/EmployeeBasicInfoLandingPasignationForReRegistration?searcTerm=${""}&Accountid=${
                              profileData?.accountId
                            }&BusinessUnitId=${
                              values?.businessUnit?.value
                            }${strFromDate}${strToDate}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}1&isDownload=true`,
                            "Separated Employee List",
                            "xlsx",
                            setLoading
                          );
                        }}
                      >
                        Export Excel
                      </button>
                    </div>
                  </div>
                  <GridData
                    rowDto={rowDto}
                    loading={loading}
                    pageSize={pageSize}
                    pageNo={pageNo}
                    setPositionHandler={setPositionHandler}
                  />
                </Form>
                <div>
                  {rowDto?.data?.length > 0 && (
                    <PaginationTable
                      count={rowDto?.totalCount}
                      setPositionHandler={setPositionHandler}
                      paginationState={{
                        pageNo,
                        setPageNo,
                        pageSize,
                        setPageSize,
                      }}
                    />
                  )}
                </div>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
