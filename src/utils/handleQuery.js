const handlePage = (page, onNull = 1) => {
  // Check if page is a number and greater than or equal to 1
  if (typeof page !== "number" || page < 1) {
    return onNull;
  } else {
    return page;
  }
};
const handleSort = (sort = "asc") => {
  // Convert the sorting parameter to lowercase for case insensitivity
  const sortParam = sort?.toLowerCase();
  // Check if the sorting parameter is 'asc' or 'desc'
  if (sortParam === "asc" || sortParam === "desc") {
    return sortParam;
  } else {
    // If the sorting parameter is neither 'asc' nor 'desc', return 'asc'
    return "asc";
  }
};
module.exports = {
  handlePage,
  handleSort
};
