import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import IForm from "../../../_helper/_form";
import IDelete from "../../../_helper/_helperIcons/_delete";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import CommonTable from "../../../_helper/commonTable";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";

const initData = {
  parameter: "",
  standardValue: "",
};

export default function QcItemConfigCreate() {
  const {
    profileData: { accountId: accId,userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);
  const [objProps, setObjprops] = useState({});
  const { id } = useParams();
  const {state} = useLocation();
  const [rowData, getRowData, loadingRowData, setRowData] = useAxiosGet();
  const[,saveItem,loadSaveItem] = useAxiosPost()

  const saveHandler = (values, cb) => {
    saveItem(`/mes/QCTest/ConfigQCItemParameter`,rowData,()=>{},true)
  };
  const handleRowAdd = (values)=>{
    const checkDuplicateData = rowData?.some(item=>item?.parameterName.toLowerCase() === values?.parameter.toLowerCase() && item?.standardValue === values?.standardValue)
    if(checkDuplicateData){
        toast.warn("Duplicate Data Not Allow")
        return;
    }
    const rowItem = {
        configId:0,
        accountId:accId,
        businessUnitId:buId,
        itemId:state?.itemId,
        itemName:state?.itemName,
        parameterName:values?.parameter,
        standardValue:values?.standardValue,
        createdBy:userId
    }
    setRowData([...rowData,rowItem])
  }
  const handleRowDelete=(index)=>{
    const cloneRowData = [...rowData]
    cloneRowData.splice(index,1)
    setRowData(cloneRowData)
  }

  useEffect(() => {
    getRowData(
      `/mes/QCTest/GetQCItemParameterConfigByItem?businessUnitId=${buId}&itemId=${id}`,
      (data)=>{
        const updatedData = data?.filter(item=>item?.standardValue >0 && item?.parameterName !== "")
        setRowData(updatedData)
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, id]);
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      //   validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        if(rowData?.length<1){
            toast.warn("Add minimum one item")
            return;
        }
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
        isValid,
        errors,
        touched,
      }) => (
        <>
          {(loadingRowData || loadSaveItem )&& <Loading />}
          <IForm title="Create QC-Item" getProps={setObjprops}>
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                <p style={{fontSize:14,fontWeight:"bold"}}>Item Name : {state?.itemName}</p>
                </div>
                <div className="col-lg-3">
                <p style={{fontSize:14,fontWeight:"bold"}}>Item Type : {state?.itemTypeName}</p>
                </div>
                <div className="col-lg-3">
                <p style={{fontSize:14,fontWeight:"bold"}}>Item Category : {state?.itemCategoryName}</p>
                </div>
                <div className="col-lg-3">
                <p style={{fontSize:14,fontWeight:"bold"}}>Item SubCategory : {state?.itemSubCategoryName}</p>
                </div>
               
                
              </div>
              <div className="mt-4 form-group  global-form row">
              <div className="col-lg-3">
                  <InputField
                    value={values?.parameter}
                    label="Parameter"
                    placeholder="Parameter"
                    name="parameter"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("parameter", e.target.value);
                    }}
                  />
                </div>
              <div className="col-lg-3">
                  <InputField
                    value={values?.standardValue}
                    label="Standard Value"
                    placeholder="Standard Value"
                    name="standardValue"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("standardValue", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <button
                    type="button"
                    style={{
                      marginTop: "16px",
                    }}
                    onClick={() => {
                       handleRowAdd(values)
                       resetForm(initData)
                    }}
                    class="btn btn-primary ml-2"
                    disabled={
                      !values?.parameter ||
                      !values.standardValue
                    }
                  >
                    Add
                  </button>
                 
                </div>
              </div>
             <div className="mt-4">
                <CommonTable headersData={["Parameter","Standard Value","Action"]}>
                    <tbody>
                        {
                            rowData?.map((item,index)=>(
                                <tr key={index}>
                                    <td className="text-center">{item?.parameterName}</td>
                                    <td className="text-center">{item?.standardValue}</td>
                                    <td className="text-center">
                                    <span
                                    onClick={()=>handleRowDelete(index)}
                                    >
                                        <IDelete/>
                                    </span>
                                    </td>
                                </tr>
                            ))
                        }
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
