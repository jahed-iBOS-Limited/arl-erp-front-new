import React, { useRef, useState } from "react";
import Loading from "../../../../_helper/_loading";
import IForm from "../../../../_helper/_form";
import { downloadFile } from "../../../../_helper/downloadFile";
import { itemListExcelGenerator, readAndPrintExcelData } from "./helper";
import Styles from "./bulkUpdate.module.css";
import { toast } from "react-toastify";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { shallowEqual, useSelector } from "react-redux";

export default function BulkUpload() {
  const [objProps, setObjprops] = useState({});
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState([]);
  const ref = useRef(null);
  const [isValidationError, setIsValidationError] = useState(false);
  const [, saveItemList, saveItemListLoading] = useAxiosPost();

  // redux store
  const { userId, accountId } = useSelector((state) => {
    return state?.authData?.profileData;
  }, shallowEqual);

  const { value: buId } = useSelector((state) => {
    return state?.authData?.selectedBusinessUnit;
  }, shallowEqual);

  // file change handler
  const handleFileChange = (e) => {
    setIsValidationError(false);
    const file = e?.target?.files[0];
    readAndPrintExcelData({
      file,
      setLoading,
      setIsValidationError,
      setRowData,
      cb: () => {
        ref.current.value = "";
      },
    });
  };

  // excel format download handler
  const handleExportExcelFormat = () => {
    downloadFile(
      `/domain/Document/DownlloadFile?id=638289275056408964_Item-Upload.xlsx`,
      "Item List Format",
      "xlsx",
      setLoading
    );
  };

  // submit handler
  const saveHandler = () => {
    if (isValidationError) {
      return toast.warn("Invalid data set! please update and try again");
    }
    if (!rowData?.length > 0) {
      return toast.warn("No item found!");
    }
    const newItemList = rowData?.map((item) => {
      const newItem = {
        businessUnitId: item?.businessUnitId,
        accountId: accountId,
        actionBy: userId,
        itemMasterName: item?.itemMasterName || "",
        itemMasterTypeId: +item?.itemMasterTypeId || 0,
        itemMasterCategoryId: +item?.itemMasterCategoryId || 0,
        itemMasterSubCategoryId: +item?.itemMasterSubCategoryId || 0,
        drawingCode: item?.drawingCode || "",
        partNo: item?.partNo || "",
        isSerialMaintain: item?.isSerialMaintain || false,
        purchaseOrganizationId: item?.purchaseOrganizationId || 0,
        purchaseOrganizationName: item?.purchaseOrganizationName || "",
        maxLeadDays: item?.maxLeadDays || 0,
        warehouseId: item?.warehouseId || 0,
        plantId: item?.plantId || 0,
        inventoryLocationId: item?.inventoryLocationId || 0,
        binNumber: item?.binNumber || "",
        uomName: item?.uomName || "",
      };
      return newItem;
    });

    const callback = (updatedList) => {
      setRowData(updatedList || []);
      setIsValidationError(false);
    };
    saveItemList(
      `/item/ItemMaster/ItemBulkUpload`,
      newItemList,
      callback,
      true
    );
  };

  return (
    <>
      {(loading || saveItemListLoading) && <Loading />}
      <IForm
        title="Item Bulk Upload"
        getProps={setObjprops}
        renderProps={() => {
          return (
            <div>
              {/* <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  history.push('route here');
                }}
              >
                Create
              </button> */}
            </div>
          );
        }}
      >
        <div
          className={`form-group row global-form ${Styles["item-bulk-upload-wrapper"]}`}
        >
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleExportExcelFormat}
          >
            Export Excel Format
          </button>
          <input
            id="excel-upload"
            className="pointer d-none"
            type="file"
            accept=".xlsx"
            ref={ref}
            onChange={handleFileChange}
          />
          <label
            htmlFor="excel-upload"
            className={`btn btn-primary ml-10 ${Styles["import-excel-btn"]}`}
          >
            Import Excel
          </label>
          <button
            type="button"
            className="btn btn-primary ml-10"
            onClick={() => {
              itemListExcelGenerator(rowData);
            }}
          >
            Export Excel
          </button>
        </div>

        {rowData?.length > 0 ? (
          <div className="common-scrollable-table two-column-sticky">
            <div className="scroll-table _table">
              <table className="table table-striped table-bordered global-table">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Item Code</th>
                    <th style={{ minWidth: "280px" }}>Item Name</th>
                    <th>Item Type Id</th>
                    <th>Item Category Id</th>
                    <th>Item Sub Category Id</th>
                    <th>Purchase Organization Id</th>
                    <th>Drawing Code</th>
                    <th>Part No</th>
                    <th>Serial Mantain</th>
                    <th>Lead Days (Max)</th>
                    <th>Warehouse Id</th>
                    <th>Plant Id</th>
                    <th>Inventory Location Id</th>
                    <th>Bin No</th>
                    <th>UOM</th>
                  </tr>
                </thead>
                <tbody>
                  {rowData?.map((item, index) => (
                    <tr key={index}>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-center">
                        {item?.itemMasterCode || ""}
                      </td>
                      <td
                        className={
                          !item?.itemMasterName ? Styles["red-bg"] : ""
                        }
                      >
                        {item?.itemMasterName || ""}
                      </td>
                      <td
                        className={`text-center ${
                          !+item?.itemMasterTypeId ? Styles["red-bg"] : ""
                        }`}
                      >
                        {item?.itemMasterTypeId || ""}
                      </td>
                      <td
                        className={`text-center ${
                          !+item?.itemMasterCategoryId ? Styles["red-bg"] : ""
                        }`}
                      >
                        {item?.itemMasterCategoryId || ""}
                      </td>
                      <td
                        className={`text-center ${
                          !+item?.itemMasterSubCategoryId
                            ? Styles["red-bg"]
                            : ""
                        }`}
                      >
                        {item?.itemMasterSubCategoryId || ""}
                      </td>
                      <td
                        className={`text-center ${
                          !+item?.purchaseOrganizationId ? Styles["red-bg"] : ""
                        }`}
                      >
                        {item?.purchaseOrganizationId || ""}
                      </td>
                      <td className="text-center">{item?.drawingCode || ""}</td>
                      <td className="text-center">{item?.partNo || ""}</td>
                      <td className="text-center">
                        {item?.isSerialMaintain ? "Yes" : "No"}
                      </td>
                      <td>{item?.maxLeadDays}</td>
                      <td>{item?.warehouseId}</td>
                      <td>{item?.plantId}</td>
                      <td>{item?.inventoryLocationId}</td>
                      <td>{item?.binNumber}</td>
                      <td>{item?.uomName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {/* hidded buttons */}
        <button
          type="button"
          style={{ display: "none" }}
          ref={objProps?.btnRef}
          onClick={saveHandler}
        ></button>

        <button
          type="button"
          style={{ display: "none" }}
          ref={objProps?.resetBtnRef}
          onClick={() => {
            setRowData([]);
            setIsValidationError(false);
          }}
        ></button>
      </IForm>
    </>
  );
}
