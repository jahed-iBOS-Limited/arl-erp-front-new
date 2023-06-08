/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import {
  getTZDDLAction,
  setTransportRouteSingleEmpty,
  saveTransportRoute,
  getTransportRouteById,
  saveEditedTransportRouteData,
} from "../_redux/Actions";
import IForm from "../../../../_helper/_form";
import { isUniq } from "../../../../_helper/uniqChecker";
import Loading from "../../../../_helper/_loading";
const initData = {
  id: undefined,
  routeAddress: "",
  routeName: "",
};

export default function TransportRouteForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [objProps, setObjprops] = useState({});

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get emplist ddl from store
  const TZDDL = useSelector((state) => {
    return state?.transportRoute?.TZDDL;
  }, shallowEqual);

  // get single controlling  unit from store
  const singleData = useSelector((state) => {
    return state.transportRoute?.singleData;
  }, shallowEqual);

  useEffect(() => {
    if (singleData.objRow) {
      setRowDto([...singleData.objRow]);
    }
  }, [singleData]);
  const dispatch = useDispatch();

  //Dispatch single data action and empty single data for create
  useEffect(() => {
    if (id) {
      dispatch(getTransportRouteById(id));
    } else {
      dispatch(setTransportRouteSingleEmpty());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  //Dispatch Get selectedBusinessUnit action for get selectedBusinessUnit ddl
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getTZDDLAction(profileData.accountId, selectedBusinessUnit.value)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        const transportZoneId = rowDto.map((item) => {
          return {
            transportZoneId: item.transportZoneId,
            configId: item?.configId ? item.configId : 0,
          };
        });
        const payload = {
          transportRouteHeader: {
            routeId: singleData?.objHeader?.routeId,
            accountId: profileData.accountId,
            businessUnitId: selectedBusinessUnit.value,
            actionBy: profileData.userId,
            lastActionDateTime: "2020-08-30T06:51:57.367Z",
          },
          routeTransportZoneRow: transportZoneId,
        };

        dispatch(saveEditedTransportRouteData(payload, setDisabled));
      } else {
        const payload = {
          routeName: values.routeName,
          routeAddress: values.routeAddress,
          accountId: profileData.accountId,
          businessUnitId: selectedBusinessUnit.value,
          businessUnitName: selectedBusinessUnit.label,
          actionBy: profileData.userId,
        };
        dispatch(saveTransportRoute({ data: payload, cb }, setDisabled));
      }
    } else {
      console.log(values);
    }
  };

  const setter = (param) => {
    if (isUniq("transportZoneId", param.transportZoneId, rowDto)) {
      setRowDto([...rowDto, param]);
    }
  };
  const remover = (id) => {
    let ccdata = rowDto.filter((itm) => itm.transportZoneId !== id);
    setRowDto(ccdata);
  };
  
  return (
    <IForm
      title={id ? "Edit Transport Route" : "Create Transport Route"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={singleData || initData}
          saveHandler={saveHandler}
          //disableHandler={disableHandler}
          accountId={profileData?.accountId}
          selectedBusinessUnit={selectedBusinessUnit}
          TZDDL={TZDDL}
          isEdit={id || false}
          id={id}
          setter={setter}
          rowDto={rowDto}
          remover={remover}
          objHeader={singleData.objHeader}
          objRow={singleData.objRow}
        />
      </div>
    </IForm>
  );
}
