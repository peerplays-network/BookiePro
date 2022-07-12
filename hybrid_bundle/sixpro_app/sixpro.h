#ifndef SIXPRO_H
#define SIXPRO_H

#include <QMainWindow>

#include <QtWebEngineWidgets/QtWebEngineWidgets>
#include <QUrl>

#include <QPushButton>

#include "mainlayout.h"

QT_BEGIN_NAMESPACE
namespace Ui { class SixPro; }
QT_END_NAMESPACE

class SixPro : public QMainWindow
{
    Q_OBJECT

public:

    MainLayout *layout;

    SixPro(QWidget *parent = nullptr);
    ~SixPro();

private:
    Ui::SixPro *ui;
};
#endif // SIXPRO_H
