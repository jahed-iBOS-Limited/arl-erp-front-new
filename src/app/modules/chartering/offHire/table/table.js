/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
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

const initData = {
  filterBy: "",
  fromDate: "",
  toDate: "",
};

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

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    getVesselDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setVesselDDL
    );
    getOffHireLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      0,
      0,
      pageNo,
      pageSize,
      "",
      setGridData,
      setLoading
    );
  }, [profileData, selectedBusinessUnit]);

  const getGridData = (values) => {
    getOffHireLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.vesselName?.value || 0,
      values?.voyageNo?.value || 0,
      pageNo,
      pageSize,
      "",
      setGridData,
      setLoading
    );
  };

  const setPositionHandler = (pageNo, pageSize, values) => {
    getOffHireLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.vesselName?.value || 0,
      values?.voyageNo?.value || 0,
      pageNo,
      pageSize,
      "",
      setGridData,
      setLoading
    );
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
                    onClick={() => history.push("/chartering/offHire/create")}
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
                        if (valueOption) {
                          getVoyageDDLNew({
                            accId: profileData?.accountId,
                            buId: selectedBusinessUnit?.value,
                            id: valueOption?.value,
                            setter: setVoyageNoDDL,
                            setLoading: setLoading,
                            hireType: 0,
                            isComplete: 0,
                            voyageTypeId: 1,
                          });
                        }
                        getGridData({ ...values, vesselName: valueOption });
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
                        getGridData({ ...values, voyageNo: valueOption });
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
