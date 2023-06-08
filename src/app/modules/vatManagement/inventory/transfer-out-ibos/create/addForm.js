/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { useLocation, useParams } from "react-router-dom";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  // getVatAdjustmentById,
  editVatAdjustment,
  getTaxBranchDDL,
  createItemTransferOutIbos,
  GetToBranchDDL_api,
  getInventoryTransferDDL,
  GetDistributionChannelDDL,
} from "../helper";
import Loading from "../../../../_helper/_loading";

const initData = {
  taxBranchAddress: "",
  deliveryNo: "",
  deliveryAddress: "",
  vehicleNo: "",
  deliveryDate: _todayDate(),
  transferTo: "",
  distributionChannel: "",
};

export default function TransferOutIbosCreateForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [objProps, setObjprops] = useState({});
  const { state: landingData } = useLocation();
  const params = useParams();
  const [toBranch, setToBranch] = useState([]);
  const [taxBranchDDL, setTaxBranchDDL] = useState([]);
  const [inventoryTransferDDL, setInventoryTransferDDL] = useState([]);
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);

  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);
  const { profileData, selectedBusinessUnit } = storeData;

  useEffect(() => {
    if (params?.id) {
      // getVatAdjustmentById(params?.id, setSingleData);
    }
  }, [params]); // location

  useEffect(() => {
    if (
      profileData.accountId &&
      selectedBusinessUnit?.value &&
      profileData?.userId
    ) {
      getTaxBranchDDL(
        profileData?.userId,
        profileData.accountId,
        selectedBusinessUnit?.value,
        setTaxBranchDDL
      );
      GetToBranchDDL_api(
        profileData.accountId,
        selectedBusinessUnit.value,
        setToBranch
      );
      getInventoryTransferDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setInventoryTransferDDL
      );
      GetDistributionChannelDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setDistributionChannelDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

  const saveHandler = async (values, cb) => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      if (params?.id) {
        const payload = {
          adjustmentId: +params?.id,
          taxTransactionTypeId: +values?.taxTransactionType?.value,
          taxBranchId: +values?.taxBranchName?.value,
          taxBranchName: values?.taxBranchName?.label,
          taxBranchAddress: values?.taxBranchAddress,
          adjustmentDate: values?.adjustmentDate,
          adjustmentReason: values?.adjustmentReason,
          actionBy: +profileData?.userId,
          componentId: +values?.componentName?.value,
          amount: +values?.amount,
          otherBranchId: values?.transferTo?.value,
          otherBranchName: values?.transferTo?.label,
          otherBranchAddress: values?.transferTo?.name,
          distributionChanelId: values?.distributionChannel?.value,
        };

        editVatAdjustment(payload, setDisabled);
      } else {
        const payload = {
          accountId: +profileData?.accountId,
          businessUnitId: +selectedBusinessUnit?.value,
          businessUnitName: profileData?.businessUnitName,
          taxBranchId: +landingData?.selectedTaxBranchDDL?.value || 0,
          taxBranchName: landingData?.selectedTaxBranchDDL?.label || "",
          taxBranchAddress: values?.selectedTaxBranchDDL?.branchAddress || "",
          deliveryNo: values?.deliveryNo?.value,
          deliveryAddress: values?.deliveryAddress || "",
          vehicleNo: values?.vehicleNo || "",
          deliveryDate: values?.deliveryDate || "",
          actionBy: +profileData?.userId,
          otherTaxBranchId: values?.transferTo?.value || 0,
          otherTaxBranchName: values?.transferTo?.label || "",
          otherTaxBranchAddress: values?.transferTo?.name || "",
          distributionChanelId: values?.distributionChannel?.value,
        };

        createItemTransferOutIbos(payload, cb, setDisabled, () => {
          getInventoryTransferDDL(
            profileData?.accountId,
            selectedBusinessUnit?.value,
            setInventoryTransferDDL
          );
        });
      }
    } else {
      setDisabled(false);
    }
  };

  return (
    <IForm
      title={"Create Transfer-out For iBOS"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={params?.id ? singleData : initData}
        saveHandler={saveHandler}
        rowDto={rowDto}
        accountId={profileData?.accountId}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        setRowDto={setRowDto}
        setSingleData={setSingleData}
        isEdit={params?.id || false}
        setTaxBranchDDL={setTaxBranchDDL}
        taxBranchDDL={taxBranchDDL}
        landingData={landingData}
        toBranch={toBranch}
        inventoryTransferDDL={inventoryTransferDDL}
        distributionChannelDDL={distributionChannelDDL}
      />
    </IForm>
  );
}
