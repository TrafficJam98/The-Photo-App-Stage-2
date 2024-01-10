//
// app.get('/users', async (req, res) => {...});
//
// Return all the users from the database in ascending order by userid

const dbConnection = require('./database.js')

exports.get_users = async (req, res) => {

  console.log("call to /users...");

  try {

    var sql = "select * from users order by userid;"

    dbConnection.query(sql, (err, results, _) => {
      if (err) {
        reject(err);
        return;
      }

      // send response in JSON format;
      console.log("/users query done");
      console.log("/users done, sending response...");
      console.log(results)
      res.json({
        "message": "success",
        "data": results
      });
    });

  }//try
  catch (err) {
    res.status(400).json({
      "message": err.message,
      "data": []
    });
  }//catch

}//get
