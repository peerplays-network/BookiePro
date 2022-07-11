#include "sixpro.h"
#include "./ui_sixpro.h"

SixPro::SixPro(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::SixPro)
{
    ui->setupUi(this);
}

SixPro::~SixPro()
{
    delete ui;
}

