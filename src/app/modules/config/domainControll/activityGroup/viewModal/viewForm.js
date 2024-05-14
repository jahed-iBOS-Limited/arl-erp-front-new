import React, { useEffect, useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import Axios from "axios";

export default function ViewForm({ id }) {
  const [headerDto, setHeaderDto] = useState("");
  const [rowDto, setRowDto] = useState([]);
  useEffect(() => {
    getDataById(id);
  }, [id]);

  const getDataById = async (id) => {
    const res = await Axios.get(
      `/domain/CreateActivityGroup/GetActivityGroupInformationByActivityGroupId?ActivityGroupHeaderId=${id}`
    );
    const { data, status } = res;
    if (status === 200) {
      const {
        getActivityGroupInformationHeader,
        getActivityGroupInformationRow,
      } = data[0];
      setHeaderDto(getActivityGroupInformationHeader);
      setRowDto(getActivityGroupInformationRow);
    }
  };

  return (
    <div>
      {headerDto ? (
        <Form>
          <Row>
            <Col lg="4">
              <Form.Group controlId="activityGroupName">
                <Form.Label className="text-left">
                  Business Unit Name
                </Form.Label>
                <Form.Control
                  value={headerDto.activityGroupName}
                  type="text"
                  disabled
                  placeholder="Loading..."
                />
              </Form.Group>
            </Col>
            <Col lg="4">
              <Form.Group controlId="moduleName">
                <Form.Label>Code</Form.Label>
                <Form.Control
                  value={headerDto.moduleName}
                  type="text"
                  disabled
                  placeholder="Loading..."
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              {rowDto.length && (
              <div className="table-responsive">
                  <table className="table table-striped table-bordered mt-3">
                  <thead>
                    <tr>
                      <th>SL.</th>
                      <th>Activity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowDto.map((itm, idx) => (
                        <tr key={itm.configId}>
                          <td className="text-center">{idx + 1}</td>
                          <td cla>{itm.activityName}</td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              )}
            </Col>
          </Row>
        </Form>
      ) : (
        <h5>Loading.....</h5>
      )}
    </div>
  );
}
