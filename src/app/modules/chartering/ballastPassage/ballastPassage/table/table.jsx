/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { getVesselDDL, getVoyageDDLNew } from "../../../helper";
import FormikSelect from "../../../_chartinghelper/common/formikSelect";
import customStyles from "../../../_chartinghelper/common/selectCustomStyle";
import IEdit from "../../../_chartinghelper/icons/_edit";
import IView from "../../../_chartinghelper/icons/_view";
import Loading from "../../../_chartinghelper/loading/_loading";
import ICustomTable from "../../../_chartinghelper/_customTable";
import PaginationTable from "../../../_chartinghelper/_tablePagination";
import { getBallastPassageLandingData } from "../helper";

const initData = {
  vesselName: "",
  voyageNo: "",
};

const headers = [
  { name: "SL" },
  { name: "Vessel Name" },
  { name: "Voyage No" },
  { name: "Ballast Start Date-Time" },
  { name: "Ballast End Date-Time" },
  { name: "Duration (DAYS)" },
  { name: "Actions" },
];

export default function BallastPassageLanding() {
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
    getBallastPassageLandingData({
      accId: profileData?.accountId,
      buId: selectedBusinessUnit?.value,
      vesselId: 0,
      voyageId: 0,
      pageNo,
      pageSize,
      setter: setGridData,
      setLoading,
    });
  }, [profileData, selectedBusinessUnit]);

  const viewHandler = (pageNo, pageSize, values) => {
    getBallastPassageLandingData({
      accId: profileData?.accountId,
      buId: selectedBusinessUnit?.value,
      vesselId: values?.vesselName?.value || 0,
      voyageId: values?.voyageNo?.value || 0,
      pageNo,
      pageSize,
      setter: setGridData,
      setLoading,
    });
  };

  const setPositionHandler = (pageNo, pageSize, values) => {
    viewHandler(pageNo, pageSize, values);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values) => {}}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {loading && <Loading />}
            <form className="marine-form-card">
              <div className="marine-form-card-heading">
                <p>Ballast Passage</p>
                <div>
                  <button
                    type="button"
                    className={"btn btn-primary px-3 py-2"}
                    onClick={() =>
                      history.push(
                        "/chartering/ballastPassage/ballastPassage/create"
                      )
                    }
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
                        viewHandler(pageNo, pageSize, {
                          ...values,
                          vesselName: valueOption,
                        });
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
                        viewHandler(pageNo, pageSize, {
                          ...values,
                          voyageNo: valueOption,
                        });
                        setFieldValue("voyageNo", valueOption);
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
                    <td className="text-center">{item?.voyageNo}</td>
                    <td className="text-center">
                      {moment(item?.ballastStartDate).format(
                        "YYYY-MM-DD HH:mm A"
                      )}
                    </td>
                    <td className="text-center">
                      {moment(item?.ballastEndDate).format(
                        "YYYY-MM-DD HH:mm A"
                      )}
                    </td>
                    <td className="text-right">{item?.ballastDuration} DAYS</td>
                    <td className="text-center">
                      <div className="d-flex justify-content-around">
                        <IView
                          clickHandler={() => {
                            history.push(
                              `/chartering/ballastPassage/ballastPassage/view/${item?.ballastId}`
                            );
                          }}
                        />
                        <IEdit
                          clickHandler={() => {
                            history.push(
                              `/chartering/ballastPassage/ballastPassage/edit/${item?.ballastId}`
                            );
                          }}
                        />
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
