export interface IModel {
  id: number;
  created: Date;
}

export interface IModelDataInput<TInput> {
  /**
   * Dto input payload
   */
  attributes: TInput;
}

/**
 * Type model đầu vào chung
 */
export interface IModelInput<TInput> {
  /**
   * Dto input payload
   */
  data: IModelDataInput<TInput>;
}

/**
 * Type model kết quả đầu ra chung
 */
export interface IModelResult<TResult> {
  /**
   * boolean cho biết thành công/thất bại
   */
  status: Boolean;
  /**
   * Thông điệp chung
   */
  message?: string | null;
  /**
   * Kết quả chính (object hoặc array)
   */
  data?: TResult | null;
  /**
   * Chuẩn hoá lỗi cho client xử lý
   */
  error?: IModelErrorResult | null;
}

interface IModelErrorResult {
  /**
   * mã lỗi
   */
  code: string;
  /**
   * Thông điệp lỗi
   */
  message: string;
}
