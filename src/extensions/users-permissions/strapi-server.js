const { Createvalidation } = require("../../utils/validation");
const { updateMeval } = require("./schema/userVal");

module.exports = (plugin) => {
  /*******************************  CUSTOM CONTROLERS  ********************************/
  plugin.controllers.user.updateMe = async (ctx) => {
    try {
      // 1 vaildate data
      const { error } = await Createvalidation(updateMeval, ctx.request.body);
      if (error) {
        return ctx.badRequest(error.details[0].message);
      }
      const { email, username } = ctx.request.body;
      const { user } = ctx.state;

      if (email || username) {
        // 2 check unique feilds
        const checkFeilds = await strapi
          .query("plugin::users-permissions.user")
          .findMany({
            where: {
              $or: [
                {
                  username: username,
                  id: { $not: user.id },
                },
                {
                  email: email,
                  id: { $not: user.id },
                },
              ],
            },
          });
        if (!!checkFeilds.length) {
          let errormsg = [];
          checkFeilds.map((val) => {
            if (val.username === username) {
              errormsg.push("username");
            }
            if (val.email === email) {
              errormsg.push("email");
            }
          });
          // @ts-ignore
          errormsg =
            errormsg.toString().replace(/,/g, " and ") + " alraedy uses";
          return ctx.badRequest(errormsg);
        }
      }
    
      if (ctx?.request?.files?.coverPic) {
        const coverPicupload = await strapi
          .service("plugin::upload.upload")
          .upload({
            data: {
              fileInfo: { caption: "", alternativeText: "", name: "" },
            },
            files: ctx.request.files.coverPic,
          });
        ctx.request.body.coverPic = coverPicupload;
      }
      if (ctx?.request?.files?.profilePic) {
        const profilePicupload = await strapi
          .service("plugin::upload.upload")
          .upload({
            data: {
              fileInfo: { caption: "", alternativeText: "", name: "" },
            },
            files: ctx.request.files.profilePic,
          });
        ctx.request.body.profilePic = profilePicupload;
      }
      if (Object.keys(ctx.request.body)?.length === 0)
        return ctx.badRequest("no data to update");
  // 4 update data if all things is alright
      await strapi.query("plugin::users-permissions.user").update({
        where: { id: user.id },
        data: ctx.request.body,
      });
      return ctx.send({
        message: "success",
      });
    } catch (error) {
      console.log("🚀 ~ plugin.controllers.user.updateMe= ~ error:", error);
      return ctx.badRequest(error);
    }
  };
  /*******************************  remove profile pic  ********************************/
  plugin.controllers.user.removeProfilePicture = async (ctx) => {
    // 1 vaildate data
    try {
      const { user } = ctx.state;

      await strapi
        .query("plugin::users-permissions.user")
        .update({
          where: { id: user.id },
          data: {
            profilePic: null,
          },
        })
        .then((res) => {
          return (ctx.response.status = 200);
        });
    } catch (error) {
      console.log("🚀 ~ plugin.controllers.user.updateMe= ~ error:", error);
      return ctx.badRequest(error);
    }
  };
  /*******************************  remove cover pic  ********************************/
  plugin.controllers.user.removeCoverPicture = async (ctx) => {
    // 1 vaildate data
    try {
      const { user } = ctx.state;
      await strapi
        .query("plugin::users-permissions.user")
        .update({
          where: { id: user.id },
          data: {
            coverPic: null,
          },
        })
        .then((res) => {
          return (ctx.response.status = 200);
        });
    } catch (error) {
      console.log("🚀 ~ plugin.controllers.user.updateMe= ~ error:", error);
      return ctx.badRequest(error);
    }
  };
  /*******************************  CUSTOM ROUTES  ********************************/
  plugin.routes["content-api"].routes.push({
    method: "PUT",
    path: "/user/me",
    handler: "user.updateMe",
    config: {
      prefix: "",
      policies: [],
    },
  });
  plugin.routes["content-api"].routes.push({
    method: "DELETE",
    path: "/user/me/cover-pic",
    handler: "user.removeCoverPicture",
    config: {
      prefix: "",
      policies: [],
    },
  });
  plugin.routes["content-api"].routes.push({
    method: "DELETE",
    path: "/user/me/profile-pic",
    handler: "user.removeProfilePicture",
    config: {
      prefix: "",
      policies: [],
    },
  });
  return plugin;
};
