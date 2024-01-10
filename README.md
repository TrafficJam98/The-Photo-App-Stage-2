# The PhotoApp Stage 2

This project is an extension to stage 1. I injected a web service tier between the Python-based client and the AWS services. Below is a relation graph of this project:

![alt text](https://github.com/TrafficJam98/The-Photo-App-Stage-2/blob/main/README_pic1.png?raw=true)

The web service will be written in JavaScript using Node.js and the Express framework. The client is still Python-based, rewritten to interact with the web service instead of AWS directly. The database and S3 bucket remain the same from stage 1. Below were some major steps I took in this project:

1. Build the web service, test functions using a web browser as the client
2. Build the Python-based client, providing a better way to test. Confirm images are downloaded properly by displaying
3. Add the image upload feature. Update web service, test. Update Python client, test
4. Implement the API function /user, which uses PUT to either insert a new user into the database, or if the user already exists then the user's related information will be update. Test with POSTMAN
5. Implement the API function /image/:userid, which uses POST to upload an image to S3, and then store information about this asset in the database. Test with POSTMAN
6. Package and deploy using AWS Elastic Beanstalk/EC2


Note: This code is for display only. In order for it to run correctly, one has to set up his/her own AWS enviroment
