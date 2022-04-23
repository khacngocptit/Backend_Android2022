import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { cond } from "lodash";
import { ApiCondition, ApiPageableQuery, FetchPageableQuery, QueryCondition } from "src/common/decorator/api.decorator";
import { FetchQueryOption } from "src/common/pipe/fetch-query-option.interface";
import { DanhMucSanPhamService } from "./danh-muc-san-pham.service";
import { CreateDanhMucSanPhamDto } from "./dto/create-danh-muc-san-pham.dto";
import { DanhMucSanPhamCondition } from "./dto/danh-muc-san-pham.condition.dto";

@Controller("category")
@ApiTags("Danh muc san pham")
export class DanhMucSanPhamController {
    constructor(private readonly danhMucSanPhamService: DanhMucSanPhamService) { }

    @Get("all")
    @ApiCondition()
    async getAll(@QueryCondition(DanhMucSanPhamCondition) condition: DanhMucSanPhamCondition) {
        return this.danhMucSanPhamService.get(condition);
    }

    @Get("pageable")
    @ApiCondition()
    @ApiPageableQuery()
    async getPageable(@QueryCondition(DanhMucSanPhamCondition) condition: DanhMucSanPhamCondition, @FetchPageableQuery() option: FetchQueryOption) {
        return this.danhMucSanPhamService.getPaging(condition, option);
    }

    @Get(":id")
    async getById(@Param("id") id: string) {
        return this.danhMucSanPhamService.getOne({ _id: id });
    }

    @Post()
    async create(@Body() body: CreateDanhMucSanPhamDto) {
        return this.danhMucSanPhamService.create(body);
    }

    @Put(":id")
    async update(@Body() body: CreateDanhMucSanPhamDto, @Param("id") id: string) {
        return this.danhMucSanPhamService.updateById(id, body);
    }

    @Delete(":id")
    async delete(@Param("id") id: string) {
        return this.danhMucSanPhamService.deleteById(id);
    }

}
