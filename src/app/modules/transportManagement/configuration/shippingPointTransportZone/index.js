import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import IConfirmModal from "../../../_helper/_confirmModal";
import IDelete from "../../../_helper/_helperIcons/_delete";
import IEdit from "../../../_helper/_helperIcons/_edit";
import NewSelect from "../../../_helper/_select";
import PaginationTable from "../../../_helper/_tablePagination";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
const initData = {
  shipPoint: "",
};

const types = [
  { value: 1, label: "Shipping Point Transport Zone" },
  { value: 2, label: "Shipping Point Bank Configure" },
];

export default function ShippingPointTransportZoneLanding() {
  const [rowData, getRowData, lodar, setRowData] = useAxiosGet();
  const [shipPointDDL, getShipPointDDL, shipPointDDLLodar] = useAxiosGet();
  const [, getDeleteData, deleteLodar] = useAxiosGet();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const saveHandler = (values, cb) => {};
  const history = useHistory();

  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state.authData,
    shallowEqual
  );

  const landingData = (values) => {
    getRowData(
      `/oms/POSDamageEntry/GetWareHouseZoneLandingPagination?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&ShipPointId=${values?.shipPoint?.value}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=Asc`
    );
  };

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getRowData(
      `/oms/POSDamageEntry/GetWareHouseZoneLandingPagination?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&ShipPointId=${values?.shipPoint?.value}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=Asc`
    );
  };

  useEffect(() => {
    getShipPointDDL(
      `/wms/ShipPoint/GetShipPointDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}`
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
          landingData(values);
        };
        getDeleteData(
          `/oms/POSDamageEntry/DeleteWareHouseZone?UserId=${profileData?.userId}&BusinessUnitId=${selectedBusinessUnit?.value}&AutoId=${id}`,
          cb
        );
      },
      noAlertFunc: () => {
        "";
      },
    };
    IConfirmModal(confirmObject);
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {(shipPointDDLLodar || lodar || deleteLodar) && <Loading />}
          <IForm
            title="Shipping Point Transport Zone"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      history.push({
                        pathname:
                          "/transport-management/configuration/shippingpointtransportzone/create",
                        state: values,
                      });
                    }}
                    disabled={!values?.type}
                  >
                    Create
                  </button>
                </div>
              );
            }}
          >
            <Form>
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
                <div className="col-lg-3">
                  <button
                    style={{ marginTop: "18px" }}
                    type="button"
                    className="btn btn-primary"
                    onClick={(e) => {
                      landingData(values);
                    }}
                    disabled={!values?.shipPoint}
                  >
                    Show
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                <div className="table-responsive">
                <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Ship Point</th>
                        <th>Route Name</th>
                        <th>TransPort Zone Name</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowData?.wareHouseZones?.map((itm, idx) => {
                        return (
                          <tr key={idx}>
                            <td className="text-center">{idx + 1}</td>
                            <td>{itm?.shipPointName}</td>
                            <td>{itm?.routeName}</td>
                            <td>{itm?.transPortZoneName}</td>
                            <td className="d-flex justify-content-around">
                              <IEdit
                                onClick={(e) => {
                                  history.push({
                                    pathname: `/transport-management/configuration/shippingpointtransportzone/edit/${itm?.intAutoId}`,
                                    state: itm,
                                  });
                                }}
                              />
                              <IDelete
                                remover={() =>
                                  confirmToCancel(itm?.intAutoId, values)
                                }
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                  {rowData?.wareHouseZones?.length > 0 && (
                    <PaginationTable
                      count={rowData?.wareHouseZones?.length}
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
                </div>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
