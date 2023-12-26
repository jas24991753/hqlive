package com.cocos.game.OAuth;

import static android.content.ContentValues.TAG;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import androidx.activity.result.ActivityResultLauncher;

import com.linecorp.linesdk.LineApiResponse;
import com.linecorp.linesdk.LineApiResponseCode;
import com.linecorp.linesdk.Scope;
import com.linecorp.linesdk.api.LineApiClient;
import com.linecorp.linesdk.api.LineApiClientBuilder;
import com.linecorp.linesdk.auth.LineAuthenticationParams;
import com.linecorp.linesdk.auth.LineLoginApi;
import com.linecorp.linesdk.auth.LineLoginResult;
import com.xpg.hqlive.R;

import java.util.Arrays;
import java.util.UUID;

public class LineSignInHandler {

    private OAuthRequestHandler requestHandler;
    private ActivityResultLauncher<Intent> lineSignInLauncher;
    private Activity mActivity;
    private AuthCallback callback;
    private Intent loginIntent;


    public LineSignInHandler(Activity activity , ActivityResultLauncher<Intent> launcher,OAuthRequestHandler requestHandler,AuthCallback callback) {
        this.mActivity = activity;
        this.requestHandler = requestHandler;
        this.lineSignInLauncher = launcher;
        this.init();
        this.callback = callback;
    }

    private void init(){
        Scope lineScope = Scope.PROFILE;
        Scope lineOpenIdScope = Scope.OPENID_CONNECT;

        this.loginIntent = LineLoginApi.getLoginIntent(
                mActivity,
                mActivity.getString(R.string.line_channelId),
                new LineAuthenticationParams.Builder()
                        .scopes(Arrays.asList(lineScope, lineOpenIdScope))
                        .build()
        );
    }

    public void doAuthorization() {
        lineSignInLauncher.launch(loginIntent);
    }

    public void handleSignInResult(int resultCode, Intent data){
        if (resultCode == Activity.RESULT_OK) {
            LineLoginResult loginResult = LineLoginApi.getLoginResultFromIntent(data);
            if (loginResult.getResponseCode() == LineApiResponseCode.SUCCESS) {
                // 處理登入成功
                String idToken = loginResult.getLineIdToken().getRawString();
                requestHandler.authenticate( idToken, "", "Line", callback);
            } else {
                // 處理登入失敗或取消
            }
        } else {
            // 處理登入失敗或取消
        }
    }

    public void logOut(){

        LineApiClient lineApiClient = new LineApiClientBuilder(mActivity ,mActivity.getString(R.string.line_channelId)).build();
        LineApiResponse<?> response = lineApiClient.logout();


        if(response.isSuccess()){
            // 登出成功，更新應用狀態
            Log.d(TAG, "line logOut isSuccess");

        }else{
            // 處理登出失敗
            Log.d(TAG, "line logOut onFailure");
        }
    }


}
