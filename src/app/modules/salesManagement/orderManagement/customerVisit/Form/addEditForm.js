import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { getDistributionChannelDDL_api } from "../../../report/customerSalesTargetReport/helper";
import {
  getCustomerVisitById,
  getCategoryDDL_api,
  getTerritoryDDL_api,
  saveCustomerVisit,
  editCustomerVisit,
} from "../helper";
import Form from "./form";

const initData = {
  customerName: "",
  customerPhone: "",
  customerAddress: "",
  contractPersonName: "",
  contractPersonPhone: "",
  contractPersonDesignation: "",
  conversionDate: "",
  conversionDeadline: _dateFormatter(moment().add(30, "days")),
  isConversionStatus: "",
  remarks: "",

  territory: "",
  category: "",
};

export function CustomerVisitForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [territoryDDL, setTerritoryDDL] = useState([]);
  const [categoryDDL, setCategoryDDL] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [channelList, setChannelList] = useState([]);
  const params = useParams();

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    getTerritoryDDL_api(
      profileData?.accountId,
      selectedBusinessUnit.value,
      setTerritoryDDL
    );
    getCategoryDDL_api(
      profileData?.accountId,
      selectedBusinessUnit.value,
      setCategoryDDL
    );
    getDistributionChannelDDL_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setChannelList
    );
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (params?.id) {
      getCustomerVisitById(params?.id, setSingleData, setDisabled);
    }
  }, [profileData, selectedBusinessUnit, params]);

  const saveHandler = async (values, cb) => {
    if (+id) {
      const payload = {
        customerVisitId: +params?.id,
        isConversionStatus: true,
        remarks: values?.remarks || "",
        isActive: true,
      };
      editCustomerVisit(payload, setDisabled);
    } else {
      const payload = {
        // customerVisitId: 0,
        territoryId: values?.territory?.value,
        territoryName: values?.territory?.label,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        actionBy: profileData?.userId,
        isConversionStatus: false,
        customerPotentialCategoryId: values?.category?.value || 0,
        customerPotentialCategoryName: values?.category?.label || "",
        customerPotentialCategoryTypeName: values?.category?.type || "",
        customerName: values?.customerName,
        customerPhone: values?.customerPhone,
        customerAddress: values?.customerAddress,
        contractPersonName: values?.contractPersonName,
        contractPersonPhone: values?.contractPersonPhone,
        contractPersonDesignation: values?.contractPersonDesignation,
        conversionDate: values?.conversionDate,
        conversionDeadline: values?.conversionDeadline,
        remarks: values?.remarks,
      };
      saveCustomerVisit(payload, cb, setDisabled);
    }
  };

  return (
    <IForm
      title={id ? "Edit Customer Visit" : "Create Customer Visit"}
      submitBtnText={id ? "Update" : "Save"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={id ? singleData : initData}
        saveHandler={saveHandler}
        profileData={profileData}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        territoryDDL={territoryDDL}
        categoryDDL={categoryDDL}
        channelList={channelList}
        isEdit={id || false}
        setDisabled={setDisabled}
      />
    </IForm>
  );
}
