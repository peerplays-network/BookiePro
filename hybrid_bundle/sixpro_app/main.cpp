#include "window.h"

#include <QApplication>
#include <QLocale>
#include <QTranslator>


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

    QCoreApplication::addLibraryPath("./plugins");

    // Web Server starting in new thread
    thread2 thread;
    thread.start();

    Window w;
    //w.show();
    //w.showFullScreen();
    w.showMaximized();
    return a.exec();
}
