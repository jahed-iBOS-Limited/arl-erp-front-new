/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import IButton from "../../../../_helper/iButton";
import ICard from "../../../../_helper/_card";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  getSBUDDLDelivery_Aciton,
  GetShipPointDDLAction,
} from "../../delivery/_redux/Actions";
import { getLatLong } from "../helper";
import Table from "./table";

const initData = {
  sbu: "",
  channel: "",
  shipPoint: "",
  status: { value: false, label: "Incomplete" },
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

const HologramBaseDeliveryLanding = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [gridData, getGridData, isLoading] = useAxiosGet();
  const [, getPermission, loading] = useAxiosGet();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [, getDistanceOfTwoLocations, loader] = useAxiosGet();
  const [isLoader, setIsLoader] = useState(false);

  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const { SBUDDL, shipPointDDL } = useSelector((state) => state?.delivery, {
    shallowEqual,
  });

  const getData = (values, pageNo, pageSize, search) => {
    const searchPath = search ? `searchTerm=${search}&` : "";
    const isDate = values?.fromDate
      ? `&fromDate=${values?.fromDate}&toDate=${values?.toDate}`
      : "";
    const url = `/wms/Delivery/GetDeliverySearchPagination?${searchPath}&AccountId=${accId}&BusinessUnitId=${buId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc&sbuId=${values?.sbu?.value}&shipPointId=${values?.shipPoint?.value}&distributionChannelId=${values?.channel?.value}&status=${values?.status?.value}${isDate}`;
    getGridData(url);
  };

  useEffect(() => {
    dispatch(getSBUDDLDelivery_Aciton(accId, buId));
    dispatch(GetShipPointDDLAction(accId, buId));
  }, [accId, buId]);

  const locationCheck = (values, cb) => {
    getLatLong(
      // getting shipPoint latitude and longitude
      `/wms/Delivery/ShippointLatitudeNLongitude?BusinessUnitId=${buId}&ShippointId=${values?.shipPoint?.value}`,
      setIsLoader,
      (resData) => {
        navigator.geolocation.getCurrentPosition(
          function(position) {
            getDistanceOfTwoLocations(
              // getting distance between two locations
              `/tms/InternalTransport/DistanceFromLatitudeNLongitude?Source_Longitude=${resData?.longitude}&Source_Latitude=${resData?.latitude}&Target_Longitude=${position.coords.longitude}&Target_Latitude=${position.coords.latitude}`,
              (res) => {
                console.log(res);
                if (res < 1001) {
                  cb();
                } else {
                  return toast.error(
                    "This location is not allowed to create hologram base delivery. please try another location!"
                  );
                }
              }
            );
          },
          function(error) {
            // Handle errors
            switch (error.code) {
              case error.PERMISSION_DENIED:
                toast.error(
                  "Location permission denied. Please enable location services on you device."
                );
                break;
              case error.POSITION_UNAVAILABLE:
                toast.error(
                  "Location information is unavailable. Please try again later."
                );
                break;
              case error.TIMEOUT:
                toast.error("Location request timed out. Please try again.");
                break;
              default:
                toast.error("An unknown error occurred. Please try again.");
                break;
            }
          },
          {
            // Optional settings
            enableHighAccuracy: true, // Request high accuracy if available
            timeout: 10000, // Timeout in milliseconds
            maximumAge: 0, // Avoid caching
          }
        );
      }
    );
  };

  const createHandler = (values) => {
    if (!values?.shipPoint || values?.shipPoint?.value === 0) {
      return toast.warn("Please select a specific ShipPoint");
    }
    getPermission(
      `/wms/FertilizerOperation/GetAllModificationPermission?UserEnroll=${userId}&BusinessUnitId=${buId}&Type=YsnHologramPrint`,
      (permitted) => {
        console.log(permitted, "permitted");
        if (permitted) {
          locationCheck(values, () => {
            history.push({
              pathname: `/inventory-management/warehouse-management/hallogrambasedelivery/create`,
              state: values,
            });
          });
        } else {
          return toast.error(
            "Sorry, You do not have permission to create hologram base delivery!"
          );
        }
      }
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => (
          <ICard
            title={`Hologram Base Delivery`}
            disableCreateBtn={
              !values?.sbu || !values?.channel || !values?.shipPoint
            }
            createHandler={() => {
              createHandler(values);
            }}
          >
            {(isLoading || loading || loader || isLoader) && <Loading />}

            <form className="form form-label-right">
              <div className="global-form">
                <div className="row">
                  <div className="col-lg-2">
                    <NewSelect
                      name="shipPoint"
                      options={[{ value: 0, label: "All" }, ...shipPointDDL]}
                      value={values?.shipPoint}
                      label="ShipPoint"
                      onChange={(e) => {
                        setFieldValue("shipPoint", e);
                      }}
                      placeholder="ShipPoint"
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="sbu"
                      options={SBUDDL || []}
                      value={values?.sbu}
                      label="SBU"
                      onChange={(e) => {
                        setFieldValue("sbu", e);
                      }}
                      placeholder="SBU"
                    />
                  </div>
                  <RATForm
                    obj={{
                      values,
                      setFieldValue,
                      region: false,
                      area: false,
                      territory: false,
                      zone: false,
                      columnSize: "col-lg-2",
                    }}
                  />

                  <div className="col-lg-2">
                    <NewSelect
                      name="status"
                      options={[
                        { value: false, label: "Incomplete" },
                        { value: true, label: "Complete" },
                      ]}
                      value={values?.status}
                      label="Status"
                      onChange={(e) => {
                        setFieldValue("status", e);
                      }}
                      placeholder="Status"
                    />
                  </div>
                  <FromDateToDateForm
                    obj={{ values, setFieldValue, colSize: "col-lg-2" }}
                  />
                  <IButton
                    onClick={() => {
                      getData(values, pageNo, pageSize, "");
                    }}
                  />
                </div>
              </div>
            </form>
            <Table
              obj={{
                values,
                getData,
                gridData,
                buId,
                pageNo,
                setPageNo,
                pageSize,
                setPageSize,
              }}
            />
          </ICard>
        )}
      </Formik>
    </>
  );
};

export default HologramBaseDeliveryLanding;
