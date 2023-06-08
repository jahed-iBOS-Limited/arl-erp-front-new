import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import moment from "moment";
import IViewModal from "./../../../../_helper/_viewModal";
import InputField from "./../../../../_helper/_inputField";
import { _todayDate } from "./../../../../_helper/_todayDate";
import { createTaxLedgerDeduction, getTaxBranchDDL } from "./../helper";
import NewSelect from "./../../../../_helper/_select";

const initData = {
  vat: "",
  sd: "",
  taxBranch: "",
};

// Validation schema
// const validationSchema = Yup.object().shape({
//     vat: Yup.number()
//         .positive()
//         .min(0, "Vat must be Positive Numbers")
//         .required("Vat is required"),
//     sd: Yup.number()
//         .positive()
//         .min(0, "SD must be Positive Numbers")
//         .required("SD is required"),
//     taxBranch: Yup.object().shape({
//         label: Yup.string().required("Tax Branch is required"),
//         value: Yup.string().required("Tax Branch is required"),
//     }),

// });

export default function RefundModal({
  parentValues,
  setLoading,
  getTaxLedgerSdVat,
  setTaxLedgerSdVat,
  show,
  onHide,
  profileData,
  selectedBusinessUnit,
  setRefundModal,
}) {
  const [taxBranchDDL, setTaxBranchDDL] = useState([]);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getTaxBranchDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setTaxBranchDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

  const saveHandler = async (values, cb) => {
    const payload = {
      id: 0,
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      taxBranchId: values?.taxBranch?.value,
      sd: values?.sd,
      vat: values?.vat,
      isActive: true,
      transactionDate: _todayDate(),
      serverDateTime: _todayDate(),
    };
    const customCallback = () => {
      setRefundModal(false);
      getTaxLedgerSdVat(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        parentValues?.taxBranch?.value,
        moment(parentValues?.mushakDate).format("M"),
        setTaxLedgerSdVat,
        setLoading
      );
      cb();
    };
    createTaxLedgerDeduction(payload, customCallback);
  };

  return (
    <div>
      <IViewModal
        show={show}
        onHide={() => {
          onHide();
        }}
        title={"Refund"}
        btnText="Close"
      >
        <Formik
          enableReinitialize={true}
          initialValues={{ ...initData }}
          validationSchema={Yup.object().shape({
            vat: Yup.number()
              .positive()
              .min(0, "Vat must be Positive Numbers")
              .required("Vat is required"),
            sd: Yup.number()
              .positive()
              .min(0, "SD must be Positive Numbers")
              .required("SD is required"),
            taxBranch: Yup.object().shape({
              label: Yup.string().required("Tax Branch is required"),
              value: Yup.string().required("Tax Branch is required"),
            }),
          })}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            saveHandler(values, resetForm);
            // onSubmit(values);
          }}
        >
          {({
            errors,
            touched,
            setFieldValue,
            isValid,
            values,
            handleSubmit,
            resetForm,
          }) => (
            <>
              <Form>
                <div className="text-right">
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: "14px" }}
                    type="submit"
                  >
                    Save
                  </button>
                </div>
                <div className="global-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <InputField
                        value={values?.vat}
                        label="Vat"
                        type="number"
                        name="vat"
                        placeholder="Vat"
                        onChange={(e) => {
                          setFieldValue("vat", +e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.sd}
                        label="SD"
                        type="number"
                        name="sd"
                        placeholder="SD"
                        onChange={(e) => {
                          setFieldValue("sd", +e.target.value);
                        }}
                      />
                    </div>

                    <div className="col-lg-3">
                      <NewSelect
                        name="taxBranch"
                        options={taxBranchDDL}
                        value={values?.taxBranch}
                        label="Select Tax Branch"
                        onChange={(valueOption) => {
                          setFieldValue("taxBranch", valueOption);
                        }}
                        placeholder="Select Tax Branch"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </IViewModal>
    </div>
  );
}
