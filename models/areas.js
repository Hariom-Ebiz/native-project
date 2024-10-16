const table = "areas";

exports.create = async (data) => {
  return new Promise((resolve, reject) => {
    DB(table)
      .insert(data)
      
      .then(function (record) {
        resolve({ status: true, data: record });
      })
      .catch(function (error) {
        resolve({ status: false, data: error });
      });
  });
};

exports.update = async (query, data) => {
  return new Promise((resolve, reject) => {
    DB(table)
      .where({ ...query })
      .update(data)
      .then(function (record) {
        resolve({ status: true, data: record });
      })
      .catch(function (error) {
        resolve({ status: false, data: error });
      });
  });
};

exports.getOne = async (query = {}, notQuery = {}) => {
  return new Promise((resolve, reject) => {
    DB(table)
      .where(query)
      .whereNot(notQuery)
      .first()
      .then(function (record) {
        resolve(record);
      })
      .catch(function (error) {
        console.log(error);
        resolve(null);
      });
  });
};

exports.getAll = async (query = {}, notQuery = {}) => {
  return new Promise((resolve, reject) => {
    DB(table)
      .where(query)
      .whereNot(notQuery)
      .then(function (record) {
        resolve(record);
      })
      .catch(function (error) {
        console.log(error);
        resolve([]);
      });
  });
};

exports.getAllWithCountry = async (key) => {
  return new Promise((resolve, reject) => {
    DB(table)
      .select(
        "countries.id as country_id",
        "cities.id as city_id",
        "cities.name as city",
        "countries.name as country"
      )
      .whereILike("cities.name", `${key}%`)
      .leftJoin("countries", "countries.id", "=", "cities.country_id")
      .then(async function (record) {
        let rec = await Promise.all(record.map((d) => {return {value: `${d.city_id},${d.country_id}`, label: `${d.city}, ${d.country}`}}))
        resolve(rec);
      })
      .catch(function (error) {
        console.log(error);
        resolve([]);
      });
  });
};

exports.delete = async (match) => {
  return new Promise((resolve, reject) => {
    let query = DB(table);
    query
      .where(match)
      .del()
      .then(function (record) {
        resolve({ status: true });
      })
      .catch(function (error) {
        resolve({ status: false });
      });
  });
};
