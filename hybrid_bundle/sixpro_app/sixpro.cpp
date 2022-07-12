#include "sixpro.h"
#include "./ui_sixpro.h"

SixPro::SixPro(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::SixPro)
{
    ui->setupUi(this);

    layout = new MainLayout();

    QWebEngineView *view = new QWebEngineView(parent);
    //view->load(QUrl("http://qt-project.org/"));
    //view->show();
    //view->setUrl(QUrl("http://qt-project.org/"));
    //view->repaint();
    QPushButton *btn = new QPushButton("test");

    layout->addWidget(btn, MainLayout::Center);

    setLayout(layout);

    setWindowTitle(tr("SIXPRO v1"));
}

SixPro::~SixPro()
{
    delete ui;
}

