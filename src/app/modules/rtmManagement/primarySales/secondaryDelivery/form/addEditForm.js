/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Form from "./form";
import { useSelector, shallowEqual } from "react-redux";
import { useParams } from "react-router-dom";
import Loading from "./../../../../_helper/_loading";
import IForm from "./../../../../_helper/_form";
import {
  createBeat,
  editBeat,
  getBeatById,
  getTerritoryDDL,
  getRouteDDL,
} from "../helper";

const initData = {
  beatCode: "",
  beatName: "",
  territory: "",
  route: "",
};

const BeatForm = () => {
  const { id } = useParams();
  const [isDisabled, setDisabled] = useState(false);
  const [singleData, setSingleData] = useState("");

  // All DDL
  const [territoryNameDDL, setTerritoryNameDDL] = useState([]);
  const [routeNameDDL, setRouteNameDDL] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // Fetch All DDL
  useEffect(() => {
    getTerritoryDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setTerritoryNameDDL
    );
    getRouteDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setRouteNameDDL
    );
  }, [profileData?.accountId && selectedBusinessUnit?.value]);

  // Get Single Data By Id
  useEffect(() => {
    if (id) {
      getBeatById(id, setDisabled, setSingleData);
    }
  }, [id]);

  // Save Handler
  const saveHandler = (values, cb) => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      // Create
      if (!id) {
        let payload = {
          beatCode: values?.beatCode,
          beatName: values?.beatName,
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          territoryId: values?.territory?.value,
          routeId: values?.route?.value,
          actionBy: profileData?.userId,
        };
        createBeat(payload, setDisabled, cb);
      }
      // Edit
      else {
        let payload = {
          beatId: +id,
          beatCode: values?.beatCode,
          beatName: values?.beatName,
          territoryId: values?.territory?.value,
          routeId: values?.route?.value,
          actionBy: profileData?.userId,
        };
        editBeat(payload, setDisabled);
      }
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <>
      <IForm
        title={!id ? "Create Market" : "Edit Market Type"}
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
          // All DDL
          territoryNameDDL={territoryNameDDL}
          routeNameDDL={routeNameDDL}
        />
      </IForm>
    </>
  );
};

export default BeatForm;
