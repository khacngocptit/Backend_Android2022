import { Body, Controller, Get, Param, Post, Res } from "@nestjs/common";
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

    @Post("phan-kho/:storeId")
    async phanKhoSanPham(@Param("storeId") storeId: string, @Body() body: PhanKhoDto) {

        const data = await this.khoSanPhamService.phanKhoCuaHang(storeId, body);
        return ResponseDto.create(data);
    }

    @Post("xuat-kho")
    async xuatKhoSanPham(@Body() body: NhapKhoDto) {
        const data = await this.khoSanPhamService.xuatKho(body);
        return ResponseDto.create(data);
    }

    @Get("doanh-thu/chuoi-cua-hang/:userId/thang/:thang/nam/:nam")
    async doanhThuThang(
        @Param("userId") userId: string,
        @Param("thang") thang: string,
        @Param("nam") nam: string
    ) {
        const data = await this.khoSanPhamService.doanhThu(userId, +thang, +nam);
        return ResponseDto.create(data);
    }

    @Get("doanh-thu/cua-hang/:storeId/thang/:thang/nam/:nam")
    async doanhThuThangCuaHang(
        @Param("storeId") storeId: string
    ) {
        const data = await this.khoSanPhamService.doanhThuNgayTrongThangStore(storeId);
        return ResponseDto.create(data);
    }

    @Get("doanh-thu/chuoi-cua-hang/:storeId")
    async doanhThuChuoiCuaHangTheoNgay(
        @Param("storeId") storeId: string
    ) {
        const data = await this.khoSanPhamService.doanhThuChuoiCuaHang(storeId);
        return ResponseDto.create(data);
    }
}
