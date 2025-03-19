/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router";
import IEdit from "../../../_chartinghelper/icons/_edit";
import IView from "../../../_chartinghelper/icons/_view";
import Loading from "../../../_chartinghelper/loading/_loading";
import ICustomTable from "../../../_chartinghelper/_customTable";
import PaginationTable from "../../../_chartinghelper/_tablePagination";
import IViewModal from "../../../_chartinghelper/_viewModal";
import ShipperForm from "../Form/addEditForm";
import { getShipperLandingData } from "../helper";

const initData = {
  vesselName: "",
  voyageNo: "",
};

const headers = [
  { name: "SL" },
  { name: "Charter Name" },
  { name: "Shipper Name" },
  { name: "Vessel Name" },
  { name: "Voyage No" },
  { name: "Actions" },
];

export default function ShipperLandingAndForm() {
  const { state: landingData } = useLocation();
  const { id } = useParams();

  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState();

  const history = useHistory();

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    viewHandler(pageNo, pageSize, {});
  }, [profileData, selectedBusinessUnit]);

  const viewHandler = (pageNo, pageSize, values) => {
    getShipperLandingData({
      vesselId: landingData?.vesselId,
      voyageId: id,
      pageNo,
      pageSize,
      setter: setGridData,
      setLoading,
    });
  };

  const setPositionHandler = (pageNo, pageSize, values) => {
    viewHandler(pageNo, pageSize, values);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values) => {}}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {loading && <Loading />}
            <form className="marine-form-card">
              <div className="marine-form-card-heading">
                <p>Shipper</p>
                <div>
                  <button
                    type="button"
                    onClick={() => history.goBack()}
                    className={"btn btn-secondary px-3 py-2 reset-btn mr-2"}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(true);
                      setModalData({ landingData, formType: "Create" });
                    }}
                    className={"btn btn-primary px-3 py-2 reset-btn mr-2"}
                  >
                    Create New +
                  </button>
                </div>
              </div>

              <ICustomTable ths={headers}>
                {gridData?.data?.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td>{item?.charterName}</td>
                    <td>{item?.shipperName}</td>
                    <td>{item?.vesselName}</td>
                    <td className="text-center">{item?.voyageNo}</td>
                    <td className="text-center">
                      <div className="d-flex justify-content-around">
                        <IView
                          clickHandler={() => {
                            setModalData({
                              landingData,
                              landingItem: item,
                              formType: "View",
                              id: item?.cargoHireId,
                            });
                            setShowModal(true);
                          }}
                        />
                        <IEdit
                          clickHandler={() => {
                            setModalData({
                              landingData,
                              landingItem: item,
                              formType: "Edit",
                              id: item?.cargoHireId,
                            });
                            setShowModal(true);
                          }}
                        />
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
                  values={values}
                />
              )}
            </form>

            <IViewModal show={showModal} onHide={() => setShowModal(false)}>
              <ShipperForm
                modalData={modalData}
                callLandingApi={() => {
                  setShowModal(false);
                  viewHandler(pageNo, pageSize, values);
                }}
              />
            </IViewModal>
          </>
        )}
      </Formik>
    </>
  );
}
