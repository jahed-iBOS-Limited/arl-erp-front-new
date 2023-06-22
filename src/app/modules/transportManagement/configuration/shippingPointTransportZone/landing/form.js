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

const initData = {
  shipPoint: "",
  type: "",
};

const types = [
  { value: 1, label: "Shipping Point Transport Zone" },
  { value: 2, label: "Shipping Point Bank Configure" },
];

export default function ShippingPointTransportZoneLanding() {
  const history = useHistory();

  // _____ pagination states _____
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  // _____ general states _____
  const [rowData, getRowData, loader, setRowData] = useAxiosGet();
  const [shipPointDDL, getShipPointDDL] = useAxiosGet();
  const [, deleteRow, deleteLoader] = useAxiosGet();

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

  const loading = loader || deleteLoader;

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
              history.push({
                pathname:
                  "/transport-management/configuration/shippingpointtransportzone/create",
                state: values,
              });
            }
          }}
        >
          {loading && <Loading />}

          <div className="row global-form">
            <div className="col-lg-3">
              <NewSelect
                name="type"
                options={types}
                value={values?.type}
                label="Type"
                onChange={(valueOption) => {
                  setFieldValue("type", valueOption);
                  setRowData([]);
                }}
                errors={errors}
                touched={touched}
              />
            </div>
            {[1].includes(values?.type?.value) && (
              <div className="col-lg-3">
                <NewSelect
                  name="shipPoint"
                  options={shipPointDDL || []}
                  value={values?.shipPoint}
                  label="Ship Point"
                  onChange={(valueOption) => {
                    setFieldValue("shipPoint", valueOption);
                    setRowData([]);
                  }}
                  errors={errors}
                  touched={touched}
                />
              </div>
            )}
            <IButton
              onClick={() => {
                landingData(values, pageNo, pageSize);
              }}
              disabled={
                !values?.type ||
                ([1].includes(values?.type?.value) && !values?.shipPoint)
              }
            />
          </div>
          {[2].includes(values?.type?.value) && (
            <div className="mt-5">
              <PaginationSearch
                placeholder="ShipPint Name"
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
        </ICustomCard>
      )}
    </Formik>
  );
}
