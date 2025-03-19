const permittedEmployeeId = [558574, 558577, 561598];

export const hasPaymentDetailsEditPermission = (employeeId) => {
  return permittedEmployeeId.includes(employeeId);
};
