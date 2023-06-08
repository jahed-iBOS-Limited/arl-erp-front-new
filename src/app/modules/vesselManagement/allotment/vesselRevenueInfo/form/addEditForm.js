import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../../../_helper/_loading";
import {
  GetGeneralInfoById,
  rateUpdateAPI,
  updateLighterAllotmentCarrierRate,
} from "../helper";
import Form from "./form";

export default function VesselRevenueInfoForm() {
  const { id, type } = useParams();
  const history = useHistory();
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [rowDtoTwo, setRowDtoTwo] = useState([]);
  const [singleData, setSingleData] = useState({});

  // get user data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const commonGetByIdFunc = (searchTerm = "") => {
    // console.log(searchTerm, 'search');
    GetGeneralInfoById({
      id,
      setter: setSingleData,
      setRowDto,
      setDisabled,
      setRowDtoTwo,
      searchTerm,
    });
  };
  useEffect(() => {
    if (id) {
      commonGetByIdFunc();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  

  const saveHandler = async (values) => {
    if (values?.rowType?.value === 2) {
      const selectedItems = rowDtoTwo?.filter((item) => item?.isSelected);
      if (selectedItems?.length === 0)
        return toast.warn("Please select at least one item");
      const payload = selectedItems?.map((item) => ({
        rowId: item?.rowId,
        carrierRate: +item?.carrierRate || 0,
        carrierCommissionRate: +item?.carrierCommissionRate || 0,
      }));
      updateLighterAllotmentCarrierRate(payload, setDisabled, () => {});
    } else {
      const selectedItems = rowDto?.filter((item) => item?.isSelected);
      if (selectedItems?.length === 0)
        return toast.warn("Please select at least one item");
      const payload = selectedItems?.map((item) => ({
        rowId: item?.rowId,
        localRateDoller: item?.localRateDoller,
        localRateTaka: item?.localRateTaka,
      }));
      rateUpdateAPI(payload, setDisabled, () => {});
    }
  };

  const rowDataHandler = (name, index, value, conversionRate) => {
    if (id) {
      let _data = [...rowDto];
      _data[index][name] = value;
      if (name !== "isSelected") {
        _data[index].localRateTaka = value;
        _data[index].localTotalAmountTaka = value * _data[index]?.surveyQty;
        // _data[index].localTotalAmountDoller = value * _data[index]?.surveyQty;
      }
      setRowDto(_data);
    }
  };
  const rowDataHandlerExtra = (name, index, value, conversionRate) => {
    if (id) {
      let _data = [...rowDto];
      _data[index][name] = value;
      setRowDto(_data);
    }
  };
  const rowDataTwoHandler = (name, index, value, conversionRate) => {
    if (id) {
      let _data = [...rowDtoTwo];
      _data[index][name] = value;
      _data[index].amount =
        ((+_data[index]?.carrierRate || 0) +
          (+_data[index]?.carrierCommissionRate || 0)) *
        (+_data[index]?.surveyQty || 0);
      // if (name !== "isSelected") {
      //   _data[index].rateInTaka = conversionRate * value;
      //   _data[index].amount = conversionRate * value * _data[index]?.surveyQty;
      //   _data[index].amountInDollar = value * _data[index]?.surveyQty;
      // }
      setRowDtoTwo(_data);
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

  const allSelectTwo = (value) => {
    let _data = [...rowDtoTwo];
    const modify = _data.map((item) => {
      return {
        ...item,
        isSelected: value,
      };
    });
    setRowDtoTwo(modify);
  };

  const selectedAllTwo = () => {
    return rowDtoTwo?.length > 0 &&
      rowDtoTwo?.filter((item) => item?.isSelected)?.length ===
        rowDtoTwo?.length
      ? true
      : false;
  };

  const title = `${type === "view" ? "View " : "Update"} Vessel Carrier Info`;

  return (
    <>
      {isDisabled && <Loading />}
      <Form
        type={type}
        title={title}
        history={history}
        initData={singleData}
        allSelect={allSelect}
        allSelectTwo={allSelectTwo}
        selectedAll={selectedAll}
        selectedAllTwo={selectedAllTwo}
        saveHandler={saveHandler}
        rowDto={rowDto}
        rowDataHandler={rowDataHandler}
        rowDataHandlerExtra={rowDataHandlerExtra}
        rowDataTwoHandler={rowDataTwoHandler}
        setRowDtoTwo={setRowDtoTwo}
        rowDtoTwo={rowDtoTwo}
        commonGetByIdFunc={commonGetByIdFunc}
      />
    </>
  );
}
