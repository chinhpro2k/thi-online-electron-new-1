// declaring module will allow typescript to import the module
declare module 'audio-react-recorder' {
  // typing module default export as `any` will allow you to access its members without compiler warning
  var AudioReactRecorder: any;
  export default AudioReactRecorder;

  export var RecordState: any;
}
