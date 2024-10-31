/* eslint-disable react/react-in-jsx-scope */
import { Table } from "antd";

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
