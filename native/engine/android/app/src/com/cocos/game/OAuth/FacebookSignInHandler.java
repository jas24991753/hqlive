package com.cocos.game.OAuth;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.ActivityResultRegistryOwner;

import com.facebook.CallbackManager;
import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.FacebookSdk;
import com.facebook.login.LoginManager;
import com.facebook.login.LoginResult;

import java.util.Arrays;

public class FacebookSignInHandler {

    private OAuthRequestHandler requestHandler;
    private CallbackManager facebookCallbackManager;
    private Activity mActivity;
    private AuthCallback callback;

    public FacebookSignInHandler(Activity activity , OAuthRequestHandler requestHandler, AuthCallback callback) {
        this.mActivity = activity;
        this.requestHandler = requestHandler;
        FacebookSdk.fullyInitialize();
        facebookCallbackManager = CallbackManager.Factory.create();
        this.init();
        this.callback = callback;
    }

    private void init(){
        LoginManager.getInstance().registerCallback(facebookCallbackManager,
                new FacebookCallback<LoginResult>() {
                    @Override
                    public void onSuccess(LoginResult loginResult) {
                        // 登入成功，處理 Access Token

                        // 應用程式代碼
                        Log.d("TAG", "Facebook LoginManager Callback successfully.");
                        String responseAccessToken = loginResult.getAccessToken().getToken();
                        Log.d("TAG", responseAccessToken);

                        requestHandler.authenticate( responseAccessToken, "", "Facebook", callback);
                    }

                    @Override
                    public void onCancel() {
                        // 登入取消
                        Log.d("TAG", "Facebook LoginManager Callback onCancel.");
                    }

                    @Override
                    public void onError(FacebookException exception) {
                        // 登入錯誤
                        Log.d("TAG", "Facebook LoginManager Callback onError.");
                    }
                });

    }

    public void doAuthorization() {
        LoginManager.getInstance().logInWithReadPermissions(
                (ActivityResultRegistryOwner) mActivity,
                facebookCallbackManager,
                Arrays.asList("public_profile", "email")
        );

    }

}
