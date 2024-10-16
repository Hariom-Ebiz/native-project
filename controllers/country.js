const Country = require("../models/country");

exports.getAll = async (req, res) => {
    let countries = [];
    try {
        countries = await Country.getAll();
      } catch (err) {
        const error = new HttpError(
          req,
          new Error().stack.split("at ")[1].trim(),
          "Could not able to create course.",
          500
        );
        return next(error);
      }
    
      res.status(200).json({
        status: true,
        message: "Countries fetched Successfully",
        countries
      });
}