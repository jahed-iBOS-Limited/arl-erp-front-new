import React, { useState, useEffect } from "react";
import IForm from "../../../../_helper/_form";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import {
  getGeneralLedgeExtendById,
  saveExtendGeneralLedger,
} from "../_redux/Actions";
import { isUniq } from "../../../../_helper/uniqChecker";
import { getBUDDLAction } from "../_redux/Actions";

export default function GeneralLedgerExtendPage({
  history,
  match: {
    params: { id },
  },
}) {
  const [objProps, setObjprops] = useState({});
  const [isDisabled, setDisabled] = useState(true);
  const [rowDto, setRowDto] = useState([]);
  const dispatch = useDispatch();

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get buDDL from store
  const buDDL = useSelector((state) => {
    return state?.generalLedger?.buDDL;
  }, shallowEqual);
  // get single controlling  unit from store
  const extendData = useSelector((state) => {
    return state.generalLedger?.extendData;
  }, shallowEqual);

  //Dispatch Get emplist action for get emplist ddl
  useEffect(() => {
    if (profileData?.accountId) {
      const { accountId } = profileData;
      dispatch(getBUDDLAction(accountId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

  useEffect(() => {
    id && dispatch(getGeneralLedgeExtendById(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (profileData?.accountId) {
      if (id) {
        const payload = rowDto.map((itm) => {
          return {
            configId: itm.configId || 0,
            accountId: profileData.accountId,
            businessUnitId: itm.businessUnitId,
            generalLedgerId: extendData?.objHeader?.generalLedgerId,
            generalLedgerCode: extendData?.objHeader?.generalLedgerCode,
            generalLedgerName: extendData?.objHeader?.generalLedgerName,
            actionBy: profileData.userId,
          };
        });
        dispatch(saveExtendGeneralLedger(payload));
      }
    } else {
      setDisabled(false);
      
    }
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  const setter = (payload) => {
    if (isUniq("businessUnitId", payload.businessUnitId, rowDto)) {
      setRowDto([...rowDto, payload]);
    }
  };

  const remover = (param) => {
    const filtered = rowDto.filter((itm) => itm.businessUnitId !== param);
    setRowDto(filtered);
  };
  useEffect(() => {
    if (extendData.objRow && extendData.objRow.length) {
      setRowDto([...extendData.objRow]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extendData]);
  return (
    <IForm
      title="Extend General Ledger"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {extendData && (
        <Form
          {...objProps}
          initData={extendData}
          saveHandler={saveHandler}
          disableHandler={disableHandler}
          accountId={profileData?.accountId}
          selectedBusinessUnit={selectedBusinessUnit}
          buDDL={buDDL}
          setter={setter}
          remover={remover}
          isEdit={id || false}
          rowDto={rowDto}
        />
      )}
    </IForm>
  );
}
