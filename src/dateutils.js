
const getTomorrowsDate = () => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  return tomorrow;
};

const transformDate = (date) => {
  const dd = date.getDate();
  const mm = date.getMonth() + 1;
  const yyyy = date.getFullYear();
  return `${dd < 10 ? "0" + dd : dd}-${mm < 10 ? "0" + mm : mm}-${yyyy}`;
};

export {
  getTomorrowsDate,
  transformDate
}