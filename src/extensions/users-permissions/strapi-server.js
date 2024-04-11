module.exports = (plugin) => {
  /*******************************  CUSTOM CONTROLERS  ********************************/
  plugin.controllers.user.updateMe = async (ctx) => {
    // 1 vaildate data
    try {
      const { fullName, title, email, username } = ctx.request.body;
      const { user } = ctx.state;
      let data = { fullName, title, email, username };
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
      // 4 update data if all things is alright
      if (ctx.request.files) {
        const { coverPic, profilePic } = ctx.request.files;
        if (coverPic) {
          const coverPicupload = await strapi
            .service("plugin::upload.upload")
            .upload({
              data: {
                fileInfo: { caption: "", alternativeText: "", name: "" },
              },
              files: coverPic,
            });
          data.coverPic = coverPicupload;
        }
        if (profilePic) {
          const profilePicupload = await strapi
            .service("plugin::upload.upload")
            .upload({
              data: {
                fileInfo: { caption: "", alternativeText: "", name: "" },
              },
              files: profilePic,
            });
          data.profilePic = profilePicupload;
        }
      }
      await strapi
        .query("plugin::users-permissions.user")
        .update({
          where: { id: user.id },
          data,
        })
        .then((res) => {
          return (ctx.response.status = 200);
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
