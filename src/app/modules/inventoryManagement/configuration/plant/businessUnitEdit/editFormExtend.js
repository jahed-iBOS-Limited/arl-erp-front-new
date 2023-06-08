/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState, useRef } from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from '../../../../../../_metronic/_partials/controls'
import { ModalProgressBar } from '../../../../../../_metronic/_partials/controls'
import FormExtend from '../common/fromExtend'
import Axios from 'axios'
import shortid from 'shortid'
import { toast } from 'react-toastify'
import { useSelector, shallowEqual } from 'react-redux'
import { isUniq } from '../../../../_helper/uniqChecker'
import { useLocation } from 'react-router-dom'
import Loading from '../../../../_helper/_loading'

export default function EditFormExtend({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false)
  const [unit, setUnitData] = useState('')
  const [warehouseData, setData] = useState('')
  const [rowDto, setRowDto] = useState([])
  const { state: headerData } = useLocation()
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData
  }, shallowEqual)
  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit
  }, shallowEqual)
  useEffect(() => {
    getBusinessUnitById(id)
    getbusinessunitlist(profileData.accountId)
  }, [id, profileData.accountId])
  const getBusinessUnitById = async (id) => {
    const res = await Axios.get(`/wms/Plant/GetPlantEditViewDataById?Id=${id}`)
    const { data } = res
    if (data.length) {
      res.data.forEach((r) => {
        const singleObject = {
          accountId: r.accountId,
          businessUnitId: r.businessUnitId,
          plantId: r.plantId,
          plantName: r.plantName,
          plantCode: r.plantCode,
          plantAddress: r.plantAddress,
        }
        setData(singleObject)
      })
    }
  }
  const getbusinessunitlist = async (accId) => {
    const res = await Axios.get(
      `/vat/TaxDDL/GetBusinessUnitByAccIdDDL?AccountId=${accId}`
    )
    const { data } = res
    if (data.length) {
      setUnitData(res.data)
    }
  }
  const getGridData = async (PlantId) => {
    const res = await Axios.get(`/wms/Plant/GetBUByPlantId?PlantId=${PlantId}`)
    const { data } = res

    const finaldata = data.map((item) => ({
      businessUnitId: item.value,
      businessUnitName: item.label,
      configId: item.configId,
    }))

    if (data.length) {
      setRowDto([...rowDto, ...finaldata])
    }
  }

  // save business unit data to DB
  const saveWarehouse = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      const { userId: actionBy } = profileData
      // create
      const objRow = rowDto.map((itm) => {
        return {
          configId: itm.configId ? itm.configId : 0,
          accountId: profileData.accountId,
          businessUnitId: itm.businessUnitId,
          plantId: +id,
          actionBy,
        }
      })
      const payload = objRow
      try {
        setDisabled(true)
        await Axios.post('/wms/BusinessUnitPlant/CreateBUPlant', payload)
        cb()
        setDisabled(false)
        toast.success('Save successfully', { toastId: shortid() })
        backToWarehouseList()
      } catch (error) {
        console.log(error)
        setDisabled(false)
        toast.error(error?.response?.data?.message, { toastId: shortid() })
      }
    } else {
      console.log(values)
    }
  }

  const backToWarehouseList = () => {
    history.push(`/inventory-management/configuration/plant/`)
  }
  const addHandler = (param) => {
    if (isUniq('businessUnitId', param.businessUnitId, rowDto)) {
      setRowDto([param, ...rowDto])
    }
  }
  const remover = (param) => {
    const filtered = rowDto.filter((itm, idx) => idx !== param)
    setRowDto(filtered)
  }

  const btnRef = useRef()
  const saveBtnClicker = () => {
    if (btnRef && btnRef.current) {
      btnRef.current.click()
    }
  }

  const resetBtnRef = useRef()
  const ResetProductClick = () => {
    if (resetBtnRef && resetBtnRef.current) {
      resetBtnRef.current.click()
    }
  }

  // const disableHandler = (cond) => {
  //   setDisabled(cond);
  // };

  return (
    <Card>
      {true && <ModalProgressBar />}
      <CardHeader title="Extend Plant">
        <CardHeaderToolbar>
          <button
            type="button"
            onClick={backToWarehouseList}
            className="btn btn-light"
          >
            <i className="fa fa-arrow-left"></i>
            Back
          </button>
          {`  `}
          <button
            type="reset"
            onClick={ResetProductClick}
            ref={resetBtnRef}
            className="btn btn-light ml-2"
          >
            <i className="fa fa-redo"></i>
            Reset
          </button>
          {`  `}
          <button
            type="submit"
            className="btn btn-primary ml-2"
            onClick={saveBtnClicker}
            ref={btnRef}
            disabled={isDisabled}
          >
            Save
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        {isDisabled && <Loading />}
        {warehouseData && (
          <div className="mt-0">
            <FormExtend
              product={warehouseData}
              btnRef={btnRef}
              saveWarehouse={saveWarehouse}
              resetBtnRef={resetBtnRef}
              //disableHandler={disableHandler}
              plantName={false}
              plantCode={true}
              accountId={profileData?.accountId}
              selectedBusinessUnit={selectedBusinessUnit}
              unit={unit}
              addHandler={addHandler}
              rowDto={rowDto}
              remover={remover}
              getGridData={getGridData}
              id={id}
            />
          </div>
        )}
      </CardBody>
    </Card>
  )
}
