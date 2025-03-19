import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import PaginationTable from "../../../../_helper/_tablePagination";
import {
  getASLLAgencyRegistrationLandingApi,
  getVesselDDL,
  getVesselTypeDDL,
  getVoyageNoDDLApi,
} from "../helper";
import LandingTable from "./table";

const initData = {
  vesselName: "",
  vesselType: "",
  voyageNo: "",
};

const RegistrationLanding = () => {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const history = useHistory();
  const [vesselDDL, setVesselDDL] = useState([]);
  const [vesselTypeDDL, setVesselTypeDDL] = useState([]);
  const [voyageNoDDLApi, setVoyageNoDDLApi] = useState([]);

  // get user data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    if (accId && buId) {
      getVesselDDL(accId, 0, setVesselDDL);
      getVesselTypeDDL(accId, buId, setVesselTypeDDL);
      commonGridData(pageNo, pageSize, initData);
      getVoyageNoDDLApi(accId, buId, setVoyageNoDDLApi);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const commonGridData = (
    _pageNo = pageNo,
    _pageSize = pageSize,
    values,
    searhValue
  ) => {
    getASLLAgencyRegistrationLandingApi(
      accId,
      buId,
      values?.vesselType?.value,
      values?.vesselName?.value,
      values?.voyageNo?.value,
      _pageNo,
      _pageSize,
      setGridData,
      setLoading
    );
  };
  return (
    <>
      {loading && <Loading />}
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue, touched, errors }) => (
          <>
            <ICustomCard
              title='Registration'
              createHandler={() => {
                history.push(
                  `/ShippingAgency/Configuration/Registration/Create`
                );
              }}
            >
              <div className='row global-form my-3'>
                <div className='col-lg-3'>
                  <NewSelect
                    options={vesselTypeDDL || []}
                    name='vesselType'
                    onChange={(valueOption) => {
                      setFieldValue("vesselType", valueOption);
                      setGridData([]);
                    }}
                    placeholder='Vessel Type'
                    label='Vessel Type'
                    value={values?.vesselType}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className='col-lg-3'>
                  <NewSelect
                    value={values?.vesselName || ""}
                    isSearchable={true}
                    options={vesselDDL || []}
                    name='vesselName'
                    placeholder='Vessel Name'
                    label='Vessel Name'
                    onChange={(valueOption) => {
                      setFieldValue("vesselName", valueOption);
                      setGridData([]);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className='col-lg-3'>
                  <NewSelect
                    value={values?.voyageNo || ""}
                    isSearchable={true}
                    options={voyageNoDDLApi || []}
                    name='voyageNo'
                    placeholder='Voyage No'
                    label='Voyage No'
                    onChange={(valueOption) => {
                      setFieldValue("voyageNo", valueOption);
                      setGridData([]);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className='col d-flex align-items-end justify-content-end'>
                  <button
                    className='btn btn-primary mt-3'
                    onClick={() => {
                      commonGridData(1, pageSize, values);
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
              <LandingTable
                obj={{
                  gridData,
                  commonGridDataCB: () => {
                    commonGridData(pageNo, pageSize, values);
                  },
                }}
              />

              {gridData?.data?.length > 0 && (
                <PaginationTable
                  count={gridData?.totalCount}
                  setPositionHandler={(pageNo, pageSize) => {
                    commonGridData(pageNo, pageSize, values);
                  }}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                  values={values}
                />
              )}
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
};

export default RegistrationLanding;
