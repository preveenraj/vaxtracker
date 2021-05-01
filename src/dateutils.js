
const getNextDate = (date) => {
  const nextDate = new Date(date.valueOf());
  nextDate.setDate(date.getDate() + 1);
  return nextDate;
};

const transformDate = (date) => {
  const dd = date.getDate();
  const mm = date.getMonth() + 1;
  const yyyy = date.getFullYear();
  return `${dd < 10 ? "0" + dd : dd}-${mm < 10 ? "0" + mm : mm}-${yyyy}`;
};

export {
  getNextDate,
  transformDate
}