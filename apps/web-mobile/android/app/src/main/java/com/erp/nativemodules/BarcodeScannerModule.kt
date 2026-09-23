package com.erp.nativemodules

import android.app.Activity
import android.content.Intent
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class BarcodeScannerModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), ActivityEventListener {

    private var pendingPromise: Promise? = null
    private val requestCode = 1907

    init {
        reactContext.addActivityEventListener(this)
    }

    override fun getName(): String = "BarcodeScanner"

    @ReactMethod
    fun scan(promise: Promise) {
        val activity = currentActivity
        if (activity == null) {
            promise.reject("NO_ACTIVITY", "A foreground activity is required to scan a barcode.")
            return
        }
        if (pendingPromise != null) {
            promise.reject("SCAN_IN_PROGRESS", "A barcode scan is already in progress.")
            return
        }

        pendingPromise = promise
        val intent = Intent("com.google.zxing.client.android.SCAN").apply {
            putExtra("SCAN_MODE", "PRODUCT_MODE")
        }
        try {
            activity.startActivityForResult(intent, requestCode)
        } catch (error: Exception) {
            pendingPromise = null
            promise.reject("SCANNER_UNAVAILABLE", "No compatible barcode scanner is installed.", error)
        }
    }

    override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode != this.requestCode) return

        val promise = pendingPromise ?: return
        pendingPromise = null
        if (resultCode == Activity.RESULT_OK) {
            promise.resolve(data?.getStringExtra("SCAN_RESULT"))
        } else {
            promise.reject("SCAN_CANCELLED", "The barcode scan was cancelled.")
        }
    }

    override fun onNewIntent(intent: Intent?) = Unit
}
