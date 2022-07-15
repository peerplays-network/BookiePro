
#include "window.h"


Window::Window()
{
    setMinimumSize(600,700);
    setMinimumSize(1200,700);

    setStyleSheet("background-color:rgb(23, 23, 26);");
    layout = new MainLayout();


    view = new QWebEngineView(this);

    QWebEnginePage *page = new QWebEnginePage(view);
    //view->setPage(page);

    page->settings()->setAttribute(QWebEngineSettings::AutoLoadImages, true);
    page->settings()->setAttribute(QWebEngineSettings::JavascriptEnabled, true);
    page->settings()->setAttribute(QWebEngineSettings::JavascriptCanOpenWindows, true);
    page->settings()->setAttribute(QWebEngineSettings::JavascriptCanAccessClipboard, true);
    page->settings()->setAttribute(QWebEngineSettings::LinksIncludedInFocusChain, true);
    page->settings()->setAttribute(QWebEngineSettings::LocalStorageEnabled, true);
    page->settings()->setAttribute(QWebEngineSettings::LocalContentCanAccessRemoteUrls, true);
    page->settings()->setAttribute(QWebEngineSettings::XSSAuditingEnabled, true);
    page->settings()->setAttribute(QWebEngineSettings::SpatialNavigationEnabled, true);
    page->settings()->setAttribute(QWebEngineSettings::LocalContentCanAccessFileUrls, true);
    page->settings()->setAttribute(QWebEngineSettings::HyperlinkAuditingEnabled, true);
    page->settings()->setAttribute(QWebEngineSettings::ScrollAnimatorEnabled, true);
    page->settings()->setAttribute(QWebEngineSettings::ErrorPageEnabled, true);
    page->settings()->setAttribute(QWebEngineSettings::PluginsEnabled, true);
    page->settings()->setAttribute(QWebEngineSettings::FullScreenSupportEnabled, true);
    page->settings()->setAttribute(QWebEngineSettings::ScreenCaptureEnabled, true);
    page->settings()->setAttribute(QWebEngineSettings::WebGLEnabled, true);
    page->settings()->setAttribute(QWebEngineSettings::Accelerated2dCanvasEnabled, true);
    page->settings()->setAttribute(QWebEngineSettings::HyperlinkAuditingEnabled, true);
    page->settings()->setAttribute(QWebEngineSettings::AutoLoadIconsForPage, true);
    page->settings()->setAttribute(QWebEngineSettings::TouchIconsEnabled, true);

    //cookie_ = new CookieJar(this); // for cookie sync

    //page->profile()->setPersistentStoragePath("");
    //page->profile()->setCachePath("");
    page->profile()->setHttpCacheMaximumSize(500 * 1024 * 1024);
    page->profile()->setHttpCacheType(QWebEngineProfile::DiskHttpCache);
    page->profile()->setHttpUserAgent("Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.101 Safari/537.36");
    page->profile()->setPersistentCookiesPolicy(QWebEngineProfile::ForcePersistentCookies);

    QTimer::singleShot(1000, this, &Window::update);

    layout->addWidget(view, MainLayout::Center);

    setLayout(layout);

    setWindowTitle(tr("SIXPRO v1"));

}


void Window::update()
{
    qDebug() << "update";
    view->load(QUrl("http://localhost:8080/"));
    view->show();

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
