import { Form, Formik } from 'formik';
import React, { useReducer, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import IConfirmModal from '../../../_helper/_confirmModal';
import IForm from '../../../_helper/_form';
import InputField from '../../../_helper/_inputField';
import Loading from '../../../_helper/_loading';
import NewSelect from '../../../_helper/_select';
import { _todayDate } from '../../../_helper/_todayDate';
import IViewModal from '../../../_helper/_viewModal';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import BreakDownModal from './breakdownModal';
import CommonItemDetailsModal from './rawMaterialModals/commonItemDetailsModal';
import {
  commonItemInitialState,
  commonItemReducer,
} from './rawMaterialModals/helper';
import WarehouseStockModal from './rawMaterialModals/warehouseStockModal';
import RawMaterialAutoPRNewModalView from './rawMaterialModalView';

export default function AutoPRCreateModal({
  parentValues,
  callBack,
  setShowSaveModal,
}) {
  const { profileData, businessUnitList } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [singleRowData, setSingleRowData] = useState();
  const [, onCreateMRPFromProduction, saveLoader] = useAxiosPost();
  const [showModal, setShowModal] = useState(false);

  const [showBreakdownModal, setShowBreakdownModal] = useState(false);
  const [warehouseStockModalShow, setWarehouseStockModalShow] = useState(false);

  // reducer
  const [commonItemDetailsState, commonItemDetailsDispatch] = useReducer(
    commonItemReducer,
    commonItemInitialState,
  );

  console.log('singleRowData', singleRowData);

  const [
    autoRawMaterialData,
    getAutoRawMaterialData,
    loading,
    setAutoRawMaterialData,
  ] = useAxiosGet();

  const [, getSaveStatus, loading2] = useAxiosGet();

  const saveHandler = (values, cb) => {};

  const getData = (values) => {
    setAutoRawMaterialData([]);
    getAutoRawMaterialData(
      `/procurement/MRPFromProduction/GetMRPFromProductionScheduleDetailsNew?businessUnitId=${values?.businessUnit?.value}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}&isForecast=true`,
    );
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        businessUnit: parentValues?.businessUnit || '',
        fromDate: _todayDate(),
        toDate: parentValues?.toDate || _todayDate(),
      }}
      // validationSchema={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {});
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
          {(loading || saveLoader || loading2) && <Loading />}
          <IForm
            title="Generate MRP"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    disabled={!autoRawMaterialData?.length}
                    className="btn btn-primary"
                    onClick={() => {
                      if (!autoRawMaterialData?.length) {
                        return;
                      }

                      const payload = {
                        fromDate: values?.fromDate,
                        toDate: values?.toDate,
                        actionById: profileData?.userId,
                        actionByName: profileData?.userName,
                        businessUnitId: values?.businessUnit?.value,
                        businessUnitName: values?.businessUnit?.label,
                        accountId: profileData?.accountId,
                        row: autoRawMaterialData.map((item) => {
                          const avaiableBlance = (
                            (+item?.stockQty || 0) +
                            (+item?.floatingStock || 0) +
                            (+item?.numOpenPOQty || 0) -
                            (+item?.deadStockQuantity || 0)
                          ).toFixed(2);

                          return {
                            itemId: item.itemId || 0,
                            itemCode: item.itemCode || '',
                            itemName: item.itemName || '',
                            itemCategoryId: 0,
                            itemSubCategoryId: 0,
                            uoMid: item.uoMId || 0,
                            totalBudgetQty: item?.totalBudgetQty || 0,
                            stockQty: item.stockQty || 0,
                            inTransit: item.numOpenPOQty || 0,
                            openPrqty: item.openPRQty || 0,
                            avaiableBlance: parseFloat(avaiableBlance),
                            closingBlance:
                              (
                                (+item?.totalBudgetQty || 0) -
                                (+avaiableBlance || 0)
                              ).toFixed(2) || 0,
                            deadStock: item.deadStockQuantity || 0,
                          };
                        }),
                      };

                      IConfirmModal({
                        message: `Are you sure to generate MRP ?`,
                        yesAlertFunc: () => {
                          getSaveStatus(
                            `/procurement/MRPFromProduction/IsAvailableDateForMRP?businessUnitId=${values?.businessUnit?.value}&fromDate=${values?.fromDate}`,
                            (res) => {
                              if (res) {
                                return toast.warn(
                                  'The selected date is already exists',
                                );
                              } else {
                                onCreateMRPFromProduction(
                                  `/procurement/MRPFromProduction/CreateMRPFromProduction`,
                                  payload,
                                  () => {
                                    callBack(values);
                                    setShowSaveModal(false);
                                    setAutoRawMaterialData([]);
                                  },
                                  true,
                                );
                              }
                            },
                          );
                        },
                        noAlertFunc: () => {},
                      });
                    }}
                  >
                    Save
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <>
                <div className="form-group  global-form row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="businessUnit"
                      options={businessUnitList || []}
                      value={values?.businessUnit}
                      label="Business Unit"
                      onChange={(valueOption) => {
                        setFieldValue('businessUnit', valueOption || '');
                        setAutoRawMaterialData([]);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-3">
                    <InputField
                      value={values?.fromDate}
                      label="From Date"
                      name="fromDate"
                      type="date"
                      onChange={(e) => {
                        setFieldValue('fromDate', e.target.value);
                        setAutoRawMaterialData([]);
                      }}
                      disabled
                      min={_todayDate()}
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
                        setAutoRawMaterialData([]);
                      }}
                      min={values?.fromDate}
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        getData(values);
                      }}
                      disabled={!values?.businessUnit}
                      className="btn btn-primary mt-5"
                    >
                      Show
                    </button>
                  </div>
                </div>
                <div>
                  {autoRawMaterialData?.length > 0 && (
                    <div className="table-responsive">
                      <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Item Code</th>
                            <th>Item Name</th>
                            <th>UOM</th>
                            <th>Total QTY</th>
                            <th>Warehouse Stock</th>
                            <th>Floating Stock</th>
                            <th>In Transit</th>
                            <th>Open PR</th>
                            <th>Dead Stock</th>
                            <th>Available Stock</th>
                            <th>Requirment</th>
                          </tr>
                        </thead>
                        <tbody>
                          {autoRawMaterialData?.length > 0 &&
                            autoRawMaterialData?.map((item, index) => {
                              let availableStock = 0;

                              availableStock =
                                (
                                  (+item?.stockQty || 0) +
                                  (+item?.floatingStock || 0) +
                                  (+item?.numOpenPOQty || 0) -
                                  (+item?.deadStockQuantity || 0)
                                )?.toFixed(2) || 0;

                              return (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td className="text-center">
                                    {item?.itemCode}
                                  </td>
                                  <td>{item?.itemName}</td>
                                  <td className="text-center">
                                    {item?.uomName}
                                  </td>
                                  <td className="text-right">
                                    {item?.totalBudgetQty || 0}
                                  </td>
                                  <td
                                    className="text-right text-primary cursor-pointer"
                                    onClick={() => {
                                      if (!item?.stockQty) return;
                                      setWarehouseStockModalShow(true);
                                      setSingleRowData(item);
                                    }}
                                  >
                                    {item?.stockQty?.toFixed(2) || 0}
                                  </td>
                                  <td
                                    className="text-right text-primary cursor-pointer"
                                    onClick={() => {
                                      if (!item?.floatingStock) return;
                                      commonItemDetailsDispatch({
                                        type: 'FloatingStock',
                                        payload: { singleRowData: item },
                                      });
                                    }}
                                  >
                                    {item?.floatingStock || 0}
                                  </td>

                                  <td
                                    className="text-right text-primary cursor-pointer"
                                    onClick={() => {
                                      if (!item?.numOpenPOQty) return;
                                      commonItemDetailsDispatch({
                                        type: 'OpenPo',
                                        payload: { singleRowData: item },
                                      });
                                    }}
                                  >
                                    {item?.numOpenPOQty?.toFixed(2) || 0}
                                  </td>

                                  <td
                                    className="text-right text-primary cursor-pointer"
                                    onClick={() => {
                                      if (!item?.openPRQty) return;
                                      commonItemDetailsDispatch({
                                        type: 'OpenPR',
                                        payload: { singleRowData: item },
                                      });
                                    }}
                                  >
                                    {item?.openPRQty?.toFixed(2) || 0}
                                  </td>
                                  <td className="text-right">
                                    {item?.deadStockQuantity || 0}
                                  </td>
                                  <td className="text-right">
                                    {availableStock}
                                  </td>
                                  <td className="text-right">
                                    {(
                                      (+item?.totalBudgetQty || 0) -
                                      (+availableStock || 0) -
                                      (+item?.openPRQty || 0)
                                    ).toFixed(2) || 0}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            </Form>

            <IViewModal
              show={showBreakdownModal}
              onHide={() => {
                setShowBreakdownModal(false);
                setSingleRowData({});
              }}
            >
              <BreakDownModal
                singleRowData={singleRowData}
                setShowBreakdownModal={setShowBreakdownModal}
                setSingleRowData={setSingleRowData}
              />
            </IViewModal>

            {/* Warehouse Stock Details Modal */}
            <IViewModal
              show={warehouseStockModalShow}
              onHide={() => {
                setWarehouseStockModalShow(false);
                setSingleRowData({});
              }}
            >
              <WarehouseStockModal
                objProp={{
                  singleRowData,
                  setSingleRowData,
                  values,
                }}
              />
            </IViewModal>

            {/* Common Item Details Modal */}
            <IViewModal
              show={commonItemDetailsState?.modalShow}
              onHide={() => {
                commonItemDetailsDispatch({ type: 'Close' });
              }}
            >
              <CommonItemDetailsModal
                objProp={{
                  commonItemDetailsState,
                  commonItemDetailsDispatch,
                  values,
                }}
              />
            </IViewModal>

            <IViewModal
              show={showModal}
              title={'MRP Calculation'}
              onHide={() => {
                setShowModal(false);
                setSingleRowData(null);
              }}
            >
              <RawMaterialAutoPRNewModalView
                singleRowDataFromParent={singleRowData}
                values={values}
              />
            </IViewModal>
          </IForm>
        </>
      )}
    </Formik>
  );
}
