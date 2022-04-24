import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { ApiPageableQuery, FetchPageableQuery } from "src/common/decorator/api.decorator";
import { AllowSystemRoles, Authorization } from "src/common/decorator/auth.decorator";
import { ResponseDto } from "src/common/dto/response/response.dto";
import { FetchQueryOption } from "src/common/pipe/fetch-query-option.interface";
import { SystemRole } from "../user/common/user.constant";
import { CreateSanPham } from "./dto/create-san-pham.dto";
import { SanPhamService } from "./san-pham.service";

@Controller("san-pham")
@ApiTags("San pham")
export class SanPhamController {
    constructor(private readonly sanPhamService: SanPhamService) { }

    @Get("all")
    @ApiQuery({ name: "cond", required: false })
    async findAllSanPham(@Query("cond") cond: any) {
        const condition: any = (cond && JSON.parse(cond)) || cond;
        const data = await this.sanPhamService.get(condition);
        return ResponseDto.create(data);
    }

    @Get("pageable")
    @ApiQuery({ name: "cond", required: false })
    @ApiPageableQuery()
    async findPageable(
        @FetchPageableQuery() option: FetchQueryOption,
        @Query("cond") cond: any
    ) {
        const condition: any = (cond && JSON.parse(cond)) || {};
        const data = await this.sanPhamService.getPaging(condition, option);
        return ResponseDto.create(data);
    }

    @Get(":id")
    @ApiQuery({ name: "cond", required: false })
    async findById(@Param("id") id: string, @Query("cond") cond: any) {
        const condition: any = (cond && JSON.parse(cond)) || {};
        Object.assign(condition, {
            _id: id,
        });
        const data = await this.sanPhamService.getOne(condition);
        return ResponseDto.create(data);
    }

    @Post()
    async create(@Body() body: CreateSanPham) {
        const data = await this.sanPhamService.create(body);
        return ResponseDto.create(data);
    }

    @Put(":id")
    async update(
        @Param("id") id: string,
        @Body() update: CreateSanPham,
    ) {
        const data = await this.sanPhamService.updateById(id, update, { new: true });
        return ResponseDto.create(data);
    }

    @Delete(":id")
    async delete(
        @Param("id") id: string
    ) {
        const data = await this.sanPhamService.deleteById(id);
        return ResponseDto.create(data);
    }
}
