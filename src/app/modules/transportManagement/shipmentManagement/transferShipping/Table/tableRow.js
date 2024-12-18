import { Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { _dateFormatter } from '../../../../_helper/_dateFormate';
import { ISelect } from '../../../../_helper/_inputDropDown';
import {
  getSalesContactGridData,
  getSalesContactIncompleteGridData,
  saveShipmentId_action,
  setGridEmptyAction,
} from '../_redux/Actions';

import { toast } from 'react-toastify';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from '../../../../../../_metronic/_partials/controls';
import IConfirmModal from '../../../../_helper/_confirmModal';
import IClose from '../../../../_helper/_helperIcons/_close';
import IView from '../../../../_helper/_helperIcons/_view';
import InputField from '../../../../_helper/_inputField';
import Loading from '../../../../_helper/_loading';
import PaginationTable from '../../../../_helper/_tablePagination';
import { _todayDate } from '../../../../_helper/_todayDate';
import IViewModal from '../../../../_helper/_viewModal';
import FromDateToDateForm from '../../../../_helper/commonInputFieldsGroups/dateForm';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import { setShipmentlandingAction } from '../../../../_helper/reduxForLocalStorage/Actions';
import CancelTransferShippingForm from '../vehicleWeigth/cancelForm';
// import { OverlayTrigger, Tooltip } from "react-bootstrap";

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
  const [open, setOpen] = useState(false);
  const [permitted, getPermission] = useAxiosGet();
  const [singleItem, setSingleItem] = useState({});
  const [, getCanceledData, loader] = useAxiosGet();
  const [canceledRows, setCanceledRows] = useState([]);

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  const {
    selectedBusinessUnit: { value: buId },
    profileData: { accountId: accId, userId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const reportsTypes = permitted
    ? [
        { value: 1, label: 'Shipment Created' },
        { value: 2, label: 'Shipment Unscheduled' },
        { value: 3, label: 'Shipment Completed' },
        { value: 4, label: 'Canceled Transfer Shipping' },
      ]
    : [
        { value: 1, label: 'Shipment Created' },
        { value: 2, label: 'Shipment Unscheduled' },
        { value: 3, label: 'Shipment Completed' },
      ];

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
    getPermission(
      `/wms/FertilizerOperation/GetAllModificationPermission?UserEnroll=${userId}&BusinessUnitId=${buId}&Type=YsnChalanInfo`,
    );
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

  // const itemSlectedHandler = (value, index) => {
  //   const copyRowDto = [...incompleteRowDto];
  //   copyRowDto[index].itemCheck = !copyRowDto[index].itemCheck;
  //   setIncompleteRowDto(copyRowDto);
  // };

  const itemSlectedRowHandler = (value, index) => {
    const copyRowDto = [...rowDto];
    copyRowDto[index].itemCheck = !copyRowDto[index].itemCheck;
    setRowDto(copyRowDto);
  };

  const allGridCheck = (value) => {
    const modifyGridData = gridData?.data?.map((itm) => ({
      ...itm,
      itemCheck: value,
    }));
    setRowDto(modifyGridData);
  };

  // const allIncompleteGridCheck = (value) => {
  //   const modifyGridData = incompleteGridData?.data?.map((itm) => ({
  //     ...itm,
  //     itemCheck: value,
  //   }));
  //   setIncompleteRowDto(modifyGridData);
  // };

  //viewClickHandler
  const viewBtnClickHandler = (values, pageNo = 0, pageSize = 15) => {
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
          setLoading,
          pageNo,
          pageSize,
        ),
      );
    } else if (values?.reportType?.value === 2) {
      dispatch(
        getSalesContactIncompleteGridData(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          values?.pgiShippoint?.value,
          values?.tillDate,
          setLoading,
          pageNo,
          pageSize,
        ),
      );
    } else if (values?.reportType?.value === 4) {
      getCanceledData(
        `/oms/Shipment/GetCanceledTransferShippingReport?AccountId=${accId}&BusinessUnitId=${buId}&ShipPointId=${values?.pgiShippoint?.value}&FromDate=${values?.fromDate}&Todate=${values?.toDate}`,
        (resData) => {
          setCanceledRows(resData);
        },
      );
    }
  };

  const setPositionHandler = (pageNo, pageSize, values) => {
    viewBtnClickHandler(values, pageNo, pageSize);
  };

  const completeShipmentClickHandler = (values) => {
    const modifyFilterRowDto = rowDto?.filter((itm) => itm?.itemCheck === true);

    if (modifyFilterRowDto?.length > 0) {
      let payload = [];

      for (let item of modifyFilterRowDto) {
        payload = [...payload, item?.shipmentId];
      }

      let confirmObject = {
        title: 'Are you sure?',
        message: `Do you want to post the selected Complete Shipment`,
        yesAlertFunc: () => {
          dispatch(
            saveShipmentId_action(
              payload,
              profileData?.userId,
              viewBtnClickHandler,
              values,
              pageNo,
              pageSize,
            ),
          );
        },
        noAlertFunc: () => {},
      };
      IConfirmModal(confirmObject);
    } else {
      toast.warn('Please Select Incomplete Data', {
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
      viewBtnClickHandler(shipmentlanding, pageNo, pageSize);
    }
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
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...shipmentlanding,
          pgiShippoint: shipmentlanding?.pgiShippoint?.value
            ? shipmentlanding?.pgiShippoint
            : ShippointDDL[0] || '',
          reportType: shipmentlanding?.reportType?.value
            ? shipmentlanding?.reportType
            : { value: 2, label: 'Shipment Unscheduled' },
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
              <CardHeader title={'Transfer Shipping'}>
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      dispatch(setShipmentlandingAction(values));
                      history.push({
                        pathname: `/transport-management/shipmentmanagement/transfershipping/add`,
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
                          <div className="col-lg-2">
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
                          <div className="col-lg-2">
                            <ISelect
                              label="Report Type"
                              options={reportsTypes}
                              value={values?.reportType}
                              name="reportType"
                              onChange={(optionValue) => {
                                setFieldValue('reportType', optionValue);
                                setIncompleteRowDto([]);
                                setRowDto([]);
                                setCanceledRows([]);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          {[1, 3, 4].includes(values?.reportType?.value) && (
                            <FromDateToDateForm
                              obj={{
                                values,
                                setFieldValue,
                                colSize: 'col-lg-2',
                              }}
                            />
                          )}
                          {values.reportType?.value === 2 && (
                            <div className="col-lg-2">
                              <InputField
                                value={values?.tillDate}
                                label="Till Date"
                                type="date"
                                name="tillDate"
                              />
                            </div>
                          )}

                          <div className="col-lg-1">
                            <button
                              type="button"
                              className="btn btn-primary mt-5"
                              onClick={() => {
                                setIncompleteRowDto([]);
                                setRowDto([]);
                                dispatch(setShipmentlandingAction(values));
                                viewBtnClickHandler(values, pageNo, pageSize);
                              }}
                            >
                              View
                            </button>
                          </div>
                          {values?.reportType?.value === 1 && (
                            <div className="col-lg-3">
                              <button
                                type="button"
                                className="btn btn-primary mt-5"
                                onClick={() => {
                                  completeShipmentClickHandler(values);
                                }}
                              >
                                Complete Shipment
                              </button>
                            </div>
                          )}
                        </>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    style={{ display: 'none' }}
                    ref={btnRef}
                    onSubmit={() => {
                      handleSubmit();
                    }}
                  ></button>

                  <button
                    type="reset"
                    style={{ display: 'none' }}
                    ref={resetBtnRef}
                    onSubmit={() => resetForm(initialData)}
                  ></button>
                </Form>

                {/* Table Start */}
                {(loading || loader) && <Loading />}
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
                                    <input
                                      type="checkbox"
                                      id="parent"
                                      onChange={(event) => {
                                        allGridCheck(event.target.checked);
                                      }}
                                    />
                                  </th>
                                )}

                                <th style={{ width: '30px' }}>SL</th>
                                <th>Shipment No</th>
                                <th style={{ width: '90px' }}>Contact Date</th>
                                <th>Route Name</th>
                                <th>Transport Mode</th>
                                <th>Shipping Type Name</th>
                                <th>Vehicle Name</th>
                                <th>Total Qty</th>
                                <th style={{ width: '90px' }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {rowDto?.map((td, index) => (
                                <tr
                                  key={index}
                                  style={{
                                    backgroundColor:
                                      td?.loadingConfirmDate == null ||
                                      td?.tlm === 0 ||
                                      null
                                        ? '#ff7061'
                                        : '',
                                  }}
                                >
                                  {values?.reportType?.value === 1 && (
                                    <td>
                                      <div className="text-center">
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
                                                  index,
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
                                    <div>{td.shippingTypeName}</div>{' '}
                                  </td>
                                  <td>
                                    <div>{td.vehicleName}</div>{' '}
                                  </td>
                                  <td>
                                    <div className="text-right">
                                      {td.itemTotalQty}
                                    </div>{' '}
                                  </td>
                                  <td>
                                    <div className="d-flex justify-content-around">
                                      <span className="view">
                                        <IView
                                          clickHandler={() => {
                                            history.push({
                                              pathname: `/transport-management/shipmentmanagement/transfershipping/view/${td.shipmentId}/${td.shipmentCode}`,
                                              state: values,
                                            });
                                          }}
                                        />
                                      </span>
                                      {permitted ? (
                                        <span className="view">
                                          <IClose
                                            title="Cancel Transfer Shipping"
                                            closer={() => {
                                              setSingleItem(td);
                                              setOpen(true);
                                            }}
                                          />
                                        </span>
                                      ) : (
                                        ''
                                      )}

                                      {/* Created Report Type Edit */}
                                      {/* {values?.reportType?.value === 1 && (
                                      <span
                                        className="edit"
                                        onClick={() => {
                                          history.push({
                                            pathname: `/transport-management/shipmentmanagement/transfershipping/edit/${td.shipmentId}`,
                                            state: values,
                                          });
                                        }}
                                      >
                                        <IEdit />
                                      </span>
                                    )} */}
                                      {/* {values?.reportType?.label ===
                                      "Shipment Created" && (
                                      <span
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                          history.push({
                                            pathname: `/transport-management/shipmentmanagement/transfershipping/vihicleWeight/${td.shipmentId}`,
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
                                    )} */}
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
                                {/* <th>
                                <input
                                  type="checkbox"
                                  id="parent"
                                  onChange={(event) => {
                                    allIncompleteGridCheck(
                                      event.target.checked
                                    );
                                  }}
                                />
                              </th> */}
                                <th>SL</th>
                                <th>Transfer Date</th>
                                <th>Transfer Code</th>
                                <th>Transfer Type</th>
                                <th>Sold To Party</th>
                                <th>Transport Zone</th>
                                <th>Total Volume</th>
                                <th>Total Weight</th>
                                <th>Total Qty</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {incompleteRowDto?.map((td, index) => (
                                <tr key={index}>
                                  {/* <td className="text-center">
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
                                          itemSlectedHandler(
                                            e.target.checked,
                                            index
                                          );
                                        }}
                                      />
                                    )}
                                    label="Transshipment"
                                  />
                                </td> */}
                                  <td className="text-center"> {index + 1} </td>
                                  <td>
                                    <div className="text-center">
                                      {_dateFormatter(td?.dteDeliveryDate)}
                                    </div>
                                  </td>
                                  <td>
                                    <div>{td?.strDeliveryCode}</div>
                                  </td>
                                  <td>
                                    <div>{td?.strDeliveryTypeName}</div>
                                  </td>
                                  <td>
                                    <div>{td?.strSoldToPartnerName}</div>
                                  </td>
                                  <td>
                                    <div>{td?.strTransportZoneName}</div>{' '}
                                  </td>
                                  <td>
                                    <div className="text-right">
                                      {td?.numTotalVolume}
                                    </div>{' '}
                                  </td>
                                  <td>
                                    <div className="text-right">
                                      {td?.numTotalWeight}
                                    </div>{' '}
                                  </td>
                                  <td>
                                    <div className="text-right">
                                      {td?.itemTotalQty}
                                    </div>{' '}
                                  </td>
                                  <td>
                                    <div className="d-flex justify-content-around">
                                      <span className="view">
                                        <IView
                                          clickHandler={() => {
                                            history.push(
                                              `/transport-management/shipmentmanagement/transfershipping/incompleteView/${td?.intDeliveryId}`,
                                            );
                                          }}
                                        />
                                      </span>
                                      {permitted ? (
                                        <span className="view">
                                          <IClose
                                            title="Cancel Transfer Shipping"
                                            closer={() => {
                                              setSingleItem(td);
                                              setOpen(true);
                                            }}
                                          />
                                        </span>
                                      ) : (
                                        ''
                                      )}
                                      {/* {values?.reportType?.value === 1 && (
                                      <span
                                        className="edit"
                                        onClick={() => {
                                          history.push({
                                            pathname: `/transport-management/shipmentmanagement/transfershipping/edit/${td?.intDeliveryId}`,
                                            state: values,
                                          });
                                        }}
                                      >
                                        <IEdit />
                                      </span>
                                    )} */}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                    {canceledRows?.data?.length > 0 && (
                      <>
                        <div className="table-responsive">
                          <table className="table table-striped table-bordered global-table">
                            <thead>
                              <tr>
                                <th>SL</th>
                                <th>Shipment Date</th>
                                <th>Shipment Code</th>
                                <th>Shipping Type</th>
                                <th>Route Name</th>
                                <th>Vehicle</th>
                                <th>Total Weight</th>
                                <th>Total Qty</th>
                              </tr>
                            </thead>
                            <tbody>
                              {canceledRows?.data?.map((td, index) => (
                                <tr key={index}>
                                  <td className="text-center"> {index + 1} </td>
                                  <td className="text-center">
                                    {_dateFormatter(td?.shipmentDate)}
                                  </td>
                                  <td>{td?.shipmentCode}</td>
                                  <td>{td?.shippingTypeName}</td>
                                  <td>{td?.routeName}</td>
                                  <td>{td?.vehicleName}</td>
                                  <td className="text-right">
                                    {td?.itemTotalGrowssWeight}
                                  </td>
                                  <td className="text-right">
                                    {td?.itemTotalQty}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </div>
                </div>
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
                  incompleteRowDto?.length > 0 && (
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
              <IViewModal
                modelSize="md"
                show={open}
                onHide={() => setOpen(false)}
              >
                <CancelTransferShippingForm
                  singleItem={singleItem}
                  setOpen={setOpen}
                  viewBtnClickHandler={viewBtnClickHandler}
                  preValues={values}
                />
              </IViewModal>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
