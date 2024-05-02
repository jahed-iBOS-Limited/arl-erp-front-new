/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-lone-blocks */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import {
  getAllPriceSetupInitialDDL,
  savePriceSetup,
  getPriceSetupById,
  setPriceSetupEmpty,
} from "../_redux/Actions";
import IForm from "../../../../_helper/_form";
import { isUniq } from "../../../../_helper/uniqChecker";
import Loading from "../../../../_helper/_loading";
import { toast } from "react-toastify";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";

const initData = {
  id: undefined,
  appsItemRate: false,
  conditionType: "",
  conditionTypeRef: "",
  startDate: "",
  endDate: "",
  item: "",
  minPrice: "",
  maxPrice: "",
  isAllItem: false,
};

export default function PriceSetupForm({
  _,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [query, setQuery] = useState(null);
  const [DDL, setDDL] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [, postData, loading] = useAxiosPost();

  // get user data from store
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  const { token } = useSelector(
    (state) => state?.authData.tokenData,
    shallowEqual
  );

  const businessUnitSet = [
    224,
    144,
    171,
    178,
    180,
    181,
    182,
    183,
    212,
    213,
    216,
  ].includes(selectedBusinessUnit?.value);

  // get DDLs from store
  const {
    conditionDDL,
    organizationDDL,
    itemSalesDDL,
    territoryDDL,
    partnerDDL,
    distributionChannelDDL,
    singleData,
    itemByChanneList,
  } = useSelector((state) => state?.priceSetup, shallowEqual);

  const dispatch = useDispatch();
  //Dispatch single data action and empty single data for create
  useEffect(() => {
    if (id) {
      dispatch(getPriceSetupById(id));
    } else {
      dispatch(setPriceSetupEmpty());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  //Dispatch Get all initiaal dropdown action
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getAllPriceSetupInitialDDL(
          profileData.accountId,
          selectedBusinessUnit.value
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  useEffect(() => {
    if (query) {
      switch (query) {
        case 2:
          {
            setDDL(distributionChannelDDL);
          }
          break;
        case 1:
          {
            setDDL(organizationDDL);
          }
          break;
        case 4:
          {
            setDDL(partnerDDL);
          }
          break;
        case 3:
          {
            setDDL(territoryDDL);
          }
          break;
        default:
          setDDL([]);
      }
    }
  }, [query]);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (businessUnitSet) {
        const payload = {
          rowString: rowDto
            ?.filter((item) => item?.price > 0)
            .map((element) => ({
              conditionTypeId: values?.conditionType?.value,
              conditionTypeName: values?.conditionType?.label,
              conditionReffId: values?.conditionTypeRef?.value,
              itemId: element?.itemId,
              price: +element?.price,
              startDate: values?.startDate,
              endDate: values?.endDate,
              partnercode: "1234",
              maximumIncrease: +element?.maxPriceAddition,
              minimumDecrease: +element?.minPriceDeduction,
            })),
        };

        postData(
          `/oms/SalesInformation/ProductPriceEntryChannelBase?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&insertby=${profileData?.userId}`,
          payload,
          () => {
            setRowDto([]);
          },
          true
        );
      } else {
        const payload = rowDto.map((itm) => {
          return {
            ...itm,
            conditionTypeId: itm.conditionType.value,
            conditionTypeName: itm.conditionType.label,
            conditionReffId: itm.conditionTypeRef.value,
            // itemId: itm.item.value,
            actionBy: profileData.userId,
            businessUnitId: selectedBusinessUnit.value,
            accountId: profileData.accountId,
            price: +itm?.price || 0,
            maxPriceAddition: +itm?.maxPriceAddition || 0,
            minPriceDeduction: +itm?.minPriceDeduction || 0,
          };
        });

        dispatch(savePriceSetup({ data: payload, cb, setDisabled }));
      }
    } else {
      setDisabled(false);
    }
  };

  const setter = (payload) => {
    if (isUniq("itemId", payload.itemId, rowDto)) {
      setRowDto([...rowDto, payload]);
    }
  };

  const setAll = (values) => {
    const allDto = itemSalesDDL.map((itm) => {
      return {
        ...values,
        itemId: itm.value,
        itemName: itm.label,
      };
    });
    setRowDto([...allDto]);
  };
  const setAppsItemRateAll = (values) => {
    if (itemByChanneList?.length === 0) return toast.warn("No item found");
    const allDto = itemByChanneList.map((itm) => {
      return {
        ...values,
        itemId: itm.itemId,
        itemName: itm.itemName,
      };
    });
    setRowDto([...allDto]);
  };

  const remover = (payload) => {
    const filterArr = rowDto.filter((itm) => itm.itemId !== payload);
    setRowDto(filterArr);
  };

  const setPrice = (sl, value, name, values) => {
    const cloneArr = [...rowDto];
    cloneArr[sl][name] = value;
    if (name === "price") {
      cloneArr[sl]["minPriceDeduction"] = +value - +values?.minPrice;
      cloneArr[sl]["maxPriceAddition"] = +value + +values?.maxPrice;
    }
    setRowDto([...cloneArr]);
  };
  const [objProps, setObjprops] = useState({});

  const loader = isDisabled || loading;

  return (
    <IForm
      title="Create Price Setup"
      getProps={setObjprops}
      isDisabled={loader}
    >
      {loader && <Loading />}
      <Form
        {...objProps}
        initData={singleData || initData}
        saveHandler={saveHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        conditionDDL={conditionDDL}
        conditionTypeRefDDL={DDL}
        itemSalesDDL={itemSalesDDL}
        setQuery={setQuery}
        isEdit={id || false}
        rowDto={rowDto}
        setter={setter}
        remover={remover}
        setPrice={setPrice}
        setAll={setAll}
        setAppsItemRateAll={setAppsItemRateAll}
        setDisabled={setDisabled}
        setRowDto={setRowDto}
        businessUnitSet={businessUnitSet}
        postData={postData}
        token={token}
      />
    </IForm>
  );
}
