import { _decorator, director } from 'cc';
import { isNative } from '../utils/platform/isNative';
import { Application } from './Application';
import { BaseComponent } from './components/BaseComponent';
import { NativeEvent } from './events/NativeEvent';
const { ccclass, property } = _decorator;

@ccclass('Entry')
export class Entry extends BaseComponent {
    start() {
        window.application = new Application();
        window.application.init();

        console.log('application 初始化');
        (cc as any).debug.setDisplayStats(false);

        // 判斷使用者是否已登入
        if (isNative()) {
            this.event.on(NativeEvent.JSB_APP_USER_UNAUTHORIZED, this.unAuthorized, this);
            this.event.on(NativeEvent.JSB_APP_USER_AUTHORIZED, this.authorized, this);
            this.event.emit(NativeEvent.JSB_CHECK_USER_AUTHENTICATION);
        } else {
            // WEB測試,1.5s後進入大廳
            this.scheduleOnce(() => {
                console.log('切換場景:Main');
                director.loadScene("Main", () => { });
            }, 1.5);
        }
    }

    unAuthorized() {
        // 使用者尚未驗證,跳轉到登入頁
        director.loadScene("Authentication", () => { });
    }

    authorized() {
        // 使用者已驗證,進入大廳
        director.loadScene("Main", () => { });
    }
}


