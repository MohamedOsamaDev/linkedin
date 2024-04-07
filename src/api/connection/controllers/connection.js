module.exports = {
  GetMyConnections: async (ctx) => {
    try {
      const { user } = ctx.state;
      let { page } = ctx.request.query;
      page = page * 1 < 1 ? 1 : page;
      const data = await strapi.entityService.findPage(
        "api::connection.connection",
        {
          page,
          pageSize: 15,
          filters: {
            $or: [
              {
                user_1: user.id,
              },
              {
                user_2: user.id,
              },
            ],
          },
        }
      );
      return ctx.send({ data });
    } catch (e) {
      console.log(e);
      return ctx.badRequest(e);
    }
  },
  GetConnectionsForSomeOne: async (ctx) => {
    try {
      const { username, fullName } = ctx.request.params;
      if (!username && !fullName)
        return ctx.badRequest("must provide a user name or full name");
      const user = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: {
            $or: [
              {
                username,
              },
              {
                fullName,
              },
            ],
          },
        });
      let { page } = ctx.request.query;
      page = page * 1 < 1 ? 1 : page;
      const data = await strapi.entityService.findMany(
        "api::connection.connection",
        {
          page,
          pageSize: 15,
          filters: {
            $or: [
              {
                user_1: user?.id,
              },
              {
                user_2: user?.id,
              },
            ],
          },
        }
      );
      return ctx.send({ data });
    } catch (e) {
      console.log(e);
      return ctx.badRequest(e);
    }
  },
  DeleteConnection: async (ctx) => {
    try {
      const { id } = ctx.params;
      const { user } = ctx.state;
      const connection = await strapi.db
        .query("api::connection.connection")
        .findOne({
          where: {
            $or: [
              {
                user_1: user.id,
                user_2: id,
              },
              {
                user_1: id,
                user_2: user.id,
              },
            ],
          },
        });
      if (!connection) return ctx.badRequest("Connection not found");
      await strapi.entityService.delete("api::connection.connection", id);
      return ctx.send({
        data: {
          massage: "success",
        },
      });
    } catch (e) {
      console.log(e);
      return ctx.badRequest(e);
    }
  },
};
