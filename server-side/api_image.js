//
// app.post('/image/:userid', async (req, res) => {...});
//
// Uploads an image to the bucket and updates the database,
// returning the asset id assigned to this image.
//
const dbConnection = require('./database.js')
const { PutObjectCommand } = require('@aws-sdk/client-s3')
const { s3, s3_bucket_name, s3_region_name } = require('./aws.js')

const uuid = require('uuid')

exports.post_image = async (req, res) => {

  console.log("call to /image...")

  userid = req.params.userid

  try {

    input = req.body
    sql1 = 'select * from users where userid = ?;'
    para1 = [userid]

    dbConnection.query(sql1, para1, async (err1, result1, _) => {
      if (err1) {
        console.log("Error at find")
        res.status(400).json({
          "message": err1.message,
          "assetid": -1
        })
      }

      if (result1.length == 0) {
        res.status(400).json({
          "message": "no such user...",
          "assetid": -1
        })
        return
      }
      
      byte = Buffer.from(input.data, "base64");
      key = result1[0].bucketfolder + "/" + uuid.v4() + ".jpg"
      const command = new PutObjectCommand({
        ACL: "public-read",
        Bucket: s3_bucket_name,
        Key: key,
        Body: byte,
      })

      const response = await s3.send(command)
      console.log(response)

      sql2 = 'insert into assets(userid, assetname, bucketkey) values(?, ?, ?);'
      para2 = [userid, input.assetname, key]
      dbConnection.query(sql2, para2, async (err2, result2, _) => {
        if (err2) {
          console.log("Error at insert")
          res.status(400).json({
            "message": err2.message,
            "assetid": -1
          })
        }

        res.json({
          "message": "success",
          "assetid": result2.insertId
        });

      });
    });

  }//try
  catch (err) {
    res.status(400).json({
      "message": err.message,
      "assetid": -1
    });
  }//catch

}//post