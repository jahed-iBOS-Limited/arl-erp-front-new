const permittedEmployeeId = [558574, 558577]

export const hasPaymentDetailsEditPermission = (employeeId) => {
    return permittedEmployeeId.includes(employeeId);
}