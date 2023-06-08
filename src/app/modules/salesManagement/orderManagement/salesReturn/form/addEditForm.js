import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { getDistributionChannelDDL_api } from "../../../../transportManagement/report/transportSupplierUpdate/helper";
import { getSalesReturnGridData, salesReturnEntry } from "../helper";
import Loading from "../../../../_helper/_loading";
import { useHistory } from "react-router-dom";
import Form from "./form";

const initData = {
  distributionChannel: "",
  customer: "",
  challan: "",
  returnType: "",
};

function SalesReturnForm() {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);

  const history = useHistory();

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getDistributionChannelDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setDistributionChannelDDL
      );
    }
  }, [selectedBusinessUnit, profileData]);

  const commonGridFunc = (values) => {
    getSalesReturnGridData(
      selectedBusinessUnit?.value,
      values?.challan,
      profileData?.employeeId,
      values?.customer?.value,
      setGridData,
      setLoading
    );
  };

  const allSelect = (value) => {
    let _data = [...gridData];
    const modify = _data.map((item) => {
      return { ...item, isSelected: value };
    });
    setGridData(modify);
  };

  const selectedAll = () => {
    return gridData?.filter((item) => item.isSelected)?.length ===
      gridData?.length && gridData?.length > 0
      ? true
      : false;
  };

  const dataChangeHandler = (index, key, value) => {
    let _data = [...gridData];
    _data[index][key] = value;
    setGridData(_data);
  };

  const saveHandler = (values) => {
    const selectedItems = gridData?.filter((item) => item.isSelected);
    if (selectedItems?.length === 0 && values?.returnType?.value === 2) {
      toast.warn("Please select at least one item");
      return;
    }
    if (
      selectedItems?.filter(
        (element) => element?.numDamageQnt > element?.numDeliveryQnt
      )?.length > 0
    ) {
      toast.warn(`Please check damage quantities!
      Damage qty can not be greater than delivery qty`);
      return;
    }
    const rows = values?.returnType?.value === 1 ? gridData : selectedItems;
    const totalQty = rows?.reduce(
      (a, b) =>
        a + values?.returnType?.value === 1
          ? b?.numDeliveryQnt
          : b?.numDamageQnt,
      0
    );
    const totalAmount = rows?.reduce(
      (a, b) =>
        a + values?.returnType?.value === 1
          ? b?.numDeliveryQnt * b?.numProductPrice
          : +b?.numDamageQnt * b?.numProductPrice,
      0
    );
    const payload = {
      head: rows?.map((item) => {
        return {
          salesOrderId: item?.intSOID,
          salesOrderNo: item?.stroder,
          deliveryChallan: item?.strchallan,
          deliveryID: item?.intDeliveryID,
          businessUnitId: selectedBusinessUnit?.value,
          businessPartnerId: values?.customer?.value,
          businessPartnerName: values?.customer?.label,
          totalQty: totalQty,
          totalAmount: totalAmount,
          salesReturnType: values?.returnType?.value,
        };
      }),

      row: rows?.map((item) => {
        return {
          referenceId: 0,
          referenceCode: "",
          itemId: item?.intItemID,
          itemName: item?.strItemName,
          uoMId: 0,
          uoMName: "",
          issueQty: +item?.numDeliveryQnt,
          returnQty:
            values?.returnType?.value === 1
              ? +item?.numDeliveryQnt
              : +item?.numDamageQnt,
          basePrice: +item?.numProductPrice,
          returnPercentage: 0,
        };
      }),

      img: [{ imageId: 0 }],
      businessUnitId: selectedBusinessUnit?.value,
      actionById: profileData?.userId,
    };
    salesReturnEntry(payload, setLoading, () => {
      commonGridFunc(values);
    });
  };

  return (
    <>
      {loading && <Loading />}
      <Form
        initData={initData}
        saveHandler={saveHandler}
        gridData={gridData}
        setGridData={setGridData}
        history={history}
        distributionChannelDDL={distributionChannelDDL}
        commonGridFunc={commonGridFunc}
        selectedAll={selectedAll}
        allSelect={allSelect}
        dataChangeHandler={dataChangeHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
      />
    </>
  );
}

export default SalesReturnForm;
