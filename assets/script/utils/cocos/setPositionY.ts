import { Node } from 'cc';

export const setPositionY = (node: Node, value: number): void => {
    const x = node.position.x;
    const y = value;
    const z = node.position.z;
    node.setPosition(x, y, z);
}

window.setPositionY = setPositionY;

