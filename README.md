This is "Smart Brain" React App based on Clarifai.com API using backend app from https://github.com/MFarkha/my-face-recognition-api

Make sure to start backend part first, then type "npm start"
put it into package.json:
<!--
"homepage": "https://mfarkha.github.io/my-face-recognition",
 -->


 <!--
 npm run build
 aws s3 cp build s3://<NAME OF YOUR BUCKET> --recursive
 aws cloudfront update-distribution --id <YOUR DISTRIBUTION ID> --default-root-object index.html
 aws cloudfront create-invalidation --distribution-id <distribution-id> --paths /\*
-->
