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
import { useHistory } from "react-router-dom";
import { GetItemProfileConfigPagination_api } from "./../helper";

// Validation schema
const validationSchema = Yup.object().shape({});

const initData = {
  id: undefined,
};

export default function HeaderForm({ createHandler }) {
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const history = useHistory();
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const gridDataFunc = (pageNo, pageSize, searchValue) => {
    GetItemProfileConfigPagination_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      pageNo,
      pageSize,
      searchValue,
      setRowDto,
      setLoading
    );
  };

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      gridDataFunc(pageNo, pageSize)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const setPositionHandler = (pageNo, pageSize) => {
    gridDataFunc(pageNo, pageSize)
  };

  const paginationSearchHandler = (searchValue) => {
    gridDataFunc(pageNo, pageSize, searchValue)
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
              <CardHeader title={"Item Profile Setup"}>
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      history.push(
                        "/config/material-management/itemProfileSetup/add"
                      );
                    }}
                    className="btn btn-primary"
                  >
                    Create
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <GridData
                    rowDto={rowDto}
                    loading={loading}
                    pageSize={pageSize}
                    pageNo={pageNo}
                    setPageSize={setPageSize}
                    setPageNo={setPageNo}
                    setPositionHandler={setPositionHandler}
                    paginationSearchHandler={paginationSearchHandler}
                  />
                </Form>
              </CardBody>
           
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
