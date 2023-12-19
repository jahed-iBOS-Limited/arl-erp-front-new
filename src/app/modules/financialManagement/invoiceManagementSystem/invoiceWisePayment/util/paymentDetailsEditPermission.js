const permittedEmployeeId = [558574]

export const hasPaymentDetailsEditPermission = (employeeId) => {
    return permittedEmployeeId.includes(employeeId);
}