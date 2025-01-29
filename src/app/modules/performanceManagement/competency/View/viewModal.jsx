import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import IViewModal from "../../../_helper/_viewModal";
import { getCompetencyIdAction, setCompetencyEmpty } from "../_redux/Actions";
import { useSelector, shallowEqual, useDispatch } from "react-redux";

export default function ViewForm({ id, show, onHide }) {
  const dispatch = useDispatch();
  useEffect(() => {
    if (id) {
      dispatch(getCompetencyIdAction(id));
    } else {
      dispatch(setCompetencyEmpty());
    }
       // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // get view modal data from store
  const singleData = useSelector((state) => {
    return state.competencyTwo?.singleData;
  }, shallowEqual);
  return (
    <div>
      <IViewModal
        show={show}
        onHide={onHide}
        title={singleData?.objCompetency?.competencyName || ""}
        isShow={singleData ? false : true}
      >
        {singleData ? (
          <>
            <Row style={{ marginTop: "20px" }}>
              <Col lg="12">
                <table
                  className="competencyTopInfo"
                  style={{ fontSize: "15px", lineHeight: "25px" }}
                >
                  <tr>
                    <td>
                      <b>Competency type</b>
                    </td>
                    <td>
                      :{" "}
                      {singleData?.objCompetency.isFunctionalCompetency
                        ? "Core competency"
                        : "Functional competency"}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Competency name</b>
                    </td>
                    <td>: {singleData?.objCompetency?.competencyName}</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Competency definition</b>
                    </td>
                    <td>: {singleData?.objCompetency?.competencyDefinition}</td>
                  </tr>
                </table>

                <hr />
              </Col>
            </Row>
            <Row style={{ marginTop: "25px" }}>
              <div className="col-lg-6">
                <table className="table table-striped table-bordered table table-head-custom table-vertical-center">
                  <thead>
                    <tr>
                      <th scope="col">Employee Cluster</th>
                      <th scope="col">Desired Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {singleData?.objValueMap?.map((itm, idx) => (
                      <tr key={itm.value}>
                        <td className="text-left">{itm.employeeClusterName}</td>
                        <td className="text-center">{itm.desiredValue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Row>
            <Row style={{ marginTop: "25px" }}>
              <table className="table table-striped table-bordered table table-head-custom table-vertical-center">
                <thead>
                  <tr>
                    <th scope="col">SL</th>
                    <th scope="col">Demonstrated Behaviour</th>
                    <th scope="col">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {singleData.objDemo.map((itm, idx) => (
                    <tr key={itm.value}>
                      <td className="text-center">{idx + 1}</td>
                      <td>{itm.demonstratedBehaviour}</td>
                      <td> {itm?.isPositive ? "Positive" : "Negative"} </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Row>
          </>
        ) : (
          <h1> Loading ....</h1>
        )}
      </IViewModal>
    </div>
  );
}
