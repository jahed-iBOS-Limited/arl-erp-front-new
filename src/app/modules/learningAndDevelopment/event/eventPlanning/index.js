import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IEdit from "../../../_helper/_helperIcons/_edit";
import { _dateFormatter } from "../../../_helper/_dateFormate";
const initData = {};
export default function EventPlanningLanding() {
  const [
    tableData,
    getTableData,
    tableDataLoader,
    setTableData,
  ] = useAxiosGet();
  const saveHandler = (values, cb) => {};
  const history = useHistory();

  useEffect(() => {
    // getTableData(``)
    setTableData([
      {
        eventId: 2,
        eventName: "dummy event name",
        eventDescription: "dummy description",
        eventPlace: "dummy place",
        eventStartDate: "2023-10-11T18:57:43.893Z",
        eventEndDate: "2023-10-11T18:57:43.893Z",
        createdBy: 0,
        createdAt: "2023-10-11T18:57:43.893Z",
        updatedBy: 0,
        updatedAt: "2023-10-11T18:57:43.893Z",
        isActive: 0,
      },
    ]);
  }, []);

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
                <table className="table table-striped table-bordered bj-table bj-table-landing">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Event Name</th>
                      <th>Event Description</th>
                      <th>Event Place</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData?.length > 0 &&
                      tableData?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
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
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
