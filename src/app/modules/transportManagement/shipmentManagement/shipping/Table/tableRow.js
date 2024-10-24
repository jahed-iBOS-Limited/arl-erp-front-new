import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { ISelect } from "../../../../_helper/_inputDropDown";
import {
  createShipmentCompleteAction,
  getSalesContactGridData,
  getSalesContactIncompleteGridData,
  setGridEmptyAction,
} from "../_redux/Actions";

import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { toast } from "react-toastify";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import InfoCircle from "../../../../_helper/_helperIcons/_infoCircle";
import IView from "../../../../_helper/_helperIcons/_view";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import PaginationSearch from "../../../../_helper/_search";
import PaginationTable from "../../../../_helper/_tablePagination";
import { _todayDate } from "../../../../_helper/_todayDate";
import IViewModal from "../../../../_helper/_viewModal";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import AddManualChallanNo from "../shippingUnitView/addManualChallan";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "./../../../../../../_metronic/_partials/controls";
import IConfirmModal from "./../../../../_helper/_confirmModal";
import { setShipmentlandingAction } from "./../../../../_helper/reduxForLocalStorage/Actions";

export function TableRow({
  profileData,
  selectedBusinessUnit,
  ShippointDDL,
  initialData,
  btnRef,
  saveHandler,
  resetBtnRef,
}) {
  const [rowDto, setRowDto] = useState([]);
  const [incompleteRowDto, setIncompleteRowDto] = useState([]);
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [shippingInfo, getShippingInfo, isLoading] = useAxiosGet();
  const [open, setOpen] = useState(false);
  const [permitted, getPermission] = useAxiosGet();
  const [type, setType] = useState("");

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  // get gridData from store
  const gridData = useSelector((state) => {
    return state.shipment?.gridData;
  }, shallowEqual);

  const incompleteGridData = useSelector((state) => {
    return state.shipment?.incompleteGridData;
  }, shallowEqual);
  const shipmentlanding = useSelector((state) => {
    return state.localStorage?.shipmentlanding;
  }, shallowEqual);

  useEffect(() => {
    const modifyGridData = incompleteGridData?.data?.map((itm) => ({
      ...itm,
      itemCheck: false,
    }));
    setIncompleteRowDto(modifyGridData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incompleteGridData]);

  useEffect(() => {
    const modifyGridData = gridData?.data?.map((itm) => ({
      ...itm,
      itemCheck: false,
    }));
    setRowDto(modifyGridData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridData]);

  const itemSlectedHandler = (value, index) => {
    const copyRowDto = [...incompleteRowDto];
    copyRowDto[index].itemCheck = !copyRowDto[index].itemCheck;
    setIncompleteRowDto(copyRowDto);
  };

  const itemSlectedRowHandler = (value, index) => {
    const modifyGridData = rowDto?.map((itm) => ({ ...itm, itemCheck: false }));
    const copyRowDto = [...modifyGridData];
    copyRowDto[index].itemCheck = !copyRowDto[index].itemCheck;
    setRowDto(copyRowDto);
  };

  // const allGridCheck = (value) => {
  //   const modifyGridData = gridData?.data?.map((itm) => ({
  //     ...itm,
  //     itemCheck: value,
  //   }));
  //   setRowDto(modifyGridData);
  // };

  const allIncompleteGridCheck = (value) => {
    const modifyGridData = incompleteGridData?.data?.map((itm) => ({
      ...itm,
      itemCheck: value,
    }));
    setIncompleteRowDto(modifyGridData);
  };

  //viewClickHandler
  const viewBtnClickHandler = (pageNo, pageSize, values, search = "") => {
    if (values?.reportType?.value === 1 || values?.reportType?.value === 3) {
      const type = values?.reportType?.value === 1 ? 1 : 2;
      dispatch(
        getSalesContactGridData(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          values?.pgiShippoint?.value,
          type,
          values?.fromDate,
          values?.toDate,
          search,
          setLoading,
          pageNo,
          pageSize
        )
      );
    } else {
      dispatch(
        getSalesContactIncompleteGridData(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          values?.pgiShippoint?.value,
          values?.tillDate,
          search,
          setLoading,
          pageNo,
          pageSize
        )
      );
    }
  };

  const setPositionHandler = (pageNo, pageSize, values) => {
    viewBtnClickHandler(pageNo, pageSize, values);
  };

  const completeShipmentClickHandler = (values) => {
    const modifyFilterRowDto = rowDto?.filter((itm) => itm.itemCheck === true);
    const notPermitted = modifyFilterRowDto?.every(
      (item) =>
        item?.shippingTypeId !== 10 &&
        item?.shippingTypeName !== "Troller" &&
        item?.isLoadingSupervisorMaintain &&
        !item?.loadingConfirmDate &&
        item?.vehicleCapacityTypeId !== 11
    );

    if (
      selectedBusinessUnit?.value === 4 &&
      values?.reportType?.value === 1 &&
      values?.pgiShippoint?.value === 60 &&
      notPermitted
    ) {
      return toast.warn("Please Complete Loading Confirmation");
    }

    if (modifyFilterRowDto?.length > 0) {
      let confirmObject = {
        title: "Are you sure?",
        message: `Do you want to post the selected Complete Shipment`,
        yesAlertFunc: () => {
          dispatch(
            createShipmentCompleteAction(
              profileData?.accountId,
              selectedBusinessUnit?.value,
              modifyFilterRowDto[0]?.shipmentId,
              profileData?.userId,
              viewBtnClickHandler,
              pageNo,
              pageSize,
              values,
              setLoading
            )
          );
        },
        noAlertFunc: () => {
          //alert("Click No");
        },
      };
      IConfirmModal(confirmObject);
    } else {
      toast.warn("Please Select Incomplete Data", {
        toastId: 456,
      });
    }
  };

  useEffect(() => {
    if (
      profileData?.accountId &&
      selectedBusinessUnit?.value &&
      shipmentlanding?.pgiShippoint?.value
    ) {
      viewBtnClickHandler(pageNo, pageSize, shipmentlanding);
    }
    getPermission(
      `/wms/FertilizerOperation/GetAllModificationPermission?UserEnroll=${profileData?.userId}&BusinessUnitId=${selectedBusinessUnit?.value}&Type=YsnChalanInfo`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    return () => {
      setIncompleteRowDto([]);
      setRowDto([]);
      dispatch(setGridEmptyAction());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDeliveryShippingInfoById = (url) => {
    getShippingInfo(url, () => setOpen(true));
  };

  const paginationSearchHandler = (search, values) => {
    viewBtnClickHandler(pageNo, pageSize, values, search);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...shipmentlanding,
          pgiShippoint: shipmentlanding?.pgiShippoint?.value
            ? shipmentlanding?.pgiShippoint
            : ShippointDDL[0] || "",
          reportType: shipmentlanding?.reportType?.value
            ? shipmentlanding?.reportType
            : { value: 2, label: "Shipment Unscheduled" },
          tillDate: shipmentlanding?.tillDate
            ? shipmentlanding?.tillDate
            : _todayDate(),
          fromDate: shipmentlanding?.fromDate
            ? shipmentlanding?.fromDate
            : _todayDate(),
          toDate: shipmentlanding?.toDate
            ? shipmentlanding?.toDate
            : _todayDate(),
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initialData);
          });
        }}
      >
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
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Shipment"}>
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      dispatch(setShipmentlandingAction(values));
                      history.push({
                        pathname: `/transport-management/shipmentmanagement/shipping/add`,
                        state: { ...values, incompleteRowDto },
                      });
                    }}
                    className="btn btn-primary"
                  >
                    Create
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="row global-form">
                        <>
                          <div className="col-lg-3">
                            <ISelect
                              label="Select Shippoint"
                              options={ShippointDDL}
                              value={values.pgiShippoint}
                              name="pgiShippoint"
                              setFieldValue={setFieldValue}
                              errors={errors}
                              touched={touched}
                              dependencyFunc={(currentValue, value, setter) => {
                                // dispatch(
                                //   getSalesContactGridData(
                                //     profileData.accountId,
                                //     selectedBusinessUnit.value,
                                //     currentValue
                                //   )
                                // );
                              }}
                            />
                          </div>
                          <div className="col-lg-3">
                            <ISelect
                              label="Report Type"
                              options={[
                                { value: 1, label: "Shipment Created" },
                                { value: 2, label: "Shipment Unscheduled" },
                                { value: 3, label: "Shipment Completed" },
                              ]}
                              value={values?.reportType}
                              name="reportType"
                              onChange={(optionValue) => {
                                setFieldValue("reportType", optionValue);
                                setIncompleteRowDto([]);
                                setRowDto([]);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          {(values?.reportType?.value === 1 ||
                            values?.reportType?.value === 3) && (
                            <>
                              <div className="col-lg-3">
                                <InputField
                                  value={values?.fromDate}
                                  label="From Date"
                                  type="date"
                                  name="fromDate"
                                />
                              </div>
                              <div className="col-lg-3">
                                <InputField
                                  value={values?.toDate}
                                  label="To Date"
                                  type="date"
                                  name="toDate"
                                />
                              </div>
                            </>
                          )}
                          {values.reportType?.value === 2 && (
                            <div className="col-lg-3">
                              <InputField
                                value={values?.tillDate}
                                label="Till Date"
                                type="date"
                                name="tillDate"
                              />
                            </div>
                          )}

                          <div className="col d-flex  align-items-end justify-content-end">
                            <button
                              type="button"
                              className="btn btn-primary mt-4 mr-2"
                              onClick={() => {
                                setIncompleteRowDto([]);
                                setRowDto([]);
                                dispatch(setShipmentlandingAction(values));
                                viewBtnClickHandler(pageNo, pageSize, values);
                              }}
                            >
                              View
                            </button>
                            {values?.reportType?.value === 1 && (
                              <button
                                type="button"
                                className="btn btn-primary mt-4"
                                onClick={() => {
                                  completeShipmentClickHandler(values);
                                }}
                              >
                                Complete Shipment
                              </button>
                            )}
                          </div>
                        </>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    style={{ display: "none" }}
                    ref={btnRef}
                    onSubmit={() => {
                      handleSubmit();
                    }}
                  ></button>

                  <button
                    type="reset"
                    style={{ display: "none" }}
                    ref={resetBtnRef}
                    onSubmit={() => resetForm(initialData)}
                  ></button>
                </Form>
                <div className="col-lg-3 mt-3">
                  <PaginationSearch
                    placeholder={`${
                      [1, 3].includes(values?.reportType?.value)
                        ? "Search by Vehicle Name/Shipment code"
                        : "Search by Delivery code"
                    }`}
                    paginationSearchHandler={paginationSearchHandler}
                    values={values}
                  />
                </div>
                {/* Table Start */}
                {(loading || isLoading) && <Loading />}
                <div className="row">
                  <div className="col-lg-12">
                    {rowDto?.length > 0 && (
                      <>
                        <div className="table-responsive">
                          <table className="table table-striped table-bordered global-table">
                            <thead>
                              <tr>
                                {values?.reportType?.value === 1 && (
                                  <th>
                                    {/* <div className="d-flex justify-content-center align-items-center">
                                    <input
                                      type="checkbox"
                                      id="parent"
                                      onChange={(event) => {
                                        allGridCheck(event.target.checked);
                                      }}
                                    />
                                  </div> */}
                                  </th>
                                )}

                                <th style={{ width: "40px" }}>Sl</th>
                                <th>Shipment No</th>
                                <th>Contact Date</th>
                                <th>Route Name</th>
                                <th>Transport Mode</th>
                                <th>Provider Type</th>
                                <th>Shipping Type Name</th>
                                <th>Vehicle Name</th>
                                <th>Loading Confirm Date</th>
                                <th>Pump</th>
                                <th>Total Qty</th>
                                <th>Prom. Qty</th>
                                <th style={{ width: "90px" }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {rowDto?.map((td, index) => (
                                <tr
                                  key={index}
                                  style={
                                    td?.promotionalItemCount > 0
                                      ? { backgroundColor: "#ffd2d2" }
                                      : {}
                                  }
                                >
                                  {values?.reportType?.value === 1 && (
                                    <td>
                                      <div className="d-flex justify-content-center align-items-center">
                                        <Field
                                          name={values.itemCheck}
                                          component={() => (
                                            <input
                                              id="itemCheck"
                                              type="checkbox"
                                              value={td.itemCheck}
                                              checked={
                                                values.reportType === 2
                                                  ? true
                                                  : td.itemCheck
                                              }
                                              name={td.itemCheck}
                                              onChange={(e) => {
                                                //setFieldValue("itemCheck", e.target.checked);
                                                itemSlectedRowHandler(
                                                  e.target.checked,
                                                  index
                                                );
                                              }}
                                            />
                                          )}
                                          label="Transshipment"
                                        />
                                      </div>
                                    </td>
                                  )}

                                  <td className="text-center"> {index + 1} </td>
                                  <td>
                                    <div>{td?.shipmentCode}</div>
                                  </td>
                                  <td>
                                    <div className="text-center">
                                      {_dateFormatter(td?.shipmentDate)}
                                    </div>
                                  </td>
                                  <td>
                                    <div>{td?.routeName}</div>
                                  </td>
                                  <td>
                                    <div>{td?.transportModeName}</div>
                                  </td>
                                  <td>
                                    <div>{td?.strOwnerType}</div>
                                  </td>
                                  <td>
                                    <div>{td.shippingTypeName}</div>{" "}
                                  </td>
                                  <td>
                                    <div>{td.vehicleName}</div>{" "}
                                  </td>
                                  <td className="text-center">
                                    <div>
                                      {_dateFormatter(td.loadingConfirmDate)}
                                    </div>{" "}
                                  </td>
                                  <td>
                                    <div>{td.pumpModelName}</div>{" "}
                                  </td>
                                  <td>
                                    <div className="text-right">
                                      {td.itemTotalQty}
                                    </div>{" "}
                                  </td>
                                  <td className="text-right">
                                    {td?.promotionalItemCount}
                                  </td>
                                  <td style={{ width: "120px" }}>
                                    <div className="d-flex justify-content-around">
                                      <span className="view">
                                        <IView
                                          clickHandler={() => {
                                            history.push({
                                              pathname: `/transport-management/shipmentmanagement/shipping/view/${td.shipmentId}/${td.shipmentCode}`,
                                              state: values,
                                            });
                                          }}
                                        />
                                      </span>

                                      {permitted && (
                                        <span
                                          className="edit"
                                          onClick={() => {
                                            setType("challan");
                                            getDeliveryShippingInfoById(
                                              `/wms/Delivery/GetDeliveryPrintInfo?ShipmentId=${td?.shipmentId}`
                                            );
                                          }}
                                        >
                                          <IEdit title={"Add Manual Challan"} />
                                        </span>
                                      )}
                                      {permitted &&
                                        values?.reportType?.value === 1 && (
                                          <span
                                            onClick={() => {
                                              history.push({
                                                pathname: `/transport-management/shipmentmanagement/shipping/edit/${td?.shipmentId}`,
                                                state: values,
                                              });
                                              // getDeliveryShippingInfoById(
                                              //   `/oms/Shipment/GetShipmentByIdForUpdate?ShipmentId=${td?.shipmentId}`
                                              // );
                                              // setType("update");
                                            }}
                                          >
                                            <InfoCircle
                                              title={"Shipment info update"}
                                            />
                                          </span>
                                        )}

                                      {values?.reportType?.label ===
                                        "Shipment Created" && (
                                        <span
                                          style={{ cursor: "pointer" }}
                                          onClick={() => {
                                            history.push({
                                              pathname: `/transport-management/shipmentmanagement/shipping/vihicleWeight/${td.shipmentId}`,
                                              state: td,
                                            });
                                          }}
                                        >
                                          <OverlayTrigger
                                            overlay={
                                              <Tooltip id="cs-icon">
                                                Vehicle Weight
                                              </Tooltip>
                                            }
                                          >
                                            <span>
                                              <i class="fas fa-balance-scale"></i>
                                            </span>
                                          </OverlayTrigger>
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}

                    {incompleteRowDto?.length > 0 && (
                      <>
                        <div className="table-responsive">
                          <table className="table table-striped table-bordered global-table">
                            <thead>
                              <tr>
                                <th style={{ width: "90px" }}>
                                  <input
                                    type="checkbox"
                                    id="parent"
                                    onChange={(event) => {
                                      allIncompleteGridCheck(
                                        event.target.checked
                                      );
                                    }}
                                  />
                                </th>
                                <th style={{ width: "50px" }}>Sl</th>
                                <th>Delivery Date</th>
                                <th>Delivery Code</th>
                                <th>Delivery Type</th>
                                <th>Sold To Party</th>
                                <th>Transport Zone</th>
                                <th>Total Volume</th>
                                <th>Total Weight</th>
                                <th>Total Qty</th>
                              </tr>
                            </thead>
                            <tbody>
                              {incompleteRowDto?.map((td, index) => (
                                <tr key={index}>
                                  <td>
                                    <Field
                                      name={values.itemCheck}
                                      component={() => (
                                        <input
                                          id="itemCheck"
                                          type="checkbox"
                                          className="ml-2"
                                          value={td.itemCheck}
                                          checked={
                                            values.reportType === 2
                                              ? true
                                              : td.itemCheck
                                          }
                                          name={td.itemCheck}
                                          onChange={(e) => {
                                            //setFieldValue("itemCheck", e.target.checked);
                                            itemSlectedHandler(
                                              e.target.checked,
                                              index
                                            );
                                          }}
                                        />
                                      )}
                                      label="Transshipment"
                                    />
                                  </td>
                                  <td className="text-center"> {td?.sl} </td>
                                  <td>
                                    <div className="text-right pr-2">
                                      {_dateFormatter(td?.dteDeliveryDate)}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="pl-2">
                                      {td?.strDeliveryCode}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="pl-2">
                                      {td?.strDeliveryTypeName}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="pl-2">
                                      {td?.strSoldToPartnerName}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="pl-2">
                                      {td?.strTransportZoneName}
                                    </div>{" "}
                                  </td>
                                  <td>
                                    <div className="text-right pr-2">
                                      {td?.numTotalVolume}
                                    </div>{" "}
                                  </td>
                                  <td>
                                    <div className="text-right pr-2">
                                      {td?.numTotalWeight}
                                    </div>{" "}
                                  </td>
                                  <td>
                                    <div className="text-right pr-2">
                                      {td?.itemTotalQty}
                                    </div>{" "}
                                  </td>
                                  {/* <td>
                                  <div className="d-flex justify-content-around">
                                    <span className="view">
                                      <IView
                                        clickHandler={() => {
                                          history.push(
                                            `/transport-management/shipmentmanagement/shipping/incompleteView/${td?.intDeliveryId}`
                                          );
                                        }}
                                      />
                                    </span>
                                    <span
                                      className="edit"
                                      onClick={() => {
                                        history.push({
                                          pathname: `/transport-management/shipmentmanagement/shipping/edit/${td?.intDeliveryId}`,
                                          state: values,
                                        });
                                      }}
                                    >
                                      <IEdit />
                                    </span>
                                  </div>
                                </td> */}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <IViewModal
                  title={
                    type === "challan"
                      ? "Add Manual Challan"
                      : "Shipment info update"
                  }
                  show={open}
                  onHide={() => setOpen(false)}
                >
                  <AddManualChallanNo
                    rowData={
                      type === "challan" ? shippingInfo?.objRow : shippingInfo
                    }
                    setOpen={setOpen}
                    type={type}
                  />
                </IViewModal>
                {(values?.reportType?.value === 1 ||
                  values?.reportType?.value === 3) &&
                  rowDto?.length > 0 && (
                    <PaginationTable
                      count={gridData?.totalCount}
                      setPositionHandler={setPositionHandler}
                      paginationState={{
                        pageNo,
                        setPageNo,
                        pageSize,
                        setPageSize,
                      }}
                      values={values}
                    />
                  )}
                {values?.reportType?.value === 2 &&
                  incompleteGridData?.data?.length > 0 && (
                    <PaginationTable
                      count={incompleteGridData?.totalCount}
                      setPositionHandler={setPositionHandler}
                      paginationState={{
                        pageNo,
                        setPageNo,
                        pageSize,
                        setPageSize,
                      }}
                      values={values}
                    />
                  )}
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
