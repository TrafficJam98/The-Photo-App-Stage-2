//
// app.get('/bucket?startafter=bucketkey', async (req, res) => {...});
//
// Retrieves the contents of the S3 bucket and returns the 
// information about each asset to the client. Note that it
// returns 12 at a time, use startafter query parameter to pass
// the last bucketkey and get the next set of 12, and so on.
//
const { ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { s3, s3_bucket_name, s3_region_name } = require('./aws.js');

exports.get_bucket = async (req, res) => {

  console.log("call to /bucket...");

  // get the bucketkey if it is listed
  var bucketkey = ""
  if (req.query.startafter) {
    bucketkey = req.query.startafter
  }

  try {
    //
    // build input object with request parameters:
    //
    var input = {
      Bucket: s3_bucket_name,
      MaxKeys: "12",
      StartAfter: bucketkey     
    };

    console.log("/bucket: calling S3...");

    var command = new ListObjectsV2Command(input);
    var s3_response = await s3.send(command);

    if(s3_response["KeyCount"] == 0) {
      res.json({
        // no content
        "message": "success",
        "data": []
      });
    }else{
      res.json({
        "message": "success",
        "data": s3_response["Contents"]
      });
    }

  }//try
  catch (err) {
    res.status(400).json({
      "message": err.message,
      "data": []
    });
  }//catch

}//get
