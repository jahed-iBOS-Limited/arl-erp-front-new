import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getDistributionChannelDDL_api } from "../../../../transportManagement/report/transportSupplierUpdate/helper";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import { getSalesTargetById } from "../helper";
import Form from "./form";

export function CustomerCollectionTargetForm({
  history,
  match: {
    params: { id, approveid },
  },
}) {
  const [objProps, setObjprops] = useState({});
  const { state } = useLocation();
  const [isDisabled, setDisabled] = useState(false);
  const [singleData, setSingleData] = useState("");
  const [singleRowData, setSingleRowData] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);
  const [, postData, isLoading] = useAxiosPost();

  const initData = {
    sbu: state?.sbu,
    targetMonth: "",
    targetYear: "",
    distributionChannel: "",
    region: "",
    area: "",
    salesOrg: "",
  };

  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    if (buId && accId) {
      getDistributionChannelDDL_api(accId, buId, setDistributionChannelDDL);
    }
  }, [buId, accId, singleData]);

  useEffect(() => {
    if (id || approveid) {
      getSalesTargetById(
        setSingleData,
        setSingleRowData,
        id || approveid,
        setDisabled
      );
    }
  }, [id, approveid]);

  const saveHandler = async (values, rowDto, cb) => {
    const payload = rowDto
      ?.filter((item) => item?.isSelected)
      ?.map((item) => ({
        accountId: accId,
        businessUnitId: buId,
        territoryId: item?.territoryId,
        customerId: item?.businessPartnerId,
        amount: +item?.targetAmount,
        date: _todayDate(),
        monthId: values?.targetMonth?.value,
        yearId: values?.targetYear?.value,
        actionBy: userId,
      }));
    postData(
      `/oms/CustomerSalesTarget/CreateCollectionTarget`,
      payload,
      () => {
        cb();
      },
      true
    );
  };

  const intValues = id ? singleData : approveid ? singleData : initData;
  return (
    <IForm
      title={
        approveid
          ? "Approve Customer Collection Target"
          : "Customer Collection Target Entry"
      }
      getProps={setObjprops}
      isDisabled={
        isDisabled || isLoading || ([4, 175].includes(buId) && !rowDto?.length)
      }
    >
      {(isDisabled || isLoading) && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={{ ...intValues, sbu: state?.sbu }}
          saveHandler={saveHandler}
          accId={accId}
          buId={buId}
          singleData={singleData}
          singleRowData={singleRowData}
          isEdit={id || approveid || false}
          setRowDto={setRowDto}
          rowDto={rowDto}
          distributionChannelDDL={distributionChannelDDL}
          setLoading={setDisabled}
        />
      </div>
    </IForm>
  );
}
