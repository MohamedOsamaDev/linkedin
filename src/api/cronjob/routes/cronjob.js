module.exports = {
  routes: [
    {
      method: "GET",
      path: "/cronjob",
      handler: "cronjob.welcome",
      config: {
        find: {
          auth: false,
        },
      },
    },
  ],
};
