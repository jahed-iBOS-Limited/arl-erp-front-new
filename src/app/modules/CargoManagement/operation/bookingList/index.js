import { Formik } from "formik";
import moment from "moment";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import { imarineBaseUrl } from "../../../../App";
import ICustomCard from "../../../_helper/_customCard";
import Loading from "../../../_helper/_loading";
import IViewModal from "../../../_helper/_viewModal";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPut from "../../../_helper/customHooks/useAxiosPut";
import Details from "./bookingDetails";
import ChargesModal from "./chargesModal";
import ConfirmModal from "./confirmModal";
import DeliveryNoteModal from "./deliveryNoteModal";
import DocumentModal from "./documentModal";
import FreightCargoReceipt from "./freightCargoReceipt";
import FreightInvoice from "./freightInvoice";
import HBLFormat from "./HBLFormat";
import { cancelHandler, statusReturn } from "./helper";
import ReceiveModal from "./receiveModal";
import TransportModal from "./transportModal";
import CommonStatusUpdateModal from "./commonStatusUpdateModal";

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

  const [isModalShowObj, setIsModalShowObj] = React.useState({});
  const [rowClickData, setRowClickData] = React.useState({});

  useEffect(() => {
    commonLandingApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

  const commonLandingApi = () => {
    getShipBookingReqLanding(
      `${imarineBaseUrl}/domain/ShippingService/GetShipBookingRequestLanding?userId=${
        profileData?.userReferenceId
      }&userTypeId=${0}&refrenceId=${profileData?.userReferenceId}`
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
                        <th
                          style={{
                            minWidth: "150px",
                          }}
                        >
                          Status
                        </th>
                        <th
                          style={{
                            minWidth: "100px",
                          }}
                        >
                          Details
                        </th>
                        <th
                          style={{
                            minWidth: "100px",
                          }}
                        >
                          Cancel
                        </th>
                        <th
                          style={{
                            minWidth: "100px",
                          }}
                        >
                          Confirm
                        </th>
                        <th
                          style={{
                            minWidth: "100px",
                          }}
                        >
                          Pickup
                        </th>
                        <th
                          style={{
                            minWidth: "100px",
                          }}
                        >
                          Receive
                        </th>
                        <th
                          style={{
                            minWidth: "146px",
                          }}
                        >
                          Transport
                        </th>
                        <th
                          style={{
                            minWidth: "60px",
                          }}
                        >
                          BL
                        </th>
                        <th
                          style={{
                            minWidth: "100px",
                          }}
                        >
                          HBL
                        </th>
                        <th
                          style={{
                            minWidth: "146px",
                          }}
                        >
                          Charges
                        </th>
                        <th
                          style={{
                            minWidth: "117px",
                          }}
                        >
                          Doc Checklist
                        </th>
                        <th
                          style={{
                            minWidth: "100px",
                          }}
                        >
                          Dispatch
                        </th>
                        <th
                          style={{
                            minWidth: "149px",
                          }}
                        >
                          Customs Clearance
                        </th>
                        <th
                          style={{
                            minWidth: "100px",
                          }}
                        >
                          In Transit
                        </th>
                        <th
                          style={{
                            minWidth: "137px",
                          }}
                        >
                          Des. Port Receive
                        </th>
                        <th
                          style={{
                            minWidth: "100px",
                          }}
                        >
                          Delivered
                        </th>
                        <th
                          style={{
                            minWidth: "490px",
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
                              <span>{statusReturn(item)}</span>
                            </td>

                            <td>
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
                            </td>
                            <td>
                              <span>
                                <button
                                  className="btn btn-sm btn-primary"
                                  onClick={() => {
                                    cancelHandler({
                                      item,
                                      getBookingRequestStatusUpdate,
                                      CB: () => {
                                        commonLandingApi();
                                      },
                                    });
                                  }}
                                >
                                  Cancel
                                </button>
                              </span>
                            </td>
                            <td>
                              <span>
                                <button
                                  disabled={item?.isConfirm}
                                  className={
                                    item?.isConfirm
                                      ? "btn btn-sm btn-success px-1 py-1"
                                      : "btn btn-sm btn-warning px-1 py-1"
                                  }
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
                            </td>
                            <td>
                              <span>
                                <button
                                  disabled={item?.isPickup}
                                  className={
                                    item?.isPickup
                                      ? "btn btn-sm btn-success px-1 py-1"
                                      : "btn btn-sm btn-warning px-1 py-1"
                                  }
                                  onClick={() => {
                                    setRowClickData({
                                      ...item,
                                      title: "Pickup",
                                      isUpdateDate: "pickupDate",
                                      isUpdateKey: "isPickup",
                                    });
                                    setIsModalShowObj({
                                      ...isModalShowObj,

                                      isCommonModalShow: true,
                                    });
                                  }}
                                >
                                  Pickup
                                </button>
                              </span>
                            </td>
                            <td>
                              <span>
                                <button
                                  disabled={item?.isReceived}
                                  className={
                                    item?.isReceived
                                      ? "btn btn-sm btn-success px-1 py-1"
                                      : "btn btn-sm btn-warning px-1 py-1"
                                  }
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
                            </td>
                            <td>
                              <span>
                                <button
                                  disabled={item?.isPlaning}
                                  className={
                                    item?.isPlaning
                                      ? "btn btn-sm btn-success px-1 py-1"
                                      : "btn btn-sm btn-warning px-1 py-1"
                                  }
                                  onClick={() => {
                                    setRowClickData(item);
                                    setIsModalShowObj({
                                      ...isModalShowObj,
                                      isPlaning: true,
                                    });
                                  }}
                                >
                                  Transport Planning
                                </button>
                              </span>
                            </td>
                            <td>
                              <span>
                                <button
                                  disabled={item?.isBl}
                                  className={
                                    item?.isBl
                                      ? "btn btn-sm btn-success px-1 py-1"
                                      : "btn btn-sm btn-warning px-1 py-1"
                                  }
                                  onClick={() => {}}
                                >
                                  BL
                                </button>
                              </span>
                            </td>
                            <td>
                              <span>
                                <button
                                  disabled={item?.isHbl}
                                  className={
                                    item?.isHbl
                                      ? "btn btn-sm btn-success px-1 py-1"
                                      : "btn btn-sm btn-warning px-1 py-1"
                                  }
                                  onClick={() => {}}
                                >
                                  HBL
                                </button>
                              </span>
                            </td>
                            <td>
                              <span>
                                <button
                                  className={
                                    item?.isCharges
                                      ? "btn btn-sm btn-success px-1 py-1"
                                      : "btn btn-sm btn-warning px-1 py-1"
                                  }
                                  onClick={() => {
                                    setRowClickData(item);
                                    setIsModalShowObj({
                                      ...isModalShowObj,
                                      isCharges: true,
                                    });
                                  }}
                                >
                                  Services & Charges
                                </button>
                              </span>
                            </td>
                            <td>
                              <span>
                                <button
                                  className={
                                    item?.isDocumentChecklist
                                      ? "btn btn-sm btn-success px-1 py-1"
                                      : "btn btn-sm btn-warning px-1 py-1"
                                  }
                                  onClick={() => {
                                    setRowClickData(item);
                                    setIsModalShowObj({
                                      ...isModalShowObj,
                                      isDocument: true,
                                    });
                                  }}
                                >
                                  Doc Checklist
                                </button>
                              </span>
                            </td>
                            <td>
                              <span>
                                <button
                                  disabled={item?.isDispatch}
                                  className={
                                    item?.isDispatch
                                      ? "btn btn-sm btn-success px-1 py-1"
                                      : "btn btn-sm btn-warning px-1 py-1"
                                  }
                                  onClick={() => {
                                    setRowClickData({
                                      ...item,
                                      title: "Dispatch",
                                      isUpdateDate: "dispatchDate",
                                      isUpdateKey: "isDispatch",
                                    });
                                    setIsModalShowObj({
                                      ...isModalShowObj,

                                      isCommonModalShow: true,
                                    });
                                  }}
                                >
                                  Dispatch
                                </button>
                              </span>
                            </td>
                            <td>
                              <span>
                                <button
                                  disabled={item?.isCustomsClear}
                                  className={
                                    item?.isCustomsClear
                                      ? "btn btn-sm btn-success px-1 py-1"
                                      : "btn btn-sm btn-warning px-1 py-1"
                                  }
                                  onClick={() => {
                                    setRowClickData({
                                      ...item,
                                      title: "Customs Clearance",
                                      isUpdateDate: "customsClearDt",
                                      isUpdateKey: "isCustomsClear",
                                    });
                                    setIsModalShowObj({
                                      ...isModalShowObj,

                                      isCommonModalShow: true,
                                    });
                                  }}
                                >
                                  Customs Clearance
                                </button>
                              </span>
                            </td>
                            <td>
                              <span>
                                <button
                                  disabled={item?.isInTransit}
                                  className={
                                    item?.isInTransit
                                      ? "btn btn-sm btn-success px-1 py-1"
                                      : "btn btn-sm btn-warning px-1 py-1"
                                  }
                                  onClick={() => {
                                    setRowClickData({
                                      ...item,
                                      title: "In Transit",
                                      isUpdateDate: "inTransit",
                                      isUpdateKey: "isInTransit",
                                    });
                                    setIsModalShowObj({
                                      ...isModalShowObj,

                                      isCommonModalShow: true,
                                    });
                                  }}
                                >
                                  In Transit
                                </button>
                              </span>
                            </td>
                            <td>
                              <span>
                                <button
                                  disabled={item?.isDestPortReceive}
                                  className={
                                    item?.isDestPortReceive
                                      ? "btn btn-sm btn-success px-1 py-1"
                                      : "btn btn-sm btn-warning px-1 py-1"
                                  }
                                  onClick={() => {
                                    setRowClickData({
                                      ...item,
                                      title: "Des. Port Receive",
                                      isUpdateDate: "destPortReceive",
                                      isUpdateKey: "isDestPortReceive",
                                    });
                                    setIsModalShowObj({
                                      ...isModalShowObj,
                                      isCommonModalShow: true,
                                    });
                                  }}
                                >
                                  Des. Port Receive
                                </button>
                              </span>
                            </td>
                            <td>
                              <span>
                                <button
                                  disabled={item?.isBuyerReceive}
                                  className={
                                    item?.isBuyerReceive
                                      ? "btn btn-sm btn-success px-1 py-1"
                                      : "btn btn-sm btn-warning px-1 py-1"
                                  }
                                  onClick={() => {
                                    setRowClickData({
                                      ...item,
                                      title: "Delivered",
                                      isUpdateDate: "buyerReceive",
                                      isUpdateKey: "isBuyerReceive",
                                    });
                                    setIsModalShowObj({
                                      ...isModalShowObj,
                                      isCommonModalShow: true,
                                    });
                                  }}
                                >
                                  Delivered
                                </button>
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
                                        isDeliveryNote: true,
                                      });
                                    }}
                                  >
                                    Delivery Note
                                  </button>
                                </span>
                                <span>
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => {
                                      setRowClickData(item);
                                      setIsModalShowObj({
                                        ...isModalShowObj,
                                        isFreightCargoReceipt: true,
                                      });
                                    }}
                                  >
                                    Freight Cargo Receipt
                                  </button>
                                </span>
                                <span>
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => {
                                      setRowClickData(item);
                                      setIsModalShowObj({
                                        ...isModalShowObj,
                                        isHBLFormate: true,
                                      });
                                    }}
                                  >
                                    HBL Format
                                  </button>
                                </span>
                                <span>
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => {
                                      setRowClickData(item);
                                      setIsModalShowObj({
                                        ...isModalShowObj,
                                        isFreightInvoice: true,
                                      });
                                    }}
                                  >
                                    Freight Invoice
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
            <ConfirmModal
              rowClickData={rowClickData}
              CB={() => {
                commonLandingApi();
                setIsModalShowObj({
                  ...isModalShowObj,
                  isConfirm: false,
                });
                setRowClickData({});
              }}
            />
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
            <ReceiveModal
              rowClickData={rowClickData}
              CB={() => {
                commonLandingApi();
                setIsModalShowObj({
                  ...isModalShowObj,
                  isReceive: false,
                });
                setRowClickData({});
              }}
            />
          </IViewModal>
        </>
      )}

      {/* Transport Modal */}
      {isModalShowObj?.isPlaning && (
        <>
          <IViewModal
            title="Transport Booking"
            show={isModalShowObj?.isPlaning}
            onHide={() => {
              setIsModalShowObj({
                ...isModalShowObj,
                isPlaning: false,
              });
            }}
          >
            <TransportModal
              rowClickData={rowClickData}
              CB={() => {
                commonLandingApi();
                setIsModalShowObj({
                  ...isModalShowObj,
                  isPlaning: false,
                });
                setRowClickData({});
              }}
            />
          </IViewModal>
        </>
      )}

      {/* Charges Modal */}
      {isModalShowObj?.isCharges && (
        <>
          <IViewModal
            title="Services & Charges"
            show={isModalShowObj?.isCharges}
            onHide={() => {
              setIsModalShowObj({
                ...isModalShowObj,
                isCharges: false,
              });
            }}
          >
            <ChargesModal
              rowClickData={rowClickData}
              CB={() => {
                commonLandingApi();
                setIsModalShowObj({
                  ...isModalShowObj,
                  isCharges: false,
                });
                setRowClickData({});
              }}
            />
          </IViewModal>
        </>
      )}

      {/* Document Modal */}
      {isModalShowObj?.isDocument && (
        <>
          <IViewModal
            title="Document Checklist"
            show={isModalShowObj?.isDocument}
            onHide={() => {
              setIsModalShowObj({
                ...isModalShowObj,
                isDocument: false,
              });
            }}
          >
            <DocumentModal
              rowClickData={rowClickData}
              CB={() => {
                commonLandingApi();
                setIsModalShowObj({
                  ...isModalShowObj,
                  isDocument: false,
                });
                setRowClickData({});
              }}
            />
          </IViewModal>
        </>
      )}

      {/* Delivery Note Modal */}
      {isModalShowObj?.isDeliveryNote && (
        <>
          <IViewModal
            title="Delivery Note "
            show={isModalShowObj?.isDeliveryNote}
            onHide={() => {
              setIsModalShowObj({
                ...isModalShowObj,
                isDeliveryNote: false,
              });
            }}
          >
            <DeliveryNoteModal rowClickData={rowClickData} />
          </IViewModal>
        </>
      )}

      {/* Freight Cargo Receipt */}
      {isModalShowObj?.isFreightCargoReceipt && (
        <>
          <IViewModal
            title="Freight Cargo Receipt (FCR)"
            show={isModalShowObj?.isFreightCargoReceipt}
            onHide={() => {
              setIsModalShowObj({
                ...isModalShowObj,
                isFreightCargoReceipt: false,
              });
            }}
          >
            <FreightCargoReceipt rowClickData={rowClickData} />
          </IViewModal>
        </>
      )}

      {/* HBL Formate */}
      {isModalShowObj?.isHBLFormate && (
        <>
          <IViewModal
            title="HBL Formate"
            show={isModalShowObj?.isHBLFormate}
            onHide={() => {
              setIsModalShowObj({
                ...isModalShowObj,
                isHBLFormate: false,
              });
            }}
          >
            <HBLFormat rowClickData={rowClickData} />
          </IViewModal>
        </>
      )}

      {/* Freight Invoice */}
      {isModalShowObj?.isFreightInvoice && (
        <>
          <IViewModal
            title="Freight Invoice"
            show={isModalShowObj?.isFreightInvoice}
            onHide={() => {
              setIsModalShowObj({
                ...isModalShowObj,
                isFreightInvoice: false,
              });
            }}
          >
            <FreightInvoice rowClickData={rowClickData} />
          </IViewModal>
        </>
      )}
      {isModalShowObj?.isCommonModalShow && (
        <>
          <IViewModal
            title={rowClickData?.title}
            show={isModalShowObj?.isCommonModalShow}
            onHide={() => {
              setIsModalShowObj({
                ...isModalShowObj,
                isCommonModalShow: false,
              });
              setRowClickData({});
            }}
          >
            <CommonStatusUpdateModal
              rowClickData={rowClickData}
              CB={() => {
                commonLandingApi();
                setIsModalShowObj({
                  ...isModalShowObj,
                  isCommonModalShow: false,
                });
                setRowClickData({});
              }}
            />
          </IViewModal>
        </>
      )}
    </ICustomCard>
  );
}

export default BookingList;
