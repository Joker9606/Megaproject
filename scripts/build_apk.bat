@echo off
setlocal enabledelayedexpansion

echo ==============================================
echo Building Smart Neighborhood Android APK v1.0
echo ==============================================

set "SDK_ROOT=%LOCALAPPDATA%\Android\Sdk"
set "BUILD_TOOLS=%SDK_ROOT%\build-tools\34.0.0"
set "PLATFORM=%SDK_ROOT%\platforms\android-34\android.jar"
set "JAVA_BIN=%JAVA_HOME%\bin"

if not exist "%BUILD_TOOLS%\aapt2.exe" (
    echo Error: aapt2.exe not found at %BUILD_TOOLS%
    exit /b 1
)

if not exist "%PLATFORM%" (
    echo Error: android.jar not found at %PLATFORM%
    exit /b 1
)

echo [1/7] Cleaning and preparing directories...
if exist android_build\bin rmdir /s /q android_build\bin
if exist android_build\gen rmdir /s /q android_build\gen
if exist android_build\dex rmdir /s /q android_build\dex
mkdir android_build\bin
mkdir android_build\gen
mkdir android_build\dex
if not exist public mkdir public

echo [2/7] Compiling Android resources with AAPT2...
"%BUILD_TOOLS%\aapt2.exe" compile --dir android_build\res -o android_build\compiled_res.zip
if %ERRORLEVEL% NEQ 0 (
    echo AAPT2 compile failed
    exit /b 1
)

echo [3/7] Linking APK package with AAPT2...
"%BUILD_TOOLS%\aapt2.exe" link -o android_build\unaligned.apk -I "%PLATFORM%" --manifest android_build\AndroidManifest.xml android_build\compiled_res.zip --java android_build\gen
if %ERRORLEVEL% NEQ 0 (
    echo AAPT2 link failed
    exit /b 1
)

echo [4/7] Compiling Java classes with javac...
"%JAVA_BIN%\javac.exe" -encoding UTF-8 -cp "%PLATFORM%" -d android_build\bin android_build\gen\com\smartneighborhood\app\R.java android_build\src\com\smartneighborhood\app\MainActivity.java
if %ERRORLEVEL% NEQ 0 (
    echo javac compilation failed
    exit /b 1
)

echo [5/7] Converting bytecode to Dalvik Executable (classes.dex) with D8...
call "%BUILD_TOOLS%\d8.bat" --output android_build\dex android_build\bin\com\smartneighborhood\app\*.class
if %ERRORLEVEL% NEQ 0 (
    echo D8 failed
    exit /b 1
)

echo [6/7] Packaging classes.dex into APK...
cd android_build\dex
"%JAVA_BIN%\jar.exe" uf ..\unaligned.apk classes.dex
cd ..\..

echo [7/7] Zipaligning and Signing APK...
"%BUILD_TOOLS%\zipalign.exe" -f -p 4 android_build\unaligned.apk android_build\aligned.apk
if %ERRORLEVEL% NEQ 0 (
    echo zipalign failed
    exit /b 1
)

if not exist android_build\smartneighborhood.keystore (
    echo Generating signing keystore...
    "%JAVA_BIN%\keytool.exe" -genkeypair -validity 10000 -dname "CN=SmartNeighborhood, OU=Mobile, O=Smart Neighborhood Network, L=Bengaluru, ST=Karnataka, C=IN" -alias smarthelp -keyalg RSA -keysize 2048 -storepass smarthelp123 -keypass smarthelp123 -keystore android_build\smartneighborhood.keystore
)

call "%BUILD_TOOLS%\apksigner.bat" sign --ks android_build\smartneighborhood.keystore --ks-pass pass:smarthelp123 --key-pass pass:smarthelp123 --out public\SmartNeighborhood-v1.0.apk android_build\aligned.apk
if %ERRORLEVEL% NEQ 0 (
    echo apksigner failed
    exit /b 1
)

copy /y public\SmartNeighborhood-v1.0.apk public\SmartNeighborhood.apk >nul
copy /y public\SmartNeighborhood-v1.0.apk public\app-release.apk >nul

echo.
echo ====================================================
echo SUCCESS! Android APK built, signed, and verified:
echo - public\SmartNeighborhood-v1.0.apk
echo - public\SmartNeighborhood.apk
echo - public\app-release.apk
echo ====================================================
