import { CCInteger, Component, Node, Prefab, ScrollView, Sprite, SpriteFrame, UITransform, _decorator } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 放置多個相同大小的方形元件
 *
 * @export
 * @class VerticalItemAligner
 * @extends {Component}
 */
@ccclass('VerticalItemAligner')
export class VerticalItemAligner extends Component {
    @property(CCInteger)
    paddingBottom: number = 15;

    @property(CCInteger)
    paddingRight: number = 10;

    @property(CCInteger)
    itemsInRow: number = 2;

    @property(Prefab)
    target: Prefab = null;

    @property(Node)
    content: Node;

    private _itemCount: number = 0;

    private _contentWidth: number;

    private _itemWidth: number;

    private getRowIndex(): number {
        return Math.floor(this._itemCount / this.itemsInRow);
    }

    private getColIndex(): number {
        return this._itemCount % this.itemsInRow;
    }

    load(data: any[]): void {
        this._itemCount = 0;
        data.forEach((item, index) => {

            this.add(item);
        });
    }

    add(item: any): void {
        const row = this.getRowIndex();
        const col = this.getColIndex();
        const sprite = item.prefab.getChildByName('Sprite').getComponent(Sprite);
        sprite.spriteFrame = item.spriteFrame;
        const width = this._itemWidth;
        const height = this._itemWidth;

        const x = width / 2 + col * width + this.paddingRight * col;
        const y = - height / 2 - row * height - this.paddingBottom * row;
        item.prefab.getComponent(UITransform).setContentSize(this._itemWidth, this._itemWidth);
        item.prefab.setPosition(x, y, 0);
        this.content.addChild(item.prefab);
        this._itemCount++;
    }

    updateItem(index: number, asset: SpriteFrame): void {
        const sprite = this.content.children[index].getChildByName('Sprite').getComponent(Sprite);
        sprite.spriteFrame = asset;
    }

    onDragMove(): void {

        const scroll = this.node.getComponent(ScrollView);

        // console.log(scroll.getScrollOffset().y);

    }

    start() {
        this._contentWidth = this.node.parent.getComponent(UITransform).width;

        this._itemWidth = (this._contentWidth - this.paddingRight * (this.itemsInRow - 1)) / this.itemsInRow;

        this.node.on(Node.EventType.TOUCH_MOVE, this.onDragMove, this);
    }

    update(deltaTime: number) {

    }
}

