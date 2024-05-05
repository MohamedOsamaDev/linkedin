module.exports = {
  async Createvalidation(schema, data) {
    return await schema.validateAsync(data);
  },
  // Add other validation functions for different schemas and purposes
};
