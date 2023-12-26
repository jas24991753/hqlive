import { CompareOp } from "../../core/enum/CompareOp";

/**
 * 數值比較裝飾器
 * 
 * val1 (op) val2
 *
 * @param {CompareOp} op
 * @param {number} val1
 * @param {number} val2
 * @return {*} 
 */
export const compare = (op: CompareOp, val1: number, val2: number) => {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            let excute = true;
            switch (op) {
                case CompareOp.LT:
                    excute = (val1 < val2);
                case CompareOp.LE:
                    excute = (val1 <= val2);
                case CompareOp.EQ:
                    excute = (val1 === val2);
                case CompareOp.NE:
                    excute = (val1 !== val2);
                case CompareOp.GE:
                    excute = (val1 >= val2);
                case CompareOp.GT:
                    excute = (val1 > val2);
            }
            if (!excute) {
                return;
            }


            const result = originalMethod.apply(this, args);
            return result;
        };

        return descriptor;
    };
}