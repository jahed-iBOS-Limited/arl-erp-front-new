import axios from "axios";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";

const initData = {
  challanNo: "",
  reason: "",
};

const CancelTransferShipping = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(`/oms/Shipment/CancelTransferChallan`, payload);
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

const CancelTransferShippingForm = ({
  singleItem,
  setOpen,
  viewBtnClickHandler,
  preValues,
}) => {
  const [loading, setLoading] = useState(false);

  // get selected business unit from store
  const {
    selectedBusinessUnit: { value: buId },
    profileData: { userId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const saveHandler = (values, cb) => {
    const payload = {
      userId: userId,
      shipmentId: singleItem?.shipmentId,
      businessUnitId: buId,
      reason: values?.reason,
    };
    CancelTransferShipping(payload, setLoading, () => {
      cb();
      viewBtnClickHandler(preValues);
      setOpen(false);
    });
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({ handleSubmit, values }) => (
          <>
            {loading && <Loading />}
            <ICustomCard
              title="Cancel Transfer Shipping"
              saveHandler={() => handleSubmit()}
            >
              <Form className="form form-label-right global-form">
                <div className="row mt-1">
                  {/* <div className="col-md-6">
                    <InputField
                      value={values?.challanNo}
                      placeholder="Challan No"
                      label="Challan No"
                      name="challanNo"
                      type="text"
                    />
                  </div> */}
                  <div className="col-md-12">
                    <InputField
                      value={values?.reason}
                      placeholder="Reason"
                      label="Reason"
                      name="reason"
                      type="text"
                    />
                  </div>
                </div>
              </Form>
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
};
export default CancelTransferShippingForm;
