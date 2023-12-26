package com.cocos.game;

import android.content.Context;
import android.graphics.Bitmap;
import android.media.Image;
import android.util.Log;
import android.util.Size;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.Window;
import android.view.WindowManager;

import androidx.annotation.NonNull;
import androidx.camera.core.CameraSelector;
import androidx.camera.core.ImageAnalysis;
import androidx.camera.core.ImageProxy;
import androidx.camera.lifecycle.ProcessCameraProvider;
import androidx.core.content.ContextCompat;
import androidx.lifecycle.LifecycleOwner;

import com.google.common.util.concurrent.ListenableFuture;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.ArrayList;
import java.util.concurrent.ExecutionException;

import ai.deepar.ar.ARErrorType;
import ai.deepar.ar.CameraResolutionPreset;
import ai.deepar.ar.DeepAR;
import ai.deepar.ar.AREventListener;
import ai.deepar.ar.DeepARImageFormat;

public class ARCameraView implements SurfaceHolder.Callback, AREventListener{

    private SurfaceView arView;
    private Context context;
    private WindowManager windowManager;

    // deep ar 相關
    private DeepAR deepAR;
    ArrayList<String> effects;
    private int currentEffect=0;
    private ByteBuffer[] buffers;
    private int currentBuffer = 0;
    private static final int NUMBER_OF_BUFFERS=2;
    private int width = 0;
    private int height = 0;


    // camera 相關
    private int lensFacing = CameraSelector.LENS_FACING_FRONT;
    private ListenableFuture<ProcessCameraProvider> cameraProviderFuture;
    private CameraSelector cameraSelector;
    private ImageAnalysis imageAnalysis;
    private ProcessCameraProvider cameraProvider;

    private boolean isProviderBound = false;

    public ARCameraView(Context context, WindowManager windowManager, SurfaceView view) {
        this.arView = view;
        this.context = context;
        this.windowManager = windowManager;
        initialize();
    }

    private void initialize() {
        initializeDeepAR();
        initializeFilters();
        initalizeViews();
    }

    private void initializeDeepAR() {
        deepAR = new DeepAR(context);
        deepAR.setLicenseKey("1209c30aac850226add855a55ab986ff341be3989c485ab465d1091fd3939359c9b469b49c9bbd7c");
        deepAR.initialize(context, this);
        setupCamera();
    }

    private void initializeFilters() {
        effects = new ArrayList<>();
        effects.add("burning_effect.deepar");
        effects.add("Fire_Effect.deepar");
        effects.add("viking_helmet.deepar");
        effects.add("Vendetta_Mask.deepar");
        effects.add("Neon_Devil_Horns.deepar");
        effects.add("Humanoid.deepar");
    }

    private void initalizeViews() {
        arView.getHolder().addCallback(this);
    }

    private void setupCamera() {
        cameraProviderFuture = ProcessCameraProvider.getInstance(context);
        cameraProviderFuture.addListener(new Runnable() {
            @Override
            public void run() {
                try {
                    cameraProvider = cameraProviderFuture.get();
                    bindImageAnalysis(cameraProvider);
                } catch (ExecutionException | InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }, ContextCompat.getMainExecutor(context));
    }

    private void bindImageAnalysis(@NonNull ProcessCameraProvider cameraProvider) {
        CameraResolutionPreset cameraResolutionPreset = CameraResolutionPreset.P1920x1080;
        Size cameraResolution = DeviceUtil.getCameraResolution(windowManager,cameraResolutionPreset);
        Size displaySize = DeviceUtil.getDefaultDisplaySize(windowManager);
        width = displaySize.getWidth();
        height = displaySize.getHeight();

        cameraSelector = new CameraSelector.Builder().requireLensFacing(lensFacing).build();
        buffers = new ByteBuffer[NUMBER_OF_BUFFERS];
        for (int i = 0; i < NUMBER_OF_BUFFERS; i++) {
            buffers[i] = ByteBuffer.allocateDirect(width * height * 4);
            buffers[i].order(ByteOrder.nativeOrder());
            buffers[i].position(0);
        }

        imageAnalysis = new ImageAnalysis.Builder()
                .setOutputImageFormat(ImageAnalysis.OUTPUT_IMAGE_FORMAT_RGBA_8888)
                .setTargetResolution(cameraResolution)
                .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                .build();
        imageAnalysis.setAnalyzer(ContextCompat.getMainExecutor(context), imageAnalyzer);
        cameraProvider.unbindAll();
    }

    private ImageAnalysis.Analyzer imageAnalyzer = new ImageAnalysis.Analyzer() {
        @Override
        public void analyze(@NonNull ImageProxy image) {
            ByteBuffer buffer = image.getPlanes()[0].getBuffer();
            buffer.rewind();
            buffers[currentBuffer].put(buffer);
            buffers[currentBuffer].position(0);
            if (deepAR != null) {
                deepAR.receiveFrame(buffers[currentBuffer],
                        image.getWidth(), image.getHeight(),
                        image.getImageInfo().getRotationDegrees(),
                        lensFacing == CameraSelector.LENS_FACING_FRONT,
                        DeepARImageFormat.RGBA_8888,
                        image.getPlanes()[0].getPixelStride()
                );
            }
            currentBuffer = (currentBuffer + 1) % NUMBER_OF_BUFFERS;
            image.close();
        }
    };

    public void startPreview() {
        if(cameraProvider == null) {
            return;
        }
        if(isProviderBound) {
            return;
        }
        cameraProvider.bindToLifecycle((LifecycleOwner)context, cameraSelector, imageAnalysis);
        isProviderBound = true;
    }

    public void stop() {
        if(cameraProvider == null) {
            return;
        }
        cameraProvider.unbindAll();
        isProviderBound = false;
        setSelfieEffect("none");
    }

    public void setSelfieEffect(String string) {
        deepAR.switchEffect("effect", getFilterPath(string));
    }

    @Override
    public void screenshotTaken(Bitmap bitmap) {

    }

    @Override
    public void videoRecordingStarted() {

    }

    @Override
    public void videoRecordingFinished() {

    }

    @Override
    public void videoRecordingFailed() {

    }

    @Override
    public void videoRecordingPrepared() {

    }

    @Override
    public void shutdownFinished() {

    }

    @Override
    public void initialized() {
        deepAR.switchEffect("effect", "none");
    }

    private String getFilterPath(String filterName) {
        if (filterName.equals("none")) {
            return null;
        }
        return "file:///android_asset/" + filterName;
    }

    @Override
    public void faceVisibilityChanged(boolean b) {

    }

    @Override
    public void imageVisibilityChanged(String s, boolean b) {

    }

    @Override
    public void frameAvailable(Image image) {

    }

    @Override
    public void error(ARErrorType arErrorType, String s) {

    }

    @Override
    public void effectSwitched(String s) {

    }

    @Override
    public void surfaceCreated(@NonNull SurfaceHolder holder) {
        Log.d("hqlive", "surfaceCreated");
    }

    @Override
    public void surfaceChanged(@NonNull SurfaceHolder holder, int format, int width, int height) {
        Log.d("hqlive", "surfaceChanged");
        deepAR.setRenderSurface(holder.getSurface(), width, height);
    }

    @Override
    public void surfaceDestroyed(@NonNull SurfaceHolder holder) {
        Log.d("hqlive", "surfaceDestroyed");
    }
}
