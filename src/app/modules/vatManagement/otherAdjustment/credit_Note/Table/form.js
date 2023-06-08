import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import NewSelect from "./../../../../_helper/_select";
import GridData from "./grid";
import { useHistory } from "react-router-dom";

import {
  creditNoteLandingPasignation_api,
  getTaxBranchDDL_api,
} from "../helper";
import InputField from "./../../../../_helper/_inputField";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { _todayDate } from "./../../../../_helper/_todayDate";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";

const initData = {
  id: undefined,
  branch: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

export default function HeaderForm({ createHandler }) {
  const history = useHistory();
  const [taxBranchDDL, setTaxBranchDDL] = useState([]);
  const [gridData, setGridData] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [values, setValues] = useState({});
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  //FETCHING ALL DATA FROM helper.js

  useEffect(() => {
    if (
      profileData.accountId &&
      selectedBusinessUnit?.value &&
      profileData?.userId
    ) {
      getTaxBranchDDL_api(
        profileData?.userId,
        profileData.accountId,
        selectedBusinessUnit?.value,
        setTaxBranchDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (
      selectedBusinessUnit?.value &&
      profileData?.accountId &&
      taxBranchDDL.length > 0
    ) {
      creditNoteLandingPasignation_api(
        taxBranchDDL[0]?.value,
        _todayDate(),
        _todayDate(),
        setGridData,
        pageNo,
        pageSize
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData, taxBranchDDL]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData, branch: taxBranchDDL[0] }}
        //validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Credit Note"}>
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      history.push({
                        pathname: `/mngVat/otherAdjustment/credit-note/add`,
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
                        options={taxBranchDDL || []}
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
                    <div className="col-lg-3">
                      <label>Transaction Date</label>
                      <InputField
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From Date"
                        type="date"
                      />
                    </div>
                    {/* <div className="col-lg-3">
                      <label>To Date</label>
                      <InputField
                        value={values?.toDate}
                        name="toDate"
                        placeholder="To Date"
                        type="date"
                      />
                    </div> */}
                    <div className="col-lg-3 mt-4 d-flex align-items-end">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          setValues(values);
                          creditNoteLandingPasignation_api(
                            values?.branch?.value,
                            values?.fromDate,
                            values?.toDate,
                            setGridData,
                            pageNo,
                            pageSize
                          );
                        }}
                        disabled={!values.branch}
                      >
                        View
                      </button>
                    </div>
                  </div>
                  <GridData
                    gridData={gridData}
                    pageNo={pageNo}
                    pageSize={pageSize}
                    setPageNo={setPageNo}
                    setPageSize={setPageSize}
                    values={values}
                    setGridData={setGridData}
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
