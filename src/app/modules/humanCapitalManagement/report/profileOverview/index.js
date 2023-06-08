/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import IForm from "../../../_helper/_form";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { getProfileOverviewDataById } from "./helper";
import { EmployeeLanding } from "./Landing/landing";
import "./profileOverview.css";
import useAxiosGet from "./../../../_helper/customHooks/useAxiosGet";
import { toast } from "react-toastify";
import { setProfileOverviewStoreAction } from "../../../_helper/reduxForLocalStorage/Actions";

export default function ProfileOverview() {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [landingData, setLandingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buDDL, setbuDDL] = useState("");
  const [workPlaceDDL, setWorkPlaceDDL] = useState({ value: 0, label: "All" });
  const [workPlaceList, getWorkPlaceList, , setWorkPlaceList] = useAxiosGet();

  const { profileData, selectedBusinessUnit, businessUnitList } = useSelector(
    (state) => {
      return state.authData;
    },
    shallowEqual
  );

  const { profileOverview } = useSelector((state) => state.localStorage);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!profileOverview?.businessUnit) {
      let selectedBU = businessUnitList?.filter(
        (item) => item?.value === selectedBusinessUnit?.value
      );
      setbuDDL(
        { value: selectedBU[0]?.value, label: selectedBU[0]?.label } || ""
      );
    }

    if (profileOverview?.businessUnit && profileOverview?.workPlace) {
      setbuDDL(profileOverview?.businessUnit);
      setWorkPlaceDDL(profileOverview?.workPlace);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileOverview]);

  useEffect(() => {
    getProfileOverviewDataById(
      0,
      profileOverview?.businessUnit?.value || selectedBusinessUnit?.value,
      profileOverview?.workPlace?.value || 0,
      setLandingData,
      setLoading
    );
    getWorkPlaceList(
      `/hcm/WorkPlace/GetWorkPlace?accountId=${
        profileData?.accountId
      }&businessUnitId=${profileOverview?.businessUnit?.value ||
        selectedBusinessUnit?.value}`,
      (data) => {
        let modifyData = data.map((item) => ({
          ...item,
          value: item?.workplaceId,
          label: item?.workplaceName,
        }));
        setWorkPlaceList(modifyData);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IForm
      title={"Profile Overview"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={true}
      isHiddenBack={true}
      isHiddenSave={true}
    >
      {(isDisabled || loading) && <Loading />}
      <div className="form-group  global-form row">
        <div className="col-lg-3">
          <NewSelect
            options={businessUnitList || []}
            value={buDDL}
            label="Business Unit"
            onChange={(valueOption) => {
              if (valueOption) {
                setbuDDL(valueOption);
                setLandingData([]);
                getWorkPlaceList(
                  `/hcm/WorkPlace/GetWorkPlace?accountId=${profileData?.accountId}&businessUnitId=${valueOption?.value}`,
                  (data) => {
                    let modifyData = data.map((item) => ({
                      ...item,
                      value: item?.workplaceId,
                      label: item?.workplaceName,
                    }));
                    setWorkPlaceDDL("");
                    setWorkPlaceList(modifyData);
                  }
                );
              } else {
                setbuDDL("");
                setWorkPlaceDDL("");
                setWorkPlaceList([]);
                setLandingData([]);
              }
            }}
          />
        </div>
        <div className="col-lg-3">
          <NewSelect
            options={[{ value: 0, label: "All" }, ...workPlaceList] || []}
            value={workPlaceDDL}
            label="Work Place"
            onChange={(valueOption) => {
              if (valueOption) {
                setWorkPlaceDDL(valueOption);
                setLandingData([]);
              } else {
                setWorkPlaceDDL("");
                setLandingData([]);
              }
            }}
          />
        </div>
        <div>
          <button
            type="button"
            class="btn btn-primary"
            style={{ marginTop: "14px" }}
            disabled={!buDDL || !workPlaceDDL}
            onClick={() => {
              getProfileOverviewDataById(
                0,
                buDDL?.value,
                workPlaceDDL?.value,
                setLandingData,
                setLoading
              );
              dispatch(
                setProfileOverviewStoreAction({
                  businessUnit: buDDL,
                  workPlace: workPlaceDDL,
                })
              );
            }}
          >
            Show
          </button>
        </div>
      </div>
      <div className="mt-5">
        <EmployeeLanding
          objProps={{
            landingData,
            buId: buDDL?.value || selectedBusinessUnit?.value,
            workPlaceId: workPlaceDDL?.value || 0,
          }}
        />
      </div>
    </IForm>
  );
}
