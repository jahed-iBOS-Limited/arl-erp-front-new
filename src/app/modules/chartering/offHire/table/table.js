/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router";
import { Formik } from "formik";
import { getVesselDDL, getVoyageDDLNew } from "../../helper";
import { getOffHireLandingData } from "../helper";
import Loading from "../../_chartinghelper/loading/_loading";
import FormikSelect from "../../_chartinghelper/common/formikSelect";
import customStyles from "../../_chartinghelper/common/selectCustomStyle";
import ICustomTable from "../../_chartinghelper/_customTable";
import IView from "../../_chartinghelper/icons/_view";
import IEdit from "../../_chartinghelper/icons/_edit";
import { _formatMoney } from "../../_chartinghelper/_formatMoney";
import PaginationTable from "../../_chartinghelper/_tablePagination";
import { CharteringContext } from "../../charteringContext";

const headers = [
  { name: "SL" },
  { name: "Vessel Name" },
  { name: "Voyage No" },
  // { name: "Off Hire No" },
  { name: "Off Hire Duration" },
  { name: "Off Hire Total Cost" },
  { name: "Actions" },
];

export default function OffHireTable() {
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vesselDDL, setVesselDDL] = useState([]);
  const [voyageNoDDL, setVoyageNoDDL] = useState([]);
  const history = useHistory();
  const [charteringState, setCharteringState] = useContext(CharteringContext);

  const initData = charteringState?.offHireLandingFormData;

  // the function to update the context value
  const updateCharteringState = (newState) => {
    setCharteringState((prevState) => ({
      ...prevState,
      offHireLandingFormData: newState,
    }));
  };

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const getGridData = (values, _pageNo = 0, _pageSize = 15) => {
    getOffHireLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.vesselName?.value || 0,
      values?.voyageNo?.value || 0,
      _pageNo,
      _pageSize,
      "",
      setGridData,
      setLoading
    );
  };

  const getVoyageDDL = (values) => {
    getVoyageDDLNew({
      accId: profileData?.accountId,
      buId: selectedBusinessUnit?.value,
      id: values?.vesselName?.value,
      setter: setVoyageNoDDL,
      setLoading: setLoading,
      hireType: 0,
      isComplete: 0,
      voyageTypeId: 1,
    });
  };

  useEffect(() => {
    getVesselDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setVesselDDL
    );
    getGridData(initData);
    if (initData?.vesselName) {
      getVoyageDDL(initData);
    }
  }, [profileData, selectedBusinessUnit]);

  const setPositionHandler = (pageNo, pageSize, values) => {
    getGridData(values, pageNo, pageSize);
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
            {loading && <Loading />}
            <form className="marine-form-card">
              <div className="marine-form-card-heading">
                <p>Off Hire</p>
                <div>
                  <button
                    type="button"
                    className={"btn btn-primary px-3 py-2"}
                    onClick={() => {
                      updateCharteringState(values);
                      history.push("/chartering/offHire/create");
                    }}
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
                        setVoyageNoDDL([]);
                        const updatedValues = {
                          ...values,
                          vesselName: valueOption,
                        };
                        updateCharteringState(updatedValues);
                        if (valueOption) {
                          getVoyageDDL(updatedValues);
                        }
                        getGridData(updatedValues);
                      }}
                      // isDisabled={viewType === "view"}
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
                        getGridData(updatedValues);
                      }}
                      isDisabled={!values?.vesselName}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
              </div>

              <ICustomTable ths={headers}>
                {gridData?.data?.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td>{item?.vesselName}</td>
                    <td>{item?.voyageNumber}</td>
                    {/* <td>{item?.offHireId}</td> */}
                    <td>{item?.offHireDuration}</td>
                    <td className="text-right">
                      {_formatMoney(item?.offHireCostAmount)}
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-around">
                        <IView
                          clickHandler={() => {
                            history.push(
                              `/chartering/offHire/view/${item?.offHireId}`
                            );
                          }}
                        />
                        {item?.isEditable && (
                          <IEdit
                            clickHandler={() => {
                              history.push(
                                `/chartering/offHire/edit/${item?.offHireId}`
                              );
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
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
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
