package com.cocos.game;

import static com.cocos.lib.GlobalObject.runOnUiThread;

import android.content.Context;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;

public class TextInputRenderer {
    private Context context;

    private View layout = null;

    private View rootLayout = null;

    public TextInputRenderer(Context context, View rootLayout) {
        this.context = context;
        this.rootLayout = rootLayout;
    }

    public void show() {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                layout.setVisibility(View.VISIBLE);
                InputMethodManager imm = (InputMethodManager) context.getSystemService(Context.INPUT_METHOD_SERVICE);
                if (imm != null) {
                    imm.toggleSoftInput(0, 0);
                }
            }
        });
    }

    public void hide() {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                layout.setVisibility(View.GONE);
            }
        });
    }

    public View render() {
        ConstraintLayout parentLayout = new ConstraintLayout(this.context);
        parentLayout.setLayoutParams(new ConstraintLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        CustomEditText editTextMessage = new CustomEditText(this.context);
        editTextMessage.setId(View.generateViewId());
        editTextMessage.setHint("輸入訊息");

        parentLayout.addView(editTextMessage);

        ConstraintLayout.LayoutParams editTextParams = (ConstraintLayout.LayoutParams) editTextMessage.getLayoutParams();
        editTextParams.width = ConstraintLayout.LayoutParams.MATCH_PARENT;
        editTextParams.height = ConstraintLayout.LayoutParams.WRAP_CONTENT;
        editTextMessage.setLayoutParams(editTextParams);

        ConstraintSet constraintSet = new ConstraintSet();
        constraintSet.clone(parentLayout);

        constraintSet.connect(editTextMessage.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, 0);
        constraintSet.connect(editTextMessage.getId(), ConstraintSet.START, ConstraintSet.PARENT_ID, ConstraintSet.START, 0);
        constraintSet.connect(editTextMessage.getId(), ConstraintSet.END, ConstraintSet.PARENT_ID, ConstraintSet.END, 0);

        constraintSet.applyTo(parentLayout);
        parentLayout.setFitsSystemWindows(true);

        parentLayout.setVisibility(View.GONE);

        this.layout = parentLayout;

        return parentLayout;
    }
}


/**
 *
 ConstraintLayout parentLayout = new ConstraintLayout(this.context);
 parentLayout.setLayoutParams(new ConstraintLayout.LayoutParams(
 ViewGroup.LayoutParams.MATCH_PARENT,
 ViewGroup.LayoutParams.MATCH_PARENT
 ));

 // editText layout
 LinearLayout linearInputLayout = new LinearLayout(this.context);
 linearInputLayout.setId(View.generateViewId());
 linearInputLayout.setLayoutParams(new LinearLayout.LayoutParams(
 ViewGroup.LayoutParams.MATCH_PARENT,
 ViewGroup.LayoutParams.WRAP_CONTENT
 ));
 linearInputLayout.setOrientation(LinearLayout.VERTICAL);
 linearInputLayout.setPadding(8, 8, 8, 8);

 // editText元件
 EditText editTextMessage = new EditText(this.context);

 LinearLayout.LayoutParams editTextParams = new LinearLayout.LayoutParams(
 LinearLayout.LayoutParams.MATCH_PARENT,
 LinearLayout.LayoutParams.WRAP_CONTENT
 );

 editTextMessage.setLayoutParams(editTextParams);
 editTextMessage.setHint("輸入訊息");
 linearInputLayout.addView(editTextMessage);

 ConstraintLayout.LayoutParams linearParams = new ConstraintLayout.LayoutParams(
 ConstraintLayout.LayoutParams.MATCH_PARENT,
 ConstraintLayout.LayoutParams.WRAP_CONTENT
 );
 parentLayout.addView(linearInputLayout, linearParams);

 this.layout = parentLayout;

 // parentLayout.setVisibility(View.GONE); // 初始狀態設置為隱藏

 // 使用 ConstraintSet 調整約束以避免遮擋
 ConstraintSet constraintSet = new ConstraintSet();
 constraintSet.clone(parentLayout);

 constraintSet.connect(linearInputLayout.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, 0);
 constraintSet.applyTo(parentLayout);
 parentLayout.setFitsSystemWindows(true);


 */
