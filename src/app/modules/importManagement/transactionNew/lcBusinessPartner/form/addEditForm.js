/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import Loading from "../../../../_helper/_loading";
import { useHistory } from "react-router";
import {
  BusinessPartnerTypeDDL,
  CreateBusinessPartner,
  CreateInsuranceCompany,
  GetBankListDDL,
  CreateBusinessPartnerForCnF,
  GetBusinessPartnerDetails,
} from "../helper";
import { useLocation, useParams } from "react-router-dom";
import percentageToDecemal from "../../../../_helper/_percentageToDecemal";
import { CreateBusinessPartnerForBank } from "./../helper";
import { isUniq } from "./../../../../_helper/uniqChecker";
import { toast } from "react-toastify";

const initData = {
  shippingAgent: "",
  supplier: "",
  bank: "",
  provider: "",
  type: "",
  coverNotePrefix: "",
  policyPrefix: "",
  commissionPercentage: "",
  commissionAdjustWithBill: "",
  insuredAmount: "",
  premiumRate: "",
  vatRate: "",
  discountRate: "",
  airStampFixed: "",
  airStampCharges: "",
  landStampFixed: "",
  landStampCharges: "",
  seaStampFixed: "",
  seaStampCharges: "",
  atsightCommissionQ1: "",
  atsightCommissionQ2: "",
  upasCommissionQ1: "",
  upasCommissionQ2: "",
  swiftCharge: "",
  stampCharge: "",
  stationaryCharge: "",
  otherCharge: "",
  isToleranceIncluded: "",
  isMinChargeIncluded: "",
  minCharge: "",
  ddCommissionRate: "",
  ddCommissionMinimum: "",
  ttCommissionRate: "",
  ttCommisionMinimum: "",
  from: 0,
  to: "",
  rate: "",
};

export default function LCBusinessPartnerForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  // const [rowDto, setRowDto] = useState([]);
  const [edit, setEdit] = useState(true);
  const [supplierListDDL, setSupplierListDDL] = useState([]);
  const [bankListDDL, setBankListDDL] = useState([]);
  const [businessPartnerTypeDDL, setBusinessPartnerTypeDDL] = useState([]);
  const [singleData, setSingleData] = useState([])
  const [cnfRowDto, setCnfRow] = useState([])

  const setterForCnfAgency = (values) => { 
      const obj =  {...values,numFromAmount:values?.from,numToAmount:values.to,numRate:values.rate}
      const data = [...cnfRowDto]
      data.push(obj)
      if(Array.isArray(data)){
        setCnfRow(data);
      }
     
  };

  const { type, businessID, businessPartnerTypeId } = useParams();

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const { state } = useLocation();
  useEffect(() => {
   
    BusinessPartnerTypeDDL(setBusinessPartnerTypeDDL);
    GetBankListDDL(setBankListDDL);
  }, []);

  useEffect(() => {
    if (type === "view") {
      GetBusinessPartnerDetails(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        businessID,
        businessPartnerTypeId,
        setSingleData,
        setCnfRow
      );
    }
  }, []);

  const saveHandler = async (values, cb) => {

    if (
      values?.type?.label === "Bank" &&
      values?.supplier?.label.trim().toLowerCase() !==
        values?.bank?.label.trim().toLowerCase()
    ) {
      return toast.warn("Create Bank as a Supplier");
    }
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      const payload = {
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        partnerName: values?.supplier?.label || values?.provider,
        partnerType: values?.type?.label,
        partnerTypeId: values?.type?.value,
        businessPartnerId: values?.supplier?.value,
        actionBy: profileData?.employeeId,
        isCommissionAdjustWithBill: values?.commissionAdjustWithBill || false,
        strCommissionPercentage: values?.commissionPercentage,
      };
      const payloadForInsurance = {
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        partnerName: values?.supplier?.label || values?.provider,
        partnerType: values?.type?.label,
        partnerTypeId: values?.type?.value,
        businessPartnerId: values?.supplier?.value,
        coverNotePrefix: values?.coverNotePrefix || null,
        policyPrefix: values?.policyPrefix || null,
        actionBy: profileData?.employeeId,
        isCommissionAdjustWithBill: values?.commissionAdjustWithBill || false,
        strCommissionPercentage: values?.commissionPercentage,
      };
      const payloadForBank = {
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        lcPartnerTypeId: values?.type?.value,
        lcPartnerTypeName: values?.type?.label,
        bankId: values?.bank?.value,
        bankName: values?.bank?.label,
        businessPartnerId: values?.supplier?.value,
        businessPartnerName: values?.supplier?.label,
        actionBy: profileData?.employeeId,
        isToleranceInclude: +values?.isToleranceIncluded,
        isMinimumApplied: +values?.isMinChargeIncluded,
        numMinimumCommission: +values?.minCharge,
        numComSightQ1: percentageToDecemal(values?.atsightCommissionQ1),
        numComSightQ2: percentageToDecemal(values?.atsightCommissionQ2),
        numComUpasQ1: percentageToDecemal(values?.upasCommissionQ1),
        numComUpasQ2: percentageToDecemal(values?.upasCommissionQ2),
        numSwift: +values?.swiftCharge,
        numStamp: +values?.stampCharge,
        numStationary: +values?.stationaryCharge,
        numOtherBankCharge: +values?.otherCharge,
        numComDdrate: percentageToDecemal(+values?.ddCommissionRate),
        numComDdminimum: percentageToDecemal(values?.ddCommissionMinimum),
        numComTtrate: percentageToDecemal(+values?.ttCommissionRate),
        numComTtminimum: percentageToDecemal(values?.ttCommisionMinimum),
      };

      const payloadForCNF = cnfRowDto.map((item) => {
        return {
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          lcBusinessPartnerTypeId: +values?.type?.value,
          lcBusinessPartnerTypeName: values?.type?.label,
          businessPartnerId: +values?.supplier?.value,
          businessPartnerName: values?.supplier?.label,
          numFromAmount: +item?.from,
          numToAmount: +item?.to,
          numRate: percentageToDecemal(+item?.rate),
          actionBy: profileData?.employeeId,
        };
      });

   

      if (values?.type?.label === "Insurance Company") {
        CreateInsuranceCompany(
          setDisabled,
          values,
          profileData?.accountId,
          selectedBusinessUnit?.value,
          profileData?.userId,
          cb
        );
      } else if (values?.type?.label === "Bank") {
        CreateBusinessPartnerForBank(payloadForBank, cb);
      } else if (values?.type?.label === "CnF Agency") {
        CreateBusinessPartnerForCnF(payloadForCNF, cb);
      } else {
        CreateBusinessPartner(payload, cb);
      }
    }
    // console.log(values, "values");
  };

  const remover = (payload) => {
    const filterArr = cnfRowDto.filter((itm, index) => +index !== +payload);
    setCnfRow(filterArr);
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
          initData={type === "view" ? singleData : initData}
          saveHandler={saveHandler}
          profileData={profileData}
          accountId={profileData?.accountId}
          selectedBusinessUnit={selectedBusinessUnit}
          setterForCnfAgency={setterForCnfAgency}
          remover={remover}
          rowDto={cnfRowDto}
          setRowDto={setCnfRow}
          setEdit={setEdit}
          isDisabled={isDisabled}
          supplierListDDL={supplierListDDL}
          businessPartnerTypeDDL={businessPartnerTypeDDL}
          type={type}
          bankListDDL={bankListDDL}
          setSupplierListDDL={setSupplierListDDL}
          setSingleData={setSingleData}
        />
      </div>
    </>
  );
}
