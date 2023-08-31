import React, { useRef, useState } from 'react';
import Loading from '../../../../_helper/_loading';
import IForm from '../../../../_helper/_form';
import { downloadFile } from '../../../../_helper/downloadFile';
import { itemListExcelGenerator, readAndPrintExcelData } from './helper';
import Styles from './bulkUpdate.module.css';
import { toast } from 'react-toastify';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';
import { shallowEqual, useSelector } from 'react-redux';

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
        ref.current.value = '';
      },
    });
  };

  // excel format download handler
  const handleExportExcelFormat = () => {
    downloadFile(
      `/domain/Document/DownlloadFile?id=638289275056408964_Item-Upload.xlsx`,
      'Item List Format',
      'xlsx',
      setLoading
    );
  };

  // submit handler
  const saveHandler = () => {
    if (isValidationError) {
      return toast.warn('Invalid data set! please update and try again');
    }
    if (!rowData?.length > 0) {
      return toast.warn('No item found!');
    }
    const newItemList = rowData?.map((item) => {
      const newItem = {
        businessUnitId: buId,
        accountId: accountId,
        actionBy: userId,
        itemName: item?.itemName || '',
        itemTypeId: +item?.itemTypeId || 0,
        itemCategoryId: +item?.itemCategoryId || 0,
        itemSubCategoryId: +item?.itemSubCategoryId || 0,
        plantId: +item?.plantId || 0,
        warehouseId: +item?.warehouseId || 0,
        inventoryLocationId: +item?.inventoryLocationId || 0,
        binNumber: item?.binNumber || '',
        uomName: item?.uomName || '',
        hscode: item?.hscode || '',
        maxLeadDays: +item?.maxLeadDays || 0,
      };
      return newItem;
    });

    const callback = (updatedList) => {
      setRowData(updatedList || []);
      setIsValidationError(false);
    };
    saveItemList(`/item/ItemBasic/UploadItemBulk`, newItemList, callback, true);
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
        <div className={`form-group row global-form ${Styles['item-bulk-upload-wrapper']}`}>
          <button type="button" className="btn btn-primary" onClick={handleExportExcelFormat}>
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
            className={`btn btn-primary ml-10 ${Styles['import-excel-btn']}`}
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
                    <th style={{ minWidth: '280px' }}>Item Name</th>
                    <th>Item Type Id</th>
                    <th>Item Category Id</th>
                    <th>Item Sub Category Id</th>
                    <th>Plant Id</th>
                    <th>Warehouse Id</th>
                    <th>Inventory Location Id</th>
                    <th>Bin Number</th>
                    <th>UoM Name</th>
                    <th>HS Code</th>
                    <th>Lead Days</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rowData?.map((item, index) => (
                    <tr key={index}>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-center">{item?.itemCode || ''}</td>
                      <td className={!item?.itemName ? Styles['red-bg'] : ''}>
                        {item?.itemName || ''}
                      </td>
                      <td className={`text-center ${!+item?.itemTypeId ? Styles['red-bg'] : ''}`}>
                        {item?.itemTypeId || ''}
                      </td>
                      <td
                        className={`text-center ${!+item?.itemCategoryId ? Styles['red-bg'] : ''}`}
                      >
                        {item?.itemCategoryId || ''}
                      </td>
                      <td
                        className={`text-center ${
                          !+item?.itemSubCategoryId ? Styles['red-bg'] : ''
                        }`}
                      >
                        {item?.itemSubCategoryId || ''}
                      </td>
                      <td className={`text-center ${!+item?.plantId ? Styles['red-bg'] : ''}`}>
                        {item?.plantId || ''}
                      </td>
                      <td className={`text-center ${!+item?.warehouseId ? Styles['red-bg'] : ''}`}>
                        {item?.warehouseId || ''}
                      </td>
                      <td
                        className={`text-center ${
                          !+item?.inventoryLocationId ? Styles['red-bg'] : ''
                        }`}
                      >
                        {item?.inventoryLocationId || ''}
                      </td>
                      <td className={`text-center ${!item?.binNumber ? Styles['red-bg'] : ''}`}>
                        {item?.binNumber || ''}
                      </td>
                      <td className={!item?.uomName ? Styles['red-bg'] : ''}>
                        {item?.uomName || ''}
                      </td>
                      <td className="text-center">{item?.hscode || ''}</td>
                      <td
                        className={`text-center ${
                          item?.maxLeadDays && !+item?.maxLeadDays ? Styles['red-bg'] : ''
                        }`}
                      >
                        {item?.maxLeadDays || ''}
                      </td>
                      <td className="text-center">{item?.status || ''}</td>
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
          style={{ display: 'none' }}
          ref={objProps?.btnRef}
          onClick={saveHandler}
        ></button>

        <button
          type="button"
          style={{ display: 'none' }}
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
