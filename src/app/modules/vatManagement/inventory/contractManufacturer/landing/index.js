import React from "react";
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

const initData = {};

function ContractManufacturerLanding() {
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
              <CardHeader title={"Contract Manufacturer"}>
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <label>Mushak-6.4 : No</label>
                      <InputField
                        value={values?.mushakDate}
                        name="mushakDate"
                        placeholder="Mushak Date"
                        type="date"
                      />
                    </div>
                    <div className="col-lg-3 mt-5">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          console.log("Hi!");
                        }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </Form>

                {/* Report Body Start */}
                <ReportBody />
                {/* Report Body End */}
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}

export default ContractManufacturerLanding;
