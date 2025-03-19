import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import ICustomCard from "../../../../_helper/_customCard";
import Table from "./table";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import IConfirmModal from "../../../../_helper/_confirmModal";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import IButton from "../../../../_helper/iButton";
import { BankInfoTable } from "./bankInfoTable";
import PaginationSearch from "../../../../_helper/_search";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import Axios from "axios";
import FormikError from "../../../../_helper/_formikError";
import IViewModal from "../../../../_helper/_viewModal";
import SupplierAndShippingPointModal from "./supplierAndShippingPointModal";
import SupplierAndShippingPointTable from "./supplierAndShippingPointTable";

const initData = {
  shipPoint: "",
  type: "",
  supplier: {
    value: 0,
    label: "All",
  },
};

const types = [
  { value: 1, label: "Shipping Point Transport Zone" },
  { value: 2, label: "Shipping Point Bank Configure" },
  { value: 3, label: "Supplier & Shipping Point" },
];

export default function ShippingPointTransportZoneLanding() {
  const history = useHistory();

  // _____ pagination states _____
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [
    supplierAndShippingPointModal,
    setSupplierAndShippingPointModal,
  ] = useState(false);

  // _____ general states _____
  const [rowData, getRowData, loader, setRowData] = useAxiosGet();
  const [shipPointDDL, getShipPointDDL] = useAxiosGet();
  const [, deleteRow, deleteLoader] = useAxiosGet();
  const [
    landingSupplierByShippoint,
    getLandingSupplierByShippoint,
    supplierByShippointLoding,
    setLandingSupplierByShippoint,
  ] = useAxiosGet();

  // ___________ logged in user's information _____________
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state.authData, shallowEqual);

  useEffect(() => {
    getShipPointDDL(
      `/wms/ShipPoint/GetShipPointDDL?accountId=${accId}&businessUnitId=${buId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  //  ______ landing data getting functions _______
  const landingData = (
    values,
    _pageNo = 0,
    _pageSize = 15,
    searchTerm = ""
  ) => {
    const search = searchTerm ? `&searchTerm=${searchTerm}` : "";

    const typeOneURL = `/oms/POSDamageEntry/GetWareHouseZoneLandingPagination?accountId=${accId}&businessUnitId=${buId}&ShipPointId=${values?.shipPoint?.value}&PageNo=${_pageNo}&PageSize=${_pageSize}&viewOrder=Asc`;

    const typeTwoURL = `/partner/BusinessPartnerBasicInfo/ShipPointAndBankAccountInfoLanding?businessUnitId=${buId}&pageNo=${_pageNo}&pageSize=${_pageSize}${search}`;

    const URL = [1].includes(values?.type?.value)
      ? typeOneURL
      : [2].includes(values?.type?.value)
      ? typeTwoURL
      : "";

    getRowData(URL);
  };

  //  ______ pagination function ________
  const paginationHandler = (pageNo, pageSize, values) => {
    landingData(values, pageNo, pageSize);
  };

  //  ______ search function ________
  const searchHandler = (searchTerm, values) => {
    landingData(values, pageNo, pageSize, searchTerm);
  };

  // ______ delete confirmation function ________
  const confirmToCancel = (id, values) => {
    let confirmObject = {
      title: "Are you sure?",
      message: "If you delete this, it can not be undone",
      yesAlertFunc: async () => {
        const cb = () => {
          toast.success("Deleted Successfully");
          landingData(values, pageNo, pageSize);
        };
        deleteRow(
          `/oms/POSDamageEntry/DeleteWareHouseZone?UserId=${userId}&BusinessUnitId=${buId}&AutoId=${id}`,
          cb
        );
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  const loading = loader || deleteLoader || supplierByShippointLoding;

  const commonSupplierByShippointGridDataFunc = (
    values,
    _pageNo = 0,
    _pageSize = 15,
    searchTerm = ""
  ) => {
    const url = `/wms/ShipPointWarehouse/GetSupplierByShippointPagination?unitId=${buId}&supplierId=${values?.supplier?.value}&PageNo=${_pageNo}&PageSize=${_pageSize}`;
    getLandingSupplierByShippoint(url);
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={() => {}}
    >
      {({ values, setFieldValue, errors, touched }) => (
        <ICustomCard
          title={"Shipping Point Transport Zone"}
          createHandler={() => {
            if (!values?.type) {
              toast.warning("Please select a type!");
            } else {
              if ([3].includes(values?.type?.value)) {
                //Supplier And ShippingPoint Modal open
                setSupplierAndShippingPointModal(true);
              } else {
                history.push({
                  pathname:
                    "/transport-management/configuration/shippingpointtransportzone/create",
                  state: values,
                });
              }
            }
          }}
        >
          {loading && <Loading />}

          <div className='row global-form'>
            <div className='col-lg-3'>
              <NewSelect
                name='type'
                options={types}
                value={values?.type}
                label='Type'
                onChange={(valueOption) => {
                  setFieldValue("type", valueOption);
                  setRowData([]);
                  setLandingSupplierByShippoint([]);
                }}
                errors={errors}
                touched={touched}
              />
            </div>
            {[1].includes(values?.type?.value) && (
              <div className='col-lg-3'>
                <NewSelect
                  name='shipPoint'
                  options={shipPointDDL || []}
                  value={values?.shipPoint}
                  label='Ship Point'
                  onChange={(valueOption) => {
                    setFieldValue("shipPoint", valueOption);
                    setRowData([]);
                  }}
                  errors={errors}
                  touched={touched}
                />
              </div>
            )}

            {[3].includes(values?.type?.value) && (
              <>
                <div className='col-lg-3'>
                  <label>Select Supplier</label>
                  <SearchAsyncSelect
                    selectedValue={values?.supplier}
                    handleChange={(valueOption) => {
                      setFieldValue("supplier", valueOption);
                      setLandingSupplierByShippoint([]);
                    }}
                    loadOptions={async (v) => {
                      if (v?.length < 3) return [{ value: 0, label: "All" }];
                      return Axios.get(
                        `/wms/Delivery/GetSupplierByShipPointDDl?businessUnitId=${buId}&shippointId=${0}&searchTerm=${v}`
                      ).then((res) => {
                        const data = res?.data || [];
                        return [
                          {
                            value: 0,
                            label: "All",
                          },
                          ...data,
                        ];
                      });
                    }}
                    placeholder='Select Supplier'
                  />
                  <FormikError
                    errors={errors}
                    name='supplier'
                    touched={touched}
                  />
                </div>
              </>
            )}
            <IButton
              colSize={"col"}
              onClick={() => {
                if ([3].includes(values?.type?.value)) {
                  commonSupplierByShippointGridDataFunc(
                    values,
                    pageNo,
                    pageSize
                  );
                } else {
                  landingData(values, pageNo, pageSize);
                }
              }}
              disabled={
                !values?.type ||
                ([1].includes(values?.type?.value) && !values?.shipPoint)
              }
            />
          </div>
          {[2].includes(values?.type?.value) && (
            <div className='mt-5'>
              <PaginationSearch
                placeholder='ShipPint Name'
                paginationSearchHandler={searchHandler}
                values={values}
              />
            </div>
          )}
          {[1].includes(values?.type?.value) ? (
            <Table
              obj={{
                values,
                pageNo,
                rowData,
                pageSize,
                setPageNo,
                setPageSize,
                confirmToCancel,
                paginationHandler,
              }}
            />
          ) : [2].includes(values?.type?.value) ? (
            <BankInfoTable
              obj={{
                values,
                pageNo,
                pageSize,
                setPageNo,
                setPageSize,
                paginationHandler,
                rowData: rowData?.data,
              }}
            />
          ) : (
            ""
          )}
          {/* SupplierAndShippingPointTable */}
          {[3].includes(values?.type?.value) && (
            <>
              <SupplierAndShippingPointTable
                landingCB={() => {
                  commonSupplierByShippointGridDataFunc(
                    values,
                    pageNo,
                    pageSize
                  );
                }}
                landingSupplierByShippoint={landingSupplierByShippoint}
                setLandingSupplierByShippoint={setLandingSupplierByShippoint}
                paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                setPositionHandler={(pageNo, pageSize) => {
                  commonSupplierByShippointGridDataFunc(
                    values,
                    pageNo,
                    pageSize
                  );
                }}
                shipPointDDL={shipPointDDL}
              />
            </>
          )}

          {supplierAndShippingPointModal && (
            <>
              <IViewModal
                show={supplierAndShippingPointModal}
                onHide={() => {
                  setSupplierAndShippingPointModal(false);
                }}
              >
                <SupplierAndShippingPointModal
                  landingCB={() => {
                    setSupplierAndShippingPointModal(false);
                  }}
                  shipPointDDL={shipPointDDL}
                />
              </IViewModal>
            </>
          )}
        </ICustomCard>
      )}
    </Formik>
  );
}
