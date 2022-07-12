
#include "window.h"


Window::Window()
{
    setMinimumSize(600,700);
    setMinimumSize(1200,700);

    setStyleSheet("background-color:rgb(23, 23, 26);");
    layout = new MainLayout();


    QWebEngineView *view = new QWebEngineView(this);
    //view->load(QUrl("https://google.com"));
    view->load(QUrl("http://localhost:8080/"));

    layout->addWidget(view, MainLayout::Center);

    setLayout(layout);

    setWindowTitle(tr("SIXPRO v1"));

}


void Window::setWidgetsInside(QWidget *wdgCenter)
{
    //WdgFirstPage *wdgFirstPage = new WdgFirstPage();
    //WdgWalletSetup *wdgWalletSetup = new WdgWalletSetup(this, layout);
    //WdgPreviewSVG *wdgPreviewSVG = new WdgPreviewSVG();
    //wdgCreateANewWallet *WdgCreateANewWallet = new wdgCreateANewWallet();
    //WdgHome *wdgHome = new WdgHome();
    //WdgTransfer *wdgTransfer = new WdgTransfer();
    //WdgSplashScreen *wdgSplashScreen = new WdgSplashScreen();
    //layout->addWidget(centralWidget, BorderLayout::Center);
    //WdgTokenTransactions *wdgTokenTransactions = new WdgTokenTransactions();
    //WdgLoginWallet *wdgLoginWallet = new WdgLoginWallet();

    qDebug() << wdgCenter->metaObject()->className();

    // Clearing all items inside widget list
    /*
    for (auto item : liwdCenter->findItems("*", Qt::MatchWildcard)) {
           //do something with each item
        liwdCenter->removeItemWidget(item);
        //delete item;
    }
*/

}


/*
QLabel *Window::createLabel(const QString &text)
{
    QLabel *label = new QLabel(text);
    label->setFrameStyle(QFrame::Box | QFrame::Raised);
    return label;
}
*/
