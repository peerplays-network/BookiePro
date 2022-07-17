SET QT_INSTALLER_FRAMEWORK_PATH=C:/Qt/Tools/QtInstallerFramework/4.4
REM cd  SixPRO_INSTALLER_WIN

%QT_INSTALLER_FRAMEWORK_PATH%/bin/binarycreator  -c  config/config.xml  -p packages/  SIXPRO_WEB_APP_installer_windows.exe


