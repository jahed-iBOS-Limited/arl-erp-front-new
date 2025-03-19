import React, { useEffect, useState, useRef } from "react";
import ICustomCard from "../../../../_helper/_customCard";
import IViewModal from "../../../../_helper/_viewModal";
import { useSelector, shallowEqual } from "react-redux";
import {
  getPlantDDL,
  getLandingData,
  getYearDDL,
  getHorizonDDLView,
  getHorizonDDLCreate,
  createMaterialRequirementPlanning,
  getMrplanningInfoDetails_api,
} from "../helper";
import Loading from "../../../../_helper/_loading";
import { Formik } from "formik";
import NewSelect from "../../../../_helper/_select";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import numberWithCommas from "../../../../_helper/_numberWithCommas";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import "./style.css";
import PRCreateForm from "../createPr/addEditForm";
import NotPermittedPage from "../../../../_helper/notPermitted/NotPermittedPage";
import DetailsView from "./detailsView";

const initData = {
  plant: "",
  year: "",
  horizonView: "",
  horizonCreate: "",
  viewMode: true,
};

const MaterialReqPlanLanding = () => {
  const [loading, setLoading] = useState(false);
  const [detailsModel, setDetailsModel] = useState(false);
  const [plantDDL, setPlantDDL] = useState([]);
  const [yearDDL, setYearDDL] = useState([]);
  const printRef = useRef();

  const [gridData, setGridData] = useState([]);
  const [detailsGridData, setDetailsGridData] = useState([]);

  const [horizonCreateDDL, setHorizonCreateDDL] = useState([]);
  const [horizonViewDDL, setHorizonViewDDL] = useState([]);

  const [showPRModal, setShowPRModal] = useState(false);
  const [PRModalData, setPRModalData] = useState();

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return {
      profileData: state.authData.profileData,
      selectedBusinessUnit: state.authData.selectedBusinessUnit,
    };
  });

  const saveHandler = (values, cb) => {
    const payload = {
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      plantId: values.plant?.value,
      planningHorizonId: values?.year?.planningHorizonId,
      planningHorizonRowId: values?.horizonCreate?.value,
      actionBy: profileData?.userId,
    };

    createMaterialRequirementPlanning(payload, cb, setLoading);
  };

  useEffect(() => {
    getPlantDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setPlantDDL
    );
  }, [profileData, selectedBusinessUnit]);

  const { userRole } = useSelector((state) => state?.authData, shallowEqual);
  let materialReqPlan = null;

  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 909) {
      materialReqPlan = userRole[i];
    }
  }

  if (!materialReqPlan?.isView) return <NotPermittedPage />;

  return (
    <ICustomCard title="Material Requirement Plan">
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <>
            {loading && <Loading />}

            {/* Create Row */}
            <div className="global-form row">
              <div className="col-lg-12 row mb-4">
                <div className="col-lg-4 d-flex align-items-center">
                  <label className="mr-2">View</label>
                  <input
                    className="mr-4"
                    name="viewMode"
                    type="radio"
                    checked={values?.viewMode}
                    onChange={(e) => {
                      resetForm({ ...initData, viewMode: true });
                      setFieldValue("viewMode", true);
                    }}
                  />

                  {materialReqPlan?.isCreate && (
                    <>
                      <label className="mr-2">Create</label>
                      <input
                        name="viewMode"
                        type="radio"
                        checked={!values?.viewMode}
                        onChange={(e) => {
                          resetForm({ ...initData, viewMode: false });
                          setFieldValue("viewMode", false);
                        }}
                      />
                    </>
                  )}
                </div>

                {values?.viewMode && gridData?.objList?.length > 0 ? (
                  <>
                    <div className="col-lg-4 offset-4 d-flex justify-content-end">
                      <ReactToPrint
                        trigger={() => (
                          <button
                            type="button"
                            className="btn btn-primary mr-2"
                            style={{ padding: "2px 5px" }}
                          >
                            <img
                              style={{
                                width: "25px",
                                paddingRight: "5px",
                              }}
                              src={printIcon}
                              alt="print-icon"
                            />
                            Print
                          </button>
                        )}
                        content={() => printRef.current}
                      />

                      <ReactHTMLTableToExcel
                        id="test-table-xls-button-att-reports"
                        className="btn btn-primary"
                        table={"table-to-xlsx"}
                        filename={"MaterialRequirementPlan"}
                        sheet={"Sheet"}
                        buttonText="Export Excel"
                      />
                    </div>
                  </>
                ) : null}
              </div>

              <div className="col-lg-3">
                <NewSelect
                  isHiddenToolTip
                  name="plant"
                  options={plantDDL}
                  value={values?.plant}
                  isSearchable={true}
                  label="Plant"
                  placeholder="Plant"
                  onChange={(valueOption) => {
                    setFieldValue("plant", valueOption);
                    setFieldValue("year", "");
                    setGridData([]);
                    getYearDDL(
                      profileData?.accountId,
                      selectedBusinessUnit?.value,
                      valueOption?.value,
                      setYearDDL
                    );
                  }}
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="year"
                  options={yearDDL}
                  value={values?.year}
                  isSearchable={true}
                  label="Year"
                  placeholder="Year"
                  onChange={(valueOption) => {
                    setFieldValue("year", valueOption);
                    setFieldValue("horizonCreate", "");
                    setFieldValue("horizonView", "");
                    setGridData([]);
                    if (!values?.viewMode) {
                      getHorizonDDLCreate(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        values?.plant?.value,
                        valueOption?.value,
                        setHorizonCreateDDL
                      );
                    } else {
                      getHorizonDDLView(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        values?.plant?.value,
                        valueOption?.value,
                        setHorizonViewDDL
                      );
                    }
                  }}
                  errors={errors}
                  touched={touched}
                />
              </div>

              {values?.viewMode ? (
                <>
                  <div className="col-lg-3">
                    <NewSelect
                      name="horizonView"
                      options={horizonViewDDL}
                      value={values?.horizonView}
                      label="Planning Horizon"
                      placeholder="Planning Horizon"
                      onChange={(valueOption) => {
                        setFieldValue("horizonView", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg">
                    <button
                      onClick={() => {
                        getLandingData(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          values?.plant?.value,
                          values?.year?.planningHorizonId,
                          values?.horizonView?.value,
                          setGridData
                        );
                      }}
                      style={{ marginTop: "18px" }}
                      className="btn btn-primary"
                      disabled={
                        !values?.plant ||
                        !values?.year ||
                        !values?.horizonView?.value
                      }
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        setDetailsModel(true);
                        getMrplanningInfoDetails_api(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          values?.plant?.value,
                          values?.year?.planningHorizonId,
                          values?.horizonView?.value,
                          setDetailsGridData,
                          setLoading
                        );
                      }}
                      style={{ marginTop: "18px" }}
                      className="btn btn-primary ml-2"
                      disabled={
                        !values?.plant ||
                        !values?.year ||
                        !values?.horizonView?.value
                      }
                    >
                      Details
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="col-lg-3">
                    <NewSelect
                      name="horizonCreate"
                      options={horizonCreateDDL}
                      value={values?.horizonCreate}
                      label="Planning Horizon"
                      placeholder="Planning Horizon"
                      onChange={(valueOption) => {
                        setFieldValue("horizonCreate", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg">
                    <button
                      onClick={() => {
                        saveHandler(values, () => {
                          resetForm(initData);
                        });
                      }}
                      style={{ marginTop: "18px" }}
                      className="btn btn-primary"
                      disabled={
                        !values?.plant ||
                        !values?.year ||
                        !values?.horizonCreate?.value
                      }
                    >
                      Create
                    </button>
                  </div>
                </>
              )}
            </div>

            {values?.viewMode && gridData?.objList?.length > 0 && (
              <div ref={printRef}>
                <div className="text-center mt-6 mb-4 materialReqPlan-printReport">
                  <h2>{selectedBusinessUnit?.label.toUpperCase()}</h2>
                  <h4
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    {values?.plant?.label}
                  </h4>
                  <h5 className="m-0">Material Requirement Plan</h5>
                </div>

                <div className="table-responsive">
                  <table
                    id="table-to-xlsx"
                    className="table table-striped table-bordered global-table"
                  >
                    <>
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Item Name</th>
                          <th>UoM</th>
                          <th>{gridData?.objH?.planningHorizonRowName}</th>
                          <th>{gridData?.objH?.planningHorizonRowName2}</th>
                          <th>{gridData?.objH?.planningHorizonRowName3}</th>
                          <th>Total</th>
                          <th className="printSectionNone">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.objList?.map((item, index) => {
                          const total = isNaN(
                            item?.numItemQty01 +
                              item?.numItemQty02 +
                              item?.numItemQty03
                          )
                            ? 0
                            : item?.numItemQty01 +
                              item?.numItemQty02 +
                              item?.numItemQty03;
                          return (
                            <tr key={index + 1}>
                              <td>{index + 1}</td>
                              <td>{item?.itemName}</td>
                              <td>{item?.uomname}</td>
                              <td className="text-right">
                                {numberWithCommas(item?.numItemQty01)}
                              </td>
                              <td className="text-right">
                                {numberWithCommas(item?.numItemQty02)}
                              </td>
                              <td className="text-right">
                                {numberWithCommas(item?.numItemQty03)}
                              </td>
                              <td className="text-right">{`${
                                isNaN(total) ? 0 : numberWithCommas(total)
                              }`}</td>
                              <td className="text-center printSectionNone">
                                <span
                                  className="extend"
                                  onClick={() => {
                                    setShowPRModal(true);
                                    setPRModalData(item);
                                  }}
                                >
                                  <OverlayTrigger
                                    overlay={
                                      <Tooltip id="cs-icon">
                                        {"Create PR"}
                                      </Tooltip>
                                    }
                                  >
                                    <span>
                                      <i className={`fa fa-arrows-alt`}></i>
                                    </span>
                                  </OverlayTrigger>
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </>
                  </table>
                </div>
              </div>
            )}
            <IViewModal show={showPRModal} onHide={() => setShowPRModal(false)}>
              <PRCreateForm
                setShowPRModal={setShowPRModal}
                PRModalData={PRModalData}
                setPRModalData={setPRModalData}
              />
            </IViewModal>
            {detailsModel && (
              <IViewModal
                show={detailsModel}
                onHide={() => setDetailsModel(false)}
                title="MRP Details"
              >
                <DetailsView
                  obj={{ detailsGridData, selectedBusinessUnit, values }}
                />
              </IViewModal>
            )}
          </>
        )}
      </Formik>
    </ICustomCard>
  );
};

export default MaterialReqPlanLanding;
