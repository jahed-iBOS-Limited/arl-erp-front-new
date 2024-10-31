/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/react-in-jsx-scope */
import { Table } from "antd";

export const saveHandlerPayload = (
  type,
  payload,
  rfqDetail,
  suppilerStatement,
  placePartnerList,
  rowData
) => {
  if (type?.value === 0) {
    rowData?.map((row) => {
      payload.push({
        requestForQuotationId: rfqDetail?.requestForQuotationId,
        partnerRfqId: row?.partnerRfqId,
        rowId: row?.itemWiseCode, // have to check if need
        itemId: row?.itemId,
        takenQuantity: +row?.takenQuantity,
        rate: +row?.supplierRate,
        approvalNotes: row?.note,
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
        });
      });
      return portListDS;
    };

    // eslint-disable-next-line array-callback-return
    let csQuantityList = placePartnerList?.map((item) => {
      if (
        item?.firstAndSecondPlaceList &&
        item?.firstAndSecondPlaceList?.length > 0
      ) {
        item?.firstAndSecondPlaceList?.map((supplierItem) => {
          return {
            rowId: supplierItem?.rowId,
            csQuantity: +item?.takenQty,
            rate: supplierItem?.supplierRate,
            portList:
              rfqDetail?.purchaseOrganizationName === "Foreign Procurement"
                ? getPortList(supplierItem?.portList)
                : [],
          };
        });
      }
    });
    payload = [
      {
        requestForQuotationId: rfqDetail?.requestForQuotationId,
        partnerRfqId: suppilerStatement?.firstSelectedItem?.partnerRfqId,
        placeNoForCs: suppilerStatement?.firstSelectedItem?.placeNoForCs || 0,
        approvalNotes: "test..",
        csQuantityList: [...csQuantityList],
      },
    ];

    if (suppilerStatement?.secondSelectedItem) {
      payload.push({
        requestForQuotationId: rfqDetail?.requestForQuotationId,
        partnerRfqId: suppilerStatement?.secondSelectedItem?.partnerRfqId,
        placeNoForCs: suppilerStatement?.secondSelectedItem?.placeNoForCs || 0,
        approvalNotes: "test..22",
        csQuantityList: [...csQuantityList],
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
