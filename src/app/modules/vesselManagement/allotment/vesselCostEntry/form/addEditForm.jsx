import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../../../_helper/_loading";
import { GetGeneralInfoById, rateUpdateAPI } from "../helper";
import Form from "./form";

export default function VesselCostEntryForm() {
  const { id, type } = useParams();
  const history = useHistory();
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState({});

  // get user data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const commonGetByIdFunc = (status) => {
    GetGeneralInfoById({
      id,
      status: type === "update" ? 1 : status === 0 ? 0 : status || 0,
      setter: setSingleData,
      setRowDto,
      setDisabled,
    });
  };
  useEffect(() => {
    if (id) {
      commonGetByIdFunc();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const saveHandler = async (values) => {
    const selectedItems = rowDto?.filter((item) => item?.isSelected);
    console.log(selectedItems);
    if (selectedItems?.length === 0)
      return toast.warn("Please select at least one item");
    const payload = selectedItems?.map((item) => ({
      motherVesselId: +id,
      shipToPartnerId: +item?.goDownId || 0,
      revenueRate: +item?.localRateTaka || 0,
      vatNtax: +item?.vatTax || 0,
      ld: +item?.ld || 0,
      demurrage: +item?.damarage || 0,
      others: +item?.others || 0,
      revenueRateDollar: item?.revenueRateDollar || 0,
      // Number((item?.localRateTaka / values?.dollarRate).toFixed(2)) || 0,
      revenueAmountTaka: item?.quantityBag * item?.localRateTaka,
      revenueAmountDollar: item?.quantityBag * item?.revenueRateDollar,
      vatNtaxDollar: +item?.vatNtaxDollar,
    }));
    rateUpdateAPI(payload, setDisabled, () => {});
  };

  const rowDataHandler = (name, index, value, conversionRate) => {
    if (id) {
      let _data = [...rowDto];
      _data[index][name] = value;
      if (name !== "isSelected") {
        // _data[index].localRateTaka = value;
        // _data[index].localTotalAmountTaka = value * _data[index]?.surveyQty;
        // _data[index].localTotalAmountDoller = value * _data[index]?.surveyQty;
      }
      setRowDto(_data);
    }
  };
  const rowDataHandlerExtra = (name, index, value) => {
    if (id) {
      let _data = [...rowDto];
      _data[index][name] = value;
      setRowDto(_data);
    }
  };

  const allSelect = (value) => {
    let _data = [...rowDto];
    const modify = _data.map((item) => {
      return {
        ...item,
        isSelected: value,
      };
    });
    setRowDto(modify);
  };
  const selectedAll = () => {
    return rowDto?.length > 0 &&
      rowDto?.filter((item) => item?.isSelected)?.length === rowDto?.length
      ? true
      : false;
  };

  const title = `${type === "view" ? "View " : "Update"} Vessel Cost Entry`;

  return (
    <>
      {isDisabled && <Loading />}
      <Form
        type={type}
        title={title}
        history={history}
        initData={singleData}
        allSelect={allSelect}
        selectedAll={selectedAll}
        saveHandler={saveHandler}
        rowDto={rowDto}
        setRowDto={setRowDto}
        rowDataHandler={rowDataHandler}
        rowDataHandlerExtra={rowDataHandlerExtra}
        commonGetByIdFunc={commonGetByIdFunc}
      />
    </>
  );
}
