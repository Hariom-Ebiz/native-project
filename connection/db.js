// const config = require("./config");

// const KnexQueryBuilder = require("knex/lib/query/querybuilder");


const db_config = {
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
  // migrations: {
  //   tableName: "users",
  // },
};
const knex = require("knex")(db_config);

// KnexQueryBuilder.prototype.paginate = function (
//   per_page,
//   current_page,
//   status = false,
//   custom_limit = 0
// ) {
//   var pagination = {};
//   var per_page = per_page || 10;

//   var page = current_page || 1;
//   if (page < 1) page = 1;
//   var offset = (page - 1) * per_page;
//   return Promise.all([
//     //this.clone().count('* as count').first(),
//     this.clone(),
//     this.offset(offset).limit(per_page),
//   ]).then(([total, rows]) => {
//     if (custom_limit > 0) {
//       per_page = custom_limit;
//     }
//     var count = total.length;
//     var rows = rows;
//     pagination.total = count;
//     pagination.per_page = per_page;
//     pagination.offset = offset;
//     pagination.to = offset + rows.length;
//     pagination.last_page = Math.ceil(count / per_page);
//     pagination.current_page = page;
//     pagination.from = offset;
//     pagination.data = rows;
//     return pagination;
//   });
// };
// console.log('knex.queryBuilder', knex.queryBuilder);

// knex.queryBuilder = function () {
// 	return new Builder(knex.client);
// };


module.exports = knex;
