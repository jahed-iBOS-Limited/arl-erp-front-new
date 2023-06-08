const removeComma = (numbers) => {
  const newNumber = Number(numbers?.replace(/,/g, ''));
  return newNumber;
}

export default removeComma;