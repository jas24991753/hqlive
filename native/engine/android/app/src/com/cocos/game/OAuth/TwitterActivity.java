package com.cocos.game.OAuth;

import static android.content.ContentValues.TAG;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.appcompat.app.AppCompatActivity;

import com.cocos.game.utils.Utils;
import com.xpg.hqlive.R;

import java.util.Map;

public class TwitterActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.twitter_ui);
        AuthCallback callback = new AuthCallback() {
            @Override
            public void onAuthCallback(boolean isAuth, String token) {
                Intent resultIntent = new Intent();
                resultIntent.putExtra("isAuth", isAuth);
                resultIntent.putExtra("token", token);
                setResult(Activity.RESULT_OK, resultIntent);
                finish();
            }

            @Override
            public void onAuthFailed() {

            }
        };

        View rootview = ((Activity) this).getWindow().getDecorView().findViewById(android.R.id.content);
        WebView webview = rootview.findViewById(R.id.webview);
        webview.setWebChromeClient(new WebChromeClient());

        WebViewClient client = new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);

                // 隱藏twitter登入頁內的google登入與apple登入鈕(因為無法正常運作)
                view.evaluateJavascript(
                        "const styleElement = document.createElement('style');" +
                                "const cssCode = 'div[data-testid=\"google_sign_in_container\"]{display:none}div[data-testid=\"apple_sign_in_button\"]{display:none}div[data-testid=\"apple_sign_in_button\"]+div{display:none}';" +
                                "styleElement.appendChild(document.createTextNode(cssCode));" +
                                "document.head.appendChild(styleElement);"

                        ,
                        null
                );
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                if (request.getUrl().toString().contains("v1/oAuth/twitter/callback")) {
                    // 登入成功
                    String url = request.getUrl().toString().replace("localhost", "192.168.17.57");
                    Map<String, String> params = Utils.parseURLParameters(url);

                    OAuthRequestHandler handler = new OAuthRequestHandler();
                    Log.d("hqlive", "Server驗證.." + url);
                    handler.authenticateTwitter(params.get("state"), params.get("code"),callback);
                    return true;
                }

                return false;
            }
        };

        webview.setWebViewClient(client);
        WebView.setWebContentsDebuggingEnabled(true);
        webview.setFocusableInTouchMode(true);
        webview.getSettings().setJavaScriptEnabled(true);
        webview.getSettings().setAllowFileAccessFromFileURLs(true);

        webview.getSettings().setAllowUniversalAccessFromFileURLs(true);
        webview.getSettings().setUserAgentString("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36");

        String url = "http://7b80-211-23-35-187.ngrok-free.app/v1/auth?OAuthType=Twitter";
        webview.loadUrl(url);
    }
}

