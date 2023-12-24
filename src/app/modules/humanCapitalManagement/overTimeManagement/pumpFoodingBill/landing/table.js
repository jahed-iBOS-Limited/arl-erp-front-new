/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import ICard from '../../../../_helper/_card';
import IConfirmModal from '../../../../_helper/_confirmModal';
import { _dateFormatter } from '../../../../_helper/_dateFormate';
import { _firstDateofMonth } from '../../../../_helper/_firstDateOfCurrentMonth';
import IDelete from '../../../../_helper/_helperIcons/_delete';
import InputField from '../../../../_helper/_inputField';
import Loading from '../../../../_helper/_loading';
import { getDownlloadFileView_Action } from '../../../../_helper/_redux/Actions';
import NewSelect from '../../../../_helper/_select';
import PaginationTable from '../../../../_helper/_tablePagination';
import { _todayDate } from '../../../../_helper/_todayDate';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import IButton from '../../../../_helper/iButton';
import { approvePumpFoodingBill, deletePumpFoodingBill } from '../helper';

const initData = {
  fromDate: _firstDateofMonth(),
  toDate: _todayDate(),
  status: { value: '', label: 'All' },
  workplace: { value: 0, label: 'All' },
  warehouse: { value: 0, label: 'All' },
};

export const headers = [
  'SL',
  'Employee Name',
  'Enroll',
  'Workplace',
  'Designation',
  'Start Date',
  'Start Time',
  'End Date',
  'End Time',
  // "Hours",
  'Taka',
  'Approve Amount',
  'Remarks',
  'Action',
];

const PumpFoodingBillLanding = () => {
  const history = useHistory();
  const printRef = useRef();
  const dispatch = useDispatch();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [rowData, getRowData, isLoading, setRowData] = useAxiosGet();
  const [
    workplaceDDL,
    getWorkplaceDDL,
    isWorkpalceDDLLoading,
    setWorkplaceDDL,
  ] = useAxiosGet();
  const [
    wareHouseDDL,
    getWareHouseDDL,
    isWareHouseDDLLoading,
    setWareHouseDDL,
  ] = useAxiosGet();
  const [loading, setLoading] = useState(false);

  // get user profile data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const getData = (values, pageNo, pageSize) => {
    const url = `/hcm/MenuListOfFoodCorner/GetPumpFoodingBillPagination?BusinessUnitId=${buId}&warehouseId=${values?.warehouse?.value}&WorkPlaceId=${values?.workplace?.value}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}&PageNo=${pageNo}&PageSize=${pageSize}&ViewOrder=desc&Status=${values?.status?.value}`;

    getRowData(url, (resData) => {
      setRowData({
        ...resData,
        data: resData?.data?.map((item) => {
          return {
            ...item,
            isSelect: false,
          };
        }),
      });
    });
  };

  useEffect(() => {
    getData(initData, pageNo, pageSize);
  }, [accId, buId]);

  //Load DDL

  useEffect(() => {
    getWorkplaceDDL(
      `/hcm/TrustManagement/GetWorkPlacePeopleDeskDDL?businessUnitId=${buId}`,
      (data) => {
        const DDL = [{ value: 0, label: 'All' }, ...data];
        setWorkplaceDDL(DDL);
      },
    );

    //get warehouse DDL
    getWareHouseDDL(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&PlantId=0&OrgUnitTypeId=8`,
      (data) => {
        const DDL = [{ value: 0, label: 'All' }, ...data];
        setWareHouseDDL(DDL);
      },
    );
  }, [accId, buId, userId]);

  // set PositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getData(values, pageNo, pageSize);
  };

  const deleteHandler = (id, values) => {
    const objProps = {
      title: 'Are You Sure?',
      message: 'Are you sure you want to delete this bill?',
      yesAlertFunc: () => {
        deletePumpFoodingBill(id, setLoading, () => {
          getData(values, pageNo, pageSize);
        });
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(objProps);
  };

  const approveHandler = (values) => {
    const selectedItems = rowData?.data?.filter((item) => item?.isSelected);
    if (selectedItems?.length < 1) {
      return toast.warn('Please select at least one item!');
    }
    const payload = selectedItems?.map((item) => {
      return {
        autoId: item?.autoId,
        employeeId: item?.employeeId,
        businessUnitId: buId,
        approveAmount: item?.billAmount,
        insertBy: userId,
      };
    });
    approvePumpFoodingBill(payload, setLoading, () => {
      getData(values, pageNo, pageSize);
    });
  };

  const rowDataHandler = (name, index, value) => {
    let _data = [...rowData?.data];
    _data[index][name] = value;
    setRowData({
      ...rowData,
      data: _data,
    });
  };

  const allSelect = (value) => {
    let _data = [...rowData?.data];
    const modify = _data.map((item) => {
      return {
        ...item,
        isSelected: value,
      };
    });
    setRowData({
      ...rowData,
      data: modify,
    });
  };

  const selectedAll = () => {
    return rowData?.data?.length > 0 &&
      rowData?.data?.filter((item) => item?.isSelected)?.length ===
        rowData?.data?.length
      ? true
      : false;
  };

  let totalBillAmount = 0,
    totalApprovedAmount = 0;

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => (
          <ICard
            isShowPrintBtn={true}
            componentRef={printRef}
            title="Pump Fooding Bill"
            isCreteBtn={true}
            createHandler={() => {
              history.push(
                `/human-capital-management/overtime-management/pumpfoodingbill/entry`,
              );
            }}
          >
            {(isLoading ||
              loading ||
              isWareHouseDDLLoading ||
              isWorkpalceDDLLoading) && <Loading />}

            <form className="form form-label-right">
              <div className="global-form">
                <div className="row">
                  <div className="col-lg-3">
                    <InputField
                      label="From Date"
                      placeholder="From Date"
                      value={values?.fromDate}
                      name="fromDate"
                      type="date"
                      max={values?.toDate}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      label="To Date"
                      placeholder="To Date"
                      value={values?.toDate}
                      name="toDate"
                      type="date"
                      min={values?.fromDate}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      options={[
                        { value: '', label: 'All' },
                        { value: 1, label: 'UnApproved' },
                        { value: 2, label: 'Approved' },
                      ]}
                      label="Status"
                      placeholder="Status"
                      value={values?.status}
                      name="status"
                      onChange={(e) => {
                        setFieldValue('status', e);
                        setRowData([]);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      options={workplaceDDL || []}
                      label="Workplace"
                      placeholder="Workplace"
                      value={values?.workplace}
                      name="Workplace"
                      onChange={(e) => {
                        setFieldValue('workplace', e);
                        setRowData([]);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      options={wareHouseDDL || []}
                      label="Warehouse"
                      placeholder="Warehouse"
                      value={values?.warehouse}
                      name="Warehouse"
                      onChange={(e) => {
                        setFieldValue('warehouse', e);
                        setRowData([]);
                      }}
                    />
                  </div>
                  <IButton
                    onClick={() => {
                      getData(values, pageNo, pageSize);
                    }}
                  />
                </div>
              </div>
              {values?.status?.value === 1 && rowData?.data?.length > 0 && (
                <div className="text-right">
                  <button
                    className="btn btn-info"
                    type="button"
                    onClick={() => {
                      approveHandler(values);
                    }}
                  >
                    Approve
                  </button>
                </div>
              )}
              <div ref={printRef}>
                {' '}
                {rowData?.data?.length > 0 && (
                  <table
                    ref={printRef}
                    id="table-to-xlsx"
                    className={
                      'table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm'
                    }
                  >
                    <thead>
                      <tr className="cursor-pointer">
                        {values?.status?.value === 1 && (
                          <th
                            onClick={() => allSelect(!selectedAll())}
                            style={{ width: '30px' }}
                          >
                            <input
                              type="checkbox"
                              value={selectedAll()}
                              checked={selectedAll()}
                              onChange={() => {}}
                            />
                          </th>
                        )}
                        {headers?.map((th, index) => {
                          return <th key={index}> {th} </th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {rowData?.data?.map((item, index) => {
                        totalBillAmount += item?.billAmount;
                        totalApprovedAmount += item?.approveAmount;
                        return (
                          <tr
                            key={index}
                            style={
                              item?.approveAmount > 0
                                ? {
                                    backgroundColor: '#63dc64ab',
                                    width: '30px',
                                  }
                                : {
                                    width: '30px',
                                    backgroundColor: '#d3e95eab',
                                  }
                            }
                          >
                            {values?.status?.value === 1 && (
                              <td
                                onClick={() => {
                                  rowDataHandler(
                                    'isSelected',
                                    index,
                                    !item.isSelected,
                                  );
                                }}
                                className="text-center"
                                style={
                                  item?.isSelected
                                    ? {
                                        backgroundColor: '#aacae3',
                                        width: '30px',
                                      }
                                    : { width: '30px' }
                                }
                              >
                                <input
                                  type="checkbox"
                                  value={item?.isSelected}
                                  checked={item?.isSelected}
                                  onChange={() => {}}
                                />
                              </td>
                            )}
                            <td
                              style={{ width: '40px' }}
                              className="text-center"
                            >
                              {index + 1}
                            </td>
                            <td>{item?.employeeName}</td>
                            <td>{item?.employeeId}</td>
                            <td>{item?.workplaceName}</td>
                            <td>{item?.empDesignation}</td>
                            <td>{_dateFormatter(item?.date)}</td>
                            <td>{item?.startTime}</td>
                            <td>{_dateFormatter(item?.endDate)}</td>
                            <td>{item?.endTime}</td>
                            {/* <td>{item?.hours}</td> */}
                            <td className="text-right">{item?.billAmount}</td>
                            <td className="text-right">
                              {item?.approveAmount}
                            </td>
                            <td>{item?.remarks}</td>
                            <td
                              style={{ width: '80px' }}
                              className="text-center"
                            >
                              <div className="d-flex justify-content-around">
                                {/* <span>
                                <IEdit
                                  onClick={() => {
                                    setSingleData(item);
                                    setFormType("edit");
                                    setShow(true);
                                  }}
                                />
                              </span> */}
                                {item?.approveAmount < 1 && (
                                  <>
                                    <span>
                                      <IDelete
                                        remover={(id) => {
                                          deleteHandler(id, values);
                                        }}
                                        id={item?.autoId}
                                      />
                                    </span>
                                    {item?.attachmentUrl && (
                                      <span className="cursor-pointer">
                                        <OverlayTrigger
                                          overlay={
                                            <Tooltip id="cs-icon">
                                              View Attachment
                                            </Tooltip>
                                          }
                                        >
                                          <span
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              dispatch(
                                                getDownlloadFileView_Action(
                                                  item?.attachmentUrl,
                                                ),
                                              );
                                            }}
                                            className="ml-2"
                                          >
                                            <i
                                              class="fa fa-paperclip"
                                              aria-hidden="true"
                                            ></i>
                                          </span>
                                        </OverlayTrigger>
                                      </span>
                                    )}
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      <tr>
                        <td
                          className="text-right"
                          colSpan={values?.status?.value === 1 ? 10 : 9}
                        >
                          <b>Total</b>
                        </td>
                        <td className="text-right">
                          <b>{totalBillAmount}</b>
                        </td>
                        <td className="text-right">
                          <b>{totalApprovedAmount}</b>
                        </td>
                        <td colSpan={2}></td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>

              {rowData?.data?.length > 0 && (
                <PaginationTable
                  count={rowData?.totalCount}
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
            </form>
          </ICard>
        )}
      </Formik>
    </>
  );
};

export default PumpFoodingBillLanding;
