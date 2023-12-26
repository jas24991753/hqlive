package com.cocos.game.activities;

import android.content.Context;
import android.graphics.PixelFormat;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.SurfaceView;
import android.view.View;
import android.view.WindowManager;

import com.cocos.game.ARCameraView;
import com.cocos.game.CocosEvent;
import com.cocos.game.VirtualActivity;
import com.cocos.lib.GlobalObject;
import com.xpg.hqlive.R;

/**
 * 自拍直播模式
 * */
public class SelfieStreamingActivity extends VirtualActivity {

    protected ARCameraView arCameraView;

    private WindowManager windowManager;

    private SurfaceView cocosView;

    public SelfieStreamingActivity(Context context, WindowManager windowManager, SurfaceView cocosView) {
        super(context);
        this.windowManager = windowManager;
        this.cocosView = cocosView;
    }

    @Override
    protected String getActivityName() {

        return "SelfieStreaming";

    }

    public void setSelfieEffect(String effect) {
        arCameraView.setSelfieEffect(effect);
    }

    @Override
    protected void onCreate() {
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        View layout = inflater.inflate(R.layout.streaming_ui, null);
        this.rootView = layout;

        final SurfaceView arView = layout.findViewById(R.id.surface);

        arCameraView = new ARCameraView(context,windowManager,arView);

        // 進入自拍
        jbw.addScriptEventListener(CocosEvent.JSB_OPEN_SELFIE_STREAMING, arg -> {
            GlobalObject.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    resume();
                    cocosView.getHolder().setFormat(PixelFormat.TRANSPARENT);
                    cocosView.setZOrderOnTop(true);
                }
            });
        });

        // 設定自拍特效
        jbw.addScriptEventListener("JSB_SET_SELFIE_EFFECT", arg -> {
            Log.d("hqlive", "JSB_SET_SELFIE_EFFECT:" + arg);
            setSelfieEffect(arg);
        });

    }

    @Override
    protected void onDestroy() {

    }

    @Override
    protected void onResume() {
        arCameraView.startPreview();
        if(callback != null) {
            callback.onTransitionScene(getActivityName());
        } 
    }

    @Override
    protected void onPause() {
        arCameraView.stop();
    }
}
