import { Form, Formik } from "formik";
import React, { useState } from "react";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { toast } from "react-toastify";

const initData = {
  receiveDate: _todayDate(),
  receiveType: "",
  receiveAmount: "",
  reference: "",
};

export default function ReceiveEntryModal({
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
    if (!values?.receiveDate) {
      return toast.warn("Receive Date is required");
    }
    if (!values?.receiveType) {
      return toast.warn("Receive Type is required");
    }
    if (!values?.receiveAmount) {
      return toast.warn("Receive Amount is required");
    }
    if (!values?.reference) {
      return toast.warn("Reference is required");
    }
    const payload = {
      transactionDate: values?.receiveDate,
      deliveryId: clickedItem?.intDeliveryId,
      customerId: clickedItem?.intCustomerId,
      type: values?.receiveType?.label,
      amount: +values?.receiveAmount,
      reference: values?.reference,
      createdBy: profileData?.userId,
    };
    saveData(
      `/fino/PaymentOrReceive/SaveInvoiceWisePayment`,
      payload,
      () => {
        setReceiveModal(false);
        getData(landingValues);
      },
      true
    );
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
            title="Receive Payment"
            getProps={setObjprops}
          >
            <Form>
              <p>
                Customer Name: <strong>{clickedItem?.strCustomerName}</strong>
              </p>
              <p>
                Reference No: <strong>{clickedItem?.strPartnerReffNo}</strong>
              </p>
              <p>
                Challan No: <strong>{clickedItem?.strChallanNo}</strong>
              </p>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <InputField
                    type="date"
                    name="receiveDate"
                    label="Receive Date"
                    value={values?.receiveDate}
                    onChange={(e) => {
                      if (e) {
                        setFieldValue("receiveDate", e.target.value);
                      } else {
                        setFieldValue("receiveDate", "");
                      }
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="receiveType"
                    options={[
                      {
                        value: 1,
                        label: "AIT",
                      },
                      {
                        value: 2,
                        label: "Vat",
                      },
                      {
                        value: 3,
                        label: "Delivery",
                      },
                    ]}
                    value={values?.receiveType}
                    label="Receive Type"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("receiveType", valueOption);
                      } else {
                        setFieldValue("receiveType", "");
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    type="number"
                    name="receiveAmount"
                    label="Receive Amount"
                    value={values?.receiveAmount}
                    onChange={(e) => {
                      if (e) {
                        setFieldValue("receiveAmount", e.target.value);
                      } else {
                        setFieldValue("receiveAmount", "");
                      }
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    type="string"
                    name="reference"
                    label="Reference"
                    value={values?.reference}
                    onChange={(e) => {
                      if (e) {
                        setFieldValue("reference", e.target.value);
                      } else {
                        setFieldValue("reference", "");
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
