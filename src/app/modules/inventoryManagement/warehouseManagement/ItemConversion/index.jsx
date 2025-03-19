import axios from 'axios';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import FormikError from '../../../_helper/_formikError';
import IDelete from '../../../_helper/_helperIcons/_delete';
import InputField from '../../../_helper/_inputField';
import NewSelect from '../../../_helper/_select';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import SearchAsyncSelect from '../../../_helper/SearchAsyncSelect';
import IForm from '../../../_helper/_form';
import Loading from '../../../_helper/_loading';

const initData = {
  plant: '',
  warehouse: '',
  item: '',
  convertedPlant: '',
  convertedWarehouse: '',
  convertedItem: '',
  convertedQuantity: '',
};

export default function ItemConversionLanding() {
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const [objProps, setObjprops] = useState({});
  const [plantDDL, getPlantDDL] = useAxiosGet();
  const [warehouseDDL, getWarehouseDDL, , setWarehouseDDL] = useAxiosGet();
  const [rowDto, setRowDto] = useState([]);
  const [, onCreateCoversion, loader] = useAxiosPost();
  const [currentItemStock, getItemStockQty, itemStockQtyLoader] = useAxiosGet();
  const [currentItemRate, getItemCurrentRate, itemCurrentRateLoader] =
    useAxiosGet();
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    getPlantDDL(
      `/wms/Plant/GetPlantDDL?AccountId=${accId}&BusinessUnitId=${buId}`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const saveHandler = (values, cb) => {
    // আগে নিশ্চিত করুন rowDto তে ডেটা আছে কিনা
    if (!rowDto || rowDto.length === 0) {
      toast.warn('Please add an item conversion row.');
      return;
    }

    // আপনার শর্তগুলো এখানে যাচাই করুন
    for (const row of rowDto) {
      if (row.itemId === row.convertedItemId) {
        return toast.warn('Item and Converted Item cannot be the same.');
      }

      if (row.itemUomId !== row.convertedUomId) {
        return toast.warn('UOMs of Item and Converted Item must be the same.');
      }

      if (
        parseFloat(row.convertedQuantity) > parseFloat(row.itemAvailableStock)
      ) {
        return toast.warn(
          'Converted Quantity cannot be greater than Item Stock.',
        );
      }
    }

    // Payload তৈরির আগে rowDto থেকে প্রয়োজনীয় ডেটা নিয়ে payload তৈরি করুন
    const payload = rowDto.map((row) => ({
      conversionId: 0, // Assuming default value
      businessUnitId: buId,
      itemId: row.itemId,
      itemName: row.item,
      itemCode: row.itemCode,
      uomId: row.itemUomId,
      uomName: row.itemUomName,
      currentStock: row.itemAvailableStock,
      convertedItemId: row.convertedItemId,
      convertedItemName: row.convertedItem,
      convertedItemCode: row.convertedItemCode,
      convertedUomId: row.convertedUomId,
      convertedUomName: row.convertedUomName,
      convertedQuantity: parseFloat(row.convertedQuantity), // Ensure it's a number
      actionBy: userId,
      numConvertedValue: (+row?.itemRate || 0) * (+row.convertedQuantity || 0),
      numRate: +row.itemRate,
    }));

    onCreateCoversion(
      `/wms/ItemConversion/CreateItemConversion`,
      payload[0],
      cb,
      true,
    );
  };

  const handleAddItem = async (values, setFieldValue) => {
    if (rowDto.length > 0) {
      return toast.warn(
        "You can't add more than one item conversion at a time.",
      );
    }

    try {
      setIsAdding(true); // Disable the button while fetching data

      // Fetch the item stock and current rate concurrently
      const [stockResponse, rateResponse] = await Promise.all([
        axios.get(
          `/wms/InventoryTransaction/sprRuningQty?businessUnitId=${buId}&whId=${values?.warehouse?.value}&itemId=${values.item?.value}`,
        ),
        axios.get(
          `/wms/InventoryLoan/GetItemRate?ItemId=${values.item?.value}&BusinessUnitId=${buId}`,
        ),
      ]);

      const itemStock = stockResponse.data;
      const itemRate = rateResponse.data;

      const obj = {
        plant: values?.plant?.label,
        plantId: values?.plant?.value,
        warehouse: values?.warehouse?.label,
        warehouseId: values?.warehouse?.value,
        item: values?.item?.label,
        itemId: values?.item?.value,
        itemCode: values?.item?.code,
        itemUomId: values?.item?.baseUomId,
        itemUomName: values?.item?.baseUomName,
        itemAvailableStock: itemStock || 0, // Use fetched stock
        itemRate: itemRate || 0, // Use fetched rate
        convertedPlant: values?.convertedPlant?.label,
        convertedPlantId: values?.convertedPlant?.value,
        convertedWarehouse: values?.convertedWarehouse?.label,
        convertedWarehouseId: values?.convertedWarehouse?.value,
        convertedItem: values?.convertedItem?.label,
        convertedItemId: values?.convertedItem?.value,
        convertedQuantity: values?.convertedQuantity,
        convertedItemCode: values?.convertedItem?.code,
        convertedUomId: values?.convertedItem?.baseUomId,
        convertedUomName: values?.convertedItem?.baseUomName,
        convertedItemAvailableStock: values?.convertedItem?.availableStock,
      };
      setRowDto([...rowDto, obj]);
      setFieldValue('item', '');
      setFieldValue('convertedItem', '');
      setFieldValue('convertedQuantity', '');
    } catch (error) {
      console.error('Error fetching item data:', error);
      toast.error('Failed to fetch item data. Please try again.');
    } finally {
      setIsAdding(false); // Re-enable the button
    }
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      // validationSchema={{}}
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
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {loader && <Loading />}
          <IForm
            title="Item Conversion"
            isHiddenReset
            isHiddenBack
            getProps={setObjprops}
          >
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="plant"
                    options={plantDDL || []}
                    value={values?.plant}
                    label="Plant"
                    onChange={(valueOption) => {
                      setFieldValue('warehouse', '');
                      setFieldValue('plant', valueOption || '');
                      setFieldValue('item', '');
                      setWarehouseDDL([]);
                      if (!valueOption) return;
                      getWarehouseDDL(
                        `/wms/ConfigPlantWearHouse/GetWareHouseDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${valueOption?.value}`,
                      );
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="warehouse"
                    options={warehouseDDL || []}
                    value={values?.warehouse}
                    label="Warehouse"
                    onChange={(valueOption) => {
                      setFieldValue('warehouse', valueOption);
                      setFieldValue('item', '');
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Item Name</label>
                  <SearchAsyncSelect
                    selectedValue={values?.item}
                    handleChange={(valueOption) => {
                      setFieldValue('item', valueOption);
                    }}
                    loadOptions={(v) => {
                      if (v?.length < 3) return [];
                      return axios
                        .get(
                          `/wms/ItemPlantWarehouse/GetItemByPlantWarehouseDDL?businessUnitId=${buId}&plantId=${values?.plant?.value}&warehouseId=${values?.warehouse?.value}&search=${v}`,
                        )
                        .then((res) => {
                          const updateList = res?.data.map((item) => ({
                            ...item,
                          }));
                          return updateList;
                        });
                    }}
                  />
                  <FormikError errors={errors} name="item" touched={touched} />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="convertedPlant"
                    options={plantDDL || []}
                    value={values?.convertedPlant}
                    label="Converted Plant"
                    onChange={(valueOption) => {
                      setFieldValue('convertedPlant', valueOption);
                      setFieldValue('convertedWarehouse', '');
                      setFieldValue('convertedItem', '');
                      setWarehouseDDL([]);
                      if (!valueOption) return;
                      getWarehouseDDL(
                        `/wms/ConfigPlantWearHouse/GetWareHouseDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${valueOption?.value}`,
                      );
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="convertedWarehouse"
                    options={warehouseDDL || []}
                    value={values?.convertedWarehouse}
                    label="Converted Warehouse"
                    onChange={(valueOption) => {
                      setFieldValue('convertedWarehouse', valueOption);
                      setFieldValue('convertedItem', '');
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Converted Item</label>
                  <SearchAsyncSelect
                    selectedValue={values?.convertedItem}
                    handleChange={(valueOption) => {
                      setFieldValue('convertedItem', valueOption);
                    }}
                    loadOptions={(v) => {
                      if (v?.length < 3) return [];
                      return axios
                        .get(
                          `/wms/ItemPlantWarehouse/GetItemByPlantWarehouseDDL?businessUnitId=${buId}&plantId=${values?.convertedPlant?.value}&warehouseId=${values?.convertedWarehouse?.value}&search=${v}`,
                        )
                        .then((res) => {
                          const updateList = res?.data.map((item) => ({
                            ...item,
                          }));
                          return updateList;
                        });
                    }}
                  />
                  <FormikError
                    errors={errors}
                    name="convertedItem"
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.convertedQuantity}
                    name="convertedQuantity"
                    placeholder="Converted Quantity"
                    label="Converted Quantity"
                    type="number"
                    onChange={(e) => {
                      // converted quantity can not be negative
                      if (e.target.value < 0) return;
                      setFieldValue('convertedQuantity', e.target.value);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3" style={{ marginTop: 20 }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      handleAddItem(values, setFieldValue);
                    }} // Call the async function
                    disabled={
                      isAdding ||
                      !values?.plant ||
                      !values?.warehouse ||
                      !values?.item ||
                      !values?.convertedPlant ||
                      !values?.convertedWarehouse ||
                      !values?.convertedItem ||
                      !values?.convertedQuantity
                    }
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="table-responsive mt-5">
                {/* Item Name	Item Code	Uom	Current Stock	Converted Item Name	Converted Item Code	Converted Uom	Converted Quantity */}
                <table className="table table-striped table-bordered bj-table bj-table-landing">
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Item Code</th>
                      <th>Uom</th>
                      <th>Current Stock</th>
                      <th>Current Rate</th>
                      <th>Converted Item Name</th>
                      <th>Converted Item Code</th>
                      <th>Converted Uom</th>
                      <th>Converted Quantity</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowDto?.map((item, index) => (
                      <tr key={index}>
                        <td>{item?.item}</td>
                        <td className="text-center">{item?.itemCode}</td>
                        <td className="text-center">{item?.itemUomName}</td>
                        <td className="text-center">
                          {item?.itemAvailableStock}
                        </td>
                        <td className="text-center">{item?.itemRate}</td>
                        <td>{item?.convertedItem}</td>
                        <td className="text-center">
                          {item?.convertedItemCode}
                        </td>
                        <td className="text-center">
                          {item?.convertedUomName}
                        </td>
                        <td>
                          <InputField
                            value={item?.convertedQuantity || ''}
                            type="number"
                            onChange={(e) => {
                              // converted quantity can not be negative
                              if (e.target.value <= 0) return;
                              const data = [...rowDto];
                              data[index].convertedQuantity = e.target.value;
                              setRowDto(data);
                            }}
                          />
                        </td>
                        <td className="text-center">
                          <span
                            onClick={() => {
                              const filterData = rowDto.filter(
                                (itm, indx) => indx !== index,
                              );
                              setRowDto(filterData);
                            }}
                          >
                            <IDelete />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
