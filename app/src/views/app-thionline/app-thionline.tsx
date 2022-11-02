/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { withStore } from '@/core/store';
import { Proctor } from '@/src/components/app-proctor/app-proctor';
import { UserInfo } from '@/src/components/user-info';
import { SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Drawer,
  Modal,
  message,
  Row,
  Spin,
  Table,
  Select,
  Card,
} from 'antd';
import { ColumnType } from 'antd/es/table/interface';
import moment from 'moment';
import React, { ReactNode } from 'react';
import { ChonLichThi } from './chonlichthi';
import { DeThi } from './typing';
import './index.less';
import LamBai from '@/src/views/app-thionline/lambai';

interface AppThiOnlineProps extends Partial<StoreProps> {
  user: StoreStates['user'];
  trangThaiThi?: StoreStates['trangThaiThi'];
  logs?: StoreStates['logs'];
}

export interface LichThi {
  createdAt: moment.MomentInput;
  loaiDeThi: string;
  maKyHoc: string;
  trangThai: string;
  maMonHoc: string;
  maLopHoc: string;
  ngayGioThi: moment.MomentInput;
  ngayGioThiKetThuc: moment.MomentInput;
  updatedAt: moment.MomentInput;
  __v: number;
  _id: string;
  daLam: boolean;
  tenDe: string;
}

interface AppThiOnlineState {
  loading: boolean;
  dsMonHoc: InfoLopHoc[];
  dsCaThi: InfoCaThi[];
  dsKyHoc: InfoKyHoc[];
  modalChonLichThi: boolean;
  dsLichThi: LichThi[];
  loadingGiamSat: boolean;
  kyHoc: string;
  lichThi: LichThi;
}
export interface InfoKyHoc {
  id: number;
  nam_hoc_id: any;
  ten_ky_nam_hoc: string;
  ma_ky_nam_hoc: string;
  thoi_gian_bat_dau: string;
  thoi_gian_ket_thuc: string;
  hinh_thuc_dao_tao_id: any;
  soThuTu: number;
}
export interface InfoLopHoc {
  maMonHoc: string;
  soTinChi: number;
  tenMonHoc: string;
  coLichThi: boolean;

  id: number;
  ma_hoc_phan_moi: string;
  so_tin_chi: number;
  ten_hoc_phan: string;
}
export interface InfoCaThi {
  _id: string;
  loaiDeThi: string;
  loaiGiamSat: string[];
  isAllLop: true;
  tenDe: string;
  maMonHoc: string;
  maKyHoc: string;
  ngayGioThi: string;
  ngayGioThiKetThuc: string;
  listLopThi: {
    _id: string;
    maLopThi: string;
  }[];
  maLopHoc: string;
  trangThai: string;
  idNguoiTao: string;
  createdAt: string;
  updatedAt: string;
  __v: 0;
  daLam: boolean;
}

@withStore(['trangThaiThi', 'logs', 'user'])
export default class AppThiOnline extends React.Component<
  AppThiOnlineProps,
  AppThiOnlineState
> {
  state: AppThiOnlineState = {
    loading: false,
    dsMonHoc: [],
    dsCaThi: [],
    dsKyHoc: [],
    modalChonLichThi: false,
    dsLichThi: [],
    loadingGiamSat: true,
    kyHoc: '20202',
    lichThi: {
      createdAt: '',
      loaiDeThi: '',
      maKyHoc: '',
      trangThai: '',
      maMonHoc: '',
      maLopHoc: '',
      ngayGioThi: '',
      ngayGioThiKetThuc: '',
      updatedAt: '',
      __v: 0,
      _id: '',
      daLam: false,
      tenDe: '',
    },
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async componentDidMount() {
    this.setState({ loading: true });

    // $api
    //   .getDanhSachMonHoc(
    //     { page: 1, limit: 1000, cond: {}, maKyHoc: '20202' },
    //     { method: 'GET' }
    //   )
    //   .then((data) => {
    //     console.log('data ds mon hoc', data);
    //     this.setState({
    //       dsMonHoc: (data.data.result as InfoLopHoc[])
    //         // .filter((s) => !!s.coLichThi)
    //         .filter((s) =>
    //           ['INT1330', 'INT1319', 'INT1154'].includes(s.ma_hoc_phan_moi)
    //         )
    //         .map((val, i) => ({
    //           ...val,
    //           index: i + 1,
    //           key: i + 1,
    //         })),
    //     });
    //   })
    //   .catch((err) => {
    //     console.log('err', err);
    //   })
    //   .finally(() => {
    //     this.setState({ loading: false });
    //   });
    this.handleGetDanhSachCaThi(this.state.kyHoc);
    $api
      .getDanhSachKyHoc({ idHinhThuc: undefined }, { method: 'GET' })
      .then((data) => {
        console.log('data ds ky hoc', data);
        this.setState({
          dsKyHoc: data.data as InfoKyHoc[],
        });
      })
      .catch((err) => {
        console.log('err', err);
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }
  handleGetDanhSachCaThi = (kyHoc: string) => {
    console.log('ky hoc', kyHoc);
    $api
      .getDanhSachCaThi({ condition: { maKyHoc: kyHoc } }, { method: 'GET' })
      .then((data) => {
        console.log('data ds ca thi', data);
        this.setState({
          dsCaThi: (data.data as InfoCaThi[]).map((val, i) => ({
            ...val,
            index: i + 1,
            key: i + 1,
          })),
        });
      })
      .catch((err) => {
        console.log('err', err);
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };
  componentWillUnmount() {
    // console.log('Appthionline unmount');
    this.handleThoatBaiThi();
  }

  handleXemLichThi = (lopHoc: InfoLopHoc): void => {
    console.log('first', lopHoc);

    this.setState({ loading: true });
    $api
      .getDanhSachLichThi(
        {
          page: 1,
          limit: 1000,
          cond: {},
          maKyHoc: '20202',
          maMonHoc: lopHoc.ma_hoc_phan_moi,
        },
        { method: 'GET' }
      )
      .then((data) => {
        console.log(`data`, data);
        this.setState({
          dsLichThi: (data.data as unknown as LichThi[])
            .map((val, i) => ({
              ...val,
              index: i + 1,
            }))
            ?.filter((x) => x?.trangThai === 'Đã duyệt'),
          modalChonLichThi: true,
        });
      })
      .catch((e) => {
        console.log(`e`, e);
        message.error('Thao tác gặp lỗi');
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };
  handleVaoCaThi = (caThi: InfoCaThi) => {
    const lichThi: LichThi = {
      createdAt: caThi.createdAt,
      loaiDeThi: caThi.loaiDeThi,
      maKyHoc: caThi.maKyHoc,
      trangThai: caThi.trangThai,
      maMonHoc: caThi.maMonHoc,
      maLopHoc: caThi.maLopHoc,
      ngayGioThi: caThi.ngayGioThi,
      ngayGioThiKetThuc: caThi.ngayGioThiKetThuc,
      updatedAt: caThi.updatedAt,
      __v: caThi.__v,
      _id: caThi._id,
      daLam: caThi.daLam,
      tenDe: caThi.tenDe,
    };
    this.setState({
      lichThi: lichThi,
    });
    this.xacNhanVaoThi(lichThi);
  };
  xacNhanVaoThi = (lichThi: LichThi) => {
    if ($tools.getUserObject().anhDaiDien) {
      this.handleVaoThi(lichThi);
      return;
    }
    Modal.confirm({
      className: 'modal-xac-nhan-thi',
      title: 'Xác nhận làm bài thi không có ảnh đại diện.',
      content:
        'Bạn chưa có ảnh đại diện. Xác nhận làm bài thi không có ảnh đại diện?',
      onOk: () => this.handleVaoThi(lichThi),
    });
  };

  handleVaoThi = (lichThi: LichThi): void => {
    this.setState({ loading: true });

    this.props.dispatch?.({
      type: 'ACTION_SAVE_LOGS',
      data: [],
    });
    console.log('ma lop', lichThi.maLopHoc);
    $api
      .getDeThi(lichThi._id, { method: 'GET' })
      .then((data) => {
        console.log('data :>> ', data);
        this.props.dispatch?.({
          type: 'ACTION_SAVE_TRANGTHAITHI',
          data: {
            idCaThi: lichThi._id,
            dangThi: true,
            thoiGianBatDau: lichThi.ngayGioThi,
            thoiGianKetThuc: lichThi.ngayGioThiKetThuc,
            deThi: data?.data as unknown as DeThi,
            maLopThi: lichThi.maLopHoc,
            nganHangDeId: lichThi._id,
          },
        });
      })
      .catch((e) => {
        console.log(`e`, e);

        message.error('Thao tác gặp lỗi');
      })
      .finally(() => {
        this.setState({ loading: false });
      });

    this.handleCloseModal();

    // TODO: xu ly vao thi
    // console.log('handle vào thi', lichThi);
  };

  handleThoatBaiThi = (): void => {
    this.props.dispatch?.({
      type: 'ACTION_SAVE_TRANGTHAITHI',
      data: undefined,
    });
    this.props.dispatch?.({
      type: 'ACTION_SAVE_LOGS',
      data: [],
    });
    this.handleGetDanhSachCaThi(this.state.kyHoc);
  };

  handleCloseModal = (): void => {
    this.setState({
      modalChonLichThi: false,
    });
  };
  handleChangeCourse = (value: string) => {
    this.setState({
      kyHoc: value,
    });
    this.handleGetDanhSachCaThi(value);
  };
  handleSendLogs = () => {
    console.log('logs new', this.props.logs);
    $api
      .postLogGiamSat({
        log: this.props.logs || [],
        idCaThi: this.props?.trangThaiThi?.idCaThi as string,
      })
      .then((logNopBai) => {
        console.log('logNopBai :>> ', logNopBai);
        // message.success('Send log thanfh coong');
      })
      .catch((err) => {
        // console.log(err);
        message.error('Lỗi send log');
      });
  };
  handleReload = () => {
    this.handleGetDanhSachCaThi(this.state.kyHoc);
  };
  render(): JSX.Element {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { Option } = Select;
    const renderLast = (value: unknown, record: InfoCaThi) => {
      if (record.daLam) {
        return (
          <div style={{ display: 'flex' }}>
            <Button type="dashed" danger>
              Đã làm bài
            </Button>
            {/*<Button style={{ marginLeft: '8px' }} type="primary">*/}
            {/*  Xem lại bài đã làm*/}
            {/*</Button>*/}
          </div>
        );
      } else {
        if (
          moment().isAfter(moment(new Date(record.ngayGioThiKetThuc)))
          // moment(new Date(record.ngayGioThiKetThuc), 'HH:mm DD/MM/YYYY').diff(
          //   moment(new Date(), 'HH:mm DD/MM/YYYY'),
          //   'minute'
          // ) < 0
        ) {
          return (
            <React.Fragment>
              <Button type="ghost">Đã kết thúc</Button>
            </React.Fragment>
          );
        }
        if (
          moment().isBefore(new Date(record.ngayGioThi))
          // moment(new Date(record.ngayGioThi), 'HH:mm DD/MM/YYYY').diff(
          //   moment(new Date(), 'HH:mm DD/MM/YYYY'),
          //   'minute'
          // ) > 0
        ) {
          return (
            <React.Fragment>
              <Button type="ghost">Chưa đến thời gian thi</Button>
            </React.Fragment>
          );
        } else {
          return (
            <React.Fragment>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={() => this.handleVaoCaThi(record)}
              >
                Vào thi
              </Button>
            </React.Fragment>
          );
        }
      }
    };

    // const columns: ColumnType<InfoLopHoc>[] = [
    //   {
    //     title: 'STT',
    //     dataIndex: 'index',
    //     align: 'center',
    //     width: 80,
    //   },
    //   {
    //     title: 'Tên học phần',
    //     dataIndex: 'ten_hoc_phan',
    //     //   search: 'search',
    //     align: 'center',
    //     //    width: 400,
    //   },
    //   {
    //     title: 'Mã học phần',
    //     dataIndex: 'ma_hoc_phan_moi',
    //     align: 'center',
    //     width: 200,
    //   },
    //   {
    //     title: 'Số tín chỉ',
    //     dataIndex: 'so_tin_chi',
    //     width: 150,
    //     align: 'center',
    //   },
    //   {
    //     title: 'Thao tác',
    //     align: 'center',
    //     render: (value, record) => renderLast(value, record),
    //     fixed: 'right',
    //     width: 160,
    //   },
    // ];
    const columns: ColumnType<InfoCaThi>[] = [
      {
        title: 'STT',
        dataIndex: 'index',
        align: 'center',
        width: 80,
      },
      {
        title: 'Ca thi',
        dataIndex: 'tenDe',
        //   search: 'search',
        align: 'center',
        //    width: 400,
      },
      {
        title: 'Mã học phần',
        dataIndex: 'maMonHoc',
        align: 'center',
        width: 200,
      },
      {
        title: 'Giờ thi',
        dataIndex: 'ngayGioThi',
        width: 150,
        align: 'center',
        render: (value) => moment(value).format('HH:mm DD/MM/YYYY'),
      },
      {
        title: 'Giờ kết thúc',
        dataIndex: 'ngayGioThiKetThuc',
        width: 150,
        align: 'center',
        render: (value) => moment(value).format('HH:mm DD/MM/YYYY'),
      },
      {
        title: 'Thao tác',
        align: 'center',
        render: (value, record) => renderLast(value, record),
        // fixed: 'right',
        width: 160,
      },
    ];
    const { modalChonLichThi } = this.state;
    const { trangThaiThi, logs, user, dispatch } = this.props;
    const titleCard: ReactNode = (
      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <Select
          defaultValue={''}
          style={{ width: 250 }}
          onChange={this.handleChangeCourse}
        >
          {this.state.dsKyHoc.map((value, i) => {
            return (
              <Option value={value.ma_ky_nam_hoc} key={i}>
                {value.nam_hoc_id[1]} - Kỳ {value.ten_ky_nam_hoc} -
                {value.hinh_thuc_dao_tao_id[1]}
              </Option>
            );
          })}
        </Select>
        <Button
          style={{ marginLeft: '20px' }}
          type={'default'}
          onClick={() => this.handleReload()}
        >
          Làm mới
        </Button>
      </div>
    );
    console.log('user', user);
    let ConditonalBlock: JSX.Element;
    if (trangThaiThi?.dangThi) {
      console.log(`trangThaiThi`, trangThaiThi);
      ConditonalBlock = (
        <Spin
          spinning={this.state.loadingGiamSat && !trangThaiThi?.deThi?.daLam}
          tip="Đang cài đặt phần mềm giám sát.."
        >
          <Row>
            <Col xs={24} md={12} lg={18}>
              <LamBai
                lichThi={this.state.lichThi}
                logs={this.props?.logs}
                dispatch={dispatch}
                deThi={trangThaiThi?.deThi}
                onThoat={this.handleThoatBaiThi}
                maLopThi={trangThaiThi.maLopThi ?? ''}
                nganHangDeId={trangThaiThi.nganHangDeId ?? ''}
                thoiGianBatDau={trangThaiThi.thoiGianBatDau ?? ''}
                thoiGianKetThuc={
                  trangThaiThi.thoiGianKetThuc
                    ? trangThaiThi.thoiGianKetThuc
                    : ''
                }
                idCaThi={trangThaiThi.idCaThi ? trangThaiThi.idCaThi : ''}
                handleSendLogs={this.handleSendLogs}
              />
            </Col>
            <Col xs={24} md={12} lg={6}>
              {!!trangThaiThi?.deThi?.daLam ? (
                <div />
              ) : (
                <div>
                  <UserInfo user={user} dispatch={this.props.dispatch} />
                  <Proctor
                    onReady={() => {
                      this.setState({ loadingGiamSat: false });
                    }}
                  />
                </div>
              )}
            </Col>
          </Row>
        </Spin>
      );
    } else
      ConditonalBlock = (
        <Row gutter={24} style={{ marginTop: '20px' }}>
          <Col xs={24} md={12} lg={18}>
            <Spin spinning={this.state.loading}>
              <Drawer
                title="Chọn lịch thi"
                visible={modalChonLichThi}
                destroyOnClose
                width="60%"
                bodyStyle={{ backgroundColor: 'white' }}
                onClose={() => this.handleCloseModal()}
                footer={
                  <div
                    style={{
                      textAlign: 'right',
                    }}
                  >
                    <Button
                      onClick={() => this.handleCloseModal()}
                      style={{ marginRight: 8 }}
                    >
                      Đóng
                    </Button>
                  </div>
                }
              >
                <ChonLichThi
                  dsLichThi={this.state.dsLichThi}
                  onVaoThi={this.xacNhanVaoThi}
                />
              </Drawer>
              {/*<Table columns={columns} dataSource={this.state.dsMonHoc} />*/}
              <Card bodyStyle={{ padding: '20px' }} title={titleCard}>
                {/*<div style={{ marginTop: '20px', marginBottom: '20px' }}>*/}
                {/*  <Select*/}
                {/*    defaultValue="20202"*/}
                {/*    style={{ width: 200 }}*/}
                {/*    onChange={this.handleChangeCourse}*/}
                {/*  >*/}
                {/*    {this.state.dsKyHoc.map((value, i) => {*/}
                {/*      return (*/}
                {/*        <Option value={value.ma_ky_nam_hoc} key={i}>*/}
                {/*          {value.nam_hoc_id[1]} - Kỳ {value.ten_ky_nam_hoc}*/}
                {/*        </Option>*/}
                {/*      );*/}
                {/*    })}*/}
                {/*  </Select>*/}
                {/*  <Button*/}
                {/*    style={{ marginLeft: '20px' }}*/}
                {/*    type={'default'}*/}
                {/*    onClick={() => this.handleReload()}*/}
                {/*  >*/}
                {/*    Làm mới*/}
                {/*  </Button>*/}
                {/*</div>*/}
                <Table columns={columns} dataSource={this.state.dsCaThi} />
              </Card>
            </Spin>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <UserInfo user={user} dispatch={this.props.dispatch} />
          </Col>
        </Row>
      );

    return <div style={{ margin: '0 20px' }}>{ConditonalBlock}</div>;
  }
}
