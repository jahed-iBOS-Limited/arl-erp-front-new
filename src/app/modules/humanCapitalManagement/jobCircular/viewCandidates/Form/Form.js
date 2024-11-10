import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { IInput } from "../../../../_helper/_input";
import NewSelect from "../../../../_helper/_select";
import { getEmployeeNameDDL, getLoanTypeDDL } from "../helper";
import JoditEditor from "jodit-react";
import IView from "../../../../_helper/_helperIcons/_view";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import { useDispatch } from "react-redux";

// Validation schema
const LoanApplicationSchema = Yup.object().shape({
  employeeName: Yup.object().shape({
    label: Yup.string().required("Employee Name is required"),
    value: Yup.string().required("Employee Name is required"),
  }),
  loanType: Yup.object().shape({
    label: Yup.string().required("Loan Type is required"),
    value: Yup.string().required("Loan Type is required"),
  }),
  loanAmount: Yup.number()
    .min(0, "Minimum 0 range")
    .required("Loan Amount is required"),
  numberOfInstallment: Yup.number()
    .min(0, "Minimum 0 range")
    .required("Number Of Installmentis required"),
  installmentAmount: Yup.number()
    .min(0, "Minimum 0 range")
    .required("Installment Amountis required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  profileData,
  selectedBusinessUnit,
  isEdit,
  setOpen,
}) {
  const [employeeNameDDl, setemployeeNameDDl] = useState([]);
  const [loanTypeDDl, setLoanTypeDDl] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getEmployeeNameDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setemployeeNameDDl
      );
      getLoanTypeDDL(setLoanTypeDDl);
    }
  }, [profileData, selectedBusinessUnit]);

  const [content, setContent] = useState("");

  const config = {
    toolbarSticky: true,
    readonly: false, // all options from https://xdsoft.net/jodit/doc/
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={LoanApplicationSchema}
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
            {console.log("Values =>", values)}
            <div className="row">
              <div className="col-lg-12">
                <div
                  className={"global-form"}
                  style={{ paddingBottom: "10px" }}
                >
                  <Form className="form form-label-right addCircular">
                    <div className="col-lg-12" style={{ marginTop: "10px" }}>
                      {/* <label className="card-label">Job Title</label> */}
                      <IInput
                        value={values?.title || ""}
                        label="Job Title"
                        placeholder="ok"
                        name="title"
                        type="text"
                      />
                    </div>

                    <button
                      onClick={() => setOpen(true)}
                      type="button"
                      className="btn btn-primary ml-2 customUploadBtn"
                    >
                      {/* Upload Description as Image (optional) */}
                      Upload Circular (optional)
                    </button>

                    {isEdit && values?.jobImagePath && (
                      <div
                        onClick={() => {
                          dispatch(
                            getDownlloadFileView_Action(values?.jobImagePath)
                          );
                        }}
                        className="custom_viewBtn d-inline-block btn btn-primary ml-2 customUploadBtn"
                      >
                        <IView clickHandler={() => {}} />
                      </div>
                    )}

                    <div className="col-lg-12" style={{ marginTop: "10px" }}>
                      <label>Job Description</label>
                      <JoditEditor
                        value={values?.description || ""}
                        config={config}
                        tabIndex={1} // tabIndex of textarea
                        onBlur={(newContent) =>
                          setFieldValue("description", newContent)
                        } // preferred to use only this option to update the content for performance reasons
                        onChange={(newContent) => {}}
                      />
                    </div>

                    {/* <div className="form-group row">
                      <div className="col-lg-4">
                        <label>Employee Name</label>
                        <NewSelect
                          name="employeeName"
                          // options={employeeNameDDl || []}
                          options={employeeNameDDl.length > 0 ? employeeNameDDl : [{value:"",label:"Loading...",isDisabled:true}]}
                          value={values?.employeeName}
                          onChange={(valueOption) => {
                            setFieldValue("employeeName", valueOption);
                          }}
                          errors={errors}
                          touched={touched}
                          isDisabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-4">
                        <label>Loan Type</label>
                        <NewSelect
                          name="loanType"
                          options={loanTypeDDl || []}
                          value={values?.loanType}
                          onChange={(valueOption) => {
                            setFieldValue("loanType", valueOption);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-4">
                        <IInput
                          value={values?.loanAmount}
                          label="Loan Amount"
                          name="loanAmount"
                          type="number"
                          min="0"
                        />
                      </div>
                      <div className="col-lg-4 mt-2">
                        <span style={{ fontWeight: "bold" }}>
                          Designation:
                          {values?.employeeName?.employeeInfoDesignation}
                        </span>
                      </div>
                      <div className="col-lg-4 mt-2">
                        <span style={{ fontWeight: "bold" }}>
                          Department:{" "}
                          {values?.employeeName?.employeeInfoDepartment}
                        </span>
                      </div>
                      <div className="col-lg-4 mt-2">
                        <span style={{ fontWeight: "bold" }}>
                          Unit:{values?.employeeName?.employeeBusinessUnit}
                        </span>
                      </div>
                      <div className="col-lg-4">
                        <IInput
                          value={values?.numberOfInstallment}
                          label="Number of Installment"
                          name="numberOfInstallment"
                          type="number"
                          onChange={(e) => {
                            setFieldValue(
                              "numberOfInstallment",
                              e.target.value
                            );
                            setFieldValue(
                              "installmentAmount",
                              +values?.loanAmount / e.target.value
                            );
                          }}
                          min="0"
                        />
                      </div>
                      <div className="col-lg-4">
                        <IInput
                          value={values?.installmentAmount}
                          label="Installment Amount"
                          name="installmentAmount"
                          type="number"
                          min="0"
                          disabled={isEdit}
                        />
                      </div>
                      {values?.loanType?.value === 4 && (
                        <div className="col-lg-4">
                          <IInput
                            value={values?.strReferenceNo}
                            label="Reference No"
                            name="strReferenceNo"
                            type="text"
                          />
                        </div>
                      )}
                      {values?.loanType?.value === 7 && (
                        <div className="col-lg-4">
                          <IInput
                            value={values?.strReferenceNo}
                            label="Reference No"
                            name="strReferenceNo"
                            type="text"
                          />
                        </div>
                      )}
                    </div> */}

                    <button
                      type="submit"
                      style={{ display: "none" }}
                      ref={btnRef}
                      onSubmit={() => handleSubmit()}
                    ></button>

                    <button
                      type="reset"
                      style={{ display: "none" }}
                      ref={resetBtnRef}
                      onSubmit={() => resetForm(initData)}
                    ></button>
                  </Form>
                </div>
              </div>
            </div>
          </>
        )}
      </Formik>
    </>
  );
}
