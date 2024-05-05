const { Createvalidation } = require("../../../utils/validation");
const { GetConnectionsForSomeOneVal, DeleteConnectionVal } = require("../schema/connectionVal");

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
          populate: {
            user_1: {
              filters: { id: { $not: user.id } },
              fields: ["username", "fullName"],
              populate: { profilePic: { fields: ["url"] } },
            },
            user_2: {
              filters: { id: { $not: user.id } },
              fields: ["username", "fullName"],
              populate: { profilePic: { fields: ["url"] } },
            },
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
      
      
      const { error } = await Createvalidation(GetConnectionsForSomeOneVal, ctx.request.query);
      if (error) {
        return ctx.badRequest(error.details[0].message);
      }
      const { username, fullName } = ctx.request.query;
      const user = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: {
            $or: [
              {
                username: username ,
              },
              {
                fullName: fullName ,
              },
            ],
          },
        });
      if (!user) return ctx.badRequest("user not found");
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
          populate: {
            user_1: {
              filters: { id: { $not: user.id } },
              fields: ["username", "fullName"],
              populate: { profilePic: { fields: ["url"] } },
            },
            user_2: {
              filters: { id: { $not: user.id } },
              fields: ["username", "fullName"],
              populate: { profilePic: { fields: ["url"] } },
            },
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
      const { error } = await Createvalidation(DeleteConnectionVal, ctx.request.params);
      if (error) {
        return ctx.badRequest(error.details[0].message);
      }
      const { id } = ctx.request.params;
      const { user } = ctx.state;
      const connection = await strapi.db
        .query("api::connection.connection")
        .findOne({
          where: {
            $or: [
              {
                user_1: user.id,
                id,
              },
              {
                id,
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
