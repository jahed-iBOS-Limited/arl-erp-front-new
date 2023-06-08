/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { Formik } from "formik";
import { Form } from "formik";
import InputField from "../../../_helper/_inputField";
import ICustomCard from "../../../_helper/_customCard";
import "./style.css";
import * as Yup from "yup";
// React Pivote Table module Import
import Loading from "../../../_helper/_loading";
import { CreateCustomerPoint, getCustomerInitPointAction } from "./helper";

const initData = {
  amount: 0,
  point: 0,
};

// Validation schema
const validationSchema = Yup.object().shape({
  amount: Yup.number().required("Amount is Required"),
  point: Yup.number().required("Point is Required"),
});

function CustomerPoint() {
  const [loading, setLoading] = useState(false);
  const [pointData, setPointData] = useState({});


  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  useEffect(()=>{
    getCustomerInitPointAction(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setPointData
    )
  },[])
  const saveHandler = async (values, cb) => {
    const payload = {
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      amount: +values?.amount || 0,
      point: +values?.point || 0,
      actionBy: profileData?.userId,
    };

    CreateCustomerPoint(payload,setLoading)
  };

  return (
    <>
      <ICustomCard title="Customer Point">
        {loading && <Loading />}
        <Formik
          enableReinitialize={true}
          validationSchema={validationSchema}
          initialValues={{...initData, ...pointData}}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            saveHandler(values);
          }}
        >
          {({ values, handleSubmit, isValid, errors }) => (
            <>
              <Form>
                <div className="row global-form">
                  <div className="col-lg-3">
                    <label>Amount</label>
                    <InputField
                      value={values?.amount}
                      name="amount"
                      placeholder="amount"
                      type="number"
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Point</label>
                    <InputField
                      value={values?.point}
                      name="point"
                      placeholder="point"
                      type="number"
                    />
                  </div>
                  <div style={{ marginTop: "18px" }} className="col-lg">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSubmit}
                      disabled={!isValid}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}

export default CustomerPoint;
