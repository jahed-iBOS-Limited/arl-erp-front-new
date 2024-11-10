import React, { useEffect, useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import Axios from 'axios';

export default function ViewForm({ id }) {
    const [businessUnitData, setData] = useState("");
    useEffect(() => {
        getBusinessUnitById(id);
    }, [id])

    const getBusinessUnitById = async (id, accountId) => {
        const res = await Axios.get(`/mgmt/SBU/GetSBUEditViewDataList?SBUId=${id}`);
        const { data, status } = res;
        // console.log(res)
        if (status === 200) {
            setData(data[0]);

        }
    };

    return (
        <div>
            {businessUnitData ?
                <Form>
                    <Row>
                        <Col lg="4">
                            <Form.Group controlId="businessUnitName">
                                <Form.Label className="text-left">Business Unit Name</Form.Label>
                                <Form.Control value={businessUnitData.businessUnitName} type="text" disabled placeholder="Loading..." />
                            </Form.Group>
                        </Col>
                        <Col lg="4">
                            <Form.Group controlId="sbucode">
                                <Form.Label>Code</Form.Label>
                                <Form.Control value={businessUnitData.sbucode} type="text" disabled placeholder="Loading..." />
                            </Form.Group>
                        </Col>
                        <Col lg="4">
                            <Form.Group controlId="sbuname">
                                <Form.Label>SBU Name</Form.Label>
                                <Form.Control value={businessUnitData.sbuname} type="text" disabled placeholder="Loading..." />
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
                : <h5>Loading.....</h5>
            }
        </div>
    )
}
