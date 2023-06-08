import { Chip } from "@material-ui/core";
import React from "react";

function JohariChip({ data, name, deleteChipHandler, isDisabled }) {
  return (
    <Chip
      className="johari-window-chip mt-2"
      size="small"
      label={data?.label}
      onDelete={() => deleteChipHandler(data?.label, name)}
      disabled={isDisabled}
    />
  );
}

export default JohariChip;
