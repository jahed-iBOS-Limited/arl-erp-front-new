import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { Form, Formik } from "formik";
import Loading from "../../../../_helper/_loading";
import {
  Card,
  CardBody,
  CardHeader,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import { getMonthName } from "../../../../_helper/monthIdToMonthName";

const SalesForceIncetiveDetailsModal = ({ gridItem }) => {
  const { selectedBusinessUnit } = useSelector(
    (state) => state.authData,
    shallowEqual
  );

  const [
    sfiDetailsData,
    getSFIDetailsData,
    getSFIDetailsDataLoading,
  ] = useAxiosGet();

  function fetchSFIDetailsData({ selectedBusinessUnit, gridItem }) {
    // api
    getSFIDetailsData(
      `/oms/SalesForceKPI/GetDeatailinfoByBillRegisterId?businessUnitId=${selectedBusinessUnit?.value}&billRegisterId=${gridItem?.billRegisterId}&billtypeid=${gridItem?.billType}`
    );
  }

  useEffect(() => {
    fetchSFIDetailsData({ selectedBusinessUnit, gridItem });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Formik>
      {({ handleSubmit, resetForm, values }) => (
        <Card>
          {getSFIDetailsDataLoading && <Loading />}
          {true && <ModalProgressBar />}
          <CardHeader title={`Sales Force Incentive`}></CardHeader>
          <CardBody>
            <Form className="form form-label-right approveBillRegisterView">
              <div className="row mt-3">
                <div className="col-lg-12 ">
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered mt-3 global-table">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Employee Id</th>
                          <th>Employee Name</th>
                          <th>Territory</th>
                          <th>Area</th>
                          <th>Region</th>
                          <th>Month</th>
                          <th>Year</th>
                          <th>Target</th>
                          <th>Achievement</th>
                          <th>Bill Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sfiDetailsData?.data?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td
                                style={{ width: "30px" }}
                                className="text-center"
                              >
                                {index + 1}
                              </td>
                              <td>{item?.employeeId}</td>
                              <td>{item?.employeeName}</td>
                              <td>{item?.territory}</td>
                              <td>{item?.area}</td>
                              <td>{item?.region}</td>
                              <td>{getMonthName(item?.monthid)}</td>
                              <td>{item?.yearid}</td>
                              <td className="text-right">{item?.target}</td>
                              <td className="text-right">{item?.achievemtn}</td>
                              <td className="text-right">{item?.billAmount}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Form>
          </CardBody>
        </Card>
      )}
    </Formik>
  );
};

export default SalesForceIncetiveDetailsModal;
