/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/react-in-jsx-scope */
import { Table } from "antd";

export const saveHandlerPayload = (
  values,
  payload,
  rfqDetail,
  suppilerStatement,
  placePartnerList,
  rowData
) => {
  if (values?.csType?.value === 0) {
    rowData?.map((row) => {
      payload.push({
        requestForQuotationId: rfqDetail?.requestForQuotationId,
        partnerRfqId: row?.partnerRfqId,
        rowId: row?.itemWiseCode, // have to check if need
        itemId: row?.itemId,
        takenQuantity: +row?.takenQuantity || 0,
        rate: +row?.supplierRate || 0,
        approvalNotes: row?.note || "",
        portList:
          rfqDetail?.purchaseOrganizationName === "Foreign Procurement"
            ? [...row?.supplierInfo?.portList]
            : [],
      });
    });
    return payload;
  } else {
    const getPortList = (portList) => {
      let portListDS = [];
      portList?.map((port) => {
        portListDS.push({
          id: port?.id || 0,
          portId: port?.portId || 0,
          portName: port?.portName || "",
          rate: port?.rate || 0,
          freightCharge: port?.freightCharge || 0,
          portReamrks: port?.portReamrks || "",
          conversionRate: port?.conversionRate || 0,
          convertedAmount: port?.convertedAmount || 0,
        });
      });
      return portListDS;
    };
    let supplierList = [];
    // eslint-disable-next-line array-callback-return
    placePartnerList?.map((item) => {
      if (
        item?.firstAndSecondPlaceList &&
        item?.firstAndSecondPlaceList?.length > 0
      ) {
        item?.firstAndSecondPlaceList?.map((supplierItem) => {
          supplierList.push({
            rowId: supplierItem?.rowId,
            csQuantity: +item?.takenQty || 0,
            rate: supplierItem?.supplierRate || 0,
            portList:
              rfqDetail?.purchaseOrganizationName === "Foreign Procurement"
                ? getPortList(supplierItem?.portList)
                : [],
          });
        });
      }
    });
    payload = [
      {
        requestForQuotationId: rfqDetail?.requestForQuotationId,
        partnerRfqId: suppilerStatement?.firstSelectedItem?.partnerRfqId,
        placeNoForCs: 1,
        approvalNotes: values?.approvalNotes || "",
        csQuantityList: [...supplierList],
      },
    ];

    if (suppilerStatement?.secondSelectedItem) {
      payload.push({
        requestForQuotationId: rfqDetail?.requestForQuotationId,
        partnerRfqId: suppilerStatement?.secondSelectedItem?.partnerRfqId,
        placeNoForCs: 2,
        approvalNotes: values?.approvalNotes || "",
        csQuantityList: [...supplierList],
      });
    }
  }

  return payload || [];
};

export const items = [
  {
    key: "1",
    label: "Action 1",
  },
  {
    key: "2",
    label: "Action 2",
  },
];

export const dataSource = (db) => {
  return db?.map((item, index) => {
    return {
      key: index,
      itemName: item?.itemName,
      uoMname: item?.uoMname,
      itemCategoryName: item?.itemCategoryName,
      itemDescription: item?.itemDescription,
      quantity: item?.quantity,
    };
  });
};
export const expandColumns = [
  {
    title: "Supplier Rate",
    dataIndex: "supplierRate",
    key: "supplierRate",
  },
  {
    title: "Amount",
    dataIndex: "totalAmount",
    key: "totalAmount",
  },
];
export const columns = [
  {
    title: "Item Name",
    dataIndex: "itemName",
    key: "itemName",
  },
  {
    title: "UOM Name",
    dataIndex: "uoMname",
    key: "uoMname",
  },
  {
    title: "Item Category Name",
    dataIndex: "itemCategoryName",
    key: "itemCategoryName",
  },
  {
    title: "Item Description",
    dataIndex: "itemDescription",
    key: "itemDescription",
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    key: "quantity",
  },
];
