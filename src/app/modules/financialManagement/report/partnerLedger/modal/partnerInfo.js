import React, { useState, useRef, useEffect } from "react";
import ReactToPrint from "react-to-print";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import Loading from "../../../../_helper/_loading";
import { shallowEqual, useSelector } from "react-redux";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import { getPartnerBooks } from "../helper";
import { CreatePartnerLedgerExcel } from "./excel/excel";
import {
  InputLabel,
  FormControl,
  makeStyles,
  MenuItem,
  Select,
} from "@material-ui/core";



const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const html2pdf = require("html2pdf.js");

const PartnerInfo = ({ values, tableItem }) => {
  const [rowDto, setRowDto] = useState([{ id: 3 }]);
  const [loading, setLoading] = useState(false);
  const [exportType, setExportType] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const classes = useStyles();
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  const pdfExport = (fileName) => {
    var element = document.getElementById("pdf-section");
    var opt = {
      margin: 20,
      filename: `${fileName}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 5, dpi: 300, letterRendering: true },
      jsPDF: { unit: "px", hotfixes: ["px_scaling"], orientation: "landscape" },
    };
    html2pdf()
      .set(opt)
      .from(element)
      .save();
  };
  const printRef = useRef();

  useEffect(() => {
    getPartnerBooks(
      selectedBusinessUnit?.value,
      tableItem?.intPartnerId,
      2,
      values?.fromDate,
      values?.toDate,
      setLoading,
      setRowDto
    );
  }, [profileData, selectedBusinessUnit, values, tableItem]);

  const handleChange = (event) => {
    setExportType(event.target.value);
    switch (event.target.value) {
      case 1:
        pdfExport("Partner Ledger");
        break;
      case 2:
        CreatePartnerLedgerExcel({ selectedBusinessUnit, tableItem, values, rowDto });
        break;

      default:
        break;
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <Card>
        {true && <ModalProgressBar />}
        <CardHeader title="Ledger Details">
          <CardHeaderToolbar>
            <div>
              <FormControl className={classes.formControl}>
                <InputLabel
                  id="demo-controlled-open-select-label"
                  style={{ fontSize: "15px", fontWeight: "bold" }}
                >
                  Export
                </InputLabel>
                <Select
                  labelId="demo-controlled-open-select-label"
                  id="demo-controlled-open-select"
                  open={open}
                  onClose={handleClose}
                  onOpen={handleOpen}
                  value={exportType}
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={1}>Export PDF</MenuItem>
                  <MenuItem value={2}>Export Excel</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="d-flex">
              <ReactToPrint
                pageStyle={
                  "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
                }
                trigger={() => (
                  <button
                    type="button"
                    className="btn btn-primary ml-2"
                    style={{ marginTop: "18px" }}
                  >
                    <i class="fa fa-print pointer" aria-hidden="true"></i>
                    Print
                  </button>
                )}
                content={() => printRef.current}
              />
            </div>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          {loading && <Loading />}

          {rowDto?.length > 0 && (
            <div id="pdf-section" componentRef={printRef} ref={printRef}>
              <div className="text-center">
                <h2>{selectedBusinessUnit?.label.toUpperCase()}</h2>
                <h6
                  style={{
                    borderBottom: "2px solid #ccc",
                    paddingBottom: "10px",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  {selectedBusinessUnit?.address}
                </h6>

                <h3 className="m-0">Partner Ledger</h3>
                <p className="m-0">
                  <strong className="mr-5">{tableItem?.strPartnerName}</strong>
                </p>
                <div className="row justify-content-center">
                  <strong className="mr-5">From: {values?.fromDate}</strong>
                  <strong>To: {values?.toDate}</strong>
                </div>
              </div>

              <div className="react-bootstrap-table table-responsive">
                <table className="table table-striped table-bordered global-table">
                  <thead>
                    <tr>
                      <th style={{ width: "30px" }}> SL </th>
                      <th style={{ width: "60px" }}> Date </th>
                      <th style={{ width: "100px" }}> Code </th>
                      {/* <th style={{ width: "62px" }}> Account Name </th> */}
                      <th style={{ width: "250px" }}> Description </th>
                      <th style={{ width: "80px" }}> Debit </th>
                      <th style={{ width: "80px" }}> Credit </th>
                      <th style={{ width: "80px" }}> Balance </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowDto?.map((item, index) => (
                      <tr key={index}>
                        <td className="text-center">{index + 1}</td>
                        <td>{_dateFormatter(item?.strBankJournalDate)}</td>
                        <td>{item?.strGeneralLedgerCode}</td>
                        {/* <td>{item?.strGeneralLedgerName}</td> */}
                        <td>{item?.strNarration}</td>
                        <td className="text-right">
                          {_formatMoney(Math.abs(item?.numDebit)?.toFixed(2))}
                        </td>
                        <td className="text-right">
                          {_formatMoney(Math.abs(item?.numCredit)?.toFixed())}
                        </td>
                        <td className="text-right">
                          {_formatMoney(Number(item?.numBalance)?.toFixed(2))}
                        </td>
                      </tr>
                    ))}
                    <tr style={{ fontWeight: "bold" }}>
                      <td className="text-right" colSpan="4">
                        Total
                      </td>
                      <td className="text-right">
                        {_formatMoney(
                          Math.abs(
                            rowDto?.reduce((a, b) => a + Number(b?.numDebit), 0)
                          )?.toFixed(2)
                        )}
                      </td>
                      <td className="text-right">
                        {_formatMoney(
                          Math.abs(
                            rowDto?.reduce(
                              (a, b) => a + Number(b?.numCredit),
                              0
                            )
                          )?.toFixed(2)
                        )}
                      </td>
                      <td className="text-right">
                        {_formatMoney(
                          (
                            Math.abs(
                              rowDto?.reduce(
                                (a, b) => a + Number(b?.numDebit),
                                0
                              )
                            ) -
                            Math.abs(
                              rowDto?.reduce(
                                (a, b) => a + Number(b?.numCredit),
                                0
                              )
                            )
                          )?.toFixed(2)
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default PartnerInfo;
