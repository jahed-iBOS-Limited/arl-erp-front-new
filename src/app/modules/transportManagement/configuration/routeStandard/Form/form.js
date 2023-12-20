/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";

import {
  GetRouteStandardCostByRouteId,
  GetRouteStandardCostDetailsApi,
  getDDL,
} from "../helper";
import { NegetiveCheck } from "./../../../../_helper/_negitiveCheck";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

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
  setDisabled,
}) {
  const { state: landingData } = useLocation();
  // All DDL State
  const [
    transportOrganizationNameDDL,
    setTransportOrganizationNameDDL,
  ] = useState([]);
  const [routeNameDDL, setRouteNameDDL] = useState([]);
  const [componentNameDDL, setComponentNameDDL] = useState([]);
  const [vehicleCapacityDDL, setVehicleCapacityDDL] = useState([]);
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
      getDDL(
        `/tms/TransportMgtDDL/GetVehicleCapacityDDL`,
        setVehicleCapacityDDL
      );
    }
  }, [selectedBusinessUnit, profileData]);

  useEffect(() => {
    if (landingData?.transportOrganizationId && landingData?.routeId) {
      GetRouteStandardCostDetailsApi(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        landingData?.transportOrganizationId,
        landingData?.routeId,
        setComponentNameDDL
      );
      commonPrvSaveData(
        landingData?.routeId,
        landingData?.transportOrganizationId
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [landingData]);
  const formikRef = React.useRef(null);

  const commonPrvSaveData = (routeId, transportORGId) => {
    GetRouteStandardCostByRouteId(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      routeId,
      transportORGId,
      (data) => {
        if (formikRef.current) {
          const obj = data?.[0] || {};
          formikRef.current.setFieldValue("itemLists", data || []);
          
          if(landingData?.routeId){
            formikRef.current.setFieldValue(
              "transportOrganizationName",
              obj?.transportOrganizationId
                ? {
                    value: obj?.transportOrganizationId,
                    label: obj?.transportOrganizationName,
                  }
                : ""
            );
            formikRef.current.setFieldValue(
              "routeName",
              obj?.routeId
                ? {
                    value: obj?.routeId,
                    label: obj?.routeName,
                  }
                : ""
            );
          }
         
        }
      },
      setDisabled
    );
  };
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
        innerRef={formikRef}
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
                        setFieldValue("routeName", "");
                        setFieldValue("componentName", "");
                      }}
                      placeholder='Transport Organization Name'
                      errors={errors}
                      touched={touched}
                      isDisabled={
                        values?.itemLists?.length > 0 ? true : false || isEdit
                      }
                    />
                  </div>
                  <div className='col-lg-3'>
                    <NewSelect
                      name='routeName'
                      options={routeNameDDL || []}
                      value={values?.routeName}
                      label='Route Name'
                      onChange={(valueOption) => {
                        setFieldValue("routeName", valueOption);
                        setFieldValue("componentName", "");
                        GetRouteStandardCostDetailsApi(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          values?.transportOrganizationName?.value,
                          valueOption?.value,
                          setComponentNameDDL
                        );
                        commonPrvSaveData(
                          valueOption?.value,
                          values?.transportOrganizationName?.value
                        );
                      }}
                      placeholder='Route Name'
                      errors={errors}
                      touched={touched}
                      isDisabled={
                        values?.itemLists?.length > 0
                          ? true
                          : false ||
                            isEdit ||
                            !values?.transportOrganizationName
                      }
                    />
                  </div>
                  <div className='col-lg-3'>
                    <NewSelect
                      name='vehicleCapacity'
                      options={
                        [
                          { value: 0, label: "Not Applicable" },
                          ...vehicleCapacityDDL,
                        ] || []
                      }
                      value={values?.vehicleCapacity || ""}
                      label='Vehicle Capacity'
                      onChange={(valueOption) => {
                        setFieldValue("vehicleCapacity", valueOption);
                      }}
                      placeholder='Vehicle Capacity'
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className='col-lg-3'>
                    <NewSelect
                      name='componentName'
                      options={componentNameDDL || []}
                      value={values?.componentName}
                      label='Component Name'
                      onChange={(valueOption) => {
                        setFieldValue("componentName", valueOption);
                      }}
                      placeholder='Component Name'
                      errors={errors}
                      touched={touched}
                      isDisabled={!values?.routeName}
                    />
                  </div>

                  <div className='col-lg-3'>
                    <label>Amount</label>
                    <InputField
                      value={values?.amount || ""}
                      name='amount'
                      placeholder='Amount'
                      type='number'
                      onChange={(e) => {
                        if (e.target.value >= 0) {
                          setFieldValue("amount", e.target.value);
                        } else {
                          setFieldValue("amount", "");
                        }
                      }}
                    />
                  </div>

                  <div className='col-lg-2'>
                    <button
                      onClick={() => {
                        const prvList = [...values?.itemLists];
                        const obj = {
                          standardCostId: 0,
                          transportOrganizationId:
                            values?.transportOrganizationName?.value,
                          transportOrganizationName:
                            values?.transportOrganizationName?.label,
                          routeId: values?.routeName?.value,
                          routeName: values?.routeName?.label,
                          transportRouteCostComponentId:
                            values?.componentName?.value,
                          transportRouteCostComponentName:
                            values?.componentName?.label,
                          amount: values?.amount,
                          businessTransactionId:
                            values?.componentName?.businessTransactionId || 0,
                          vehicleCapacityName: values?.vehicleCapacity?.label,
                          vehicleCapacityId: values?.vehicleCapacity?.value,
                        };

                        // duplicate check (transportRouteCostComponentId, vehicleCapacityId,routeId )
                        const duplicateCheck = prvList?.some(
                          (itm) =>
                            itm?.transportRouteCostComponentId ===
                              obj?.transportRouteCostComponentId &&
                            itm?.vehicleCapacityId === obj?.vehicleCapacityId &&
                            itm?.routeId === obj?.routeId
                        );

                        if (duplicateCheck) {
                          return toast.warning(
                            "Component Name, Vehicle Capacity and Route Name already added"
                          );
                        }
                        setFieldValue("itemLists", [...prvList, obj]);
                      }}
                      type='button'
                      className='btn btn-primary mt-5'
                      disabled={
                        !values?.transportOrganizationName ||
                        !values?.routeName ||
                        !values?.componentName ||
                        !values?.vehicleCapacity
                      }
                    >
                      Add
                    </button>
                  </div>
                </div>
                {values?.itemLists?.length >= 0 && (
                  <table className='table table-striped table-bordered global-table'>
                    <thead>
                      <tr>
                        <th style={{ width: "35px" }}>SL</th>
                        <th> Vehicle Capacity</th>
                        <th>Component Name</th>

                        <th style={{ width: "400px" }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {values?.itemLists.map((itm, index) => (
                        <tr key={itm?.itemId}>
                          <td className='text-center'>{index + 1}</td>
                          <td className='pl-2'>{itm?.vehicleCapacityName}</td>
                          <td className='pl-2'>
                            {itm?.transportRouteCostComponentName}
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
