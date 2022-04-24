import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { ApiPageableQuery, FetchPageableQuery } from "src/common/decorator/api.decorator";
import { AllowSystemRoles, Authorization } from "src/common/decorator/auth.decorator";
import { ResponseDto } from "src/common/dto/response/response.dto";
import { FetchQueryOption } from "src/common/pipe/fetch-query-option.interface";
import { SystemRole } from "../user/common/user.constant";
import { CuaHangService } from "./cua-hang.service";
import { CreateCuaHangDto } from "./dto/create-cua-hang.dto";

@Controller("cua-hang")
@ApiTags("Cua hang")
export class CuaHangController {
    constructor(private readonly cuaHangService: CuaHangService) { }
    @Get("all")
    @ApiQuery({ name: "cond", required: false })
    async getAllCuaHang(@Query("cond") cond: any) {
        const condition: any = cond & JSON.parse(cond) || {};
        const data = await this.cuaHangService.get(condition);
        return ResponseDto.create(data);
    }

    @Get("pageable")
    @ApiQuery({ name: "cond", required: false })
    @ApiPageableQuery()
    async getPageable(
        @FetchPageableQuery() option: FetchQueryOption,
        @Query("cond") cond: any
    ) {
        const condition: any = (cond && JSON.parse(cond)) || {};
        const data = await this.cuaHangService.getPaging(condition, option);
        return ResponseDto.create(data);
    }

    @Get("user/:userId")
    async getStoreUser(
        @Param() userId: string,
    ) {
        const data = await this.cuaHangService.get({ userId: userId });
        return ResponseDto.create(data);
    }

    @Get(":id")
    async getByIdCuaHang(@Param("id") id: string) {
        const data = await this.cuaHangService.getOne({ _id: id });
        return ResponseDto.create(data);
    }

    @Post()
    async create(@Body() body: CreateCuaHangDto) {
        const data = await this.cuaHangService.create(body);
        return ResponseDto.create(data);
    }

    @Put(":id")
    async update(@Param("id") id: string, @Body() body: CreateCuaHangDto) {
        const data = await this.cuaHangService.updateById(id, body, { new: true });
        return ResponseDto.create(data);
    }

    @Delete(":id")
    async delete(@Param("id") id: string) {
        const data = await this.cuaHangService.deleteById(id);
        return ResponseDto.create(data);
    }
}
