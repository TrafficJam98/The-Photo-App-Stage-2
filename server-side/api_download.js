//
// app.get('/download/:assetid', async (req, res) => {...});
//
// downloads an asset from S3 bucket and sends it back to the
// client as a base64-encoded string.
//
const dbConnection = require('./database.js')
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { s3, s3_bucket_name, s3_region_name } = require('./aws.js');

exports.get_download = async (req, res) => {

  console.log("call to /download...");
  // get the assetid (must present)
  assetid = req.params.assetid
  
  try {

    sql = "select * from assets where assetid = ?;"
    dbConnection.query(sql, [assetid], async (err, results, _) => {
      if (err) {
        res.status(400).json({
          "message": err.message,
          "user_id": -1,
          "asset_name": "?",
          "bucket_key": "?",
          "data": []
        });
        return;
      }

      if(results.length == 0){
        res.status(400).json({
          "message": "no such asset...",
          "user_id": -1,
          "asset_name": "?",
          "bucket_key": "?",
          "data": []
        });
        return;
      }

      row = results[0]

      var input = new GetObjectCommand({
        Bucket: s3_bucket_name,
        Key: row["bucketkey"]  
      });


        var s3_result = await s3.send(input);
        var str = await s3_result.Body.transformToString("base64");

      
      // not empty
      res.json({
        "message": "success",
        "user_id": row["userid"],
        "asset_name": row["assetname"],
        "bucket_key": row["bucketkey"],
        "data": str
      });
    });
  }//try
  catch (err) {
    //
    // generally we end up here if we made a 
    // programming error, like undefined variable
    // or function:
    //
    res.status(400).json({
      "message": err.message,
      "user_id": -1,
      "asset_name": "?",
      "bucket_key": "?",
      "data": []
    });
  }//catch

}//get