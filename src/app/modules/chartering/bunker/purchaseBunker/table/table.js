/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router";
import { Formik } from "formik";
import FormikSelect from "../../../_chartinghelper/common/formikSelect";
import customStyles from "../../../_chartinghelper/common/selectCustomStyle";
import IEdit from "../../../_chartinghelper/icons/_edit";
import IView from "../../../_chartinghelper/icons/_view";
import ICustomTable from "../../../_chartinghelper/_customTable";
import { getVesselDDL, getVoyageDDLNew } from "../../../helper";
import { getPurchaseBunkerLandingData } from "../helper";
import Loading from "../../../_chartinghelper/loading/_loading";
import { _dateFormatter } from "../../../_chartinghelper/_dateFormatter";
import PaginationTable from "../../../_chartinghelper/_tablePagination";
import { CharteringContext } from "../../../charteringContext";

const headers = [
  { name: "SL" },
  { name: "Vessel Name" },
  { name: "Voyage No" },
  { name: "Purchase From" },
  { name: "Company Name" },
  { name: "Purchase Date" },
  { name: "Actions" },
];

export default function PurchaseBunkerTable() {
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [gridData, setGridData] = useState([]);
  const [vesselDDL, setVesselDDL] = useState([]);
  const [voyageNoDDL, setVoyageNoDDL] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [charteringState, setCharteringState] = useContext(CharteringContext);

  const initData = charteringState?.purchaseBunkerLandingFormData;

  // the function to update the context value
  const updateCharteringState = (newState) => {
    setCharteringState((prevState) => ({
      ...prevState,
      purchaseBunkerLandingFormData: newState,
    }));
  };

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const getVoyageDDL = (values) => {
    getVoyageDDLNew({
      accId: profileData?.accountId,
      buId: selectedBusinessUnit?.value,
      id: values?.vesselName?.value,
      setter: setVoyageNoDDL,
      setLoading: setLoading,
      hireType: 0,
      isComplete: 0,
      voyageTypeId: 0,
    });
  };

  const getLandingData = (values, _pageNo = 0, _pageSize = 15) => {
    getPurchaseBunkerLandingData(
      values?.vesselName?.value || 0,
      values?.voyageNo?.value || 0,
      _pageNo,
      _pageSize,
      "",
      setGridData,
      setLoading
    );
  };

  useEffect(() => {
    getLandingData(initData);
    getVesselDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setVesselDDL
    );

    if (initData?.vesselName) {
      getVoyageDDL(initData);
    }
  }, [profileData, selectedBusinessUnit]);

  const setPositionHandler = (pageNo, pageSize, values) => {
    getLandingData(values, pageNo, pageSize);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={{}}
        onSubmit={(values) => {}}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <>
            <form className="marine-form-card">
              <div className="marine-form-card-heading">
                <p>Purchase Bunker</p>
                <div>
                  <button
                    type="button"
                    className={"btn btn-primary px-3 py-2"}
                    onClick={() => {
                      updateCharteringState(values);
                      history.push({
                        pathname: "/chartering/bunker/purchaseBunker/create",
                        state: values,
                      });
                    }}
                    disabled={false}
                  >
                    Create
                  </button>
                </div>
              </div>
              <div className="marine-form-card-content">
                <div className="row">
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.vesselName || ""}
                      isSearchable={true}
                      options={vesselDDL || []}
                      styles={customStyles}
                      name="vesselName"
                      placeholder="Vessel Name"
                      label="Vessel Name"
                      onChange={(valueOption) => {
                        setFieldValue("vesselName", valueOption);
                        setFieldValue("voyageNo", "");
                        const updatedValues = {
                          ...values,
                          vesselName: valueOption,
                        };
                        updateCharteringState(updatedValues);
                        setVoyageNoDDL([]);
                        getLandingData(updatedValues);
                        if (valueOption) {
                          getVoyageDDL(updatedValues);
                        }
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.voyageNo || ""}
                      isSearchable={true}
                      options={voyageNoDDL || []}
                      styles={customStyles}
                      name="voyageNo"
                      placeholder="Voyage No"
                      label="Voyage No"
                      onChange={(valueOption) => {
                        setFieldValue("voyageNo", valueOption);
                        const updatedValues = {
                          ...values,
                          voyageNo: valueOption,
                        };
                        updateCharteringState(updatedValues);
                        getLandingData(updatedValues);
                      }}
                      isDisabled={!values?.vesselName}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
              </div>
              {loading && <Loading />}
              <ICustomTable ths={headers}>
                {gridData?.data?.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td>{item?.vesselName}</td>
                    <td>{item?.voyageNo}</td>
                    <td>{item?.purchaseFromName}</td>
                    <td>{item?.companyName}</td>
                    <td>{_dateFormatter(item?.purchaseDate)}</td>
                    <td className="text-center">
                      <div className="d-flex justify-content-around">
                        <IView
                          clickHandler={() => {
                            history.push({
                              pathname: `/chartering/bunker/purchaseBunker/view/${item?.purchaseBunkerHeaderId}`,
                            });
                          }}
                        />
                        {item?.isBunkerPurchaseActive && (
                          <IEdit
                            clickHandler={() => {
                              history.push({
                                pathname: `/chartering/bunker/purchaseBunker/edit/${item?.purchaseBunkerHeaderId}`,
                              });
                            }}
                          />
                        )}
                        {/* <IDelete /> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </ICustomTable>
              {gridData?.data?.length > 0 && (
                <PaginationTable
                  count={gridData?.totalCount}
                  setPositionHandler={setPositionHandler}
                  paginationState={{
                    pageNo,
                    setPageNo,
                    pageSize,
                    setPageSize,
                  }}
                  values={values}
                />
              )}
            </form>
          </>
        )}
      </Formik>
    </>
  );
}
