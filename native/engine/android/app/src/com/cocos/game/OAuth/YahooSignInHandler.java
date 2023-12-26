package com.cocos.game.OAuth;

import static android.content.ContentValues.TAG;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.preference.Preference;
import android.util.Log;

import androidx.activity.result.ActivityResultLauncher;
import androidx.annotation.Nullable;
import androidx.datastore.core.DataStore;

import com.cocos.game.AppActivity;
import com.cocos.game.OAuth.service.YahooOAuth;
import com.xpg.hqlive.R;

import net.openid.appauth.AuthState;
import net.openid.appauth.AuthorizationException;
import net.openid.appauth.AuthorizationRequest;
import net.openid.appauth.AuthorizationResponse;
import net.openid.appauth.AuthorizationService;
import net.openid.appauth.AuthorizationServiceConfiguration;
import net.openid.appauth.CodeVerifierUtil;
import net.openid.appauth.ResponseTypeValues;
import net.openid.appauth.TokenRequest;
import net.openid.appauth.TokenResponse;

import org.json.JSONException;
import org.json.JSONObject;

import io.jsonwebtoken.io.IOException;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class YahooSignInHandler {

    private static final int RC_AUTH = 1001;
    private static final String AUTHENTICATION_END_POINT = "https://api.login.yahoo.com/oauth2/request_auth?lang=en-US";
    private static final String TOKEN_END_POINT = "https://api.login.yahoo.com/oauth2/get_token";
    private static final String SHARED_PREFERENCES_NAME = "AuthStatePreference";
    private static final String AUTH_STATE = "AUTH_STATE";

    private OAuthRequestHandler requestHandler;
    private ActivityResultLauncher<Intent> yahooSignInLauncher;
    private YahooOAuth yahooOAuth;
    private AppActivity mActivity;
    private AuthCallback callback;
    private Intent loginIntent;


    public YahooSignInHandler(AppActivity activity , ActivityResultLauncher<Intent> launcher, OAuthRequestHandler requestHandler,AuthCallback callback) {
        this.mActivity = activity;
        this.requestHandler = requestHandler;
        this.yahooSignInLauncher = launcher;
        this.init();
        this.callback = callback;

    }

    public void init(){
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://api.login.yahoo.com/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        yahooOAuth = retrofit.create(YahooOAuth.class);

        AuthorizationService authService = new AuthorizationService(mActivity);
        this.loginIntent = authService.getAuthorizationRequestIntent(getAuthRequest());
    }

    public void doAuthorization() {
        yahooSignInLauncher.launch(this.loginIntent);
    }

    private AuthorizationRequest getAuthRequest() {
        Uri tokenEndPointUri = Uri.parse(TOKEN_END_POINT);
        Uri authenticationEndPointUri = Uri.parse(AUTHENTICATION_END_POINT);
        AuthorizationServiceConfiguration configuration = new AuthorizationServiceConfiguration(authenticationEndPointUri, tokenEndPointUri);

        return new AuthorizationRequest.Builder(
                configuration,
                mActivity.getString(R.string.yahoo_channelId),
                ResponseTypeValues.CODE,
                Uri.parse(mActivity.getString(R.string.yahoo_redirect_uri))
        ).setScope("openid")
                .setLoginHint("sheng@xpg.tech")
                .setCodeVerifier(CodeVerifierUtil.generateRandomCodeVerifier()) // 添加用於 PKCE 的隨機代碼驗證器
                .build();
    }

    private void persistAuthState(AuthState authState) {
//        SharedPreferences sharedPreferences = mActivity.getSharedPreferences(SHARED_PREFERENCES_NAME, Context.MODE_PRIVATE);
//        sharedPreferences.edit()
//                .putString(AUTH_STATE, authState.jsonSerializeString())
//                .apply(); // 或者使用 commit() 來立即提交變更
        Boolean updateValue = mActivity.putStringValue(AUTH_STATE , authState.jsonSerializeString());
        Log.d(TAG, "yahoo put value : " + updateValue);

    }

    private AuthState restoreAuthState() {
//        SharedPreferences sharedPreferences = mActivity.getSharedPreferences(SHARED_PREFERENCES_NAME, Context.MODE_PRIVATE);
//        String jsonString = sharedPreferences.getString(AUTH_STATE, null);
        String jsonString = mActivity.getStringValue(AUTH_STATE);

        Log.d(TAG, "yahoo get value : " + jsonString);
        if (jsonString != null && !jsonString.isEmpty()) {
            try {
                return AuthState.jsonDeserialize(jsonString);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    public void handleSignInResult(Intent intent) {

        Log.d(TAG, "yahoo handleSignInResult intent : " + intent);

        if (intent != null) {
            AuthorizationResponse response = AuthorizationResponse.fromIntent(intent);
            AuthorizationException error = AuthorizationException.fromIntent(intent);
            AuthState authState = new AuthState(response, error);

            Log.d(TAG, "yahoo handleSignInResult response: " + response);
            if (response != null) {
                AuthorizationService service = new AuthorizationService(mActivity);
                TokenRequest request = response.createTokenExchangeRequest();

                service.performTokenRequest(request, new AuthorizationService.TokenResponseCallback() {
                    @Override
                    public void onTokenRequestCompleted(@Nullable TokenResponse tokenResponse, @Nullable AuthorizationException exception) {
                        if (tokenResponse != null) {
                            authState.update(tokenResponse, exception);
                            persistAuthState(authState);

                            // 獲取用戶信息
                            getUserInfo();
                        }
                    }
                });
            }
        }
    }

    private void getUserInfo() {
        AuthState authState = restoreAuthState();
        AuthorizationService authorizationService = new AuthorizationService(mActivity);

        if (authState != null) {
            authState.performActionWithFreshTokens(authorizationService, new AuthState.AuthStateAction() {
                @Override
                public void execute(@Nullable String accessToken, @Nullable String idToken, @Nullable AuthorizationException exception) {
                    if (accessToken != null) {

                        Log.d(TAG, "getUserInfo accessToken : " + accessToken);
//                        requestHandler.authenticate( accessToken, idToken, "Yahoo", callback);
                        requestHandler.authenticate( accessToken, "", "Yahoo", callback);

                        //取得yahoo的用戶資料
//                        yahooOAuth.getUserInfo("Bearer " + accessToken).enqueue(new Callback<ResponseBody>() {
//                            @Override
//                            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
//                                if (response.isSuccessful()) {
//                                    try {
//                                        String userInfoString = response.body().toString();
//                                        JSONObject userJSONObject = new JSONObject(userInfoString);
//                                        setUserProfile(userJSONObject);
//                                    } catch (IOException | JSONException e) {
//                                        e.printStackTrace();
//                                    }
//                                }
//                            }
//
//                            @Override
//                            public void onFailure(Call<ResponseBody> call, Throwable t) {
//                                Log.e("TAG", "getUserInfo onFailure", t);
//                            }
//                        });
                    }
                }
            });
        }
    }

    private void setUserProfile(JSONObject userJSONObject) {
        // 在這裡處理用戶個人資料的更新
        // 例如更新 UI 或保存數據
    }

}
