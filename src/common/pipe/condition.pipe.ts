import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { ClassConstructor, plainToClass } from "class-transformer";
import { validateOrReject } from "class-validator";

export class ConditionPipe implements PipeTransform {
    constructor(private readonly schema: ClassConstructor<unknown>) {}

    async transform(value: string, metadata: ArgumentMetadata) {
        try {
            const plain = JSON.parse(value ?? "{}");
            const condition: any = plainToClass(this.schema, plain);
            await validateOrReject(condition, {
                whitelist: true,
                stopAtFirstError: true,
            });
            return condition;
        } catch (err) {
            throw new BadRequestException("Invalid condition");
        }
    }
}
