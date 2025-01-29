import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ICard from "../../../../_helper/_card";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { getChannelWiseSalesReportLandingData } from "../helper";

const initData = {
  sbu: "",
};

export default function BalanceInfoReportLanding() {
  const printRef = useRef();

  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getChannelWiseSalesReportLandingData(setLoading, setRowDto);
  }, []);

  const grandTotal = () => {
    let SLamount = 0;
    let ledgerAmount = 0;
    let DiffAmt = 0;

    for (let i = 0; i < rowDto.length; i++) {
      let item = rowDto[i];
      SLamount = SLamount + item?.SLamount || 0;
      ledgerAmount = ledgerAmount + item?.ledgerAmount || 0;
      DiffAmt = DiffAmt + item?.DiffAmt || 0;
    }

    return {
      SLamount,
      ledgerAmount,
      DiffAmt,
    };
  };

  return (
    <Formik>
      <>
        <ICard
          printTitle="Print"
          title="Balance Info"
          isPrint={true}
          isShowPrintBtn={true}
          componentRef={printRef}
          isExcelBtn={true}
          excelFileNameWillbe={"Balance Info"}
          pageStyle="@page { size: 10in 15in !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }"
        >
          <div>
            <div className="mx-auto">
              <Formik
                enableReinitialize={true}
                initialValues={{
                  ...initData,
                  sbu: {
                    value: selectedBusinessUnit?.value,
                    label: selectedBusinessUnit.label,
                  },
                }}
                // validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  // viewHandler(values, setRowDto);
                }}
              >
                {({ values, errors, touched, setFieldValue }) => (
                  <>
                    {loading && <Loading />}
                    <Form className="form form-label-right">
                      <div className="form-group row global-form printSectionNone">
                        <div className="col-lg-3">
                          <NewSelect
                            name="sbu"
                            options={[]}
                            value={values?.sbu}
                            // label="SBU"
                            onChange={(valueOption) => {
                              setFieldValue("sbu", valueOption);
                              setRowDto([]);
                            }}
                            // placeholder="SBU"
                            errors={errors}
                            touched={touched}
                            isDisabled={true}
                          />
                        </div>
                      </div>
                    </Form>

                    {rowDto?.length > 0 ? (
                      <div className="mt-4">
                        <div className="react-bootstrap-table table-responsive pendingDeliveryReport">
                          <div className="sta-scrollable-table scroll-table-auto">
                            <div
                              style={{ maxHeight: "500px" }}
                              className="scroll-table _table scroll-table-auto"
                            >
                              <table
                                id="table-to-xlsx"
                                ref={printRef}
                                className="table table-striped table-bordered global-table table-font-size-sm"
                              >
                                <thead>
                                  <th>SL</th>
                                  <th>Partner Id</th>
                                  <th>SL Amount</th>
                                  <th>Ledger Amount</th>
                                  <th>Difference Amount</th>
                                </thead>
                                <tbody>
                                  {rowDto?.map((item, i) => {
                                    return (
                                      <tr key={i}>
                                        <td
                                          style={{ width: "30px" }}
                                          className="text-center"
                                        >
                                          {i + 1}
                                        </td>

                                        <td
                                          style={{ width: "90px" }}
                                          className="text-center"
                                        >
                                          {item?.partnerid || ""}
                                        </td>
                                        <td className="text-right">
                                          {item?.SLamount || 0}
                                        </td>
                                        <td className="text-right">
                                          {item?.ledgerAmount || 0}
                                        </td>
                                        <td className="text-right">
                                          {item?.DiffAmt || 0}
                                        </td>
                                      </tr>
                                    );
                                  })}

                                  <tr>
                                    <td></td>

                                    <td className="text-right font-weight-bold">
                                      Grand Total
                                    </td>
                                    <td className="text-right font-weight-bold">
                                      {grandTotal()?.SLamount?.toFixed(2) || 0}
                                    </td>
                                    <td className="text-right font-weight-bold">
                                      {grandTotal()?.ledgerAmount?.toFixed(2) ||
                                        0}
                                    </td>
                                    <td className="text-right font-weight-bold">
                                      {grandTotal()?.DiffAmt?.toFixed(2) || 0}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </>
                )}
              </Formik>
            </div>
          </div>
        </ICard>
      </>
    </Formik>
  );
}
