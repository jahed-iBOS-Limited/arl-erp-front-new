import React from "react";
import IViewModal from "../../../../_helper/_viewModal";
import { Formik, Form } from "formik";
import { PurchaseOrderReport } from './../../../../procurement/purchase-management/purchaseOrder/report/tableHeader';
const initData = {};

export default function PurchaseOrderView({
  show,
  onHide,
  gridRowItem,
  gridData,
}) {
  return (
    <div className="Clear Invoice View">
      <IViewModal
        show={show}
        onHide={onHide}
        title={""}
        style={{ fontSize: "1.2rem !important" }}
        btnText="Close"

      >
        <div>
          <Formik enableReinitialize={true} initialValues={initData}>
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
                <Form className="form form-label-right paymentRequestPurOrder">
                  <PurchaseOrderReport/>
                </Form>
              </>
            )}
          </Formik>
        </div>
      </IViewModal>
    </div>
  );
}
