import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import IEdit from "../../../_helper/_helperIcons/_edit";
import { useParams } from "react-router-dom";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { useHistory } from "react-router-dom";

const initData = {};
const ViewEventDetails = () => {
  const history = useHistory();
  const { id } = useParams();
  const [objProps, setObjprops] = useState({});
  const saveHandler = (values, cb) => {};
  const [tableData, getTableData, tableDataLoader] = useAxiosGet();

  useEffect(() => {
    if (id) {
      getTableData(`/hcm/Training/GetEventById?id=${id}`, (data) => {
        console.log("data", data);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
          {tableDataLoader && <Loading />}
          <IForm
            isHiddenReset={true}
            isHiddenSave={true}
            customTitle={"Event Planning"}
            getProps={setObjprops}
          >
            <Form>
              {/* header section */}
              <div className="form-group  global-form row">
                <div className="col-lg-4">
                  <h6>Name: {tableData?.eventName}</h6>
                </div>
                <div className="col-lg-4">
                  <h6>Description: {tableData?.eventDescription}</h6>
                </div>
                <div className="col-lg-4"></div>
                <div className="col-lg-4">
                  <h6>
                    Start Date: {_dateFormatter(tableData?.eventStartDate)}
                  </h6>
                </div>
                <div className="col-lg-4">
                  <h6>End Date: {_dateFormatter(tableData?.eventEndDate)}</h6>
                </div>
              </div>
              {/* activity section */}
              <div className="row">
                <div className="col-lg-4">
                  <div className="global-form">
                    <div className="row">
                      <div className="col-lg-12">
                        <h6>Activity List</h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-8">
                  <div className="global-form">
                    <div className="row">
                      <div className="col-lg-12">
                        <h4>Participant List</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* table section */}
              <div className="row">
                <div className="col-lg-4">
                  <table className="table table-striped table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Activity Name</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData?.activities?.length > 0 &&
                        tableData?.activities?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.activityName}</td>
                            <td className="text-center">
                              {item?.isParticipantCount ? (
                                <span
                                  onClick={(e) => {
                                    history.push({
                                      pathname: `/learningDevelopment/event/EventPlanning/view/${id}/punch/${item?.activityId}`,
                                      eventHeaderData: {
                                        eventName: tableData?.eventName,
                                        eventDescription:
                                          tableData?.eventDescription,
                                        eventPlace: tableData?.eventPlace,
                                        eventStartDate:
                                          tableData?.eventStartDate,
                                        eventEndDate: tableData?.eventEndDate,
                                      },
                                      clickedItem: item,
                                    });
                                  }}
                                  className="mx-2"
                                >
                                  <IEdit />
                                </span>
                              ) : (
                                <></>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <div className="col-lg-8">
                  <table className="table table-striped table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Name</th>
                        <th>Occupation</th>
                        <th>Organization</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Code</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData?.participants?.length > 0 &&
                        tableData?.participants?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.participantName}</td>
                            <td>{item?.occupation}</td>
                            <td>{item?.organaizationName}</td>
                            <td>{item?.phone}</td>
                            <td>{item?.email}</td>
                            <td>{item?.address}</td>
                            <td>{item?.cardNumber}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={objProps?.resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
};

export default ViewEventDetails;
