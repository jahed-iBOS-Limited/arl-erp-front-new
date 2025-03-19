import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import GridData from "./Table/grid";
import { shallowEqual } from "react-redux";
import { _todayDate } from "./../../../_helper/_todayDate";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../../_metronic/_partials/controls";
import NewSelect from "./../../../_helper/_select";
import InputField from "./../../../_helper/_inputField";
import "./inventoryRegister.css";
import { getFGInventoryRegisterReport, getTaxBranchDDL } from "./helper";

// Validation schema
const validationSchema = Yup.object().shape({});

const initData = {
  fromDate: _todayDate(),
  branch: "",
};

export default function InventoryRegisterLanding() {
  const [rowDto, setRowDto] = useState([]);
  const [taxBranchDDL, setTaxBranchDDL] = useState([]);
  const [loading, setLoading] = useState(false);
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
      getTaxBranchDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setTaxBranchDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Finished Goods Inventory Register"}>
                <CardHeaderToolbar></CardHeaderToolbar>
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
                    <div className="col-lg-3 mt-5">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          getFGInventoryRegisterReport(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.branch?.value,
                            values?.fromDate,
                            setRowDto,
                            setLoading
                          );
                        }}
                        disabled={!values?.fromDate || !values?.branch}
                      >
                        View
                      </button>
                    </div>
                  </div>
                  {rowDto?.length > 0 && (
                    <GridData rowDto={rowDto} loading={loading} />
                  )}
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
