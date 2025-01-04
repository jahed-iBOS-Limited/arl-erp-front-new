import CryptoJS from 'crypto-js';
import { Formik } from 'formik';
import moment from 'moment';
import './style.css';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { imarineBaseUrl } from '../../../../App';
import ICustomCard from '../../../_helper/_customCard';
import Loading from '../../../_helper/_loading';
import PaginationSearch from '../../../_helper/_search';
import NewSelect from '../../../_helper/_select';
import PaginationTable from '../../../_helper/_tablePagination';
import IViewModal from '../../../_helper/_viewModal';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import useAxiosPut from '../../../_helper/customHooks/useAxiosPut';
import BLModal from './blModal';
import Details from './bookingDetails';
import ChargesModal from './chargesModal';
import CommonInvoice from './commonInvoice';
import CommonStatusUpdateModal from './commonStatusUpdateModal';
import ConfirmModal from './confirmModal';
import DeliveryNoteModal from './deliveryNoteModal';
import DocumentModal from './documentModal';
import FreightCargoReceipt from './freightCargoReceipt';
import HBLCodeGNModal from './hblCodeGNModal';
import { cancelHandler, statusReturn } from './helper';
import ManifestModal from './manifestModal';
import MasterHBAWModal from './masterHAWBModal';
import MasterHBLModal from './masterHBLModal';
import ReceiveModal from './receiveModal';
import TransportModal from './transportModal';
import BillGenerate from './bill';
import SeaAirMasterBL from './SeaAirMasterBl';
const validationSchema = Yup.object().shape({});
function BookingList() {
  const { profileData } = useSelector(
    (state) => state?.authData || {},
    shallowEqual,
  );
  const { token } = useSelector(
    (state) => state?.authData.tokenData,
    shallowEqual,
  );
  const [
    shipBookingReqLanding,
    getShipBookingReqLanding,
    bookingReqLandingLoading,
    setShipBookingReqLanding,
  ] = useAxiosGet();

  const [
    ,
    deleteBookingRequestById,
    deleteBookingRequestByIdLoading,
  ] = useAxiosPut();

  const [isModalShowObj, setIsModalShowObj] = React.useState({});
  const [rowClickData, setRowClickData] = React.useState({});
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  // edit booking list
  const handleEditBookingList = (item) => {
    const userID = profileData?.userId;
    const targetUrl =
      process.env.NODE_ENV !== 'production'
        ? 'http://localhost:3010'
        : 'https://cargo.ibos.io/';

    // Encrypt the token and userID using base64 encoding
    const encryptedToken = CryptoJS.enc.Base64.stringify(
      CryptoJS.enc.Utf8.parse(token),
    );
    const encryptedUserID = CryptoJS.enc.Base64.stringify(
      CryptoJS.enc.Utf8.parse(userID),
    );
    const superAdmin = CryptoJS.enc.Base64.stringify(
      CryptoJS.enc.Utf8.parse('superAdmin'),
    );

    window.open(
      `${targetUrl}/edit-from-erp/${item?.bookingRequestId}?token=${encryptedToken}&userID=${encryptedUserID}&key=${superAdmin}`,
      '_blank',
    );
  };

  useEffect(() => {
    commonLandingApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

  const commonLandingApi = (
    searchValue,
    PageNo = pageNo,
    PageSize = pageSize,
    modeOfTransportId = 1,
  ) => {
    getShipBookingReqLanding(
      `${imarineBaseUrl}/domain/ShippingService/GetShipBookingRequestLanding?userId=${
        profileData?.userReferenceId
      }&userTypeId=${0}&refrenceId=${
        profileData?.userReferenceId
      }&viewOrder=desc&PageNo=${PageNo}&PageSize=${PageSize}&search=${searchValue ||
        ''}&modeOfTransportId=${modeOfTransportId}`,
    );
  };

  const selectedRow = shipBookingReqLanding?.data?.filter(
    (item) => item?.isCheck,
  );

  // const [selectedRow, setSelectedRow] = useState([]);
  const getDisabledCheckbox = (item) => {
    // 1 =  Air
    if (item?.modeOfTransportId === 1 && item?.isAirmasterBlGenarate) {
      return true;
    }
    // 2 = Sea
    if (item?.modeOfTransportId === 2 && item?.isSeamasterBlGenarate) {
      return true;
    }
    // 3 =  Sea-Air
    if (
      item?.modeOfTransportId === 3 &&
      item?.isSeamasterBlGenarate &&
      item?.isAirmasterBlGenarate
    ) {
      return true;
    }
    if (
      !item?.isPlaning ||
      (selectedRow.length > 0 &&
        selectedRow?.[0]?.freightAgentReferenceId !==
          item?.freightAgentReferenceId)
    ) {
      return true;
    }
    if (
      selectedRow.length > 0 &&
      selectedRow?.[0]?.modeOfTransport !== item?.modeOfTransport
    ) {
      return true;
    }

    return false;
  };

  // const handleSelectRow = (item) => (e) => {
  //   if (e.target.checked) {
  //     // Add the item to the selectedRow array
  //     setSelectedRow((prev) => [...prev, item]);
  //   } else {
  //     // Uncheck and clear the selectedRow array
  //     setSelectedRow((prev) =>
  //       prev.filter((row) => row?.bookingRequestId !== item?.bookingRequestId),
  //     );
  //   }
  // };

  return (
    <div className="booking-list-wrapper">
      <Formik
        enableReinitialize={true}
        initialValues={{
          modeOfTransport: {
            value: 1,
            label: 'Air',
          },
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values, resetForm }) => (
          <ICustomCard
            title="Booking List"
            renderProps={() => {
              return (
                <button
                  onClick={() => {
                    if (
                      selectedRow.length > 0 &&
                      values?.modeOfTransport?.label === 'Sea'
                    ) {
                      setIsModalShowObj({
                        ...isModalShowObj,
                        isMasterHBL: true,
                      });
                    } else if (
                      selectedRow.length > 0 &&
                      values?.modeOfTransport?.label === 'Air'
                    ) {
                      setIsModalShowObj({
                        ...isModalShowObj,
                        isMasterHBAW: true,
                      });
                    } else {
                      setIsModalShowObj({
                        ...isModalShowObj,
                        isSeaAirMasterBL: true,
                      });
                    }
                  }}
                  className="ml-2 btn btn-primary"
                  title="Show Invoice"
                  style={{
                    display: selectedRow?.length > 0 ? 'block' : 'none',
                  }}
                >
                  {selectedRow?.length > 0 &&
                    values?.modeOfTransport?.value === 2 &&
                    'Generate Master HBL'}
                  {selectedRow?.length > 0 &&
                    values?.modeOfTransport?.value === 1 &&
                    'Generate Master HAWB'}
                  {selectedRow?.length > 0 &&
                    values?.modeOfTransport?.value === 3 &&
                    'Generate Master Sea-Air BL'}
                </button>
              );
            }}
          >
            <>
              {(bookingReqLandingLoading ||
                deleteBookingRequestByIdLoading) && <Loading />}

              <div className="row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="modeOfTransport"
                    options={[
                      {
                        value: 1,
                        label: 'Air',
                      },
                      {
                        value: 2,
                        label: 'Sea',
                      },
                      {
                        value: 3,
                        label: 'Sea-Air',
                      },
                    ]}
                    value={values?.modeOfTransport || ''}
                    label="Booking Type"
                    onChange={(valueOption) => {
                      setFieldValue('modeOfTransport', valueOption);
                      commonLandingApi(
                        null,
                        pageNo,
                        pageSize,
                        valueOption?.value,
                      );
                    }}
                    placeholder="Booking Type"
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>
              <div className="col-lg-12">
                <PaginationSearch
                  placeholder="Booking No, BL No, Search..."
                  paginationSearchHandler={(searchValue) => {
                    commonLandingApi(
                      searchValue,
                      1,
                      100,
                      values?.modeOfTransport?.value,
                    );
                  }}
                />
                <div className="table-responsive">
                  <table className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        <th
                          style={{
                            minWidth: '40px',
                          }}
                        ></th>
                        <th>SL</th>
                        <th
                          style={{
                            minWidth: '80px',
                          }}
                        >
                          Booking No
                        </th>
                        <th
                          style={{
                            minWidth: '120px',
                          }}
                        >
                          Contact No
                        </th>
                        <th
                          style={{
                            minWidth: '120px',
                          }}
                        >
                          Shipper Name
                        </th>
                        <th
                          style={{
                            minWidth: '120px',
                          }}
                        >
                          Book Date
                        </th>
                        <th
                          style={{
                            minWidth: '120px',
                          }}
                        >
                          Email
                        </th>
                        <th
                          style={{
                            minWidth: '120px',
                          }}
                        >
                          Country
                        </th>
                        <th
                          style={{
                            minWidth: '120px',
                          }}
                        >
                          Delivery Port
                        </th>
                        <th style={{ minWidth: '50px' }}>HBL No.</th>
                        <th style={{ minWidth: '50px' }}> Master BL No</th>
                        {/* <th
                           style={{
                             minWidth: '120px',
                           }}
                         >
                           Rate
                         </th> */}
                        <th
                          style={{
                            minWidth: '63px',
                          }}
                        >
                          Status
                        </th>
                        <th
                          style={{
                            minWidth: '70px',
                          }}
                        >
                          Edit
                        </th>
                        <th
                          style={{
                            minWidth: '80px',
                          }}
                        >
                          Details
                        </th>
                        <th
                          style={{
                            minWidth: '80px',
                          }}
                        >
                          Cancel
                        </th>
                        <th
                          style={{
                            minWidth: '80px',
                          }}
                        >
                          Confirm
                        </th>

                        <th
                          style={{
                            minWidth: '43px',
                          }}
                        >
                          EPB
                        </th>
                        <th
                          style={{
                            minWidth: '66px',
                          }}
                        >
                          Receive
                        </th>

                        <th
                          style={{
                            minWidth: '65px',
                          }}
                        >
                          Stuffing
                        </th>

                        <th
                          style={{
                            minWidth: '140px',
                          }}
                        >
                          Shipment Planning
                        </th>
                        <th style={{ minWidth: '50px' }}>FC</th>
                        <th
                          style={{
                            minWidth: '60px',
                          }}
                        >
                          Manifest
                        </th>
                        <th
                          style={{
                            minWidth: '60px',
                          }}
                        >
                          BL
                        </th>
                        <th
                          style={{
                            minWidth: '58px',
                          }}
                        >
                          HBL
                        </th>
                        <th
                          style={{
                            minWidth: '146px',
                          }}
                        >
                          Charges
                        </th>
                        <th
                          style={{
                            minWidth: '117px',
                          }}
                        >
                          Doc Checklist
                        </th>
                        <th
                          style={{
                            minWidth: '72px',
                          }}
                        >
                          Dispatch
                        </th>
                        <th
                          style={{
                            minWidth: '149px',
                          }}
                        >
                          Customs Clearance
                        </th>
                        <th
                          style={{
                            minWidth: '80px',
                          }}
                        >
                          In Transit
                        </th>
                        <th
                          style={{
                            minWidth: '137px',
                          }}
                        >
                          Des. Port Receive
                        </th>
                        <th
                          style={{
                            minWidth: '80px',
                          }}
                        >
                          Delivered
                        </th>
                        <th
                          style={{
                            minWidth: '300px',
                          }}
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {shipBookingReqLanding?.data?.length > 0 &&
                        shipBookingReqLanding?.data?.map((item, i) => {
                          let isCompletedMasterBl = false;

                          // 1 =  Air
                          if (
                            item?.modeOfTransportId === 1 &&
                            item?.isAirmasterBlGenarate
                          ) {
                            isCompletedMasterBl = true;
                          }
                          // 2 = Sea
                          if (
                            item?.modeOfTransportId === 2 &&
                            item?.isSeamasterBlGenarate
                          ) {
                            isCompletedMasterBl = true;
                          }
                          // 3 =  Sea-Air
                          if (
                            item?.modeOfTransportId === 3 &&
                            item?.isSeamasterBlGenarate &&
                            item?.isAirmasterBlGenarate
                          ) {
                            isCompletedMasterBl = true;
                          }

                          return (
                            <>
                              <tr key={i + 1}>
                                <td>
                                  {isCompletedMasterBl ? (
                                    <></>
                                  ) : (
                                    <>
                                      {' '}
                                      <input
                                        type="checkbox"
                                        checked={item?.isCheck}
                                        disabled={getDisabledCheckbox(item)}
                                        onChange={(e) => {
                                          const copyPrvData = [
                                            ...shipBookingReqLanding?.data,
                                          ];
                                          copyPrvData[i].isCheck =
                                            e.target.checked;
                                          setShipBookingReqLanding({
                                            ...shipBookingReqLanding,
                                            data: copyPrvData,
                                          });
                                        }}
                                      />
                                    </>
                                  )}
                                </td>
                                <td className="text-center">{i + 1}</td>
                                <td className="text-left">
                                  {item?.bookingRequestCode}
                                </td>
                                <td className="text-left">
                                  {item?.shipperContact}
                                </td>
                                <td className="text-left">
                                  {item?.shipperName}
                                </td>
                                <td className="text-left">
                                  {moment(item?.createdAt).format('DD-MM-YYYY')}
                                </td>
                                <td className="text-left">
                                  {item?.shipperEmail}
                                </td>
                                <td className="text-left">
                                  {item?.shipperCountry}
                                </td>
                                <td className="text-left">
                                  {item?.portOfLoading}
                                </td>
                                <td className="text-left">{item?.hblnumber}</td>
                                <td className="text-left">
                                  {item?.seaMasterBlCode &&
                                  item?.airMasterBlCode ? (
                                    <>
                                      {item?.seaMasterBlCode}{' '}
                                      {item?.airMasterBlCode
                                        ? ', ' + item?.airMasterBlCode
                                        : ''}
                                    </>
                                  ) : (
                                    item?.seaMasterBlCode ||
                                    item?.airMasterBlCode ||
                                    ''
                                  )}
                                </td>
                                <td>
                                  <span>{statusReturn(item)}</span>
                                </td>
                                <td className="text-center">
                                  <span>
                                    <button
                                      // disabled={!profileData?.superUser}
                                      className="btn btn-sm btn-primary"
                                      onClick={() =>
                                        handleEditBookingList(item)
                                      }
                                    >
                                      <i
                                        class="fa fa-pencil-square-o"
                                        aria-hidden="true"
                                      ></i>
                                    </button>
                                  </span>
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
                                      disabled={item?.isConfirm}
                                      className="btn btn-sm btn-primary"
                                      onClick={() => {
                                        cancelHandler({
                                          item: {
                                            ...item,
                                            userId:
                                              profileData?.userReferenceId,
                                          },
                                          deleteBookingRequestById,
                                          CB: () => {
                                            commonLandingApi(
                                              null,
                                              pageNo,
                                              pageSize,
                                              values?.modeOfTransport?.value,
                                            );
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
                                          ? 'btn btn-sm btn-success px-1 py-1'
                                          : 'btn btn-sm btn-warning px-1 py-1'
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
                                  {item?.modeOfTransport === 'Air' && (
                                    <span>
                                      <button
                                        // disabled={item?.isHbl}
                                        className={
                                          'btn btn-sm btn-warning px-1 py-1'
                                        }
                                        onClick={() => {
                                          setRowClickData(item);
                                          setIsModalShowObj({
                                            ...isModalShowObj,
                                            isEPB: true,
                                          });
                                        }}
                                      >
                                        EPB
                                      </button>
                                    </span>
                                  )}
                                </td>
                                <td>
                                  <span>
                                    <button
                                      disabled={item?.isReceived}
                                      className={
                                        item?.isReceived
                                          ? 'btn btn-sm btn-success px-1 py-1'
                                          : 'btn btn-sm btn-warning px-1 py-1'
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
                                  {item?.modeOfTransport === 'Sea' && (
                                    <>
                                      <span>
                                        <button
                                          disabled={item?.isStuffing}
                                          className={
                                            item?.isStuffing
                                              ? 'btn btn-sm btn-success px-1 py-1'
                                              : 'btn btn-sm btn-warning px-1 py-1'
                                          }
                                          onClick={() => {
                                            setRowClickData({
                                              ...item,
                                              title: 'Stuffing',
                                              isUpdateDate: 'stuffingDate',
                                              isUpdateKey: 'isStuffing',
                                            });
                                            setIsModalShowObj({
                                              ...isModalShowObj,

                                              isCommonModalShow: true,
                                            });
                                          }}
                                        >
                                          Stuffing
                                        </button>
                                      </span>
                                    </>
                                  )}
                                </td>
                                <td>
                                  <span>
                                    <button
                                      disabled={
                                        item?.isPlaning || !item?.isConfirm
                                      }
                                      className={
                                        item?.isPlaning
                                          ? 'btn btn-sm btn-success px-1 py-1'
                                          : 'btn btn-sm btn-warning px-1 py-1'
                                      }
                                      onClick={() => {
                                        setRowClickData(item);
                                        setIsModalShowObj({
                                          ...isModalShowObj,
                                          isPlaning: true,
                                        });
                                      }}
                                    >
                                      Shipment Planning
                                    </button>
                                  </span>
                                </td>
                                <td>
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
                                      FC
                                    </button>
                                  </span>
                                </td>
                                <td>
                                  <span>
                                    <button
                                      className="btn btn-sm btn-warning px-1 py-1"
                                      onClick={() => {
                                        setRowClickData(item);
                                        setIsModalShowObj({
                                          ...isModalShowObj,
                                          isManifest: true,
                                        });
                                      }}
                                    >
                                      Manifest
                                    </button>
                                  </span>
                                </td>

                                <td>
                                  <span>
                                    <button
                                      disabled={item?.isBl}
                                      className={
                                        item?.isBl
                                          ? 'btn btn-sm btn-success px-1 py-1'
                                          : 'btn btn-sm btn-warning px-1 py-1'
                                      }
                                      onClick={() => {
                                        setRowClickData(item);
                                        setIsModalShowObj({
                                          ...isModalShowObj,
                                          isBlModal: true,
                                        });
                                      }}
                                    >
                                      {item?.modeOfTransport === 'Air'
                                        ? 'MAWB '
                                        : 'MBL'}
                                    </button>
                                  </span>
                                </td>
                                <td>
                                  <span>
                                    <button
                                      // disabled={item?.isHbl}
                                      className={
                                        item?.isHbl
                                          ? 'btn btn-sm btn-success px-1 py-1'
                                          : 'btn btn-sm btn-warning px-1 py-1'
                                      }
                                      onClick={() => {
                                        setRowClickData(item);
                                        setIsModalShowObj({
                                          ...isModalShowObj,
                                          isHBCodeGN: true,
                                        });
                                      }}
                                    >
                                      {item?.modeOfTransport === 'Air'
                                        ? 'HAWB'
                                        : 'HBL'}
                                    </button>
                                  </span>
                                </td>
                                <td>
                                  <span>
                                    <button
                                      disabled={!isCompletedMasterBl}
                                      className={
                                        item?.isCharges
                                          ? 'btn btn-sm btn-success px-1 py-1'
                                          : 'btn btn-sm btn-warning px-1 py-1'
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
                                          ? 'btn btn-sm btn-success px-1 py-1'
                                          : 'btn btn-sm btn-warning px-1 py-1'
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
                                          ? 'btn btn-sm btn-success px-1 py-1'
                                          : 'btn btn-sm btn-warning px-1 py-1'
                                      }
                                      onClick={() => {
                                        setRowClickData({
                                          ...item,
                                          title: 'Dispatch',
                                          isUpdateDate: 'dispatchDate',
                                          isUpdateKey: 'isDispatch',
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
                                          ? 'btn btn-sm btn-success px-1 py-1'
                                          : 'btn btn-sm btn-warning px-1 py-1'
                                      }
                                      onClick={() => {
                                        setRowClickData({
                                          ...item,
                                          title: 'Customs Clearance',
                                          isUpdateDate: 'customsClearDt',
                                          isUpdateKey: 'isCustomsClear',
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
                                          ? 'btn btn-sm btn-success px-1 py-1'
                                          : 'btn btn-sm btn-warning px-1 py-1'
                                      }
                                      onClick={() => {
                                        setRowClickData({
                                          ...item,
                                          title: 'In Transit',
                                          isUpdateDate: 'inTransit',
                                          isUpdateKey: 'isInTransit',
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
                                          ? 'btn btn-sm btn-success px-1 py-1'
                                          : 'btn btn-sm btn-warning px-1 py-1'
                                      }
                                      onClick={() => {
                                        setRowClickData({
                                          ...item,
                                          title: 'Des. Port Receive',
                                          isUpdateDate: 'destPortReceive',
                                          isUpdateKey: 'isDestPortReceive',
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
                                          ? 'btn btn-sm btn-success px-1 py-1'
                                          : 'btn btn-sm btn-warning px-1 py-1'
                                      }
                                      onClick={() => {
                                        setRowClickData({
                                          ...item,
                                          title: 'Delivered',
                                          isUpdateDate: 'buyerReceive',
                                          isUpdateKey: 'isBuyerReceive',
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
                                      display: 'flex',
                                      gap: '5px',
                                      alignItems: 'center',
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
                                            isCommonInvoice: true,
                                          });
                                        }}
                                      >
                                        Invoice
                                      </button>
                                    </span>
                                    <span>
                                      <button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => {
                                          setRowClickData(item);
                                          setIsModalShowObj({
                                            ...isModalShowObj,
                                            isBill: true,
                                          });
                                        }}
                                      >
                                        Bill Payment
                                      </button>
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            </>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
              {shipBookingReqLanding?.data?.length > 0 && (
                <PaginationTable
                  count={shipBookingReqLanding?.totalCount}
                  setPositionHandler={(pageNo, pageSize) => {
                    commonLandingApi(
                      null,
                      pageNo,
                      pageSize,
                      values?.modeOfTransport?.value,
                    );
                  }}
                  values={values}
                  paginationState={{
                    pageNo,
                    setPageNo,
                    pageSize,
                    setPageSize,
                  }}
                />
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
                        commonLandingApi(
                          null,
                          pageNo,
                          pageSize,
                          values?.modeOfTransport?.value,
                        );
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
                        commonLandingApi(
                          null,
                          pageNo,
                          pageSize,
                          values?.modeOfTransport?.value,
                        );
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
                    title="Shipment planning"
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
                        commonLandingApi(
                          null,
                          pageNo,
                          pageSize,
                          values?.modeOfTransport?.value,
                        );
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
              {/* Manifest modal */}
              {isModalShowObj?.isManifest && (
                <>
                  <IViewModal
                    title="Manifest"
                    show={isModalShowObj?.isManifest}
                    onHide={() => {
                      setIsModalShowObj({
                        ...isModalShowObj,
                        isManifest: false,
                      });
                    }}
                  >
                    <ManifestModal rowClickData={rowClickData} />
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
                        commonLandingApi(
                          null,
                          pageNo,
                          pageSize,
                          values?.modeOfTransport?.value,
                        );
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
                        commonLandingApi(
                          null,
                          pageNo,
                          pageSize,
                          values?.modeOfTransport?.value,
                        );
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
                    title="FC"
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

              {/* invoice modal */}
              {isModalShowObj?.isCommonInvoice && (
                <>
                  <IViewModal
                    title="Invoice"
                    show={isModalShowObj?.isCommonInvoice}
                    onHide={() => {
                      setIsModalShowObj({
                        ...isModalShowObj,
                        isCommonInvoice: false,
                      });
                    }}
                  >
                    <CommonInvoice rowClickData={rowClickData} />
                  </IViewModal>
                </>
              )}
              {/* bill modal */}
              {isModalShowObj?.isBill && (
                <>
                  <IViewModal
                    title="Bill Payment"
                    show={isModalShowObj?.isBill}
                    onHide={() => {
                      setIsModalShowObj({
                        ...isModalShowObj,
                        isBill: false,
                      });
                    }}
                  >
                    <BillGenerate
                      rowClickData={rowClickData}
                      CB={() => {
                        commonLandingApi(
                          null,
                          pageNo,
                          pageSize,
                          values?.modeOfTransport?.value,
                        );
                        setIsModalShowObj({
                          ...isModalShowObj,
                          isBill: false,
                        });
                        setRowClickData({});
                      }}
                    />
                  </IViewModal>
                </>
              )}
              {/* Common Modal */}
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
                        commonLandingApi(
                          null,
                          pageNo,
                          pageSize,
                          values?.modeOfTransport?.value,
                        );
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

              {/* BL Modal */}
              {isModalShowObj?.isBlModal && (
                <>
                  <IViewModal
                    title={
                      rowClickData?.modeOfTransport === 'Air' ? 'MAWB' : 'MBL'
                    }
                    show={isModalShowObj?.isBlModal}
                    onHide={() => {
                      setIsModalShowObj({
                        ...isModalShowObj,
                        isBlModal: false,
                      });
                    }}
                  >
                    <BLModal
                      rowClickData={rowClickData}
                      CB={() => {
                        commonLandingApi(
                          null,
                          pageNo,
                          pageSize,
                          values?.modeOfTransport?.value,
                        );
                        setIsModalShowObj({
                          ...isModalShowObj,
                          isBlModal: false,
                        });
                        setRowClickData({});
                      }}
                    />
                  </IViewModal>
                </>
              )}

              {/* HBCode GN Modal */}
              {isModalShowObj?.isHBCodeGN && (
                <IViewModal
                  title={`${
                    rowClickData?.modeOfTransport === 'Air' ? 'HAWB' : 'HBL'
                  } Report`}
                  show={isModalShowObj?.isHBCodeGN}
                  onHide={() => {
                    setIsModalShowObj({
                      ...isModalShowObj,
                      isHBCodeGN: false,
                    });
                    setRowClickData({});
                  }}
                >
                  <HBLCodeGNModal
                    rowClickData={rowClickData}
                    CB={() => {
                      commonLandingApi(
                        null,
                        pageNo,
                        pageSize,
                        values?.modeOfTransport?.value,
                      );
                    }}
                  />
                </IViewModal>
              )}

              {/* EPB modal */}
              {isModalShowObj?.isEPB && (
                <>
                  <IViewModal
                    title={`EPB`}
                    show={isModalShowObj?.isEPB}
                    onHide={() => {
                      setIsModalShowObj({
                        ...isModalShowObj,
                        isEPB: false,
                      });
                      setRowClickData({});
                    }}
                  >
                    <HBLCodeGNModal
                      rowClickData={rowClickData}
                      CB={() => {
                        commonLandingApi(
                          null,
                          pageNo,
                          pageSize,
                          values?.modeOfTransport?.value,
                        );
                      }}
                      isEPBInvoice={true}
                    />
                  </IViewModal>
                </>
              )}
              {/* Master Bl Modal */}
              {isModalShowObj?.isMasterHBL && (
                <>
                  <IViewModal
                    title={'Master BL'}
                    show={isModalShowObj?.isMasterHBL}
                    onHide={() => {
                      setIsModalShowObj({
                        ...isModalShowObj,
                        isMasterHBL: false,
                      });
                    }}
                  >
                    <MasterHBLModal
                      selectedRow={selectedRow}
                      CB={() => {
                        commonLandingApi(
                          null,
                          pageNo,
                          pageSize,
                          values?.modeOfTransport?.value,
                        );
                        setIsModalShowObj({
                          ...isModalShowObj,
                          isMasterHBL: false,
                        });
                        setRowClickData({});
                      }}
                    />
                  </IViewModal>
                </>
              )}

              {/* Master HBAW Modal */}
              {isModalShowObj?.isMasterHBAW && (
                <>
                  <IViewModal
                    title={'Master HBAW'}
                    show={isModalShowObj?.isMasterHBAW}
                    onHide={() => {
                      setIsModalShowObj({
                        ...isModalShowObj,
                        isMasterHBAW: false,
                      });
                    }}
                  >
                    <MasterHBAWModal
                      selectedRow={selectedRow}
                      CB={() => {
                        commonLandingApi(
                          null,
                          pageNo,
                          pageSize,
                          values?.modeOfTransport?.value,
                        );
                        setIsModalShowObj({
                          ...isModalShowObj,
                          isMasterHBAW: false,
                        });
                        setRowClickData({});
                      }}
                    />
                  </IViewModal>
                </>
              )}
              {/* Master Sea Air Modal */}
              {isModalShowObj?.isSeaAirMasterBL && (
                <>
                  <IViewModal
                    title={'Sea Air Master BL'}
                    show={isModalShowObj?.isSeaAirMasterBL}
                    onHide={() => {
                      setIsModalShowObj({
                        ...isModalShowObj,
                        isSeaAirMasterBL: false,
                      });
                    }}
                  >
                    <SeaAirMasterBL
                      selectedRow={selectedRow}
                      CB={() => {
                        commonLandingApi(
                          null,
                          pageNo,
                          pageSize,
                          values?.modeOfTransport?.value,
                        );
                        setIsModalShowObj({
                          ...isModalShowObj,
                          isSeaAirMasterBL: false,
                        });
                        setRowClickData({});
                      }}
                    />
                  </IViewModal>
                </>
              )}

              {/* view info */}
              {isModalShowObj?.isView && (
                <>
                  {' '}
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
            </>
          </ICustomCard>
        )}
      </Formik>
    </div>
  );
}

export default BookingList;
