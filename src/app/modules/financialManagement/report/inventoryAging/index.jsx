import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { _dateFormatter } from '../../../_helper/_dateFormate';
import IForm from '../../../_helper/_form';
import InputField from '../../../_helper/_inputField';
import Loading from '../../../_helper/_loading';
import NewSelect from '../../../_helper/_select';
import { _todayDate } from '../../../_helper/_todayDate';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';

const initData = {
  businessUnit: '',
  itemType: { value: 0, label: 'All' },
  itemCategory: { value: 0, label: 'All' },
  warehouse: { value: 0, label: 'All' },
  date: _todayDate(),
};
export default function InventoryAging() {
  const { profileData, selectedBusinessUnit, businessUnitList } = useSelector(
    (state) => {
      return state.authData;
    },
    shallowEqual
  );
  const [itemList, getItemList, , setItemList] = useAxiosGet();
  const [itemCategoryList, getItemCategoryList, , setItemCategoryList] =
    useAxiosGet();

  const [warehouseList, getWarehouseList, , setWarehouseList] = useAxiosGet();

  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, getGridData, loading, setGridData] = useAxiosGet();

  useEffect(() => {
    getItemList(`/item/ItemCategory/GetItemTypeListDDL`, (res) => {
      const modiFyData = res.map((item) => ({
        ...item,
        value: item?.itemTypeId,
        label: item?.itemTypeName,
      }));
      setItemList(modiFyData);
    });
    getWarehouseList(
      `/wms/InventoryTransaction/GetWarehouseDropdownByUnitId?businessUnitId=${selectedBusinessUnit?.value}`
    );
  }, []);
  const saveHandler = (values, cb) => {};
  const history = useHistory();

  const getLandingData = (values) => {
    getGridData(
      `/wms/WmsReport/GetInventoryAgingReport?BusinessUnitId=${values?.businessUnit?.value || 0}&IntItemTypeId=${values?.itemType?.value || 0}&IntWarehouseId=${values?.warehouse?.value || 0}&IntItemCategoryId=${values?.itemCategory?.value}&ToDate=${_dateFormatter(values?.date)}`
    );
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...initData,
        businessUnit: {
          value: selectedBusinessUnit?.value,
          label: selectedBusinessUnit?.label,
        },
      }}
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
          {loading && <Loading />}
          <IForm
            title="Item Rate Update"
            isHiddenReset
            isHiddenBack
            isHiddenSave
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
                        setGridData([]);
                        setFieldValue('businessUnit', valueOption || '');
                        setFieldValue('warehouse', '');
                        setWarehouseList([]);
                        if (valueOption) {
                          getWarehouseList(
                            `/wms/InventoryTransaction/GetWarehouseDropdownByUnitId?businessUnitId=${valueOption?.value}`
                          );
                        }
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-3">
                    <NewSelect
                      name="warehouse"
                      options={
                        [{ value: 0, label: 'All' }, ...warehouseList] || []
                      }
                      value={values?.warehouse}
                      label="Warehouse"
                      onChange={(valueOption) => {
                        setGridData([]);
                        setFieldValue('warehouse', valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-3">
                    <NewSelect
                      name="itemType"
                      options={[{ value: 0, label: 'All' }, ...itemList] || []}
                      value={values?.itemType}
                      label="Item Type"
                      onChange={(valueOption) => {
                        setGridData([]);
                        setFieldValue('itemType', valueOption || '');
                        setFieldValue('itemCategory', '');
                        setItemCategoryList([]);
                        if (valueOption) {
                          getItemCategoryList(
                            `/item/ItemCategory/GetItemCategoryDDLByTypeId?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&ItemTypeId=${valueOption?.value}`,
                            (res) => {
                              const modiFyData = res.map((item) => ({
                                ...item,
                                value: item?.itemCategoryId,
                                label: item?.itemCategoryName,
                              }));
                              setItemCategoryList(modiFyData);
                            }
                          );
                        }
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="itemCategory"
                      options={
                        [{ value: 0, label: 'All' }, ...itemCategoryList] || []
                      }
                      value={values?.itemCategory}
                      label="Item Category"
                      onChange={(valueOption) => {
                        setGridData([]);
                        setFieldValue('itemCategory', valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-3">
                    <InputField
                      value={values?.date}
                      name="date"
                      type="date"
                      label="Date"
                      onChange={(e) => {
                        setGridData([]);
                        setFieldValue('date', e.target.value);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <button
                      onClick={() => {
                        getLandingData(values, pageNo, pageSize, '');
                      }}
                      type="button"
                      className="btn btn-primary mt-5"
                    >
                      View
                    </button>
                  </div>
                </div>

                {gridData?.length > 0 && (
                  <div className="table-responsive">
                    <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Item Code</th>
                          <th>Item Name</th>
                          <th>Item Type</th>
                          <th>Item Category</th>
                          <th>Item Sub-Category</th>
                          <th>0-30 Days</th>
                          <th>31-60 Days</th>
                          <th>61-90 Days</th>
                          <th>91-180 Days</th>
                          <th>181-365 Days</th>
                          <th>365+ Days</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td className="text-center">{item?.strItemCode}</td>
                            <td>{item?.strItemName}</td>
                            <td>{item?.strItemTypeName}</td>
                            <td>{item?.strItemCategoryName}</td>
                            <td>{item?.strItemSubCategoryName}</td>
                            <td className="text-center">{item?.num0_30}</td>
                            <td className="text-center">{item?.num31_60}</td>
                            <td className="text-center">{item?.num61_90}</td>
                            <td className="text-center">{item?.num91_180}</td>
                            <td className="text-center">{item?.num181_365}</td>
                            <td className="text-center">
                              {item?.num365_Above}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
