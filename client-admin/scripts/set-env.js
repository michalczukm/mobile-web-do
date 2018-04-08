const writeFile = require('fs').writeFile;

// fixed values - for now we only need this for production build
const isProd = true;
const environment = 'prod';

const targetPath = `./src/environments/environment.${environment}.ts`;
const envConfigFile = `
export const environment = {
    production: ${isProd},
    apiBaseUrl: '/api'
};

export const authConfig = {
    clientID: ${process.env.AUTH_CLIENT_ID},
    domain: ${process.env.AUTH_DOMAIN},
    callbackURL: ${process.env.AUTH_CALLBACK_URL}
};
`
writeFile(targetPath, envConfigFile, (err) => {
  if (err) {
    console.log(err);
  }

  console.log(`Output generated at ${targetPath}`);
});
