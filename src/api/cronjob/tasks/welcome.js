const { default: axios } = require("axios");

module.exports = {
    /**
     * Simple example.
     * Every monday at 1am.
     */
  
    "*/5 * * * *":  ({ strapi }) => {
        const refreach = async () => { 
            try {
                const response = await axios.get(
                    "https://linkedin-8qzg.onrender.com/api/cronjob"
                  );
                console.log("🚀 ~ START REFREACH  ~  ")
                } catch (error) {
                console.log('error')
            }
        }
        refreach()
      // Add your own logic here (e.g. send a queue of email, create a database backup, etc.).
    },
  };