/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import IForm from "../../../_helper/_form";
import RFQAutoProcess from "./rfqAutoProcess";
import POAutoProcess from "./poAutoProcess";

const initData = {
  purchaseOrganization: "",
};
export default function AutoPOCalculation() {
  const [objProps, setObjprops] = useState({});

  const saveHandler = (values, cb) => {};
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      // validationSchema={{}}
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
          {/* {(loading || loader || itemTypeListLoader || categoryLoader,
          subCategoryLoader) && <Loading />} */}
          <IForm
            isHiddenBack
            isHiddenSave
            isHiddenReset
            title="Auto PO Calculation"
            getProps={setObjprops}
          >
            <Tabs
              defaultActiveKey="rfq-auto-process"
              id="uncontrolled-tab-example"
              className="mb-3"
            >
              <Tab unmountOnExit eventKey="rfq-auto-process" title="RFQ">
                <RFQAutoProcess />
              </Tab>
              <Tab unmountOnExit eventKey="po-create" title="PO Create">
                <POAutoProcess />
              </Tab>
            </Tabs>
          </IForm>
        </>
      )}
    </Formik>
  );
}
