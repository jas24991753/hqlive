package com.cocos.game;

import android.graphics.Bitmap;
import android.graphics.Rect;
import android.media.Image;

import java.nio.ByteBuffer;

public class ImageUtil {

    public static native void yuv420p2rgba(byte[] yuv420p,
                                           int width,
                                           int height,
                                           byte[] rgba);
    public static void getI420FromImage(Image image, byte[] outBuffer) {
        Rect crop = image.getCropRect();
        int width = crop.width();
        int height = crop.height();

        int yLength = width * height;
        if (outBuffer == null || outBuffer.length != yLength * 3 / 2) {
            return;
        }
        long time = System.currentTimeMillis();
        // YUV_420_888
        Image.Plane[] planes = image.getPlanes();
        ByteBuffer yBuffer = planes[0].getBuffer();
        ByteBuffer uBuffer = planes[1].getBuffer();
        ByteBuffer vBuffer = planes[2].getBuffer();

        int stride = planes[0].getRowStride();
        int pixelStrideUV = planes[1].getPixelStride(); // pixelStride = 2

        synchronized (outBuffer) {
            if (stride == width) {
                yBuffer.get(outBuffer, 0, yLength);
                int index = yLength;
                for (int i = 0; i < yLength / 2; i += pixelStrideUV) {
                    outBuffer[index++] = uBuffer.get(i);
                }
                for (int i = 0; i < yLength / 2; i += pixelStrideUV) {
                    outBuffer[index++] = vBuffer.get(i);
                }
            } else {
                for (int i = 0; i < height; i++) {
                    yBuffer.position(i * stride);
                    yBuffer.get(outBuffer, i * width, width);
                }
                int index = yLength;
                for (int i = 0; i < height / 2; i++) {
                    int offset = i * stride;
                    for (int j = 0; j < width; j += pixelStrideUV) {
                        outBuffer[index++] = uBuffer.get(offset + j);
                    }
                }
                for (int i = 0; i < height / 2; i++) {
                    int offset = i * stride;
                    for (int j = 0; j < width; j += pixelStrideUV) {
                        outBuffer[index++] = vBuffer.get(offset + j);
                    }
                }
            }
        }
    }

    public static Bitmap yuv420pToBitmap(byte[] yuv420p, int width, int height) {
        if (yuv420p == null || width < 0 || height < 0) {
            return null;
        }
        byte[] rgba = new byte[width * height * 4];
        ImageUtil.yuv420pToRGBA(yuv420p, width, height, rgba);
        Bitmap bitmap = byteArrayToBitmap(rgba, width, height);
        return bitmap;
    }

    /**
     * 将 rgba 的 byte[] 数据转换成 bitmap
     *
     * @param rgba   输入的 rgba 数据
     * @param width  图片宽度
     * @param height 图片高度
     * @return 得到的 bitmap
     */
    public static Bitmap byteArrayToBitmap(byte[] rgba, int width, int height) {
        ByteBuffer buffer = ByteBuffer.wrap(rgba);
        Bitmap bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
        bitmap.copyPixelsFromBuffer(buffer);
        return bitmap;
    }

    public static void yuv420pToRGBA(byte[] yuv420p, int width, int height, byte[] rgba) {
        if (yuv420p == null || rgba == null) {
            return;
        }
        if (yuv420p.length != width * height * 3 / 2) {
            return;
        }
        ImageUtil.yuv420p2rgba(yuv420p, width, height, rgba);
    }
}
