import React, { useState } from "react";
import IViewModal from "../../../../_helper/_viewModal";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "./../../../../_helper/_inputField";
import { _todayDate } from "./../../../../_helper/_todayDate";
import { useSelector, shallowEqual } from "react-redux";
import Loading from "./../../../../_helper/_loading";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../../../_metronic/_partials/controls";
import { CreateAdvanceForSupplier } from "../helper";
// Validation schema
const validationSchema = Yup.object().shape({
  amount: Yup.number()
    .min(1, "Minimum 1 symbol")
    .required("Amouont is required")
    .typeError("Maximum 100 symbols"),
});

const initData = {
  id: undefined,
  amount: "",
  narration: "",
};

export default function AdvanceCreateModel({
  show,
  onHide,
  gridData,
  purchaseInvoiceValues,
}) {
  const [isDisabled, setDisabled] = useState(false);
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const saveHandler = (values, cb) => {
    const payload = {
      supplierAdvanceId: 0,
      pocode: purchaseInvoiceValues?.purchaseOrder?.intPurchaseOrderNumber,
      poid: purchaseInvoiceValues?.purchaseOrder?.intPurchaseOrderId,
      advanceDate: _todayDate(),
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      amount: +values?.amount || 0,
      remarks: values?.narration || 0,
      billId: 0,
      plantId: purchaseInvoiceValues?.purchaseOrder?.plantId,
      actionBy: profileData?.userId,
    };
    CreateAdvanceForSupplier(payload, cb, setDisabled);
  };
  return (
    <div className="crete-Advance">
      <IViewModal
        show={show}
        onHide={onHide}
        // title={"Crete Advance"}
        style={{ fontSize: "1.2rem !important" }}
        btnText="Close"
      >
        <>
          {isDisabled && <Loading />}
          <Formik
            enableReinitialize={true}
            initialValues={{
              ...initData,
            }}
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
              errors,
              touched,
              setFieldValue,
              isValid,
            }) => (
              <div className={""}>
                <Card>
                  {true && <ModalProgressBar />}
                  <CardHeader title={"Crete Advance"}>
                    <CardHeaderToolbar>
                      <button
                        onClick={handleSubmit}
                        className="btn btn-primary ml-2"
                        type="submit"
                      >
                        Save
                      </button>
                    </CardHeaderToolbar>
                  </CardHeader>
                  <CardBody>
                    <Form className="form form-label-right">
                      <div className="row global-form global-form-custom pb-2">
                        <div className="col-lg-3">
                          <label>Amount</label>
                          <InputField
                            value={values?.amount}
                            name="amount"
                            placeholder="Amount"
                            type="number"
                          />
                        </div>
                        <div className="col-lg-3">
                          <label>Narration</label>
                          <InputField
                            value={values?.narration}
                            name="narration"
                            placeholder="Narration"
                            type="text"
                          />
                        </div>
                        <div className="col-lg-2 offset-lg-4 d-flex justify-content-center align-item-center">
                          Total Amount: <b> </b>
                        </div>
                      </div>
                      <div className="table-responsive">
                        <table className="table table-striped table-bordered mt-3 global-table">
                          <thead>
                            <tr>
                              <th style={{ width: "25px" }}>Sl</th>
                              <th style={{ width: "25px" }}>Date</th>
                              <th style={{ width: "25px" }}>Amount</th>
                              <th style={{ width: "25px" }}>
                                Is Bill Register
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {gridData?.map((item, index) => (
                              <tr key={index}>
                                <td>{item?.sl}</td>
                                <td>{item?.sl}</td>
                                <td>{item?.sl}</td>
                                <td>{item?.sl}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </div>
            )}
          </Formik>
        </>
      </IViewModal>
    </div>
  );
}
