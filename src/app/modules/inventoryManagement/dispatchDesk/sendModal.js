import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import IForm from "../../_helper/_form";
import InputField from "../../_helper/_inputField";
import Loading from "../../_helper/_loading";
import { _todayDate } from "../../_helper/_todayDate";
import CommonTable from "../../_helper/commonTable";
import useAxiosGet from "../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../_helper/customHooks/useAxiosPost";

const initData = {
  sendVia: "",
  sendCost: "",
  vehicleNo :"",
  dispatchSendReveiveDate:_todayDate(),
};

const validationSchema =  Yup.object().shape({
  dispatchSendReveiveDate:Yup.date().required("Date is required")
})

export default function SendModal({singleItem,onHide,handleGetRowData}) {
  const [objProps, setObjprops] = useState({});
  const [rowData,getRowData,loadRowData] = useAxiosGet()
  const [,sendDocument,loadSendDocument] = useAxiosPost()
  const {
    profileData: { accountId:employeeFullName,userId },
  } = useSelector((state) => state?.authData, shallowEqual);
  console.log("singleItem",singleItem)
  const saveHandler = (values, cb) => {
    const payload ={
      header:{
        dispatchHeaderId:singleItem?.dispatchHeaderId,
        sendReceive:singleItem?.sendReceive,
        fromLocation:singleItem?.fromLocation,
        toLocation:singleItem?.toLocation,
        senderEnrollId:singleItem?.senderEnrollId,
        senderName:singleItem?.senderName,
        senderContactNo:singleItem?.senderContactNo,
        receiverEnrollId:singleItem?.receiverEnrollId,
        receiverName:singleItem?.receiverName,
        receiverContactNo:singleItem?.receiverContactNo,
        documentOwnerSenderReveiveDate:singleItem?.documentOwnerSenderReveiveDate,
        remaks:singleItem?.remaks,
        dispatchSenderReceiverEnroll:userId,
        dispatchSenderReceiverName:employeeFullName,
        dispatchSendReveiveDate:values?.dispatchSendReveiveDate,
        dispatchNote:values?.dispatchNote||"",
        sendViya:values?.sendVia||"",
        vehicleNo:values?.vehicleNo || "",
        sendCost:+values?.sendCost || 0,
        actionById:singleItem?.actionById,
        accountId:singleItem?.accountId,
        businessUnitId:singleItem?.businessUnitId,
        plantId:singleItem?.plantId,
        isSend:true,
        isReceive:false,
      },
      row:[...rowData?.row]
    }
    sendDocument(`/tms/DocumentDispatch/SendDocumentFromDispatchDesk`,
    payload,
    ()=>{
      handleGetRowData()
      cb && cb()
    }
    )
  };

  useEffect(()=>{
    getRowData(`/tms/DocumentDispatch/GetDocumentDispatchById?DispatchId=${singleItem?.dispatchHeaderId}`
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
          onHide()
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
            {(loadRowData || loadSendDocument) && <Loading />}
            <IForm isHiddenBack={true}  title="Send " getProps={setObjprops}>
             <Form>
              <div className="form-group  global-form row">
                {/* <div className="col-lg-3">
                  <NewSelect
                    name="item"
                    options={[
                      { value: 1, label: "Item-1" },
                      { value: 2, label: "Item-2" },
                    ]}
                    value={values?.item}
                    label="Item"
                    onChange={(valueOption) => {
                      setFieldValue("item", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div> */}
                <div className="col-lg-3">
                  <InputField
                    value={singleItem?.dispatchCode}
                    label="Document No"
                    name="documentNo"
                    type="text"
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={singleItem?.senderName}
                    label="Sender Name"
                    name="senderName"
                    type="text"
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.sendVia}
                    label="Send Via"
                    name="sendVia"
                    type="text"
                    placeholder="Send Via"
                    onChange={(e) => {
                      setFieldValue("sendVia", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.sendCost}
                    placeholder="Send Cost"
                    label="Send Cost"
                    name="sendCost"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("sendCost", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
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
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.dispatchNote}
                    label="Note"
                    name="dispatchNote"
                    placeholder="Note"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("dispatchNote", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.dispatchSendReveiveDate}
                    label="Date"
                    name="dispatchSendReveiveDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("dispatchSendReveiveDate", e.target.value);
                    }}
                  />
                </div>
              </div>

              <div style={{marginTop:"15px"}}>
                <CommonTable headersData={["Sl","Dispatch Type","Parcel Name","Quantity","UoM","Remarks"]}>
                    
                    <tbody>
                       {rowData?.row?.map((item,index)=>
                        <tr key={index}>
                            <td className="text-center">{index+1}</td>
                            <td className="text-center">{item?.DispatchType}</td>
                            <td className="text-center">{item?.DocumentMaterialName}</td>
                            <td className="text-center">{item?.Quantity}</td>
                            <td className="text-center">{item?.Uom}</td>
                            <td className="text-center">{item?.Remaks}</td>
                            {/* <td className="text-center">
                                <span onClick={()=>handleRowDelete(index)}>
                                <IDelete />
                                </span>
                            </td> */}
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