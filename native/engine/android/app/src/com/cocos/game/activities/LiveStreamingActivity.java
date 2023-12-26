package com.cocos.game.activities;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.PixelFormat;
import android.util.Log;
import android.view.SurfaceView;
import android.widget.FrameLayout;

import com.cocos.game.CocosEvent;
import com.cocos.game.ILiveUICallback;
import com.cocos.game.LiveView;
import com.cocos.game.VirtualActivity;
import com.cocos.lib.GlobalObject;
import com.cocos.lib.IInteractionHandlerCallback;
import com.cocos.lib.InteractionHandler;
import com.cocos.lib.Utils;

public class LiveStreamingActivity extends VirtualActivity {

    private LiveView liveView;

    private FrameLayout appView;

    private SurfaceView cocosView;

    /** 視窗模式, 漂浮或全屏 */
    private String windowMode;

    private boolean isFloating;

    public LiveStreamingActivity(Context context,FrameLayout appView, SurfaceView cocosView) {
        super(context);
        this.appView = appView;
        this.cocosView = cocosView;
    }

    @Override
    protected String getActivityName() {
        return "LiveStreaming";
    }

    /**
     * 設定全屏
     */
    public void setFullScreenDisplay() {
        isFloating = false;
        FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT);
        rootView.setLayoutParams(params);
    }

    /**
     * 設定漂浮屏呈現
     */
    public void setFloatingDisplay() {
        isFloating = true;
        FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT);
        rootView.setLayoutParams(params);

        int width = 320;
        int height = Utils.getHeightByRatio(width, 9, 16);

        params.width = width;
        params.height = height;
        rootView.setLayoutParams(params);
    }

    @Override
    protected void onCreate() {
        // 建立liveView
        liveView = new LiveView(context);
        rootView = liveView.create();

        liveView.setID();
        liveView.registerClickHandler(new ILiveUICallback() {
            @Override
            public void onClickSwitchButton() {
                GlobalObject.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        if (isFloating) {
                            if (rootView.getParent() != null) {
                                appView.removeView(rootView);
                            }
                            setFullScreenDisplay();
                            cocosView.getHolder().setFormat(PixelFormat.TRANSPARENT);
                            appView.addView(rootView, 0);
                            cocosView.setZOrderOnTop(true);
                            jbw.dispatchEventToScript(CocosEvent.JSB_APP_FOCUS_LIVE);
                        }
                    }
                });
            }
        });

        IInteractionHandlerCallback interactionHandlerCallback = new IInteractionHandlerCallback<FrameLayout>() {
            @Override
            public void onDoubleTap(FrameLayout view) {
            }
            @Override
            public void onDrag() {

            }

            @Override
            public void onClick() {
                if (isFloating) {
                    liveView.handleFloatingUI();
                }
            }
        };
        InteractionHandler handler = new InteractionHandler(rootView,interactionHandlerCallback);
        rootView.setOnTouchListener(handler);

        // 事件處理
        // 開啟直播
        jbw.addScriptEventListener(CocosEvent.JSB_OPEN_LIVE_STREAMING, arg -> {
            GlobalObject.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    windowMode = arg;
                    resume();
                }
            });
        });

        // 關閉直播
        jbw.addScriptEventListener("JSB_CLOSE_LIVE", arg -> {
            pause();
            // CocosWebViewHelper.setWebViewRect(0,0,0,1080, Utils.getHeightByRatio(1080,9, 16) );
        });
    }

    @Override
    protected void onDestroy() {

    }

    @Override
    protected void onResume() {
        if (rootView.getParent() != null) {
            appView.removeView(rootView);
        }
        if (this.windowMode.equals("floating")) {
            // live漂浮
            Log.d("hqlive", "漂浮");
            setFloatingDisplay();
            cocosView.getHolder().setFormat(PixelFormat.TRANSLUCENT);
            appView.addView(rootView, 1);
            cocosView.setZOrderOnTop(false);
        } else {
            Log.d("hqlive", "live全屏");
            setFullScreenDisplay();
            cocosView.getHolder().setFormat(PixelFormat.TRANSPARENT);
            appView.addView(rootView, 0);
            cocosView.setZOrderOnTop(true);
        }
        liveView.loadStreaming("http://192.168.17.206:8080/live/livestream.mpd");
        Log.d("hqlive", "通知js直播開啟");
        jbw.dispatchEventToScript(CocosEvent.JSB_APP_LIVE_STREAMING_OPENED );
        if(callback != null) {
            callback.onTransitionScene(getActivityName());
        }
    }

    @Override
    protected void onPause() {
        GlobalObject.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                cocosView.getHolder().setFormat(PixelFormat.TRANSLUCENT);
            }
        });
    }
}
