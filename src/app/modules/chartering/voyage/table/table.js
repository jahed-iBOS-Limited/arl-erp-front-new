/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { getVesselDDL, getVoyageDDLNew } from "../../helper";
import VoyageDetails from "../../reports/voyageSummary/table/details";
import FormikSelect from "../../_chartinghelper/common/formikSelect";
import customStyles from "../../_chartinghelper/common/selectCustomStyle";
import IEdit from "../../_chartinghelper/icons/_edit";
import ICon from "../../_chartinghelper/icons/_icon";
import IView from "../../_chartinghelper/icons/_view";
import Loading from "../../_chartinghelper/loading/_loading";
import ICustomTable from "../../_chartinghelper/_customTable";
import PaginationTable from "../../_chartinghelper/_tablePagination";
import IViewModal from "../../_chartinghelper/_viewModal";
import { getVoyageCompletionChecklist, getVoyageLandingData } from "../helper";
import CompleteConfirmation from "./completeConfirmation";
import { CharteringContext } from "../../charteringContext";

const headers = [
  { name: "SL" },
  { name: "Ship Type" },
  { name: "Vessel Name" },
  { name: "Voyage No" },
  { name: "Voyage Type" },
  { name: "Voyage Start Date" },
  { name: "Voyage Completion Date" },
  { name: "Voyage Duration" },
  { name: "Status" },
  { name: "Actions" },
];

export default function VoyageTable() {
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(50);
  const [gridData, setGridData] = useState([]);
  const [vesselDDL, setVesselDDL] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [voyageNoDDL, setVoyageNoDDL] = useState([]);
  const [show, setShow] = useState(false);
  const [checkList, setCheckList] = useState({});
  const [singleRow, setSingleRow] = useState({});
  const [open, setOpen] = useState(false);
  const [charteringState, setCharteringState] = useContext(CharteringContext);

  const initData = charteringState?.voyageLandingFormData;

  // the function to update the context value
  const updateCharteringState = (newState) => {
    setCharteringState((prevState) => ({
      ...prevState,
      voyageLandingFormData: newState,
    }));
  };

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const viewGridData = (values) => {
    getVoyageLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      pageNo,
      pageSize,
      setLoading,
      setGridData,
      values?.voyageNo?.value,
      values?.vesselName?.label,
      values?.status?.value
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
      voyageTypeId: 0,
    });
  };

  useEffect(() => {
    getVesselDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setVesselDDL
    );
    if (initData?.vesselName) {
      getVoyageDDL(initData);
    }
    viewGridData(initData);
  }, [profileData, selectedBusinessUnit]);

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getVoyageLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      pageNo,
      pageSize,
      setLoading,
      setGridData,
      values?.voyageNo?.value,
      values?.vesselName?.label,
      values?.status?.value
    );
  };

  const percentageMaker = (item) => {
    let total = 0;
    if (item?.voyageTypeId === 1) {
      const timeCharter = [
        "lastActionDateBallastPassage",
        "lastActionDateBunkerInfo",
        "lastActionDateExpense",
        "lastActionDateInvoice",
        "lastActionDateOffHire",
      ];

      for (let i = 0; i < timeCharter?.length; i++) {
        if (item?.isIncomplete[`${timeCharter[i]}`] !== null) {
          total += 1;
        }
      }
    } else {
      const voyageCharter = [
        "lastActionDateBunkerCost",
        "lastActionDateBunkerInfo",
        "lastActionDateExpense",
        "lastActionDateInvoice",
        "lastActionDateLayTime",
      ];

      for (let i = 0; i < voyageCharter?.length; i++) {
        if (item?.isIncomplete[`${voyageCharter[i]}`] !== null) {
          total += 1;
        }
      }
    }

    return (total * 100) / 5 || 0;
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values) => {}}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <>
            {loading && <Loading />}
            <form className="marine-form-card">
              <div className="marine-form-card-heading">
                <p>Voyage</p>
                <div>
                  <button
                    type="button"
                    className={"btn btn-primary px-3 py-2"}
                    onClick={() => {
                      updateCharteringState(values);
                      history.push("/chartering/voyage/create");
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
                        setGridData([]);

                        setVoyageNoDDL([]);
                        setFieldValue("vesselName", valueOption);
                        if (valueOption) {
                          getVoyageDDL({ ...values, vesselName: valueOption });
                        }
                        updateCharteringState({
                          voyageNo: "",
                          vesselName: valueOption,
                        });

                        viewGridData({
                          ...values,
                          vesselName: valueOption,
                          voyageNo: "",
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
                        setGridData([]);
                        setFieldValue("voyageNo", valueOption);
                        updateCharteringState({
                          ...values,
                          voyageNo: valueOption,
                        });
                        viewGridData({
                          ...values,
                          voyageNo: valueOption,
                        });
                      }}
                      isDisabled={!values?.vesselName}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.status || ""}
                      isSearchable={true}
                      options={[
                        { value: 0, label: "All" },
                        { value: 1, label: "Complete" },
                        { value: 2, label: "InComplete" },
                      ]}
                      styles={customStyles}
                      name="status"
                      placeholder="Status"
                      label="Status"
                      onChange={(valueOption) => {
                        setGridData([]);
                        setFieldValue("status", valueOption);
                        updateCharteringState({
                          ...values,
                          status: valueOption,
                        });
                        viewGridData({
                          ...values,
                          status: valueOption,
                        });
                      }}
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
                    <td>{item?.hireTypeName}</td>
                    <td>{item?.vesselName}</td>
                    <td>{item?.voyageNo}</td>
                    <td>{item?.voyageTypeName}</td>
                    <td>
                      {moment(item?.voyageStartDate).format(
                        "DD-MMM-yyyy, HH:mm"
                      )}
                    </td>
                    <td>
                      {moment(item?.voyageEndDate).format("DD-MMM-yyyy, HH:mm")}
                    </td>
                    <td>{item?.voyageDurrition}</td>

                    <td style={{ width: "100px" }} className="text-center">
                      {!item?.isComplete ? (
                        <OverlayTrigger
                          overlay={
                            <Tooltip id="cs-icon">
                              Click here to Complete Voyage
                            </Tooltip>
                          }
                        >
                          <div
                            onClick={() => {
                              // changeStatus(item?.voyageId, true, values);
                              getVoyageCompletionChecklist(
                                item?.voyageId,
                                item?.vesselId,
                                item?.voyageTypeId,
                                setCheckList,
                                setLoading,
                                setShow
                              );
                              setSingleRow(item);
                              // setShow(true);
                            }}
                            style={{
                              cursor: "pointer",
                            }}
                          >
                            <div
                              className="progress"
                              style={{
                                cursor: "pointer",
                                height: "1.2rem",
                                position: "relative",
                                backgroundColor: "#e2e8f0",
                              }}
                            >
                              <div
                                className="progress-bar"
                                role="progressbar"
                                style={{
                                  width: `${percentageMaker(item)}%`,
                                  backgroundColor: "#4ade80",
                                }}
                                aria-valuenow="25"
                                aria-valuemin="0"
                                aria-valuemax="100"
                              ></div>
                            </div>
                            <span
                              style={{
                                color: "#0f172a",
                                position: "absolute",
                                zIndex: 10,
                                marginTop: "-15px",
                                marginLeft: "-10px",
                              }}
                            >
                              <strong>{percentageMaker(item)}%</strong>
                            </span>
                          </div>
                        </OverlayTrigger>
                      ) : (
                        <>
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="cs-icon">See Voyage Details</Tooltip>
                            }
                          >
                            <div
                              onClick={() => {
                                // changeStatus(item?.voyageId, false, values);
                                setSingleRow(item);
                                setOpen(true);
                                // toast.warning("Voyage Already Complete");
                              }}
                              className="progress"
                              style={{
                                cursor: "pointer",
                                height: "1.2rem",
                              }}
                            >
                              <div
                                className="progress-bar"
                                role="progressbar"
                                style={{
                                  width: "100%",
                                  backgroundColor: "#4ade80",
                                }}
                                aria-valuenow="100"
                                aria-valuemin="0"
                                aria-valuemax="100"
                              >
                                <strong style={{ color: "#0f172a" }}>
                                  <i
                                    style={{ color: "#0f172a" }}
                                    className="fa fa-check-circle mr-1"
                                  />
                                  100%
                                </strong>
                              </div>
                            </div>
                          </OverlayTrigger>
                        </>
                      )}
                    </td>
                    <td style={{ minWidth: "70px" }} className="text-center">
                      <div className="d-flex justify-content-center">
                        <IView
                          clickHandler={() => {
                            history.push({
                              pathname: `/chartering/voyage/view/${item?.voyageId}`,
                              state: item,
                            });
                          }}
                        />
                        <span className="mx-2">
                          {!item?.isComplete ? (
                            <IEdit
                              clickHandler={() => {
                                history.push({
                                  pathname: `/chartering/voyage/edit/${item?.voyageId}`,
                                  state: item,
                                });
                              }}
                            />
                          ) : null}
                        </span>

                        {item?.voyageTypeId === 2 ? (
                          <ICon
                            onClick={() => {
                              history.push({
                                pathname: `/chartering/voyage/shipper/${item?.voyageId}`,
                                state: item,
                              });
                            }}
                            title="Add Shipper"
                          >
                            <i className="fa fa-ship" />
                          </ICon>
                        ) : null}
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

            <CompleteConfirmation
              show={show}
              setShow={setShow}
              onHide={() => setShow(false)}
              checkList={checkList}
              singleRow={singleRow}
              viewGridData={viewGridData}
              values={values}
            />
            <IViewModal
              show={open}
              onHide={() => {
                setOpen(false);
              }}
            >
              <VoyageDetails singleRow={singleRow} />
            </IViewModal>
          </>
        )}
      </Formik>
    </>
  );
}
