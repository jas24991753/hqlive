/**
 * 延遲執行函式
 *
 * @param {number} duration 單位:秒
 * @return {*}  {Promise<void>}
 */
export const delay = async (duration: number): Promise<void> => {
    if (duration === 0) {
        return Promise.resolve();
    }

    return new Promise((resolve) => {
        window.setTimeout(() => {
            resolve();
        }, duration * 1000);
    });
}