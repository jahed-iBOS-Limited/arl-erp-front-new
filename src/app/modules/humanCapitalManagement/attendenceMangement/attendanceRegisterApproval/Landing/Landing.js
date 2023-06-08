/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import { getNewApplicationData, approveAll } from "../helper";
import { toast } from "react-toastify";
import IConfirmModal from "../../../../_helper/_confirmModal";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import PaginationTable from "../../../../_helper/_tablePagination";

const initData = {
  status: { value: true, label: "Approve" },
};

const AttendanceRegisterApproveLanding = () => {
  const history = useHistory();
  const [gridData, setgridData] = useState([]);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const [loader, setLoader] = useState(false);
  const [allSelect, setAllSelect] = useState(false);

  // Pagination State
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  // ApproveSubmitlHandler btn submit handler
  const approveSubmitlHandler = (values) => {
    let confirmObject = {
      title: "Are you sure?",
      yesAlertFunc: async () => {
        const filterData = gridData?.data?.filter((item) => item?.isSelect);
        if (filterData?.length === 0) {
          toast.warning("Please select one!");
        } else {
          let arr = [];
          filterData.forEach((item) => {
            arr.push(item?.attendaceRegId);
          });
          const payload = {
            attendaceRegId: [...arr],
          };
          approveAll(payload, setLoader, () => {
            setAllSelect(false);
            getNewApplicationData(
              profileData?.accountId,
              selectedBusinessUnit?.value,
              values?.status?.value,
              pageNo,
              pageSize,
              setgridData,
              setLoader
            );
          });
        }
      },
      noAlertFunc: () => {
        history.push(
          "/human-capital-management/attendancemgt/attendanceRegisterApproval"
        );
      },
    };
    IConfirmModal(confirmObject);
  };

  useEffect(() => {
    if (!allSelect) {
      const newRowData = gridData?.data?.map((item) => {
        return {
          ...item,
          isSelect: false,
        };
      });
      setgridData({ ...gridData, data: newRowData });
    } else {
      const newRowData = gridData?.data?.map((item) => {
        return {
          ...item,
          isSelect: true,
        };
      });
      setgridData({ ...gridData, data: newRowData });
    }
  }, [allSelect]);

  const singleCheckBoxHandler = (value, index) => {
    let newgridData = [...gridData?.data];
    newgridData[index].isSelect = value;
    setgridData({ ...gridData, data: newgridData });
  };

  useEffect(() => {
    getNewApplicationData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      true,
      pageNo,
      pageSize,
      setgridData,
      setLoader
    );
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  // setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getNewApplicationData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.status?.value,
      pageNo,
      pageSize,
      setgridData,
      setLoader
    );
  };

  return (
    <>
      <ICustomCard title="Attendance Register Approval">
        <Formik
          enableReinitialize={true}
          initialValues={{
            ...initData,
          }}
          // validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            resetForm(initData);
          }}
        >
          {({
            handleSubmit,
            resetForm,
            values,
            errors,
            touched,
            setFieldValue,
            setValues,
            isValid,
          }) => (
            <>
              {loader && <Loading />}
              <Form className="form form-label-right">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="global-form">
                      <div className="row d-flex justify-content-between">
                        <div className="col-lg-9">
                          <div className="row">
                            <div className="col-lg-4">
                              <NewSelect
                                name="status"
                                options={[
                                  { value: true, label: "Approve" },
                                  { value: false, label: "Unapprove" },
                                ]}
                                value={values?.status}
                                label="Status"
                                onChange={(valueOption) => {
                                  setgridData([]);
                                  setFieldValue("status", valueOption);
                                  setAllSelect(false);
                                  getNewApplicationData(
                                    profileData?.accountId,
                                    selectedBusinessUnit?.value,
                                    valueOption?.value,
                                    pageNo,
                                    pageSize,
                                    setgridData,
                                    setLoader
                                  );
                                }}
                                placeholder="Status"
                                isSearchable={true}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </div>
                        </div>
                        {gridData?.data?.length > 0 &&
                        !values?.status?.value ? (
                          <div className="col-lg-3 mt-4 d-flex justify-content-end">
                            <button
                              type="button"
                              className="btn btn-primary mr-1"
                              onClick={() => approveSubmitlHandler(values)}
                              disabled={gridData?.data?.length === 0}
                            >
                              Approve
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
              {/* Table Start */}
              {gridData?.data?.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-striped table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        {!values?.status?.value && (
                          <th style={{ width: "20px" }}>
                            <input
                              type="checkbox"
                              id="parent"
                              onChange={(event) => {
                                setAllSelect(event.target.checked);
                              }}
                            />
                          </th>
                        )}
                        <th>SL</th>
                        <th>Employee Name</th>
                        <th>Place Name</th>
                        <th>Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.data?.length > 0 &&
                        gridData?.data?.map((item, index) => (
                          <tr key={index}>
                            {!values?.status?.value && (
                              <td className="text-center">
                                <input
                                  id="isSelect"
                                  type="checkbox"
                                  value={item?.isSelect}
                                  checked={item?.isSelect}
                                  onChange={(e) => {
                                    singleCheckBoxHandler(
                                      e.target.checked,
                                      index
                                    );
                                  }}
                                />
                              </td>
                            )}
                            <td className="text-center">{index + 1}</td>
                            <td>
                              <div className="pl-2">{item?.employeeName}</div>
                            </td>
                            <td>
                              <div className="pl-2">{item?.placeName}</div>
                            </td>
                            <td>
                              <div className="pl-2">{item?.address}</div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div>
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
              </div>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
};

export default AttendanceRegisterApproveLanding;
