package com.cocos.game.api.response;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Query;

public interface IApi {
    @GET("v1/oAuth/app/callback")
    Call<VerificationResponse> authenticate(
            @Query("access_token") String accessToken,
            @Query("id_token") String idToken,
            @Query("auth_type") String authType
    );

    @GET("v1/oAuth/twitter/callback")
    Call<VerificationResponse> authenticateTwitter(
            @Query("state") String state,
            @Query("code") String code
    );
}
