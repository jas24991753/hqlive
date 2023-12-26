"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const vue_1 = __importDefault(require("vue/dist/vue"));
const { exec } = require('child_process');
const defaultValue = {
    bundleName: "demo",
    bundleVersion: "1.0.0",
    remoteUrl: "http://192.168.17.215/bundles",
    manifestPath: "build/build-bundle/remote"
};
const setColor = (classList, success) => {
    if (success) {
        classList.remove('fail');
        classList.add('success');
    }
    else {
        classList.remove('success');
        classList.add('fail');
    }
};
const addFadeInOutAnim = (classList, duration) => {
    classList.remove('hide');
    classList.add('fadeIn');
    window.setTimeout(() => {
        classList.remove('fadeIn');
        classList.add('fadeOut');
        window.setTimeout(() => {
            classList.remove('fadeOut');
            classList.add('hide');
        }, duration);
    }, duration);
};
const component = vue_1.default.extend({
    template: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../static/template/vue/app.html'), 'utf-8'),
    data() {
        return {
            bundleName: "demo",
            bundleVersion: "1.0.0",
            remoteUrl: "http://192.168.17.215/bundles",
            manifestPath: "build/build-bundle/remote"
        };
    },
    methods: {
        generate() {
            // 执行 hello-world.js
            const childProcess = exec("node " + (0, path_1.join)(__dirname, `../../../version.js ${this.bundleName} ${this.bundleVersion} ${this.remoteUrl} ${this.manifestPath}`), (error, stdout) => {
                if (error) {
                    console.error(`Error: ${error.message}`);
                    setColor(this.$refs.buildStatus.classList, false);
                    this.$refs.buildStatus.innerHTML = "創建失敗";
                    addFadeInOutAnim(this.$refs.buildStatus.classList, 3000);
                    return;
                }
                console.log("??", stdout);
                if (stdout.includes("OK")) {
                    console.log("SUCCESS");
                    setColor(this.$refs.buildStatus.classList, true);
                    this.$refs.buildStatus.innerHTML = "創建成功";
                    addFadeInOutAnim(this.$refs.buildStatus.classList, 3000);
                }
            });
        },
        reset() {
            this.bundleName = defaultValue.bundleName;
            this.bundleVersion = defaultValue.bundleVersion;
            this.remoteUrl = defaultValue.remoteUrl;
            this.manifestPath = defaultValue.manifestPath;
        },
    },
});
const panelDataMap = new WeakMap();
/**
 * @zh 如果希望兼容 3.3 之前的版本可以使用下方的代码
 * @en You can add the code below if you want compatibility with versions prior to 3.3
 */
// Editor.Panel.define = Editor.Panel.define || function(options: any) { return options }
module.exports = Editor.Panel.define({
    listeners: {
        show() { console.log('show'); },
        hide() { console.log('hide'); },
    },
    template: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../static/template/default/index.html'), 'utf-8'),
    style: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../static/style/default/index.css'), 'utf-8'),
    $: {
        app: '#app',
        text: '#text',
    },
    methods: {
        hello() {
            if (this.$.text) {
                this.$.text.innerHTML = 'hello';
                console.log('[cocos-panel-html.default]: hello');
            }
        },
    },
    ready() {
        if (this.$.app) {
            const vm = new component();
            panelDataMap.set(this, vm);
            vm.$mount(this.$.app);
        }
    },
    beforeClose() { },
    close() {
        const vm = panelDataMap.get(this);
        if (vm) {
            vm.$destroy();
        }
    },
});
