import Keycloak from 'keycloak-js';
// Setup Keycloak instance as needed
// Pass initialization options as required or leave blank to load from 'keycloak.json'
const keycloak = Keycloak({
    url: 'https://slinkid.ptit.edu.vn/auth',
    realm: 'master',
    clientId: 'slink-client-web',
});
export default keycloak;
