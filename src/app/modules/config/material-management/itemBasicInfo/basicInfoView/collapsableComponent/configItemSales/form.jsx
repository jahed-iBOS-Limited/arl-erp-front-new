import React, { useEffect, useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

import Axios from 'axios'


const DataValiadtionSchema = Yup.object().shape({
  minOrderQuantity: Yup.number()
    .integer()
    .min(1)
    .required('Minimum order quantity is required')
    .integer()
    .min(1, 'Minimum order quantity is required'),
  lotSize: Yup.number()
    .integer()
    .min(1)
    .required('Lot Size is required')
    .integer()
    .min(1, 'Lot Size is required'),
  org: Yup.object().shape({
    label: Yup.string().required('Item Organization is required'),
    value: Yup.string().required('Item Organization is required'),
  }),
  profitCenter: Yup.object().shape({
    label: Yup.string().required('Item Organization is required'),
    value: Yup.string().required('Item Organization is required'),
  }),
  revenueGL: Yup.object().shape({
    label: Yup.string().required('Item Organization is required'),
    value: Yup.string().required('Item Organization is required'),
  }),
  productDivision: Yup.object().shape({
    label: Yup.string().required('Item Organization is required'),
    value: Yup.string().required('Item Organization is required'),
  }),
  cogsGL: Yup.object().shape({
    label: Yup.string().required('Item Organization is required'),
    value: Yup.string().required('Item Organization is required'),
  }),
  accroedCogsGL: Yup.object().shape({
    label: Yup.string().required('Item Organization is required'),
    value: Yup.string().required('Item Organization is required'),
  }),
  distributionChannel: Yup.object().shape({
    label: Yup.string().required('Distribution Channel is required'),
    value: Yup.string().required('Distribution Channel is required'),
  }),
})
const initValue = {
  org: { label: '', value: '' },
  profitCenter: '',
  productDivision: { label: '', value: '' },
  cogsGL: { label: '', value: '' },
  distributionChannel: { label: '', value: '' },
  accroedCogsGL: { label: '', value: '' },
  revenueGL: { label: '', value: '' },
  salesDescription: 0,
  minOrderQuantity: 0,
  volume: '',
  isMrp: false,
  hsCode: '',
  lotSize: 0,
  vatItem: '',
}

export default function _Form({
  initData,
  saveBtnRef,
  saveData,
  resetBtnRef,
  disableHandler,
  selectedBusinessUnit,
  accountId,
  basicItemInfo,
}) {
  const [, setOrgList] = useState('')
  const [, setProfitCenter] = useState('')
  const [, setproductDivision] = useState('')
  const [, setCogsGL] = useState('')
  // const [accroedCogsGLDDL, setAccroedCogsGL] = useState("");
  const [, setRevenueGL] = useState('')
  const [, setdistributionChannel] = useState('')
  const [, setTaxItemGroupDDL] = useState([])

  const getInfoData = async (buId, accId) => {
    try {
      const res = await Axios.get(
        `/oms/BusinessUnitSalesOrganization/GetPartnerGroupFromSalesOrgDDL?AccountId=${accId}&BUnitId=${buId}`
      )
      const { data: resData, status } = res
      if (status === 200 && resData.length) {
        let orgs = []
        resData.forEach((item) => {
          let items = {
            value: item.value,
            label: item.label,
          }
          orgs.push(items)
        })
        setOrgList(orgs)
        orgs = null
      }
    } catch (error) {
      console.log(error)
    }
  }
  const getprofitCenter = async (buId, accId) => {
    const res = await Axios.get(
      `/costmgmt/ProfitCenter/GetProfitCenterInformation?AccountId=${accId}&BusinessUnitId=${buId}`
    )
    if (res.status === 200 && res?.data) {
      const data = res?.data

      const newData = data.map((item) => {
        return {
          value: item.profitCenterId,
          label: item.profitCenterName,
        }
      })
      setProfitCenter(newData)
    }
  }
  const getProductivision = async (buId, accId) => {
    const res = await Axios.get(
      `/oms/ProductDivision/GetProductDivisionDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    )
    const { status, data } = res
    if (status === 200 && data.length) {
      let obj = []
      data &&
        data.forEach((item) => {
          let items = {
            value: item.value,
            label: item.label,
          }
          obj.push(items)
        })
      setproductDivision(obj)
    }
  }
  const getCogsGL = async (buId, accId) => {
    // const res = await Axios.get(
    //   `/domain/BusinessUnitGeneralLedger/GetGeneralLedgerDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    // );
    const res = await Axios.get(
      `/domain/BusinessUnitGeneralLedger/GetGeneralLedgerDDL?AccountId=${accountId}&BusinessUnitId=${buId}&AccountGroupId=${14}`
    )
    const { status, data } = res
    if (status === 200 && data.length) {
      let obj = []
      data &&
        data.forEach((item) => {
          let items = {
            value: item?.generalLedgerId,
            label: item?.generalLedgerName,
          }
          obj.push(items)
        })
      setCogsGL(obj)
    }
  }

  const getRevenueGL = async (buId, accId) => {
    const res = await Axios.get(
      `/domain/BusinessUnitGeneralLedger/GetGeneralLedgerDDL?AccountId=${accountId}&BusinessUnitId=${buId}&AccountGroupId=${9}`
    )
    const { status, data } = res
    if (status === 200 && data.length) {
      let obj = []
      data &&
        data.forEach((item) => {
          let items = {
            value: item?.generalLedgerId,
            label: item?.generalLedgerName,
          }
          obj.push(items)
        })
      setRevenueGL(obj)
    }
  }

  const getDistributionChannel = async (buId, accId) => {
    const res = await Axios.get(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
    )
    const { status, data } = res
    if (status === 200 && data.length) {
      let obj = []
      data &&
        data.forEach((item) => {
          let items = {
            value: item.value,
            label: item.label,
          }
          obj.push(items)
        })
      setdistributionChannel(obj)
    }
  }

  const getTaxItemGroupDDL_api = async (accId, buId) => {
    const res = await Axios.get(
      `/vat/TaxItemGroup/GetTaxItemGroupDDL?accountId=${accId}&businessUnitId=${buId}`
    )
    const { status, data } = res
    if (status === 200 && data.length) {
      let obj = []
      data &&
        data.forEach((item) => {
          let items = {
            value: item.value,
            label: `${item.label} [HS: ${item?.code}]`,
          }
          obj.push(items)
        })
      setTaxItemGroupDDL(obj)
    }
  }

  useEffect(() => {
    if (selectedBusinessUnit && accountId) {
      getInfoData(selectedBusinessUnit.value, accountId)
      getprofitCenter(selectedBusinessUnit.value, accountId)
      getProductivision(selectedBusinessUnit.value, accountId)
      getCogsGL(selectedBusinessUnit.value, accountId)
      // getAccroedCogsGL(selectedBusinessUnit.value, accountId);
      getRevenueGL(selectedBusinessUnit.value, accountId)
      getDistributionChannel(selectedBusinessUnit.value, accountId)
      getTaxItemGroupDDL_api(accountId, selectedBusinessUnit.value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, accountId])

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          salesDescription: basicItemInfo
            ? basicItemInfo[0]?.itemName
            : initData?.salesDescription,
        }}
        validationSchema={DataValiadtionSchema}
        onSubmit={(values, { resetForm }) => {
          saveData(values, () => {
            resetForm(initData || initValue)
          })
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          handleChange,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {disableHandler(!isValid)}
            <Form className="form form-label-right">
            <div className="row mb-1">
                <div className="col-lg-3">
                  <label>Sales Organization</label>
                  <div>{values?.org?.label || "......."}</div>
                </div>
                <div className="col-lg-3">
                  <label>Profit Center</label>
                  <div>{values?.profitCenter?.label || "......."}</div>
                </div>
                <div className="col-lg-3">
                  <label>Product Division</label>
                  <div>{values?.productDivision?.label || "......."}</div>
                </div>
                <div className="col-lg-3">
                  <label>COGS GL</label>
                  <div>{values?.cogsGL?.label || "......."}</div>
                </div>
                <div className="col-lg-3">
                  <label>Accroed COGS GL</label>
                  <div>{values?.accroedCogsGL?.label || "......."}</div>
                </div>
                <div className="col-lg-3">
                  <label>Select Revenue GL</label>
                  <div>{values.revenueGL?.label || "......."}</div>
                </div>
                <div className="col-lg-3">
                  <label>Distribution Channel</label>
                  <div>{values.revenueGL?.label || "......."}</div>
                </div>
                <div className="col-lg-3">
                  <label>Lot Size</label>
                  <div>{values?.lotSize || "......."}</div>
                </div>
                <div className="col-lg-3">
                  <label>Minimum Order Qty</label>
                  <div>{values?.minOrderQuantity || "......."}</div>
                </div>
                <div className="col-lg-3">
                  <label>Sales Description</label>
                  <div>{values?.salesDescription || "......."}</div>
                </div>
                <div className="col-lg-3">
                  <label>Volume(CFT)</label>
                  <div>{values?.volume || "......."}</div>
                </div>
                <div className="col-lg-3">
                  <label>VAT Item</label>
                  <div>{values?.vatItem?.label || "......."}</div>
                </div>
              </div>

              
              <button
                type="submit"
                style={{ display: 'none' }}
                ref={saveBtnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: 'none' }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  )
}
