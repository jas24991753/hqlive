package com.cocos.game;

import android.animation.ValueAnimator;
import android.content.Context;
import android.os.Handler;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.SurfaceView;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ImageButton;

import com.cocos.lib.IInteractionHandlerCallback;
import com.cocos.lib.InteractionHandler;
import com.cocos.lib.Utils;
import com.google.android.exoplayer2.ExoPlayer;
import com.google.android.exoplayer2.MediaItem;
import com.google.android.exoplayer2.Player;
import com.xpg.hqlive.R;



/**
 * 直播UI
 */
public class LiveView {

    private Context _context;

    private FrameLayout _layout;

    private boolean _isFloating;

    private ExoPlayer _player;

    private SurfaceView _surfaceView;

    /**
     * 漂浮UI容器
     */
    private FrameLayout _floatingPanel;

    /**
     * live view是否為漂浮模式
     */
    public boolean getIsFloating() {
        return this._isFloating;
    }

    public FrameLayout getLayout() {
        return this._layout;
    }

    public LiveView(Context context) {
        this._context = context;
    }

    public void registerClickHandler(ILiveUICallback liveUICallback) {
        this.liveUICallback = liveUICallback;
    }

    private ILiveUICallback liveUICallback;

    public FrameLayout create() {
        // 获取LayoutInflater
        LayoutInflater inflater = (LayoutInflater) this._context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        // 加载指定的XML布局文件
        View layout = inflater.inflate(R.layout.live_ui, null);

        FrameLayout fLayout = new FrameLayout(this._context);

        // 設置 SurfaceView 的寬高為 MATCH_PARENT
        FrameLayout.LayoutParams fparams = new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        );
        fLayout.setLayoutParams(fparams);

        // 創建 SurfaceView
        // 定義在xml的surface無法正確顯示直播,因此用程式處理
        this._surfaceView = new SurfaceView(this._context);

        // 設置 SurfaceView 的寬高為 MATCH_PARENT
        FrameLayout.LayoutParams layoutParams = new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
        );

        this._surfaceView.setLayoutParams(layoutParams);

        fLayout.addView(this._surfaceView);

        this._layout = (FrameLayout) fLayout;
        this._floatingPanel = (FrameLayout) layout;

        this._layout.addView(layout);

        // this._floating_panel = this._layout.findViewById(R.id.floating_panel);
        this.bindInteractive();

        this._player = new ExoPlayer.Builder(this._context).build();
        this._player.setVideoSurfaceView(this._surfaceView);
        this.watchPlayerState();

        return (FrameLayout) fLayout;
    }

    public int setID() {
        int id = this._layout.generateViewId();
        this._layout.setId(id);
        return id;
    }

    public void minimize() {
        this._isFloating = false;
        FrameLayout.LayoutParams lParams = new FrameLayout.LayoutParams(1, 1);
        this._layout.setLayoutParams(lParams);
    }

    public void loadStreaming(String url) {
        MediaItem mediaItem = MediaItem.fromUri(url);

        // 設定播放器媒體資源
        this._player.setMediaItem(mediaItem);

        // 準備播放器
        this._player.prepare();

        this._player.play();
    }

    /**
     * 綁定UI互動
     **/
    private void bindInteractive() {
        // 交換視窗鈕
        // TODO: 如何用R.id.switchButton取得物件
        ImageButton switchButton = (ImageButton) this._floatingPanel.getChildAt(0);

        // 设置按钮点击事件监听器
        switchButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                hideFloatingUI();
                if(liveUICallback != null) {
                    liveUICallback.onClickSwitchButton();
                }
            }
        });
    }

    /**
     * 監控播放器狀態
     **/
    private void watchPlayerState() {
        this._player.addListener(new Player.Listener() {
            @Override
            public void onPlaybackStateChanged(@Player.State int state) {
                switch (state) {
                    case Player.STATE_IDLE:
                        Log.d("hqlive", "idle");
                        break;
                    case Player.STATE_BUFFERING:
                        Log.d("hqlive", "buffering");
                        break;
                    case Player.STATE_READY:
                        Log.d("hqlive", "ready");

                        break;
                }
            }
        });
    }

    public void handleFloatingUI() {
        this._floatingPanel.setVisibility(View.VISIBLE);
        this._floatingPanel.setAlpha(1);
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                panelFadeOut();
            }
        }, 2000);
    }

    private void hideFloatingUI() {
        this._floatingPanel.setVisibility(View.GONE);
        this._floatingPanel.setAlpha(0);
    }

    private void panelFadeOut() {
        if(this._floatingPanel.getVisibility() == View.GONE) {
            return;
        }

        ValueAnimator animator = ValueAnimator.ofFloat(1, 0);

        animator.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
            @Override
            public void onAnimationUpdate(ValueAnimator valueAnimator) {
                // 在动画更新时执行的操作
                float animatedValue = (float) valueAnimator.getAnimatedValue();
                _floatingPanel.setAlpha(animatedValue);
            }
        });
        animator.start(); // 启动动画

    }
}
