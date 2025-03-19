/* eslint-disable react-hooks/exhaustive-deps */
/*
 * Change: Last change assign by Ikbal Hossain
 * Des: Remove Country, District, Division, Thana from create, edit, view
 */

import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import {
  saveSalesTerritory,
  setControllingUnitSingleEmpty,
  getTerritoryTypeDDLAction,
  // getParentTerritoryDDLAction,
  getCountryDDLLAction,
  getDivisionDDLAction,
  getDistrictDDLAction,
  getThanaDDLAction,
  getSalesTerritoryById,
  saveEditedSalesTerritory,
} from "../_redux/Actions";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { getParentTerritoryTypeDDL } from "../helper";

const initData = {
  id: undefined,
  territoryTypeName: "",
  territoryName: "",
  territoryCode: "",
  parentTerritoryName: "",
  address: "",
  countryName: "",
  divisionName: "",
  distirctName: "",
  thanaName: "",
  parentTerritoryTypeName: "",
};

export default function SalesTerritoryForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [parentTerritoryTypeDDL, setParentTerritoryTypeDDL] = useState([]);
  const [parentTerritoryDDL, setParentTerritoryDDL] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get territory type ddl from store
  const territoryTypeDDL = useSelector((state) => {
    return state?.salesTerritory?.territoryTypeDDL;
  }, shallowEqual);

  // get parentTerritoryDDL ddl from store
  // const parentTerritoryDDL = useSelector((state) => {
  //   return state?.salesTerritory?.parentTerritoryDDL;
  // }, shallowEqual);

  // get countryNameDDL from store
  const countryNameDDL = useSelector((state) => {
    return state?.salesTerritory?.countryNameDDL;
  }, shallowEqual);

  // get divisionDDL from store
  const divisionDDL = useSelector((state) => {
    return state?.salesTerritory?.divisionDDL;
  }, shallowEqual);

  // get districtDDL from store
  const districtDDL = useSelector((state) => {
    return state?.salesTerritory?.districtDDL;
  }, shallowEqual);

  // get thanaDDL from store
  const thanaDDL = useSelector((state) => {
    return state?.salesTerritory?.thanaDDL;
  }, shallowEqual);

  // get single controlling  unit from store
  const singleData = useSelector((state) => {
    return state.salesTerritory?.singleData;
  }, shallowEqual);

  const dispatch = useDispatch();

  //Dispatch single data action and empty single data for create
  useEffect(() => {
    if (id) {
      dispatch(getSalesTerritoryById(id, setDisabled));
    } else {
      dispatch(setControllingUnitSingleEmpty());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    getParentTerritoryTypeDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setParentTerritoryTypeDDL
    );
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getTerritoryTypeDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value
        )
      );
      // dispatch(
      //   getParentTerritoryDDLAction(
      //     profileData.accountId,
      //     selectedBusinessUnit.value
      //   )
      // );
      dispatch(getCountryDDLLAction());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  useEffect(() => {
    // 18 = id of Bangladesh
    dispatch(getDivisionDDLAction(18));
  }, []);

  useEffect(() => {
    if (id) {
      if (singleData?.countryId) {
        // dispatch(getDivisionDDLAction(singleData?.country?.value));
        dispatch(getDivisionDDLAction(singleData?.countryId));
        dispatch(
          getDistrictDDLAction(singleData?.countryId, singleData?.division)
        );
        dispatch(
          getThanaDDLAction(
            singleData?.countryId,
            singleData?.division,
            singleData?.distirct
          )
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, singleData]);

  const saveHandler = async (values, cb) => {
    // remove bracket from thanaName
    // let thanaName = values?.thanaName?.label?.split("[")[0];

    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        const payload = {
          territoryId: +id,
          territoryName: values.territoryName,
          territoryTypeId: +values.territoryTypeName.value,
          parentTerritoryId: +values.parentTerritoryName.value,
          parentTerritoryName: values.parentTerritoryName.label,
          // countryId: +values.countryName.value,
          // countryName: values.countryName.label,
          // division: +values.divisionName.value,
          // divisionName: values.divisionName.label,
          // distirct: +values.distirctName.value,
          // distirctName: values.distirctName.label,
          // thana: +values.thanaName.value,
          // thanaName: thanaName,
          address: values.address,
          actionBy: profileData.userId,
        };
        dispatch(saveEditedSalesTerritory(payload, setDisabled));
      } else {
        const payload = {
          accountId: profileData?.accountId,
          territoryCode: values.territoryCode,
          territoryName: values.territoryName,
          territoryTypeId: +values.territoryTypeName.value,
          businessUnitId: +selectedBusinessUnit.value,
          parentTerritoryId: +values.parentTerritoryName.value,
          parentTerritoryName: values.parentTerritoryName.label,
          // countryId: +values.countryName.value,
          // countryName: values.countryName.label,
          // division: +values.divisionName.value,
          // divisionName: values.divisionName.label,
          // distirct: +values.distirctName.value,
          // distirctName: values.distirctName.label,
          // thana: +values.thanaName.value,
          // thanaName: thanaName,
          address: values.address,
          actionBy: profileData.userId,
        };
        dispatch(saveSalesTerritory({ data: payload, cb }, setDisabled));
      }
    } else {
    }
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  /* const ddlCaller = (name, counId, divId, disId) => {
    switch (name) {
      case "division":
        {
          dispatch(getDivisionDDLAction(counId));
        }
        break;
      case "district":
        {
          dispatch(getDistrictDDLAction(counId, divId));
        }
        break;
      case "thana":
        {
          dispatch(getThanaDDLAction(counId, divId, disId));
        }
        break;
      default:
    }
  }; */

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={id ? "Edit Sales Territory" : "Create Sales Territory"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={singleData || initData}
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        territoryTypeDDL={territoryTypeDDL}
        parentTerritoryDDL={parentTerritoryDDL}
        countryNameDDL={countryNameDDL}
        thanaDDL={thanaDDL}
        districtDDL={districtDDL}
        divisionDDL={divisionDDL}
        // ddlCaller={ddlCaller}
        isEdit={id || false}
        parentTerritoryTypeDDL={parentTerritoryTypeDDL}
        setParentTerritoryDDL={setParentTerritoryDDL}
      />
    </IForm>
  );
}
