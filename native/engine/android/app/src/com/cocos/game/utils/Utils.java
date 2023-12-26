package com.cocos.game.utils;

import java.net.URL;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Map;

public class Utils {
    public static Map<String, String> parseURLParameters(String urlString) {
        Map<String, String> params = new HashMap<>();

        try {
            URL url = new URL(urlString);
            String query = url.getQuery();
            if (query != null) {
                String[] pairs = query.split("&");

                for (String pair : pairs) {
                    String[] keyValue = pair.split("=");
                    String key = URLDecoder.decode(keyValue[0], "UTF-8");
                    String value = "";

                    if (keyValue.length > 1) {
                        value = URLDecoder.decode(keyValue[1], "UTF-8");
                    }

                    params.put(key, value);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return params;
    }
}
