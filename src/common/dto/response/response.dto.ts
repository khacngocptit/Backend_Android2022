export class ResponseDto<T = any> {
    statusCode: number;
    data: T;

    constructor(data: T) {
        this.data = data;
    }

    static create<T>(data: T): ResponseDto<T> {
        return new ResponseDto(data);
    }
}
