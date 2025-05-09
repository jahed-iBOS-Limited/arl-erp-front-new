import axios from 'axios';
import { Form, Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import SearchAsyncSelect from '../../../_helper/SearchAsyncSelect';
import IConfirmModal from '../../../_helper/_confirmModal';
import IForm from '../../../_helper/_form';
import FormikError from '../../../_helper/_formikError';
import { formatMonthYear } from '../../../_helper/_getMonthYearFormat';
import InputField from '../../../_helper/_inputField';
import Loading from '../../../_helper/_loading';
import NewSelect from '../../../_helper/_select';
import { _todayDate } from '../../../_helper/_todayDate';
import IViewModal from '../../../_helper/_viewModal';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import { setSalesCollectionInitDataAction } from '../../../_helper/reduxForLocalStorage/Actions';
import CollectionModal from './collection';
import PrintInvoiceModal from './printInvoice';
import { getSBU } from '../../../_helper/_commonApi';

export default function SalesCollectionLanding() {
  const initData = useSelector((state) => {
    return state.localStorage.SalesCollectionInitData || {};
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [rowData, getRowData, loader, setRowData] = useAxiosGet();
  const [receivableAmount, setReceivableAmount] = useState(0);
  const [vdsAmount, setVdsAmount] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [singleItem, setSingleItem] = useState(null);
  const [paymentType, setPaymentType] = useState(2);
  const [actionType, setActionType] = useState(1);
  const [sbuDDl, setSbuDDl] = useState([]);
  const history = useHistory();
  const dispatch = useDispatch();
  const selectedRowList = rowData.filter((item) => item.isSelected);
  const [, onVDSAmountCollection, loader2] = useAxiosPost();
  const isFirstRender = useRef(true); // To track the first render

  useEffect(() => {
    getSBU(profileData?.accountId, selectedBusinessUnit.value, setSbuDDl);
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (actionType === 1) {
      // Auto mode logic (no change)
      const data = [...rowData];
      let Ramount = +receivableAmount;

      const modifyData = data.map((item) => {
        const updatedInvoiceRow = item.invocieRow.map((invRow) => {
          const needCollectionAmount = invRow?.needCollectionAmount2;

          let CollectionAmount;
          let PendingAmount;

          if (Ramount >= needCollectionAmount) {
            CollectionAmount = needCollectionAmount;
            PendingAmount = 0;
            Ramount -= needCollectionAmount;
          } else {
            CollectionAmount = Ramount;
            PendingAmount = needCollectionAmount - Ramount;
            Ramount = 0;
          }

          return {
            ...invRow,
            numCollectionAmount: CollectionAmount,
            numPendingAmount: PendingAmount,
          };
        });

        return {
          ...item,
          invocieRow: updatedInvoiceRow,
        };
      });

      setRowData(modifyData);
    } else if (actionType === 2) {
      onCheckHandler();
    }
  }, [receivableAmount, actionType]);

  const onCheckHandler = () => {
    // Manual mode logic (only for selected rows)
    console.log('1');
    const data = [...rowData];
    let Ramount = +receivableAmount || 0;

    const modifyData = data.map((item) => {
      if (!item.isSelected) return item; // Skip unselected rows

      const updatedInvoiceRow = item.invocieRow.map((invRow) => {
        const needCollectionAmount = invRow?.needCollectionAmount2;

        let CollectionAmount;
        let PendingAmount;

        if (Ramount >= needCollectionAmount) {
          CollectionAmount = needCollectionAmount;
          PendingAmount = 0;
          Ramount -= needCollectionAmount;
        } else {
          CollectionAmount = Ramount;
          PendingAmount = needCollectionAmount - Ramount;
          Ramount = 0;
        }

        return {
          ...invRow,
          numCollectionAmount: CollectionAmount,
          numPendingAmount: PendingAmount,
        };
      });

      return {
        ...item,
        invocieRow: updatedInvoiceRow,
      };
    });

    setRowData(modifyData);
  };

  useEffect(() => {
    setPaymentType(initData?.paymentType || 2);
    if (isFirstRender.current) {
      // If it's the first render, set it to false and return
      isFirstRender.current = false;
      return;
    }
    getData({ typeId: initData?.type?.value, values: initData || {} });
  }, [profileData, selectedBusinessUnit, initData]);

  const getData = ({ typeId, values }) => {
    const strFromAndToDate =
      values?.fromDate && values?.toDate
        ? `&FromDate=${values?.fromDate}&ToDate=${values?.toDate}`
        : '';
    let apiUrl = [2]?.includes(typeId)
      ? `/oms/ServiceSales/GetServiceSalesInvocieList?accountId=${
          profileData?.accountId
        }&businessUnitId=${selectedBusinessUnit?.value}&customerId=${
          values?.customer?.value || 0
        }&paymentTypeId=${
          values?.billType?.value || 0
        }&isCollectionComplte=${false}${strFromAndToDate}`
      : `/oms/ServiceSales/GetServiceSalesInvocieList?accountId=${
          profileData?.accountId
        }&businessUnitId=${selectedBusinessUnit?.value}&customerId=${
          values?.customer?.value || 0
        }&paymentTypeId=${
          values?.billType?.value || 0
        }&isCollectionComplte=${true}${strFromAndToDate}`;

    getRowData(apiUrl, (data) => {
      const modifyData = data.map((item) => {
        return {
          ...item,
          isChecked: false,
          invocieRow: [
            {
              ...item?.invocieRow[0],
              alreadyCollectedAmount:
                +item?.invocieRow[0]?.numCollectionAmount || 0,
              numCollectionAmount: 0,
              peviousPendingAmount: +item?.invocieRow[0]?.numPendingAmount || 0,
              needCollectionAmount2:
                +item?.invocieRow[0]?.numPendingAmount ||
                (+item?.invocieRow[0]?.numScheduleAmount || 0) +
                  (+item?.invocieRow[0]?.numScheduleVatAmount || 0),
            },
          ],
        };
      });
      setRowData(modifyData);
    });
  };

  const loadTransactionList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/partner/BusinessPartnerPurchaseInfo/GetTransactionByTypeSearchDDL?AccountId=${
          profileData?.accountId
        }&BusinessUnitId=${
          selectedBusinessUnit?.value
        }&Search=${v}&PartnerTypeName=${''}&RefferanceTypeId=${2}`
      )
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };

  const collectionRow = rowData?.filter(
    (item) => item?.invocieRow?.[0]?.numCollectionAmount
  );

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...initData,
        sbu: sbuDDl[0],
        isVDS: false,
        accountingJournalTypeId:
          paymentType === 2
            ? { value: 4, label: 'Bank Receipts ' }
            : { value: 1, label: 'Cash Receipts' },
      }}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        console.log(values);
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
          {(loader || loader2) && <Loading />}
          <IForm
            title="Sales Collection"
            isHiddenReset
            isHiddenBack
            isHiddenSave
          >
            <Form>
              <div>
                <div className="form-group  global-form row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="type"
                      options={[
                        { value: 2, label: 'Pending for Collection' },
                        { value: 1, label: 'Collected' },
                      ]}
                      value={values?.type}
                      label="Type"
                      onChange={(valueOption) => {
                        setFieldValue('type', valueOption);
                        setFieldValue('fromDate', '');
                        setFieldValue('toDate', '');
                        setFieldValue('customer', '');
                        setFieldValue('paymentType', '');
                        setRowData([]);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Customer</label>
                    <SearchAsyncSelect
                      selectedValue={values?.customer}
                      isSearchIcon={true}
                      handleChange={(valueOption) => {
                        setFieldValue('customer', valueOption);
                      }}
                      loadOptions={loadTransactionList}
                    />
                    <FormikError
                      errors={errors}
                      name="customer"
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="billType"
                      options={[
                        { value: 1, label: 'Re-Curring' },
                        { value: 2, label: 'One Time' },
                      ]}
                      value={values?.billType}
                      label="Bill Type"
                      onChange={(valueOption) => {
                        setFieldValue('billType', valueOption);
                        setRowData([]);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {values?.type?.value === 1 && (
                    <>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.fromDate}
                          label="From Date"
                          name="fromDate"
                          type="date"
                          onChange={(e) => {
                            setFieldValue('fromDate', e.target.value);
                          }}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.toDate}
                          label="To Date"
                          name="toDate"
                          type="date"
                          onChange={(e) => {
                            setFieldValue('toDate', e.target.value);
                          }}
                        />
                      </div>
                    </>
                  )}
                  <div>
                    <button
                      disabled={
                        [2].includes(values?.type?.value) && !values?.customer
                      }
                      className="btn btn-primary"
                      type="button"
                      style={{ marginTop: '17px' }}
                      onClick={() => {
                        dispatch(
                          setSalesCollectionInitDataAction({
                            ...values,
                            paymentType,
                          })
                        );
                        setReceivableAmount(0);
                        setVdsAmount(0);
                      }}
                    >
                      Show
                    </button>
                  </div>
                </div>

                {[2].includes(values?.type?.value) && rowData?.length > 0 && (
                  <>
                    <div className="row mt-5">
                      <div className="col-lg-4">
                        <label className="mr-3">
                          <input
                            type="radio"
                            name="paymentType"
                            checked={paymentType === 2}
                            className="mr-1 pointer"
                            style={{ position: 'relative', top: '2px' }}
                            onChange={(e) => {
                              setPaymentType(2);
                            }}
                          />
                          Bank
                        </label>
                        <label className="mr-3">
                          <input
                            type="radio"
                            name="paymentType"
                            checked={paymentType === 1}
                            className="mr-1 pointer"
                            style={{ position: 'relative', top: '2px' }}
                            onChange={(valueOption) => {
                              setPaymentType(1);
                            }}
                          />
                          Cash
                        </label>
                      </div>
                    </div>
                    <div className="form-group  global-form mt-3">
                      <div className="row">
                        {[1, 2].includes(paymentType) && (
                          <>
                            <div className="col-lg-3">
                              <NewSelect
                                name="sbu"
                                options={sbuDDl}
                                value={values?.sbu}
                                label="SBU"
                                onChange={(valueOption) => {
                                  setFieldValue('sbu', valueOption);
                                }}
                                isDisabled
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                            <div className="col-lg-3">
                              <NewSelect
                                name="accountingJournalTypeId"
                                options={
                                  paymentType === 2
                                    ? [{ value: 4, label: 'Bank Receipts ' }]
                                    : [{ value: 1, label: 'Cash Receipts' }]
                                }
                                value={values?.accountingJournalTypeId}
                                label="Select Journal Type"
                                onChange={(valueOption) => {
                                  setFieldValue(
                                    'accountingJournalTypeId',
                                    valueOption
                                  );
                                }}
                                isDisabled
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                            {!values?.isVDS && (
                              <div className="col-lg-3">
                                <InputField
                                  value={receivableAmount || ''}
                                  type="number"
                                  placeholder="Receivable Amount"
                                  label="Receivable Amount"
                                  onChange={(e) => {
                                    if (!e.target.value) {
                                      getData({
                                        typeId: values?.type?.value,
                                        values,
                                      });
                                    }
                                    setReceivableAmount(+e.target.value);
                                  }}
                                />
                              </div>
                            )}
                            <div className="mt-5 ml-5">
                              <input
                                type="checkbox"
                                id="isVDS"
                                name="isVDS"
                                value={values?.isVDS}
                                checked={values?.isVDS}
                                onChange={(e) => {
                                  setFieldValue('isVDS', e.target.checked);
                                  setVdsAmount(0);
                                  setReceivableAmount(0);
                                  if (e.target.checked) {
                                    setActionType(2);
                                  }
                                }}
                              />
                              <label htmlFor="isVDS" className="pl-1">
                                Add VDS
                              </label>
                            </div>
                            {values?.isVDS && (
                              <div className="col-lg-2">
                                <InputField
                                  value={vdsAmount || ''}
                                  type="number"
                                  placeholder="VDS Amount"
                                  label="VDS Amount"
                                  onChange={(e) => {
                                    setVdsAmount(+e.target.value);
                                  }}
                                />
                              </div>
                            )}
                            <div>
                              {!values?.isVDS && (
                                <button
                                  disabled={
                                    !receivableAmount || !collectionRow?.length
                                  }
                                  className="btn btn-primary mt-5 ml-5"
                                  type="button"
                                  onClick={() => {
                                    // setShowCollectionModal(true);
                                    dispatch(
                                      setSalesCollectionInitDataAction({
                                        ...values,
                                        paymentType,
                                      })
                                    );
                                    history.push(
                                      paymentType === 2
                                        ? {
                                            pathname: `/financial-management/financials/bank/collection`,
                                            state: {
                                              selectedJournal:
                                                values.accountingJournalTypeId,
                                              selectedSbu: values.sbu,
                                              transactionDate: _todayDate(),
                                              customerDetails: values?.customer,
                                              receivableAmount:
                                                receivableAmount,
                                              numVDSAmount: 0,
                                              collectionRow: rowData?.filter(
                                                (item) =>
                                                  item?.invocieRow?.[0]
                                                    ?.numCollectionAmount
                                              ),
                                            },
                                          }
                                        : {
                                            pathname: `/financial-management/financials/cash/collection`,
                                            state: {
                                              ...values,
                                              accountingJournalTypeId:
                                                values?.accountingJournalTypeId
                                                  ?.value,
                                              customerDetails: values?.customer,
                                              receivableAmount:
                                                receivableAmount,
                                              numVDSAmount: 0,
                                              collectionRow: collectionRow,
                                            },
                                          }
                                    );
                                  }}
                                >
                                  Collection
                                </button>
                              )}
                              {values?.isVDS && (
                                <button
                                  disabled={
                                    !vdsAmount ||
                                    !selectedRowList?.length ||
                                    selectedRowList?.length > 1 ||
                                    +selectedRowList[0]?.invocieRow?.[0]
                                      ?.numScheduleVatAmount !== +vdsAmount ||
                                    +selectedRowList[0]?.invocieRow?.[0]
                                      ?.numScheduleVatAmount !==
                                      +selectedRowList[0]?.invocieRow?.[0]
                                        ?.numPendingAmount
                                  }
                                  className="btn btn-primary mt-5 ml-5"
                                  type="button"
                                  onClick={() => {
                                    IConfirmModal({
                                      message: `Are you sure to collect VDS amount?`,
                                      yesAlertFunc: () => {
                                        const apiUrl = `/oms/ServiceSales/VDSalesVoucherPosting?customerId=${values?.customer?.value}&numVDSAmount=${vdsAmount}&serviceSalesInvoiceRowId=${selectedRowList[0]?.invocieRow?.[0]?.intServiceSalesInvoiceRowId}&serviceSalesInvoiceId=${selectedRowList[0]?.invocieRow?.[0]?.intServiceSalesInvoiceId}`;
                                        onVDSAmountCollection(
                                          apiUrl,
                                          null,
                                          () => {
                                            getData({
                                              typeId: values?.type?.value,
                                              values,
                                            });
                                          },
                                          true
                                        );
                                      },
                                      noAlertFunc: () => {},
                                    });
                                  }}
                                >
                                  VDS Collection
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}
                {[2].includes(values?.type?.value) && rowData?.length > 0 && (
                  <div className="row mt-5">
                    <div className="col-lg-4">
                      <label className="mr-3">
                        <input
                          type="radio"
                          name="actionType"
                          checked={actionType === 1}
                          disabled={values?.isVDS}
                          className="mr-1 pointer"
                          style={{ position: 'relative', top: '2px' }}
                          onChange={(e) => {
                            setActionType(1);
                            setReceivableAmount(0);
                            setVdsAmount(0);
                            getData({
                              typeId: values?.type?.value,
                              values,
                            });
                          }}
                        />
                        Auto
                      </label>
                      <label className="mr-3">
                        <input
                          type="radio"
                          name="actionType"
                          checked={actionType === 2}
                          disabled={values?.isVDS}
                          className="mr-1 pointer"
                          style={{ position: 'relative', top: '2px' }}
                          onChange={(valueOption) => {
                            setActionType(2);
                            setReceivableAmount(0);
                            setVdsAmount(0);
                            getData({
                              typeId: values?.type?.value,
                              values,
                            });
                          }}
                        />
                        Manual
                      </label>
                    </div>
                  </div>
                )}
                <div className="mt-2">
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          {actionType === 2 && <th></th>}
                          <th style={{ maxWidth: '20px' }}>SL</th>
                          <th>Customer</th>
                          <th>Item Name</th>
                          <th>Address</th>
                          <th style={{ minWidth: '70px' }}>Month-Year</th>
                          <th>Schedule Type</th>
                          <th>Sales Type</th>
                          <th>Sales Order Code</th>
                          <th>Schedule Amount</th>
                          <th>Schedule Vat Amountt</th>
                          <th>Collection Amount</th>
                          <th>Already Collected Amount</th>
                          <th>Pending Amount</th>
                          <th>Adjust Previous Amount</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowData?.map((item, index) => (
                          <tr key={index}>
                            {actionType === 2 && (
                              <td>
                                <input
                                  type="checkbox"
                                  checked={item?.isSelected || false}
                                  onChange={(e) => {
                                    const modifyData = [...rowData];
                                    modifyData[index]['isSelected'] =
                                      e.target.checked;
                                    modifyData[index]['invocieRow'][0][
                                      'numCollectionAmount'
                                    ] = 0;
                                    modifyData[index]['invocieRow'][0][
                                      'numPendingAmount'
                                    ] = 0;
                                    setRowData(modifyData);
                                    onCheckHandler();
                                  }}
                                />
                              </td>
                            )}
                            <td>{index + 1}</td>
                            <td>{item?.invocieHeader?.strCustomerName}</td>
                            <td>
                              {(() => {
                                const itemStrings = item?.items?.map(
                                  (singleItem) => {
                                    const itemName =
                                      singleItem.strItemName || 'N/A';
                                    const qty =
                                      typeof singleItem.numSalesQty === 'number'
                                        ? singleItem.numSalesQty
                                        : 'N/A';
                                    const rate =
                                      typeof singleItem.numRate === 'number'
                                        ? singleItem.numRate
                                        : 'N/A';

                                    return `${itemName} - Qty: ${qty}, Rate: ${rate}`;
                                  }
                                );

                                return itemStrings?.join(' / ');
                              })()}
                            </td>
                            <td>{item?.invocieHeader?.strCustomerAddress}</td>
                            <td className="text-center">
                              {formatMonthYear(
                                item?.invocieRow?.[0]?.dteDueDateTime
                              )}
                            </td>
                            <td>{item?.invocieHeader?.strScheduleTypeName}</td>
                            <td>{item?.invocieHeader?.strSalesTypeName}</td>
                            <td>{item?.strServiceSalesOrderCode}</td>
                            <td>
                              {item?.invocieRow?.[0]?.numScheduleAmount || ''}
                            </td>
                            <td className="text-right">
                              {item?.invocieRow?.[0]?.numScheduleVatAmount ||
                                ''}
                            </td>
                            <td className="text-right">
                              {item?.invocieRow?.[0]?.numCollectionAmount || ''}
                            </td>
                            <td className="text-right">
                              {item?.invocieRow?.[0]?.alreadyCollectedAmount ||
                                ''}
                            </td>
                            <td className="text-right">
                              {item?.invocieRow?.[0]?.numPendingAmount || ''}
                            </td>
                            <td className="text-right">
                              {item?.invocieRow?.[0]?.numAdjustPreviousAmount ||
                                ''}
                            </td>
                            <td>
                              <div className="d-flex justify-content-between">
                                <OverlayTrigger
                                  overlay={
                                    <Tooltip id="cs-icon">
                                      {'Print Invoice'}
                                    </Tooltip>
                                  }
                                >
                                  <span>
                                    <i
                                      onClick={() => {
                                        setSingleItem(item);
                                        setShowModal(true);
                                      }}
                                      style={{
                                        fontSize: '16px',
                                        cursor: 'pointer',
                                      }}
                                      class="fa fa-print"
                                      aria-hidden="true"
                                    ></i>
                                  </span>
                                </OverlayTrigger>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div>
                <IViewModal
                  show={showModal}
                  onHide={() => setShowModal(false)}
                  title=""
                >
                  <PrintInvoiceModal singleItem={singleItem} />
                </IViewModal>
              </div>
              <div>
                <IViewModal
                  show={showCollectionModal}
                  onHide={() => setShowCollectionModal(false)}
                  title=""
                >
                  <CollectionModal
                    rowData={rowData}
                    customerDetails={values?.customer}
                    receivableAmount={receivableAmount}
                  />
                </IViewModal>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
