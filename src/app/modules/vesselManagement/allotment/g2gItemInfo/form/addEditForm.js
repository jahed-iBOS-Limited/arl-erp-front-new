import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import { postDataEdit } from "../helper";
import Form from "./form";

const initData = {
  itemType: "",
  item: "",
  bustingBagQnt: "",
  othersBagQnt: "",
  cnfbagQnt: "",
  shipPoint: "",
  motherVesselId: "",
  motherVesselName: "",
  lighterVesselId: "",
  lighterVesselName: "",
  dteDate: "",
};

export default function G2GItemInfoCreateForm() {
  const { id, type } = useParams();
  const [isDisabled, setDisabled] = useState(false);
  const [motherVesselDDL, setMotherVesselDDL] = useState([]);
  const [singleData] = useState({});
  const [, postData, loading] = useAxiosPost();

  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {}, [accId, buId]);

  const saveHandler = async (values, cb, rowDto, id) => {
    if (!id) {
      const payload = rowDto.map((itm) => ({
        itemName: itm?.itemName || "",
        itemId: itm?.itemId || "",
        bustingBagQnt: itm?.bustingBagQnt || 0,
        othersBagQnt: itm?.othersBagQnt || 0,
        cnfbagQnt: itm?.cnfbagQnt || 0,
        insertby: userId,
        shippingPointId: itm?.shippingPointId || "",
        businessUnitId: buId,
        dteDate: itm?.dteDate || _todayDate(),
      }));
      postData(
        `/tms/LigterLoadUnload/CreatetblG2GItemInfo`,
        payload,
        () => {
          cb();
        },
        true
      );
    } else {
      const payload = {
        intId: +id,
        itemName: values?.item?.label || "",
        itemId: values?.item?.value || "",
        bustingBagQnt: +values?.bustingBagQnt || 0,
        othersBagQnt: +values?.othersBagQnt || 0,
        cnfbagQnt: +values?.cnfbagQnt || 0,
        shippingPointId: values?.shipPoint?.value,
        dteDate: values?.date || _todayDate(),
      };
      const url = "/tms/LigterLoadUnload/EditG2GItemInfo";
      postDataEdit(url, payload,() => {
        cb();
      },);
    }
  };

  const title = `${
    type === "edit" ? "Edit" : type === "view" ? "View" : "Create"
  } Empty Bag Info`;

  return (
    <>
      {(isDisabled || loading) && <Loading />}
      <Form
        id={id}
        type={type}
        buId={buId}
        title={title}
        accId={accId}
        setLoading={setDisabled}
        saveHandler={saveHandler}
        motherVesselDDL={motherVesselDDL}
        setMotherVesselDDL={setMotherVesselDDL}
        initData={id ? singleData : initData}
      />
    </>
  );
}
