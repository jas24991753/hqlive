import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('openLiveStreaming')
export class openLiveStreaming extends Component {
    fire() {
        // new Core().event.emit(CoreEvent.OPEN_LIVE_STREAMING);
    }
}



