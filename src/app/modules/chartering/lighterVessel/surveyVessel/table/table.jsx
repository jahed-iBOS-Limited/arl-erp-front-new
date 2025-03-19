/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IEdit from "../../../_chartinghelper/icons/_edit";
import IView from "../../../_chartinghelper/icons/_view";
import Loading from "../../../_chartinghelper/loading/_loading";
import ICustomTable from "../../../_chartinghelper/_customTable";
import { _dateFormatter } from "../../../_chartinghelper/_dateFormatter";
import PaginationTable from "../../../_chartinghelper/_tablePagination";
import IViewModal from "../../../_chartinghelper/_viewModal";
import SurveyVesselForm from "../From/addEditFrom";
import { getSurveyVesselData } from "../helper";

const headers = [
  { name: "SL" },
  // { name: "Mother Vessel Name" },
  { name: "Reference No" },
  // { name: "Cargo Name" },
  { name: "LC No" },
  { name: "Arrival Date" },
  { name: "B/L Quantity" },
  { name: "Actions" },
];

export default function SurveyVesselTable() {
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [open, setOpen] = useState(false);
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [singleData, setSingleData] = useState({});
  const [editViewTag, setEditViewTag] = useState("");

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const viewHandler = (PageNo, PageSize) => {
    getSurveyVesselData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      PageNo,
      PageSize,
      setGridData,
      setLoading
    );
  };

  useEffect(() => {
    viewHandler(pageNo, pageSize);
  }, [profileData, selectedBusinessUnit]);

  const setPositionHandler = (pageNo, pageSize) => {
    viewHandler(pageNo, pageSize);
  };

  return (
    <>
      {loading && <Loading />}
      <form className="marine-form-card">
        <div className="marine-form-card-heading">
          <p>Survey Vessel</p>
          <div>
            <button
              type="button"
              className={"btn btn-primary px-3 py-2"}
              onClick={() => {
                setSingleData({});
                setOpen(true);
                setEditViewTag("");
              }}
              disabled={false}
            >
              + Create
            </button>
          </div>
        </div>
        <ICustomTable ths={headers}>
          {gridData?.data?.map((item, index) => (
            <tr key={index}>
              <td className="text-center" style={{ width: "40px" }}>
                {index + 1}
              </td>
              {/* <td>{item?.motherVesselName}</td> */}
              <td>{item?.referenceNo}</td>
              {/* <td>{item?.cargoName}</td> */}
              <td>{item?.lcno}</td>
              <td className="text-center">
                {_dateFormatter(item?.arrivalDate)}
              </td>
              <td className="text-center">{item?.blqty}</td>
              <td className="text-center" style={{ width: "130px" }}>
                <div className="d-flex justify-content-center">
                  <div className="mr-4">
                    <IView
                      clickHandler={() => {
                        setSingleData(item);
                        setOpen(true);
                        setEditViewTag("view");
                      }}
                    />
                  </div>
                  <div>
                    <IEdit
                      clickHandler={() => {
                        setSingleData(item);
                        setOpen(true);
                        setEditViewTag("edit");
                      }}
                    />
                  </div>
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
          />
        )}
      </form>
      <IViewModal show={open} onHide={() => setOpen(false)}>
        <SurveyVesselForm
          singleData={singleData}
          setOpen={setOpen}
          viewHandler={viewHandler}
          editViewTag={editViewTag}
        />
      </IViewModal>
    </>
  );
}
