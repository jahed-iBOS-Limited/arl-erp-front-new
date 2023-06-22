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

const initData = {
  shipPoint: "",
};

const types = [
  { value: 1, label: "Shipping Point Transport Zone" },
  { value: 2, label: "Shipping Point Bank Configure" },
];

export default function ShippingPointTransportZoneLanding() {
  const [rowData, getRowData, loader, setRowData] = useAxiosGet();
  const [shipPointDDL, getShipPointDDL] = useAxiosGet();
  const [, getDeleteData, deleteLoader] = useAxiosGet();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const history = useHistory();

  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state.authData, shallowEqual);

  const landingData = (values, _pageNo = 0, _pageSize = 15) => {
    if ([1].includes(values?.type?.value)) {
      getRowData(
        `/oms/POSDamageEntry/GetWareHouseZoneLandingPagination?accountId=${accId}&businessUnitId=${buId}&ShipPointId=${values?.shipPoint?.value}&PageNo=${_pageNo}&PageSize=${_pageSize}&viewOrder=Asc`
      );
    }
  };

  const setPositionHandler = (pageNo, pageSize, values) => {
    landingData(values, pageNo, pageSize);
  };

  useEffect(() => {
    getShipPointDDL(
      `/wms/ShipPoint/GetShipPointDDL?accountId=${accId}&businessUnitId=${buId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirmToCancel = (id, values) => {
    let confirmObject = {
      title: "Are you sure?",
      message: "If you delete this, it can not be undone",
      yesAlertFunc: async () => {
        const cb = () => {
          toast.success("Deleted Successfully");
          landingData(values, pageNo, pageSize);
        };
        getDeleteData(
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
              disabled={!values?.shipPoint}
            />
          </div>
          <Table
            obj={{
              rowData,
              confirmToCancel,
              values,
              pageNo,
              setPageNo,
              pageSize,
              setPageSize,
              setPositionHandler,
            }}
          />
        </ICustomCard>
      )}
    </Formik>
  );
}
