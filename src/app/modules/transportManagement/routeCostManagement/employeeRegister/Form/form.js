import { Form, Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import { getCostCenterDDL, getDistrubutionCenterDDL } from "../helper";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";

// Validation schema
const validationSchema = Yup.object().shape({
  reference: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Reference is required"),
  expenseFor: Yup.object().shape({
    label: Yup.string().required("Expense For is required"),
    value: Yup.string().required("Expense For is required"),
  }),
  sbu: Yup.object().shape({
    label: Yup.string().required("Sbu is required"),
    value: Yup.string().required("Sbu is required"),
  }),
  costCenter: Yup.object().shape({
    label: Yup.string().required("CostCenter is required"),
    value: Yup.string().required("CostCenter is required"),
  }),
  disbursementCenter: Yup.object().shape({
    label: Yup.string().required("Disbursement Center is required"),
    value: Yup.string().required("Disbursement Center is required"),
  }),
  // country: Yup.object().shape({
  //   label: Yup.string().required("Country is required"),
  //   value: Yup.string().required("Country is required"),
  // }),
  // currency: Yup.object().shape({
  //   label: Yup.string().required("Currency is required"),
  //   value: Yup.string().required("Currency is required"),
  // }),
  paymentType: Yup.object().shape({
    label: Yup.string().required("Payment Type is required"),
    value: Yup.string().required("Payment Type is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  expenseDDL,
  sbuDDL,
  country,
  currencyDDL,
  projectDDL,
  rowDto,
  remover,
  TotalExpense,
  paymentType,
}) {
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [costCenter, setCostCenter] = useState([]);
  const [disbursement, setDisbursement] = useState([]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          country: {
            value: 18,
            label: "Bangladesh",
          },
          currency: {
            value: 141,
            label: "Taka",
          },
        }}
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
            <Form className='form form-label-right'>
              {/* Form */}
              <div className='global-form'>
                <div className='row'>
                  <div className='col-lg-3'>
                    <NewSelect
                      name='expenseFor'
                      options={expenseDDL}
                      value={values?.expenseFor}
                      label='Expense For (Employee)'
                      onChange={(valueOption) => {
                        setFieldValue("expenseFor", valueOption);
                      }}
                      placeholder='Expense For'
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className='col-lg-3'>
                    <NewSelect
                      name='sbu'
                      options={sbuDDL}
                      value={values?.sbu}
                      label='SBU'
                      onChange={(valueOption) => {
                        setFieldValue("sbu", valueOption);
                        getDistrubutionCenterDDL(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          valueOption?.value,
                          setDisbursement
                        );
                        getCostCenterDDL(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          valueOption?.value,
                          setCostCenter
                        );
                      }}
                      placeholder='SBU'
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* <div className="col-lg-3">
                    <NewSelect
                      name="country"
                      options={country}
                      value={values?.country}
                      onChange={(valueOption) => {
                        setFieldValue("country", valueOption);
                      }}
                      placeholder="Country"
                      label="Country"
                      errors={errors}
                      touched={touched}
                    />
                  </div> */}
                  {/* <div className="col-lg-3">
                    <NewSelect
                      name="currency"
                      options={currencyDDL}
                      value={values?.currency}
                      onChange={(valueOption) => {
                        setFieldValue("currency", valueOption);
                      }}
                      placeholder="Currency"
                      label="Currency"
                      errors={errors}
                      touched={touched}
                    />
                  </div> */}
                  <div className='col-lg-3'>
                    <label>Expense Period From</label>
                    <InputField
                      value={values?.experiencePeriodFrom}
                      name='experiencePeriodFrom'
                      placeholder='Expense Period From'
                      disabled
                      type='text'
                    />
                  </div>
                  <div className='col-lg-3'>
                    <label>Expense Period To</label>
                    <InputField
                      value={values?.experiencePeriodTo}
                      name='experiencePeriodTo'
                      placeholder='Expense Period To'
                      disabled
                      type='text'
                    />
                  </div>
                  <div className='col-lg-3'>
                    <NewSelect
                      name='costCenter'
                      options={costCenter}
                      value={values?.costCenter}
                      onChange={(valueOption) => {
                        setFieldValue("costCenter", valueOption);
                      }}
                      placeholder='Cost Center'
                      label='Cost Center'
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* <div className="col-lg-3">
                    <NewSelect
                      name="projectName"
                      options={projectDDL}
                      value={values?.projectName}
                      onChange={(valueOption) => {
                        setFieldValue("projectName", valueOption);
                      }}
                      placeholder="Project Name"
                      label="Project Name"
                      errors={errors}
                      touched={touched}
                    />
                  </div> */}
                  <div className='col-lg-3'>
                    <NewSelect
                      name='paymentType'
                      options={paymentType}
                      value={values?.paymentType}
                      onChange={(valueOption) => {
                        setFieldValue("paymentType", valueOption);
                      }}
                      placeholder='Payment Type'
                      label='Payment Type'
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className='col-lg-3'>
                    <NewSelect
                      name='disbursementCenter'
                      options={disbursement}
                      value={values?.disbursementCenter}
                      onChange={(valueOption) => {
                        setFieldValue("disbursementCenter", valueOption);
                      }}
                      placeholder='Disbursement Center'
                      label='Disbursement Center'
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className='col-lg-3'>
                    <label>Reference</label>
                    <InputField
                      value={values?.reference}
                      name='reference'
                      placeholder='Reference'
                      type='text'
                    />
                  </div>
                  <div className='col-lg-3'>
                    <label>Comments</label>
                    <InputField
                      value={values?.comments}
                      name='comments'
                      placeholder='Comments'
                      type='text'
                    />
                  </div>
                  <div className='col-lg-3' style={{ marginTop: "15px" }}>
                    <div
                      style={{
                        border: "1px solid gray",
                        padding: "2px",
                        width: "100%",
                      }}
                    >
                      <b>Total Expense: {TotalExpense}</b>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table */}

              <div className="table-responsive">
              <table className='table table-striped table-bordered global-table'>
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Shipment Date</th>
                    <th>Shipment Code</th>
                    <th>Partner Name</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Vehicle No</th>
                    <th>Total Cost</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rowDto &&
                    rowDto?.map((data, i) => (
                      <tr key={i + 1}>
                        <td>{i + 1}</td>
                        <td>{_dateFormatter(data.shipmentDate)}</td>
                        <td>{data.shipmentCode}</td>
                        <td>{data.partnerName}</td>
                        <td>{data.shipPointAddress}</td>
                        <td>{data.partnerAddress}</td>
                        <td>{data.vehicleNo}</td>
                        <td>{data.totalCost}</td>
                        <td className='text-center'>
                          <IDelete remover={remover} id={i} />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
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
