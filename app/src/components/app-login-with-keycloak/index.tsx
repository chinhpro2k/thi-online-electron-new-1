import { useKeycloak } from '@react-keycloak/web';
import { Button } from 'antd';
import * as React from 'react';
import { useEffect } from 'react';
import { authKeycloak } from '@/src/until/auth';

interface LoginWithKeycloakProps {
  title: string;
  onLoginSuccess: (token: string) => void;
}

const LoginWithKeycloak: React.FC<LoginWithKeycloakProps> = ({
  title,
  onLoginSuccess,
}) => {
  const loginKeyCloak = async () => {
    const { authCode } = await authKeycloak();
    // const codeAuth = authKeycloak();
    console.log('code auth', authCode);
    if (authCode) {
      $api
        .getToken({
          grant_type: 'authorization_code',
          code: authCode,
          client_id: 'slink-electron',
          redirect_uri: 'http://localhost:13311',
        })
        .then((resData) => {
          console.log('data token', resData);
          onLoginSuccess(resData?.data?.access_token ?? '');
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };
  return (
    <Button
      onClick={loginKeyCloak}
      type="primary"
      style={{
        marginTop: 8,
        width: '100%',
      }}
      size="large"
    >
      {title}
    </Button>
  );
};

export default LoginWithKeycloak;
