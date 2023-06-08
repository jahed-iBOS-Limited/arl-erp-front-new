/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { useParams } from "react-router-dom";
import Loading from "../../../../_helper/_loading";
import {
  GetRouteId,
  saveEditedRoute,
  saveRouteAction,
  getTerritoryTypeDDL,
  getTerritoryDDL,
} from "../helper";

const initData = {
  routeName: "",
  territoryType: "",
  territoryName: "",
  startOutlateName: "",
  endOutlateName: "",
};

export default function RouteForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});

  const [territoryNameDDL, setTerritoryNameDDL] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [startOutlateNameDDL, setStartOutlateNameDDL] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [endOutlateNameDDL, setEndOutlateNameDDL] = useState([]);
  const [territoryTypeDDL, setTerritoryTypeDDL] = useState([]);

  const params = useParams();

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  //SingleData to view
  // eslint-disable-next-line no-unused-vars
  const [singleData, setSingleData] = useState("");

  useEffect(() => {
    if (profileData && selectedBusinessUnit) {
      getTerritoryTypeDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setTerritoryTypeDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (profileData && selectedBusinessUnit && singleData) {
      getTerritoryDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        singleData?.territoryType?.value,
        setTerritoryNameDDL
      );
    }
  }, [profileData, selectedBusinessUnit, singleData]);

  // get value addition view data
  useEffect(() => {
    if (params?.id) {
      GetRouteId(params?.id, setSingleData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (params?.id) {
        // eslint-disable-next-line no-unused-vars
        const payload = {
          routeId: +id,
          routeName: values?.routeName,
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          territoryId: values?.territoryName?.value,
          startOutletId: values?.startOutlateName?.value || null,
          endOutletId: values?.endOutlateName?.value || null,
          actionBy: profileData?.userId,
        };
        saveEditedRoute(payload, cb, setDisabled);
      } else {
        // eslint-disable-next-line no-unused-vars
        const payload = {
          routeCode: "string",
          routeName: values?.routeName,
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          territoryId: values?.territoryName?.value,
          startOutletId: values?.startOutlateName?.value || null,
          endOutletId: values?.endOutlateName?.value || null,
          actionBy: profileData?.userId,
        };
        saveRouteAction(payload, cb, setDisabled);
      }
    } else {
      setDisabled(false);
    }
  };

  return (
    <IForm
      title={id ? "Edit Route" : "Create Route"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={singleData || initData}
        saveHandler={saveHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={id}
        isDisabled={isDisabled}
        setDisabled={setDisabled}
        territoryTypeDDL={territoryTypeDDL}
        territoryNameDDL={territoryNameDDL}
        setTerritoryNameDDL={setTerritoryNameDDL}
      />
    </IForm>
  );
}
