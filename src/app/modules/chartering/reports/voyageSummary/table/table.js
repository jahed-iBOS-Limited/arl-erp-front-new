/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { getVesselDDL } from "../../../helper";
import FormikSelect from "../../../_chartinghelper/common/formikSelect";
import customStyles from "../../../_chartinghelper/common/selectCustomStyle";
import Loading from "../../../_chartinghelper/loading/_loading";
import ICustomTable from "../../../_chartinghelper/_customTable";
import PaginationTable from "../../../_chartinghelper/_tablePagination";
import IViewModal from "../../../_chartinghelper/_viewModal";
import { getVoyageSummary } from "../helper";
import VoyageDetails from "./details";

const initData = {
  vesselName: "",
};

const headers = [
  { name: "SL" },
  { name: "Voyage No" },
  { name: "Ship Type" },
  { name: "Ship Owner" },
  { name: "Voyage Type" },
  { name: "Commence Date" },
  { name: "Completion Date" },
  { name: "Duration" },
  { name: "Start Port" },
  { name: "End Port" },
  { name: "Action" },
];

export default function VoyageSummary() {
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [gridData, setGridData] = useState([]);
  const [vesselDDL, setVesselDDL] = useState([]);
  const [loading, setLoading] = useState(false);
  const [singleRow, setSingleRow] = useState({});
  const [open, setOpen] = useState(false);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    getVesselDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setVesselDDL
    );
  }, [profileData, selectedBusinessUnit]);

  const getGridData = (values) => {
    getVoyageSummary(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.vesselName?.value,
      pageNo,
      pageSize,
      setLoading,
      setGridData
    );
  };

  const setPositionHandler = (pageNo, pageSize, values) => {
    getVoyageSummary(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.vesselName?.value,
      pageNo,
      pageSize,
      setLoading,
      setGridData
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values) => {}}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <>
            {loading && <Loading />}
            <form className="marine-form-card">
              <div className="marine-form-card-heading">
                <p>Voyage Summary</p>
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
                        if (valueOption) {
                          getGridData({ ...values, vesselName: valueOption });
                        } else {
                          setGridData([]);
                        }
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
                    <td className="text-center">{item?.voyageNo}</td>
                    <td>{item?.hireTypeName}</td>
                    <td>{item?.ownerName}</td>
                    <td>{item?.voyageTypeName}</td>
                    <td className="text-center">
                      {moment(item?.voyageStartDate).format(
                        "DD-MMM-yyyy, HH:mm"
                      )}
                    </td>
                    <td className="text-center">
                      {" "}
                      {moment(item?.voyageEndDate).format("DD-MMM-yyyy, HH:mm")}
                    </td>
                    <td className="text-center">{item?.voyageDurrition}</td>
                    <td>{item?.startPortName}</td>
                    <td>{item?.endPortName}</td>
                    <td className="text-center">
                      <OverlayTrigger
                        overlay={
                          <Tooltip id="cs-icon">Details information</Tooltip>
                        }
                      >
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setSingleRow(item);
                            setOpen(true);
                          }}
                        >
                          <i className="fas fa-lg fa-info-circle"></i>
                        </span>
                      </OverlayTrigger>
                    </td>
                  </tr>
                ))}
              </ICustomTable>
              <IViewModal
                // title="Voyage Details"
                show={open}
                onHide={() => setOpen(false)}
              >
                <VoyageDetails singleRow={singleRow} />
              </IViewModal>

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
