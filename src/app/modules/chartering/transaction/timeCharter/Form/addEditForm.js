/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useLocation } from "react-router-dom";
import { getSBUListDDL } from "../../../../assetManagement/assetRentManagement/assetRent/helper";
import { getAccDDL } from "../../../../financialManagement/banking/chequeRegister/helper";
import { getOwnerInfoDDL, getVesselDDL } from "../../../helper";
import Loading from "../../../_chartinghelper/loading/_loading";
import { _dateFormatter } from "../../../_chartinghelper/_dateFormatter";
import { getDifference } from "../../../_chartinghelper/_getDateDiff";
import { _todayDate } from "../../../_chartinghelper/_todayDate";
import {
  GetTransactionNameList,
  saveTimeCharterTransaction,
  editTimeCharterTransaction,
  getTransactionById,
  getPreOffHires,
} from "../helper";
import Form from "./form";

const initData = {
  vesselName: "",
  voyageNo: "",
  transactionName: "",
  transactionType: "",
  transactionDate: _todayDate(),
  transactionAmount: "",
  dueDate: _todayDate(),
  refNo: "",

  redeliveryDate: "",
  receiveAmount: "",
  beneficiary: "",
  bankAccNo: "",

  sbu: "",
  salesOrg: "",
  narration: "",
  receivedDate: "",
  journalDate: _todayDate(),
  voyageDays: "",
};

export default function TimeCharterForm() {
  const { type, id } = useParams();
  const [loading, setLoading] = useState(false);
  const [vesselDDL, setVesselDDL] = useState([]);
  const [transactionNameDDL, setTransactionNameDDL] = useState([]);
  const [beneficiaryDDL, setBeneficiaryDDL] = useState([]);
  const [sbuList, setSBUList] = useState([]);
  const { state } = useLocation();
  const [offHireDuration, setOffHireDuration] = useState(0);
  const [dataForEdit, setDataForEdit] = useState({});
  const [singleData, setSingleData] = useState([]);
  const [accNoDDL, setAccNoDDL] = useState([]);

  // get user profile data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    if (id) {
      getTransactionById(
        id,
        setSingleData,
        setDataForEdit,
        ({ voyageId, vesselId, tctransactionId, hireTransactionId }) => {
          getPreOffHires(
            accId,
            buId,
            vesselId,
            voyageId,
            hireTransactionId,
            tctransactionId,
            setOffHireDuration
          );
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    getVesselDDL(accId, buId, setVesselDDL);
    GetTransactionNameList(setTransactionNameDDL);
    getOwnerInfoDDL({ setter: setBeneficiaryDDL });
    getSBUListDDL(accId, buId, setSBUList);
    getAccDDL(accId, buId, setAccNoDDL);
  }, [accId, buId, id]);

  const saveHandler = (values, cb) => {
    if (!id) {
      const payload = {
        objHeader: {
          tctransactionId: 0,
          accountId: accId,
          businessUnitId: buId,
          vesselId: values?.vesselName?.value,
          vesselName: values?.vesselName?.label,
          voyageId: +values?.voyageNo?.value,
          voyageNo: values?.voyageNo?.label,
          currentTransactionId: values?.transactionName?.value || 0,
          ownerid: values?.invoiceHireData?.ownerid || 0,
          ownerName: values?.invoiceHireData?.ownerName || "",
          refNo: values?.invoiceHireData?.refNo || "",
          cpdtd: _dateFormatter(values?.invoiceHireData?.cpdtd) || _todayDate(),
          chtrId: values?.invoiceHireData?.chtrId || 0,
          chtrName: values?.invoiceHireData?.chtrName || "",
          dueDate: values?.dueDate || _todayDate(),
          deliveryDate: values?.invoiceHireData?.deliveryDate || new Date(),
          deliveryAddressId: values?.invoiceHireData?.deliveryAddressId || 0,
          deliveryAddress: values?.invoiceHireData?.deliveryAddress || "",
          reDeliveryAddressId:
            values?.invoiceHireData?.reDeliveryAddressId || 0,
          reDeliveryAddress: values?.invoiceHireData?.reDeliveryAddress || "",
          totalDuration: parseFloat(
            getDifference(
              values?.invoiceHireData?.deliveryDate,
              values?.redeliveryDate
            )
          ),
          brokerage: values?.invoiceHireData?.brokerage || 0,
          comm: values?.invoiceHireData?.comm || 0,
          lsfoprice: values?.invoiceHireData?.lsfoprice || 0,
          lsmgoprice: values?.invoiceHireData?.lsmgoprice || 0,
          dailyHire: values?.invoiceHireData?.dailyHire || 0,
          ilohc: values?.invoiceHireData?.ilohc || 0,
          cveday: values?.invoiceHireData?.cveday || 0,
          actionBy: userId,

          hireTransactionId: values?.transactionName?.value || 0,
          dteReDeliveryDate: values?.redeliveryDate,
          hsifoprice: 0,
          mgoprMt: 0,

          bankId: values?.beneficiary?.bankId,
          bankName: values?.beneficiary?.bankName,
          bankAccountNo: values?.beneficiary?.ownerBankAccount,
          bankAddress: values?.beneficiary?.bankAddress,
          swiftCode: values?.beneficiary?.swiftCode,
          beneficiaryId: values?.beneficiary?.value,
          beneficiaryName: values?.beneficiary?.label,
        },
        objRows: values?.rowData
          ?.filter((item) => item?.isChecked)
          ?.map((item, index) => {
            return {
              ...item,
              sl: index + 1,
            };
          }),
        offHireIds: values?.offHireIds,
      };
      saveTimeCharterTransaction(payload, setLoading, cb);
    } else {
      const {
        objHeader: {
          bankAccountNo,
          bankAddress,
          bankId,
          bankName,
          beneficiaryId,
          beneficiaryName,
          brokerage,
          chtrId,
          chtrName,
          comm,
          cpdtd,
          cveday,
          dailyHire,
          deliveryAddress,
          deliveryAddressId,
          deliveryDate,
          dueDate,
          endPortName,
          // hireTransactionId,
          hsifoprice,
          ilohc,
          journalVoucherCode,
          journalVoucherId,
          lsfoprice,
          lsmgoprice,
          mgoprMt,
          ownerName,
          ownerid,
          reDeliveryAddress,
          reDeliveryAddressId,
          refNo,
          startPortName,
          swiftCode,
          tctransactionId,
          totalReceivedAmount,
        },
      } = dataForEdit;
      const payload = {
        objHeader: {
          tctransactionId: values?.tcTransactionId,
          accountId: accId,
          businessUnitId: buId,
          vesselId: values?.vesselName?.value,
          vesselName: values?.vesselName?.label,
          voyageId: +values?.voyageNo?.value,
          voyageNo: values?.voyageNo?.label,
          hireTransactionId: values?.transactionName?.value || 0,
          ownerid: ownerid,
          ownerName: ownerName,
          refNo: refNo,
          cpdtd: cpdtd,
          chtrId: chtrId,
          chtrName: chtrName,
          dueDate: dueDate,
          deliveryDate: deliveryDate,
          dteReDeliveryDate: values?.redeliveryDate,
          hsifoprice: hsifoprice,
          mgoprMt: mgoprMt,
          deliveryAddressId: deliveryAddressId,
          deliveryAddress: deliveryAddress,
          reDeliveryAddressId: reDeliveryAddressId,
          reDeliveryAddress: reDeliveryAddress,
          totalDuration: parseFloat(
            getDifference(deliveryDate, values?.redeliveryDate)
          ),
          brokerage: brokerage,
          comm: comm,
          lsfoprice: lsfoprice,
          lsmgoprice: lsmgoprice,
          dailyHire: dailyHire,
          ilohc: ilohc,
          cveday: cveday,
          actionBy: userId,
          startPortName: startPortName,
          endPortName: endPortName,
          totalReceivedAmount: totalReceivedAmount,
          bankId: bankId,
          bankName: bankName,
          bankAccountNo: bankAccountNo,
          bankAddress: bankAddress,
          swiftCode: swiftCode,
          beneficiaryId: beneficiaryId,
          beneficiaryName: beneficiaryName,
          journalVoucherId: journalVoucherId,
          journalVoucherCode: journalVoucherCode,
        },
        objRows: values?.rowData
          ?.filter((item) => item?.isChecked)
          ?.map((item) => {
            return {
              ...item,
              tctransactionId: tctransactionId,
            };
          }),
        offHireIds: dataForEdit?.offHireIds,
      };
      editTimeCharterTransaction(payload, setLoading);
    }
  };

  return (
    <>
      {loading && <Loading />}
      <Form
        title={
          type === "edit"
            ? "Edit Time Charter Transaction"
            : type === "view"
            ? "View Time Charter Transaction"
            : "Create Time Charter Transaction"
        }
        initData={
          id
            ? {
                ...state,
                vesselName: {
                  value: state?.vesselId,
                  label: state?.vesselName,
                },
                voyageNo: { value: state?.voyageNoId, label: state?.voyageNo },
                transactionName: {
                  value: state?.transactionId,
                  label: state?.transactionName,
                },
                transactionType: {
                  value: state?.transactionTypeId,
                  label: state?.transactionTypeName,
                },
                hireTypeName: {
                  value: state?.hireTypeId,
                  label: state?.hireTypeName,
                },
                transactionDate: _dateFormatter(state?.transactionDate),
                dueDate: _dateFormatter(dataForEdit?.objHeader?.dueDate),
                redeliveryDate: dataForEdit?.objHeader?.dteReDeliveryDate,
              }
            : {
                ...initData,
                ...state,
                hireTypeName: state?.shipType,
                beneficiary: {
                  value: state?.beneficiaryId,
                  label: state?.beneficiaryName,
                },
              }
        }
        saveHandler={saveHandler}
        viewType={type}
        vesselDDL={vesselDDL}
        setLoading={setLoading}
        transactionNameDDL={transactionNameDDL}
        beneficiaryDDL={beneficiaryDDL}
        setBeneficiaryDDL={setBeneficiaryDDL}
        id={id}
        sbuList={sbuList}
        setOffHireDuration={setOffHireDuration}
        offHireDuration={offHireDuration}
        dataForEdit={dataForEdit}
        setDataForEdit={setDataForEdit}
        singleData={singleData}
        setSingleData={setSingleData}
        accNoDDL={accNoDDL}
      />
    </>
  );
}
