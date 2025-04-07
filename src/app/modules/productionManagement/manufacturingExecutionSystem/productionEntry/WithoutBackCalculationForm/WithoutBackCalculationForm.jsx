import { Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import InputField from '../../../../_helper/_inputField';
import NewSelect from '../../../../_helper/_select';
import IViewModal from '../../../../_helper/_viewModal';
import CreateTableRow from '../Table/CreateTableRow';
import {
  getOrderQuantityDDL,
  getOtherOutputItemDDL,
  getProductionItemQuantity,
  getProductionOrderDDL,
  getShopFloorDDL,
  getWorkCenterDDL,
} from '../helper';
import BackCalculationModal from './backCalculationModal';
import { _formatMoney } from '../../../../_helper/_formatMoney';

export default function FormCmp({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  isEdit,
  // disableHandler,
  plantNameDDL,
  shiftDDL,
  rowData,
  setRowData,
  dataHandler,
  rowDataForAddConsumption,
  setRowDataForAddConsumption,
}) {
  const [othersOutputItemDDL, setOthersOutputItemDDL] = useState([]);
  const [productionOrderDDL, setProductionOrderDDL] = useState([]);
  const [shopFloorDDL, setShopFloorDDL] = useState([]);
  const [workCenterDDL, setWorkCenterDDL] = useState([]);
  const [orderQuantity, setGetOrderQuantity] = useState('');
  const [productionItemQuantity, setProductionQuantity] = useState('');
  const [isShowModal, setIsShowModal] = useState(false);
  const location = useLocation();

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (initData?.plantId) {
      getOtherOutputItemDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        initData.plantId,
        setOthersOutputItemDDL
      );
      getOrderQuantityDDL(
        profileData?.accountId,
        selectedBusinessUnit.value,
        initData?.plantName?.value,
        initData?.productionOrder?.value,
        setGetOrderQuantity
      );
      getProductionItemQuantity(
        initData?.productionOrder?.value,
        initData?.objHeader?.itemId,
        setProductionQuantity
      );
    }
  }, [initData, profileData.accountId, selectedBusinessUnit.value]);

  const rowDataAddHandler = (values, setFieldValue) => {
    const isExist = rowData.find(
      (data) => data.itemName === values.othersOutputItem.label
    );

    if (isExist) {
      toast.warn('Item already added!');
    } else {
      setRowData([
        ...rowData,
        {
          productionRowId: 0,
          productionOrderId: values?.productionOrder?.value,
          productionOrderCode: values?.productionOrder?.label,
          uomid: values?.productionOrder?.uomId,
          itemId: values?.othersOutputItem?.value,
          itemName: values?.othersOutputItem?.label,
          uomName: values?.othersOutputItem?.description,
          numQuantity: values?.othersOutputQty,
          approvedItemId: values?.othersOutputItem?.value,
          numApprovedQuantity: 0,
          uomId: values?.othersOutputItem?.baseUomid,
          code: values?.othersOutputItem?.code,
        },
      ]);
      setFieldValue('othersOutputQty', '');
      setFieldValue('othersOutputItem', '');
    }
  };

  const isBackCalculationValue = location?.state?.data?.isBackCalculation;

  const deleteHandler = (id) => {
    const deleteData = rowData.filter((data, index) => id !== index);
    setRowData(deleteData);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          totalAmount: '',
          rate: '',
          qty: '',
        }}
        // validationSchema={validationSchema}
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
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form>
              <div className="row">
                {/* backCalculation true */}
                <div className="col-lg-9">
                  <div className="form form-label-right">
                    <div className="form-group row global-form">
                      <div className="col-lg-3">
                        <NewSelect
                          name="plantName"
                          options={plantNameDDL}
                          value={values?.plantName}
                          onChange={(valueOption) => {
                            getOtherOutputItemDDL(
                              profileData?.accountId,
                              selectedBusinessUnit?.value,
                              valueOption?.value,
                              setOthersOutputItemDDL
                            );
                            getShopFloorDDL(
                              profileData?.accountId,
                              selectedBusinessUnit?.value,
                              valueOption?.value,
                              setShopFloorDDL
                            );
                            // getProductionOrderDDL(
                            //   profileData.accountId,
                            //   selectedBusinessUnit.value,
                            //   valueOption?.value,
                            //   setProductionOrderDDL
                            // );
                            getOrderQuantityDDL(
                              profileData?.accountId,
                              selectedBusinessUnit.value,
                              valueOption?.value,
                              values?.productionOrder?.value,
                              setGetOrderQuantity
                            );
                            setFieldValue('plantName', valueOption);
                            setFieldValue('shopFloor', '');
                            setFieldValue('productionOrder', '');
                            setFieldValue('othersOutputItem', '');
                            setFieldValue('materialCost', '');
                            setFieldValue('overheadCost', '');
                          }}
                          placeholder="Plant Name"
                          errors={errors}
                          touched={touched}
                          isDisabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="shopFloor"
                          options={shopFloorDDL}
                          value={values?.shopFloor}
                          onChange={(valueOption) => {
                            setFieldValue('workcenterName', '');
                            setFieldValue('materialCost', '');
                            setFieldValue('overheadCost', '');
                            setFieldValue('shopFloor', valueOption);
                            getWorkCenterDDL(
                              profileData?.accountId,
                              selectedBusinessUnit?.value,
                              values?.plantName?.value,
                              valueOption?.value,
                              setWorkCenterDDL
                            );
                          }}
                          placeholder="Shop Floor"
                          label="Shop Floor"
                          errors={errors}
                          touched={touched}
                          isDisabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="workcenterName"
                          options={workCenterDDL}
                          value={values?.workcenterName}
                          onChange={(valueOption) => {
                            setFieldValue('productionOrder', '');
                            setFieldValue('materialCost', '');
                            setFieldValue('overheadCost', '');
                            setFieldValue('workcenterName', valueOption);
                            getProductionOrderDDL(
                              profileData.accountId,
                              selectedBusinessUnit.value,
                              values?.plantName?.value,
                              values?.shopFloor?.value,
                              valueOption?.value,
                              setProductionOrderDDL
                            );
                          }}
                          placeholder="Work Center"
                          label="Work Center"
                          errors={errors}
                          touched={touched}
                          isDisabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="productionOrder"
                          options={productionOrderDDL}
                          value={values?.productionOrder}
                          onChange={(valueOption) => {
                            setProductionQuantity([]);
                            getOrderQuantityDDL(
                              profileData?.accountId,
                              selectedBusinessUnit.value,
                              values?.plantName?.value,
                              valueOption?.value,
                              setGetOrderQuantity
                            );
                            getProductionItemQuantity(
                              valueOption?.value,
                              valueOption?.itemId,
                              setProductionQuantity
                            );
                            setFieldValue('productionOrder', valueOption);
                            setFieldValue('materialCost', '');
                            setFieldValue('overheadCost', '');
                          }}
                          placeholder="Production Order"
                          label="Production Order"
                          errors={errors}
                          touched={touched}
                          isDisabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Production Date</label>
                        <InputField
                          value={values?.dteProductionDate}
                          name="dteProductionDate"
                          placeholder="Production Date"
                          type="date"
                          onChange={(e) => {
                            if (e?.target?.value) {
                              setFieldValue(
                                'dteProductionDate',
                                e?.target?.value
                              );
                            }
                          }}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="shift"
                          options={shiftDDL}
                          value={values?.shift ? values.shift : ''}
                          onChange={(valueOption) => {
                            setFieldValue('shift', valueOption);
                            setFieldValue('materialCost', '');
                            setFieldValue('overheadCost', '');
                          }}
                          placeholder="Shift"
                          errors={errors}
                          touched={touched}
                          // isDisabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          name="goodQty"
                          value={values?.goodQty >= 0 ? values?.goodQty : ''}
                          label="Good Qty"
                          step="any"
                          onChange={(e) => {
                            setFieldValue('goodQty', e.target.value);
                            setFieldValue('materialCost', '');
                            setFieldValue('overheadCost', '');
                          }}
                          placeholder="Good Qty"
                          type="number"
                          errors={errors}
                          touched={touched}
                          // disabled={isEdit}
                        />
                      </div>
                      {isBackCalculationValue === 2 && (
                        <div className="col-lg-3">
                          <button
                            type="button"
                            style={{ marginTop: '19px' }}
                            className={'btn btn-primary mr-2'}
                            onClick={() => {
                              setIsShowModal(true);
                            }}
                            disabled={
                              !values?.plantName ||
                              !values?.shopFloor ||
                              !values?.workcenterName ||
                              !values?.productionOrder ||
                              !values?.dteProductionDate ||
                              !values?.shift ||
                              !values?.goodQty
                            }
                          >
                            Add Consumption
                          </button>
                        </div>
                      )}
                      <div className="col-lg-12 pl-2 d-flex align-items-end" />
                      <div className="col-lg-2">
                        <label className="p-2"> Output Item</label>
                        <Field
                          className="p-2"
                          type="checkbox"
                          name="checkOutputItem"
                          checked={
                            values?.checkOutputItem >= 0
                              ? values?.checkOutputItem
                              : ''
                          }
                          value={
                            values?.checkOutputItem
                              ? values?.checkOutputItem
                              : ''
                          }
                          onChange={(e) => {
                            setFieldValue('checkOutputItem', e.target.checked);
                          }}
                          disabled={
                            !values?.plantName?.value ||
                            !values?.productionOrder?.value ||
                            !values?.dteProductionDate ||
                            !values?.shift?.value ||
                            !values?.goodQty
                          }
                        />
                      </div>
                      {isBackCalculationValue === 2 && (
                        <div className="col-lg-3">
                          <label className="p-2">Is Last Production</label>
                          <Field
                            className="p-2"
                            type="checkbox"
                            name="isLastProduction"
                            checked={values?.isLastProduction}
                            onChange={(e) => {
                              setFieldValue(
                                'isLastProduction',
                                e.target.checked
                              );
                            }}
                          />
                        </div>
                      )}
                      {values?.checkOutputItem === true ? (
                        <>
                          <div className="col-lg-12 pl-0 d-flex">
                            <div className="col-lg-4">
                              <NewSelect
                                name="othersOutputItem"
                                options={othersOutputItemDDL}
                                value={values?.othersOutputItem}
                                onChange={(valueOption) => {
                                  setFieldValue(
                                    'othersOutputItem',
                                    valueOption
                                  );
                                }}
                                placeholder="Others Output Item"
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                            <div className="col-lg-4">
                              <InputField
                                name="othersOutputQty"
                                value={
                                  values?.othersOutputQty >= 0
                                    ? values?.othersOutputQty
                                    : ''
                                }
                                min="1"
                                label="Others Output Quantity"
                                placeholder="Others Output Quantity"
                                type="number"
                              />
                            </div>
                            <div className="col-lg-4 pt-5 mt-2">
                              <button
                                disabled={
                                  !values.othersOutputItem ||
                                  !values.othersOutputQty ||
                                  values.othersOutputQty < 0 ||
                                  !values.shift ||
                                  !values.productionOrder ||
                                  !values.plantName
                                }
                                className="btn btn-primary"
                                type="button"
                                onClick={(e) =>
                                  rowDataAddHandler(values, setFieldValue)
                                }
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                  {values?.checkOutputItem === true ? (
                    <CreateTableRow
                      values={values}
                      isEdit={isEdit}
                      rowData={rowData}
                      deleteHandler={deleteHandler}
                      dataHandler={dataHandler}
                    />
                  ) : null}
                </div>
                <div className="col-lg-3 py-4 bank-journal-custom bj-right">
                  <p className="font-weight-bold">
                    Item Name: {orderQuantity[0]?.itemName}
                  </p>
                  <div className="d-flex justify-content-between">
                    <p className="m-0 font-weight-bold">
                      Order Quantity: {orderQuantity[0]?.quantity}
                    </p>
                    <p className="m-0 font-weight-bold">
                      Produced Quantity: {productionItemQuantity}{' '}
                    </p>
                  </div>
                  <p className="mt-3 font-weight-bold">
                    UoM: {orderQuantity[0]?.uomName}{' '}
                  </p>
                  {isBackCalculationValue === 2 && (
                    <>
                      <p className="mt-3 font-weight-bold">
                        Material Cost: {_formatMoney(values?.materialCost)}
                      </p>
                      <p className="mt-3 font-weight-bold">
                        Overhead Cost: {_formatMoney(values?.overheadCost)}
                      </p>
                      <p className="mt-3 font-weight-bold">
                        Grand Total:{' '}
                        {_formatMoney(
                          values?.materialCost + values?.overheadCost
                        )}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Modal */}
              <IViewModal
                show={isShowModal}
                onHide={() => setIsShowModal(false)}
              >
                <BackCalculationModal
                  values={values}
                  setFieldValue={setFieldValue}
                  setIsShowModal={setIsShowModal}
                  rowData={rowDataForAddConsumption}
                  setRowData={setRowDataForAddConsumption}
                />
              </IViewModal>

              <button
                type="submit"
                style={{ display: 'none' }}
                ref={btnRef}
                onClick={() => handleSubmit}
              ></button>
              <button
                type="reset"
                style={{ display: 'none' }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
            <br />
          </>
        )}
      </Formik>
    </>
  );
}
