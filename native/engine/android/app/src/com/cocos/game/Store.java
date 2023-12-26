package com.cocos.game;

import android.content.Context;
import android.util.Log;

import androidx.datastore.preferences.core.MutablePreferences;
import androidx.datastore.preferences.core.Preferences;
import androidx.datastore.preferences.core.PreferencesKeys;
import androidx.datastore.preferences.rxjava3.RxPreferenceDataStoreBuilder;
import androidx.datastore.rxjava3.RxDataStore;

import io.reactivex.rxjava3.core.Flowable;
import io.reactivex.rxjava3.core.Single;

public class Store {
    private static RxDataStore<Preferences> dataStore = null;

    public static void init(Context context) {
        if (dataStore != null) {
            return;
        }
        Store.dataStore = new RxPreferenceDataStoreBuilder(context, /*name=*/ "xpg").build();
    }

    public static String read(String key) {
        // read key
        Preferences.Key<String> KEY = PreferencesKeys.stringKey(key);

        Flowable<String> flow =
                dataStore.data().map(prefs -> prefs.get(KEY));
        try {
            String data = flow.blockingFirst();
            return data;
        } catch (Exception e) {
            return null;
        }
    }

    public static void write(String key, String value) {
        Preferences.Key<String> KEY = PreferencesKeys.stringKey(key);
        Single<Preferences> setResult = dataStore.updateDataAsync(preferences -> {
            MutablePreferences mutablePreferences = preferences.toMutablePreferences();
            mutablePreferences.set(KEY,value);
            return Single.just(mutablePreferences);
        });
    }
}
