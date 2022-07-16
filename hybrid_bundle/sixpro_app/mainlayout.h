#ifndef MAINLAYOUT_H
#define MAINLAYOUT_H

#include <QLayout>
#include <QRect>

class MainLayout : public QLayout
{
public:
    enum Position { West, North, South, East, Center };

    explicit MainLayout(QWidget *parent, const QMargins &margins = QMargins(), int spacing = -1);
    MainLayout(int spacing = -1);
    ~MainLayout();

    void addItem(QLayoutItem *item) override;
    void addWidget(QWidget *widget, Position position);
    Qt::Orientations expandingDirections() const override;
    bool hasHeightForWidth() const override;
    int count() const override;
    QLayoutItem *itemAt(int index) const override;
    QSize minimumSize() const override;
    void setGeometry(const QRect &rect) override;
    QSize sizeHint() const override;
    QLayoutItem *takeAt(int index) override;

    void add(QLayoutItem *item, Position position);

private:
    struct ItemWrapper
    {
        ItemWrapper(QLayoutItem *i, Position p) {
            item = i;
            position = p;
        }

        QLayoutItem *item;
        Position position;
    };

    enum SizeType { MinimumSize, SizeHint };
    QSize calculateSize(SizeType sizeType) const;

    QList<ItemWrapper *> list;

};

#endif // MAINLAYOUT_H
