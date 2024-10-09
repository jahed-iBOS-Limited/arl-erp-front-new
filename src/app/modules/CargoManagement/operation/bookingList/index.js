import { Formik } from "formik";
import moment from "moment";
import React, { useEffect } from "react";
import * as Yup from "yup";
import { imarineBaseUrl } from "../../../../App";
import ICustomCard from "../../../_helper/_customCard";
import Loading from "../../../_helper/_loading";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
import IViewModal from "../../../_helper/_viewModal";
import Details from "./bookingDetails";
import { cancelHandler, pickupHandler, statusReturn } from "./helper";
import ConfirmModal from "./confirmModal";
import ReceiveModal from "./receiveModal";
import TransportModal from "./transportModal";
import PlanningModal from "./planningModal";
import ChargesModal from "./chargesModal";
import DocumentModal from "./documentModal";
import ChecklistModal from "./checklistModal";
import useAxiosPut from "../../../_helper/customHooks/useAxiosPut";

const validationSchema = Yup.object().shape({});
function BookingList() {
  const { profileData } = useSelector(
    (state) => state?.authData || {},
    shallowEqual
  );
  const [
    shipBookingReqLanding,
    getShipBookingReqLanding,
    bookingReqLandingLoading,
  ] = useAxiosGet();

  const [
    ,
    getBookingRequestStatusUpdate,
    bookingRequestloading,
  ] = useAxiosPut();

  const [isModalShowObj, setIsModalShowObj] = React.useState({
    isView: false,
  });
  const [rowClickData, setRowClickData] = React.useState({});

  useEffect(() => {
    commonLandingApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

  const commonLandingApi = () => {
    getShipBookingReqLanding(
      `${imarineBaseUrl}/domain/ShippingService/GetShipBookingRequestLanding?userId=${profileData?.userReferenceId}&userTypeId=${profileData?.userTypeId}&refrenceId=${profileData?.userReferenceId}`
    );
  };
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
              {(bookingReqLandingLoading || bookingRequestloading) && (
                <Loading />
              )}
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
                        <th style={{
                          minWidth: "150px",
                        }}>
                          Status
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
                              <span>
                                {
                                  statusReturn(item)
                                }
                              </span>
                            </td>
                            <td>
                              <div
                                style={{
                                  display: "flex",
                                  gap: "5px",
                                  alignItems: "center",
                                }}
                              >
                                <span>
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => {
                                      setRowClickData(item);
                                      setIsModalShowObj({
                                        ...isModalShowObj,
                                        isView: true,
                                      });
                                    }}
                                  >
                                    Details
                                  </button>
                                </span>
                                <span>
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => {
                                      cancelHandler({
                                        item,
                                        getBookingRequestStatusUpdate,
                                        CB: () => {
                                          commonLandingApi()
                                        },
                                      });
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </span>
                                <span>
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => {
                                      setRowClickData(item);
                                      setIsModalShowObj({
                                        ...isModalShowObj,
                                        isConfirm: true,
                                      });
                                    }}
                                  >
                                    Confirm
                                  </button>
                                </span>
                                <span>
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => {
                                      pickupHandler({ item });
                                    }}
                                  >
                                    Pickup
                                  </button>
                                </span>
                                <span>
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => {
                                      setRowClickData(item);
                                      setIsModalShowObj({
                                        ...isModalShowObj,
                                        isReceive: true,
                                      });
                                    }}
                                  >
                                    Receive
                                  </button>
                                </span>
                                <span>
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => {
                                      setRowClickData(item);
                                      setIsModalShowObj({
                                        ...isModalShowObj,
                                        isTransport: true,
                                      });
                                    }}
                                  >
                                    Transport
                                  </button>
                                </span>
                                <span>
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => {
                                      setRowClickData(item);
                                      setIsModalShowObj({
                                        ...isModalShowObj,
                                        isPlanning: true,
                                      });
                                    }}
                                  >
                                    Planning
                                  </button>
                                </span>
                                <span>
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => {
                                      setRowClickData(item);
                                      setIsModalShowObj({
                                        ...isModalShowObj,
                                        isCharges: true,
                                      });
                                    }}
                                  >
                                    Charges
                                  </button>
                                </span>
                                <span>
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => {
                                      setRowClickData(item);
                                      setIsModalShowObj({
                                        ...isModalShowObj,
                                        isDocument: true,
                                      });
                                    }}
                                  >
                                    Document
                                  </button>
                                </span>
                                <span>
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => {
                                      setRowClickData(item);
                                      setIsModalShowObj({
                                        ...isModalShowObj,
                                        isChecklist: true,
                                      });
                                    }}
                                  >
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

      {/* view info */}
      {isModalShowObj?.isView && (
        <>
          {" "}
          <IViewModal
            show={isModalShowObj?.isView}
            onHide={() => {
              setIsModalShowObj({
                ...isModalShowObj,
                isView: false,
              });
            }}
            title="Booking Details"
          >
            <Details rowClickData={rowClickData} />
          </IViewModal>
        </>
      )}

      {/* Confirm Modal */}
      {isModalShowObj?.isConfirm && (
        <>
          <IViewModal
            title="Confirm Booking"
            show={isModalShowObj?.isConfirm}
            onHide={() => {
              setIsModalShowObj({
                ...isModalShowObj,
                isConfirm: false,
              });
            }}
          >
            <ConfirmModal rowClickData={rowClickData} CB={()=> {
              commonLandingApi()
              setIsModalShowObj({
                ...isModalShowObj,
                isConfirm: false,
              });
              setRowClickData({})
            }} />
          </IViewModal>
        </>
      )}

      {/* Receive Modal */}
      {isModalShowObj?.isReceive && (
        <>
          <IViewModal
            title="Receive Booking"
            show={isModalShowObj?.isReceive}
            onHide={() => {
              setIsModalShowObj({
                ...isModalShowObj,
                isReceive: false,
              });
            }}
          >
            <ReceiveModal rowClickData={rowClickData} />
          </IViewModal>
        </>
      )}

      {/* Transport Modal */}
      {isModalShowObj?.isTransport && (
        <>
          <IViewModal
            title="Transport Booking"
            show={isModalShowObj?.isTransport}
            onHide={() => {
              setIsModalShowObj({
                ...isModalShowObj,
                isTransport: false,
              });
            }}
          >
            <TransportModal rowClickData={rowClickData} />
          </IViewModal>
        </>
      )}

      {/* Planning Modal */}
      {isModalShowObj?.isPlanning && (
        <>
          <IViewModal
            title="Planning Booking"
            show={isModalShowObj?.isPlanning}
            onHide={() => {
              setIsModalShowObj({
                ...isModalShowObj,
                isPlanning: false,
              });
            }}
          >
            <PlanningModal rowClickData={rowClickData} />
          </IViewModal>
        </>
      )}

      {/* Charges Modal */}
      {isModalShowObj?.isCharges && (
        <>
          <IViewModal
            title="Charges Booking"
            show={isModalShowObj?.isCharges}
            onHide={() => {
              setIsModalShowObj({
                ...isModalShowObj,
                isCharges: false,
              });
            }}
          >
            <ChargesModal rowClickData={rowClickData} />
          </IViewModal>
        </>
      )}

      {/* Document Modal */}
      {isModalShowObj?.isDocument && (
        <>
          <IViewModal
            title="Document Booking"
            show={isModalShowObj?.isDocument}
            onHide={() => {
              setIsModalShowObj({
                ...isModalShowObj,
                isDocument: false,
              });
            }}
          >
            <DocumentModal rowClickData={rowClickData} />
          </IViewModal>
        </>
      )}

      {/* Checklist Modal */}
      {isModalShowObj?.isChecklist && (
        <>
          <IViewModal
            title="Checklist Booking"
            show={isModalShowObj?.isChecklist}
            onHide={() => {
              setIsModalShowObj({
                ...isModalShowObj,
                isChecklist: false,
              });
            }}
          >
            <ChecklistModal rowClickData={rowClickData} />
          </IViewModal>
        </>
      )}
    </ICustomCard>
  );
}

export default BookingList;
