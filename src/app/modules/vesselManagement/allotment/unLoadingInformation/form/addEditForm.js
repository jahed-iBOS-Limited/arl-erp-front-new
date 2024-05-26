/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router";
import { toast } from "react-toastify";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import { GetDomesticPortDDL } from "../../generalInformation/helper";
import {
  // getMotherVesselDDL,
  GetShipPointDDL,
} from "../../loadingInformation/helper";
import {
  editUnloadinfo,
  getInfoForUnloading,
  GetLighterDestinationDDL,
  getLightersByVesselNLighterDestination,
  getLoadingInfoByVoyageNo,
  getUnloadingInformationById,
} from "../helper";
import Form from "./form";
import { isWaitForSecondsAfterClick } from "../../../../_helper/isWaitForSecondsAfterClick";

const initData = {
  shipPoint: "",
  lighterDestination: "",
  programNo: "",
  lighterVessel: "",
  motherVessel: "",
  receivedAt: "",
  unloadingPort: "",
  unloadingStart: "",
  unloadingDate: _todayDate(),
  unloadedQty: "",
  unloadingComplete: "",
  isComplete: "",
  item: "",
  port: "",
};

export default function UnLoadingInformationForm() {
  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const { id, type } = useParams();
  const { state } = useLocation();
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [, postData, isLoading] = useAxiosPost();
  const [singleData, setSingleData] = useState({});
  const [lighterDDL, setLighterDDL] = useState([]);
  const [lighterDestinationDDL, setLighterDestinationDDL] = useState([]);
  const [motherVesselDDL, getMotherVesselDDL] = useAxiosGet([]);
  const [shipPointDDL, setShipPointDDL] = useState([]);
  const [pendingQty, getPendingQty] = useAxiosGet();
  const [portDDL, setPortDDL] = useState();
  const [
    dateWiseQuantity,
    getDateWiseQuantity,
    ,
    setDateWiseQuantity,
  ] = useAxiosGet();
  const [organizationDDL, getOrganizationDDL] = useAxiosGet();

  const pendingQuantity = (
    motherVesselId,
    lighterVesselId,
    lighterDestinationId
  ) => {
    getPendingQty(
      `/tms/LigterLoadUnload/GetLighterLoadUnLoadQuantity?MotherVesselId=${motherVesselId}&LighterVesselId=${lighterVesselId}&DestinationId=${lighterDestinationId}`
    );
  };

  useEffect(() => {
    getOrganizationDDL(
      `/tms/LigterLoadUnload/GetG2GBusinessPartnerDDL?BusinessUnitId=${buId}&AccountId=${accId}`
    );
    if (!type || type !== "view") {
      GetShipPointDDL(accId, buId, setShipPointDDL);
      // getMotherVesselDDL(accId, buId, setMotherVesselDDL);
      GetLighterDestinationDDL(accId, buId, setLighterDestinationDDL);
      GetDomesticPortDDL(setPortDDL);
    }
    if (id) {
      if (type === "edit") {
        getUnloadingInformationById(
          state?.rowId,
          id,
          state?.lighterVesselId,
          setSingleData,
          setLoading,
          (resData) => {
            pendingQuantity(
              resData?.motherVessel?.value,
              resData?.lighterVessel?.value,
              resData?.lighterDestination?.value
            );
            // getPendingQty(
            //   `/tms/LigterLoadUnload/GetLighterLoadUnLoadQuantity?MotherVesselId=${}&LighterVesselId=${}&DestinationId=${}`
            // );
          }
        );
      } else {
        getLoadingInfoByVoyageNo(
          state?.rowId,
          id,
          state?.lighterVesselId,
          setSingleData,
          setRowData,
          setLoading,
          type,
          (resData) => {
            pendingQuantity(
              resData?.motherVessel?.value,
              resData?.lighterVessel?.value,
              resData?.lighterDestination?.value
            );
          }
        );
      }
    }
  }, [accId, buId, type, id]);

  const getVessels = (values) => {
    getMotherVesselDDL(
      `/wms/FertilizerOperation/GetMotherVesselByOrganizationDDL?AccountId=${accId}&BusinessUnitId=${buId}&PortId=${values
        ?.port?.value || 0}&OrganizationId=${values?.organization?.value || 0}`
    );
  };

  const saveHandler = (values, cb) => {
    if(isWaitForSecondsAfterClick()){
      return;
    }

    if (type === "modify") {
      // if (pendingQty?.pendingQty < values?.unloadedQty) {
      //   return toast.warn(
      //     "Sorry, you can't unload more than pending quantity!"
      //   );
      // }
      // const payload = {
      //   voyageNo: +id,
      //   rowId: singleData?.rowId,
      //   receivedDate: values?.receivedAt,
      //   unloadStartDate: values?.unloadingStart,
      //   unloadCompleteDate: values?.unloadingComplete,
      //   receiveQnt: values?.unloadedQty,
      //   unLoadDateDetails: values?.unloadingDate,
      //   actionby: userId,
      // };

      const payload = {
        row: {
          voyageNo: +id,
          rowId: singleData?.rowId,
          receivedDate: values?.receivedAt,
          unloadStartDate: values?.unloadingStart,
          unloadCompleteDate: values?.unloadingComplete,
          shipPointId: values?.shipPoint?.value,
          shipPointName: values?.shipPoint?.label,
        },
        rowDetails:
          dateWiseQuantity?.rowDataList?.[0]?.unLoadDetails?.length > 0
            ? dateWiseQuantity?.rowDataList?.[0]?.unLoadDetails?.map(
                (data, i) => ({
                  autoId: data?.autoId,
                  unloadRowId: dateWiseQuantity?.rowDataList?.[0]?.rowId,
                  unLoadingDateDetails: data?.unloadDateDetails || "",
                  receiveQuantity: data?.receiveQuantityDeatails || 0,
                  updateBy: userId,
                })
              )
            : [],
      };

      editUnloadinfo(payload, () => cb());
    } else {
      const payload = {
        shipPointId: values?.shipPoint?.value,
        shipPointName: values?.shipPoint?.label,
        lighterVesselId: values?.lighterVessel?.value,
        motherVesselId: values?.motherVessel?.value,
        lighterVesselName: values?.lighterVessel?.label,
        receivedDate: values?.receivedAt,
        unloadStartDate: values?.unloadingStart,
        unloadCompleteDate: values?.isComplete ? values?.unloadingComplete : "",
        actionby: userId,
        receiveQnt: values?.unloadedQty,
        unLoadingDate: values?.unloadingStart,
        unLoadDateDetails: values?.unloadingDate,
      };
      postData(
        `/tms/LigterLoadUnload/CreateLighterUnloadingInfo`,
        payload,
        () => {
          cb();
        },
        true
      );
    }
  };

  const onChangeHandler = (fieldName, values, currentValue, setFieldValue) => {
    switch (fieldName) {
      case "lighterDestination":
        setFieldValue("lighterDestination", currentValue);
        setFieldValue("lighterVessel", "");
        setFieldValue("motherVessel", "");
        setFieldValue("programNo", "");
        break;

      // case "allotment":
      //   setFieldValue("allotment", currentValue);
      //   break;

      case "motherVessel":
        setFieldValue("motherVessel", currentValue);
        setFieldValue("lighterVessel", "");
        setFieldValue("programNo", {
          label: currentValue?.programNo,
          value: currentValue?.programNo,
        });

        if (currentValue) {
          console.log("currentValue", currentValue);

          getLightersByVesselNLighterDestination(
            values?.lighterDestination?.value,
            currentValue?.value,
            setLighterDDL,
            setLoading,
            (e) => {
              // setFieldValue("programNo", {
              //   label: e?.programNo,
              //   value: e?.programNo,
              // });
            }
          );
          // getAllotmentDDLByMotherVessel(
          //   currentValue?.value,
          //   buId,
          //   setAllotmentDDL,
          //   setLoading
          // );
        }
        break;

      case "lighterVessel":
        setFieldValue("lighterVessel", currentValue);
        if (currentValue) {
          getInfoForUnloading(
            values?.lighterDestination?.value,
            values?.motherVessel?.value,
            currentValue?.value,
            setLoading,
            (resData) => {
              // setFieldValue("shipPoint", {
              //   value: resData?.shipPointId,
              //   label: resData?.shipPointName,
              // });
              setFieldValue("item", {
                value: resData?.itemId,
                label: resData?.itemName,
              });
              setFieldValue("unloadedQty", resData?.surveyQnt);
            }
          );
          pendingQuantity(
            values?.motherVessel?.value,
            currentValue?.value,
            values?.lighterDestination?.value
          );
        }
        break;

      case "shipPoint":
        setFieldValue("shipPoint", currentValue);
        break;

      default:
        break;
    }
  };

  return (
    <>
      {(loading || isLoading) && <Loading />}
      <div className="mt-0">
        <Form
          viewType={type}
          rowData={rowData}
          lighterDDL={lighterDDL}
          lighterDestinationDDL={lighterDestinationDDL}
          saveHandler={saveHandler}
          shipPointDDL={shipPointDDL}
          motherVesselDDL={motherVesselDDL}
          onChangeHandler={onChangeHandler}
          initData={
            id
              ? {
                  ...singleData,
                  unloadedQty:
                    type === "edit"
                      ? pendingQty?.pendingQty
                      : singleData?.unloadedQty,
                }
              : initData
          }
          pendingQty={pendingQty}
          getVessels={getVessels}
          portDDL={portDDL}
          dateWiseQuantity={dateWiseQuantity}
          getDateWiseQuantity={getDateWiseQuantity}
          setDateWiseQuantity={setDateWiseQuantity}
          state={state}
          organizationDDL={organizationDDL}
          pendingQuantity={pendingQuantity}
        />
      </div>
    </>
  );
}
