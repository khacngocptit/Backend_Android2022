export class StringUtil {
    static capitalize(s: string): string {
        if (!s) {
            return "";
        }
        s.trim();
        return `${s.charAt(0).toUpperCase()}${s.slice(1).toLowerCase()}`;
    }

    static capitalizeComponent(s: string): string {
        if (!s) {
            return "";
        }
        return s
            .split(" ")
            .map((component) => this.capitalize(component))
            .join(" ");
    }

    static getNameComponent(
        name: string,
    ): {
        fullname: string;
        firstname?: string;
        lastname?: string;
    } {
        if (!name) {
            return { fullname: "" };
        }
        name.trim();
        try {
            const temp = name.split(" ").map((component) => this.capitalize(component));
            const fullname = temp.join(" ");
            const firstname = temp.splice(-1)[0];
            const lastname = temp.join(" ");
            return { fullname, firstname, lastname };
        } catch (err) {
            return { fullname: name };
        }
    }

    static compareName(name1: string, name2: string): number {
        const c1 = this.getNameComponent(name1);
        const c2 = this.getNameComponent(name2);
        return c1.firstname?.localeCompare(c2.firstname) || c1.lastname?.localeCompare(c2.lastname) || 0;
    }

    static normalizeFileName(filename: string): string {
        return this.removeAccents(filename).replace(
            /!|@|%|\^|\*|\(|\)|\+|=|<|>|\?|\/|,|:|;|'|"|&|#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
            "",
        );
    }

    static regexMatch(keyword: string): string {
        let str = keyword;
        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|=|<|>|\?|\/|,|:|;|'|"|&|#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, "");
        str = this.removeAccents(str);
        str = str.replace(/a|â|ă/g, "[aàáạảãâầấậẩẫăằắặẳẵ]");
        str = str.replace(/e|ê/g, "[eèéẹẻẽêềếệểễ]");
        str = str.replace(/i/g, "[iìíịỉĩ]");
        str = str.replace(/o|ô|ơ/g, "[oòóọỏõôồốộổỗơờớợởỡ]");
        str = str.replace(/u|ư/g, "[uùúụủũưừứựửữ]");
        str = str.replace(/y/g, "[yỳýỵỷỹ]");
        str = str.replace(/d|đ/g, "[dđ]");
        str = str.trim();
        return str;
    }

    static removeAccents(str: string): string {
        if (!str) {
            return "";
        }
        return str
            .toString()
            .trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/đ/g, "d");
    }
}
