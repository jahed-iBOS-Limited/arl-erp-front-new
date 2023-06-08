import React from "react";
import customStyles from "./../../../../selectCustomStyle";
import { Form, Formik } from "formik";
import { _todayDate } from "./../../../../_helper/_todayDate";
import Select from "react-select";
import InputField from './../../../../_helper/_inputField';

const initData = {
  branchName: "",
  branchAddress: "",
  depositeType: "",
  depositAmount: "",
  depositDate: _todayDate(),
  challanNo: "",
  challanDate: _todayDate(),
  instrumentNo: "",
  instrumentDate: _todayDate(),
  bankName: "",
  bankBranch: "",
  divisionName: "",
  districtName: "",
  depositorName: "",
};
function TresuaryDepositViewModal({ singleData, id }) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={id ? singleData : initData}
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
            {/* {setInitValue(values,setFieldValue)} */}
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-12">
                  <div className="row global-form my-4">
                    {/* ///requested employee */}
                    <div className="col-lg-3">
                      <label>Branch Name</label>
                      <Select
                        value={values?.branchName}
                        isSearchable={true}
                        name="branchName"
                        styles={customStyles}
                        placeholder="branchName"
                        isDisabled={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Branch Address</label>
                      <InputField
                        value={values.branchAddress}
                        name="branchAddress"
                        placeholder="Branch Address"
                        type="text"
                        disabled={true}
                      />
                    </div>

                    <div className="col-lg-3">
                      <label>Deposite Type</label>
                      <Select
                        value={values?.depositeType}
                        isSearchable={true}
                        name="depositeType"
                        styles={customStyles}
                        placeholder="depositeType"
                        isDisabled={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Deposit Amount</label>
                      <InputField
                        value={values.depositAmount}
                        name="depositAmount"
                        placeholder="Deposit Amount"
                        min="0"
                        type="number"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Due Date</label>
                      <InputField
                        value={values.depositDate}
                        name="depositDate"
                        placeholder="Deposit Date"
                        type="date"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Challan No</label>
                      <InputField
                        value={values.challanNo}
                        name="challanNo"
                        placeholder="Challan No"
                        type="text"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Challan Date</label>
                      <InputField
                        value={values.challanDate}
                        name="challanDate"
                        placeholder="Challan Date"
                        type="date"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Instrument No</label>
                      <InputField
                        value={values.instrumentNo}
                        name="instrumentNo"
                        placeholder="Instrument No"
                        type="text"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Instrument Date</label>
                      <InputField
                        value={values.instrumentDate}
                        name="instrumentDate"
                        placeholder="Instrument Date"
                        type="date"
                        disabled={true}
                      />
                    </div>

                    <div className="col-lg-3">
                      <label>Bank Name</label>
                      <Select
                        value={values?.bankName}
                        isSearchable={true}
                        name="bankName"
                        styles={customStyles}
                        isDisabled={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Bank Branch</label>
                      <Select
                        value={values?.bankBranch}
                        isSearchable={true}
                        name="bankBranch"
                        styles={customStyles}
                        isDisabled={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Depositor Name</label>
                      <Select
                        value={values?.depositorName}
                        isSearchable={true}
                        name="depositorName"
                        styles={customStyles}
                        isDisabled={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Designation</label>
                      <InputField
                        value={values?.designation}
                        name="designation"
                        placeholder="Designation"
                        type="text"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Description</label>
                      <InputField
                        value={values?.description}
                        name="description"
                        placeholder="Description"
                        type="text"
                        disabled={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

export default TresuaryDepositViewModal;
