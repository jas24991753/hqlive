import { _decorator, director, native } from 'cc';
import { Core } from '../../Core';
import { isNative } from '../../utils/platform/isNative';
import { OAuthCompany } from '../enum/OAuthCompany';
import { CoreEvent } from '../events/CoreEvent';
import { NativeEvent } from '../events/NativeEvent';
const { ccclass, property } = _decorator;

export class NativeHandler {

    constructor() {
        const core = new Core();
        core.event.on(NativeEvent.JSB_OPEN_SELFIE_STREAMING, this.openSelfieStreaming, this);
        core.event.on(NativeEvent.JSB_OPEN_LIVE_STREAMING, this.openLiveStreaming, this);
        core.event.on(NativeEvent.JSB_OPEN_TEXT_INPUT, this.openTextInput, this);
        core.event.on(NativeEvent.JSB_CLOSE_LIVE, this.closeLive, this);
        core.event.on(NativeEvent.JSB_BACK_LOBBY, this.backLobby, this);
        core.event.on(NativeEvent.JSB_SET_SELFIE_EFFECT, this.setSelfieEffect, this);
        core.event.on(NativeEvent.JSB_CHECK_USER_AUTHENTICATION, this.checkUserAuthentication, this);
        core.event.on(NativeEvent.JSB_TRIGGER_OAUTH, this.triggerOAuth, this);
        core.event.on(NativeEvent.JSB_LOG, this.log, this);
    }

    public init(): void {
        if (isNative()) {
            native.jsbBridgeWrapper.dispatchEventToNative(NativeEvent.JSB_LOG, "JS NATIVE init");
            const core = new Core();

            // 收到App端請求將live全屏
            native.jsbBridgeWrapper.addNativeEventListener(NativeEvent.JSB_APP_FOCUS_LIVE, () => {
                core.event.emit(CoreEvent.FOCUS_LIVE);
            });

            // 收到App端直播串流已開啟
            native.jsbBridgeWrapper.addNativeEventListener(NativeEvent.JSB_APP_LIVE_STREAMING_OPENED, () => {
                native.jsbBridgeWrapper.dispatchEventToNative(NativeEvent.JSB_LOG, "JS:echo:JSB_APP_LIVE_STREAMING_OPENED");
                core.event.emit(CoreEvent.APP_LIVE_STREAMING_OPENED);
            });

            // 收到App端轉場通知
            native.jsbBridgeWrapper.addNativeEventListener(NativeEvent.JSB_APP_NOTIFY_TRANSITION_SCENE, (sceneName) => {
                native.jsbBridgeWrapper.dispatchEventToNative(NativeEvent.JSB_LOG, "JS:轉場:" + sceneName);
                director.loadScene(sceneName, () => { });
            });

            // 收到App端轉場通知
            native.jsbBridgeWrapper.addNativeEventListener(NativeEvent.JSB_APP_USER_UNAUTHORIZED, (sceneName) => {
                core.event.emit(NativeEvent.JSB_APP_USER_UNAUTHORIZED);
            });

            // 收到App端轉場通知
            native.jsbBridgeWrapper.addNativeEventListener(NativeEvent.JSB_APP_USER_AUTHORIZED, (sceneName) => {
                core.event.emit(NativeEvent.JSB_APP_USER_AUTHORIZED);
            });
        }
    }

    protected onDestroy(): void {
        const core = new Core();
        core.event.off(NativeEvent.JSB_OPEN_SELFIE_STREAMING, this.openSelfieStreaming, this);
        core.event.off(NativeEvent.JSB_OPEN_LIVE_STREAMING, this.openLiveStreaming, this);
        core.event.off(NativeEvent.JSB_OPEN_TEXT_INPUT, this.openTextInput, this);
        core.event.off(NativeEvent.JSB_CLOSE_LIVE, this.closeLive, this);
    }

    closeLive(): void {
        if (isNative()) {
            native.jsbBridgeWrapper.dispatchEventToNative(NativeEvent.JSB_CLOSE_LIVE);
        }
    }

    openSelfieStreaming(): void {
        if (isNative()) {
            native.jsbBridgeWrapper.dispatchEventToNative(NativeEvent.JSB_OPEN_SELFIE_STREAMING);
        }
    }

    openLiveStreaming(args = ''): void {
        // args帶入'floating' 表示將liveview用 漂浮視窗呈現
        if (isNative()) {
            native.jsbBridgeWrapper.dispatchEventToNative(NativeEvent.JSB_OPEN_LIVE_STREAMING, args);
        }
    }

    openTextInput(): void {
        if (isNative()) {
            native.jsbBridgeWrapper.dispatchEventToNative(NativeEvent.JSB_OPEN_TEXT_INPUT);
        }
    }

    setSelfieEffect(data = ''): void {
        if (isNative()) {
            native.jsbBridgeWrapper.dispatchEventToNative(NativeEvent.JSB_SET_SELFIE_EFFECT, data);
        }
    }

    backLobby(data = ''): void {
        if (isNative()) {
            native.jsbBridgeWrapper.dispatchEventToNative(NativeEvent.JSB_BACK_LOBBY, data);
        }
    }

    checkUserAuthentication(): void {
        if (isNative()) {
            native.jsbBridgeWrapper.dispatchEventToNative(NativeEvent.JSB_CHECK_USER_AUTHENTICATION);
        }
    }

    triggerOAuth(data: OAuthCompany): void {
        if (isNative()) {
            native.jsbBridgeWrapper.dispatchEventToNative(NativeEvent.JSB_TRIGGER_OAUTH, data);
        }
    }

    log(data = ''): void {
        if (isNative()) {
            native.jsbBridgeWrapper.dispatchEventToNative(NativeEvent.JSB_LOG, data);
        }
    }
}