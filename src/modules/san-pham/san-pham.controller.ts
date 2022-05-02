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
    async findById(@Param("id") id: string) {
        const data = await this.sanPhamService.getOne({ _id: id });
        return ResponseDto.create(data);
    }

    @Get("cua-hang/:storeId")
    async findProductOfStore(@Param("storeId") id: string) {
        const data = await this.sanPhamService.get({ storeId: id });
        return ResponseDto.create(data);
    }

    @Get("danh-muc-san-pham/:categoryId")
    async getProductOfCategory(@Param("categoryId") id: string) {
        const data = await this.sanPhamService.get({ listCategoryId: id });
        return ResponseDto.create(data);
    }

    @Post()
    async create(@Body() body: CreateSanPham) {
        const data = await this.sanPhamService.createSanPham(body);
        return ResponseDto.create(data);
    }

    @Put(":id")
    async update(
        @Param("id") id: string,
        @Body() update: CreateSanPham,
    ) {
        const data = await this.sanPhamService.updateSanPham(id, update);
        // Van sua cap nhap kho => Product (thay the)
        return ResponseDto.create(data);
    }

    @Delete(":id")
    async delete(
        @Param("id") id: string
    ) {
        // Xoa het trong kho
        //Xoa cua hang Xoa het cac ban ghi trong kho -> So luong san pham tra ve cua hang cha 
        const data = await this.sanPhamService.deleteSanPham(id);
        return ResponseDto.create(data);
    }
}
