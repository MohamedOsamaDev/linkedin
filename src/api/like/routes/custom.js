module.exports = {
  routes: [
    {
      method: "GET",
      path: "/post-likes/:id",
      handler: "custom.getlikes",
    },
    {
      method: "POST",
      path: "/add-like/:id",
      handler: "custom.addLike",
    },
    {
      method: "DELETE",
      path: "/delete-like/:id",
      handler: "custom.deleteLike",
    },
  ],
};
