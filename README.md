## This is "My face recognition" React App using a backend app.

### To install dependencies
- `npm install`

### To run locally
- Type `npm start`.
- Make sure to deploy and start the backend part first( https://github.com/MFarkha/my-face-recognition-api )

### Check out (set) enviroment variables (using .env file for example):
- `REACT_APP_BACKEND_URL=http://HOST_NAME:PORT_NAME/api` - for a backend connection
- `REACT_APP_LAMBDA_URL=https://AWS LAMBDA URL` - for lambda component to work (it displays a rank emoji)

### To deploy onto Github-pages:
- `npm run deploy`
- put this code into your `package.json`:
- `"homepage": "https://{YOUR GITHUB USERNAME}.github.io/my-face-recognition"`

### To deploy onto AWS S3/Cloudfront:
- `npm run build`
- `aws s3 cp build s3://{NAME OF YOUR BUCKET} --recursive`
- `aws cloudfront update-distribution --id {YOUR DISTRIBUTION ID} --default-root-object index.html`
- `aws cloudfront create-invalidation --distribution-id {distribution-id} --paths /\*`

## Contributors
The entire idea of the app is from [Zero to Mastery course](https://academy.zerotomastery.io/courses/enrolled/697434)