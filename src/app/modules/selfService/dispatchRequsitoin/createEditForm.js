import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import SearchAsyncSelect from "../../_helper/SearchAsyncSelect";
import IForm from "../../_helper/_form";
import IDelete from "../../_helper/_helperIcons/_delete";
import InputField from "../../_helper/_inputField";
import Loading from "../../_helper/_loading";
import NewSelect from "../../_helper/_select";
import CommonTable from "../../_helper/commonTable";
import useAxiosGet from "../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../_helper/customHooks/useAxiosPost";
import { dispatchRequisitionSchema } from "./helper";

const initData = {
  plant:"",
  dispatchType: "",
  dispatchDate: "",
  fromLocation: "",
  receiverType: "",
  receiverBu: "",
  receiverName: "",
  contactNo: "",
  vehicleNo: "",
  parcelName: "",
  qty: "",
  uom: "",
  remarks: "",
  rowRemark:"",
};

export default function DispatchRequisitionCreateEdit() {
  const [objProps, setObjprops] = useState({});
  const [rowData,setRowData] = useState([])
  const [plantListddl, getPlantListddl] = useAxiosGet();
  const[toLocationPlantDDL,getToLocationPlantDDL,loadToLocatoinPlantDDL] = useAxiosGet()
  const [singleItem,getSingleItem] = useAxiosGet()
  const {id} = useParams()
  // const[isShowModal,setIsShowModal] = useState()
  const location = useLocation();
  const [,saveDispatchRequisition,loadDispatchRequisition] =useAxiosPost()
  const {
    profileData: { accountId: accId,employeeFullName ,contact,employeeId,userId},
    selectedBusinessUnit: { value: buId },
    // businessUnitList,
  } = useSelector((state) => state?.authData, shallowEqual);
  const [uomList,getUoMList] = useAxiosGet()

  // all handler
  const saveHandler = (values, cb) => {
    if(rowData?.length <1) return toast.warn("Add minimum one data")
    const payload = {
        header: {
          dispatchHeaderId: 0,
          dispatchType:values?.receiverType?.label,
          dispatchNote: "", 
          sendReceive: location.state.requisition || "",
          fromLocation: values?.plant?.label,
          fromPlantId:values?.plant?.value,
          toLocation: values?.toLocation?.label || values?.toLocation||"",
          toPlantId:values?.toLocation?.value || 0,
          senderEnrollId: employeeId,
          senderName: employeeFullName,
          senderContactNo :contact,
          receiverEnrollId:values.receiverName?.value|| 0,
          receiverName: values.receiverName?.strEmployeeName||values?.receiverName||"",
          receiverContactNo:values?.contactNo,
          // documentOwnerSenderReveiveDate :,
          remaks:values?.remarks||"",
          dispatchSenderReceiverEnroll:0,
          dispatchSenderReceiverName:"",
          requisitionDate:values?.dispatchDate,
          sendViya: "",
          vehicleNo: "",
          sendCost: 0,
          // isOwnerReceive:false,
          actionById: employeeId,
          accountId: accId,
          businessUnitId: buId,
          // isActive: true,
          // isSend: false, 
        },
        row: [...rowData]
      }
      saveDispatchRequisition(
        `/tms/DocumentDispatch/CreateDocumentRequsition`,
        payload,
        ()=>{
          setRowData([])
          cb && cb()
        },
        true
      )

  };
  const loadUserList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/hcm/HCMDDL/GetEmployeeDDLSearchByBU?AccountId=${accId}&BusinessUnitId=${0}&Search=${v}`
      )
      .then((res) => {
        const user = res?.data?.map(user=>({...user,label:`${user?.strEmployeeName} - ${user?.employeeBusinessUnit} - [${user?.erpemployeeId}]`}));
        return user ;
      })
      .catch((err) => []);
  };
  const handleAdd =(values)=>{
    const checkDuplicate = rowData?.find(item=>item?.dispatchType === values?.dispatchType?.label && item?.documentMaterialName === values?.parcelName && item?.quantity === values?.qty)
    if(checkDuplicate) return toast.warn("Duplicate Data Found")
    const newRowItem = {
        rowId:0,
        dispatchHeaderId:0,
        dispatchType:values?.dispatchType?.label.toLowerCase(),
        documentMaterialName:values?.parcelName,
        quantity:+values?.qty || 0 ,
        uomId:values?.uom?.value || 0,
        uom:values?.uom?.label || "",
        isActive:true,
        remaks:values?.rowRemark||""
    }
    setRowData((prev)=>[...prev,newRowItem])
  }
 const handleRowDelete =(index)=>{
    const prevRowData = [...rowData]
    prevRowData.splice(index,1)
    setRowData(prevRowData)
 }

 useEffect(()=>{
  getUoMList(`/item/ItemUOM/GetItemUOMDDL?AccountId=${accId}&BusinessUnitId=${buId}`)
  getPlantListddl(`/wms/ItemPlantWarehouse/GetWareHouseItemPlantWareHouseDDL?accountId=${accId}&businessUnitId=${buId}&PlantId=0`)
  getToLocationPlantDDL(`/wms/ItemPlantWarehouse/GetWareHouseItemPlantWareHouseDDL?accountId=${accId}&businessUnitId=${buId}&PlantId=0`)

 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[accId,buId])

 useEffect(()=>{
  if(id){
    getSingleItem(`/tms/DocumentDispatch/GetDocumentDispatchById?DispatchId=${id}`)
  }
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[id])

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
        validationSchema={dispatchRequisitionSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        if(!values?.receiverName) return toast.warn("Receiver name is required")
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        setValues,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {loadDispatchRequisition && <Loading />}
          <IForm title="Create Dispatch Requisition" getProps={setObjprops}>
            <Form>
              <div className="form-group  global-form row">
              <div className="col-lg-3">
                  <NewSelect
                    name="receiverType"
                    options={[
                      { value: 1, label: "Internal" },
                      { value: 2, label: "External" },
                    ]}
                    value={values?.receiverType}
                    label="Receiver Type"
                    onChange={(valueOption) => {
                      setFieldValue("receiverName", "");
                      setFieldValue("receiverType", valueOption);
                      
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {values?.receiverType?.value === 1 ? (
                  <>
                  <div className="col-md-3">
                    <label>Receiver Name</label>
                    <SearchAsyncSelect
                      selectedValue={values?.receiverName}
                      isSearchIcon={true}
                      handleChange={(valueOption) => {
                        // setFieldValue("toLocation", "");
                        setFieldValue("receiverName", valueOption);
                        setFieldValue("contactNo", valueOption?.contactNo);
                        if(!valueOption) return;
                      // getToLocationPlantDDL(`/wms/Plant/GetPlantDDL?AccountId=${accId}&BusinessUnitId=${valueOption?.employeeBusinessUnitId}`)
                      }}
                      loadOptions={loadUserList}
                    />
                  </div>

                  </>
                ) :values?.receiverType?.value === 2? (
                  <div className="col-lg-3">
                    <InputField
                      value={values?.receiverName}
                      label="Receiver Name"
                      placeholder="Receiver Name"
                      name="receiverName"
                      type="text"
                      onChange={(e) => {
                        setFieldValue("receiverName", e.target.value);
                      }}
                    />
                  </div>
                ):null}
                <div className="col-lg-3">
                  <InputField
                    value={values?.dispatchDate}
                    label="Requisition Date"
                    name="dispatchDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("dispatchDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="plant"
                    options={plantListddl}
                    value={values?.plant}
                    label="From Location"
                    onChange={(valueOption) => {
                      setFieldValue("plant", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                
                {
                  values?.receiverType?.value === 1 ? (
                    <>
                     <div className="col-lg-3">
                  <NewSelect
                    name="toLocation"
                    options={toLocationPlantDDL}
                    value={values?.toLocation}
                    label="To Location"
                    onChange={(valueOption) => {
                      setFieldValue("toLocation", valueOption);
                    }}
                    disabled={!values?.receiverName}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                    </>
                  ) :values?.receiverType?.value === 2 && (
                    <div className="col-lg-3">
                  <InputField
                    value={values?.toLocation}
                    label="To Location"
                    placeholder="To Location"
                    name="toLocation"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("toLocation", e.target.value);
                    }}
                  />
                </div>
                  )
                }
                
                <div className="col-lg-3">
                  <InputField
                    value={values?.contactNo}
                    label="Contact No"
                    placeholder="Contact No"
                    name="contactNo"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("contactNo", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.remarks}
                    label="Remarks"
                    name="remarks"
                    placeholder="Remarks"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("remarks", e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="form-group  global-form row mt-5">
                
                {/* <div className="col-lg-3">
                  <InputField
                    value={values?.vehicleNo}
                    label="Vehicle No"
                    name="vehicleNo"
                    placeholder="Vehicle No"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("vehicleNo", e.target.value);
                    }}
                  />
                </div> */}
                <div className="col-lg-3">
                  <NewSelect
                    name="dispatchType"
                    options={[
                      { value: 1, label: "Document" },
                      { value: 2, label: "Material" },
                    ]}
                    value={values?.dispatchType}
                    label="Dispatch Type"
                    onChange={(valueOption) => {
                      setFieldValue("parcelName", "");
                      setFieldValue("qty", "");
                      setFieldValue("dispatchType", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.parcelName}
                    label={values?.dispatchType ? `${values?.dispatchType?.label} Name` :"Document / Material Name"}
                    name="parcelName"
                    placeholder={values?.dispatchType ? `${values?.dispatchType?.label} Name` :"Document / Material Name"}
                    type="text"
                    onChange={(e) => {
                      setFieldValue("parcelName", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.qty}
                    label="Qty"
                    name="qty"
                    placeholder="qty"
                    type="number"
                    min={0}
                    onChange={(e) => {
                      setFieldValue("qty", e.target.value);
                    }}
                  />
                </div>
                {values?.dispatchType?.value === 2 && (
                  <div className="col-lg-3">
                    <NewSelect
                     options={uomList}
                      value={values?.uom}
                      label="UOM"
                      name="uom"
                      placeholder="UOM"
                      type="text"
                      onChange={(valueOption) => {
                        setFieldValue("uom", valueOption);
                      }}
                    />
                  </div>
                )}
                <div className="col-lg-3">
                  <InputField
                    value={values?.rowRemark}
                    label="Remarks"
                    name="rowRemark"
                    placeholder="Remarks"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("rowRemark", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <button
                   style={{marginTop:"16px"}}
                    className="btn btn-primary"
                    type="button"
                    onClick={()=>{

                      handleAdd(values,setRowData)
                      setValues({
                        ...values,
                        dispatchType:"",
                        parcelName:"",
                        qty:"",
                        rowRemark:"",
                        uom:""
                      })
                    }}
                    disabled={
                      !values?.dispatchType ||
                      !values?.parcelName ||
                      !values?.qty 
                    }
                  >
                    Add
                  </button>
                </div>
              </div>

              <div style={{marginTop:"15px"}}>
                <CommonTable headersData={["Sl","Dispatch Type","Parcel Name","Quantity","UoM","Remarks","Action"]}>
                    <tbody>
                       {rowData?.map((item,index)=>
                        <tr key={index}>
                            <td className="text-center">{index+1}</td>
                            <td className="text-center">{item?.dispatchType}</td>
                            <td className="text-center">{item?.documentMaterialName}</td>
                            <td className="text-center">{item?.quantity}</td>
                            <td className="text-center">{item?.uom}</td>
                            <td className="text-center">{item?.remaks}</td>
                            <td className="text-center">
                                <span onClick={()=>handleRowDelete(index)}>
                                <IDelete />
                                </span>
                            </td>
                        </tr>
                        )}
                    </tbody>
                </CommonTable>
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
          </IForm>
        </>
      )}
    </Formik>
  );
}
