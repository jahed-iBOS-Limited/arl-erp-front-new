import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import { Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { shallowEqual, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import TextArea from '../../../_helper/TextArea';
import { _dateFormatter } from '../../../_helper/_dateFormate';
import IForm from '../../../_helper/_form';
import IDelete from '../../../_helper/_helperIcons/_delete';
import InputField from '../../../_helper/_inputField';
import Loading from '../../../_helper/_loading';
import NewSelect from '../../../_helper/_select';
import {
   _oneMonthLater,
   _todayDate,
   _todayDateTime12HFormet,
} from '../../../_helper/_todayDate';
import IViewModal from '../../../_helper/_viewModal';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import NewSupplierModal from './newSupplierModal';

const initData = {
   sbu: '',
   plant: '',
   warehouse: '',
   purchaseOrganization: {
      value: 11,
      label: "Local Procurement"
   },
   rfqType: { value: 1, label: 'Standard RFQ' },
   rfqTitle: '',
   currency: {
      value: 141,
      label: 'Taka',
      code: 'BDT',
   },
   paymentTerms: { value: 'Bank', label: 'Bank' },
   transportCost: { value: 1, label: 'Including' },
   quotationEntryStart: '',
   validTillDate: '',
   deliveryAddress: '',
   vatOrAit: { value: 1, label: 'Including' },
   tds: { value: 1, label: 'Including' },
   vds: { value: 1, label: 'Including' },
   referenceType: '',
   deliveryDate: '',
   referenceNo: '',
   // item infos
   item: '',
   itemDescription: '',
   quantity: '',
   isAllItem: false,
   // supplier infos
   supplier: '',
   supplierContactNo: '',
   supplierEmail: '',
   isAllSupplier: false,
   termsAndConditions: '',

   isSentToSupplier: null,
};

export default function RFQCreateEdit() {
   const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
   const { id } = useParams();
   const [isRfqQty, setIsRfqQty] = useState(false);
   const [objProps, setObjprops] = useState({});
   const [, saveData, saveDataLoader] = useAxiosPost();
   const { profileData, selectedBusinessUnit } = useSelector(state => {
      return state.authData;
   }, shallowEqual);

   const saveHandler = (values, cb) => {
      if (!values?.sbu) return toast.warn('Please select SBU');
      if (!values?.plant) return toast.warn('Please select Plant');
      if (!values?.warehouse) return toast.warn('Please select Warehouse');
      if (!values?.purchaseOrganization)
         return toast.warn('Please select Purchase Organization');
      if (!values?.rfqType) return toast.warn('Please select RFQ Type');
      if (!values?.rfqTitle) return toast.warn('Please enter RFQ Title');
      if (!values?.currency) return toast.warn('Please select Currency');
      if (!values?.paymentTerms)
         return toast.warn('Please select Payment Terms');
      if (!values?.transportCost)
         return toast.warn('Please select Transport Cost');
      if (!values?.quotationEntryStart)
         return toast.warn('Please select Quotation Start Date-Time');
      if (!values?.validTillDate)
         return toast.warn('Please select Quotation End Date-Time');
      if (!values?.deliveryDate)
         return toast.warn('Please select Delivery Date');
      if (!values?.deliveryAddress)
         return toast.warn('Please enter Delivery Address');
      if (!values?.vatOrAit) return toast.warn('Please select VAT/AIT');
      if (!values?.tds) return toast.warn('Please select TDS');
      if (!values?.vds) return toast.warn('Please select VDS');
      if (!values?.referenceType)
         return toast.warn('Please select Reference Type');
      if (!itemList?.length) return toast.warn('Please add item');
      if (!supplierList?.length) return toast.warn('Please add supplier');
      const payload = {
         objHeader: {
            requestForQuotationId: id ? +id : 0,
            rfqdate: _todayDate(),
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            businessUnitName: selectedBusinessUnit?.label,
            sbuname: values?.sbu?.label || '',
            sbuid: values?.sbu?.value || 0,
            purchaseOrganizationId: values?.purchaseOrganization?.value,
            purchaseOrganizationName: values?.purchaseOrganization?.label,
            plantId: values?.plant?.value || 0,
            plantName: values?.plant?.label || '',
            warehouseId: values?.warehouse?.value || 0,
            warehouseName: values?.warehouse?.label || '',
            requestTypeId: values?.rfqType?.value || 0,
            requestTypeName: values?.rfqType?.label || '',
            referenceTypeName: values?.referenceType?.value || '',
            currencyId: values?.currency?.value || 0,
            validTillDate: values?.validTillDate,
            actionBy: profileData?.userId,
            paymentTerms: values?.paymentTerms?.value || '',
            isTransportCostInclude:
               values?.transportCost?.value === 1 ? true : false,
            isVatAitInclude: values?.vatOrAit?.value === 1 ? true : false,
            isTdsInclude: values?.tds?.value === 1 ? true : false,
            isVdsInclude: values?.vds?.value === 1 ? true : false,
            deliveryAddress: values?.deliveryAddress,
            deliveryDate: values?.deliveryDate,
            quotationEntryStart: values?.quotationEntryStart,
            rfqtitle: values?.rfqTitle,
            termsAndConditions: values?.termsAndConditions,
         },
         objRow: itemList,
         supplierRow: supplierList,
      };
      saveData(
         id
            ? `/procurement/RequestForQuotation/EditRequestForQuotation`
            : `/procurement/RequestForQuotation/CreateRequestForQuotation`,
         payload,
         cb,
         true
      );
   };

   const [itemList, setItemList] = useState([]);
   const [supplierList, setSupplierList] = useState([]);

   const [sbuListDDL, getSbuListDDL, sbuListDDLloader] = useAxiosGet();
   const [plantListDDL, getPlantListDDL, plantListDDLloader] = useAxiosGet();
   const [
      warehouseListDDL,
      getWarehouseListDDL,
      warehouseListDDLloader,
   ] = useAxiosGet();
   const [
      purchangeOrgListDDL,
      getPurchaseOrgListDDL,
      purchaseOrgListDDLloader,
   ] = useAxiosGet();
   const [currencyDDL, getCurrencyDDL, currencyDDLloader] = useAxiosGet();
   const [
      referenceNoDDL,
      getReferenceNoDDL,
      referenceNoDDLloader,
   ] = useAxiosGet();
   const [
      itemListDDL,
      getItemListDDL,
      itemListDDLloader,
      setItemListDDL,
   ] = useAxiosGet();
   const [
      supplierListDDL,
      getSupplierListDDL,
      supplierListDDLloader,
      setSupplierListDDL,
   ] = useAxiosGet();

   const [modifiedData, setModifiedData] = useState({});
   const [, getSingleData, singleDataLoader] = useAxiosGet();

   useEffect(() => {
      if (id) {
         getSingleData(
            `/procurement/RequestForQuotation/GetRequestForQuotationById?RequestForQuotationId=${id}`,
            data => {
               console.log('data', data);
               const { objHeader, objRow, supplierRow } = data;
               setItemList(objRow);
               setSupplierList(supplierRow);
               const viewData = {
                  sbu: {
                     value: objHeader?.sbuid,
                     label: objHeader?.sbuname,
                  },
                  plant: {
                     value: objHeader?.plantId,
                     label: objHeader?.plantName,
                  },
                  warehouse: {
                     value: objHeader?.warehouseId,
                     label: objHeader?.warehouseName,
                  },
                  rfqType: {
                     value: objHeader?.requestTypeId,
                     label: objHeader?.requestTypeName,
                  },
                  purchaseOrganization: {
                     value: objHeader?.purchaseOrganizationId,
                     label: objHeader?.purchaseOrganizationName,
                  },
                  rfqTitle: objHeader?.rfqtitle,
                  currency: {
                     value: objHeader?.currencyId,
                     label: objHeader?.currencyCode,
                  },
                  paymentTerms: {
                     value: objHeader?.paymentTerms,
                     label: objHeader?.paymentTerms,
                  },
                  transportCost: {
                     value: objHeader?.isTransportCostInclude ? 1 : 2,
                     label: objHeader?.isTransportCostInclude
                        ? 'Including'
                        : 'Excluding',
                  },
                  quotationEntryStart: objHeader?.quotationEntryStart,
                  validTillDate: objHeader?.validTillDate,
                  deliveryDate: _dateFormatter(objHeader?.deliveryDate),
                  deliveryAddress: objHeader?.deliveryAddress,
                  vatOrAit: {
                     value: objHeader?.isVatAitInclude ? 1 : 2,
                     label: objHeader?.isVatAitInclude
                        ? 'Including'
                        : 'Excluding',
                  },
                  tds: {
                     value: objHeader?.isTdsInclude ? 1 : 2,
                     label: objHeader?.isTdsInclude ? 'Including' : 'Excluding',
                  },
                  vds: {
                     value: objHeader?.isVdsInclude ? 1 : 2,
                     label: objHeader?.isVdsInclude ? 'Including' : 'Excluding',
                  },
                  referenceType: {
                     value: objHeader?.referenceTypeName,
                     label: objHeader?.referenceTypeName,
                  },
                  referenceNo: '',
                  termsAndConditions: objHeader?.termsAndConditions,
                  isSentToSupplier: objHeader?.isSentToSupplier,
               };
               if (objHeader?.referenceTypeName === 'without reference') {
                  getItemListDDL(
                     `/procurement/RequestForQuotation/GetRFQItemWithoutRef?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&PlantId=${objHeader?.plantId}&WarehouseId=${objHeader?.warehouseId}`
                  );
               } else {
                  getReferenceNoDDL(
                     `/procurement/RequestForQuotation/GetPRReferrenceNoDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&SBUId=${objHeader?.sbuid}&PurchaseOrganizationId=${objHeader?.purchaseOrganizationId}&PlantId=${objHeader?.plantId}&WearHouseId=${objHeader?.warehouseId}`
                  );
               }
               getPlantListDDL(
                  `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${profileData?.userId}&AccId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&OrgUnitTypeId=7`
               );
               getWarehouseListDDL(
                  `/wms/ItemPlantWarehouse/GetWareHouseItemPlantWareHouseDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&PlantId=${objHeader?.plantId
                  }`
               );
               getSupplierListDDL(
                  `/procurement/PurchaseOrder/GetSupplierListDDL?AccountId=${profileData?.accountId}&UnitId=${selectedBusinessUnit?.value}&SBUId=${objHeader?.sbuid}`
               );
               getPurchaseOrgListDDL(
                  `/procurement/BUPurchaseOrganization/GetBUPurchaseOrganizationDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`
               );
               setModifiedData(viewData);
            }
         );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);
   useEffect(() => {
      if (!id) {
         getPlantListDDL(
            `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${profileData?.userId}&AccId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&OrgUnitTypeId=7`
         );
         getSbuListDDL(
            `/costmgmt/SBU/GetSBUListDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&Status=true`,
            data => {
               if (data && data.length > 0) {
                  initData.sbu = data[0];
                  getSupplierListDDL(
                     `/procurement/PurchaseOrder/GetSupplierListDDL?AccountId=${profileData?.accountId}&UnitId=${selectedBusinessUnit?.value}&SBUId=${data[0]?.value}`
                  );
               }
            }
         );
         getCurrencyDDL(`/domain/Purchase/GetBaseCurrencyList`);
         getPurchaseOrgListDDL(
            `/procurement/BUPurchaseOrganization/GetBUPurchaseOrganizationDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`
         );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const handleAddSupplier = (values, setFieldValue) => {
      if (!values?.supplier) {
         return toast.warn('Please Select Supplier');
      }
      if (!values?.supplierContactNo) {
         return toast.warn('Please Enter Supplier Contact No');
      }
      if (!values?.supplierEmail) {
         return toast.warn('Please Enter Supplier Email');
      }
      const isDuplicate = supplierList.some(
         supplier => supplier?.businessPartnerName === values?.supplier?.label
      );
      if (isDuplicate) {
         toast.warn(`${values?.supplier?.label} already added`);
      } else {
         const newSupplier = {
            partnerRFQId: 0,
            requestForQuotationId: id ? +id : 0,
            businessPartnerId: values?.supplier?.value,
            businessPartnerName: values?.supplier?.label,
            businessPartnerAddress: values?.supplier?.supplierAddress,
            email:
               values?.supplierEmail === ''
                  ? values?.supplier?.supplierEmail
                  : values?.supplierEmail,
            contactNumber:
               values?.supplierContactNo === ''
                  ? values?.supplier?.supplierContact
                  : values?.supplierContactNo,
            isEmailSend: false,
         };
         setSupplierList([...supplierList, newSupplier]);
      }
      setFieldValue('supplier', '');
      setFieldValue('supplierContactNo', '');
      setFieldValue('supplierEmail', '');
   };

   const handleAddItem = (values, setFieldValue) => {
      if (values?.referenceType?.value === 'without reference') {
         if (!values?.item) {
            return toast.warn('Please Select Item');
         }
         if (!values?.quantity) {
            return toast.warn('Please Enter Quantity');
         }
         const isDuplicate = itemList.some(
            item => item?.itemId === values?.item?.value
         );
         if (isDuplicate) {
            toast.warn(`${values?.item?.label} already added`);
         } else {
            setItemList([
               ...itemList,
               {
                  rowId: 0,
                  itemId: values?.item?.value || 0,
                  itemCode: values?.item?.code || '',
                  itemName: values?.item?.label || '',
                  itemtypeName: values?.item?.itemtypeName || '',
                  uoMid: values?.item?.uoMId || 0,
                  uoMname: values?.item?.uoMName || '',
                  reqquantity: +values?.quantity || 0,
                  referenceId: 0,
                  referenceCode: '',
                  referenceQuantity: 0,
                  description:
                     values?.itemDescription === ''
                        ? values?.item?.description
                        : values?.itemDescription,
               },
            ]);
            setFieldValue('item', '');
            setFieldValue('itemDescription', '');
            setFieldValue('quantity', '');
         }
      } else {
         if (values.isAllItem) {
            let rowList = [];
            if (itemListDDL?.length > 0) {
               itemListDDL.forEach(item => {
                  const isDuplicate = itemList.some(
                     itemList =>
                        itemList?.itemId === item?.value &&
                        itemList?.referenceCode === values?.referenceNo?.label
                  );
                  if (!isDuplicate) {
                     rowList.push({
                        itemId: item?.value || 0,
                        itemCode: item?.code || '',
                        itemName: item?.label || '',
                        itemtypeName: item?.itemtypeName || '',
                        uoMid: item?.uoMId || 0,
                        uoMname: item?.uoMName || '',
                        reqquantity: 0,
                        referenceId: values?.referenceNo?.value || 0,
                        referenceCode: values?.referenceNo?.label || '',
                        referenceQuantity: item?.refQty || 0,
                        description: item?.description,
                     });
                  }
               });
            }
            setItemList([...itemList, ...rowList]);
         } else {
            if (!values?.item) {
               return toast.warn('Please Select Item');
            }
            if (!values?.quantity) {
               return toast.warn('Please Enter Quantity');
            }
            const isDuplicate = itemList.some(
               item =>
                  item?.itemId === values?.item?.value &&
                  item?.referenceCode === values?.referenceNo?.label
            );
            if (isDuplicate) {
               toast.warn(
                  `${values?.item?.label} already added under ${values?.referenceNo?.label}`
               );
            } else {
               setItemList([
                  ...itemList,
                  {
                     rowId: 0,
                     itemId: values?.item?.value || 0,
                     itemCode: values?.item?.code || '',
                     itemName: values?.item?.label || '',
                     itemtypeName: values?.item?.itemtypeName || '',
                     uoMid: values?.item?.uoMId || 0,
                     uoMname: values?.item?.uoMName || '',
                     reqquantity: +values?.quantity || 0,
                     referenceId: values?.referenceNo?.value || 0,
                     referenceCode: values?.referenceNo?.label || '',
                     referenceQuantity: +values?.item?.refQty || 0,
                     description:
                        values?.itemDescription === ''
                           ? values?.item?.description
                           : values?.itemDescription,
                  },
               ]);
               setFieldValue('item', '');
               setFieldValue('itemDescription', '');
               setFieldValue('quantity', '');
            }
         }
      }
   };

   const handleDescriptionChange = (e, index) => {
      const temp = [...itemList];
      temp[index] = { ...temp[index], description: e.target.value };
      setItemList(temp);
   };

   const handleQuantityChange = (e, index) => {
      if (e.target.value < 0) {
         return toast?.warn('Quantity cant be negative');
      } else {
         const temp = [...itemList];
         temp[index].reqquantity = +e.target.value;
         setItemList(temp);
      }
   };

   return (
      <Formik
         enableReinitialize={true}
         initialValues={id ? modifiedData : initData}
         onSubmit={(values, { setSubmitting, resetForm }) => {
            saveHandler(values, () => {
               !id && resetForm(initData);
               !id && setItemList([]);
               !id && setSupplierList([]);
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
            d,
         }) => (
            <>
               {(purchaseOrgListDDLloader ||
                  currencyDDLloader ||
                  referenceNoDDLloader ||
                  itemListDDLloader ||
                  supplierListDDLloader ||
                  sbuListDDLloader ||
                  plantListDDLloader ||
                  warehouseListDDLloader ||
                  saveDataLoader ||
                  singleDataLoader) && <Loading />}
               <IForm
                  title={
                     id
                        ? 'Edit Request For Quotation'
                        : 'Create Request For Quotation'
                  }
                  getProps={setObjprops}
               >
                  <Form>
                     <div className="form-group  global-form row">
                        <div className="col-lg-3">
                           <NewSelect
                              name="sbu"
                              options={sbuListDDL || []}
                              value={values?.sbu}
                              label="SBU"
                              onChange={v => {
                                 if (v) {
                                    setFieldValue('sbu', v);
                                    setFieldValue('plant', '');
                                    setFieldValue('warehouse', '');
                                    getSupplierListDDL(
                                       `/procurement/PurchaseOrder/GetSupplierListDDL?AccountId=${profileData?.accountId}&UnitId=${selectedBusinessUnit?.value}&SBUId=${v?.value}`
                                    );
                                 } else {
                                    setSupplierListDDL([]);
                                    setFieldValue('sbu', '');
                                    setFieldValue('plant', '');
                                    setFieldValue('warehouse', '');

                                    setFieldValue('supplier', '');
                                    setFieldValue('supplierContactNo', '');
                                    setFieldValue('supplierEmail', '');
                                 }
                              }}
                              placeholder="SBU"
                              errors={errors}
                              touched={touched}
                              isDisabled={id && values?.isSentToSupplier}
                           />
                        </div>
                        <div className="col-lg-3">
                           <NewSelect
                              name="plant"
                              options={plantListDDL || []}
                              value={values?.plant}
                              label="Plant"
                              onChange={v => {
                                 if (v) {
                                    setFieldValue('plant', v);
                                    setFieldValue('warehouse', '');
                                    setFieldValue('referenceType', '');
                                    getWarehouseListDDL(
                                       `/wms/ItemPlantWarehouse/GetWareHouseItemPlantWareHouseDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&PlantId=${v?.value}`
                                    );
                                 } else {
                                    setFieldValue('plant', '');
                                    setFieldValue('warehouse', '');
                                    setFieldValue('referenceType', '');
                                 }
                              }}
                              placeholder="Plant"
                              errors={errors}
                              touched={touched}
                              isDisabled={id && values?.isSentToSupplier}
                           />
                        </div>
                        <div className="col-lg-3">
                           <NewSelect
                              name="warehouse"
                              options={warehouseListDDL || []}
                              value={values?.warehouse}
                              label="Warehouse"
                              onChange={v => {
                                 setFieldValue('warehouse', v);
                                 setFieldValue('referenceType', '');
                              }}
                              placeholder="Warehouse"
                              errors={errors}
                              touched={touched}
                              isDisabled={
                                 !values?.plant ||
                                 (id && values?.isSentToSupplier)
                              }
                           />
                        </div>
                        <div className="col-lg-3">
                           <NewSelect
                              name="rfqType"
                              options={[
                                 { value: 1, label: 'Standard RFQ' }
                              ]}
                              value={values?.rfqType}
                              label="RFQ Type"
                              onChange={v => {
                                 setFieldValue('rfqType', v);
                              }}
                              placeholder="RFQ Type"
                              errors={errors}
                              touched={touched}
                              isDisabled={true}
                           />
                        </div>
                        <div className="col-lg-3">
                           <NewSelect
                              name="purchaseOrganization"
                              options={purchangeOrgListDDL || []}
                              value={values?.purchaseOrganization}
                              label="Purchase Organization"
                              onChange={v => {
                                 if (v) {
                                    setFieldValue('currency', '');
                                    setFieldValue('purchaseOrganization', v);
                                    if (v?.value === 11) {
                                       setFieldValue('currency', {
                                          value: 141,
                                          label: 'Taka',
                                          code: 'BDT',
                                       });
                                    } else {
                                       setFieldValue('currency', {
                                          value: 155,
                                          label: 'US Dollar',
                                          code: 'USD',
                                       });
                                    }
                                 } else {
                                    setFieldValue('currency', '');
                                    setFieldValue('purchaseOrganization', '');
                                 }

                              }}
                              placeholder="Purchase Organization"
                              errors={errors}
                              touched={touched}
                              isDisabled={id && values?.isSentToSupplier}
                           />
                        </div>
                        <div className="col-lg-3">
                           <InputField
                              value={values?.rfqTitle}
                              label="RFQ Title"
                              name="rfqTitle"
                              type="text"
                              placeholder="RFQ Title"
                              onChange={e => {
                                 setFieldValue('rfqTitle', e.target.value);
                              }}
                              disabled={id && values?.isSentToSupplier}
                           />
                        </div>
                        <div className="col-lg-3">
                           <NewSelect
                              name="currency"
                              options={currencyDDL || []}
                              value={values?.currency}
                              label="Currency"
                              onChange={v => {
                                 setFieldValue('currency', v);
                              }}
                              placeholder="Currency"
                              errors={errors}
                              touched={touched}
                              isDisabled={
                                 values?.purchaseOrganization?.value === 11 ||
                                 (id && values?.isSentToSupplier)
                              }
                           />
                        </div>
                        <div className="col-lg-3">
                           <NewSelect
                              name="paymentTerms"
                              options={[
                                 { value: 'Cash', label: 'Cash' },
                                 { value: 'Bank', label: 'Bank' },
                              ]}
                              value={values?.paymentTerms}
                              label="Payment Terms"
                              onChange={v => {
                                 setFieldValue('paymentTerms', v);
                              }}
                              placeholder="Payment Terms"
                              errors={errors}
                              touched={touched}
                              isDisabled={id && values?.isSentToSupplier}
                           />
                        </div>
                        <div className="col-lg-3">
                           <InputField
                              value={values?.quotationEntryStart}
                              label="Quotation Start Date-Time"
                              name="Quotation Starte Date-Time"
                              type="datetime-local"
                              onChange={e => {
                                 if (e.target.value) {
                                    setFieldValue(
                                       'quotationEntryStart',
                                       e.target.value
                                    );
                                    setFieldValue('validTillDate', '');
                                    setFieldValue('deliveryDate', '');
                                 } else {
                                    setFieldValue('quotationEntryStart', '');
                                    setFieldValue('validTillDate', '');
                                    setFieldValue('deliveryDate', '');
                                 }
                              }}
                              disabled={id && values?.isSentToSupplier}
                              min={_todayDateTime12HFormet()}
                           />
                        </div>
                        <div className="col-lg-3">
                           <InputField
                              value={values?.validTillDate}
                              label="Quotation End Date-Time"
                              name="validTillDate"
                              type="datetime-local"
                              onChange={e => {
                                 if (e.target.value) {
                                    setFieldValue(
                                       'validTillDate',
                                       e.target.value
                                    );
                                    setFieldValue(
                                       'deliveryDate',
                                       _oneMonthLater(
                                          e.target.value.split('T')[0]
                                       )
                                    );
                                 } else {
                                    setFieldValue('validTillDate', '');
                                    setFieldValue('deliveryDate', '');
                                 }
                              }}
                              min={values?.quotationEntryStart}
                           />
                        </div>
                        <div className="col-lg-3">
                           <InputField
                              value={values?.deliveryDate}
                              label="Delivery Date"
                              name="deliveryDate"
                              type="date"
                              onChange={e => {
                                 setFieldValue('deliveryDate', e.target.value);
                              }}
                              min={values?.validTillDate?.split('T')[0]}
                           />
                        </div>
                        <div className="col-lg-3">
                           <InputField
                              value={values?.deliveryAddress}
                              label="Delivery Address"
                              name="deliveryAddress"
                              type="text"
                              placeholder="Delivery Address"
                              onChange={e => {
                                 setFieldValue(
                                    'deliveryAddress',
                                    e.target.value
                                 );
                              }}
                              disabled={id && values?.isSentToSupplier}
                           />
                        </div>
                        <div className="col-lg-3">
                           <NewSelect
                              name="transportCost"
                              options={[
                                 { value: 1, label: 'Including' },
                                 { value: 2, label: 'Excluding' },
                              ]}
                              value={values?.transportCost}
                              label="Transport Cost"
                              onChange={v => {
                                 setFieldValue('transportCost', v);
                              }}
                              placeholder="Transport Cost"
                              errors={errors}
                              touched={touched}
                              isDisabled={id && values?.isSentToSupplier}
                           />
                        </div>
                        <div className="col-lg-3">
                           <NewSelect
                              name="vatOrAit"
                              options={[
                                 { value: 1, label: 'Including' },
                                 { value: 2, label: 'Excluding' },
                              ]}
                              value={values?.vatOrAit}
                              label="VAT/AIT"
                              onChange={v => {
                                 setFieldValue('vatOrAit', v);
                              }}
                              placeholder="VAT/AIT"
                              errors={errors}
                              touched={touched}
                              isDisabled={id && values?.isSentToSupplier}
                           />
                        </div>
                        <div className="col-lg-3">
                           <NewSelect
                              name="tds"
                              options={[
                                 { value: 1, label: 'Including' },
                                 { value: 2, label: 'Excluding' },
                              ]}
                              value={values?.tds}
                              label="TDS"
                              onChange={v => {
                                 setFieldValue('tds', v);
                              }}
                              placeholder="TDS"
                              errors={errors}
                              touched={touched}
                              isDisabled={id && values?.isSentToSupplier}
                           />
                        </div>
                        <div className="col-lg-3">
                           <NewSelect
                              name="vds"
                              options={[
                                 { value: 1, label: 'Including' },
                                 { value: 2, label: 'Excluding' },
                              ]}
                              value={values?.vds}
                              label="VDS"
                              onChange={v => {
                                 setFieldValue('vds', v);
                              }}
                              placeholder="VDS"
                              errors={errors}
                              touched={touched}
                              isDisabled={id && values?.isSentToSupplier}
                           />
                        </div>
                        <div className="col-lg-3">
                           <NewSelect
                              name="referenceType"
                              options={[
                                 {
                                    value: 'with reference',
                                    label: 'With reference',
                                 },
                                 {
                                    value: 'without reference',
                                    label: 'Without reference',
                                 },
                              ]}
                              value={values?.referenceType}
                              label="Reference Type"
                              onChange={v => {
                                 if (v) {
                                    if (v?.value === 'without reference') {
                                       getItemListDDL(
                                          `/procurement/RequestForQuotation/GetRFQItemWithoutRef?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&PlantId=${values?.plant?.value}&WarehouseId=${values?.warehouse?.value}`
                                       );
                                    } else {
                                       getReferenceNoDDL(
                                          `/procurement/RequestForQuotation/GetPRReferrenceNoDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&SBUId=${values?.sbu?.value}&PurchaseOrganizationId=${values?.purchaseOrganization?.value}&PlantId=${values?.plant?.value}&WearHouseId=${values?.warehouse?.value}`
                                       );
                                    }
                                    setFieldValue('referenceType', v);
                                    setFieldValue('referenceNo', '');
                                    setFieldValue('item', '');
                                    setFieldValue('itemDescription', '');
                                    setItemListDDL([]);
                                    setItemList([]);
                                    setFieldValue('isAllItem', false);
                                 } else {
                                    setFieldValue('referenceType', '');
                                    setFieldValue('referenceNo', '');
                                    setFieldValue('item', '');
                                    setFieldValue('itemDescription', '');
                                    setItemListDDL([]);
                                    setItemList([]);
                                    setFieldValue('isAllItem', false);
                                 }
                              }}
                              placeholder="Reference Type"
                              errors={errors}
                              touched={touched}
                              isDisabled={
                                 !values?.plant ||
                                 !values?.warehouse ||
                                 !values?.purchaseOrganization ||
                                 id ||
                                 itemList?.length > 0
                              }
                           />
                        </div>
                     </div>
                     <h4 className="mt-2">Add Item</h4>
                     <div className="form-group  global-form row">
                        <div className="col-lg-3">
                           <NewSelect
                              name="referenceNo"
                              options={referenceNoDDL || []}
                              value={values?.referenceNo}
                              label="Reference No"
                              onChange={v => {
                                 if (v) {
                                    setFieldValue('referenceNo', v);
                                    setFieldValue('item', '');
                                    setFieldValue('itemDescription', '');
                                    setFieldValue('quantity', '');
                                    setItemListDDL([]);
                                    getItemListDDL(`/procurement/RequestForQuotation/GetRFQItemDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&SBUId=${values?.sbu?.value}&PurchaseOrganizationId=${values?.purchaseOrganization?.value}&PlantId=${values?.plant?.value}&WearHouseId=${values?.warehouse?.value}&PurchaseRequestId=${v?.value}
                                            `);
                                 } else {
                                    setFieldValue('referenceNo', '');
                                    setFieldValue('item', '');
                                    setFieldValue('itemDescription', '');
                                    setFieldValue('quantity', '');
                                    setItemListDDL([]);
                                 }
                              }}
                              placeholder="Reference No"
                              errors={errors}
                              touched={touched}
                              isDisabled={
                                 !values?.plant ||
                                 !values?.warehouse ||
                                 values?.referenceType?.value ===
                                 'without reference' ||
                                 (id && values?.isSentToSupplier)
                              }
                           />
                        </div>
                        <div className="col-lg-9"></div>
                        <div className="col-lg-3">
                           <NewSelect
                              name="item"
                              options={itemListDDL || []}
                              value={values?.item}
                              label="Item"
                              onChange={v => {
                                 if (v) {
                                    setFieldValue('item', v);
                                    setFieldValue('itemDescription', '');
                                    setFieldValue('quantity', v?.refQty);
                                 } else {
                                    setFieldValue('item', '');
                                    setFieldValue('itemDescription', '');
                                    setFieldValue('quantity', '');
                                 }
                              }}
                              placeholder="Item"
                              errors={errors}
                              touched={touched}
                              isDisabled={id && values?.isSentToSupplier}
                           />
                        </div>
                        <div className="col-lg-3">
                           <InputField
                              value={values?.itemDescription}
                              label="Item Description"
                              name="itemDescription"
                              type="text"
                              placeholder="Item Description"
                              onChange={e => {
                                 setFieldValue(
                                    'itemDescription',
                                    e.target.value
                                 );
                              }}
                              disabled={id && values?.isSentToSupplier}
                           />
                        </div>
                        <div className="col-lg-2">
                           <InputField
                              value={values?.quantity}
                              label="Quantity"
                              name="quantity"
                              type="number"
                              placeholder="Quantity"
                              onChange={e => {
                                 setFieldValue('quantity', e.target.value);
                              }}
                              disabled={id && values?.isSentToSupplier}
                           />
                        </div>
                        <div className="col-lg-2">
                           <label style={{ position: 'absolute', top: '24px' }}>
                              All Item
                           </label>
                           <Field
                              name={values.isAllItem}
                              component={() => (
                                 <input
                                    style={{
                                       position: 'absolute',
                                       top: '28px',
                                       left: '65px',
                                    }}
                                    id="rfqIsAllItem"
                                    type="checkbox"
                                    className="ml-2"
                                    disabled={
                                       !values?.referenceType || values?.referenceType?.value === 'without reference' || (id && values?.isSentToSupplier) || !itemListDDL?.length > 0
                                    }
                                    value={values.isAllItem || ''}
                                    checked={values.isAllItem}
                                    name="isAllItem"
                                    onChange={e => {
                                       setFieldValue(
                                          'isAllItem',
                                          e.target.checked
                                       );
                                       setFieldValue('item', '');
                                    }}
                                 />
                              )}
                              label="isAllItem"
                           />
                        </div>
                        <div className="col-lg-2">
                           <button
                              type="button"
                              className="btn btn-primary"
                              style={{
                                 marginTop: '18px',
                              }}
                              onClick={() => {
                                 handleAddItem(values, setFieldValue);
                                 setFieldValue('isAllItem', false);
                                 setIsRfqQty(false);
                                 setFieldValue('itemDescription', "");
                                 setFieldValue('quantity', "");
                              }}
                              disabled={id && values?.isSentToSupplier}
                           >
                              Add Item
                           </button>
                        </div>
                     </div>
                     <div className="mt-2">
                        <table className="table table-striped table-bordered bj-table bj-table-landing">
                           <thead>
                              <tr>
                                 <th>Sl</th>
                                 {values?.referenceType?.value === 'with reference' && <th>Reference No</th>}
                                 <th>Item Name</th>
                                 <th>Uom</th>
                                 <th>Description</th>
                                 {/* <th>PR Quantity</th> */}
                                 {values?.referenceType?.value === 'with reference' && <th>PR Quantity</th>}
                                 <th>
                                    <OverlayTrigger
                                       placement="top"
                                       overlay={
                                          <Tooltip>
                                             {isRfqQty
                                                ? 'Click to add quantity manually'
                                                : 'Click to fill by PR quantity'}
                                          </Tooltip>
                                       }
                                    >
                                       <input
                                          style={{
                                             transform: 'translateY(3px)',
                                             marginRight: '5px',
                                          }}
                                          type="checkbox"
                                          defaultChecked={isRfqQty}
                                          onChange={e => {
                                             if (e.target.checked) {
                                                setIsRfqQty(true);
                                                itemList.forEach(item => {
                                                   item.reqquantity =
                                                      item.referenceQuantity;
                                                });
                                                setItemList([...itemList]);
                                             } else {
                                                setIsRfqQty(false);
                                                itemList.forEach(item => {
                                                   item.reqquantity = 0;
                                                });
                                                setItemList([...itemList]);
                                             }
                                          }}
                                          disabled={
                                             itemList?.length === 0 ||
                                             (id && values?.isSentToSupplier) ||
                                             values?.referenceType?.value ===
                                             'without reference'
                                          }
                                       />
                                    </OverlayTrigger>
                                    Quantity
                                 </th>
                                 <th>Action</th>
                              </tr>
                           </thead>
                           <tbody>
                              {itemList?.length > 0 &&
                                 itemList?.map((item, index) => (
                                    <tr key={index}>
                                       <td>{index + 1}</td>
                                       {values?.referenceType?.value ===
                                          'with reference' && (
                                             <td className="text-center">
                                                {item?.referenceCode}
                                             </td>
                                          )}
                                       <td>{item?.itemName}</td>
                                       <td>{item?.uoMname}</td>
                                       <td>
                                          <InputField
                                             value={item?.description}
                                             name="description"
                                             type="text"
                                             placeholder="Item Description"
                                             onChange={e => {
                                                handleDescriptionChange(
                                                   e,
                                                   index
                                                );
                                             }}
                                             disabled={
                                                id && values?.isSentToSupplier
                                             }
                                          />
                                       </td>
                                       {values?.referenceType?.value ===
                                          'with reference' && (<td className="text-center">
                                             {item?.referenceQuantity}
                                          </td>)}
                                       <td>
                                          <InputField
                                             value={item?.reqquantity}
                                             name="reqquantity"
                                             type="number"
                                             placeholder="Quantity"
                                             onChange={e => {
                                                handleQuantityChange(e, index);
                                             }}
                                             disabled={
                                                id && values?.isSentToSupplier
                                             }
                                          />
                                       </td>
                                       <td className="text-center">
                                          <span
                                             onClick={() => {
                                                if (
                                                   id &&
                                                   values?.isSentToSupplier
                                                ) {
                                                   return toast.warn(
                                                      "You can't delete item after sending RFQ"
                                                   );
                                                }
                                                const temp = [...itemList];
                                                temp.splice(index, 1);
                                                setItemList(temp);
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
                     {/* item table */}
                     <h4 className="mt-2">Add Supplier to Send RFQ</h4>
                     <div className="form-group  global-form row">
                        <div className="col-lg-3 d-flex justify-content-center">
                           <NewSelect
                              name="supplier"
                              options={supplierListDDL || []}
                              value={values?.supplier}
                              label="Supplier"
                              onChange={v => {
                                 if (v) {
                                    setFieldValue('supplier', v);
                                    setFieldValue(
                                       'supplierContactNo',
                                       v?.supplierContact
                                    );
                                    setFieldValue(
                                       'supplierEmail',
                                       v?.supplierEmail
                                    );
                                 } else {
                                    setFieldValue('supplier', '');
                                    setFieldValue(
                                       'supplierContactNo',
                                       ''
                                    );
                                    setFieldValue(
                                       'supplierEmail',
                                       ''
                                    );
                                 }

                              }}
                              placeholder="Supplier"
                              errors={errors}
                              touched={touched}
                              isDisabled={id && values?.isSentToSupplier}
                           />
                           <span
                              style={{
                                 cursor: 'pointer',
                                 marginTop: '8px',
                              }}
                              onClick={() => {
                                 setShowAddSupplierModal(true);
                              }}
                           >
                              <OverlayTrigger
                                 placement="top"
                                 overlay={<Tooltip>Add New Supplier</Tooltip>}
                              >
                                 <AddCircleOutlineOutlinedIcon
                                    style={{
                                       color: '#1976d2',
                                    }}
                                 />
                              </OverlayTrigger>
                           </span>
                        </div>
                        <div className="col-lg-3">
                           <InputField
                              value={values?.supplierContactNo}
                              label="Contact No"
                              name="supplierContactNo"
                              type="text"
                              placeholder="Contact No"
                              onChange={e => {
                                 setFieldValue(
                                    'supplierContactNo',
                                    e.target.value
                                 );
                              }}
                              disabled={id && values?.isSentToSupplier}
                           />
                        </div>
                        <div className="col-lg-3">
                           <InputField
                              value={values?.supplierEmail}
                              label="Email"
                              name="supplierEmail"
                              type="text"
                              placeholder="Email"
                              onChange={e => {
                                 setFieldValue('supplierEmail', e.target.value);
                              }}
                              disabled={id && values?.isSentToSupplier}
                           />
                        </div>
                        <div className="col-lg-3 d-flex">
                           <button
                              type="button"
                              className="btn btn-primary"
                              style={{
                                 marginTop: '18px',
                                 marginLeft: '5px',
                              }}
                              onClick={() => {
                                 handleAddSupplier(values, setFieldValue);
                              }}
                              disabled={id && values?.isSentToSupplier}
                           >
                              Add Supplier
                           </button>
                        </div>
                     </div>
                     {/* supplier table */}
                     <div className="mt-2">
                        <table className="table table-striped table-bordered bj-table bj-table-landing">
                           <thead>
                              <tr>
                                 <th>Sl</th>
                                 <th>Supplier Name</th>
                                 <th>Supplier Address</th>
                                 <th>Contact No</th>
                                 <th>Email</th>
                                 <th>Action</th>
                              </tr>
                           </thead>
                           <tbody>
                              {supplierList?.length > 0 &&
                                 supplierList?.map((item, index) => (
                                    <tr key={index}>
                                       <td>{index + 1}</td>
                                       <td>{item?.businessPartnerName}</td>
                                       <td>{item?.businessPartnerAddress}</td>
                                       <td>{item?.contactNumber}</td>
                                       <td>{item?.email}</td>
                                       <td className="text-center">
                                          <span
                                             onClick={() => {
                                                if (
                                                   id &&
                                                   values?.isSentToSupplier
                                                ) {
                                                   return toast.warn(
                                                      "You can't delete supplier after sending RFQ"
                                                   );
                                                }
                                                const temp = [...supplierList];
                                                temp.splice(index, 1);
                                                setSupplierList(temp);
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
                     <div className="form-group  global-form row">
                        <div className="col-lg-12">
                           <label>Terms & Conditions</label>
                           <TextArea
                              style={{
                                 height: '100px',
                              }}
                              value={values?.termsAndConditions}
                              name="termsAndConditions"
                              placeholder="Terms & Conditions"
                              onChange={e =>
                                 setFieldValue(
                                    'termsAndConditions',
                                    e.target.value
                                 )
                              }
                              errors={errors}
                              touched={touched}
                           />
                        </div>
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
                  <IViewModal
                     show={showAddSupplierModal}
                     onHide={() => {
                        setShowAddSupplierModal(false);
                     }}
                  >
                     <NewSupplierModal />
                  </IViewModal>
               </IForm>
            </>
         )}
      </Formik>
   );
}
