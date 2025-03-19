import { Form, Formik } from "formik";
import React from "react";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";

export default function EditForm({ singleData }) {
  const initData = {
    salesman: singleData?.strSalesManeName,
    client: singleData?.strCustomerName,
    area: singleData?.strAreaName,
    territory: singleData?.strTerritoryName,
    totalDues: singleData?.numTotalDues,
    overdue: singleData?.numOverDue,
    od: singleData?.numOverDuePercentage,
    week1: singleData?.numWeek1,
    week2: singleData?.numWeek2,
    week3: singleData?.numWeek3,
    week4: singleData?.numWeek4,
    total:
      singleData?.numWeek1 +
      singleData?.numWeek2 +
      singleData?.numWeek3 +
      singleData?.numWeek4,
    percent: singleData?.numCollectionPercentage,
  };
  
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ resetForm, values }) => (
          <>
            <ICustomCard
              title="Edit monthly collection plan"
              resetHandler={() => {
                resetForm();
              }}
              saveHandler={() => {
                // saveHandler(values, () => {
                // });
              }}
            >
              <Form className="form form-label-right">
                <div className="row global-form global-form-custom">
                  <div className="col-lg-3">
                    <InputField
                      name="salesman"
                      value={values?.salesman}
                      label="Salesman Name"
                      placeholder="Salesman Name"
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      name="client"
                      value={values?.client}
                      label="Client Name"
                      placeholder="Client Name"
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      name="area"
                      value={values?.area}
                      label="Area"
                      placeholder="Area"
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      name="territory"
                      value={values?.territory}
                      label="Territory"
                      placeholder="Territory"
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      name="totalDues"
                      value={values?.totalDues}
                      label="Total Dues"
                      placeholder="Total Dues"
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      name="overdue"
                      value={values?.overdue}
                      label="Overdue"
                      placeholder="Overdue"
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      name="od"
                      value={values?.od}
                      label="OD"
                      placeholder="OD"
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      name="week1"
                      value={values?.week1}
                      label="Week-1"
                      placeholder="Week-1"
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      name="week2"
                      value={values?.week2}
                      label="Week-2"
                      placeholder="Week-2"
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      name="week3"
                      value={values?.week3}
                      label="Week-3"
                      placeholder="Week-3"
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      name="week4"
                      value={values?.week4}
                      label="Week-4"
                      placeholder="Week-4"
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      name="total"
                      value={values?.total}
                      label="Total"
                      placeholder="Total"
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      name="percent"
                      value={values?.percent}
                      label="%"
                      placeholder="%"
                      disabled={true}
                    />
                  </div>
                </div>
              </Form>
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
}
