package com.smartneighborhood.app;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.GeolocationPermissions;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.ProgressBar;

public class MainActivity extends Activity {
    private WebView webView;
    private ProgressBar progressBar;
    private static final String DEFAULT_URL = "http://localhost:3000";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Customize status bar
        Window window = getWindow();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
            window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            window.setStatusBarColor(Color.parseColor("#1E40AF"));
        }

        // Layout container
        FrameLayout layout = new FrameLayout(this);
        layout.setBackgroundColor(Color.parseColor("#0F172A"));

        // WebView
        webView = new WebView(this);
        webView.setBackgroundColor(Color.parseColor("#F8FAFC"));
        layout.addView(webView, new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
        ));

        // Horizontal Progress Bar
        progressBar = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
        progressBar.setMax(100);
        progressBar.setProgress(0);
        progressBar.setVisibility(View.GONE);
        FrameLayout.LayoutParams pbParams = new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT, 8
        );
        layout.addView(progressBar, pbParams);

        setContentView(layout);

        // Configure WebSettings
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setGeolocationEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setSupportZoom(false);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }

        // Setup Clients
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                if (newProgress < 100) {
                    progressBar.setVisibility(View.VISIBLE);
                    progressBar.setProgress(newProgress);
                } else {
                    progressBar.setVisibility(View.GONE);
                }
            }

            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                callback.invoke(origin, true, false);
            }
        });

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                return handleSpecialUrls(url);
            }

            @SuppressWarnings("deprecation")
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return handleSpecialUrls(url);
            }

            private boolean handleSpecialUrls(String url) {
                if (url.startsWith("tel:") || url.startsWith("mailto:") || url.startsWith("sms:") || url.startsWith("geo:") || url.startsWith("whatsapp:")) {
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        startActivity(intent);
                        return true;
                    } catch (Exception e) {
                        return false;
                    }
                }
                return false;
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request.isForMainFrame()) {
                    showOfflineError();
                }
            }
        });

        // Try loading URL
        loadApplication();
    }

    private void loadApplication() {
        webView.loadUrl(DEFAULT_URL);
    }

    private void showOfflineError() {
        String html = "<!DOCTYPE html><html><head><meta name='viewport' content='width=device-width, initial-scale=1.0'>"
                + "<style>body{margin:0;padding:24px;background:#f8fafc;font-family:sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:90vh;text-align:center;color:#0f172a;}"
                + ".card{background:white;padding:32px 24px;border-radius:24px;box-shadow:0 10px 25px rgba(0,0,0,0.06);max-width:360px;width:100%;border:1px solid #e2e8f0;}"
                + ".icon{width:64px;height:64px;margin:0 auto 16px;background:#eff6ff;color:#2563eb;border-radius:20px;display:flex;align-items:center;justify-content:center;font-size:28px;}"
                + "h2{font-size:20px;margin:0 0 8px;font-weight:800;}p{color:#64748b;font-size:13px;line-height:1.5;margin:0 0 24px;}"
                + "button{background:#2563eb;color:white;border:none;padding:14px 28px;border-radius:14px;font-weight:700;font-size:14px;cursor:pointer;width:100%;box-shadow:0 4px 12px rgba(37,99,235,0.3);}"
                + "</style></head><body>"
                + "<div class='card'>"
                + "<div class='icon'>&#128737;</div>"
                + "<h2>Smart Neighborhood</h2>"
                + "<p>Unable to connect to the neighborhood help service. Please ensure your device is online or your local server is active.</p>"
                + "<button onclick='location.reload()'>Retry Connection</button>"
                + "</div></body></html>";
        webView.loadDataWithBaseURL(null, html, "text/html", "UTF-8", null);
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
