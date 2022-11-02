import Keycloak from 'keycloak-js';

// Setup Keycloak instance as needed
// Pass initialization options as required or leave blank to load from 'keycloak.json'
const keycloak = new Keycloak({
  url: 'https://slinkid.ptit.edu.vn/auth',
  realm: 'master',
  // clientId: 'slink-electron',
  clientId: 'slink-client-web',
});

// keycloak.init({
//   // redirectUri: 'http://localhost',
//   redirectUri: 'https://slink.ptit.edu.vn/dashboard',
// });
export default keycloak;
