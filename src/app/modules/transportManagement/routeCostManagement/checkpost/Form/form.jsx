import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import IViewModal from "../../../../_helper/_viewModal";
import VehicleNoAddForm from "./vehicleNoAddForm/vehicleNoAddForm";
import { getVehicleInfobyId } from "./../helper";

// Validation schema
const validationSchema = Yup.object().shape({
  checkPost: Yup.object().shape({
    label: Yup.string().required("Check Post is required"),
    value: Yup.string().required("Check Post is required"),
  }),
  vehicleNo: Yup.object().shape({
    label: Yup.string().required("Vehicle No is required"),
    value: Yup.string().required("Vehicle No is required"),
  }),
  driverName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Driver Name is required"),
  driverContact: Yup.string()
    .max(60, "Must be 60 characters or less")
    .min(1, "Must be at least 1 character")
    .required("Driver Contact is Required"),
  usePurpose: Yup.object().shape({
    label: Yup.string().required("Use Purpose is required"),
    value: Yup.string().required("Use Purpose is required"),
  }),
  plant: Yup.object().shape({
    label: Yup.string().required("Plant required"),
    value: Yup.string().required("Plant required"),
  }),
  cameFrom: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Came From is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  checkPostDDL,
  purposeTypeDDL,
  plantDDL,
  shipPointDDL,
  vehicleNoDDL,
  vehicleManualNoDDL,
  setVehicleManualNoDDL,
  cameFromDDL,
  profileData,
  selectedBusinessUnit,
  isEdit,
}) {
  const [isShowModal, setIsShowModal] = useState(false);
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
          setValues,
        }) => (
          <>
            {/* {disableHandler(!isValid)} */}
            <Form className='form form-label-right'>
              <div className='row'>
                <div className='col-lg-12'>
                  <div className='row global-form'>
                    <div className='col-lg-2 mb-2'>
                      <NewSelect
                        name='checkPost'
                        options={checkPostDDL || []}
                        value={values?.checkPost}
                        label='Check Post'
                        onChange={(valueOption) => {
                          setFieldValue("checkPost", valueOption);
                        }}
                        placeholder='Check Post'
                        errors={errors}
                        touched={touched}
                        isDisabled={isEdit}
                      />
                    </div>
                    <div className='col-lg-2 mb-2'>
                      <NewSelect
                        name='usePurpose'
                        options={purposeTypeDDL}
                        value={values?.usePurpose}
                        label='Use Purpose'
                        onChange={(valueOption) => {
                          if (valueOption?.label === "Others") {
                            setFieldValue("driverName", "");
                            setFieldValue("driverContact", "");
                            setFieldValue("vehicleNo", "");
                          }
                          setFieldValue("usePurpose", valueOption);
                        }}
                        placeholder='Use Purpose'
                        errors={errors}
                        touched={touched}
                        isDisabled={isEdit}
                      />
                    </div>
                    <div className='col-lg-2 mb-2 d-flex align-items-center'>
                      {values?.usePurpose?.label === "Others" ? (
                        <div>
                          <NewSelect
                            name='vehicleNo'
                            options={vehicleManualNoDDL || []}
                            value={values?.vehicleNo}
                            label='Vehicle No'
                            placeholder='Vehicle No'
                            onChange={(valueOption) => {
                              setFieldValue("driverName", "");
                              setFieldValue("driverContact", "");
                              setFieldValue("vehicleNo", valueOption);
                            }}
                            errors={errors}
                            touched={touched}
                            isDisabled={isEdit}
                          />
                        </div>
                      ) : (
                        <div>
                          <NewSelect
                            name='vehicleNo'
                            options={vehicleNoDDL || []}
                            value={values?.vehicleNo}
                            label='Vehicle No'
                            onChange={(valueOption) => {
                              getVehicleInfobyId(
                                profileData?.accountId,
                                selectedBusinessUnit?.value,
                                valueOption?.value,
                                setFieldValue
                              );
                              setFieldValue("vehicleNo", valueOption);
                            }}
                            placeholder='Vehicle No'
                            errors={errors}
                            touched={touched}
                            isDisabled={isEdit}
                          />
                        </div>
                      )}
                      {values?.usePurpose?.label === "Others" && (
                        <div
                          className='mt-5 pl-2'
                          onClick={() => {
                            setIsShowModal(true);
                          }}
                        >
                          <i
                            style={{ fontSize: "15px", color: "#3699FF" }}
                            className='fa pointer fa-plus-circle'
                            aria-hidden='true'
                          ></i>
                        </div>
                      )}
                    </div>
                    {values?.usePurpose?.label === "Others" ? (
                      <>
                        <div className='col-lg-2 mb-2'>
                          <label>Driver Name</label>
                          <InputField
                            value={values?.driverName || ""}
                            name='driverName'
                            placeholder='Driver Name'
                            type='text'
                          />
                        </div>
                        <div className='col-lg-2 mb-2'>
                          <label>Driver Contact</label>
                          <InputField
                            value={values?.driverContact || ""}
                            name='driverContact'
                            placeholder='Driver Contact'
                            type='text'
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className='col-lg-2 mb-2'>
                          <label>Driver Name</label>
                          <InputField
                            value={values?.driverName || ""}
                            name='driverName'
                            placeholder='Driver Name'
                            type='text'
                            disabled
                          />
                        </div>
                        <div className='col-lg-2 mb-2'>
                          <label>Driver Contact</label>
                          <InputField
                            value={values?.driverContact || ""}
                            name='driverContact'
                            placeholder='Driver Contact'
                            type='text'
                            disabled
                          />
                        </div>
                      </>
                    )}

                    <div className='col-lg-2 mb-2'>
                      <NewSelect
                        name='plant'
                        options={plantDDL}
                        value={values?.plant}
                        label='Plant'
                        onChange={(valueOption) => {
                          setFieldValue("plant", valueOption);
                        }}
                        placeholder='Plant'
                        errors={errors}
                        touched={touched}
                        isDisabled={isEdit}
                      />
                    </div>
                    {values?.usePurpose?.label === "Distribution" && (
                      <div className='col-lg-2 mb-2'>
                        <NewSelect
                          name='shipPoint'
                          options={shipPointDDL}
                          value={values?.shipPoint}
                          label='Ship Point'
                          onChange={(valueOption) => {
                            setFieldValue("shipPoint", valueOption);
                          }}
                          placeholder='Ship Point'
                          errors={errors}
                          touched={touched}
                          isDisabled={isEdit}
                        />
                      </div>
                    )}
                    <div className='col-lg-3'>
                      <label>Came From</label>
                      <InputField
                        value={values?.cameFrom}
                        name='cameFrom'
                        placeholder='Came From'
                        type='text'
                      />
                    </div>
                    {/* <div className="col-lg-2 mb-2">
                      <NewSelect
                        name="cameFrom"
                        options={cameFromDDL}
                        value={values?.cameFrom}
                        label="Came From"
                        onChange={(valueOption) => {
                          setFieldValue("cameFrom", valueOption);
                        }}
                        placeholder="Came From"
                        errors={errors}
                        touched={touched}
                        isDisabled={isEdit}
                      />
                    </div> */}
                  </div>
                </div>
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

              <IViewModal
                show={isShowModal}
                onHide={() => setIsShowModal(false)}
              >
                <VehicleNoAddForm
                  setIsShowModal={setIsShowModal}
                  setVehicleManualNoDDL={setVehicleManualNoDDL}
                  setNewValues={setValues}
                  newValues={values}
                />
              </IViewModal>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
