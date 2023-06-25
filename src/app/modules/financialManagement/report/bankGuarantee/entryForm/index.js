import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import BankGuarantee from "./bankGuarantee";
import DepositRegister from "./depositRegister";
import { initData } from "../helper";
import "../style.css";

const validationSchema = Yup.object().shape({
  item: Yup.object()
    .shape({
      label: Yup.string().required("Item is required"),
      value: Yup.string().required("Item is required"),
    })
    .typeError("Item is required"),

  remarks: Yup.string().required("Remarks is required"),
  amount: Yup.number().required("Amount is required"),
  date: Yup.date().required("Date is required"),
});

export default function BankGuaranteeEntry() {
  const [objProps, setObjprops] = useState({});
  const { entryType, typeId } = useParams();
  const [attachmentFile, setAttachmentFile] = useState("");

  console.log("entryType", entryType);

  const saveHandler = (values, cb) => {
    alert("Working...");
  };
  return (
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
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {false && <Loading />}
          <IForm
            title={`${entryType?.toUpperCase()} BANK GUARANTEE`}
            getProps={setObjprops}
          >
            <div className="bank-guarantee-entry">
              {[1].includes(+typeId) ? (
                <BankGuarantee
                  values={values}
                  setFieldValue={setFieldValue}
                  errors={errors}
                  touched={touched}
                />
              ) : [2].includes(+typeId) ? (
                <DepositRegister
                  values={values}
                  setFieldValue={setFieldValue}
                  errors={errors}
                  touched={touched}
                  attachmentFile={attachmentFile}
                  setAttachmentFile={setAttachmentFile}
                />
              ) : null}
            </div>
            <Form>
              <button
                type="submit"
                style={{ display: "none" }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={objProps?.resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
