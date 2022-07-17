REM Automatic producing installer for windows

REM GIT, node, npm, yarn, ms visual studio 2019 should be installed with C++ support
REM This script should run under visual studio x86_64 terminal 
REM First clone git
cd c:\
rmdir /s /q "bookiepro"
git clone --recursive -b installers-for-all-platforms-1 https://gitlab.com/PBSA/bookie/bookiepro.git
cd bookiepro
call yarn
REM call yarn add shx
call yarn add shx --location=global
call yarn build
move build www

REM cd \bookiepro
cd C:\bookiepro\hybrid_bundle\
mkdir build_win_631_release
cd build_win_631_release


C:\Qt\6.3.1\msvc2019_64\bin\qmake.exe C:\bookiepro\hybrid_bundle\sixpro_app\sixpro_app.pro -spec win32-msvc "CONFIG+=qtquickcompiler"


C:\Qt\Tools\QtCreator\bin\jom\jom.exe -f C:/bookiepro/hybrid_bundle/build_win_631_release/Makefile qmake_all

C:\Qt\Tools\QtCreator\bin\jom\jom.exe -f Makefile.Release


cd C:\bookiepro\hybrid_bundle\
mkdir deploy_win_631_release
cd deploy_win_631_release
C:\Qt\6.3.1\msvc2019_64\bin\windeployqt.exe C:/bookiepro/hybrid_bundle/build_win_631_release/release/sixpro_app.exe  --dir .

copy c:\bookiepro\hybrid_bundle\build_win_631_release\release\sixpro_app.exe .

xcopy C:\bookiepro\www  C:\bookiepro\hybrid_bundle\deploy_win_631_release\www  /E /H /C /I  /Y  

REM NOW LETS MAKE INSTALLER :)

xcopy C:\bookiepro\hybrid_bundle\deploy_win_631_release  C:\bookiepro\hybrid_bundle\SixPRO_INSTALLER_WIN\packages\com.peerplays.sixpro\data  /E /H /C /I  /Y  

cd C:\bookiepro\hybrid_bundle\SixPRO_INSTALLER_WIN

sixpro_installer_win.bat




