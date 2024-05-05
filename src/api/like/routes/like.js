module.exports = {
  routes: [
    {
      method: "GET",
      path: "/posts/:id/likes",
      handler: "like.getlikes",
    },
    {
      method: "POST",
      path: "/posts/:id/add-like",
      handler: "like.addLike",
    },
    {
      method: "DELETE",
      path: "/likes/:id",
      handler: "like.deleteLike",
    },
  ],
};
