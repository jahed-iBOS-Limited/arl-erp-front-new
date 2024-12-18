import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Route, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import ICustomTable from '../../../_helper/_customTable';
import { _dateFormatter } from '../../../_helper/_dateFormate';
import IForm from '../../../_helper/_form';
import IApproval from '../../../_helper/_helperIcons/_approval';
import InfoCircle from '../../../_helper/_helperIcons/_infoCircle';
import IView from '../../../_helper/_helperIcons/_view';
import { ISelect } from '../../../_helper/_inputDropDown';
import InputField from '../../../_helper/_inputField';
import Loading from '../../../_helper/_loading';
import NewSelect from '../../../_helper/_select';
import IViewModal from '../../../_helper/_viewModal';
import FromDateToDateForm from '../../../_helper/commonInputFieldsGroups/dateForm';
import PowerBIReport from '../../../_helper/commonInputFieldsGroups/PowerBIReport';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import IButton from '../../../_helper/iButton';
import QRCodeScanner from '../../../_helper/qrCodeScanner';
import ICon from '../../../chartering/_chartinghelper/icons/_icon';
import { ViewModal } from '../../shipmentManagement/shipping/shippingUnitView/ViewModal';
import ShippingInfoDetails from '../storeInformationList/shippingNote';
import {
  chooseReportTableHeader,
  confirmDeliveryShippingInfoById,
  fetchPackerForceCompleteData,
  getData,
  groupId,
  handleCardNumberChange,
  initData,
  packerReportTypeDDL,
  parameterValues,
  reportId,
  reportTypeDDL,
} from './helper';
import ShipmentReportModal from './shipmentReportModal';
import styles from './style.module.css';

export default function LoadingSupervisorInfo() {
  // redux
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  // shipoint ddl
  const shipPointDDL = useSelector((state) => {
    return state?.commonDDL?.shippointDDL;
  }, shallowEqual);

  const history = useHistory();

  // state
  const [objProps, setObjprops] = useState({});
  const [shipmentId, setShipmentId] = useState(null);
  const [isQrCodeShow, setIsQRCodeSHow] = useState(false);
  const [actionType, setActionType] = useState('Manual');
  const [shipmentModalOpen, setShipmentModalOpen] = useState(false);
  const [singleItem, setSingleItem] = useState({});
  const [showReport, setShowReport] = useState(false);
  const [open, setOpen] = useState(false);
  const [
    shipPointIdForCementTlmLoadFromPacker,
    setShipPointIdForCementTlmLoadFromPacker,
  ] = useState(null);

  // axios get
  const [reportData, getReportData, loading, setReportData] = useAxiosGet();
  const [, confirmShipmentInfo, confirmShipmentInfoLoading] = useAxiosPost();
  const [tlmDDL, getTLMDDL] = useAxiosGet();
  const [rowData, getRowData, rowLoading, setRowData] = useAxiosGet();
  const [packerList, getPackerList, , setPackerList] = useAxiosGet();
  const [
    shipmentDetails,
    getShipmentDetails,
    shipmentDetailsLoading,
  ] = useAxiosGet();
  const [
    packerForcelyCompleteData,
    getPackerForcelyCompleteData,
    packerForcelyCompleteDataLoading,
  ] = useAxiosGet();
  const [
    isPermitedToConfirmPackerForce,
    getPermitedToConfirmPackerForce,
  ] = useAxiosGet();

  // axios post
  const [, onComplete, loader] = useAxiosPost();

  // is page loading
  const isLoading =
    loader ||
    loading ||
    rowLoading ||
    shipmentDetailsLoading ||
    packerForcelyCompleteDataLoading ||
    confirmShipmentInfoLoading;

  // qr scan code in/out table body
  const scanQRCodeInOutTableBody = () =>
    reportData?.objRow?.map((item, index) => {
      return (
        <tr>
          <td>{index + 1}</td>
          <td>{item?.itemName}</td>
          <td>{item?.bagType}</td>
          <td>{item?.uomName}</td>
          <td className="text-right">{item?.quantity}</td>
          {/* if business unit is 145 than show all header but if it's not than remove last header element */}
          {[144].includes(selectedBusinessUnit?.value) && (
            <>
              <td className="text-right">{item?.itemPrice}</td>
              <td className="text-center">
                <InfoCircle
                  title={'Shipment Details'}
                  clickHandler={() => {
                    getShipmentDetails(
                      `/wms/Delivery/GetDeliveryPrintInfo?ShipmentId=${reportData?.objHeader?.shipmentId}`,
                      () => setShipmentModalOpen(true),
                    );
                  }}
                />
              </td>
            </>
          )}
        </tr>
      );
    });

  // devlivery complete table body
  const deliveryCompleteTableBody = () =>
    rowData?.data?.map((item, index) => {
      return (
        <tr
          style={{
            backgroundColor: `${
              item?.bagType === 'Pasting'
                ? '#57d557c2'
                : item?.bagType === 'Sewing'
                ? '#6cbbe7de'
                : item?.bagType === 'MES PCC'
                ? '#bb8ef2f0'
                : ''
            }`,
          }}
        >
          <td>{index + 1}</td>
          <td>{item?.shipmentCode}</td>
          <td>{item?.vehicleName}</td>
          <td>
            {item?.itemTransferTotalQty > 0
              ? item?.itemNameTransferChallan
              : item?.bagType}
          </td>
          <td className="text-right">
            {item?.itemTransferTotalQty > 0
              ? item?.itemTransferTotalQty
              : item?.itemTotalQty}
          </td>
          <td>{item?.shippingTypeId === 9 ? 'Ton' : ''}</td>
          <td>{item?.routeName}</td>
          <td>{item?.transportModeName}</td>
          <td>{item?.strOwnerType}</td>
          <td>{item?.shippingTypeName}</td>
          <td>{item?.tlm}</td>
          <td>{item?.brustingQuantity}</td>
          <td className="text-center" style={{ backgroundColor: '#e0ffff' }}>
            <div className="d-flex justify-content-around">
              {/* {values?.type?.value === 1 && (
                <button
                  className="btn btn-info btn-sm px-2"
                  type="button"
                  onClick={() => {
                    onComplete(
                      `/oms/LoadingPoint/CompletePacker?shipmentId=${item?.shipmentId}&actionBy=${profileData?.userId}&typeId=5`,
                      null,
                      () => {
                        getData(values);
                      },
                      true
                    );
                  }}
                >
                  Completed
                </button>
              )} */}
              <InfoCircle
                title={'Shipment Details'}
                clickHandler={() => {
                  setSingleItem(item);
                  setOpen(true);
                }}
              />
            </div>
          </td>
        </tr>
      );
    });

  // scan qr code in/out, delivery complete table footer
  const scanQRCodeInOutDeliveryCompleteTableFooter = (values) => (
    <tr style={{ fontWeight: 'bold', textAlign: 'right' }}>
      <td
        colSpan={[1, 2].includes(values?.type?.value) ? 9 : 4}
        className="text-right"
      >
        Total
      </td>
      {[1, 2].includes(values?.type?.value) ? (
        <>
          <td>
            {rowData?.data?.reduce(
              (total, curr) => (total += curr?.itemTotalQty),
              0,
            )}
          </td>
          <td colSpan={2}></td>
        </>
      ) : (
        <>
          <td>
            {reportData?.objRow?.reduce(
              (total, curr) => (total += curr?.quantity),
              0,
            )}
          </td>

          {/* if business unit is 145 than show all header but if it's not than remove last header element */}
          {[144].includes(selectedBusinessUnit?.value) ? (
            <>
              <td className="text-right">
                {reportData?.objRow?.reduce(
                  (total, curr) => total + curr?.itemPrice,
                  0,
                )}
              </td>
              <td></td>
            </>
          ) : (
            <></>
          )}
        </>
      )}
    </tr>
  );
  const isPermitedToConfirmPackerForceComplete =
    isPermitedToConfirmPackerForce[0]?.ysnPermission;

  // packer forcely complete table body
  const packerForcelyCompleteTableBody = (values) => {
    return packerForcelyCompleteData?.data?.map((item, index) => {
      return (
        <tr>
          <td className="text-center"> {index + 1} </td>
          <td>
            <div>{item?.shipmentCode}</div>
          </td>
          <td>
            <div className="text-center">
              {_dateFormatter(item?.shipmentDate)}
            </div>
          </td>
          <td>
            <div>{item?.routeName}</div>
          </td>
          <td>
            <div>{item?.transportModeName}</div>
          </td>
          <td>
            <div>{item?.strOwnerType}</div>
          </td>
          <td>
            <div>{item?.shippingTypeName}</div>{' '}
          </td>
          <td>
            <div>{item?.vehicleName}</div>{' '}
          </td>
          <td className="text-center">
            <div>{_dateFormatter(item?.loadingConfirmDate)}</div>{' '}
          </td>
          <td>
            <div>{item?.pumpModelName}</div>{' '}
          </td>
          <td>
            <div className="text-right">{item?.itemTotalQty}</div>{' '}
          </td>
          <td className="d-flex justify-content-around">
            <span className="view">
              <IView
                clickHandler={() => {
                  history.push({
                    pathname: `/transport-management/deliveryprocess/LoadingSupervisorInfo/view/${item?.shipmentId}/${item?.shipmentCode}`,
                    state: values,
                  });
                }}
              />
            </span>
            {/* // ! Edit Shipping Info (need to work) */}
            {isPermitedToConfirmPackerForceComplete && (
              <span
                className="edit"
                onClick={() => {
                  // setType("challan");
                  confirmDeliveryShippingInfoById(
                    item,
                    profileData,
                    confirmShipmentInfo,
                    values,
                    // setOpen
                  );
                }}
              >
                <IApproval title={'Confirm'} />
              </span>
            )}
          </td>
        </tr>
      );
    });
  };

  const chooseReportTableBody = (values) => {
    switch (values?.type?.value) {
      // Scan QR Code In/Out Table Body
      case 3:
      case 5:
        return scanQRCodeInOutTableBody();
      // packer forcely complete
      case 6:
        return packerForcelyCompleteTableBody(values);

      // Delivery Complete Table
      default:
        return deliveryCompleteTableBody();
    }
  };

  const packerForcelyCompleteFormField = (values, setFieldValue) => (
    <>
      <div className="col-lg-3">
        <NewSelect
          name="shipPoint"
          options={[{ value: 0, label: 'All' }, ...shipPointDDL]}
          value={values?.shipPoint}
          label="ShipPoint"
          onChange={(valueOption) => {
            setFieldValue('shipPoint', valueOption);
          }}
          placeholder="ShipPoint"
        />
      </div>
      <div className="col-lg-3">
        <ISelect
          name="reportType"
          options={packerReportTypeDDL}
          label="Report Type"
          value={values?.reportType}
          onChange={(optionValue) => {
            setFieldValue('reportType', optionValue);
          }}
        />
      </div>
      <div className="col-lg-3">
        <NewSelect
          name="packerName"
          placeholder="Packer"
          label="Packer"
          isDisabled={values?.type?.value === 5}
          options={packerList || []}
          value={values?.packerName}
          onChange={(valueOption) => {
            setFieldValue('packerName', valueOption);
            setFieldValue('tlm', '');

            // get tlm ddl
            getTLMDDL(
              `/wms/AssetTransection/GetLabelNValueForDDL?BusinessUnitId=${
                selectedBusinessUnit?.value
              }&TypeId=1&RefferencePKId=${
                valueOption?.value
              }&ShipPointId=${values?.shipPoint?.value || 0}`,
            );
          }}
        />
      </div>
      <div className="col-lg-3">
        <NewSelect
          name="tlm"
          options={tlmDDL || []}
          value={values?.tlm}
          label="TLM"
          onChange={(valueOption) => {
            setFieldValue('tlm', valueOption);
          }}
          placeholder="TLM"
        />
      </div>

      <FromDateToDateForm obj={{ setFieldValue, values }} />
    </>
  );

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      // validationSchema={{}}
      // onSubmit={(values, { resetForm }) => {
      //   saveHandler(values, () => {
      //     resetForm(initData);
      //   });
      // }}
    >
      {({ handleSubmit, resetForm, values, setFieldValue, setValues }) => (
        <>
          {isLoading && <Loading />}
          <IForm
            title="Loading Supervisor Information"
            getProps={setObjprops}
            isHiddenBack
            isHiddenReset
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  {![1, 2, 5].includes(values?.type?.value) &&
                    !reportData?.objHeader?.isLoaded && (
                      <button
                        type="button"
                        className="btn btn-primary"
                        disabled={
                          (!reportData?.objHeader?.shipmentId && !shipmentId) ||
                          !values?.tlm
                        }
                        onClick={() => {
                          if (reportData?.objHeader?.isLoaded) {
                            return toast.warn('Already Completed');
                          }
                          onComplete(
                            `/oms/LoadingPoint/CompletePacker?shipmentId=${reportData?.objHeader?.shipmentId}&actionBy=${profileData?.userId}&typeId=1&tlm=${values?.tlm?.value}&packerId=${values?.packerName?.value}`,

                            // actionType === "Auto"
                            //   ? shipmentId
                            //   : reportData?.objHeader?.shipmentId
                            null,
                            () => {
                              resetForm(initData);
                              setShipmentId(null);
                            },
                            true,
                          );
                        }}
                      >
                        Done
                      </button>
                    )}

                  {values?.type?.value === 5 && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={
                        reportData?.objHeader?.isOutdByLoadingSupervisor ||
                        reportData?.objHeader?.loadingSupervisorOutTime ||
                        reportData?.objHeader?.loadingSupervisorOutdBy
                      }
                      onClick={() => {
                        onComplete(
                          `/oms/LoadingPoint/CompletePacker?shipmentId=${reportData?.objHeader?.shipmentId}&actionBy=${profileData?.userId}&typeId=5`,

                          // actionType === "Auto"
                          //   ? shipmentId
                          //   : reportData?.objHeader?.shipmentId
                          null,
                          () => {
                            resetForm(initData);
                            setShipmentId(null);
                            setRowData([]);
                          },
                          true,
                        );
                      }}
                    >
                      OUT
                    </button>
                  )}
                </div>
              );
            }}
          >
            <Form>
              <div className="form-group  global-form row">
                {/* Report Type Common */}
                <div className="col-lg-3">
                  <NewSelect
                    name="type"
                    options={reportTypeDDL}
                    value={values?.type}
                    label="Type"
                    onChange={(valueOption) => {
                      setFieldValue('type', valueOption);
                      setRowData([]);
                      setReportData({});
                      setShowReport(false);

                      // packer forcely complete
                      if (valueOption?.value === 6) {
                        // get packer list & update
                        getPackerList(
                          `/mes/WorkCenter/GetWorkCenterListByTypeId?WorkCenterTypeId=1&AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`,

                          (resData) => {
                            // set ddl state
                            setPackerList(
                              resData?.map((item) => ({
                                ...item,
                                value: item?.workCenterId,
                                label: item?.workCenterName,
                              })),
                            );
                          },
                        );

                        // get permited to confirm packer forcely complete
                        getPermitedToConfirmPackerForce(
                          `/oms/SalesInformation/GetAllowForModification?Partid=22&UserId=${profileData?.userId}&UnitId=${selectedBusinessUnit?.value}`,
                        );
                      }
                    }}
                    placeholder="Type"
                  />
                </div>

                {/* Delivery Complete, , , Packer Forcely Complete */}
                {[1, 2, 4, 6].includes(values?.type?.value) && (
                  <>
                    {/* Delivery Complete, , Packer Forcely Complete */}
                    {[1, 2].includes(values?.type?.value) && (
                      <div className="col-lg-3">
                        <NewSelect
                          name="shipPoint"
                          options={[
                            { value: 0, label: 'All' },
                            ...shipPointDDL,
                          ]}
                          value={values?.shipPoint}
                          label="ShipPoint"
                          onChange={(valueOption) => {
                            setFieldValue('shipPoint', valueOption);
                          }}
                          placeholder="ShipPoint"
                        />
                      </div>
                    )}

                    {[4].includes(values?.type?.value) && (
                      <div className="col-lg-3">
                        <NewSelect
                          name="viewType"
                          options={[
                            { value: 1, label: 'Top Sheet' },
                            { value: 2, label: 'Details' },
                          ]}
                          value={values?.viewType}
                          label="View Type"
                          onChange={(valueOption) => {
                            setFieldValue('viewType', valueOption);
                            setShowReport(false);
                          }}
                          placeholder="View Type"
                        />
                      </div>
                    )}

                    {values?.type?.value === 1 && (
                      <FromDateToDateForm
                        obj={{
                          values,
                          setFieldValue,
                          type: 'datetime-local',
                          step: [4].includes(values?.type?.value) ? 1 : false,
                          onChange: () => {
                            setShowReport(false);
                          },
                        }}
                      />
                    )}

                    {/* Packer Forcely Complete */}
                    {values?.type?.value === 6 &&
                      packerForcelyCompleteFormField(values, setFieldValue)}

                    {/* Landing Data View Button */}
                    <IButton
                      onClick={() => {
                        // shift wise packer
                        if (values?.type?.value === 4) {
                          setShowReport(true);
                        }
                        // packer forcely complete
                        else if (values?.type?.value === 6) {
                          fetchPackerForceCompleteData({
                            getPackerForcelyCompleteData,
                            selectedBusinessUnit,
                            profileData,
                            values,
                          });
                        } else {
                          setShowReport(false);
                          getData(
                            profileData,
                            selectedBusinessUnit,
                            values,
                            getRowData,
                          );
                        }
                      }}
                    />
                  </>
                )}

                {/* QR In/Out */}
                {[3, 5].includes(values?.type?.value) && (
                  <>
                    <div className="col-lg-4 mb-2 mt-5">
                      <label className="mr-3">
                        <input
                          type="radio"
                          name="actionType"
                          checked={actionType === 'Manual'}
                          className="mr-1 pointer"
                          style={{ position: 'relative', top: '2px' }}
                          onChange={(e) => {
                            setActionType('Manual');
                            setValues({ ...initData, type: values?.type });

                            setShipmentId(null);
                            setReportData({});
                          }}
                        />
                        By Card Number
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="actionType"
                          checked={actionType === 'Auto'}
                          className="mr-1 pointer"
                          style={{ position: 'relative', top: '2px' }}
                          onChange={(e) => {
                            setActionType('Auto');
                            setValues({ ...initData, type: values?.type });
                            setShipmentId(null);
                            setReportData({});
                          }}
                        />
                        By QR Code
                      </label>
                    </div>
                    {reportData?.objHeader?.isLoaded && (
                      <p
                        style={{
                          textAlign: 'center',
                          fontSize: '16px',
                          fontWeight: 'bold',
                        }}
                        className="text-danger"
                      >
                        Packer Completed
                      </p>
                    )}
                    {selectedBusinessUnit?.value === 4 && (
                      <div className="col-lg-4 d-flex justify-content-between align-items-center mb-0">
                        {((values?.type?.value === 5 &&
                          reportData?.objHeader?.isOutdByLoadingSupervisor) ||
                          values?.type?.value === 3) && (
                          <>
                            {' '}
                            <h4
                              className="mb-0 font-weight-bold"
                              style={{ color: '#b22222' }}
                            >
                              Packer: {values?.packerName?.label}
                            </h4>
                            <h4
                              className="mb-0 font-weight-bold"
                              style={{ color: '#1c5d99' }}
                            >
                              TLM: {values?.tlm?.label}
                            </h4>
                          </>
                        )}
                      </div>
                    )}
                    <div className="col-lg-12"></div>
                    {['Auto'].includes(actionType) ? (
                      <div className="col-lg-3">
                        <div style={{ display: 'inline-block', width: '95%' }}>
                          <InputField
                            value={shipmentId}
                            label="Card Id"
                            name="shipmentId"
                            type="text"
                            disabled
                          />
                        </div>
                        <span
                          className="pl-1"
                          style={{ display: 'inline-block' }}
                        >
                          <i
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsQRCodeSHow(true);
                            }}
                            style={{ color: 'blue', cursor: 'pointer' }}
                            class="fa fa-qrcode"
                            aria-hidden="true"
                          ></i>
                        </span>
                      </div>
                    ) : (
                      <div className="col-lg-3 d-flex flex-row align-items-center">
                        <InputField
                          value={values?.shipmentCode}
                          label="Card Number"
                          name="shipmentCode"
                          style={{ flexGrow: 1 }}
                          type="text"
                          onChange={(e) => {
                            setFieldValue('shipmentCode', e.target.value);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === 13) {
                              handleCardNumberChange({
                                e,
                                setFieldValue,
                                getReportData,
                                getTLMDDL,
                                selectedBusinessUnit,
                                setShipPointIdForCementTlmLoadFromPacker,
                                getPackerList,
                                profileData,
                                setPackerList,
                              });
                            }
                          }}
                        />
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            // shipment value
                            const shipmentValue = {
                              target: { value: values?.shipmentCode || 0 },
                            };

                            // handle card number click
                            handleCardNumberChange({
                              e: shipmentValue,
                              setFieldValue,
                              getReportData,
                              getTLMDDL,
                              selectedBusinessUnit,
                              setShipPointIdForCementTlmLoadFromPacker,
                              getPackerList,
                              profileData,
                              setPackerList,
                            });
                          }}
                          className={`ml-2 bg-primary p-2 ${styles.cardNumberSearchBtn}`}
                        >
                          <ICon title={`Load details`}>
                            <i class="fa fa-search"></i>
                          </ICon>
                        </span>
                      </div>
                    )}

                    <div className="col-lg-3">
                      <InputField
                        value={values?.shippingPoint}
                        label="Shipping Point"
                        name="shippingPoint"
                        type="text"
                        onChange={(e) => {
                          setFieldValue('shippingPoint', e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.vehicleNumber}
                        label="Vehicle Number"
                        name="vehicleNumber"
                        type="text"
                        onChange={(e) => {
                          setFieldValue('vehicleNumber', e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.driver}
                        label="Driver"
                        name="driver"
                        type="text"
                        onChange={(e) => {
                          setFieldValue('driver', e.target.value);
                        }}
                      />
                    </div>
                    {/* <div className="col-lg-3">
                      <InputField
                        value={values?.packerName}
                        label="Packer Name"
                        name="packerName"
                        type="text"
                        onChange={(e) => {
                          setFieldValue("packerName", e.target.value);
                        }}
                      />
                    </div> */}

                    <div className="col-lg-3">
                      <NewSelect
                        name="packerName"
                        placeholder="Packer"
                        label="Packer"
                        isDisabled={values?.type?.value === 5}
                        options={packerList || []}
                        value={values?.packerName}
                        onChange={(valueOption) => {
                          setFieldValue('packerName', valueOption);
                          setFieldValue('tlm', '');

                          // if business unit in cement than load tlm ddl
                          if (selectedBusinessUnit?.value === 4) {
                            // get tlm ddl
                            getTLMDDL(
                              `/wms/AssetTransection/GetLabelNValueForDDL?BusinessUnitId=${
                                selectedBusinessUnit?.value
                              }&TypeId=1&RefferencePKId=${
                                valueOption?.value
                              }&ShipPointId=${shipPointIdForCementTlmLoadFromPacker ||
                                0}`,
                            );
                          }
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.deliveryDate}
                        label="Delivery Date"
                        name="deliveryDate"
                        type="date"
                        onChange={(e) => {
                          setFieldValue('deliveryDate', e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="tlm"
                        // options={[
                        //   { value: 1, label: "TLM-1" },
                        //   { value: 2, label: "TLM-2" },
                        //   { value: 3, label: "TLM-3" },
                        //   { value: 4, label: "TLM-4" },
                        //   { value: 5, label: "TLM-5" },
                        //   { value: 6, label: "TLM-6" },
                        // ]}
                        options={tlmDDL || []}
                        isDisabled={values?.type?.value === 5}
                        value={values?.tlm}
                        label="TLM"
                        onChange={(valueOption) => {
                          setFieldValue('tlm', valueOption);
                        }}
                        placeholder="TLM"
                      />
                    </div>
                  </>
                )}
              </div>

              <button
                type="submit"
                style={{ display: 'none' }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: 'none' }}
                ref={objProps?.resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>

              {/* <pre>{JSON.stringify(values, null, 1)}</pre> */}

              {/* Custom Table */}
              {(reportData?.objRow?.length ||
                packerForcelyCompleteData?.data?.length > 0 ||
                rowData?.data?.length > 0) && (
                <ICustomTable
                  ths={
                    chooseReportTableHeader(values, selectedBusinessUnit)
                    // Delivery Complete, ''
                    // [1, 2].includes(values?.type?.value)
                    //   ? headers_two
                    //   : [144].includes(selectedBusinessUnit?.value) // if business unit is 145 than show all header but if it's not than remove last header element
                    //   ? headers_one
                    //   : headers_one.slice(0, -2)

                    // Packer Forcely Complete
                    //   [6].includes(values?.type?.value) &&
                    //   packerForcelyCompleteTableHeader
                  }
                >
                  {chooseReportTableBody(values)}

                  {/* Table Footer */}
                  {[!6].includes(values?.type?.value) &&
                    scanQRCodeInOutDeliveryCompleteTableFooter(values)}
                </ICustomTable>
              )}

              <Route path="/transport-management/deliveryprocess/LoadingSupervisorInfo/view/:id/:shipmentCode">
                {({ history, match }) => (
                  <ViewModal
                    show={match != null}
                    id={match && match.params.id}
                    shipmentCode={match && match.params.shipmentCode}
                    history={history}
                    onHide={() => {
                      history.push(
                        '/transport-management/deliveryprocess/LoadingSupervisorInfo',
                      );
                    }}
                  />
                )}
              </Route>

              {/* QR Code Modal */}
              <IViewModal
                show={isQrCodeShow}
                onHide={() => setIsQRCodeSHow(false)}
              >
                <QRCodeScanner
                  QrCodeScannerCB={(result) => {
                    setIsQRCodeSHow(false);
                    setShipmentId(result);
                    getReportData(
                      // `/wms/Delivery/GetDeliveryPrintInfo?ShipmentId=${+result}`,
                      `/wms/Delivery/GetDeliveryPrintInfoByVehicleCardNumber?strCardNumber=${result}`,
                      (res) => {
                        getTLMDDL(
                          `/wms/AssetTransection/GetLabelNValueForDDL?BusinessUnitId=${
                            selectedBusinessUnit?.value
                          }&TypeId=1&RefferencePKId=${
                            selectedBusinessUnit?.value === 4
                              ? res?.objHeader?.packerId
                              : 1
                          }&ShipPointId=${res?.objHeader?.shipPointId || 0}`,
                        );
                        setShipPointIdForCementTlmLoadFromPacker(
                          res?.objHeader?.shipPointId,
                        );

                        getPackerList(
                          `/mes/WorkCenter/GetWorkCenterListByTypeId?WorkCenterTypeId=1&AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`,

                          (resData) => {
                            // set ddl state
                            setPackerList(
                              resData?.map((item) => ({
                                ...item,
                                value: item?.workCenterId,
                                label: item?.workCenterName,
                              })),
                            );
                          },
                        );

                        setFieldValue(
                          'shippingPoint',
                          res?.objHeader?.shipPointName || '',
                        );
                        setFieldValue(
                          'vehicleNumber',
                          res?.objHeader?.strVehicleName || '',
                        );
                        setFieldValue(
                          'driver',
                          res?.objHeader?.driverName || '',
                        );
                        setFieldValue(
                          'packerName',
                          res?.objHeader?.packerName || '',
                        );
                        setFieldValue(
                          'deliveryDate',
                          _dateFormatter(res?.objHeader?.pricingDate) || '',
                        );
                      },
                    );
                  }}
                />
              </IViewModal>

              {/* Shipping Info Details */}
              <IViewModal show={open} onHide={() => setOpen(false)}>
                <ShippingInfoDetails
                  obj={{
                    id: singleItem?.shipmentId,
                    shipmentCode: singleItem?.shipmentCode,
                    tlm: singleItem?.tlm,
                    setOpen,
                    getData,
                    values,
                    isActionable: false,
                  }}
                />
              </IViewModal>

              {/* Shipment Details Modal for Business Unit 144 */}
              <IViewModal
                show={shipmentModalOpen}
                onHide={() => setShipmentModalOpen(false)}
              >
                <ShipmentReportModal
                  objProps={{
                    shipmentDetails,
                    shipmentDetailsLoading,
                    selectedBusinessUnit,
                  }}
                />
              </IViewModal>

              {/* PowerBI Report */}
              {showReport && (
                <PowerBIReport
                  reportId={reportId}
                  groupId={groupId}
                  parameterValues={parameterValues(values)}
                  parameterPanel={false}
                />
              )}
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
