import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import IForm from "../../../_helper/_form";
import IDelete from "../../../_helper/_helperIcons/_delete";
import IEdit from "../../../_helper/_helperIcons/_edit";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import PaginationTable from "../../../_helper/_tablePagination";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { setOEECapacityConfigurationAction } from "../../../_helper/reduxForLocalStorage/Actions";
import {
  getLandingData,
  machineNameDDLApi,
  plantNameDDLApi,
  shopFloorNameDDLApi,
} from "./util/api";

export default function OEECapacityConfigurationLanding() {
  const initData = useSelector((state) => {
    return state.localStorage.OEECapacityConfigurationInitData || {};
  }, shallowEqual);
  const saveHandler = (values, cb) => {};
  const dispatch = useDispatch();
  const history = useHistory();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  //PlantName
  const [plantNameDDL, getPlantNameDDL] = useAxiosGet();
  const [rowData, getRowData, loadingRowData, setRowData] = useAxiosGet();
  //ShopFloor
  const [shopFloorDDL, getShopFloorDDL] = useAxiosGet();
  const [, deleteCapacityConfiguration] = useAxiosPost();
  //machineName
  const [machineNameDDL, getMachineNameDDL] = useAxiosGet();
  //Redux State
  const {
    selectedBusinessUnit: { value: buId },
    profileData: { accountId: accId, userId },
  } = useSelector((state) => state.authData);

  const setPositionHandler = (pageNo, pageSize, values) => {
    getRowData(
      getLandingData(
        buId,
        values?.plant?.value,
        values?.shopFloor?.value,
        values?.machine?.value,
        pageNo,
        pageSize
      )
    );
  };

  const handleDeleteCapacityConfig = (nptConfigId, values) => {
    if (window.confirm("Are you sure to delete the configuration?"))
      deleteCapacityConfiguration(
        `/mes/OeeProductWaste/DeleteCapacityConfiguration?id=${nptConfigId}`,
        null,
        (res) => {
          if (res.statuscode === 200) {
            setPositionHandler(pageNo, pageSize, values);
          }
        },
        true
      );
  };

  useEffect(() => {
    getPlantNameDDL(plantNameDDLApi(buId, accId, userId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, userId, accId]);
  useEffect(() => {
    setPositionHandler(pageNo, pageSize, initData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initData]);

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
          {loadingRowData && <Loading />}
          <IForm
            title="OEE Capacity Configuration Landing"
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
                          "/production-management/configuration/OEECapacityConfiguration/create",
                        state: {
                          isEditPage: false,
                          rowData: null,
                        },
                      });
                    }}
                  >
                    Create
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="plant"
                    options={plantNameDDL || []}
                    value={values?.plant}
                    label="Plant Name"
                    onChange={(valueOption) => {
                      setFieldValue("plant", valueOption);
                      if (valueOption) {
                        getShopFloorDDL(
                          shopFloorNameDDLApi(accId, buId, valueOption.value)
                        );
                      }
                      setFieldValue("shopFloor", "");
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="shopFloor"
                    options={shopFloorDDL || []}
                    value={values?.shopFloor}
                    label="Shop Floor/Section"
                    onChange={(valueOption) => {
                      setFieldValue("shopFloor", valueOption);
                      if (valueOption) {
                        // setPositionHandler(pageNo, pageSize, {
                        //   ...values,
                        //   shopFloor: {
                        //     label: valueOption?.label,
                        //     value: valueOption?.value,
                        //   },
                        // });
                        getMachineNameDDL(
                          machineNameDDLApi(buId, valueOption?.value)
                        );
                      }
                      setFieldValue("machine", "");
                    }}
                    isDisabled={!values?.plant}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-3">
                  <NewSelect
                    name="machine"
                    options={machineNameDDL || []}
                    value={values?.machine}
                    label="Work Center/Machine"
                    onChange={(valueOption) => {
                      setFieldValue("machine", valueOption);
                      if (valueOption) {
                        setRowData([]);
                      } else {
                        // setPositionHandler(pageNo, pageSize, {
                        //   ...values,
                        //   shopFloor: {
                        //     label: valueOption?.label,
                        //     value: valueOption?.value,
                        //   },
                        // });
                      }
                    }}
                    isDisabled={!values?.shopFloor}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <button
                    type="button"
                    className="btn btn-primary mt-5"
                    onClick={() => {
                      dispatch(setOEECapacityConfigurationAction(values));
                      setPositionHandler(pageNo, pageSize, values);
                    }}
                    disabled={
                      !values?.plant || !values?.shopFloor || !values?.machine
                    }
                  >
                    View
                  </button>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                  <thead>
                    <tr>
                      <th>Sl</th>
                      <th>Plant </th>
                      <th>Shop Floor</th>
                      <th>Machine Name</th>
                      <th>Item</th>
                      <th>BOM</th>
                      <th>Machine Capacity PH</th>
                      <th>SMV Cycle Time</th>
                      <th>Standard RPM</th>
                      <th>Std Wastages Qty</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowData?.data?.length > 0 &&
                      rowData?.data?.map((item, index) => (
                        <tr>
                          <td className="text-center">{index + 1}</td>
                          <td className="text-center">{item?.plantName}</td>
                          <td className="text-center">{item?.shopFloorName}</td>
                          <td className="text-center">{item?.machineName}</td>
                          <td className="text-center">{item?.itemName}</td>
                          <td className="text-center">{item?.bomName}</td>
                          <td className="text-center">
                            {+item?.machineCapacityPerHour.toFixed(2)}
                          </td>
                          <td className="text-center">
                            {+item?.smvcycleTime.toFixed(2)}
                          </td>
                          <td className="text-center">
                            {+item?.standerdRpm.toFixed(2)}
                          </td>
                          <td className="text-center">
                            {+item?.stdWastagesQty.toFixed(2)}
                          </td>
                          <td>
                            <div
                              className="d-flex"
                              style={{ gap: "10px", justifyContent: "center" }}
                            >
                              <span
                                onClick={() =>
                                  history.push({
                                    pathname:
                                      "/production-management/configuration/OEECapacityConfiguration/edit",
                                    state: {
                                      isEditPage: true,
                                      rowData: item,
                                    },
                                  })
                                }
                              >
                                <IEdit />
                              </span>
                              <span
                                onClick={() =>
                                  handleDeleteCapacityConfig(
                                    item?.nptConfigId,
                                    values
                                  )
                                }
                              >
                                <IDelete />
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {rowData?.data?.length > 0 && (
                <PaginationTable
                  count={rowData?.totalCount}
                  setPositionHandler={setPositionHandler}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                  values={values}
                />
              )}
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
