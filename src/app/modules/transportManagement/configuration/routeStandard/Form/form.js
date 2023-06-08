/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";

import { getDDL } from "../helper";

// Validation schema
const validationSchema = Yup.object().shape({
  transportOrganizationName: Yup.object().shape({
    label: Yup.string().required("Transport Organization Name is required"),
    value: Yup.string().required("Transport Organization Name is required"),
  }),
  routeName: Yup.object().shape({
    label: Yup.string().required("Route Name Name is required"),
    value: Yup.string().required("Route Name Name is required"),
  }),
  itemLists: Yup.array().of(
    Yup.object().shape({
      amount: Yup.number()
        .min(0, "Minimum 0 number")
        .required("Price is required"),
    })
  ),
  // componentName: Yup.object().shape({
  //   label: Yup.string().required("Component Name is required"),
  //   value: Yup.string().required("Component Name is required"),
  // }),
  // amount: Yup.number()
  //   .min(0, "Minimum 0 ranges")
  //   .required("Amount is required"),
  // businessTransaction: Yup.object().shape({
  //   label: Yup.string().required("Business Transaction is required"),
  //   value: Yup.string().required("Business Transaction is required"),
  // }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  profileData,
  selectedBusinessUnit,
  isEdit,
  tableDataGetFunc
}) {
  // All DDL State
  const [
    transportOrganizationNameDDL,
    setTransportOrganizationNameDDL,
  ] = useState([]);
  const [routeNameDDL, setRouteNameDDL] = useState([]);

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      // Get Transport Organization DDL
      getDDL(
        `/tms/RouteStandardCost/getTransportOrganizationList?BusinessUnitId=${selectedBusinessUnit?.value}`,
        setTransportOrganizationNameDDL
      );
      // Get Transport Route Name DDL
      getDDL(
        `/oms/Shipment/GetTransportRouteListDDL?AccountId=${profileData?.accountId}&BUnitId=${selectedBusinessUnit?.value}`,
        setRouteNameDDL
      );
    }
  }, []);



  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
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
            {/* {disableHandler(!isValid)} */}
            <Form className='form form-label-right'>
              <div className=''>
                <div className='form-group row global-form'>
                  <div className='col-lg-3'>
                    <NewSelect
                      name='transportOrganizationName'
                      options={transportOrganizationNameDDL || []}
                      value={values?.transportOrganizationName}
                      label='Transport Organization Name'
                      onChange={(valueOption) => {
                        setFieldValue("transportOrganizationName", valueOption);
                        tableDataGetFunc(
                          valueOption?.value,
                          values?.routeName?.value,
                          setFieldValue
                        );
                      }}
                      placeholder='Transport Organization Name'
                      errors={errors}
                      touched={touched}
                      isDisabled={isEdit}
                    />
                  </div>
                  <div className='col-lg-2'>
                    <NewSelect
                      name='routeName'
                      options={routeNameDDL || []}
                      value={values?.routeName}
                      label='Route Name'
                      onChange={(valueOption) => {
                        setFieldValue("routeName", valueOption);
                        tableDataGetFunc(
                          values?.transportOrganizationName?.value,
                          valueOption?.value,
                          setFieldValue
                        );
                      }}
                      placeholder='Route Name'
                      errors={errors}
                      touched={touched}
                      isDisabled={isEdit}
                    />
                  </div>
                  {/* <div className="col-lg-2">
                    <NewSelect
                      name="componentName"
                      options={componentNameDDL || []}
                      value={values?.componentName}
                      label="Component Name"
                      onChange={(valueOption) => {
                        setFieldValue("componentName", valueOption);
                      }}
                      placeholder="Component Name"
                      errors={errors}
                      touched={touched}
                      isDisabled={type === "edit" || type === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="businessTransaction"
                      options={businessTransaction || []}
                      value={values?.businessTransaction}
                      label="Business Transaction"
                      onChange={(valueOption) => {
                        setFieldValue("businessTransaction", valueOption);
                      }}
                      placeholder="Business Transaction"
                      errors={errors}
                      touched={touched}
                      isDisabled={type === "edit" || type === "view"}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Amount</label>
                    <InputField
                      value={values?.amount || ""}
                      name="amount"
                      placeholder="Amount"
                      type="number"
                      onChange={(e) => {
                        NegetiveCheck(e.target.value, setFieldValue, "amount");
                      }}
                      disabled={type === "view"}
                    />
                  </div> */}
                </div>
                {values?.itemLists?.length >= 0 && (
                  <table className='table table-striped table-bordered global-table'>
                    <thead>
                      <tr>
                        <th style={{ width: "35px" }}>SL</th>
                        <th>Component Name</th>
                        <th style={{ width: "400px"}}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {values?.itemLists.map((itm, index) => (
                        <tr key={itm.itemId}>
                          <td className='text-center'>{index + 1}</td>
                          <td className='pl-2'>
                            {itm.transportRouteCostComponentName}
                          </td>

                          <td className='pr-2'>
                            <InputField
                              value={values?.itemLists[index]?.amount}
                              name={`itemLists.${index}.amount`}
                              placeholder='Amount'
                              type='number'
                              onChange={(e) => {
                                setFieldValue(e.target.name, e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <button
                type='submit'
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type='reset'
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
