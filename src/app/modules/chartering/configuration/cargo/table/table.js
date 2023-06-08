/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router";
import IEdit from "../../../_chartinghelper/icons/_edit";
import Loading from "../../../_chartinghelper/loading/_loading";
import ICustomTable from "../../../_chartinghelper/_customTable";
import PaginationSearch from "../../../_chartinghelper/_search";
import PaginationTable from "../../../_chartinghelper/_tablePagination";
import { activeInactiveCargo, GetCargoLandingData } from "../helper";

const headers = [
  { name: "SL" },
  { name: "Cargo Name" },
  { name: "SF (m³/t)" },
  { name: "Pre-loading Survey" },
  { name: "Status" },
  { name: "Actions" },
];

export default function CargoTable() {
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [gridData, setGridData] = useState({});
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    GetCargoLandingData(pageNo, pageSize, "", setGridData, setLoading);
  }, [profileData, selectedBusinessUnit]);

  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    GetCargoLandingData(pageNo, pageSize, searchValue, setGridData, setLoading);
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, searchValue);
  };

  // const deleteHandler = (id) => {
  //   IConfirmModal({
  //     title: "Delete Cargo",
  //     message: "Are you sure you want to delete this cargo?",
  //     yesAlertFunc: () => {
  //       DeleteCargo(id, setLoading, () => {
  //         GetCargoLandingData(pageNo, pageSize, "", setGridData, setLoading);
  //       });
  //     },
  //     noAlertFunc: () => {},
  //   });
  // };

  const changeStatus = (id, status) => {
    activeInactiveCargo(id, status, setLoading, () => {
      GetCargoLandingData(pageNo, pageSize, "", setGridData, setLoading);
    });
  };

  return (
    <>
      {loading && <Loading />}
      <form className="marine-form-card">
        <div className="marine-form-card-heading">
          <p>Cargo</p>
          <div>
            <button
              type="button"
              className={"btn btn-primary px-3 py-2"}
              onClick={() =>
                history.push("/chartering/configuration/cargo/create")
              }
            >
              Create +
            </button>
          </div>
        </div>
        <div className="marine-form-card-content">
          <div className="row">
            <div className="col-lg-3">
              <PaginationSearch
                placeholder="Search by Cargo Name"
                paginationSearchHandler={paginationSearchHandler}
              />
            </div>
          </div>
        </div>

        <ICustomTable ths={headers}>
          {gridData?.data?.map((item, index) => (
            <tr key={index}>
              <td style={{ width: "40px" }} className="text-center">
                {index + 1}
              </td>
              <td>{item?.cargoName}</td>
              <td>{item?.sfm3}</td>
              <td>{`${
                item?.preloadingSurvey ? "Required" : "Not Required"
              } `}</td>
              <td style={{ width: "80px" }} className="text-center">
                {item?.isActive ? (
                  <OverlayTrigger
                    overlay={
                      <Tooltip id="cs-icon">{"Click here to Inactive"}</Tooltip>
                    }
                  >
                    <span>
                      <button
                        type="button"
                        className="btn btn-success ml-2 px-2 py-1"
                        onClick={() => {
                          changeStatus(item?.cargoId, false);
                        }}
                      >
                        Active
                      </button>
                    </span>
                  </OverlayTrigger>
                ) : (
                  <OverlayTrigger
                    overlay={
                      <Tooltip id="cs-icon">{"Click here to Active"}</Tooltip>
                    }
                  >
                    <span>
                      <button
                        type="button"
                        className="btn btn-danger ml-2 px-2 py-1"
                        onClick={() => {
                          changeStatus(item?.cargoId, true);
                        }}
                      >
                        Inactive
                      </button>
                    </span>
                  </OverlayTrigger>
                )}
              </td>
              <td style={{ width: "50px" }} className="text-center">
                <div className="d-flex justify-content-around">
                  <IEdit
                    clickHandler={() => {
                      history.push({
                        pathname: `/chartering/configuration/cargo/edit/${item?.cargoId}`,
                        state: item,
                      });
                    }}
                  />
                  {/* <IDelete remover={deleteHandler} id={item?.cargoId} /> */}
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
          />
        )}
      </form>
    </>
  );
}
