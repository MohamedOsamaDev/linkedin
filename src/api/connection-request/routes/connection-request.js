module.exports = {
  routes: [
    {
      method: "GET",
      path: "/connection-requsets-sent",
      handler: "connection-request.GetMyConnectionRequsetsSent",
    },
    {
      method: "GET",
      path: "/connection-requsets-received",
      handler: "connection-request.GetMyConnectionRequsetsReceived",
    },
    {
      method: "POST",
      path: "/request-for-connection",
      handler: "connection-request.requestForConnection",
    },
    {
      method: "PUT",
      path: "/accept-connection/:id",
      handler: "connection-request.acceptConnection",
    },
    {
      method: "DELETE",
      path: "/connections-requests/:id",
      handler: "connection-request.deleteConnectionRequset",
    },
  ],
};
