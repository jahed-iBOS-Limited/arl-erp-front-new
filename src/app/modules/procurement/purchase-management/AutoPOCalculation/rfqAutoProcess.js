import { Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import IForm from '../../../_helper/_form';
import { IInput } from '../../../_helper/_input';
import Loading from '../../../_helper/_loading';
import NewSelect from '../../../_helper/_select';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';

const initData = {
  businessUnit: '',
  itemSubCategory: '',
  itemCategory: '',
  itemType: '',
};

const validationSchema = Yup.object().shape({
  businessUnit: Yup.object().shape({
    label: Yup.string().required('Business Unit is required'),
    value: Yup.string().required('Business Unit is required'),
  }),
  itemSubCategory: Yup.object().shape({
    label: Yup.string().required('Item Sub Category is required'),
    value: Yup.string().required('Item Sub Category is required'),
  }),
  itemCategory: Yup.object().shape({
    label: Yup.string().required('Item Category is required'),
    value: Yup.string().required('Item Category is required'),
  }),
  itemType: Yup.object().shape({
    label: Yup.string().required('Items type is required'),
    value: Yup.string().required('Items type is required'),
  }),
});
export default function RFQAutoProcess() {
  const saveHandler = (values, cb) => {};
  const [autoRFQData, getAutoRFQData, loading, setAutoRFQData] = useAxiosGet();
  const [, , loader] = useAxiosPost();
  const [itemTypeList, getitemTypeList, , setItemTypeList] = useAxiosGet();
  const [
    itemCategoryList,
    getCategoryData,
    ,
    setItemCategoryList,
  ] = useAxiosGet();
  const [
    itemSubCategoryList,
    getSubCategoryData,
    ,
    setItemSubCategoryList,
  ] = useAxiosGet();

  const [plantDDL, getPlantDDL, plantLoader, setPlantDDL] = useAxiosGet();
  const [
    warehouseDDL,
    getWarehouseDDL,
    warehouseLoader,
    setWarehouseDDL,
  ] = useAxiosGet();
  const history = useHistory();

  // get selected business unit from store
  const { profileData, businessUnitList } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    getitemTypeList(`/item/ItemCategory/GetItemTypeListDDL`, (data) => {
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

  const categoryApiCaller = async (typeId, values) => {
    getCategoryData(
      `/item/ItemCategory/GetItemCategoryDDLByTypeId?AccountId=${profileData?.accountId}&BusinessUnitId=${values?.businessUnit?.value}&ItemTypeId=${typeId}`,
      (data) => {
        const modData = data?.map((itm) => {
          return {
            ...itm,
            value: itm?.itemCategoryId,
            label: itm?.itemCategoryName,
          };
        });
        setItemCategoryList(modData);
      },
    );
  };

  const subcategoryApiCaller = async (categoryId, values) => {
    getSubCategoryData(
      `/item/ItemSubCategory/GetItemSubCategoryDDLByCategoryId?accountId=${profileData?.accountId}&businessUnitId=${values?.businessUnit?.value}&itemCategoryId=${categoryId}&typeId=${values?.itemType?.value}`,
      (data) => {
        const modData = data?.map((itm) => {
          return {
            ...itm,
            value: itm?.id,
            label: itm?.itemSubCategoryName,
          };
        });
        setItemSubCategoryList(modData);
      },
    );
  };

  const getData = (values) => {
    const apiUrl = `/procurement/AutoPurchase/GetActivePurchaseRequestsForRFQ?BusinessUnitId=${values?.businessUnit?.value}&PlantId=${values?.plant?.value}&WarehouseId=${values?.warehouse?.value}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}&status=${values?.status?.value}&IntItemCategoryId=${values?.itemCategory?.value}&IntItemSubCategoryId=${values?.itemSubCategory?.value}`;
    getAutoRFQData(apiUrl);
  };

  // const payloadMapping = (data) => {
  //   return data.map((item) => ({
  //     accountId: item.accountId || 0,
  //     businessUnitId: item.businessUnitId || 0,
  //     sbuId: item.sbuId || 0,
  //     plantId: item.plantId || 0,
  //     plantName: item.plantName || "",
  //     warehouseId: item.warehouseId || 0,
  //     purchaseOrganizationId: item.purchaseOrganizationId || 0,
  //     supplierId: item.supplierId || 0,
  //     supplierName: item.supplierName || "",
  //     purchaseRequestId: item.purchaseRequestId || 0,
  //     purchaseRequestCode: item.purchaseRequestCode || "",
  //     restQuantity: item.restQuantity || 0,
  //     itemId: item.itemId || 0,
  //     itemName: item.itemName || "",
  //     uoMId: item.uoMId || 0,
  //     uoMName: item.uoMName || "",
  //     itemRate: item.itemRate || 0,
  //     finalPrice: item.finalPrice || 0,
  //   }));
  // };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      validationSchema={validationSchema}
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
          {(loading || loader || warehouseLoader || plantLoader) && <Loading />}
          <IForm
            title="RFQ Auto Process"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  {/* <button
                    type="button"
                    disabled={!autoRFQData?.length}
                    className="btn btn-primary"
                    onClick={() => {
                      IConfirmModal({
                        message: `Are you sure to create RFQ ?`,
                        yesAlertFunc: () => {
                          onCreateRFQHandler(
                            `/procurement/AutoPurchase/CreateFormatedItemListForAutoPO`,
                            payloadMapping(autoRFQData),
                            () => {
                              getData(values);
                            },
                            true
                          );
                        },
                        noAlertFunc: () => {},
                      });
                    }}
                  >
                    Create PO
                  </button> */}
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
                        if (valueOption) {
                          setFieldValue('businessUnit', valueOption || '');
                          setAutoRFQData([]);
                          getPlantDDL(
                            `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${profileData?.userId}&AccId=${profileData?.accountId}&BusinessUnitId=${valueOption?.value}&OrgUnitTypeId=7`,
                          );
                        } else {
                          setFieldValue('businessUnit', '');
                          setFieldValue('plant', '');
                          setFieldValue('warehouse', '');
                          setAutoRFQData([]);
                          setPlantDDL([]);
                        }
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="plant"
                      options={plantDDL}
                      value={values?.plant}
                      label="Plant"
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue('plant', valueOption || '');
                          setAutoRFQData([]);
                          getWarehouseDDL(
                            `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${profileData?.userId}&AccId=${profileData?.accountId}&BusinessUnitId=${values?.businessUnit?.value}&PlantId=${valueOption?.value}&OrgUnitTypeId=8`,
                          );
                        } else {
                          setFieldValue('plant', '');
                          setFieldValue('warehouse', '');
                          setAutoRFQData([]);
                          setWarehouseDDL([]);
                        }
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="warehouse"
                      options={warehouseDDL}
                      value={values?.warehouse}
                      label="Warehouse"
                      onChange={(valueOption) => {
                        setFieldValue('warehouse', valueOption || '');
                        setAutoRFQData([]);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <IInput
                      name="fromDate"
                      type="date"
                      value={values?.fromDate}
                      label="From Date"
                    />
                  </div>
                  <div className="col-lg-3">
                    <IInput
                      name="toDate"
                      type="date"
                      value={values?.toDate}
                      label="To Date"
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="status"
                      options={[
                        { value: 1, label: 'All' },
                        { value: 5, label: 'Process' },
                        { value: 4, label: 'RFQ' },
                      ]}
                      value={values?.status}
                      label="Status"
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setAutoRFQData([]);
                          setFieldValue('status', valueOption || '');
                        } else {
                          setAutoRFQData([]);
                          setFieldValue('status', '');
                          setAutoRFQData([]);
                        }
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
                      label="Select Item Type"
                      onChange={(valueOption) => {
                        categoryApiCaller(valueOption?.value, values);
                        setFieldValue('itemCategory', '');
                        setFieldValue('itemType', valueOption);
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
                      label="Select Item Category"
                      onChange={(valueOption) => {
                        setFieldValue('itemSubCategory', '');
                        subcategoryApiCaller(valueOption?.value, values);
                        setFieldValue('itemCategory', valueOption);
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
                      label="Select Item Sub-category"
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
                        if (
                          !values.businessUnit ||
                          !values.plant ||
                          !values.warehouse ||
                          !values.fromDate ||
                          !values.toDate ||
                          !values.status ||
                          !values.itemType ||
                          !values.itemCategory ||
                          !values.itemSubCategory
                        ) {
                          toast.error('All fields are required');
                          return;
                        }
                        getData(values);
                      }}
                      className="btn btn-primary mt-5"
                    >
                      Show
                    </button>
                  </div>
                </div>

                <div>
                  {autoRFQData?.length > 0 && (
                    <div className="table-responsive">
                      <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>PR Code</th>
                            <th>PR Type</th>
                            {/* <th>Item Code</th>
                            <th>Item Name</th>
                            <th>UOM</th> */}
                            <th>Warehouse</th>
                            <th>Plant Name</th>
                            {/* <th>Business Unit</th> */}
                            {/* <th>Current Stock</th> */}
                            {/* <th>Open PR</th>
                            <th>Open PO</th> */}
                            {/* <th>Ghat Stock</th>
                            <th>Port Stock</th> */}
                            {/* <th>Reorder Level</th> */}
                            <th>Total Item</th>
                            <th>Total Quantity</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {autoRFQData?.length > 0 &&
                            autoRFQData?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>

                                <td className="text-left">
                                  {item?.purchaseRequestCode || ''}
                                </td>
                                <td className="text-center">
                                  {item?.purchaseRequestTypeName || ''}
                                </td>
                                {/* <td className="text-center">
                                  {item?.itemCode}
                                </td>
                                <td>{item?.itemName}</td>
                                <td className="text-center">{item?.uoMName}</td> */}
                                <td className="text-center">
                                  {item?.warehouseName}
                                </td>
                                <td className="text-center">
                                  {item?.plantName}
                                </td>
                                {/* <td>{item?.businessUnitName}</td> */}
                                {/* <td className="text-center">
                                  {item?.inventoryStock}
                                </td> */}
                                {/* <td className="text-center">
                                  {item?.purchaseRequestStock}
                                </td>
                                <td className="text-center">
                                  {item?.purchaseOrderStock}
                                </td> */}
                                {/* <td className="text-center">
                                  {item?.balanceOnGhat || 0}
                                </td>
                                <td className="text-center">
                                  {item?.portStock || 0}
                                </td> */}
                                {/* <td className="text-center">
                                  {item?.reorderLevel}
                                </td> */}
                                <td className="text-center">
                                  {item?.noOfItem || ''}
                                </td>
                                <td className="text-center">
                                  {item?.totalQuantity || ''}
                                </td>
                                <td className="text-center">
                                  {values?.status?.value === 4 && (
                                    <OverlayTrigger
                                      overlay={
                                        <Tooltip id="plus-icon">
                                          Create RFQ
                                        </Tooltip>
                                      }
                                    >
                                      <i
                                        onClick={() => {
                                          history.push({
                                            pathname: `/mngProcurement/purchase-management/AutoPOCalculation/rfqCreate`,
                                            state: item,
                                          });
                                        }}
                                        className="fas fa-plus-circle fa-2x "
                                        style={{
                                          color: '#007bff',
                                          cursor: 'pointer',
                                        }}
                                      ></i>
                                    </OverlayTrigger>
                                  )}
                                </td>
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
