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
import IConfirmModal from "../../../../_helper/_confirmModal";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import PaginationTable from "../../../../_helper/_tablePagination";
import IViewModal from "../../../../_helper/_viewModal";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import GodownForm from "../_form/_form";
import { deleteGodown } from "../helper";

const headers = [
  "SL",
  "Business Partner",
  "Transport Zone",
  "Godown Name",
  "Godown Address",
  "Contact No",
  "Unloading Supplier",
  "Unloading Rate",
  "Bolgate Unload Rate",
  "Remarks",
  "Action",
];

const GodownLanding = () => {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [rowData, getRowData, isLoading] = useAxiosGet();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formType, setFormType] = useState("");
  const [singleItem, setSingleItem] = useState({});
  const [businessPartnerDDL, getBusinessPartnerDDL] = useAxiosGet();

  // get user data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const getData = (values, pageNo, pageSize) => {
    const url = `/tms/LigterLoadUnload/GetShipToPartnerG2GPagination?AccountId=${accId}&BusinessUnitId=${buId}&BusinessPartnerId=${values?.businessPartner?.value}&PageNo=${pageNo}&PageSize=${pageSize}`;

    getRowData(url);
  };

  // set PositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getData(values, pageNo, pageSize);
  };

  const deleteHandler = (id, values) => {
    const objProps = {
      title: "Are You Sure?",
      message: "Are you sure you want to delete this Godown?",
      yesAlertFunc: () => {
        deleteGodown(id, setLoading, () => {
          getData(values, pageNo, pageSize);
        });
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(objProps);
  };

  useEffect(() => {
    const api = `/tms/LigterLoadUnload/GetG2GBusinessPartnerDDL?BusinessUnitId=${buId}&AccountId=${accId}`;
    getBusinessPartnerDDL(api, (data) => console.log({ data }));
  }, [accId, buId]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ businessPartner: "" }}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => (
          <>
            <Card>
              <ModalProgressBar />
              <CardHeader title="Godown Information">
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
                {/* <div className="col-lg-3 mt-5">
                  <PaginationSearch
                    placeholder="Lighter Vessel Name"
                    paginationSearchHandler={paginationSearchHandler}
                    values={values}
                  />
                </div> */}
                <form className="form form-label-right">
                  <div className="global-form">
                    <div className="row">
                      <div className="col-lg-3">
                        <NewSelect
                          name="businessPartner"
                          options={businessPartnerDDL || []}
                          value={values?.businessPartner}
                          label="Business Partner"
                          onChange={(e) => {
                            setFieldValue("businessPartner", e);
                            getData(
                              { ...values, businessPartner: e },
                              pageNo,
                              pageSize
                            );
                          }}
                          placeholder="Business Partner"
                          // isDisabled={formType === "edit"}
                        />
                      </div>
                    </div>
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
                                <td>{item?.businessPartnerName}</td>
                                <td>{item?.transportZoneName}</td>
                                <td>{item?.shipToParterName}</td>
                                <td>{item?.shipToParterAddress}</td>
                                <td>{item?.shipToPartnerContact}</td>
                                <td>{item?.unloadingSupplier}</td>
                                <td className="text-right">
                                  {item?.unloadingRate}
                                </td>
                                <td className="text-right">
                                  {item?.bolgateUnloadRate}
                                </td>
                                <td>{item?.remarks}</td>

                                <td
                                  style={{ width: "80px" }}
                                  className="text-center"
                                >
                                  <div className="d-flex justify-content-around">
                                    <span>
                                      <IDelete
                                        remover={(id) => {
                                          deleteHandler(id, values);
                                        }}
                                        id={item?.shiptoPartnerId}
                                      />
                                    </span>
                                    <span>
                                      <IEdit
                                        onClick={() => {
                                          setFormType("edit");
                                          setSingleItem(item);
                                          setShow(true);
                                        }}
                                        id={item?.shiptoPartnerId}
                                      />
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
              <IViewModal show={show} onHide={() => setShow(false)}>
                <GodownForm
                  setShow={setShow}
                  getData={getData}
                  formType={formType}
                  singleItem={singleItem}
                  values={values}
                  businessPartnerDDL={businessPartnerDDL}
                />
              </IViewModal>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
};

export default GodownLanding;
