import { Node, Widget } from 'cc';
/**
 * 遞迴強制更新Widget工具
 *
 * @param {Node} node
 */
export const deepUpdateWidget = (node: Node) => {
    const widget = node.getComponent(Widget);
    if (widget) {
        widget.updateAlignment();
    }

    if (node.children.length > 0) {
        for (let i = 0; i < node.children.length; i++) {
            deepUpdateWidget(node.children[i]);
        }
    }
}
