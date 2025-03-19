import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import Loading from "../../../_helper/_loading";
import IViewModal from "../../../_helper/_viewModal";
import DeleteModal from "./deleteModal";

export default function RequisitionApprovalView() {
  const [isDisabled] = useState(false);
  const [, setObjprops] = useState({});
  const [, getRowData] = useAxiosGet();
  const [allData, setAllData] = useState([]);
  const [isShowModal, setisShowModal] = useState(false);
  const [isApprove, setIsApprove] = useState(false);
  const params = useParams();
  const location = useLocation();

  useEffect(() => {
    getRowData(
      `/hcm/Training/GetTrainingRequisitionLanding?intScheduleId=${params?.viewId}`,
      (data) => {
        setAllData(data);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.viewId]);

  return (
    <IForm
      title="Requisition View"
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={true}
      isHiddenSave={true}
    >
      {false && <Loading />}
      <div>
        <Formik
          enableReinitialize={true}
          initialValues={{}}
          onSubmit={(values, { setSubmitting, resetForm }) => { }}
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
              <Form className="form form-label-right">
                {false && <Loading />}
                <div className='text-center'>
                  <h1 className='text-center'>{location?.state?.strTrainingName}</h1>
                  <h3 className='text-center'>From: {_dateFormatter(location?.state?.dteFromDate)} To: {_dateFormatter(location?.state?.dteToDate)}</h3>
                </div>
                {allData?.length ? (
                  <div
                    style={{ marginRight: "15px", marginTop: "10px" }}
                    className="text-right"
                  >
                    <div className="">
                      <button
                        onClick={() => {
                          if (
                            !allData.filter((item) => item?.selectCheckbox)
                              ?.length
                          )
                            return toast.warn("Please select at least one.");
                          setIsApprove(true);
                          setisShowModal(true);
                        }}
                        type="button"
                        className="btn btn-primary mr-5"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            !allData.filter((item) => item?.selectCheckbox)
                              ?.length
                          )
                            return toast.warn("Please select at least one.");
                          setIsApprove(false);
                          setisShowModal(true);
                        }}
                        className="btn btn-danger"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <div className="row">
                  <div className="col-lg-12">
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>
                            <input
                              type="checkbox"
                              checked={
                                allData?.length > 0
                                  ? allData?.every(
                                    (item) => item?.selectCheckbox
                                  )
                                  : false
                              }
                              onChange={(e) => {
                                setAllData(
                                  allData?.map((item) => ({
                                    ...item,
                                    selectCheckbox: e.target.checked,
                                  }))
                                );
                                setFieldValue("allSelected", e.target.checked);
                              }}
                              disabled={
                                allData?.length < 1 || allData?.every((item) => item?.strApprovalStatus === "Approved")
                              }
                            />
                          </th>
                          <th style={{ width: "100px" }}>Enroll</th>
                          <th>Name</th>
                          <th>Training Name</th>
                          <th>Designation</th>
                          <th>Job Type</th>
                          <th>Email</th>
                          <th>Gender</th>
                          <th>Supervisor</th>
                          <th>Resource Person</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allData?.length > 0 &&
                          allData?.map((item, index) => (
                            <tr key={index}>
                              <td className="text-center">
                                <input
                                  type="checkbox"
                                  checked={allData[index]?.selectCheckbox}
                                  onChange={(e) => {
                                    let data = [...allData];
                                    data[index].selectCheckbox =
                                      e.target.checked;
                                    setAllData([...data]);
                                  }}
                                  disabled={item?.strApprovalStatus === "Approved"}
                                />
                              </td>
                              <td className="text-center">
                                {item?.intEmployeeId}
                              </td>
                              <td>{item?.strEmployeeName}</td>
                              <td>{item?.strTrainingName}</td>
                              <td>{item?.strDesignationName}</td>
                              <td>{item?.strEmploymentType}</td>
                              <td>{item?.strEmail}</td>
                              <td>{item?.strGender}</td>
                              <td>{item?.strSupervisor}</td>
                              <td>{item?.strResourcePerson}</td>
                              <td className="text-center">
                                {item?.strApprovalStatus}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Form>
            </>
          )}
        </Formik>
        <IViewModal
          // title="Requisition Approve/Reject"
          modelSize="sm"
          show={isShowModal}
          isModalFooterActive={false}
          onHide={() => setisShowModal(false)}
        >
          <DeleteModal
            isApprove={isApprove}
            allData={allData}
            setisShowModal={setisShowModal}
            getRowData={getRowData}
            setAllData={setAllData}
            id={params?.viewId}
          />
        </IViewModal>
      </div>
    </IForm>
  );
}
