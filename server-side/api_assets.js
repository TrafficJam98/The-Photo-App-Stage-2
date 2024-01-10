//
// app.get('/assets', async (req, res) => {...});
//
// Return all the assets from the database in ascending order by assetid
//
const dbConnection = require('./database.js')

exports.get_assets = async (req, res) => {

  console.log("call to /assets...");

  try {
    
    var sql = "select * from assets order by assetid;"

    dbConnection.query(sql, (err, results, _) => {
      if (err) {
          reject(err);
          return;
      }

      // send response in JSON format;
      console.log("/assets query done");
      console.log("/assets done, sending response...");
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
