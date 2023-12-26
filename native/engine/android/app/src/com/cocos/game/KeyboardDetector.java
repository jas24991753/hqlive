package com.cocos.game;

import android.graphics.Rect;
import android.view.View;
import android.view.ViewTreeObserver;
import android.view.Window;

public class KeyboardDetector {

    private int height;

    private View view;

    private Window window;

    private boolean isOpen = false;

    public interface OnLayoutChangedListener {
        void onClosed();
    }

    private OnLayoutChangedListener listener;

    public void setOnLayoutChanged(OnLayoutChangedListener listener) {
        this.listener = listener;
    }

    public boolean isKoyboardOpened() {
        Rect r = new Rect();
        this.view.getWindowVisibleDisplayFrame(r);
        return r.bottom != this.height;
    }
    public KeyboardDetector(Window window, int height, View view) {
        this.view = view;
        this.window = window;
        this.height = height;
        this.addLayoutChangeListener();
    }

    private void addLayoutChangeListener() {
        this.view.getViewTreeObserver().addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
            @Override
            public void onGlobalLayout() {
                view.postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        // 在這裡執行需要延遲的操作
                        if(isKoyboardOpened()) {
                            // ...
                        } else  {
                            if(listener != null) {
                                listener.onClosed();
                            }
                        }
                    }
                }, 100); // 延遲時間，單位毫秒

            }
        });
    }
}
