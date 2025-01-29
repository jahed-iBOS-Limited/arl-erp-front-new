import { Formik, Form } from "formik";
import React, { useState, useRef } from "react";
import axios from "axios";
import { _todayDate } from "../../../_helper/_todayDate";
import { useSelector } from "react-redux";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
} from "../../../../../_metronic/_partials/controls";
import ICustomTable from "../../../_helper/_customTable";
import Loading from "../../../_helper/_loading";
import { getEmployeeSubLedgerData } from "../helper";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import InputField from "../../../_helper/_inputField";
import { _dateFormatter } from "../../../_helper/_dateFormate";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  wareHouse: "",
};

export default function EmployeeSubledgerReport() {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const headers = [
    "SL",
    "Description",
    "Code",
    "Date",
    "Debit",
    "Credit",
    "Balance"
  ];
  const printRef = useRef();
  const getGridData = (values) => {
    getEmployeeSubLedgerData(values?.customer?.value, values?.fromDate, values?.toDate, setGridData, setLoading);
  };
  const { profileData, selectedBusinessUnit } = useSelector(state => state?.authData)
  const loadCustomerList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/partner/Pos/GetCustomerNameDDL?SearchTerm=${v}&AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&WarehouseId=${122}`
      )
      .then((res) => res?.data);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => { }}
      >
        {({ setFieldValue, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Employe Sub Ledger Report"}></CardHeader>
              <CardBody>
                {loading && <Loading />}
                <Form className="form form-label-right incomestatementTable">
                  <div className="row global-form incomestatementTablePrint">
                    <div className="col-lg-3">
                      <label>Customer</label>
                      <SearchAsyncSelect
                        selectedValue={values?.customer}
                        name="customer"
                        handleChange={(valueOption) => {
                          setFieldValue("customer", valueOption);
                        }}
                        placeholder="Search..."
                        loadOptions={loadCustomerList}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>From Date</label>
                      <InputField
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From Date"
                        type="date"
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>To Date</label>
                      <InputField
                        value={values?.toDate}
                        name="toDate"
                        placeholder="To Date"
                        type="date"
                      />
                    </div>

                    <div className="col-lg-2">
                      <button
                        className="btn btn-primary mt-5"
                        type="button"
                        onClick={() => {
                          getGridData(values);
                        }}
                      >
                        View
                      </button>
                    </div>
                  </div>

                  <div ref={printRef}>
                    <ICustomTable ths={headers}>
                      {gridData?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>
                              <p className="text-center mb-0">{index + 1}</p>{" "}
                            </td>
                            <td>{item?.discribtion}</td>
                            <td>{item?.code}</td>
                            <td>{_dateFormatter(item?.dtedate)}</td>
                            <td className="text-right">{item?.mondebit}</td>
                            <td className="text-right">{item?.moncredit}</td>
                            <td className="text-right">{item?.balance}</td>
                          </tr>
                        );
                      })}
                    </ICustomTable>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
