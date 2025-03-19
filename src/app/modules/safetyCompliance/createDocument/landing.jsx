import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import useAxiosGet from "../../_helper/customHooks/useAxiosGet";
import ICustomCard from "../../_helper/_customCard";
import { _dateFormatter } from "../../_helper/_dateFormate";
import IEdit from "../../_helper/_helperIcons/_edit";
import IView from "../../_helper/_helperIcons/_view";
import Loading from "../../_helper/_loading";
import IViewModal from "../../_helper/_viewModal";
import ViewModal from "./ViewModal";

const initData = {
  search: "",
};

const CreateDocumentLanding = () => {
  const [gridData, getLanding, loading] = useAxiosGet();
  const [currentItem, setCurrentItem] = useState(null);
  const [isModal, setIsModal] = useState(false);
  let history = useHistory();
  useEffect(() => {
    getLanding(
      "/hcm/SafetyAndCompliance/LegalDocumentALLGET?strPartType=LegalDocumentNameLanding"
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ICustomCard title="Document Name">
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          onSubmit={(values, { setSubmitting, resetForm }) => {}}
        >
          {({ errors, touched, setFieldValue, isValid, values }) => (
            <>
              <div
                style={{ transform: "translateY(-40px)" }}
                className="text-right"
              >
                <button
                  disabled={false}
                  onClick={() => {
                    history.push(
                      "/safety-compliance/nestedsf/legal-document-name-create"
                    );
                  }}
                  className="btn btn-primary ml-3"
                >
                  Create
                </button>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  {loading && <Loading />}
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered bj-table bj-table-landing table-font-size-sm">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Document Name</th>
                          <th>Unit</th>
                          <th>Workplace Group</th>
                          <th>Workplace</th>
                          <th>Reminder Date</th>
                          <th>Frequency</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.length > 0 &&
                          gridData?.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td
                                  style={{ width: "30px" }}
                                  className="text-center"
                                >
                                  {index + 1}
                                </td>
                                <td>
                                  <span className="pl-2">
                                    {item?.strDocumentName}
                                  </span>
                                </td>
                                <td>
                                  <span className="pl-2">
                                    {item?.strBusinessUnitName || "All"}
                                  </span>
                                </td>
                                <td>
                                  <span className="pl-2">
                                    {item?.strWorkplaceGroupName || "All"}
                                  </span>
                                </td>
                                <td>{item?.strWorkplaceName || "All"}</td>
                                <td className="text-center">
                                  {_dateFormatter(item?.dteNotifyReminderDate)}
                                </td>
                                <td>{item?.strFrequency}</td>
                                <td className="text-center">
                                  <IView
                                    title="View Details"
                                    clickHandler={() => {
                                      setCurrentItem(item);
                                      setIsModal(true);
                                    }}
                                  />
                                  <span
                                    onClick={(e) => {
                                      history.push({
                                        pathname: `/safety-compliance/nestedsf/legal-document-name-create/edit/${item?.intDocumentId}`,
                                        state: {
                                          id: item?.intDocumentId,
                                        },
                                      });
                                    }}
                                    className="ml-2"
                                  >
                                    <IEdit title="Edit" />
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </Formik>
        <IViewModal
          title="View Document Name Details"
          show={isModal}
          onHide={() => setIsModal(false)}
        >
          <ViewModal currentItem={currentItem} />
        </IViewModal>
      </ICustomCard>
    </>
  );
};

export default CreateDocumentLanding;
