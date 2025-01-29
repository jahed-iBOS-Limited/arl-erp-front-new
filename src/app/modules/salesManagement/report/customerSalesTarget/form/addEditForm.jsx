import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { useLocation } from "react-router-dom";

import {
  createCustomerSalesTarget,
  // getItemNameDDL,
  getSalesTargetById,
  getItemRate,
  editCustomerSalesTarget,
  getItemListByPartnerId_api,
  CreateCustomerSalesTarget,
} from "../helper";
import { _todayDate } from "../../../../_helper/_todayDate";
import { toast } from "react-toastify";
import { getDistributionChannelDDL_api } from "../../../../transportManagement/report/transportSupplierUpdate/helper";
import Loading from "../../../../_helper/_loading";

const monthDDL = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "Sepetember" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

var date = new Date(),
  targetYearsDDL = [];

let year = date.getFullYear();
let max = year + 5;

for (var i = year - 5; i <= max; i++) {
  targetYearsDDL.push({ value: i, label: i });
}

export function CustomerSalesTargetForm({
  history,
  match: {
    params: { id, approveid },
  },
}) {
  const [objProps, setObjprops] = useState({});
  const location = useLocation();
  const [isDisabled, setDisabled] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [generalLedgerRowDto, setGeneralLedgerRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [singleRowData, setSingleRowData] = useState([]);
  // const [itemNameDDL, setItemNameDDL] = useState("");
  const [rate, setRate] = useState("");
  const [rowDto, setRowDto] = React.useState([]);
  const [itemListByPartner, setItemListByPartner] = React.useState([]);
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);

  const _nextDate = () => {
    var today = new Date();
    const todayDate =
      today.getFullYear() +
      "-" +
      ("0" + (today.getMonth() + 2)).slice(-2) +
      "-" +
      ("0" + today.getDate()).slice(-2);
    return todayDate;
  };

  let initData;
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const buSetOne = [4, 171, 175, 224, 144].includes(
    selectedBusinessUnit?.value
  );

  if (!id || !approveid) {
    initData = {
      targetStartDate: _todayDate(),
      targetEndDate: _nextDate(),
      item: "",
      uom: "",
      quantity: "",
      itemName: "",
      itemCode: "",
      rate: rate,
      sbu: location?.state?.sbu,
      businessPartner: location?.state?.business_partner?.label,
      businessPartnerId: "",
      totalTargetAmoun: "",
      targetMonth: "",
      targetYear: "",
      approval: false,
      distributionChannel: "",
      region: "",
      area: "",
      territory: "",
    };
  }

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getItemRate(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        location?.state?.business_partner?.value ||
          singleData?.businessPartnerId,
        setRate
      );
      getDistributionChannelDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setDistributionChannelDDL
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData, singleData]);

  // get user profile data from store

  useEffect(() => {
    if (id || approveid) {
      getSalesTargetById(
        setSingleData,
        setSingleRowData,
        id || approveid,
        setDisabled
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, approveid]);

  // useEffect(() => {
  //   getItemNameDDL(
  //     setItemNameDDL,
  //     profileData?.accountId,
  //     selectedBusinessUnit?.value,
  //     4
  //   );
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [getItemNameDDL]);

  const saveHandler = async (values, rowDto, cb) => {
    if (buSetOne) {
      const selectedItems = rowDto.filter((item) => item?.isSelected);
      if (selectedItems?.length === 0) {
        return toast.warn("Please select at least one item");
      } else {
        const totalTargetAmount = selectedItems?.reduce((acc, curr) => {
          const amount = curr?.targetQty * curr?.itemSalesRate;
          acc += amount;
          return acc;
        }, 0);
        const payload = selectedItems?.map((item) => {
          return {
            targetId: +id || +approveid || 0,
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            sbuid: location?.state?.sbu?.value,
            sbuname: location?.state?.sbu?.label,
            businessPartnerId: item?.businessPartnerId,
            businessPartnerCode: item?.businessPartnerCode,
            businessPartnerName: item?.businessPartnerName,
            partnerLocationId: item?.territoryId,
            targetMonth: values?.targetMonth?.value,
            targetYear: values?.targetYear?.value,
            targetStartDate: values?.targetStartDate,
            targetEndDate: values?.targetEndDate,
            totalTargetAmount: totalTargetAmount,
            actionBy: profileData?.userId,
            lastActionDateTime: _todayDate(),
            serverDateTime: _todayDate(),
            totalTargetQnt: selectedItems?.reduce((acc, curr) => {
              return acc + Number(curr?.targetQty);
            }, 0),
            channelId: values?.distributionChannel?.value,
            itemId: item?.itemId,
            itemCode: item?.itemCode,
            itemName: item?.itemName,
            uomid: item?.uomid,
            uomcode: item?.uomcode || "",
            uomname: item?.uomname,
            itemTypeId: item?.itemTypeId,
            targetQuantity: +item?.targetQty,
            itemSalesRate: item?.itemSalesRate,
            targetAmount: item?.targetQty * item?.itemSalesRate,
            isApprove: approveid ? true : false,
            approveBy: profileData?.userId,
            approveDate: _todayDate(),
          };
        });
        await CreateCustomerSalesTarget(payload, setDisabled, cb);
        if (+id || +approveid) {
          history.push("/sales-management/report/customersalestarget");
        }
      }
    } else {
      const selectedItems = rowDto?.filter((item) => item?.isSelected);
      if (selectedItems?.length < 1) {
        return toast.warn("Please select at least one item!");
      }
      const total = selectedItems?.reduce((a, b) => a + b.amount, 0);
      if (id || approveid) {
        const rowDtoSave = selectedItems.map((itm) => ({
          targetRowId: itm?.targetRowId || 0,
          targetAmount: +itm?.amount,
          itemId: itm?.itemId,
          itemName: itm?.itemName,
          uomid: itm?.uom,
          uomname: itm?.uomname,
          targetQuantity: values?.approval ? 0 : +itm?.targetQuantity,
          itemSalesRate: +itm?.itemSalesRate,
          approveQuantity: values?.approval ? +itm?.targetQuantity : 0,
        }));

        const payload = {
          targetId: +id || +approveid,
          isApproved: values?.approval,
          approveBy: profileData?.accountId,
          numTotalApproveAmount: approveid ? total : 0,
          objrow: rowDtoSave,
          sbuid: location?.state?.sbu?.value,
          sbuname: location?.state?.sbu?.label,
          channelId: values?.distributionChannel?.value,
        };
        if (selectedItems.length > 0) {
          editCustomerSalesTarget(payload, setDisabled);

          // This is commented by mahmud hasan according to monirul islam vai
          // if (total) {
          //   editCustomerSalesTarget(payload, setDisabled);
          // } else {
          //   toast.warning(`Total Target Amount can't be "0"`);
          // }
        } else {
          toast.warning("You must have to select at least one item");
        }
      } else {
        const rowDtoSave = selectedItems?.map((itm) => ({
          itemId: itm?.itemId,
          itemCode: itm?.itemCode,
          itemName: itm?.itemName,
          uomid: itm?.uom,
          uomcode: itm?.uomCode || "",
          uomname: itm?.uomname,
          itemTypeId: 4,
          targetQuantity: +itm?.targetQuantity,
          itemSalesRate: +itm?.itemSalesRate,
          isActive: true,
        }));
        const payload = {
          objheader: {
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            sbuid: location?.state?.sbu?.value,
            sbuname: location?.state?.sbu?.label,
            businessPartnerId: location?.state?.business_partner.value,
            targetMonth: values?.targetMonth?.value,
            targetYear: +values?.targetYear?.label,
            targetStartDate: values?.targetStartDate,
            targetEndDate: values?.targetEndDate,
            totalTargetAmount: +total,
            approveBy: 0,
            isActive: true,
            actionBy: profileData.userId,
          },
          objrow: rowDtoSave,
        };
        if (selectedItems.length > 0) {
          createCustomerSalesTarget(payload, setDisabled, cb);

          // This is commented by mahmud hasan according to monirul islam vai
          // if (total) {
          //   createCustomerSalesTarget(payload, setDisabled, cb);
          // } else {
          //   toast.warning(`Total Target Amount can't be "0"`);
          // }
        } else {
          toast.warning("You must have to select at least one item");
        }
      }
    }
  };

  useEffect(() => {
    if (
      !id &&
      selectedBusinessUnit?.value &&
      profileData?.accountId &&
      location?.state?.business_partner?.value &&
      !approveid &&
      !buSetOne
    ) {
      getItemListByPartnerId_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        location?.state?.business_partner?.value,
        setItemListByPartner
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData, location]);

  const intValues = id ? singleData : approveid ? singleData : initData;
  return (
    <IForm
      title={
        approveid
          ? "Approve Customer Sales Target"
          : "Create Customer Sales Target"
      }
      getProps={setObjprops}
      isDisabled={isDisabled || (buSetOne && !rowDto?.length)}
    >
      {isDisabled && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={{ ...intValues, sbu: location?.state?.sbu }}
          saveHandler={saveHandler}
          targetYearsDDL={targetYearsDDL}
          profileData={profileData}
          selectedBusinessUnit={selectedBusinessUnit}
          generalLedgerRowDto={generalLedgerRowDto}
          singleData={singleData}
          singleRowData={singleRowData}
          monthDDL={monthDDL}
          // itemNameDDL={itemNameDDL}
          isEdit={id || approveid || false}
          setRowDto={setRowDto}
          rowDto={rowDto}
          rate={rate}
          itemListByPartner={itemListByPartner}
          distributionChannelDDL={distributionChannelDDL}
          setLoading={setDisabled}
          buSetOne={buSetOne}
        />
      </div>
    </IForm>
  );
}
