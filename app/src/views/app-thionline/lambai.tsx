/* eslint-disable react/prop-types */
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Form,
  Input,
  Radio,
  Statistic,
  Typography,
  message,
  InputNumber,
  Row,
  Col,
  Upload,
  Spin,
  Popconfirm,
  Modal,
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import CauHoiAudio from '@/src/components/cauhoi/CauHoiAudio/CauHoiAudio';
import { CauHoi, DeThi, LoaiCauHoi, NoiDungTraLoi } from './typing';
import CauHoiKeoTha from '@/src/components/cauhoi/CauHoiKeoTha/CauHoiKeoTha';
import { UploadOutlined } from '@ant-design/icons';
import { RcFile, UploadChangeParam } from 'antd/lib/upload';
import CauHoiDienOTrong from '@/src/components/cauhoi/CauHoiDienOTrong/CauHoiDienOTrong';
import axios from 'axios';
import { Rule } from 'antd/lib/form';
import RenderMultimedia from './RenderMultimedia';
import { withStore } from '@/core/store';
import { LichThi } from '@/src/views/app-thionline/app-thionline';

export interface LamBaiProps extends Partial<StoreProps> {
  deThi?: DeThi;
  onThoat: () => void;
  maLopThi: string;
  nganHangDeId: string;
  thoiGianBatDau: moment.MomentInput;
  logs?: string[];
  thoiGianKetThuc: moment.MomentInput;
  idCaThi: string;
  handleSendLogs: () => void;
  lichThi?: LichThi;
}

type FileListType = {
  cauHoiId: string;
  file: RcFile | File | undefined;
};

const { Countdown } = Statistic;

const VALID_EXTENSIONS = ['xls', 'xlsx', 'doc', 'docx', 'pdf'];

const _formatCauTraLoi = (cauTraLoi: string | string[]): string[] => {
  return !Array.isArray(cauTraLoi) ? [cauTraLoi || ''] : cauTraLoi;
};
const LamBai: React.FC<LamBaiProps> = ({
  deThi,
  onThoat,
  maLopThi,
  nganHangDeId,
  thoiGianBatDau,
  thoiGianKetThuc,
  logs,
  dispatch,
  idCaThi,
  handleSendLogs,
  lichThi,
}) => {
  const [form] = Form.useForm();
  const [daLam, setDaLam] = useState(0);
  const [isSpinning, setSpinning] = useState(false);
  const [fileLists, setFileLists] = useState<FileListType[]>([]);
  useEffect(() => {
    console.log(thoiGianKetThuc);
    console.log(idCaThi);
    console.log(thoiGianBatDau);
  }, []);
  const updateDaLam = () => {
    const value =
      form.getFieldValue('noiDungTraLoi')?.filter((x: NoiDungTraLoi) => {
        if (
          x?.loai === LoaiCauHoi.KeoTha ||
          x?.loai === LoaiCauHoi.DienOTrong ||
          x?.loai === LoaiCauHoi.NgheDienTu
        ) {
          return x?.cauTraLoi?.find((traLoi) => !!traLoi);
        }
        return x?.cauTraLoi?.length;
      })?.length ?? 0;
    setDaLam(value);
  };

  const updateFileLists = (
    cauHoiId: string,
    file: RcFile | File | undefined
  ) => {
    let found = false;
    const updatedFileLists = fileLists.map((fileItem) => {
      if (fileItem.cauHoiId !== cauHoiId) {
        return fileItem;
      }
      found = true;
      return {
        ...fileItem,
        file,
      };
    });
    if (!found) {
      updatedFileLists.push({
        cauHoiId,
        file,
      });
    }
    setFileLists(updatedFileLists);

    const formValues = form.getFieldsValue();
    const noiDungTraLoi = formValues?.noiDungTraLoi?.map(
      (item: NoiDungTraLoi) => {
        if (item.cauHoiId !== cauHoiId) {
          return item;
        }
        return {
          ...item,
          cauTraLoi: file?.name ?? '',
        };
      }
    );
    form.setFieldsValue({ noiDungTraLoi });
    updateDaLam();
  };

  const onOpenFileDialog = () => {
    const newArr = [
      'Người dùng chọn thao tác tải file ' + new Date().toLocaleTimeString(),
    ].concat(logs || '');
    dispatch?.({
      type: 'ACTION_SAVE_LOGS',
      data: newArr,
    });
  };

  const handleFileUpload = (cauHoiId: string, file: RcFile) => {
    const names = file.name.split('.');
    const fileExt = names[names.length - 1];
    const fileType = file.type.split('/')[0];
    const validFileExt =
      fileType === 'image' || VALID_EXTENSIONS.includes(fileExt);
    if (!validFileExt) {
      message.error(
        'Bạn chỉ có thể chọn ảnh hoặc file có định dạng doc, xls, pdf!'
      );
      return Upload.LIST_IGNORE;
    }
    const isLt20M = file.size / 1024 / 1024 < 20;
    if (!isLt20M) {
      message.error('Dung lượng file phải nhỏ hơn 20MB!');
      return Upload.LIST_IGNORE;
    }
    updateFileLists(cauHoiId, file);
    return false;
  };

  const onStopRecording = (data: any, cauHoi: CauHoi) => {
    const file = new File([data.blob], `${cauHoi._id}.wav`, {
      type: data.type,
    });
    updateFileLists(cauHoi._id, file);
  };

  const onFinish = async (values: {
    noiDungTraLoi: (NoiDungTraLoi & { cauTraLoi: string })[];
  }) => {
    // console.log('Success:', values);
    // console.log('maLopThi, ngangHangDeId :>> ', maLopThi, nganHangDeId);
    setSpinning(true);
    const urls = await Promise.all(
      fileLists.map(async (file) => {
        if (!file.file) {
          return {
            cauHoiId: file.cauHoiId,
            url: '',
          };
        }
        const formData = new FormData();
        formData.append('fileUpload', file.file);
        // const result = await $api.uploadFile(formData);
        const urlPath = `${process.env.API_PROTOCOL}${process.env.API_HOST}/upload-chung/general`;
        const result = await axios.post(urlPath, formData, {
          headers: {
            Authorization: `Bearer ${$tools.getAccessToken()}`,
            'Content-Type': 'application/json',
          },
        });
        const url = result.data?.data || '';
        return {
          cauHoiId: file.cauHoiId,
          url,
        };
      })
    );

    $api
      .nopBaiThi({
        maLopThi,
        nganHangDeId,
        noiDungTraLoi: values?.noiDungTraLoi?.map((noiDungTraLoi) => {
          let cauTraLoi = noiDungTraLoi.cauTraLoi;
          if (noiDungTraLoi.loai === 7 || noiDungTraLoi.loai === 8) {
            const url = urls.find(
              (item) => item.cauHoiId === noiDungTraLoi.cauHoiId
            );
            cauTraLoi = url?.url ?? '';
          }
          return {
            ...noiDungTraLoi,
            cauTraLoi: _formatCauTraLoi(cauTraLoi),
          };
        }),
      })
      .then((data) => {
        console.log('data nop bai form :>> ', data);
        console.log('????????????????????', logs);
        message.success('Chúc mừng bạn đã hoàn thành bài thi');
        setSpinning(false);
        onThoat();
        // $api
        //   .postLogGiamSat({ log: logs || [] })
        //   .then((logNopBai) => {
        //     console.log('logNopBai :>> ', logNopBai);
        //     message.success('Chúc mừng bạn đã hoàn thành bài thi');
        //     setSpinning(false);
        //     onThoat();
        //   })
        //   .catch((err) => {
        //     // console.log(err);
        //     setSpinning(false);
        //     message.error('Nộp bài không thành công, bạn hãy thử lại');
        //   });
      })
      .catch((err) => {
        // console.log(err);
        setSpinning(false);
        message.error('Nộp bài không thành công, bạn hãy thử lại');
      });
  };
  useEffect(() => {
    const intervalLog = setInterval(() => {
      console.log('send log');
      console.log('log kaka=====', logs);
      handleSendLogs();
    }, 30000);
    return () => {
      clearInterval(intervalLog);
    };
  }, []);
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    setSpinning(false);
  };

  const handleTimeout = () => {
    onFinish(form.getFieldsValue(true));
  };

  const getDapAnRules = (cauHoi: CauHoi): Rule[] => {
    const rules: Rule[] = [];
    if (cauHoi?.noiDung?.isRequired) {
      rules.push({ required: true, message: 'Bạn chưa trả lời câu hỏi này' });
    }
    if (cauHoi?.noiDung?.loai === LoaiCauHoi.ShortText) {
      rules.push({ max: 255, message: 'Câu trả lời không được quá 255 ký tự' });
    }
    return rules;
  };

  const renderNoiDungCauHoi = (cauHoi: CauHoi) => {
    // if (cauHoi?.noiDung?.loai === LoaiCauHoi.Audio) {
    //   return <RenderMultimedia src={cauHoi?.noiDung?.cauHoi} />;
    // }

    // if (cauHoi?.noiDung?.loai === LoaiCauHoi.NgheDienTu) {
    //   return <RenderMultimedia src={cauHoi?.noiDung?.audio} />;
    // }

    if (cauHoi?.tepDinhKem?.length > 0) {
      return (
        <>
          <span style={{ color: '#C01718' }}>{cauHoi?.noiDung?.cauHoi}</span>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {cauHoi?.tepDinhKem?.map((x: string) => (
              <img
                key={x}
                src={x}
                alt=""
                style={{ width: '250px', marginBottom: '8px', padding: '10px' }}
              />
            ))}
          </div>
        </>
      );
    } else
      return (
        <span
          style={{ color: '#C01718' }}
          dangerouslySetInnerHTML={{ __html: cauHoi?.noiDung?.cauHoi }}
        />
      );

    // if (
    //   cauHoi?.noiDung?.loai === LoaiCauHoi.KeoTha ||
    //   cauHoi?.noiDung?.loai === LoaiCauHoi.DienOTrong
    // ) {
    //   return null;
    // }
  };

  const renderDapAn = (cauHoi: CauHoi) => {
    switch (cauHoi?.noiDung?.loai) {
      case LoaiCauHoi.ChonMotDapAn:
      case LoaiCauHoi.HinhAnhNghe:
        return (
          <Radio.Group>
            {cauHoi?.noiDung?.cauTraLoi?.map((dapAn, indexDapAn) => (
              <div style={{ marginTop: 10 }} key={indexDapAn}>
                <span>
                  <Radio value={dapAn?.luaChon}>
                    <span
                      dangerouslySetInnerHTML={{ __html: dapAn?.luaChon }}
                    ></span>{' '}
                  </Radio>
                </span>
              </div>
            ))}
          </Radio.Group>
        );
      case LoaiCauHoi.ChonNhieuDapAn:
        return (
          <Checkbox.Group
            className="group-multichoice"
            options={cauHoi?.noiDung?.cauTraLoi?.map((dapAn) => dapAn?.luaChon)}
          />
        );
      case LoaiCauHoi.ShortText:
        return <Input style={{ marginTop: '10px' }} />;
      case LoaiCauHoi.Textarea:
        return <Input.TextArea style={{ marginTop: '10px' }} />;
      case LoaiCauHoi.DienOTrong:
      case LoaiCauHoi.NgheDienTu:
        return <CauHoiDienOTrong cauHoi={cauHoi} />;
      case LoaiCauHoi.KeoTha:
        return <CauHoiKeoTha cauHoi={cauHoi} />;
      case LoaiCauHoi.Audio:
        return <CauHoiAudio onStop={(data) => onStopRecording(data, cauHoi)} />;
      case LoaiCauHoi.File:
        return (
          <div style={{ marginTop: '10px' }}>
            <Upload
              className="lam-bai-upload"
              beforeUpload={(file) => handleFileUpload(cauHoi._id, file)}
            >
              <Button icon={<UploadOutlined />} onClick={onOpenFileDialog}>
                {' '}
                Tải file lên
              </Button>
            </Upload>
          </div>
        );
      default:
        return null;
    }
  };
  const onConfirm = () => {};
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };
  const checkValidate = (): boolean => {
    let check = true;
    if (form.getFieldValue('noiDungTraLoi')) {
      const arr = form.getFieldValue('noiDungTraLoi');
      arr.map((value: any) => {
        if (!value.cauTraLoi || value.cauTraLoi === '') {
          check = false;
        }
      });
    } else {
      check = false;
    }
    return check;
  };
  const handleOk = () => {
    if (checkValidate()) {
      form.submit();
    } else {
      message.warn('Vui lòng trả lời hết các câu hỏi!');
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleSend = () => {
    setIsModalVisible(true);
    if (form.getFieldValue('noiDungTraLoi')) {
      console.log('kakaaaaaa', form.getFieldValue('noiDungTraLoi'));
    }
  };
  return (
    <Spin
      spinning={isSpinning}
      tip="Bài làm của bạn đang được nộp. Xin vui lòng chờ sau giây lát."
    >
      <Card bordered>
        <Row
          justify="space-between"
          style={{
            position: 'sticky',
            top: '0',
            backgroundColor: '#FAFAFA',
            zIndex: 999,
          }}
        >
          <Col style={{ marginTop: '5px' }}>
            <div>
              <div style={{ display: 'flex' }}>
                <p style={{ marginRight: '20px' }}>Môn: {lichThi?.maMonHoc}</p>{' '}
                <p>Nhóm: {lichThi?.tenDe}</p>
              </div>
              <div style={{ display: 'flex' }}>
                <p>
                  Thời gian bắt đầu:{' '}
                  {moment(lichThi?.ngayGioThi).format('HH:mm DD/MM/YYY')}
                </p>
              </div>
              <div style={{ display: 'flex' }}>
                <p>Tổng số câu: {deThi?.noiDungDe?.length}</p>
              </div>
              <div>
                {/*<b style={{ fontSize: '17px' }}>*/}
                {/*  Danh sách câu hỏi:*/}
                <p style={{ fontSize: '13px', color: '#C01718' }}>
                  <i>
                    (Số câu đã làm: {daLam}/{deThi?.noiDungDe?.length})
                  </i>
                </p>
                {/*</b>*/}
              </div>
            </div>
          </Col>
          <Col style={{ marginTop: '5px' }}>
            {!deThi?.daLam && (
              <div>
                Thời gian còn lại
                <Countdown
                  value={moment(thoiGianKetThuc).unix() * 1000}
                  onFinish={() => handleTimeout()}
                />
              </div>
            )}
          </Col>
          <Divider type="horizontal" />
        </Row>

        {!!deThi?.daLam ? (
          <div>
            <Typography.Text>Bạn đã hoàn thành bài thi này!</Typography.Text>
            <Divider type="horizontal" />
            <Button type="primary" onClick={() => onThoat()}>
              Thoát
            </Button>
          </div>
        ) : (
          <Form
            style={{
              marginTop: '16px',
            }}
            name="basic"
            form={form}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            // initialValues={{}}
            onFinish={onFinish}
            scrollToFirstError={true}
            onFinishFailed={onFinishFailed}
            onValuesChange={updateDaLam}
          >
            {deThi?.noiDungDe?.map((cauHoi, index) => (
              <div key={index}>
                <div>
                  <b>
                    <u>
                      Câu {index + 1}
                      {cauHoi?.noiDung?.isRequired && (
                        <span style={{ color: '#C01718' }}>*</span>
                      )}
                    </u>
                    :&nbsp;
                    {cauHoi?.noiDung?.moTa ?? ''}
                  </b>
                </div>
                <div>{renderNoiDungCauHoi(cauHoi)}</div>
                <Form.Item
                  // label="Username"
                  name={['noiDungTraLoi', index, 'cauTraLoi']}
                  rules={getDapAnRules(cauHoi)}
                >
                  {renderDapAn(cauHoi)}
                </Form.Item>
                <Form.Item
                  // label="Username"
                  name={['noiDungTraLoi', index, 'cauHoiId']}
                  hidden
                  initialValue={cauHoi?._id}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  // label="Username"
                  name={['noiDungTraLoi', index, 'cauHoi']}
                  hidden
                  initialValue={cauHoi?.noiDung?.cauHoi}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  // label="Username"
                  name={['noiDungTraLoi', index, 'loai']}
                  hidden
                  initialValue={cauHoi?.noiDung?.loai}
                >
                  <InputNumber />
                </Form.Item>

                <Form.Item
                  // label="Username"
                  name={['noiDungTraLoi', index, 'maLopThi']}
                  hidden
                  initialValue={maLopThi}
                >
                  <Input />
                </Form.Item>
              </div>
            ))}

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button
                type="primary"
                // htmlType="submit"
                onClick={() => handleSend()}
              >
                Nộp bài
              </Button>
            </Form.Item>
            <Modal
              title="Xem lại bài thi của bạn"
              visible={isModalVisible}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              {/*{form.getFieldValue('noiDungTraLoi')}*/}
              <div style={{ maxHeight: '500px', overflowY: 'scroll' }}>
                {form
                  .getFieldValue('noiDungTraLoi')
                  ?.map((cauHoi: any, index: any) => (
                    <div key={index}>
                      <div>
                        <b>
                          <u>
                            Câu {index + 1}
                            {cauHoi?.cauHoi && (
                              <span style={{ color: '#C01718' }}>*</span>
                            )}
                          </u>
                          :&nbsp;
                          <span
                            style={{ color: '#C01718' }}
                            dangerouslySetInnerHTML={{ __html: cauHoi?.cauHoi }}
                          />
                          {/*<p>{cauHoi?.cauHoi}</p>*/}
                        </b>
                      </div>
                      {/*<div>{renderNoiDungCauHoi(cauHoi)}</div>*/}
                      <div>Trả lời: {cauHoi?.cauTraLoi}</div>
                      <Form.Item
                        // label="Username"
                        name={['noiDungTraLoi', index, 'cauTraLoi']}
                        rules={getDapAnRules(cauHoi)}
                      >
                        {renderDapAn(cauHoi)}
                      </Form.Item>
                      <Form.Item
                        // label="Username"
                        name={['noiDungTraLoi', index, 'cauHoiId']}
                        hidden
                        initialValue={cauHoi._id}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        // label="Username"
                        name={['noiDungTraLoi', index, 'cauHoi']}
                        hidden
                        initialValue={cauHoi?.noiDung?.cauHoi}
                      >
                        <Input />
                      </Form.Item>
                    </div>
                  ))}
              </div>
            </Modal>
          </Form>
        )}
      </Card>
    </Spin>
  );
};
export default LamBai;
