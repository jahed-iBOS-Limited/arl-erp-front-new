import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { _todayDate } from './../../../../../_helper/_todayDate';
import "./style.css";
import { useHistory } from "react-router-dom";
import { getHeaderData } from "../../helper";
import { useSelector, shallowEqual } from "react-redux";
import {

  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../../_metronic/_partials/controls";
// Validation schema
const validationSchema = Yup.object().shape({});
const initData = {
  customsHouse: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

export default function AuditReport() {
  const [headerData, setHeaderData] = useState("");
  const history = useHistory();
  const { selectedBusinessUnit, profileData } = useSelector((state) => {
    return state.authData;
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
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({
          errors,
          touched,
          setFieldValue,
          isValid,
          handleSubmit,
          values,
        }) => (
          <>
            <Form className="form form-label-right">
              <Card>
                {true && <ModalProgressBar />}
                <CardHeader title="Audit Report">
                  <CardHeaderToolbar>
                    <div>
                      <p className="m-0">
                        <b>BIN NO:</b> {headerData?.bin}{" "}
                      </p>
                    </div>
                    <div className="ml-4">
                      <p className="m-0">
                        <b>Address:</b> {headerData?.addressOfTaxpayer}{" "}
                      </p>
                    </div>
                  </CardHeaderToolbar>
                </CardHeader>
                <CardBody>
                  <div className="row global-form" style={{ height: "450px" }}>
                    <div className="col-12">
                      <div className="AuditReportCard d-flex justify-content-center flex-column align-items-center">
                        <p
                          onClick={() => {
                            history.push({
                              pathname: `/mngVat/report/auditReport/view`,
                              state: { value: 4, label: "Import" },
                            });
                          }}
                        >
                          <b>Import</b>
                        </p>
                        <p
                          onClick={() => {
                            history.push({
                              pathname: `/mngVat/report/auditReport/view`,
                              state: { value: 1, label: "Local Purchase" },
                            });
                          }}
                        >
                          <b>Local Purchase</b>
                        </p>
                        <p
                          onClick={() => {
                            history.push({
                              pathname: `/mngVat/report/auditReport/view`,
                              state: { value: 2, label: "Local Sales" },
                            });
                          }}
                        >
                          <b>Local Sales</b>
                        </p>
                        <p
                          onClick={() => {
                            history.push({
                              pathname: `/mngVat/report/auditReport/view`,
                              state: { value: 3, label: "Export" },
                            });
                          }}
                        >
                          <b>Export</b>
                        </p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
