/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { withStore } from '@/core/store';
import { Card, Col, Divider, List, message, Row, Spin } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { ipcRenderer } from 'electron';
import * as faceApi from 'face-api.js';
import * as React from 'react';

interface ProctorProps extends Partial<StoreProps> {
  // user: StoreStates['user'];
  trangThaiThi?: StoreStates['trangThaiThi'];
  onReady: () => void;
  logs?: StoreStates['logs'];
  usbList?: StoreStates['usbList'];
  clickCount?: StoreStates['clickCount'];
}
// Bang chung gui ve server gom buffer va ten.
@withStore(['logs', 'usbList', 'clickCount'])
export class Proctor extends React.Component<ProctorProps> {
  faceMatcher!: faceApi.FaceMatcher;
  mediaStream!: MediaStream;
  canvas: React.RefObject<HTMLCanvasElement> = React.createRef();
  referenceImage: React.RefObject<HTMLImageElement> = React.createRef();
  video: React.RefObject<HTMLVideoElement> = React.createRef();

  state: {
    // log: string[];
    logSize: any;
    loadingModel: boolean;
    loadingPercentage: number;
  } = {
    // log: [],
    logSize: 3,
    loadingModel: true,
    loadingPercentage: 0,
  };

  timeoutPlay1: NodeJS.Timeout | undefined;
  timeoutPlay2: NodeJS.Timeout | undefined;
  timeoutPlay3: NodeJS.Timeout | undefined;

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  componentDidMount() {
    console.log('before runn');
    this.run();
    console.log('after runnn');
    // this.props.onReady();
  }

  componentWillUnmount() {
    if (this.mediaStream !== undefined) {
      this.mediaStream.getTracks().forEach(function (track) {
        if (track.readyState == 'live') {
          track.stop();
        }
        track.stop();
      });
    }
    ipcRenderer.removeAllListeners('update-proctor');
    ipcRenderer.removeAllListeners('blur');
    if (this.timeoutPlay1) clearTimeout(this.timeoutPlay1);
    if (this.timeoutPlay2) clearTimeout(this.timeoutPlay2);
    if (this.timeoutPlay3) clearTimeout(this.timeoutPlay3);
  }

  updateLoadingPercentage = (percent: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      this.setState(
        {
          loadingPercentage: percent,
        },
        resolve
      );
    });
  };

  run = async () => {
    try {
      ipcRenderer.on('mouseclick', (event, args) => {
        const newValue = (this.props.clickCount || 0) + 1;
        console.log(newValue);
        this.props.dispatch?.({
          type: 'ACTION_SAVE_CLICK_COUNT',
          data: newValue,
        });
      });
      ipcRenderer.on('blur', (event: any, args: string) => {
        const newArr = [args].concat(this.props.logs || '');
        this.props.dispatch?.({
          type: 'ACTION_SAVE_LOGS',
          data: newArr,
        });
      });
      ipcRenderer.on('update-proctor', (event: any, args: any[]) => {
        console.log('args :>> ', args);
        if (args[1] > 1) {
          const newArr = [
            'Dùng nhiều màn hình ' + new Date().toLocaleTimeString(),
          ].concat(this.props.logs || '');
          this.props.dispatch?.({
            type: 'ACTION_SAVE_LOGS',
            data: newArr,
          });
        }
        if (args[2] === false) {
          const newArr = [
            'Không phóng to cửa sổ: ' + new Date().toLocaleTimeString(),
          ].concat(this.props.logs || '');
          this.props.dispatch?.({
            type: 'ACTION_SAVE_LOGS',
            data: newArr,
          });
        }
        if (args[3] !== '') {
          const newArr = [
            'Danh sách thiết bị USB: ' +
              args[3] +
              ': ' +
              new Date().toLocaleTimeString(),
          ].concat(this.props.usbList || '');
          this.props.dispatch?.({
            type: 'ACTION_SAVE_USB_LIST',
            data: newArr,
          });
        }
        // console.log('logs', this.props.logs);
        // console.log(this.props.usbList);
      });

      try {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (this.video.current !== null) {
          this.video.current.srcObject = this.mediaStream;
        }
      } catch (err) {
        // console.log(err);
        message.error(
          'Kiểm tra lại kết nối webcam của bạn. Tắt các ứng dụng khác đang sử dụng webcam nếu có.'
        );
      }

      this.props.onReady();
      console.log($tools.getUserObject().anhDaiDien);
      // if ($tools.getUserObject().anhDaiDien) {
      //   faceApi.env.monkeyPatch({
      //     Canvas: HTMLCanvasElement,
      //     Image: HTMLImageElement,
      //     ImageData: ImageData,
      //     Video: HTMLVideoElement,
      //     createCanvasElement: () => document.createElement('canvas'),
      //     createImageElement: () => document.createElement('img'),
      //   });
      //   await faceApi.nets.tinyFaceDetector.loadFromUri('../../assets/models');
      //   await this.updateLoadingPercentage(25);
      //   await faceApi.nets.faceRecognitionNet.loadFromUri(
      //     '../../assets/models'
      //   );
      //   await this.updateLoadingPercentage(50);
      //   await faceApi.nets.faceLandmark68Net.loadFromUri('../../assets/models');
      //   await this.updateLoadingPercentage(75);
      //   await faceApi.nets.ssdMobilenetv1.loadFromUri('../../assets/models');
      //   await this.updateLoadingPercentage(100);

      //   const results = await faceApi
      //     .detectAllFaces(this.referenceImage.current!)
      //     .withFaceLandmarks()
      //     .withFaceDescriptors();
      //   this.faceMatcher = new faceApi.FaceMatcher(results, 0.5);
      // }
      this.setState({ loadingModel: false });
      // Handle update-proctor from main
      this.timeoutPlay3 = setInterval(() => {
        ipcRenderer.send('get-proctor');
        console.log('getgttttttt');
      }, 3000);
    } catch (e) {
      console.log('/???');
      console.log(e);
      this.setState({ loadingModel: false });
      this.props.onReady();
    }
  };

  onPlay = async () => {
    try {
      if (
        this.video.current?.paused ||
        this.video.current?.ended ||
        !faceApi.nets.tinyFaceDetector.params ||
        this.state.loadingModel
      ) {
        this.timeoutPlay1 = setTimeout(() => this.onPlay());
        return;
      }
      // const options = new faceApi.TinyFaceDetectorOptions({
      //   inputSize: 320,
      //   scoreThreshold: 0.5,
      // });
      const options = new faceApi.SsdMobilenetv1Options();

      const results = await faceApi
        .detectAllFaces(this.video.current!, options)
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (results.length) {
        if (results.length > 1) {
          // window.api.send("violate-face", "multiple-people");
          // $('#multiple_people').html('More than 1 person! ' + new Date().toLocaleTimeString());
          const newArr = [
            'Nhiều người: ' + new Date().toLocaleTimeString(),
          ].concat(this.props.logs || '');
          this.props.dispatch?.({
            type: 'ACTION_SAVE_LOGS',
            data: newArr,
          });
          ipcRenderer.send('violate-face', 'Nhiều người');
        } else {
          const result = results[0];
          // const canvas = $('#overlay').get(0);
          const dims = faceApi.matchDimensions(
            this.canvas.current!,
            this.video.current!,
            true
          );
          const resizedResults = faceApi.resizeResults(result, dims);
          const label = this.faceMatcher
            .findBestMatch(resizedResults.descriptor)
            .toString();
          if (label.includes('unknown')) {
            // window.api.send("violate-face", "different-person");
            // $('#different_person').html('Different person! ' + new Date().toLocaleTimeString());
            const newArr = [
              'Không khớp Face ID: ' + new Date().toLocaleTimeString(),
            ].concat(this.props.logs || '');
            this.props.dispatch?.({
              type: 'ACTION_SAVE_LOGS',
              data: newArr,
            });
            ipcRenderer.send('violate-face', 'Không khớp Face ID');
          } else {
            // $('#result').html('Okay. ' + new Date().toLocaleTimeString());
          }
          const options = { label };
          const drawBox = new faceApi.draw.DrawBox(
            result.detection.box,
            options
          );
          drawBox.draw(this.canvas.current!);
        }
      } else {
        // window.api.send("violate-face", "no-person");
        // $('#no_person').html('No person!' + new Date().toLocaleTimeString());
        const newArr = [
          'Không có người: ' + new Date().toLocaleTimeString(),
        ].concat(this.props.logs || '');
        this.props.dispatch?.({
          type: 'ACTION_SAVE_LOGS',
          data: newArr,
        });
        ipcRenderer.send('violate-face', 'Không có người');
      }

      this.timeoutPlay2 = setTimeout(() => this.onPlay(), 3000);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      console.log('????');
    }
  };

  render(): JSX.Element {
    // const { trangThaiThi } = this.props;

    return (
      <div style={{ overflow: 'hidden' }}>
        <Card>
          {/*
          <Divider>Ảnh sinh viên</Divider>
          <Row justify="center" align="middle">
            <Col style={{ position: 'relative' }} span="8">
              <img
                id="referenceImage"
                ref={this.referenceImage}
                src={$tools.getUserObject().anhDaiDien}
                style={{ width: '100%', height: '100%' }}
                crossOrigin="anonymous"
              />
              <canvas
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                }}
              />
            </Col>
          </Row>

          <Divider>Webcam</Divider>
          <Row>
            <Spin
              spinning={this.state.loadingModel}
              tip={`Loading... (${this.state.loadingPercentage}%)`}
            >
              <Col style={{ position: 'relative' }}>
                <video
                  ref={this.video}
                  onPlay={this.onPlay}
                  autoPlay
                  style={{ width: '100%', height: '100%' }}
                ></video>
                <canvas
                  ref={this.canvas}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                  }}
                />
              </Col>
            </Spin>
          </Row> */}
          <Divider>Hoạt động của sinh viên</Divider>
          <List
            bordered
            dataSource={this.props.logs}
            pagination={{
              pageSize: 5,
            }}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </Card>
      </div>
    );
  }
}
