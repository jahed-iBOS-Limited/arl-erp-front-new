import { Form, Formik } from "formik";
import React, { useState } from "react";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _formatMoney } from "../../../_helper/_formatMoney";
import IViewModal from "../../../_helper/_viewModal";
import IncentiveBillPaymentModal from "./incentiveBillPaymentModal";
const initData = {
  year: "",
};

export default function IncentiveBillPaymentLanding() {
  const { selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const saveHandler = (values, cb) => {};
  const [
    tableData,
    getTableData,
    tableDataLoader,
    setTableData,
  ] = useAxiosGet();
  const [openModal, setOpenModal] = useState(false);

  const getMonthNameFromMonthId = (monthId) => {
    switch (monthId) {
      case 1:
        return "January";
      case 2:
        return "February";
      case 3:
        return "March";
      case 4:
        return "April";

      case 5:
        return "May";

      case 6:
        return "June";

      case 7:
        return "July";

      case 8:
        return "August";

      case 9:
        return "September";

      case 10:
        return "October";

      case 11:
        return "November";

      case 12:
        return "December";

      default:
        return "";
    }
  };

  const getData = (year) => {
    getTableData(
      `/fino/Advice/GetMonthlyIncentiveList?BusinessUnit=${selectedBusinessUnit?.value}&yearId=${year}`,
      (data) => {
        const newData = data?.map((itm) => ({
          ...itm,
          isChecked: false,
        }));
        setTableData(newData);
      }
    );
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {tableDataLoader && <Loading />}
          <IForm
            title="Incentive Bill Payment"
            isHiddenReset
            isHiddenBack
            isHiddenSave
          >
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="year"
                    options={[
                      {
                        value: 2023,
                        label: 2023,
                      },
                      {
                        value: 2024,
                        label: 2024,
                      },
                      {
                        value: 2025,
                        label: 2025,
                      },
                      {
                        value: 2026,
                        label: 2026,
                      },
                    ]}
                    value={values?.year}
                    label="Year"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("year", valueOption);
                        getData(valueOption?.value);
                      } else {
                        setFieldValue("year", "");
                      }
                    }}
                    errors={errors}
                    touched={touched}
                    isClearable={false}
                  />
                </div>
              </div>

              <div className="row mt-1">
                <div className="col-lg-12 text-right">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setOpenModal(true);
                    }}
                    disabled={
                      !tableData?.length ||
                      !tableData?.some((itm) => itm?.isChecked)
                    }
                  >
                    Bank Payment
                  </button>
                </div>
              </div>

              <div className="mt-1">
              <div className="table-responsive">
              <table className="table table-striped table-bordered bj-table bj-table-landing">
                  {tableData?.length ? (
                    <thead>
                      <tr>
                        <th>
                          <input
                            type="checkbox"
                            checked={
                              tableData?.length > 0 &&
                              tableData?.every((item) => item?.isChecked)
                            }
                            onChange={(e) => {
                              const modifyData = tableData?.map((itm) => ({
                                ...itm,
                                isChecked: e.target.checked,
                              }));
                              setTableData(modifyData);
                            }}
                          />
                        </th>
                        <th>SL</th>
                        <th>Incentive Journal Code</th>
                        <th>Journal Amount</th>
                        <th>Voucher Code</th>
                        <th>Month</th>
                        <th>Year</th>
                        <th>Create Date</th>
                      </tr>
                    </thead>
                  ) : null}
                  <tbody>
                    {tableData?.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="checkbox"
                            checked={item?.isChecked}
                            onChange={(e) => {
                              const modifyData = tableData?.map((itm) => {
                                if (
                                  item?.strIncentiveJournalCode ===
                                  itm?.strIncentiveJournalCode
                                ) {
                                  return {
                                    ...itm,
                                    isChecked: e.target.checked,
                                  };
                                } else {
                                  return {
                                    ...itm,
                                  };
                                }
                              });
                              setTableData(modifyData);
                            }}
                          />
                        </td>
                        <td>{index + 1}</td>
                        <td>{item?.strIncentiveJournalCode}</td>
                        <td className="text-right">
                          {_formatMoney(item?.numJournalAmount)}
                        </td>
                        <td>{item?.strVoucherCode}</td>
                        <td>{getMonthNameFromMonthId(item?.intMonthId)}</td>
                        <td>{item?.intYearId}</td>
                        <td className="text-center">
                          {_dateFormatter(item?.dteCreateDate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
      </div>
              </div>

              <IViewModal
                show={openModal}
                onHide={() => {
                  setOpenModal(false);
                }}
                title="Incentive Bill Payment"
              >
                <IncentiveBillPaymentModal
                  landingtableData={tableData}
                  landingValues={values}
                  getData={getData}
                  setOpenModal={setOpenModal}
                />
              </IViewModal>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
