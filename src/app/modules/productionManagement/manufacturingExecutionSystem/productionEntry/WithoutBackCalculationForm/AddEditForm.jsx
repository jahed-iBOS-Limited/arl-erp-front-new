/*

Dont Touch Any Code without permission by Mamun Ahmed (Backend)

*/

import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import IForm from '../../../../_helper/_form';
import Loading from '../../../../_helper/_loading';
import { _todayDate } from '../../../../_helper/_todayDate';
import {
  createProductionEntry,
  editProductionEntry,
  getPlantNameDDL,
  getShiftDDL,
  getSingleDataById,
} from '../helper';
import Form from './WithoutBackCalculationForm';

let initData = {
  id: undefined,
  plantName: '',
  shopFloor: '',
  productionOrder: '',
  orderQty: '',
  dteProductionDate: _todayDate(),
  shift: '',
  itemName: '',
  workcenterName: '',
  goodQty: '',
  materialCost: '',
  overheadCost: '',
  goodReceivedQty: '',
  othersOutputItem: '',
  othersOutputQty: '',
  checkOutputItem: false,
  isLastProduction: false,
};

export default function WithOutBackCalculationForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [plantNameDDL, setPlantNameDDL] = useState([]);
  const [shiftDDL, setShiftDDL] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [singleData, setSingleData] = useState({});
  const [rowDataForAddConsumption, setRowDataForAddConsumption] = useState([]);
  console.log('rowDataForAddConsumption', rowDataForAddConsumption);
  const params = useParams();
  const location = useLocation();
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const isBackCalculationValue = location?.state?.data?.isBackCalculation;

  const saveHandler = (values, cb) => {
    if (values && profileData.accountId && selectedBusinessUnit) {
      if (params?.id) {
        const objRowData = rowData?.map((item, index) => {
          if (item?.uomId) {
            return {
              productionRowId: item?.productionRowId,
              outputItemName: item?.itemName,
              outputItemQty: +item?.numQuantity,
              uomId: +item?.uomId,
              itemId: +item?.itemId,
            };
          } else {
            return {
              productionRowId: item?.productionRowId,
              outputItemName: item?.itemName,
              outputItemQty: +item?.numQuantity,
            };
          }
        });
        const payload = {
          editHeader: {
            productionId: +params.id,
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            plantId: values?.plantName?.value,
            actionBy: profileData?.userId,
            shiftId: values?.shift?.value,
            productionDate: values?.dteProductionDate,
          },
          editRow:
            values?.checkOutputItem === true
              ? [
                  {
                    productionRowId: values?.productionRowId,
                    outputItemName: values?.outputItemName,
                    outputItemQty: +values?.goodQty,
                  },
                  ...objRowData,
                ]
              : [
                  {
                    productionRowId: values?.productionRowId,
                    outputItemName: values?.outputItemName,
                    outputItemQty: +values?.goodQty,
                  },
                ],
        };
        editProductionEntry(payload, setDisabled);
      } else {
        const objRowData = rowData.map((item) => {
          return {
            productionOrderId: item.productionOrderId,
            productionOrderCode: item.productionOrderCode,
            itemId: item.itemId,
            itemName: item.itemName,
            isMainItem: false,
            uomid: item?.uomid,
            uomname: item?.uomName,
            numQuantity: item?.numQuantity,
            approvedintItemId: item?.approvedItemId,
            numApprovedQuantity: item?.numApprovedQuantity,
            ...(isBackCalculationValue === 2
              ? {
                  materialCost: 1,
                  overheadCost: 1,
                }
              : {}),
          };
        });

        const payload = {
          objHeader: {
            dteProductionDate: values?.dteProductionDate,
            intShiftId: values?.shift?.value,
            productionCode: 'string',
            intAccountId: profileData?.accountId,
            intBusinessUnitId: selectedBusinessUnit?.value,
            intPlantId: values?.plantName?.value,
            intItemId: values?.productionOrder?.itemId,
            strItemName: values?.productionOrder?.itemName,
            isMainItem: true,
            intShopFloorId: values?.productionOrder?.shopFloorId,
            strShopFloorName: values?.productionOrder?.shopFloorName,
            intWorkCenterId: values?.productionOrder?.workCenterId,
            bomId: values?.productionOrder?.bomId,
            strWorkCenterName: values?.productionOrder?.workCenterName,
            intApproveBy: 0,
            intActionBy: profileData?.userId,
          },
          objRowList:
            values?.checkOutputItem === true
              ? [
                  {
                    productionOrderId: values?.productionOrder?.value,
                    productionOrderCode: values?.productionOrder?.label,
                    itemId: values?.productionOrder?.itemId,
                    approvedItemId: values?.productionOrder?.itemId,
                    itemName: values?.productionOrder?.itemName,
                    isMainItem: true,
                    uomid: values?.productionOrder?.uomId,
                    uomname: values?.productionOrder?.uomName,
                    numQuantity: +values?.goodQty,
                    ...(isBackCalculationValue === 2
                      ? {
                          materialCost: +values?.materialCost,
                          overheadCost: +values?.overheadCost,
                          isLastProduction: values?.isLastProduction,
                        }
                      : {}),
                    numApprovedQuantity: 0,
                  },
                  ...objRowData,
                ]
              : [
                  {
                    productionOrderId: values?.productionOrder?.value,
                    productionOrderCode: values?.productionOrder?.label,
                    itemId: values?.productionOrder?.itemId,
                    itemName: values?.productionOrder?.itemName,
                    isMainItem: true,
                    uomid: values?.productionOrder?.uomId,
                    uomname: values?.productionOrder?.uomName,
                    numQuantity: +values?.goodQty,
                    ...(isBackCalculationValue === 2
                      ? {
                          materialCost: +values?.materialCost,
                          overheadCost: +values?.overheadCost,
                          isLastProduction: values?.isLastProduction,
                        }
                      : {}),
                    approvedintItemId: values?.productionOrder?.itemId,
                    numApprovedQuantity: 0,
                  },
                ],
          bomItem:
            isBackCalculationValue === 2 && rowDataForAddConsumption?.length > 0
              ? rowDataForAddConsumption?.map((item) => ({
                  itemId: item?.itemId || 0,
                  itemCode: item?.itemCode || '',
                  itemName: item?.itemName || '',
                  numQuantity: +item?.requiredQuantity || 0,
                  numIssueQty: +item?.numIssueQuantity || 0,
                  numRate: +item?.numStockRateByDate || 0,
                  isLastProdcution: values?.isLastProduction || false,
                }))
              : [],
        };

        const isOutputZero = objRowData.every((itm) => itm?.numQuantity > 0);
        if (isOutputZero && payload?.objRowList?.length > 0) {
          if (
            !values?.plantName ||
            !values?.productionOrder ||
            !values?.shift ||
            !values?.goodQty
          ) {
            return toast.warn('All Field Required');
          }
          if (isBackCalculationValue === 2 && !values?.materialCost) {
            return toast.warn('Please add consumption first!');
          }
          createProductionEntry(
            payload,
            cb,
            values?.checkOutputItem,
            setDisabled
          );
        } else {
          toast.warn("Output Quantity For 'Item Name' Must Be Greater Than 0");
        }
      }
    }
  };

  useEffect(() => {
    getPlantNameDDL(
      profileData.userId,
      profileData.accountId,
      selectedBusinessUnit.value,
      setPlantNameDDL
    );
  }, [profileData.accountId, selectedBusinessUnit.value]);

  useEffect(() => {
    getShiftDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setShiftDDL
    );
  }, [profileData.accountId, selectedBusinessUnit.value]);

  useEffect(() => {
    getSingleDataById(
      params.id,
      profileData.accountId,
      selectedBusinessUnit.value,
      setSingleData,
      setRowData
    );
  }, [params.id, profileData.accountId, selectedBusinessUnit.value]);

  const dataHandler = (name, value, sl) => {
    const xData = [...rowData];
    xData[sl][name] = value;
    setRowData([...xData]);
  };

  return (
    <IForm
      title="Create Production Entry"
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={params?.id ? singleData : initData}
        saveHandler={saveHandler}
        plantNameDDL={plantNameDDL}
        shiftDDL={shiftDDL}
        rowData={rowData}
        setRowData={setRowData}
        isEdit={params?.id ? true : false}
        dataHandler={dataHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        rowDataForAddConsumption={rowDataForAddConsumption}
        setRowDataForAddConsumption={setRowDataForAddConsumption}
      />
    </IForm>
  );
}
