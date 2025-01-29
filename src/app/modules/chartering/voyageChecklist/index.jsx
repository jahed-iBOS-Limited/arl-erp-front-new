/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import FormikSelect from "../_chartinghelper/common/formikSelect";
import customStyles from "../_chartinghelper/common/selectCustomStyle";
import Loading from "../_chartinghelper/loading/_loading";
import ICustomTable from "../_chartinghelper/_customTable";
import { getVoyageDDLNew, getVesselDDL } from "../helper";
import { getVoyageChecklistPasignation } from "./helper";
import PaginationTable from "../_chartinghelper/_tablePagination";
import { _dateFormatter } from "../../_helper/_dateFormate";

const headers = [{ name: "SL" }, { name: "Vessel" }, { name: "Charter Type" }, { name: "Voyage No" }, { name: "Completed Voyage" }];

const initData = {
  vesselName: "",
  voyageNo: "",
};

export function VoyageChecklist() {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [vesselDDL, setVesselDDL] = useState([]);
  const [voyageNoDDL, setVoyageNoDDL] = useState([]);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const history = useHistory();
  useEffect(() => {
    getVesselDDL(profileData?.accountId, selectedBusinessUnit?.value, setVesselDDL, "");
    getVoyageChecklistPasignation("asc", pageNo, pageSize, setRowDto, setLoading);
  }, [profileData, selectedBusinessUnit]);

  const setPositionHandler = (pageNo, pageSize) => {
    getVoyageChecklistPasignation(
      16,
      "asc",
      pageNo,
      pageSize,
      setRowDto, 
      setLoading
    );
  };
  return (
    <>
      <Formik enableReinitialize={true} initialValues={initData} onSubmit={(values, { setSubmitting, resetForm }) => {}}>
        {({ values, errors, touched, setFieldValue, handleSubmit, resetForm }) => (
          <>
            {loading && <Loading />}
            <form className="marine-form-card">
              <div className="marine-form-card-heading">
                <p>Voyage Checklist</p>
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
                        if (valueOption) {
                          getVoyageDDLNew({
                            accId: profileData?.accountId,
                            buId: selectedBusinessUnit?.value,
                            id: valueOption?.value,
                            setter: setVoyageNoDDL,
                            setLoading: setLoading,
                            hireType: 0,
                            isComplete: 0,
                            voyageTypeId: 0,
                          });
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
                      }}
                      isDisabled={false}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      style={{ marginTop: "14px" }}
                      className={"btn btn-primary"}
                      onClick={() => {
                        history.push({
                          pathname: `/chartering/voyageChecklist/voyageChecklist/details`,
                          state: { voyageNo: values?.voyageNo },
                        });
                      }}
                      disabled={!values?.vesselName || !values?.voyageNo}
                    >
                      Show
                    </button>
                  </div>
                </div>
              </div>

              <ICustomTable ths={headers}>
                {rowDto?.Data?.length > 0 &&
                  rowDto?.Data?.map((item, index) => (
                    <tr key={index}>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-center">{item?.VesselName}</td>
                      <td className="text-center">{item?.VoyageType}</td>
                      <td className="text-center">{item?.VoyageNo}</td>
                      <td className="text-center">
                        {_dateFormatter(item?.VoyageEndDate)}
                      </td>
                    </tr>
                  ))}
              </ICustomTable>
              {rowDto?.Data?.length > 0 && (
                <PaginationTable
                  count={rowDto?.TotalCount}
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
