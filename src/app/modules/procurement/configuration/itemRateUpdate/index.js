import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
import { values } from "lodash";
const initData = {
  itemType: "",
  itemCategory: "",
  itemSubCategory: "",
  plant: "",
  warehouse: "",
};
export default function ItemRateUpdate() {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const [itemList, getItemList, , setItemList] = useAxiosGet();
  const [
    itemCategoryList,
    getItemCategoryList,
    ,
    setItemCategoryList,
  ] = useAxiosGet();
  const [
    itemSubCategoryList,
    getItemSubCategoryList,
    ,
    setItemSubCategoryList,
  ] = useAxiosGet();

  const [plantList, getPlantList] = useAxiosGet();
  const [warehouseList, getWarehouseList, , setWarehouseList] = useAxiosGet();

  useEffect(() => {
    getItemList(`/item/ItemCategory/GetItemTypeListDDL`, (res) => {
      const modiFyData = res.map((item) => ({
        ...item,
        value: item?.itemTypeId,
        label: item?.itemTypeName,
      }));
      setItemList(modiFyData);
    });
    getPlantList(
      `/wms/Plant/GetPlantDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`
    );
  }, []);
  const saveHandler = (values, cb) => {};
  const history = useHistory();
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
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
          {false && <Loading />}
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
                      name="itemType"
                      options={itemList || []}
                      value={values?.itemType}
                      label="Item Type"
                      onChange={(valueOption) => {
                        setFieldValue("itemType", valueOption || "");
                        setFieldValue("itemCategory", "");
                        setFieldValue("itemSubCategory", "");
                        setItemCategoryList([]);
                        setItemSubCategoryList([]);
                        if (valueOption) {
                          getItemCategoryList(
                            `/item/ItemCategory/GetItemCategoryDDLByTypeId?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&ItemTypeId=${valueOption?.itemTypeId}`,
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
                      options={itemCategoryList || []}
                      value={values?.itemCategory}
                      label="Item Category"
                      onChange={(valueOption) => {
                        setFieldValue("itemCategory", valueOption);
                        setFieldValue("itemSubCategory", "");
                        setItemSubCategoryList([]);
                        if (valueOption) {
                          getItemSubCategoryList(
                            `/item/ItemSubCategory/GetItemSubCategoryDDLByCategoryId?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&itemCategoryId=${valueOption?.itemCategoryId}&typeId=${values?.itemType?.itemTypeId}`,
                            (res) => {
                              const modiFyData = res.map((item) => ({
                                ...item,
                                value: item?.id,
                                label: item?.itemSubCategoryName,
                              }));
                              setItemSubCategoryList(modiFyData);
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
                      name="itemSubCategory"
                      options={itemSubCategoryList || []}
                      value={values?.itemSubCategory}
                      label="Item Sub Category"
                      onChange={(valueOption) => {
                        setFieldValue("itemSubCategory", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="plant"
                      options={plantList || []}
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
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="warehouse"
                      options={warehouseList || []}
                      value={values?.warehouse}
                      label="Warehouse"
                      onChange={(valueOption) => {
                        setFieldValue("warehouse", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <button type="button" className="btn btn-primary mt-5">
                      View
                    </button>
                  </div>
                </div>
              </>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
