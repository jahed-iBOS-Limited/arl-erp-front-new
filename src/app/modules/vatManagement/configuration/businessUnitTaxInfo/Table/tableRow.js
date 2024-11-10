import React, { useEffect, useState } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { useHistory } from 'react-router-dom'
import IEdit from '../../../../_helper/_helperIcons/_edit'
import IView from '../../../../_helper/_helperIcons/_view'
import { GetBusinessUnitTaxInfoPagination } from '../helper'

export function TableRow() {
  const history = useHistory()
  const [gridData, setGridData] = useState([])

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData
  }, shallowEqual)

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit
  }, shallowEqual)

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      GetBusinessUnitTaxInfoPagination(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setGridData
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData])

  return (
    <>
      {/* Table Start */}
      <div className="row cash_journal">
        <div className="col-lg-12 pr-0 pl-0">
          {gridData?.length >= 0 && (
            <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
              <thead>
                <tr>
                  <th style={{ width: '30px' }}>SL</th>
                  <th style={{ width: '90px' }}>Business Unit Tax Id</th>
                  <th style={{ width: '90px' }}>Business Unit Name</th>
                  <th style={{ width: '70px' }}>Tax Zone Name</th>
                  <th style={{ width: '70px' }}>Tax Circle Name</th>
                  <th style={{ width: '100px' }}>Return Submission Date</th>
                  <th style={{ width: '100px' }}>Representative Name</th>
                  <th style={{ width: '100px' }}>Representative Rank</th>
                  <th style={{ width: '100px' }}>Representative Address</th>
                  <th style={{ width: '45px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {gridData?.map((item, index) => (
                  <tr key={index}>
                    <td> {item.sl} </td>
                    <td className="text-right">
                      <div className="pl-2 text-left">
                        {item?.businessUnitTaxInfoId}
                      </div>
                    </td>
                    <td>
                      <div className="pl-2">{item?.businessUnitName}</div>
                    </td>

                    <td>
                      <div className="pl-2">{item?.taxZoneName}</div>
                    </td>
                    <td>
                      <div className="pl-2">{item?.taxCircleName}</div>
                    </td>
                    <td>
                      <div className="pl-2">{item?.returnSubmissionDate}</div>
                    </td>
                    <td>
                      <div className="pl-2">{item?.representativeName} </div>
                    </td>
                    <td>
                      <div className="pl-2">{item?.representativeRank} </div>
                    </td>
                    <td>
                      <div className="pl-2">{item?.representativeAddress} </div>
                    </td>

                    <td>
                      <div className="d-flex justify-content-around">
                        <span className="view">
                          <IView
                            clickHandler={() => {
                              history.push(
                                `/mngVat/cnfg-vat/buTax/view/${item?.businessUnitTaxInfoId}`
                              )
                            }}
                          />
                        </span>
                        <span
                          className="edit"
                          onClick={() => {
                            history.push(
                              `/mngVat/cnfg-vat/buTax/edit/${item?.businessUnitTaxInfoId}`
                            )
                          }}
                        >
                          <IEdit />
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}
