module.exports = {
  routes: [
    {
      method: "GET",
      path: "/connections",
      handler: "connection.GetMyConnections",
    },
    {
      method: "GET",
      path: "/users/:id/connections",
      handler: "connection.GetConnectionsForSomeOne",
    },
    {
      method: "DELETE",
      path: "/connections/:id",
      handler: "connection.DeleteConnection",
    },
  ],
};
