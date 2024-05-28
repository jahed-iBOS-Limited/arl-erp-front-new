/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { getVesselDDL, getVoyageDDLNew } from "../../../helper";
import FormikSelect from "../../../_chartinghelper/common/formikSelect";
import customStyles from "../../../_chartinghelper/common/selectCustomStyle";
import IView from "../../../_chartinghelper/icons/_view";
import Loading from "../../../_chartinghelper/loading/_loading";
import ICustomTable from "../../../_chartinghelper/_customTable";
import { _dateFormatter } from "../../../_chartinghelper/_dateFormatter";
import PaginationTable from "../../../_chartinghelper/_tablePagination";
import { getTimeCharterLandingData } from "../helper";
import { CharteringContext } from "../../../charteringContext";

const headers = [
  { name: "SL" },
  { name: "Vessel Name" },
  { name: "Voyage No" },
  { name: "Transaction Name" },
  { name: "Transaction Date" },
  { name: "Transaction Amount" },
  { name: "JV Code" },
  { name: "Actions" },
];

export default function TimeCharterTable() {
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vesselDDL, setVesselDDL] = useState([]);
  const [voyageNoDDL, setVoyageNoDDL] = useState([]);
  const history = useHistory();
  const [charteringState, setCharteringState] = useContext(CharteringContext);

  const initData = charteringState?.timeCharterLandingFormData;

  // the function to update the context value
  const updateCharteringState = (newState) => {
    setCharteringState((prevState) => ({
      ...prevState,
      timeCharterLandingFormData: newState,
    }));
  };

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const getLandingData = (values, _pageNo = 0, _pageSize = 15) => {
    getTimeCharterLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.vesselName?.value,
      values?.voyageNo?.value,
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
    getLandingData(initData, pageNo, pageSize);
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
        onSubmit={() => {}}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <>
            {loading && <Loading />}
            <form className="marine-form-card">
              <div className="marine-form-card-heading">
                <p>Time Charter Transaction</p>
                <div>
                  <button
                    type="button"
                    className={"btn btn-primary px-3 py-2"}
                    onClick={() => {
                      updateCharteringState(values);
                      history.push({
                        pathname:"/chartering/transaction/timecharter/create",
                        state: values,
                        type:"create"
                      }
                      );
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
                        setFieldValue("voyageNo", "");
                        setFieldValue("vesselName", valueOption);
                        setGridData([]);
                        const updatedValues = {
                          ...values,
                          vesselName: valueOption,
                        };
                        updateCharteringState(updatedValues);
                        getVoyageDDL(updatedValues);
                        getLandingData(updatedValues);
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
                        setGridData([]);
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

              <ICustomTable ths={headers}>
                {gridData?.data?.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td>{item?.vesselName}</td>
                    <td>{item?.voyageNo}</td>
                    <td>{item?.transactionName}</td>
                    <td className="text-center">
                      {_dateFormatter(item?.transactionDate)}
                    </td>
                    <td className="text-right">
                      {_fixedPoint(item?.transactionAmount, true, 4)}
                    </td>
                    <td className="text-right">{item?.journalVoucherCode}</td>
                    <td className="text-center">
                      <div className="d-flex justify-content-around">
                        <IView
                          clickHandler={() => {
                            history.push({
                              pathname: `/chartering/transaction/timecharter/view/${item?.tcTransactionId}`,
                              state: item,
                              actionType:"view"
                            });
                          }}
                        />
                        {item?.isEditable && (
                          <IEdit
                            onClick={() => {
                              history.push({
                                pathname: `/chartering/transaction/timecharter/edit/${item?.tcTransactionId}`,
                                state: item,
                              });
                            }}
                          />
                        )}
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
