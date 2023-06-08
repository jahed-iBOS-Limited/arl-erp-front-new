import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import IForm from '../../../_helper/_form';
import IView from '../../../_helper/_helperIcons/_view';
import Loading from '../../../_helper/_loading';
import { _todayDate } from '../../../_helper/_todayDate';
import IViewModal from '../../../_helper/_viewModal';
import IndividualSubmissionModal from './modal/IndividualSubmissionModal';

const Submissions = () => {
    // eslint-disable-next-line no-unused-vars
    const [objProps, setObjprops] = useState({});
    const [isDisabled] = useState(false);
    const [rowData, getRowData, lodar] = useAxiosGet();
    const { id } = useParams();
    const location = useLocation();
    const [isMarksModal, setIsMarksModal] = useState(false);
    const [currentUserMarks, setCurrentUserMarks] = useState({});
    const [assesment, setAssesment] = useState();

    useEffect(() => {
        getRowData(
            `/hcm/Training/GetTrainingSumissionLanding?scheduleId=${id}`
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <IForm
            customTitle={"Assessment Submissions"}
            getProps={setObjprops}
            isDisabled={isDisabled}
            isHiddenReset={true}
            isHiddenSave={true}
        >
            <Formik
                enableReinitialize={true}
                initialValues={{}}
                onSubmit={() => { }}
            >
                {({ values, setFieldValue }) => (
                    <>
                        <Form className="form form-label-right">
                            {lodar && <Loading />}
                            <div className="row">
                                <div className="col-lg-12 text-center">
                                    <h1>{location?.state?.name}</h1>
                                    <h3>From: {_todayDate(location?.state?.fromDate)} To: {_todayDate(location?.state?.toDate)}</h3>
                                </div>
                                <div className="col-lg-12">
                                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                                        <thead>
                                            <tr>
                                                <th style={{ width: "30px" }}>SL</th>
                                                <th>Enroll</th>
                                                <th>Name</th>
                                                <th>Designation</th>
                                                <th>Job Type</th>
                                                <th>Email</th>
                                                <th>Gender</th>
                                                <th>Supervisor</th>
                                                <th>Resource Person</th>
                                                <th>Pre-Assesment Marks</th>
                                                <th>Post-Assesment Marks</th>
                                                <th style={{ width: "100px" }}>Pre-Assesment</th>
                                                <th style={{ width: "100px" }}>Post-Assesment</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rowData?.length > 0 &&
                                                rowData?.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td className='text-center'>{item?.intEmployeeId}</td>
                                                        <td>{item?.strEmployeeName}</td>
                                                        <td>{item?.strDesignationName}</td>
                                                        <td>{item?.strEmploymentType}</td>
                                                        <td>{item?.strEmail}</td>
                                                        <td>{item?.strGender}</td>
                                                        <td>{item?.strSupervisor}</td>
                                                        <td>{item?.strResourcePerson}</td>
                                                        <td className='text-center'>{item?.preAssessmentMarks}</td>
                                                        <td className='text-center'>{item?.postAssessmentMarks}</td>
                                                        <td className='text-center'>
                                                            <IView
                                                                title="View Pre-Assessment"
                                                                clickHandler={(e) => {
                                                                    setCurrentUserMarks(item);
                                                                    setIsMarksModal(true);
                                                                    setAssesment(true)
                                                                }}
                                                            />
                                                        </td>
                                                        <td className='text-center'>
                                                            <IView
                                                                title="View Post-Assessment"
                                                                clickHandler={(e) => {
                                                                    setCurrentUserMarks(item);
                                                                    setIsMarksModal(true);
                                                                    setAssesment(false)
                                                                }}
                                                            />
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
                show={isMarksModal}
                onHide={() => setIsMarksModal(false)}
                title={assesment ? "Pre-Assessment Submission Form" : "Post-Assessment Submission Form"}
            >
                <IndividualSubmissionModal currentUserMarks={currentUserMarks} assesment={assesment} />
            </IViewModal>
        </IForm>
    )
}

export default Submissions