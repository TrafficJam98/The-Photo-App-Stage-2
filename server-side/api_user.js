//
// app.put('/user', async (req, res) => {...});
//
// Inserts a new user into the database, or if the
// user already exists (based on email) then the
// user's data is updated (name and bucket folder).
// Returns the user's userid in the database.
//
 

const dbConnection = require('./database.js')

exports.put_user = async (req, res) => {

  console.log("call to /user...")

  try {

    input = req.body

    sql1 = 'select * from users where email = ?;'
    sql2 = 'insert into users(email, lastname, firstname, bucketfolder) values(?,?,?,?);'

    para1 = [input.email]
    para2 = [input.email, input.lastname, input.firstname, input.bucketfolder]

    // find by given email
    dbConnection.query(sql1, para1, async(err1, result1, _) => {
      if (err1) {
        console.log("Error at find");
        res.status(400).json({
          "message": err1.message,
          "userid": -1
        })
      }

      if (result1.length == 0) {
        // insert new user if no find
        dbConnection.query(sql2, para2, async (err2, result2, _) => {
          if (err2) {
            console.log("Error at insert")
            res.status(400).json({
              "message": err2.message,
              "userid": -1
            })
            return
          }
          // console.log("Check for inserted data")
          // console.log(result2.insertId);
          // console.log(result2);
          res.json({
            "message": "inserted",
            "userid": result2.insertId
          })
          return
        })
        return
      }
      
      sql3 = 'update users set lastname = ?, firstname = ?, bucketfolder = ? where email = ?;'
      sql4 = 'select userid from users where email = ?;'
      
      para3 = [input.lastname, input.firstname, input.bucketfolder, input.email]
      para4 = [input.email]
      // update by given email
      dbConnection.query(sql3, para3, async (err3, result3, _) => {
        if (err3) {
          console.log("Error at update");
          res.status(400).json({
            "message": err3.message,
            "userid": -1
          })
        }
        return
      })

      // display info
      dbConnection.query(sql4, para4, async (err4, result4, _) => {
        // console.log("Check for updated data");
        // console.log(result4);
        res.json({
          "message": "updated",
          "userid": result4[0].userid
        })
        return
      })
      
    })
  //try
  }catch (err) {
    console.log("**Error:", err.message)
    res.status(400).json({
      "message": err.message,
      "userid": -1
    })
  }//catch

}//put