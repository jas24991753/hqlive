package com.cocos.game;

import android.content.Context;
import android.view.KeyEvent;
import android.widget.EditText;

public class CustomEditText extends EditText {

    public CustomEditText(Context context) {
        super(context);
    }

    @Override
    public boolean onKeyPreIme(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK) {


            //lose focus
            this.clearFocus();

            return true;
        }
        return false;
    }
}
