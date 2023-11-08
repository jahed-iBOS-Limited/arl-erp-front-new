import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _formatMoney } from "../../../_helper/_formatMoney";
const initData = {};
export default function DetailsViewModal({ clickedItem, landingValues }) {
  const saveHandler = (values, cb) => {};
  const [
    paymentDetails,
    getPaymentDetails,
    paymentDetailsLoader,
  ] = useAxiosGet();
  useEffect(() => {
    if (clickedItem) {
      getPaymentDetails(
        `/fino/PaymentOrReceive/GetInvoiceWisePayment?partName=GetById&businessUnitId=${landingValues?.businessUnit?.value}&fromDate=${landingValues?.fromDate}&toDate=${landingValues?.toDate}&status=${landingValues?.status?.value}&deliveryId=${clickedItem?.intDeliveryId}&customerId=${clickedItem?.intCustomerId}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedItem]);

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
          {paymentDetailsLoader && <Loading />}
          <IForm
            title="Payment Receive Details"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return <div></div>;
            }}
          >
            <Form>
              <div>
                <p>
                  Customer Name: <strong>{clickedItem?.strCustomerName}</strong>
                </p>
                <p>
                  Reference No: <strong>{clickedItem?.strPartnerReffNo}</strong>
                </p>
                <p>
                  Challan No: <strong>{clickedItem?.strChallanNo}</strong>
                </p>
                <div className="mt-5">
                  <table className="table table-striped table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>Sl</th>
                        <th>Receive Date</th>
                        <th>Receive Type</th>
                        <th>Reference No</th>
                        <th>Received Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentDetails?.length > 0 &&
                        paymentDetails?.map((item, index) => (
                          <tr>
                            <td>{index + 1}</td>
                            <td>{_dateFormatter(item?.dteTransactionDate)}</td>
                            <td>{item?.strType}</td>
                            <td>{item?.strReference}</td>
                            <td className="text-right">
                              {_formatMoney(item?.numAmount)}
                            </td>
                          </tr>
                        ))}

                      {paymentDetails?.length > 0 && (
                        <tr>
                          <td colSpan="4" className="text-right">
                            <strong>Total</strong>
                          </td>
                          <td className="text-right">
                            <strong>
                              {_formatMoney(
                                paymentDetails?.reduce(
                                  (acc, cur) => acc + cur?.numAmount,
                                  0
                                )
                              )}
                            </strong>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
