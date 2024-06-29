
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import { shallowEqual, useSelector } from "react-redux";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IEdit from "../../../_helper/_helperIcons/_edit";
import PaginationTable from "../../../_helper/_tablePagination";


const initData = {
    shipPoint: ''
};


export default function PumpInformation() {
    const [pageNo, setPageNo] = useState(0);
    const [pageSize, setPageSize] = useState(15);
    const { profileData: { accountId }, selectedBusinessUnit: { value: buUnId } } = useSelector(state => state.authData, shallowEqual)
    const history = useHistory();
    const [shipPoint, getShipPoint] = useAxiosGet()
    const [rowData, getRowData, loading] = useAxiosGet()

    const setTableData = (_pageNo, _pageSize, values) => {
        const businessUnitId = buUnId;
        const shipPointId = values?.shipPoint.value
        const pageNo = _pageNo || 0
        const pageSize = _pageSize || 15
        const url = `/tms/VehicleAllocation/GetPumpPagination?businessUnitId=${businessUnitId}&shipPointId=${shipPointId}&pageNo=${pageNo}&pageSize=${pageSize}`
        getRowData(url)
    }

    useEffect(() => {
        getShipPoint(`/wms/ShipPoint/GetShipPointDDL?accountId=${accountId}&businessUnitId=${buUnId}`)
        setTableData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const saveHandler = (values, cb) => { };
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
                    {false && <Loading />}
                    <IForm
                        title="Pump Information"
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
                                            history.push("/transport-management/configuration/pumpinformation/create");
                                        }}
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
                                        name="shipPoint"
                                        options={shipPoint}
                                        value={values?.shipPoint}
                                        label="Ship Point"
                                        onChange={(valueOption) => {
                                            setFieldValue("shipPoint", valueOption);
                                        }}
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <button
                                        className="btn btn-primary mt-5"
                                        type="button"
                                        onClick={() => {
                                            setTableData(pageNo, pageSize, values)
                                        }}
                                    >
                                        View
                                    </button>
                                </div>
                            </div>
                            <div className="row cash_journal">
                {(loading ) && <Loading />}
                <div className="col-lg-12">
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th style={{ width: "40px" }}>SL</th>
                          <th>Pump Model Name</th>
                          <th>Pump Group Head Name</th>
                          <th>Ship Point Name</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowData?.data?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td> {item?.sl}</td>
                              <td>{item?.pumpModelName}</td>
                              <td>{item?.pumpGroupHeadName}</td>
                              <td>{item?.shipPointName}</td>
                              <td>{item?.status}</td>                     
                              <td className="text-center">
                                <div className="d-flex justify-content-around">
                                  <span>
                                    <IEdit
                                      onClick={() => {
                                        history.push({
                                          pathname: `/transport-management/configuration/pumpinformation/edit`,
                                          state: item,
                                        });
                                      }}
                                    ></IEdit>
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                {rowData?.data?.length > 0 && (
                  <PaginationTable
                    count={rowData?.totalCount}
                    setPositionHandler={setTableData}
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
                        </Form>
                    </IForm>
                </>
            )}
        </Formik>
    );
}