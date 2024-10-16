const moment = require("moment");

const table = "employer_subscriber";

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

exports.getOne = async (query) => {
  return new Promise((resolve, reject) => {
    DB(table)
      .where(query)
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

exports.getMany = async () => {
  return new Promise((resolve, reject) => {
    let totalRecords;

    let dataQuery = DB(table);

    dataQuery
        .orderBy("created_at", "desc")
        .then(function (record) {
            resolve({
                status: true,
                data: record,
                totalDocuments: totalRecords,
            });
        })
        .catch(function (error) {
            console.log(error);
            resolve({ status: false, data: error });
        });
  });
};

exports.getAllByUsers = async () => {
  return new Promise((resolve, reject) => {
    let dataQuery = DB(table);
    dataQuery.where({ "is_active": 1 });
    dataQuery
      .then(function (record) {
        resolve({
          status: true,
          data: record,
        });
      })
      .catch(function (error) {
        console.log(error);
        resolve({ status: false, data: error });
      });
  });
};

exports.updateExpiry = async () => {
    return new Promise((resolve, reject) => {
        let query = DB(table);
        query.where("end", "<", moment(new Date()).format("YYYY-MM-DD"))
        query.where("is_expire", "=", "0")
        query.update({"is_expire": 1})
        .then(v => {
            resolve({
                status: true,
                result: v
            })
        })
        .catch(err => {
            console.log("Auto Expire Error: ", err);
            resolve({
                status: false,
                result: {}
            })
        })
    })
}

exports.getHighestDurationPlan = async () => {
  console.log(moment().add(2, "days").endOf().format("YYYY-MM-DD"));
    return new Promise((resolve, reject) => {
        let query = DB(table).select("employer_subscriber.*", "employer_subscriptions.title", "company_profile.email", "company_profile.company_name");
        query.where(function() {
          this.where(DB.raw("DATE(`end`)"), "=", moment().add(30, "days").format("YYYY-MM-DD"))
              .orWhere(DB.raw("DATE(`end`)"), "=", moment().add(15, "days").format("YYYY-MM-DD"))
              .orWhere(DB.raw("DATE(`end`)"), "=", moment().add(7, "days").format("YYYY-MM-DD"))
              .orWhere(DB.raw("DATE(`end`)"), "=", moment().add(2, "days").format("YYYY-MM-DD"))
        })
        query.where("is_expire", "=", "0")
        query.orderBy("end", "DESC")
        query.groupBy("employer_id")
        .leftJoin("employer_subscriptions", "employer_subscriptions.id", "=", "employer_subscriber.subscription_id")
        .leftJoin("company_profile", "company_profile.employer_id", "=", "employer_subscriber.employer_id")
        .then(v => {
            resolve({
                status: true,
                result: v
            })
        })
        .catch(err => {
            console.log("Auto Expire Error: ", err);
            resolve({
                status: false,
                result: {}
            })
        })
    })
}

exports.getMyMemberships = async (userId) => {
    return new Promise((resolve, reject) => {
        let query = DB(table).select("employer_subscriber.*", "employer_subscriptions.title");
        query.where("employer_id", userId)
        .leftJoin("employer_subscriptions", "employer_subscriptions.id", "=", "employer_subscriber.subscription_id")
        .orderBy("employer_subscriber.created_at", "desc")
        .then(v => {
            resolve({
                status: true,
                result: v
            })
        })
        .catch(err => {
            console.log("Auto Expire Error: ", err);
            resolve({
                status: false,
                result: []
            })
        })
    })
}