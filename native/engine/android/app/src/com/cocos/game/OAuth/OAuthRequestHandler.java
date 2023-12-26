package com.cocos.game.OAuth;

import static android.content.ContentValues.TAG;

import android.util.Log;

import com.cocos.game.api.response.IApi;
import com.cocos.game.api.response.VerificationResponse;

import java.util.concurrent.TimeUnit;

import okhttp3.OkHttpClient;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class OAuthRequestHandler {
//    private static final String BASE_URL = "https://53d4-211-23-35-187.ngrok-free.app/";
     private static final String BASE_URL = "http://192.168.17.116:8180/";


    public void authenticate(String accessToken,String idToken, String authType,AuthCallback callback) {
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        IApi oAuthApiService = retrofit.create(IApi.class);

        oAuthApiService.authenticate(accessToken,idToken, authType).enqueue(new Callback<VerificationResponse>() {
            @Override
            public void onResponse(Call<VerificationResponse> call, Response<VerificationResponse> response) {
                if (response.isSuccessful()) {
                    VerificationResponse oauthResponse = response.body();
                    if (oauthResponse != null) {
                        // 使用 oauthResponse 的數據
                        boolean isAuth = oauthResponse.getAuth();
                        String responseToken = oauthResponse.getToken();
                        // ...其他處理
                        if(callback != null) {
                            callback.onAuthCallback(isAuth,responseToken);
                        }
                    }

                    Log.d(TAG, "response isSuccessful call " + call);
                    Log.d(TAG, "response isSuccessful response " + response);
                    Log.d(TAG, "response isSuccessful oauthResponse " + oauthResponse);
                } else {
                    // 處理錯誤響應
                    if(callback != null) {
                        callback.onAuthFailed();
                    }
                }
            }

            @Override
            public void onFailure(Call<VerificationResponse> call, Throwable t) {
                // 處理網絡錯誤或請求失敗
                Log.d(TAG, "response onFailure call " + call);
                Log.d(TAG, "response onFailure t " + t);
            }
        });
    }

    public void authenticateTwitter(String state, String code,AuthCallback callback) {
        OkHttpClient okHttpClient = new OkHttpClient().newBuilder()
                .connectTimeout(10, TimeUnit.SECONDS)
                .readTimeout(10, TimeUnit.SECONDS)
                .writeTimeout(10, TimeUnit.SECONDS)
                .build();

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .client(okHttpClient)
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        IApi oAuthApiService = retrofit.create(IApi.class);

        oAuthApiService.authenticateTwitter(state, code).enqueue(new Callback<VerificationResponse>() {
            @Override
            public void onResponse(Call<VerificationResponse> call, Response<VerificationResponse> response) {
                if (response.isSuccessful()) {
                    VerificationResponse oauthResponse = response.body();
                    if (oauthResponse != null) {
                        // 使用 oauthResponse 的數據
                        boolean isAuth = oauthResponse.getAuth();
                        String responseToken = oauthResponse.getToken();

                        if(callback != null) {
                            callback.onAuthCallback(isAuth,responseToken);
                        }
                    }
                } else {
                    // 處理錯誤響應
                    if(callback != null) {
                        callback.onAuthFailed();
                    }
                }
            }

            @Override
            public void onFailure(Call<VerificationResponse> call, Throwable t) {
                // 處理錯誤響應
                if(callback != null) {
                    callback.onAuthFailed();
                }
            }
        });
    }
}
