//import { toast } from 'react-toastify'

export const QuantityCheck = (quantity) => {

  if (quantity) {

    if(quantity === '00') return false

    if ((quantity.toString().length > 10) || (quantity < 0)) {
      return false
    }

    let intValue = parseInt(quantity)
    if (intValue !== +quantity) {
      let lensplit = quantity?.toString()?.split(".")[1]?.length
      if (lensplit > 6) {
        return false;
      }
    } else {
      let len = quantity?.toString()?.length;
      if (len > 10) {
        return false;
      }
    }
    return true;
  }
}