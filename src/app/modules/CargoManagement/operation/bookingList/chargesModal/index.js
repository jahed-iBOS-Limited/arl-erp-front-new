import React, { useEffect } from "react";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../../_helper/_loading";
import { imarineBaseUrl } from "../../../../../App";
import "./style.css";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import InputField from "../../../../_helper/_inputField";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { toast } from "react-toastify";
import { shallowEqual, useSelector } from "react-redux";
const validationSchema = Yup.object().shape({});
function ChargesModal({ rowClickData, CB }) {
  const { profileData } = useSelector(
    (state) => state?.authData || {},
    shallowEqual
  );
  const bookingRequestId = rowClickData?.bookingRequestId;
  // const [
  //   shipBookingRequestGetById,
  //   setShipBookingRequestGetById,
  //   shipBookingRequestLoading,
  // ] = useAxiosGet();
  const [, getSaveBookedRequestBilling, bookedRequestBilling] = useAxiosPost();
  const [
    shippingHeadOfCharges,
    getShippingHeadOfCharges,
    shippingHeadOfChargesLoading,
    setShippingHeadOfCharges,
  ] = useAxiosGet();

  useEffect(() => {
    if (bookingRequestId) {
      // setShipBookingRequestGetById(
      //   `${imarineBaseUrl}/domain/ShippingService/ShipBookingRequestGetById?BookingId=${bookingRequestId}`
      // );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingRequestId]);

  useEffect(() => {
    getShippingHeadOfCharges(
      `${imarineBaseUrl}/domain/ShippingService/GetShippingHeadOfCharges`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = (values, cb) => {
    const paylaod = shippingHeadOfCharges
      ?.filter((item) => item?.checked)
      .map((item) => {
        return {
          billingId:  0,
          bookingRequestId: bookingRequestId || 0,
          headOfChargeId: item?.value || 0  ,
          headOfCharges: item?.label || "",
          chargeAmount: item?.amount || 0,
          isActive: true,
          billingDate: new Date(),
          createdBy: profileData?.userId || 0,
          createdAt:  new Date(),
          updatedBy:  new Date(),
          updatedAt: profileData?.userId || 0,
        };
      });
    if (paylaod.length === 0) {
      return toast.warn("Please select at least one charge");
    }
    getSaveBookedRequestBilling(
      `${imarineBaseUrl}/domain/ShippingService/SaveBookedRequestBilling`,
      paylaod,
      CB
    );
  };

  return (
    <div className="chargesModal">
      {(bookedRequestBilling || shippingHeadOfChargesLoading) && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{}}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm();
          });
        }}
      >
        {({ errors, touched, setFieldValue, isValid, values, resetForm }) => (
          <>
            <Form className="form form-label-right">
              <div className="">
                {/* Save button add */}
                <div className="d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </div>
              {/* <div className="form-group row global-form">
                
              </div> */}
              <div className="col-lg-12">
                {" "}
                <div className="table-responsive">
                  <table className="table global-table">
                    <thead>
                      <tr>
                        <th>
                          <input
                            type="checkbox"
                            checked={
                              shippingHeadOfCharges?.length > 0
                                ? shippingHeadOfCharges?.every(
                                    (item) => item?.checked
                                  )
                                : false
                            }
                            onChange={(e) => {
                              setShippingHeadOfCharges(
                                shippingHeadOfCharges?.map((item) => {
                                  return {
                                    ...item,
                                    checked: e?.target?.checked,
                                    amount: e?.target?.checked
                                      ? item?.amount
                                      : "",
                                  };
                                })
                              );
                            }}
                          />
                        </th>
                        <th className="p-0">SL</th>
                        <th className="p-0">Attribute</th>
                        <th className="p-0">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shippingHeadOfCharges?.map((item, index) => (
                        <tr key={index}>
                          <td className="text-center align-middle">
                            <input
                              type="checkbox"
                              checked={item?.checked}
                              onChange={(e) => {
                                const copyprvData = [...shippingHeadOfCharges];
                                copyprvData[index].checked = e.target.checked;
                                copyprvData[index].amount = "";
                                setShippingHeadOfCharges(copyprvData);
                              }}
                            />
                          </td>
                          <td> {index + 1} </td>
                          <td className="align-middle">
                            <label>{item?.label}</label>
                          </td>
                          <td className="align-middle">
                            <InputField
                              value={item?.amount}
                              required={item?.checked}
                              type="number"
                              onChange={(e) => {
                                const copyprvData = [...shippingHeadOfCharges];
                                copyprvData[index].amount = e.target.value;
                                setShippingHeadOfCharges(copyprvData);
                              }}
                              name="amount"
                              min="0"
                              disabled={!item?.checked}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
}

export default ChargesModal;
