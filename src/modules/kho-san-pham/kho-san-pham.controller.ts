import { Body, Controller, Delete, Get, Param, Post, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ResponseDto } from "src/common/dto/response/response.dto";
import { NhapKhoDto } from "./dto/nhap-kho.dto";
import { PhanKhoDto } from "./dto/phan-kho.dto";
import { KhoSanPhamService } from "./kho-san-pham.service";

@Controller("kho-san-pham")
@ApiTags("kho-san-pham")
export class KhoSanPhamController {
    constructor(
        private readonly khoSanPhamService: KhoSanPhamService
    ) { }

    @Get("all")
    async getAllKhoSanPham() {
        const data = await this.khoSanPhamService.get({});
        return ResponseDto.create(data);
    }

    @Get(":id")
    async getByIdKhoSanPham(@Param("id") id: string) {
        const data = await this.khoSanPhamService.getOne({ _id: id });
        return ResponseDto.create(data);
    }

    /**
     * Thống kê theo cửa hàng: Các 30 ngày trước
     * Thống kê chuỗi cửa hang: Doanh thu của từng cửa hàng trong tháng
     */

    @Post("nhap-kho")
    async nhapKhoSanPham(@Body() body: NhapKhoDto) {
        const data = await this.khoSanPhamService.nhapKho(body);
        return ResponseDto.create(data);
    }

    @Post("phan-kho/:userId")
    async phanKhoSanPham(@Param("userId") userId: string, @Body() body: PhanKhoDto) {
        const data = await this.khoSanPhamService.phanKhoCuaHang(userId, body);
        return ResponseDto.create(data);
    }

    @Post("xuat-kho")
    async xuatKhoSanPham(@Body() body: NhapKhoDto) {
        const data = await this.khoSanPhamService.xuatKho(body);
        return ResponseDto.create(data);
    }

    @Get("doanh-thu/chuoi-cua-hang/user/:userId")
    async doanhThuThang(
        @Param("userId") userId: string,
    ) {
        const data = await this.khoSanPhamService.doanhThu(userId);
        return data;
    }

    @Get("doanh-thu/cua-hang/:storeId/thang/:thang/nam/:nam")
    async doanhThuThangCuaHang(
        @Param("storeId") storeId: string
    ) {
        const data = await this.khoSanPhamService.doanhThuNgayTrongThangStore(storeId);
        return data;
    }

    @Get("doanh-thu/chuoi-cua-hang/:userId")
    async doanhThuChuoiCuaHangTheoNgay(
        @Param("userId") storeId: string
    ) {
        const data = await this.khoSanPhamService.doanhThuChuoiCuaHang(storeId);
        return data;
    }

    @Delete("product/:productId/store/:storeId/user/:userId")
    async deleteChuoiCuaHang(
        @Param("productId") productId: string,
        @Param("storeId") storeId: string,
        @Param("userId") userId: string,
    ) {
        const data = await this.khoSanPhamService.deleteSanPhamTrongCuaHang(productId, storeId, userId);
        return ResponseDto.create(data);
    }
}
