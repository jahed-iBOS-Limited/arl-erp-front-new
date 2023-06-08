import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { useSelector } from "react-redux";
import GridData from "./grid";
import { shallowEqual } from "react-redux";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../../../_metronic/_partials/controls";

import { useHistory } from "react-router";
import PaginationTable from "../../../../_helper/_tablePagination";
import NewSelect from "../../../../_helper/_select";
import {
  getContractManufacturePagination_api,
  getVatBranches_api,
} from "../helper";
import InputField from "../../../../_helper/_inputField";
import { _todayDate } from "../../../../_helper/_todayDate";

// Validation schema
const validationSchema = Yup.object().shape({});

const initData = {
  id: undefined,
  branch: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
  type: { value: 1, label: "Raw" },
};

export default function HeaderForm({ createHandler }) {
  const [rowDto, setRowDto] = useState([]);
  const [branchDDL, setBranchDDL] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const history = useHistory();
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getVatBranches_api(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setBranchDDL
      );
    }
  }, [selectedBusinessUnit, profileData]);

  const gridDataFunc = (
    branchId,
    fromDate,
    toDate,
    pageNo,
    pageSize,
    typeId,
    setter
  ) => {
    getContractManufacturePagination_api(
      profileData.accountId,
      selectedBusinessUnit?.value,
      branchId,
      fromDate,
      toDate,
      pageNo,
      pageSize,
      typeId,
      setter,
      setLoading
    );
  };

  useEffect(() => {
    if (
      (selectedBusinessUnit?.value && profileData?.accountId &&
      branchDDL[0]?.value)
    ) {
      gridDataFunc(
        branchDDL[0]?.value,
        _todayDate(),
        _todayDate(),
        pageNo,
        pageSize,
        1,
        setRowDto
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData, branchDDL]);

  const setPositionHandler = (pageNo, pageSize, values) => {
    gridDataFunc(
      values?.branch?.value,
      values.fromDate,
      values?.toDate,
      pageNo,
      pageSize,
      values?.type?.value,
      setRowDto
    );
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData, branch: branchDDL[0] }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Contact Manufacturing"}>
                <CardHeaderToolbar>
                  <button
                    disabled={
                      !values?.branch ||
                      !values?.fromDate ||
                      !values?.toDate ||
                      !values?.type
                    }
                    onClick={() => {
                      history.push({
                        pathname: `/mngVat/inventory/conmanufacturer/add`,
                        state: values,
                      });
                    }}
                    className="btn btn-primary"
                  >
                    Create
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <NewSelect
                        name="branch"
                        options={branchDDL || []}
                        value={values?.branch}
                        label="Branch"
                        onChange={(valueOption) => {
                          setFieldValue("branch", valueOption);
                        }}
                        placeholder="Branch"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2">
                      <label>From Date</label>
                      <InputField
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From Date"
                        type="date"
                      />
                    </div>
                    <div className="col-lg-2">
                      <label>Top Date</label>
                      <InputField
                        value={values?.toDate}
                        name="toDate"
                        placeholder="Top Date"
                        type="date"
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="type"
                        options={[
                          { value: 1, label: "Raw" },
                          { value: 2, label: "FG" },
                        ]}
                        value={values?.type}
                        label="Type"
                        onChange={(valueOption) => {
                          setFieldValue("type", valueOption);
                        }}
                        placeholder="Type"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2 mt-5">
                      <button
                        className="btn btn-primary"
                        type="button"
                        disabled={
                          !values?.branch ||
                          !values?.fromDate ||
                          !values?.toDate ||
                          !values?.type
                        }
                        onClick={() => {
                          gridDataFunc(
                            values?.branch?.value,
                            values?.fromDate,
                            values?.toDate,
                            pageNo,
                            pageSize,
                            values?.type?.value,
                            setRowDto
                          );
                        }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                  <GridData
                    rowDto={rowDto}
                    loading={loading}
                    pageSize={pageSize}
                    pageNo={pageNo}
                    setPositionHandler={setPositionHandler}
                    values={values}
                    gridDataFunc={gridDataFunc}
                    setRowDto={setRowDto}
                  />
                </Form>
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
                    values={values}
                  />
                )}
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
