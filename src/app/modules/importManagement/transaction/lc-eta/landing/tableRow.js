import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import { Formik } from "formik";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import ICustomTable from "../../../../_helper/_customTable";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _firstDateofMonth } from "../../../../_helper/_firstDateOfCurrentMonth";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import Loading from "../../../../_helper/_loading";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { toast } from "react-toastify";

const header = [
  "SL No.",
  "ETA Date",
  "Invoice No",
  "BL No",
  "Vessel Name",
  "Number of Container",
  "Action",
];

const TableRow = () => {
  const [, gettLetterOfCreaditByPo, lcLoading,settLetterOfCreaditByPo ] = useAxiosGet("");
  const history = useHistory();
  const [
    letterOfCreaditETALanding,
    gettLetterOfCreaditETALanding,
    landingLoading,
  ] = useAxiosGet("");
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    //GetBankDDL(setBankDDL, profileData?.accountId, selectedBusinessUnit?.value);
  }, []);

  const loadPartsList = (v) => {
    if (v?.length < 3) return [];
    return Axios.get(
      `/imp/ImportCommonDDL/GetDirectPOForLC?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&searchPO=${v}`
    ).then((res) => res?.data);
  };

  const girdDataFunc = async (values) => {
    gettLetterOfCreaditETALanding(
      `/imp/Shipment/GettLetterOfCreaditETALandingPasignation?Lcid=${values?.lcid}`
    );
  };

  //   {
  //     "lcidetanfoId": 1,
  //     "lcid": 187542,
  //     "etaDate": "2024-06-03T00:00:00",
  //     "nvoiceNo": "sf",
  //     "blno": "sfs",
  //     "vesselName": "sfs",
  //     "numberOfContainer": 10
  // }
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          poNo: "",
          bankDDL: "",
          fromDate: _dateFormatter(_firstDateofMonth()),
          toDate: _dateFormatter(new Date()),
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
          {
            lcLoading && <Loading />
          }
            <Card>
              <CardHeader title="LC ETA">
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      history.push({
                        pathname: "/managementImport/transaction/lc-eta/create",
                      });
                    }}
                    className="btn btn-primary"
                    type="button"
                  >
                    Create
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {landingLoading && <Loading />}
                <div className="row global-form">
                  <div className="col-lg-3 col-md-3">
                    <label>PO No/ LC No</label>
                    <SearchAsyncSelect
                      selectedValue={values?.poNo}
                      isSearchIcon={true}
                      paddingRight={10}
                      handleChange={(valueOption) => {
                        settLetterOfCreaditByPo([])
                        setFieldValue("poNo", valueOption);
                        gettLetterOfCreaditByPo(
                          `/imp/Shipment/GettLetterOfCreaditByPo?PoId=${valueOption?.value}`,
                          (resData) => {
                            const modifyvalues = {
                              ...values,
                              poNo: valueOption,
                              lcid: resData?.lcid || 0,
                            };
                            girdDataFunc(modifyvalues);
                          },
                          (errors) => {
                            toast.warning("LC Not Found");
                          }
                        );
                      }}
                      loadOptions={loadPartsList}
                    />
                  </div>
                  {/* <div className="col-lg-2 pt-5 mt-1">
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={() => {
                        isShowBtnClicked = true;
                      }}
                    >
                      Show
                    </button>
                  </div> */}
                </div>
                <ICustomTable ths={header}>
                  {letterOfCreaditETALanding?.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{_dateFormatter(item?.etaDate)}</td>
                        <td>{item?.nvoiceNo}</td>
                        <td>{item?.blno}</td>
                        <td>{item?.vesselName}</td>
                        <td>{item?.numberOfContainer}</td>
                        <td style={{ width: "150px" }} className="text-center">
                          <div className="d-flex justify-content-center">
                            <span
                              className="ml-5 edit"
                              onClick={() => {
                                history.push({
                                  pathname: `/managementImport/transaction/lc-eta/edit/${item?.lcidetanfoId}`,
                                });
                              }}
                            >
                              <IEdit />
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </ICustomTable>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
};

export default TableRow;
