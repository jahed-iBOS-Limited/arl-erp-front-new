import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import NewSelect from "../../../_helper/_select";
import {
    Card,
    CardBody
  } from "../../../../../_metronic/_partials/controls";
import { SetSalesInvoiceDataAction } from "../../../_helper/reduxForLocalStorage/Actions";
import { getShippointDDL, getWareHouseDDL } from "../helper";

const initData = {
    whName: "",
    counter: ""
  };
  
// Validation schema
const validationSchema = Yup.object().shape({
  // whName: Yup.string()
  //   .min(2, "Minimum 2 strings")
  //   .max(100, "Maximum 100 strings")
  //   .required("Holiday group name is required"),
});

export default function SalesInvoice({
  saveHandler,
  rowDto,
}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [whName, setWhName] = React.useState([]);
  const [shippointDDL, setShippointDDL] = useState([]);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if(profileData?.accountId && selectedBusinessUnit?.value){
      getWareHouseDDL(profileData?.accountId, selectedBusinessUnit?.value, profileData?.userId, setWhName);
      getShippointDDL(profileData?.userId, profileData?.accountId, selectedBusinessUnit?.value, setShippointDDL)
    }
  }, [profileData, selectedBusinessUnit])

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values);
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          setValues,
          isValid,
        }) => (
            <div className="global-card-header">
              <Card>
                <CardBody>
                  <Form className="form form-label-right">
                    <div className="global-form">
                      <div className="row">
                        <div className="col-lg-3">
                          <NewSelect
                            name="whName"
                            options={whName}
                            value={values?.whName}
                            onChange={(valueOption) => {
                                setFieldValue("whName", valueOption);
                            }}
                            placeholder="Warehouse Name"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-3">
                          <NewSelect
                            name="counter"
                            options={shippointDDL}
                            value={values?.counter}
                            onChange={(valueOption) => {
                              console.log(valueOption)
                                setFieldValue("counter", valueOption);
                            }}
                            placeholder="Shipping Point"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div style={{ marginTop: "18px" }} className="col-lg-1">
                          <button
                            disabled={!values?.whName || !values?.counter}
                            className="btn btn-primary"
                            onClick={() => {
                                dispatch(SetSalesInvoiceDataAction(values))
                                history.push({
                                    pathname: `/pos-management/sales/sales-invoice/create`
                                });
                            }}
                            type="button"
                            >
                                Next
                          </button>
                        </div>
                      </div>
                    </div>
                    </Form>
                </CardBody>
              </Card>    
            </div>
        )}
      </Formik>
    </>
  );
}
