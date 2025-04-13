import React, { useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import NewSelect from '../../../../_helper/_select';
import InputField from '../../../../_helper/_inputField';
import { useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { getOrderQuantityDDL, getOtherOutputItemDDL } from '../helper';
import { toast } from 'react-toastify';
import CreateTableRow from '../Table/CreateTableRow';
import { getShopFloorDDL } from '../../../../_helper/_commonApi';
import Loading from '../../../../_helper/_loading';
import createDebounceHandler from '../../../../_helper/debounceForSave';
// import { getItemListForBackCalculation } from "../helper";

export default function FormCmp({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  isEdit,
  plantNameDDL,
  shiftDDL,
  shopFloorDDL,
  setShopFloorDDL,
  workCenterDDL,
  setWorkCenterDDL,
  itemDDL,
  setItemDDL,
  bomDDL,
  setBomDDL,
  singleData,
  rowData,
  setRowData,
  dataHandler,
}) {
  console.log('singleData: ', singleData);
  const [othersOutputItemDDL, setOthersOutputItemDDL] = useState([]);
  const debounceHandler = createDebounceHandler(5000);
  const [isLoading, setLoading] = useState(false);

  const [setGetOrderQuantity] = useState('');
  // console.log("orderQuantity", orderQuantity);
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    // console.log("Init Data => ", initData);
    if (initData?.plantId) {
      getOtherOutputItemDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        initData.plantId,
        setOthersOutputItemDDL
      );
      // getOrderQuantityDDL(
      //   profileData?.accountId,
      //   selectedBusinessUnit.value,
      //   initData?.plantName?.value,
      //   initData?.productionOrder?.value,
      //   setGetOrderQuantity
      // );
      // getProductionItemQuantity(
      //   initData?.productionOrder?.value,
      //   initData?.objHeader?.itemId,
      //   setProductionQuantity
      // );
    }
  }, [initData, profileData.accountId, selectedBusinessUnit.value]);

  const rowDataAddHandler = (values, setFieldValue) => {
    const isExist = rowData.find(
      (data) => data.itemName === values.othersOutputItem.label
    );

    if (isExist) {
      toast.warn('Item already added!');
    } else {
      // console.log("aadd handler Values", values);
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
        },
      ]);
      setFieldValue('othersOutputQty', '');
      setFieldValue('othersOutputItem', '');
    }
  };

  // useEffect(() => {
  //   console.log("Row Data => ", rowData);
  // }, [rowData]);

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
        }}
        // validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setLoading(true);
          debounceHandler({
            setLoading: setLoading,
            CB: () => {
              saveHandler(values, () => {
                resetForm(initData);
              });
            },
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
            {console.log('values: ', values)}
            {isLoading && <Loading />}
            {/* {disableHandler(!isValid)} */}
            <Form>
              <div className="row">
                {/* backCalculation true */}
                <div className="col-lg-12">
                  <div className="form form-label-right">
                    <div className="form-group row global-form">
                      <div className="col-lg-3">
                        <NewSelect
                          name="plantName"
                          options={plantNameDDL}
                          value={values?.plantName}
                          onChange={(valueOption) => {
                            // console.log(valueOption);
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
                            // setFieldValue("itemName", "");
                            setFieldValue('productionOrder', '');
                            setFieldValue('othersOutputItem', '');
                          }}
                          placeholder="Plant Name"
                          errors={errors}
                          touched={touched}
                          isDisabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          name="shopFloor"
                          value={values?.shopFloorDDL?.label}
                          label="Shop Floor"
                          type="text"
                          errors={errors}
                          touched={touched}
                          disabled
                          // disabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          name="workcenterName"
                          value={values?.shopFloorDDL?.label}
                          placeholder="Work Center"
                          label="Work Center"
                          type="text"
                          errors={errors}
                          touched={touched}
                          disabled
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          name="itemName"
                          options={itemDDL}
                          value={values?.itemDDL?.label}
                          placeholder="Item Name"
                          label="Item Name"
                          errors={errors}
                          touched={touched}
                          disabled
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          name="uomName"
                          value={values?.uomName}
                          label="UoM Name"
                          placeholder="UoM Name"
                          type="text"
                          errors={errors}
                          touched={touched}
                          disabled
                          // disabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="bomName"
                          options={bomDDL}
                          value={values?.bomName}
                          onChange={(valueOption) => {
                            setFieldValue('bomName', valueOption);
                          }}
                          placeholder="BOM Name"
                          label="BOM Name"
                          errors={errors}
                          touched={touched}
                          isDisabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Production Date</label>
                        <InputField
                          value={values?.productionDate}
                          name="dteProductionDate"
                          placeholder="Production Date"
                          type="date"
                          disabled
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="shift"
                          options={shiftDDL}
                          value={values?.shift ? values.shift : ''}
                          onChange={(valueOption) => {
                            setFieldValue('shift', valueOption);
                          }}
                          placeholder="Shift"
                          errors={errors}
                          touched={touched}
                          isDisabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          name="goodQty"
                          value={values?.goodQty >= 0 ? values?.goodQty : ''}
                          label="Good Qty"
                          step="any"
                          min="1"
                          onChange={(e) => {
                            setFieldValue('goodQty', e.target.value);
                          }}
                          placeholder="Good Qty"
                          type="number"
                          errors={errors}
                          touched={touched}
                          // disabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-12 pl-2 d-flex align-items-end">
                        <div>
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
                              setFieldValue(
                                'checkOutputItem',
                                e.target.checked
                              );
                            }}
                            disabled={
                              !values?.plantName?.value ||
                              !values?.dteProductionDate ||
                              !values?.shift?.value ||
                              !values?.goodQty
                            }
                          />
                        </div>
                      </div>
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
              </div>
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
