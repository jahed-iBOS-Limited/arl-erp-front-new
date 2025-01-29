import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IEdit from "../../../_helper/_helperIcons/_edit";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IView from "../../../_helper/_helperIcons/_view";
import PaginationTable from "../../../_helper/_tablePagination";
import PaginationSearch from "../../../_helper/_search";
const initData = {};
export default function EventPlanningLanding() {
  const [tableData, getTableData, tableDataLoader] = useAxiosGet();
  const saveHandler = (values, cb) => {};
  const history = useHistory();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  const getData = (search = "") => {
    getTableData(
      `/hcm/Training/EventLanding?search=${search}&PageNo=${pageNo}&PageSize=${pageSize}`
    );
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPositionHandler = (pageNo, pageSize, values, search = "") => {
    getTableData(
      `/hcm/Training/EventLanding?search=${search}&PageNo=${pageNo}&PageSize=${pageSize}`
    );
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, values, searchValue);
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
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
          {tableDataLoader && <Loading />}
          <IForm
            title="Event Planning"
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
                        pathname: `/learningDevelopment/event/EventPlanning/create`,
                        isCreate: true,
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
              <div>
                <PaginationSearch
                  placeholder="Search here..."
                  paginationSearchHandler={paginationSearchHandler}
                  values={values}
                />
              </div>
              <div>
                <table className="table table-striped table-bordered bj-table bj-table-landing">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Customer Name</th>
                      <th>Event Name</th>
                      <th>Event Description</th>
                      <th>Event Place</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData?.eventDetails?.length > 0 &&
                      tableData?.eventDetails?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item?.partnerName}</td>
                          <td>{item?.eventName}</td>
                          <td>{item?.eventDescription}</td>
                          <td>{item?.eventPlace}</td>
                          <td className="text-center">
                            {_dateFormatter(item?.eventStartDate)}
                          </td>
                          <td className="text-center">
                            {_dateFormatter(item?.eventEndDate)}
                          </td>
                          <td className="text-center">
                            <span
                              onClick={(e) => {
                                history.push({
                                  pathname: `/learningDevelopment/event/EventPlanning/edit/${item?.eventId}`,
                                  isEdit: true,
                                });
                              }}
                              className="mx-2"
                            >
                              <IEdit title="Edit" />
                            </span>
                            <span
                              onClick={(e) => {
                                history.push({
                                  pathname: `/learningDevelopment/event/EventPlanning/view/${item?.eventId}`,
                                  isView: true,
                                });
                              }}
                              className="mx-2"
                            >
                              <IView title="View" />
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {tableData?.eventDetails?.length > 0 && (
                  <PaginationTable
                    count={tableData?.totalCount}
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
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
