import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Loading from "../../../../_helper/_loading";
import Form from "./form";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { toast } from "react-toastify";

const initData = {
  offerGroupName: "",
  itemName: "",
  groupName: "",
};

export default function DiscountOfferGroupForm() {
  const history = useHistory();
  const [rowDto, setRowDto] = useState([]);
  const [discountOfferGroups, getDiscountOfferGroups] = useAxiosGet();
  const [show, setShow] = useState(false);
  const [, offerGroupCreate, loader] = useAxiosPost();
  const [itemList, getItemList] = useAxiosGet();
  const [, postData, loading] = useAxiosPost();

  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    getDiscountOfferGroups(
      `/oms/TradeOffer/GetDiscountOfferGroupDDL?businessUnitId=${buId}`
    );
    getItemList(
      `/item/ItemSales/GetItemSalesDDL?AccountId=${accId}&BUnitId=${buId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const createOfferGroup = (values) => {
    const payload = [
      {
        groupName: values?.groupName,
        businessUnitId: buId,
        insertBy: userId,
      },
    ];
    offerGroupCreate(
      `/oms/TradeOffer/SaveDiscountOfferGroup`,
      payload,
      () => {
        getDiscountOfferGroups(
          `/oms/TradeOffer/GetDiscountOfferGroupDDL?businessUnitId=${buId}`
        );
        setShow(false);
      },
      true
    );
  };

  const itemAddHandler = (values, cb) => {
    const isExist = rowDto?.find(
      (item) =>
        item?.itemId === values?.itemName?.value &&
        item?.discountGroupId === values?.offerGroupName?.value
    );
    if (isExist) {
      return toast.warn("Item already added to this group!");
    } else {
      const newItem = {
        discountGroupId: values?.offerGroupName?.value,
        discountGroupName: values?.offerGroupName?.label,
        itemId: values?.itemName?.value,
        itemName: values?.itemName?.label,
        businessUnitId: buId,
        insertBy: userId,
        previousGroupId: 0,
      };
      setRowDto([...rowDto, newItem]);
      cb();
    }
  };

  const removeHandler = (index) => {
    setRowDto(rowDto?.filter((_, idx) => index !== idx));
  };

  const saveHandler = (values, callBack) => {
    if (rowDto?.length > 0) {
      postData(
        `/oms/TradeOffer/ConfigureItemWithOfferGroup`,
        rowDto,
        () => {
          callBack();
        },
        true
      );
    } else {
      return toast.warn("Please add at least one item!");
    }
  };

  const title = `Discount Offer Group And Item Entry`;

  return (
    <>
      {loading && <Loading />}
      <Form
        show={show}
        title={title}
        rowDto={rowDto}
        loader={loader}
        history={history}
        setShow={setShow}
        initData={initData}
        itemList={itemList}
        setRowDto={setRowDto}
        saveHandler={saveHandler}
        removeHandler={removeHandler}
        itemAddHandler={itemAddHandler}
        createOfferGroup={createOfferGroup}
        discountOfferGroups={discountOfferGroups}
      />
    </>
  );
}
