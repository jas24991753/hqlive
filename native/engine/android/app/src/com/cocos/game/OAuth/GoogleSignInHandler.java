package com.cocos.game.OAuth;

import static android.content.ContentValues.TAG;

import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.service.autofill.UserData;
import android.util.Log;

import androidx.activity.result.ActivityResultLauncher;

import com.cocos.game.OAuth.response.GoogleResponse;
import com.cocos.game.OAuth.service.GoogleOAuth;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.Scopes;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.common.api.Scope;
import com.google.android.gms.tasks.Task;
import com.xpg.hqlive.R;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class GoogleSignInHandler {
    private OAuthRequestHandler requestHandler;
    private GoogleSignInClient mGoogleSignInClient;
    private ActivityResultLauncher<Intent> googleSignInLauncher;
    private Activity mActivity;
    private AuthCallback callback;

    public GoogleSignInHandler(Activity activity ,ActivityResultLauncher<Intent> launcher,OAuthRequestHandler requestHandler,AuthCallback callback) {
        this.mActivity = activity;
        this.requestHandler = requestHandler;
        this.googleSignInLauncher = launcher;
        this.init();
        this.callback = callback;
    }

    private void init(){

        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestScopes(new Scope(Scopes.OPEN_ID), new Scope(Scopes.PLUS_ME))
                .requestServerAuthCode(mActivity.getString(R.string.google_web_client_id))
                .requestIdToken(mActivity.getString(R.string.google_web_client_id))
                .requestProfile()
                .requestEmail()
                .build();

        mGoogleSignInClient = GoogleSignIn.getClient(mActivity, gso);
    }

    public void doAuthorization() {
        googleSignInLauncher.launch(mGoogleSignInClient.getSignInIntent());
    }

    public void handleSignInResult(Task<GoogleSignInAccount> task){

        try {
            GoogleSignInAccount account = task.getResult(ApiException.class);
            // Signed in successfully, show authenticated UI.
            Log.d("GoogleLoginlog", "DisplayName : " + account.getDisplayName());
            Log.d("hqlive","google id_token:" + account.getIdToken());
            Retrofit retrofit = new Retrofit.Builder()
                    .baseUrl("https://www.googleapis.com/")
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();

            GoogleOAuth service = retrofit.create(GoogleOAuth.class);
            service.getToken(
                    "authorization_code",
                    mActivity.getString(R.string.google_web_client_id),
                    mActivity.getString(R.string.google_web_client_secret),
                    mActivity.getString(R.string.google_redirect_uri),
                    account.getServerAuthCode()
            ).enqueue(new Callback<GoogleResponse>() {
                @Override
                public void onResponse(Call<GoogleResponse> call, Response<GoogleResponse> response) {
                    if (response.isSuccessful()) {
                        GoogleResponse googleResponse = response.body();
                        String responseAccessToken = googleResponse.getAccessToken();
                        String idToken = account.getIdToken();
                        Log.d(TAG, responseAccessToken);

                        requestHandler.authenticate( responseAccessToken, idToken, "Google", callback);
                        // Call retrofitRequest or other methods to handle the response...
                    } else {
                        Log.e(TAG, "Response not successful:" + response.message());
                    }
                }

                @Override
                public void onFailure(Call<GoogleResponse> call, Throwable t) {
                    Log.e(TAG, "Failed to get token", t);
                }
            });

        } catch (ApiException e) {
            Log.w("TAG", "signInResult:failed code=" + e.getStatusCode());
        }
    }

    public  void  onSignInSuccess(UserData data){

    }

    public void onSignInFailure(String errorMessage){

    }

}

