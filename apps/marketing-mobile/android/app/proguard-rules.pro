# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# react-native-reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# React Native & Hermes
-keep class com.facebook.react.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.hermes.** { *; }
-dontwarn com.facebook.hermes.**

# Expo Modules Autolinking
-keep class expo.modules.** { *; }
-keep interface expo.modules.** { *; }
-keepclassmembers class * extends expo.modules.kotlin.modules.Module { *; }
-keepclassmembers class * {
    @expo.modules.kotlin.records.Field *;
}

# Networking & Async
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn javax.annotation.**
-keepattributes *Annotation*,InnerClasses,Signature,EnclosingMethod

# Enum reflection safety
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}
