export const dateFormat = (date, type) => {
  const dateInput = new Date(date);

  switch (type) {
    case 'dd m yyyy':
      return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(dateInput);

    default:
      return dateInput;
  }
}