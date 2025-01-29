


export const rowDtoDynamicHandler = (name, value, sl, rowDto , setRowDto) => {
    let data = [...rowDto];
    let _sl = data[sl];
    _sl[name] = value || 0;
    if(name === "orderQty"){
      const netValue = (value * _sl.basicPrice) + ((value * _sl.basicPrice)/100  * _sl?.vat)
      _sl.netValue = netValue || 0

      const userGivenVatAmount = ((_sl?.vat || 0) / 100) * ((_sl?.basicPrice || 0))
      _sl.userGivenVatAmount = (userGivenVatAmount || 0)

      const vatAmount = _sl.userGivenVatAmount * value
      _sl.vatAmount = (vatAmount || 0)
    }else if(name=== "basicPrice"){
      const netValue = (value * _sl.orderQty) + ((value * _sl.orderQty)/100  * _sl?.vat)
      _sl.netValue = netValue||0

      const userGivenVatAmount = ((_sl?.vat || 0) / 100) * value
      _sl.userGivenVatAmount = userGivenVatAmount || 0

      const vatAmount = _sl.userGivenVatAmount * (_sl.orderQty || 0)
      _sl.vatAmount = (vatAmount || 0)
    }else if(name=== "vat"){
      const netValue = (_sl.orderQty * _sl.basicPrice) + ((_sl.orderQty * _sl.basicPrice)/100  * value)
      _sl.netValue = netValue ||0

      const userGivenVatAmount = (value / 100) * (_sl.basicPrice)
      _sl.userGivenVatAmount = (userGivenVatAmount || 0)

     const vatAmount = _sl.userGivenVatAmount * (_sl.orderQty || 0)
     _sl.vatAmount = (vatAmount || 0)

    }

    else if(name=== "userGivenVatAmount"){


     const vat = (value / (_sl.basicPrice || 0)) * 100
     _sl.vat = Number((vat || 0).toFixed(2))


     const netValue  = (_sl.orderQty * _sl.basicPrice) + ((_sl.orderQty * _sl.basicPrice)/100  * _sl.vat)
     _sl.netValue = netValue

      const vatAmount = value * (_sl.orderQty || 0)
      _sl.vatAmount = (vatAmount || 0)


    }
    setRowDto(data);
  };