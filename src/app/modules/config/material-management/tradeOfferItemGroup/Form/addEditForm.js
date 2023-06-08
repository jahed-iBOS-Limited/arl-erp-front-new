/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";

import {
  setControllingUnitSingleEmpty,
  saveEditedTradeOfferItemGroup,
  saveTradeOfferItemGroup,
  getTradeItemGroupById,
} from "../_redux/Actions";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { isUniq } from "../../../../_helper/uniqChecker";
import { getItemSaleDDLAction } from "../../../../_helper/_redux/Actions";
import Loading from './../../../../_helper/_loading';

const initData = {
  id: undefined,
  tradeOfferItemGroupName: "",
  item: "",
};

export default function TradeOfferItemGroupForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get single data from store
  const singleData = useSelector((state) => {
    return state?.tradeOfferItemGroup?.singleData;
  }, shallowEqual);
  const dispatch = useDispatch();

  // item search ddl
  const itemSearchDDL = useSelector((state) => {
    return state?.commonDDL?.itemSaleDDL;
  }, shallowEqual);

  // Dispatch action for ddl
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      if (id) {
        dispatch(getTradeItemGroupById(id));
      }
      dispatch(
        getItemSaleDDLAction(
          profileData?.accountId,
          selectedBusinessUnit?.value
        )
      );
      if (!id) {
        dispatch(setControllingUnitSingleEmpty());
      } else {
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData, id]);

  useEffect(() => {
    if (singleData && singleData?.objListRowDTO?.length) {
      setRowDto([...singleData?.objListRowDTO]);
    } else {
      setRowDto([]);
    }
  }, [singleData, id]);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        const rowData = rowDto.map((itm) => {
          return {
            rowId: itm?.rowId ? itm.rowId : 0,
            businessUnitId: selectedBusinessUnit?.value,
            tradeOfferItemGroupId: values.tradeOfferItemGroupId,
            itemId: itm.itemId,
          };
        });
        let payload = {
          tradeOfferItemGroupRow: rowData,
          tradeOfferItemGroupHeader: {
            actionBy: profileData.userId,
            lastActionDateTime: "2020-08-30T10:38:35.066Z",
            tradeOfferGroupId: values.tradeOfferItemGroupId,
            tradeOfferItemGroupName:
              singleData?.objHeaderDTO?.tradeOfferItemGroupName,
          },
        };
        dispatch(saveEditedTradeOfferItemGroup(payload, setDisabled));
      } else {
        const rowData = rowDto.map((itm) => {
          return {
            businessUnitId: selectedBusinessUnit?.value,
            tradeOfferItemGroupId: 0,
            itemId: itm.itemId,
          };
        });
        let payload = {
          tradeOfferItemGroupRow: rowData,
          tradeOfferItemGroupHeader: {
            tradeOfferItemGroupId: 0,
            tradeOfferItemGroupName: values.tradeOfferItemGroupName,
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            actionBy: profileData.userId,
            lastActionDateTime: "2020-08-30T06:48:34.037Z",
          },
        };
        dispatch(saveTradeOfferItemGroup({ data: payload, cb, setDisabled }));
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

  const remover = (payload) => {
    const filterArr = rowDto.filter((itm) => itm.itemId !== payload);
    setRowDto(filterArr);
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={
        id ? "Edit Trade Offer Item Group" : "Create Trade Offer Item Group"
      }
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={singleData?.objHeaderDTO || initData}
        saveHandler={saveHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={id || false}
        itemSearchDDL={itemSearchDDL}
        rowDto={rowDto}
        setter={setter}
        remover={remover}
        id={id}
        setRowDto={setRowDto}
      />
    </IForm>
  );
}
