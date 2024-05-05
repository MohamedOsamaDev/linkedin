module.exports = {
  welcome: async (ctx) => {
    try {
        console.log("🚀 ~ END REFREACH  ~  ")
      return ctx.send({
        data: {
          message: "Welcome to the Strapi  API powered by ALPHA TEAM! ;)",
        },
      });
    } catch (error) {}
  },
};
