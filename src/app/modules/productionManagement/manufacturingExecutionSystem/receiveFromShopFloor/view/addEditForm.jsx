/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import { useLocation, useParams } from "react-router-dom";
import {
  getRefferenceCode_api,
  getSingleData,
} from "../helper";
import { isUniq } from "../../../../_helper/uniqChecker";
import ICustomCard from "../../../../_helper/_customCard";

export default function ReceiveFromShopFloorViewForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [rowDto, setRowDto] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [singleData, setSingleData] = useState("");
  const location = useLocation();
  const params = useParams();
  const [itemDDL, setItemDDL] = useState([]);
  const [referrenceCodeDDL, setRefferenceCodeDDL] = useState([]);

  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);
  const { profileData, selectedBusinessUnit } = storeData;

  const receiveFromShopFloorInitData = useSelector(
    (state) => state.localStorage.receiveFromShopFloorInitData
  );

  useEffect(() => {
    getRefferenceCode_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      receiveFromShopFloorInitData?.warehouse?.value,
      setRefferenceCodeDDL
    );
  }, [location]);

  useEffect(() => {
    if (params?.id) {
      getSingleData(params?.id, setSingleData, setRowDto);
    }
  }, [params]);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      // if id , then this is for edit , else this is for create

    }
  };

  const setter = (values) => {
    if (values?.checkbox) {
      const payload = itemDDL?.map((item) => {
        return {
          item: item,
        };
      });
      setRowDto(payload);
    } else {
      if (isUniq("item", values?.item, rowDto)) {
        setRowDto([...rowDto, values]);
      }
    }
  };

  const remover = (index) => {
    const filterArr = rowDto.filter((itm, idx) => idx !== index);
    setRowDto(filterArr);
  };

  const [objProps, setObjprops] = useState({});
  return (
    <ICustomCard
    title={"View Receive From Shop Floor"}
    backHandler={() => {
      history.goBack();
    }}
    renderProps={() => {}}
    getProps={setObjprops}
    >
      <Form
        {...objProps}
        initData={singleData}
        saveHandler={saveHandler}
        setter={setter}
        remover={remover}
        rowDto={rowDto}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        location={location}
        referrenceCodeDDL={referrenceCodeDDL}
        itemDDL={itemDDL}
        setItemDDL={setItemDDL}
        setRowDto={setRowDto}
        receiveFromShopFloorInitData={receiveFromShopFloorInitData}
      />
    </ICustomCard>
  );
}
