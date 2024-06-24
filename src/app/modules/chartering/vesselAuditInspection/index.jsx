import { Formik } from "formik";
import React, { useState } from "react";
import { _firstDateofMonth } from "../../_helper/_firstDateOfCurrentMonth";
import { _todayDate } from "../../_helper/_todayDate";
import Loading from "../../_helper/_loading";
import { useHistory } from "react-router-dom";
import FormikSelect from "../_chartinghelper/common/formikSelect";
import customStyles from "../../selectCustomStyle";
import FormikInput from "../_chartinghelper/common/formikInput";
import { _dateFormatter } from "../../_helper/_dateFormate";
import { OverlayTrigger } from "react-bootstrap";
import ICustomTable from "../_chartinghelper/_customTable";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "../../_helper/customHooks/useAxiosGet";
import PaginationTable from "../../_helper/_tablePagination";
import * as Yup from "yup";
import { getVesselDDL } from "./helper";
import IViewModal from "../../_helper/_viewModal";
import NCView from "./components/modalView";
import IView from "../../_helper/_helperIcons/_view";
import IEdit from "../../_helper/_helperIcons/_edit";
import InfoCircle from "../../_helper/_helperIcons/_infoCircle";
import IHistory from "../../_helper/_helperIcons/_history";

const initData = {
  vesselType: "",
  vessel: "",
  fromDate: _firstDateofMonth(),
  toDate: _todayDate(),
};
const headers = [
  { name: "SL" },
  { name: "Description" },
  { name: "Date", style: { minWidth: "65px" } },
  { name: "Type", style: { minWidth: "65px" } },
  { name: "Category" },
  { name: "Title" },
  { name: "Total No. of NC/Non-NC", style: { minWidth: "65px" } },

  { name: "Action", style: { minWidth: "40px" } },
];

export default function VesselAuditLanding() {
  const {
    profileData: { userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(100);
  const [ViewType, setViewType] = useState(0);
  const [gridData, getGridData, gridDataLoading, setGridData] = useAxiosGet();
  const [isShowHistoryModal, setIsShowHistoryModal] = useState(false);

  const [
    data,
    getVesselAuditInspectionDetails,
    dettailLoader,
    setData,
  ] = useAxiosGet();
  const [vesselDDl, setVesselDDl] = useState([]);

  const getLandingData = (values, pageNo, pageSize, searchValue = "") => {
    getGridData(
      `/hcm/VesselAuditInspection/GetVesselAuditInspectionLanding?businessUnitId=${buId}&vesselType=${values?.vesselType?.value}&vesselId=${values?.vessel?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}&pageNo=${pageNo}&pageSize=${pageSize}`
    );
  };
  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getLandingData(values, pageNo, pageSize, searchValue);
  };
  const validationSchema = Yup.object().shape({
    vesselType: Yup.object().required("Vessel Type is required"),
    vessel: Yup.object()
      .required("Vessel is required")
      .typeError("Vessel is required"),
    fromDate: Yup.date().required("Date is required"),
    toDate: Yup.date().required("Date is required"),
  });
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          getLandingData(values, pageNo, pageSize);
        }}
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
                <p>Vessel Audit</p>
                <div>
                  <button
                    type="button"
                    className={"btn btn-primary px-3 py-2"}
                    onClick={() =>
                      history.push(
                        "/chartering/certificateManagement/vesselAuditInspection/create"
                      )
                    }
                  >
                    Create
                  </button>
                </div>
              </div>

              <div className="marine-form-card-content">
                <div className="row">
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.vesselType || ""}
                      isSearchable={true}
                      options={[
                        { value: "MotherVessel", label: "Mother Vessel" },
                        { value: "LighterVessel", label: "Lighter Vessel" },
                      ]}
                      styles={customStyles}
                      name="vesselType"
                      placeholder="Mother, Lighter"
                      label="Vessel Type"
                      onChange={(valueOption) => {
                        setFieldValue("vesselType", valueOption);
                        getVesselDDL(
                          valueOption?.value,
                          buId,
                          setVesselDDl,
                          setLoading
                        );
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.vessel || ""}
                      isSearchable={true}
                      options={vesselDDl || []}
                      styles={customStyles}
                      name="vessel"
                      placeholder={
                        values?.vesselType?.value === "MotherVessel"
                          ? "Mother Vessel"
                          : "Vessel/Ligher"
                      }
                      label={
                        values?.vesselType?.value === "MotherVessel"
                          ? "Mother Vessel"
                          : "Vessel/Ligher"
                      }
                      onChange={(valueOption) => {
                        setFieldValue("vessel", valueOption);
                        // gridData({ ...values, certificateName: valueOption });
                      }}
                      // isDisabled={!values?.vesselName}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <FormikInput
                      value={values?.fromDate}
                      name="fromDate"
                      placeholder="From Date"
                      type="date"
                      onChange={(e) => {
                        // gridData({ ...values, fromDate: e.target.value });
                        setFieldValue("fromDate", e.target.value);
                      }}
                      errors={errors}
                      touched={touched}
                      label="From Date "
                    />
                  </div>
                  <div className="col-lg-2">
                    <FormikInput
                      value={values?.toDate}
                      name="toDate"
                      placeholder="To Date"
                      type="date"
                      min={values?.fromDate}
                      onChange={(e) => {
                        // gridData({ ...values, toDate: e.target.value });
                        setFieldValue("toDate", e.target.value);
                      }}
                      errors={errors}
                      touched={touched}
                      label="To Date "
                    />
                  </div>
                  <div className="col-lg-2">
                    <button
                      type="submit"
                      className={"btn btn-primary ml-2 mt-5 px-3 py-2"}
                      onClick={handleSubmit}
                      //disabled={!rowData?.length}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>

              {gridDataLoading && <Loading />}
              <ICustomTable ths={headers}>
                {gridData?.data?.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td className="text-center">{item?.strVesselName}</td>
                    <td className="text-center">
                      {_dateFormatter(item?.dteInspectionDate)}
                    </td>
                    <td className="text-center">{item?.strTypeName}</td>
                    <td className="text-center">{item?.strCategoryName}</td>
                    <td className="text-center">{item?.strTitle}</td>
                    <td className="text-center">
                      <span
                        className="text-primary"
                        style={{
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setViewType(1);
                          setIsShowHistoryModal(true);
                          getVesselAuditInspectionDetails(
                            `/hcm/VesselAuditInspection/GetVesselAuditInspectionDetails?auditInspectionId=${item?.intAuditInspectionId}&typeId=1
`
                          );
                        }}
                      >
                        {item?.intTotalNc}
                      </span>
                      /
                      <span
                        className="text-primary"
                        style={{
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setViewType(2);
                          setIsShowHistoryModal(true);

                          getVesselAuditInspectionDetails(
                            `/hcm/VesselAuditInspection/GetVesselAuditInspectionDetails?auditInspectionId=${item?.intAuditInspectionId}&typeId=2
`
                          );
                        }}
                      >
                        {item?.intTotalNonNc}
                      </span>
                    </td>
                    <td>
                      {" "}
                      <div className="d-flex justify-content-center">
                        <span
                          onClick={() => {
                            setViewType(0);
                            setIsShowHistoryModal(true);
                            getVesselAuditInspectionDetails(
                              `/hcm/VesselAuditInspection/GetVesselAuditInspectionDetails?auditInspectionId=${item?.intAuditInspectionId}&typeId=0
`
                            );
                          }}
                          className="ml-2 mr-3"
                        >
                          <IView />
                        </span>

                        <span className="mx-1">
                          <IHistory
                            clickHandler={(e) => {
                              history.push({
                                pathname: `/chartering/certificateManagement/vesselAuditInspection/view/${item?.intAuditInspectionId}`,
                                state: item,
                              });
                            }}
                          />
                        </span>
                        <span className="mx-1">
                          <IEdit
                            onClick={(e) => {
                              history.push({
                                pathname: `/chartering/certificateManagement/vesselAuditInspection/edit/${item?.intAuditInspectionId}`,
                                state: item,
                              });
                            }}
                          />
                        </span>
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

              {isShowHistoryModal && (
                <IViewModal
                  show={isShowHistoryModal}
                  onHide={() => {
                    setIsShowHistoryModal(false);
                    setData([]);
                    setViewType(0);
                    //   setSingleData(null);
                  }}
                  title={
                    ViewType === 1
                      ? "NC Details"
                      : ViewType === 2
                      ? "Non-NC Details"
                      : "View Details"
                  }
                >
                  <NCView
                    propsObj={{
                      data,
                      ViewType,
                    }}
                  />
                </IViewModal>
              )}
            </form>
          </>
        )}
      </Formik>
    </>
  );
}
