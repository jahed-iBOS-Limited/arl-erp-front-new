import React, { useState, useEffect } from "react";
import ICustomCard from "../../../../_helper/_customCard";
import { Formik, Form } from "formik";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import { useDispatch, useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import "../style.css";
import {
  businessUnitPlant_api,
  wearhouse_api,
  inventoryStatement_api,
  ItemSubCategory_api,
  getItemTypeListDDL_api,
  getItemCategoryDDLByTypeId_api,
} from "../helper";
import CustomPaginationActionsTable from "./pagination";
import { _currentTime } from "../../../../_helper/_currentTime";
import Loading from "../../../../_helper/_loading";
import { SetReportsInventoryStockAction } from "../../../../_helper/reduxForLocalStorage/Actions";


const InventoryStockTable = () => {
  const [plantDDL, setPlantDDL] = useState([]);
  const [itemTypeOption, setItemTypeOption] = useState([]);
  const [itemCategoryDDL, setItemCategoryDDL] = useState([]);
  const [itemSUBCategoryDDL, setItemSubCategoryDDL] = useState([]);
  const [wareHouseDDL, setwareHouseDDL] = useState([]);
  const [inventoryStatement, setInventoryStatement] = useState([]);
  const [inventoryStatementAllData, setinventoryStatementAllData] = useState(
    []
  );
  const [loading, setLoading] = useState(false);
  // const [tableItem, setTableItem] = useState("");

  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      businessUnitPlant_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        profileData?.userId,
        7,
        setPlantDDL
      );
      getItemTypeListDDL_api(setItemTypeOption);
      // ItemCategory_api(profileData?.accountId,
      //   selectedBusinessUnit?.value,setItemCategoryDDL)
    }
  }, [selectedBusinessUnit, profileData]);

  const inventoryStatementClickHandler = (values) => {
    inventoryStatement_api(
      setLoading,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.wh?.value,
      values?.plant?.value,
      values?.itemType?.value,
      values?.itemCategory?.value,
      values?.itemSubCategory?.value,
      setInventoryStatement,
      setinventoryStatementAllData
    );
  };

const {reportsInventoryStock} = useSelector(state => state?.localStorage)

  const initData = {
    plant: reportsInventoryStock?.plant || "",
    wh: reportsInventoryStock?.wh ||  "",
    itemCategory: reportsInventoryStock?.itemCategory ||  "",
    itemSubCategory: reportsInventoryStock?.itemSubCategory ||  "",
    fromDate: reportsInventoryStock?.fromDate ||  _todayDate(),
    fromTime: reportsInventoryStock?.fromTime ||  _currentTime(),
    toDate: reportsInventoryStock?.toDate ||  _todayDate(),
    toTime: reportsInventoryStock?.toTime ||  _currentTime(),
    itemType: reportsInventoryStock?.itemType || "",
  };

  const dispatch = useDispatch()

  return (
    <ICustomCard title="Inventory Stock">
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
            <Form className="form form-label-right">
              {/* Form */}
              {loading && <Loading />}
              <div className="row global-form">
                <div className="col-lg-3 col-xl-2">
                  <NewSelect
                    name="plant"
                    options={plantDDL || []}
                    value={values?.plant}
                    label="Plant"
                    onChange={(valueOption) => {
                      setFieldValue("plant", valueOption);
                      setFieldValue("wh", "");
                      wearhouse_api(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        profileData?.userId,
                        valueOption?.value,
                        setwareHouseDDL
                      );
                      dispatch(
                        SetReportsInventoryStockAction({
                          ...values,
                          plant: valueOption,
                          wh: ""
                        })
                      );
                    }}
                    placeholder="Plant"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3 col-xl-2">
                  <NewSelect
                    name="wh"
                    options={wareHouseDDL || []}
                    value={values?.wh}
                    label="WareHouse"
                    onChange={(valueOption) => {
                      setFieldValue("wh", valueOption);
                      dispatch(
                        SetReportsInventoryStockAction({
                          ...values,
                          wh: valueOption
                        })
                      );
                    }}
                    placeholder="WareHouse"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3 col-xl-2">
                  <NewSelect
                    name="itemType"
                    options={itemTypeOption || []}
                    value={values?.itemType}
                    label="Item Type"
                    onChange={(valueOption) => {
                      setFieldValue("itemType", valueOption);
                      valueOption?.value !== 0 &&
                        setFieldValue("itemCategory", "");

                      getItemCategoryDDLByTypeId_api(
                        profileData.accountId,
                        selectedBusinessUnit.value,
                        valueOption?.value,
                        setItemCategoryDDL
                      );
                      dispatch(
                        SetReportsInventoryStockAction({
                          ...values,
                          itemType: valueOption,
                          itemCategory: ""
                        })
                      );
                    }}
                    placeholder="Item Type"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3 col-xl-2">
                  <NewSelect
                    name="itemCategory"
                    options={itemCategoryDDL || []}
                    value={values?.itemCategory}
                    label="Item Category"
                    onChange={(valueOption) => {
                      setFieldValue("itemCategory", valueOption);
                      setFieldValue("itemSubCategory", "");
                      ItemSubCategory_api(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        valueOption?.value,
                        setItemSubCategoryDDL
                      );
                      dispatch(
                        SetReportsInventoryStockAction({
                          ...values,
                          itemCategory: valueOption,
                          itemSubCategory: ""
                        })
                      );
                    }}
                    placeholder="Item Category"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3 col-xl-2">
                  <NewSelect
                    name="itemSubCategory"
                    options={itemSUBCategoryDDL || []}
                    value={values?.itemSubCategory}
                    label="Item Sub Category"
                    onChange={(valueOption) => {
                      setFieldValue("itemSubCategory", valueOption);
                      dispatch(
                        SetReportsInventoryStockAction({
                          ...values,
                          itemSubCategory: valueOption,
                        })
                      );
                    }}
                    placeholder="Sub Category"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div style={{ marginTop: "17px" }} className="col text-right">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      inventoryStatementClickHandler(values);
                    }}
                    disabled={
                      !values?.plant ||
                      !values?.wh ||
                      !values?.itemCategory ||
                      !values?.itemSubCategory
                    }
                  >
                    View
                  </button>
                </div>
              </div>

              <CustomPaginationActionsTable
                inventoryStatement={inventoryStatement}
                // setIsShowModal={setIsShowModal}
                setInventoryStatement={setInventoryStatement}
                inventoryStatementAllData={inventoryStatementAllData}
                // setTableItem={setTableItem}
              />
            </Form>
          </>
        )}
      </Formik>
    </ICustomCard>
  );
};

export default InventoryStockTable;
