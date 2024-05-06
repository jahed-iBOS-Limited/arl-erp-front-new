/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import {
  getEmpDDLAction,
  getSaleForceTerritoryById,
  saveEditedSaleForceTerritory,
  saveSaleForceTerritory,
  getTerritoryDDLAction,
  getTerritoryTypeDDLAction,
  setSalesForceTerritorySingleEmpty,
} from "../_redux/Actions";
import IForm from "../../../../_helper/_form";
import { isUniq } from "../../../../_helper/uniqChecker";
import Loading from "../../../../_helper/_loading";

const initData = {
  id: undefined,
  territoryType: "",
  territory: "",
  employee: "",
  email: "",
  point: "",
  distributionChannel: "",
  salesForceType:"",
};

export default function TerritorySalesForceConfigForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  // get emplist ddl from store
  const { empDDL, territoryDDL, territoryTypeDDL, singleData } = useSelector(
    (state) => state?.salesForceTerritoryConig,
    shallowEqual
  );

  const empList = empDDL?.map((item) => ({
    ...item,
    label: `${item?.label} [${item?.departmentName}] [${item?.value}]`,
    name: item?.label,
  }));

  const dispatch = useDispatch();

  //Dispatch single data action and empty single data for create
  useEffect(() => {
    if (id) {
      dispatch(getSaleForceTerritoryById(id));
    } else {
      dispatch(setSalesForceTerritorySingleEmpty());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  //Dispatch Get emplist action for get emplist ddl
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getEmpDDLAction(profileData.accountId, selectedBusinessUnit.value)
      );
      dispatch(
        getTerritoryTypeDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value
        )
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  useEffect(() => {
    if (singleData && singleData?.objRow) {
      setRowDto(singleData?.objRow);
    }
  }, [singleData, id]);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        const payload = rowDto.map((itm) => {
          return {
            ...itm,
            configId: itm.configId ? itm.configId : 0,
            accountId: profileData.accountId,
            businessUnitId: selectedBusinessUnit.value,
            territoryTypeId: itm.territoryTypeId,
            territoryId: itm.territoryId,
            employeeId: itm.employeeId,
            employeeName: itm.employeeName,
            actionBy: profileData.userId,
            channelId: itm?.channelId,
          };
        });
        dispatch(saveEditedSaleForceTerritory(payload, setDisabled));
      } else {
        const payload = rowDto.map((itm) => {
          return {
            ...itm,
            territoryTypeId: itm.territoryTypeId,
            territoryId: itm.territoryId,
            employeeId: itm.employeeId,
            employeeName: itm.employeeName,
            actionBy: profileData.userId,
            businessUnitId: selectedBusinessUnit.value,
            accountId: profileData.accountId,
          };
        });
        dispatch(saveSaleForceTerritory({ data: payload, cb }, setDisabled));
      }
    } else {
    }
  };

  const territroyDDLCaller = (payload) => {
    dispatch(
      getTerritoryDDLAction(
        profileData.accountId,
        selectedBusinessUnit.value,
        payload
      )
    );
  };

  const setter = (payload) => {
    if (isUniq("territoryId", payload.territoryId, rowDto)) {
      setRowDto([...rowDto, payload]);
    }
  };
  const remover = (payload) => {
    const filterArr = rowDto.filter((itm) => itm.employeeId !== payload);
    setRowDto(filterArr);
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title="Create Territory SalesForce Config"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={singleData || initData}
        saveHandler={saveHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        empDDL={empList}
        territoryDDL={territoryDDL}
        territoryTypeDDL={territoryTypeDDL}
        isEdit={id || false}
        territroyDDLCaller={territroyDDLCaller}
        setter={setter}
        remover={remover}
        rowDto={rowDto}
        setRowDto={setRowDto}
        profileData={profileData}
        setDisabled={setDisabled}
      />
    </IForm>
  );
}
