import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { GetRouteStandardCostByRouteId } from "../helper";

// Validation schema
const validationSchema = Yup.object().shape({});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  landingData,
}) {
  const [isDisabled, setDisabled] = useState(false);

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    if (landingData?.transportOrganizationId && landingData?.routeId) {
      commonPrvSaveData(
        landingData?.routeId,
        landingData?.transportOrganizationId,
        landingData?.shipPointId
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [landingData]);
  const formikRef = React.useRef(null);
  const commonPrvSaveData = (routeId, transportORGId, shipPointId) => {
    GetRouteStandardCostByRouteId(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      routeId,
      transportORGId,
      shipPointId,
      (data) => {
        if (formikRef.current) {
          const obj = data?.[0] || {};
          formikRef.current.setFieldValue("itemLists", data || []);

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
          formikRef.current.setFieldValue(
            "shipPoint",
            obj?.shipPointId
              ? {
                  value: obj?.shipPointId,
                  label: obj?.shipPointName,
                }
              : ""
          );
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
            {isDisabled && <Loading />}
            <Form className='form form-label-right'>
              <div className=''>
                <div className='form-group row global-form'>
                  <div className='col-lg-3'>
                    <NewSelect
                      name='transportOrganizationName'
                      options={[]}
                      value={values?.transportOrganizationName}
                      label='Transport Organization Name'
                      onChange={(valueOption) => {
                        setFieldValue("transportOrganizationName", valueOption);
                      }}
                      placeholder='Transport Organization Name'
                      errors={errors}
                      touched={touched}
                      isDisabled={true}
                    />
                  </div>
                  <div className='col-lg-3'>
                    <NewSelect
                      name='shipPoint'
                      options={[]}
                      value={values?.shipPoint}
                      label='ShipPoint'
                      onChange={(valueOption) => {
                        setFieldValue("shipPoint", valueOption);
                      }}
                      placeholder='Select ShipPoint'
                      errors={errors}
                      touched={touched}
                      isDisabled={true}
                    />
                  </div>
                  <div className='col-lg-3'>
                    <NewSelect
                      name='routeName'
                      options={[]}
                      value={values?.routeName}
                      label='Route Name'
                      onChange={(valueOption) => {
                        setFieldValue("routeName", valueOption);
                      }}
                      placeholder='Route Name'
                      errors={errors}
                      touched={touched}
                      isDisabled={true}
                    />
                  </div>
                </div>
                {values?.itemLists?.length >= 0 && (
                  <div className="table-responsive">
                    <table className='table table-striped table-bordered global-table'>
                    <thead>
                      <tr>
                        <th style={{ width: "35px" }}>SL</th>

                        <th>Component Name</th>
                        <th> Vehicle Capacity</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {values?.itemLists.map((itm, index) => (
                        <tr key={itm.itemId}>
                          <td className='text-center'>{index + 1}</td>
                          <td className='pl-2'>
                            {itm.transportRouteCostComponentName}
                          </td>
                          <td className='pl-2'>{itm?.vehicleCapacityName}</td>
                          <td className='pr-2'>{itm?.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
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
