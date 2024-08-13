import React from "react";
import NewSelect from "../../../../_helper/_select";
import YearMonthForm from "../../../../_helper/commonInputFieldsGroups/yearMonthForm";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import InputField from "../../../../_helper/_inputField";
import TextArea from "../../../../_helper/TextArea";
import IButton from "../../../../_helper/iButton";
import AttachFile from "../../../../_helper/commonInputFieldsGroups/attachemntUpload";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";

export default function CommissionReportAndJVForm({ obj }) {
  const {
    open,
    idSet1,
    allIds,
    sbuDDL,
    values,
    getData,
    rowData,
    setOpen,
    setRowData,
    dateSetter,
    isDisabled,
    reportTypes,
    setFieldValue,
    transactionHeads,
    setUploadedImage,
  } = obj;
  return (
    <>
      <form className="form form-label-right">
        <div className="global-form">
          <div className="row">
            <div className="col-md-3">
              <NewSelect
                name="reportType"
                options={[
                  { value: 1, label: "Pending" },
                  { value: 2, label: "JV Created" },
                ]}
                value={values?.reportType}
                label="Report Type"
                onChange={(valueOption) => {
                  setFieldValue("reportType", valueOption);
                  setFieldValue("type", "");
                  setRowData([]);
                  setFieldValue("month", "");
                  setFieldValue("year", "");
                }}
                placeholder="Select Report Type"
              />
            </div>
            <div className="col-md-3">
              <NewSelect
                name="type"
                options={reportTypes?.data}
                value={values?.type}
                label="Report Name"
                onChange={(valueOption) => {
                  setFieldValue("type", valueOption);
                  setRowData([]);
                  setFieldValue("month", "");
                  setFieldValue("year", "");
                  console.log({ valueOption });
                }}
                placeholder="Select Report Name"
              />
            </div>
            {values?.reportType?.value === 2 && (
              <>
                <YearMonthForm
                  obj={{
                    values,
                    setFieldValue,
                    onChange: (allValues) => {},
                  }}
                />
                <div className="col-md-3">
                  <NewSelect
                    name="status"
                    options={[
                      { value: true, label: "Non-Reversed" },
                      { value: false, label: "Reversed" },
                    ]}
                    value={values?.status}
                    label="Status"
                    onChange={(valueOption) => {
                      setFieldValue("status", valueOption);
                      setRowData([]);
                    }}
                    placeholder="Select Status"
                  />
                </div>
                <IButton
                  onClick={() => {
                    getData(values);
                  }}
                  disabled={
                    !values?.reportType ||
                    !values?.type ||
                    !values?.year ||
                    !values?.month ||
                    !values?.status
                  }
                />
              </>
            )}
            {values?.reportType?.value === 1 && (
              <>
                {[1, 3, 6, 7].includes(values?.type?.value) && (
                  <YearMonthForm
                    obj={{
                      values,
                      setFieldValue,
                      onChange: (allValues) => {
                        if (
                          values?.type?.value === 3 &&
                          allValues?.month &&
                          allValues?.year
                        ) {
                          dateSetter(allValues, setFieldValue);
                        }
                      },
                    }}
                  />
                )}

                {[5, 3, 6, 7, ...allIds].includes(values?.type?.value) && (
                  <>
                    <RATForm
                      obj={{
                        setFieldValue,
                        values,
                        region: !idSet1.includes(values?.type?.value),
                        area: !idSet1.includes(values?.type?.value),
                        territory: false,
                      }}
                    />
                    <FromDateToDateForm
                      obj={{
                        values,
                        setFieldValue,
                        disabled: [3].includes(values?.type?.value),
                      }}
                    />
                    {[5, 3].includes(values?.type?.value) && (
                      <div className="col-lg-3">
                        <InputField
                          name="commissionRate"
                          label={`${
                            values?.type?.value === 5 ? "Trade" : "Cash"
                          } Commission Rate`}
                          placeholder={`${
                            values?.type?.value === 5 ? "Trade" : "Cash"
                          } Commission Rate`}
                          value={values?.commissionRate}
                        />
                      </div>
                    )}
                    {rowData?.length > 0 && values?.type?.value !== 6 && (
                      <>
                        <div className="col-md-3">
                          <NewSelect
                            name="sbu"
                            options={sbuDDL || []}
                            value={values?.sbu}
                            label="SBU"
                            onChange={(valueOption) => {
                              setFieldValue("sbu", valueOption);
                            }}
                            placeholder="Select SBU"
                          />
                        </div>
                        {!idSet1.includes(values?.type?.value) && (
                          <div className="col-md-3">
                            <NewSelect
                              name="transactionHead"
                              options={transactionHeads?.data || []}
                              value={values?.transactionHead}
                              label="Transaction Head"
                              onChange={(valueOption) => {
                                setFieldValue("transactionHead", valueOption);
                              }}
                              placeholder="Select Transaction Head"
                            />
                          </div>
                        )}

                        <div className="col-lg-3">
                          <label>Narration</label>
                          <TextArea
                            name="narration"
                            placeholder="Narration"
                            value={values?.narration}
                            type="text"
                          />
                        </div>
                        <IButton
                          colSize={"col-lg-3"}
                          onClick={() => setOpen(true)}
                        >
                          Attach File
                        </IButton>
                        <AttachFile
                          obj={{
                            open,
                            setOpen,
                            setUploadedImage,
                          }}
                        />
                      </>
                    )}
                  </>
                )}
                {[24].includes(values?.type?.value) && <></>}
                <IButton
                  onClick={() => {
                    getData(values);
                  }}
                  disabled={isDisabled(values)}
                />
              </>
            )}

            <div className="col-12"></div>
            {values?.reportType?.value === 1 && (
              <>
                <div className="col-lg-4 mt-5">
                  <h6>
                    Selected party count:{" "}
                    {_fixedPoint(
                      rowData?.filter((item) => item?.isSelected)?.length,
                      true,
                      0
                    )}
                  </h6>
                </div>
                <div className="col-lg-4 mt-5">
                  <h6>
                    Total Delivery Qty (selected party):{" "}
                    {_fixedPoint(
                      rowData
                        ?.filter((item) => item?.isSelected)
                        ?.reduce((acc, cur) => acc + cur?.deliveryQty, 0),
                      true
                    )}
                  </h6>
                </div>
                <div className="col-lg-4 mt-5">
                  <h6>
                    Total Commission (selected party):{" "}
                    {_fixedPoint(
                      rowData
                        ?.filter((item) => item?.isSelected)
                        ?.reduce((acc, cur) => acc + cur?.commissiontaka, 0),
                      true
                    )}
                  </h6>
                </div>
              </>
            )}
          </div>
        </div>
      </form>
    </>
  );
}
