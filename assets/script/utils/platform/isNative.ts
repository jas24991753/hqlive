import { Platform } from "../../core/enum/Platform";

export const isNative = (): Boolean => {
    return window.application.platform === Platform.NATIVE;
}


