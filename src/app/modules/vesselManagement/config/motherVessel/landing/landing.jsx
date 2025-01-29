/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import IConfirmModal from "../../../../_helper/_confirmModal";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import IView from "../../../../_helper/_helperIcons/_view";
import Loading from "../../../../_helper/_loading";
import PaginationSearch from "../../../../_helper/_search";
import PaginationTable from "../../../../_helper/_tablePagination";
import IViewModal from "../../../../_helper/_viewModal";
import MotherVesselCreateForm from "../form/form";
import { deleteMotherVessel } from "../helper";
import IEdit from "../../../../_helper/_helperIcons/_edit";

const initData = { search: "" };

const headers = [
  "SL",
  "Mother Vessel Name",
  "Supplier Name",
  "Freight Rate (USD)",
  "Conversion Rate (BDT)",
  "Freight Cost Rate",
  "Freight Cost Rate (BDT)",
  "Program Count",
  "Ports",
  "Action",
];

const VesselLanding = () => {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [rowData, getRowData, isLoading] = useAxiosGet();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formType, setFormType] = useState("");
  const [singleItem, setSingleItem] = useState({});
  const [isDeleteHidden, deleteHiddenHandler] = useAxiosGet();

  // get user profile data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const getData = (search, pageNo, pageSize) => {
    const SearchTerm = search ? `SearchTerm=${search}&` : "";
    const url = `/wms/FertilizerOperation/GetMotherVesselPagination?${SearchTerm}AccountId=${accId}&BusinessUnitId=${buId}&PageNo=${pageNo}&PageSize=${pageSize}`;

    getRowData(url);
  };

  useEffect(() => {
    getData("", pageNo, pageSize);
    deleteHiddenHandler(
      `/wms/FertilizerOperation/GetAllModificationPermission?UserEnroll=${profileData?.userId}&BusinessUnitId=${buId}&Type=YsnG2gconfiguration`
    );
  }, [accId, buId]);

  // set PositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    getData("", pageNo, pageSize);
  };

  const paginationSearchHandler = (search) => {
    getData(search, pageNo, pageSize);
  };

  // Get profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const deleteHandler = (id) => {
    const { userId } = profileData;
    const objProps = {
      title: "Are You Sure?",
      message: "Are you sure you want to delete this mother vessel?",
      yesAlertFunc: () => {
        deleteMotherVessel(id, userId, setLoading, () => {
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
        {({ values }) => (
          <>
            <Card>
              <ModalProgressBar />
              <CardHeader title="Mother Vessel Information">
                <CardHeaderToolbar>
                  <div className="d-flex justify-content-end">
                    <button
                      onClick={() => {
                        setFormType("create");
                        setShow(true);
                      }}
                      className="btn btn-primary ml-2"
                      disabled={isLoading}
                    >
                      Create
                    </button>
                  </div>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {(isLoading || loading) && <Loading />}
                <div className="col-lg-3 mt-5">
                  <PaginationSearch
                    placeholder="Mother Vessel Name"
                    paginationSearchHandler={paginationSearchHandler}
                    values={values}
                  />
                </div>
                <form className="form form-label-right">
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
                                <td>{item?.mVesselName}</td>
                                <td>{item?.supplierName}</td>
                                <td className="text-right">
                                  {item?.freightRate}
                                </td>
                                <td className="text-right">
                                  {item?.freightRateDbt}
                                </td>
                                <td className="text-right">
                                  {item?.freightCostRate}
                                </td>
                                <td className="text-right">
                                  {item?.freightCostRateBdt}
                                </td>
                                <td className="text-center">
                                  {item?.countPort}
                                </td>
                                <td>{item?.port}</td>
                                <td
                                  style={{ width: "80px" }}
                                  className="text-center"
                                >
                                  <div className="d-flex justify-content-around">
                                    {isDeleteHidden ? (
                                      <span>
                                        <IDelete
                                          remover={deleteHandler}
                                          id={item?.mVesselId}
                                        />
                                      </span>
                                    ) : null}
                                    <span
                                      onClick={() => {
                                        setSingleItem(item);
                                        setFormType("view");
                                        setShow(true);
                                      }}
                                    >
                                      <IView />
                                    </span>
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
                </form>
              </CardBody>
              <IViewModal
                // modelSize={formType === "create" ? "md" : "xl"}
                show={show}
                onHide={() => setShow(false)}
              >
                <MotherVesselCreateForm
                  setShow={setShow}
                  getData={getData}
                  formType={formType}
                  item={singleItem}
                />
              </IViewModal>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
};

export default VesselLanding;
