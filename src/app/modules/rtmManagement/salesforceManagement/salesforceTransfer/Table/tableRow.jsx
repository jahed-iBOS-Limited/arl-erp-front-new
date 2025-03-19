import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form } from "react-bootstrap";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import { getEmployeeDDL, getSalesForceTransferLanding } from "../helper";
import NewSelect from "../../../../_helper/_select";

// Validation schema
const validationSchema = Yup.object().shape({
  employeeName: Yup.object().shape({
    label: Yup.string().required("Employee Name is required"),
    value: Yup.string().required("Employee Name is required"),
  }),
});

const initData = {
  employeeName: "",
};

export function TableRow({ saveHandler }) {
  // const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  //paginationState
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [employeeDDL, setEmployeeDDL] = useState([]);
  const [gridData, setGridData] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (profileData && selectedBusinessUnit) {
      getEmployeeDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setEmployeeDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getSalesForceTransferLanding(
      profileData.accountId,
      selectedBusinessUnit.value,
      setLoading,
      values?.employeeName?.value,
      pageNo,
      pageSize,
      setGridData
    );
  };

  return (
    <>
      {loading && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
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
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-12">
                  <div className="row bank-journal bank-journal-custom bj-left">
                    <>
                      <div className="col-lg-2 mb-2">
                        <NewSelect
                          name="employeeName"
                          options={employeeDDL}
                          value={values?.employeeName}
                          label="Employee Name"
                          onChange={(valueOption) => {
                            setFieldValue("employeeName", valueOption);
                          }}
                          placeholder="Employee Name"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-1 mt-3">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => {
                            getSalesForceTransferLanding(
                              profileData.accountId,
                              selectedBusinessUnit.value,
                              setLoading,
                              values?.employeeName?.value,
                              pageNo,
                              pageSize,
                              setGridData
                            );
                          }}
                        >
                          View
                        </button>
                      </div>
                    </>
                  </div>
                </div>
              </div>
            </Form>
            {/* Table Start */}
            {/* {loading && <Loading />} */}
            <div className="row cash_journal">
              <div className="col-lg-12 pr-0 pl-0">
                {gridData?.data?.length > 0 && (
                  <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                    <thead>
                      <tr>
                        <th style={{ width: "30px" }}>SL</th>
                        <th>Employee Name</th>
                        <th>Distribution Channel</th>
                        <th>Territory</th>
                        <th style={{ width: "90px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.data?.map((td, index) => (
                        <tr key={index}>
                          <td className="text-center">{td?.sl}</td>
                          <td>
                            <div className="pl-2">{td?.employeeName}</div>
                          </td>
                          <td>
                            <div className="pl-2">
                              {td?.distributionChannelId}
                            </div>
                          </td>
                          <td>
                            <div className="pl-2">{td?.territoryName}</div>
                          </td>
                          <td>
                            <div className="d-flex justify-content-around">
                              <button
                                className="btn btn-primary"
                                onClick={() => {
                                  history.push({
                                      pathname: `/rtm-management/salesforceManagement/salesforceTransfer/transfer/${td?.employeeId}`,
                                      state: {
                                        employeeName: td?.employeeName,
                                        distributionChanelId: td?.distributionChannelId,
                                        territoryName: td?.territoryName,
                                        employee: values?.employeeName
                                      }
                                  });
                                }}
                              >
                                Transfer
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {gridData?.data?.length > 0 && (
                  <PaginationTable
                    count={gridData?.counts}
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
              </div>
            </div>
          </>
        )}
      </Formik>
    </>
  );
}
