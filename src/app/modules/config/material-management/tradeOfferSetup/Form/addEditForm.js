/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import {
  getRoundingTypeDDLAction,
  saveTradeOffer,
  getConditionTypeDDLAction,
  getAllDDLAction,
} from "../_redux/Actions";
import IForm from "../../../../_helper/_form";
import shortid from "shortid";
import { toArray } from "lodash";
import { getUomDDLAction } from "../../../../_helper/_redux/Actions";
import Loading from "./../../../../_helper/_loading";

const initData = {
  id: undefined,
  // conditionType: "",
  itemGrouping: "",
  partnerGrouping: "",
  roundingType: "",
  startDate: "",
  endDate: "",
  offerBasedOn: "",
  isMinimumApplied: false,
  isSlabProgram: false,
  promotionType: "",
};

export default function TradeOfferForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [conditionType, setConditionType] = useState({
    queryOne: "",
    queryTwo: "",
  });
  const [itemDDL, setItemDDL] = useState([]);
  const [partnerDDL, setPartnerDDL] = useState([]);

  // dynamic input data
  const [row, setRow] = useState([
    {
      id: shortid(),
    },
  ]);

  const [rowDto, setRowDto] = useState({
    0: {},
  });

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get selected business unit from store
  const conditionTypeDDL = useSelector((state) => {
    return state.tradeOffer.conditionTypeDDL;
  }, shallowEqual);

  // get selected business unit from store
  const roundingTypeDDL = useSelector((state) => {
    return state.tradeOffer.roundingTypeDDL;
  }, shallowEqual);

  // item list ddl from store
  const itemListDDL = useSelector((state) => {
    return state.tradeOffer.itemListDDL;
  }, shallowEqual);

  // item group ddl from store
  const itemGroupDDL = useSelector((state) => {
    return state.tradeOffer.itemGroupDDL;
  }, shallowEqual);

  // salesDDL ddl from store
  const salesDDL = useSelector((state) => {
    return state.tradeOffer.salesDDL;
  }, shallowEqual);

  // distributionDDL ddl from store
  const distributionDDL = useSelector((state) => {
    return state.tradeOffer.distributionDDL;
  }, shallowEqual);

  // salesTerritoryDDL ddl from store
  const salesTerritoryDDL = useSelector((state) => {
    return state.tradeOffer.salesTerritoryDDL;
  }, shallowEqual);

  // partnerDDL ddl from store
  const partnerdDL = useSelector((state) => {
    return state.tradeOffer.partnerDDL;
  }, shallowEqual);

  // partnerDDL ddl from store
  const uomDDL = useSelector((state) => {
    return state.commonDDL.uomDDL;
  }, shallowEqual);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getRoundingTypeDDLAction());
    dispatch(getConditionTypeDDLAction());
    dispatch(
      getAllDDLAction(profileData.accountId, selectedBusinessUnit.value)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, conditionType]);

  useEffect(() => {
    dispatch(
      getUomDDLAction(profileData.accountId, selectedBusinessUnit.value)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData.accountId, selectedBusinessUnit.value]);

  useEffect(() => {
    switch (conditionType.queryOne) {
      case "AllItem":
        setItemDDL([{ value: 0, label: "All item" }]);
        break;
      case "Group":
        setItemDDL(itemGroupDDL);
        break;
      case "Item":
        setItemDDL(itemListDDL);
        break;
      default:
        setItemDDL([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conditionType.queryOne]);

  useEffect(() => {
    switch (conditionType.queryTwo) {
      case "Channel":
        setPartnerDDL(distributionDDL);
        break;
      case "Organization":
        setPartnerDDL(salesDDL);
        break;
      case "Partner":
        setPartnerDDL(partnerdDL);
        break;
      case "Territory":
        setPartnerDDL(salesTerritoryDDL);
        break;
      default:
        setPartnerDDL([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conditionType.queryTwo]);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      let data = toArray(rowDto);
      let row = data.map((item, index) => {
        return {
          tradeOfferConditionId: values?.conditionType?.value,
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          valueBase: values.offerBasedOn.value === "quantity" ? false : true,
          slabProgram: values?.isSlabProgram,
          minimumApplied: values?.isMinimumApplied,
          baseFrom: +item?.fromQuantity || +item?.fromValue,
          baseTo: +item?.toQuantity || +item?.toValue,
          offerPercent:
            item?.promotionType?.value === "percent" ? +item?.offerAmount : 0,
          offerAmount:
            item?.promotionType?.value === "fixed" ? +item?.offerAmount : 0,
          offerItemId: item?.offerItem ? +item?.offerItem?.value : 0,
          offerItemName: item?.offerItem ? item?.offerItem?.label : "string",
          offerItemUomId: item?.itemUom ? +item?.itemUom?.value : 0,
          offerItemUom: item?.itemUom ? item?.itemUom?.label : "string",
          offerQuantity: item?.offerQuantity ? +item?.offerQuantity : 0,
          actionBy: profileData.userId,
        };
      });
      const payload = {
        tradeOfferSetupHeaderSADDTO: {
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          TradeOfferName: "string",
          tradeOfferConditionTypeId: values?.conditionType?.value,
          tradeOfferConditionTypeName: values?.conditionType?.label,
          itemReffId: +values?.itemGrouping?.value,
          itemReffName: values?.itemGrouping?.label,
          partnerReffId: values?.partnerGrouping?.value,
          partnerReffName: values?.partnerGrouping?.label,
          roundingTypeId: values?.roundingType?.value,
          roundingTypeName: values?.roundingType?.label,
          minimumApplied: values?.isMinimumApplied,
          valueBase: values?.offerBasedOn?.label === "Value" ? true : false,
          slabProgram: values?.isSlabProgram,
          startDate: values?.startDate,
          endDate: values?.endDate,
          actionBy: profileData?.userId,
        },
        tradeOfferSetupRowSADDTO: row,
      };
      dispatch(saveTradeOffer({ data: payload, cb, setDisabled }));
    } else {
      setDisabled(false);
    }
  };

  const [objProps, setObjprops] = useState({});

  // row add handler for input row
  const addRowHandler = () => {
    const td = {
      id: shortid(),
    };
    setRow([...row, td]);
  };

  const remover = (index) => {
    const filterArr = row.filter((itm, ind) => {
      return ind !== index;
    });
    setRow([...filterArr]);
  };

  const rowDtoHandler = (name, value, sl) => {
    setRowDto({
      ...rowDto,
      [sl]: {
        ...rowDto[sl],
        [name]: value,
      },
    });
  };

  return (
    <IForm
      title="Create Trade Offer Setup"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={id || false}
        roundingTypeDDL={roundingTypeDDL}
        conditionTypeDDL={conditionTypeDDL}
        setConditionType={setConditionType}
        itemDDL={itemDDL}
        partnerDDL={partnerDDL}
        row={row}
        addRowHandler={addRowHandler}
        rowDto={rowDto}
        rowDtoHandler={rowDtoHandler}
        setRowDto={setRowDto}
        setRow={setRow}
        remover={remover}
        itemListDDL={itemListDDL}
        uomDDL={uomDDL}
      />
    </IForm>
  );
}
