import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { Field, Form, Formik } from "formik";
import { useHistory } from "react-router-dom";
import { ISelect } from "../../../../_helper/_inputDropDown";
import { getSalesContactGridData } from "../_redux/Actions";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IEdit from "../../../../_helper/_helperIcons/_edit";

import { toast } from "react-toastify";
import IView from "../../../../_helper/_helperIcons/_view";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";

export function TableRow({
  gridDataPgi,
  savePgiData,
  IsPGICheck,
  profileData,
  selectedBusinessUnit,
  shippointDDL,
  shipmentId,
  initData,
  initialData,
  btnRef,
  saveHandler,
  resetBtnRef,
  shippoinHandler,
}) {
  const [rowDto, setRowDto] = useState([]);
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  // get controlling unit list  from store
  const gridData = useSelector((state) => {
    return state.shipment?.gridData;
  }, shallowEqual);

  useEffect(() => {
    const modifyGridData = gridData?.data?.map((itm) => ({
      ...itm,
      itemCheck: false,
    }));

    setRowDto(modifyGridData);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridData]);

  const itemSlectedHandler = (value, index) => {
    const copyRowDto = [...rowDto];
    copyRowDto[index].itemCheck = !copyRowDto[index].itemCheck;
    setRowDto(copyRowDto);
  };

  const allGridCheck = (value) => {
    const modifyGridData = gridData?.data?.map((itm) => ({
      ...itm,
      itemCheck: value,
    }));
    setRowDto(modifyGridData);
  };

  // useEffect(() => {
  //   if (selectedBusinessUnit && profileData) {
  //     dispatch(
  //       getSalesContactGridData(
  //         profileData?.accountId,
  //         selectedBusinessUnit?.value,
  //         shipmentId
  //       )
  //     );
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [profileData, selectedBusinessUnit]);
  const setPositionHandler = (pageNo, pageSize, values) => {
    dispatch(
      getSalesContactGridData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.pgiShippoint?.value,
        values?.reportType?.value,
        setLoading,
        pageNo,
        pageSize
      )
    );
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          pgiShippoint: {
            value: shippointDDL[0]?.value,
            label: shippointDDL[0]?.label,
          },
          reportType: { value: 2, label: "Incomplete" },
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initialData);
          });
        }}
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
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-12">
                  <div className="row bank-journal bank-journal-custom bj-left">
                    <>
                      <div className="col-lg-2">
                        <ISelect
                          label="Select Shippoint"
                          options={shippointDDL}
                          defaultValue={values.pgiShippoint}
                          name="pgiShippoint"
                          setFieldValue={setFieldValue}
                          errors={errors}
                          touched={touched}
                          dependencyFunc={(currentValue, value, setter) => {
                            // dispatch(
                            //   getSalesContactGridData(
                            //     profileData.accountId,
                            //     selectedBusinessUnit.value,
                            //     currentValue
                            //   )
                            // );
                          }}
                        />
                      </div>
                      <div className="col-lg-2">
                        <ISelect
                          label="Report Type"
                          options={[
                            { value: 1, label: "Complete" },
                            { value: 2, label: "Incomplete" },
                          ]}
                          defaultValue={values.reportType}
                          name="reportType"
                          setFieldValue={setFieldValue}
                          errors={errors}
                          touched={touched}
                          // dependencyFunc={(currentValue, value, setter) => {
                          //   dispatch(
                          //     getSalesContactGridData(
                          //       profileData.accountId,
                          //       selectedBusinessUnit.value,
                          //       currentValue
                          //     )
                          //   );
                          // }}
                        />
                      </div>
                      <div className="col-lg-1 mt-3">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => {
                            dispatch(
                              getSalesContactGridData(
                                profileData.accountId,
                                selectedBusinessUnit.value,
                                values.pgiShippoint.value,
                                values.reportType.value,
                                setLoading,
                                pageNo,
                                pageSize
                              )
                            );
                          }}
                        >
                          View
                        </button>
                      </div>
                      <div className="col-lg-2 mt-3">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => {
                            var isTrue = false;
                            rowDto.forEach((itm) => {
                              if (values.reportType.value === 2) {
                                if (itm.itemCheck) {
                                  isTrue = true;
                                  const gridRefresh = () => {
                                    dispatch(
                                      getSalesContactGridData(
                                        profileData.accountId,
                                        selectedBusinessUnit.value,
                                        values.pgiShippoint.value,
                                        values.reportType.value,
                                        setLoading,
                                        pageNo,
                                        pageSize
                                      )
                                    );
                                  };
                                  savePgiData(itm.shipmentId, gridRefresh);
                                }
                              } else {
                                toast.warn("Please Select Incomplete Data", {
                                  toastId: 456,
                                });
                              }
                            });
                            if (isTrue) {
                              toast.success("All selected pgi are saved...!", {
                                toastId: 456,
                              });
                              //window.location.reload(false);
                            } else {
                              toast.warn("Select a pgi first..", {
                                toastId: 456,
                              });
                            }
                          }}
                        >
                          PGI Save
                        </button>
                      </div>
                    </>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initialData)}
              ></button>
            </Form>
            {/* Table Start */}
            {loading && <Loading />}
            <div className="row cash_journal">
              <div className="col-lg-12 pr-0 pl-0">
                {rowDto?.length >= 0 && (
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                      <thead>
                        <tr>
                          <th style={{ width: "90px" }}>
                            <input
                              type="checkbox"
                              id="parent"
                              onChange={(event) => {
                                allGridCheck(event.target.checked);
                              }}
                            />
                          </th>
                          <th style={{ width: "50px" }}>Sl</th>
                          <th style={{ width: "90px" }}>Shipment No</th>
                          <th style={{ width: "90px" }}>Contact Date</th>
                          <th>Route Name</th>
                          <th>Transport Mode</th>
                          <th>Shipping Type Name</th>
                          <th>Vehicle Name</th>
                          <th style={{ width: "90px" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowDto?.map((td, index) => (
                          <tr key={index}>
                            <td>
                              <Field
                                name={values.itemCheck}
                                component={() => (
                                  <input
                                    id="itemCheck"
                                    type="checkbox"
                                    className="ml-2"
                                    value={td.itemCheck}
                                    checked={
                                      values.reportType === 2
                                        ? true
                                        : td.itemCheck
                                    }
                                    name={td.itemCheck}
                                    onChange={(e) => {
                                      //setFieldValue("itemCheck", e.target.checked);
                                      itemSlectedHandler(
                                        e.target.checked,
                                        index
                                      );
                                    }}
                                  />
                                )}
                                label="Transshipment"
                              />
                            </td>
                            <td className="text-center"> {td.sl} </td>
                            <td className="text-center">
                              <div className="text-right pl">
                                {td?.shipmentCode}
                              </div>
                            </td>
                            <td>{_dateFormatter(td?.shipmentDate)}</td>
                            <td>
                              <div className="pl-2">{td?.routeName}</div>
                            </td>
                            <td>
                              <div className="pl-2">
                                {td?.transportModeName}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">{td.shippingTypeName}</div>{" "}
                            </td>
                            <td>
                              <div className="pl-2">{td.vehicleName}</div>{" "}
                            </td>
                            <td>
                              <div className="d-flex justify-content-around">
                                <span className="view">
                                  <IView
                                    clickHandler={() => {
                                      history.push(
                                        `/sales-management/transportmanagement/shipping/view/${td.shipmentId}/${td.shipmentCode}`
                                      );
                                    }}
                                  />
                                </span>
                                <span
                                  className="edit"
                                  onClick={() => {
                                    history.push(
                                      `/sales-management/transportmanagement/shipping/edit/${td.shipmentId}`
                                    );
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
              </div>
            </div>
            {gridData?.data?.length > 0 && (
              <PaginationTable
                count={gridData?.totalCount}
                setPositionHandler={setPositionHandler}
                paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                values={values}
              />
            )}
          </>
        )}
      </Formik>
    </>
  );
}
