import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { Document } from "mongoose";
import { SystemRole } from "../../user/common/user.constant";

@Schema()
export class Author {
    @IsString()
    @Prop()
    username: string;

    @IsString()
    @Prop()
    firstname: string;

    @IsString()
    @Prop()
    lastname: string;

    @IsString()
    @Prop()
    email: string;

    @IsEnum(SystemRole)
    @Prop({ type: String, enum: Object.values(SystemRole) })
    @IsOptional()
    systemRole?: SystemRole;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
export type AuthorDocument = Author & Document;
