import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "./../../../../_helper/_inputField";
import { useSelector } from "react-redux";
import GridData from "./grid";
import { shallowEqual } from "react-redux";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../../../_metronic/_partials/controls";
import PaginationTable from "../../../../_helper/_tablePagination";
import NewSelect from "./../../../../_helper/_select";
import {
  GetPaginationForShippointtransfer_api,
} from "../helper";
import { _todayDate } from "./../../../../_helper/_todayDate";

// Validation schema
const validationSchema = Yup.object().shape({});

const initData = {
  id: undefined,
  shippoint: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

export default function HeaderForm() {
  const [rowDto, setRowDto] = useState([]);
  const [loading] = useState(false);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const shipPointDDL = useSelector((state) => {
    return state?.commonDDL?.shippointDDL;
  }, shallowEqual);

  const setPositionHandler = (pageNo, pageSize, values) => {
    GetPaginationForShippointtransfer_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.shippoint?.value,
      values?.fromDate,
      values?.toDate,
      pageNo,
      pageSize,
      setRowDto
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Order Transfer"}>
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <NewSelect
                        name="shippoint"
                        options={shipPointDDL || []}
                        value={values?.shippoint}
                        label="Shippoint"
                        onChange={(valueOption) => {
                          setFieldValue("shippoint", valueOption);
                        }}
                        placeholder="Shippoint"
                        errors={errors}
                        touched={touched}
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
                      <label>Top Date</label>
                      <InputField
                        value={values?.toDate}
                        name="fromDate"
                        placeholder="Top Date"
                        type="date"
                      />
                    </div>
                    <div className="col-lg-3 mt-5">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          GetPaginationForShippointtransfer_api(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.shippoint?.value,
                            values?.fromDate,
                            values?.toDate,
                            pageNo,
                            pageSize,
                            setRowDto
                          );
                        }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                  <GridData rowDto={rowDto} loading={loading} />
                  {rowDto?.data?.length > 0 && (
                    <PaginationTable
                      count={rowDto?.totalCount}
                      setPositionHandler={setPositionHandler}
                      paginationState={{
                        pageNo,
                        setPageNo,
                        pageSize,
                        setPageSize,
                      }}
                      values={values}
                    />
                  )}
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
