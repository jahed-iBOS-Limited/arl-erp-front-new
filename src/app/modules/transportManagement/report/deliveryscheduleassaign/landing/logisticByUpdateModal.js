import Axios from "axios";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls/Card";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import FormikError from "../../../../_helper/_formikError";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { updateAssingnedVehicleProvider } from "../helper";
const validationSchema = Yup.object().shape({
  updateType: Yup.object().shape({
    value: Yup.string().required("Update Type is required"),
    label: Yup.string().required("Update Type is required"),
  }),

  vehicle: Yup.string().when("updateType", (updateType, Schema) => {
    if (+updateType?.value === 1)
      return Schema.required("Vehicle is required").nullable();
  }),
  supplier: Yup.string().when("updateType", (updateType, Schema) => {
    if (+updateType?.value === 2)
      return Schema.required("Supplier is required").nullable();
  }),
});
const initData = {
  updateType: "",
  vehicle: "",
  supplier: "",
  reasons: "",
};

function LogisticByUpdateModal({ clickRowData, landingCB }) {
  const [loading, setLoading] = useState(false);
  // Get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const saveHandler = (values, cb) => {
    const payload = {
      providerTypeId: values?.updateType?.value,
      providerTypeName: values?.updateType?.name,
      deliveryId: clickRowData?.deliveryId || clickRowData?.intDeliveryId,
      deliverySummeryId: 0,
      businessUnitId: selectedBusinessUnit?.value,
      deliveryCode: "",
      supplierId: values?.supplier?.value || 0,
      supplierName: values?.supplier?.label || "",
      actionBy: profileData?.userId,
      qnt: 0,
      customerName: "",
      delvAddress: 0,
      delvDate: new Date(),
      process: false,
      salesOrderNumber: "",
      territoryId: 0,
      vehicleId: values?.vehicle?.value || 0,
      vehicleName: values?.vehicle?.label || "",
      updateBy: profileData?.userId,
      reasons: values?.reasons || "",
    };

    updateAssingnedVehicleProvider(payload, setLoading, () => {
      cb();
      landingCB();
    });
  };

  return (
    <>
      {loading && <Loading />}
      <div>
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
          {({ values, setFieldValue, touched, errors, handleSubmit }) => (
            <Card>
              
              {true && <ModalProgressBar />}
              <CardHeader title={"Delivery Schedule Assign Report"}>
                <CardHeaderToolbar>
                  <button
                    onClick={handleSubmit}
                    className='btn btn-primary ml-2'
                    type='submit'
                  >
                    Save
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <>
                  <Form>
                    <div className='row '>
                      <div className='col-lg-12'>
                        <div style={{
                            display: 'flex',
                            gap: '30px',
                            marginTop: '10px'
                            
                        }}>
                        <p>
                          Delivery Code: <b>{clickRowData?.deliveryCode}</b>
                        </p>
                        <p>
                          Sales Order No: <b>{clickRowData?.salesOrderCode}</b>
                        </p>
                        <p>Logistic By: <b>{clickRowData?.providerTypeName}</b></p>
                        <p>
                          {clickRowData?.providerTypeName === "Company"
                            ? "Vehicle"
                            : "Supplier"}
                          :{" "}
                          <b>
                            {clickRowData?.vehicleName ||
                              clickRowData?.supplierName}
                          </b>{" "}
                        </p>
                        </div>
                      </div>
                    </div>

                    <div className='row global-form mt-0'>
                      <div className='col-lg-3'>
                        <NewSelect
                          name='updateType'
                          options={[
                            {
                              value: 1,
                              label: "Supplier to company transfer",
                              name: "Company",
                            },
                            {
                              value: 2,
                              label: "Company to Supplier transfer",
                              name: "Supplier",
                            },
                          ]}
                          value={values?.updateType}
                          label='Update Type'
                          onChange={(valueOption) => {
                            setFieldValue("updateType", valueOption);
                            setFieldValue("vehicle", "");
                            setFieldValue("supplier", "");
                          }}
                          placeholder='Update Type'
                          errors={errors}
                          touched={touched}
                          isClearable={false}
                        />
                      </div>
                      {values?.updateType?.value === 1 && (
                        <div className='col-lg-3'>
                          <label>Select Vehicle</label>
                          <SearchAsyncSelect
                            selectedValue={values?.vehicle}
                            handleChange={(valueOption) => {
                              setFieldValue("vehicle", valueOption);
                            }}
                            loadOptions={(v) => {
                              if (v?.length < 2) return [];
                              return Axios.get(
                                `/wms/Delivery/GetVehicleByShippointDDL?businessUnitId=${selectedBusinessUnit?.value}&shippointId=${clickRowData?.shipPoint?.value}&searchTerm=${v}`
                              ).then((res) => {
                                return res?.data || [];
                              });
                            }}
                            placeholder='Select Vehicle'
                          />
                          <FormikError
                            errors={errors}
                            name='vehicle'
                            touched={touched}
                          />
                        </div>
                      )}
                      {values?.updateType?.value === 2 && (
                        <>
                          <div className='col-lg-3'>
                            <label>Select Supplier</label>
                            <SearchAsyncSelect
                              selectedValue={values?.supplier}
                              handleChange={(valueOption) => {
                                setFieldValue("supplier", valueOption);
                              }}
                              loadOptions={(v) => {
                                if (v?.length < 2) return [];
                                return Axios.get(
                                  `/wms/Delivery/GetSupplierByShipPointDDl?businessUnitId=${selectedBusinessUnit?.value}&shippointId=${clickRowData?.shipPoint?.value}&searchTerm=${v}`
                                ).then((res) => {
                                  return res?.data || [];
                                });
                              }}
                              placeholder='Select Supplier'
                            />
                            <FormikError
                              errors={errors}
                              name='supplier'
                              touched={touched}
                            />
                          </div>
                        </>
                      )}
                      <div className='col-lg-3'>
                        <label>Remarks</label>
                        <InputField
                          value={values?.reasons || ""}
                          reasons
                          placeholder='Remarks'
                          type='text'
                          onChange={(e) => {
                            setFieldValue("reasons", e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  </Form>
                </>
              </CardBody>
            </Card>
          )}
        </Formik>
      </div>
    </>
  );
}

export default LogisticByUpdateModal;
