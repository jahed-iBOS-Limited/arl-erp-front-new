import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import NewSelect from "./../../../../_helper/_select";
import GridData from "./grid";
import { SecondaryCollectionLanding } from "../helper";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
} from "../../../../../../_metronic/_partials/controls";
import Loading from "../../../../_helper/_loading";
import { getrouteNameDDL_api } from "../helper";

const initData = {
  routeName: "",
  completeOrder: false,
  pendingOrder: false,
};

export default function HeaderForm({ createHandler }) {
  const [loading, setLoading] = useState(false);
  const [gridData, setGridData] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [values, setValues] = useState({});
  const [routeName, setRouteName] = useState("");
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
    getrouteNameDDL_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setRouteName
    );
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    SecondaryCollectionLanding(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.routeName?.value,
      values?.completeOrder || values?.pendingOrder,
      setGridData,
      setLoading,
      pageNo,
      pageSize
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData }}
        //validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Secondary Collection"}></CardHeader>
              <CardBody>
                {loading && <Loading />}
                {console.log(values, "data")}
                <Form className="form form-label-right">
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <NewSelect
                        name="routeName"
                        options={routeName}
                        value={values?.routeName}
                        label="Route Name"
                        onChange={(valueOption) => {
                          setFieldValue("routeName", valueOption);
                        }}
                        placeholder="Route Name"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2">
                      <div
                        style={{ position: "relative", top: "15px" }}
                        className="mr-3"
                      >
                        <label htmlFor="completeOrder">Complete Order</label>
                        <Field
                          name="completeOrder"
                          component={() => (
                            <input
                              id="completeOrder"
                              type="checkbox"
                              style={{ position: "relative", top: "5px" }}
                              label="Complete Order"
                              className="ml-2"
                              value={values?.completeOrder}
                              checked={values?.completeOrder}
                              name="completeOrder"
                              disabled={values?.pendingOrder}
                              onChange={(e) => {
                                setFieldValue(
                                  "completeOrder",
                                  e.target.checked
                                );
                              }}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="col-lg-2">
                      <div
                        style={{ position: "relative", top: "15px" }}
                        className="mr-2"
                      >
                        <label htmlFor="pendingOrder">Pending Order</label>
                        <Field
                          name="pendingOrder"
                          component={() => (
                            <input
                              id="pendingOrder"
                              type="checkbox"
                              style={{ position: "relative", top: "5px" }}
                              label="Pending Order"
                              className="ml-2"
                              value={values?.pendingOrder}
                              checked={values?.pendingOrder}
                              name="pendingOrder"
                              disabled={values?.completeOrder}
                              onChange={(e) => {
                                setFieldValue("pendingOrder", e.target.checked);
                              }}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div
                      className="col-lg-3 mt-4"
                      style={{
                        marginLeft: "-25px",
                        marginBottom: "10px",
                      }}
                    >
                      <button
                        className="btn btn-primary p-3"
                        type="button"
                        onClick={() => {
                          setValues(values);
                          SecondaryCollectionLanding(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.routeName?.value,
                            values?.completeOrder || values?.pendingOrder,
                            setGridData,
                            setLoading,
                            pageNo,
                            pageSize
                          );
                        }}
                        disabled={!values.routeName}
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
