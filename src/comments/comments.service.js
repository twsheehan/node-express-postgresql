const knex = require("../db/connection");

function list() {
  return knex("comments").select("*");
}

function listCommenterCount() {
  return knex("comments as c")
    .join("users as u", "c.commenter_id", "u.user_id")
    .select("u.user_email as commenter_email") // Select the user email
    .count("c.comment_id as count") // Count the number of comments per user
    .groupBy("u.user_id", "u.user_email") // Group by user ID and email
    .orderBy("u.user_email") // Order by user email
    .then((results) => {
      // Convert 'count' from String to int for each result
      return results.map((row) => ({
        ...row,
        count: parseInt(row.count), // Casting 'count' to an int
      }));
    });
}

function read(comment_id) {
  return knex("comments as c")
    .join("users as u", "c.commenter_id", "u.user_id")
    .join("posts as p", "c.post_id", "p.post_id")
    .select(
      "c.comment",
      "c.comment_id",
      "p.post_body as commented_post",
      "u.user_email as commenter_email"
    )
    .where({ "c.comment_id": comment_id })
    .first();
}

module.exports = {
  list,
  listCommenterCount,
  read,
};
