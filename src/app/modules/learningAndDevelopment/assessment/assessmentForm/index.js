import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import IEdit from "../../../_helper/_helperIcons/_edit";
import IView from "../../../_helper/_helperIcons/_view";
import Loading from "../../../_helper/_loading";

export default function AssessmentForm() {
  const [isDisabled] = useState(false);
  const [, setObjprops] = useState({});
  const [landingData, getLandingData] = useAxiosGet();
  const history = useHistory();

  useEffect(() => {
    getLandingData(`/hcm/Training/TrainingScheduleDDL`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IForm
      title={"Assessment Form Landing"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={true}
      isHiddenBack={true}
      isHiddenSave={true}
    >
      {isDisabled && <Loading />}
      <div className="row">
        <div className="col-lg-12">
          <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
            <thead>
              <tr>
                <th style={{ width: "30px" }}>SL</th>
                <th>Training Schedule</th>
                <th>Date</th>
                <th>Pre-Assessment</th>
                <th>Post-Assessment</th>
                <th>Submission</th>
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
                        <IView
                          title="View	Pre-Assessment"
                          clickHandler={() =>
                            history.push({
                              pathname: `/learningDevelopment/assessment/assessmentForm/view/${item?.value}`,
                              state: { ...item, isPreAssesment: true, intRequisitionId: item?.value },
                            })
                          }
                        />
                        <IEdit
                          onClick={() =>
                            history.push({
                              pathname: `/learningDevelopment/assessment/assessmentForm/edit/${item?.value}`,
                              state: { ...item, isPreAssesment: true },
                            })
                          }
                        />
                      </div>
                    </td>
                    <td style={{ width: "100px" }} className="text-center">
                      <div className="d-flex justify-content-around">
                        <IView
                          clickHandler={() =>
                            history.push({
                              pathname: `/learningDevelopment/assessment/assessmentForm/view/${item?.value}`,
                              state: { ...item, isPreAssesment: false, intRequisitionId: item?.value },
                            })
                          }
                        />
                        <IEdit
                          onClick={() =>
                            history.push({
                              pathname: `/learningDevelopment/assessment/assessmentForm/edit/${item?.value}`,
                              state: { ...item, isPreAssesment: false },
                            })
                          }
                        />
                      </div>
                    </td>
                    <td style={{ width: "100px" }} className="text-center">
                      <OverlayTrigger
                        overlay={
                          <Tooltip id="cs-icon">{"Submissions"}</Tooltip>
                        }
                      >
                        <span className="cursor-pointer">
                          <i
                            className={`fas fa-vote-yea`}
                            onClick={() => {
                              history.push({
                                pathname: `/learningDevelopment/assessment/assessmentForm/submission/${item?.value}`,
                                state: { ...item, isPreAssesment: false },
                              })
                            }}
                          ></i>
                        </span>
                      </OverlayTrigger>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </IForm>
  );
}
