/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import Loading from "../../../_helper/_loading";
import { useHistory } from "react-router";
import {createVoucher, getVoucherById} from "../helper";
import { useLocation, useParams } from "react-router-dom";
import { getWareHouseDDL } from "../../salesInvoice/helper";
import { _todayDate } from "../../../_helper/_todayDate";

const initData = {
  warehouse: "",
  voucherNo: "",
  dteDate: _todayDate(),
  numAmount: ""
};

export default function CreateVoucherForm() {
  const { type, id } = useParams();
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  // const [rowDto, setRowDto] = useState([]);
  const [edit, setEdit] = useState(true);
  const [supplierListDDL, setSupplierListDDL] = useState([]);
  const [bankListDDL, setBankListDDL] = useState([]);
  const [businessPartnerTypeDDL, setBusinessPartnerTypeDDL] = useState([]);
  const [singleData, setSingleData] = useState([])
  const [cnfRowDto, setCnfRow] = useState([])
  const [attachmentFile, setAttachmentFile] = useState("");

  const [whName, setWhName] = useState([])

  const setterForCnfAgency = (values) => { 
      const obj =  {...values,numFromAmount:values?.from,numToAmount:values.to,numRate:values.rate}
      const data = [...cnfRowDto]
      data.push(obj)
      if(Array.isArray(data)){
        setCnfRow(data);
      }
     
  };


  console.log(id)

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  
  useEffect(()=>{
    if(id){
      getVoucherById(id, setSingleData)
    }
  }, [id])

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getWareHouseDDL(profileData?.accountId, selectedBusinessUnit?.value, profileData?.userId, setWhName);
    }
  }, [profileData, selectedBusinessUnit])

  const saveHandler = async (values, cb) => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      const payload = {
        "intid": id || 0,
        "intWhid": values?.warehouse?.value,
        "intAccountId": profileData?.accountId,
        "numAmount": values?.numAmount,
        "intActionBy": profileData?.userId,
        "dteDate": values?.dteDate,
        "strVoucherNo": values?.voucherNo,
        "strAttachment": attachmentFile
      };
      createVoucher(payload, setDisabled, ()=>{
        cb()
        if(id){
          getVoucherById(id, setSingleData)
        }
      })
    }  
  };


  const history = useHistory();
  // console.log(cnfRowDto)
  return (
    <>
      {/* {rowDto} */}
      {isDisabled && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={id ? singleData : initData}
          saveHandler={saveHandler}
          accountId={profileData?.accountId}
          rowDto={cnfRowDto}
          setRowDto={setCnfRow}
          isDisabled={isDisabled}
          type={type}
          setSingleData={setSingleData}
          whName={whName}
          attachmentFile={attachmentFile}
          setAttachmentFile={setAttachmentFile}
        />
      </div>
    </>
  );
}
