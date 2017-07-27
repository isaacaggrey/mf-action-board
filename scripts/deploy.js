const AWS = require("aws-sdk"); // imports AWS SDK
const mime = require('mime-types') // mime type resolver
const fs = require("fs"); // utility from node.js to interact with the file system
const path = require("path"); // utility from node.js to manage file/folder paths

// configuration necessary for this script to run
const rootBucketConfig = {
  s3BucketName: 'mf-action-board',
  folderPath: '../dist' // path relative script's location
};

const assetBucketConfig = {
  s3BucketName: 'mf-action-board/assets',
  folderPath: '../dist/assets' // path relative script's location
};

// initialise S3 client
const s3 = new AWS.S3({
  signatureVersion: 'v4',
  //see Eric Slater or Chris Cotar to get the credentials to push. Do not commit the keys.
  accessKeyId: '', 
  secretAccessKey: ''
});

let pushFilesToS3 = function(config, s3) {
  const dirpath = path.join(__dirname, config.folderPath);
  fs.readdir(dirpath, (err, files) => {

    if(!files || files.length === 0) {
      console.log(`provided folder '${dirpath}' is empty or does not exist.`);
      console.log('Make sure your Angular project was compiled!');
      return;
    }

    // for each file in the directory
    for (const fileName of files) {

      // get the full path of the file
      const filePath = path.join(dirpath, fileName);
      
      if (fs.lstatSync(filePath).isDirectory()) {
        continue;
      }  
    
      // read file contents
      fs.readFile(filePath, (error, fileContent) => {
        // if unable to read file contents, throw exception
        if (error) { throw error; }
        
        // map the current file with the respective MIME type
        const mimeType = mime.lookup(fileName);

        // upload file to S3
        s3.putObject({
          Bucket: config.s3BucketName,
          Key: fileName,
          Body: fileContent,
          ContentType: `${mimeType}`
        }, (res) => {
          console.log(res)
        });

      });
    }
  });
}
pushFilesToS3(rootBucketConfig, s3);
pushFilesToS3(assetBucketConfig, s3)
