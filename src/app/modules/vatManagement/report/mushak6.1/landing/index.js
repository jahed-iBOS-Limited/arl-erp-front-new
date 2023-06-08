import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import {
  Card,
  CardHeaderToolbar,
  CardBody,
} from "../../../../../../_metronic/_partials/controls/Card";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls/ModalProgressBar";
import { CardHeader } from "@material-ui/core";
import InputField from "../../../../_helper/_inputField";
import ReportBody from "./reportBody";
import { getGridData, getHeaderData } from "../helper";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { _todayDate } from "../../../../_helper/_todayDate";
import "./style.css";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

function MushakSixPointOneLanding() {
  const [gridData, setGridData] = useState([]);
  const [headerData, setHeaderData] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getHeaderData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setHeaderData
      );
    }
  }, [profileData, selectedBusinessUnit]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData }}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Mushak 6.1"}>
                <CardHeaderToolbar>
                  {/* <button
                    onClick={() => {
                      history.push(
                        '/human-capital-management/humanresource/employee-info/add'
                      )
                    }}
                    className="btn btn-primary"
                  >
                    Create
                  </button> */}
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <label>From Date</label>
                      <InputField
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From Date"
                        type="date"
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>To Date</label>
                      <InputField
                        value={values?.toDate}
                        name="toDate"
                        placeholder="To Date"
                        type="date"
                      />
                    </div>
                    <div className="col-lg-3 mt-5">
                      <button
                        className="btn btn-primary"
                        type="button"
                        disabled={!values?.fromDate || !values?.toDate}
                        onClick={() => {
                          getGridData(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.fromDate,
                            values?.toDate,
                            setGridData
                          );
                        }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </Form>

                {/* Report Body Start */}
                <ReportBody headerData={headerData} gridData={gridData} />
                {/* Report Body End */}
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}

export default MushakSixPointOneLanding;
