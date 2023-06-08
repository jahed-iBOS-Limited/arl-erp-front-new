/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import GridData from "./grid";
import { shallowEqual } from "react-redux";
import {
  getEmpStatusDDL,
  employeeBasicInformation_landing_api_Fof_Filtering,
  getempInfoGridforOwnView,
  getWorkplaceGroupDDLAction,
} from "../helper";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../../../_metronic/_partials/controls";
import PaginationTable from "../../../../_helper/_tablePagination";
import NewSelect from "../../../../_helper/_select";
import findIndex from "../../../../_helper/_findIndex";
import { useHistory } from "react-router-dom";
import InputField from "../../../../_helper/_inputField";

// Validation schema
const validationSchema = Yup.object().shape({});

const initData = {
  id: undefined,
};

export default function BasicInformationlLanding() {
  const history = useHistory();

  const createHandler = () => {
    history.push("/human-capital-management/humanresource/employee-info/add");
  };

  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  const [employeeStatusDDL, setEmployeeStatusDDL] = useState([]);

  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState([]);

  const { profileData, selectedBusinessUnit, userRole } = useSelector(
    (state) => {
      return state?.authData;
    },
    shallowEqual
  );

  const basicInfo = userRole[findIndex(userRole, "Basic Information")];

  useEffect(() => {
    if (basicInfo?.isView) {
      employeeBasicInformation_landing_api_Fof_Filtering(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setRowDto,
        setLoading,
        0,
        0,
        "",
        pageNo,
        pageSize
      );
    } else {
      getempInfoGridforOwnView(setRowDto, setLoading, profileData?.employeeId);
    }
    getWorkplaceGroupDDLAction(profileData?.accountId, setWorkplaceGroupDDL);
    getEmpStatusDDL(setEmployeeStatusDDL);
  }, [selectedBusinessUnit, profileData]);

  const setPositionHandler = (pageNo, pageSize, values) => {
    console.log("values", values)
    employeeBasicInformation_landing_api_Fof_Filtering(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setRowDto,
      setLoading,
      values?.employeeStatus?.value || 0,
      values?.workplaceGroup?.value || 0,
      values?.search || "",
      pageNo,
      pageSize
    );
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
              <CardHeader title={"Basic Information"}>
                <CardHeaderToolbar>
                  <button onClick={createHandler} className="btn btn-primary">
                    Create
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  {basicInfo?.isView && (
                    <>
                      <div className="row global-form global-form-custom bj-left pb-2">
                        <div className="col-md">
                          <label>Employee name or code</label>
                          <InputField
                            value={values?.search}
                            name="search"
                            placeholder="Employee name or code"
                            type="text"
                          />
                        </div>

                        <div className="col-lg">
                          <NewSelect
                            name="employeeStatus"
                            options={employeeStatusDDL || []}
                            value={values?.employeeStatus}
                            label="Employee Status"
                            onChange={(valueOption) => {
                              setFieldValue("employeeStatus", valueOption);
                            }}
                            placeholder="Employee Status"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg">
                          <NewSelect
                            name="workplaceGroup"
                            options={workplaceGroupDDL}
                            value={values?.workplaceGroup}
                            label="Workplace Group"
                            onChange={(valueOption) => {
                              setFieldValue("workplaceGroup", valueOption);
                            }}
                            placeholder="Workplace Group"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg">
                          <button
                            style={{
                              fontSize: "14px",
                              padding: "4px 16px",
                              marginTop: "16px",
                            }}
                            className="btn btn-primary"
                            onClick={(e) => {
                              employeeBasicInformation_landing_api_Fof_Filtering(
                                profileData?.accountId,
                                selectedBusinessUnit?.value,
                                setRowDto,
                                setLoading,
                                values?.employeeStatus?.value || 0,
                                values?.workplaceGroup?.value || 0,
                                values?.search || "",
                                pageNo,
                                pageSize
                              );
                            }}
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  <GridData
                    rowDto={rowDto}
                    loading={loading}
                    pageSize={pageSize}
                    pageNo={pageNo}
                    setPositionHandler={setPositionHandler}
                  />
                </Form>
                <div>
                  {rowDto?.data?.length > 0 && basicInfo?.isView && (
                    <PaginationTable
                      count={rowDto?.totalCount}
                      setPositionHandler={setPositionHandler}
                      values={values}
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
