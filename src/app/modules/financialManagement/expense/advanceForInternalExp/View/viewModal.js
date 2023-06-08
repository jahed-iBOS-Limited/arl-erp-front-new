import React, { useEffect, useState } from "react";
import IViewModal from "../../../../_helper/_viewModal";
import { Form, Formik } from "formik";
import Select from "react-select";
import { IInput } from "../../../../_helper/_input";
import customStyles from "../../../../selectCustomStyle";
import { _todayDate } from "../../../../_helper/_todayDate";
import { singleDataById } from "../helper";

const initData = {
  comments: "",
  numRequestedAmount: "",
  dueDate: _todayDate(),
  requestedEmp: "",
  paymentType: "",
  advExpCategoryName: "",
  disbursementCenterName: "",
  SBU: "",
};

export default function ViewForm({ id, show, onHide }) {

 
  const [singleData, setSingleData] = useState("");

  useEffect(() => {
    if (id) {
      singleDataById(
        id,

        setSingleData
      );
    }
  }, [id]);

  
  return (
    <div className="adjustment-journal-modal">
      <IViewModal
        show={show}
        onHide={onHide}
        isShow={false}
        title={
          "Advance Internal Expense"
        }
        style={{ fontSize: "1.2rem !important" }}
      >
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
                    <div className="col-lg-4">
                      <div className="row bank-journal bank-journal-custom bj-right">
                        {/* ///requested employee */}

                        <div className="col-lg-6 pl pr-1 mb-2">
                          <label>Request For Employee</label>
                          <Select 
                            value={values?.requestedEmp}
                            isSearchable={true}
                            name="requestedEmp"
                            styles={customStyles}
                            placeholder="EMP"
                            isDisabled = {true}
                          />
                        </div>

                        <div className="col-lg-6 pl pr-1 mb-2">
                          <label>Select SBU</label>
                          <Select 
                            value={values?.SBU}
                            isSearchable={true}
                            name="SBU"
                            styles={customStyles}
                            placeholder="SBU"
                            isDisabled = {true}
                          />
                        </div>

                        {/* ////advExpCategoryName//// */}

                        <div className="col-lg-6 pl pr-1 mb-2">
                          <label>Select Category</label>
                          <Select
                            value={values?.advExpCategoryName}
                            isSearchable={true}
                            name="advExpCategoryName"
                            styles={customStyles}
                            isDisabled = {true}
                          />
                        </div>

                        {/* /////REQUESTED AMOUNT ///// */}

                        <div className="col-lg-6 pl pr-1 mb-2 disable-border disabled-feedback border-gray">
                          <IInput
                            value={values.numRequestedAmount}
                            label="Requested Amount"
                            name="numRequestedAmount"
                            min="0"
                            type="number"
                            disabled = {true}
                          />
                        </div>

                        {/* ////DUE DATE ////// */}

                        <div className="col-lg-6 pl-date pr pl-1 mb-2 bank-journal-date border-gray">
                          <IInput
                            value={values.dueDate}
                            label="Due Date"
                            name="dueDate"
                            type="date"
                            disabled = {true}
                          />
                        </div>

                        {/* ////  PAYMENT TYPE ////// */}

                        <div className="col-lg-6 pl pr-1 mb-2">
                          <label>Select Payment Type</label>
                          <Select
                            value={values?.paymentType}
                            isSearchable={true}
                            name="paymentType"
                            styles={customStyles}
                            isDisabled = {true}
                          />
                        </div>

                        {/* ////  DUSBURSEMENT CENTER ////// */}

                        <div className="col-lg-6 pl pr-1 mb-2">
                          <label>Select Disbursement Center</label>
                          <Select
                            value={values?.disbursementCenterName}
                            isSearchable={true}
                            name="disbursementCenterName"
                            styles={customStyles}
                            isDisabled = {true}
                          />
                        </div>
                        <div className="col-lg-6 pl pr-1 mb-2">
                          <label>Expense Group</label>
                          <Select
                            value={values?.expenseGroup}
                            isSearchable={true}
                            name="expenseGroup"
                            styles={customStyles}
                            isDisabled = {true}
                          />
                        </div>

                        {/* ////  advExpCategoryName ////// */}

                        <div className="col-lg-6 pl pr mb-2 h-narration border-gray">
                          <IInput
                            value={values.comments}
                            label="Comments"
                            name="comments"
                            disabled = {true}
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
      </IViewModal>
    </div>
  );
}
