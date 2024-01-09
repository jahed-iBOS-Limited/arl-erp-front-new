/* eslint-disable react-hooks/exhaustive-deps */
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography,
  makeStyles,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";

import {
  getCommercialBreakdownForAdvanceAndBill,
  getCommercialCostingServiceBreakdown,
} from "../helper";
import AddAdvance from "./addAdvance";
import AddBill from "./addBill";

const validationSchema = Yup.object().shape({});
const initData = {};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

const ServiceBreakDownViewModal = ({
  show,
  onHide,
  poNumber,
  shipmentNo,
  lcNumber,
  referenceId,
  state,
}) => {
  console.log("state", state);
  const classes = useStyles();
  const [rowDto, setRowDto] = useState([]);
  const [bill, setBill] = useState({});
  const [advanceBill, setAdvanceBill] = useState([]);
  const [expanded, setExpanded] = React.useState(false);
  const [expanded1, setExpanded1] = React.useState(false);
  const [data, setData] = useState({});
  const [supplierName, setSupplierName] = useState("");
  const [showSubChargeCol, setShowSubChargeCol] = useState("");

  const handleChange = (panel) => (event, isExpanded) => {
    console.log(panel);
    if (panel === "panel0") {
      setExpanded(isExpanded ? panel : false);
    } else {
      setExpanded1(isExpanded ? panel : false);
    }
  };

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  useEffect(() => {
    if (referenceId) {
      getCommercialCostingServiceBreakdown(referenceId, setRowDto);
    }
  }, [referenceId]);

  const updateClickStatus = (id) => {
    const rowData = rowDto;
    let data = [];
    for (let i of rowData) {
      i.clicked = false;
      data.push(i);
    }
    const index = data.findIndex((data) => data.serviceBreakdownId === id);
    data[index].clicked = true;
    setRowDto(data);
  };

  // const singleData = {
  //   ...bill,
  //   dteTransactionDate: _dateFormatter(bill?.dteTransactionDate),
  // };

  return (
    <div className="viewModal">
      <Modal
        show={show}
        onHide={onHide}
        size="xl"
        aria-labelledby="example-modal-sizes-title-xl"
      >
        <>
          {" "}
          <Modal.Header className="bg-custom d-flex justify-content-between">
            <h3
              style={{ fontSize: "12px", color: "#000000", marginLeft: "22px" }}
            >
              <span style={{ fontWeight: "bold" }}>Transport Payment - </span>{" "}
              &nbsp; [<span style={{ fontWeight: "bold" }}>PO No: </span>{" "}
              {poNumber} &nbsp; &nbsp;
              <span style={{ fontWeight: "bold" }}>LC No:</span> {lcNumber}{" "}
              &nbsp; &nbsp;
              <span style={{ fontWeight: "bold" }}>Shipment No:</span>{" "}
              {shipmentNo}]
            </h3>
            {/* <button 
              className="btn btn-primary mr-6"
              style={{padding: "5px 10px", marginBottom: "5px"}}
              onClick={() =>{
                
              }}
            >
              Close
            </button> */}
          </Modal.Header>
          <Modal.Body id="example-modal-sizes-title-xl">
            <Formik
              enableReinitialize={true}
              initialValues={initData}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                // saveHandler(values, () => {
                //   resetForm(initData);
                //   setRowData([]);
                // });
              }}
            >
              {({
                handleSubmit,
                resetForm,
                values,
                errors,
                touched,
                setFieldValue,
                isValid,
              }) => (
                <Form className="form form-label-right">
                  <div className="react-bootstrap-table table-responsive mb-4">
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Supplier</th>
                          <th>Description</th>
                          {showSubChargeCol && <th>Sub Charge Type</th>}
                          <th>Amount</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowDto?.length > 0 &&
                          rowDto?.map((item, index) => {
                            setShowSubChargeCol(item?.subChargeTypeName);
                            return (
                              <tr key={index}>
                                <td
                                  style={{ width: "30px" }}
                                  className="text-center"
                                >
                                  {index + 1}
                                </td>
                                <td>
                                  <span className="pl-2">
                                    {item?.supplierName}
                                  </span>
                                </td>
                                <td>
                                  <span className="pl-2">
                                    {item?.description}
                                  </span>
                                </td>
                                {showSubChargeCol && (
                                  <td>
                                    <span className="pl-2">
                                      {item?.subChargeTypeName}
                                    </span>
                                  </td>
                                )}
                                <td>
                                  <span className="pl-2">
                                    {item?.numContractedAmount}
                                  </span>
                                </td>
                                <td
                                  style={{ width: "60px" }}
                                  className="text-center"
                                >
                                  <button
                                    className={
                                      item?.clicked
                                        ? "btn btn-outline-dark mr-1 pointer clicked-row-button"
                                        : "btn btn-outline-dark mr-1 pointer"
                                    }
                                    style={{
                                      padding: "1px 5px",
                                      fontSize: "11px",
                                    }}
                                    onClick={() => {
                                      setExpanded("panel0");
                                      setExpanded1("panel1");
                                      setSupplierName(item?.supplierName);
                                      updateClickStatus(
                                        item?.serviceBreakdownId
                                      );
                                      setData(item);
                                      getCommercialBreakdownForAdvanceAndBill(
                                        referenceId,
                                        item?.supplierId,
                                        setAdvanceBill,
                                        setBill
                                      );
                                    }}
                                  >
                                    View
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                  <div className="mb-4">
                    <ExpansionPanel
                      className="general-ledger-collapse-custom"
                      expanded={expanded === "panel0"}
                      onChange={handleChange("panel0")}
                    >
                      <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel10bh-content"
                        id="panel7bh-header"
                      >
                        <Typography className={classes.heading}>
                          Add Advance
                        </Typography>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                        <AddAdvance
                          bill={bill}
                          advanceBill={advanceBill}
                          setAdvanceBill={setAdvanceBill}
                          accountId={profileData?.accountId}
                          bussinessUnitId={selectedBusinessUnit?.value}
                          data={data}
                          supplierName={supplierName}
                          setSupplierName={setSupplierName}
                          setExpanded={setExpanded}
                          state={state}
                        />
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel
                      className="general-ledger-collapse-custom"
                      expanded={expanded1 === "panel1"}
                      onChange={handleChange("panel1")}
                    >
                      <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel10bh-content"
                        id="panel7bh-header"
                      >
                        <Typography className={classes.heading}>
                          Add Bill
                        </Typography>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                        <AddBill
                          bill={bill}
                          setBill={setBill}
                          accountId={profileData?.accountId}
                          bussinessUnitId={selectedBusinessUnit?.value}
                          data={data}
                          poNumber={poNumber}
                          supplierName={supplierName}
                          state={state}
                          referenceId={referenceId}
                          supplierId={data?.supplierId}
                          setAdvanceBill={setAdvanceBill}
                        />
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                  </div>
                </Form>
              )}
            </Formik>
          </Modal.Body>
          <Modal.Footer>
            <div>
              <button
                type="button"
                onClick={() => {
                  onHide();
                  setData({});
                  setBill([]);
                  setAdvanceBill([]);
                }}
                className="btn btn-light btn-elevate"
              >
                Close
              </button>
            </div>
          </Modal.Footer>
        </>
      </Modal>
    </div>
  );
};

export default ServiceBreakDownViewModal;
