import { Form, Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react'
import { shallowEqual, useSelector } from 'react-redux';
import IForm from '../../../_helper/_form';
import Loading from '../../../_helper/_loading';
import * as XLSX from "xlsx";
import axios from 'axios';
import { toast } from 'react-toastify';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import NewSelect from '../../../_helper/_select';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import "./style.css"

const initData = {
    intAccountId: 0,
    intBusinessUnitId: 0,
    strBusinessUnitName: "",
    intItemId: 0,
    strItemCode: 0,
    strItemName: "",
    intItemTypeId: 0,
    strItemTypeName: "",
    intItemCategoryId: 0,
    strItemCategoryName: "",
    intItemSubCategoryId: 0,
    strItemSubCategoryName: "",
    strHSCode: "",
    numItemSize: 0,
    strDrawingCode: "",
    strPartNo: "",
    intBaseUOM: 0,
    strBaseUomName: "",
    intConvertedUOM: 0,
    strConvertedUomName: "",
    intInventoryLocationId: 0,
    intPurchaseOrganizationId: 0,
    numLotSize: 0,
    isMRP: false,
    intPlantId: "",
    strPlantName: "",
    intWarehouseId: 0,
    strWarehouseName: "",
};
export default function ItemBulkUpload() {
    const ref = useRef(null);
    const { profileData } = useSelector((state) => {
        return state.authData;
    }, shallowEqual);

    const selectedBusinessUnit = useSelector((state) => {
        return state.authData.selectedBusinessUnit;
    }, shallowEqual);
    const [objProps, setObjprops] = useState({});
    const [loading, setLoading] = useState(false);
    const [warehouseDDL, getWarehouseDDL, warehouseDDLloader] = useAxiosGet();
    const [plantDDL, getPlantDDL, plantLoader] = useAxiosGet();
    // eslint-disable-next-line no-unused-vars
    const [, saveItems, itemsLoader] = useAxiosPost()
    const [data, setData] = useState([]);
    const [dataLoader, setDataLoader] = useState(false)

    useEffect(() => {
        if (profileData) {
            getPlantDDL(`/wms/Plant/GetPlantDDL?AccountId=${profileData.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profileData]);

    const saveHandler = async (values, cb) => {
        // const payload = {
        //     intActionBy: profileData.userId,
        //     itemList: data,
        // }
        // if (payload?.itemList?.length > 0) {
        //     saveItems(`/item/ItemBasic/ItemBulkUpload`, payload, cb)
        // } else {
        //     toast.warn("Please upload file")
        // }
    };

    const downloadAssesmentQuesFormat = () => {
        setLoading(true);
        const url = `/domain/Document/DownlloadFile?id=638090321010686588_Item_Bulk_Upload.xlsx`;
        axios({
            url: url,
            method: "GET",
            responseType: "blob",
        })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `Item_Bulk_Entry_Format.xls`);
                document.body.appendChild(link);
                link.click();
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                toast.error(err?.response?.data?.message, "Something went wrong");
            });
    };

    const readExcel = (file, values, cb) => {
        if (!values?.plant) return toast.warn("Please select plant")
        if (!values?.warehouse) return toast.warn("Please select warehouse")
        const promise = new Promise((resolve, reject) => {
            setDataLoader(true)
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);
            fileReader.onload = (e) => {
                const bufferArray = e.target.result;
                const wb = XLSX.read(bufferArray, { type: "buffer" });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);
                resolve(data);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
        promise.then((d) => {
            setData(
                d.map((item, index) => {
                    const newObj = { ...initData };
                    newObj.intAccountId = profileData?.accountId;
                    newObj.intBusinessUnitId = selectedBusinessUnit?.value;
                    newObj.strBusinessUnitName = selectedBusinessUnit?.label;
                    newObj.intItemId = 0;
                    newObj.strItemCode = item?.IMPA_Code;
                    newObj.strItemName = item?.Item_Name;
                    newObj.intItemTypeId = item?.Item_Type_Id;
                    newObj.strItemTypeName = item?.Item_Type_Name;
                    newObj.intItemCategoryId = item?.Item_Category_Id;
                    newObj.strItemCategoryName = item?.Item_Category_Name;
                    newObj.intItemSubCategoryId = item?.Item_Sub_Category_Id;
                    newObj.strItemSubCategoryName = item?.Item_Sub_Category_Name;
                    newObj.strHSCode = item?.HS_Code;
                    newObj.numItemSize = item?.Item_Size;
                    newObj.strDrawingCode = item?.Drawing_Code;
                    newObj.strPartNo = item?.Part_No;
                    newObj.intBaseUOM = item?.Base_Uom_Id;
                    newObj.strBaseUomName = item?.Base_Uom_Name;
                    newObj.intConvertedUOM = item?.Converted_Uom_Id;
                    newObj.strConvertedUomName = item?.Converted_Uom_Name;
                    newObj.intInventoryLocationId = item?.Inventory_Location_Id;
                    newObj.intPurchaseOrganizationId = item?.Purchase_Organization_Id;
                    newObj.numLotSize = item?.Lot_Size;
                    newObj.isMRP = item?.Is_MRP;
                    newObj.intPlantId = values?.plant?.value;
                    newObj.strPlantName = values?.plant?.label;
                    newObj.intWarehouseId = values?.warehouse?.value;
                    newObj.strWarehouseName = values?.warehouse?.label;
                    return newObj;
                })
            );
            setDataLoader(false);
            cb();
        });
    };

    return (
        <IForm title={"Item Bulk Upload"} getProps={setObjprops} isHiddenReset={true} isHiddenBack={true}>
            <>
                <Formik
                    enableReinitialize={true}
                    initialValues={initData}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        saveHandler(values, () => {
                            setData([]);
                        });
                    }}
                >
                    {({
                        handleSubmit,
                        resetForm,
                        values,
                        setFieldValue,
                        isValid,
                        errors,
                        touched,
                    }) => (
                        <>
                            <Form className="form form-label-right">
                                {(loading || itemsLoader || plantLoader || warehouseDDLloader || dataLoader) && <Loading />}
                                <div className="row w-100 global-form">
                                    <div className="col-lg-3">
                                        <NewSelect
                                            name="plant"
                                            options={plantDDL || []}
                                            value={values?.plant}
                                            label="Plant"
                                            isDisabled={data?.length > 0 ? true : false}
                                            onChange={(valueOption) => {
                                                if (valueOption) {
                                                    setFieldValue("plant", valueOption);
                                                    getWarehouseDDL(`/wms/ItemPlantWarehouse/GetWareHouseItemPlantWareHouseDDL?accountId=${profileData.accountId}&businessUnitId=${selectedBusinessUnit?.value}&PlantId=${valueOption?.value}`)
                                                } else {
                                                    setFieldValue("plant", "");
                                                    setFieldValue("warehouse", "");
                                                }
                                            }}
                                            placeholder="Plant"
                                            errors={errors}
                                            touched={touched}
                                        />
                                    </div>
                                    <div className="col-lg-3">
                                        <NewSelect
                                            name="warehouse"
                                            options={warehouseDDL || []}
                                            value={values?.warehouse}
                                            label="Warehouse"
                                            isDisabled={data?.length > 0 ? true : false}
                                            onChange={(valueOption) => {
                                                setFieldValue("warehouse", valueOption);
                                            }}
                                            placeholder="Warehouse"
                                            errors={errors}
                                            touched={touched}
                                        />
                                    </div>
                                    <div className="col-lg-6 d-flex justify-content-end mt-5">
                                        <button style={{
                                            backgroundColor: "#7f8386",
                                            color: "#FFF",
                                        }} className="btn mr-1"
                                            type='button'
                                            onClick={() => {
                                                downloadAssesmentQuesFormat()
                                            }}
                                        >
                                            Download Format
                                        </button>
                                        {(values?.plant && values?.warehouse) ? (<div className='custom-button'>
                                            <input
                                                id="item_bulk_entry_file_input"
                                                className='pointer d-none'
                                                type="file"
                                                accept=".xlsx"
                                                ref={ref}
                                                onChange={(e) => {
                                                    let file = e.target.files[0];
                                                    readExcel(file, values, () => { ref.current.value = '' });
                                                }}
                                            />
                                            <label
                                                htmlFor="item_bulk_entry_file_input"
                                                className="btn-primary upload-btn-tamkin">
                                                Upload Item
                                            </label>
                                        </div>) : null}
                                    </div>
                                </div>
                                <div className="row mt-5">
                                    <div className="col-lg-12">
                                        <div className="loan-scrollable-table">
                                            <div style={{ maxHeight: "400px" }} className='scroll-table _table'>
                                                <table id="table-to-xlsx" className="table table-striped table-bordered bj-table bj-table-landing">
                                                    <thead>
                                                        <tr>
                                                            <th style={{ minWidth: "40px" }} >SL</th>
                                                            <th style={{ minWidth: "100px" }}>IMPA_Code</th>
                                                            <th style={{ minWidth: "100px" }}>Item_Name</th>
                                                            <th style={{ minWidth: "100px" }}>Item_Type_Id</th>
                                                            <th style={{ minWidth: "100px" }}>Item_Type_Name</th>
                                                            <th style={{ minWidth: "100px" }}>Item_Category_Id</th>
                                                            <th style={{ minWidth: "120px" }}>Item_Category_Name</th>
                                                            <th style={{ minWidth: "130px" }}>Item_Sub_Category_Id</th>
                                                            <th style={{ minWidth: "140px" }}>Item_Sub_Category_Name</th>
                                                            <th style={{ minWidth: "100px" }}>HS_Code</th>
                                                            <th style={{ minWidth: "100px" }}>Item_Size</th>
                                                            <th style={{ minWidth: "100px" }}>Drawing_Code</th>
                                                            <th style={{ minWidth: "100px" }}>Part_No</th>
                                                            <th style={{ minWidth: "100px" }}>Base_Uom_Id</th>
                                                            <th style={{ minWidth: "100px" }}>Base_Uom_Name</th>
                                                            <th style={{ minWidth: "120px" }}>Converted_Uom_Id</th>
                                                            <th style={{ minWidth: "140px" }}>Converted_Uom_Name</th>
                                                            <th style={{ minWidth: "140px" }}>Inventory_Location_Id</th>
                                                            <th style={{ minWidth: "140px" }}>Purchase_Organization_Id</th>
                                                            <th style={{ minWidth: "100px" }}>Lot_Size</th>
                                                            <th style={{ minWidth: "100px" }}>Is_MRP</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            data?.length > 0 && data?.map((item, index) => (
                                                                <tr key={index}>
                                                                    <td className='text-center'>{index + 1}</td>
                                                                    <td className='text-center'>{item?.strItemCode}</td>
                                                                    <td>{item?.strItemName}</td>
                                                                    <td className='text-center'>{item?.intItemTypeId}</td>
                                                                    <td>{item?.strItemTypeName}</td>
                                                                    <td className='text-center'>{item?.intItemCategoryId}</td>
                                                                    <td>{item?.strItemCategoryName}</td>
                                                                    <td className='text-center'>{item?.intItemSubCategoryId}</td>
                                                                    <td>{item?.strItemSubCategoryName}</td>
                                                                    <td className='text-center'>{item?.strHSCode}</td>
                                                                    <td className='text-center'>{item?.numItemSize}</td>
                                                                    <td className='text-center'>{item?.strDrawingCode}</td>
                                                                    <td className='text-center'>{item?.strPartNo}</td>
                                                                    <td className='text-center'>{item?.intBaseUOM}</td>
                                                                    <td>{item?.strBaseUomName}</td>
                                                                    <td className='text-center'>{item?.intConvertedUOM}</td>
                                                                    <td>{item?.strConvertedUomName}</td>
                                                                    <td className='text-center'>{item?.intInventoryLocationId}</td>
                                                                    <td className='text-center'>{item?.intPurchaseOrganizationId}</td>
                                                                    <td className='text-center'>{item?.numLotSize}</td>
                                                                    <td className='text-center'>{item?.isMRP ? "true" : "false"}</td>
                                                                </tr>
                                                            ))
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    style={{ display: "none" }}
                                    ref={objProps?.btnRef}
                                    onSubmit={() => handleSubmit()}
                                ></button>

                                <button
                                    type="reset"
                                    style={{ display: "none" }}
                                    ref={objProps?.resetBtnRef}
                                    onSubmit={() => resetForm(initData)}
                                ></button>
                            </Form>
                        </>
                    )}
                </Formik>
            </>
        </IForm >
    )
}