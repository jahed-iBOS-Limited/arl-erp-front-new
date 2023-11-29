import { Form, Formik } from "formik";
import React, { useState } from "react";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import NewSelect from "../../../_helper/_select";
import InputField from "../../../_helper/_inputField";
import PaginationTable from "../../../_helper/_tablePagination";
import { shallowEqual, useSelector } from "react-redux";
import { _todayDate } from "../../../_helper/_todayDate";
const initData = {
  type: "",
  item: "",
  date: _todayDate(),
};
export default function PurchasePlanningAndScheduling() {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  const saveHandler = (values, cb) => {};
  const [
    tableData,
    getTableData,
    tableDataLoader,
    setTableData,
  ] = useAxiosGet();

  const getData = (pageNo, pageSize, values) => {
    const url =
      values?.type?.value === 1
        ? `/imp/ImportReport/PurchasePlanningAndSchedulingReport?partName=ItemWiseSchedulingReport&businessUnitId=${selectedBusinessUnit?.value}&asOnDate=${values?.date}&itemId=${values?.item?.value}&pageNo=${pageNo}&pageSize=${pageSize}`
        : `/imp/ImportReport/PurchasePlanningAndSchedulingReport?partName=PurchasePlanningNSchedulingReport&businessUnitId=${selectedBusinessUnit?.value}&asOnDate=${values?.date}&itemId=${values?.item?.value}&pageNo=${pageNo}&pageSize=${pageSize}`;

    getTableData(url, (data) => {
      setTableData(data);
      setPageNo(data?.pageNo);
      setPageSize(data?.pageSize);
    });
  };

  const setPositionHandler = (pageNo, pageSize, values) => {
    getData(pageNo, pageSize, values);
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
            title="Purchase Planning & Scheduling"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return <div></div>;
            }}
          >
            <Form>
              <div>
                <div className="form-group  global-form row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="type"
                      options={[
                        { value: 1, label: "Itemwise Scheduling" },
                        { value: 2, label: "Purchase Planning" },
                      ]}
                      value={values?.type}
                      label="Type"
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue("type", valueOption);
                          setTableData([]);
                        } else {
                          setFieldValue("type", "");
                          setTableData([]);
                        }
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="item"
                      options={[
                        { value: 1, label: "Item-1" },
                        { value: 2, label: "Item-2" },
                      ]}
                      value={values?.item}
                      label="Item"
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue("item", valueOption);
                          setTableData([]);
                        } else {
                          setFieldValue("item", "");
                          setTableData([]);
                        }
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.date}
                      label="Date"
                      name="date"
                      placeholder="Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("date", e.target.value);
                        setTableData([]);
                      }}
                    />
                  </div>
                  <button
                    style={{ marginTop: "18px" }}
                    className="btn btn-primary"
                    type="button"
                    disabled={!values?.item || !values?.date}
                    onClick={() => {
                      console.log("clicked");
                    }}
                  >
                    View
                  </button>
                </div>

                <PaginationTable
                  count={tableData?.totalCount}
                  setPositionHandler={setPositionHandler}
                  paginationState={{
                    pageNo,
                    setPageNo,
                    pageSize,
                    setPageSize,
                  }}
                  values={values}
                />
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
