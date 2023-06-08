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
import NewSelect from "../../../../_helper/_select";
import { getVatBranches_api, getGridData, getGridDataTwo } from "../helper";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { _todayDate } from "../../../../_helper/_todayDate";

const initData = {
  branch: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

function MushakSevenPointOneLanding() {
  const [branchDDL, setBranchDDL] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [gridDataTwo, setGridDataTwo] = useState([]);

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
      getVatBranches_api(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setBranchDDL
      );
    }
  }, [selectedBusinessUnit, profileData]);

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
              <CardHeader title={"Chok (Ka/Kha)"}>
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
                        disabled={
                          !values?.branch ||
                          !values?.fromDate ||
                          !values?.toDate
                        }
                        onClick={() => {
                          getGridData(values, setGridData, () => {
                            getGridDataTwo(values, setGridDataTwo);
                          });
                        }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </Form>

                {/* Report Body Start */}
                {(gridData?.length > 0 || gridDataTwo?.length > 0) && (
                  <ReportBody gridData={gridData} gridDataTwo={gridDataTwo} />
                )}
                {/* Report Body End */}
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}

export default MushakSevenPointOneLanding;
