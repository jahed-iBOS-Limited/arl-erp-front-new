import axios from 'axios';

export const IssueReturnHandler = async ({
  response,
  values,
  rowData,
  singleData,
  profileData,
  selectedBusinessUnit,
}) => {
  let mainAndLastProductionItem = rowData?.filter(
    (item) => item?.isMain && item.isLastProduction,
  );

  if (mainAndLastProductionItem?.length) {
    let resData = await axios.get(
      `/mes/ProductionEntry/GetItemListByLastProdctionorOrderId?AccountId=1&BusinessUnitId=${selectedBusinessUnit?.value}&ProductionOrderId=${singleData?.productionOrder?.value}&PlantId=${singleData?.plantId}&WareHouseId=${values?.wareHouse?.value}`,
    );

    console.log('resData', resData);

    if (!resData?.data?.length) {
      return;
    }

    let restQtyGreaterThanZeroRowData = resData?.data?.filter(
      (item) => item?.restQty > 0,
    );

    if (!restQtyGreaterThanZeroRowData?.length) {
      return;
    }

    const payload = {
      objHeader: {
        transactionGroupId: 14,
        transactionGroupName: 'Issue Return',
        transactionTypeId: 7,
        transactionTypeName: 'Receive For Issue Return',
        referenceTypeId: 7,
        referenceTypeName: 'Inventory Request',
        referenceId: singleData?.productionId,
        referenceCode: singleData?.productionOrder?.label,
        accountId: profileData?.accountId,
        accountName: profileData?.accountName,
        businessUnitId: selectedBusinessUnit?.value,
        businessUnitName: selectedBusinessUnit?.label,
        sbuId: values?.sbu?.value,
        sbuName: values?.sbu?.label,
        plantId: values?.plantName?.value,
        plantName: values?.plantName?.label,
        warehouseId: values?.wareHouse?.value,
        warehouseName: values?.wareHouse?.label,
        businessPartnerId: 0,
        parsonnelId: 0,
        costCenterId: -1,
        costCenterCode: '',
        costCenterName: '',
        projectId: -1,
        projectCode: '',
        projectName: '',
        comments: '',
        actionBy: profileData?.userId,
        documentId: '',
        businessPartnerName: '',
        gateEntryNo: 0,
        challan: '1',
        challanDateTime: '2023-10-30',
        vatChallan: 0,
        vatAmount: 0,
        grossDiscount: 0,
        freight: 0,
        commission: 0,
        shipmentId: 0,
        othersCharge: 0,
      },
      objRow:
        restQtyGreaterThanZeroRowData?.length > 0
          ? restQtyGreaterThanZeroRowData?.map((item) => ({
              itemId: item?.itemId,
              itemName: item?.itemName,
              uoMid: item?.baseUomid,
              uoMname: item?.baseUom,
              numTransactionQuantity: item?.restQty,
              monTransactionValue: item?.monTransactionValue,
              inventoryLocationId: item?.inventoryLocationId,
              inventoryLocationName: item?.inventoryLocationName,
              batchId: 0,
              batchNumber: '',
              inventoryStockTypeId: 1,
              inventoryStockTypeName: 'Open Stock',
              strBinNo: item?.binNumber,
              vatAmount: 0,
              discount: 0,
            }))
          : [],
      objtransfer: {},
    };

    await axios.post(
      `/wms/InventoryTransaction/CreateInvTransectionForIssueProduction`,
      payload,
    );
  }
};
