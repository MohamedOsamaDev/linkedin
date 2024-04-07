module.exports = {
  routes: [
    {
      method: "GET",
      path: "/block-list",
      handler: "block-list.GetMyBlockList",
    },
    {
      method: "POST",
      path: "/block-list",
      handler: "block-list.addBlock",
    },
    {
      method: "DELETE",
      path: "/block-list/:id",
      handler: "block-list.removeBlock",
    },
  ],
};
