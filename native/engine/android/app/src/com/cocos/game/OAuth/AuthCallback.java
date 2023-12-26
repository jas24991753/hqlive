package com.cocos.game.OAuth;

public interface AuthCallback {
    void onAuthCallback(boolean isAuth, String token);

    void onAuthFailed();

}
