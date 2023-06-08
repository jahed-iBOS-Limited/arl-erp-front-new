import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IView from "../../../_helper/_helperIcons/_view";
import Loading from "../../../_helper/_loading";
import { _todayDate } from "../../../_helper/_todayDate";
import IViewModal from "../../../_helper/_viewModal";
import Details from "./details";

const initData = {
  fromDate: _todayDate(),
};
function Receivableagingsummery() {
  const [rowData, getRowData, loading] = useAxiosGet();
  const [modelShow, setModelShow] = useState(false);
  const [clickRowDto, setClickRowDto] = useState("");

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getRowData(
      `/oms/SalesInformation/GetReceiveableAgingSummery?unitID=${selectedBusinessUnit?.value}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={{}}
        onSubmit={() => {}}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Receivable Aging Summery"}>
                <CardHeaderToolbar>
                  {/* <button
                    onClick={() => {
                      history.push({
                        pathname: `/financial-management/invoicemanagement-system/salesInvoice/create`,
                        state: values,
                      });
                    }}
                    className="btn btn-primary ml-2"
                    type="button"
                  >
                    Create
                  </button> */}
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {loading && <Loading />}

                <div className="row mt-5">
                  <div className="col-lg-12">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered global-table">
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Distribution Channel Name</th>
                            <th>Not Over Due</th>
                            <th>Over Due</th>
                            <th>Total Credit Limit</th>
                            <th>Total Due</th>
                            <th>Due 30</th>
                            <th>Due 91</th>
                            <th>Due 3145</th>
                            <th>Due 4660</th>
                            <th>Due 6190</th>
                            <th>Mon Credit Limit</th>
                            <th>Mon Bg</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowData?.length > 0 &&
                            rowData?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item?.strdistributionchannelname}</td>
                                <td className="text-right">
                                  {Number((item?.NotOverDue).toFixed(2))}
                                </td>
                                <td className="text-right">
                                  {Number((item?.OverDue).toFixed(2))}
                                </td>
                                <td className="text-right">
                                  {item?.TotalCreditLimit}
                                </td>
                                <td className="text-right">
                                  {Number((item?.TotalDue).toFixed(2))}
                                </td>
                                <td className="text-right">
                                  {Number((item?.due30).toFixed(2))}
                                </td>
                                <td className="text-right">
                                  {Number((item?.due91).toFixed(2))}
                                </td>
                                <td className="text-right">
                                  {Number((item?.due3145).toFixed(2))}
                                </td>
                                <td className="text-right">
                                  {Number((item?.due4660).toFixed(2))}
                                </td>
                                <td className="text-right">
                                  {Number((item?.due6190).toFixed(2))}
                                </td>
                                <td className="text-right">
                                  {item?.monCreditLimit}
                                </td>
                                <td className="text-right">
                                  {Number((item?.monbg).toFixed(2))}
                                </td>
                                <td className="text-center">
                                  <span
                                    onClick={() => {
                                      setModelShow(true);
                                      setClickRowDto(item);
                                    }}
                                  >
                                    <IView />
                                  </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
            {modelShow && (
              <IViewModal
                show={modelShow}
                onHide={() => setModelShow(false)}
                title={`Receivable aging details (${clickRowDto?.strdistributionchannelname})`}
              >
                <Details clickRowDto={clickRowDto} />
              </IViewModal>
            )}
          </>
        )}
      </Formik>
    </>
  );
}

export default Receivableagingsummery;
