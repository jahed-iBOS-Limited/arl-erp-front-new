import { Form, Formik } from "formik";
import React, { useState } from "react";
import { ISelect } from "../../../../_helper/_inputDropDown";
import Loading from "../../../../_helper/_loading";
import { ShippointChange } from "../helper";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "./../../../../../../_metronic/_partials/controls";

export function ChallanModal({
  ShippointDDL,
  tableRowData,
  selectedBusinessUnit,
  cb,
}) {
  const [loading, setLoading] = useState(false);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          pgiShippoint: ShippointDDL[0] || "",
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Challan Shippoint Transfer update"}>
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      ShippointChange(
                        tableRowData?.intDeliveryId,
                        values?.pgiShippoint?.value,
                        values?.pgiShippoint?.label,
                        selectedBusinessUnit?.value,
                        setLoading,
                        cb
                      );
                    }}
                    className="btn btn-primary"
                  >
                    Save
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="row global-form">
                        <>
                          <div className="col-lg-3">
                            <ISelect
                              label="Select Shippoint"
                              options={ShippointDDL}
                              value={values.pgiShippoint}
                              name="pgiShippoint"
                              setFieldValue={setFieldValue}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </>
                      </div>
                    </div>
                  </div>
                </Form>

                {/* Table Start */}
                {loading && <Loading />}
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
