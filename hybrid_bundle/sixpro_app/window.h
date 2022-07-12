
#ifndef WINDOW_H
#define WINDOW_H

#include <QWidget>
#include <QDebug>
#include <QListWidget>
#include <QListWidgetItem>

#include <QtWebEngineWidgets/QtWebEngineWidgets>
#include <QUrl>

#include "mainlayout.h"


QT_BEGIN_NAMESPACE
class QLabel;
QT_END_NAMESPACE

class Window : public QWidget
{
    Q_OBJECT

public:

    MainLayout *layout;
    Window();

    void setWidgetsInside(QWidget *wdgCenter);

private:
    QLabel *createLabel(const QString &text);
};

#endif // WINDOW_H
