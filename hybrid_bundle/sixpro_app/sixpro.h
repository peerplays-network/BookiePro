#ifndef SIXPRO_H
#define SIXPRO_H

#include <QMainWindow>

QT_BEGIN_NAMESPACE
namespace Ui { class SixPro; }
QT_END_NAMESPACE

class SixPro : public QMainWindow
{
    Q_OBJECT

public:
    SixPro(QWidget *parent = nullptr);
    ~SixPro();

private:
    Ui::SixPro *ui;
};
#endif // SIXPRO_H
