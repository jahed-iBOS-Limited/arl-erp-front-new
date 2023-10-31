import axios from "axios";

export const IssueReturnHandler = async ({
  response,
  values,
  rowData,
  singleData,
  profileData,
  selectedBusinessUnit,
}) => {
  console.log("response", response);
  console.log("values", values);
  console.log("rowData", rowData);

  let mainAndLastProductionItem = rowData?.filter(
    (item) => item?.isMain && item.isLastProduction
  );

  if (mainAndLastProductionItem) {
  }

  const payload = {
    objHeader: {
      transactionGroupId: 14,
      transactionGroupName: "Issue Return",
      transactionTypeId: 7,
      transactionTypeName: "Receive For Issue Return",
      referenceTypeId: 7,
      referenceTypeName: "Inventory Request",
      referenceId: 243569,
      referenceCode: "IR-HRML-OCT23-360",
      accountId: 1,
      accountName: "Akij Resource Limited",
      businessUnitId: 188,
      businessUnitName: "Hashem Rice Mills Ltd.",
      sbuId: 86,
      sbuName: "Hashem Rice Mills Ltd.",
      plantId: 113,
      plantName: "Hashem Rice Mills",
      warehouseId: 10260,
      warehouseName: "Hasem Rice Mill",
      businessPartnerId: 521808,
      parsonnelId: 0,
      costCenterId: -1,
      costCenterCode: "",
      costCenterName: "",
      projectId: -1,
      projectCode: "",
      projectName: "",
      comments: "",
      actionBy: 509697,
      documentId: "",
      businessPartnerName: "Md. Roni Shekh",
      gateEntryNo: 0,
      challan: "1",
      challanDateTime: "2023-10-30",
      vatChallan: 0,
      vatAmount: 0,
      grossDiscount: 0,
      freight: 0,
      commission: 0,
      shipmentId: 0,
      othersCharge: 0,
    },
    objRow: [
      {
        itemId: 92024,
        itemName: "Silicon Gum",
        uoMid: 107,
        uoMname: "Pices",
        numTransactionQuantity: 12,
        monTransactionValue: 0,
        inventoryLocationId: 10274,
        inventoryLocationName: "Spare Stock",
        batchId: 0,
        batchNumber: "",
        inventoryStockTypeId: 1,
        inventoryStockTypeName: "Open Stock",
        strBinNo: "",
        vatAmount: 0,
        discount: 0,
      },
    ],
    objtransfer: {},
  };

  const res = await axios.post(
    `/wms/InventoryTransaction/CreateInvTransectionForIssue`
  );
};
