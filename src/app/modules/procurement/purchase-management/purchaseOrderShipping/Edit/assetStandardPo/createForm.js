/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { ISelect } from '../../../../../_helper/_inputDropDown';
import { IInput } from '../../../../../_helper/_input';
import { validationSchema, setInputFieldsFunc } from './helper';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { getPOItemForStandradItemDDLAction } from '../../_redux/Actions';
import RowDtoTable from './rowDtoTable';
import { toast } from 'react-toastify';
import { _dateFormatter } from '../../../../../_helper/_dateFormate';
import TotalNetAmount from '../../TotalNetAmount';
import { getUniQueItems } from '../../helper';
import { getRefNoDdlForStandradPo } from '../../Form/assetStandardPo/helper';
import SearchAsyncSelect from './../../../../../_helper/SearchAsyncSelect';
import FormikError from './../../../../../_helper/_formikError';
import axios from 'axios';
import TextArea from '../../../../../_helper/TextArea';
import useAxiosGet from '../../customHooks/useAxiosGet';
import NewSelect from '../../../../../_helper/_select';
import { getCostCenterDDL, getCostElementDDL } from '../servicePO/helper';

// This form is also used for standard PO

export default function AssetStandardPOCreateForm({
   btnRef,
   saveHandler,
   resetBtnRef,
   disableHandler,
   isEdit,
   singleData,
   viewPage,
}) {
   const [inputFields, setInputFields] = useState();
   const dispatch = useDispatch();
   const [rowDto, setRowDto] = useState([]);
   const [refNoDDL, setRefNoDDL] = useState([]);
   const [, setCostCenterList] = useState([]);
   const [, setCostElementList] = useState([]);
   const [
      transferUnitSupplierDDL,
      getTransferUnitSupplierDDL,
      ,
      setTransferUnitSupplierDDL,
   ] = useAxiosGet();

   // redux store data
   const storeData = useSelector(state => {
      return {
         supplierNameDDL: state.purchaseOrder.supplierNameDDL,
         currencyDDL: state.purchaseOrder.currencyDDL,
         paymentTermsDDL: state.purchaseOrder.paymentTermsDDL,
         incoTermsDDL: state.purchaseOrder.incoTermsDDL,
         poReferenceNoDDL: state.purchaseOrder.poReferenceNoDDL,
         poItemsDDL: state.purchaseOrder.poItemsDDL,
         uomDDL: state.commonDDL.uomDDL,
         profileData: state.authData.profileData,
         selectedBusinessUnit: state.authData.selectedBusinessUnit,
      };
   }, shallowEqual);

   const {
      supplierNameDDL,
      currencyDDL,
      paymentTermsDDL,
      incoTermsDDL,
      poItemsDDL,
      uomDDL,
      profileData,
      selectedBusinessUnit,
   } = storeData;

   useEffect(() => {
      // all input fields : this function will set our all input fields  , then we will use loop to generate input fields in UI
      setInputFieldsFunc(setInputFields, storeData);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [supplierNameDDL, currencyDDL, paymentTermsDDL, incoTermsDDL]);

   useEffect(() => {
      const newData = singleData?.objRowListDTO?.map((item, index) => {
         // const priceStructure = item?.priceStructure?.map((item) => ({
         //   ...item,
         //   value: item?.value || 0,
         //   amount: item?.amount || 0,
         // }))

         let obj = {
            ...item,
            item: {
               label: item?.itemName,
               itemName: item?.itemName,
               value: item?.itemId,
               code: item?.itemCode,
               refQty: item?.referenceQty,
            },
            referenceNo: {
               value: item?.referenceId,
               label: item?.referenceCode,
            },
            desc: item?.purchaseDescription || '',
            selectedUom: {
               label: item?.uomName,
               value: item?.uomId,
            },
            refQty: item?.referenceQty,
            orderQty: item?.orderQty,
            initOrderQty: item?.initOrderQty || item?.orderQty,
            basicPrice: item?.basePrice,
            restofQty: item?.restofQty || 0,
            priceStructure: [], //priceStructure,
            netValue: item?.totalValue,
            vat: item?.vatPercentage,
            userGivenVatAmount: item?.baseVatAmount || 0,
            vatAmount: item?.vatAmount,
         };
         return obj;
      });
      const modData = [...newData]
      const sortedItems = modData?.sort((a, b) => {
         const subHeadA = a?.shippingItemSubHead || ''; 
         const subHeadB = b?.shippingItemSubHead || ''; 
         return subHeadA.localeCompare(subHeadB);
     });
       setRowDto(sortedItems);
      // setRowDto([...newData]);

      // get item initially
      getItemDDL(
         singleData?.objHeaderDTO?.businessPartnerId,
         singleData?.objHeaderDTO?.referenceTypeId,
         0
      );

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [singleData]);

   // add single item to row or add all item to row
   const addRowDtoData = (data, values) => {
      if (values?.isAllItem) {
         // get new items that not exit in rowdto
         const refferenceItems = getUniQueItems(data, rowDto, values);

         // show error if no new item found
         if (refferenceItems?.length === 0) {
            return toast.warn('Not allowed to duplicate items');
         }

         const newData = refferenceItems?.map((item, index) => {
            // const priceStructure = item?.priceStructure?.map((item) => ({
            //   ...item,
            //   value: item?.value || 0,
            //   amount: item?.amount || 0,
            // }))

            let obj = {
               ...values,
               newItem: true,
               item: { ...item },
               desc: item?.label,
               selectedUom: { value: item?.uoMId, label: item?.uoMName },
               // refQty: item?.djfdk
               orderQty: '',
               basicPrice: '',
               restofQty: item?.restofQty || 0,
               priceStructure: [], //priceStructure,
               netValue: 0,
               vat: 0,
               userGivenVatAmount: '',
               vatAmount: 0,
            };
            return obj;
         });
         // setRowDto([...newData, ...rowDto]);
         const modData = [...newData, ...rowDto]
         const sortedItems = modData?.sort((a, b) => {
            const subHeadA = a?.shippingItemSubHead || ''; 
            const subHeadB = b?.shippingItemSubHead || ''; 
            return subHeadA.localeCompare(subHeadB);
        });
          setRowDto(sortedItems);
      } else {
         // if reference, can't add same reference and same item multiple
         // if not reference, can't add multiple item
         let arr;

         if (values?.referenceNo) {
            arr = rowDto?.filter(
               item =>
                  item.referenceNo?.value === values?.referenceNo?.value &&
                  item?.item?.value === values?.item?.value
            );
         } else {
            arr = rowDto?.filter(
               item => item?.item?.value === values?.item?.value
            );
         }

         if (arr?.length > 0) {
            toast.warn('Not allowed to duplicate items');
         } else {
            // const priceStructure = values?.item?.priceStructure?.map((item) => ({
            //   ...item,
            //   value: item?.value || 0,
            //   amount: item?.amount || 0,
            // }))

            const newData = {
               ...values,
               newItem: true,
               item: { ...values?.item },
               desc: values?.item?.label,
               selectedUom: {
                  value: values?.item?.uoMId,
                  label: values?.item?.uoMName,
               },
               orderQty: '',
               basicPrice: '',
               restofQty: values?.item?.restofQty || 0,
               priceStructure: [], //priceStructure,
               netValue: 0,
               vat: 0,
               userGivenVatAmount: '',
               vatAmount: 0,
            };
            // setRowDto([...rowDto, newData]);
            const modData = [...rowDto, newData]
            const sortedItems = modData?.sort((a, b) => {
               const subHeadA = a?.shippingItemSubHead || ''; 
               const subHeadB = b?.shippingItemSubHead || ''; 
               return subHeadA.localeCompare(subHeadB);
           });
            setRowDto(sortedItems);
         }
      }
   };

   // remove single data from rowDto
   const remover = payload => {
      // const filterArr = rowDto.filter((itm) => itm?.item?.value !== payload)

      const filterArr = rowDto.filter(itm => {
         // don't filter other refference items
         if (itm?.referenceNo?.value !== payload?.referenceNo?.value) {
            return true;
         }
         // flter refference items via item id
         if (
            itm?.item?.value !== payload?.item?.value &&
            itm?.referenceNo?.value === payload?.referenceNo?.value
         ) {
            return true;
         } else {
            return false;
         }
      });
      // setRowDto([...filterArr]);
      const modData = [...filterArr]
      const sortedItems = modData?.sort((a, b) => {
         const subHeadA = a?.shippingItemSubHead || ''; 
         const subHeadB = b?.shippingItemSubHead || ''; 
         return subHeadA.localeCompare(subHeadB);
     });
       setRowDto(sortedItems);
   };

   const getItemDDL = (supplierId, refType, referenceNo) => {
      dispatch(
         getPOItemForStandradItemDDLAction(
            // singleData?.objHeaderDTO?.purchaseOrderTypeId,
            profileData?.accountId,
            selectedBusinessUnit?.value,
            singleData?.objHeaderDTO?.sbuId,
            // singleData?.objHeaderDTO?.purchaseOrganizationId,
            // singleData?.objHeaderDTO?.plantId,
            // singleData?.objHeaderDTO?.warehouseId,
            supplierId,
            refType,
            referenceNo
         )
      );
   };

   useEffect(() => {
      getRefNoDDL();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [profileData?.accountId, selectedBusinessUnit?.value]);

   // getRefNoDdlBySupplier
   const getRefNoDDL = supplierId => {
      getRefNoDdlForStandradPo(
         profileData?.accountId,
         selectedBusinessUnit?.value,
         singleData?.objHeaderDTO?.sbuId,
         singleData?.objHeaderDTO?.purchaseOrganizationId,
         singleData?.objHeaderDTO?.plantId,
         singleData?.objHeaderDTO?.warehouseId,
         singleData?.objHeaderDTO?.referenceTypeName,
         setRefNoDDL
      );
   };

   const {
      businessPartnerId,
      supplierName,
      deliveryAddress,
      purchaseOrderDate,
      lastShipmentDate,
      currencyId,
      currencyCode,
      paymentTerms,
      paymentTermsName,
      cashOrAdvancePercent,
      paymentDaysAfterDelivery,
      // incotermsName,
      // incotermsId,
      supplierReference,
      referenceDate,
      validityDate,
      otherTerms,
      freight,
      grossDiscount,
      // commission,
      othersCharge,
      supplierAddress,
      transferBusinessUnitName,
      transferBusinessUnitId,
      businessTransactionId,
      businessTransactionName,
      // transferCostCenterId,
      // transferCostCenterName,
      // transferCostElementId,
      // transferCostElementName,
      originOfSparesShip,
      descriptionShip,
      supplyLocationShip,
      leadDay,
      intTransferUnitPartnerId,
      strTransferUnitPartnerName,
   } = singleData?.objHeaderDTO;

   // let totalAmount = rowDto.reduce(acc, item) => {acc + item?.netValue},0 }

   const [transferBu, getTransferBu] = useAxiosGet();
   const [, getBuTransaction] = useAxiosGet();

   // const businessTransactionDDL = useMemo(() => {
   //   if (buTransaction?.length > 0) {
   //     let data = buTransaction.map((item) => ({
   //       ...item,
   //       value: item?.businessTransactionId,
   //       label: item?.businessTransactionName,
   //     }));
   //     return data;
   //   }
   // }, [buTransaction]);

   useEffect(() => {
      getTransferUnitSupplierDDL(
         `/procurement/PurchaseOrder/GetSupplierListDDL?AccountId=${profileData?.accountId}&UnitId=${transferBusinessUnitId}&SBUId=0`
      );
   }, [intTransferUnitPartnerId]);

   const businessUnitDDL = useMemo(() => {
      if (transferBu?.length > 0) {
         let data = transferBu.map(item => ({
            ...item,
            value: item?.businessUnitId,
            label: item?.businessUnitName,
         }));
         return data;
      }
   }, [transferBu]);

   useEffect(() => {
      getTransferBu(
         `/procurement/PurchaseOrder/TransferPoBusinessUnit_reverse?UnitId=${selectedBusinessUnit?.value}`
      );
      getBuTransaction(
         `/fino/BusinessTransaction/BusinessTransactionList?GroupId=1&BusinessUnitId=${selectedBusinessUnit?.value}`
      );
      getCostCenterDDL(
         profileData?.accountId,
         transferBusinessUnitId,
         transferBusinessUnitId && transferBusinessUnitName ? true : false,
         setCostCenterList
      );
      getCostElementDDL(
         profileData?.accountId,
         transferBusinessUnitId,
         transferBusinessUnitId && transferBusinessUnitName ? true : false,
         setCostElementList
      );
   }, [selectedBusinessUnit]);

   return (
      <>
         <Formik
            enableReinitialize={true}
            initialValues={{
               isTransfer: currencyId === 141 ? true : false,
               transferBusinessUnit:
                  transferBusinessUnitId && transferBusinessUnitName
                     ? {
                          value: transferBusinessUnitId,
                          label: transferBusinessUnitName,
                       }
                     : '',
               businessTransaction:
                  businessTransactionId && businessTransactionName
                     ? {
                          value: businessTransactionId,
                          label: businessTransactionName,
                       }
                     : '',
               supplierName: {
                  value: businessPartnerId,
                  label: supplierName,
                  supplierAddress,
               },
               othersCharge,
               deliveryAddress,
               orderDate: _dateFormatter(purchaseOrderDate),
               lastShipmentDate: _dateFormatter(lastShipmentDate),
               currency: { value: currencyId, label: currencyCode },
               paymentTerms: {
                  value: paymentTerms,
                  label: paymentTermsName,
               },
               cash: cashOrAdvancePercent,
               payDays: paymentDaysAfterDelivery,
               // incoterms: {
               //   value: incotermsId,
               //   label: incotermsName,
               // },
               supplierReference,
               referenceDate: _dateFormatter(referenceDate),
               validity: _dateFormatter(validityDate),
               otherTerms,
               referenceNo: '',
               item: '',
               deliveryDate: _dateFormatter(),
               isAllItem: false,
               // commission: commission,
               freight: freight,
               originOfSparesShip: originOfSparesShip,
               descriptionShip: descriptionShip,
               supplyLocationShip: supplyLocationShip,
               leadTimeDays: leadDay,
               transferBusinessUnitSupplier: {
                  value: intTransferUnitPartnerId,
                  label: strTransferUnitPartnerName,
               },
               discount: grossDiscount,
               // costCenter: {
               //   value: transferCostCenterId,
               //   label: transferCostCenterName,
               // },
               // costElement: {
               //   value: transferCostElementId,
               //   label: transferCostElementName,
               // },
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
               saveHandler(values, rowDto, () => {});
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
                  <Form className="form form-label-right po-label">
                     <div className="global-form">
                        {values?.supplierName?.label && (
                           <div style={{ color: 'blue' }}>
                              <b>Supplier : {values?.supplierName?.label} , </b>
                              <b>
                                 Supplier Address :{' '}
                                 {values?.supplierName?.supplierAddress}
                              </b>
                           </div>
                        )}
                        <div className="form-group row">
                           <div className="col-lg-2">
                              {/* <ISelect
                      label="Supplier Name"
                      options={supplierNameDDL || []}
                      defaultValue={values?.supplierName}
                      dependencyFunc={(currentValue) => {
                        setFieldValue('item', '')
                        // if user select without reference in landing
                        if (singleData?.objHeaderDTO?.referenceTypeId === 3) {
                          getItemDDL(currentValue, 3, 0)
                        }
                        // if user has reference, we call this action based on supplier selection and also based on reference selection in reference ddl
                        if (values?.referenceNo) {
                          getItemDDL(
                            values?.supplierName?.value,
                            singleData?.objHeaderDTO?.referenceTypeId,
                            values?.referenceNo?.value
                          )
                        }
                      }}
                      name="supplierName"
                      setFieldValue={setFieldValue}
                      errors={errors}
                      isDisabled={viewPage}
                      touched={touched}
                    /> */}
                              <label>Supplier Name</label>
                              <SearchAsyncSelect
                                 selectedValue={values?.supplierName}
                                 handleChange={valueOption => {
                                    setFieldValue(
                                       'supplierName',
                                       valueOption || ''
                                    );
                                    // setFieldValue("item", "");
                                    // setFieldValue("referenceNo", "");
                                 }}
                                 loadOptions={v => {
                                    if (v.length < 3) return [];
                                    return axios
                                       .get(
                                          `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${v}&AccountId=${profileData?.accountId}&UnitId=${selectedBusinessUnit?.value}&SBUId=${singleData?.objHeaderDTO?.sbuId}`
                                       )
                                       .then(res => {
                                          const updateList = res?.data.map(
                                             item => ({
                                                ...item,
                                             })
                                          );
                                          return updateList;
                                       });
                                 }}
                              />
                              <FormikError
                                 errors={errors}
                                 name="supplierName"
                                 touched={touched}
                              />
                           </div>
                           {inputFields?.map((item, index) =>
                              item.type === 1 ? (
                                 <div key={index} className="col-lg-2">
                                    <ISelect
                                       label={item.label}
                                       options={item.options}
                                       defaultValue={values[item.name]}
                                       name={item.name}
                                       isDisabled={
                                          viewPage || item?.name === 'incoterms' 
                                          || item?.name === 'currency'
                                       }
                                       dependencyFunc={item?.dependencyFunc}
                                       setFieldValue={setFieldValue}
                                       errors={errors}
                                       touched={touched}
                                    />
                                 </div>
                              ) : item.type === 2 ? (
                                 <div key={index} className="col-lg-2">
                                    <IInput
                                       value={values[item.name]}
                                       label={item.label}
                                       name={item.name}
                                       disabled={
                                          viewPage ||
                                          (item?.name === 'cash' &&
                                             values?.paymentTerms?.label ===
                                                'Credit')
                                       }
                                       type={item.isNum ? 'number' : 'text'}
                                    />
                                 </div>
                              ) : (
                                 item.type === 3 && (
                                    <div key={index} className="col-lg-2">
                                       <IInput
                                          value={values[item.name]}
                                          label={item.label}
                                          type="date"
                                          name={item.name}
                                          disabled={viewPage || item?.disabled}
                                       />
                                    </div>
                                 )
                              )
                           )}
                           <div className="col-lg-2">
                              <IInput
                                 value={values.freight}
                                 label="Freight/Transport"
                                 name={'freight'}
                                 type={'number'}
                              />
                           </div>
                           <div className="col-lg-2">
                              <IInput
                                 value={values.discount}
                                 label={'Gross Discount'}
                                 name={'discount'}
                                 type={'number'}
                                 onChange={e => {
                                    if (e.target.value > 0) {
                                       setFieldValue(
                                          'discount',
                                          e.target.value
                                       );
                                    } else {
                                       setFieldValue('discount', '');
                                    }
                                 }}
                              />
                           </div>
                           {/* <div className="col-lg-2">
                    <IInput
                      value={values.commission}
                      label={"Commission"}
                      name={"commission"}
                      type={"number"}
                    />
                  </div> */}
                           <div className="col-lg-2">
                              <IInput
                                 value={values?.othersCharge}
                                 label="Others Charge"
                                 name="othersCharge"
                                 type="number"
                              />
                           </div>
                           <div className="col-lg-2">
                              <IInput
                                 value={values?.leadTimeDays}
                                 label="Lead Time (Days)"
                                 name="leadTimeDays"
                                 type="number"
                              />
                           </div>
                           <div className="col-lg-2">
                              <IInput
                                 value={values?.originOfSparesShip}
                                 label="Terms"
                                 name="originOfSparesShip"
                                 type="text"
                              />
                           </div>
                           <div className="col-lg-2">
                              <IInput
                                 value={values?.descriptionShip}
                                 label="Description"
                                 name="descriptionShip"
                                 type="text"
                              />
                           </div>
                           <div className="col-lg-2">
                              <IInput
                                 value={values?.supplyLocationShip}
                                 label="Supply Location"
                                 name="supplyLocationShip"
                                 type="text"
                              />
                           </div>
                           {values?.currency?.value === 141 && (
                              <>
                                 <div className="col-lg-2">
                                    <div
                                       style={{ marginTop: '23px' }}
                                       className="d-flex align-items-center"
                                    >
                                       <span className="mr-2">Is Transfer</span>
                                       <Field
                                          type="checkbox"
                                          name="isTransfer"
                                          cchecked={values.isTransfer}
                                          disabled={values?.currency?.value === 141}
                                          onChange={e => {
                                             setFieldValue('isTransfer',e.target.checked);
                                             setFieldValue('transferBusinessUnit','');
                                             setFieldValue('costCenter', '');
                                             setFieldValue('costElement', '');
                                          }}
                                       />
                                    </div>
                                 </div>
                              </>
                           )}
                           <div className="col-lg-4">
                              <label>Other Terms</label>
                              <TextArea
                                 value={values?.otherTerms}
                                 name="otherTerms"
                                 placeholder="Other Terms"
                                 rows="3"
                                 max={1000}
                                 errors={errors}
                                 touched={touched}
                              />
                           </div>
                           {values?.isTransfer ? (
                              <>
                                 <div className="col-lg-2">
                                    <NewSelect
                                       label="Transfer Business unit"
                                       options={businessUnitDDL}
                                       value={values?.transferBusinessUnit}
                                       name="transferBusinessUnit"
                                       isDisabled={values?.isTransfer}
                                       onChange={valueOption => {
                                          if (valueOption) {
                                             setFieldValue(
                                                'transferBusinessUnit',
                                                valueOption
                                             );
                                             getTransferUnitSupplierDDL(
                                                `/procurement/PurchaseOrder/GetSupplierListDDL?AccountId=${profileData?.accountId}&UnitId=${valueOption?.value}&SBUId=0`
                                             );
                                          } else {
                                             setFieldValue(
                                                'transferBusinessUnit',
                                                ''
                                             );
                                             setFieldValue(
                                                'transferBusinessUnitSupplier',
                                                ''
                                             );
                                             setTransferUnitSupplierDDL([]);
                                          }
                                       }}
                                       errors={errors}
                                       touched={touched}
                                    />
                                 </div>

                                 <div className="col-lg-2">
                                    <NewSelect
                                       label="Transfer Business Unit Supplier"
                                       options={transferUnitSupplierDDL || []}
                                       value={values?.transferBusinessUnitSupplier}
                                       name="transferBusinessUnitSupplier"
                                       isDisabled={values?.isTransfer}
                                       onChange={valueOption => {
                                          setFieldValue('transferBusinessUnitSupplier',valueOption);
                                       }}
                                       errors={errors}
                                       touched={touched}
                                    />
                                 </div>
                              </>
                           ) : <></>}

                           {/* <div className="col-lg-2">
                    <NewSelect
                      name="costCenter"
                      options={costCenterList}
                      value={values?.costCenter}
                      onChange={(valueOption) => {
                        setFieldValue("costCenter", valueOption);
                      }}
                      label="Cost Center"
                      placeholder="Cost Center"
                      errors={errors}
                      touched={touched}
                      isDisabled={!values?.isTransfer}
                    />
                  </div> */}
                           {/* <div className="col-lg-2">
                    <NewSelect
                      name="costElement"
                      options={costElementList}
                      value={values?.costElement}
                      onChange={(valueOption) => {
                        setFieldValue("costElement", valueOption);
                      }}
                      label="Cost Element"
                      placeholder="Cost Element"
                      errors={errors}
                      touched={touched}
                      isDisabled={!values?.isTransfer}
                    />
                  </div> */}
                           {/* <div className="col-lg-2">
                    <ISelect
                      label="Business Transaction"
                      options={businessTransactionDDL}
                      value={values?.businessTransaction}
                      name="businessTransaction"
                      isDisabled={!values?.isTransfer}
                      setFieldValue={setFieldValue}
                      errors={errors}
                      touched={touched}
                    />
                  </div> */}
                        </div>
                        {!viewPage && (
                           <div className="form-group row">
                              <div className="col-lg-2">
                                 <ISelect
                                    label="Reference No"
                                    options={refNoDDL}
                                    value={values?.referenceNo}
                                    isDisabled={
                                       singleData?.objHeaderDTO
                                          ?.referenceTypeId === 3
                                       // || !values?.supplierName
                                    }
                                    name="referenceNo"
                                    dependencyFunc={(
                                       value,
                                       allValues,
                                       setFieldValue
                                    ) => {
                                       setFieldValue('item', '');
                                       if (
                                          singleData?.objHeaderDTO
                                             ?.referenceTypeId
                                       ) {
                                          getItemDDL(
                                             values?.supplierName?.value,
                                             singleData?.objHeaderDTO
                                                ?.referenceTypeId,
                                             value
                                          );
                                       }
                                    }}
                                    setFieldValue={setFieldValue}
                                    errors={errors}
                                    touched={touched}
                                 />
                              </div>
                              {/* {rowDto.reduce(acc, item) => {acc + item?.netValue},0 } */}
                              {singleData?.objHeaderDTO?.referenceTypeId ===
                              3 ? (
                                 <div className="col-lg-4">
                                    <label>Item</label>
                                    <SearchAsyncSelect
                                       selectedValue={values.item}
                                       handleChange={valueOption => {
                                          setFieldValue('item', valueOption);
                                       }}
                                       loadOptions={v => {
                                          return axios
                                             .get(
                                                `/procurement/PurchaseOrderItemDDL/StandardPurchaseOrderItemList?ItemTypeId=0&OrderTypeId=${
                                                   singleData?.objHeaderDTO
                                                      ?.purchaseOrderTypeId
                                                }&AccountId=${
                                                   profileData?.accountId
                                                }&BusinessUnitId=${
                                                   selectedBusinessUnit?.value
                                                }&SbuId=${
                                                   singleData?.objHeaderDTO
                                                      ?.sbuId
                                                }&PurchaseOrgId=${
                                                   singleData?.objHeaderDTO
                                                      ?.purchaseOrganizationId
                                                }&PlantId=${
                                                   singleData?.objHeaderDTO
                                                      ?.plantId
                                                }&WearhouseId=${
                                                   singleData?.objHeaderDTO
                                                      ?.warehouseId
                                                }&RefTypeId=${
                                                   singleData?.objHeaderDTO
                                                      ?.referenceTypeId
                                                }&RefNoId=${0}&searchTerm=${v}`
                                             )
                                             .then(res => {
                                                const updateList = res?.data.map(
                                                   item => ({
                                                      ...item,
                                                   })
                                                );
                                                return updateList;
                                             });
                                       }}
                                    />
                                    <FormikError
                                       errors={errors}
                                       name="item"
                                       touched={touched}
                                    />
                                 </div>
                              ) : (
                                 <div className="col-lg-4">
                                    <ISelect
                                       label="Item"
                                       isDisabled={
                                          singleData?.objHeaderDTO
                                             ?.referenceTypeId === 3
                                             ? values.isAllItem
                                             : !values.referenceNo ||
                                               values.isAllItem
                                       }
                                       options={poItemsDDL}
                                       value={values.item}
                                       name="item"
                                       setFieldValue={setFieldValue}
                                       errors={errors}
                                       touched={touched}
                                    />
                                 </div>
                              )}

                              {singleData?.objHeaderDTO?.referenceTypeId !==
                                 3 && (
                                 <div className="col-lg-1">
                                    <Field
                                       name={values.isAllItem}
                                       component={() => (
                                          <input
                                             style={{ marginTop: '25px' }}
                                             id="poIsAllItem"
                                             type="checkbox"
                                             className="mx-2"
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
                                       disabled={viewPage}
                                    />
                                    <label
                                       style={{
                                          position: 'absolute',
                                          top: '20px',
                                       }}
                                    >
                                       All Item
                                    </label>
                                 </div>
                              )}

                              <div className="col-lg-1">
                                 <button
                                    type="button"
                                    disabled={
                                       viewPage ||
                                       singleData?.objHeaderDTO
                                          ?.referenceTypeId === 3
                                          ? !values.isAllItem
                                             ? !values.item
                                             : false
                                          : !values.isAllItem
                                          ? !values.referenceNo || !values.item
                                          : !values.referenceNo
                                    }
                                    style={{
                                       marginTop: '20px',
                                       marginLeft:
                                          singleData?.objHeaderDTO
                                             ?.referenceTypeId === 3
                                             ? '0px'
                                             : '-20px',
                                    }}
                                    className="btn btn-primary"
                                    onClick={() => {
                                       addRowDtoData(poItemsDDL, values);
                                       if (
                                          singleData?.objHeaderDTO
                                             ?.referenceTypeId === 3
                                       ) {
                                          setFieldValue('isAllItem', false);
                                       }
                                    }}
                                 >
                                    Add
                                 </button>
                              </div>
                              <div
                                 style={{ transform: 'translateY(26px)' }}
                                 className="col-lg"
                              >
                                 <TotalNetAmount
                                    rowDto={rowDto}
                                    values={values}
                                 />
                              </div>
                           </div>
                        )}
                     </div>

                     {/* RowDto table */}
                     <RowDtoTable
                        // detect user is selected without refference or not
                        isWithoutRef={
                           singleData?.objHeaderDTO?.referenceTypeId !== 3
                        }
                        remover={remover}
                        rowDto={rowDto}
                        setRowDto={setRowDto}
                        uomDDL={uomDDL}
                        values={values}
                        viewPage={viewPage}
                     />

                     <button
                        type="submit"
                        style={{ display: 'none' }}
                        ref={btnRef}
                        onSubmit={() => handleSubmit()}
                     ></button>

                     <button
                        type="reset"
                        style={{ display: 'none' }}
                        ref={resetBtnRef}
                        onSubmit={() => resetForm({})}
                     ></button>
                  </Form>
               </>
            )}
         </Formik>
      </>
   );
}
