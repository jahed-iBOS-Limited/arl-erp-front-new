/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ICustomCard from "../../../../_helper/_customCard";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IView from "../../../../_helper/_helperIcons/_view";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import PaginationTable from "../../../../_helper/_tablePagination";
import { _todayDate } from "../../../../_helper/_todayDate";
import IViewModal from "../../../../_helper/_viewModal";
import RentalVehicleViewForm from "../extranalModalView/addEditForm";
import { approveItems, getExternalData, getInternalData } from "../helper";
import ShipmentCostAuditApproveViewForm from "../intranalModalView/addEditForm";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  isBillSubmit: "",
};

function ShipmentCostEntryLanding() {
  const [gridData, setGridData] = useState({});
  const [loading, setLoading] = useState(false);

  // View Modal State
  const [modalData, setModalData] = useState();
  const [showInternalViewModal, setInternalShowViewModal] = useState(false);
  const [showExtranalViewModal, setExtranalShowViewModal] = useState(false);

  // paginationState
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  const getExternalData_action = () => {
    getExternalData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      pageNo,
      pageSize,
      setGridData,
      setLoading
    );
  };

  const getInternalData_action = () => {
    getInternalData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      pageNo,
      pageSize,
      setGridData,
      setLoading
    );
  };

  const setPositionHandler = (pageNo, pageSize) => {
    // getExternalData(
    //   profileData?.accountId,
    //   selectedBusinessUnit?.value,
    //   pageNo,
    //   pageSize,
    //   setGridData,
    //   setLoading
    // );
  };

  // All item select
  const allGridCheck = (value) => {
    const modifyGridData = gridData?.data?.map((itm) => ({
      ...itm,
      itemCheck: value,
    }));
    setGridData({ ...gridData, data: modifyGridData });
  };

  // one item select
  const itemSlectedHandler = (value, index) => {
    const copyRowDto = [...gridData?.data];
    copyRowDto[index].itemCheck = !copyRowDto[index]?.itemCheck;
    setGridData({ ...gridData, data: copyRowDto });
  };

  const saveHandler = (cb) => {
    const checkedItems = gridData?.data?.filter((item) => item?.itemCheck);
    if (!checkedItems?.length) return toast.warning("Select at least 1 item");

    const payload = checkedItems?.map((item) => ({
      shipmentCostId: item?.shipmentCostId,
      tripId: item?.tripId,
      isApproved: true,
      actionBy: profileData?.userId,
    }));

    approveItems(payload, cb, setLoading);
  };
  return (
    <>
      {loading && <Loading />}
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue, errors, touched }) => (
          <>
            <ICustomCard
              title="Shipment Cost Audit Approve"
              renderProps={() => (
                <>
                  <button
                    onClick={() =>
                      saveHandler(() => {
                        if (values?.type?.label === "External") {
                          getExternalData_action();
                        } else {
                          getInternalData_action();
                        }
                      })
                    }
                    type="button"
                    className="btn btn-primary px-4 py-2"
                  >
                    Save
                  </button>
                </>
              )}
            >
              <Form>
                <div className="global-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <NewSelect
                        name="type"
                        options={[
                          { label: "Internal", value: 1 },
                          { label: "External", value: 2 },
                        ]}
                        value={values?.supplier}
                        label="Report Type"
                        onChange={(valueOption) => {
                          setFieldValue("type", valueOption);
                          if (valueOption?.label === "External") {
                            getExternalData_action();
                          } else {
                            getInternalData_action();
                          }
                        }}
                        placeholder="Select Type"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 table-responsive">
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Party Name</th>
                          <th>Shipment Date</th>
                          <th>Shipment Code</th>
                          <th>Route Name</th>
                          <th>Vehicle No</th>
                          <th>Amount</th>
                          <th>
                            <input
                              type="checkbox"
                              id="parent"
                              onChange={(event) => {
                                allGridCheck(event.target.checked);
                              }}
                            />
                          </th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.data?.map((item, index) => (
                          <tr key={index}>
                            <td> {index + 1}</td>
                            <td>
                              <div className="pl-2">
                                {item?.partyName || "-"}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">
                                {" "}
                                {_dateFormatter(item?.shipmentDate)}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">{item?.shipmentCode}</div>
                            </td>
                            <td>
                              <div className="pl-2">{item?.routeName}</div>
                            </td>
                            <td>
                              <div className="pl-2">{item?.veichleNo}</div>
                            </td>
                            <td>
                              <div className="pl-2">
                                {item?.actualCost || 0}
                              </div>
                            </td>
                            <td>
                              <div className="text-center">
                                <input
                                  id="itemCheck"
                                  type="checkbox"
                                  value={item?.itemCheck}
                                  checked={item?.itemCheck}
                                  onChange={(e) => {
                                    itemSlectedHandler(e.target.checked, index);
                                  }}
                                />
                              </div>
                            </td>
                            <td className="text-center">
                              <span className="view">
                                {values?.type?.value === 1 ? (
                                  <IView
                                    clickHandler={() => {
                                      if (item?.shipmentCostId) {
                                        setModalData(item?.shipmentCostId);
                                        setInternalShowViewModal(true);
                                      }
                                    }}
                                  />
                                ) : (
                                  <IView
                                    clickHandler={() => {
                                      if (item?.shipmentId) {
                                        setModalData(item?.shipmentId);
                                        setExtranalShowViewModal(true);
                                      }
                                    }}
                                  />
                                )}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Form>

              {/* Pagination Code */}
              {gridData?.data?.length > 0 && (
                <PaginationTable
                  count={gridData?.totalCount}
                  setPositionHandler={setPositionHandler}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                />
              )}
            </ICustomCard>

            {/* Report Type Internal Modal */}
            <IViewModal
              show={showInternalViewModal}
              onHide={() => setInternalShowViewModal(false)}
            >
              <ShipmentCostAuditApproveViewForm
                id={modalData}
                values={values}
              />
            </IViewModal>

            {/* Report Type Extranal Modal */}
            <IViewModal
              show={showExtranalViewModal}
              onHide={() => setExtranalShowViewModal(false)}
            >
              <RentalVehicleViewForm id={modalData} />
            </IViewModal>
          </>
        )}
      </Formik>
    </>
  );
}

export default ShipmentCostEntryLanding;
