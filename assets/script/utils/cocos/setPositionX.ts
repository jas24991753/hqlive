import { Node } from 'cc';

export const setPositionX = (node: Node, value: number): void => {
    const x = value;
    const y = node.position.y;
    const z = node.position.z;
    node.setPosition(x, y, z);
}

window.setPositionX = setPositionX;
