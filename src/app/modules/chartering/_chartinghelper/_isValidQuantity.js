//import { toast } from 'react-toastify'

export const ISValidQuantity = (quantity) => {
  if (quantity) {

    if (quantity.toString().length > 18) {
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
      if (len > 18) {
        return false;
      }
    }
    return true;
  }
}