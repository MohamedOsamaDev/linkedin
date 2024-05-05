const handlePage = (page, onNull=1) => {
  // Convert page to a number
  const pageNumber = Number(page);

  // Check if pageNumber is a valid number and less than 1
  if (isNaN(pageNumber) || pageNumber < 1) {
      // If it's not a valid number or less than 1, return 1
      return onNull;
  } else {
      // If it's a valid number and greater than or equal to 1, return the pageNumber
      return pageNumber;
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
