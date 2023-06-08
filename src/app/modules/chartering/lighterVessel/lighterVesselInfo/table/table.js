/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IEdit from "../../../_chartinghelper/icons/_edit";
import Loading from "../../../_chartinghelper/loading/_loading";
import ICustomTable from "../../../_chartinghelper/_customTable";
import PaginationTable from "../../../_chartinghelper/_tablePagination";
import IViewModal from "../../../_chartinghelper/_viewModal";
import LighterVesselForm from "../Form/addEditForm";
import { getLighterVesselList } from "../helper";
import LighterVesselMasterInformation from "../_lighterVesselMasterInfo/Form/addEditForm";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const headers = [
  { name: "SL" },
  { name: "Lighter Vessel Name" },
  { name: "Capacity" },
  { name: "Actions" },
];

export default function LighterVesselInfo() {
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(50);
  const [open, setOpen] = useState(false);
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [singleData, setSingleData] = useState({});
  const [show, setShow] = useState(false);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const viewHandler = (PageNo, PageSize) => {
    getLighterVesselList(
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
          <p>Lighter Vessel</p>
          <div>
            <button
              type="button"
              className={"btn btn-primary px-3 py-2"}
              onClick={() => {
                setSingleData({});
                setOpen(true);
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
              <td>{item?.lighterVesselName}</td>
              <td>{item?.capacity}</td>
              <td className="text-center" style={{ width: "130px" }}>
                <span className="mr-1">
                  <IEdit
                    clickHandler={() => {
                      setSingleData(item);
                      setOpen(true);
                    }}
                  />
                </span>
                <span
                  className="ml-1"
                  onClick={() => {
                    setSingleData(item);
                    setShow(true);
                  }}
                >
                  <OverlayTrigger
                    overlay={
                      <Tooltip id="cs-icon">Master's Bank Information</Tooltip>
                    }
                  >
                    <i class="fas fa-university pointer"></i>
                  </OverlayTrigger>
                </span>
              </td>
            </tr>
          ))}
        </ICustomTable>

        {gridData?.data?.length > 0 && (
          <PaginationTable
            count={gridData?.totalCount}
            setPositionHandler={setPositionHandler}
            paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
          />
        )}
      </form>
      <IViewModal show={open} onHide={() => setOpen(false)}>
        <LighterVesselForm
          singleData={singleData}
          setOpen={setOpen}
          viewHandler={viewHandler}
        />
      </IViewModal>
      <IViewModal show={show} onHide={() => setShow(false)}>
        <LighterVesselMasterInformation
          singleData={singleData}
          setOpen={setOpen}
          viewHandler={viewHandler}
        />
      </IViewModal>
    </>
  );
}
