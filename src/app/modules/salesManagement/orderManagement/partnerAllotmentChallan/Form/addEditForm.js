import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import {
  createSecondaryDelivery_api,
  GetSecondaryDeliveryById,
  GetSecondatDeliveryItemInfo_api,
  EditSecondaryDelivery_api,
  getSalesCenterDDL,
  GetAllotmentDetailInfo,
} from "../helper";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "./../../../../_helper/_todayDate";
import { useLocation, useParams, useHistory } from "react-router-dom";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

const initData = {
  id: undefined,
  sbu: "",
  shippoint: "",
  commission: "",
  soldToParty: "",
  supplierName: "",
  supplierDate: _todayDate(),
  itemName: "",
  itemPrice: "",
  quantity: "0",
  totalPrice: "",
  supplierCountry: "",
  deliveryAddress: "",
  lcNo: "",
  lcDate: _todayDate(),
  bankName: "",
  permissionNumber: "",
  govtPrice: "",
  permissionDate: _todayDate(),
  challanDate: _todayDate(),
  shipName: "",
  color: "",
  district: "",
  upazila: "",
  salesCenter: "",
  accOfPartner: "",
  isAccOfPartner: true,
};

export default function PartnerAllotmentChallanForm({ deliveryLandingData }) {
  console.log("object",deliveryLandingData);
  const { allotmentId } = useParams();
  const history = useHistory();
  const [deliveryItemInfo, setDeliveryItemInfo] = useState([]);
  const [getAllotmentDetailInfo, setGetAllotmentDetailInfo] = useState();
  const [secondaryDeliveryById, setSecondaryDeliveryById] = useState("");
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [salesCenterDDL, setSalesCenterDDL] = useState([]);
  const { state: landingData } = useLocation();
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (deliveryLandingData?.deliveryLandingRowBtnEnter) {
        const payload = {
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          fromCountryId: 0,
          fromCountryName: values?.supplierCountry,
          bankId: 0,
          bankName: values?.bankName,
          supplierId: values?.supplierName?.value || 0,
          deliveryAddress: values?.deliveryAddress,
          lcnumber: values?.lcNo,
          dteLcdate: values?.lcDate,
          permissionNumber: values?.permissionNumber,
          dtePermissionDate: values?.permissionDate,
          numDeclaredPrice: +values?.govtPrice,
          numComission: +values?.commission,
          shipName: values?.shipName,
          secondaryDeliveryId: deliveryLandingData?.commisssionDlvId || 0,
          // otehr's payload
          shippointId: +values?.shippoint?.value,
          soldToPartnerId: +landingData?.customerId,
          itemId: +values?.itemName?.value,
          itemName: values?.itemName?.label,
          numQuantity: +values?.quantity,
          uoMid: values?.fUomId,
          uoMname: values?.fUomName || "",
          secondaryUoMid: values?.sUomId,
          secondaryUoMname: values?.sUomName || "",
          numFirstPrice: +values?.itemPrice,
          numSecondPrice: 0,
          numTotalPrice: +values?.totalPrice,
          isStatus: true,
          chalanDate: values?.challanDate,
          referenceId: +allotmentId,
          referenceTypeId: 1,
          color: values?.color,
          district: values?.district,
          upazila: values?.upazila,
          supplierName: selectedBusinessUnit?.label,
          supplierAddress: selectedBusinessUnit?.address,
          accOfPartnerId: values?.accOfPartner?.value || 0,
          accOfParnterName: values?.accOfPartner?.label || "",
        };
        EditSecondaryDelivery_api({
          setDisabled,
          cb,
          data: payload,
          setAllotmentChallanModel:
            deliveryLandingData?.setAllotmentChallanModel,
        });
      } else {
        const payload = {
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          shippointId: +values?.shippoint?.value,
          soldToPartnerId: +landingData?.customerId,
          itemId: +values?.itemName?.value,
          itemName: values?.itemName?.label,
          fromCountryId: 0,
          fromCountryName: values?.supplierCountry,
          bankId: 0,
          bankName: values?.bankName,
          numQuantity: +values?.quantity,
          uoMid: values?.fUomId,
          uoMname: values?.fUomName || "",
          secondaryUoMid: values?.sUomId,
          secondaryUoMname: values?.sUomName || "",
          numFirstPrice: +values?.itemPrice,
          numSecondPrice: 0,
          numTotalPrice: +values?.totalPrice,
          supplierId: 0,
          deliveryAddress: values?.deliveryAddress,
          lcnumber: values?.lcNo,
          dteLcdate: values?.lcDate,
          permissionNumber: values?.permissionNumber,
          dtePermissionDate: values?.permissionDate,
          numDeclaredPrice: +values?.govtPrice,
          numComission: +values?.commission,
          isStatus: true,
          chalanDate: values?.challanDate,
          referenceId: +allotmentId,
          referenceTypeId: 1,
          shipName: values?.shipName,
          color: values?.color,
          district: values?.district,
          upazila: values?.upazila,
          supplierName: selectedBusinessUnit?.label,
          supplierAddress: selectedBusinessUnit?.address,
          salesCenterId: values?.salesCenter?.value,
          accOfPartnerId: values?.accOfPartner?.value || 0,
          accOfParnterName: values?.accOfPartner?.label || "",
          actionBy: profileData?.userId,
        };
        createSecondaryDelivery_api({
          setDisabled,
          cb,
          data: payload,
          history,
        });
      }
    } else {
      setDisabled(false);
    }
  };
  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value && allotmentId) {
      GetSecondatDeliveryItemInfo_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        allotmentId,
        setDeliveryItemInfo,
        setDisabled
      );
      GetAllotmentDetailInfo(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        allotmentId,
        setGetAllotmentDetailInfo,
        setDisabled
      );
    }
    getSalesCenterDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setSalesCenterDDL
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit, allotmentId]);

  // If user delivery landing Allotment Challan btn click
  useEffect(() => {
    if (deliveryLandingData?.deliveryLandingRowBtnEnter) {
      GetSecondaryDeliveryById(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        deliveryLandingData?.commisssionDlvId,
        setSecondaryDeliveryById
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveryLandingData]);

  return (
    <IForm
      title={"Create Partner Allotment Challan"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenBack={deliveryLandingData?.isBackBtn || false}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={
          secondaryDeliveryById || {
            ...initData,
            ...deliveryItemInfo,
            maxQuantity: landingData?.totalPendingQty,
            itemName: deliveryItemInfo?.itemId
              ? {
                  value: deliveryItemInfo?.itemId,
                  label: deliveryItemInfo?.itemName,
                }
              : "",
            totalPrice: +deliveryItemInfo?.itemPrice * +initData?.quantity,

            /* Last Added */
            supplierCountry: getAllotmentDetailInfo?.supplierCountry || "",
            lcNo: getAllotmentDetailInfo?.lcNo || "",
            lcDate: _dateFormatter(getAllotmentDetailInfo?.lcDate) || "",
            bankName:
              (getAllotmentDetailInfo?.bankName &&
                getAllotmentDetailInfo?.bankName +
                  ", " +
                  (getAllotmentDetailInfo?.branchName || "")) ||
              "",
            permissionNumber: getAllotmentDetailInfo?.permissionNo || "",
            permissionDate:
              _dateFormatter(getAllotmentDetailInfo?.permissionDate) || "",
            shipName: getAllotmentDetailInfo?.shipName || "",
            color: getAllotmentDetailInfo?.color || "",
            district: getAllotmentDetailInfo?.district || "",
            upazila: getAllotmentDetailInfo?.upazilla || "",
          }
        }
        saveHandler={saveHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        allotmentId={allotmentId}
        deliveryLandingData={deliveryLandingData}
        salesCenterDDL={salesCenterDDL}
      />
    </IForm>
  );
}
