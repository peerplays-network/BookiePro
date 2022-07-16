#ifndef WEBSERVERTHREAD_H
#define WEBSERVERTHREAD_H
#include <QThread>

//#define CPPHTTPLIB_OPENSSL_SUPPORT
#include "httplib.h"

class thread2 : public QThread
{
    Q_OBJECT

public:
    thread2();

protected:
    void run();

};

#endif // WEBSERVERTHREAD_H
