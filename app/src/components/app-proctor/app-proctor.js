import { __awaiter, __decorate } from "tslib";
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { withStore } from '@/core/store';
import { Card, Divider, List, message } from 'antd';
import { ipcRenderer } from 'electron';
import * as faceApi from 'face-api.js';
import * as React from 'react';
// Bang chung gui ve server gom buffer va ten.
let Proctor = class Proctor extends React.Component {
    constructor() {
        super(...arguments);
        this.canvas = React.createRef();
        this.referenceImage = React.createRef();
        this.video = React.createRef();
        this.state = {
            // log: [],
            logSize: 3,
            loadingModel: true,
            loadingPercentage: 0,
        };
        this.updateLoadingPercentage = (percent) => {
            return new Promise((resolve, reject) => {
                this.setState({
                    loadingPercentage: percent,
                }, resolve);
            });
        };
        this.run = () => __awaiter(this, void 0, void 0, function* () {
            try {
                ipcRenderer.on('mouseclick', (event, args) => {
                    var _a, _b;
                    const newValue = (this.props.clickCount || 0) + 1;
                    console.log(newValue);
                    (_b = (_a = this.props).dispatch) === null || _b === void 0 ? void 0 : _b.call(_a, {
                        type: 'ACTION_SAVE_CLICK_COUNT',
                        data: newValue,
                    });
                });
                ipcRenderer.on('blur', (event, args) => {
                    var _a, _b;
                    const newArr = [args].concat(this.props.logs || '');
                    (_b = (_a = this.props).dispatch) === null || _b === void 0 ? void 0 : _b.call(_a, {
                        type: 'ACTION_SAVE_LOGS',
                        data: newArr,
                    });
                });
                ipcRenderer.on('update-proctor', (event, args) => {
                    var _a, _b, _c, _d, _e, _f;
                    console.log('args :>> ', args);
                    if (args[1] > 1) {
                        const newArr = [
                            'Dùng nhiều màn hình ' + new Date().toLocaleTimeString(),
                        ].concat(this.props.logs || '');
                        (_b = (_a = this.props).dispatch) === null || _b === void 0 ? void 0 : _b.call(_a, {
                            type: 'ACTION_SAVE_LOGS',
                            data: newArr,
                        });
                    }
                    if (args[2] === false) {
                        const newArr = [
                            'Không phóng to cửa sổ: ' + new Date().toLocaleTimeString(),
                        ].concat(this.props.logs || '');
                        (_d = (_c = this.props).dispatch) === null || _d === void 0 ? void 0 : _d.call(_c, {
                            type: 'ACTION_SAVE_LOGS',
                            data: newArr,
                        });
                    }
                    const newArr = [
                        'Danh sách thiết bị USB: ' +
                            args[3] +
                            ': ' +
                            new Date().toLocaleTimeString(),
                    ].concat(this.props.usbList || '');
                    (_f = (_e = this.props).dispatch) === null || _f === void 0 ? void 0 : _f.call(_e, {
                        type: 'ACTION_SAVE_USB_LIST',
                        data: newArr,
                    });
                    console.log(this.props.usbList);
                });
                try {
                    this.mediaStream = yield navigator.mediaDevices.getUserMedia({
                        video: true,
                    });
                    if (this.video.current !== null) {
                        this.video.current.srcObject = this.mediaStream;
                    }
                }
                catch (err) {
                    // console.log(err);
                    message.error('Kiểm tra lại kết nối webcam của bạn. Tắt các ứng dụng khác đang sử dụng webcam nếu có.');
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
            }
            catch (e) {
                console.log('/???');
                console.log(e);
                this.setState({ loadingModel: false });
                this.props.onReady();
            }
        });
        this.onPlay = () => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            try {
                if (((_a = this.video.current) === null || _a === void 0 ? void 0 : _a.paused) ||
                    ((_b = this.video.current) === null || _b === void 0 ? void 0 : _b.ended) ||
                    !faceApi.nets.tinyFaceDetector.params ||
                    this.state.loadingModel) {
                    this.timeoutPlay1 = setTimeout(() => this.onPlay());
                    return;
                }
                // const options = new faceApi.TinyFaceDetectorOptions({
                //   inputSize: 320,
                //   scoreThreshold: 0.5,
                // });
                const options = new faceApi.SsdMobilenetv1Options();
                const results = yield faceApi
                    .detectAllFaces(this.video.current, options)
                    .withFaceLandmarks()
                    .withFaceDescriptors();
                if (results.length) {
                    if (results.length > 1) {
                        // window.api.send("violate-face", "multiple-people");
                        // $('#multiple_people').html('More than 1 person! ' + new Date().toLocaleTimeString());
                        const newArr = [
                            'Nhiều người: ' + new Date().toLocaleTimeString(),
                        ].concat(this.props.logs || '');
                        (_d = (_c = this.props).dispatch) === null || _d === void 0 ? void 0 : _d.call(_c, {
                            type: 'ACTION_SAVE_LOGS',
                            data: newArr,
                        });
                        ipcRenderer.send('violate-face', 'Nhiều người');
                    }
                    else {
                        const result = results[0];
                        // const canvas = $('#overlay').get(0);
                        const dims = faceApi.matchDimensions(this.canvas.current, this.video.current, true);
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
                            (_f = (_e = this.props).dispatch) === null || _f === void 0 ? void 0 : _f.call(_e, {
                                type: 'ACTION_SAVE_LOGS',
                                data: newArr,
                            });
                            ipcRenderer.send('violate-face', 'Không khớp Face ID');
                        }
                        else {
                            // $('#result').html('Okay. ' + new Date().toLocaleTimeString());
                        }
                        const options = { label };
                        const drawBox = new faceApi.draw.DrawBox(result.detection.box, options);
                        drawBox.draw(this.canvas.current);
                    }
                }
                else {
                    // window.api.send("violate-face", "no-person");
                    // $('#no_person').html('No person!' + new Date().toLocaleTimeString());
                    const newArr = [
                        'Không có người: ' + new Date().toLocaleTimeString(),
                    ].concat(this.props.logs || '');
                    (_h = (_g = this.props).dispatch) === null || _h === void 0 ? void 0 : _h.call(_g, {
                        type: 'ACTION_SAVE_LOGS',
                        data: newArr,
                    });
                    ipcRenderer.send('violate-face', 'Không có người');
                }
                this.timeoutPlay2 = setTimeout(() => this.onPlay(), 3000);
            }
            catch (error) {
                // eslint-disable-next-line no-console
                console.log(error);
                console.log('????');
            }
        });
    }
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
        if (this.timeoutPlay1)
            clearTimeout(this.timeoutPlay1);
        if (this.timeoutPlay2)
            clearTimeout(this.timeoutPlay2);
        if (this.timeoutPlay3)
            clearTimeout(this.timeoutPlay3);
    }
    render() {
        // const { trangThaiThi } = this.props;
        return (React.createElement("div", { style: { overflow: 'hidden' } },
            React.createElement(Card, null,
                React.createElement(Divider, null, "Ghi ch\u00E9p"),
                React.createElement(List, { bordered: true, dataSource: this.props.logs, pagination: {
                        pageSize: 5,
                    }, renderItem: (item) => React.createElement(List.Item, null, item) }))));
    }
};
Proctor = __decorate([
    withStore(['logs', 'usbList', 'clickCount'])
], Proctor);
export { Proctor };
