import { API_ROOT } from "@/utils/constants";
import { default as axios } from "axios";

// *Axios trả về kết quả thông qua property là data
// *Ở axios ko cần try/catch
// => Gây ra dư thừa code
// ==> Giải pháp clean code gọn gàn trong axios đó là catch lỗi tập trung tại một nơi bằng cách tận dụng một thứ cực kỳ mạnh mẽ trong axios là Interceptors

/**
 *
 * @param {*} boardId
 * @returns
 */

export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`);
  //
  return response.data;
};