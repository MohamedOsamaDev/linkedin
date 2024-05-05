module.exports = {
  welcome: async (ctx) => {
    try {
      
      return ctx.send({
        data: {
          message: "Welcome to the Strapi  API powered by ALPHA TEAM! ;)",
        },
      });
    } catch (error) {}
  },
};
