import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import IConfirmModal from "../../../_helper/_confirmModal";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IDelete from "../../../_helper/_helperIcons/_delete";
import IEdit from "../../../_helper/_helperIcons/_edit";
import IView from "../../../_helper/_helperIcons/_view";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import IViewModal from "../../../_helper/_viewModal";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import cementLogo from "./images/cementLogo.png";
import './styles.css';
import { DataPrintHandler, getDataForPrint } from "./utils";
import ViewManualShipment from "./view";

const initData = {
  shipPoint: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
};
export default function ManualShipment() {
  const saveHandler = (values, cb) => { };
  const [manualShipment, getManualShipment, manualShipmentLoader, setManualShipment] = useAxiosGet();
  const [shippointDDL, getShippointDDL, shippointDDLloader, setShippointDDL] = useAxiosGet();
  const history = useHistory();
  const [isShowModal, setIsShowModal] = useState(false);
  const [viewData, setViewData] = useState()
  const [loading, setLoading] = useState(false)
  //const [headerData, setHeaderData] = useState()
  const [printData, setPrintData] = useState()

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getShippointDDL(`/domain/OrganizationalUnitUserPermission/GetOrganizationalUnitUserPermissionByUnitId?UserId=${profileData?.userId
      }&ClientId=${profileData?.accountId
      }&BusinessUnitId=${selectedBusinessUnit?.value
      }`, (date) => {
        let newData = date?.map((item) => {
          return {
            value: item?.organizationUnitReffId,
            label: item?.organizationUnitReffName
          }
        })
        initData.shipPoint = newData[2]
        setShippointDDL(newData)
        getManualShipment(`/tms/Vehicle/GetLoadingSlip?BusinessUnitId=${selectedBusinessUnit?.value}&ShipPointId=${initData.shipPoint?.value
          }&fromDate=${initData.fromDate
          }&toDate=${initData.toDate
          }`)
      })
  }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    , []
  )

  const deleteRow = (id, cb) => {
    axios.put(`/tms/Vehicle/DeleteLoadingSlipInfo?UserId=${profileData?.userId}&BusinessUnitId=${selectedBusinessUnit?.value}&LoadingSlipId=${id}`).then((res) => {
      if (res?.status === 200) {
        toast.success("Deleted Successfully")
        cb()
      }
    })
  };
  const deleteHandler = (values, id) => {
    let confirmObject = {
      title: "Are you sure?",
      message: "If you delete this, it can not be undone",
      yesAlertFunc: async () => {
        deleteRow(id, () => {
          getManualShipment(`/tms/Vehicle/GetLoadingSlip?BusinessUnitId=${selectedBusinessUnit?.value}&ShipPointId=${values?.shipPoint?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}`)
        });
      },
      noAlertFunc: () => {
        "";
      },
    };
    IConfirmModal(confirmObject);
  }

  const {
    printRefCement,
    handleInvoicePrintCement,
  } = DataPrintHandler();


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
          {(manualShipmentLoader || shippointDDLloader || loading) && <Loading />}
          <IForm
            title="Manual Shipment"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      history.push("/transport-management/shipmentmanagement/manual-shipment/create");
                    }}
                  >
                    Create
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-2">
                  <NewSelect
                    name="shipPoint"
                    options={shippointDDL}
                    value={values?.shipPoint}
                    label="Ship Point"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("shipPoint", valueOption);
                      } else {
                        setFieldValue("shipPoint", "");
                        setManualShipment([]);
                      }
                    }}
                    placeholder="Ship Point"
                    errors={errors}
                    isDisabled={false}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    value={values?.fromDate}
                    label="From Date"
                    name="fromDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("fromDate", e.target.value);
                      setManualShipment([]);
                    }}
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    value={values?.toDate}
                    label="To Date"
                    name="toDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("toDate", e.target.value);
                      setManualShipment([]);
                    }}
                  />
                </div>
                <div className="col-lg-2">
                  <button onClick={() => {
                    getManualShipment(`/tms/Vehicle/GetLoadingSlip?BusinessUnitId=${selectedBusinessUnit?.value}&ShipPointId=${values?.shipPoint?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}`)
                  }}
                    type="button"
                    className="btn btn-primary mt-5"
                    disabled={
                      !values?.shipPoint ||
                      !values?.fromDate ||
                      !values?.toDate
                    }
                  >
                    View
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th style={{ width: "30px" }}>SL</th>
                        <th>Date</th>
                        <th>Gate Entry Code</th>
                        <th>Vehicle ID</th>
                        <th>Quantity</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {manualShipment?.data?.length > 0 &&
                        manualShipment?.data?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td className="text-center">{_dateFormatter(item?.dteDate)}</td>
                              <td className="text-center">{item?.strGateEntryCode}</td>
                              <td className="text-center">{item?.intVehicleId}</td>
                              <td className="text-center">{item?.numTotalQuantity}</td>
                              <td style={{
                                display: "flex",
                                justifyContent: "space-around",
                                alignItems: "center"
                              }}>
                                <IView
                                  title="View"
                                  clickHandler={() => {
                                    setViewData(item)
                                    setIsShowModal(true)
                                  }}
                                />
                                <IEdit
                                  title="Edit"
                                  onClick={() => {
                                    history.push(`/transport-management/shipmentmanagement/manual-shipment/edit/${item?.intLoadingId}`)
                                  }}
                                />
                                <OverlayTrigger overlay={<Tooltip id="cs-icon">{"Print"}</Tooltip>}>
                                  <span>
                                    <i
                                      style={{
                                        fontSize: "15px",
                                        cursor: "pointer",
                                      }}
                                      className={`fa fa-print`}
                                      onClick={() => {
                                        // setHeaderData(item)
                                        getDataForPrint(
                                          item?.intLoadingId,
                                          setLoading,
                                          (resData) => {
                                            setPrintData(resData);
                                            handleInvoicePrintCement();
                                          }
                                        );
                                      }}
                                    ></i>
                                  </span>
                                </OverlayTrigger>
                                <IDelete
                                  remover={() => {
                                    deleteHandler(values, item?.intLoadingId)
                                  }}
                                />
                              </td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </table>
                </div>
              </div>
              {/* pdf report */}
              <div ref={printRefCement} className="loading-slip-report-wrapper">
                <div className="d-flex justify-content-between align-items-center mb-5">
                  <div className="d-flex justify-content-center align-items-center">
                    <img style={{ width: "100px", height: "80px", }} src={cementLogo} alt="cement" />
                  </div>
                  <div className="d-flex flex-column justify-content-center align-items-center header-title">
                    <h1 className="bold">{selectedBusinessUnit?.label}</h1>
                    <h4>{values?.shipPoint?.label}</h4>
                    <h3 className="bold">
                      <span className="border-bottom">Loading Slip Report</span>
                    </h3>
                  </div>
                  <div></div>
                </div>
                <div className="weight-report-header center mt-5 table-responsive">
                  <table className="w-100">
                    <tr>
                      <td>Entry Code: {printData?.headerDTO?.strGateEntryCode}</td>
                      <td>Ship Point: {printData?.headerDTO?.shipPointName}</td>
                      <td>Vehicle No: {printData?.headerDTO?.strVehicleName}</td>
                    </tr>
                    <tr>
                      <td>Driver Name: {printData?.headerDTO?.driverName}</td>
                      <td>Driver Contact No :{printData?.headerDTO?.driverContactNO}</td>
                      <td>Date: {_dateFormatter(printData?.headerDTO?.dteDate)}</td>
                    </tr>
                  </table>
                  <div className="row">
                    <div className="col-lg-12 table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th style={{ width: "30px" }}>SL</th>
                            <th>Date</th>
                            <th>Item Name</th>
                            <th>Item Code</th>
                            <th>Uom</th>
                            <th>Quantity</th>
                            <th>Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {printData?.rowDTO?.length > 0 &&
                            printData?.rowDTO?.map((item, index) => {
                              return (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td className="text-center">{_todayDate(item?.dteDate)}</td>
                                  <td>{item?.strItemName}</td>
                                  <td className="text-center">{item?.strItemCode}</td>
                                  <td>{item?.strUomname}</td>
                                  <td className="text-center">{item?.numQnt}</td>
                                  <td>{item?.strRemarks}</td>
                                </tr>
                              )
                            })
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </IForm>

          <IViewModal
            show={isShowModal}
            onHide={() => {
              setIsShowModal(false);
            }}
            title="View Manual Shipment Items"
          >
            <ViewManualShipment viewData={viewData} intLoadingId={viewData?.intLoadingId} />
          </IViewModal>
        </>
      )}
    </Formik>
  );
}