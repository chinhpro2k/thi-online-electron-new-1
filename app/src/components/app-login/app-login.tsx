import { Button, Col, Form, Input, message, Row, Spin, Typography } from 'antd';
import React from 'react';
import LoginWithKeycloak from '@/src/components/app-login-with-keycloak';
const { Title } = Typography;

interface AppLoginProps extends Partial<StoreProps> {
  onDone: (userInfo: UserInfoNS.RootObject) => void;
}

interface AppLoginState {
  loading: boolean;
}
export class AppLogin extends React.Component<AppLoginProps, AppLoginState> {
  state: AppLoginState = {
    loading: false,
  };

  onPressTaiKhoan = (e: React.KeyboardEvent) => {
    const specialCharRegex = /[a-zA-Z0-9\u00C0-\u024F\u1E00-\u1EFF]/;
    if (!specialCharRegex.test(e.key)) {
      e.preventDefault();
      return false;
    }
  };

  render(): JSX.Element {
    const { onDone } = this.props;
    const onFinish = (values: { username: string; password: string }) => {
      this.setState({ loading: true });
      $api
        .login({ username: values.username, password: values.password })
        .then((resData) => {
          $tools.setAccessToken(resData.accessToken);
          $tools.setUserObject(resData.user);
          onDone(resData.data as UserInfoNS.RootObject);
        })
        .catch(() => {
          message.error('Tài khoản hoặc mật khẩu không chính xác');
        })
        .finally(() => {
          this.setState({ loading: false });
        });
    };

    const onFinishFailed = (errorInfo: unknown) => {
      // console.log('Failed:', errorInfo);
    };
    const handleLoginWithKeycloak = async (accessToken: string) => {
      console.log('access token', accessToken);
      $api
        .loginKeycloak({ accessToken: accessToken, clientPlatform: 'Web' })
        .then((resData) => {
          $tools.setAccessToken(resData.data.accessToken);
          $tools.setUserObject(resData.data.user);
          onDone(resData.data as UserInfoNS.RootObject);
        })
        .catch((e) => {
          console.log('error', e);
          message.error('Tài khoản hoặc mật khẩu không chính xác');
        });
    };
    const { loading } = this.state;
    // const handleLogin = async () => {
    //   const { authCode, event } = await authGitHub();
    //   console.log('auth code', authCode);
    //   console.log('e', event);
    // };
    return (
      <Row
        justify="center"
        align="middle"
        style={{ height: '100%', margin: 'auto' }}
      >
        <Col xs={20} md={12} lg={8} style={{ textAlign: 'center' }}>
          <img
            src={$tools.PTIT_LOGO}
            alt=""
            style={{ height: '120px', marginBottom: '20px' }}
          />
          <Title level={2}>Hệ thống thi trực tuyến</Title>
          <Spin spinning={loading}>
            <Form
              name="basic"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              style={{ marginRight: '18px' }}
            >
              {/*<Form.Item*/}
              {/*  label="Tài khoản"*/}
              {/*  name="username"*/}
              {/*  rules={[*/}
              {/*    {*/}
              {/*      required: true,*/}
              {/*      message: 'Hãy nhập tài khoản!',*/}
              {/*    },*/}
              {/*  ]}*/}
              {/*>*/}
              {/*  <Input onKeyPress={this.onPressTaiKhoan} />*/}
              {/*</Form.Item>*/}

              {/*<Form.Item*/}
              {/*  label="Mật khẩu"*/}
              {/*  name="password"*/}
              {/*  rules={[*/}
              {/*    {*/}
              {/*      required: true,*/}
              {/*      message: 'Hãy nhập mật khẩu!',*/}
              {/*    },*/}
              {/*  ]}*/}
              {/*>*/}
              {/*  <Input.Password />*/}
              {/*</Form.Item>*/}

              {/*<Form.Item*/}
              {/*  wrapperCol={{*/}
              {/*    span: 24,*/}
              {/*  }}*/}
              {/*>*/}
              {/*  <Button*/}
              {/*    type="primary"*/}
              {/*    // htmlType="submit"*/}
              {/*    onClick={() => handleLogin()}*/}
              {/*    style={{ marginLeft: '18px' }}*/}
              {/*  >*/}
              {/*    Đăng nhập*/}
              {/*  </Button>*/}
              {/*</Form.Item>*/}
              <Form.Item
                wrapperCol={{
                  span: 24,
                }}
              >
                <LoginWithKeycloak
                  title="Đăng nhập với Slink ID"
                  onLoginSuccess={handleLoginWithKeycloak}
                />
              </Form.Item>
            </Form>
          </Spin>
        </Col>
      </Row>
    );
  }
}
