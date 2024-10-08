import React, { useEffect } from "react";
import Loading from "../../../_helper/_loading";
import ICustomCard from "../../../_helper/_customCard";
import { Formik } from "formik";
import * as Yup from "yup";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { imarineBaseUrl } from "../../../../App";
import IView from "../../../_helper/_helperIcons/_view";
import IDelete from "../../../_helper/_helperIcons/_delete";
import moment from "moment";
const validationSchema = Yup.object().shape({});
function BookingList() {
  const [
    shipBookingReqLanding,
    getShipBookingReqLanding,
    bookingReqLandingLoading,
  ] = useAxiosGet();

  useEffect(() => {
    getShipBookingReqLanding(
      `${imarineBaseUrl}/domain/ShippingService/GetShipBookingRequestLanding?shipperId=1`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(shipBookingReqLanding, "shipBookingReqLanding");
  return (
    <ICustomCard title="Booking List">
      <>
        <Formik
          enableReinitialize={true}
          initialValues={{
            strCardNumber: "",
            shipment: "",
            entryCode: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {}}
        >
          {({ errors, touched, setFieldValue, isValid, values, resetForm }) => (
            <>
              {bookingReqLandingLoading && <Loading />}
              {/* <div className="row global-form"></div> */}
              <div className="col-lg-12">
                <div className="table-responsive">
                  <table className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th
                          style={{
                            minWidth: "100px",
                          }}
                        >
                          Booking No
                        </th>
                        <th
                          style={{
                            minWidth: "150px",
                          }}
                        >
                          Contact No
                        </th>
                        <th
                          style={{
                            minWidth: "150px",
                          }}
                        >
                          Shipper Name
                        </th>
                        <th
                          style={{
                            minWidth: "150px",
                          }}
                        >
                          Book Date
                        </th>
                        <th
                          style={{
                            minWidth: "150px",
                          }}
                        >
                          Email
                        </th>
                        <th
                          style={{
                            minWidth: "150px",
                          }}
                        >
                          Country
                        </th>
                        <th
                          style={{
                            minWidth: "150px",
                          }}
                        >
                          Delivery Port
                        </th>
                        <th
                          style={{
                            minWidth: "150px",
                          }}
                        >
                          Rate
                        </th>
                        <th
                          style={{
                            minWidth: "830px",
                          }}
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {shipBookingReqLanding &&
                        shipBookingReqLanding?.map((item, i) => (
                          <tr key={i + 1}>
                            <td className="text-center">{i + 1}</td>
                            <td className="text-left">
                              {item?.bookingRequestId}
                            </td>
                            <td className="text-left">
                              {item?.shipperContact}
                            </td>
                            <td className="text-left">{item?.shipperName}</td>
                            <td className="text-left">
                              {moment(item?.createdAt).format("DD-MM-YYYY")}
                            </td>
                            <td className="text-left">{item?.shipperEmail}</td>
                            <td className="text-left">
                              {item?.shipperCountry}
                            </td>
                            <td className="text-left">{item?.portOfLoading}</td>
                            <td className="text-left">{item?.bookingAmount}</td>
                            <td>
                              <div
                                style={{
                                  display: "flex",
                                  gap: "5px",
                                  alignItems: "center",
                                }}
                              >
                                <span>
                                  <button className="btn btn-sm btn-primary">
                                    Details
                                  </button>
                                </span>
                                <span>
                                  <button className="btn btn-sm btn-primary">
                                    Cancel
                                  </button>
                                </span>
                                <span>
                                  <button className="btn btn-sm btn-primary">
                                    Confirm
                                  </button>
                                </span>
                                <span>
                                  <button className="btn btn-sm btn-primary">
                                    Pickup
                                  </button>
                                </span>
                                <span>
                                  <button className="btn btn-sm btn-primary">
                                    Receive
                                  </button>
                                </span>
                                <span>
                                  <button className="btn btn-sm btn-primary">
                                    Transport
                                  </button>
                                </span>
                                <span>
                                  <button className="btn btn-sm btn-primary">
                                    Planning
                                  </button>
                                </span>
                                <span>
                                  <button className="btn btn-sm btn-primary">
                                    Charges
                                  </button>
                                </span>
                                <span>
                                  <button className="btn btn-sm btn-primary">
                                    Document
                                  </button>
                                </span>
                                <span>
                                  <button className="btn btn-sm btn-primary">
                                    Checklist
                                  </button>
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </Formik>
      </>
    </ICustomCard>
  );
}

export default BookingList;
