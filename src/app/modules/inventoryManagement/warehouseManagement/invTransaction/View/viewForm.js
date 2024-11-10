/* eslint-disable react-hooks/exhaustive-deps */
import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import ICustomTable from '../../../../_helper/_customTable'
import { IInput } from '../../../../_helper/_input'

const ths = ['SL', 'Component', 'Value Type', 'Value', 'is Manual']

export default function ViewForInvForm({
  currentRowData,
  setRowDto,
  rowDto,
  currentIndex,
  values,
  setIsShowModal,
}) {
  const [data, setData] = useState([])

  // redux store data
  const storeData = useSelector((state) => {
    return {
      profileData: state.authData.profileData,
      selectedBusinessUnit: state.authData.selectedBusinessUnit,
    }
  }, shallowEqual)

  const { profileData, selectedBusinessUnit } = storeData

  const getPriceStructure = () => {
    Axios.get(
      `/mngProcurement/PurchaseOrder/GetPriceStructureByPartnerId?AccountId=${profileData?.accountId}&UnitId=${selectedBusinessUnit?.value}&PartnerId=${values?.supplierName?.value}`
    )
      .then((res) => {
        if (res?.data) {
          const newData = res?.data.map((item, index) => ({
            ...item,
            val: '',
          }))
          setData(newData)
        }
      })
      .catch((err) => {

      })
  }

  useEffect(() => {
    if (
      profileData?.accountId &&
      selectedBusinessUnit?.value &&
      values?.supplierName?.value
    ) {
      getPriceStructure()
    }
  }, [profileData, selectedBusinessUnit, values])

  // input fields data handler dynamically
  const dataHandler = (name, value, sl) => {
    const xData = [...data]
    xData[sl][name] = value
    setData([...xData])
  }

  // save handler : check if user fields all input field, and then set it to parent component rowDto according to index
  // so to do that we get some props from parent component
  // if save is successfull close the modal
  // this save handler doesn't' connect in back end, we store this data to parent component rowDto by this save handler

  return (
    <div>
      <div className="text-right">
        <button className="btn btn-primary my-2">Save</button>
        <div className="row mb-2 text-left">
          <div className="col-lg">
            Item name : {currentRowData?.item?.label}
          </div>
          <div className="col-lg">
            Quantity : {currentRowData?.orderQty || 0}{' '}
          </div>
          <div className="col-lg">
            Order total :{' '}
            {currentRowData?.orderQty * currentRowData?.basicPrice || 0}{' '}
          </div>
          <div className="col-lg">Info : {currentRowData?.desc}</div>
        </div>
        {data?.length > 0 && (
          <ICustomTable ths={ths}>
            {data?.map((item, index) => (
              <tr key={index}>
                <td> {index + 1} </td>
                <td className="text-center"> {item?.priceComponentName} </td>
                <td className="text-center"> {item?.valueType} </td>
                <td className="disabled-feedback disable-border p-2">
                  <IInput
                    placeholder="value"
                    name="val"
                    type="number"
                    value={data[index].val}
                    onChange={(e) => {
                      dataHandler('val', e.target.value, index)
                    }}
                    min="0"
                  />
                </td>
                <td className="text-center"> {`${item?.mannual}`} </td>
              </tr>
            ))}
          </ICustomTable>
        )}
      </div>
    </div>
  )
}
