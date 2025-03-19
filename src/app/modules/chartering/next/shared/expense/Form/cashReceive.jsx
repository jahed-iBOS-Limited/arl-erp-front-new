import React from "react";
import { Formik } from "formik";
import { editOrCashReceive, getAdditionalCostById } from "../helper";
import { _todayDate } from "../../../../_chartinghelper/_todayDate";
import Loading from "../../../../_chartinghelper/loading/_loading";
import FormikInput from "../../../../_chartinghelper/common/formikInput";

export default function CashReceiveForm({
  title,
  singleRow,
  setShow,
  setRowData,
}) {
  const [loading, setLoading] = React.useState(false);
  const saveHandler = (values) => {
    const payload = {
      additionalCost: singleRow?.additionalCost,
      voyageId: singleRow?.voyageId,
      voyageName: singleRow?.voyageName,
      vesselId: singleRow?.vesselId,
      vesselName: singleRow?.vesselName,
      voyageTypeId: singleRow?.voyageTypeId,
      voyageTypeName: singleRow?.voyageTypeName,
      costId: singleRow?.costId,
      costName: singleRow?.costName,
      costAmount: 0,
      totalAmount: values?.totalAmount,
      advanceAmount: singleRow?.advanceAmount,
      dueAmount: 0,
      partnerId: singleRow?.partnerId,
      partnerName: singleRow?.partnerName,
      paidAmount:
        values?.totalAmount > values?.advanceAmount
          ? Number(values?.totalAmount) - Number(values?.advanceAmount)
          : 0,
      entryDate: _todayDate(),
      isReceive: values?.totalAmount < values?.advanceAmount,
      lastTransactionDate: values?.transactionDate,
      receiveAmount:
        values?.totalAmount < values?.advanceAmount
          ? Number(values?.advanceAmount) - Number(values?.totalAmount)
          : 0,
    };
    editOrCashReceive([payload], setLoading, () => {
      getAdditionalCostById(
        singleRow?.vesselId,
        singleRow?.voyageId,
        setRowData,
        setLoading,
        (data) => {}
      );
      setShow(false);
    });
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...singleRow,
          receiveAmount: "",
          transactionDate: _todayDate(),
        }}
        // validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <>
            {loading && <Loading />}
            <form className="marine-form-card">
              <div className="marine-form-card-heading">
                <p>{title}</p>
              </div>
              <div className="marine-form-card-content">
                <div className="row">
                  <div className="col-lg-3">
                    <label>Advance Amount</label>
                    <FormikInput
                      value={values?.advanceAmount}
                      name="advanceAmount"
                      placeholder="Advance Amount"
                      type="number"
                      errors={errors}
                      touched={touched}
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Final Amount</label>
                    <FormikInput
                      value={values?.totalAmount}
                      name="totalAmount"
                      placeholder="Final Amount"
                      type="number"
                      errors={errors}
                      touched={touched}
                      onChange={(e) => {
                        setFieldValue("totalAmount", e?.target?.value);
                        if (e?.target?.value < values?.advanceAmount) {
                          setFieldValue(
                            "receiveOrPayAmount",
                            Number(values?.advanceAmount) -
                              Number(e?.target?.value)
                          );
                        } else if (e?.target?.value > values?.advanceAmount) {
                          setFieldValue(
                            "receiveOrPayAmount",
                            Number(e?.target?.value) -
                              Number(values?.advanceAmount)
                          );
                        } else {
                          setFieldValue("receiveOrPayAmount", 0);
                        }
                      }}
                    />
                  </div>

                  {values?.totalAmount && (
                    <div className="col-lg-3">
                      <label>
                        {`${
                          values?.totalAmount > values?.advanceAmount
                            ? "Payable "
                            : values?.totalAmount < values?.advanceAmount
                            ? "Receivable "
                            : "Payable/Receivable "
                        }`}
                        Amount
                      </label>
                      <FormikInput
                        value={values?.receiveOrPayAmount}
                        name="receiveOrPayAmount"
                        placeholder="Payable/Receivable  Amount"
                        type="number"
                        errors={errors}
                        touched={touched}
                        disabled={true}
                      />
                    </div>
                  )}

                  <div className="col-lg-3">
                    <label>Transaction Date</label>
                    <FormikInput
                      value={values?.transactionDate}
                      name="transactionDate"
                      placeholder="Transaction Date"
                      type="date"
                      errors={errors}
                      touched={touched}
                      // disabled={true}
                    />
                  </div>

                  {values?.totalAmount && (
                    <div className="col-lg-3 mt-3">
                      <button
                        className="btn btn-primary px-3 py-2"
                        type="button"
                        onClick={() => {
                          saveHandler(values);
                        }}
                        disabled={!values?.totalAmount}
                      >
                        {`${
                          values?.totalAmount > values?.advanceAmount
                            ? "Pay"
                            : values?.totalAmount < values?.advanceAmount
                            ? "Receive"
                            : "Save"
                        }`}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </>
        )}
      </Formik>
    </>
  );
}
