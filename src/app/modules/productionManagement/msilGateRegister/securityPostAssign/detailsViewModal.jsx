import { Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import Loading from "../../../_helper/_loading";
import { _timeFormatter } from "../../../_helper/_timeFormatter";

function SecurityPostAssignDetailsView({ shiftList }) {
  const [rowData, getRowData, lodar] = useAxiosGet();
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getRowData(
      `/mes/MSIL/GetSecurityPostAssignListByDateShift?date=${_dateFormatter(
        shiftList?.dteDate
      )}&ShiftId=${shiftList?.intShiftId}&BusinessunitId=${
        selectedBusinessUnit?.value
      }`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{}}
        // validationSchema={{}}
        onSubmit={() => {}}
      >
        {({ values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Security Post Assign Details"}></CardHeader>
              <CardBody>
                {lodar && <Loading />}
                <div className="row">
                  <div className="col-lg-12">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th style={{ width: "30px" }}>SL</th>
                            <th style={{ width: "70px" }}>তারিখ</th>
                            <th style={{ width: "70px" }}>শিফট</th>
                            <th>নাম</th>
                            <th>পদবী</th>
                            <th>পোস্ট/স্থান</th>
                            <th style={{ width: "100px" }}>প্রবেশের সময়</th>
                            <th style={{ width: "100px" }}>বহির্গমনের সময়</th>
                            <th>মন্তব্য</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowData?.length > 0 &&
                            rowData?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td className="text-center">
                                  {_dateFormatter(item?.dteDate)}
                                </td>
                                <td>{item?.strShiftName}</td>
                                <td>{item?.strEmployeeName}</td>
                                <td>{item?.strDesignation}</td>
                                <td>{item?.strPostName}</td>
                                <td className="text-center">
                                  {_timeFormatter(item?.tmInTime || "")}
                                </td>
                                <td className="text-center">
                                  {_timeFormatter(item?.tmOutTime || "")}
                                </td>
                                <td>{item?.strRemarks}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}

export default SecurityPostAssignDetailsView;
