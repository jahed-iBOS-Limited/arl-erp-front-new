import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { toast } from "react-toastify";
import { _todayDate } from "../../../../../_helper/_todayDate";
import {
  billRegisterForSalesCommission,
  getDistributionChannelDDL,
  GetSalesCommissionReport,
  GetShipPointDDL,
  getSoldToPartner,
  GetAccOfPartnerDDl_api
} from "../helper";
import Form from "./form";

const SalesCommissionForm = () => {
  const initData = {
    shipPoint: "",
    remarks: "",
    distributionChannel: "",
    partner: "",
    accOfPartner: "",
  };

  const [open, setOpen] = React.useState(false);
  const [fileObjects, setFileObjects] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shipPointDDL, setShipPointDDL] = useState([]);
  const [uploadImage, setUploadImage] = useState([]);
  const [partnerDDL, setPartnerDDL] = useState([]);
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);
  const [accOfPartnerDDl, setAccOfPartnerDDl] = useState([]);
  const { state: headerData } = useLocation();

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if(profileData?.accountId && selectedBusinessUnit?.value){
      GetShipPointDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setShipPointDDL
      );
      getDistributionChannelDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setDistributionChannelDDL
      );
      GetAccOfPartnerDDl_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setAccOfPartnerDDl
      );
    }
  
  }, [profileData, selectedBusinessUnit]);

  const getData = (ShipPointId, partnerId) => {
    GetSalesCommissionReport(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      ShipPointId,
      partnerId,
      setGridData,
      setLoading
    );
  };

  const GetSoldToPartner = (DId) => {
    getSoldToPartner(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      DId,
      setPartnerDDL
    );
  };

  // saveHandler
  const saveHandler = (values, cb) => {
    // Get array of id from uploaded images
    const images = uploadImage?.map((item) => item?.id);

    // Get array of refId from selected items
    const filterData = gridData?.filter((item) => item?.isSelect === true);
    const IDs = filterData?.map((item) => item?.secondaryDeliveryId);

    //
    if (IDs?.length < 1) return toast.warn("Please select at least one item");

    if (profileData?.accountId && selectedBusinessUnit?.value) {
      const payload = {
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        refType: headerData?.billType?.value,
        plantId: headerData?.plant?.value,
        sbuId: headerData?.sbu?.value,
        billRefNo: "",
        refIds: IDs,
        remarks: values?.remarks,
        billRegisterDate: _todayDate(),
        billImages: images,
        actionBy: profileData?.userId,
      };

      if (
        filterData?.every(
          (item) => item?.accOfPartnerId === filterData?.[0]?.accOfPartnerId
        )
      ) {
        billRegisterForSalesCommission(payload, () => {
          getData(values?.shipPoint?.value, values?.partner?.value);
        });
        return;
      } else {
        toast.error("Account Of Name Should Be Same");
      }
    }
  };
  return (
    <>
      <Form
        initData={initData}
        saveHandler={saveHandler}
        loading={loading}
        headerData={headerData}
        gridData={gridData}
        shipPointDDL={shipPointDDL}
        getData={getData}
        partnerDDL={partnerDDL}
        getSoldToPartner={GetSoldToPartner}
        distributionChannelDDL={distributionChannelDDL}
        open={open}
        setOpen={setOpen}
        setFileObjects={setFileObjects}
        fileObjects={fileObjects}
        setUploadImage={setUploadImage}
        setGridData={setGridData}
        accOfPartnerDDl={accOfPartnerDDl}
      />
    </>
  );
};

export default SalesCommissionForm;
