import { AccessibleFieldsDocument } from "@casl/mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as bcrypt from "bcryptjs";
import { IsEmail, IsString } from "class-validator";
import { DB_CUA_HANG, DB_USER } from "../../repository/db-collection";
import { SystemRole } from "../common/user.constant";
@Schema({
    collection: DB_USER,
    timestamps: true,
})
export class User {
    /**
     * @example username
     */
    @IsString()
    @Prop({ required: true, unique: true, trim: true, lowercase: true })
    username: string;

    /**
     * @example password
     */
    @IsString()
    @Prop({ required: true })
    password: string;

    /**
     * @example "example@domain.co"
     */
    @IsEmail()
    @Prop({ trim: true, lowercase: true })
    email: string;

    @Prop()
    fullname: string;

    @Prop()
    firstname: string;

    @Prop()
    lastname: string;

    @Prop()
    phonenumber: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre("save", async function save() {
    if (this.isModified("password")) {
        const password = this.get("password");
        this.set("password", password ? await bcrypt.hash(password, 10) : undefined);
    }
    const authorizationProps: string[] = ["password", "email", "systemRole"].filter((prop) => this.isModified(prop));
    if (authorizationProps.length > 0) {
        this.updateOne({
            $inc: { "authorizationVersion.version": 1 },
            $set: {
                "authorizationVersion.updatedAt": new Date(),
                "authorizationVersion.props": authorizationProps,
            },
        }).exec();
    }
});

UserSchema.methods.comparePassword = function comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.get("password"));
};

// UserSchema.methods.hasSystemRole = function hasSystemRole(role: SystemRole): boolean {
//     const userRole: SystemRole = (this as Document).get("systemRole");
//     const extendedRoles = getExtendedSystemRoles(userRole);
//     if (extendedRoles.includes(role)) {
//         return true;
//     }
//     return false;
// };

export interface UserDocument extends User, AccessibleFieldsDocument {
    comparePassword: (password: string) => Promise<boolean>;
    hasSystemRole: (role: SystemRole) => boolean;
}