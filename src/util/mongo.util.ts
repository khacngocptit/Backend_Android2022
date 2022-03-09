import { StringUtil } from "./string.util";

export class MongoUtil {
    static combineSelect<T>(select: { [field: string]: 0 | 1 }, mode: 0 | 1, props: (keyof T)[]): any {
        const selectMode = Object.values(select ?? {})?.[0];
        if (selectMode === undefined) {
            return props.reduce((dict, prop) => Object.assign(dict, { [prop]: mode }), {});
        } else {
            if (selectMode === mode) {
                props.forEach((prop) => {
                    Object.assign(select, { [prop]: mode });
                });
            } else {
                props.forEach((prop) => {
                    delete select[prop as string];
                });
            }
        }
        return select;
    }

    static regexMatchFilter(key: string, value: string): any {
        return {
            [key]: {
                $regex: StringUtil.regexMatch(value),
                $options: "i",
            },
        };
    }
}
