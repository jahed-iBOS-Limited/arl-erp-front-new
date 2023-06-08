/* eslint-disable no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  ExtendTransportOrganization,
  getTransportOrganizationView,
} from "../helper";
import Loading from "../../../../_helper/_loading";
import { toast } from "react-toastify";
const initData = {
  businessUnitName: "",
  transportOrganizationName: "",
};
export default function TransportOrgExtendForm({
  history,
  match: {
    params: { extend },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");
  const params = useParams();

  useEffect(() => {
    if (extend) {
      getTransportOrganizationView(extend, setSingleData, setRowDto);
    }
  }, [extend]);

  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);
  const { profileData, selectedBusinessUnit } = storeData;
  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId) {
      if (params?.extend) {
        const newRowDto = rowDto?.map((item) => {
          return {
            accountId: +profileData?.accountId,
            transportOrganizationId: +params?.extend,
            businessUnitId: item?.businessUnitName?.value,
            numDriverPerKmallowance: 0,
            numMinimumKm: 0,
            numMaximumKm: 0,
            numDownTripAllowance: 0,
            configId: 0,
          };
        });
        const payload = newRowDto;
        ExtendTransportOrganization(payload, cb, setDisabled);
      }
    } else {
      setDisabled(false);
    }
  };

  const setter = (payload) => {
    const checkDuplicate = rowDto?.filter(
      (item) =>
        item?.businessUnitName?.value === payload?.businessUnitName?.value
    );
    if (checkDuplicate?.length === 0) {
      setRowDto([...rowDto, payload]);
    } else {
      toast.warning("Business Unit Name Already Exists", {
        toastId: "Business Unit Name Already Exist",
      });
    }
  };

  const remover = (index) => {
    const filterArr = rowDto.filter((itm, idx) => idx !== index);
    setRowDto(filterArr);
  };

  return (
    <IForm
      title="Extend Transport Organization"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={extend ? singleData : initData}
        saveHandler={saveHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={extend}
        setter={setter}
        remover={remover}
        setRowDto={setRowDto}
        rowDto={rowDto}
        id={extend}
      />
    </IForm>
  );
}
