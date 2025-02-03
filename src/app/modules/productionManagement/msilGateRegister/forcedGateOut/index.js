import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import {
  fetchCardNoDetails,
  initData,
  qrCodeScannerHandler,
  qrStyles,
  setCardNoFormFieldEmpty,
  setGateOutCurrentTime,
  validationSchema,
} from "./helper";
import IForm from "../../../_helper/_form";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { shallowEqual, useSelector } from "react-redux";
import InputField from "../../../_helper/_inputField";
import IViewModal from "../../../_helper/_viewModal";
import QRCodeScanner from "../../../_helper/qrCodeScanner";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { _todayDate } from "../../../_helper/_todayDate";

const ForcedGateOutPage = () => {
  // redux
  const businessUnitDDL = useSelector((state) => {
    return state.authData.businessUnitList;
  }, shallowEqual);

  console.log(businessUnitDDL);

  const { selectedBusinessUnit, profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  // ref
  const formikRef = useRef(null);

  // state
  const [objProps, setObjprops] = useState({});
  const [showQRCodeScannerModal, setShowQRCodeScannerModal] = useState(false);

  // api action
  const [
    cardNoDetails,
    getCardNoDetails,
    getCardNoDetailsLoading,
    setCardNoDetails,
  ] = useAxiosGet();

  const [, saveForcedGateOut, saveForcedGateOutLoading] = useAxiosPost();

  //   use effect
  useEffect(() => {
    if (formikRef?.current) {
      formikRef.current.setFieldValue("businessUnit", selectedBusinessUnit);
    }
  }, [selectedBusinessUnit]);

  // save handler
  function saveHandler(values, cb) {
    // destrcuture
    const { outTime, businessUnit } = values;

    // cardNoDetails
    const cardNoData = cardNoDetails[0];

    // payload
    const payload = {
      vehicleOutTime: outTime,
      vehicleOutTimeAfterLunch: null,
      intBusinessUnitId: businessUnit?.value,
      intActionBy: profileData?.userId,
      dteActionDate: _todayDate(),
      intStatus: cardNoData?.intReferenceTypeId,
      intAutoId: cardNoData?.intAutoId,
      intReferenceId: cardNoData?.intReferenceId,
    };
    // console.log(payload);
    saveForcedGateOut(
      `/mes/MSIL/CreateVehicleForcedGateOut`,
      payload,
      cb,
      true
    );
  }

  // reset card no form field

  function ResetCardNoFormFiled({ setFieldValue }) {
    return (
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: "5px",
          cursor: "pointer",
          marginTop: "20px",
        }}
        onClick={() => {
          setCardNoDetails([]);
          setFieldValue("cardNo", "");
          setFieldValue("outTime", "");
          document.getElementById("cardNo").disabled = false;
          document.getElementById("cardNo").focus();
        }}
      >
        <i
          style={{
            color: "blue",
          }}
          className="fa fa-refresh"
          aria-hidden="true"
        ></i>
      </span>
    );
  }

  // is loading
  const isLoading = getCardNoDetailsLoading || saveForcedGateOutLoading;

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
          setCardNoDetails([]);
          document.getElementById("cardNo").disabled = false;
          document.getElementById("cardNo").focus();
        });
      }}
      innerRef={formikRef}
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
          {isLoading && <Loading />}
          <IForm title="Forced Gate Out" getProps={setObjprops}>
            <Form>
              <div className="form-group global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="businessUnit"
                    options={[...businessUnitDDL]}
                    value={values?.businessUnit}
                    label="Business Unit"
                    onChange={(valueOption) => {
                      setFieldValue("businessUnit", valueOption);
                    }}
                  />
                </div>

                <div className="col-lg-3 d-flex position-relative">
                  <div
                    style={qrStyles}
                    className="position-absolute"
                    onClick={() => {
                      setShowQRCodeScannerModal(true);
                    }}
                  >
                    QR Code <i class="fa fa-qrcode" aria-hidden="true"></i>
                  </div>

                  <div style={{ width: "inherit" }}>
                    <InputField
                      id="cardNo"
                      autoFocus
                      value={values?.cardNo}
                      label="Entry Card No"
                      name="cardNo"
                      type="text"
                      onKeyPress={(e) => {
                        e.preventDefault();
                        if (e.key === "Enter") {
                          setGateOutCurrentTime(setFieldValue);
                          document.getElementById("cardNo").disabled = true;

                          fetchCardNoDetails({
                            values,
                            getCardNoDetails,
                            cb: function(data) {
                              if (data?.length <= 0) {
                                setCardNoFormFieldEmpty(setFieldValue);
                              }
                            },
                          });
                        } else {
                          document.getElementById("cardNo").disabled = false;
                        }
                      }}
                      onChange={(e) => {
                        setFieldValue("cardNo", e.target.value);
                      }}
                    />
                  </div>
                  <ResetCardNoFormFiled setFieldValue={setFieldValue} />
                </div>

                <div className="col-lg-3">
                  <InputField
                    value={values?.outTime}
                    label="Out Time"
                    name="outTime"
                    type="time"
                    onChange={(e) => {
                      setFieldValue("outTime", e.target.value);
                    }}
                  />
                </div>
              </div>

              <DeliveryDetailsSection cardNoDetails={cardNoDetails} />

              {/* Default Button */}
              <button
                type="submit"
                style={{ display: "none" }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>
              <button
                type="reset"
                style={{ display: "none" }}
                ref={objProps?.resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>

            {/* QR Code Scanner Modal */}
            <IViewModal
              show={showQRCodeScannerModal}
              onHide={() => {
                setShowQRCodeScannerModal(false);
              }}
            >
              <QRCodeScanner
                QrCodeScannerCB={(result) => {
                  setShowQRCodeScannerModal(false);
                  setFieldValue("cardNo", result);
                  qrCodeScannerHandler({
                    setFieldValue,
                    values: {
                      ...values,
                      cardNo: result,
                    },
                  });
                }}
              />
            </IViewModal>
          </IForm>
        </>
      )}
    </Formik>
  );
};

export default ForcedGateOutPage;

function DeliveryDetailsSection({ cardNoDetails }) {
  const cardNoData = cardNoDetails[0];
  return (
    <>
      {cardNoDetails?.length > 0 && (
        <>
          <div className="col-lg-12 my-5 text-center">
            <h1>Delivery Details</h1>
          </div>
          <section className="row w-75 mx-auto">
            <div className="col-lg-6">
              <div className="table-responsive">
                <table className="w-100">
                  <tbody className="text-left">
                    <tr className="mb-3">
                      <td className="text-left">
                        <h6>Entry Date</h6>
                      </td>
                      <td>
                        <h6>:</h6>
                      </td>
                      <td>
                        <h6>{_dateFormatter(cardNoData?.entryDate)}</h6>
                      </td>
                    </tr>
                    <tr className="mb-3">
                      <td className="text-left">
                        <h6>Entry Code</h6>
                      </td>
                      <td>
                        <h6>:</h6>
                      </td>
                      <td>
                        <h6>{cardNoData?.strEntryCode}</h6>
                      </td>
                    </tr>
                    <tr className="mb-3">
                      <td className="text-left">
                        <h6>Client Type Name</h6>
                      </td>
                      <td>
                        <h6>:</h6>
                      </td>
                      <td>
                        <h6>{cardNoData?.strClientTypeName}</h6>
                      </td>
                    </tr>
                    <tr className="mb-3">
                      <td className="text-left">
                        <h6>Truck Number</h6>
                      </td>
                      <td>
                        <h6>:</h6>
                      </td>
                      <td>
                        <h6>{cardNoData?.strTruckNumber}</h6>
                      </td>
                    </tr>
                    <tr className="mb-3">
                      <td className="text-left">
                        <h6>Driver Name</h6>
                      </td>
                      <td>
                        <h6>:</h6>
                      </td>
                      <td>
                        <h6>{cardNoData?.strDriverName}</h6>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="table-responsive">
                <table className="w-100">
                  <tbody className="text-left">
                    <tr>
                      <td className="text-left">
                        <h6>Driver Mobile No</h6>
                      </td>
                      <td>
                        <h6>:</h6>
                      </td>
                      <td>
                        <h6>{cardNoData?.strDriverMobileNo}</h6>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-left">
                        <h6>In Time</h6>
                      </td>
                      <td>
                        <h6>:</h6>
                      </td>
                      <td>
                        <h6>{cardNoData?.tmInTime}</h6>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-left">
                        <h6>Shift Incharge</h6>
                      </td>
                      <td>
                        <h6>:</h6>
                      </td>
                      <td>
                        <h6>{cardNoData?.strShiftIncharge}</h6>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-left">
                        <h6>Net Weight</h6>
                      </td>
                      <td>
                        <h6>:</h6>
                      </td>
                      <td>
                        <h6>{cardNoData?.netWeight}</h6>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-left">
                        <h6>Shipment Code</h6>
                      </td>
                      <td>
                        <h6>:</h6>
                      </td>
                      <td>
                        <h6>{cardNoData?.shipmentCode}</h6>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
