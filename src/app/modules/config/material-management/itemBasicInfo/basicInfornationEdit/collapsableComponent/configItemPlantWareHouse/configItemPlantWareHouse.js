/* eslint-disable no-unused-vars */
import Axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import {
   Card,
   CardBody,
   CardHeader,
   CardHeaderToolbar,
} from '../../../../../../../../_metronic/_partials/controls';
import Form from './form.js';

import { shallowEqual, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import shortid from 'shortid';
import { isUniq } from '../../../../../../_helper/uniqChecker';

const initData = {
   plant: '',
   warehouse: '',
   inventoryLocation: '',
   numGrossWeight: '',
   numNetWeight: '',
   baseUom: '',
   isMultipleUom: false,
   alternateUom: '',
   conversionBaseUom: '',
   binNumber: '',
   minStockQty: '',
   safetyStockQty: '',
   maxStockQty: '',
   reOrderLevel: '',
   reOrderQty: '',
   avgDailyConsumption: '',
   maxLeadDays: '',
   minLeadDays: '',
   abc: '',
   ved: '',
   fns: '',
   shippingItemSubHead: '',
};

export default function ConfigItemPlantWareHouse({ isViewPage, onSuccess }) {
   const { id } = useParams();
   const [isDisabled, setDisabled] = useState(true);

   const location = useLocation();

   // get user profile data from store
   const profileData = useSelector(state => {
      return state.authData.profileData;
   }, shallowEqual);

   // get selected business unit from store
   const selectedBusinessUnit = useSelector(state => {
      return state.authData.selectedBusinessUnit;
   }, shallowEqual);

   const [rowDto, setRowDto] = useState([]);
   const [defaultRowDto, setDefaultRowDto] = useState([]);
   const [isConfigItemPlant, setIsConfigItemPlant] = useState(false);
   const [singleInitData, setSingleInitData] = useState('');
   const [isEdit, setIsEdit] = useState(false);

   useEffect(() => {
      if (id) {
         getItemPlantWarehouseInfoByItemId(
            profileData?.accountId,
            selectedBusinessUnit?.value,
            id
         );
      }
   }, [profileData, selectedBusinessUnit, id]);

   const getItemPlantWarehouseInfoByItemId = async (accid, buid, id) => {
      try {
         const res = await Axios.get(
            `/wms/ItemPlantWarehouse/GetItemPlantWarehouseInfoByItemId?accountId=${accid}&businessUnitId=${buid}&itemID=${id}`
         );
         const { data, status } = res;
         if (status === 200 && data) {
            if (
               data[0]?.getItemPlantWHDTO?.length > 0 ||
               data[0]?.createItemUOMConvertionDTO?.length > 0
            ) {
               const singleObj = {
                  plant: {
                     value: data[0]?.getItemPlantWHDTO[0]?.plantId,
                     label: data[0]?.getItemPlantWHDTO[0]?.plantName,
                  },
                  numGrossWeight:
                     data[0]?.getItemPlantWarehouseNetGrossWeightDTO
                        ?.numGrossWeight,
                  numNetWeight:
                     data[0]?.getItemPlantWarehouseNetGrossWeightDTO
                        ?.numNetWeight,
               };
               setSingleInitData(singleObj);
               setIsConfigItemPlant(true);
               setIsEdit(true);
               setDefaultRowDto(data[0]?.getItemPlantWHDTO);
               setRowDto(data[0]?.createItemUOMConvertionDTO);
            }
         }
      } catch (error) {}
   };

   // save business unit data to DB
   const saveData = async (values, cb) => {
      if (values && selectedBusinessUnit && profileData) {
         const { accountId, userId: actionBy } = profileData;
         const {
            value: businessunitid,
            label: businessunitLabel,
         } = selectedBusinessUnit;

         if (isConfigItemPlant === true) {
            if (defaultRowDto.length > 0) {
               const editDefaultRowDto = defaultRowDto.map(itm => {
                  return {
                     configId: itm?.configId || 0,
                     itemId: +id,
                     binNumber: itm?.binNumber,
                     itemName: location?.state?.item?.itemName,
                     accountId: accountId,
                     businessUnitId: businessunitid,
                     businessUnitName: businessunitLabel,
                     plantId: itm?.plantId,
                     plantName: itm?.plantName,
                     warehouseId: itm?.warehouseId,
                     wareHouseName: itm?.wareHouseName,
                     inventoryLocationId: itm?.inventoryLocationId,
                     baseUomid: values?.baseUom?.value,
                     baseUom: values?.baseUom?.label,
                     actionBy: actionBy,
                     averageDailyConsumption: itm?.averageDailyConsumption || 0,
                     maximumQuantity: itm?.maximumQuantity || 0,
                     maxLeadDays: itm?.maxLeadDays || 0,
                     minimumStockQuantity: itm?.minimumStockQuantity || 0,
                     minLeadDays: itm?.minLeadDays || 0,
                     abc: itm?.abc || 0,
                     ved: itm?.ved || 0,
                     fns: itm?.fns || 0,
                     shippingItemSubHead: itm?.shippingItemSubHead || '',
                     reorderLevel: itm?.reorderLevel || 0,
                     reorderQuantity: itm?.reorderQuantity || 0,
                     safetyStockQuantity: itm?.safetyStockQuantity || 0,
                  };
               });
               const editConfigPlantWarehouseData = {
                  isMultipleUom: values?.isMultipleUom || false,
                  itemId: +id,
                  itemName: location?.state?.item?.itemName,
                  accountId: accountId,
                  businessUnitId: businessunitid,
                  uomId: values?.baseUom?.value,
                  actionBy: actionBy,
                  editItemPlantWHDTO: editDefaultRowDto,
                  editItemUOMConvertionDTO: rowDto,
                  grossWeight: +values?.numGrossWeight || 0,
                  netWeight: +values?.numNetWeight || 0,
               };
               try {
                  window.editData = editConfigPlantWarehouseData;
                  setDisabled(true);
                  const res = await Axios.put(
                     '/wms/ItemPlantWarehouse/EditConfigItemPlantWarehouse',
                     editConfigPlantWarehouseData
                  );

                  // cb();
                  getItemPlantWarehouseInfoByItemId(
                     profileData?.accountId,
                     selectedBusinessUnit?.value,
                     id
                  );
                  toast.success(res.data?.message || 'Submitted successfully', {
                     toastId: shortid(),
                  });
                  setDisabled(false);
                  if (onSuccess) onSuccess();
               } catch (error) {
                  toast.error(error?.response?.data?.message, {
                     toastId: shortid(),
                  });
               }
               setDisabled(false);
            }
         } else {
            // create part
            const defaultObjRow = defaultRowDto.map(itm => {
               return {
                  itemName: location?.state?.item?.itemName,
                  accountId: accountId,
                  businessUnitId: businessunitid,
                  businessUnitName: businessunitLabel,
                  plantId: itm?.plantId,
                  plantName: itm?.plantName,
                  warehouseId: itm?.warehouseId,
                  wareHouseName: itm?.wareHouseName,
                  inventoryLocationId: itm?.inventoryLocationId,
                  inventoryLocationName: itm?.inventoryLocationName,
                  baseUomid: values?.baseUom?.value,
                  baseUom: values?.baseUom?.label,
                  binNumber: itm?.binNumber,
                  shippingItemSubHead: itm?.shippingItemSubHead,
               };
            });
            const filterDefaultObjRow = [
               ...defaultObjRow.map((itm, i) => {
                  return {
                     itemName: location?.state?.item?.itemName,
                     accountId: accountId,
                     businessUnitId: businessunitid,
                     businessUnitName: businessunitLabel,
                     plantId: itm?.plantId,
                     plantName: itm?.plantName,
                     warehouseId: itm?.warehouseId,
                     wareHouseName: itm?.wareHouseName,
                     inventoryLocationId: itm?.inventoryLocationId,
                     baseUomid: values?.baseUom?.value,
                     baseUom: values?.baseUom?.label,
                     binNumber: itm?.binNumber,
                     shippingItemSubHead: itm?.shippingItemSubHead,
                  };
               }),
            ];
            const objRow = rowDto.map(itm => {
               return {
                  baseUomId: itm?.baseUomId,
                  baseUomName: itm?.baseUomName,
                  convertedUom: itm?.convertedUom || itm?.baseUomId,
                  convertedUomName: itm?.convertedUomName || itm?.baseUomName,
                  numConversionRate: itm?.numConversionRate || 1,
                  actionBy: actionBy,
               };
            });
            const configPlantWarehouseData = {
               isMultipleUom: values?.isMultipleUom || false,
               itemId: +id,
               itemName: location?.state?.item?.itemName,
               accountId: accountId,
               businessUnitId: businessunitid,
               grossWeight: +values?.numGrossWeight || 0,
               netWeight: +values?.numNetWeight || 0,
               uomId: values?.baseUom?.value,
               actionBy: actionBy,
               createItemPlantWHDTO: filterDefaultObjRow,
               createItemUOMConvertionDTO: objRow,
            };
            try {
               console.log('create data', configPlantWarehouseData);
               window.createData = configPlantWarehouseData;
               setDisabled(true);
               const res = await Axios.post(
                  '/wms/ItemPlantWarehouse/CreateConfigItemPlantWarehouse',
                  configPlantWarehouseData
               );

               // if (res.status === 200) {
               //   setRowDto([]);
               //   setDefaultRowDto([]);
               // }
               // cb(initData);
               getItemPlantWarehouseInfoByItemId(
                  profileData?.accountId,
                  selectedBusinessUnit?.value,
                  id
               );
               toast.success(res.data?.message || 'Submitted successfully', {
                  toastId: shortid(),
               });
               setDisabled(false);
               if (onSuccess) onSuccess();
            } catch (error) {
               toast.error(error?.response?.data?.message, {
                  toastId: shortid(),
               });
               setDisabled(false);
            }
         }
      } else {
         toast.error('Submit Unsuccesful!', { toastId: shortid() });
      }
   };

   const baseSetter = payload => {
      if (isUniq('convertedUom', payload?.convertedUom, rowDto)) {
         const { accountId, userId: actionBy } = profileData;
         setRowDto([
            {
               ...payload,
               actionBy: actionBy,
            },
         ]);
      }
   };

   const setter = payload => {
      if (isUniq('convertedUom', payload?.convertedUom, rowDto)) {
         const { accountId, userId: actionBy } = profileData;
         setRowDto([
            ...rowDto,
            {
               ...payload,
               actionBy: actionBy,
            },
         ]);
      }
   };

   const defaultSetter = payload => {
      // if (
      //   isUniq(
      //     "inventoryLocationId",
      //     payload.inventoryLocationId,
      //     defaultRowDto
      //   )
      //   //  &&
      //   // isUniq("warehouseId", payload.warehouseId, defaultRowDto)
      // )
      const isExists = defaultRowDto.find(
         itm =>
            itm.warehouseId === payload.warehouseId &&
            itm?.plantId === payload?.plantId
      );

      if (isExists) {
         return toast.error('Warehouse & Plant already exists !', {
            toastId: shortid(),
         });
      }

      {
         const { accountId, userId: actionBy } = profileData;
         const {
            value: businessunitid,
            label: businessunitLabel,
         } = selectedBusinessUnit;
         setDefaultRowDto([
            // ...defaultRowDto.filter(
            //   (itm) => itm.warehouseId !== payload.warehouseId
            // ),
            ...defaultRowDto,
            {
               itemName: location?.state?.itemName,
               accountId: accountId,
               businessUnitId: businessunitid,
               businessUnitName: businessunitLabel,
               ...payload,
            },
         ]);
      }
   };

   const remover = payload => {
      const filterArr = rowDto.filter(itm => itm.convertedUom !== payload);
      setRowDto(filterArr);
   };
   const defaultRemover = payload => {
      const filterArr = defaultRowDto.filter((itm, index) => payload !== index);
      setDefaultRowDto(filterArr);
   };

   const saveBtnRef = useRef();
   const saveDataClick = () => {
      if (defaultRowDto.length > 0 && saveBtnRef && saveBtnRef.current) {
         saveBtnRef.current.click();
      } else {
         toast.error('Plant & WearHouse empty !', { toastId: shortid() });
      }
   };

   const resetBtnRef = useRef();
   const resetBtnClick = () => {
      if (resetBtnRef && resetBtnRef.current) {
         resetBtnRef.current.click();
      }
   };

   const disableHandler = cond => {
      setDisabled(cond);
   };

   return (
      <Card>
         <CardHeader
            title={
               isViewPage
                  ? 'Config Item Plant Warehouse'
                  : 'Edit Config Item Plant Warehouse'
            }
         >
            <CardHeaderToolbar>
               {!isViewPage && (
                  <>
                     <button
                        type="reset"
                        onClick={resetBtnClick}
                        ref={resetBtnRef}
                        className="btn btn-light ml-2"
                     >
                        <i className="fa fa-redo"></i>
                        Reset
                     </button>
                     <button
                        type="submit"
                        className="btn btn-primary ml-2"
                        onClick={saveDataClick}
                        ref={saveBtnRef}
                        disabled={isDisabled}
                     >
                        Save
                     </button>
                  </>
               )}
            </CardHeaderToolbar>
         </CardHeader>
         <CardBody>
            <Form
               isViewPage={isViewPage}
               productData={singleInitData || initData}
               saveBtnRef={saveBtnRef}
               saveData={saveData}
               resetBtnRef={resetBtnRef}
               businessUnitName={false}
               businessUnitCode={true}
               isDisabledCode={true}
               disableHandler={disableHandler}
               setter={setter}
               defaultSetter={defaultSetter}
               remover={remover}
               defaultRemover={defaultRemover}
               selectedBusinessUnit={selectedBusinessUnit}
               accountId={profileData.accountId}
               rowDto={rowDto}
               defaultRowDto={defaultRowDto}
               setDefaultRowDto={setDefaultRowDto}
               userId={profileData?.userId}
               baseSetter={baseSetter}
               isEdit={isEdit}
            />
         </CardBody>
      </Card>
   );
}
