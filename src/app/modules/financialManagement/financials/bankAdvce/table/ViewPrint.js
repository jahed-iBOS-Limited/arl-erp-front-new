import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import { APIUrl } from "../../../../../App";
import { moneyInWord } from "../../../../_helper/_convertMoneyToWord";
import printIcon from "../../../../_helper/images/print-icon.png";
import { advicePrintCount } from "../helper";
import FormatOne from "../pdf/format-01";
import FormatTwo from "../pdf/format-02";
import FormatThree from "../pdf/format-03";
import { FormatFour } from "../pdf/format-04";
import { FormatFive } from "../pdf/format-05";
import { FormatSix } from "../pdf/format-06";
import { FormatSeven } from "../pdf/format-07";
import { generateExcel } from "./excelReportGenarate";
import { getPdfFormatNumber } from "./pdfFormatNumber";
import { FormatEight } from "../pdf/format-08";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { IconButton, makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(0.1),
    backgroundColor: 'lightblue',
    '&:hover': {
      backgroundColor: 'blue',
    },
    padding: '1px',
  },
  increaseButton: {
    backgroundColor: 'lightgreen',
    '&:hover': {
      backgroundColor: 'green',
    },
    margin: theme.spacing(0.1),
    padding: '1px'
  },
  icon: {
    fontSize: '10px',
  },
}));
const ViewData = ({ adviceReportData, values }) => {
  const classes = useStyles();
  const [fontSize, setFontSize] = useState(9);
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const printRef = useRef();
  const [total, setTotal] = useState(0);
  const [totalInWords, setTotalInWords] = useState(0);

  useEffect(() => {
    if (adviceReportData.length > 0) {
      setTotal(
        Number(
          adviceReportData
            ?.reduce((acc, item) => acc + item?.numAmount, 0)
            .toFixed(2)
        )
      );
    }
  }, [adviceReportData]);

  useEffect(() => {
    if (total) {
      moneyInWord(total, setTotalInWords);
    }
  }, [total]);

  const adviceName =
    values?.advice?.label === "IBBL"
      ? "IBBL_ONLINE"
      : values?.advice?.label === "IBBL-BEFTN"
      ? "IBBL_BEFTN"
      : values?.advice?.label;
  const dateFormat = values?.dateTime?.split("/").join("_");
  const fileName = `${selectedBusinessUnit?.buShortName}_${
    total ? total : 0
  }_${adviceName}_${dateFormat}`;

  return (
    <>
      <div className="d-flex justify-content-end align-items-end">
        <div className="d-flex flex-column" style={{ width: "60px" }}>
          <label>Font Size: </label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <IconButton
              onClick={() => {
                if (fontSize > 8) {
                  setFontSize(fontSize - 1);
                }
              }}
              aria-label="decrease"
              className={classes.button}
            >
              <RemoveIcon className={classes.icon}/>
            </IconButton>
            <span>{fontSize}</span>
            <IconButton
              onClick={() => {
                if (fontSize < 15) {
                  setFontSize(fontSize + 1);
                }
              }}
              aria-label="increase"
              className={classes.increaseButton}
            >
              <AddIcon className={classes.icon}/>
            </IconButton>
          </div>
          {/* <input
            value={fontSize}
            onChange={(e) => {
              if (+e?.target?.value >= 8 && +e?.target?.value <= 15) {
                setFontSize(+e?.target?.value);
              }
            }}
            type="number"
          /> */}
        </div>
        <button
          style={{ height: "30px" }}
          className="btn btn-primary btn-sm m-0 mx-2 py-2 px-2"
          onClick={(e) => {
            if (values?.adviceType?.value === 15) {
              const adviceName =
                values?.advice?.label === "IBBL"
                  ? "IBBL_ONLINE"
                  : values?.advice?.label === "IBBL-BEFTN"
                  ? "IBBL_BEFTN"
                  : values?.advice?.label;
              const dateFormat = values?.dateTime?.split("/").join("_");
              const fileName = `${selectedBusinessUnit?.buShortName}_${
                total ? total : 0
              }_${adviceName}_${dateFormat}`;
              generateExcel(
                adviceReportData,
                values,
                0,
                "",
                selectedBusinessUnit,
                false,
                null,
                fileName
              );
            } else {
              generateExcel(
                adviceReportData,
                values,
                0,
                "",
                selectedBusinessUnit,
                false,
                null,
                fileName
              );
            }
          }}
        >
          Export Excel
        </button>
        <ReactToPrint
          pageStyle={`@media print{body { -webkit-print-color-adjust: exact;}@page {size: ${
            values?.advice?.label === "IBBL" ||
            values?.advice?.label === "JAMUNA-BEFTN" ||
            values?.advice?.label === "RTGS"
              ? "portrait !important"
              : values?.advice?.label === "IBBL-BEFTN"
              ? "landscape !important"
              : "landscape !important"
          };margin:${
            values?.advice?.label === "RTGS"
              ? "0 !important"
              : ["IBBL", "JAMUNA-BEFTN"].includes(values?.advice?.label)
              ? "144px 0 !important"
              : 0
          } }}`}
          trigger={() => (
            <button
              className="btn btn-primary btn-sm d-flex align-items-center "
              style={{ height: "30px" }}
            >
              <img
                style={{ width: "25px", paddingRight: "5px", height: "" }}
                src={printIcon}
                alt="print-icon"
              />
              Print
            </button>
          )}
          content={() => printRef.current}
          onBeforePrint={() => {
            advicePrintCount(
              adviceReportData?.map((item) => {
                return {
                  journalId: item?.intJournalId,
                  actionBy: profileData?.userId,
                };
              })
            );
          }}
        />
      </div>

      <div
        id="bank-advice-pdf-section"
        ref={printRef}
        unselectable="on"
        className="noselect"
      >
        {adviceReportData?.length > 0 && (
          <div className="row" unselectable="on">
            {/* {console.log("t",values?.adviceType?.value, values?.advice?.value)} */}
            <div className="col-lg-12 my-3">
              <>
                <div
                  className="advice-table-wrapper"
                  ref={printRef}
                  style={{ margin: "0 60px" }}
                >
                  {getPdfFormatNumber(
                    values?.adviceType?.value,
                    values?.advice?.value
                  ) === 1 && (
                    <FormatOne
                      fontSize={fontSize}
                      APIUrl={APIUrl}
                      selectedBusinessUnit={selectedBusinessUnit}
                      values={values}
                      adviceReportData={adviceReportData}
                      total={total}
                      totalInWords={totalInWords}
                    />
                  )}
                  {getPdfFormatNumber(
                    values?.adviceType?.value,
                    values?.advice?.value
                  ) === 2 && (
                    <FormatTwo
                      fontSize={fontSize}
                      APIUrl={APIUrl}
                      selectedBusinessUnit={selectedBusinessUnit}
                      values={values}
                      adviceReportData={adviceReportData}
                      total={total}
                      totalInWords={totalInWords}
                    />
                  )}
                  {getPdfFormatNumber(
                    values?.adviceType?.value,
                    values?.advice?.value
                  ) === 3 && (
                    <FormatThree
                      fontSize={fontSize}
                      APIUrl={APIUrl}
                      selectedBusinessUnit={selectedBusinessUnit}
                      values={values}
                      adviceReportData={adviceReportData}
                      total={total}
                      totalInWords={totalInWords}
                    />
                  )}
                  {getPdfFormatNumber(
                    values?.adviceType?.value,
                    values?.advice?.value
                  ) === 4 && (
                    <FormatFour
                      fontSize={fontSize}
                      APIUrl={APIUrl}
                      selectedBusinessUnit={selectedBusinessUnit}
                      values={values}
                      adviceReportData={adviceReportData}
                      total={total}
                      totalInWords={totalInWords}
                    />
                  )}
                  {getPdfFormatNumber(
                    values?.adviceType?.value,
                    values?.advice?.value
                  ) === 5 && (
                    <FormatFive
                      fontSize={fontSize}
                      APIUrl={APIUrl}
                      selectedBusinessUnit={selectedBusinessUnit}
                      values={values}
                      adviceReportData={adviceReportData}
                      total={total}
                      totalInWords={totalInWords}
                    />
                  )}
                  {getPdfFormatNumber(
                    values?.adviceType?.value,
                    values?.advice?.value
                  ) === 6 && (
                    <FormatSix
                      fontSize={fontSize}
                      APIUrl={APIUrl}
                      selectedBusinessUnit={selectedBusinessUnit}
                      values={values}
                      adviceReportData={adviceReportData}
                      total={total}
                      totalInWords={totalInWords}
                    />
                  )}
                  {getPdfFormatNumber(
                    values?.adviceType?.value,
                    values?.advice?.value
                  ) === 7 && (
                    <FormatSeven
                      fontSize={fontSize}
                      APIUrl={APIUrl}
                      selectedBusinessUnit={selectedBusinessUnit}
                      values={values}
                      adviceReportData={adviceReportData}
                      total={total}
                      totalInWords={totalInWords}
                    />
                  )}
                  {values?.advice?.label === "RTGS" && (
                    <FormatEight
                      fontSize={fontSize + 3}
                      APIUrl={APIUrl}
                      selectedBusinessUnit={selectedBusinessUnit}
                      values={values}
                      adviceReportData={adviceReportData}
                      total={total}
                      totalInWords={totalInWords}
                    />
                  )}
                  {values?.advice?.label === "JAMUNA-RTGS" && (
                    <FormatFour
                      fontSize={fontSize}
                      APIUrl={APIUrl}
                      selectedBusinessUnit={selectedBusinessUnit}
                      values={values}
                      adviceReportData={adviceReportData}
                      total={total}
                      totalInWords={totalInWords}
                      isJamunaRtgs
                    />
                  )}
                </div>
              </>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ViewData;
