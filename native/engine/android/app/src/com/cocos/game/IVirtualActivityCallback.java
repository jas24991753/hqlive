package com.cocos.game;

public interface IVirtualActivityCallback {
    void onExit();

    void onTransitionScene(String activityName);
}
