import React, { useEffect, useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import Axios from 'axios';

export default function ViewForm({ id }) {
    const [businessUnitData, setData] = useState("");
    useEffect(() => {
        getBusinessUnitById(id);
    }, [id])

    const getBusinessUnitById = async (id, accountId) => {
        const res = await Axios.get(`/domain/BusinessUnitDomain/GetBusinessunitDomainByID?AccountId=${accountId || 1}&BusinessUnitId=${id}`);
        const { data, status } = res;
        if (status === 200) {
            const { objGetBusinessUnitDTO, objGetBusinessUnitLanguageDTO, objGetBusinessUnitCurrencyDTO } = data[0];
            const singleObject = { ...objGetBusinessUnitDTO, ...objGetBusinessUnitLanguageDTO, ...objGetBusinessUnitCurrencyDTO, languageName: objGetBusinessUnitLanguageDTO.languageName, currencyName: objGetBusinessUnitCurrencyDTO.currencyName };
            setData(singleObject);
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
                            <Form.Group controlId="businessUnitCode">
                                <Form.Label>Code</Form.Label>
                                <Form.Control value={businessUnitData.businessUnitCode} type="text" disabled placeholder="Loading..." />
                            </Form.Group>
                        </Col>
                        <Col lg="4">
                            <Form.Group controlId="businessUnitAddress">
                                <Form.Label>Address</Form.Label>
                                <Form.Control value={businessUnitData.businessUnitAddress} type="text" disabled placeholder="Loading..." />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col lg="4">
                            <Form.Group controlId="businessUnitLanguage">
                                <Form.Label>Language</Form.Label>
                                <Form.Control value={businessUnitData.languageName} type="text" disabled placeholder="Loading..." />
                            </Form.Group>
                        </Col>
                        <Col lg="4">
                            <Form.Group controlId="businessUnitCurrency">
                                <Form.Label>Base Currency</Form.Label>
                                <Form.Control value={businessUnitData.currencyName} type="text" disabled placeholder="Loading..." />
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
                : <h5>Loading.....</h5>
            }
        </div>
    )
}
