/* eslint-disable no-unused-vars */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ICard from "../../../../_helper/_card";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import Loading from "../../../../_helper/_loading";
import PaginationSearch from "../../../../_helper/_search";
import NewSelect from "../../../../_helper/_select";
import PaginationTable from "../../../../_helper/_tablePagination";
import IViewModal from "../../../../_helper/_viewModal";
import { getChannelDDL } from "../../../../salesManagement/configuration/territoryInfo/helper";
import PartnerTerritoryInfoForm from "../form/addEditForm";
import { findDuplicateItems, getPartnerTerritoryInformation } from "../helper";
import { PartnerTerritoryUpdate } from "./territoryUpdate";

const initData = {
  channel: "",
};

export function PartnerTerritoryInformation() {
  const [channelDDL, setChannelDDL] = useState([]);
  const [gridData, setGridData] = useState({});
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [configId, setConfigId] = useState("");
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [open, setOpen] = useState(false);

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    getChannelDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setChannelDDL
    );
  }, [profileData, selectedBusinessUnit]);

  const getGridData = (values, _pageNo, _pageSize, searchValue = "") => {
    getPartnerTerritoryInformation(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.channel?.value,
      values?.status?.value,
      profileData?.userId,
      searchValue || "",
      _pageNo,
      _pageSize,
      setGridData,
      setLoading
    );
  };

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getGridData(values, pageNo, pageSize);
  };

  const paginationSearchHandler = (searchValue, values) => {
    getGridData(values, pageNo, pageSize, searchValue);
  };

  const duplicates = findDuplicateItems(
    gridData?.data?.length ? gridData?.data : []
  );

  console.log(duplicates, "duplicates");

  return (
    <>
      <ICard title="Partner Territory Information">
        <Formik
          initialValues={initData}
          enableReinitialize={true}
          onSubmit={(values) => {
            getGridData(values, pageNo, pageSize, "");
          }}
        >
          {({ values, setFieldValue, handleSubmit }) => (
            <>
              <div className="row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="channel"
                    placeholder="Distribution Channel"
                    value={values?.channel}
                    label="Distribution Channel"
                    onChange={(valueOption) => {
                      setFieldValue("channel", valueOption);
                      setGridData([]);
                    }}
                    options={channelDDL}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="status"
                    placeholder="Status"
                    value={values?.status}
                    label="Status"
                    onChange={(valueOption) => {
                      setFieldValue("status", valueOption);
                      setGridData([]);
                    }}
                    options={[
                      { value: true, label: "Active" },
                      { value: false, label: "InActive" },
                    ]}
                  />
                </div>
                <div className="col-lg-3 d-flex mt-5">
                  <button
                    className="btn btn-primary mr-2"
                    type="submit"
                    onClick={handleSubmit}
                    disabled={!values?.channel}
                  >
                    Show
                  </button>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => {
                      setOpen(true);
                    }}
                    disabled={!values?.channel}
                  >
                    Territory Insertion
                  </button>
                </div>
              </div>
              {gridData?.data?.length > 0 && (
                <PaginationSearch
                  placeholder="Partner Name & Code Search"
                  paginationSearchHandler={paginationSearchHandler}
                  values={values}
                />
              )}
              {loading && <Loading />}

              {gridData?.data?.length > 0 && (
                 <div className="table-responsive">
                 <table className="table table-striped table-bordered global-table">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Customer Name</th>
                      <th>Customer Address</th>
                      <th>Code</th>
                      <th>Channel</th>
                      <th>Region</th>
                      <th>Area</th>
                      <th>Territory</th>
                      <th>Insert By</th>
                      <th>Insert Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gridData?.data?.map((item, index) => (
                      <tr
                        key={index}
                        style={
                          duplicates.includes(item?.businessPartnerId)
                            ? { backgroundColor: "#fcdc34a3" }
                            : {}
                        }
                      >
                        <td> {item?.sl}</td>
                        <td>{item?.partnerName}</td>
                        <td>{item?.businessPartnerAddress}</td>
                        <td>{item?.partnerCode}</td>
                        <td>{item?.channelName}</td>
                        <td>{item?.region}</td>
                        <td>{item?.area}</td>
                        <td>{item?.territory}</td>
                        <td>{item?.actionBy}</td>
                        <td>{item?.lastInsertDate}</td>
                        <td>
                          <div className="d-flex justify-content-around">
                            <button
                              disabled={!item?.isPermission}
                              className="btn p-0"
                              onClick={() => {
                                setShow(true);
                                setConfigId(item?.configId);
                              }}
                            >
                              <IEdit />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                 </div>
              )}
              {gridData?.data?.length > 0 && (
                <PaginationTable
                  count={gridData?.counts}
                  setPositionHandler={setPositionHandler}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                  values={values}
                />
              )}
              <IViewModal show={show} onHide={() => setShow(false)}>
                <PartnerTerritoryInfoForm
                  id={configId}
                  values={values}
                  accId={profileData?.accountId}
                  buId={selectedBusinessUnit?.value}
                  setShow={setShow}
                ></PartnerTerritoryInfoForm>
              </IViewModal>
              <IViewModal
                title="Partner Territory Insertion"
                show={open}
                onHide={() => setOpen(false)}
              >
                <PartnerTerritoryUpdate value={values}></PartnerTerritoryUpdate>
              </IViewModal>
            </>
          )}
        </Formik>
      </ICard>
    </>
  );
}
