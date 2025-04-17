import Axios from 'axios';
import { Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import * as Yup from 'yup';
import { Input } from '../../../../../../../../_metronic/_partials/controls';
import { IInput } from '../../../../../../_helper/_input';
import InputField from '../../../../../../_helper/_inputField';
import NewSelect from '../../../../../../_helper/_select';
import customStyles from '../../../../../../selectCustomStyle';
import createDebounceHandler from '../../../../../../_helper/debounceForSave';
import Loading from '../../../../../../_helper/_loading';

const DataValiadtionSchema = Yup.object().shape({
  numGrossWeight: Yup.number()
    .required('Gross Weight (Kg) required')
    .min(0, 'Minimum 0'),
  numNetWeight: Yup.number()
    .required('Net Weight (Kg) required')
    .min(0, 'Minimum 0'),
  plant: Yup.object().shape({
    label: Yup.string().required('Plant is required'),
    value: Yup.string().required('Plant is required'),
  }),
  baseUom: Yup.object().shape({
    label: Yup.string().required('Base Uom is required'),
    value: Yup.string().required('Base Uom is required'),
  }),
});

export default function FormCmp({
  isViewPage,
  productData,
  saveBtnRef,
  saveData,
  resetBtnRef,
  disableHandler,
  defaultSetter,
  rowDto,
  defaultRowDto,
  setDefaultRowDto,
  baseSetter,
  accountId,
  selectedBusinessUnit,
  userId,
  existUOMData,
}) {
  const [plantList, setPlantList] = useState([]);
  const [whList, setWhList] = useState([]);
  const [inventoryLocationList, setInventoryLocationList] = useState([]);
  const [baseUomList, setBaseUomList] = useState([]);
  const debounceHandler = createDebounceHandler(5000);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (accountId && selectedBusinessUnit) {
      getPlantItemPlantWareHouseDDL(
        userId,
        accountId,
        selectedBusinessUnit?.value
      );
      getItemUOMDDL(accountId, selectedBusinessUnit?.value);
    }
  }, [selectedBusinessUnit, accountId]);

  useEffect(() => {
    if (accountId && selectedBusinessUnit?.value && productData?.plant?.value) {
      whApiCaller(
        accountId,
        selectedBusinessUnit?.value,
        productData?.plant?.value
      );
    }
  }, [selectedBusinessUnit, accountId, productData]);

  useEffect(() => {
    if (accountId && selectedBusinessUnit?.value && plantList[0]?.value) {
      whApiCaller(accountId, selectedBusinessUnit?.value, plantList[0]?.value);
    }
  }, [selectedBusinessUnit, accountId, plantList]);

  const getPlantItemPlantWareHouseDDL = async (
    userId,
    accId,
    businessUnitId
  ) => {
    try {
      const res = await Axios.get(
        `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${businessUnitId}&OrgUnitTypeId=7`
      );
      const { status, data } = res;
      if (status === 200 && data.length) {
        setPlantList(data);
      }
    } catch (error) {}
  };
  const getItemUOMDDL = async (accountId, businessUnitId) => {
    try {
      const res = await Axios.get(
        `/item/ItemUOM/GetItemUOMByAccountIdBusinessUnitId?AccountId=${accountId}&BusinessUnitId=${businessUnitId}`
      );
      const { status, data } = res;
      if (status === 200 && data.length) {
        const baseUoms = [];
        data &&
          data.forEach((item) => {
            let items = {
              value: item.uomid,
              label: item.uomName,
            };
            baseUoms.push(items);
          });
        setBaseUomList(baseUoms);
      }
    } catch (error) {}
  };

  const whApiCaller = async (accountId, businessUnitId, v) => {
    try {
      const res = await Axios.get(
        `/wms/ConfigPlantWearHouse/GetWareHouseDDL?AccountId=${accountId}&BusinessUnitId=${businessUnitId}&PlantId=${v}`
      );

      const newData = res?.data?.map((item) => ({
        value: item.value,
        label: item.label,
      }));

      setWhList(newData);
    } catch (error) {
      setWhList([]);
    }
  };

  // Get inventory location by warehouseid and plantid
  const inventoryLocationAPiCaller = async (whid, plantId) => {
    const res = await Axios.get(
      `/wms/InventoryLocation/GetInventoryLocationDDL?AccountId=${accountId}&BusinessUnitId=${selectedBusinessUnit.value}&plantId=${plantId}&WhId=${whid}`
    );
    const { status, data } = res;
    if (status && data?.length) {
      let inventoryLocations = [];
      data &&
        data.forEach((item) => {
          let items = {
            value: item?.value,
            label: item?.label,
          };
          inventoryLocations.push(items);
        });
      setInventoryLocationList(inventoryLocations);
      inventoryLocations = null;
    } else {
      setInventoryLocationList([]);
    }
  };

  const rowDtoHandler = (name, index, value) => {
    const data = [...defaultRowDto];
    data[index][name] = value;
    setDefaultRowDto(data);
  };

  useEffect(() => {}, [baseUomList, productData]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...productData,
          plant: {
            value: plantList ? plantList[0]?.value : '',
            label: plantList ? plantList[0]?.label : '',
          },
          baseUom: {
            value: existUOMData?.baseUom ? existUOMData?.baseUom : '',
            label: existUOMData ? existUOMData?.baseUomName : '',
          },
          isMultipleUom: rowDto?.length > 1 ? true : false,
          numNetWeight: existUOMData?.numNetWeight || 0,
          numGrossWeight: existUOMData?.numGrossWeight || 0,
        }}
        validationSchema={DataValiadtionSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setIsLoading(true);
          debounceHandler({
            setLoading: setIsLoading,
            CB: () => {
              saveData(values, () => {
                resetForm(productData);
              });
            },
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          handleChange,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {disableHandler(!isValid)}
            {isLoading && <Loading />}
            <Form className="form form-label-right">
              {!isViewPage && (
                <div className="form-group row align-content-center my-5 global-form">
                  <div className="col-lg-3  p-1">
                    <NewSelect
                      name="plant"
                      options={plantList || []}
                      value={values?.plant}
                      label="Select Plant"
                      onChange={(valueOption) => {
                        setFieldValue('warehouse', '');
                        setFieldValue('inventoryLocation', '');
                        whApiCaller(
                          accountId,
                          selectedBusinessUnit?.value,
                          valueOption?.value
                        );
                        setFieldValue('plant', valueOption);
                      }}
                      placeholder="Select Plant"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Select Warehouse</label>
                    <Field
                      component={() => (
                        <Select
                          options={whList}
                          placeholder="Select Warehouse"
                          value={values?.warehouse}
                          onChange={(valueOption) => {
                            setFieldValue('inventoryLocation', '');
                            setFieldValue('warehouse', valueOption);
                            inventoryLocationAPiCaller(
                              valueOption?.value,
                              values?.plant?.value
                            );
                          }}
                          isSearchable={true}
                          styles={customStyles}
                          isDisabled={!whList?.length}
                        />
                      )}
                    />
                    <p
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: 400,
                        width: '100%',
                        marginTop: '0.25rem',
                      }}
                      className="text-danger"
                    >
                      {errors &&
                      errors.warehouse &&
                      touched &&
                      touched.warehouse
                        ? errors.warehouse.value
                        : ''}
                    </p>
                  </div>
                  <div className="col-lg-3">
                    <label>Select Inventory Location</label>
                    <Field
                      name="inventoryLocation"
                      component={() => (
                        <Select
                          options={inventoryLocationList}
                          placeholder="Select Inventory Location"
                          value={values.inventoryLocation}
                          onChange={(valueOption) => {
                            setFieldValue('inventoryLocation', valueOption);
                          }}
                          isSearchable={true}
                          styles={customStyles}
                          isDisabled={!whList.length}
                          name="inventoryLocation"
                        />
                      )}
                    />
                    <p
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: 400,
                        width: '100%',
                        marginTop: '0.25rem',
                      }}
                      className="text-danger"
                    >
                      {errors &&
                      errors.inventoryLocation &&
                      touched &&
                      touched.inventoryLocation
                        ? errors.inventoryLocation.value
                        : ''}
                    </p>
                  </div>
                  <div className="col-lg-3">
                    <label>Bin Number</label>
                    <InputField
                      value={values?.binNumber}
                      name="binNumber"
                      placeholder="Bin Number"
                      type="text"
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Minimum Stock QTY</label>
                    <InputField
                      value={values?.minStockQty}
                      name="minStockQty"
                      placeholder="Minimum Stock Qty"
                      type="number"
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Safety Stock QTY</label>
                    <InputField
                      value={values?.safetyStockQty}
                      name="safetyStockQty"
                      placeholder="Safety Stock Qty"
                      type="number"
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Maximum Stock QTY</label>
                    <InputField
                      value={values?.maxStockQty}
                      name="maxStockQty"
                      placeholder="Maximum Stock Qty"
                      type="number"
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Reorder Level</label>
                    <InputField
                      value={values?.reOrderLevel}
                      name="reOrderLevel"
                      placeholder="Reorder Level"
                      type="number"
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Reorder Qty</label>
                    <InputField
                      value={values?.reOrderQty}
                      name="reOrderQty"
                      placeholder="Reorder Qty"
                      type="number"
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Avg Daily Consumption</label>
                    <InputField
                      value={values?.avgDailyConsumption}
                      name="avgDailyConsumption"
                      placeholder="Avg Daily Consumption  "
                      type="number"
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Max Lead Days</label>
                    <InputField
                      value={values?.maxLeadDays}
                      name="maxLeadDays"
                      placeholder="Max Lead Days"
                      type="number"
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Minimum Lead Days</label>
                    <InputField
                      value={values?.minLeadDays}
                      name="minLeadDays"
                      placeholder="Min Lead Days"
                      type="number"
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>ABC</label>
                    <InputField value={values?.abc} name="abc" type="number" />
                  </div>
                  <div className="col-lg-3">
                    <label>VED</label>
                    <InputField value={values?.ved} name="ved" type="number" />
                  </div>
                  <div className="col-lg-3">
                    <label>FNS</label>
                    <InputField value={values?.fns} name="fns" type="number" />
                  </div>
                  {selectedBusinessUnit?.value === 102 ? (
                    <div className="col-lg-3">
                      <label>Item Sub Head</label>
                      <InputField
                        value={values?.shippingItemSubHead}
                        name="shippingItemSubHead"
                      />
                    </div>
                  ) : null}
                  <div className="col-lg-1">
                    <button
                      disabled={
                        !values?.plant?.value ||
                        !values?.warehouse?.value ||
                        !values?.inventoryLocation?.value ||
                        !values?.binNumber
                      }
                      type="button"
                      onClick={() => {
                        const obj = {
                          plantId: values?.plant?.value,
                          binNumber: values?.binNumber,
                          plantName: values?.plant?.label,
                          warehouseId: values?.warehouse?.value,
                          wareHouseName: values?.warehouse?.label,
                          inventoryLocationId: values?.inventoryLocation?.value,
                          inventoryLocationName:
                            values?.inventoryLocation?.label,
                          averageDailyConsumption:
                            values?.avgDailyConsumption || 0,
                          maximumQuantity: values?.maxStockQty || 0,
                          maxLeadDays: values?.maxLeadDays || 0,
                          minimumStockQuantity: values?.minStockQty || 0,
                          minLeadDays: values?.minLeadDays || 0,
                          abc: values?.abc || 0,
                          ved: values?.ved || 0,
                          fns: values?.fns || 0,
                          shippingItemSubHead: values?.shippingItemSubHead,
                          reorderLevel: values?.reOrderLevel || 0,
                          reorderQuantity: values?.reOrderQty || 0,
                          safetyStockQuantity: values?.safetyStockQty || 0,
                        };
                        defaultSetter(obj);
                      }}
                      style={{ marginTop: '23px' }}
                      className="btn btn-primary"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
              <div className="common-scrollable-table two-column-sticky">
                <div className="scroll-table _table">
                  <table className="table table-striped table-bordered my-5 global-table">
                    <thead>
                      <tr className="text-center">
                        <th>SL</th>
                        <th>Plant</th>
                        <th>Warehouse</th>
                        <th>Location</th>
                        <th style={{ width: '200px' }}>Bin Number</th>
                        <th style={{ width: '200px' }}>
                          Minimum Stock Quantity
                        </th>
                        <th style={{ width: '200px' }}>
                          {' '}
                          Safety Stock Quantity
                        </th>
                        <th style={{ width: '200px' }}> Maximum Qty</th>
                        <th style={{ width: '200px' }}> Reorder Level</th>
                        <th style={{ width: '200px' }}>Reorder Qty</th>
                        <th style={{ width: '200px' }}>
                          Avg Daily Consumption
                        </th>
                        <th style={{ width: '200px' }}>Max Lead Days</th>
                        <th style={{ width: '200px' }}>Min Lead Days</th>
                        <th style={{ width: '200px' }}>ABC</th>
                        <th style={{ width: '200px' }}>VED</th>
                        <th style={{ width: '200px' }}>FNS</th>
                        {selectedBusinessUnit?.value === 102 && (
                          <th style={{ width: '200px' }}>Item Sub Head</th>
                        )}

                        {/* <th>UoM</th> */}
                        {/* <th>Action</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {defaultRowDto &&
                        defaultRowDto.map((itm, i) => (
                          <tr
                            key={i}
                            style={{
                              marginBottom: '15px',
                              textAlign: 'center',
                            }}
                          >
                            <td>{i + 1}</td>
                            <td>{itm?.plantName}</td>
                            <td>{itm?.wareHouseName}</td>
                            <td>{itm?.inventoryLocationName}</td>

                            <td
                              className="disabled-feedback disable-border"
                              style={{ width: '100px' }}
                            >
                              <IInput
                                value={itm?.binNumber || ''}
                                name="binNumber"
                                type="text"
                                onChange={(e) => {
                                  rowDtoHandler('binNumber', i, e.target.value);
                                }}
                              />
                            </td>
                            <td
                              className="disabled-feedback disable-border"
                              style={{ width: '100px' }}
                            >
                              <IInput
                                value={itm?.minimumStockQuantity || ''}
                                name="minimumStockQuantity"
                                type="number"
                                onChange={(e) => {
                                  rowDtoHandler(
                                    'minimumStockQuantity',
                                    i,
                                    +e.target.value
                                  );
                                }}
                              />
                            </td>
                            <td
                              className="disabled-feedback disable-border"
                              style={{ width: '100px' }}
                            >
                              <IInput
                                value={itm?.safetyStockQuantity || ''}
                                name="safetyStockQuantity"
                                type="number"
                                onChange={(e) => {
                                  rowDtoHandler(
                                    'safetyStockQuantity',
                                    i,
                                    +e.target.value
                                  );
                                }}
                              />
                            </td>
                            <td
                              className="disabled-feedback disable-border"
                              style={{ width: '100px' }}
                            >
                              <IInput
                                value={itm?.maximumQuantity || ''}
                                name="maximumQuantity"
                                type="number"
                                onChange={(e) => {
                                  rowDtoHandler(
                                    'maximumQuantity',
                                    i,
                                    +e.target.value
                                  );
                                }}
                              />
                            </td>
                            <td
                              className="disabled-feedback disable-border"
                              style={{ width: '100px' }}
                            >
                              <IInput
                                value={itm?.reorderLevel || ''}
                                name="reorderLevel"
                                type="number"
                                onChange={(e) => {
                                  rowDtoHandler(
                                    'reorderLevel',
                                    i,
                                    +e.target.value
                                  );
                                }}
                              />
                            </td>
                            <td
                              className="disabled-feedback disable-border"
                              style={{ width: '100px' }}
                            >
                              <IInput
                                value={itm?.reorderQuantity || ''}
                                name="reorderQuantity"
                                type="number"
                                onChange={(e) => {
                                  rowDtoHandler(
                                    'reorderQuantity',
                                    i,
                                    +e.target.value
                                  );
                                }}
                              />
                            </td>
                            <td
                              className="disabled-feedback disable-border"
                              style={{ width: '100px' }}
                            >
                              <IInput
                                value={itm?.averageDailyConsumption || ''}
                                name="averageDailyConsumption"
                                type="number"
                                onChange={(e) => {
                                  rowDtoHandler(
                                    'averageDailyConsumption',
                                    i,
                                    +e.target.value
                                  );
                                }}
                              />
                            </td>
                            <td
                              className="disabled-feedback disable-border"
                              style={{ width: '100px' }}
                            >
                              <IInput
                                value={itm?.maxLeadDays || ''}
                                name="maxLeadDays"
                                type="number"
                                onChange={(e) => {
                                  rowDtoHandler(
                                    'maxLeadDays',
                                    i,
                                    +e.target.value
                                  );
                                }}
                              />
                            </td>
                            <td
                              className="disabled-feedback disable-border"
                              style={{ width: '100px' }}
                            >
                              <IInput
                                value={itm?.minLeadDays || ''}
                                name="minLeadDays"
                                type="number"
                                onChange={(e) => {
                                  rowDtoHandler(
                                    'minLeadDays',
                                    i,
                                    +e.target.value
                                  );
                                }}
                              />
                            </td>
                            <td
                              className="disabled-feedback disable-border"
                              style={{ width: '100px' }}
                            >
                              <IInput
                                value={itm?.abc || ''}
                                name="abc"
                                type="number"
                                onChange={(e) => {
                                  rowDtoHandler('abc', i, +e.target.value);
                                }}
                              />
                            </td>
                            <td
                              className="disabled-feedback disable-border"
                              style={{ width: '100px' }}
                            >
                              <IInput
                                value={itm?.ved || ''}
                                name="ved"
                                type="number"
                                onChange={(e) => {
                                  rowDtoHandler('ved', i, +e.target.value);
                                }}
                              />
                            </td>
                            <td
                              className="disabled-feedback disable-border"
                              style={{ width: '100px' }}
                            >
                              <IInput
                                value={itm?.fns || ''}
                                name="fns"
                                type="number"
                                onChange={(e) => {
                                  rowDtoHandler('fns', i, +e.target.value);
                                }}
                              />
                            </td>
                            {selectedBusinessUnit?.value === 102 && (
                              <td
                                className="disabled-feedback disable-border"
                                style={{ width: '100px' }}
                              >
                                <IInput
                                  value={itm?.shippingItemSubHead || ''}
                                  name="shippingItemSubHead"
                                  onChange={(e) => {
                                    rowDtoHandler(
                                      'shippingItemSubHead',
                                      i,
                                      e.target.value
                                    );
                                  }}
                                />
                              </td>
                            )}

                            {/* <td>
                            <span
                              className="pointer alterUomDeleteIcon"
                              style={{
                                width: "50%",
                                marginTop: "3px",
                              }}
                            >
                              <i
                                onClick={() => defaultRemover(i)}
                                className="fa fa-trash"
                                aria-hidden="true"
                              ></i>
                            </span>
                          </td> */}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="form-group row align-content-center my-5 global-form">
                <div className="col-12">
                  <h6>Unit of Measurement Convertion</h6>
                </div>
                {!isViewPage && (
                  <>
                    <div className="col-lg-3">
                      <label>Base UOM</label>

                      <Field
                        name="baseUom"
                        component={() => (
                          <Select
                            options={baseUomList || []}
                            placeholder="Select Base UOM"
                            value={values?.baseUom}
                            onChange={(valueOption) => {
                              const obj = {
                                baseUomId: valueOption?.value,
                                baseUomName: valueOption?.label,
                                convertedUom:
                                  values?.alternateUom?.value ||
                                  valueOption?.value,
                                convertedUomName:
                                  values?.alternateUom?.label ||
                                  valueOption?.label,
                                numConversionRate:
                                  values?.conversionBaseUom || 1,
                              };
                              baseSetter(obj);
                              setFieldValue('baseUom', valueOption);
                            }}
                            isSearchable={true}
                            styles={customStyles}
                            name="baseUom"
                            isDisabled={existUOMData?.baseUom}
                          />
                        )}
                        placeholder="Select Base UOM"
                        label="Select Base UOM"
                      />
                      <p
                        style={{
                          fontSize: '0.9rem',
                          fontWeight: 400,
                          width: '100%',
                          marginTop: '0.25rem',
                        }}
                        className="text-danger"
                      >
                        {errors && errors.baseUom && touched && touched.baseUom
                          ? errors.baseUom.value
                          : ''}
                      </p>
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values.numGrossWeight}
                        name="numGrossWeight"
                        placeholder="Gross Weight (Kg)"
                        label="Gross Weight (Kg)"
                        type="number"
                      />
                    </div>
                    <div className="col-lg-3">
                      <Field
                        value={values.numNetWeight}
                        name="numNetWeight"
                        component={Input}
                        placeholder="Net Weight (Kg)"
                        label="Net Weight (Kg)"
                        type="number"
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="table-responsive">
                <table className="table table-striped table-bordered my-5 global-table">
                  <thead>
                    <tr className="text-center">
                      <th>SL</th>
                      <th>Base Uom</th>
                      <th>Base Value</th>
                      <th>Alternate UoM</th>
                      <th>Alternate Value</th>
                      {/* <th>Action</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {rowDto &&
                      rowDto?.map((itm, idx) => (
                        <tr
                          key={itm?.sl}
                          style={{
                            marginBottom: '15px',
                            textAlign: 'center',
                          }}
                        >
                          <td>{idx + 1}</td>
                          <td>{itm?.baseUomName}</td>
                          <td>{1}</td>
                          <td>{itm?.convertedUomName}</td>
                          <td>{itm?.numConversionRate}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>{' '}
              </div>

              {/* </div> */}

              <button
                type="submit"
                style={{ display: 'none' }}
                ref={saveBtnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: 'none' }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(productData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
