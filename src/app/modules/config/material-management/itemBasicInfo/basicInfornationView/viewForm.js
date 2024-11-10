import React, { useEffect, useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import Axios from "axios";
import Loading from "../../../../_helper/_loading";

export default function ViewForm({ id }) {
  const [itemBasicData, setData] = useState("");
  useEffect(() => {
    getBusinessUnitById(id);
  }, [id]);

  const getBusinessUnitById = async (id, accountId) => {
    const res = await Axios.get(
      `/item/ItemBasic/GetItemBasicByItemId?Itemid=${id}`
    );
    const { data, status } = res;
    if (status === 200) {
      setData(data[0]);
    }
  };

  return (
    <div>
      {itemBasicData ? (
        <Form>
          <Row>
            {/* <Col lg="4">
                            <Form.Group controlId="itemBasicCode">
                                <Form.Label className="text-left">Item Code</Form.Label>
                                <Form.Control value={itemBasicData.itemCode} type="text" disabled placeholder="Loading..." />
                            </Form.Group>
                        </Col> */}
            <Col lg="4">
              <Form.Group controlId="itemBasicItemName">
                <Form.Label>Item Name</Form.Label>
                <Form.Control
                  value={itemBasicData.itemName}
                  type="text"
                  disabled
                  placeholder="Loading..."
                />
              </Form.Group>
            </Col>
            <Col lg="4">
              <Form.Group controlId="itemBasicItemType">
                <Form.Label>Item Type</Form.Label>
                <Form.Control
                  value={itemBasicData.itemTypeName}
                  type="text"
                  disabled
                  placeholder="Loading..."
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col lg="4">
              <Form.Group controlId="itemBasicCategoryName">
                <Form.Label>Item Category</Form.Label>
                <Form.Control
                  value={itemBasicData.itemCategoryName}
                  type="text"
                  disabled
                  placeholder="Loading..."
                />
              </Form.Group>
            </Col>
            <Col lg="4">
              <Form.Group controlId="itemBasicSubCategoryName">
                <Form.Label>Item Sub-category</Form.Label>
                <Form.Control
                  value={itemBasicData.itemSubCategoryName}
                  type="text"
                  disabled
                  placeholder="Loading..."
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      ) : (
        <Loading />
      )}
    </div>
  );
}
