package com.cocos.game;

import android.content.Context;
import android.util.Log;
import android.view.View;

import com.cocos.lib.CocosWebView;
import com.cocos.lib.GlobalObject;
import com.cocos.lib.JsbBridgeWrapper;

enum VirtualActivityState {
    /**
     * 尚未初始化
     */
    NONE,
    /**
     * onCreate後閒置
     */
    CREATED,
    /**
     * onPaused後閒置
     */
    PAUSED
}

/**
 * 由於UI畫面渲染盡量交由cocos處理來達到跨平台, 因此用虛擬化Activity來簡易模擬android中activity的概念
 * 這也類似於cocos的場景切換
 */
public abstract class VirtualActivity {
    private VirtualActivityState state = VirtualActivityState.NONE;

    public View rootView;

    protected Context context;

    protected JsbBridgeWrapper jbw;

    protected IVirtualActivityCallback callback;

    public VirtualActivity(Context context) {
        jbw = JsbBridgeWrapper.getInstance();
        this.context = context;
    }

    public void registerCallback(IVirtualActivityCallback callback) {
        this.callback = callback;
    }

    public void create() {
        if (state != VirtualActivityState.NONE) return;
        this.onCreate();
        state = VirtualActivityState.CREATED;
    }

    public void destroy() {
        if (state == VirtualActivityState.NONE) return;
        this.onDestroy();
        state = VirtualActivityState.NONE;
    }

    public void pause() {
        if (state == VirtualActivityState.NONE) return;
        if (state == VirtualActivityState.PAUSED) return;

        if (rootView != null) {
            rootView.setVisibility(View.GONE);
        }

        this.onPause();
        state = VirtualActivityState.PAUSED;
    }

    public void resume() {
        if (state == VirtualActivityState.NONE) return;

        if (rootView != null) {
            rootView.setVisibility(View.VISIBLE);
        }

        this.onResume();
        // APP端完成處理後通知cocos轉場
        jbw.dispatchEventToScript("JSB_APP_NOTIFY_TRANSITION_SCENE", getActivityName());
        state = VirtualActivityState.CREATED;
    }

    abstract protected String getActivityName();

    abstract protected void onCreate();

    abstract protected void onDestroy();

    abstract protected void onResume();

    abstract protected void onPause();
}
