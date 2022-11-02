import { __awaiter } from "tslib";
/* eslint-disable react/prop-types */
import { Button, Card, Checkbox, Divider, Form, Input, Radio, Statistic, Typography, message, InputNumber, Row, Col, Upload, Spin, } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import CauHoiAudio from '@/src/components/cauhoi/CauHoiAudio/CauHoiAudio';
import { LoaiCauHoi } from './typing';
import CauHoiKeoTha from '@/src/components/cauhoi/CauHoiKeoTha/CauHoiKeoTha';
import { UploadOutlined } from '@ant-design/icons';
import CauHoiDienOTrong from '@/src/components/cauhoi/CauHoiDienOTrong/CauHoiDienOTrong';
import axios from 'axios';
const { Countdown } = Statistic;
const VALID_EXTENSIONS = ['xls', 'xlsx', 'doc', 'docx', 'pdf'];
const _formatCauTraLoi = (cauTraLoi) => {
    return !Array.isArray(cauTraLoi) ? [cauTraLoi || ''] : cauTraLoi;
};
export const LamBai = ({ deThi, onThoat, maLopThi, nganHangDeId, 
// thoiGianBatDau,
thoiGianKetThuc, logs, dispatch, }) => {
    var _a;
    const [form] = Form.useForm();
    const [daLam, setDaLam] = useState(0);
    const [isSpinning, setSpinning] = useState(false);
    const [fileLists, setFileLists] = useState([]);
    const updateDaLam = () => {
        var _a, _b, _c;
        const value = (_c = (_b = (_a = form.getFieldValue('noiDungTraLoi')) === null || _a === void 0 ? void 0 : _a.filter((x) => {
            var _a, _b;
            if ((x === null || x === void 0 ? void 0 : x.loai) === LoaiCauHoi.KeoTha ||
                (x === null || x === void 0 ? void 0 : x.loai) === LoaiCauHoi.DienOTrong ||
                (x === null || x === void 0 ? void 0 : x.loai) === LoaiCauHoi.NgheDienTu) {
                return (_a = x === null || x === void 0 ? void 0 : x.cauTraLoi) === null || _a === void 0 ? void 0 : _a.find((traLoi) => !!traLoi);
            }
            return (_b = x === null || x === void 0 ? void 0 : x.cauTraLoi) === null || _b === void 0 ? void 0 : _b.length;
        })) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0;
        setDaLam(value);
    };
    const updateFileLists = (cauHoiId, file) => {
        var _a;
        let found = false;
        const updatedFileLists = fileLists.map((fileItem) => {
            if (fileItem.cauHoiId !== cauHoiId) {
                return fileItem;
            }
            found = true;
            return Object.assign(Object.assign({}, fileItem), { file });
        });
        if (!found) {
            updatedFileLists.push({
                cauHoiId,
                file,
            });
        }
        setFileLists(updatedFileLists);
        const formValues = form.getFieldsValue();
        const noiDungTraLoi = (_a = formValues === null || formValues === void 0 ? void 0 : formValues.noiDungTraLoi) === null || _a === void 0 ? void 0 : _a.map((item) => {
            var _a;
            if (item.cauHoiId !== cauHoiId) {
                return item;
            }
            return Object.assign(Object.assign({}, item), { cauTraLoi: (_a = file === null || file === void 0 ? void 0 : file.name) !== null && _a !== void 0 ? _a : '' });
        });
        form.setFieldsValue({ noiDungTraLoi });
        updateDaLam();
    };
    const onOpenFileDialog = () => {
        const newArr = [
            'Người dùng chọn thao tác tải file ' + new Date().toLocaleTimeString(),
        ].concat(logs || '');
        dispatch === null || dispatch === void 0 ? void 0 : dispatch({
            type: 'ACTION_SAVE_LOGS',
            data: newArr,
        });
    };
    const handleFileUpload = (cauHoiId, file) => {
        const names = file.name.split('.');
        const fileExt = names[names.length - 1];
        const fileType = file.type.split('/')[0];
        const validFileExt = fileType === 'image' || VALID_EXTENSIONS.includes(fileExt);
        if (!validFileExt) {
            message.error('Bạn chỉ có thể chọn ảnh hoặc file có định dạng doc, xls, pdf!');
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
    const onStopRecording = (data, cauHoi) => {
        const file = new File([data.blob], `${cauHoi._id}.wav`, {
            type: data.type,
        });
        updateFileLists(cauHoi._id, file);
    };
    const onFinish = (values) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        // console.log('Success:', values);
        // console.log('maLopThi, ngangHangDeId :>> ', maLopThi, nganHangDeId);
        setSpinning(true);
        const urls = yield Promise.all(fileLists.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            var _c;
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
            const result = yield axios.post(urlPath, formData, {
                headers: {
                    Authorization: `Bearer ${$tools.getAccessToken()}`,
                    'Content-Type': 'application/json',
                },
            });
            const url = ((_c = result.data) === null || _c === void 0 ? void 0 : _c.data) || '';
            return {
                cauHoiId: file.cauHoiId,
                url,
            };
        })));
        $api
            .nopBaiThi({
            maLopThi,
            nganHangDeId,
            noiDungTraLoi: (_b = values === null || values === void 0 ? void 0 : values.noiDungTraLoi) === null || _b === void 0 ? void 0 : _b.map((noiDungTraLoi) => {
                var _a;
                let cauTraLoi = noiDungTraLoi.cauTraLoi;
                if (noiDungTraLoi.loai === 7 || noiDungTraLoi.loai === 8) {
                    const url = urls.find((item) => item.cauHoiId === noiDungTraLoi.cauHoiId);
                    cauTraLoi = (_a = url === null || url === void 0 ? void 0 : url.url) !== null && _a !== void 0 ? _a : '';
                }
                return Object.assign(Object.assign({}, noiDungTraLoi), { cauTraLoi: _formatCauTraLoi(cauTraLoi) });
            }),
        })
            .then((data) => {
            console.log('data nop bai form :>> ', data);
            console.log('????????????????????', logs);
            $api
                .postLogGiamSat({ log: logs || [] })
                .then((logNopBai) => {
                console.log('logNopBai :>> ', logNopBai);
                message.success('Chúc mừng bạn đã hoàn thành bài thi');
                setSpinning(false);
                onThoat();
            })
                .catch((err) => {
                // console.log(err);
                setSpinning(false);
                message.error('Nộp bài không thành công, bạn hãy thử lại');
            });
        })
            .catch((err) => {
            // console.log(err);
            setSpinning(false);
            message.error('Nộp bài không thành công, bạn hãy thử lại');
        });
    });
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        setSpinning(false);
    };
    const handleTimeout = () => {
        onFinish(form.getFieldsValue(true));
    };
    const getDapAnRules = (cauHoi) => {
        var _a, _b;
        const rules = [];
        if ((_a = cauHoi === null || cauHoi === void 0 ? void 0 : cauHoi.noiDung) === null || _a === void 0 ? void 0 : _a.isRequired) {
            rules.push({ required: true, message: 'Bạn chưa trả lời câu hỏi này' });
        }
        if (((_b = cauHoi === null || cauHoi === void 0 ? void 0 : cauHoi.noiDung) === null || _b === void 0 ? void 0 : _b.loai) === LoaiCauHoi.ShortText) {
            rules.push({ max: 255, message: 'Câu trả lời không được quá 255 ký tự' });
        }
        return rules;
    };
    const renderNoiDungCauHoi = (cauHoi) => {
        // if (cauHoi?.noiDung?.loai === LoaiCauHoi.Audio) {
        //   return <RenderMultimedia src={cauHoi?.noiDung?.cauHoi} />;
        // }
        var _a, _b, _c, _d;
        // if (cauHoi?.noiDung?.loai === LoaiCauHoi.NgheDienTu) {
        //   return <RenderMultimedia src={cauHoi?.noiDung?.audio} />;
        // }
        if (((_a = cauHoi === null || cauHoi === void 0 ? void 0 : cauHoi.tepDinhKem) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            return (React.createElement(React.Fragment, null,
                React.createElement("span", { style: { color: '#C01718' } }, (_b = cauHoi === null || cauHoi === void 0 ? void 0 : cauHoi.noiDung) === null || _b === void 0 ? void 0 : _b.cauHoi),
                React.createElement("div", { style: { display: 'flex', flexWrap: 'wrap' } }, (_c = cauHoi === null || cauHoi === void 0 ? void 0 : cauHoi.tepDinhKem) === null || _c === void 0 ? void 0 : _c.map((x) => (React.createElement("img", { key: x, src: x, alt: "", style: { width: '250px', marginBottom: '8px', padding: '10px' } }))))));
        }
        else
            return (React.createElement("span", { style: { color: '#C01718' }, dangerouslySetInnerHTML: { __html: (_d = cauHoi === null || cauHoi === void 0 ? void 0 : cauHoi.noiDung) === null || _d === void 0 ? void 0 : _d.cauHoi } }));
        // if (
        //   cauHoi?.noiDung?.loai === LoaiCauHoi.KeoTha ||
        //   cauHoi?.noiDung?.loai === LoaiCauHoi.DienOTrong
        // ) {
        //   return null;
        // }
    };
    const renderDapAn = (cauHoi) => {
        var _a, _b, _c, _d, _e;
        switch ((_a = cauHoi === null || cauHoi === void 0 ? void 0 : cauHoi.noiDung) === null || _a === void 0 ? void 0 : _a.loai) {
            case LoaiCauHoi.ChonMotDapAn:
            case LoaiCauHoi.HinhAnhNghe:
                return (React.createElement(Radio.Group, null, (_c = (_b = cauHoi === null || cauHoi === void 0 ? void 0 : cauHoi.noiDung) === null || _b === void 0 ? void 0 : _b.cauTraLoi) === null || _c === void 0 ? void 0 : _c.map((dapAn, indexDapAn) => (React.createElement("div", { style: { marginTop: 10 }, key: indexDapAn },
                    React.createElement("span", null,
                        React.createElement(Radio, { value: dapAn === null || dapAn === void 0 ? void 0 : dapAn.luaChon },
                            React.createElement("span", { dangerouslySetInnerHTML: { __html: dapAn.luaChon } }),
                            ' ')))))));
            case LoaiCauHoi.ChonNhieuDapAn:
                return (React.createElement(Checkbox.Group, { className: "group-multichoice", options: (_e = (_d = cauHoi === null || cauHoi === void 0 ? void 0 : cauHoi.noiDung) === null || _d === void 0 ? void 0 : _d.cauTraLoi) === null || _e === void 0 ? void 0 : _e.map((dapAn) => dapAn === null || dapAn === void 0 ? void 0 : dapAn.luaChon) }));
            case LoaiCauHoi.ShortText:
                return React.createElement(Input, { style: { marginTop: '10px' } });
            case LoaiCauHoi.Textarea:
                return React.createElement(Input.TextArea, { style: { marginTop: '10px' } });
            case LoaiCauHoi.DienOTrong:
            case LoaiCauHoi.NgheDienTu:
                return React.createElement(CauHoiDienOTrong, { cauHoi: cauHoi });
            case LoaiCauHoi.KeoTha:
                return React.createElement(CauHoiKeoTha, { cauHoi: cauHoi });
            case LoaiCauHoi.Audio:
                return React.createElement(CauHoiAudio, { onStop: (data) => onStopRecording(data, cauHoi) });
            case LoaiCauHoi.File:
                return (React.createElement("div", { style: { marginTop: '10px' } },
                    React.createElement(Upload, { className: "lam-bai-upload", beforeUpload: (file) => handleFileUpload(cauHoi._id, file) },
                        React.createElement(Button, { icon: React.createElement(UploadOutlined, null), onClick: onOpenFileDialog },
                            ' ',
                            "T\u1EA3i file l\u00EAn"))));
            default:
                return null;
        }
    };
    return (React.createElement(Spin, { spinning: isSpinning, tip: "B\u00E0i l\u00E0m c\u1EE7a b\u1EA1n \u0111ang \u0111\u01B0\u1EE3c n\u1ED9p. Xin vui l\u00F2ng ch\u1EDD sau gi\u00E2y l\u00E1t." },
        React.createElement(Card, { bordered: true },
            React.createElement(Row, { justify: "space-between", style: {
                    position: 'sticky',
                    top: '0',
                    backgroundColor: '#FAFAFA',
                    zIndex: 999,
                } },
                React.createElement(Col, { style: { marginTop: '5px' } },
                    React.createElement("div", null,
                        React.createElement("b", { style: { fontSize: '17px' } },
                            "Danh s\u00E1ch c\u00E2u h\u1ECFi:",
                            React.createElement("p", { style: { fontSize: '13px', color: '#C01718' } },
                                React.createElement("i", null,
                                    "(S\u1ED1 c\u00E2u \u0111\u00E3 l\u00E0m: ",
                                    daLam,
                                    "/", (_a = form.getFieldValue('noiDungTraLoi')) === null || _a === void 0 ? void 0 :
                                    _a.length,
                                    ")"))))),
                React.createElement(Col, { style: { marginTop: '5px' } }, !deThi.daLam && (React.createElement("div", null,
                    "Th\u1EDDi gian c\u00F2n l\u1EA1i",
                    React.createElement(Countdown, { value: moment(thoiGianKetThuc).unix() * 1000, onFinish: () => handleTimeout() })))),
                React.createElement(Divider, { type: "horizontal" })),
            !!deThi.daLam ? (React.createElement("div", null,
                React.createElement(Typography.Text, null, "B\u1EA1n \u0111\u00E3 ho\u00E0n th\u00E0nh b\u00E0i thi n\u00E0y!"),
                React.createElement(Divider, { type: "horizontal" }),
                React.createElement(Button, { type: "primary", onClick: () => onThoat() }, "Tho\u00E1t"))) : (React.createElement(Form, { style: {
                    marginTop: '16px',
                }, name: "basic", form: form, labelCol: { span: 8 }, wrapperCol: { span: 16 }, 
                // initialValues={{}}
                onFinish: onFinish, scrollToFirstError: true, onFinishFailed: onFinishFailed, onValuesChange: updateDaLam },
                deThi.noiDungDe.map((cauHoi, index) => {
                    var _a, _b, _c;
                    return (React.createElement("div", { key: index },
                        React.createElement("div", null,
                            React.createElement("b", null,
                                React.createElement("u", null,
                                    "C\u00E2u ",
                                    index + 1,
                                    cauHoi.noiDung.isRequired && (React.createElement("span", { style: { color: '#C01718' } }, "*"))),
                                ":\u00A0", (_b = (_a = cauHoi === null || cauHoi === void 0 ? void 0 : cauHoi.noiDung) === null || _a === void 0 ? void 0 : _a.moTa) !== null && _b !== void 0 ? _b : '')),
                        React.createElement("div", null, renderNoiDungCauHoi(cauHoi)),
                        React.createElement(Form.Item
                        // label="Username"
                        , { 
                            // label="Username"
                            name: ['noiDungTraLoi', index, 'cauTraLoi'], rules: getDapAnRules(cauHoi) }, renderDapAn(cauHoi)),
                        React.createElement(Form.Item
                        // label="Username"
                        , { 
                            // label="Username"
                            name: ['noiDungTraLoi', index, 'cauHoiId'], hidden: true, initialValue: cauHoi._id },
                            React.createElement(Input, null)),
                        React.createElement(Form.Item
                        // label="Username"
                        , { 
                            // label="Username"
                            name: ['noiDungTraLoi', index, 'cauHoi'], hidden: true, initialValue: cauHoi.noiDung.cauHoi },
                            React.createElement(Input, null)),
                        React.createElement(Form.Item
                        // label="Username"
                        , { 
                            // label="Username"
                            name: ['noiDungTraLoi', index, 'loai'], hidden: true, initialValue: (_c = cauHoi === null || cauHoi === void 0 ? void 0 : cauHoi.noiDung) === null || _c === void 0 ? void 0 : _c.loai },
                            React.createElement(InputNumber, null)),
                        React.createElement(Form.Item
                        // label="Username"
                        , { 
                            // label="Username"
                            name: ['noiDungTraLoi', index, 'maLopThi'], hidden: true, initialValue: maLopThi },
                            React.createElement(Input, null))));
                }),
                React.createElement(Form.Item, { wrapperCol: { offset: 8, span: 16 } },
                    React.createElement(Button, { type: "primary", htmlType: "submit" }, "N\u1ED9p b\u00E0i")))))));
};
