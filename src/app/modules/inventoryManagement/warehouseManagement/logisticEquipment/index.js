import { Form, Formik } from "formik";
import React, { useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IEdit from "../../../_helper/_helperIcons/_edit";
import NewSelect from "../../../_helper/_select";
import PaginationTable from "../../../_helper/_tablePagination";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
const initData = {
  businessUnit: "",
  shipPoint: "",
  shift: { value: 1, label: "Day" },
};
export default function LogisticEquipment() {
  const { profileData, selectedBusinessUnit, businessUnitList } = useSelector(
    (state) => {
      return state.authData;
    },
    shallowEqual
  );

  const [shipPointList, getShipPointList, , setShipPointList] = useAxiosGet();

  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, getGridData, loading, setGridData] = useAxiosGet();

  const saveHandler = (values, cb) => {};
  const history = useHistory();

  const getLandingData = (values, pageNo, pageSize, searchValue = "") => {
    // const searchTearm = searchValue ? `&search=${searchValue}` : "";
    getGridData(
      `/oms/CastingSchedule/GetCastingScheduleToolsInfoPagination?businessUnitId=${
        values?.businessUnit?.value
      }&shipPointId=${values?.shipPoint?.value || 0}&shiftId=${values?.shift
        ?.value || 0}&pageNo=${pageNo}&pageSize=${pageSize}`
    );
  };

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getLandingData(values, pageNo, pageSize, searchValue);
  };

  // const paginationSearchHandler = (searchValue, values) => {
  //   setPositionHandler(pageNo, pageSize, values, searchValue);
  // };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      // validationSchema={{}}
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
          {loading && <Loading />}
          <IForm
            title="Logistic Equipment Availability"
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
                      history.push(
                        "/inventory-management/warehouse-management/logisticequipmentavailability/entry"
                      );
                    }}
                  >
                    Create
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <>
                <div className="form-group  global-form row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="businessUnit"
                      options={businessUnitList || []}
                      value={values?.businessUnit}
                      label="Select Business Unit"
                      onChange={(valueOption) => {
                        setFieldValue("businessUnit", valueOption || "");
                        setFieldValue("shipPoint", "");
                        setShipPointList([]);

                        if (valueOption) {
                          getShipPointList(
                            `/wms/ShipPoint/GetShipPointDDL?accountId=${profileData?.accountId}&businessUnitId=${valueOption?.value}`
                          );
                        }
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="shipPoint"
                      options={shipPointList || []}
                      value={values?.shipPoint}
                      label="Select Ship Point"
                      onChange={(valueOption) => {
                        setFieldValue("shipPoint", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="shift"
                      options={[
                        { value: 1, label: "Day" },
                        { value: 2, label: "Night" },
                      ]}
                      value={values?.shift}
                      label="Select Shift"
                      onChange={(valueOption) => {
                        setFieldValue("shift", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <button
                      disabled={!values?.businessUnit}
                      type="button"
                      className="btn btn-primary mt-5"
                      onClick={() => {
                        getLandingData(values, pageNo, pageSize, "");
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
                {/* {gridData?.data?.length > 0 && (
                  <div className="my-3">
                    <PaginationSearch
                      placeholder="Search Enroll & Name"
                      paginationSearchHandler={paginationSearchHandler}
                      values={values}
                    />
                  </div>
                )} */}
                {gridData?.data?.length > 0 && (
                  <div className="table-responsive">
                    <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Ship Point</th>
                          <th>Shift</th>
                          <th>Available TM</th>
                          <th>Explanations</th>
                          <th>Available Concrete</th>
                          <th>Explanations</th>
                          <th>Available Pickup(Nos)</th>
                          <th>Explanations</th>
                          <th>Available PipeLine(RFT)</th>
                          <th>Explanations</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.data?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.shipPointName}</td>
                            <td>{item?.shiftName}</td>
                            <td className="text-center">
                              {item?.avlTransitMixture}
                            </td>
                            <td>{item?.transitMixtureExplain}</td>
                            <td className="text-center">
                              {item?.avlConcretePump}
                            </td>
                            <td>{item?.concretePumpExplain}</td>
                            <td className="text-center">{item?.avlPickUp}</td>
                            <td>{item?.pickUpExplain}</td>
                            <td className="text-center">{item?.avlPipeLine}</td>
                            <td>{item?.pipeLineExplain}</td>
                            <td className="text-center">
                              <div className="">
                                <span
                                  className=""
                                  onClick={() => {
                                    history.push({
                                      pathname: `/inventory-management/warehouse-management/logisticequipmentavailability/edit`,
                                      state: {
                                        item: item,
                                      },
                                    });
                                  }}
                                >
                                  <IEdit />
                                </span>
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
                    count={gridData?.totalCount}
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
              </>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
