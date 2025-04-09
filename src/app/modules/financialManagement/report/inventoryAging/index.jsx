import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import Loading from '../../../_helper/_loading';
import IForm from '../../../_helper/_form';
import NewSelect from '../../../_helper/_select';
import { _dateFormatter } from '../../../_helper/_dateFormate';
import { _todayDate } from '../../../_helper/_todayDate';
import InputField from '../../../_helper/_inputField';
import { values } from 'lodash';

const initData = {
  businessUnit: '',
  itemType: { value: 0, label: 'All' },
  itemCategory: { value: 0, label: 'All' },
  // itemSubCategory: { value: 0, label: "All" },
  // plant: { value: 0, label: "All" },
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
  // const [
  //     itemSubCategoryList,
  //     getItemSubCategoryList,
  //     ,
  //     setItemSubCategoryList,
  // ] = useAxiosGet();

  // const [plantList, getPlantList, plantLoading, setPlantList] = useAxiosGet();
  const [warehouseList, getWarehouseList, , setWarehouseList] = useAxiosGet();

  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, getGridData, loading, setGridData] = useAxiosGet();
  const [isShowUpdateModal, setIsShowUpdateModal] = useState(false);
  const [isShowHistoryModal, setIsShowHistoryModal] = useState(false);
  const [singleData, setSingleData] = useState(null);

  useEffect(() => {
    getItemList(`/item/ItemCategory/GetItemTypeListDDL`, (res) => {
      const modiFyData = res.map((item) => ({
        ...item,
        value: item?.itemTypeId,
        label: item?.itemTypeName,
      }));
      setItemList(modiFyData);
    });
  }, []);
  const saveHandler = (values, cb) => {};
  const history = useHistory();

  const getLandingData = (values, pageNo, pageSize, searchValue = '') => {
    const searchTearm = searchValue ? `&search=${searchValue}` : '';
    getGridData(
      `/wms/WmsReport/GetInventoryAgingReport?BusinessUnitId=${values?.businessUnit?.value}&IntItemTypeId=${values?.itemType?.value || 0}&IntWarehouseId=${values?.warehouse?.value || 0}&ToDate=${values?.date}&pageNo=${pageNo}&pageSize=${pageSize}${searchTearm}`
    );
  };

  const setPositionHandler = (pageNo, pageSize, values, searchValue = '') => {
    getLandingData(values, pageNo, pageSize, searchValue);
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, values, searchValue);
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
                      options={[businessUnitList || []]}
                      value={values?.businessUnit}
                      label="Business Unit"
                      onChange={(valueOption) => {
                        setFieldValue('businessUnit', valueOption || '');
                        // setFieldValue("plant", "");
                        setFieldValue('warehouse', '');
                        setFieldValue('itemType', '');
                        setFieldValue('itemCategory', '');
                        // setFieldValue("itemSubCategory", "");
                        setItemCategoryList([]);
                        // setItemSubCategoryList([]);
                        setWarehouseList([]);
                        // setPlantList([]);

                        // if (valueOption) {
                        //     getPlantList(
                        //         `/wms/Plant/GetPlantDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${valueOption?.value}`
                        //     );
                        // }
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
                        setFieldValue('itemType', valueOption || '');
                        setFieldValue('itemCategory', '');
                        // setFieldValue("itemSubCategory", "");
                        setItemCategoryList([]);
                        // setItemSubCategoryList([]);
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
                        setFieldValue('itemCategory', valueOption);
                        // setFieldValue("itemSubCategory", "");
                        // setItemSubCategoryList([]);
                        // if (valueOption) {
                        //     getItemSubCategoryList(
                        //         `/item/ItemSubCategory/GetItemSubCategoryDDLByCategoryId?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&itemCategoryId=${valueOption?.value}&typeId=${values?.itemType?.value}`,
                        //         (res) => {
                        //             const modiFyData = res.map((item) => ({
                        //                 ...item,
                        //                 value: item?.id,
                        //                 label: item?.itemSubCategoryName,
                        //             }));
                        //             setItemSubCategoryList(modiFyData);
                        //         }
                        //     );
                        // }
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* <div className="col-lg-3">
                                        <NewSelect
                                            name="itemSubCategory"
                                            options={
                                                [{ value: 0, label: "All" }, ...itemSubCategoryList] ||
                                                []
                                            }
                                            value={values?.itemSubCategory}
                                            label="Item Sub Category"
                                            onChange={(valueOption) => {
                                                setFieldValue("itemSubCategory", valueOption || "");
                                            }}
                                            errors={errors}
                                            touched={touched}
                                        />
                                    </div> */}
                  {/* <div className="col-lg-3">
                                        <NewSelect
                                            name="plant"
                                            options={[{ value: 0, label: "All" }, ...plantList] || []}
                                            value={values?.plant}
                                            label="Plant"
                                            onChange={(valueOption) => {
                                                setFieldValue("plant", valueOption);
                                                setFieldValue("warehouse", "");
                                                setWarehouseList([]);
                                                if (valueOption) {
                                                    getWarehouseList(
                                                        `/wms/ItemPlantWarehouse/GetWareHouseItemPlantWareHouseDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&PlantId=${valueOption?.value}`
                                                    );
                                                }
                                            }}
                                            errors={errors}
                                            touched={touched}
                                        />
                                    </div> */}
                  <div className="col-lg-3">
                    <InputField
                      value={values?.date}
                      name="date"
                      type="date"
                      label="Date"
                      onChange={(e) => {
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

                {gridData?.itemList?.length > 0 && (
                  <div className="table-responsive">
                    <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Item Code</th>
                          <th>Item Name</th>
                          <th>Uom</th>
                          <th>Effective Date</th>
                          <th>Rate (Dhaka)</th>
                          <th>Rate (Chittagong)</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.itemList?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td className="text-center">{item?.itemCode}</td>
                            <td>{item?.itemName}</td>
                            <td className="text-center">{item?.uomName}</td>
                            <td className="text-center">
                              {_dateFormatter(item?.effectiveDate)}
                            </td>
                            <td className="text-center">{item?.itemRate}</td>
                            <td className="text-center">
                              {item?.itemOthersRate}
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
