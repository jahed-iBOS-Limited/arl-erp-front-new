/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import GridData from "./grid";
import { shallowEqual } from "react-redux";
import {
  employeeBasicInformation_landing_top_api,
} from "../helper";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../../../_metronic/_partials/controls";
import PaginationTable from "../../../../_helper/_tablePagination";
import PaginationSearch from './../../../../_helper/_search';

// Validation schema
const validationSchema = Yup.object().shape({});

const initData = {
  id: undefined,
};

export default function HeaderForm({ createHandler }) {
  const [gridData, setGridData] = useState();
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

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      employeeBasicInformation_landing_top_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setGridData,
        setLoading,
        pageNo,
        pageSize,
        null
      );
    }
  }, [selectedBusinessUnit, profileData]);

  const setPositionHandler = (pageNo, pageSize) => {
    employeeBasicInformation_landing_top_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setGridData,
      setLoading,
      pageNo,
      pageSize,
      null
    );
  };

  const paginationSearchHandler = (searchValue) => {
    employeeBasicInformation_landing_top_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setGridData,
      setLoading,
      pageNo,
      pageSize,
      searchValue
    );
  }

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
              <CardHeader title={"Sales Force Information"}>
                <CardHeaderToolbar>
                  <button onClick={createHandler} className="btn btn-primary">
                    Create
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="row p-0 m-0">
                    <PaginationSearch
                      placeholder="Profile Name Search"
                      paginationSearchHandler={paginationSearchHandler}
                    />
                  </div>
                  <GridData gridData={gridData} loading={loading} />
                </Form>
              </CardBody>
              {gridData?.data?.length > 0 && (
                <PaginationTable
                  count={gridData?.totalCount}
                  setPositionHandler={setPositionHandler}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                />
              )}
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
