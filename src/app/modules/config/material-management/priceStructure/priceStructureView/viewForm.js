import React, { useEffect, useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import Axios from 'axios';
import BootstrapTable from "react-bootstrap-table-next";

export default function ViewForm({ id }) {
    const [headerDto, setHeaderDto] = useState("");
    const [rowDto, setRowDto] = useState([]);
    useEffect(() => {
        getBusinessUnitById(id);
    }, [id])

    const getBusinessUnitById = async (id) => {
        const res = await Axios.get(`/item/PriceStructure/GetPriceStructureViewData?PriceStructureId=${id}`);
        const { data, status } = res;
        if (status === 200 && data) {
            setHeaderDto(data.objGETHeaderDTO);
            setRowDto(data.objListROWDTO)
        };
    };
    const columns = [
        {
            dataField: "sl",
            text: "SL"
        },
        {
            dataField: "priceComponentName",
            text: "Component Name",
        },
        {
            dataField: "valueType",
            text: "Value Type"
        },
        {
            dataField: "numValue",
            text: "Value",
        },

        {
            dataField: "factorName",
            text: "Factor",
        },
        {
            dataField: "sumFromSerial",
            text: "Sum Form"
        },
        {
            dataField: "sumToSerial",
            text: "Sum To",
        },
        {
            dataField: "isManual",
            text: "Is Manual",
            formatter: (cell, row) => <input type="checkbox" disabled checked={row?.isMannual} />,
        },
    ];
    return (
        <div>
            {headerDto ?
                <Form>

                    <Row>
                        <Col lg="4">
                            <Form.Group controlId="strPriceStructureName">
                                <Form.Label className="text-left">Structure Name</Form.Label>
                                <Form.Control value={headerDto.strPriceStructureName} type="text" disabled placeholder="Loading..." />
                            </Form.Group>
                        </Col>
                        <Col lg="4">
                            <Form.Group controlId="strPriceStructureCode">
                                <Form.Label>Code</Form.Label>
                                <Form.Control value={headerDto.strPriceStructureCode} type="text" disabled placeholder="Loading..." />
                            </Form.Group>
                        </Col>
                        <Col lg="4">
                            <Form.Group controlId="priceStructureTypeName">
                                <Form.Label>Structure For</Form.Label>
                                <Form.Control value={headerDto.priceStructureTypeName} type="text" disabled placeholder="Loading..." />
                            </Form.Group>
                        </Col>

                    </Row>

                    <Row className="mt-2">
                        <Col>
                            {
                                rowDto.length ?
                                    <BootstrapTable
                                        wrapperClasses="table-responsive"
                                        classes="table table-head-custom table-vertical-center"
                                        bootstrap4
                                        bordered={false}
                                        remote
                                        keyField="businessUnitId"
                                        data={rowDto}
                                        columns={columns}
                                    ></BootstrapTable>
                                    : "Loading...."
                            }
                        </Col>
                    </Row>
                </Form>
                : <h5>Loading.....</h5>
            }
        </div>
    );
    ;
}
