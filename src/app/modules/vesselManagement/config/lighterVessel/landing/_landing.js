/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import IConfirmModal from "../../../../_helper/_confirmModal";
import ICustomCard from "../../../../_helper/_customCard";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import Loading from "../../../../_helper/_loading";
import PaginationSearch from "../../../../_helper/_search";
import NewSelect from "../../../../_helper/_select";
import PaginationTable from "../../../../_helper/_tablePagination";
import IViewModal from "../../../../_helper/_viewModal";
import { getMotherVesselDDL } from "../../../allotment/tenderInformation/helper";
import LighterVesselCreateForm from "../form/_form";
import { deleteLighterVessel } from "../helper";
import { GetDomesticPortDDL } from "../../../allotment/loadingInformation/helper";
import IEdit from "../../../../_helper/_helperIcons/_edit";

const initData = { search: "", port: "", motherVessel: "" };
const headers = [
  "SL",
  "Port Name",
  "Lighter Vessel Name",
  "Lighter Master Contact No",
  "Mother Vessel Name",
  "Local Agent Name",
  "Capacity",
  "Carrier Rate",
  "Action",
];

const LighterVesselLanding = () => {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [rowData, getRowData, isLoading] = useAxiosGet();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDeleteHidden, deleteHiddenHandler] = useAxiosGet();
  const [motherVesselDDL, setMotherVesselDDL] = useState([]);
  const [portDDL, setPortDDL] = useState([]);
  const [formType, setFormType] = useState("");
  const [singleItem, setSingleItem] = useState({});

  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const getData = (search = "", pageNo, pageSize, values) => {
    const SearchTerm = search ? `SearchTerm=${search}&` : "";
    const url = `/wms/FertilizerOperation/GetLighterVesselPagination?${SearchTerm}AccountId=${accId}&BusinessUnitId=${buId}&PortId=${values?.port?.value}&MotherVesselId=${values?.motherVessel?.value}&PageNo=${pageNo}&PageSize=${pageSize}`;

    getRowData(url);
  };

  useEffect(() => {
    GetDomesticPortDDL(setPortDDL);
    deleteHiddenHandler(
      `/wms/FertilizerOperation/GetAllModificationPermission?UserEnroll=${userId}&BusinessUnitId=${buId}&Type=YsnG2gconfiguration`
    );
  }, [accId, buId]);

  // set PositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getData("", pageNo, pageSize, values);
  };

  const paginationSearchHandler = (search, values) => {
    getData(search, pageNo, pageSize, values);
  };

  const deleteHandler = (id) => {
    const objProps = {
      title: "Are You Sure?",
      message: "Are you sure you want to delete this lighter vessel?",
      yesAlertFunc: () => {
        deleteLighterVessel(id, userId, setLoading, () => {
          getData("", pageNo, pageSize);
        });
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(objProps);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => (
          <>
            <ICustomCard
              title="Lighter Vessel Information"
              createHandler={() => {
                setFormType("create");
                setShow(true);
              }}
            >
              {(isLoading || loading) && <Loading />}

              <form className="form form-label-right">
                <div className="row global-form">
                  <div className="col-lg-3">
                    <NewSelect
                      name="port"
                      options={portDDL || []}
                      value={values?.port}
                      label="Port"
                      onChange={(valueOption) => {
                        setFieldValue("port", valueOption);
                        setFieldValue("motherVessel", "");
                        getMotherVesselDDL(
                          accId,
                          buId,
                          setMotherVesselDDL,
                          valueOption?.value
                        );
                      }}
                      placeholder="Port"
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="motherVessel"
                      options={motherVesselDDL}
                      value={values?.motherVessel}
                      label="Mother Vessel"
                      onChange={(valueOption) => {
                        setFieldValue("motherVessel", valueOption);
                      }}
                      placeholder="Mother Vessel"
                      isDisabled={!values?.port}
                    />
                  </div>

                  <div className="col-lg-3">
                    <button
                      className="btn btn-primary mt-5"
                      type="button"
                      onClick={() => {
                        getData("", pageNo, pageSize, values);
                      }}
                      disabled={!values?.motherVessel}
                    >
                      View
                    </button>
                  </div>
                </div>
              </form>
              <div className="col-lg-3 mt-5">
                <PaginationSearch
                  placeholder="Lighter Vessel Name"
                  paginationSearchHandler={paginationSearchHandler}
                  values={values}
                />
              </div>
              {rowData?.data?.length > 0 && (
                <div className="table-responsive">
                  <table
                    id="table-to-xlsx"
                    className={
                      "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
                    }
                  >
                    <thead>
                      <tr className="cursor-pointer">
                        {headers?.map((th, index) => {
                          return <th key={index}> {th} </th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {rowData?.data?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td
                              style={{ width: "40px" }}
                              className="text-center"
                            >
                              {index + 1}
                            </td>
                            <td>{item?.portName}</td>
                            <td>{item?.lighterVesselName}</td>
                            <td>{item?.contactNo}</td>
                            <td>{item?.motherVesselName}</td>
                            <td>{item?.carrierAgenName}</td>
                            <td>{item?.vesselCapacity}</td>
                            <td className="text-right">{item?.carrierRate}</td>
                            <td
                              style={{ width: "80px" }}
                              className="text-center"
                            >
                              <div className="d-flex justify-content-around">
                                {isDeleteHidden ? (
                                  <span>
                                    <IDelete
                                      remover={deleteHandler}
                                      id={item?.lighterVesselId}
                                    />
                                  </span>
                                ) : null}
                                <span
                                  onClick={() => {
                                    setSingleItem(item);
                                    setFormType("edit");
                                    setShow(true);
                                  }}
                                >
                                  <IEdit />
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {rowData?.data?.length > 0 && (
                <PaginationTable
                  count={rowData?.totalCount}
                  setPositionHandler={setPositionHandler}
                  paginationState={{
                    pageNo,
                    setPageNo,
                    pageSize,
                    setPageSize,
                  }}
                  values={values}
                />
              )}
              <IViewModal
                modelSize="lg"
                show={show}
                onHide={() => setShow(false)}
              >
                <LighterVesselCreateForm
                  setShow={setShow}
                  getData={getData}
                  preValues={values}
                  formType={formType}
                  singleItem={singleItem}
                />
              </IViewModal>
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
};

export default LighterVesselLanding;
