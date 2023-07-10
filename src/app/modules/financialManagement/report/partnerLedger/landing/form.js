import { Formik, Form } from "formik";
import React, { useEffect, useState } from "react";
import {
  useSelector,
  shallowEqual,
  // useDispatch
} from "react-redux";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
} from "../../../../../../_metronic/_partials/controls";
import {
  getPartnerLedgerReport,
  //   getRegisterReportAction,
  getSbuDDLAction,
} from "../helper";
// import { setRegisterReportAction } from "../../../_helper/reduxForLocalStorage/Actions";
import Table from "./table";
import { getDistributionChannels } from "../helper";
import { _firstDateofMonth } from "../../../../_helper/_firstDateOfCurrentMonth";
import { _todayDate } from "../../../../_helper/_todayDate";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import ButtonStyleOne from "../../../../_helper/button/ButtonStyleOne";
import NewSelect from "../../../../_helper/_select";
import { fromDateFromApi } from "../../../../_helper/_formDateFromApi";

const initData = {
  fromDate: _firstDateofMonth(),
  toDate: _todayDate(),
  sbu: "",
  channel: "",
};
export function PartnerLedger() {
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  //   const dispatch = useDispatch();
  const { registerReport } = useSelector(
    (state) => state?.localStorage,
    shallowEqual
  );
  // const history = useHistory();
  const [sbuDDL, setSbuDDL] = useState([]);
  const [channelDDL, setChannelDDL] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fromDateFApi, setFromDateFApi] = useState("");


  useEffect(() => {
    fromDateFromApi(selectedBusinessUnit?.value, setFromDateFApi)

    getSbuDDLAction(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setSbuDDL
    );

    if (registerReport?.sbu?.value) {
      //   getRegisterReportAction(
      //     profileData?.accountId,
      //     selectedBusinessUnit?.value,
      //     registerReport,
      //     setRowDto,
      //     setLoading
      //   );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const getLadingData = (values) => {
    getPartnerLedgerReport(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.sbu?.value,
      values?.channel?.value,
      values?.fromDate,
      values?.toDate,
      setLoading,
      setRowDto
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData, ...registerReport, fromDate: fromDateFApi }}
        onSubmit={() => {}}
      >
        {({ errors, touched, setFieldValue, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title="Partner Ledger" />

              <CardBody>
                <Form className="form form-label-right">
                  {loading && <Loading />}
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <NewSelect
                        name="sbu"
                        options={sbuDDL || []}
                        value={values?.sbu}
                        label="SBU"
                        onChange={(valueOption) => {
                          setFieldValue("sbu", valueOption);
                          getDistributionChannels(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            valueOption?.value,
                            setLoading,
                            setChannelDDL
                          );
                        }}
                        placeholder="SBU"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="channel"
                        options={channelDDL || []}
                        value={values?.channel}
                        label="Distribution Channel"
                        onChange={(valueOption) => {
                          setFieldValue("channel", valueOption);
                        }}
                        placeholder="Distribution Channel"
                        errors={errors}
                        touched={touched}
                        isDisabled={!values?.sbu}
                      />
                    </div>

                    <div className="col-lg-2">
                      <InputField
                        value={values?.fromDate}
                        label="From date"
                        name="fromDate"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("fromDate", e?.target?.value);
                          //   setRowDto([]);
                        }}
                      />
                    </div>

                    <div className="col-lg-2">
                      <InputField
                        value={values?.toDate}
                        label="To Date"
                        name="toDate"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("toDate", e?.target?.value);
                          //   setRowDto([]);
                        }}
                      />
                    </div>

                    <div className="col-lg-1 text-right">
                      <ButtonStyleOne
                        label="View"
                        onClick={() => {
                          getLadingData(values);
                          //   dispatch(setRegisterReportAction(values));
                        }}
                        style={{ marginTop: "19px" }}
                        disabled={!values?.sbu || !values?.channel}
                      />
                    </div>
                  </div>
                </Form>
                <Table rowDto={rowDto} values={values} />
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
