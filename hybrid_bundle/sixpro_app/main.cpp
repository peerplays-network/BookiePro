
#ifdef _WIN32
//#define WIN32_LEAN_AND_MEAN  // We only need minimal includes
//#include <pthread.h>
//#elif defined(HAVE_PTHREAD)
//#include <pthread.h>
//#else
//#error "No suitable threading library available."
#include <winsock2.h> // Note: To fix bug for winsock v1 and v2 both inclusion
#include <windows.h>

#endif

#include "window.h"

#include <QApplication>
#include <QLocale>
#include <QTranslator>
#include <QThread>

#include <QWebEngineProfile>
#include <QWebEngineSettings>



#include "webserverthread.h"

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);

    QTranslator translator;
    const QStringList uiLanguages = QLocale::system().uiLanguages();
    for (const QString &locale : uiLanguages) {
        const QString baseName = "sixpro_app_" + QLocale(locale).name();
        if (translator.load(":/i18n/" + baseName)) {
            a.installTranslator(&translator);
            break;
        }
    }
    //SixPro w;

    //QCoreApplication::addLibraryPath("./plugins");

    QWebEngineProfile::defaultProfile()->settings()->setAttribute(QWebEngineSettings::PluginsEnabled, true);
    QWebEngineProfile::defaultProfile()->settings()->setAttribute(QWebEngineSettings::JavascriptEnabled, true);
    QWebEngineProfile::defaultProfile()->settings()->setAttribute(QWebEngineSettings::LocalStorageEnabled, true);
    QWebEngineProfile::defaultProfile()->settings()->setAttribute(QWebEngineSettings::DnsPrefetchEnabled, true);

    // Web Server starting in new thread
    thread2 thread;
    thread.start();

    Window w;
    //w.show();
    //w.showFullScreen();
    w.showMaximized();
    return a.exec();
}
