package com.cocos.game.OAuth;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;

import androidx.activity.result.ActivityResultLauncher;

import com.xpg.hqlive.R;

public class TwitterSignInHandler {

    private Context context;

    private ActivityResultLauncher<Intent> launcher;

    public TwitterSignInHandler(Context context, ActivityResultLauncher<Intent> launcher) {
        this.context = context;
        this.launcher = launcher;
    }

    public void doAuthorization() {
        Intent intent = new Intent(this.context, TwitterActivity.class);
        // 使用 ActivityResultLauncher 啟動 Activity
        this.launcher.launch(intent);

//        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse("http://192.168.17.57:8180/v1/auth?OAuthType=Twitter"));
//        context.startActivity(intent);

    }

    public void handleAuthorizationResponse(Intent data) {
        if (data != null) {
            String receivedString = data.getStringExtra("token");
            boolean receivedBoolean = data.getBooleanExtra("isAuth", false);

        }
    }
}
