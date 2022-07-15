QT       += core gui

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets
# QT       +=  webenginecore webenginecore-private
QT       += webenginewidgets network


CONFIG += c++17

# You can make your code fail to compile if it uses deprecated APIs.
# In order to do so, uncomment the following line.
#DEFINES += QT_DISABLE_DEPRECATED_BEFORE=0x060000    # disables all the APIs deprecated before Qt 6.0.0

SOURCES += \
    main.cpp \
    mainlayout.cpp \
    webserverthread.cpp \
    window.cpp

HEADERS += \
    httplib.h \
    mainlayout.h \
    webserverthread.h \
    window.h

FORMS +=

TRANSLATIONS += \
    sixpro_app_en_US.ts
CONFIG += lrelease
CONFIG += embed_translations

# Default rules for deployment.
qnx: target.path = /tmp/$${TARGET}/bin
else: unix:!android: target.path = /opt/$${TARGET}/bin
!isEmpty(target.path): INSTALLS += target
