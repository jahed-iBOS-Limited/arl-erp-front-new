import React, { useEffect, useMemo, useRef, useState } from 'react';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import ReactToPrint from 'react-to-print';
import Loading from '../../../../_helper/_loading';
import IViewModal from '../../../../_helper/_viewModal';
import ProjectedSubGeneralLedgerModal from './projectedSubGeneralLedgerModal';
import ICustomCard from '../../../../_helper/_customCard';

const ProjectedIncomeStatementModal = ({
  values,
  businessUnitList,
  incomeStatementRow,
  profileData,
}) => {
  const printRef = useRef();
  const selectedBusinessUnit = useMemo(
    () =>
      businessUnitList?.find(
        (item) => item?.value === values?.businessUnit?.value,
      ),

    [values?.businessUnit?.value],
  );
  const [totalAmount, setTotalAmount] = useState(0);
  const [
    generalLedgerInfo,
    getGeneralLedgerInfo,
    loadingOnGetGeneralLedgerInfo,
  ] = useAxiosGet();

  useEffect(() => {
    if (incomeStatementRow?.intFSId) {
      console.log('values', values);
      getGeneralLedgerInfo(
        `/fino/IncomeStatement/GetIncomeStatementProjected?partName=GeneralLedger&dteFromDate=${
          values?.fromDate
        }&dteFromDateL=${values?.fromDate}&dteToDate=${
          values?.toDate
        }&dteToDateL=${values?.toDate}&BusinessUnitGroup=${
          values?.enterpriseDivision?.value
        }&BusinessUnitId=${values?.businessUnit?.value}&fsComponentId=${
          incomeStatementRow?.intFSId
        }&ConvertionRate=${values?.conversionRate}&SubGroup=${values
          ?.subDivision?.value || 'All'}`,
        (data) => {
          setTotalAmount(
            data?.reduce((value, row) => (value += row?.numAmount), 0) || 0,
          );
        },
      );
    }

  }, [incomeStatementRow?.intFSId]);

  const [generalLedgerRow, setGeneralLedgerRow] = useState(null);
  const [showSubGeneralLedgerModal, setShowSubGeneralLedgerModal] = useState(
    false,
  );
  return (
    <>
      <ICustomCard
        title="General Ledger"
        renderProps={() => (
          <>
            <ReactToPrint
              pageStyle="@page { size: 8in 12in !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }"
              trigger={() => <button className="btn btn-primary">Print</button>}
              content={() => printRef.current}
            />
          </>
        )}
      >
        {loadingOnGetGeneralLedgerInfo && <Loading />}

        <div className="mt-2">
          <div ref={printRef}>
            <div className="m-3 adjustment-journalReport">
              <div>
                <div className="d-flex flex-column justify-content-center align-items-center my-2">
                  <span
                    style={{
                      fontSize: '22px',
                      fontWeight: 'bold',
                    }}
                  >
                    {values?.businessUnit?.value === 0
                      ? profileData?.accountName
                      : selectedBusinessUnit?.label}
                  </span>
                  {values?.businessUnit?.value > 0 ? (
                    <span>{selectedBusinessUnit?.businessUnitAddress}</span>
                  ) : (
                    <></>
                  )}
                  {values?.profitCenter?.value > 0 ? (
                    <span>
                      Profit Center : <b>{values?.profitCenter?.label}</b>
                    </span>
                  ) : (
                    <></>
                  )}
                  <span>
                    Particulars :{' '}
                    <b>{incomeStatementRow?.strFSComponentName}</b>
                  </span>
                </div>
              </div>

              <div className="loan-scrollable-table">
                <div
                  className="scroll-table _table"
                  style={{ maxHeight: '540px', overflowX: 'hidden' }}
                >
                  <table
                    className="table table-striped table-bordered global-table mt-0 table-font-size-sm mt-2"
                    id="table-to-xlsx"
                  >
                    <thead>
                      <tr>
                        <th style={{ minWidth: '60px' }}>SL</th>
                        <th>GL Code</th>
                        <th>
                          <div style={{ textAlign: 'left', marginLeft: '5px' }}>
                            GL Name
                          </div>
                        </th>
                        <th>
                          <div
                            style={{ textAlign: 'right', marginRight: '5px' }}
                          >
                            Amount
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {generalLedgerInfo?.length > 0 ? (
                        <>
                          {generalLedgerInfo?.map((item, index) => (
                            <tr>
                              <td>{index + 1}</td>

                              <td className="text-center">
                                {item?.strGeneralLedgerCode || 'N/A'}
                              </td>
                              <td
                                style={{ textAlign: 'left', marginLeft: '5px' }}
                              >
                                {item?.strGeneralLedgerName || 'N/A'}
                              </td>
                              <td
                                onClick={() => {
                                  setGeneralLedgerRow(item);
                                  setShowSubGeneralLedgerModal(true);
                                }}
                                style={{
                                  textDecoration: 'underline',
                                  color: 'blue',
                                  cursor: 'pointer',
                                  textAlign: 'right',
                                  marginRight: '5px',
                                }}
                              >
                                {item?.numAmount}
                              </td>
                            </tr>
                          ))}
                        </>
                      ) : (
                        <></>
                      )}

                      <tr>
                        <td
                          colspan="3"
                          className="text-center ml-1"
                          style={{
                            fontWeight: 'bold',
                            textAlign: 'right',
                            marginRight: '5px',
                          }}
                        >
                          Total
                        </td>

                        <td
                          className="text-right pr-2"
                          style={{ fontWeight: 'bold' }}
                        >
                          {totalAmount || 0}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div></div>
        </div>
      </ICustomCard>
      <IViewModal
        show={showSubGeneralLedgerModal}
        onHide={() => {
          setShowSubGeneralLedgerModal(false);
          setGeneralLedgerRow(null);
        }}
      >
        <ProjectedSubGeneralLedgerModal
          values={values}
          generalLedgerRow={{
            ...generalLedgerRow,
            strFSComponentName: incomeStatementRow?.strFSComponentName,
          }}
          businessUnit={selectedBusinessUnit}
          profileData={profileData}
        />
      </IViewModal>
    </>
  );
};

export default ProjectedIncomeStatementModal;
