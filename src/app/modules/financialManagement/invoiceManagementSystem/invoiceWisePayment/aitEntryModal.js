import { Form, Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { toast } from "react-toastify";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";

const initData = {
  aitAmount: "",
};

export default function AitEntryModal({
  clickedItem,
  getData,
  landingValues,
  setReceiveModal,
}) {
  const [objProps, setObjprops] = useState({});
  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [, saveData, saveDataLoader] = useAxiosPost();

  const saveHandler = (values, cb) => {
    if (!values?.aitAmount) {
      return toast.warn("AIT Amount is required");
    }
    const payload = {
      numAitAmount: +values?.aitAmount,
    };
    // saveData(
    //   `/fino/PaymentOrReceive/SaveInvoiceWisePayment`,
    //   payload,
    //   () => {
    //     setReceiveModal(false);
    //     getData(landingValues);
    //   },
    //   true
    // );
  };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
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
          {saveDataLoader && <Loading />}
          <IForm
            isHiddenBack={true}
            title="Entry AIT Amount"
            getProps={setObjprops}
          >
            <Form>
              <div className="row">
                <div className="col-lg-6">
                  <p>
                    Customer Name:{" "}
                    <strong>{clickedItem?.strCustomerName}</strong>
                  </p>
                  <p>
                    Reference No:{" "}
                    <strong>{clickedItem?.strPartnerReffNo}</strong>
                  </p>
                  <p>
                    Challan No: <strong>{clickedItem?.strChallanNo}</strong>
                  </p>
                </div>
                <div className="col-lg-6">
                  <p>
                    Delivery Amount:{" "}
                    <strong>{clickedItem?.numDeliveryAmount}</strong>
                  </p>
                  <p>
                    Pending Amount:{" "}
                    <strong>{clickedItem?.numDeliveryAmountPending}</strong>
                  </p>
                  <p>
                    Pending Vat:{" "}
                    <strong>{clickedItem?.numVatAmountPending}</strong>
                  </p>
                  <p>
                    Pending AIT:{" "}
                    <strong>{clickedItem?.numTaxAmountPending}</strong>
                  </p>
                </div>
              </div>

              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <InputField
                    type="number"
                    name="aitAmount"
                    label="AIT Amount"
                    value={values?.aitAmount}
                    onChange={(e) => {
                      if (e) {
                        setFieldValue("aitAmount", e.target.value);
                      } else {
                        setFieldValue("aitAmount", "");
                      }
                    }}
                  />
                </div>
              </div>

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
