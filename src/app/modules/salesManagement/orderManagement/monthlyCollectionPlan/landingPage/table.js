import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import ICard from '../../../../_helper/_card';
import IConfirmModal from '../../../../_helper/_confirmModal';
import { _fixedPoint } from '../../../../_helper/_fixedPoint';
import IDelete from '../../../../_helper/_helperIcons/_delete';
import InputField from '../../../../_helper/_inputField';
import Loading from '../../../../_helper/_loading';
import NewSelect from '../../../../_helper/_select';
import PaginationTable from '../../../../_helper/_tablePagination';
import IViewModal from '../../../../_helper/_viewModal';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';
import IButton from '../../../../_helper/iButton';
import {
  deleteMonthlyCollectionPlan,
  getMonthlyCollectionPlanData,
} from '../helper';
import EditForm from './editForm';

export function MonthlyCollectionPlanLanding() {
  const history = useHistory();
  const [rowData, setRowData] = useState({});
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [landingData, getLandingData, loader, setLandingData] = useAxiosGet();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [, onSave, UpdateLoader] = useAxiosPost();
  // const [singleRow, setSingleRow] = useState({});

  // get user data from store
  const {
    profileData: { accountId: accId, employeeId: empId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  //setLandingData
  const getData = (typeId) => {
    getMonthlyCollectionPlanData(
      typeId,
      accId,
      buId,
      empId,
      setRowData,
      setLoading,
    );
  };

  const deleteHandler = (id) => {
    const obj = {
      title: 'Are you Sure?',
      message: 'Are you sure you want to delete this plan?',
      yesAlertFunc: () => {
        deleteMonthlyCollectionPlan(id, setLoading, () => {
          getData(3);
        });
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(obj);
  };

  const getLandingDataHandler = (
    values,
    pageNo,
    pageSize,
    searchValue = '',
  ) => {
    const apiUrl =
      values?.type?.value === 1
        ? `/oms/CustomerSalesTarget/GetAreaWiseDailyCollectionPlanPagination?salesManId=${empId}&businessUnitId=${buId}&yearId=${
            values?.monthYear?.split('-')[0]
          }&monthId=${
            values?.monthYear?.split('-')[1]
          }&pageNo=${pageNo}&pageSize=${pageSize}`
        : values?.type?.value === 4
        ? `/oms/CustomerSalesTarget/GetMonthlyBudgetedSalesPagination?businessUnitId=${buId}&monthId=${
            values?.monthYear?.split('-')[1]
          }&yearId=${
            values?.monthYear?.split('-')[0]
          }&pageNo=${pageNo}&pageSize=${pageSize}`
        : '';
    getLandingData(apiUrl);
  };

  const setPositionHandler = (pageNo, pageSize, values, searchValue = '') => {
    getLandingData(values, pageNo, pageSize, searchValue);
  };

  return (
    <>
      {(loading || loader || UpdateLoader) && <Loading />}

      <Formik initialValues={{ type: '', monthYear: '' }} onSubmit={() => {}}>
        {({ values, setFieldValue }) => (
          <>
            <ICard
              title={`Monthly Collection Plan`}
              isCreteBtn={true}
              createHandler={() => {
                history.push({
                  pathname: `/sales-management/ordermanagement/MonthlyCollectionPlan/entry`,
                  landingValues: values,
                });
              }}
            >
              <Form className="form form-label-right">
                <div className="row global-form global-form-custom">
                  <div className="col-lg-3">
                    <NewSelect
                      name="type"
                      value={values?.type}
                      label="Type"
                      placeholder="Type"
                      options={[
                        { value: 3, label: 'Collection Plan' },
                        { value: 2, label: 'Collection Plan vs Collection' },
                        { value: 1, label: 'Area Base Daily Collection Plan' },
                        { value: 4, label: 'Monthly Budgeted Sales Plan' },
                      ]}
                      onChange={(e) => {
                        setFieldValue('type', e);
                        setRowData([]);
                        setLandingData([]);
                      }}
                    />
                  </div>
                  {[1, 4].includes(values?.type?.value) && (
                    <div className="col-lg-3">
                      <InputField
                        value={values?.monthYear}
                        name="monthYear"
                        label="Month & Year"
                        type="month"
                        onChange={(e) => {
                          setFieldValue('monthYear', e?.target?.value);
                        }}
                      />
                    </div>
                  )}
                  <IButton
                    onClick={() => {
                      if ([1, 4].includes(values?.type?.value)) {
                        getLandingDataHandler(values, pageNo, pageSize, '');
                      } else {
                        getData(values?.type?.value);
                      }
                    }}
                    disabled={!values?.type}
                  />
                </div>
                {[1].includes(values?.type?.value) ? (
                  <>
                    <div className="text-right">
                      <button
                        disabled={
                          !landingData?.data?.some((item) => item?.isSelected)
                        }
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          const selectedRow = landingData?.data?.filter(
                            (item) => item?.isSelected,
                          );
                          if (!selectedRow.length) {
                            return toast.warn('Select at least one row');
                          }

                          const payload = selectedRow?.map((item) => ({
                            collectionPlanId: item?.collectionPlanId,
                            accountId: accId,
                            businessUnitId: buId,
                            salesManId: item?.salesManId,
                            targetDate: item?.targetDate,
                            salesManeName: item?.salesManeName,
                            areaId: item?.areaId,
                            areaName: item?.areaName,
                            totalAmount: item?.totalAmount,
                            actionBy: userId,
                          }));

                          onSave(
                            `/oms/CustomerSalesTarget/DailyCollectionPlanEntry?typeId=3&typeName=${`AreaBaseDailyCollectionPlan`}`,
                            payload,
                            () => {
                              getLandingDataHandler(
                                values,
                                pageNo,
                                pageSize,
                                '',
                              );
                            },
                            true,
                          );
                        }}
                      >
                        Update
                      </button>
                    </div>
                    {landingData?.data?.length > 0 && (
                      <div className="table-responsive">
                        <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                          <thead>
                            <tr>
                              <th>
                                <input
                                  type="checkbox"
                                  checked={
                                    landingData?.data?.length > 0 &&
                                    landingData.data.every(
                                      (item) => item.isSelected,
                                    )
                                  }
                                  onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    const updatedData = landingData.data.map(
                                      (item) => ({
                                        ...item,
                                        isSelected: isChecked,
                                      }),
                                    );
                                    setLandingData({
                                      ...landingData,
                                      data: updatedData,
                                    });
                                  }}
                                />
                              </th>
                              <th>SL</th>
                              <th>Area Name</th>
                              <th>Region Name</th>
                              <th>Date</th>
                              <th>Total Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {landingData?.data?.map((item, index) => (
                              <tr key={index}>
                                <td className="text-center align-middle">
                                  <input
                                    type="checkbox"
                                    checked={item.isSelected}
                                    onChange={(e) => {
                                      const updatedData = [...landingData.data];
                                      updatedData[index].isSelected =
                                        e.target.checked;
                                      setLandingData({
                                        ...landingData,
                                        data: updatedData,
                                      });
                                    }}
                                  />
                                </td>
                                <td className="text-center">{index + 1}</td>
                                <td>{item.areaName}</td>
                                <td>{item.regionName}</td>
                                <td className="text-center">{`${item?.dayId} ${item?.monthName} ${item?.yearId}`}</td>
                                <td className="text-center">
                                  <InputField
                                    value={item.totalAmount || ''}
                                    type="number"
                                    onChange={(e) => {
                                      const value = +e.target.value;
                                      if (value < 0) return;
                                      const updatedData = [...landingData.data];
                                      updatedData[index].totalAmount = value;
                                      setLandingData({
                                        ...landingData,
                                        data: updatedData,
                                      });
                                    }}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {landingData?.data?.length > 0 && (
                      <PaginationTable
                        count={landingData?.totalCount}
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
                  </>
                ) : [4].includes(values?.type?.value) ? (
                  <>
                    <div className="text-right">
                      <button
                        disabled={
                          !landingData?.data?.some((item) => item?.isSelected)
                        }
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          const selectedRow = landingData?.data?.filter(
                            (item) => item?.isSelected,
                          );
                          if (!selectedRow.length) {
                            return toast.warn('Select at least one row');
                          }

                          const payload = selectedRow?.map((item) => ({
                            collectionPlanId: item?.collectionPlanId,
                            accountId: accId,
                            businessUnitId: buId,
                            monthId: item?.monthId,
                            monthName: item?.monthName,
                            yearId: item?.yearId,
                            actionBy: userId,
                            budgetedSalesQnt: item?.budgetedSalesQnt || 0,
                            budgetedSalesAmount: item?.budgetedSalesAmount || 0,
                          }));

                          onSave(
                            `/oms/CustomerSalesTarget/CreateMonthlySalesCollectionNBudgetPlan?typeId=2&typeName=MonthlyBudgetedSales`,
                            payload,
                            () => {
                              getLandingDataHandler(
                                values,
                                pageNo,
                                pageSize,
                                '',
                              );
                            },
                            true,
                          );
                        }}
                      >
                        Update
                      </button>
                    </div>
                    {landingData?.data?.length > 0 && (
                      <div className="table-responsive">
                        <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                          <thead>
                            <tr>
                              <th>
                                <input
                                  type="checkbox"
                                  checked={
                                    landingData?.data?.length > 0 &&
                                    landingData.data.every(
                                      (item) => item.isSelected,
                                    )
                                  }
                                  onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    const updatedData = landingData.data.map(
                                      (item) => ({
                                        ...item,
                                        isSelected: isChecked,
                                      }),
                                    );
                                    setLandingData({
                                      ...landingData,
                                      data: updatedData,
                                    });
                                  }}
                                />
                              </th>
                              <th>SL</th>
                              <th>Month</th>
                              <th>Year</th>
                              <th>Budgeted Sales Qnt</th>
                              <th>Budgeted Sales Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {landingData?.data?.map((item, index) => (
                              <tr key={index}>
                                <td className="text-center align-middle">
                                  <input
                                    type="checkbox"
                                    checked={item.isSelected}
                                    onChange={(e) => {
                                      const updatedData = [...landingData.data];
                                      updatedData[index].isSelected =
                                        e.target.checked;
                                      setLandingData({
                                        ...landingData,
                                        data: updatedData,
                                      });
                                    }}
                                  />
                                </td>
                                <td className="text-center">{index + 1}</td>
                                <td>{item.monthName}</td>
                                <td>{item.monthName}</td>
                                <td className="text-center">
                                  <InputField
                                    value={item.budgetedSalesQnt || ''}
                                    type="number"
                                    onChange={(e) => {
                                      const value = +e.target.value;
                                      if (value < 0) return;
                                      const updatedData = [...landingData.data];
                                      updatedData[
                                        index
                                      ].budgetedSalesQnt = value;
                                      setLandingData({
                                        ...landingData,
                                        data: updatedData,
                                      });
                                    }}
                                  />
                                </td>
                                <td className="text-center">
                                  <InputField
                                    value={item.budgetedSalesAmount || ''}
                                    type="number"
                                    onChange={(e) => {
                                      const value = +e.target.value;
                                      if (value < 0) return;
                                      const updatedData = [...landingData.data];
                                      updatedData[
                                        index
                                      ].budgetedSalesAmount = value;
                                      setLandingData({
                                        ...landingData,
                                        data: updatedData,
                                      });
                                    }}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {landingData?.data?.length > 0 && (
                      <PaginationTable
                        count={landingData?.totalCount}
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
                  </>
                ) : (
                  <>
                    {rowData?.length > 0 &&
                      (values?.type?.value === 3 ? (
                        <table
                          id="table-to-xlsx"
                          className={
                            'table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm'
                          }
                        >
                          <thead>
                            <tr className="cursor-pointer">
                              <th rowSpan={2}>SL</th>
                              <th rowSpan={2}>Salesman Name</th>
                              <th rowSpan={2}>Client Name</th>
                              <th rowSpan={2}>Area</th>
                              <th rowSpan={2}>Territory</th>
                              <th rowSpan={2}>Total Dues</th>
                              <th rowSpan={2}>Overdue</th>
                              <th rowSpan={2}>OD %</th>
                              <th colSpan={6}>Collection Plan</th>
                              <th rowSpan={2}>Action</th>
                            </tr>
                            <tr>
                              <th>Week-1</th>
                              <th>Week-2</th>
                              <th>Week-3</th>
                              <th>Week-4</th>
                              <th>Total</th>
                              <th>%</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rowData?.map((item, index) => {
                              return (
                                <tr key={index}>
                                  <td
                                    style={{ width: '30px' }}
                                    className="text-center"
                                  >
                                    {index + 1}
                                  </td>
                                  <td>{item?.strSalesManeName}</td>
                                  <td>{item?.strCustomerName}</td>
                                  <td>{item?.strAreaName}</td>
                                  <td>{item?.strTerritoryName}</td>
                                  <td className="text-right">
                                    {_fixedPoint(item?.numTotalDues, true)}
                                  </td>
                                  <td className="text-right">
                                    {_fixedPoint(item?.numOverDue, true)}
                                  </td>
                                  <td
                                    className="text-right"
                                    style={{ width: '60px' }}
                                  >
                                    {_fixedPoint(
                                      item?.numOverDuePercentage || 0,
                                      true,
                                    )}
                                  </td>
                                  <td className="text-right">
                                    {_fixedPoint(item?.numWeek1, true)}
                                  </td>
                                  <td className="text-right">
                                    {_fixedPoint(item?.numWeek2, true)}
                                  </td>
                                  <td className="text-right">
                                    {_fixedPoint(item?.numWeek3, true)}
                                  </td>
                                  <td className="text-right">
                                    {_fixedPoint(item?.numWeek4, true)}
                                  </td>
                                  <td className="text-right">
                                    {_fixedPoint(
                                      item?.numWeek4 +
                                        item?.numWeek1 +
                                        item?.numWeek2 +
                                        item?.numWeek3,
                                      true,
                                    )}
                                  </td>
                                  <td
                                    className="text-right"
                                    style={{ width: '60px' }}
                                  >
                                    {_fixedPoint(
                                      item?.numCollectionPercentage,
                                      true,
                                    )}
                                  </td>
                                  <td
                                    className="text-center"
                                    style={{ width: '50px' }}
                                  >
                                    <div className="d-flex justify-content-around">
                                      {/* <IEdit
                                    onClick={() => {
                                      setShow(true);
                                      setSingleRow(item);
                                    }}
                                  /> */}
                                      <IDelete
                                        remover={(id) => {
                                          deleteHandler(id);
                                        }}
                                        id={item?.intCollectionPlanId}
                                      />
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      ) : (
                        <table
                          id="table-to-xlsx"
                          className={
                            'table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm'
                          }
                        >
                          <thead>
                            <tr className="cursor-pointer">
                              <th rowSpan={3}>SL</th>
                              <th rowSpan={3}>Salesman Name</th>
                              <th rowSpan={3}>Client Name</th>
                              <th rowSpan={3}>Area</th>
                              <th rowSpan={3}>Territory</th>
                              <th rowSpan={3}>Total Dues</th>
                              <th rowSpan={3}>Overdue</th>
                              <th rowSpan={3}>OD %</th>
                              <th colSpan={11}>
                                Collection Plan vs Collection
                              </th>
                            </tr>
                            <tr>
                              <th colSpan={2}>Week-1</th>
                              <th colSpan={2}>Week-2</th>
                              <th colSpan={2}>Week-3</th>
                              <th colSpan={2}>Week-4</th>
                              <th rowSpan={2}>Total Plan</th>
                              <th rowSpan={2}>Total Collection</th>
                              <th rowSpan={2}>%</th>
                            </tr>
                            <tr>
                              <th>Plan</th>
                              <th>Collection</th>
                              <th>Plan</th>
                              <th>Collection</th>
                              <th>Plan</th>
                              <th>Collection</th>
                              <th>Plan</th>
                              <th>Collection</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rowData?.map((item, index) => {
                              return (
                                <tr key={index}>
                                  <td
                                    style={{ width: '30px' }}
                                    className="text-center"
                                  >
                                    {index + 1}
                                  </td>
                                  <td>{item?.strSalesManeName}</td>
                                  <td>{item?.customerName}</td>
                                  <td>{item?.strAreaName}</td>
                                  <td>{item?.strTerritoryName}</td>
                                  <td className="text-right">
                                    {_fixedPoint(item?.numTotalDues, true)}
                                  </td>
                                  <td className="text-right">
                                    {_fixedPoint(item?.numOverDue, true)}
                                  </td>
                                  <td
                                    className="text-right"
                                    style={{ width: '60px' }}
                                  >
                                    {_fixedPoint(
                                      item?.numOverDuePercentage || 0,
                                      true,
                                    )}
                                  </td>
                                  <td className="text-right">
                                    {_fixedPoint(item?.numWeek1CP, true)}
                                  </td>
                                  <td className="text-right">
                                    {_fixedPoint(item?.numWeek1C, true)}
                                  </td>
                                  <td className="text-right">
                                    {_fixedPoint(item?.numWeek2CP, true)}
                                  </td>
                                  <td className="text-right">
                                    {_fixedPoint(item?.numWeek2C, true)}
                                  </td>
                                  <td className="text-right">
                                    {_fixedPoint(item?.numWeek3CP, true)}
                                  </td>
                                  <td className="text-right">
                                    {_fixedPoint(item?.numWeek3C, true)}
                                  </td>
                                  <td className="text-right">
                                    {_fixedPoint(item?.numWeek4CP, true)}
                                  </td>
                                  <td className="text-right">
                                    {_fixedPoint(item?.numWeek4C, true)}
                                  </td>
                                  <td className="text-right">
                                    {_fixedPoint(
                                      item?.numWeek4CP +
                                        item?.numWeek1CP +
                                        item?.numWeek2CP +
                                        item?.numWeek3CP,
                                      true,
                                    )}
                                  </td>
                                  <td className="text-right">
                                    {_fixedPoint(
                                      item?.numWeek4C +
                                        item?.numWeek1C +
                                        item?.numWeek2C +
                                        item?.numWeek3C,
                                      true,
                                    )}
                                  </td>
                                  <td
                                    className="text-right"
                                    style={{ width: '60px' }}
                                  >
                                    {_fixedPoint(
                                      item?.numCollectionPercentage,
                                      true,
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      ))}
                  </>
                )}
              </Form>
            </ICard>
            <IViewModal show={show} onHide={() => setShow(false)}>
              <EditForm singleData={{}} />
            </IViewModal>
          </>
        )}
      </Formik>
    </>
  );
}
