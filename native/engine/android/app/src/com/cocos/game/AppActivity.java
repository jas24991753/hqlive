/****************************************************************************
 Copyright (c) 2015-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
package com.cocos.game;

import static android.content.ContentValues.TAG;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.content.res.Configuration;
import android.graphics.PixelFormat;
import android.graphics.Rect;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.SurfaceView;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.view.WindowMetrics;
import android.widget.FrameLayout;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.datastore.preferences.core.MutablePreferences;
import androidx.datastore.preferences.core.Preferences;
import androidx.datastore.preferences.core.PreferencesKeys;
import androidx.datastore.preferences.rxjava3.RxPreferenceDataStoreBuilder;
import androidx.datastore.rxjava3.RxDataStore;

import com.cocos.game.OAuth.AuthCallback;
import com.cocos.game.OAuth.FacebookSignInHandler;
import com.cocos.game.OAuth.GoogleSignInHandler;
import com.cocos.game.OAuth.LineSignInHandler;
import com.cocos.game.OAuth.OAuthProvider;
import com.cocos.game.OAuth.OAuthRequestHandler;
import com.cocos.game.OAuth.TwitterSignInHandler;
import com.cocos.game.OAuth.YahooSignInHandler;
import com.cocos.game.activities.LiveStreamingActivity;
import com.cocos.game.activities.SelfieStreamingActivity;
import com.cocos.lib.CocosActivity;
import com.cocos.lib.GlobalObject;
import com.cocos.lib.JsbBridgeWrapper;
import com.cocos.service.SDKWrapper;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.tasks.Task;

import java.io.File;
import java.util.Collections;

import io.reactivex.rxjava3.core.Single;
import kotlinx.coroutines.CoroutineScope;


public class AppActivity extends CocosActivity {

    private int _cocosID;

    private int _liveID;

    private String currentActivityName;

    JsbBridgeWrapper jbw;

    private RxDataStore<Preferences> dataStoreRX;
    private OAuthRequestHandler authRequestHandler;
    private TwitterSignInHandler twitterSignInHandler;
    private GoogleSignInHandler googleSignInHandler;
    private LineSignInHandler lineSignInHandler;
    private YahooSignInHandler yahooSignInHandler;
    private FacebookSignInHandler facebookSignInHandler;
    private AuthCallback callback = new AuthCallback() {
        @Override
        public void onAuthCallback(boolean isAuth, String token) {
            Log.d(TAG, "isAuth:" + isAuth);
            Log.d(TAG, "token:" + token);

            jbw.dispatchEventToScript("JSB_APP_NOTIFY_TRANSITION_SCENE", "Main");
        }

        @Override
        public void onAuthFailed() {

        }
    };


    protected SurfaceView getCocosView() {
        @SuppressLint("ResourceType") SurfaceView view = (SurfaceView) mRootLayout.findViewById(_cocosID);
        return view;
    }

    private static String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte aByte : bytes) {
            sb.append(String.format("%02X:", aByte));
        }
        return sb.toString();
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // DO OTHER INITIALIZATION BELOW
        SDKWrapper.shared().init(this);
        jbw = JsbBridgeWrapper.getInstance();
        Store.init(this);

        dataStoreRX = new RxPreferenceDataStoreBuilder(this,"setting").build();

        WindowManager wm = (WindowManager) getApplication().getSystemService(Context.WINDOW_SERVICE);
        WindowMetrics windowMetrics = null;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            windowMetrics = wm.getCurrentWindowMetrics();
            Rect rect = windowMetrics.getBounds();
        }

        // 綁定cocos渲染id
        this._cocosID = this.mRootLayout.getChildAt(0).generateViewId();
        this.mRootLayout.getChildAt(0).setId(this._cocosID);

        IVirtualActivityCallback vaCallback = new IVirtualActivityCallback() {
            @Override
            public void onExit() {

            }

            @Override
            public void onTransitionScene(String activityName) {
                currentActivityName = activityName;
            }
        };

        // 建立自拍串流
        final SelfieStreamingActivity selfieStreamingActivity = new SelfieStreamingActivity(this, getWindowManager(), getCocosView());
        selfieStreamingActivity.registerCallback(vaCallback);
        selfieStreamingActivity.create();
        this.mRootLayout.addView(selfieStreamingActivity.rootView);
        selfieStreamingActivity.pause();

        // 建立直播串流
        final LiveStreamingActivity liveStreamingActivity = new LiveStreamingActivity(this, this.mRootLayout, this.getCocosView());
        liveStreamingActivity.registerCallback(vaCallback);
        liveStreamingActivity.create();
        this.mRootLayout.addView(liveStreamingActivity.rootView);
        liveStreamingActivity.pause();

        // 開啟文字輸入
        jbw.addScriptEventListener("JSB_OPEN_TEXT_INPUT", arg -> {
            Log.d("hqlive", "收到cocos jsb事件:JSB_OPEN_TEXT_INPUT");
            // textInput.show();
        });

        // 收到返回大廳
        jbw.addScriptEventListener("JSB_BACK_LOBBY", arg -> {
            GlobalObject.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Log.d("hqlive", "JSB_BACK_LOBBY:" + currentActivityName);
                    if (currentActivityName == null) {
                        return;
                    }
                    switch (currentActivityName) {
                        case "SelfieStreaming":
                            selfieStreamingActivity.pause();
                            getCocosView().getHolder().setFormat(PixelFormat.TRANSLUCENT);
                            break;
                        case "LiveStreaming":
                            liveStreamingActivity.pause();
                            getCocosView().getHolder().setFormat(PixelFormat.TRANSLUCENT);
                            break;
                        default:
                            break;
                    }
                }
            });
        });

        // 打印log
        jbw.addScriptEventListener("JSB_LOG", arg -> {
            Log.d("hqlive", "JS log:" + arg);
        });

        // 驗證使用者
        jbw.addScriptEventListener("JSB_CHECK_USER_AUTHENTICATION", arg -> {
            authentication();
        });

        // 第三方登入
        jbw.addScriptEventListener("JSB_TRIGGER_OAUTH", arg -> {
            switch (arg) {
                case OAuthProvider.GOOGLE:
                    googleSignInHandler.doAuthorization();
                    break;
                case OAuthProvider.LINE:
                    lineSignInHandler.doAuthorization();
                    break;
                case OAuthProvider.FACEBOOK:
                    facebookSignInHandler.doAuthorization();
                    break;
                case OAuthProvider.APPLE:
                    break;
                case OAuthProvider.TWITTER:
//                    GlobalObject.runOnUiThread(new Runnable() {
//                        @Override
//                        public void run() {
//                            getCocosView().setVisibility(View.GONE);
//                        }
//                    });
                    twitterSignInHandler.doAuthorization();
                    break;
                case OAuthProvider.YAHOO:
                    yahooSignInHandler.doAuthorization();
                    break;
            }
        });

        // 測試用code,暫時保留
        //        KeyboardDetector keyboardDetector = new KeyboardDetector( getWindow(),rect.height(),this.mRootLayout);
        //        TextInputRenderer textInput = new TextInputRenderer(this, this.mRootLayout);
        //        View textView = textInput.render();
        //
        //        this.mRootLayout.addView(textView);

        //        keyboardDetector.setOnLayoutChanged(new KeyboardDetector.OnLayoutChangedListener() {
        //            @Override
        //            public void onClosed() {
        //                textInput.hide();
        //            }
        //        });
        initOAuth();
    }

    public boolean putStringValue(String Key, String value){
        boolean returnValue;
        Preferences.Key<String> PREF_KEY = PreferencesKeys.stringKey(Key);
        Single<Preferences> updateResult =  dataStoreRX.updateDataAsync(prefsIn -> {
            MutablePreferences mutablePreferences = prefsIn.toMutablePreferences();
            mutablePreferences.set(PREF_KEY, value);
            return Single.just(mutablePreferences);
        });

        try {
            updateResult.blockingGet(); // 執行更新並等待結果
            returnValue = true; // 更新成功
        } catch (Exception e) {
            returnValue = false; // 更新失敗
        }
        return returnValue;
    }

    public String getStringValue(String Key) {
        Preferences.Key<String> PREF_KEY = PreferencesKeys.stringKey(Key);
        Single<String> value = dataStoreRX.data().firstOrError().map(prefs -> prefs.get(PREF_KEY)).onErrorReturnItem("null");
        return value.blockingGet();
    }

    private void authentication() {
        String token = Store.read("token");
        if (token == null) {
            jbw.dispatchEventToScript("JSB_APP_USER_UNAUTHORIZED");
        } else {
            jbw.dispatchEventToScript("JSB_APP_USER_AUTHORIZED");
        }
    }

    private void initOAuth() {
        authRequestHandler = new OAuthRequestHandler();

        initTwitter();
        initGoogle();
        initLine();
        initYahoo();
        initFacebook();
    }

    private void initGoogle() {
        ActivityResultLauncher<Intent> googleSignInLauncher = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
                    if (result.getResultCode() == Activity.RESULT_OK) {
                        Log.d("hqlive", "GOOGLE OK here");
                        Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(result.getData());
                        googleSignInHandler.handleSignInResult(task);
                    } else {
                        Log.d("hqlive", "why");
                    }
                }
        );

        googleSignInHandler = new GoogleSignInHandler(this, googleSignInLauncher, authRequestHandler, callback);
    }

    private void initTwitter() {
        ActivityResultLauncher<Intent> twitterSignInLauncher = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
                    if (result.getResultCode() == Activity.RESULT_OK) {
                        Intent data = result.getData();
                        String token = data.getStringExtra("token");
                        boolean isAuth = data.getBooleanExtra("isAuth", false);

                        jbw.dispatchEventToScript("JSB_APP_NOTIFY_TRANSITION_SCENE", "Main");
                        getCocosView().setVisibility(View.VISIBLE);
                        twitterSignInHandler.handleAuthorizationResponse(result.getData());
                    }
                }
        );
        twitterSignInHandler = new TwitterSignInHandler(this, twitterSignInLauncher);
    }

    private void initLine(){
        ActivityResultLauncher<Intent> lineSignInLauncher = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> lineSignInHandler.handleSignInResult(result.getResultCode(), result.getData())
        );

        lineSignInHandler = new LineSignInHandler(this,lineSignInLauncher, authRequestHandler, callback);
    }

    private void initYahoo(){

        ActivityResultLauncher<Intent> yahooSignInLauncher = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> yahooSignInHandler.handleSignInResult(result.getData())
        );

        yahooSignInHandler = new YahooSignInHandler(this, yahooSignInLauncher, authRequestHandler, callback);
    }

    private void initFacebook(){
        facebookSignInHandler = new FacebookSignInHandler(this ,authRequestHandler, callback);
    }

    private long lastBack = 0;

    @Override
    public boolean dispatchKeyEvent(KeyEvent event) {
        if (event.getKeyCode() == KeyEvent.KEYCODE_BACK && event.getAction() == KeyEvent.ACTION_DOWN) {
            //自己的操作
            if (lastBack == 0 || System.currentTimeMillis() - lastBack > 2000) {
                Toast.makeText(getApplicationContext(), "再按一次返回退出程序", Toast.LENGTH_SHORT).show();
                lastBack = System.currentTimeMillis();

            } else {
                finish();
            }
            return false;
        }
        return super.dispatchKeyEvent(event);
    }

    @Override
    protected void onResume() {
        super.onResume();
        SDKWrapper.shared().onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
        SDKWrapper.shared().onPause();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        // Workaround in https://stackoverflow.com/questions/16283079/re-launch-of-activity-on-home-button-but-only-the-first-time/16447508
        if (!isTaskRoot()) {
            return;
        }
        SDKWrapper.shared().onDestroy();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        SDKWrapper.shared().onActivityResult(requestCode, resultCode, data);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        // SDKWrapper.shared().onNewIntent(intent);
    }

    @Override
    protected void onRestart() {
        super.onRestart();
        // SDKWrapper.shared().onRestart();
    }

    @Override
    protected void onStop() {
        super.onStop();
        SDKWrapper.shared().onStop();
    }

    @Override
    public void onBackPressed() {
        SDKWrapper.shared().onBackPressed();
        super.onBackPressed();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        SDKWrapper.shared().onConfigurationChanged(newConfig);
        super.onConfigurationChanged(newConfig);
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState) {
        SDKWrapper.shared().onRestoreInstanceState(savedInstanceState);
        super.onRestoreInstanceState(savedInstanceState);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        SDKWrapper.shared().onSaveInstanceState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onStart() {
        SDKWrapper.shared().onStart();
        super.onStart();
    }

    @Override
    public void onLowMemory() {
        SDKWrapper.shared().onLowMemory();
        super.onLowMemory();
    }
}
