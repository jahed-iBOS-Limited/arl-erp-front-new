import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import { _formatMoney } from "../../../_helper/_formatMoney";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { hasPaymentDetailsEditPermission } from "./util/paymentDetailsEditPermission";
const initData = {};
export default function DetailsViewModal({ clickedItem, landingValues }) {
  const [detailsData, setDetailsData] = useState([]);
  const { userId, employeeId } = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  const saveHandler = (values, cb) => {};
  const [, getPaymentDetails, paymentDetailsLoader] = useAxiosGet();

  const [, savePymentDetails, isSavingPaymentDetails] = useAxiosPost();

  const handleGetPaymentDetailsData = () => {
    getPaymentDetails(
      `/fino/PaymentOrReceive/GetInvoiceWisePayment?partName=GetById&businessUnitId=${landingValues?.businessUnit?.value}&fromDate=${landingValues?.fromDate}&toDate=${landingValues?.toDate}&status=${landingValues?.status?.value}&deliveryId=${clickedItem?.intDeliveryId}&customerId=${clickedItem?.intCustomerId}`,
      (data) => {
        setDetailsData(data);
      }
    );
  };

  useEffect(() => {
    if (clickedItem) {
      handleGetPaymentDetailsData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedItem]);

  const handleChangeAmountById = (autoId, amount) => {
    const rowData = [...detailsData];
    const updatedData = rowData.map((item) => {
      if (item.intAutoId === autoId) {
        return {
          ...item,
          numAmount: amount,
          isEdited: true,
        };
      } else {
        return {
          ...item,
        };
      }
    });

    setDetailsData(updatedData);
  };

  const handleSave = () => {
    const url = `/fino/PaymentOrReceive/EditInvoiceWisePaymentAmount`;
    const payload = detailsData
      .filter((i) => i.isEdited)
      .map((item) => {
        return {
          autoId: item?.intAutoId,
          deliveryId: item?.intDeliveryId,
          customerId: item?.intCustomerId,
          type: item?.strType,
          amount: Number(item?.numAmount),
          createdBy: userId,
        };
      });

    if (window.confirm("Are you sure about updating the data?")) {
      savePymentDetails(
        url,
        payload,
        (data) => {
          console.log(data);
          handleGetPaymentDetailsData();
        },
        true,
        "Updated Successfully",
        "Sorry, Could not Update Data!"
      );
    }

    console.log(detailsData);
    console.log(payload);
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
          {(paymentDetailsLoader || isSavingPaymentDetails) && <Loading />}
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
                  <div className="table-responsive">
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
                        {detailsData?.length > 0 &&
                          detailsData?.map((item, index) => (
                            <tr>
                              <td>{index + 1}</td>
                              <td>
                                {_dateFormatter(item?.dteTransactionDate)}
                              </td>
                              <td>{item?.strType}</td>
                              <td>{item?.strReference}</td>
                              <td className="text-right">
                                <InputField
                                  type="number"
                                  value={item?.numAmount}
                                  disabled={
                                    !hasPaymentDetailsEditPermission(employeeId)
                                  }
                                  onChange={(e) => {
                                    handleChangeAmountById(
                                      item?.intAutoId,
                                      e.target.value
                                    );
                                  }}
                                />
                              </td>
                            </tr>
                          ))}

                        {detailsData?.length > 0 && (
                          <tr>
                            <td colSpan="4" className="text-right">
                              <strong>Total</strong>
                            </td>
                            <td className="text-right">
                              <strong>
                                {_formatMoney(
                                  detailsData?.reduce(
                                    (acc, cur) => acc + Number(cur?.numAmount),
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
              </div>
            </Form>
          </IForm>
          <div className="d-flex justify-content-end ">
            {hasPaymentDetailsEditPermission(employeeId) && (
              <button
                style={{ marginTop: "18px", marginBottom: "20px" }}
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
                disabled={
                  detailsData.filter((i) => i.isEdited).length ? false : true
                }
              >
                Update
              </button>
            )}
          </div>
        </>
      )}
    </Formik>
  );
}
