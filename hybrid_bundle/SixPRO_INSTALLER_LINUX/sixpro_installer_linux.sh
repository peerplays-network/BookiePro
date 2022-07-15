QT_INSTALLER_FRAMEWORK_PATH=$HOME/Qt/Tools/QtInstallerFramework/4.4
cd  SixPRO_INSTALLER_LINUX

$QT_INSTALLER_FRAMEWORK_PATH/bin/binarycreator  -c  config.xml  -p packages/  DEXBot_linux_installer.run 


