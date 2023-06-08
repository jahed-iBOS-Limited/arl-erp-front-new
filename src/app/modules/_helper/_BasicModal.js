import { Box, Modal } from "@material-ui/core";
import React from "react";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";

export default function BasicModal({
  open,
  handleClose,
  myStyle,
  hideBackdrop = false,
  children,
}) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    ...myStyle,
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        hideBackdrop={hideBackdrop}
      >
        <Box sx={style}>
          <span
            style={{
              position: "absolute",
              right: 0,
              top: 2,
              cursor: "pointer",
            }}
            onClick={handleClose}
          >
            <CloseOutlinedIcon />
          </span>
          {children}
        </Box>
      </Modal>
    </div>
  );
}
