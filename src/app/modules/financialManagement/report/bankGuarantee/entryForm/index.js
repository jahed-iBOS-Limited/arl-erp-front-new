import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import Loading from "../../../../_helper/_loading";
import IForm from "../../../../_helper/_form";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import BankGuarantee from "./bankGuarantee";
import DepositRegister from "./depositRegister";

const initData = {
  item: "",
  remarks: "",
  amount: "",
  date: "",
};

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
            <div>
              {[1].includes(+typeId) ? (
                <BankGuarantee />
              ) : [2].includes(+typeId) ? (
                <DepositRegister />
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
