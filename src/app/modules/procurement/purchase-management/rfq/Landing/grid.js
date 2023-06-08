import React from 'react'
import ICustomTable from '../../../../_helper/_customTable'
import IView from '../../../../_helper/_helperIcons/_view'
import IEdit from '../../../../_helper/_helperIcons/_edit'
import IQuotation from '../../../../_helper/_helperIcons/_quotation'
import ICs from '../../../../_helper/_helperIcons/_cs'
import { withRouter } from 'react-router-dom'
import { useSelector, shallowEqual } from 'react-redux'

const GridData = ({ history, usersDDLdata }) => {
  let ths = ['SL', 'RFQ Code', 'RFQ Date', 'Validity', 'Currency', 'Action']

  // gridData ddl
  const gridData = useSelector((state) => {
    return state.rfq.gridData.data
  }, shallowEqual)

  return (
    <>
      {gridData?.length > 0 && (
        <ICustomTable ths={ths} className="table-font-size-sm">
          {gridData?.map((td, index) => {
            return (
              <tr key={index}>
                <td> {td.sl} </td>
                <td> {td.requestForQuotationCode} </td>
                <td> {td.rfqdate} </td>
                <td> {td.validTillDate} </td>
                <td> {td.currencyCode} </td>
                <td>
                  <div className="d-flex justify-content-around">
                    <button
                      onClick={() =>
                        history.push(
                          `/mngProcurement/purchase-management/rfq/view/${td?.requestForQuotationId}`
                        )
                      }
                      style={{ border: 'none', background: 'none' }}
                    >
                      <IView />
                    </button>

                    <button
                      onClick={() =>
                        history.push({
                          pathname: `/mngProcurement/purchase-management/rfq/edit/${td?.requestForQuotationId}`,
                          state: usersDDLdata,
                        })
                      }
                      style={{ border: 'none', background: 'none' }}
                    >
                      <IEdit />
                    </button>

                    <button
                      onClick={() =>
                        history.push({
                          pathname: `/mngProcurement/purchase-management/rfq/quotation/${td?.requestForQuotationId}`,
                          state: usersDDLdata,
                        })
                      }
                      style={{ border: 'none', background: 'none' }}
                    >
                      <IQuotation />
                    </button>
                    <button
                      onClick={() =>
                        history.push({
                          pathname: `/mngProcurement/purchase-management/rfq/cs/${td?.requestForQuotationId}`,
                          state: usersDDLdata,
                        })
                      }
                      style={{ border: 'none', background: 'none' }}
                    >
                      <ICs />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </ICustomTable>
      )}
    </>
  )
}

export default withRouter(GridData)
