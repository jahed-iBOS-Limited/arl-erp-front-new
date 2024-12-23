import { Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import IConfirmModal from '../../../_helper/_confirmModal';
import NewSelect from '../../../_helper/_select';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import IForm from './../../../_helper/_form';
import Loading from './../../../_helper/_loading';

const initData = {
  purchaseOrganization: '',
};
export default function OthersItem() {
  const saveHandler = (values, cb) => {};
  const [autoPRData, getAutoPRData, loading, setAutoPRData] = useAxiosGet();
  const [, onCreatePRHandler, loader] = useAxiosPost();
  const [
    itemTypeList,
    getItemTypeList,
    itemTypeListLoader,
    setItemTypeList,
  ] = useAxiosGet();
  const [
    itemCategoryList,
    getItemCategoryList,
    categoryLoader,
    setItemCategoryList,
  ] = useAxiosGet();
  const [
    itemSubCategoryList,
    getItemSubCategoryList,
    ,
    setItemSubCategoryList,
  ] = useAxiosGet();

  const { profileData, businessUnitList } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const getData = (values) => {
    // const apiUrl =
    //   values?.purchaseOrganization?.value === 1
    //     ? `/procurement/AutoPurchase/GetReorderStockSummaryData`
    //     : `/procurement/AutoPurchase/sprGetReorderStockSummaryForeign`;
    // getAutoPRData(apiUrl);
    getAutoPRData(
      `/procurement/AutoPurchase/GetPurchaseRequestCalculation?BusinessUnitId=${values?.businessUnit?.value}&ItemMasterCategoryId=${values?.itemCategory?.value}&ItemMasterSubCategoryId=${values?.itemSubCategory?.value}&PurchaseOrganizationId=${values?.purchaseOrganization?.value}`,
    );
  };

  useEffect(() => {
    getItemTypeList('/item/ItemCategory/GetItemTypeListDDL', (data) => {
      const modData = data?.map((itm) => {
        return {
          ...itm,
          value: itm?.itemTypeId,
          label: itm?.itemTypeName,
        };
      });
      setItemTypeList(modData);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          {(loading || loader || itemTypeListLoader || categoryLoader) && (
            <Loading />
          )}
          <IForm
            title="Other Item Auto PR Calculation"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    disabled={!autoPRData?.length}
                    className="btn btn-primary"
                    onClick={() => {
                      const payLoad = autoPRData?.map((item) => {
                        return {
                          accountId: profileData?.accountId,
                          itemId: item?.intItemId,
                          uomId: item?.intUoMId,
                          uomName: item?.strUoMName,
                          itemCode: item?.strItemCode,
                          itemName: item?.strItemName,
                          itemTypeId: values?.itemType?.value || 0,
                          itemTypeName: values?.itemType?.label || '',
                          warehouseId: item?.intWarehouseId,
                          warehouseName: item?.strWarehouseName,
                          plantId: item?.intPlantId,
                          plantName: item?.strPlantName,
                          businessUnitId: item?.intBusinessUnitId,
                          businessUnitName: item?.strBusinessUnitName,
                          reorderLevel: 0, // no need
                          reorderQuantity:
                            item?.openingQTYSilo +
                            item?.balanceOnGhat +
                            (item?.openPOQty - item?.balanceOnGhat) -
                            item?.totalMonthlyRequirement,
                          inventoryStock: item?.openingQTYSilo || 0,
                          currentTotalStock:
                            item?.openingQTYSilo +
                              item?.balanceOnGhat +
                              (item?.openPOQty - item?.balanceOnGhat) || 0,
                          purchaseRequestStock: item?.openPRQty || 0,
                          purchaseOrderStock: item?.openPOQty || 0,
                          intItemMasterCategoryId:
                            item?.intItemMasterCategoryId,
                          intItemMasterSubCategoryId:
                            item?.intItemMasterSubCategoryId,
                          intPurchaseOrganizationId:
                            values?.purchaseOrganization?.value || 0,
                          strPurchaseOrganizationName:
                            values?.purchaseOrganization?.label || '',
                        };
                      });
                      IConfirmModal({
                        message: `Are you sure to create PR ?`,
                        yesAlertFunc: () => {
                          onCreatePRHandler(
                            `/procurement/AutoPurchase/GetFormatedItemListForAutoPRCreate`,
                            payLoad,
                            () => {
                              getData(values);
                            },
                            true,
                          );
                        },
                        noAlertFunc: () => {},
                      });
                    }}
                  >
                    Create PR
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
                        setAutoPRData([]);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="purchaseOrganization"
                      options={[
                        { value: 11, label: 'Local Procurement' },
                        { value: 12, label: 'Forign Procurement' },
                      ]}
                      value={values?.purchaseOrganization}
                      label="Purchase Organization"
                      onChange={(valueOption) => {
                        setFieldValue(
                          'purchaseOrganization',
                          valueOption || '',
                        );
                        setAutoPRData([]);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="itemType"
                      options={itemTypeList || []}
                      value={values?.itemType}
                      label="Item Type"
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue('itemType', valueOption || '');
                          setAutoPRData([]);
                          getItemCategoryList(
                            `/item/MasterCategory/GetItemMasterCategoryDDL?AccountId=${profileData?.accountId}&ItemTypeId=${valueOption?.value}`,
                          );
                        } else {
                          setFieldValue('itemType', '');
                          setFieldValue('itemCategory', '');
                          setFieldValue('itemSubCategory', '');
                          setItemCategoryList([]);
                          setItemSubCategoryList([]);
                          setAutoPRData([]);
                        }
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="itemCategory"
                      options={itemCategoryList}
                      value={values?.itemCategory}
                      label="Item Category"
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue('itemSubCategory', '');
                          setFieldValue('itemCategory', valueOption);
                          getItemSubCategoryList(
                            `/item/MasterCategory/GetItemMasterSubCategoryDDL?AccountId=${profileData?.accountId}&ItemMasterCategoryId=${valueOption?.value}&ItemMasterTypeId=${values?.itemType?.value}`,
                          );
                          setAutoPRData([]);
                        } else {
                          setFieldValue('itemCategory', '');
                          setFieldValue('itemSubCategory', '');
                          setItemSubCategoryList([]);
                          setAutoPRData([]);
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
                      label="Item Sub-category"
                      onChange={(valueOption) => {
                        setFieldValue('itemSubCategory', valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        getData(values);
                      }}
                      disabled={
                        !values?.businessUnit ||
                        !values?.itemType ||
                        !values?.itemCategory ||
                        !values?.itemSubCategory ||
                        !values?.purchaseOrganization
                      }
                      className="btn btn-primary mt-5"
                    >
                      Show
                    </button>
                  </div>
                </div>

                <div>
                  {autoPRData?.length > 0 && (
                    <div className="table-responsive">
                      <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Item Code</th>
                            <th>Item Name</th>
                            <th>UOM</th>
                            <th>Warehouse</th>
                            <th>Business Unit</th>
                            <th>Total Monthly Requirment</th>
                            <th>Opening QTY Silo</th>
                            <th>Floating Stock</th>
                            <th>In Transit</th>
                            <th>Open PR</th>
                            <th>Available Stock</th>
                            <th>Closing Balance</th>
                            {/* <th>Current Stock</th>
                            <th>Open PR</th>
                            <th>Open PO</th>
                            <th>Ghat Stock</th>
                            <th>Port Stock</th>
                            <th>Reorder Level</th>
                            <th>PR Quantity</th>
                            <th>Action</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {autoPRData?.length > 0 &&
                            autoPRData?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td className="text-center">
                                  {item?.strItemCode}
                                </td>
                                <td>{item?.strItemName}</td>
                                <td className="text-center">
                                  {item?.strUoMName}
                                </td>
                                <td className="text-center">
                                  {item?.strWarehouseName}
                                </td>
                                <td>{item?.strBusinessUnitName}</td>
                                <td className="text-center">
                                  {item?.totalMonthlyRequirement
                                    ? item?.totalMonthlyRequirement?.toFixed(2)
                                    : ''}
                                </td>
                                <td className="text-center">
                                  {item?.openingQTYSilo || 0}
                                </td>
                                <td className="text-center">
                                  {item?.balanceOnGhat || 0}
                                </td>
                                <td className="text-center">
                                  {item?.openPOQty - item?.balanceOnGhat || 0}
                                </td>
                                <td className="text-center">
                                  {item?.openPRQty || 0}
                                </td>
                                <td className="text-center">
                                  {item?.openingQTYSilo +
                                    item?.balanceOnGhat +
                                    (item?.openPOQty - item?.balanceOnGhat) ||
                                    0}
                                </td>
                                <td className="text-center">
                                  {(
                                    item?.openingQTYSilo +
                                    item?.balanceOnGhat +
                                    (item?.openPOQty - item?.balanceOnGhat) -
                                    item?.totalMonthlyRequirement
                                  )?.toFixed(2) || 0}
                                </td>
                                {/* <td className="text-center">
                                  {values?.purchaseOrganization?.value ===
                                    2 && (
                                    <OverlayTrigger
                                      overlay={
                                        <Tooltip id="cs-icon">
                                          <table className={styles.table}>
                                            <tbody>
                                              <tr>
                                                <td>
                                                  <strong>Current Stock</strong>
                                                </td>
                                                <td>
                                                  + {item?.inventoryStock || 0}
                                                </td>
                                              </tr>
                                              <tr>
                                                <td>
                                                  <strong>Port Stock</strong>
                                                </td>
                                                <td>
                                                  + {item?.portStock || 0}
                                                </td>
                                              </tr>
                                              <tr>
                                                <td>
                                                  <strong>Ghat Stock</strong>
                                                </td>
                                                <td>
                                                  + {item?.balanceOnGhat || 0}
                                                </td>
                                              </tr>

                                              <tr>
                                                <td>
                                                  <strong>Open PO</strong>
                                                </td>
                                                <td>
                                                  -{" "}
                                                  {item?.purchaseOrderStock ||
                                                    0}
                                                </td>
                                              </tr>
                                              <tr>
                                                <td>
                                                  <strong>Open PR</strong>
                                                </td>
                                                <td>
                                                  -{" "}
                                                  {item?.purchaseRequestStock ||
                                                    0}
                                                </td>
                                              </tr>

                                              <tr>
                                                <td>
                                                  <strong>PR Quantity</strong>
                                                </td>
                                                <td>
                                                  {(item?.inventoryStock || 0) +
                                                    (item?.portStock || 0) +
                                                    (item?.balanceOnGhat || 0) -
                                                    ((item?.purchaseOrderStock ||
                                                      0) +
                                                      (item?.purchaseRequestStock ||
                                                        0))}
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </Tooltip>
                                      }
                                    >
                                      <span>
                                        <i className="fa fa-info-circle pointer"></i>
                                      </span>
                                    </OverlayTrigger>
                                  )}
                                </td> */}
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
