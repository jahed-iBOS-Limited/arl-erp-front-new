import React, { useEffect, useState } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import useAxiosGet from '../../_helper/customHooks/useAxiosGet';
import { _dateFormatter } from '../../_helper/_dateFormate';
import IForm from '../../_helper/_form';
import IView from '../../_helper/_helperIcons/_view';
import Loading from '../../_helper/_loading';
import IViewModal from '../../_helper/_viewModal';
import ViewTrainingSubmission from './viewTrainingSubmissionAnswer';

const TrainingLanding = () => {
  const [isDisabled] = useState(false);
  const [, setObjprops] = useState({});
  const [landingData, getLandingData] = useAxiosGet();
  const history = useHistory();
  const [currentUserMarks, setCurrentUserMarks] = useState({});
  const [assesment, setAssesment] = useState();
  const [isMarksModal, setIsMarksModal] = useState(false);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  useEffect(() => {
    getLandingData(`/hcm/Training/EmployeeTrainingScheduleLanding?employeeId=${profileData?.employeeId}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IForm
      title={"Training List"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={true}
      isHiddenBack={true}
      isHiddenSave={true}
    >
      {isDisabled && <Loading />}
      <div className="row">
        <div className="col-lg-12">
        <div className="table-responsive">
          <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
            <thead>
              <tr>
                <th style={{ width: "30px" }}>SL</th>
                <th>Training Schedule</th>
                <th>Date</th>
                <th>Pre-Assessment</th>
                <th>Post-Assessment</th>
              </tr>
            </thead>
            <tbody>
              {landingData?.length > 0 &&
                landingData.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item?.name}</td>
                    <td className="text-center">
                      {_dateFormatter(item?.fromDate)} to{" "}
                      {_dateFormatter(item?.toDate)}
                    </td>
                    <td style={{ width: "100px" }} className="text-center">
                      <div className="d-flex justify-content-around">
                        {!item?.isPreSubmitted ?
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="cs-icon">{"Exam"}</Tooltip>
                            }
                          >
                            <span className="cursor-pointer">
                              <i
                                className={`fas fa-vote-yea`}
                                onClick={() => {
                                  history.push({
                                    pathname: `/self-service/mytraining/view/${item?.value}`,
                                    state: { ...item, isPreAssesment: true, requisitionId: item?.requisitionId },
                                  })
                                }}
                              ></i>
                            </span>
                          </OverlayTrigger>
                          : null}
                        <IView
                          title={"View Submission"}
                          clickHandler={() => {
                            setCurrentUserMarks(item);
                            setIsMarksModal(true);
                            setAssesment(true)
                          }}
                        />
                      </div>
                    </td>
                    <td style={{ width: "100px" }} className="text-center">
                      <div className="d-flex justify-content-around">
                        {!item?.isPostSubmitted ?
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="cs-icon">{"Exam"}</Tooltip>
                            }
                          >
                            <span className="cursor-pointer">
                              <i
                                className={`fas fa-vote-yea`}
                                onClick={() => {
                                  history.push({
                                    pathname: `/self-service/mytraining/view/${item?.value}`,
                                    state: { ...item, isPreAssesment: false, requisitionId: item?.requisitionId },
                                  })
                                }}
                              ></i>
                            </span>
                          </OverlayTrigger>
                          : null}

                        <IView
                          title={"View Submission"}
                          clickHandler={() => {
                            setCurrentUserMarks(item);
                            setIsMarksModal(true);
                            setAssesment(false)
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
      <IViewModal
        show={isMarksModal}
        onHide={() => setIsMarksModal(false)}
        title={assesment ? "Pre-Assessment Submission Form" : "Post-Assessment Submission Form"}
      >
        <ViewTrainingSubmission currentUserMarks={currentUserMarks} assesment={assesment} />
      </IViewModal>
    </IForm>
  )
}

export default TrainingLanding