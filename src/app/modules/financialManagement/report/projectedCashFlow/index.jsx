import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import PowerBIReport from "../../../_helper/commonInputFieldsGroups/PowerBIReport";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../_helper/_loading";

function ProjectedCashFlowLanding() {
  const history = useHistory();
  const [pageNo] = useState(0);
  const [pageSize] = useState(15);
  const [, getRowData, loader] = useAxiosGet();

  useEffect(() => {
    getRowData(
      `/mes/MSIL/GetRentalVehicleRegister?pageNo=${pageNo}&pageSize=${pageSize}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
  //   getRowData(
  //     `/mes/MSIL/GetRentalVehicleRegister?pageNo=${pageNo}&pageSize=${pageSize}`
  //   );
  // };

  const groupId = "e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a";
  const reportId = "654eed74-2a55-404f-870a-2d6a5d319604";

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{}}
        validationSchema={{}}
        onSubmit={() => {}}
      >
        {({ values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Projected Cash Flow"}>
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      history.push({
                        pathname: `/financial-management/banking/ProjectedCashflow/create`,
                      });
                    }}
                    className="btn btn-primary ml-2"
                    type="button"
                  >
                    Create
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {loader && <Loading />}
                <PowerBIReport groupId={groupId} reportId={reportId} />

                {/* <div className="loan-scrollable-table">
                  <div className="scroll-table _table">
                    <table className="table table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th style={{ minWidth: "30px" }}>SL</th>
                          <th>Title</th>
                          <th>Day-1</th>
                          <th>Day-2</th>
                          <th>Day-3</th>
                          <th>Day-4</th>
                          <th>Day-5</th>
                          <th>Day-6</th>
                          <th>Day-7</th>
                          <th>Day-8</th>
                          <th>Day-9</th>
                          <th>Day-10</th>
                          <th>Day-11</th>
                          <th>Day-12</th>
                          <th>Day-13</th>
                          <th>Day-14</th>
                          <th>Day-15</th>
                          <th>Day-16</th>
                          <th>Day-17</th>
                          <th>Day-18</th>
                          <th>Day-19</th>
                          <th>Day-20</th>
                          <th>Day-21</th>
                          <th>Day-22</th>
                          <th>Day-23</th>
                          <th>Day-24</th>
                          <th>Day-25</th>
                          <th>Day-26</th>
                          <th>Day-27</th>
                          <th>Day-28</th>
                          <th>Day-29</th>
                          <th>Day-30</th>
                          <th>Month Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowData?.data?.length > 0 &&
                          rowData?.data?.map((item, index) => (
                            <tr key={index}>
                              <td>Test</td>
                              <td>Test</td>
                              <td>Test</td>
                              <td>Test</td>
                              <td>Test</td>
                              <td>Test</td>
                              <td>Test</td>
                              <td>Test</td>
                              <td>Test</td>
                              <td>Test</td>
                              <td>Test</td>
                              <td>Test</td>
                              <td>Test</td>
                              <td>Test</td>
                              <td>Test</td>
                              <td>Test</td>
                              <td>Test</td>
                              <td>Test</td>
                              <td>Test</td>
                              <td>Test</td>
                              <td>Test</td>
                              <td>Test</td>
                              <td>Test</td>
                              <td>Test</td>
                              <td>Test</td>
                              <td>Test</td>
                              <td>Test</td>
                              <td>Test</td>
                              <td>Test</td>
                              <td>Test</td>
                              <td>Test</td>
                              <td>Test</td>
                              <td>Test</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div> */}
                {/* {rowData?.data?.length > 0 && (
                  <PaginationTable
                    count={rowData?.totalCount}
                    setPositionHandler={setPositionHandler}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                    values={values}
                  />
                )} */}
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}

export default ProjectedCashFlowLanding;
