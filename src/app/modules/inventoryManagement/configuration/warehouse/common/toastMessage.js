import React from "react";

import { toast } from "react-toastify";

export default function({ msg, color, classNames, position, toastId }) {
  if (color && msg) {
    toast[color](msg);
    // toast.info("k",{toastId})
  }

  return <div></div>;
}
