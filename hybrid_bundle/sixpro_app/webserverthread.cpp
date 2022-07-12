#include "webserverthread.h"

thread2::thread2()
{
    //qDebug("dfd");
}
void thread2::run()
{
    int test = 0;

    // HTTP
    httplib::Server svr;

    // HTTPS
    //httplib::SSLServer svr;

    svr.Get("/hi", [](const httplib::Request &, httplib::Response &res) {
      res.set_content("Hello World!", "text/plain");
    });

    auto ret = svr.set_mount_point("/", "./www");
    if (!ret) {
      // The specified base directory doesn't exist...
    }

    svr.listen("0.0.0.0", 8080);
}
