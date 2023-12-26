package com.cocos.game.OAuth.service;

import com.cocos.game.OAuth.response.GoogleResponse;

import retrofit2.Call;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.POST;

public interface GoogleOAuth {
    @FormUrlEncoded
    @POST("oauth2/v4/token")
    Call<GoogleResponse> getToken(
            @Field("grant_type") String grantType,
            @Field("client_id") String clientId,
            @Field("client_secret") String clientSecret,
            @Field("redirect_uri") String redirectUri,
            @Field("code") String code
    );
}
